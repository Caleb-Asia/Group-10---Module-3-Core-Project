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

export const useCartStore = defineStore('cart', () => {
  const cartStorageKey = () => {
    try {
      const user = window.__foodboxxUser || null;
      return user?.id ? `foodboxx_cart_user_${user.id}` : 'foodboxx_cart_guest';
    } catch (error) {
      return 'foodboxx_cart_guest';
    }
  };

  // State
  const items = ref([]);
  const isSubscription = ref(false);
  // Hydrate from localStorage on store initialisation so the cart survives reloads.
  restore();
  
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
    const storageKey = cartStorageKey();
    const savedCart = localStorage.getItem(storageKey);
    try {
      if (savedCart) items.value = JSON.parse(savedCart);
    } catch (error) {
      localStorage.removeItem(storageKey);
      items.value = [];
    }
    isSubscription.value = false;
  }

  function save() {
    localStorage.setItem(cartStorageKey(), JSON.stringify(items.value));
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
    // Remove every possible cart key so no per-user variant survives.
    Object.keys(localStorage)
      .filter(k => k.startsWith('foodboxx_cart_'))
      .forEach(k => localStorage.removeItem(k));
  }

  window.addEventListener('foodboxx-auth-changed', restore);

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
  };
});
