/* 
  Purpose: Authentication routes | Module: routes 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Public registration and login, protected profile retrieval and update.
*/

const express = require('express');
const { rateLimit } = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateEmail, validatePassword } = require('../middleware/validate.middleware');

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => res.status(429).json({
    success: false,
    error: {
      message: 'Too many attempts, please try again later',
      details: null
    }
  })
});

// Public endpoints
router.post('/register', authRateLimiter, validateEmail, validatePassword, authController.register);
router.post('/login', authRateLimiter, validateEmail, authController.login);

// Protected endpoints
router.get('/me', authMiddleware, authController.getProfile);
router.patch('/me', authMiddleware, authController.updateProfile);

module.exports = router;
