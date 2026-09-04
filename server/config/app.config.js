/* 
  Purpose: Application-wide configuration and constants | Module: config 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Centralised config for JWT, CORS, QR token length. Fails fast if JWT_SECRET is missing.
*/

// Critical Security Fix: Ensure JWT_SECRET is strictly provided in environment variables
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
  console.error('FATAL CONFIG ERROR: JWT_SECRET environment variable is required and cannot be empty.');
  process.exit(1);
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: '2h',
  QR_TOKEN_LENGTH: 32,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  BCRYPT_ROUNDS: 10
};