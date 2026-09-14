<!-- 
  Purpose: Main account dashboard hub.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Displays active subscription summary, loyalty reward, and quick links. 
         Promotional card has a dynamic float animation.
-->
<template>
  <div class="dashboard-page">
    <div class="container">
      
      <!-- Page Title -->
      <h1 class="page-title mb-6">My Dashboard</h1>

      <!-- Active Subscription Summary -->
      <div class="dashboard-card p-6 mb-6">
        <div class="d-flex justify-between align-center mb-4">
          <div class="status-badge">
            <span class="status-dot"></span> ACTIVE SUBSCRIPTION
          </div>
          <div class="subscription-price">R{{ subscription?.price || 79 }}/wk</div>
        </div>

        <h3 class="text-navy mb-1">{{ subscription?.product_name || 'Standard Box' }}</h3>
        <p class="text-muted small mb-4">Weekly delivery · UCT Library Pod</p>

        <div class="info-row mb-4">
          <div class="info-block">
            <span class="info-label">Next Charge</span>
            <span class="info-value">{{ subscription?.next_charge_date || 'Mon, 2 Sep 2026' }}</span>
          </div>
          <div class="info-block">
            <span class="info-label">Pickup Pod</span>
            <span class="info-value">{{ subscription?.pickup_pod || 'UCT Library' }}</span>
          </div>
        </div>

        <!-- Link to manage subscription -->
        <router-link to="/dashboard/subscriptions" class="btn btn--outline btn--sm">
          Manage Subscription
        </router-link>
      </div>

      <!-- Loyalty Reward -->
      <div class="dashboard-card p-6 mb-6">
        <div class="d-flex justify-between align-center mb-4">
          <h4 class="card-title mb-0">Loyalty Reward</h4>
          <span class="reward-badge">🎁 Every 8th box free</span>
        </div>
        <div class="progress progress--lg mb-2">
          <div class="progress__bar" style="width: 37.5%;"></div>
        </div>
        <p class="text-muted small mb-0">{{ subscription?.boxes_completed ?? 3 }} of 8 boxes completed — {{ 8 - (subscription?.boxes_completed ?? 3) }} more to go!</p>
      </div>

      <!-- Promotional Referral Card (Animated) -->
      <div class="referral-card p-6 mb-6">
        <div class="d-flex align-center justify-between">
          <div>
            <h4 class="referral-title">Share the box!</h4>
            <p class="referral-text">Friends get <strong>50% off</strong>, you get a free box.</p>
          </div>
          <button class="btn btn--primary btn--sm" @click="handleReferral">Refer</button>
        </div>
      </div>

      <!-- Quick Links (Only Orders and Profile remain) -->
      <h3 class="quick-links-title mb-4">Quick Links</h3>
      <div class="quick-links-grid">
        
        <router-link to="/dashboard/orders" class="quick-link-card">
          <ClipboardClock :size="24" :stroke-width="2" class="quick-link-icon" />
          <span class="quick-link-text">Order History</span>
          <span class="chevron">›</span>
        </router-link>

        <router-link to="/dashboard/profile" class="quick-link-card">
          <UserPen :size="24" :stroke-width="2" class="quick-link-icon" />
          <span class="quick-link-text">My Profile</span>
          <span class="chevron">›</span>
        </router-link>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ClipboardClock, UserPen } from 'lucide-vue-next';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import { showSuccess } from '@/services/ui';

const authStore = useAuthStore();
const subscription = ref(null);

// Load the authenticated user's subscription summary for the dashboard card.
onMounted(async () => {
  try {
    const response = await api.get('/subscriptions/user/' + authStore.user.id);
    subscription.value = response.data.subscription;
  } catch (error) {
    subscription.value = null;
  }
});

const handleReferral = () => {
  showSuccess('Link Copied!', 'Send your referral link to a friend.');
};
</script>

<style scoped>
.dashboard-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

.dashboard-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.status-badge {
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
  font-size: var(--font-size-xl);
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  background: var(--color-gray-50);
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
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

.reward-badge {
  background: rgba(242, 106, 27, 0.1);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
}

/* Promotional Referral Card - Faster Animation & White Text */
.referral-card {
  background: var(--color-orange);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  animation: float-promo 1.5s ease-in-out infinite; 
}

/* Force White Text inside the orange card */
.referral-title {
  color: #FFFFFF !important;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-1);
}

.referral-text {
  color: #FFFFFF !important;
  font-size: var(--font-size-base);
  margin-bottom: 0;
}

/* Ensure the strong tag is also white */
.referral-text strong {
  color: #FFFFFF !important;
}

@keyframes float-promo {
  0% { transform: translateX(0); }
  50% { transform: translateX(8px); } 
  100% { transform: translateX(0); } 
}

.quick-links-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

.quick-links-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .quick-links-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.quick-link-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  text-decoration: none;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.quick-link-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Lucide icon styling */
.quick-link-icon {
  color: var(--color-orange);
}

.quick-link-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
}

.chevron {
  margin-left: auto;
  font-size: 1.5rem;
  color: var(--color-gray-400);
}

/* Dark Mode */
[data-theme="dark"] .dashboard-page {
  background-color: #0B1120;
}

[data-theme="dark"] .dashboard-card,
[data-theme="dark"] .quick-link-card {
  background: #1A2436;
}

[data-theme="dark"] .page-title,
[data-theme="dark"] .card-title,
[data-theme="dark"] .quick-links-title,
[data-theme="dark"] .quick-link-text {
  color: #FFFFFF;
}

[data-theme="dark"] .quick-link-icon {
  color: var(--color-orange);
}

/* Utility */
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--spacing-1); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-6 { margin-bottom: var(--spacing-6); }
.p-6 { padding: var(--spacing-6); }
.small { font-size: var(--font-size-sm); }
.text-navy { color: var(--color-navy); }
.text-muted { color: var(--color-gray-500); }
</style>
