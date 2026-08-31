<!--
  Purpose: Main navigation bar with cart badge and mobile menu
  Module: Component - Layout - NavBar
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Used on ALL pages including Sisamila's homepage.
         Mobile-first with hamburger menu. Live cart badge from cartStore.
-->

<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__container">
      <!-- Logo -->
      <router-link to="/" class="navbar__logo">
        <span class="navbar__logo-icon">📦</span>
        <span class="navbar__logo-text">Food<span class="text-orange">Boxx</span></span>
      </router-link>

      <!-- Desktop Navigation Links -->
      <ul class="navbar__links" :class="{ 'navbar__links--open': isMobileMenuOpen }">
        <li>
          <router-link to="/" @click="closeMobileMenu">Home</router-link>
        </li>
        <li>
          <router-link to="/menu" @click="closeMobileMenu">Menu</router-link>
        </li>
        <li>
          <router-link to="/builder" @click="closeMobileMenu">Build a Box</router-link>
        </li>
        <li>
          <router-link to="/pods" @click="closeMobileMenu">Pickup Pods</router-link>
        </li>
      </ul>

      <!-- Right Side: Auth + Cart -->
      <div class="navbar__actions">
        <!-- Cart Button with Badge -->
        <router-link to="/cart" class="navbar__cart">
          <svg class="navbar__cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span v-if="cartCount > 0" class="navbar__cart-badge">
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </router-link>

        <!-- Auth Buttons -->
        <template v-if="isAuthenticated">
          <router-link to="/dashboard" class="btn btn--outline btn--sm" @click="closeMobileMenu">
            Account
          </router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn--outline btn--sm" @click="closeMobileMenu">
            Login
          </router-link>
          <router-link to="/register" class="btn btn--primary btn--sm" @click="closeMobileMenu">
            Sign Up
          </router-link>
        </template>

        <!-- Mobile Hamburger -->
        <button 
          class="navbar__hamburger" 
          :class="{ 'navbar__hamburger--open': isMobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      class="navbar__overlay"
      @click="closeMobileMenu"
    ></div>
  </nav>
</template>

<script setup>
/**
 * NavBar Component
 * Owner: Caleb Asia
 * Shows navigation, cart badge, auth state
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

// Stores
const cartStore = useCartStore()
const authStore = useAuthStore()

// State
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

// Computed
const cartCount = computed(() => cartStore.itemCount)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Methods
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  // Prevent body scroll when menu open
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Restore cart from localStorage
  cartStore.restore()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/*
 * NavBar Styles
 * Owner: Caleb Asia
 * Mobile-first, sticky on scroll
 */

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
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
  padding: var(--spacing-4) var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.navbar__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  color: var(--color-white);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
}

.navbar__logo-icon {
  font-size: 1.5rem;
}

.text-orange {
  color: var(--color-orange);
}

/* Desktop Links - Hidden on Mobile */
.navbar__links {
  display: none;
  list-style: none;
  gap: var(--spacing-6);
  margin: 0;
  padding: 0;
}

.navbar__links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
  position: relative;
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

/* Right Actions */
.navbar__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

/* Cart Button */
.navbar__cart {
  position: relative;
  color: var(--color-white);
  padding: var(--spacing-2);
  transition: color var(--transition-fast);
}

.navbar__cart:hover {
  color: var(--color-orange);
}

.navbar__cart-icon {
  width: 24px;
  height: 24px;
}

.navbar__cart-badge {
  position: absolute;
  top: 0;
  right: 0;
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
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
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
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn--outline:hover {
  border-color: var(--color-orange);
  color: var(--color-orange);
}

.btn--sm {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--font-size-xs);
}

/* Hide desktop buttons on mobile, show hamburger */
.navbar__actions .btn {
  display: none;
}

/* Hamburger */
.navbar__hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2);
}

.navbar__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-white);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.navbar__hamburger--open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar__hamburger--open span:nth-child(2) {
  opacity: 0;
}

.navbar__hamburger--open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile Menu Overlay */
.navbar__overlay {
  display: none;
}

/* Mobile Menu Open State */
.navbar__links--open {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-navy);
  padding: var(--spacing-8) var(--spacing-6);
  gap: var(--spacing-6);
  z-index: var(--z-modal);
}

.navbar__links--open a {
  font-size: var(--font-size-xl);
}

/* ============================================
   TABLET (768px+)
   ============================================ */
@media (min-width: 768px) {
  .navbar__container {
    padding: var(--spacing-4) var(--spacing-6);
  }

  .navbar__links {
    display: flex;
  }

  .navbar__actions .btn {
    display: inline-flex;
  }

  .navbar__hamburger {
    display: none;
  }

  .navbar__links--open {
    display: flex;
    flex-direction: row;
    position: static;
    background: none;
    padding: 0;
    gap: var(--spacing-6);
  }
}

/* ============================================
   DESKTOP (1024px+)
   ============================================ */
@media (min-width: 1024px) {
  .navbar__container {
    padding: var(--spacing-5) var(--spacing-8);
  }
}
</style>