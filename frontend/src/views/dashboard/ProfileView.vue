<!-- 
  Purpose: Account details editing page.
  Module: Frontend - Views - Dashboard
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Pre-fills data from authStore. Allows updates to basic profile info.
-->
<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-card">
        
        <!-- Page Title -->
        <h1 class="page-title mb-6">My Profile</h1>

        <form @submit.prevent="handleSave">
          <!-- Full Name -->
          <div class="form-group mb-4">
            <label for="fullName" class="form-label">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              v-model="form.name" 
              class="form-input" 
              placeholder="Sipho Ndlovu"
            />
          </div>

          <!-- Email Address -->
          <div class="form-group mb-4">
            <label for="email" class="form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              class="form-input" 
              placeholder="sipho@uct.ac.za"
              disabled
            />
          </div>

          <!-- Dietary Preference -->
          <div class="form-group mb-4">
            <label for="dietaryPreference" class="form-label">Dietary Preference</label>
            <select 
              id="dietaryPreference" 
              v-model="form.dietary_preferences" 
              class="form-input form-select"
            >
              <option value="Standard">Standard</option>
              <option value="Vegan">Vegan</option>
              <option value="Halal">Halal</option>
              <option value="Keto">Keto / Low-Carb</option>
              <option value="Nut-Free">Nut-Free</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>

          <!-- Default Pickup Pod -->
          <div class="form-group mb-6">
            <label for="pickupPod" class="form-label">Default Pickup Pod</label>
            <select 
              id="pickupPod" 
              v-model="form.pickup_pod" 
              class="form-input form-select"
            >
              <option v-for="pod in pickupPods" :key="pod" :value="pod">
                {{ pod }}
              </option>
            </select>
          </div>

          <!-- Save Button -->
          <button type="submit" class="btn btn--primary btn--full save-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner spinner--dark"></span>
            <span v-else>Save Changes</span>
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { showSuccess, showError } from '@/services/ui';

const authStore = useAuthStore();

// Static Pickup Pods
const pickupPods = [
  "UCT Library",
  "Res Hall A",
  "Stellenbosch Neelsie",
  "CPUT Woodstock",
  "Workshop17 Woodstock",
  "Virgin Active Woodstock"
];

// State
const isLoading = ref(false);

// Initialize form with authStore data
const form = reactive({
  name: '',
  email: '',
  dietary_preferences: 'Standard',
  pickup_pod: 'UCT Library'
});

// Lifecycle: Pre-fill data from store on mount
onMounted(() => {
  if (authStore.currentUser) {
    form.name = authStore.currentUser.name || '';
    form.email = authStore.currentUser.email || '';
    form.dietary_preferences = authStore.currentUser.dietary_preferences || 'Standard';
    form.pickup_pod = authStore.currentUser.pickup_pod || 'UCT Library';
  }
});

// Handle Save Changes
const handleSave = async () => {
  isLoading.value = true;
  try {
    // Update locally in the store (Backend integration will come later)
    await authStore.updateProfile({
      name: form.name,
      dietary_preferences: form.dietary_preferences,
      pickup_pod: form.pickup_pod
    });
    
    showSuccess('Profile Updated', 'Your changes have been saved successfully.');
  } catch (error) {
    showError('Update Failed', 'Could not save your changes. Please try again.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.profile-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

.profile-card {
  max-width: 500px;
  margin: 0 auto;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
}

.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  font-size: var(--font-size-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(242, 106, 27, 0.15);
}

.form-input:disabled {
  background: var(--color-gray-100);
  cursor: not-allowed;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.save-btn {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}
</style>