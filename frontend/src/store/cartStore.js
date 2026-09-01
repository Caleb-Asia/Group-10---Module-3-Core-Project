/* 
  Purpose: Pinia store for managing the shopping cart state.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Handles add/remove/qty/totals. Persists to localStorage. 
         Exposes `itemCount` and `restore()` for NavBar.vue.
*/
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([]);
  const isSubscription = ref(false);
  
  // Getters (Used in NavBar and CartView)
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Actions
  function restore() {
    // NavBar calls this on mount
    const savedCart = localStorage.getItem('foodboxx_cart');
    if (savedCart) {
      items.value = JSON.parse(savedCart);
    }
  }

  function save() {
    localStorage.setItem('foodboxx_cart', JSON.stringify(items.value));
  }

  function addToCart(product) {
    const existingItem = items.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
    save(); 
  }

  function increaseQty(id) {
    const item = items.value.find(item => item.id === id);
    if (item) item.quantity++;
    save();
  }

  function decreaseQty(id) {
    const item = items.value.find(item => item.id === id);
    if (item && item.quantity > 1) {
      item.quantity--;
    } else {
      removeFromCart(id); 
    }
    save();
  }

  function removeFromCart(id) {
    items.value = items.value.filter(item => item.id !== id);
    save();
  }

  function clearCart() {
    items.value = [];
    isSubscription.value = false;
    localStorage.removeItem('foodboxx_cart');
  }

  // API Integration (Hits Adam's backend once ready)
  async function checkout(payload) {
    try {
      const orderData = {
        items: items.value,
        is_subscription: isSubscription.value,
        pickup_pod: payload.pickup_pod,
        dietary_preferences: payload.dietary_preferences
      };

      const response = await api.post('/orders', orderData);
      clearCart(); 
      return response.data; 
    } catch (error) {
      throw error; 
    }
  }

  return {
    items,
    isSubscription,
    itemCount,
    subtotal,
    restore,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    checkout
  };
});