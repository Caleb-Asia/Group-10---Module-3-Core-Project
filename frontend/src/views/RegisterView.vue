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
            
            <div class="auth-offer">
              🎁 50% off your first box
            </div>

            <div class="auth-visual-content">
              <div class="auth-visual-icon">🍱</div>
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
  /* Matches Login page size */
  padding: 80px 0 20px; 
}

.auth-card {
  background: #F7F5EF;
  border-radius: 14px;
  overflow: hidden;
  border: 0.5px solid #E5E3DA;
  max-width: 900px; 
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
    grid-template-columns: 1.15fr 1fr;
    padding: 0;
  }
}

.auth-form-side {
  background: #FFFFFF;
  border: 0.5px solid #E5E3DA;
  border-radius: 12px;
  padding: 32px 40px; 
}

.auth-title {
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--color-gray-500);
  margin-bottom: 24px;
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

/* Visual Side with Z-Index Image */
.auth-visual-side {
  position: relative;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

.auth-offer {
  position: relative;
  z-index: 3;
  background: var(--color-orange);
  border-radius: 12px;
  padding: 16px;
  align-self: flex-start;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  color: #FFFFFF;
}

.auth-visual-content {
  position: relative;
  z-index: 3;
}

.auth-visual-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(32, 56, 77, 0.8); /* Slightly transparent circle */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 30px;
}

.auth-visual-title {
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: #FFFFFF;
  line-height: 1.4;
  margin-bottom: 8px;
}

.auth-visual-subtext {
  font-size: 14px;
  color: #B8C2CC;
}

.text-uppercase {
  text-transform: uppercase;
}
</style>