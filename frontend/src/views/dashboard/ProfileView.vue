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
        <div class="profile-heading">
          <div class="profile-avatar" aria-hidden="true">{{ initials }}</div>
          <div>
            <p class="eyebrow">YOUR FOODBOXX PROFILE</p>
            <h1 class="page-title">My Profile</h1>
            <p class="profile-intro">Keep your details fresh so every box feels made for you.</p>
          </div>
        </div>

        <form @submit.prevent="handleSave">
          <section class="profile-section">
            <div class="section-heading">
              <span class="section-icon"><UserRound :size="18" :stroke-width="2.2" /></span>
              <div>
                <h2>Personal details</h2>
                <p>How we should address you.</p>
              </div>
            </div>

            <div class="form-group">
              <label for="fullName" class="form-label">Full Name</label>
              <div class="input-wrap">
                <UserRound :size="18" class="input-icon" aria-hidden="true" />
                <input
                  type="text"
                  id="fullName"
                  v-model="form.name"
                  class="form-input"
                  placeholder="Sipho Ndlovu"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <div class="input-wrap">
                <Mail :size="18" class="input-icon" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  class="form-input form-input--with-note"
                  placeholder="sipho@uct.ac.za"
                  disabled
                />
                <span class="field-note">Account email</span>
              </div>
            </div>
          </section>

          <section class="profile-section">
            <div class="section-heading">
              <span class="section-icon"><SlidersHorizontal :size="18" :stroke-width="2.2" /></span>
              <div>
                <h2>Box preferences</h2>
                <p>We’ll use these details to personalise your picks.</p>
              </div>
            </div>

            <div class="form-group">
              <label for="dietaryPreference" class="form-label">Dietary Preference</label>
              <div class="input-wrap">
                <Utensils :size="18" class="input-icon" aria-hidden="true" />
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
            </div>

            <div class="form-group">
              <label for="pickupPod" class="form-label">Default Pickup Pod</label>
              <div class="input-wrap">
                <MapPin :size="18" class="input-icon" aria-hidden="true" />
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
            </div>
          </section>

          <div class="form-actions">
            <p><Sparkles :size="16" aria-hidden="true" /> Your preferences shape your next box.</p>
            <button type="submit" class="btn btn--primary btn--full save-btn" :disabled="isLoading">
              <span v-if="isLoading" class="spinner spinner--dark"></span>
              <span v-else>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Mail, MapPin, SlidersHorizontal, Sparkles, UserRound, Utensils } from 'lucide-vue-next';
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

const initials = computed(() => {
  const name = form.name.trim();
  if (!name) return 'FB';
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
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
  padding: var(--spacing-10) 0;
}

.profile-card {
  max-width: 620px;
  margin: 0 auto;
}

.profile-heading {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-8);
}

.profile-avatar {
  display: grid;
  flex: 0 0 72px;
  width: 72px;
  height: 72px;
  place-items: center;
  border: 5px solid var(--color-white);
  border-radius: var(--radius-full);
  background: var(--color-navy);
  box-shadow: 0 0 0 3px rgba(242, 106, 27, 0.25), var(--shadow-md);
  color: var(--color-white);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.04em;
}

.eyebrow {
  margin-bottom: var(--spacing-1);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1em;
}

.page-title {
  margin-bottom: var(--spacing-1);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

.profile-intro {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.profile-section {
  padding: var(--spacing-6);
  border: 1px solid rgba(15, 33, 55, 0.08);
  border-radius: var(--radius-xl);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.profile-section + .profile-section {
  margin-top: var(--spacing-4);
}

.section-heading {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding-bottom: var(--spacing-4);
  margin-bottom: var(--spacing-5);
  border-bottom: 1px solid var(--color-gray-100);
}

.section-icon {
  display: grid;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: var(--radius-md);
  background: rgba(242, 106, 27, 0.1);
  color: var(--color-orange);
}

.section-heading h2 {
  margin-bottom: var(--spacing-1);
  font-size: var(--font-size-lg);
}

.section-heading p {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
}

.form-group + .form-group {
  margin-top: var(--spacing-4);
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: var(--spacing-4);
  z-index: 1;
  color: var(--color-gray-400);
  pointer-events: none;
  transform: translateY(-50%);
}

.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  padding-left: 2.75rem;
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

.form-input--with-note {
  padding-right: 7.5rem;
}

.field-note {
  position: absolute;
  top: 50%;
  right: var(--spacing-4);
  color: var(--color-gray-400);
  font-size: var(--font-size-xs);
  transform: translateY(-50%);
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

.form-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
}

.form-actions p {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex: 1;
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
}

.form-actions p svg {
  flex: 0 0 auto;
  color: var(--color-orange);
}

.form-actions .save-btn {
  flex: 0 0 auto;
  width: auto;
}

@media (max-width: 560px) {
  .profile-page {
    padding: var(--spacing-8) 0;
  }

  .profile-heading {
    align-items: flex-start;
  }

  .profile-avatar {
    flex-basis: 58px;
    width: 58px;
    height: 58px;
    border-width: 4px;
    font-size: var(--font-size-lg);
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }

  .profile-section {
    padding: var(--spacing-4);
  }

  .form-actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .form-actions .save-btn {
    width: 100%;
  }
}
</style>