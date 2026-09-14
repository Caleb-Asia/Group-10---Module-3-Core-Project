/* 
  Purpose: Payfast sandbox payment gateway adapter | Module: services 
  Owner: Adam | Created: Sep 2026 
  Notes: Hand-rolled Payfast integration for sandbox. Generates signed payment URLs and verifies ITN notifications. No external SDK.
*/

const crypto = require('crypto');
const ApiError = require('../utils/apiError');

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || '';
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || '';
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || '';
const PAYFAST_SANDBOX = process.env.PAYFAST_SANDBOX || 'false';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const SANDBOX_PROCESS_URL = 'https://sandbox.payfast.co.za/eng/process';
const LIVE_PROCESS_URL = 'https://www.payfast.co.za/eng/process';
const processUrl = PAYFAST_SANDBOX === 'true' ? SANDBOX_PROCESS_URL : LIVE_PROCESS_URL;
const pendingPayments = new Map();

/**
 * Generate a Payfast MD5 signature from an ordered set of payment fields.
 * @param {Object} data - Payfast key/value fields.
 * @param {string} passphrase - Optional Payfast passphrase.
 * @returns {string} The lowercase hexadecimal MD5 signature.
 */
function generateSignature(data, passphrase) {
  const fields = Object.keys(data)
    .filter(key => data[key] !== undefined && data[key] !== null && data[key] !== '')
    .map(key => `${key}=${encodeURIComponent(String(data[key])).replace(/%20/g, '+')}`);

  let fullString = fields.join('&');
  if (passphrase) {
    fullString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;
  }

  return crypto.createHash('md5').update(fullString).digest('hex');
}

const cleanupInterval = setInterval(() => {
  const expirationTime = Date.now() - (60 * 60 * 1000);
  for (const [reference, payment] of pendingPayments.entries()) {
    if (payment.createdAt < expirationTime) {
      pendingPayments.delete(reference);
    }
  }
}, 60 * 60 * 1000);
cleanupInterval.unref();

const payfastService = {
  /**
   * Create a pending payment and return its signed Payfast redirect URL.
   * @param {Object} params - Payment amount, item name, and order data.
   * @returns {Promise<{redirectUrl: string, ref: string}>} Payment redirect details.
   */
  initiatePayment: async ({ amount, itemName, orderData }) => {
    if (!orderData || amount === undefined || amount === null || !itemName) {
      throw new ApiError(400, 'Payment amount, item name, and order data are required');
    }

    const ref = crypto.randomBytes(16).toString('hex');
    pendingPayments.set(ref, {
      ...orderData,
      amount,
      createdAt: Date.now()
    });

    const payload = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.BASE_URL}/confirmation?ref=${ref}`,
      cancel_url: `${process.env.BASE_URL}/checkout?cancelled=1`,
      notify_url: `${process.env.BASE_URL}/api/payments/payfast/notify`,
      name_first: orderData.nameFirst || 'Customer',
      email_address: orderData.email || 'test@test.com',
      m_payment_id: ref,
      amount: Number(amount).toFixed(2),
      item_name: itemName
    };

    const signature = generateSignature(payload, PAYFAST_PASSPHRASE);
    const query = new URLSearchParams({ ...payload, signature }).toString();

    return {
      redirectUrl: `${processUrl}?${query}`,
      ref
    };
  },

  /**
   * Retrieve pending order data by its payment reference.
   * @param {string} pendingRef - Pending payment reference.
   * @returns {Object|null} Stored order data, or null when not found.
   */
  getPendingOrder: (pendingRef) => pendingPayments.get(pendingRef) || null,

  /**
   * Remove pending order data by its payment reference.
   * @param {string} pendingRef - Pending payment reference.
   * @returns {void}
   */
  clearPendingOrder: (pendingRef) => {
    pendingPayments.delete(pendingRef);
  },

  /**
   * Validate a returned Payfast payment with Payfast's own validation API.
   * @param {Object} payfastData - Payment fields returned by Payfast.
   * @returns {Promise<boolean>} Whether Payfast confirmed the payment.
   */
  validatePayment: async (payfastData) => {
    try {
      if (!payfastData || typeof payfastData !== 'object' || Array.isArray(payfastData) || Object.keys(payfastData).length === 0) {
        return false;
      }

      const data = { ...payfastData };
      delete data.pf_signature;
      data.signature = generateSignature(data, PAYFAST_PASSPHRASE);

      const validateUrl = PAYFAST_SANDBOX === 'true'
        ? 'https://sandbox.payfast.co.za/eng/query/validate'
        : 'https://www.payfast.co.za/eng/query/validate';
      const response = await fetch(validateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });

      const responseText = (await response.text()).trim().toUpperCase();
      return responseText === 'VALID';
    } catch (error) {
      console.error(`Payfast validate API failed: ${error.message}`);
      return false;
    }
  },

  /**
   * Verify the signature supplied in a Payfast ITN notification.
   * @param {Object} itnData - Payfast ITN key/value fields.
   * @returns {Promise<boolean>} Whether the ITN signature is valid.
   */
  verifyITN: async (itnData) => {
    try {
      const { pf_signature: providedSignature, ...data } = itnData || {};
      if (!providedSignature) return false;

      const expectedSignature = generateSignature(data, PAYFAST_PASSPHRASE);
      if (providedSignature.length !== expectedSignature.length) return false;

      return crypto.timingSafeEqual(
        Buffer.from(providedSignature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Payfast ITN verification failed:', error.message);
      return false;
    }
  }
};

module.exports = payfastService;
