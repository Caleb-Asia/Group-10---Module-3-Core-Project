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

function generateSignature(data, passphrase) {
  const fields = Object.keys(data)
    .sort()
    .filter(key => data[key] !== undefined && data[key] !== null && data[key] !== '')
    .map(key => `${key}=${encodeURIComponent(String(data[key])).replace(/%20/g, '+')}`);
  let fullString = fields.join('&');
  if (passphrase) fullString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;
  return crypto.createHash('md5').update(fullString).digest('hex');
}

const cleanupInterval = setInterval(() => {
  const expirationTime = Date.now() - 60 * 60 * 1000;
  for (const [reference, payment] of pendingPayments.entries()) {
    if (payment.createdAt < expirationTime) pendingPayments.delete(reference);
  }
}, 60 * 60 * 1000);
cleanupInterval.unref();

const payfastService = {
  initiatePayment: async ({ amount, itemName, orderData }) => {
    if (!orderData || amount === undefined || amount === null || !itemName) {
      throw new ApiError(400, 'Payment amount, item name, and order data are required');
    }
    const ref = crypto.randomBytes(16).toString('hex');
    pendingPayments.set(ref, { ...orderData, amount, createdAt: Date.now() });
    const payload = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${BASE_URL}/confirmation?ref=${ref}`,
      cancel_url: `${BASE_URL}/checkout?cancelled=1`,
      notify_url: `${BASE_URL}/api/payments/payfast/notify`,
      name_first: orderData.nameFirst || 'Customer',
      email_address: orderData.email || 'test@test.com',
      m_payment_id: ref,
      amount: Number(amount).toFixed(2),
      item_name: itemName
    };
    const signature = generateSignature(payload, PAYFAST_PASSPHRASE);
    const query = new URLSearchParams(Object.fromEntries(Object.entries({ ...payload, signature }).sort(([a], [b]) => a.localeCompare(b)))).toString();
    return { redirectUrl: `${processUrl}?${query}`, ref };
  },

  getPendingOrder: ref => pendingPayments.get(ref) || null,
  clearPendingOrder: ref => pendingPayments.delete(ref),

  validatePayment: async (payfastData) => {
    try {
      if (!payfastData || typeof payfastData !== 'object' || Array.isArray(payfastData) || Object.keys(payfastData).length === 0) return false;
      const data = { ...payfastData };
      delete data.pf_signature;
      data.signature = generateSignature(data, PAYFAST_PASSPHRASE);
      const validateUrl = PAYFAST_SANDBOX === 'true'
        ? 'https://sandbox.payfast.co.za/eng/query/validate'
        : 'https://www.payfast.co.za/eng/query/validate';
      const response = await fetch(validateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(Object.fromEntries(Object.entries(data).sort(([a], [b]) => a.localeCompare(b)))).toString()
      });
      return (await response.text()).trim().toUpperCase() === 'VALID';
    } catch (error) {
      return false;
    }
  },

  verifyITN: async (itnData) => {
    try {
      const { pf_signature: providedSignature, ...data } = itnData || {};
      if (!providedSignature) return false;
      const expectedSignature = generateSignature(data, PAYFAST_PASSPHRASE);
      if (providedSignature.length !== expectedSignature.length) return false;
      return crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature));
    } catch (error) {
      return false;
    }
  }
};

module.exports = payfastService;
