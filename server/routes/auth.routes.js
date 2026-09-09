/* 
  Purpose: Authentication routes | Module: routes 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Public registration and login, protected profile retrieval and update.
*/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateEmail, validatePassword } = require('../middleware/validate.middleware');

// Public endpoints
router.post('/register', validateEmail, validatePassword, authController.register);
router.post('/login', validateEmail, validatePassword, authController.login);

// Protected endpoints
router.get('/me', authMiddleware, authController.getProfile);
router.patch('/me', authMiddleware, authController.updateProfile);

module.exports = router;
