/*
  Purpose: Reusable request validation helpers | Module: utils
  Owner: Michaela | Created: 9 Sep 2026
  Notes: Defines shared primitive validators and approved FoodBoxx pickup-pod values.
*/

// Keep pickup locations in one source of truth for routes and services.
const APPROVED_PICKUP_PODS = Object.freeze([
  'UCT Library',
  'Res Hall A',
  'Stellenbosch Neelsie',
  'CPUT Woodstock',
  'Workshop17 Woodstock',
  'Virgin Active Woodstock'
]);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = email => typeof email === 'string' && emailRegex.test(email.trim());
const isValidPassword = password => typeof password === 'string' && password.length >= 8;
const isValidPrice = price => price !== undefined && price !== null && !Number.isNaN(Number(price)) && Number(price) >= 0;
const isValidQuantity = quantity => Number.isInteger(Number(quantity)) && Number(quantity) > 0;
const isApprovedPickupPod = pickupPod => typeof pickupPod === 'string' && APPROVED_PICKUP_PODS.includes(pickupPod.trim());

// Trim user-entered strings without altering non-string values.
const sanitiseString = value => (typeof value === 'string' ? value.trim() : value);

module.exports = {
  APPROVED_PICKUP_PODS,
  isApprovedPickupPod,
  isValidEmail,
  isValidPassword,
  isValidPrice,
  isValidQuantity,
  sanitiseString
};
