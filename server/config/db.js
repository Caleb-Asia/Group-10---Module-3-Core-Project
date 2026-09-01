/* 
  Purpose: MySQL connection pool for FoodBoxx | Module: config 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: All queries MUST use parameterised SQL (? placeholders) to prevent injection
*/

const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool (reuses connections for better performance)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodboxx',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection on startup (optional but helpful)
(async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(' MySQL connected successfully');
    connection.release();
  } catch (error) {
    console.error(' MySQL connection error:', error.message);
  }
})();

module.exports = pool;