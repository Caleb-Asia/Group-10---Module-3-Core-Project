/* 
  Purpose: Core order transaction logic | Module: services 
  Owner: Adam | Created: 3 Sep 2026 
  Notes: Wraps validation, server-side pricing, payment simulation, and order creation in a single MySQL transaction.
*/

const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const paymentService = require('./payment.service');
const payfastService = require('./payfast.service');
const OrderModel = require('../models/Order.model');
const OrderItemModel = require('../models/OrderItem.model');
const SubscriptionModel = require('../models/Subscription.model');
const { APPROVED_PICKUP_PODS, isApprovedPickupPod } = require('../utils/validators');

function validatePickupPod(pickupPod) {
  if (!isApprovedPickupPod(pickupPod)) {
    throw new ApiError(400, `pickupPod must be one of: ${APPROVED_PICKUP_PODS.join(', ')}`);
  }
}

/**
 * Validates requested items, verifies they exist and are active,
 * and authoritative calculates item subtotals and order total from database prices.
 * @param {Array} items - [{ productId, quantity }]
 * @param {Object} conn - MySQL transaction connection
 * @returns {Promise<{ calculatedItems: Array, totalAmount: number }>}
 */
async function validateAndCalculateOrderItems(items, conn, allowedCategories = null) {
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
    'SELECT id, name, price, category, is_active FROM products WHERE id IN (?)',
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
    if (allowedCategories && !allowedCategories.includes(product.category)) {
      throw new ApiError(400, `Product "${product.name}" has category "${product.category}" and cannot be used in a custom box`);
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

/**
 * Resolves the single subscription box from the database. The client never
 * supplies the subscription line-item price or quantity.
 */
async function getSubscriptionBoxItem(productId, conn) {
  const numericProductId = Number(productId);
  if (!numericProductId || !Number.isInteger(numericProductId)) {
    throw new ApiError(400, 'Invalid subscription box product ID');
  }

  const [products] = await conn.execute(
    'SELECT id, name, price, category, is_active FROM products WHERE id = ?',
    [numericProductId]
  );
  const product = products[0];

  if (!product) {
    throw new ApiError(404, 'Subscription box product not found');
  }
  if (!product.is_active) {
    throw new ApiError(400, 'Selected subscription box product is inactive');
  }
  if (product.category !== 'box') {
    throw new ApiError(400, 'Subscription products must have category "box"');
  }

  const unitPrice = Number(product.price);
  return {
    calculatedItem: {
      productId: product.id,
      quantity: 1,
      unitPrice: unitPrice.toFixed(2)
    },
    totalAmount: Math.round(unitPrice * 100) / 100
  };
}

const orderService = {
  /**
   * Create a one-off order (order_type = 'one-off')
   * @param {Object} data - { userId, items, cardNumber, pickupPod }
   */
  createOneOffOrder: async ({ userId, items, cardNumber, pickupPod }) => {
    validatePickupPod(pickupPod);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Authoritative server-side price calculation & product validation
      const { calculatedItems, totalAmount } = await validateAndCalculateOrderItems(items, connection);

      // 2. Process payment (if declined, throws ApiError 402; order is never created)
      const paymentResult = await paymentService.processPayment({ cardNumber, amount: totalAmount });

      // 3. Insert order using the active transaction connection
      const orderId = await OrderModel.create({
        user_id: userId,
        subscription_id: null,
        order_type: 'one-off',
        total_amount: totalAmount,
        payment_status: 'paid',
        payment_txn_ref: paymentResult.txnRef,
        pickup_pod: pickupPod,
        status: 'confirmed'
      }, connection);

      // 4. Insert order items using the active transaction connection
      for (const item of calculatedItems) {
        await OrderItemModel.create(orderId, item.productId, item.quantity, item.unitPrice, connection);
      }

      await connection.commit();
      return { orderId, txnRef: paymentResult.txnRef, totalAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  initiatePayfastOrder: async ({ userId, items, pickupPod, orderType, nameFirst, email, itemName }) => {
    validatePickupPod(pickupPod);
    const connection = await pool.getConnection();
    let calculatedItems;
    let totalAmount;
    try {
      await connection.beginTransaction();
      const result = await validateAndCalculateOrderItems(items, connection, orderType === 'custom' ? ['meal', 'snack'] : null);
      calculatedItems = result.calculatedItems;
      totalAmount = result.totalAmount;
      await connection.rollback();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    const { redirectUrl, ref } = await payfastService.initiatePayment({ amount: totalAmount, itemName: itemName || 'FoodBoxx Order', orderData: { userId, items: calculatedItems, pickupPod, orderType, totalAmount, nameFirst: nameFirst || 'Customer', email: email || 'test@test.com' } });
    return { redirectUrl, ref, totalAmount };
  },

  createOrderFromPayfast: async ({ userId, items, pickupPod, orderType, totalAmount, txnRef }) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      let subscriptionId = null;
      if (orderType === 'subscription') {
        const existingSub = await SubscriptionModel.findByUserId(userId, connection);
        if (!existingSub || existingSub.status === 'cancelled') {
          const nextChargeDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
          subscriptionId = await SubscriptionModel.create(userId, items[0].productId, pickupPod, nextChargeDate, connection);
        } else subscriptionId = existingSub.id;
        await SubscriptionModel.incrementBoxesCompleted(subscriptionId, connection);
        const subscription = await SubscriptionModel.findById(subscriptionId, connection);
        if (Number(subscription.boxes_completed) % 8 === 0) totalAmount = 0;
      }
      const orderId = await OrderModel.create({ user_id: userId, subscription_id: subscriptionId, order_type: orderType, total_amount: totalAmount, payment_status: 'paid', payment_txn_ref: txnRef, pickup_pod: pickupPod, status: 'confirmed' }, connection);
      for (const item of items) await OrderItemModel.create(orderId, item.productId, item.quantity, item.unitPrice, connection);
      await connection.commit();
      return { orderId, txnRef, totalAmount };
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
    validatePickupPod(pickupPod);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Authoritative server-side price calculation & product validation
      const { calculatedItems, totalAmount } = await validateAndCalculateOrderItems(items, connection, ['meal', 'snack']);

      // 2. Process payment (if declined, throws ApiError 402; order is never created)
      const paymentResult = await paymentService.processPayment({ cardNumber, amount: totalAmount });

      // 3. Insert order with order_type = 'custom' using transaction connection
      const orderId = await OrderModel.create({
        user_id: userId,
        subscription_id: null,
        order_type: 'custom',
        total_amount: totalAmount,
        payment_status: 'paid',
        payment_txn_ref: paymentResult.txnRef,
        pickup_pod: pickupPod,
        status: 'confirmed'
      }, connection);

      // 4. Insert order items using transaction connection
      for (const item of calculatedItems) {
        await OrderItemModel.create(orderId, item.productId, item.quantity, item.unitPrice, connection);
      }

      await connection.commit();
      return { orderId, txnRef: paymentResult.txnRef, totalAmount };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Create a subscription order (recurring box)
   * @param {Object} data - { userId, productId, cardNumber, pickupPod }
   */
  createSubscriptionOrder: async ({ userId, productId, cardNumber, pickupPod }) => {
    validatePickupPod(pickupPod);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Derive the one subscription line item and price from the database.
      const { calculatedItem, totalAmount } = await getSubscriptionBoxItem(productId, connection);

      // 2. Find or create the subscription inside the same transaction.
      let subscriptionId;
      const existingSub = await SubscriptionModel.findByUserId(userId, connection);

      // CRITICAL FIX: If no existing subscription OR if existing subscription is cancelled,
      // create a brand new subscription. Never resurrect a cancelled subscription!
      if (!existingSub || existingSub.status === 'cancelled') {
        const nextChargeDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
        subscriptionId = await SubscriptionModel.create(userId, productId, pickupPod, nextChargeDate, connection);
      } else {
        if (existingSub.status === 'paused') {
          throw new ApiError(400, 'Resume your subscription before placing a new order');
        }

        subscriptionId = existingSub.id;
        if (existingSub.product_id !== productId || existingSub.pickup_pod !== pickupPod) {
          await SubscriptionModel.updateSubscription(subscriptionId, {
            product_id: productId,
            pickup_pod: pickupPod
          }, connection);
        }
        const nextChargeDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
        await SubscriptionModel.updateSubscription(subscriptionId, { next_charge_date: nextChargeDate }, connection);
      }

      // 3. Increment first so every eighth completed box receives the loyalty reward.
      await SubscriptionModel.incrementBoxesCompleted(subscriptionId, connection);
      const subscription = await SubscriptionModel.findById(subscriptionId, connection);
      const loyaltyReward = Number(subscription.boxes_completed) % 8 === 0;
      const chargedAmount = loyaltyReward ? 0 : totalAmount;

      // Free loyalty orders do not invoke the payment simulator.
      const paymentResult = loyaltyReward
        ? { txnRef: 'FBX-LOYALTY-FREE' }
        : await paymentService.processPayment({ cardNumber, amount: chargedAmount });

      // 4. Persist the first or recurring subscription order.
      const orderId = await OrderModel.create({
        user_id: userId,
        subscription_id: subscriptionId,
        order_type: 'subscription',
        total_amount: chargedAmount,
        payment_status: 'paid',
        payment_txn_ref: paymentResult.txnRef,
        pickup_pod: pickupPod,
        status: 'confirmed'
      }, connection);

      // 5. Persist exactly one server-derived subscription box line item.
      await OrderItemModel.create(
        orderId,
        calculatedItem.productId,
        calculatedItem.quantity,
        calculatedItem.unitPrice,
        connection
      );

      await connection.commit();
      return {
        orderId,
        subscriptionId,
        txnRef: paymentResult.txnRef,
        totalAmount: chargedAmount,
        loyaltyReward
      };
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
    const orderIds = orders.map(order => order.id);
    const items = await OrderItemModel.findByOrderIds(orderIds);
    const itemsByOrderId = new Map();
    for (const item of items) {
      const key = String(item.order_id);
      if (!itemsByOrderId.has(key)) itemsByOrderId.set(key, []);
      itemsByOrderId.get(key).push(item);
    }

    return orders.map(order => ({
      ...order,
      items: itemsByOrderId.get(String(order.id)) || []
    }));
  }
};

module.exports = orderService;
