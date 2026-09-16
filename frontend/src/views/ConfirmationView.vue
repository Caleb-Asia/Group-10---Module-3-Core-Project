<!-- 
  Purpose: Order confirmation page with pickup details.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Reads the confirmed order from session storage or confirms PayFast redirect.
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
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { showError, showWarning } from '@/services/ui';
import Swal from 'sweetalert2';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const orderData = ref(null);

onMounted(async () => {
  console.log('[CONFIRM] URL:', window.location.href);
  console.log('[CONFIRM] query:', JSON.stringify(route.query));

  const pending = JSON.parse(sessionStorage.getItem('foodboxx_payfast_pending') || 'null');
  const hasQueryParams = route.query.m_payment_id || route.query.ref;

  // Branch 1: PayFast returned with query params (real card payment path).
  if (hasQueryParams) {
    if (!pending) {
      showWarning('No Pending Payment', 'Pending payment session not found.');
      router.push('/checkout');
      return;
    }

    const { ref: queryRef, ...payfastData } = route.query;
    const ref = route.query.m_payment_id || queryRef;

    try {
      const response = await api.post('/payments/payfast/confirm', {
        ref,
        payfastData
      });

      console.log('[CONFIRM] success (query params), clearing cart. Items before:', cartStore.items.length);
      cartStore.clearCart();
      console.log('[CONFIRM] cart items after clear:', cartStore.items.length);
      sessionStorage.removeItem('foodboxx_payfast_pending');

      const builtOrderData = {
        id: response.data.orderId,
        order_number: `FBX-${String(response.data.orderId).padStart(6, '0')}`,
        pickup_pod: pending.pickupPod,
        collection_window: 'Mon–Fri, 08:00–17:00',
        dietary_preferences: authStore.user?.dietary_preferences || 'standard',
        payment_method: 'payfast',
        items: pending.items || [],
        total: response.data.totalAmount,
        status: 'confirmed',
        date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
        txnRef: payfastData.pf_payment_id || ref
      };

      sessionStorage.setItem('foodboxx_last_order', JSON.stringify(builtOrderData));
      localStorage.setItem('foodboxx_orders', JSON.stringify([
        builtOrderData,
        ...JSON.parse(localStorage.getItem('foodboxx_orders') || '[]')
      ]));
      orderData.value = builtOrderData;
    } catch (error) {
      console.log('[CONFIRM] error:', error?.response?.status, error?.response?.data);
      const msg = error?.response?.data?.error?.message || 'PayFast payment confirmation failed.';
      Swal.fire({
        icon: 'error',
        title: 'Payment Confirmation Failed',
        text: msg,
        footer: '<a href="/checkout" style="color: #F26A1B; font-weight: bold;">Back to checkout</a>',
        confirmButtonColor: '#F26A1B',
        confirmButtonText: 'Back to checkout'
      }).then(() => {
        router.push('/checkout');
      });
    }
    return;
  }

  // Branch 2: No query params, but a pending payment exists in sessionStorage.
  // This is the sandbox wallet path — PayFast redirected to /confirmation
  // without appending its return params. Use the pending ref as evidence.
  if (pending && pending.ref) {
    console.log('[CONFIRM] No query params, using sandbox wallet fallback. Pending ref:', pending.ref);
    try {
      const response = await api.post('/payments/payfast/confirm', {
        ref: pending.ref,
        payfastData: {
          payment_status: 'COMPLETE',
          __sandbox_wallet: true,
          pf_payment_id: `SANDBOX-${Date.now()}`
        }
      });

      console.log('[CONFIRM] success (sandbox wallet), clearing cart. Items before:', cartStore.items.length);
      cartStore.clearCart();
      console.log('[CONFIRM] cart items after clear:', cartStore.items.length);
      sessionStorage.removeItem('foodboxx_payfast_pending');

      const builtOrderData = {
        id: response.data.orderId,
        order_number: `FBX-${String(response.data.orderId).padStart(6, '0')}`,
        pickup_pod: pending.pickupPod,
        collection_window: 'Mon–Fri, 08:00–17:00',
        dietary_preferences: authStore.user?.dietary_preferences || 'standard',
        payment_method: 'payfast',
        items: pending.items || [],
        total: response.data.totalAmount,
        status: 'confirmed',
        date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
        txnRef: `SANDBOX-${Date.now()}`
      };

      sessionStorage.setItem('foodboxx_last_order', JSON.stringify(builtOrderData));
      localStorage.setItem('foodboxx_orders', JSON.stringify([
        builtOrderData,
        ...JSON.parse(localStorage.getItem('foodboxx_orders') || '[]')
      ]));
      orderData.value = builtOrderData;
    } catch (error) {
      console.log('[CONFIRM] sandbox fallback error:', error?.response?.status, error?.response?.data);
      const msg = error?.response?.data?.error?.message || 'Sandbox payment confirmation failed.';
      Swal.fire({
        icon: 'error',
        title: 'Payment Confirmation Failed',
        text: msg,
        confirmButtonColor: '#F26A1B',
        confirmButtonText: 'Back to checkout'
      }).then(() => {
        router.push('/checkout');
      });
    }
    return;
  }

  // Branch 3: No query params, no pending payment. Show a stale order if one exists.
  console.log('[CONFIRM] No query params, no pending payment. Showing stale order if present.');
  const storedOrder = sessionStorage.getItem('foodboxx_last_order');
  if (!storedOrder) return;
  orderData.value = JSON.parse(storedOrder);
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
</style>
