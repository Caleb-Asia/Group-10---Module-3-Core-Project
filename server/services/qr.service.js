/* 
  Purpose: Generate unique QR pickup tokens for orders | Module: services 
  Owner: Adam | Created: 2 Sep 2026 
  Notes: Uses crypto.randomBytes to produce a highly random, collision-resistant hex string.
*/

const crypto = require('crypto');
const { QR_TOKEN_LENGTH } = require('../config/app.config');

const qrService = {
  generateToken: () => {
    // Step 1: Use crypto.randomBytes to generate 'QR_TOKEN_LENGTH' random bytes
    // QR_TOKEN_LENGTH is defined in app.config.js as 32 (bytes).
    // The .toString('hex') converts those bytes into a hexadecimal string
    // (each byte becomes 2 hex characters, so 32 bytes => 64 hex chars).
    const token = crypto.randomBytes(QR_TOKEN_LENGTH).toString('hex');

    // Step 2: Return the token (it's unique enough for our project)
    return token;
  }
};

module.exports = qrService;