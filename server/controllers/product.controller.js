// Handles product requests and gets product data from the API.

const Product = require("../models/Product.model");

// Gets all products and allows filtering by diet or search
const getProducts = async (req, res, next) => {
  try {
    const { diet, search } = req.query;

    const products = await Product.findAll({
      diet,
      search
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

// Gets a single product using its ID
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    // Return an error if the product does not exist
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

// Gets the meals and snacks that can be used in the box builder
const getBuilderItems = async (req, res, next) => {
  try {
    const products = await Product.findBuilderItems();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};

// Export the controller functions
module.exports = {
  getProducts,
  getProductById,
  getBuilderItems
};