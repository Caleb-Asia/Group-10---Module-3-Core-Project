<!-- 
  Purpose: Register page UI and Logic with Light/Dark support.
  Module: View - Register
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Uses authStore. Validates inputs. Links to Login.
-->
<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card">

        <div class="auth-body">
          
          <!-- Form side -->
          <div class="auth-form-side">
            <h2 class="auth-title">Create your account</h2>
            <p class="auth-subtitle">
              Already have one? <router-link to="/login" class="text-orange fw-semibold">Log in</router-link>
            </p>

            <form @submit.prevent="handleRegister">
              <!-- Name & Email -->
              <div class="row-grid mb-4">
                <div class="form-group">
                  <label class="auth-label">Full name</label>
                  <input 
                    type="text" 
                    v-model="form.name" 
                    class="auth-input" 
                    placeholder="Aisha Adams"
                    :class="{ 'auth-input--error': errors.name }"
                  />
                  <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
                </div>
                <div class="form-group">
                  <label class="auth-label">Email</label>
                  <input 
                    type="email" 
                    v-model="form.email" 
                    class="auth-input" 
                    placeholder="aisha@myuct.ac.za"
                    :class="{ 'auth-input--error': errors.email }"
                  />
                  <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
                </div>
              </div>

              <!-- Password & Confirm -->
              <div class="row-grid mb-4">
                <div class="form-group">
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
                <div class="form-group">
                  <label class="auth-label">Confirm password</label>
                  <input 
                    type="password" 
                    v-model="form.confirmPassword" 
                    class="auth-input" 
                    placeholder="••••••••"
                    :class="{ 'auth-input--error': errors.confirmPassword }"
                  />
                  <span v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</span>
                </div>
              </div>

              <!-- Dietary Preferences -->
              <div class="mb-4">
                <label class="auth-label text-uppercase">Dietary Preference</label>
                <div class="dietary-chips">
                  <button 
                    v-for="tag in dietaryOptions" 
                    :key="tag"
                    type="button"
                    class="chip chip--filter"
                    :class="{ active: form.dietary_preferences.includes(tag) }"
                    @click="toggleDietary(tag)"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>

              <!-- Submit -->
              <button type="submit" class="btn btn--primary btn--full" :disabled="isLoading">
                <span v-if="isLoading" class="spinner spinner--dark"></span>
                <span v-else>Create Account</span>
              </button>
            </form>
          </div>

          <!-- Visual side with Image Background -->
          <div class="auth-visual-side">
            <img src="/images/vegan-box.png" class="auth-visual-bg" alt="Food background" />
            <div class="auth-visual-overlay"></div>
            
            <div class="auth-logo-inner">
              <span class="auth-logo-food">Food</span><span class="auth-logo-boxx">Boxx</span>
            </div>
            
            <div class="auth-visual-content">
              <div class="auth-visual-title">
                Join 30,000+ students<br/>already eating better
              </div>
              <div class="auth-visual-subtext">6 pickup pods across Cape Town · 4.8★ average rating</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { showError, showSuccess } from '@/services/ui';

const authStore = useAuthStore();
const router = useRouter();

const isLoading = ref(false);
const dietaryOptions = ['Standard', 'Vegan', 'Halal', 'Keto', 'Nut-Free', 'Gluten-Free'];

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  dietary_preferences: []
});

const errors = reactive({});

function toggleDietary(tag) {
  const index = form.dietary_preferences.indexOf(tag);
  if (index > -1) {
    form.dietary_preferences.splice(index, 1);
  } else {
    form.dietary_preferences.push(tag);
  }
}

function validateForm() {
  errors.name = '';
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';
  let isValid = true;

  if (!form.name.trim()) {
    errors.name = 'Full name is required.';
    isValid = false;
  }

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
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
    isValid = false;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
    isValid = false;
  }

  return isValid;
}

async function handleRegister() {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    const result = await authStore.register(form);
    if (result.success) {
      showSuccess('Account Created', 'Welcome to FoodBoxx!');
      router.push('/');
    } else {
      showError('Registration Failed', result.message);
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
    grid-template-columns: 1.15fr 1fr;
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
  margin-bottom: 8px;
}

/* DARK MODE - White Text */
[data-theme="dark"] .auth-title {
  color: #FFFFFF;
}

.auth-subtitle {
  font-size: 14px;
  /* LIGHT MODE - Grey Text */
  color: var(--color-gray-500);
  margin-bottom: 24px;
}

/* DARK MODE - Light Grey Text */
[data-theme="dark"] .auth-subtitle {
  color: var(--color-gray-400);
}

.row-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 500px) {
  .row-grid {
    grid-template-columns: 1fr 1fr;
  }
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

.dietary-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
  font-size: 16px;
  width: 100%;
  border: none;
  cursor: pointer;
}

.btn--primary {
  background: var(--color-orange);
  color: var(--color-white);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--primary:hover {
  background: var(--color-orange-hover);
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
  margin-bottom: 8px;
}

.auth-visual-subtext {
  position: relative;
  z-index: 3;
  font-size: 14px;
  color: #B8C2CC;
}

.text-uppercase {
  text-transform: uppercase;
}
</style>