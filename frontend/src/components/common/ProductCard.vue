<!-- 
  Purpose: Reusable product card for the catalogue with holographic shine hover effect.
  Module: Frontend - Components
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Clicking card routes to ProductDetailView. 
         "Add to Box" button has @click.stop to only add to cart.
-->
<template>
  <div ref="card" class="product-card" :class="{ 'product-card--revealed': isRevealed }" @click="goToDetail">
    
    <!-- Image Area -->
    <div v-if="product.id === 11 || product.id === 12" class="product-card__image-wrapper">
      <img 
        :src="getImage(product)" 
        :alt="product.name" 
        class="product-card__image"
        loading="lazy"
      />
      <!-- Holographic Shine Overlay -->
      <div class="product-card__shine"></div>
    </div>

    <!-- Body Area -->
    <div class="product-card__body">
      <h3 class="product-card__name">{{ product.name }}</h3>
      
      <!-- Tags placed directly below the name -->
      <div class="product-card__tag-list">
        <span 
          v-for="tag in getDietaryTags(product)" 
          :key="tag" 
          class="chip chip--dietary"
        >
          {{ tag }}
        </span>
      </div>

      <div class="product-card__footer">
        <span class="price price--lg">R{{ Number(product.price).toFixed(2) }}</span>
        
        <!-- @click.stop prevents the card's goToDetail from firing -->
        <button 
          class="btn btn--primary btn--sm" 
          @click.stop="handleAddToCart"
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
import { ref, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['add-to-cart']);
const router = useRouter();

const isAdding = ref(false);
const isRevealed = ref(false);
const card = ref(null);
let observer;

onMounted(() => {
  if (!card.value || !('IntersectionObserver' in window)) {
    isRevealed.value = true;
    return;
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isRevealed.value = true;
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.15 });

  observer.observe(card.value);
});

onBeforeUnmount(() => observer?.disconnect());

const getImage = (product) => {
  const imageMap = {
    'Halal Fuel Box': '/images/halaal-box.png',
    'Gluten-Free Box': '/images/gluten-free.png'
  };
  if (imageMap[product.name] && (!product.image_url || product.image_url.includes('placeholder-product'))) {
    return imageMap[product.name];
  }
  return product.image_url || '/images/placeholder-product.png';
};

const getDietaryTags = (product) => {
  if (Array.isArray(product.dietary_tags)) return product.dietary_tags;
  if (typeof product.dietary_tags === 'string' && product.dietary_tags.trim()) return product.dietary_tags.split(',').map(tag => tag.trim());
  return [];
};

// Route to full detail page
const goToDetail = () => {
  sessionStorage.setItem('builder_context', 'false'); 
  router.push(`/product/${props.product.id}`);
};

const handleAddToCart = () => {
  isAdding.value = true;
  setTimeout(() => {
    emit('add-to-cart', props.product);
    isAdding.value = false;
  }, 300);
};
</script>

<style scoped lang="scss">
/* Premium Holographic Hover Animation */
.product-card {
  position: relative;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 480ms ease var(--reveal-delay, 0ms),
    transform 480ms cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms),
    box-shadow var(--transition-base);

  &--revealed {
    opacity: 1;
    transform: translateY(0);
  }

  /* Holographic Shine */
  &__shine {
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
  
  &:hover {
    transform: translateY(-6px) scale(1.05);
    box-shadow: 0 0 20px rgba(242, 106, 27, 0.4);
  }

  &:hover &__shine {
    opacity: 1;
    transform: rotate(-45deg) translateY(100%);
  }

  &__image-wrapper {
    position: relative;
    padding-top: 75%;
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
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover &__image {
    transform: scale(1.1) rotate(1deg);
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

  &__tag-list {
    position: static !important;
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-4);
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

/* Make dietary tags BIGGER and bolder */
.product-card :deep(.chip--dietary) {
  background: var(--color-cream);
  border: 1px solid var(--color-gray-200);
  color: var(--color-navy);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

/* FIX: Do NOT change tag color on hover */
.product-card:hover :deep(.chip--dietary) {
  background: var(--color-cream);
  color: var(--color-navy);
  border-color: var(--color-gray-200);
}

/* DARK MODE FIXES */





@media (prefers-reduced-motion: reduce) {
  .product-card {
    opacity: 1;
    transform: none;
    transition: box-shadow var(--transition-base);
  }
}
</style>
