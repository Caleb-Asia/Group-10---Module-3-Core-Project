<!-- 
  Purpose: Reusable product card for the catalogue.
  Module: Frontend - Components
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Clicking card routes to ProductDetailView. 
         "Add to Box" button has @click.stop to only add to cart.
         Features IntersectionObserver scroll-reveal animation.
-->

<template>
  <div ref="card" class="product-card" :class="{ 'product-card--revealed': isRevealed }" @click="goToDetail">
    
    <!-- Image Area -->
    <div class="product-card__image-wrapper">
      <img 
        :src="getImage(product)" 
        :alt="product.name" 
        class="product-card__image"
        loading="lazy"
      />
    </div>

    <!-- Body Area -->
    <div class="product-card__body">
      <h3 class="product-card__name">{{ product.name }}</h3>
      
      <!-- Tags placed directly below the name (BIGGER) -->
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
  if (product.image_url) return product.image_url;
  const imageMap = {
    // Original Boxes
    'Starter Box': '/images/starter-box.png',
    'Standard Box': '/images/standard-box.png',
    'Premium Box': '/images/premium-box.png',
    'Vegan Boost Box': '/images/vegan-box.png',
    'Keto Fuel Box': '/images/keto-box.png',
    'Nut-Free Safety Box': '/images/nut-free-box.png',
    'Monthly Snack Box': '/images/snack-box.png',

    // New Creative Boxes
    'Campus Grind Box': '/images/campus-grind.png',
    'Freshman 15 (Keto)': '/images/freshman-15.png',
    'Varsity Athlete Box': '/images/varsity-athlete.png',
    'All-Nighter Box': '/images/all-nighter.png',
    'Coffee Shop Box': '/images/coffee-shop.png',

    // Exam Week Boxes
    'Exam Week Survival: Study Fuel': '/images/exam-box1.png',
    'Exam Week Survival: Brain Boost': '/images/exam-box2.png',

    // Builder Meals (Original + New)
    'Grilled Chicken & Rice': '/images/grilled-chicken-rice.png',
    'Beef Teriyaki Bowl': '/images/beef-teriyaki-bowl.png',
    'Zesty Lemon Salmon': '/images/zesty-lemon-salmon.png',
    'Spicy Tofu Stir-fry': '/images/builder-meal.png',
    'Herbed Pasta Primavera': '/images/herbed-pasta-primavera.png',
    'BBQ Chicken Wrap': '/images/bbq-chicken-wrap.png',
    'Power Rice Bowl': '/images/power-rice-bowl.png',
    'Lean Steak & Greens': '/images/lean-steak-greens.png',
    'Harvest Veggie Curry': '/images/harvest-curry.png',

    // Builder Snacks (Original + New)
    'Protein Power Balls': '/images/protein-power-balls.png',
    'Salted Caramel Popcorn': '/images/salted-caramel-popcorn.png',
    'Roasted Chickpeas': '/images/roasted-chickpeas.png',
    'Fruit & Nut Mix': '/images/builder-snack.png',
    'Greek Yogurt Cup': '/images/greek-yogurt-cup.png',
    'Sea Salt Crisps': '/images/sea-salt-crisps.png',
    'Dark Choc Almonds': '/images/dark-choc-almonds.png',
    'Apple Cinnamon Bites': '/images/apple-cinnamon-bites.png',
    'Pretzel Sticks': '/images/pretzel-sticks.png',

    // Common fallbacks
    'Builder Meals': '/images/builder-meal.png',
    'Builder Snacks': '/images/builder-snack.png'
  };
  return imageMap[product.name] || '/images/placeholder-product.png';
};

const getDietaryTags = (product) => {
  if (Array.isArray(product.dietary_tags)) return product.dietary_tags;
  if (typeof product.dietary_tags === 'string' && product.dietary_tags.trim()) return product.dietary_tags.split(',').map(tag => tag.trim());
  return [];
};

// Route to full detail page
const goToDetail = () => {
  // Set to 'false' so the detail page knows to go back to the Menu
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
.product-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
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
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
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
    transition: transform var(--transition-slow);
  }

  &:hover &__image {
    transform: scale(1.05);
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

  /* FORCED to be inside the body, under the name */
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
}

@media (prefers-reduced-motion: reduce) {
  .product-card {
    opacity: 1;
    transform: none;
    transition: box-shadow var(--transition-base);
  }
}
</style>