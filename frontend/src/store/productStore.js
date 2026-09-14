/* 
  Purpose: Pinia store for managing product catalogue data.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Uses the backend product endpoints for catalogue and builder items.
*/
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const builderItems = ref([]);
  const selectedProduct = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchProducts(filters = {}) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get('/products', { params: filters });
      const payload = response.data;
      products.value = Array.isArray(payload?.data) ? payload.data : [];
      return products.value;
    } catch (err) {
      error.value = 'Failed to load products.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBuilderItems() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get('/products/builder-items');
      const payload = response.data;
      builderItems.value = Array.isArray(payload?.data) ? payload.data : [];
      return builderItems.value;
    } catch (err) {
      error.value = 'Failed to load builder items.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchProductById(productId) {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get(`/products/${productId}`);
      const payload = response.data;
      selectedProduct.value = payload?.data || null;
      return selectedProduct.value;
    } catch (err) {
      error.value = 'Failed to load product details.';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    products,
    builderItems,
    selectedProduct,
    isLoading,
    error,
    fetchProducts,
    fetchBuilderItems,
    fetchProductById
  };
});