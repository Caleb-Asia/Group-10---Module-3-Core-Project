/* 
  Purpose: Subscription routes | Module: routes 
  Owner: Adam | Created: 4 Sep 2026 
*/

const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes – require JWT token
router.get('/user/:userId', authMiddleware, subscriptionController.getSubscriptionByUser);
router.patch('/:id/pause', authMiddleware, subscriptionController.pauseSubscription);
router.patch('/:id/resume', authMiddleware, subscriptionController.resumeSubscription);
router.patch('/:id/skip', authMiddleware, subscriptionController.skipSubscription);
router.patch('/:id/cancel', authMiddleware, subscriptionController.cancelSubscription);

module.exports = router;