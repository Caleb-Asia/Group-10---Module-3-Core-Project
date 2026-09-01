<!-- 
  Purpose: Reusable product card for the catalogue.
  Module: Frontend - Components
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Uses local images. Emits add-to-cart event to parent.
-->

<template>
  <div class="product-card">
    <!-- Image Area -->
    <div class="product-card__image-wrapper">
      <img 
        :src="getImage(product)" 
        :alt="product.name" 
        class="product-card__image"
        loading="lazy"
      />
      
      <!-- Dietary Tags Overlay -->
      <div class="product-card__tags">
        <span 
          v-for="tag in getDietaryTags(product)" 
          :key="tag" 
          class="chip chip--dietary"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Category Badge (NEW) -->
      <span class="product-card__category">{{ product.category || 'Box' }}</span>
    </div>

    <!-- Content Area -->
    <div class="product-card__body">
      <h3 class="product-card__name">{{ product.name }}</h3>
      <!-- Fallback Description (NEW) -->
      <p class="product-card__description">{{ product.description || 'Performance fuel for your busy day.' }}</p>

      <!-- Footer with Price and Button -->
      <div class="product-card__footer">
        <span class="price price--lg">R{{ Number(product.price).toFixed(2) }}</span>
        
        <button 
          class="btn btn--primary btn--sm" 
          @click="handleAddToCart"
          :disabled="isAdding"
        >
          <span v-if="isAdding" class="spinner spinner--dark"></span>
          <span v-else>Add to Box</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add-to-cart']);

// Local state for button loading
const isAdding = ref(false);

/**
 * Helper to retrieve the correct local image based on the product name
 */
const getImage = (product) => {
  if (product.image_url) {
    return product.image_url;
  }

  const imageMap = {
    'Starter Box': '/images/starter-box.png',
    'Standard Box': '/images/standard-box.png',
    'Premium Box': '/images/premium-box.png',
    'Vegan Boost Box': '/images/vegan-box.png',
    'Keto Fuel Box': '/images/keto-box.png',
    'Nut-Free Safety Box': '/images/nut-free-box.png',
    'Monthly Snack Box': '/images/snack-box.png',
    'Builder Snack Mix': '/images/builder-snacks.png',
    'Gluten-Free': '/images/gluten-free-box.png',
  };

  return imageMap[product.name] || '/images/placeholder-product.png';
};

/**
 * Helper to normalize dietary tags (handle strings or arrays)
 */
const getDietaryTags = (product) => {
  if (Array.isArray(product.dietary_tags)) {
    return product.dietary_tags;
  }
  if (typeof product.dietary_tags === 'string' && product.dietary_tags.trim()) {
    return product.dietary_tags.split(',').map(tag => tag.trim());
  }
  return [];
};

/**
 * Emit the add-to-cart event with a small delay to simulate loading
 */
const handleAddToCart = () => {
  isAdding.value = true;
  
  setTimeout(() => {
    emit('add-to-cart', props.product);
    isAdding.value = false;
  }, 300);
};
</script>

<style lang="scss" scoped>
.product-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  &__image-wrapper {
    position: relative;
    padding-top: 75%; // 4:3 aspect ratio
    overflow: hidden;
    background: var(--color-gray-100);
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--transition-slow);
  }

  &:hover &__image {
    transform: scale(1.05);
  }

  &__tags {
    position: absolute;
    top: var(--spacing-2);
    left: var(--spacing-2);
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-1);
    z-index: 2;
  }

  /* Category Badge Styles (Added) */
  &__category {
    position: absolute;
    top: var(--spacing-2);
    right: var(--spacing-2);
    background: var(--color-navy);
    color: var(--color-white);
    padding: 2px 10px;
    border-radius: var(--radius-full);
    font-size: 11px;
    font-weight: var(--font-weight-semibold);
    text-transform: capitalize;
    z-index: 2;
  }

  &__body {
    padding: var(--spacing-4);
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__name {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    color: var(--color-navy);
    margin-bottom: var(--spacing-2);
    line-height: 1.3;
  }

  &__description {
    font-size: var(--font-size-sm);
    color: var(--color-gray-500);
    margin-bottom: var(--spacing-4);
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--spacing-4);
    border-top: 1px solid var(--color-gray-100);
    gap: var(--spacing-3);
  }
}
</style>