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

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  // Actions
  async function login(email, password) {
    try {
      // TEMPORARY MOCK LOGIN (Remove when backend is live!)
      if (email === 'demo@uni.ac.za' && password === '12345678!') {
        const mockUser = {
          id: 1,
          name: 'Demo User',
          email: 'demo@uni.ac.za',
          dietary_preferences: 'Standard',
          pickup_pod: 'UCT Library'
        };
        const mockToken = 'demo-mock-jwt-token';

        token.value = mockToken;
        user.value = mockUser;

        localStorage.setItem('foodboxx_token', mockToken);
        localStorage.setItem('foodboxx_user', JSON.stringify(mockUser));

        return { success: true };
      } else {
        return { 
          success: false, 
          message: 'Invalid credentials. Use demo@uni.ac.za / 12345678!'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Login failed.' 
      };
    }
  }

  // For Demo, allow anyone to register and instantly log them in
  async function register(userData) {
    try {
      const mockUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        dietary_preferences: userData.dietary_preferences || 'Standard',
        pickup_pod: 'UCT Library'
      };
      const mockToken = 'demo-mock-jwt-token';

      token.value = mockToken;
      user.value = mockUser;

      localStorage.setItem('foodboxx_token', mockToken);
      localStorage.setItem('foodboxx_user', JSON.stringify(mockUser));

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: 'Registration failed.' 
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

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('foodboxx_token');
    localStorage.removeItem('foodboxx_user');
  }

  return {
    user,
    token,
    isAuthenticated,
    currentUser,
    login,
    register,
    fetchMe,
    logout
  };
});