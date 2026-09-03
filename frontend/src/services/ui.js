/* 
  Purpose: Shared UI helpers for SweetAlert2.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Notes: Centralizes notification styles to match the brand colors.
*/
import Swal from 'sweetalert2';

// Global SweetAlert configuration to force it above the sticky navbar
Swal.mixin({
  customClass: {
    container: 'swal2-container' 
  },
  didOpen: (toast) => {
    // Directly set the style on the DOM element after it opens to guarantee it stays on top
    if (toast) {
      toast.parentElement.style.zIndex = '99999';
    }
  }
});

// Success Toast
export const showSuccess = (title, text = '', iconHtml = '') => {
  Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'bottom-end',
    customClass: {
      popup: 'swal-toast-fix'
    },
    // If iconHtml is provided, it overrides the default checkmark
    ...(iconHtml && { iconHtml })
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