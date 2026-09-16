
import axios from 'axios';
import { API_BASE_URL } from './config';
import Swal from 'sweetalert2'; // BANNED: alert()/confirm() must use SweetAlert2

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = window.__foodboxxToken || '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    if (error.response && error.response.status === 401 && !requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
      // Token expired or invalid -> redirect to login
      delete window.__foodboxxToken;
      
      // Show SweetAlert2 instead of alert
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Please log in again to continue.',
        confirmButtonColor: '#F26A1B'
      }).then(() => {
        window.location.href = '/login'; // Hard redirect to clear state
      });
    }
    return Promise.reject(error);
  }
);

export default api;
