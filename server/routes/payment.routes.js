/* 
  Purpose: Payment routes | Module: routes 
  Owner: Adam | Created: 4 Sep 2026 
  Notes: Requires JWT authentication before calling payment processing gateway.
*/

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protect payment simulation endpoint with authentication
router.post('/', authMiddleware, paymentController.processPayment);

module.exports = router;