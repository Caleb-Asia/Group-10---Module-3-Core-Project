/* 
  Purpose: Subscription controller | Module: controllers 
  Owner: Adam | Created: 4 Sep 2026 
  Notes: Manages subscription lifecycle transitions with strict authorization and state validation.
*/

const SubscriptionModel = require('../models/Subscription.model');
const ApiError = require('../utils/apiError');
const orderService = require('../services/order.service');

/**
 * Helper to fetch subscription and verify it belongs to req.userId
 */
async function getAuthorizedSubscription(subscriptionId, authUserId) {
  const numericId = Number(subscriptionId);
  if (!numericId || isNaN(numericId)) {
    throw new ApiError(400, 'Invalid subscription ID');
  }

  const subscription = await SubscriptionModel.findById(numericId);
  if (!subscription) {
    throw new ApiError(404, 'Subscription not found');
  }

  if (subscription.user_id !== authUserId) {
    throw new ApiError(403, 'Forbidden: You do not have access to this subscription');
  }

  return subscription;
}

const subscriptionController = {
  /**
   * Create a subscription and its first paid order.
   */
  createSubscription: async (req, res, next) => {
    try {
      const { productId, pickupPod, cardNumber } = req.body;

      if (!productId || !pickupPod || !cardNumber) {
        throw new ApiError(400, 'Missing required fields: productId, pickupPod, cardNumber');
      }

      const result = await orderService.createSubscriptionOrder({
        userId: req.userId,
        productId,
        pickupPod,
        cardNumber
      });

      res.status(201).json({
        success: true,
        subscriptionId: result.subscriptionId,
        orderId: result.orderId,
        txnRef: result.txnRef,
        totalAmount: result.totalAmount,
        ...(result.loyaltyReward ? { loyaltyReward: true } : {})
      });
    } catch (error) {
      next(error);
    }
  },

  /** Update the box and/or pickup pod on an owned active or paused subscription. */
  updateSubscription: async (req, res, next) => {
    try {
      const subscription = await getAuthorizedSubscription(req.params.id, req.userId);
      if (!['active', 'paused'].includes(subscription.status)) {
        throw new ApiError(400, 'Only active or paused subscriptions can be updated');
      }

      const { productId, pickupPod } = req.body;
      const updates = {};
      if (productId !== undefined) {
        if (!await SubscriptionModel.findActiveBoxProduct(productId)) {
          throw new ApiError(400, 'productId must refer to an active product with category "box"');
        }
        updates.product_id = productId;
      }

      if (pickupPod !== undefined) {
        updates.pickup_pod = pickupPod;
      }

      const updatedSubscription = await SubscriptionModel.updateSubscription(subscription.id, updates);
      res.json({ success: true, subscription: updatedSubscription });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get subscription for a user (latest)
   */
  getSubscriptionByUser: async (req, res, next) => {
    try {
      const requestedUserId = Number(req.params.userId);
      if (!requestedUserId || isNaN(requestedUserId)) {
        throw new ApiError(400, 'Invalid user ID');
      }

      // Enforce ownership: users can only view their own subscription
      if (requestedUserId !== req.userId) {
        throw new ApiError(403, 'Forbidden: You cannot access subscriptions for another user');
      }

      const subscription = await SubscriptionModel.findByUserId(requestedUserId);
      if (!subscription) {
        throw new ApiError(404, 'No subscription found for this user');
      }

      res.json({ success: true, subscription });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Pause an active subscription
   */
  pauseSubscription: async (req, res, next) => {
    try {
      const subscription = await getAuthorizedSubscription(req.params.id, req.userId);

      // Validate state: only active subscriptions can be paused
      if (subscription.status === 'cancelled') {
        throw new ApiError(400, 'Cannot pause a cancelled subscription');
      }
      if (subscription.status === 'paused') {
        throw new ApiError(400, 'Subscription is already paused');
      }

      const affected = await SubscriptionModel.updateStatus(subscription.id, 'paused');
      if (affected === 0) {
        throw new ApiError(404, 'Subscription could not be updated');
      }

      res.json({ success: true, message: 'Subscription paused' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Resume a paused subscription
   */
  resumeSubscription: async (req, res, next) => {
    try {
      const subscription = await getAuthorizedSubscription(req.params.id, req.userId);

      // Validate state: only paused subscriptions can be resumed; cancelled subscriptions can never resume
      if (subscription.status === 'cancelled') {
        throw new ApiError(400, 'Cannot resume a cancelled subscription');
      }
      if (subscription.status === 'active') {
        throw new ApiError(400, 'Subscription is already active');
      }

      const affected = await SubscriptionModel.updateStatus(subscription.id, 'active');
      if (affected === 0) {
        throw new ApiError(404, 'Subscription could not be updated');
      }

      res.json({ success: true, message: 'Subscription resumed' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Skip a week (advances next_charge_date by +7 days; allowed only if active)
   */
  skipSubscription: async (req, res, next) => {
    try {
      const subscription = await getAuthorizedSubscription(req.params.id, req.userId);

      // Validate state: can only skip when active
      if (subscription.status !== 'active') {
        throw new ApiError(400, `Cannot skip subscription when status is ${subscription.status}. Must be active.`);
      }

      const affected = await SubscriptionModel.skipNextCharge(subscription.id);
      if (affected === 0) {
        throw new ApiError(404, 'Subscription could not be updated');
      }

      res.json({ success: true, message: 'Subscription skipped for this week' });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cancel a subscription
   */
  cancelSubscription: async (req, res, next) => {
    try {
      const subscription = await getAuthorizedSubscription(req.params.id, req.userId);

      if (subscription.status === 'cancelled') {
        throw new ApiError(400, 'Subscription is already cancelled');
      }

      const affected = await SubscriptionModel.updateStatus(subscription.id, 'cancelled');
      if (affected === 0) {
        throw new ApiError(404, 'Subscription could not be updated');
      }

      res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = subscriptionController;
