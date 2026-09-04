/* 
  Purpose: Simulated payment gateway logic | Module: services 
  Owner: Adam | Created: 2 Sep 2026 
  Notes: Simple rule - card ending in '0002' declines, everything else approves.
*/

const ApiError = require('../utils/apiError');

const paymentService = {
  /**
   * Process payment simulation
   * @param {Object} param0 - { cardNumber, amount }
   * @returns {Promise<Object>} - Transaction result
   */
  processPayment: async ({ cardNumber, amount }) => {
    // Step 1: Validate that the card number and amount were actually sent in the request
    if (!cardNumber || amount === undefined || amount === null) {
      throw new ApiError(400, 'Card number and amount are required');
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 0) {
      throw new ApiError(400, 'Invalid payment amount');
    }

    // Step 2: Format the card number (remove all whitespace) and get the last 4 digits
    const cleanedCard = String(cardNumber).replace(/\s/g, '');
    const lastFour = cleanedCard.slice(-4);

    // Step 3: Simulate a fake gateway network delay (1500ms)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 4: Apply simulated rule - card ending in '0002' triggers a 402 Payment Required
    if (lastFour === '0002') {
      throw new ApiError(402, 'Card declined. Please try a different payment method.');
    }

    // Step 5: Generate unique transaction reference (using substring instead of deprecated substr)
    const randomHex = Math.random().toString(36).substring(2, 10);
    const txnRef = `FBX-${Date.now()}-${randomHex}`;

    // Step 6: Return payment confirmation object
    return {
      success: true,
      txnRef,
      amount: numericAmount,
      message: 'Payment approved successfully'
    };
  }
};

module.exports = paymentService;