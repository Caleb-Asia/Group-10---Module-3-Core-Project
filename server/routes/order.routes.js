/* 
  Purpose: Order routes | Module: routes 
  Owner: Adam | Created: 4 Sep 2026 
*/

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected routes – require JWT token
router.post('/', authMiddleware, orderController.createOneOffOrder);
router.post('/subscription', authMiddleware, orderController.createSubscriptionOrder);
router.get('/:userId', authMiddleware, orderController.getOrdersByUser);
router.get('/:id', authMiddleware, orderController.getOrderById);

module.exports = router;