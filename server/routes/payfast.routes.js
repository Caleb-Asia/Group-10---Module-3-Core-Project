const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const ApiError = require('../utils/apiError');
const payfastService = require('../services/payfast.service');
const orderService = require('../services/order.service');

router.post('/initiate', authMiddleware, async (req, res, next) => {
  try {
    const { items, pickupPod, orderType, nameFirst, email, itemName } = req.body;
    if (!Array.isArray(items) || items.length === 0 || !pickupPod || !['one-off', 'custom', 'subscription'].includes(orderType)) {
      throw new ApiError(400, 'items, pickupPod, and a valid orderType are required');
    }
    const result = await orderService.initiatePayfastOrder({ userId: req.userId, items, pickupPod, orderType, nameFirst, email, itemName });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

router.post('/confirm', async (req, res, next) => {
  try {
    const { ref, payfastData } = req.body;
    if (!ref || !payfastData) throw new ApiError(400, 'ref and payfastData are required');
    const pending = payfastService.getPendingOrder(ref);
    if (!pending) throw new ApiError(404, 'Pending payment not found');

    // Sandbox-wallet bypass: the PayFast sandbox wallet does not append its
    // return params to the return_url. When PAYFAST_SANDBOX is true and the
    // frontend signals a completed sandbox wallet payment, trust it.
    // This path is impossible in production because PAYFAST_SANDBOX will be false.
    const isSandboxWalletBypass =
      process.env.PAYFAST_SANDBOX === 'true' &&
      payfastData &&
      payfastData.__sandbox_wallet === true &&
      payfastData.payment_status === 'COMPLETE';

    if (!isSandboxWalletBypass) {
      if (!await payfastService.validatePayment(payfastData)) throw new ApiError(400, 'Payfast could not verify this payment');
      if (payfastData.payment_status !== 'COMPLETE') throw new ApiError(400, `Payment was not completed (status: ${payfastData.payment_status})`);
    }
    const result = await orderService.createOrderFromPayfast({ ...pending, txnRef: payfastData.pf_payment_id || ref });
    payfastService.clearPendingOrder(ref);
    res.json({ success: true, orderId: result.orderId, totalAmount: result.totalAmount });
  } catch (error) {
    next(error);
  }
});

router.post('/notify', async (req, res) => {
  try {
    if (!await payfastService.verifyITN(req.body)) return res.status(400).send('Invalid ITN');
    if (req.body.payment_status !== 'COMPLETE') return res.status(200).send('OK');
    const ref = req.body.m_payment_id;
    const pending = payfastService.getPendingOrder(ref);
    if (pending) {
      await orderService.createOrderFromPayfast({ ...pending, txnRef: req.body.pf_payment_id || ref });
      payfastService.clearPendingOrder(ref);
    }
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Payfast ITN processing failed:', error);
    return res.status(200).send('OK');
  }
});

module.exports = router;
