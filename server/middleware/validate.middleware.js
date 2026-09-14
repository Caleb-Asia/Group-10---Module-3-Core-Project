/*
  Purpose: HTTP request validation middleware | Module: middleware
  Owner: Michaela | Created: 9 Sep 2026
  Notes: Validates and sanitises auth, product, and order request payloads before controllers execute.
*/

const {
  APPROVED_PICKUP_PODS,
  isApprovedPickupPod,
  isValidEmail,
  isValidPassword,
  isValidPrice,
  isValidQuantity,
  sanitiseString
} = require('../utils/validators');

const sendValidationError = (res, message, errors = null) => res.status(400).json({
  success: false,
  error: {
    message,
    details: errors || null
  }
});

const validateProductQueryParams = (req, res, next) => {
  const allowedDiets = ['standard', 'vegan', 'halal', 'keto', 'nut-free', 'gluten-free'];
  if (req.query.diet && !allowedDiets.includes(req.query.diet)) {
    return sendValidationError(res, 'Invalid dietary preference');
  }

  if (req.query.search) req.query.search = sanitiseString(req.query.search);
  next();
};

const validateEmail = (req, res, next) => {
  if (!isValidEmail(req.body.email)) {
    return sendValidationError(res, 'Please provide a valid email address');
  }

  req.body.email = sanitiseString(req.body.email).toLowerCase();
  next();
};

const validatePassword = (req, res, next) => {
  if (!isValidPassword(req.body.password)) {
    return sendValidationError(res, 'Password must be at least 8 characters');
  }

  next();
};

const validatePrice = (req, res, next) => {
  if (!isValidPrice(req.body.price)) return sendValidationError(res, 'Price must be a valid positive number');
  next();
};

const validateQuantity = (req, res, next) => {
  if (!isValidQuantity(req.body.quantity)) return sendValidationError(res, 'Quantity must be a positive whole number');
  next();
};

// Validate one-off/custom item lists and subscription box payloads before service processing.
const validateOrderPayload = (req, res, next) => {
  const { items, productId, cardNumber, pickupPod } = req.body;
  const isSubscriptionOrder = productId !== undefined && items === undefined;

  if (!cardNumber || typeof cardNumber !== 'string' || !cardNumber.trim()) {
    return sendValidationError(res, 'cardNumber is required');
  }
  if (!isApprovedPickupPod(pickupPod)) {
    return sendValidationError(res, `pickupPod must be one of: ${APPROVED_PICKUP_PODS.join(', ')}`);
  }

  if (isSubscriptionOrder) {
    if (!Number.isInteger(Number(productId)) || Number(productId) <= 0) {
      return sendValidationError(res, 'productId must be a positive integer');
    }
  } else {
    if (!Array.isArray(items) || items.length === 0) {
      return sendValidationError(res, 'items must contain at least one product');
    }
    if (items.some(item => !item || !Number.isInteger(Number(item.productId)) || Number(item.productId) <= 0 || !isValidQuantity(item.quantity))) {
      return sendValidationError(res, 'Each item requires a positive integer productId and quantity');
    }
  }

  req.body.cardNumber = cardNumber.trim();
  req.body.pickupPod = pickupPod.trim();
  next();
};

const validateSubscriptionUpdatePayload = (req, res, next) => {
  const { productId, pickupPod } = req.body;

  if (productId === undefined && pickupPod === undefined) {
    return sendValidationError(res, 'Provide productId, pickupPod, or both to update the subscription');
  }

  if (productId !== undefined) {
    const numericProductId = Number(productId);
    if (!Number.isInteger(numericProductId) || numericProductId <= 0) {
      return sendValidationError(res, 'productId must be a positive integer');
    }
    req.body.productId = numericProductId;
  }

  if (pickupPod !== undefined) {
    if (!isApprovedPickupPod(pickupPod)) {
      return sendValidationError(res, `pickupPod must be one of: ${APPROVED_PICKUP_PODS.join(', ')}`);
    }
    req.body.pickupPod = pickupPod.trim();
  }

  next();
};

module.exports = {
  validateProductQueryParams,
  validateEmail,
  validatePassword,
  validatePrice,
  validateQuantity,
  validateOrderPayload,
  validateSubscriptionUpdatePayload
};
