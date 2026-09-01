/* 
  Purpose: Application-wide constants | Module: config 
  Owner: Adam | Created: 1 Sep 2026 
  Notes: Centralised config for JWT, CORS, QR token length
*/

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRY: '2h',
  QR_TOKEN_LENGTH: 32,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  BCRYPT_ROUNDS: 10
};