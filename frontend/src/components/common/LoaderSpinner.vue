<!-- 
  Purpose: Reusable loading spinner component.
  Module: Frontend - Components - Common
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Accepts size and color props to match context.
-->
<template>
  <div class="loader-spinner" :class="`loader-spinner--${size}`">
    <div class="spinner-ring" :style="{ borderTopColor: color }"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  color: {
    type: String,
    default: '#F26A1B' // Orange by default
  }
});
</script>

<style scoped>
.loader-spinner {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.spinner-ring {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* Sizes */
.loader-spinner--sm .spinner-ring {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.loader-spinner--md .spinner-ring {
  width: 24px;
  height: 24px;
}

.loader-spinner--lg .spinner-ring {
  width: 36px;
  height: 36px;
  border-width: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>