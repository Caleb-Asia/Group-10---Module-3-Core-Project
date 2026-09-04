<!-- 
  Purpose: Login page UI and Logic with Light/Dark support.
  Module: View - Login
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Uses authStore. Validates inputs. Links to Register.
-->
<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card">

        <div class="auth-body">
          
          <!-- Form side -->
          <div class="auth-form-side">
            <h2 class="auth-title">Log in to FoodBoxx</h2>
            <p class="auth-subtitle">
              Welcome back — pick up where you left off,<br/>
              or <router-link to="/register" class="text-orange fw-semibold">create an account</router-link>.
            </p>

            <form @submit.prevent="handleLogin">
              <!-- Email -->
              <div class="form-group mb-4">
                <label class="auth-label">Email</label>
                <input 
                  type="email" 
                  v-model="form.email" 
                  class="auth-input" 
                  placeholder="demo@uni.ac.za"
                  :class="{ 'auth-input--error': errors.email }"
                />
                <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
              </div>

              <!-- Password -->
              <div class="form-group mb-4">
                <label class="auth-label">Password</label>
                <input 
                  type="password" 
                  v-model="form.password" 
                  class="auth-input" 
                  placeholder="••••••••"
                  :class="{ 'auth-input--error': errors.password }"
                />
                <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
              </div>

              <!-- Remember / Forgot -->
              <div class="d-flex align-center justify-between mb-6">
                <div class="form-checkbox">
                  <input type="checkbox" id="remember" v-model="form.rememberMe" />
                  <label for="remember">Remember me</label>
                </div>
                <span class="auth-link">Forgot password?</span>
              </div>

              <!-- Demo Credentials Box -->
              <div class="demo-box mb-6">
                <strong>Demo Credentials:</strong><br>
                Email: <code>demo@uni.ac.za</code><br>
                Password: <code>12345678!</code>
              </div>

              <!-- Submit -->
              <button type="submit" class="btn btn--primary btn--full" :disabled="isLoading">
                <span v-if="isLoading" class="spinner spinner--dark"></span>
                <span v-else>Log In</span>
              </button>
            </form>
          </div>

          <!-- Visual side with Image Background -->
          <div class="auth-visual-side">
            <img src="/images/standard-box.png" class="auth-visual-bg" alt="Food background" />
            <div class="auth-visual-overlay"></div>
            
            <div class="auth-logo-inner">
              <span class="auth-logo-food">Food</span><span class="auth-logo-boxx">Boxx</span>
            </div>
            
            <div class="auth-visual-content">
              <div class="auth-visual-title">
                Fuel your study session —<br/>
                <span class="text-orange">not your food coma.</span>
              </div>
              <div class="auth-visual-subtext">Performance meal boxes, picked up on campus.</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { showError, showSuccess } from '@/services/ui';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const errors = reactive({});

function validateForm() {
  errors.email = '';
  errors.password = '';
  let isValid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = 'Email is required.';
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Password is required.';
    isValid = false;
  }

  return isValid;
}

async function handleLogin() {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    const result = await authStore.login(form.email, form.password);
    if (result.success) {
      showSuccess('Login Successful', 'Welcome back!');
      const redirect = route.query.redirect || '/dashboard';
      router.push(redirect);
    } else {
      showError('Login Failed', result.message);
    }
  } catch (error) {
    showError('Error', 'An unexpected error occurred.');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  /* LIGHT MODE - Cream Background */
  background-color: var(--color-cream); 
  padding: 100px 0 40px; 
}

/* DARK MODE - Deep Navy Background */
[data-theme="dark"] .auth-page {
  background-color: #0B1120;
}

.auth-card {
  max-width: 950px; 
  width: 100%;
  margin: 0 auto;
  box-shadow: var(--shadow-2xl);
  /* LIGHT MODE - White Card */
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: var(--radius-2xl);
  overflow: hidden;
}

/* DARK MODE - Dark Card */
[data-theme="dark"] .auth-card {
  background: #1A2436;
  border-color: #2D3748;
}

.auth-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

@media (min-width: 768px) {
  .auth-body {
    grid-template-columns: 1.1fr 1fr;
  }
}

/* Form Side */
.auth-form-side {
  /* LIGHT MODE - White background */
  background: #FFFFFF;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* DARK MODE - Dark Card */
[data-theme="dark"] .auth-form-side {
  background: #1A2436;
}

.auth-title {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  /* LIGHT MODE - Dark Navy Text */
  color: var(--color-navy);
  margin-bottom: 10px;
}

/* DARK MODE - White Text */
[data-theme="dark"] .auth-title {
  color: #FFFFFF;
}

.auth-subtitle {
  font-size: 14px;
  /* LIGHT MODE - Grey Text */
  color: var(--color-gray-500);
  margin-bottom: 32px;
  line-height: 1.6;
}

/* DARK MODE - Light Grey Text */
[data-theme="dark"] .auth-subtitle {
  color: var(--color-gray-400);
}

.auth-label {
  font-size: 12px;
  color: var(--color-gray-600);
  margin-bottom: 6px;
  display: block;
}

[data-theme="dark"] .auth-label {
  color: var(--color-gray-400);
}

.auth-input {
  width: 100%;
  /* LIGHT MODE - Input style */
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 15px;
  color: var(--color-navy);
  transition: all var(--transition-fast);
}

/* DARK MODE - Input style */
[data-theme="dark"] .auth-input {
  background: #0B1120;
  border-color: #2D3748;
  color: #FFFFFF;
}

.auth-input:focus {
  outline: none;
  border-color: var(--color-orange);
  background: var(--color-white);
}

[data-theme="dark"] .auth-input:focus {
  background: #0B1120;
}

.auth-input--error {
  border-color: var(--color-error);
}

.auth-link {
  font-size: 12px;
  color: var(--color-orange);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.demo-box {
  /* LIGHT MODE - Orange tint box */
  background: #FFF7ED;
  border: 1px dashed var(--color-orange);
  border-radius: 10px;
  padding: 14px; 
  font-size: 14px;
  color: var(--color-gray-700);
  text-align: center;
  line-height: 1.8;
}

/* DARK MODE - Dark Orange tint box */
[data-theme="dark"] .demo-box {
  background: rgba(242, 106, 27, 0.1);
  color: var(--color-gray-200);
}

.demo-box code {
  background: rgba(242, 106, 27, 0.1);
  color: var(--color-orange);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

/* Logo inside Visual Side */
.auth-logo-inner {
  position: relative;
  z-index: 3;
  font-weight: var(--font-weight-bold);
  font-size: 20px;
  margin-bottom: 20px;
}

.auth-logo-food {
  color: #FFFFFF !important;
}

.auth-logo-boxx {
  color: var(--color-orange) !important;
}

/* Visual Side */
.auth-visual-side {
  position: relative;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 500px; 
  overflow: hidden;
  border-radius: 0 12px 12px 0;
}

.auth-visual-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1; 
}

.auth-visual-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 33, 55, 0.8); 
  z-index: 2;
}

.auth-visual-title {
  position: relative;
  z-index: 3;
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: #FFFFFF;
  line-height: 1.4;
  margin-bottom: 10px;
}

.auth-visual-subtext {
  position: relative;
  z-index: 3;
  font-size: 14px;
  color: #B8C2CC;
}
</style>