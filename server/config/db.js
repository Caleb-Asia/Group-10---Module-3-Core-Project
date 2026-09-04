/* 
  Purpose: MySQL connection pool for FoodBoxx | Module: config 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: All queries MUST use parameterised SQL (? placeholders) to prevent injection. Provides pool and dedicated connections.
*/

const mysql = require('mysql2/promise');

// Create a connection pool configured from environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodboxx',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;