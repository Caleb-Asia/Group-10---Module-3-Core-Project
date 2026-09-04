<!-- 
  Purpose: Full product detail page with nutrition and allergen info.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Supports "Builder Mode" - saves selected items and returns to BoxBuilderView.
-->
<template>
  <div class="product-detail-page">
    <div class="container">
      
      <!-- Product Detail Card -->
      <div v-if="product" class="detail-card">
        
        <!-- Back Button (Inside the card) -->
        <button class="btn btn--outline back-btn" @click="goBack">
          ← {{ isBuilderMode ? 'Back to Builder' : 'Back to Menu' }}
        </button>

        <div class="detail-body">
          <!-- Product Image -->
          <div class="detail-image-wrapper">
            <img :src="product.image_url || '/images/placeholder-product.png'" :alt="product.name" class="detail-image" />
          </div>

          <!-- Product Info -->
          <div class="detail-info">
            <div class="d-flex justify-between align-start mb-4">
              <div>
                <h1 class="detail-title">{{ product.name }}</h1>
                <div class="tag-list mb-3">
                  <span v-for="tag in getDietaryTags(product)" :key="tag" class="chip chip--dietary">{{ tag }}</span>
                </div>
                <div class="satiety-rating">
                  <span class="text-muted">Satiety Rating:</span>
                  <Star :size="16" :fill="'#F59E0B'" :stroke="'#F59E0B'" />
                  <Star :size="16" :fill="'#F59E0B'" :stroke="'#F59E0B'" />
                  <Star :size="16" :fill="'#F59E0B'" :stroke="'#F59E0B'" />
                  <Star :size="16" :fill="'#F59E0B'" :stroke="'#F59E0B'" />
                  <span class="text-muted">4/5</span>
                </div>
              </div>
              <span class="detail-price">R{{ Number(product.price).toFixed(2) }}</span>
            </div>

            <!-- Nutrition Info -->
            <div class="accordion-section">
              <div class="accordion-header" @click="toggleAccordion('nutrition')">
                <span>Nutrition Info</span>
                <span>{{ openAccordion === 'nutrition' ? '−' : '+' }}</span>
              </div>
              <div v-if="openAccordion === 'nutrition'" class="accordion-content">
                <div class="nutrition-grid">
                  <div class="nutrition-box"><span>Protein</span><strong>22g</strong></div>
                  <div class="nutrition-box"><span>Carbs</span><strong>62g</strong></div>
                  <div class="nutrition-box"><span>Fat</span><strong>14g</strong></div>
                  <div class="nutrition-box"><span>Fibre</span><strong>14g</strong></div>
                  <div class="nutrition-box"><span>Calories</span><strong>490kcal</strong></div>
                </div>
              </div>
            </div>

            <!-- Allergen Matrix -->
            <div class="accordion-section">
              <div class="accordion-header" @click="toggleAccordion('allergen')">
                <span>Allergen Matrix</span>
                <span>{{ openAccordion === 'allergen' ? '−' : '+' }}</span>
              </div>
              <div v-if="openAccordion === 'allergen'" class="accordion-content">
                <p class="text-muted mb-0">Contains: Gluten, Soy. <strong class="text-navy">Nut-Free</strong> (Safe for allergies).</p>
              </div>
            </div>

            <!-- What's Inside -->
            <div class="accordion-section">
              <div class="accordion-header" @click="toggleAccordion('inside')">
                <span>What's Inside</span>
                <span>{{ openAccordion === 'inside' ? '−' : '+' }}</span>
              </div>
              <div v-if="openAccordion === 'inside'" class="accordion-content">
                <ul class="ingredients-list mb-0">
                  <li>Grilled chicken breast</li>
                  <li>Steamed broccoli & carrots</li>
                  <li>Fluffy white rice</li>
                  <li>Herb butter sauce</li>
                </ul>
              </div>
            </div>

            <!-- Dynamic Button -->
            <button class="btn btn--primary btn--full btn--xl mt-6" @click="handleItemAction">
              {{ isBuilderMode ? 'Add to Box' : 'Add to Cart' }}
            </button>

          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p class="text-muted">Loading product details...</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { showSuccess } from '@/services/ui';
import { Star } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

const openAccordion = ref('nutrition');
const isBuilderMode = ref(false);

const product = computed(() => {
  return productStore.products.find(p => p.id === Number(route.params.id)) || 
         productStore.builderItems.find(p => p.id === Number(route.params.id));
});

const getDietaryTags = (product) => {
  if (Array.isArray(product.dietary_tags)) return product.dietary_tags;
  if (typeof product.dietary_tags === 'string' && product.dietary_tags.trim()) return product.dietary_tags.split(',').map(tag => tag.trim());
  return [];
};

const toggleAccordion = (section) => {
  openAccordion.value = openAccordion.value === section ? '' : section;
};

const goBack = () => {
  router.push(isBuilderMode.value ? '/builder' : '/menu');
};

const handleItemAction = () => {
  if (isBuilderMode.value) {
    const savedItems = JSON.parse(sessionStorage.getItem('builder_items') || '[]');
    const exists = savedItems.find(item => item.id === product.value.id);
    if (!exists) {
      savedItems.push(product.value);
      sessionStorage.setItem('builder_items', JSON.stringify(savedItems));
      showSuccess('Added to Builder', `${product.value.name} selected for your box!`);
    } else {
      showSuccess('Already Selected', `${product.value.name} is already in your box.`);
    }
    router.push('/builder');
  } else {
    cartStore.addToCart({
      id: product.value.id,
      name: product.value.name,
      price: parseFloat(product.value.price),
      quantity: 1,
      image_url: product.value.image_url || '',
      dietary_tags: product.value.dietary_tags || []
    });
    showSuccess(`${product.value.name} added to your box!`);
  }
};

onMounted(async () => {
  isBuilderMode.value = sessionStorage.getItem('builder_context') === 'true';

  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }
  if (productStore.builderItems.length === 0) {
    await productStore.fetchBuilderItems();
  }
});
</script>

<style scoped>
.product-detail-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  /* REDUCED the top padding to 70px */
  padding: 70px 0 100px; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.container {
  max-width: 1100px; 
  width: 100%;
  margin: 0 auto;
  padding: 0 20px; 
}

/* Main Card */
.detail-card {
  background: var(--color-white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  /* NO forced height - lets it fit comfortably */
}

.back-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 10;
  background: var(--color-white);
  color: var(--color-orange);
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-md);
}

/* Side by Side Layout */
.detail-body {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (min-width: 768px) {
  .detail-body {
    flex-direction: row;
  }
}

.detail-image-wrapper {
  width: 100%;
}

@media (min-width: 768px) {
  .detail-image-wrapper {
    width: 45%; 
    flex-shrink: 0;
  }
}

.detail-image {
  width: 100%;
  height: 100%;
  min-height: 400px; /* Comfortable height */
  object-fit: cover;
}

.detail-info {
  padding: var(--spacing-6);
  width: 100%;
}

@media (min-width: 768px) {
  .detail-info {
    width: 55%;
  }
}

.detail-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-2);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
}

.satiety-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.detail-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-orange);
}

.accordion-section {
  border-top: 1px solid var(--color-gray-100);
  margin-top: var(--spacing-4);
}

.accordion-header {
  padding: var(--spacing-3) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  font-size: var(--font-size-base);
}

.accordion-content {
  padding-bottom: var(--spacing-3);
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-2);
}

.nutrition-box {
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  padding: var(--spacing-3);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nutrition-box span {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.nutrition-box strong {
  font-size: var(--font-size-base);
  color: var(--color-navy);
}

.ingredients-list {
  padding-left: var(--spacing-6);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

/* Utility */
.mb-0 { margin-bottom: 0; }
.mb-3 { margin-bottom: var(--spacing-3); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mt-6 { margin-top: var(--spacing-6); }
.text-navy { color: var(--color-navy); }
.text-muted { color: var(--color-gray-500); }
.d-flex { display: flex; }
.align-start { align-items: flex-start; }
.justify-between { justify-content: space-between; }
</style>