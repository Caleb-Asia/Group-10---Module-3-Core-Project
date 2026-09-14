<!-- 
  Purpose: Reusable subscription toggle switch.
  Module: Frontend - Components - Common
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Handles one-off vs recurring subscription selection.
-->
<template>
  <div class="subscription-toggle">
    <div class="toggle-header">
      <span class="toggle-label">Make this a recurring subscription</span>
      <span v-if="isSubscription" class="toggle-badge">SAVE 10%</span>
    </div>
    
    <button 
      type="button" 
      class="switch" 
      :class="{ 'switch--active': isSubscription }"
      @click="toggle"
      :aria-label="isSubscription ? 'Turn off subscription' : 'Turn on subscription'"
    >
      <span class="switch-thumb"></span>
    </button>
  </div>
</template>

<script setup>
// FIXED: Import computed so it works!
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const isSubscription = computed(() => props.modelValue);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>

<style scoped>
.subscription-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.toggle-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.toggle-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
}

.toggle-badge {
  background: rgba(242, 106, 27, 0.1);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  width: fit-content;
}

.switch {
  width: 48px;
  height: 28px;
  background: var(--color-gray-200);
  border: none;
  border-radius: var(--radius-full);
  position: relative;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.switch--active {
  background: var(--color-orange);
}

.switch-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 20px;
  background: var(--color-white);
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform var(--transition-fast);
}

.switch--active .switch-thumb {
  transform: translateX(20px);
}
</style>