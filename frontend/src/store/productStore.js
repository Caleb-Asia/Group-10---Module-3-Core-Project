/* 
  Purpose: Pinia store for managing product catalogue data.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Temporarily uses mock data until Backend API is ready.
*/
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref([]);
  const builderItems = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Mock Data (Boxes only - No Builder items here)
  const mockProducts = [
    // ----- Original Boxes -----
    { id: 1, name: 'Starter Box', description: 'High Protein', price: 49, category: 'box', dietary_tags: ['Standard'], image_url: '/images/starter-box.png' },
    { id: 2, name: 'Standard Box', description: 'High Protein', price: 79, category: 'box', dietary_tags: ['Standard', 'High Protein'], image_url: '/images/standard-box.png' },
    { id: 3, name: 'Premium Box', description: 'Keto & High Protein', price: 99, category: 'box', dietary_tags: ['Standard', 'Keto', 'High Protein'], image_url: '/images/premium-box.png' },
    { id: 4, name: 'Vegan Boost Box', description: '100% Plant-Based', price: 79, category: 'box', dietary_tags: ['Vegan'], image_url: '/images/vegan-box.png' },
    { id: 5, name: 'Keto Fuel Box', description: 'Low-Carb', price: 89, category: 'box', dietary_tags: ['Keto'], image_url: '/images/keto-box.png' },
    { id: 6, name: 'Nut-Free Safety Box', description: 'Allergy Safe', price: 69, category: 'box', dietary_tags: ['Nut-Free'], image_url: '/images/nut-free-box.png' },
    { id: 7, name: 'Monthly Snack Box', description: 'High Protein', price: 199, category: 'box', dietary_tags: ['Standard'], image_url: '/images/snack-box.png' },

    // ----- New Creative Boxes (IDs 22-26) -----
    { id: 22, name: 'Campus Grind Box', description: 'Slow-release carbs and protein.', price: 89, category: 'box', dietary_tags: ['Standard', 'Halal'], image_url: '/images/campus-grind.png' },
    { id: 23, name: 'Freshman 15 (Keto)', description: 'Avoid the carbs, keep the energy.', price: 89, category: 'box', dietary_tags: ['Keto', 'Gluten-Free'], image_url: '/images/freshman-15.png' },
    { id: 24, name: 'Varsity Athlete Box', description: 'Refuel and rebuild after training.', price: 99, category: 'box', dietary_tags: ['Standard', 'Halal', 'High Protein'], image_url: '/images/varsity-athlete.png' },
    { id: 25, name: 'All-Nighter Box', description: 'Brain food for late-night library sessions.', price: 79, category: 'box', dietary_tags: ['Standard', 'Nut-Free'], image_url: '/images/all-nighter.png' },
    { id: 26, name: 'Coffee Shop Box', description: 'Grab-and-go fuel for between classes.', price: 69, category: 'box', dietary_tags: ['Vegetarian', 'Vegan'], image_url: '/images/coffee-shop.png' },

    // ----- Exam Week Boxes (IDs 27-28) -----
    { id: 27, name: 'Exam Week Survival: Study Fuel', description: 'Sustained energy for all-nighters.', price: 99, category: 'box', dietary_tags: ['Standard', 'High Protein'], image_url: '/images/exam-box.png' },
    { id: 28, name: 'Exam Week Survival: Brain Boost', description: 'The ultimate cognitive support.', price: 129, category: 'box', dietary_tags: ['Standard', 'Nut-Free'], image_url: '/images/exam-box.png' },
  ];

  // Mock Builder Items
  const mockBuilderItems = [
    { id: 10, name: 'Grilled Chicken & Rice', description: 'High Protein', price: 25, category: 'meal', dietary_tags: ['Standard', 'Halal'], image_url: '/images/builder-meal.png' },
    { id: 11, name: 'Beef Teriyaki Bowl', description: 'High Protein', price: 25, category: 'meal', dietary_tags: ['Standard'], image_url: '/images/builder-meal.png' },
    { id: 12, name: 'Zesty Lemon Salmon', description: 'High Protein', price: 25, category: 'meal', dietary_tags: ['Keto', 'Gluten-Free'], image_url: '/images/builder-meal.png' },
    { id: 13, name: 'Spicy Tofu Stir-fry', description: 'Plant-Based', price: 25, category: 'meal', dietary_tags: ['Vegan', 'Gluten-Free'], image_url: '/images/builder-meal.png' },
    { id: 14, name: 'Herbed Pasta Primavera', description: 'Plant-Based', price: 25, category: 'meal', dietary_tags: ['Vegan'], image_url: '/images/builder-meal.png' },
    { id: 15, name: 'BBQ Chicken Wrap', description: 'High Protein', price: 25, category: 'meal', dietary_tags: ['Standard'], image_url: '/images/builder-meal.png' },
    { id: 16, name: 'Protein Power Balls', description: 'High Protein', price: 12, category: 'snack', dietary_tags: ['Vegan', 'Gluten-Free'], image_url: '/images/builder-snack.png' },
    { id: 17, name: 'Salted Caramel Popcorn', description: 'Sweet & Salty', price: 12, category: 'snack', dietary_tags: ['Gluten-Free'], image_url: '/images/builder-snack.png' },
    { id: 18, name: 'Roasted Chickpeas', description: 'Crunchy Snack', price: 12, category: 'snack', dietary_tags: ['Vegan', 'Gluten-Free'], image_url: '/images/builder-snack.png' },
    { id: 19, name: 'Fruit & Nut Mix', description: 'Trail Mix', price: 12, category: 'snack', dietary_tags: ['Vegan', 'Nut-Free'], image_url: '/images/builder-snack.png' },
    { id: 20, name: 'Greek Yogurt Cup', description: 'High Protein', price: 12, category: 'snack', dietary_tags: ['Vegetarian', 'Gluten-Free'], image_url: '/images/builder-snack.png' },
    { id: 21, name: 'Sea Salt Crisps', description: 'Crunchy Snack', price: 12, category: 'snack', dietary_tags: ['Vegan', 'Gluten-Free'], image_url: '/images/builder-snack.png' },
  ];

  // Actions
  async function fetchProducts(filters = {}) {
    isLoading.value = true;
    error.value = null;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      let fetched = [...mockProducts];

      if (filters.diet) {
        const tags = filters.diet.split(',');
        fetched = fetched.filter(p => 
          p.dietary_tags.some(tag => tags.includes(tag))
        );
      }

      products.value = fetched;
    } catch (err) {
      error.value = 'Failed to load products.';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchBuilderItems() {
    isLoading.value = true;
    
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      builderItems.value = mockBuilderItems;
    } catch (err) {
      error.value = 'Failed to load builder items.';
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