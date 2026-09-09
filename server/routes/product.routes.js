/*
  Purpose: Product catalogue routes | Module: routes
  Owner: Michaela | Created: 9 Sep 2026
  Notes: Exposes public product and custom box-builder endpoints with query validation.
*/

const express = require('express');

const {
  getProducts,
  getProductById,
  getBuilderItems
} = require('../controllers/product.controller');

const { validateProductQueryParams } = require('../middleware/validate.middleware');

const router = express.Router();

// validate diet/search before it even reaches the controller
router.get('/', validateProductQueryParams, getProducts);

// builder-items has to come before /:id, otherwise Express would
// treat "builder-items" as an :id value and this route never runs
router.get('/builder-items', getBuilderItems);

router.get('/:id', getProductById);

module.exports = router;
