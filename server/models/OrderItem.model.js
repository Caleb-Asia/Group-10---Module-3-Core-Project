/* 
  Purpose: OrderItem model - CRUD operations for order line items | Module: models 
  Owner: Adam | Created: 2 Sep 2026 
  Notes: Pure parameterised SQL queries only - NO string concatenation
*/

const pool = require('../config/db');

const OrderItemModel = {
  // Insert a single order item (product + quantity + unit price)
  create: async (orderId, productId, quantity, unitPrice) => {
    const [result] = await pool.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
       VALUES (?, ?, ?, ?)`,
      [orderId, productId, quantity, unitPrice]
    );
    return result.insertId;
  },

  // Find all items for a given order ID
  findByOrderId: async (orderId) => {
    const [rows] = await pool.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );
    return rows;
  },

  // Delete an item from an order (used if you need to edit an order before confirmation)
  deleteByOrderId: async (orderId) => {
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
  }
};

module.exports = OrderItemModel;