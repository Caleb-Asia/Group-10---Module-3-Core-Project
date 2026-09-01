/* 
  Purpose: User model - CRUD operations | Module: models 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Pure parameterised SQL queries only - NO string concatenation
*/

const pool = require('../config/db');

const UserModel = {
  create: async (name, email, password_hash, dietary_preferences = 'standard') => {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, dietary_preferences) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, dietary_preferences]
    );
    return result.insertId;
  },

  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
    if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
    if (data.dietary_preferences !== undefined) { fields.push('dietary_preferences = ?'); values.push(data.dietary_preferences); }

    if (fields.length === 0) return;

    values.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  }
};

module.exports = UserModel;