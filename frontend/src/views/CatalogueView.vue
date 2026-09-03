<!-- 
  Purpose: Product catalogue with search + dietary filters 
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: All filtering happens client-side. Uses reusable DietaryFilterPills component.
-->
<template>
  <div class="catalogue-page">
    <!-- Page Header -->
    <section class="catalogue-header">
      <div class="container">
        <h1 class="text-white">Fuel Your Study Session</h1>
        <p class="text-white opacity-75">Not your average meal box — Performance Fuel for Cape Town's best</p>
      </div>
    </section>

    <!-- Search & Filters -->
    <section class="filters-section bg-white border-bottom">
      <div class="container">
        
        <!-- Search Bar -->
        <div class="search-wrapper mb-4">
          <label for="catalogue-search" class="visually-hidden">Search boxes</label>
          <div class="search-input-group">
            <span class="search-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </span>
            <input id="catalogue-search" v-model="searchQuery" type="text" class="search-input" placeholder="Search boxes..." />
          </div>
        </div>

        <!-- Reusable Filter Pills -->
        <DietaryFilterPills 
          :active-filters="activeFilters" 
          @update:filters="updateFilters"
          @clear="clearFilters"
        />

      </div>
    </section>

    <!-- Results Count -->
    <section class="results-bar bg-gray-50">
      <div class="container">
        <div class="d-flex justify-between align-center">
          <span class="text-muted small">
            <strong>{{ filteredProducts.length }}</strong> boxes found
            <span v-if="activeFilters.length > 0" class="text-muted">(filtered by {{ activeFilters.join(', ') }})</span>
          </span>
          <span v-if="isLoading" class="spinner spinner--orange"></span>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <section class="products-grid">
      <div class="container">
        
        <!-- Loading State -->
        <div v-if="isLoading" class="empty-state">
          <div class="spinner spinner--lg spinner--orange mx-auto mb-4"></div>
          <p class="text-muted">Loading your Performance Fuel...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" stroke-width="1" class="mb-4 opacity-25">
            <path d="M20 7h-4.5L15 4h-6L8.5 7H4v11h16V7z"/>
            <circle cx="9" cy="13" r="1.5" fill="var(--color-navy)"/>
            <circle cx="15" cy="13" r="1.5" fill="var(--color-navy)"/>
          </svg>
          <h5 class="text-muted">No boxes found</h5>
          <p class="text-muted small">Try adjusting your filters or search terms</p>
          <button class="btn btn--outline mt-4" @click="clearFilters">Clear all filters</button>
        </div>

        <!-- Product Cards -->
        <div v-else class="product-grid">
          <ProductCard
            v-for="(product, index) in filteredProducts"
            :key="product.id"
            :product="product"
            :style="{ '--reveal-delay': `${Math.min(index % 3, 2) * 90}ms` }"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <!-- Build Your Own Box Banner -->
        <div class="build-banner mt-8">
          <div class="d-flex align-center justify-between">
            <div>
              <h3 class="text-white mb-2">🍱 Build Your Own Box</h3>
              <p class="text-white opacity-75 mb-0">
                Mix meals from <strong>R25</strong> + snacks from <strong>R12</strong>.
                Create your perfect Performance Fuel box.
              </p>
            </div>
            <router-link to="/builder" class="btn btn--primary btn--lg">Build Now →</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { showSuccess, showError } from '@/services/ui';
import ProductCard from '@/components/common/ProductCard.vue';
import DietaryFilterPills from '@/components/common/DietaryFilterPills.vue';

const productStore = useProductStore();
const cartStore = useCartStore();

const searchQuery = ref('');
const activeFilters = ref([]);
const isLoading = ref(false);

const filteredProducts = computed(() => {
  let products = productStore.products;
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      (p.dietary_tags && p.dietary_tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }
  if (activeFilters.value.length > 0) {
    products = products.filter(p => {
      const productTags = Array.isArray(p.dietary_tags)
        ? p.dietary_tags.map(t => t.toLowerCase())
        : (p.dietary_tags || '').split(',').map(t => t.trim().toLowerCase());
      return activeFilters.value.every(filter => productTags.includes(filter.toLowerCase()));
    });
  }
  return products;
});

// Called by the component
const updateFilters = (newFilters) => {
  activeFilters.value = newFilters;
};

const clearFilters = () => {
  activeFilters.value = [];
  searchQuery.value = '';
};

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    await productStore.fetchProducts();
  } catch (error) {
    showError('Failed to load products. Please refresh the page.');
  } finally {
    isLoading.value = false;
  }
};

const handleAddToCart = (product) => {
  try {
    cartStore.addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image_url: product.image_url || '',
      dietary_tags: product.dietary_tags || []
    });
    showSuccess(
      `${product.name} added to your box!`,
      '',
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F26A1B" stroke-width="2" style="display: block; margin: 0 auto;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
    );
  } catch (error) {
    showError('Could not add item to cart. Please try again.');
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.catalogue-page {
  background-color: var(--color-cream);
  min-height: 100vh;
}

.catalogue-header {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
  border-bottom: 4px solid var(--color-orange);
  padding: var(--spacing-8) 0;
}

.filters-section {
  padding: var(--spacing-6) 0;
  border-bottom: 1px solid var(--color-gray-200);
}

.search-wrapper {
  width: 100%;
}

.search-input-group {
  position: relative;
}

.search-icon {
  position: absolute;
  left: var(--spacing-5);
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-4) var(--spacing-6) var(--spacing-4) 4rem;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-full);
  background: var(--color-white);
  font-size: var(--font-size-lg);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(242, 106, 27, 0.15);
}

.results-bar { padding: var(--spacing-3) 0; border-bottom: 1px solid var(--color-gray-200); }
.products-grid { padding: var(--spacing-8) 0; }
.product-grid { display: grid; grid-template-columns: 1fr; gap: var(--spacing-6); }

@media (min-width: 768px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}

.build-banner {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
  border-radius: var(--radius-xl);
  padding: var(--spacing-8);
  box-shadow: var(--shadow-lg);
}

.empty-state { text-align: center; padding: var(--spacing-12) 0; }

/* Utility */
.mb-0 { margin-bottom: 0; }
.mb-4 { margin-bottom: var(--spacing-4); }
.mt-4 { margin-top: var(--spacing-4); }
.mt-8 { margin-top: var(--spacing-8); }
.small { font-size: var(--font-size-sm); }
.text-navy { color: var(--color-navy); }
.text-muted { color: var(--color-gray-500); }
.opacity-75 { opacity: 0.75; }
.mx-auto { margin-left: auto; margin-right: auto; }
.d-flex { display: flex; }
.align-center { align-items: center; }
.justify-between { justify-content: space-between; }
</style>
