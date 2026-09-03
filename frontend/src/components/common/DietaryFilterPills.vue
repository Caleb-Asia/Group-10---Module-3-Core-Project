<!-- 
  Purpose: Reusable dietary filter pills component.
  Module: Frontend - Components - Common
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Used by CatalogueView. Manages active filtering state.
-->
<template>
  <div class="filter-pills">
    <button
      v-for="filter in dietaryFilters"
      :key="filter.value"
      :class="['chip chip--filter', { active: activeFilters.includes(filter.value) }]"
      @click="toggleFilter(filter.value)"
    >
      {{ filter.label }}
    </button>
    <button v-if="activeFilters.length > 0" class="chip chip--filter clear-btn" @click="$emit('clear')">
      ✕ Clear all
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  activeFilters: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:filters', 'clear']);

// Filter configuration
const dietaryFilters = [
  { value: 'high protein', label: '💪 High Protein' },
  { value: 'vegan', label: '🌱 Vegan' },
  { value: 'vegetarian', label: '🥗 Vegetarian' }, /* ADDED */
  { value: 'halal', label: '☪️ Halal' },
  { value: 'keto', label: '🥑 Keto/Low-Carb' },
  { value: 'nut-free', label: '🥜 Nut-Free' },
  { value: 'gluten-free', label: '🌾 Gluten-Free' },
];

// Toggle a filter and emit the new list
const toggleFilter = (filterValue) => {
  let newFilters = [...props.activeFilters];
  const index = newFilters.indexOf(filterValue);
  if (index > -1) {
    newFilters.splice(index, 1);
  } else {
    newFilters.push(filterValue);
  }
  emit('update:filters', newFilters);
};
</script>

<style scoped>
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
}

.chip--filter {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
}

.clear-btn {
  color: var(--color-error);
  border-color: var(--color-error);
}
</style>