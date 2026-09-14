/* 
  Purpose: Subscription routes | Module: routes 
  Owner: Adam | Created: 4 Sep 2026 
  Notes: Protected subscription routes enforcing JWT authentication.
*/

const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateOrderPayload, validateSubscriptionUpdatePayload } = require('../middleware/validate.middleware');

// All subscription operations require JWT authentication
router.use(authMiddleware);

// Create a recurring subscription and its first order.
router.post('/', validateOrderPayload, subscriptionController.createSubscription);

// Update the selected box and/or pickup pod for an owned active or paused subscription.
router.patch('/:id', validateSubscriptionUpdatePayload, subscriptionController.updateSubscription);

// Retrieve active/latest subscription for a user
router.get('/user/:userId', subscriptionController.getSubscriptionByUser);

// Lifecycle state transitions
router.patch('/:id/pause', subscriptionController.pauseSubscription);
router.patch('/:id/resume', subscriptionController.resumeSubscription);
router.patch('/:id/skip', subscriptionController.skipSubscription);
router.patch('/:id/cancel', subscriptionController.cancelSubscription);

module.exports = router;
