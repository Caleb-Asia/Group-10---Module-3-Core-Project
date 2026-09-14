<!-- 
  Purpose: Cart page with empty state, item management, and order summary.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Uses cartStore for real data. Uses reusable SubscriptionToggle component.
-->
<template>
  <div class="cart-page">
    
    <!-- 1. EMPTY CART STATE (Perfectly Centered) -->
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <div class="empty-icon-circle mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" class="bi bi-cart3" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="currentColor"/>
        </svg>
      </div>

      <h3 class="empty-title">Your cart is empty</h3>
      <p class="empty-text">
        Add some healthy, nutrient-rich meals and snacks to fuel your day, or start a subscription.
      </p>

      <button @click="goToMenu" class="btn-custom-orange">
        Browse Menu
      </button>
    </div>

    <!-- 2. FILLED CART STATE -->
    <div v-else class="cart-content">
      <div class="container">
        <div class="cart-heading">
          <div>
            <span class="cart-eyebrow">ALMOST THERE</span>
            <h1 class="page-title">Your Cart</h1>
            <p class="cart-intro">A little fuel for the week ahead, all in one place.</p>
          </div>
          <div class="cart-count-badge">
            <span class="cart-count-number">{{ cartStore.itemCount }}</span>
            <span>{{ cartStore.itemCount === 1 ? 'item' : 'items' }} in your box</span>
          </div>
        </div>

        <div class="cart-benefits" aria-label="Checkout benefits">
          <div class="benefit-item"><span class="benefit-icon">✓</span><span>Freshly packed</span></div>
          <div class="benefit-item"><span class="benefit-icon">⌖</span><span>Free pickup</span></div>
          <div class="benefit-item"><span class="benefit-icon">↺</span><span>Flexible plans</span></div>
        </div>
        
        <div class="cart-layout">
          <!-- Cart Items List -->
          <div class="cart-items">
            <div class="section-label">YOUR SELECTION</div>
            <div v-for="item in cartStore.items" :key="item.id" class="cart-item-card">
              
              <!-- Product Image -->
              <div class="cart-item-image-wrapper">
                <img :src="getItemImage(item)" :alt="item.name" class="cart-item-image">
              </div>

              <!-- Product Info -->
              <div class="cart-item-info">
                <h6 class="cart-item-name">{{ item.name }}</h6>
                <span class="cart-item-price">R{{ Number(item.price).toFixed(2) }}</span>
              </div>

              <!-- Quantity Controls -->
              <div class="quantity-controls">
                <button 
                  class="qty-btn" 
                  @click="cartStore.decreaseQty(item.id)"
                >−</button>
                
                <span class="qty-display">{{ item.quantity }}</span>
                
                <button 
                  class="qty-btn" 
                  @click="cartStore.increaseQty(item.id)"
                >+</button>
              </div>

              <!-- Remove Button -->
              <button class="remove-btn" @click="confirmRemove(item)">
                Remove
              </button>

            </div>
          </div>

          <!-- Summary Sidebar -->
          <div class="cart-summary">
            <div class="summary-card">
              <div class="summary-heading">
                <h5 class="summary-title">Order Summary</h5>
                <span class="summary-spark">✦</span>
              </div>
              
              <div class="summary-row">
                <span>Subtotal</span>
                <span class="fw-bold">R{{ Number(cartStore.subtotal).toFixed(2) }}</span>
              </div>

              <div class="summary-row">
                <span>Delivery / Pickup</span>
                <span class="text-success">R0.00</span>
              </div>

              <hr class="summary-divider">

              <div class="summary-row total-row">
                <span class="fw-bold">Total</span>
                <span class="fw-bold total-price">R{{ Number(cartStore.subtotal).toFixed(2) }}</span>
              </div>

              <!-- Reusable Subscription Toggle -->
              <div class="mb-4">
                <SubscriptionToggle v-model="cartStore.isSubscription" />
              </div>

              <div class="summary-note">
                <span class="summary-note-icon">i</span>
                <span>Pickup at your selected pod is always free.</span>
              </div>

              <button @click="goToCheckout" class="btn-custom-orange w-100 py-2 rounded-pill">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';
import { showConfirm, showSuccess } from '@/services/ui';
import SubscriptionToggle from '@/components/common/SubscriptionToggle.vue';

const router = useRouter();
const cartStore = useCartStore();

// Helper to get the custom box image
const getItemImage = (item) => {
  if (item.name.includes('Custom Box')) {
    return '/images/custom-meal-box.png'; 
  }
  return item.image_url || '/images/placeholder-product.png';
};

// --- FUNCTIONS ---
const goToMenu = () => {
  router.push('/menu');
};

const goToCheckout = () => {
  router.push('/checkout');
};

// Confirmation modal for removing items (SweetAlert2)
const confirmRemove = (item) => {
  showConfirm(
    'Remove item?',
    `Are you sure you want to remove ${item.name} from your cart?`,
    'Yes, remove it'
  ).then((result) => {
    if (result.isConfirmed) {
      cartStore.removeFromCart(item.id);
      showSuccess('Item removed', `${item.name} has been removed from your cart.`);
    }
  });
};
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  /* FIX: Reduced from 110px to 100px */
  padding-top: 100px;
}

/* Empty Cart State - PERFECTLY CENTERED */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  text-align: center;
  padding: 0 var(--spacing-6);
}

.empty-icon-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background-color: var(--color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-gray-200);
  color: var(--color-navy);
}

/* Dark Mode icon background and color */
[data-theme="dark"] .empty-icon-circle {
  background-color: #1A2436;
  border-color: #2D3748;
  color: #FFFFFF;
}

.empty-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-3);
}

[data-theme="dark"] .empty-title { color: #FFFFFF; }

.empty-text {
  font-size: var(--font-size-lg);
  color: var(--color-gray-500);
  max-width: 500px;
  margin: 0 auto var(--spacing-6);
  line-height: 1.6;
}

[data-theme="dark"] .empty-text { color: #D1D5DB; }

.btn-custom-orange {
  background-color: var(--color-orange);
  color: white;
  font-weight: var(--font-weight-bold);
  border: none;
  padding: 18px 40px; 
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: inline-block;
  width: auto;
}

.btn-custom-orange:hover {
  background-color: var(--color-orange-hover);
  transform: translateY(-2px);
}

/* Filled Cart State - Layout */
.cart-content {
  padding: 0 var(--spacing-8) 60px; /* FIX: Reduced bottom padding */
}

.cart-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-4); /* FIX: Reduced from 6 to 4 */
}

.cart-eyebrow {
  display: block;
  margin-bottom: var(--spacing-2);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.14em;
}

.cart-intro {
  margin: 0;
  color: var(--color-gray-500);
  font-size: var(--font-size-lg);
}

.cart-count-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid rgba(242, 106, 27, 0.2);
  border-radius: var(--radius-full);
  background: #fff7ed;
  color: var(--color-orange);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.cart-count-number {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 50%;
  background: var(--color-orange);
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
}

.cart-benefits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-5); /* FIX: Reduced from 8 to 5 */
  padding: var(--spacing-4) var(--spacing-5);
  border: 1px solid rgba(15, 33, 55, 0.08);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.72);
}

.benefit-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.benefit-icon {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 50%;
  background: #ffead7;
  color: var(--color-orange);
  font-weight: var(--font-weight-bold);
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-4); /* FIX: Reduced from 8 to 4 */
}

/* DARK MODE FIXES */
[data-theme="dark"] .page-title { color: #FFFFFF; }
[data-theme="dark"] .cart-intro, [data-theme="dark"] .section-label { color: #CBD5E1; }

/* FIX: Make Benefit icons visible in Dark Mode */
[data-theme="dark"] .cart-count-badge,
[data-theme="dark"] .cart-benefits {
  background: #1A2436;
  border-color: #2D3748;
}

[data-theme="dark"] .benefit-item { color: #E5E7EB; }
[data-theme="dark"] .benefit-icon { background: #0B1120; color: var(--color-orange); }

/* Make the container FULL WIDTH */
.container {
  max-width: 1400px; 
  margin: 0 auto;
}

.cart-layout {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6); /* FIX: Reduced from 8 to 6 */
}

.section-label {
  margin-bottom: var(--spacing-3);
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.1em;
}

@media (min-width: 992px) {
  .cart-layout {
    flex-direction: row;
  }
  .cart-items {
    flex: 2;
  }
  .cart-summary {
    flex: 1;
  }
}

/* Cart Item Card - LARGER */
.cart-item-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-5); /* FIX: Reduced from 6 to 5 */
  display: flex;
  align-items: center;
  gap: var(--spacing-5);
  margin-bottom: var(--spacing-3);
  border: 1px solid rgba(15, 33, 55, 0.06);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.cart-item-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

[data-theme="dark"] .cart-item-card { background: #1A2436; }

.cart-item-image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-gray-100);
  flex-shrink: 0;
}

[data-theme="dark"] .cart-item-image-wrapper { background: #2D3748; }

.cart-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info { flex: 1; }

.cart-item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-1);
}

[data-theme="dark"] .cart-item-name { color: #FFFFFF; }

.cart-item-price {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
}

[data-theme="dark"] .cart-item-price { color: #9CA3AF; }

/* Quantity Controls - LARGER */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-gray-50);
  border-radius: var(--radius-full);
  padding: 8px;
}

[data-theme="dark"] .quantity-controls { background: #0B1120; }

.qty-btn {
  width: 32px;
  height: 32px;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  color: var(--color-navy);
  transition: all var(--transition-fast);
}

.qty-btn:hover {
  background: var(--color-orange);
  color: white;
  border-color: var(--color-orange);
}

[data-theme="dark"] .qty-btn {
  background: #1A2436;
  border-color: #2D3748;
  color: #FFFFFF;
}

.qty-display {
  min-width: 32px;
  text-align: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

[data-theme="dark"] .qty-display { color: #FFFFFF; }

.remove-btn {
  background: none;
  border: none;
  color: var(--color-error);
  font-size: var(--font-size-base);
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  transition: opacity var(--transition-fast);
}

.remove-btn:hover { opacity: 0.7; }

/* Summary Card - LARGER */
.summary-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6); /* FIX: Reduced from 8 to 6 */
  border: 1px solid rgba(242, 106, 27, 0.16);
  position: sticky;
  top: 100px;
}

.summary-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-spark {
  color: var(--color-orange);
  font-size: var(--font-size-2xl);
}

[data-theme="dark"] .summary-card { background: #1A2436; }
[data-theme="dark"] .summary-note { background: #0B1120; color: #CBD5E1; }

.summary-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-4);
}

[data-theme="dark"] .summary-title { color: #FFFFFF; }

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-3);
  font-size: var(--font-size-lg);
  color: var(--color-gray-700);
}

[data-theme="dark"] .summary-row { color: #D1D5DB; }

.summary-divider {
  border: none;
  border-top: 1px solid var(--color-gray-200);
  margin: var(--spacing-5) 0;
}

[data-theme="dark"] .summary-divider { border-color: #2D3748; }

.total-row { margin-bottom: var(--spacing-6); }

.total-price {
  color: var(--color-orange);
  font-size: var(--font-size-xl);
}

.summary-note {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-3);
  border-radius: var(--radius-md);
  background: var(--color-gray-50);
  color: var(--color-gray-600);
  font-size: var(--font-size-xs);
  line-height: 1.5;
}

.summary-note-icon {
  display: grid;
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: var(--color-navy);
  color: var(--color-white);
  font-size: 11px;
  font-weight: var(--font-weight-bold);
}

/* Mobile adjustments */
@media (max-width: 575.98px) {
  .cart-content {
    padding: 24px var(--spacing-4) 60px;
  }

  .cart-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .cart-benefits {
    grid-template-columns: 1fr;
    gap: var(--spacing-3);
    justify-items: start;
  }

  .benefit-item {
    justify-content: flex-start;
  }

  .summary-card {
    position: static;
  }

  .cart-item-card {
    flex-wrap: wrap;
  }
  .cart-item-info {
    flex-basis: 60%;
  }
  .quantity-controls {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: var(--spacing-2);
  }
  .remove-btn {
    order: 4;
    width: 100%;
    text-align: center;
    margin-top: var(--spacing-2);
  }
}
</style>