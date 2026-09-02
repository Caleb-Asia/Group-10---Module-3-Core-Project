/* 
  Purpose: Order model - CRUD operations | Module: models 
  Owner: Adam | Created: 2 Sep 2026 
  Notes: Pure parameterised SQL queries only - NO string concatenation
*/

const pool = require('../config/db');

const OrderModel = {
  create: async (orderData) => {
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

    const [result] = await pool.query(
      `INSERT INTO orders 
       (user_id, subscription_id, order_type, total_amount, payment_status, payment_txn_ref, qr_token, pickup_pod, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, subscription_id || null, order_type, total_amount, payment_status, payment_txn_ref, qr_token, pickup_pod, status]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByUserId: async (userId) => {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  },

  updatePaymentStatus: async (id, payment_status) => {
    await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, id]);
  },

  updateStatus: async (id, status) => {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  },

  updateQrToken: async (id, qr_token) => {
    await pool.query('UPDATE orders SET qr_token = ? WHERE id = ?', [qr_token, id]);
  }
};

module.exports = OrderModel;