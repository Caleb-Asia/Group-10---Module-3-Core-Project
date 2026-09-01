<!-- 
  Purpose: Main account dashboard hub.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Displays active subscription, loyalty reward, referral, and quick links.
-->
<template>
  <div class="dashboard-page">
    <div class="container">
      
      <!-- Page Title -->
      <h1 class="page-title mb-6">My Dashboard</h1>

      <!-- Active Subscription Card -->
      <div class="card p-6 mb-6">
        <div class="d-flex justify-between align-center mb-4">
          <div class="subscription-status">
            <span class="status-dot"></span> ACTIVE SUBSCRIPTION
          </div>
          <div class="subscription-price">R79/wk</div>
        </div>

        <h3 class="text-navy mb-1">Standard Box</h3>
        <p class="text-muted small mb-4">Weekly delivery · UCT Library Pod</p>

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

        <!-- Action Buttons (Pill shaped) -->
        <div class="action-grid">
          <button class="action-btn" @click="handleAction('pause')">Pause for a week</button>
          <button class="action-btn" @click="handleAction('skip')">Skip this week</button>
          <button class="action-btn" @click="handleAction('resume')">Resume</button>
          <button class="action-btn cancel-btn" @click="handleAction('cancel')">Cancel</button>
        </div>
      </div>

      <!-- Loyalty Reward Card -->
      <div class="card p-6 mb-6">
        <div class="d-flex justify-between align-center mb-4">
          <h4 class="text-navy mb-0">Loyalty Reward</h4>
          <span class="badge-reward">7th Every 8th Box Free</span>
        </div>
        
        <div class="progress progress--lg mb-2">
          <div class="progress__bar" style="width: 37.5%;"></div>
        </div>
        <p class="text-muted small mb-0">3 of 8 boxes completed — 5 more to go!</p>
      </div>

      <!-- Referral Card -->
      <div class="referral-card p-6 mb-6">
        <div class="d-flex align-center justify-between">
          <div>
            <h4 class="text-navy mb-1">Share the box!</h4>
            <p class="text-muted small mb-0">Friends get R50 off, you get a free box.</p>
          </div>
          <button class="btn btn--primary btn--sm" @click="handleReferral">Refer</button>
        </div>
      </div>

      <!-- Quick Links Grid -->
      <h3 class="section-title mb-4">Quick Links</h3>
      <div class="quick-links-grid">
        <router-link to="/dashboard/orders" class="quick-link-card">
          <span class="quick-link-icon">📦</span>
          <span class="quick-link-text">Order History</span>
        </router-link>

        <router-link to="/dashboard/profile" class="quick-link-card">
          <span class="quick-link-icon">👤</span>
          <span class="quick-link-text">My Profile</span>
        </router-link>

        <router-link to="/pods" class="quick-link-card">
          <span class="quick-link-icon">📍</span>
          <span class="quick-link-text">Pickup Pods</span>
        </router-link>

        <router-link to="/builder" class="quick-link-card">
          <span class="quick-link-icon">🍱</span>
          <span class="quick-link-text">Build a Box</span>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore';
import { showSuccess, showConfirm } from '@/services/ui';

const authStore = useAuthStore();

// Mock actions for now until backend is connected
const handleAction = (action) => {
  switch(action) {
    case 'pause':
      showSuccess('Subscription Paused', 'We will not charge you next week.');
      break;
    case 'skip':
      showSuccess('Week Skipped', 'Your next charge date has been moved by 7 days.');
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

const handleReferral = () => {
  showSuccess('Link Copied!', 'Send your referral link to a friend.');
};
</script>

<style scoped>
.dashboard-page {
  padding: var(--spacing-8) 0;
  min-height: 100vh;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

/* Active Subscription */
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

/* Action Buttons */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2);
}

.action-btn {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  padding: var(--spacing-3);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
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

/* Loyalty */
.badge-reward {
  background: var(--color-orange);
  color: var(--color-white);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
}

/* Referral */
.referral-card {
  background: #FFF7ED;
  border: 1px solid #FED7AA;
  border-radius: var(--radius-xl);
}

/* Quick Links */
.section-title {
  font-size: var(--font-size-xl);
}

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

.quick-link-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-5);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  text-decoration: none;
  transition: all var(--transition-base);
}

.quick-link-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.quick-link-icon {
  font-size: 1.5rem;
}

.quick-link-text {
  color: var(--color-navy);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}
</style>