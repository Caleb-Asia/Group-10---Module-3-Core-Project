<!-- 
  Purpose: Order confirmation page with QR code and pickup details.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Reads the confirmed order from session storage, then renders the QR code from that order.
-->
<template>
  <div class="confirmation-page">
    <div class="container">
      <div v-if="orderData">
        <div class="success-icon mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-navy mb-2">Order Placed!</h1>
        <p class="text-muted mb-6">Your box will be ready for pickup from Monday</p>

        <div class="qr-card mb-6">
          <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="Pickup QR Code" class="qr-image mb-4" />
          <div class="qr-placeholder" v-else>QR Code</div>
          
          <p class="qr-label mb-1">Pickup QR Code</p>
          <p class="qr-order-number">{{ orderData.order_number }}</p>
        </div>

        <div class="details-card p-6 mb-6">
          <div class="detail-row mb-4">
            <span class="detail-label">Pickup Pod</span>
            <span class="detail-value text-navy">{{ orderData.pickup_pod }}</span>
          </div>
          <div class="detail-row mb-4">
            <span class="detail-label">Collection Window</span>
            <span class="detail-value text-navy">{{ orderData.collection_window }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order #</span>
            <span class="detail-value text-orange fw-bold">{{ orderData.order_number }}</span>
          </div>
        </div>

        <div class="d-flex flex-column gap-3">
          <router-link to="/dashboard/orders" class="btn btn--primary btn--full btn--lg">
            View My Orders
          </router-link>

          <router-link to="/" class="btn btn--outline btn--full btn--lg">
            Back to Home
          </router-link>
        </div>
      </div>

      <div v-else class="empty-state">
        <p class="text-muted">No confirmed order found. Please complete checkout first.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { generateQRCode } from '@/services/qr';

const orderData = ref(null);
const qrCodeDataUrl = ref('');

onMounted(async () => {
  const storedOrder = sessionStorage.getItem('foodboxx_last_order');
  if (!storedOrder) {
    return;
  }

  orderData.value = JSON.parse(storedOrder);

  try {
    const qrSource = orderData.value.qrToken || orderData.value.order_number;
    qrCodeDataUrl.value = await generateQRCode(qrSource);
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }
});
</script>

<style scoped>
.confirmation-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: var(--spacing-12) 0;
  text-align: center;
}

/* Success Icon */
.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  background: var(--color-success);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* QR Code Card */
.qr-card {
  max-width: 300px;
  margin: 0 auto;
  padding: var(--spacing-8);
  border: 2px dashed var(--color-orange);
  border-radius: var(--radius-xl);
  background: var(--color-white);
}

.qr-image {
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.qr-placeholder {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  background: var(--color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.qr-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

.qr-order-number {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

/* Details Card */
.details-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  max-width: 400px;
  margin: 0 auto;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--color-gray-100);
}

.detail-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.detail-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-500);
}

.detail-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

/* Utilities */
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--spacing-1); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-6 { margin-bottom: var(--spacing-6); }
.p-6 { padding: var(--spacing-6); }
.gap-3 { gap: var(--spacing-3); }
.text-navy { color: var(--color-navy); }
.text-orange { color: var(--color-orange); }
.text-muted { color: var(--color-gray-500); }
.fw-bold { font-weight: var(--font-weight-bold); }

/* Order Status Tracker */
.order-tracker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-gray-50);
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-lg);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--color-gray-400);
  font-size: var(--font-size-xs);
  font-weight: bold;
}

.step.active {
  color: var(--color-navy);
}

.step-icon {
  width: 32px;
  height: 32px;
  background: var(--color-gray-200);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--color-gray-500);
}

.step.active .step-icon {
  background: var(--color-orange);
  color: var(--color-white);
}

.line {
  flex: 1;
  height: 2px;
  background: var(--color-gray-200);
  margin: 0 var(--spacing-2);
  margin-bottom: 20px;
}

/* Dark Mode Tracker Fixes */
[data-theme="dark"] .order-tracker {
  background: #1A2436;
}

[data-theme="dark"] .step {
  color: #9CA3AF;
}

[data-theme="dark"] .step.active {
  color: #FFFFFF;
}

[data-theme="dark"] .step-icon {
  background: #2D3748;
  color: #9CA3AF;
}

[data-theme="dark"] .step.active .step-icon {
  background: var(--color-orange);
  color: #FFFFFF;
}

[data-theme="dark"] .line {
  background: #2D3748;
}
</style>
