/* 
  Purpose: QR Code generation utility.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Used on ConfirmationView.vue to render the pickup QR token.
*/
import QRCode from 'qrcode';

// Generate a Data URL (image) from a token string
export async function generateQRCode(token) {
  try {
    // Options for styling (matches design tokens)
    const opts = {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#0F2137', // Navy
        light: '#FFFFFF' // White
      },
      width: 250
    };

    // Returns a base64 image string
    return await QRCode.toDataURL(token, opts);
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw err;
  }
}