/* 
  Purpose: Core order transaction logic | Module: services 
  Owner: Adam | Created: 3 Sep 2026 
  Notes: Wraps validation, server-side pricing, payment simulation, and order creation in a single MySQL transaction.
*/

const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const paymentService = require('./payment.service');
const qrService = require('./qr.service');
const OrderModel = require('../models/Order.model');
const OrderItemModel = require('../models/OrderItem.model');
const SubscriptionModel = require('../models/Subscription.model');

/**
 * Validates requested items, verifies they exist and are active,
 * and authoritative calculates item subtotals and order total from database prices.
 * @param {Array} items - [{ productId, quantity }]
 * @param {Object} conn - MySQL transaction connection
 * @returns {Promise<{ calculatedItems: Array, totalAmount: number }>}
 */
async function validateAndCalculateOrderItems(items, conn) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  // Extract and validate product IDs
  const productIds = items.map(item => Number(item.productId)).filter(id => !isNaN(id) && id > 0);
  if (productIds.length !== items.length) {
    throw new ApiError(400, 'Invalid productId provided in items');
  }

  // Fetch authoritative products from the database using the transaction connection
  const [dbProducts] = await conn.query(
    'SELECT id, name, price, is_active FROM products WHERE id IN (?)',
    [productIds]
  );

  const productMap = new Map();
  for (const product of dbProducts) {
    productMap.set(Number(product.id), product);
  }

  let totalAmount = 0;
  const calculatedItems = [];

  for (const item of items) {
    const pId = Number(item.productId);
    const qty = Number(item.quantity);

    if (!qty || qty <= 0 || !Number.isInteger(qty)) {
      throw new ApiError(400, `Invalid quantity for product ${pId}. Must be a positive integer.`);
    }

    const product = productMap.get(pId);
    if (!product) {
      throw new ApiError(404, `Product with ID ${pId} not found`);
    }

    if (!product.is_active) {
      throw new ApiError(400, `Product "${product.name}" is currently inactive and cannot be ordered`);
    }

    const unitPrice = parseFloat(product.price);
    const itemSubtotal = unitPrice * qty;
    totalAmount += itemSubtotal;

    calculatedItems.push({
      productId: pId,
      quantity: qty,
      unitPrice: unitPrice.toFixed(2)
    });
  }

  // Round total to 2 decimal places
  totalAmount = Math.round(totalAmount * 100) / 100;

  return { calculatedItems, totalAmount };
}

const orderService = {
  /**
   * Create a one-off order (order_type = 'one-off')
   * @param {Object} data - { userId, items, cardNumber, pickupPod }
   */
  createOneOffOrder: async ({ userId, items, cardNumber, pickupPod }) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Authoritative server-side price calculation & product validation
      const { calculatedItems, totalAmount } = await validateAndCalculateOrderItems(items, connection);

      // 2. Process payment (if declined, throws ApiError 402; order is never created)
      const paymentResult = await paymentService.processPayment({ cardNumber, amount: totalAmount });

      // 3. Generate secure QR token
      const qrToken = qrService.generateToken();

      // 4. Insert order using the active transaction connection
      const orderId = await OrderModel.create({
        user_id: userId,
        subscription_id: null,
        order_type: 'one-off',
        total_amount: totalAmount,
        payment_status: 'paid',
        payment_txn_ref: paymentResult.txnRef,
        qr_token: qrToken,
        pickup_pod: pickupPod,
        status: 'confirmed'
      }, connection);

      // 5. Insert order items using the active transaction connection
      for (const item of calculatedItems) {
        await OrderItemModel.create(orderId, item.productId, item.quantity, item.unitPrice, connection);
      }

      await connection.commit();
      return { orderId, qrToken, txnRef: paymentResult.txnRef, totalAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Create a custom box builder order (order_type = 'custom')
   * @param {Object} data - { userId, items, cardNumber, pickupPod }
   */
  createCustomOrder: async ({ userId, items, cardNumber, pickupPod }) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Authoritative server-side price calculation & product validation
      const { calculatedItems, totalAmount } = await validateAndCalculateOrderItems(items, connection);

      // 2. Process payment (if declined, throws ApiError 402; order is never created)
      const paymentResult = await paymentService.processPayment({ cardNumber, amount: totalAmount });

      // 3. Generate secure QR token
      const qrToken = qrService.generateToken();

      // 4. Insert order with order_type = 'custom' using transaction connection
      const orderId = await OrderModel.create({
        user_id: userId,
        subscription_id: null,
        order_type: 'custom',
        total_amount: totalAmount,
        payment_status: 'paid',
        payment_txn_ref: paymentResult.txnRef,
        qr_token: qrToken,
        pickup_pod: pickupPod,
        status: 'confirmed'
      }, connection);

      // 5. Insert order items using transaction connection
      for (const item of calculatedItems) {
        await OrderItemModel.create(orderId, item.productId, item.quantity, item.unitPrice, connection);
      }

      await connection.commit();
      return { orderId, qrToken, txnRef: paymentResult.txnRef, totalAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Create a subscription order (recurring box)
   * @param {Object} data - { userId, productId, items, cardNumber, pickupPod }
   */
  createSubscriptionOrder: async ({ userId, productId, items, cardNumber, pickupPod }) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Authoritative server-side price calculation & product validation
      const { calculatedItems, totalAmount } = await validateAndCalculateOrderItems(items, connection);

      // Validate that the box productId exists and is active
      const [boxProducts] = await connection.query(
        'SELECT id, is_active FROM products WHERE id = ?',
        [productId]
      );
      if (!boxProducts || boxProducts.length === 0) {
        throw new ApiError(404, 'Subscription box product not found');
      }
      if (!boxProducts[0].is_active) {
        throw new ApiError(400, 'Selected subscription box product is inactive');
      }

      // 2. Process payment before creating any database records
      const paymentResult = await paymentService.processPayment({ cardNumber, amount: totalAmount });

      // 3. Generate secure QR token
      const qrToken = qrService.generateToken();

      // 4. Check for existing subscription for this user using transaction connection
      let subscriptionId;
      const existingSub = await SubscriptionModel.findByUserId(userId, connection);

      // CRITICAL FIX: If no existing subscription OR if existing subscription is cancelled,
      // create a brand new subscription. Never resurrect a cancelled subscription!
      if (!existingSub || existingSub.status === 'cancelled') {
        const nextChargeDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        subscriptionId = await SubscriptionModel.create(userId, productId, pickupPod, nextChargeDate, connection);
      } else {
        subscriptionId = existingSub.id;
      }

      // 5. Insert order linked to subscription
      const orderId = await OrderModel.create({
        user_id: userId,
        subscription_id: subscriptionId,
        order_type: 'subscription',
        total_amount: totalAmount,
        payment_status: 'paid',
        payment_txn_ref: paymentResult.txnRef,
        qr_token: qrToken,
        pickup_pod: pickupPod,
        status: 'confirmed'
      }, connection);

      // 6. Insert order items
      for (const item of calculatedItems) {
        await OrderItemModel.create(orderId, item.productId, item.quantity, item.unitPrice, connection);
      }

      // 7. Increment loyalty box count for subscription
      await SubscriptionModel.incrementBoxesCompleted(subscriptionId, connection);

      await connection.commit();
      return { orderId, subscriptionId, qrToken, txnRef: paymentResult.txnRef, totalAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Get a single order with its items, verifying ownership
   * @param {number} orderId - Order ID
   * @param {number} userId - Authenticated User ID
   */
  getOrderById: async (orderId, userId) => {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // Enforce ownership: user can only view their own order
    if (order.user_id !== userId) {
      throw new ApiError(403, 'Forbidden: You do not have access to this order');
    }

    const items = await OrderItemModel.findByOrderId(orderId);
    return { ...order, items };
  },

  /**
   * Get all orders for a user (order history), verifying ownership
   * @param {number} requestedUserId - User ID from route params
   * @param {number} authUserId - Authenticated User ID
   */
  getOrdersByUser: async (requestedUserId, authUserId) => {
    if (Number(requestedUserId) !== Number(authUserId)) {
      throw new ApiError(403, 'Forbidden: You cannot access order history for another user');
    }

    const orders = await OrderModel.findByUserId(requestedUserId);
    const withItems = [];
    for (const order of orders) {
      const items = await OrderItemModel.findByOrderId(order.id);
      withItems.push({ ...order, items });
    }
    return withItems;
  }
};

module.exports = orderService;