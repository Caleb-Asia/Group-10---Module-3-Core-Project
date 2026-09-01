/* 
  Purpose: Express server with authentication routes | Owner: Adam | Created: 1 Sep 2026 
*/

console.log('Starting server...');

require('dotenv').config();
const express = require('express');

console.log('Dependencies loaded');

// --- Load Database Connection ---
require('./server/config/db.js');
console.log('Database module loaded');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('Port: ' + PORT);

// --- Middleware ---
app.use(express.json());

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FoodBoxx API is running' });
});

// --- API Routes ---
app.use('/api/auth', require('./server/routes/auth.routes'));

// --- Global Error Handler ---
app.use(require('./server/middleware/error.middleware'));

console.log('Routes and error handler defined');

// --- Start Server ---
app.listen(PORT, () => {
  console.log('FoodBoxx API running at http://localhost:' + PORT);
  console.log('API base: http://localhost:' + PORT + '/api');
});

console.log('Server script complete');