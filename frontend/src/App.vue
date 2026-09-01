<template>
  <div id="app">
    <NavBar />
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/layout/NavBar.vue';
</script>

<style scoped>
.main-content {
  min-height: 100vh;
  background-color: var(--color-cream);
}
</style>