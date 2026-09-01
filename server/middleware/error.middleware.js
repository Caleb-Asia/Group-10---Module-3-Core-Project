/* 
  Purpose: Global error handler | Module: middleware 
  Owner: Adam | Created: 1 Sep 2026 
*/

const ApiError = require('../utils/apiError');

module.exports = function (err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      error: { message: err.message, details: err.details || null }
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    success: false,
    error: { message }
  });
};