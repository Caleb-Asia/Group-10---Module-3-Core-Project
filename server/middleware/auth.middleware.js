/* 
  Purpose: JWT verification middleware | Module: middleware 
  Owner: Adam | Created: 1 Sep 2026 
*/

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/app.config');
const ApiError = require('../utils/apiError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};