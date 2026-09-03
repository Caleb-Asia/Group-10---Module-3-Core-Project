<!-- 
  Purpose: 2-step checkout process (Pickup Pod, Payment).
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Simulates Card, SnapScan, and EFT payment methods.
-->
<template>
  <div class="checkout-page">
    <div class="container">
      
      <!-- Step Indicator -->
      <div class="steps mb-8">
        <div class="steps__step" :class="{ 'steps__step--active': currentStep === 1, 'steps__step--completed': currentStep > 1 }">
          <div class="steps__step-number">1</div>
          <span class="steps__step-label">Pickup Pod</span>
        </div>
        <div class="steps__connector" :class="{ 'steps__connector--active': currentStep > 1 }"></div>
        <div class="steps__step" :class="{ 'steps__step--active': currentStep === 2 }">
          <div class="steps__step-number">2</div>
          <span class="steps__step-label">Payment</span>
        </div>
      </div>

      <!-- Step 1: Pickup Pod -->
      <div v-if="currentStep === 1" class="step-content">
        <h2 class="text-navy mb-4">Choose your pickup pod</h2>
        
        <div class="pod-grid">
          <div 
            v-for="pod in pickupPods" 
            :key="pod" 
            :class="['pod-card', { 'pod-card--active': form.pickup_pod === pod }]"
            @click="form.pickup_pod = pod"
          >
            <div class="pod-icon">📍</div>
            <span class="pod-name">{{ pod }}</span>
          </div>
        </div>

        <button class="btn btn--primary btn--full mt-6" @click="nextStep" :disabled="!form.pickup_pod">
          Continue to Payment →
        </button>
      </div>

      <!-- Step 2: Payment -->
      <div v-if="currentStep === 2" class="step-content">
        <h2 class="text-navy mb-4">Payment Details</h2>
        
        <!-- Order Summary -->
        <div class="order-summary p-4 mb-6">
          <h5 class="text-navy mb-3">Order Summary</h5>
          <div class="d-flex justify-between mb-2">
            <span class="text-muted">{{ cartStore.totalItems }} items</span>
            <span class="text-navy fw-bold">R{{ Number(cartStore.subtotal).toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-between">
            <span class="text-muted">Pickup</span>
            <span class="text-success">Free</span>
          </div>
        </div>

        <form @submit.prevent="processPayment">
          <!-- Payment Methods -->
          <div class="payment-methods mb-6">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              :class="['payment-method', { 'payment-method--active': form.payment_method === method.id }]"
              @click="form.payment_method = method.id"
            >
              <div class="payment-method-icon">{{ method.icon }}</div>
              <div class="payment-method-info">
                <span class="payment-method-name">{{ method.name }}</span>
                <span class="payment-method-desc">{{ method.desc }}</span>
              </div>
              <input type="radio" :value="method.id" v-model="form.payment_method" class="form-radio-input" />
            </div>
          </div>

          <!-- Card Payment Form (Only visible when Card is selected) -->
          <div v-if="form.payment_method === 'card'" class="card-form">
            <div class="form-group mb-4">
              <label for="cardNumber" class="form-label">Card Number</label>
              <input 
                type="text" 
                id="cardNumber" 
                v-model="form.card_number" 
                class="form-input" 
                placeholder="4242 4242 4242 4242"
                required
              />
            </div>

            <div class="d-flex gap-3 mb-4">
              <div class="form-group flex-grow-1">
                <label for="expiry" class="form-label">Expiry Date</label>
                <input 
                  type="text" 
                  id="expiry" 
                  v-model="form.expiry" 
                  class="form-input" 
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div class="form-group flex-grow-1">
                <label for="cvv" class="form-label">CVV</label>
                <input 
                  type="text" 
                  id="cvv" 
                  v-model="form.cvv" 
                  class="form-input" 
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>

          <!-- SnapScan Instruction (Visible when SnapScan selected) -->
          <div v-if="form.payment_method === 'snapscan'" class="simulated-payment-instruction">
            <div class="simulated-icon">📱</div>
            <p class="text-navy fw-bold mb-1">SnapScan</p>
            <p class="text-muted small mb-4">Open the SnapScan app and scan the QR code at the pickup point.</p>
          </div>

          <!-- EFT Instruction (Visible when EFT selected) -->
          <div v-if="form.payment_method === 'eft'" class="simulated-payment-instruction">
            <div class="simulated-icon">🏦</div>
            <p class="text-navy fw-bold mb-1">Electronic Funds Transfer</p>
            <p class="text-muted small mb-4">Use the provided bank details to complete your transfer within 24 hours.</p>
            <div class="eft-details">
              <span class="eft-label">Bank: <strong>FNB</strong></span>
              <span class="eft-label">Account: <strong>62012345678</strong></span>
              <span class="eft-label">Ref: <strong>{{ orderRef }}</strong></span>
            </div>
          </div>

          <div class="d-flex justify-between">
            <button type="button" class="btn btn--outline" @click="prevStep">← Back</button>
            <button type="submit" class="btn btn--primary" :disabled="isLoading">
              <span v-if="isLoading" class="spinner spinner--dark"></span>
              <span v-else>Pay R{{ Number(cartStore.subtotal).toFixed(2) }}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { showError, showSuccess } from '@/services/ui';
import { PICKUP_PODS } from '@/services/config';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// State
const currentStep = ref(1);
const isLoading = ref(false);
const pickupPods = PICKUP_PODS;

// Mock reference for EFT
const orderRef = computed(() => `FBX-${Math.floor(100000 + Math.random() * 900000)}`);

// Payment Methods List
const paymentMethods = [
  { id: 'card', name: 'Debit / Credit Card', desc: 'Visa, Mastercard, Amex', icon: '💳' },
  { id: 'snapscan', name: 'SnapScan', desc: 'Scan & pay with your phone', icon: '📱' },
  { id: 'eft', name: 'EFT', desc: 'Bank transfer', icon: '🏦' },
];

const form = reactive({
  pickup_pod: '',
  payment_method: 'card', // Default to card
  card_number: '',
  expiry: '',
  cvv: ''
});

// Methods
const nextStep = () => {
  currentStep.value++;
};

const prevStep = () => {
  currentStep.value--;
};

// Payment Processing
const processPayment = async () => {
  isLoading.value = true;

  // Simulating an API call (Wait 1.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 1. Card Validation
  if (form.payment_method === 'card') {
    const last4 = form.card_number.replace(/\s/g, '').slice(-4);
    if (last4 === '0002') {
      isLoading.value = false;
      showError('Payment Declined', 'This test card was declined. Please try another card.');
      return;
    }
  }

  // 2. SnapScan Simulation
  if (form.payment_method === 'snapscan') {
    // 90% chance of success for demo
    if (Math.random() < 0.1) {
      isLoading.value = false;
      showError('SnapScan Failed', 'QR Code expired. Please try again.');
      return;
    }
  }

  // 3. EFT Simulation
  if (form.payment_method === 'eft') {
    // EFT always requires manual approval, but we mark as "Pending" for demo
    showSuccess('EFT Details Sent', 'Your order is pending until payment reflects.');
  }

  // Payment Successful
  const orderData = {
    order_number: 'FB-702389', // Mock until backend
    pickup_pod: form.pickup_pod,
    collection_window: 'Mon–Fri, 08:00–17:00',
    dietary_preferences: authStore.user?.dietary_preferences || 'Standard',
    payment_method: form.payment_method
  };

  // Save to sessionStorage so ConfirmationView can read it
  sessionStorage.setItem('foodboxx_last_order', JSON.stringify(orderData));

  // Clear the cart
  cartStore.clearCart();

  // Redirect to Confirmation page
  showSuccess('Payment Successful', 'Your order has been placed!');
  router.push('/confirmation');
};
</script>

<style scoped>
.checkout-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

/* Steps */
.steps {
  max-width: 500px;
  margin: 0 auto;
}

/* Pods */
.pod-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}

.pod-card {
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pod-card:hover {
  border-color: var(--color-orange);
}

.pod-card--active {
  border-color: var(--color-orange);
  background: rgba(242, 106, 27, 0.05);
}

.pod-icon {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-2);
}

.pod-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.payment-method {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.payment-method:hover {
  border-color: var(--color-orange);
}

.payment-method--active {
  border-color: var(--color-orange);
  background: rgba(242, 106, 27, 0.05);
}

.payment-method-icon {
  font-size: 1.5rem;
}

.payment-method-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.payment-method-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

.payment-method-desc {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.form-radio-input {
  width: 18px;
  height: 18px;
  accent-color: var(--color-orange);
  cursor: pointer;
}

/* Simulated Payment Instructions */
.simulated-payment-instruction {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.simulated-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-3);
}

.eft-details {
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.eft-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

/* Order Summary */
.order-summary {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* Utilities */
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-3 { margin-bottom: var(--spacing-3); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-6 { margin-bottom: var(--spacing-6); }
.mb-8 { margin-bottom: var(--spacing-8); }
.mt-6 { margin-top: var(--spacing-6); }
.p-4 { padding: var(--spacing-4); }
.gap-3 { gap: var(--spacing-3); }
.flex-grow-1 { flex-grow: 1; }
.fw-bold { font-weight: var(--font-weight-bold); }
.text-navy { color: var(--color-navy); }
.text-muted { color: var(--color-gray-500); }
.text-success { color: var(--color-success); }
</style>