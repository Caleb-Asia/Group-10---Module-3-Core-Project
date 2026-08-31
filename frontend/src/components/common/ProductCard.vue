<!--
  Purpose: Reusable product/box card component
  Module: Component - Common - ProductCard
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Used in MenuView AND can be used by Sisamila on homepage for boxes.
         Shows dietary tags as pill chips, rounded white card style.
-->

<template>
  <div class="product-card" :class="{ 'product-card--inactive': !product.is_active }">
    <!-- Image with Dietary Tags Overlay -->
    <div class="product-card__image-wrapper">
      <img 
        :src="product.image_url || defaultImage" 
        :alt="product.name"
        class="product-card__image"
        @error="handleImageError"
      />
      <div class="product-card__tags">
        <span 
          v-for="tag in dietaryTags" 
          :key="tag"
          class="chip chip--dietary"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- Card Body -->
    <div class="product-card__body">
      <h3 class="product-card__name">{{ product.name }}</h3>
      <p class="product-card__description">{{ product.description }}</p>
      
      <!-- Footer: Price + Button -->
      <div class="product-card__footer">
        <span class="price price--lg">R{{ product.price }}</span>
        <button 
          class="btn btn--primary btn--sm"
          :disabled="!product.is_active || adding"
          @click="handleAddToCart"
        >
          <span v-if="adding" class="spinner"></span>
          <span v-else>Add to Cart</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ProductCard Component
 * Owner: Caleb Asia
 * Reusable for boxes, meals, snacks
 */

import { ref, computed } from 'vue'
import { ui } from '@/services/ui'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const adding = ref(false)

// Default placeholder image SVG
const defaultImage = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect fill="#E5E7EB" width="400" height="300"/>
    <text fill="#9CA3AF" font-family="sans-serif" font-size="16" x="200" y="155" text-anchor="middle">FoodBoxx</text>
  </svg>
`)}`

/**
 * Parse dietary tags - handles string or array
 */
const dietaryTags = computed(() => {
  if (!props.product.dietary_tags) return []
  if (Array.isArray(props.product.dietary_tags)) return props.product.dietary_tags
  return props.product.dietary_tags.split(',').map(t => t.trim()).filter(Boolean)
})

/**
 * Handle broken images
 */
function handleImageError(e) {
  e.target.src = defaultImage
}

/**
 * Add to cart with feedback
 */
async function handleAddToCart() {
  adding.value = true
  try {
    emit('add-to-cart', props.product)
    ui.toast(`${props.product.name} added!`, 'success')
  } catch (error) {
    ui.error('Error', 'Could not add to cart')
  } finally {
    setTimeout(() => { adding.value = false }, 300)
  }
}
</script>

<style scoped>
.product-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product-card--inactive {
  opacity: 0.5;
  pointer-events: none;
}

.product-card__image-wrapper {
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  background: var(--color-gray-100);
}

.product-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

.product-card__tags {
  position: absolute;
  top: var(--spacing-2);
  left: var(--spacing-2);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
}

.product-card__body {
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-2);
}

.product-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin-bottom: var(--spacing-4);
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-gray-100);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 768px) {
  .product-card__body {
    padding: var(--spacing-5);
  }
}
</style>