<!-- 
  Purpose: Order history page with reorder functionality.
  Module: Frontend - Views - Dashboard
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Displays past orders with mock data until backend connects. 
         Reorder button adds products directly to cartStore.
-->
<template>
  <div class="orders-page">
    <div class="container">
      
      <!-- Page Header -->
      <div class="d-flex justify-between align-center mb-6">
        <h1 class="page-title">Order History</h1>
        <router-link to="/menu" class="btn btn--outline btn--sm">+ New Order</router-link>
      </div>

      <!-- Orders List -->
      <div class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          
          <div class="d-flex justify-between align-center mb-2">
            <div>
              <h3 class="order-title mb-1">{{ order.product_name }}</h3>
              <p class="text-muted small mb-0">{{ order.date }} · {{ order.order_number }}</p>
            </div>
            <span class="order-price">R{{ order.total }}</span>
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
import { useCartStore } from '@/store/cartStore';
import { showSuccess } from '@/services/ui';

const cartStore = useCartStore();

// Mock Data (Matches your screenshot exactly)
const orders = [
  {
    id: 1,
    product_name: 'Standard Box',
    date: '26 Aug 2026',
    order_number: 'FB-283741',
    total: 79,
    dietary_tags: ['Standard']
  },
  {
    id: 2,
    product_name: 'Premium Box',
    date: '19 Aug 2026',
    order_number: 'FB-274892',
    total: 99,
    dietary_tags: ['Standard', 'Keto']
  },
  {
    id: 3,
    product_name: 'Vegan Boost Box',
    date: '12 Aug 2026',
    order_number: 'FB-263018',
    total: 79,
    dietary_tags: ['Vegan']
  },
  {
    id: 4,
    product_name: 'Standard Box',
    date: '5 Aug 2026',
    order_number: 'FB-251447',
    total: 79,
    dietary_tags: ['Standard']
  }
];

// Reorder functionality
const handleReorder = (order) => {
  // Create a temporary product object based on the order
  const product = {
    id: order.id,
    name: order.product_name,
    price: order.total, 
    image_url: '', 
    dietary_tags: order.dietary_tags
  };

  // Add to global cart store
  cartStore.addToCart(product);
  
  // Show success message
  showSuccess('Added to Cart', `${order.product_name} has been added to your cart.`);
};
</script>

<style scoped>
.orders-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

/* Order Card */
.order-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
  transition: all var(--transition-fast);
}

.order-card:hover {
  box-shadow: var(--shadow-md);
}

.order-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

.order-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-orange);
}

/* Reorder Button */
.reorder-btn {
  width: 100%;
  margin-top: var(--spacing-4);
  padding: var(--spacing-3);
  border: 2px solid var(--color-orange);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-orange);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: center;
}

.reorder-btn:hover {
  background: var(--color-orange);
  color: var(--color-white);
}

/* Utility Classes */
.text-muted { color: var(--color-gray-500); }
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: var(--spacing-1); }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-6 { margin-bottom: var(--spacing-6); }
.small { font-size: var(--font-size-sm); }
</style>