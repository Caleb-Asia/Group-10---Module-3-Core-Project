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
  const user = ref(JSON.parse(localStorage.getItem('foodboxx_user') || 'null'));
  const token = ref(localStorage.getItem('foodboxx_token') || '');

  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  function persistSession(nextToken, nextUser) {
    token.value = nextToken;
    user.value = nextUser;

    localStorage.setItem('foodboxx_token', nextToken);
    localStorage.setItem('foodboxx_user', JSON.stringify(nextUser));
  }

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const payload = response.data;

      if (!payload.success || !payload.token || !payload.user) {
        return { success: false, message: 'Login failed.' };
      }

      persistSession(payload.token, payload.user);
      return { success: true, user: payload.user, token: payload.token };
    } catch (error) {
      const message = error?.response?.data?.error?.message || 'Login failed.';
      return { success: false, message };
    }
  }

  async function register(userData) {
    try {
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        dietary_preferences: Array.isArray(userData.dietary_preferences)
          ? userData.dietary_preferences.join(',')
          : userData.dietary_preferences || 'standard'
      };

      await api.post('/auth/register', payload);

      const loginResult = await login(userData.email, userData.password);
      if (!loginResult.success) {
        return { success: false, message: loginResult.message };
      }

      return { success: true, user: loginResult.user, token: loginResult.token };
    } catch (error) {
      const message = error?.response?.data?.error?.message || 'Registration failed.';
      return { success: false, message };
    }
  }

  async function fetchMe() {
    try {
      const response = await api.get('/auth/me');
      const profile = response.data.user || response.data;
      user.value = profile;
      localStorage.setItem('foodboxx_user', JSON.stringify(profile));
      return profile;
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