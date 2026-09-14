/* 
  Purpose: Order routes | Module: routes 
  Owner: Adam | Created: 4 Sep 2026 
  Notes: Protected order routes with ownership verification and custom box builder support.
*/

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateOrderPayload } = require('../middleware/validate.middleware');

// All order routes require JWT authentication
router.use(authMiddleware);

// POST order creation routes
router.post('/', validateOrderPayload, orderController.createOneOffOrder);
router.post('/custom', validateOrderPayload, orderController.createCustomOrder);
// Deprecated alias for POST /api/subscriptions — kept for backward compatibility.
router.post('/subscription', validateOrderPayload, orderController.createSubscriptionOrder);

// Confirm a QR token and mark an order as collected.
router.patch('/:id/pick-up', orderController.pickUpOrder);

// GET order retrieval routes (user route must precede :id to prevent collision)
router.get('/user/:userId', orderController.getOrdersByUser);
router.get('/:id', orderController.getOrderById);

module.exports = router;
