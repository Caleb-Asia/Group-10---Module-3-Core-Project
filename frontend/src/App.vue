<!-- 
  Purpose: Root Vue Application Component.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Renders the NavBar, applies smooth page transitions to the Router-View, 
         and mounts the app. Uses 80px Navbar offset.
-->
<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/layout/NavBar.vue';
</script>

<style scoped>
.main-content {
  min-height: 100vh;
  /* Updated to match the new 80px navbar */
  padding-top: 0; 
  background-color: var(--color-cream);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>