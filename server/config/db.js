// Database Configuration
// Purpose: Connects the FoodBoxx backend to the MySQL database using environment variables.

const mysql = require("mysql2/promise");

require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Export the database connection for use throughout the application.
module.exports = db;