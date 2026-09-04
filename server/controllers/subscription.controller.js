/* 
  Purpose: Subscription controller | Module: controllers 
  Owner: Adam | Created: 4 Sep 2026 
*/

const SubscriptionModel = require('../models/Subscription.model');
const ApiError = require('../utils/apiError');

const subscriptionController = {
  // Get subscription for a user (latest)
  getSubscriptionByUser: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const subscription = await SubscriptionModel.findByUserId(userId);
      if (!subscription) {
        throw new ApiError(404, 'No subscription found for this user');
      }
      res.json({ success: true, subscription });
    } catch (error) {
      next(error);
    }
  },

  // Pause a subscription
  pauseSubscription: async (req, res, next) => {
    try {
      const subscriptionId = req.params.id;
      await SubscriptionModel.updateStatus(subscriptionId, 'paused');
      res.json({ success: true, message: 'Subscription paused' });
    } catch (error) {
      next(error);
    }
  },

  // Resume a subscription
  resumeSubscription: async (req, res, next) => {
    try {
      const subscriptionId = req.params.id;
      await SubscriptionModel.updateStatus(subscriptionId, 'active');
      res.json({ success: true, message: 'Subscription resumed' });
    } catch (error) {
      next(error);
    }
  },

  // Skip a week (push next_charge_date +7 days)
  skipSubscription: async (req, res, next) => {
    try {
      const subscriptionId = req.params.id;
      await SubscriptionModel.skipNextCharge(subscriptionId);
      res.json({ success: true, message: 'Subscription skipped for this week' });
    } catch (error) {
      next(error);
    }
  },

  // Cancel a subscription
  cancelSubscription: async (req, res, next) => {
    try {
      const subscriptionId = req.params.id;
      await SubscriptionModel.updateStatus(subscriptionId, 'cancelled');
      res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = subscriptionController;