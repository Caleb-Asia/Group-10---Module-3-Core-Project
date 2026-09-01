/* 
  Purpose: Custom error class for consistent API error responses | Module: utils 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Used in controllers to throw errors with status codes
*/

class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;