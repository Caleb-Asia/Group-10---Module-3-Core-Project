<!-- 
  Purpose: Cart page with empty state, item management, and order summary.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
-->
<template>
  <div class="cart-page container py-5">
    
    <!-- 1. EMPTY CART STATE -->
    <div v-if="cartStore.items.length === 0" class="empty-cart text-center d-flex flex-column align-items-center justify-content-center">
      <div class="empty-icon-circle mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-cart3 text-secondary" viewBox="0 0 16 16">
          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
        </svg>
      </div>

      <h3 class="fw-bold text-dark">Your cart is empty</h3>
      <p class="text-muted mt-2 mb-4" style="max-width: 400px;">
        Add some healthy, nutrient-rich meals and snacks to fuel your day, or start a subscription.
      </p>

      <button @click="goToMenu" class="btn btn-custom-orange px-4 py-2 rounded-pill">
        Browse Menu
      </button>
    </div>

    <!-- 2. FILLED CART STATE -->
    <div v-else>
      <h2 class="mb-4 fw-bold text-dark">Your Cart</h2>
      
      <div class="row">
        <!-- Cart Items List -->
        <div class="col-lg-8">
          <div v-for="item in cartStore.items" :key="item.id" class="card mb-3 shadow-sm border-0 rounded-3">
            <div class="card-body d-flex align-items-center justify-content-between">
              
              <!-- Product Info -->
              <div class="d-flex align-items-center">
                <div class="me-3" style="width: 80px; height: 80px; background-color: var(--color-gray-100); border-radius: 8px; overflow: hidden;">
                  <img :src="item.image_url || '/images/placeholder-product.png'" :alt="item.name" class="img-fluid w-100 h-100 object-fit-cover">
                </div>
                <div>
                  <h6 class="mb-1 fw-bold text-dark">{{ item.name }}</h6>
                  <small class="text-muted">Unit Price: R{{ Number(item.price).toFixed(2) }}</small>
                </div>
              </div>

              <!-- Quantity Controls & Remove -->
              <div class="d-flex align-items-center">
                <div class="btn-group me-3" role="group">
                  <button 
                    class="btn btn-outline-secondary btn-sm" 
                    :aria-label="`Decrease quantity of ${item.name}`"
                    @click="cartStore.decreaseQty(item.id)"
                  >-</button>
                  
                  <span class="quantity-display" style="min-width: 40px; text-align:center;">{{ item.quantity }}</span>
                  
                  <button 
                    class="btn btn-outline-secondary btn-sm" 
                    :aria-label="`Increase quantity of ${item.name}`"
                    @click="cartStore.increaseQty(item.id)"
                  >+</button>
                </div>
                
                <button 
                  class="btn btn-link text-danger text-decoration-none" 
                  :aria-label="`Remove ${item.name} from cart`"
                  @click="confirmRemove(item)"
                >Remove</button>
              </div>

            </div>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="col-lg-4">
          <div class="card shadow-sm border-0 rounded-3 p-3" style="background-color: var(--color-gray-50);">
            <h5 class="fw-bold mb-3 text-dark">Order Summary</h5>
            
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal</span>
              <span class="fw-bold text-dark">R{{ Number(cartStore.subtotal).toFixed(2) }}</span>
            </div>

            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">Delivery / Pickup</span>
              <span class="text-success">R0.00</span>
            </div>

            <hr>

            <div class="d-flex justify-content-between mb-4">
              <span class="fw-bold text-dark fs-5">Total</span>
              <span class="fw-bold text-dark fs-5">R{{ Number(cartStore.subtotal).toFixed(2) }}</span>
            </div>

            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" role="switch" id="subscriptionToggle" v-model="cartStore.isSubscription">
              <label class="form-check-label text-muted small" for="subscriptionToggle">Make this a recurring subscription</label>
            </div>

            <button @click="goToCheckout" class="btn btn-custom-orange w-100 py-2 rounded-pill">
              Proceed to Checkout
            </button>
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

const router = useRouter();
const cartStore = useCartStore();

const goToMenu = () => {
  router.push('/menu');
};

const goToCheckout = () => {
  router.push('/checkout');
};

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
.empty-cart {
  min-height: 70vh;
}

.empty-icon-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-gray-200);
}

.btn-custom-orange {
  background-color: var(--color-orange);
  color: white;
  font-weight: var(--font-weight-medium);
  border: none;
}

.btn-custom-orange:hover {
  background-color: var(--color-orange-hover);
  color: white;
}

.quantity-display {
  background-color: var(--color-gray-100);
  padding: var(--spacing-1) var(--spacing-2);
  border-top: 1px solid var(--color-gray-300);
  border-bottom: 1px solid var(--color-gray-300);
  line-height: 1.5;
}

@media (max-width: 575.98px) {
  .card-body {
    flex-direction: column;
    align-items: flex-start !important;
  }
  .card-body .d-flex.align-items-center:last-child {
    margin-top: var(--spacing-4);
    width: 100%;
    justify-content: space-between;
  }
}
</style>