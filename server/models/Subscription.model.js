/* 
  Purpose: Subscription model - CRUD operations | Module: models 
  Owner: Adam | Created: 3 Sep 2026 
  Notes: Pure parameterised SQL queries only - NO string concatenation
*/

const pool = require('../config/db');

const SubscriptionModel = {
  create: async (userId, productId, pickupPod, nextChargeDate) => {
    const [result] = await pool.query(
      `INSERT INTO subscriptions (user_id, product_id, pickup_pod, next_charge_date) 
       VALUES (?, ?, ?, ?)`,
      [userId, productId, pickupPod, nextChargeDate]
    );
    return result.insertId;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByUserId: async (userId) => {
    const [rows] = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows[0] || null; // returns the most recent subscription for that user
  },

  updateStatus: async (id, status) => {
    await pool.query('UPDATE subscriptions SET status = ? WHERE id = ?', [status, id]);
  },

  incrementBoxesCompleted: async (id) => {
    await pool.query(
      'UPDATE subscriptions SET boxes_completed = boxes_completed + 1 WHERE id = ?',
      [id]
    );
  },

  skipNextCharge: async (id) => {
    await pool.query(
      'UPDATE subscriptions SET next_charge_date = DATE_ADD(next_charge_date, INTERVAL 7 DAY) WHERE id = ?',
      [id]
    );
  }
};

module.exports = SubscriptionModel;