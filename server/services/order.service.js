/* 
  Purpose: Core order transaction logic | Module: services 
  Owner: Adam | Created: 3 Sep 2026 
  Notes: Wraps payment + order + order_items + subscription in a DB transaction
*/

const pool = require('../config/db');
const ApiError = require('../utils/apiError');
const paymentService = require('./payment.service');
const qrService = require('./qr.service');
const OrderModel = require('../models/Order.model');
const OrderItemModel = require('../models/OrderItem.model');
const SubscriptionModel = require('../models/Subscription.model');

const orderService = {
  /**
   * Create a one-off or custom order (no subscription)
   * @param {Object} data - { userId, items, totalAmount, cardNumber, pickupPod }
   */
  createOneOffOrder: async ({ userId, items, totalAmount, cardNumber, pickupPod }) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Process payment
      const paymentResult = await paymentService.processPayment({ cardNumber, amount: totalAmount });

      // 2. Generate QR token
      const qrToken = qrService.generateToken();

      // 3. Insert order (without subscription_id)
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
      });

      // 4. Insert each order item
      for (const item of items) {
        await OrderItemModel.create(orderId, item.productId, item.quantity, item.unitPrice);
      }

      await connection.commit();
      return { orderId, qrToken, txnRef: paymentResult.txnRef };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Create a subscription order (recurring box)
   * @param {Object} data - { userId, productId, items, totalAmount, cardNumber, pickupPod }
   */
  createSubscriptionOrder: async ({ userId, productId, items, totalAmount, cardNumber, pickupPod }) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Process payment
      const paymentResult = await paymentService.processPayment({ cardNumber, amount: totalAmount });

      // 2. Generate QR token
      const qrToken = qrService.generateToken();

      // 3. Create a new subscription if none exists for this user
      let subscriptionId;
      const existingSub = await SubscriptionModel.findByUserId(userId);
      if (!existingSub) {
        // Create new subscription (next charge = 7 days from now)
        const nextChargeDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        subscriptionId = await SubscriptionModel.create(userId, productId, pickupPod, nextChargeDate);
      } else {
        subscriptionId = existingSub.id;
      }

      // 4. Insert order (linked to subscription)
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
      });

      // 5. Insert order items
      for (const item of items) {
        await OrderItemModel.create(orderId, item.productId, item.quantity, item.unitPrice);
      }

      // 6. Increment loyalty for the subscription
      await SubscriptionModel.incrementBoxesCompleted(subscriptionId);

      await connection.commit();
      return { orderId, subscriptionId, qrToken, txnRef: paymentResult.txnRef };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Get a single order with its items (for confirmation page)
   */
  getOrderById: async (orderId) => {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new ApiError(404, 'Order not found');
    const items = await OrderItemModel.findByOrderId(orderId);
    return { ...order, items };
  },

  /**
   * Get all orders for a user (order history)
   */
  getOrdersByUser: async (userId) => {
    const orders = await OrderModel.findByUserId(userId);
    // For each order, fetch its items (optional – could be heavy but fine for demo)
    const withItems = [];
    for (const order of orders) {
      const items = await OrderItemModel.findByOrderId(order.id);
      withItems.push({ ...order, items });
    }
    return withItems;
  }
};

module.exports = orderService;