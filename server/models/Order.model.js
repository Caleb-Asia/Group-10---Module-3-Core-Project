/* 
  Purpose: Order model - CRUD operations | Module: models 
  Owner: Adam | Created: 2 Sep 2026 
  Notes: Pure parameterised SQL queries only - NO string concatenation. Supports transaction connections.
*/

const pool = require('../config/db');

const OrderModel = {
  /**
   * Insert a new order record
   * @param {Object} orderData - Order entity attributes
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<number>} - Inserted order ID
   */
  create: async (orderData, conn = null) => {
    const client = conn || pool;
    const {
      user_id,
      subscription_id,
      order_type,
      total_amount,
      payment_status,
      payment_txn_ref,
      qr_token,
      pickup_pod,
      status
    } = orderData;

    // Parameterised INSERT statement preserving 5-table schema integrity
    const [result] = await client.query(
      `INSERT INTO orders 
       (user_id, subscription_id, order_type, total_amount, payment_status, payment_txn_ref, qr_token, pickup_pod, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, subscription_id || null, order_type, total_amount, payment_status, payment_txn_ref, qr_token, pickup_pod, status]
    );
    return result.insertId;
  },

  /**
   * Find an order by its primary key ID
   * @param {number} id - Order ID
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<Object|null>} - Order row or null
   */
  findById: async (id, conn = null) => {
    const client = conn || pool;
    const [rows] = await client.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0] || null;
  },

  /**
   * Find all orders belonging to a specific user
   * @param {number} userId - User ID
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<Array>} - List of orders
   */
  findByUserId: async (userId, conn = null) => {
    const client = conn || pool;
    const [rows] = await client.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  },

  /**
   * Update payment status of an order
   * @param {number} id - Order ID
   * @param {string} payment_status - New payment status
   * @param {Object|null} conn - Optional transaction connection
   */
  updatePaymentStatus: async (id, payment_status, conn = null) => {
    const client = conn || pool;
    await client.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, id]);
  },

  /**
   * Update fulfillment status of an order
   * @param {number} id - Order ID
   * @param {string} status - New order status ('pending', 'confirmed', 'picked_up')
   * @param {Object|null} conn - Optional transaction connection
   */
  updateStatus: async (id, status, conn = null) => {
    const client = conn || pool;
    await client.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  },

  /**
   * Update QR token for an order
   * @param {number} id - Order ID
   * @param {string} qr_token - Unique QR token
   * @param {Object|null} conn - Optional transaction connection
   */
  updateQrToken: async (id, qr_token, conn = null) => {
    const client = conn || pool;
    await client.query('UPDATE orders SET qr_token = ? WHERE id = ?', [qr_token, id]);
  }
};

module.exports = OrderModel;