// Checks and cleans the data before it gets processed by the API.

const {
  isValidEmail,
  isValidPassword,
  isValidPrice,
  isValidQuantity,
  sanitiseString,
  validateProduct
} = require("../utils/validators");

// Checks that the product data is valid before continuing
const validateProductPayload = (req, res, next) => {

  const errors = validateProduct(req.body);

  // If there are validation errors, send them back to the user
  if (Object.keys(errors).length > 0) {

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  // Clean the product name before saving it
  req.body.name = sanitiseString(req.body.name);

  // Clean the description if one was provided
  if (req.body.description) {
    req.body.description = sanitiseString(req.body.description);
  }

  next();
};

// Checks if the email address is valid
const validateEmail = (req, res, next) => {

  if (!isValidEmail(req.body.email)) {

    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  next();
};

// Checks if the password is at least 8 characters
const validatePassword = (req, res, next) => {

  if (!isValidPassword(req.body.password)) {

    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters"
    });
  }

  next();
};

// Checks if the price is a valid positive number
const validatePrice = (req, res, next) => {

  if (!isValidPrice(req.body.price)) {

    return res.status(400).json({
      success: false,
      message: "Price must be a valid positive number"
    });
  }

  next();
};

// Checks if the quantity is a positive whole number
const validateQuantity = (req, res, next) => {

  if (!isValidQuantity(req.body.quantity)) {

    return res.status(400).json({
      success: false,
      message: "Quantity must be a positive whole number"
    });
  }

  next();
};

// Export the validation functions
module.exports = {
  validateProductPayload,
  validateEmail,
  validatePassword,
  validatePrice,
  validateQuantity
};