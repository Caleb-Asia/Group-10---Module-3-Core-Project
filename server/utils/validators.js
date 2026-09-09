// Checks if an email address is in the correct format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Checks if the email is a string and matches the email format
const isValidEmail = (email) => {
  return typeof email === "string" && emailRegex.test(email.trim());
};

// Checks if the password is at least 8 characters long
const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= 8;
};

// Checks if the price is a valid number and is not negative
const isValidPrice = (price) => {
  return price !== undefined &&
    price !== null &&
    !isNaN(price) &&
    Number(price) >= 0;
};

// Checks if the quantity is a whole number greater than 0
const isValidQuantity = (quantity) => {
  return Number.isInteger(Number(quantity)) && Number(quantity) > 0;
};

// Removes extra spaces from the beginning and end of a string
const sanitiseString = (value) => {
  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
};

// Checks that the product has the required and correct information
const validateProduct = (product) => {
  const errors = {};

  // Product name is required
  if (!product.name || typeof product.name !== "string") {
    errors.name = "Product name is required";
  }

  // Check the price if one was provided
  if (product.price !== undefined && !isValidPrice(product.price)) {
    errors.price = "Price must be a valid positive number";
  }

  // Check that the category is one of the allowed options
  if (product.category && !["box", "meal", "snack"].includes(product.category)) {
    errors.category = "Category must be box, meal, or snack";
  }

  return errors;
};

// Export the validation functions
module.exports = {
  isValidEmail,
  isValidPassword,
  isValidPrice,
  isValidQuantity,
  sanitiseString,
  validateProduct
};