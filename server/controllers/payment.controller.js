/* 
  Purpose: Payment controller | Module: controllers 
  Owner: Adam | Created: 4 Sep 2026 
  Notes: Handles payment processing simulation requests with authentication.
*/

const paymentService = require('../services/payment.service');

const paymentController = {
  /**
   * Process simulated payment
   */
  processPayment: async (req, res, next) => {
    try {
      const { cardNumber, amount } = req.body;

      // Call the payment service (throws 400 for bad input, 402 for declined card ending in '0002')
      const result = await paymentService.processPayment({ cardNumber, amount });

      // Send success response
      res.status(200).json({
        success: true,
        message: result.message,
        txnRef: result.txnRef,
        amount: result.amount
      });
    } catch (error) {
      next(error); // Forward to global error handler
    }
  }
};

module.exports = paymentController;