<!-- 
  Purpose: Custom Box Builder page.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Clicking card navigates to ProductDetailView. Selections restored from sessionStorage.
-->
<template>
  <div class="builder-page">
    <div class="container">
      
      <!-- Page Header -->
      <div class="header-section mb-8">
        <h1 class="page-title">Build Your Own Box 🍱</h1>
        <p class="page-subtitle">Mix and match meals and snacks to create your perfect Performance Fuel box.</p>
      </div>

      <!-- Toggle Button -->
      <div class="toggle-container mb-8">
        <button 
          :class="['toggle-btn', { 'toggle-btn--active': currentType === 'meal' }]"
          @click="switchType('meal')"
        >
          <span class="toggle-icon">🍗</span>
          Build a Meal Box
        </button>
        <button 
          :class="['toggle-btn', { 'toggle-btn--active': currentType === 'snack' }]"
          @click="switchType('snack')"
        >
          <span class="toggle-icon">🥜</span>
          Build a Snack Box
        </button>
      </div>

      <!-- Builder Content -->
      <div v-if="currentItems.length > 0" class="builder-content">
        
        <!-- Items Grid -->
        <div class="items-grid">
          <div 
            v-for="item in currentItems" 
            :key="item.id"
            :class="['builder-item-card', { 'builder-item-card--selected': isSelected(item) }]"
            @click="goToDetails(item)"
          >
            <img :src="item.image_url" :alt="item.name" class="builder-item-image" />
            <div class="builder-item-info">
              <h4 class="builder-item-name">{{ item.name }}</h4>
              <span class="builder-item-price">R{{ Number(item.price).toFixed(2) }}</span>
            </div>
            
            <!-- Remove Button (Only shows if selected) -->
            <button v-if="isSelected(item)" class="remove-btn" @click.stop="removeItem(item)">
              ✕
            </button>
          </div>
        </div>

        <!-- Sticky Summary Bar -->
        <div class="summary-bar">
          <div class="summary-info">
            <span class="summary-label">Your Custom Box</span>
            <span class="summary-count">{{ selectedItems.length }} items selected</span>
          </div>
          <div class="summary-right">
            <span class="summary-total">R{{ totalPrice.toFixed(2) }}</span>
            <button 
              class="btn btn--primary" 
              :disabled="selectedItems.length === 0"
              @click="addCustomBoxToCart"
            >
              Add Box to Cart
            </button>
          </div>
        </div>

      </div>

      <!-- Loading State -->
      <div v-else class="empty-state">
        <div class="spinner spinner--lg spinner--orange mx-auto mb-4"></div>
        <p class="text-muted">Loading items...</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { showSuccess } from '@/services/ui';

const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

const currentType = ref('meal');
const selectedItems = ref([]); 

const currentItems = computed(() => {
  return productStore.builderItems.filter(item => item.category === currentType.value);
});

const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => total + Number(item.price), 0);
});

const switchType = (type) => {
  currentType.value = type; 
  sessionStorage.setItem('builder_type', type);
};

const isSelected = (item) => {
  return selectedItems.value.some(selected => selected.id === item.id);
};

// Click on card = Navigate to details
const goToDetails = (item) => {
  // Set to 'true' so the detail page knows to go back to the Builder
  sessionStorage.setItem('builder_context', 'true');
  router.push(`/product/${item.id}`);
};

const removeItem = (item) => {
  selectedItems.value = selectedItems.value.filter(selected => selected.id !== item.id);
  sessionStorage.setItem('builder_items', JSON.stringify(selectedItems.value));
};

const addCustomBoxToCart = () => {
  const totalItems = selectedItems.value.length;
  const customBox = {
    id: `custom-${Date.now()}`,
    name: `Custom Box (${totalItems} items)`,
    description: `${totalItems} meals & snacks customized by you`,
    price: totalPrice.value,
    quantity: 1,
    image_url: currentType.value === 'meal' ? '/images/builder-meal.png' : '/images/builder-snack.png',
    dietary_tags: ['Custom']
  };

  cartStore.addToCart(customBox);
  showSuccess(`${customBox.name} added to your box! 🎉`);
  selectedItems.value = []; 
  sessionStorage.removeItem('builder_items');
};

onMounted(async () => {
  await productStore.fetchBuilderItems();

  const savedType = sessionStorage.getItem('builder_type');
  if (savedType) {
    currentType.value = savedType;
  }

  const savedItems = sessionStorage.getItem('builder_items');
  if (savedItems) {
    selectedItems.value = JSON.parse(savedItems);
  }
});
</script>

<style scoped>
.builder-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: 80px 0 120px; 
}

.container {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.header-section {
  text-align: center;
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-2);
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-500);
  max-width: 600px;
  margin: 0 auto;
}

.toggle-container {
  display: flex;
  gap: var(--spacing-5);
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.toggle-icon {
  font-size: 2rem;
}

.toggle-btn:hover {
  border-color: var(--color-orange);
}

.toggle-btn--active {
  border-color: var(--color-orange);
  background: rgba(242, 106, 27, 0.05);
  color: var(--color-orange);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .items-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.builder-item-card {
  position: relative;
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.builder-item-card:hover {
  border-color: var(--color-orange);
  transform: translateY(-4px);
}

.builder-item-card--selected {
  border-color: var(--color-orange);
  box-shadow: var(--shadow-lg);
}

.builder-item-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: var(--color-gray-100);
}

.builder-item-info {
  padding: var(--spacing-5);
}

.builder-item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-1);
}

.builder-item-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-orange);
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: var(--color-error);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all var(--transition-fast);
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.summary-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-navy);
  padding: var(--spacing-6) var(--spacing-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
}

.summary-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-white);
  display: block;
}

.summary-count {
  font-size: var(--font-size-base);
  color: var(--color-gray-300);
}

.summary-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-5);
}

.summary-total {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-orange);
}

.summary-bar .btn {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-base);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-12) 0;
}

.mb-2 { margin-bottom: var(--spacing-2); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-8 { margin-bottom: var(--spacing-8); }
.mx-auto { margin-left: auto; margin-right: auto; }
.text-muted { color: var(--color-gray-500); }
</style>