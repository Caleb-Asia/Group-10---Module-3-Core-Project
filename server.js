/* 
  Purpose: Minimal server test | Owner: Adam | Created: 1 Sep 2026 
*/

console.log(' Starting server...');

require('dotenv').config();
const express = require('express');

console.log(' Dependencies loaded');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(` Port: ${PORT}`);

// --- Health Check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FoodBoxx API is running' });
});

console.log(' Routes defined');

// --- Start Server ---
app.listen(PORT, () => {
  console.log(` FoodBoxx API running at http://localhost:${PORT}`);
  console.log(` API base: http://localhost:${PORT}/api`);
});

console.log(' Server script complete');