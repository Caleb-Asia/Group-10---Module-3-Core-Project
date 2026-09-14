<!-- 
  Purpose: Custom Box Builder page.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Smooth card reveal, holographic hover, build guide, and reactive summary bar.
-->
<template>
  <div class="builder-page">
    <div class="container">
      
      <!-- Page Header -->
      <div class="header-section mb-8">
        <span class="builder-eyebrow">DESIGNED BY YOU</span>
        <h1 class="page-title">Build Your Own Box</h1>
        <p class="page-subtitle">Mix and match meals and snacks to create your perfect Performance Fuel box.</p>
      </div>

      <div class="build-guide" aria-label="Box building steps">
        <div class="guide-step guide-step--active">
          <span class="guide-number">1</span>
          <div><strong>Choose a box</strong><span>Meals or snacks</span></div>
        </div>
        <span class="guide-line"></span>
        <div class="guide-step">
          <span class="guide-number">2</span>
          <div><strong>View details & select</strong><span>Tap a card to explore</span></div>
        </div>
        <span class="guide-line"></span>
        <div class="guide-step">
          <span class="guide-number">3</span>
          <div><strong>Review & add to cart</strong><span>Checkout in seconds</span></div>
        </div>
      </div>

      <!-- Toggle Button -->
      <div class="toggle-container mb-8">
        <button 
          :class="['toggle-btn', { 'toggle-btn--active': currentType === 'meal' }]"
          @click="switchType('meal')"
        >
          <span class="toggle-main">Build a Meal Box</span>
          <span class="toggle-detail">Fuel for busy days</span>
        </button>
        <button 
          :class="['toggle-btn', { 'toggle-btn--active': currentType === 'snack' }]"
          @click="switchType('snack')"
        >
          <span class="toggle-main">Build a Snack Box</span>
          <span class="toggle-detail">Easy energy on the go</span>
        </button>
      </div>

      <div class="builder-status">
        <div>
          <span class="status-kicker">CURRENT BUILD</span>
          <strong>{{ selectedItems.length ? `${selectedItems.length} item${selectedItems.length === 1 ? '' : 's'} selected` : 'Your box is waiting for inspiration' }}</strong>
        </div>
        <span class="status-tip">{{ selectedItems.length ? 'Keep exploring to make it yours.' : 'Select a card to view details and add it.' }}</span>
      </div>

      <!-- Builder Content -->
      <div v-if="currentItems.length > 0" class="builder-content">
        
        <!-- Items Grid -->
        <div class="items-grid">
          <div 
            v-for="(item, index) in currentItems" 
            :key="item.id"
            class="builder-item-card"
            :class="{ 'builder-item-card--selected': isSelected(item) }"
            :style="{ '--card-delay': `${index * 80}ms` }"
            @click="goToDetails(item)"
          >
            <!-- Holographic Shine Overlay -->
            <div class="builder-item-card__shine"></div>
            
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

        <!-- REACTIVE Sticky Summary Bar -->
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

const goToDetails = (item) => {
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
    image_url: '/images/custom-meal-box.png',
    dietary_tags: ['Custom'],
    isCustom: true,
    customItems: selectedItems.value.map(item => ({
      productId: Number(item.id),
      quantity: 1
    }))
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
  background: linear-gradient(135deg, #fff8f0 0%, #fff3e5 55%, #fdf0d9 100%);
  min-height: 100vh;
  padding: 120px 0 140px; 
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

.builder-eyebrow {
  display: block;
  margin-bottom: var(--spacing-3);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.14em;
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

.build-guide {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-4);
  max-width: 850px;
  margin: 0 auto var(--spacing-8);
  padding: var(--spacing-5) var(--spacing-6);
  border: 1px solid rgba(15, 33, 55, 0.08);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow-sm);
}

.guide-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  min-width: 0;
  color: var(--color-gray-500);
}

.guide-step--active {
  color: var(--color-navy);
}

.guide-number {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: var(--color-gray-100);
  color: var(--color-gray-500);
  font-weight: var(--font-weight-bold);
}

.guide-step--active .guide-number {
  background: var(--color-orange);
  color: var(--color-white);
}

.guide-step strong,
.guide-step span:not(.guide-number) {
  display: block;
}

.guide-step strong {
  font-size: var(--font-size-sm);
}

.guide-step span:not(.guide-number) {
  margin-top: 2px;
  font-size: var(--font-size-xs);
}

.guide-line {
  width: 44px;
  height: 1px;
  flex: 0 0 auto;
  background: #e6cdb7;
}

/* Toggle Button */
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
  flex-direction: column; /* FIX: Column so subtext goes to the bottom */
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-5);
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.toggle-main {
  display: block;
}

.toggle-detail {
  display: block;
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold); /* FIX: Made bold */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toggle-btn--active .toggle-detail {
  color: var(--color-orange); /* FIX: Different color when active */
}

.toggle-btn:hover {
  border-color: var(--color-orange);
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(242, 106, 27, 0.15);
}

.toggle-btn--active {
  border-color: var(--color-orange);
  background: rgba(242, 106, 27, 0.05);
  color: var(--color-orange);
}

.builder-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4) var(--spacing-5);
  border-left: 4px solid var(--color-orange);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.72);
}

.status-kicker {
  display: block;
  margin-bottom: var(--spacing-1);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.08em;
}

.builder-status strong {
  color: var(--color-navy);
  font-size: var(--font-size-base);
}

.status-tip {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  text-align: right;
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

/* Smooth Card Reveal & Holographic Shine Animation */
.builder-item-card {
  position: relative;
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  cursor: pointer;

  opacity: 0;
  transform: translateY(30px);
  
  transition: opacity 0.5s ease,
              transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
              border-color 0.3s ease,
              box-shadow 0.3s ease;

  transition-delay: var(--card-delay, 0ms);
}

.builder-item-card {
  animation: showCard 0.01s forwards;
  animation-delay: var(--card-delay, 0ms);
}

@keyframes showCard {
  to { opacity: 1; transform: translateY(0); }
}

/* Holographic Shine */
.builder-item-card__shine {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(0deg, transparent, transparent 30%, rgba(242, 106, 27, 0.3));
  transform: rotate(-45deg);
  transition: all 0.5s ease;
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

/* HOVER ANIMATION: Lift up + Glow + Shine */
.builder-item-card:hover {
  border-color: var(--color-orange);
  transform: translateY(-8px) scale(1.05); 
  box-shadow: 0 0 20px rgba(242, 106, 27, 0.4); 
}

.builder-item-card:hover .builder-item-card__shine {
  opacity: 1;
  transform: rotate(-45deg) translateY(100%);
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
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Hover zoom on the image */
.builder-item-card:hover .builder-item-image {
  transform: scale(1.1) rotate(1deg);
}

.builder-item-info {
  padding: var(--spacing-5);
  transition: transform 0.4s ease;
}

.builder-item-card:hover .builder-item-info {
  transform: translateY(-4px);
}

.builder-item-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-1);
  transition: color 0.3s ease;
}

.builder-item-card:hover .builder-item-name {
  color: var(--color-orange);
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
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* REACTIVE Summary Bar */
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

@media (max-width: 700px) {
  .builder-page {
    padding: 90px 0 140px;
  }

  .build-guide {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .guide-line {
    display: none;
  }

  .toggle-container {
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .toggle-btn {
    flex: none;
  }

  .builder-status {
    align-items: flex-start;
    flex-direction: column;
  }

  .status-tip {
    text-align: left;
  }
}

/* DARK MODE */
[data-theme="dark"] .builder-page {
  background: #0B1120;
}

[data-theme="dark"] .builder-item-card {
  background: #1A2436;
  border-color: #2D3748;
}

[data-theme="dark"] .builder-item-card:hover {
  border-color: var(--color-orange);
}

[data-theme="dark"] .builder-item-name {
  color: #FFFFFF;
}

[data-theme="dark"] .builder-item-card:hover .builder-item-name {
  color: var(--color-orange);
}

[data-theme="dark"] .toggle-btn {
  background: #1A2436;
  border-color: #2D3748;
  color: #FFFFFF;
}

[data-theme="dark"] .build-guide,
[data-theme="dark"] .builder-status {
  background: #1A2436;
  border-color: #2D3748;
}

[data-theme="dark"] .guide-step--active,
[data-theme="dark"] .builder-status strong {
  color: #FFFFFF;
}

[data-theme="dark"] .page-subtitle,
[data-theme="dark"] .guide-step,
[data-theme="dark"] .guide-step span:not(.guide-number),
[data-theme="dark"] .status-tip {
  color: #CBD5E1;
}

/* Utility */
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-8 { margin-bottom: var(--spacing-8); }
.mx-auto { margin-left: auto; margin-right: auto; }
.text-muted { color: var(--color-gray-500); }
</style>
