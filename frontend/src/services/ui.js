/* 
  Purpose: Shared UI helpers for SweetAlert2.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Notes: Centralizes notification styles. White background for toasts in all themes.
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
    background: '#FFFFFF', // SOLID WHITE Background
    color: '#000000', // Black Text
    iconColor: '#F26A1B', // Orange Icon
    customClass: {
      popup: 'swal-toast-fix'
    },
    ...(iconHtml && { iconHtml })
  });
};

// Error Alert
export const showError = (title, text = '') => {
  Swal.fire({
    icon: 'error',
    title,
    text,
    background: '#FFFFFF', // SOLID WHITE Background
    color: '#000000', // Black Text
    confirmButtonColor: '#F26A1B'
  });
};

// Warning Alert
export const showWarning = (title, text = '') => {
  Swal.fire({
    icon: 'warning',
    title,
    text,
    background: '#FFFFFF', // SOLID WHITE Background
    color: '#000000', // Black Text
    confirmButtonColor: '#F26A1B'
  });
};

// Confirmation Dialog (e.g., for removing items)
export const showConfirm = (title, text, confirmButtonText = 'Yes, proceed') => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    background: '#FFFFFF', // SOLID WHITE Background
    color: '#000000', // Black Text
    showCancelButton: true,
    confirmButtonColor: '#F26A1B',
    cancelButtonColor: '#0F2137',
    confirmButtonText
  });
};