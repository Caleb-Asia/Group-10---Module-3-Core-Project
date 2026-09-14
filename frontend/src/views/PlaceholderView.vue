<!-- 
  Purpose: Temporary placeholder for pages not yet built.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Prevents router crashes. Replace with actual Views when available.
-->
<template>
  <div class="placeholder-container">
    <div class="card p-5 text-center shadow-sm" style="max-width: 600px; margin: 0 auto; border: none; border-radius: var(--radius-xl);">
      <div class="empty-icon-circle mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-box-seam text-secondary" viewBox="0 0 16 16">
          <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zM14.5 3.5l-2.404-.961-6.156 2.461 2.218.887 6.342-2.387zM15 4.326L8.5 6.48v6.53l6.5-2.437V4.326zM7.5 12.99V6.48L1 4.326v6.537L7.5 12.99z"/>
          <path d="M9.293 2.207a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414z"/>
        </svg>
      </div>
      <h2 class="h4 fw-bold mb-2 text-navy">Under Construction</h2>
      <p class="text-muted mb-4">This page is being built by our team. Check back soon!</p>
      <router-link to="/menu" class="btn btn-custom-orange px-4 py-2 rounded-pill">Browse Menu</router-link>
    </div>
  </div>
</template>

<style scoped>
.placeholder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-12);
  min-height: 60vh;
}

.empty-icon-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-gray-200);
}

.btn-custom-orange {
  background-color: var(--color-orange);
  color: white;
  font-weight: var(--font-weight-medium);
  border: none;
}

.btn-custom-orange:hover {
  background-color: var(--color-orange-hover);
  color: white;
}
</style>