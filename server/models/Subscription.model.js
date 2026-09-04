/* 
  Purpose: Subscription model - CRUD operations | Module: models 
  Owner: Adam | Created: 3 Sep 2026 
  Notes: Pure parameterised SQL queries only - NO string concatenation. Supports transaction connections.
*/

const pool = require('../config/db');

const SubscriptionModel = {
  /**
   * Create a new subscription record
   * @param {number} userId - User ID
   * @param {number} productId - Box product ID
   * @param {string} pickupPod - Selected pickup location
   * @param {string} nextChargeDate - Next billing date (YYYY-MM-DD)
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<number>} - Inserted subscription ID
   */
  create: async (userId, productId, pickupPod, nextChargeDate, conn = null) => {
    const client = conn || pool;
    const [result] = await client.query(
      `INSERT INTO subscriptions (user_id, product_id, pickup_pod, next_charge_date) 
       VALUES (?, ?, ?, ?)`,
      [userId, productId, pickupPod, nextChargeDate]
    );
    return result.insertId;
  },

  /**
   * Find subscription by its primary key ID
   * @param {number} id - Subscription ID
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<Object|null>} - Subscription row or null
   */
  findById: async (id, conn = null) => {
    const client = conn || pool;
    const [rows] = await client.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
    return rows[0] || null;
  },

  /**
   * Find the most recent subscription for a given user
   * @param {number} userId - User ID
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<Object|null>} - Subscription row or null
   */
  findByUserId: async (userId, conn = null) => {
    const client = conn || pool;
    const [rows] = await client.query(
      'SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows[0] || null; // returns the most recent subscription for that user
  },

  /**
   * Update subscription status (active, paused, cancelled)
   * @param {number} id - Subscription ID
   * @param {string} status - New subscription status
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<number>} - Number of affected rows
   */
  updateStatus: async (id, status, conn = null) => {
    const client = conn || pool;
    const [result] = await client.query('UPDATE subscriptions SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
  },

  /**
   * Increment boxes completed counter for loyalty rewards
   * @param {number} id - Subscription ID
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<number>} - Number of affected rows
   */
  incrementBoxesCompleted: async (id, conn = null) => {
    const client = conn || pool;
    const [result] = await client.query(
      'UPDATE subscriptions SET boxes_completed = boxes_completed + 1 WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  },

  /**
   * Skip next charge by advancing next_charge_date by 7 days
   * @param {number} id - Subscription ID
   * @param {Object|null} conn - Optional transaction connection
   * @returns {Promise<number>} - Number of affected rows
   */
  skipNextCharge: async (id, conn = null) => {
    const client = conn || pool;
    const [result] = await client.query(
      'UPDATE subscriptions SET next_charge_date = DATE_ADD(next_charge_date, INTERVAL 7 DAY) WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = SubscriptionModel;