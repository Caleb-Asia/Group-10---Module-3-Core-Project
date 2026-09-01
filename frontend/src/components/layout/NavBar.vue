<!-- 
  Purpose: Main navigation bar with cart badge and mobile menu
  Module: Component - Layout - NavBar
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Desktop top bar + Mobile bottom tab bar (matches approved mockup).
-->

<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__container">
      <!-- Logo (Desktop) -->
      <router-link to="/" class="navbar__logo">
        <img src="/images/foodboxx-logo.png" alt="FoodBoxx Logo" class="navbar__logo-img" />
      </router-link>

      <!-- Desktop Navigation Links -->
      <ul class="navbar__links">
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/menu">Menu</router-link>
        </li>
        <li>
          <router-link to="/builder">Build a Box</router-link>
        </li>
        <li>
          <router-link to="/pods">Pickup Pods</router-link>
        </li>
      </ul>

      <!-- Right Side: Auth + Cart (Desktop) -->
      <div class="navbar__actions">
        <router-link to="/cart" class="navbar__cart">
          <svg class="navbar__cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span v-if="cartStore.itemCount > 0" class="navbar__cart-badge">
            {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
          </span>
        </router-link>

        <template v-if="authStore.isAuthenticated">
          <router-link to="/dashboard" class="btn btn--outline btn--sm">Account</router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn--outline btn--sm">Login</router-link>
          <router-link to="/register" class="btn btn--primary btn--sm">Sign Up</router-link>
        </template>
      </div>
    </div>
  </nav>

  <!-- Mobile Bottom Navigation -->
  <nav class="mobile-bottom-nav">
    <router-link to="/" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      <span>Home</span>
    </router-link>

    <router-link to="/menu" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
      <span>Menu</span>
    </router-link>

    <router-link to="/cart" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      <span>Cart</span>
      <span v-if="cartStore.itemCount > 0" class="mobile-bottom-nav__badge">
        {{ cartStore.itemCount }}
      </span>
    </router-link>

    <router-link to="/dashboard" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      <span>Account</span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

const cartStore = useCartStore()
const authStore = useAuthStore()

const isScrolled = ref(false)

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
}
</script>

<style scoped>
/* 
 * NavBar Styles
 * Owner: Caleb Asia
 */

/* ============================================
   DESKTOP TOP NAVBAR - STICKY
   ============================================ */
.navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 70px;
  z-index: 9999;
  background: var(--color-navy);
  transition: all var(--transition-base);
}

.navbar--scrolled {
  background: rgba(15, 33, 55, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-lg);
}

.navbar__container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 var(--spacing-6); /* Increased outer padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-right: var(--spacing-8); /* Increased space between logo and links */
}

.navbar__logo-img {
  height: 40px;
  object-fit: contain;
}

/* Nav Links - Increased Spacing */
.navbar__links {
  display: none;
  list-style: none;
  gap: var(--spacing-8); /* Increased gap between links */
  margin: 0;
  padding: 0;
}

.navbar__links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
  position: relative;
  padding: var(--spacing-2) 0;
}

.navbar__links a:hover,
.navbar__links a.router-link-active {
  color: var(--color-orange);
}

.navbar__links a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-orange);
  border-radius: var(--radius-full);
}

/* Right Side Actions - Increased Spacing */
.navbar__actions {
  display: none;
  align-items: center;
  gap: var(--spacing-5); /* Increased gap between cart and buttons */
  margin-left: var(--spacing-8); /* Increased space between links and right side */
}

.navbar__cart {
  position: relative;
  color: var(--color-white);
  padding: var(--spacing-2);
  transition: color var(--transition-fast);
  display: flex;
  align-items: center;
  margin-right: var(--spacing-2); /* Extra spacing before buttons */
}

.navbar__cart-icon {
  width: 24px;
  height: 24px;
}

.navbar__cart-badge {
  position: absolute;
  top: 0;
  right: -2px;
  background: var(--color-orange);
  color: var(--color-white);
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  min-width: 18px;
  height: 18px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2) var(--spacing-5); /* More padding for wider buttons */
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all var(--transition-fast);
}

.btn--primary {
  background: var(--color-orange);
  color: var(--color-white);
}

.btn--primary:hover {
  background: var(--color-orange-hover);
}

.btn--outline {
  background: transparent;
  color: var(--color-white);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.btn--outline:hover {
  border-color: var(--color-orange);
  color: var(--color-orange);
}

.btn--sm {
  padding: var(--spacing-2) var(--spacing-5);
  font-size: var(--font-size-sm);
}

/* ============================================
   MOBILE BOTTOM NAVBAR
   ============================================ */
.mobile-bottom-nav {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--color-navy);
  border-top: 2px solid var(--color-orange);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 9999;
}

.mobile-bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  position: relative;
  width: 100%;
  height: 100%;
}

.mobile-bottom-nav__item svg {
  width: 24px;
  height: 24px;
}

.mobile-bottom-nav__item.router-link-active {
  color: var(--color-orange);
  border-top: 3px solid var(--color-orange);
  margin-top: -3px;
}

.mobile-bottom-nav__badge {
  position: absolute;
  top: 6px;
  right: 25%;
  background: var(--color-orange);
  color: var(--color-white);
  font-size: 9px;
  font-weight: bold;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (min-width: 768px) {
  .navbar__links {
    display: flex;
  }
  
  .navbar__actions {
    display: flex;
  }

  .mobile-bottom-nav {
    display: none;
  }
}
</style>