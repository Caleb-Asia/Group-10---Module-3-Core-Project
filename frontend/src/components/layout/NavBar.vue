<!-- 
  Purpose: Main navigation bar with icon + text links, Dark Mode toggle, and sticky positioning.
  Module: Frontend - Components
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Sticky positioning. Logo colors swap in Dark Mode. Navbar height increased to 90px.
-->
<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__container">
      
      <!-- LEFT: Logo -->
      <div class="navbar__left">
        <router-link to="/" class="navbar__logo">
          <span class="navbar__logo-text"><span class="navbar__logo-food">Food</span><span class="navbar__logo-boxx">Boxx</span></span>
        </router-link>
      </div>

      <!-- CENTER: Navigation Links + Actions (Grouped Together) -->
      <div class="navbar__center">
        <ul class="navbar__links">
          <li>
            <router-link to="/" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Home</span>
            </router-link>
          </li>
          <li>
            <router-link to="/menu" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              <span>Menu</span>
            </router-link>
          </li>
          <li>
            <router-link to="/pods" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Pickup Pods</span>
            </router-link>
          </li>
          <li>
            <router-link to="/builder" class="nav-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              <span>Custom Box</span>
            </router-link>
          </li>
        </ul>

        <div class="navbar__actions">
          <!-- Cart Icon Link -->
          <router-link to="/cart" class="action-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Cart</span>
            <span v-if="cartStore.itemCount > 0" class="navbar__cart-badge">
              {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
            </span>
          </router-link>

          <!-- Account Icon Link -->
          <router-link to="/dashboard" class="action-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Account</span>
          </router-link>
        </div>
      </div>

      <!-- RIGHT: Theme Toggle & Logout -->
      <div class="navbar__right">
        <button class="theme-toggle" @click="toggleTheme" :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>

        <button v-if="authStore.isAuthenticated" class="logout-btn" @click="handleLogout">
          Logout
        </button>
      </div>

    </div>
  </nav>

  <!-- Mobile Bottom Navigation -->
  <nav class="mobile-bottom-nav">
    <router-link to="/" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      <span>Home</span>
    </router-link>
    <router-link to="/menu" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      <span>Menu</span>
    </router-link>
    <router-link to="/pods" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <span>Pods</span>
    </router-link>
    <router-link to="/builder" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
      <span>Custom</span>
    </router-link>
    <router-link to="/cart" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <span>Cart</span>
      <span v-if="cartStore.itemCount > 0" class="mobile-bottom-nav__badge">
        {{ cartStore.itemCount }}
      </span>
    </router-link>
    <router-link to="/dashboard" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span>Account</span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { showSuccess } from '@/services/ui';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const isScrolled = ref(false);
const isDarkMode = ref(false);

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50;
  });
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
};

const handleLogout = () => {
  authStore.logout();
  showSuccess('Logged out', 'See you soon!');
  router.push('/');
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  /* Increased height to 90px */
  height: 90px;
  z-index: 9999;
  background: var(--color-navy);
  transition: all var(--transition-base);
}

.navbar--scrolled {
  background: var(--color-navy);
  box-shadow: var(--shadow-lg);
}

/* Dark Mode Navbar */
[data-theme="dark"] .navbar {
  background: #0B1120;
}

[data-theme="dark"] .navbar--scrolled {
  background: #0B1120;
}

.navbar__container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* LEFT: Logo */
.navbar__left {
  flex-shrink: 0;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  color: #FFFFFF !important;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-2xl);
}

.navbar__logo-food {
  color: #FFFFFF !important;
}

.navbar__logo-boxx {
  color: var(--color-orange) !important;
}

/* DARK MODE LOGO SWAP */
[data-theme="dark"] .navbar__logo-food {
  color: var(--color-orange) !important;
}

[data-theme="dark"] .navbar__logo-boxx {
  color: #FFFFFF !important;
}

/* CENTER: Links + Actions grouped tightly together */
.navbar__center {
  display: flex;
  align-items: center;
  gap: 40px; /* Tight gap between links and actions */
}

/* Desktop Links with Icons */
.navbar__links {
  display: none;
  list-style: none;
  gap: 40px;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #FFFFFF !important;
  text-decoration: none;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
  position: relative;
  padding: 4px 0;
}

.nav-link svg {
  width: 24px;
  height: 24px;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: var(--color-orange) !important;
}

.nav-link.router-link-active::after,
.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-orange);
  border-radius: var(--radius-full);
}

/* RIGHT: Actions with Icons */
.navbar__actions {
  display: none;
  align-items: center;
  gap: 40px;
}

.action-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  color: #FFFFFF !important;
  text-decoration: none;
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  transition: color var(--transition-fast);
}

.action-link svg {
  width: 24px;
  height: 24px;
}

.action-link:hover,
.action-link.router-link-active {
  color: var(--color-orange) !important;
}

.navbar__cart-badge {
  position: absolute;
  top: -6px;
  right: 4px;
  background: var(--color-orange);
  color: #FFFFFF !important;
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

/* RIGHT: Theme & Logout */
.navbar__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.theme-toggle {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  border-color: var(--color-orange);
  transform: translateY(-2px);
}

.logout-btn {
  background: transparent;
  border: 2px solid var(--color-error);
  color: var(--color-error) !important;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  background: var(--color-error);
  color: #FFFFFF !important;
}

/* Mobile Bottom Nav */
.mobile-bottom-nav {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--color-navy);
  border-top: 2px solid var(--color-orange);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 9999;
}

.mobile-bottom-nav__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #FFFFFF !important;
  text-decoration: none;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  width: 100%;
  height: 100%;
}

.mobile-bottom-nav__item svg {
  width: 22px;
  height: 22px;
}

.mobile-bottom-nav__item.router-link-active {
  color: var(--color-orange) !important;
  border-top: 3px solid var(--color-orange);
  margin-top: -3px;
}

.mobile-bottom-nav__badge {
  position: absolute;
  top: 8px;
  right: 25%;
  background: var(--color-orange);
  color: #FFFFFF !important;
  font-size: 9px;
  font-weight: bold;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive */
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