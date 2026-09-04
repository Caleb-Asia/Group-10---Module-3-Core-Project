/* 
  Purpose: Global error handler | Module: middleware 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Returns consistent JSON, shields internal SQL details and stack traces, and never leaks secrets.
*/

const ApiError = require('../utils/apiError');

module.exports = function (err, req, res, next) {
  // If headers have already been sent to client, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      error: {
        message: err.message,
        details: err.details || null
      }
    });
  }

  // Handle database/syntax/operational errors safely without leaking internals or credentials
  const status = err.status || (err.statusCode ? err.statusCode : 500);
  let message = 'Internal Server Error';

  // Specific common safe messages
  if (status < 500) {
    message = err.message || 'Bad Request';
  } else {
    // Log full error stack on the server console for debugging, but shield the client
    console.error('Unhandled Server Error:', err);
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      details: null
    }
  });
};