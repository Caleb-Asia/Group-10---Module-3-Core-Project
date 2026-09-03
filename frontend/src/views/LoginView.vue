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
  /* REDUCED the padding significantly */
  padding: 80px 0 20px; 
}

.auth-card {
  background: #F7F5EF;
  border-radius: 14px;
  overflow: hidden;
  border: 0.5px solid #E5E3DA;
  max-width: 900px; /* Slightly smaller to reduce height */
  width: 100%;
  margin: 0 auto;
  box-shadow: var(--shadow-lg);
}

.auth-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
}

.auth-logo {
  font-size: 18px;
  font-weight: var(--font-weight-bold);
}

.auth-header-icon {
  color: #FFFFFF;
  font-size: 20px;
}

.auth-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  padding: 20px; 
}

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
  padding: 32px 40px; /* Reduced padding */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-title {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: 10px;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--color-gray-500);
  margin-bottom: 24px; /* Reduced margin */
  line-height: 1.6;
}

.auth-label {
  font-size: 12px;
  color: #8A8A85;
  margin-bottom: 6px;
  display: block;
}

.auth-input {
  width: 100%;
  background: #F7F5EF;
  border: 1px solid #E5E3DA;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 15px;
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
  font-size: 12px;
  color: var(--color-orange);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.demo-box {
  background: #FFF7ED;
  border: 1px dashed var(--color-orange);
  border-radius: 10px;
  padding: 14px; /* Reduced padding */
  font-size: 14px;
  color: var(--color-gray-700);
  text-align: center;
  line-height: 1.8;
}

.demo-box code {
  background: rgba(242, 106, 27, 0.1);
  color: var(--color-orange);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

/* Visual Side with Z-Index Image */
.auth-visual-side {
  position: relative;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 400px; 
  overflow: hidden;
  border-radius: 0 12px 12px 0;
}

.auth-visual-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1; /* Image behind everything */
}

.auth-visual-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 33, 55, 0.7); /* Semi-transparent navy overlay */
  z-index: 2;
}

.auth-visual-icon {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(32, 56, 77, 0.8); /* Slightly transparent circle */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  font-size: 30px;
}

.auth-visual-content {
  position: relative;
  z-index: 3;
}

.auth-visual-title {
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: #FFFFFF;
  line-height: 1.4;
  margin-bottom: 10px;
}

.auth-visual-subtext {
  font-size: 14px;
  color: #B8C2CC;
}
</style>