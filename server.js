/* 
  Purpose: Express server entry point for FoodBoxx | Module: root 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Loads env, configures CORS, static serving, mounts owned routers, and handles 404s cleanly.
*/

// 1. dotenv loads first before any application configs or database modules
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

// Centralised configuration (validates JWT_SECRET and provides CORS_ORIGIN)
const { CORS_ORIGIN } = require('./server/config/app.config');

// Initialise database connection pool
require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. CORS configured using CORS_ORIGIN
// If CORS_ORIGIN === '*', pass string '*' directly; otherwise split comma-separated origins
const corsOptions = {
  origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map(item => item.trim()),
  credentials: true
};
app.use(cors(corsOptions));

// 3. Body parser middleware
app.use(express.json());

// 4. Static files served from public directory
// TODO: INTEGRATION - In development, Vite runs on port 5173. For production builds, Vite outputs to frontend/dist which should be served here.
app.use(express.static(path.join(__dirname, 'public')));

// 5. Health Check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FoodBoxx API is running' });
});

// 6. Mount owned API Routes
app.use('/api/auth', require('./server/routes/auth.routes'));
app.use('/api/payments', require('./server/routes/payment.routes'));
app.use('/api/orders', require('./server/routes/order.routes'));
app.use('/api/subscriptions', require('./server/routes/subscription.routes'));

// NOTE: /api/products is NOT mounted here yet — pending Michaela's implementation.

// 7. Handle unknown /api/* routes cleanly without Express 5 wildcard router crash
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: {
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
        details: null
      }
    });
  }
  next();
});

// 8. Global Error Handler middleware
app.use(require('./server/middleware/error.middleware'));

// 9. Start Server (single clean startup log)
app.listen(PORT, () => {
  console.log(`FoodBoxx API running at http://localhost:${PORT}`);
});

module.exports = app;