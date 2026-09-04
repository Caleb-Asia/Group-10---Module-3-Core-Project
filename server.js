// Sets up the FoodBoxx server and connects the product routes

const express = require("express");
require("dotenv").config();

const productRoutes = require("./server/routes/product.routes");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
// Allows the server to receive JSON data
app.use(express.json());

// Routes
// Handles all product-related requests
app.use("/products", productRoutes);

// Test route
// Checks that the API is running
app.get("/", (req, res) => {
  res.json({
    message: "FoodBoxx API is running!"
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`FoodBoxx server running on port ${PORT}`);
});