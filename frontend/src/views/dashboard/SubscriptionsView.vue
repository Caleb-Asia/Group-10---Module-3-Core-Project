<!-- 
  Purpose: Manage active subscription settings with dynamic state.
  Module: Frontend - Views - Dashboard
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Uses local mock state for now. Status machine (active/paused/cancelled) 
         controls button behavior. Easily swap for API calls later.
-->
<template>
  <div class="subscriptions-page">
    <div class="container">
      
      <!-- Page Header -->
      <div class="page-heading">
        <div>
          <span class="eyebrow">YOUR WEEKLY RHYTHM</span>
          <h1 class="page-title">My Subscription</h1>
          <p class="page-intro">Good food, ready when your week gets busy.</p>
        </div>
        <div class="heading-badge" :class="{ 'badge--paused': status === 'paused', 'badge--cancelled': status === 'cancelled' }">
          <span class="status-dot"></span>
          <span>{{ statusBadgeText }}</span>
        </div>
      </div>

      <div class="subscription-stats" aria-label="Subscription overview">
        <div class="stat-card">
          <span class="stat-icon">↗</span>
          <div>
            <span class="stat-label">MEMBER SINCE</span>
            <strong>Sep 2026</strong>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✦</span>
          <div>
            <span class="stat-label">BOXES RECEIVED</span>
            <strong>{{ boxesCompleted }} boxes</strong>
          </div>
        </div>
        <div class="stat-card stat-card--accent">
          <span class="stat-icon">R</span>
          <div>
            <span class="stat-label">THIS MONTH</span>
            <strong>R{{ currentBoxPrice }} spent</strong>
          </div>
        </div>
      </div>

      <div class="subscription-layout">
        <!-- Active Subscription Card -->
        <div class="subscription-card">
          <div class="d-flex justify-between align-center mb-4">
            <div class="subscription-status" :class="{ 'is-paused': status === 'paused', 'is-cancelled': status === 'cancelled' }">
              <span class="status-dot"></span> {{ statusText }}
            </div>
            <div class="subscription-price">R{{ currentBoxPrice }}/wk</div>
          </div>

          <h3 class="subscription-box-name">{{ currentBoxName }}</h3>
          <p class="text-muted small mb-5">Weekly delivery · UCT Library Pod</p>

          <div class="info-row mb-6">
            <div class="info-block">
              <span class="info-label">NEXT CHARGE</span>
              <span class="info-value">{{ status === 'paused' ? 'Paused' : 'Mon, 2 Sep 2026' }}</span>
            </div>
            <div class="info-block">
              <span class="info-label">PICKUP POD</span>
              <span class="info-value">UCT Library</span>
            </div>
          </div>

          <!-- Loyalty Progress (Matches "Every 8th box free") -->
          <div class="delivery-progress">
            <div class="d-flex justify-between align-center mb-2">
              <span class="info-label">LOYALTY PROGRESS</span>
              <span class="progress-note">🎁 Every 8th box free</span>
            </div>
            <div class="progress-track"><span class="progress-fill" :style="{ width: (boxesCompleted / 8) * 100 + '%' }"></span></div>
            <div class="progress-days"><span>{{ boxesCompleted }} of 8 boxes completed</span><span>{{ 8 - boxesCompleted }} to go</span></div>
          </div>

          <!-- Action Buttons (Conditional based on status) -->
          <div class="action-grid">
            <!-- Active -->
            <template v-if="status === 'active'">
              <button class="action-btn" @click="handleAction('pause')">Pause for a week</button>
              <button class="action-btn" @click="openSwitchBoxModal">Switch Box</button>
              <button class="action-btn" @click="handleAction('resume')" disabled>Resume</button>
              <button class="action-btn cancel-btn" @click="handleAction('cancel')">Cancel</button>
            </template>

            <!-- Paused -->
            <template v-else-if="status === 'paused'">
              <button class="action-btn" @click="handleAction('pause')" disabled>Pause for a week</button>
              <button class="action-btn" @click="openSwitchBoxModal">Switch Box</button>
              <button class="action-btn" @click="handleAction('resume')">Resume</button>
              <button class="action-btn cancel-btn" @click="handleAction('cancel')">Cancel</button>
            </template>

            <!-- Cancelled -->
            <template v-else>
              <div class="cancelled-message">
                <strong>Subscription Cancelled</strong>
                <span>You can start a new subscription from the menu.</span>
              </div>
              <button class="action-btn action-btn--full" @click="restartSubscription">Restart Subscription</button>
            </template>
          </div>
        </div>

        <aside class="routine-panel">
          <div class="routine-panel__top">
            <span class="eyebrow">MEMBER PERKS</span>
            <span class="perk-mark">✦</span>
          </div>
          <h2>Keep your momentum.</h2>
          <p class="routine-copy">Your subscription is doing the planning. You just show up hungry.</p>

          <div class="perk-list">
            <div class="perk-item"><span class="perk-icon">✓</span><span>Free weekly delivery</span></div>
            <div class="perk-item"><span class="perk-icon">✓</span><span>Priority pickup windows</span></div>
            <div class="perk-item"><span class="perk-icon">✓</span><span>Flexible box switching</span></div>
          </div>

          <div class="streak-callout">
            <strong>{{ 8 - boxesCompleted }} more boxes</strong>
            <span>Until your next free box is unlocked.</span>
          </div>
        </aside>
      </div>

      <!-- Switch Box Modal (Accessible) -->
      <div v-if="showSwitchModal" class="modal-overlay" @click.self="closeSwitchBoxModal" role="dialog" aria-modal="true">
        <div class="switch-modal">
          <div class="d-flex justify-between align-center mb-4">
            <h3 class="modal-title">Choose your new box</h3>
            <button class="close-btn" @click="closeSwitchBoxModal" aria-label="Close">×</button>
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
import { ref, computed, onMounted } from 'vue';
import { showConfirm, showSuccess, showError } from '@/services/ui';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

// Mock available boxes for switching
const availableBoxes = [
  { id: 'standard', name: 'Standard Box', price: 79 },
  { id: 'premium', name: 'Premium Box', price: 99 },
  { id: 'vegan', name: 'Vegan Boost Box', price: 79 },
  { id: 'keto', name: 'Keto Fuel Box', price: 89 },
];

// --- REACTIVE STATE ---
const currentBoxId = ref('standard');
const subscriptionId = ref(null);
const showSwitchModal = ref(false);
const status = ref('active'); // 'active' | 'paused' | 'cancelled'
const boxesCompleted = ref(3); // Matches the 3/8 loyalty bar

// --- COMPUTED VALUES (Dynamic!) ---
const currentBox = computed(() => availableBoxes.find(b => b.id === currentBoxId.value));
const currentBoxName = computed(() => currentBox.value ? currentBox.value.name : 'Standard Box');
const currentBoxPrice = computed(() => currentBox.value ? currentBox.value.price : 79);

const statusText = computed(() => {
  if (status.value === 'paused') return 'SUBSCRIPTION PAUSED';
  if (status.value === 'cancelled') return 'SUBSCRIPTION CANCELLED';
  return 'ACTIVE SUBSCRIPTION';
});

const statusBadgeText = computed(() => {
  if (status.value === 'paused') return 'Paused';
  if (status.value === 'cancelled') return 'Cancelled';
  return 'All systems go';
});

// --- FUNCTIONS ---
const openSwitchBoxModal = () => { if (status.value !== 'cancelled') showSwitchModal.value = true; };
const closeSwitchBoxModal = () => { showSwitchModal.value = false; };

const selectBox = (box) => {
  currentBoxId.value = box.id;
  showSuccess('Price Updated', `New price: R${currentBoxPrice.value}/wk`);
};

const confirmSwitch = () => {
  showSwitchModal.value = false;
  showSuccess('Box Switched!', `You have switched to the ${currentBoxName.value}.`);
};

const authStore = useAuthStore();

// Load the current subscription state before enabling lifecycle actions.
onMounted(async () => {
  try {
    const response = await api.get('/subscriptions/user/' + authStore.user.id);
    const subscription = response.data.subscription;
    if (!subscription) return;
    subscriptionId.value = subscription.id;
    status.value = subscription.status;
    boxesCompleted.value = subscription.boxes_completed;
    const productBoxMap = { 2: 'standard', 3: 'premium', 4: 'vegan', 5: 'keto' };
    if (productBoxMap[subscription.product_id]) currentBoxId.value = productBoxMap[subscription.product_id];
  } catch (error) {
    // Preserve the existing defaults when the subscription cannot be loaded.
  }
});

const handleAction = async (action) => {
  if (!subscriptionId.value) {
    showError('Subscription unavailable', 'Your subscription could not be loaded.');
    return;
  }
  const endpoint = { pause: 'pause', resume: 'resume', cancel: 'cancel' }[action];
  if (action === 'pause') {
    showConfirm('Pause Subscription?', 'We will not charge you next week. Would you like to continue?', 'Yes, pause it')
      .then(async (result) => {
        if (!result.isConfirmed) return;
        try {
          await api.patch(`/subscriptions/${subscriptionId.value}/${endpoint}`);
          status.value = 'paused';
          showSuccess('Subscription Paused', 'We will not charge you next week.');
        } catch (error) {
          showError('Action failed', 'Your subscription could not be updated.');
        }
      });
  } else if (action === 'resume') {
    try {
      await api.patch(`/subscriptions/${subscriptionId.value}/${endpoint}`);
      status.value = 'active';
      showSuccess('Subscription Resumed', 'Your box is back on track!');
    } catch (error) {
      showError('Action failed', 'Your subscription could not be updated.');
    }
  } else if (action === 'cancel') {
    showConfirm('Cancel Subscription?', 'Are you sure you want to cancel? You will lose your loyalty progress and access to your subscription.', 'Yes, cancel it')
      .then(async (result) => {
        if (!result.isConfirmed) return;
        try {
          await api.patch(`/subscriptions/${subscriptionId.value}/${endpoint}`);
          status.value = 'cancelled';
          showSuccess('Cancelled', 'Your subscription has been cancelled.');
        } catch (error) {
          showError('Action failed', 'Your subscription could not be updated.');
        }
      });
  }
};

const restartSubscription = () => {
  status.value = 'active';
  boxesCompleted.value = 0;
  showSuccess('Subscription Restarted', 'Welcome back! Your loyalty progress has reset.');
};
</script>

<style scoped>
.subscriptions-page {
  background-color: var(--color-cream); 
  min-height: 100vh;
  padding: 120px 0 96px;
  display: flex;
  justify-content: center;
}

.subscriptions-page .container { max-width: 1120px; }

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

.eyebrow {
  display: block;
  margin-bottom: var(--spacing-2);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.12em;
}

.page-title { font-size: clamp(2rem, 4vw, 3.25rem); font-weight: var(--font-weight-bold); color: var(--color-navy); margin-bottom: var(--spacing-2); }
.page-intro { color: var(--color-gray-600); font-size: var(--font-size-lg); margin: 0; }

.heading-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.7);
  color: #047857;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.heading-badge.badge--paused { color: var(--color-warning); border-color: rgba(245, 158, 11, 0.25); }
.heading-badge.badge--cancelled { color: var(--color-error); border-color: rgba(239, 68, 68, 0.25); }

.subscription-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-4); margin-bottom: var(--spacing-6); }

.stat-card {
  display: flex; align-items: center; gap: var(--spacing-4);
  padding: var(--spacing-5); border: 1px solid rgba(15, 33, 55, 0.08);
  border-radius: var(--radius-xl); background: rgba(255, 255, 255, 0.72);
  box-shadow: var(--shadow-sm);
}

.stat-card--accent { background: var(--color-navy); border-color: var(--color-navy); }

.stat-icon {
  display: grid; width: 40px; height: 40px; place-items: center; flex: 0 0 auto;
  border-radius: var(--radius-lg); background: #ffead7; color: var(--color-orange);
  font-size: var(--font-size-lg); font-weight: var(--font-weight-extrabold);
}

.stat-card--accent .stat-icon { background: rgba(255, 255, 255, 0.14); color: #ffd7b5; }
.stat-label { display: block; margin-bottom: var(--spacing-1); color: var(--color-gray-500); font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); letter-spacing: 0.06em; }
.stat-card strong { color: var(--color-navy); font-size: var(--font-size-lg); }
.stat-card--accent .stat-label, .stat-card--accent strong { color: var(--color-white); }

.subscription-layout { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.75fr); gap: var(--spacing-6); align-items: stretch; }

.subscription-card {
  background: #FFF7ED; border-radius: var(--radius-2xl);
  border: 1px solid #FED7AA; box-shadow: var(--shadow-lg);
  width: 100%; padding: var(--spacing-8);
}

.subscription-box-name { font-weight: var(--font-weight-bold); color: var(--color-navy); margin-bottom: var(--spacing-1); }
.subscription-status { display: flex; align-items: center; gap: var(--spacing-2); font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); color: var(--color-success); text-transform: uppercase; }
.subscription-status.is-paused { color: var(--color-warning); }
.subscription-status.is-cancelled { color: var(--color-error); }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; display: inline-block; }
.subscription-price { color: var(--color-orange); font-weight: var(--font-weight-bold); font-size: var(--font-size-2xl); }

.info-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4); padding: var(--spacing-5); background: var(--color-white); border-radius: var(--radius-lg); }
.info-block { display: flex; flex-direction: column; gap: var(--spacing-1); }
.info-label { font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); color: var(--color-gray-500); text-transform: uppercase; }
.info-value { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--color-navy); }

.delivery-progress { margin-bottom: var(--spacing-6); padding-top: var(--spacing-5); border-top: 1px dashed #f2c9a2; }
.progress-note { color: var(--color-orange); font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); }
.progress-track { height: 8px; overflow: hidden; border-radius: var(--radius-full); background: #fce0c6; }
.progress-fill { display: block; height: 100%; border-radius: inherit; background: var(--color-orange); transition: width 0.5s ease; }
.progress-days { display: flex; justify-content: space-between; margin-top: var(--spacing-2); color: var(--color-gray-500); font-size: var(--font-size-xs); }

.action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-4); }

.action-btn {
  background: var(--color-white); border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-full); padding: var(--spacing-4);
  font-weight: var(--font-weight-bold); font-size: var(--font-size-base);
  color: var(--color-navy); cursor: pointer; transition: all var(--transition-fast);
}

.action-btn:hover:not(:disabled) { border-color: var(--color-orange); color: var(--color-orange); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.cancel-btn { background: #FFF1F2; border-color: #FECDD3; color: #E11D48; }
.cancel-btn:hover:not(:disabled) { background: var(--color-error); color: var(--color-white); border-color: var(--color-error); }

.cancelled-message { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 4px; background: #FFF1F2; border-radius: var(--radius-lg); padding: var(--spacing-4); }
.cancelled-message strong { color: var(--color-error); }
.cancelled-message span { color: var(--color-gray-600); font-size: var(--font-size-sm); }
.action-btn--full { grid-column: 1 / -1; }

.routine-panel {
  display: flex; flex-direction: column; padding: var(--spacing-8);
  border-radius: var(--radius-2xl); background: var(--color-navy);
  box-shadow: var(--shadow-lg); color: var(--color-white);
}
.routine-panel__top { display: flex; align-items: center; justify-content: space-between; }
.routine-panel .eyebrow { color: #ffb77d; }
.perk-mark { color: #ffb77d; font-size: var(--font-size-2xl); }
.routine-panel h2 { max-width: 240px; margin: var(--spacing-8) 0 var(--spacing-3); color: var(--color-white); font-size: var(--font-size-2xl); }
.routine-copy { color: #c8d3df; line-height: 1.7; }
.perk-list { display: grid; gap: var(--spacing-4); margin: var(--spacing-8) 0; }
.perk-item { display: flex; align-items: center; gap: var(--spacing-3); color: #f7fafc; font-size: var(--font-size-sm); }
.perk-icon { display: grid; width: 24px; height: 24px; place-items: center; border-radius: 50%; background: rgba(242, 106, 27, 0.2); color: #ffb77d; font-weight: var(--font-weight-bold); }
.streak-callout { display: grid; gap: var(--spacing-1); margin-top: auto; padding: var(--spacing-4); border: 1px solid rgba(255, 183, 125, 0.28); border-radius: var(--radius-lg); background: rgba(255, 255, 255, 0.08); }
.streak-callout strong { color: #ffb77d; }
.streak-callout span { color: #c8d3df; font-size: var(--font-size-xs); }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); z-index: 10000; display: flex; justify-content: center; align-items: center; padding: var(--spacing-4); }
.switch-modal { background: var(--color-white); border-radius: var(--radius-2xl); padding: var(--spacing-8); max-width: 500px; width: 100%; box-shadow: var(--shadow-2xl); }
.modal-title { color: var(--color-navy); }
.close-btn { background: var(--color-gray-100); border: none; border-radius: 50%; width: 30px; height: 30px; font-size: 20px; cursor: pointer; color: var(--color-gray-600); }
.box-options { display: flex; flex-direction: column; gap: var(--spacing-3); }
.box-option { display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-4); border: 2px solid var(--color-gray-200); border-radius: var(--radius-lg); cursor: pointer; transition: all var(--transition-fast); }
.box-option:hover { border-color: var(--color-orange); }
.box-option--selected { border-color: var(--color-orange); background: rgba(242, 106, 27, 0.05); }
.box-name { font-weight: var(--font-weight-bold); color: var(--color-navy); display: block; }
.box-price { font-size: var(--font-size-sm); color: var(--color-orange); }
.selected-check { color: var(--color-orange); font-weight: bold; font-size: 1.5rem; }

/* DARK MODE */
[data-theme="dark"] .subscriptions-page { background: #0B1120; }
[data-theme="dark"] .page-title, [data-theme="dark"] .subscription-box-name, [data-theme="dark"] .stat-card strong, [data-theme="dark"] .info-value, [data-theme="dark"] .modal-title { color: #FFFFFF !important; }
[data-theme="dark"] .page-intro, [data-theme="dark"] .stat-label, [data-theme="dark"] .progress-days { color: #CBD5E1; }
[data-theme="dark"] .heading-badge, [data-theme="dark"] .stat-card { background: #1A2436; border-color: #2D3748; }
[data-theme="dark"] .subscription-card { background: #1A2436; border-color: #2D3748; }
[data-theme="dark"] .info-row { background: #0B1120; }
[data-theme="dark"] .action-btn { background: #1A2436; border-color: #2D3748; color: #FFFFFF; }
[data-theme="dark"] .switch-modal { background: #1A2436; }
[data-theme="dark"] .box-option { background: #0B1120; border-color: #2D3748; }
[data-theme="dark"] .box-name { color: #FFFFFF; }

/* RESPONSIVE */
@media (max-width: 760px) {
  .subscriptions-page { padding: 100px 0 72px; }
  .page-heading { align-items: flex-start; flex-direction: column; gap: var(--spacing-4); }
  .subscription-stats, .subscription-layout { grid-template-columns: 1fr; }
  .subscription-card, .routine-panel { padding: var(--spacing-6); }
}
@media (max-width: 480px) {
  .subscription-stats { gap: var(--spacing-3); }
  .stat-card { padding: var(--spacing-4); }
  .info-row, .action-grid { grid-template-columns: 1fr; }
  .progress-days { gap: var(--spacing-2); font-size: 0.68rem; }
}

/* Utility */
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--spacing-1); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-5 { margin-bottom: var(--spacing-5); }
.mb-6 { margin-bottom: var(--spacing-6); }
.mb-8 { margin-bottom: var(--spacing-8); }
.mt-6 { margin-top: var(--spacing-6); }
.small { font-size: var(--font-size-sm); }
</style>
