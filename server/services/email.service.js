const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return null;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: String(SMTP_PORT || '587') === '465',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD }
  });
  return transporter;
}

async function sendPaymentConfirmation({ email, name, orderId, amount, txnRef }) {
  const mailer = getTransporter();
  if (!mailer) {
    console.warn('Payment confirmation email skipped: SMTP is not configured.');
    return { sent: false };
  }
  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: `FoodBoxx payment confirmation — order FBX-${String(orderId).padStart(6, '0')}`,
    text: `Hi ${name},\n\nYour FoodBoxx payment was successful.\nOrder: FBX-${String(orderId).padStart(6, '0')}\nAmount: R${Number(amount).toFixed(2)}\nTransaction: ${txnRef}\n\nThank you for your order!`,
    html: `<p>Hi ${name},</p><p>Your FoodBoxx payment was successful.</p><p><strong>Order:</strong> FBX-${String(orderId).padStart(6, '0')}<br><strong>Amount:</strong> R${Number(amount).toFixed(2)}<br><strong>Transaction:</strong> ${txnRef}</p><p>Thank you for your order!</p>`
  });
  return { sent: true };
}

module.exports = { sendPaymentConfirmation };
