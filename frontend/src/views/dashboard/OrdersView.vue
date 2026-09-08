<!-- 
  Purpose: Order history page with empty state and reorder functionality.
  Module: Frontend - Views - Dashboard
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Reads orders from localStorage. Empty state for new users.
-->
<template>
  <div class="orders-page">
    <div class="container">
      
      <!-- Page Header -->
      <div class="d-flex justify-between align-center mb-6">
        <h1 class="page-title">Order History</h1>
        <router-link to="/menu" class="btn btn--outline btn--sm">+ New Order</router-link>
      </div>

      <!-- EMPTY STATE (If no orders) -->
      <div v-if="orders.length === 0" class="empty-state">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" stroke-width="1" class="mb-4 opacity-25">
          <path d="M20 7h-4.5L15 4h-6L8.5 7H4v11h16V7z"/>
          <circle cx="9" cy="13" r="1.5" fill="var(--color-navy)"/>
          <circle cx="15" cy="13" r="1.5" fill="var(--color-navy)"/>
        </svg>
        <h3 class="empty-title">No orders yet</h3>
        <p class="empty-text">Browse our performance fuel boxes and place your first order.</p>
        <router-link to="/menu" class="btn btn--primary">Browse Menu</router-link>
      </div>

      <!-- FILLED STATE (If orders exist) -->
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          
          <div class="d-flex justify-between align-center mb-2">
            <div>
              <h3 class="order-title mb-1">{{ order.items[0]?.name || 'Order' }}</h3>
              <p class="text-muted small mb-0">{{ order.date }} · {{ order.order_number }}</p>
            </div>
            <span class="order-price">R{{ order.total.toFixed(2) }}</span>
          </div>

          <button class="reorder-btn" @click="handleReorder(order)">
            Reorder →
          </button>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/store/cartStore';
import { showSuccess } from '@/services/ui';

const cartStore = useCartStore();

// State
const orders = ref([]);

// Load orders from localStorage when the page mounts
onMounted(() => {
  const storedOrders = localStorage.getItem('foodboxx_orders');
  orders.value = storedOrders ? JSON.parse(storedOrders) : [];
});

// Reorder functionality
const handleReorder = (order) => {
  // For simplicity, recreate a product from the first item in the order
  // In a real app, you'd loop through all items in the order
  const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
  
  if (firstItem) {
    const product = {
      id: order.id,
      name: firstItem.name,
      price: firstItem.price, 
      image_url: '', 
      dietary_tags: []
    };
    cartStore.addToCart(product);
    showSuccess('Added to Cart', `${firstItem.name} has been added to your cart.`);
  } else {
    showSuccess('Added to Cart', 'Your order has been added back to the cart.');
  }
};
</script>

<style scoped>
.orders-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

.page-title { font-size: var(--font-size-2xl); font-weight: bold; color: var(--color-navy); }

/* Empty State Styles */
.empty-state {
  text-align: center;
  padding: var(--spacing-16) 0;
}
.empty-title { font-size: var(--font-size-2xl); font-weight: bold; color: var(--color-navy); margin-bottom: 8px; }
.empty-text { color: var(--color-gray-500); margin-bottom: 24px; }

/* Existing Order Card Styles */
.order-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
  transition: all var(--transition-fast);
}
.order-card:hover { box-shadow: var(--shadow-md); }
.order-title { font-size: var(--font-size-lg); font-weight: bold; color: var(--color-navy); }
.order-price { font-size: var(--font-size-xl); font-weight: bold; color: var(--color-orange); }
.reorder-btn {
  width: 100%;
  margin-top: var(--spacing-4);
  padding: var(--spacing-3);
  border: 2px solid var(--color-orange);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-orange);
  font-size: var(--font-size-sm);
  font-weight: bold;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.reorder-btn:hover { background: var(--color-orange); color: var(--color-white); }

/* Dark Mode Fixes */
[data-theme="dark"] .orders-page { background-color: #0B1120; }
[data-theme="dark"] .page-title, [data-theme="dark"] .empty-title, [data-theme="dark"] .order-title { color: #FFFFFF; }
[data-theme="dark"] .empty-text { color: #D1D5DB; }
[data-theme="dark"] .order-card { background: #1A2436; }
</style>