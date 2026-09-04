/* 
  Purpose: Order controller | Module: controllers 
  Owner: Adam | Created: 4 Sep 2026 
  Notes: Enforces authentication, payload presence, and user ownership on orders.
*/

const orderService = require('../services/order.service');
const ApiError = require('../utils/apiError');

const orderController = {
  /**
   * Create a standard one-off order
   */
  createOneOffOrder: async (req, res, next) => {
    try {
      const { items, cardNumber, pickupPod } = req.body;
      const userId = req.userId; // Provided by authMiddleware

      if (!items || !cardNumber || !pickupPod) {
        throw new ApiError(400, 'Missing required fields: items, cardNumber, pickupPod');
      }

      const result = await orderService.createOneOffOrder({
        userId, items, cardNumber, pickupPod
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId: result.orderId,
        totalAmount: result.totalAmount,
        qrToken: result.qrToken,
        txnRef: result.txnRef
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a custom box builder order (order_type = 'custom')
   */
  createCustomOrder: async (req, res, next) => {
    try {
      const { items, cardNumber, pickupPod } = req.body;
      const userId = req.userId;

      if (!items || !cardNumber || !pickupPod) {
        throw new ApiError(400, 'Missing required fields: items, cardNumber, pickupPod');
      }

      const result = await orderService.createCustomOrder({
        userId, items, cardNumber, pickupPod
      });

      res.status(201).json({
        success: true,
        message: 'Custom box order created successfully',
        orderId: result.orderId,
        totalAmount: result.totalAmount,
        qrToken: result.qrToken,
        txnRef: result.txnRef
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a subscription order (recurring box)
   */
  createSubscriptionOrder: async (req, res, next) => {
    try {
      const { productId, items, cardNumber, pickupPod } = req.body;
      const userId = req.userId;

      if (!productId || !items || !cardNumber || !pickupPod) {
        throw new ApiError(400, 'Missing required fields: productId, items, cardNumber, pickupPod');
      }

      const result = await orderService.createSubscriptionOrder({
        userId, productId, items, cardNumber, pickupPod
      });

      res.status(201).json({
        success: true,
        message: 'Subscription order created successfully',
        orderId: result.orderId,
        subscriptionId: result.subscriptionId,
        totalAmount: result.totalAmount,
        qrToken: result.qrToken,
        txnRef: result.txnRef
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a single order by ID with ownership verification
   */
  getOrderById: async (req, res, next) => {
    try {
      const orderId = Number(req.params.id);
      if (!orderId || isNaN(orderId)) {
        throw new ApiError(400, 'Invalid order ID');
      }

      const order = await orderService.getOrderById(orderId, req.userId);
      res.json({ success: true, order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all orders for a user with ownership verification
   */
  getOrdersByUser: async (req, res, next) => {
    try {
      const requestedUserId = Number(req.params.userId);
      if (!requestedUserId || isNaN(requestedUserId)) {
        throw new ApiError(400, 'Invalid user ID');
      }

      const orders = await orderService.getOrdersByUser(requestedUserId, req.userId);
      res.json({ success: true, orders });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;