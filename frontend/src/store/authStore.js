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
  const user = ref(null);
  const token = ref('');

  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  function persistSession(nextToken, nextUser) {
    token.value = nextToken;
    user.value = nextUser;

    window.__foodboxxToken = nextToken;
    window.__foodboxxUser = nextUser;
    window.dispatchEvent(new Event('foodboxx-auth-changed'));
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
        name: String(userData.name || '').trim(),
        email: String(userData.email || '').trim().toLowerCase(),
        password: String(userData.password || ''),
        dietary_preferences: Array.isArray(userData.dietary_preferences)
          ? userData.dietary_preferences.map(item => String(item).trim().toLowerCase()).join(',')
          : String(userData.dietary_preferences || 'standard').trim().toLowerCase()
      };

      const response = await api.post('/auth/register', payload);
      const registerData = response?.data || {};

      if (!registerData.success) {
        return { success: false, message: registerData?.error?.message || 'Registration failed.' };
      }

      const loginResult = await login(payload.email, payload.password);
      if (!loginResult.success) {
        return {
          success: false,
          message: 'Account created successfully. Please log in with your new account.'
        };
      }

      return { success: true, user: loginResult.user, token: loginResult.token };
    } catch (error) {
      const message = error?.response?.data?.error?.message || error?.message || 'Registration failed.';
      return { success: false, message };
    }
  }

  async function fetchMe() {
    try {
      const response = await api.get('/auth/me');
      const profile = response.data.user || response.data;
      user.value = profile;
      window.dispatchEvent(new Event('foodboxx-auth-changed'));
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async function init() {
    if (token.value && !user.value) {
      try { await fetchMe(); } catch (error) { if (error?.response?.status === 401) logout(); }
    }
  }

  async function updateProfile(updates) {
    try {
      const response = await api.patch('/auth/me', updates);
      const updatedUser = response.data.user || response.data;
      user.value = updatedUser;
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    user.value = null;
    token.value = '';
    delete window.__foodboxxToken;
    delete window.__foodboxxUser;
    window.dispatchEvent(new Event('foodboxx-auth-changed'));
  }

  return {
    user,
    token,
    isAuthenticated,
    currentUser,
    login,
    register,
    fetchMe,
    init,
    updateProfile,
    logout
  };
});
