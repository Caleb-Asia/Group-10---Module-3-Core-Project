/*
  Purpose: Express server entry point for FoodBoxx | Module: root
  Owner: Adam | Created: 1 Sep 2026
  Notes: Loads env, validates the database, serves the built frontend, mounts API routes, and handles errors.
*/

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const { CORS_ORIGIN } = require('./server/config/app.config');
const pool = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const frontendBuildExists = fs.existsSync(frontendIndexPath);

const corsOptions = {
  origin: CORS_ORIGIN === '*' ? '*' : CORS_ORIGIN.split(',').map(item => item.trim()),
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the Vue production build when it is available.
if (frontendBuildExists) {
  app.use(express.static(frontendDistPath));
} else {
  console.warn(`Frontend build not found at ${frontendDistPath}. Run "npm run build:frontend" to create it.`);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FoodBoxx API is running' });
});

app.use('/api/auth', require('./server/routes/auth.routes'));
// Simulated card payment endpoints.
app.use('/api/payments', require('./server/routes/payment.routes'));
app.use('/api/orders', require('./server/routes/order.routes'));
app.use('/api/subscriptions', require('./server/routes/subscription.routes'));
// Payfast gateway endpoints.
app.use('/api/payments/payfast', require('./server/routes/payfast.routes'));
app.use('/api/products', require('./server/routes/product.routes'));

// Keep unknown API endpoints machine-readable instead of returning the Vue app.
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

// Express 5 requires a named wildcard; this is the equivalent of app.get('*', ...).
app.get('/{*splat}', (req, res) => {
  if (!frontendBuildExists) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Frontend build not found. Run "npm run build:frontend".',
        details: null
      }
    });
  }

  res.sendFile(frontendIndexPath);
});

app.use(require('./server/middleware/error.middleware'));

// Do not accept requests until the required database connection has been verified.
pool.ready.then(() => {
  app.listen(PORT, () => {
    console.log(`FoodBoxx API running at http://localhost:${PORT}`);
  });
});

async function shutdown(signal) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  try {
    await pool.end();
    console.log('MySQL pool closed.');
  } catch (err) {
    console.error('Error closing MySQL pool:', err);
  }
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;
