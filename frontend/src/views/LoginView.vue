
<template>
  <div class="auth-page bg-cream py-8">
    <div class="container">
      <div class="auth-card">

        <!-- Navy header -->
        <div class="auth-header bg-navy">
          <div class="auth-logo"><span class="text-orange">Food</span><span class="text-white">Boxx</span></div>
          <div class="auth-header-icon">🛒</div>
        </div>

        <!-- Content: split card -->
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
                  placeholder="aisha@myuct.ac.za"
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

              <!-- Submit -->
              <button type="submit" class="btn btn--primary btn--full" :disabled="isLoading">
                <span v-if="isLoading" class="spinner spinner--dark"></span>
                <span v-else>Log In</span>
              </button>
            </form>
          </div>

          <!-- Visual side -->
          <div class="auth-visual-side">
            <div class="auth-visual-bg"></div>
            <div class="auth-visual-icon">🥗</div>
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
/**
 * LoginView
 * Owner: Caleb Asia
 */
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { showError, showSuccess } from '@/services/ui';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// State
const isLoading = ref(false);
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
});

// Validation
const errors = reactive({});

function validateForm() {
  errors.email = '';
  errors.password = '';
  let isValid = true;

  // Email regex
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
      // Redirect to dashboard or requested page
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
/* 
 * Login Styles (Matches Mockup)
 * Owner: Caleb Asia
 */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.auth-card {
  background: #F7F5EF;
  border-radius: 14px;
  overflow: hidden;
  border: 0.5px solid #E5E3DA;
  max-width: 760px;
  margin: 0 auto;
  box-shadow: var(--shadow-lg);
}

.auth-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 22px;
}

.auth-logo {
  font-size: 15px;
  font-weight: var(--font-weight-bold);
}

.auth-header-icon {
  color: #FFFFFF;
  font-size: 16px;
}

.auth-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  padding: 40px 30px;
}

/* Mobile-first */
@media (min-width: 768px) {
  .auth-body {
    grid-template-columns: 1.1fr 1fr;
    padding: 0;
  }
}

.auth-form-side {
  background: #FFFFFF;
  border: 0.5px solid #E5E3DA;
  border-radius: 12px;
  padding: 32px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-title {
  font-size: 22px;
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 12px;
  color: var(--color-gray-500);
  margin-bottom: 24px;
  line-height: 1.6;
}

.auth-label {
  font-size: 10.5px;
  color: #8A8A85;
  margin-bottom: 5px;
  display: block;
}

.auth-input {
  width: 100%;
  background: #F7F5EF;
  border: 0.5px solid #E5E3DA;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12.5px;
  color: var(--color-navy);
  transition: all var(--transition-fast);
}

.auth-input:focus {
  outline: none;
  border-color: var(--color-orange);
  background: #FFFFFF;
}

.auth-input--error {
  border-color: var(--color-error);
}

.auth-link {
  font-size: 10.5px;
  color: var(--color-orange);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

/* Visual Side */
.auth-visual-side {
  background: var(--color-navy);
  border-radius: 0 12px 12px 0;
  position: relative;
  padding: 26px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 260px;
  overflow: hidden;
  margin-top: 20px;
}

@media (min-width: 768px) {
  .auth-visual-side {
    margin-top: 0;
  }
}

.auth-visual-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1D3348 0%, #0F1F2C 100%);
}

.auth-visual-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #20384D;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-size: 26px;
}

.auth-visual-content {
  position: relative;
  z-index: 1;
}

.auth-visual-title {
  font-size: 16px;
  font-weight: var(--font-weight-bold);
  color: #FFFFFF;
  line-height: 1.3;
  margin-bottom: 6px;
}

.auth-visual-subtext {
  font-size: 10.5px;
  color: #B8C2CC;
}
</style>