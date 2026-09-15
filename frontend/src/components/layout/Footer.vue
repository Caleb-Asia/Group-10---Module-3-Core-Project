<!-- 
  Purpose: Global Footer component with branding, social links and quick navigation.
  Module: Frontend - Components - Layout
  Owner: Caleb Asia (originally Sisamila's file, built as lead)
  Created: 2026-09-01
  Notes: Used on all pages.
-->
<template>
  <footer class="footer">
    <div class="footer__container">
      
      <!-- TOP: Brand + Tagline -->
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__brand-text">
            <span class="footer__brand-food">Food</span><span class="footer__brand-boxx">Boxx</span>
          </span>
          <p class="footer__tagline">Fuel your day. The smart way.</p>
        </div>

      </div>

      <!-- MIDDLE: Quick Links -->
      <div class="footer__links">
        <div class="footer__column">
          <h4 class="footer__column-title">Explore</h4>
          <router-link to="/menu" class="footer__link">Menu</router-link>
          <router-link to="/builder" class="footer__link">Custom Box</router-link>
          <router-link to="/pods" class="footer__link">Pickup Pods</router-link>
        </div>

        <div class="footer__column">
          <h4 class="footer__column-title">Account</h4>
          <router-link to="/login" class="footer__link">Login</router-link>
          <router-link to="/register" class="footer__link">Sign Up</router-link>
          <router-link to="/dashboard" class="footer__link">Dashboard</router-link>
        </div>

        <div class="footer__column">
          <h4 class="footer__column-title">Support</h4>
          <router-link to="/pods" class="footer__link">Find a Pod</router-link>
        </div>
      </div>

      <!-- BOTTOM: Copyright -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ currentYear }} FoodBoxx. Fuel your day. The smart way.
        </p>
        <p class="footer__credit">Performance Fuel · Cape Town · Module 3 Core Project</p>
      </div>

    </div>
  </footer>
</template>

<script setup>
/**
 * Footer Component
 * Owner: Caleb Asia
 * Notes: Global footer.
 */
import { computed } from 'vue';

// Dynamic copyright year
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
/* ============================================
   FOOTER STYLES
   ============================================ */
.footer {
  background: var(--color-navy);
  color: #FFFFFF;
  padding: var(--spacing-12) 0 var(--spacing-6);
  margin-top: var(--spacing-16);
  border-top: 4px solid var(--color-orange);
}


.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

/* TOP: Brand + Socials */
.footer__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-8);
  padding-bottom: var(--spacing-8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--spacing-8);
}

.footer__brand-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.5px;
}

.footer__brand-food {
  color: #FFFFFF;
}

.footer__brand-boxx {
  color: var(--color-orange);
}

/* DARK MODE LOGO SWAP */

.footer__tagline {
  margin-top: var(--spacing-2);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--font-size-sm);
}

/* SOCIAL LINKS */




/* MIDDLE: Quick Links Grid */
.footer__links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-8);
  padding-bottom: var(--spacing-8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--spacing-6);
}

.footer__column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.footer__column-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-orange);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-2);
}

.footer__link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
  width: fit-content;
}

.footer__link:hover {
  color: var(--color-orange);
}

/* BOTTOM: Copyright */
.footer__bottom {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.footer__copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-size-sm);
  margin: 0;
}

.footer__credit {
  color: rgba(255, 255, 255, 0.3);
  font-size: var(--font-size-xs);
  margin: 0;
  letter-spacing: 0.05em;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .footer__top {
    flex-direction: column;
    gap: var(--spacing-6);
  }

  .footer__links {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
}
</style>
