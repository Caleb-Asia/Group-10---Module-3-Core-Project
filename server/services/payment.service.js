/* 
  Purpose: Simulated payment gateway logic | Module: services 
  Owner: Adam | Created: 2 Sep 2026 
  Notes: Simple rule - card ending in '0002' declines, everything else approves.
*/

const ApiError = require('../utils/apiError');

const paymentService = {
  processPayment: async ({ cardNumber, amount }) => {
    // Step 1: Validate that the card number and amount were actually sent in the request
    if (!cardNumber || !amount) {
      throw new ApiError(400, 'Card number and amount are required');
    }

    // Step 2: Format the card number (remove spaces) and get the last 4 digits
    // The .replace(/\s/g, '') removes all spaces from the string
    // The .slice(-4) grabs the last 4 characters
    const cleanedCard = cardNumber.replace(/\s/g, '');
    const lastFour = cleanedCard.slice(-4);

    // Step 3: Simulate a fake delay (1500ms) so the frontend shows a "Processing..." spinner
    // Specific code: the Promise with setTimeout creates a 1.5 second pause
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 4: Apply the business rule - if it ends in 0002, DECLINE
    if (lastFour === '0002') {
      // Throw a 402 Payment Required error so the global error handler catches it
      throw new ApiError(402, 'Card declined. Please try a different payment method.');
    }

    // Step 5: If not declined, APPROVE - Generate a fake transaction reference
    // Specific code: 'FBX-' + Date.now() (current timestamp) + random string
    const txnRef = 'FBX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8);

    // Step 6: Return the success object to whoever called this function
    return {
      success: true,
      txnRef,        // e.g. "FBX-1756800000-xyz12345"
      amount,
      message: 'Payment approved successfully'
    };
  }
};

module.exports = paymentService;