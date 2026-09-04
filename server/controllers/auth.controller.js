/* 
  Purpose: Authentication controller | Module: controllers 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Manages user registration, login, and profile operations with bcrypt, JWT, and strict validation.
*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');
const { JWT_SECRET, JWT_EXPIRY, BCRYPT_ROUNDS } = require('../config/app.config');
const ApiError = require('../utils/apiError');

// Valid dietary preferences corresponding to MySQL SET
const VALID_DIETARY_OPTIONS = new Set(['standard', 'vegan', 'halal', 'keto', 'nut-free', 'gluten-free']);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates and cleans dietary preference string against the whitelist
 * @param {string} pref - Comma-delimited or single dietary preference
 * @returns {string} - Cleaned preference string
 */
function validateDietaryPreferences(pref) {
  if (!pref) return 'standard';
  const items = String(pref).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  if (items.length === 0) return 'standard';

  for (const item of items) {
    if (!VALID_DIETARY_OPTIONS.has(item)) {
      throw new ApiError(400, `Invalid dietary preference: "${item}". Allowed values: ${Array.from(VALID_DIETARY_OPTIONS).join(', ')}`);
    }
  }
  return items.join(',');
}

const authController = {
  /**
   * Register a new user
   */
  register: async (req, res, next) => {
    try {
      const { name, email, password, dietary_preferences } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new ApiError(400, 'Name is required');
      }

      if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        throw new ApiError(400, 'A valid email address is required');
      }

      if (!password || typeof password !== 'string' || password.length < 8) {
        throw new ApiError(400, 'Password is required and must be at least 8 characters long');
      }

      const cleanDietary = validateDietaryPreferences(dietary_preferences);
      const cleanEmail = email.trim().toLowerCase();

      const existing = await UserModel.findByEmail(cleanEmail);
      if (existing) {
        throw new ApiError(409, 'User already exists with this email');
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const userId = await UserModel.create(name.trim(), cleanEmail, hashedPassword, cleanDietary);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        userId
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login an existing user
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const user = await UserModel.findByEmail(cleanEmail);
      if (!user) {
        throw new ApiError(401, 'Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          dietary_preferences: user.dietary_preferences
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get authenticated user profile
   */
  getProfile: async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          dietary_preferences: user.dietary_preferences
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update authenticated user profile
   */
  updateProfile: async (req, res, next) => {
    try {
      const { name, email, dietary_preferences } = req.body;
      const updates = {};

      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim() === '') {
          throw new ApiError(400, 'Name cannot be empty');
        }
        updates.name = name.trim();
      }

      if (email !== undefined) {
        const cleanEmail = String(email).trim().toLowerCase();
        if (!EMAIL_REGEX.test(cleanEmail)) {
          throw new ApiError(400, 'A valid email address is required');
        }
        const existing = await UserModel.findByEmail(cleanEmail);
        if (existing && existing.id !== req.userId) {
          throw new ApiError(409, 'Email already in use by another account');
        }
        updates.email = cleanEmail;
      }

      if (dietary_preferences !== undefined) {
        updates.dietary_preferences = validateDietaryPreferences(dietary_preferences);
      }

      await UserModel.update(req.userId, updates);
      const updatedUser = await UserModel.findById(req.userId);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          dietary_preferences: updatedUser.dietary_preferences
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;