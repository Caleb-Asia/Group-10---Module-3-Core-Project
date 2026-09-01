/* 
  Purpose: Pinia store for managing product catalogue data.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Notes: Handles fetching products, filtering, and builder items.
*/
import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref([]);
  const builderItems = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Actions
  async function fetchProducts(filters = {}) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get('/products', { params: filters });
      products.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load products.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBuilderItems() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.get('/products/builder-items');
      builderItems.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load builder items.';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    products,
    builderItems,
    isLoading,
    error,
    fetchProducts,
    fetchBuilderItems
  };
});