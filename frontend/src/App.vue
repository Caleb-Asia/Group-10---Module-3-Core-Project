<!-- 
  Purpose: Root Vue Application Component.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Renders NavBar, RouterView with transitions, and Footer. Handles global layout.
-->
<template>
  <div id="app">
    <!-- Global Navigation Bar (Sticky) -->
    <NavBar v-if="!appRoute.meta.hideLayout" />

    <!-- Page Content (Router Outlet) -->
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>

    <!-- Global Footer -->
    <Footer v-if="!appRoute.meta.hideLayout" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';
import NavBar from '@/components/layout/NavBar.vue';
import Footer from '@/components/layout/Footer.vue';

const appRoute = useRoute();
const authStore = useAuthStore();
onMounted(() => authStore.init());
</script>

<style>
/* ============================================
   GLOBAL RESET
   ============================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  width: 100%;
  min-height: 100vh;
  /* NOTE: overflow-x: hidden on html is FINE for sticky */
  overflow-x: hidden;
}

body {
  width: 100%;
  min-height: 100vh;
  font-family: var(--font-family);
  background-color: var(--color-cream);
  color: var(--color-gray-800);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* IMPORTANT: no overflow-x: hidden here — it breaks sticky */
}


#app {
  width: 100%;
  min-height: 100vh;
  /* REMOVED flex — display: flex on the root breaks sticky positioning */
  display: block;
}

/* ============================================
   MAIN CONTENT
   ============================================ */
.main-content {
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-cream);
}


/* ============================================
   PAGE TRANSITIONS
   ============================================ */
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
