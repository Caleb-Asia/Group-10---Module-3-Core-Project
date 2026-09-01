/* 
  Purpose: Authentication controller | Module: controllers 
  Owner: Adam | Created: 1 Sep 2026 
*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model');
const { JWT_SECRET, JWT_EXPIRY, BCRYPT_ROUNDS } = require('../config/app.config');
const ApiError = require('../utils/apiError');

const authController = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, dietary_preferences = 'standard' } = req.body;

      if (!name || !email || !password) {
        throw new ApiError(400, 'Name, email, and password are required');
      }

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        throw new ApiError(409, 'User already exists with this email');
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const userId = await UserModel.create(name, email, hashedPassword, dietary_preferences);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        userId
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
      }

      const user = await UserModel.findByEmail(email);
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

  updateProfile: async (req, res, next) => {
    try {
      const { name, email, dietary_preferences } = req.body;

      if (email) {
        const existing = await UserModel.findByEmail(email);
        if (existing && existing.id !== req.userId) {
          throw new ApiError(409, 'Email already in use by another account');
        }
      }

      await UserModel.update(req.userId, { name, email, dietary_preferences });
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