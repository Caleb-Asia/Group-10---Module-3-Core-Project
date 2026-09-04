/* 
  Purpose: Payment controller | Module: controllers 
  Owner: Adam | Created: 4 Sep 2026 
*/

const paymentService = require('../services/payment.service');

const paymentController = {
  processPayment: async (req, res, next) => {
    try {
      const { cardNumber, amount } = req.body;

      // Call the payment service (it will throw if validation fails or card is declined)
      const result = await paymentService.processPayment({ cardNumber, amount });

      // Send success response
      res.status(200).json({
        success: true,
        message: result.message,
        txnRef: result.txnRef,
        amount: result.amount
      });
    } catch (error) {
      next(error); // pass to global error handler (sends 402 for declined card)
    }
  }
};

module.exports = paymentController;