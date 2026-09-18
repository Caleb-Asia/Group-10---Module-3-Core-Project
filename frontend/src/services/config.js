/* 
  Purpose: Centralized configuration for the frontend.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Notes: Holds API base URL and app-wide design tokens.
*/
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Static Pickup Pods (Will be used in Checkout)
export const PICKUP_PODS = [
  "UCT Library",
  "Res Hall A",
  "Stellenbosch Neelsie",
  "CPUT Woodstock",
  "Workshop17 Woodstock",
  "Virgin Active Woodstock"
];
