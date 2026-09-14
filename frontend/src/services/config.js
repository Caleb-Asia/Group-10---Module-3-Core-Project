/* 
  Purpose: Centralized configuration for the frontend.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Notes: Holds API base URL and app-wide design tokens.
*/
export const API_BASE_URL = 'http://localhost:3000/api';

// Design Tokens (from approved mockups)
export const COLORS = {
  NAVY: '#0F2137',
  ORANGE: '#F26A1B',
  CREAM: '#f8f9fa'
};

// Static Pickup Pods (Will be used in Checkout)
export const PICKUP_PODS = [
  "UCT Library",
  "Res Hall A",
  "Stellenbosch Neelsie",
  "CPUT Woodstock",
  "Workshop17 Woodstock",
  "Virgin Active Woodstock"
];