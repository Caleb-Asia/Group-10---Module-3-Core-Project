/* 
  Purpose: OrderItem model - CRUD operations for order line items | Module: models 
  Owner: Adam | Created: 2 Sep 2026 
  Notes: Pure parameterised SQL queries only - NO string concatenation. Supports transaction connections.
*/

const pool = require('../config/db');

const OrderItemModel = {
  /**
   * Insert a single order item (product + quantity + unit price)
   * @param {number} orderId - Associated Order ID
   * @param {number} productId - Product ID
   * @param {number} quantity - Item quantity
   * @param {number|string} unitPrice - Authoritative unit price from products table
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<number>} - Inserted order item ID
   */
  create: async (orderId, productId, quantity, unitPrice, conn = null) => {
    const client = conn || pool;
    const [result] = await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
       VALUES (?, ?, ?, ?)`,
      [orderId, productId, quantity, unitPrice]
    );
    return result.insertId;
  },

  /**
   * Find all items for a given order ID
   * @param {number} orderId - Order ID
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<Array>} - List of items in the order
   */
  findByOrderId: async (orderId, conn = null) => {
    const client = conn || pool;
    const [rows] = await client.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orderId]
    );
    return rows;
  },

  /**
   * Delete all items for a given order ID
   * @param {number} orderId - Order ID
   * @param {Object|null} conn - Optional transaction connection
   */
  deleteByOrderId: async (orderId, conn = null) => {
    const client = conn || pool;
    await client.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
  }
};

module.exports = OrderItemModel;