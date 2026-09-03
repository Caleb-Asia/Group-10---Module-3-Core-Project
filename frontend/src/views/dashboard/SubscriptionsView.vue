<!-- 
  Purpose: Manage active subscription settings.
  Module: Frontend - Views - Dashboard
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Allows Pause/Resume/Cancel and switching between meal boxes.
-->
<template>
  <div class="subscriptions-page">
    <div class="container">
      
      <!-- Page Header -->
      <h1 class="page-title mb-8">My Subscription</h1>

      <!-- Active Subscription Card (Centered & Wider) -->
      <div class="subscription-card">
        <div class="d-flex justify-between align-center mb-4">
          <div class="subscription-status">
            <span class="status-dot"></span> ACTIVE SUBSCRIPTION
          </div>
          <div class="subscription-price">R79/wk</div>
        </div>

        <h3 class="text-navy mb-1">{{ currentBoxName }}</h3>
        <p class="text-muted small mb-5">Weekly delivery · UCT Library Pod</p>

        <!-- Next Charge & Pickup Info -->
        <div class="info-row mb-6">
          <div class="info-block">
            <span class="info-label">NEXT CHARGE</span>
            <span class="info-value">Mon, 2 Sep 2026</span>
          </div>
          <div class="info-block">
            <span class="info-label">PICKUP POD</span>
            <span class="info-value">UCT Library</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-grid">
          <button class="action-btn" @click="handleAction('pause')">Pause for a week</button>
          <button class="action-btn" @click="openSwitchBoxModal">Switch Box</button>
          <button class="action-btn" @click="handleAction('resume')">Resume</button>
          <button class="action-btn cancel-btn" @click="handleAction('cancel')">Cancel</button>
        </div>
      </div>

      <!-- Switch Box Modal -->
      <div v-if="showSwitchModal" class="modal-overlay" @click.self="closeSwitchBoxModal">
        <div class="switch-modal">
          <div class="d-flex justify-between align-center mb-4">
            <h3 class="text-navy mb-0">Choose your new box</h3>
            <button class="close-btn" @click="closeSwitchBoxModal">×</button>
          </div>

          <div class="box-options">
            <div 
              v-for="box in availableBoxes" 
              :key="box.id"
              :class="['box-option', { 'box-option--selected': currentBoxId === box.id }]"
              @click="selectBox(box)"
            >
              <div>
                <span class="box-name">{{ box.name }}</span>
                <span class="box-price">R{{ box.price }}/wk</span>
              </div>
              <span v-if="currentBoxId === box.id" class="selected-check">✓</span>
            </div>
          </div>

          <button class="btn btn--primary btn--full mt-6" @click="confirmSwitch">
            Confirm Switch
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { showSuccess, showConfirm } from '@/services/ui';

// Mock available boxes for switching
const availableBoxes = [
  { id: 'standard', name: 'Standard Box', price: 79 },
  { id: 'premium', name: 'Premium Box', price: 99 },
  { id: 'vegan', name: 'Vegan Boost Box', price: 79 },
  { id: 'keto', name: 'Keto Fuel Box', price: 89 },
];

// State
const currentBoxId = ref('standard');
const showSwitchModal = ref(false);

const currentBoxName = computed(() => {
  const box = availableBoxes.find(b => b.id === currentBoxId.value);
  return box ? box.name : 'Standard Box';
});

const openSwitchBoxModal = () => {
  showSwitchModal.value = true;
};

const closeSwitchBoxModal = () => {
  showSwitchModal.value = false;
};

const selectBox = (box) => {
  currentBoxId.value = box.id;
};

const confirmSwitch = () => {
  showSwitchModal.value = false;
  showSuccess('Box Switched!', `You have switched to the ${currentBoxName.value}.`);
};

const handleAction = (action) => {
  switch(action) {
    case 'pause':
      showSuccess('Subscription Paused', 'We will not charge you next week.');
      break;
    case 'resume':
      showSuccess('Subscription Resumed', 'Your box is back on track!');
      break;
    case 'cancel':
      showConfirm('Cancel Subscription?', 'Are you sure you want to cancel?', 'Yes, cancel').then((result) => {
        if (result.isConfirmed) {
          showSuccess('Cancelled', 'Your subscription has been cancelled.');
        }
      });
      break;
  }
};
</script>

<style scoped>
.subscriptions-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

.container {
  max-width: 800px; /* Much wider card */
  width: 100%;
  margin: 0 auto; /* Centers the container on the page */
  padding: 0 var(--spacing-4);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  text-align: center;
  margin-bottom: var(--spacing-8);
}

/* Bigger, Centered Subscription Card */
.subscription-card {
  background: #FFF7ED;
  border-radius: var(--radius-2xl);
  border: 1px solid #FED7AA;
  box-shadow: var(--shadow-lg);
  width: 100%;
  padding: var(--spacing-10) var(--spacing-8); /* Much more internal padding */
}

.subscription-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-success);
  text-transform: uppercase;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-success);
  display: inline-block;
}

.subscription-price {
  color: var(--color-orange);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-2xl);
}

/* Info Blocks */
.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-6);
  padding: var(--spacing-6);
  background: var(--color-white);
  border-radius: var(--radius-lg);
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.info-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-500);
  text-transform: uppercase;
}

.info-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
}

/* Action Buttons - Even Bigger */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
}

.action-btn {
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  padding: var(--spacing-5);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  color: var(--color-navy);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  border-color: var(--color-orange);
  color: var(--color-orange);
}

.cancel-btn {
  background: #FFF1F2;
  border-color: #FECDD3;
  color: #E11D48;
}

.cancel-btn:hover {
  background: var(--color-error);
  color: var(--color-white);
  border-color: var(--color-error);
}

/* Switch Box Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-4);
}

.switch-modal {
  background: var(--color-white);
  border-radius: var(--radius-2xl);
  padding: var(--spacing-8);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-2xl);
}

.close-btn {
  background: var(--color-gray-100);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 20px;
  cursor: pointer;
  color: var(--color-gray-600);
}

.box-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.box-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.box-option:hover {
  border-color: var(--color-orange);
}

.box-option--selected {
  border-color: var(--color-orange);
  background: rgba(242, 106, 27, 0.05);
}

.box-name {
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  display: block;
}

.box-price {
  font-size: var(--font-size-sm);
  color: var(--color-orange);
}

.selected-check {
  color: var(--color-orange);
  font-weight: bold;
  font-size: 1.5rem;
}

/* Utilities */
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--spacing-1); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-5 { margin-bottom: var(--spacing-5); }
.mb-6 { margin-bottom: var(--spacing-6); }
.mb-8 { margin-bottom: var(--spacing-8); }
.mt-6 { margin-top: var(--spacing-6); }
.small { font-size: var(--font-size-sm); }
.text-navy { color: var(--color-navy); }
.text-muted { color: var(--color-gray-500); }
</style>