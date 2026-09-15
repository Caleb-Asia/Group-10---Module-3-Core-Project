<!-- 
  Purpose: Reusable dietary filter pills component with Lucide icons & expanding hover effect.
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
      <!-- Animated Lucide Icon -->
      <component :is="filter.iconComponent" class="filter-icon" :size="24" :stroke-width="2.5" />
      
      <!-- Label that expands on hover -->
      <span class="filter-label">{{ filter.label }}</span>
    </button>
    
    <button v-if="activeFilters.length > 0" class="chip chip--filter clear-btn" @click="$emit('clear')">
      ✕ Clear all
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, markRaw } from 'vue';
import { 
  BicepsFlexed, 
  Vegan, 
  Salad, 
  MoonStar, 
  EggFried, 
  Nut, 
  WheatOff 
} from 'lucide-vue-next';

const props = defineProps({
  activeFilters: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:filters', 'clear']);

// Filter configuration (Icons separated from text for animation)
const dietaryFilters = [
  { value: 'vegan', label: 'Vegan', iconComponent: markRaw(Vegan) },
  { value: 'halal', label: 'Halal', iconComponent: markRaw(MoonStar) },
  { value: 'keto', label: 'Keto/Low-Carb', iconComponent: markRaw(EggFried) },
  { value: 'nut-free', label: 'Nut-Free', iconComponent: markRaw(Nut) },
  { value: 'gluten-free', label: 'Gluten-Free', iconComponent: markRaw(WheatOff) },
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
/* Base Layout - Wider Spacing */
.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Increased gap for wider spacing */
  justify-content: flex-start;
}

/* The Chip Container - Much Bigger */
.chip--filter {
  position: relative;
  height: 65px; /* Increased height */
  width: 65px; /* Wider base */
  padding: 0;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08); /* Deeper shadow */
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  transition: all 0.5s;
  overflow: hidden;
  font-family: inherit;
}

/* The Glow (Orange) behind the button */
.chip--filter::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50px;
  background: linear-gradient(45deg, #F26A1B, #d95a12);
  opacity: 0;
  transition: 0.5s;
  z-index: 0;
}

.chip--filter::after {
  content: "";
  position: absolute;
  top: 10px;
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: linear-gradient(45deg, #F26A1B, #d95a12);
  transition: 0.5s;
  filter: blur(15px);
  z-index: -1;
  opacity: 0;
}

/* Hover State: Expand, Show Glow, Hide Icon, Show Text */
.chip--filter:hover {
  width: 220px; /* Expands much wider */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0);
  color: #fff;
}

.chip--filter:hover::before {
  opacity: 1;
}

.chip--filter:hover::after {
  opacity: 0.5;
}

/* Lucide Icon - Bigger and centered */
.filter-icon {
  position: absolute;
  z-index: 1;
  transition: 0.5s;
  transition-delay: 0.25s;
  color: var(--color-orange); /* Orange icons */
}

/* Dark mode icon fix */
[data-theme="dark"] .filter-icon {
  color: #E5E7EB;
}

.chip--filter:hover .filter-icon {
  transform: scale(0);
  color: #fff;
  transition-delay: 0s;
}

/* Label - Hidden initially, scales up on hover */
.filter-label {
  position: absolute;
  color: var(--color-gray-600);
  font-size: 1.1rem; /* Bigger text */
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
  transform: scale(0);
  transition: 0.5s;
  transition-delay: 0s;
  opacity: 0;
  white-space: nowrap;
  z-index: 1;
}

/* Dark mode label fix */
[data-theme="dark"] .filter-label {
  color: #E5E7EB;
}

.chip--filter:hover .filter-label {
  transform: scale(1);
  transition-delay: 0.25s;
  opacity: 1;
  color: #fff;
}

/* Active State */
.chip--filter.active {
  background: var(--color-orange);
  color: #fff;
  border-color: var(--color-orange);
  width: auto; /* Keeps full label active */
  padding: 0 30px;
  height: 65px;
}

.chip--filter.active .filter-icon {
  position: relative;
  color: #fff;
  margin-right: 10px;
  transform: scale(1);
}

.chip--filter.active .filter-label {
  position: static;
  transform: scale(1);
  opacity: 1;
  color: #fff;
}

/* Clear Button */
.clear-btn {
  background: transparent;
  border: 1px solid var(--color-error);
  color: var(--color-error);
  height: 65px;
  padding: 0 25px;
  width: auto;
  font-size: 1rem;
}

.clear-btn:hover {
  background: var(--color-error);
  color: #fff;
}

/* Dark Mode Support */
[data-theme="dark"] .chip--filter {
  background: #1A2436;
  border-color: #2D3748;
}

[data-theme="dark"] .chip--filter.active {
  background: var(--color-orange);
  border-color: var(--color-orange);
}
</style>
