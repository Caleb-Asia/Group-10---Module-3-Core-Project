const express = require("express");

const {
  getProducts,
  getProductById,
  getBuilderItems
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getProducts);

router.get("/builder-items", getBuilderItems);

router.get("/:id", getProductById);

module.exports = router;