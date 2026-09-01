/* 
  Purpose: Pinia store for managing user authentication state.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Notes: Handles login, register, logout. Exposes `isAuthenticated` for NavBar.
*/
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(JSON.parse(localStorage.getItem('foodboxx_user') || 'null'));
  const token = ref(localStorage.getItem('foodboxx_token') || '');

  // Getters - NavBar uses `isAuthenticated`
  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  // Actions
  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      token.value = response.data.token;
      user.value = response.data.user;

      // Persist to localStorage
      localStorage.setItem('foodboxx_token', token.value);
      localStorage.setItem('foodboxx_user', JSON.stringify(user.value));

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Check your credentials.' 
      };
    }
  }

  async function register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        token.value = response.data.token;
        user.value = response.data.user;
        localStorage.setItem('foodboxx_token', token.value);
        localStorage.setItem('foodboxx_user', JSON.stringify(user.value));
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed.' 
      };
    }
  }

  async function fetchMe() {
    try {
      const response = await api.get('/auth/me');
      user.value = response.data;
      localStorage.setItem('foodboxx_user', JSON.stringify(user.value));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function updateProfile(profileData) {
    try {
      const response = await api.patch('/auth/me', profileData);
      user.value = response.data;
      localStorage.setItem('foodboxx_user', JSON.stringify(user.value));
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('foodboxx_token');
    localStorage.removeItem('foodboxx_user');
  }

  return {
    user,
    token,
    isAuthenticated, // NavBar expects this
    currentUser,
    login,
    register,
    fetchMe,
    updateProfile,
    logout
  };
});