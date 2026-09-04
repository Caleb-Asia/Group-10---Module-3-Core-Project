/* 
  Purpose: Order routes | Module: routes 
  Owner: Adam | Created: 4 Sep 2026 
  Notes: Protected order routes with ownership verification and custom box builder support.
*/

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All order routes require JWT authentication
router.use(authMiddleware);

// POST order creation routes
router.post('/', orderController.createOneOffOrder);
router.post('/custom', orderController.createCustomOrder);
router.post('/subscription', orderController.createSubscriptionOrder);

// GET order retrieval routes (user route must precede :id to prevent collision)
router.get('/user/:userId', orderController.getOrdersByUser);
router.get('/:id', orderController.getOrderById);

module.exports = router;