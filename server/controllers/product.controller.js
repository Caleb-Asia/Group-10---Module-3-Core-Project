/*
  Purpose: Product HTTP request handlers | Module: controllers
  Owner: Michaela | Created: 9 Sep 2026
  Notes: Returns consistent catalogue and box-builder response contracts.
*/

const Product = require('../models/Product.model');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ diet: req.query.diet, search: req.query.search });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: { message: 'Product not found', details: null } });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const getBuilderItems = async (req, res, next) => {
  try {
    // Builder products use the same { success, count, data } contract as the catalogue.
    const products = await Product.findBuilderItems();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, getBuilderItems };
