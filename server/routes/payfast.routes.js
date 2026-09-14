/* 
  Purpose: Payfast payment routes | Module: routes 
  Owner: Adam | Created: Sep 2026 
  Notes: Initiation endpoint (auth-protected) and public ITN webhook.
*/

const express = require('express');
const router = express.Router();
const payfastService = require('../services/payfast.service');
const orderService = require('../services/order.service');
const authMiddleware = require('../middleware/auth.middleware');
const ApiError = require('../utils/apiError');

router.post('/initiate', authMiddleware, async (req, res, next) => {
  try {
    const { items, pickupPod, orderType, nameFirst, email, itemName } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, 'items must contain at least one product');
    }
    if (!pickupPod) {
      throw new ApiError(400, 'pickupPod is required');
    }
    if (!['one-off', 'custom', 'subscription'].includes(orderType)) {
      throw new ApiError(400, 'orderType must be one of: one-off, custom, subscription');
    }

    const result = await orderService.initiatePayfastOrder({
      userId: req.userId,
      items,
      pickupPod,
      orderType,
      nameFirst,
      email,
      itemName
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

/*
 * Synchronous confirmation path used when Payfast cannot reach the server,
 * such as during localhost development without an ITN tunnel.
 */
router.post('/confirm', async (req, res, next) => {
  try {
    const { ref, payfastData } = req.body;
    if (!ref || !payfastData || typeof payfastData !== 'object' || Array.isArray(payfastData)) {
      throw new ApiError(400, 'ref and payfastData are required');
    }

    const pending = payfastService.getPendingOrder(ref);
    if (!pending) {
      throw new ApiError(404, 'No pending payment found for this reference');
    }

    const isValid = await payfastService.validatePayment(payfastData);
    if (!isValid) {
      throw new ApiError(400, 'Payfast could not verify this payment');
    }

    if (payfastData.payment_status !== 'COMPLETE') {
      throw new ApiError(400, `Payment was not completed (status: ${payfastData.payment_status})`);
    }

    const result = await orderService.createOrderFromPayfast({
      userId: pending.userId,
      items: pending.items,
      pickupPod: pending.pickupPod,
      orderType: pending.orderType,
      totalAmount: pending.totalAmount,
      txnRef: payfastData.pf_payment_id || ref
    });
    payfastService.clearPendingOrder(ref);

    res.json({
      success: true,
      orderId: result.orderId,
      qrToken: result.qrToken,
      totalAmount: result.totalAmount
    });
  } catch (error) {
    next(error);
  }
});

router.post('/notify', async (req, res) => {
  try {
    const itnData = req.body;
    if (!await payfastService.verifyITN(itnData)) {
      console.error('Invalid ITN signature received');
      return res.status(400).send('Invalid ITN');
    }

    const paymentStatus = itnData.payment_status;
    const pendingRef = itnData.m_payment_id;
    if (paymentStatus !== 'COMPLETE') {
      console.log(`Payfast payment status ${paymentStatus}; no order created.`);
      return res.status(200).send('OK');
    }

    const pending = payfastService.getPendingOrder(pendingRef);
    if (!pending) {
      console.log('No pending Payfast order found.');
      return res.status(200).send('OK');
    }

    const result = await orderService.createOrderFromPayfast({
      userId: pending.userId,
      items: pending.items,
      pickupPod: pending.pickupPod,
      orderType: pending.orderType,
      totalAmount: pending.totalAmount,
      txnRef: itnData.pf_payment_id || pendingRef
    });
    console.log(`Created Payfast order ${result.orderId}.`);
    payfastService.clearPendingOrder(pendingRef);
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Payfast ITN processing failed:', error);
    return res.status(200).send('OK');
  }
});

module.exports = router;
