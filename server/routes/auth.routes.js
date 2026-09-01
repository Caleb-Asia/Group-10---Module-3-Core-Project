/* 
  Purpose: Authentication routes | Module: routes 
  Owner: Adam | Created: 1 Sep 2026 
*/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getProfile);
router.patch('/me', authMiddleware, authController.updateProfile);

module.exports = router;