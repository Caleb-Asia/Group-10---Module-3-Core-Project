/* 
  Purpose: Order controller | Module: controllers 
  Owner: Adam | Created: 4 Sep 2026 
*/

const orderService = require('../services/order.service');
const ApiError = require('../utils/apiError');

const orderController = {
  // Create a one-off or custom order (no subscription)
  createOneOffOrder: async (req, res, next) => {
    try {
      const { items, totalAmount, cardNumber, pickupPod } = req.body;
      const userId = req.userId; // from auth middleware

      if (!items || !totalAmount || !cardNumber || !pickupPod) {
        throw new ApiError(400, 'Missing required fields: items, totalAmount, cardNumber, pickupPod');
      }

      const result = await orderService.createOneOffOrder({
        userId, items, totalAmount, cardNumber, pickupPod
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId: result.orderId,
        qrToken: result.qrToken,
        txnRef: result.txnRef
      });
    } catch (error) {
      next(error);
    }
  },

  // Create a subscription order (recurring box)
  createSubscriptionOrder: async (req, res, next) => {
    try {
      const { productId, items, totalAmount, cardNumber, pickupPod } = req.body;
      const userId = req.userId;

      if (!productId || !items || !totalAmount || !cardNumber || !pickupPod) {
        throw new ApiError(400, 'Missing required fields: productId, items, totalAmount, cardNumber, pickupPod');
      }

      const result = await orderService.createSubscriptionOrder({
        userId, productId, items, totalAmount, cardNumber, pickupPod
      });

      res.status(201).json({
        success: true,
        message: 'Subscription order created successfully',
        orderId: result.orderId,
        subscriptionId: result.subscriptionId,
        qrToken: result.qrToken,
        txnRef: result.txnRef
      });
    } catch (error) {
      next(error);
    }
  },

  // Get a single order by ID (for confirmation page)
  getOrderById: async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const order = await orderService.getOrderById(orderId);
      res.json({ success: true, order });
    } catch (error) {
      next(error);
    }
  },

  // Get all orders for a user (order history)
  getOrdersByUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const orders = await orderService.getOrdersByUser(userId);
      res.json({ success: true, orders });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;