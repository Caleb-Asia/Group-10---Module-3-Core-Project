/* 
  Purpose: Shared UI helpers for SweetAlert2.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Notes: Centralizes notification styles to match the brand colors.
*/
import Swal from 'sweetalert2';

// Success Toast
export const showSuccess = (title, text = '') => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end'
  });
};

// Error Alert
export const showError = (title, text = '') => {
  Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonColor: '#F26A1B'
  });
};

// Warning Alert
export const showWarning = (title, text = '') => {
  Swal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonColor: '#F26A1B'
  });
};

// Confirmation Dialog (e.g., for removing items)
export const showConfirm = (title, text, confirmButtonText = 'Yes, proceed') => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#F26A1B',
    cancelButtonColor: '#0F2137',
    confirmButtonText
  });
};