/* 
  Purpose: Generate unique QR pickup tokens for orders | Module: services 
  Owner: Adam | Created: 2 Sep 2026 
  Notes: Uses crypto.randomBytes to produce a collision-resistant, cryptographically secure hex token.
*/

const crypto = require('crypto');
const { QR_TOKEN_LENGTH } = require('../config/app.config');

const qrService = {
  /**
   * Generates a cryptographically secure random hexadecimal token.
   * Uses QR_TOKEN_LENGTH from app.config (default 32 bytes = 64 hex characters).
   * @returns {string} - Secure hex string
   */
  generateToken: () => {
    const byteLength = QR_TOKEN_LENGTH || 32;
    return crypto.randomBytes(byteLength).toString('hex');
  }
};

module.exports = qrService;