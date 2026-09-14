<!-- 
  Purpose: Main navigation bar with icon + text links, Dark Mode toggle, sticky positioning, and mobile hamburger menu.
  Module: Frontend - Components
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Sticky positioning. Logo colors swap in Dark Mode. Smooth active tab transitions.
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

      <!-- CENTER: Navigation Links (Desktop Only) -->
      <div class="navbar__center">
        <ul class="navbar__links">
          <li>
            <router-link to="/" class="nav-link" @click="closeMobileMenu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Home</span>
            </router-link>
          </li>
          <li>
            <router-link to="/menu" class="nav-link" @click="closeMobileMenu">
              <!-- CookingPot Icon -->
              <CookingPot :size="24" :stroke-width="2" />
              <span>Menu</span>
            </router-link>
          </li>
          <li>
            <router-link to="/pods" class="nav-link" @click="closeMobileMenu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Pickup Pods</span>
            </router-link>
          </li>
          <li>
            <router-link to="/builder" class="nav-link" @click="closeMobileMenu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              <span>Custom Box</span>
            </router-link>
          </li>
        </ul>

        <div class="navbar__actions">
          <router-link to="/cart" class="action-link" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Cart</span>
            <span v-if="cartStore.itemCount > 0" class="navbar__cart-badge">
              {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
            </span>
          </router-link>

          <router-link to="/dashboard" class="action-link" @click="closeMobileMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Account</span>
          </router-link>
        </div>
      </div>

      <!-- RIGHT: Theme Toggle, Logout, & Mobile Hamburger -->
      <div class="navbar__right">
        <button class="theme-toggle" @click="toggleTheme" :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>

        <button v-if="authStore.isAuthenticated" class="logout-btn logout-desktop" @click="handleLogout">
          Logout
        </button>

        <!-- Hamburger -->
        <button class="hamburger" :class="{ 'hamburger--open': isMobileMenuOpen }" @click="toggleMobileMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

    </div>

    <!-- MOBILE DROPDOWN MENU -->
    <transition name="slide">
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <router-link to="/" class="mobile-link" @click="closeMobileMenu">Home</router-link>
        <router-link to="/menu" class="mobile-link" @click="closeMobileMenu">Menu</router-link>
        <router-link to="/pods" class="mobile-link" @click="closeMobileMenu">Pickup Pods</router-link>
        <router-link to="/builder" class="mobile-link" @click="closeMobileMenu">Custom Box</router-link>
        <router-link to="/cart" class="mobile-link" @click="closeMobileMenu">Cart</router-link>
        <router-link to="/dashboard" class="mobile-link" @click="closeMobileMenu">Account</router-link>
        
        <button v-if="authStore.isAuthenticated" class="mobile-logout" @click="handleLogout">
          Logout
        </button>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { showSuccess, showConfirm } from '@/services/ui';
import { CookingPot } from 'lucide-vue-next'; // Imported Icon

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const isScrolled = ref(false);
const isDarkMode = ref(false);
const isMobileMenuOpen = ref(false);

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50;
  });
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light');
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// LOGOUT WITH CONFIRMATION
const handleLogout = () => {
  showConfirm(
    'Log out?',
    'Are you sure you want to log out of your account?',
    'Yes, log out'
  ).then((result) => {
    if (result.isConfirmed) {
      authStore.logout();
      closeMobileMenu();
      showSuccess('Logged out', 'See you soon!');
      router.push('/');
    }
  });
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 90px;
  z-index: 9999;
  background: var(--color-navy);
  transition: all var(--transition-base);
}

.navbar--scrolled {
  background: var(--color-navy);
  box-shadow: var(--shadow-lg);
}

[data-theme="dark"] .navbar { background: #0B1120; }
[data-theme="dark"] .navbar--scrolled { background: #0B1120; }

.navbar__container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__left { flex-shrink: 0; }

.navbar__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  text-decoration: none;
  color: #FFFFFF !important;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-2xl);
}

.navbar__logo-food { color: #FFFFFF !important; }
.navbar__logo-boxx { color: var(--color-orange) !important; }
[data-theme="dark"] .navbar__logo-food { color: var(--color-orange) !important; }
[data-theme="dark"] .navbar__logo-boxx { color: #FFFFFF !important; }

.navbar__center { display: flex; align-items: center; gap: 40px; }

.navbar__links {
  display: flex;
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

.nav-link svg { width: 24px; height: 24px; }

/* SMOOTH ACTIVE TAB TRANSITION */
.nav-link::after,
.action-link::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-orange);
  border-radius: var(--radius-full);
  transform: scaleX(0);
  transform-origin: bottom left;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-link:hover::after,
.action-link:hover::after,
.nav-link.router-link-active::after,
.action-link.router-link-active::after {
  transform: scaleX(1);
}

.nav-link.router-link-active { color: var(--color-orange) !important; }

.navbar__actions { display: flex; align-items: center; gap: 40px; }

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

.action-link svg { width: 24px; height: 24px; }
.action-link:hover, .action-link.router-link-active { color: var(--color-orange) !important; }

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

.navbar__right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

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

.theme-toggle:hover { border-color: var(--color-orange); transform: translateY(-2px); }

.logout-desktop {
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

.logout-desktop:hover { background: var(--color-error); color: #FFFFFF !important; }

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.hamburger span {
  display: block;
  width: 26px;
  height: 3px;
  background: #FFFFFF;
  border-radius: var(--radius-full);
  transition: all 0.3s ease;
}

.hamburger--open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger--open span:nth-child(2) { opacity: 0; }
.hamburger--open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.mobile-menu {
  display: none;
  position: absolute;
  top: 90px;
  left: 0;
  right: 0;
  background: var(--color-navy);
  border-bottom: 2px solid var(--color-orange);
  padding: 20px;
  flex-direction: column;
  gap: 16px;
  z-index: 9998;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
}

.mobile-link {
  color: #FFFFFF !important;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-link.router-link-active { color: var(--color-orange) !important; }

.mobile-logout {
  background: transparent;
  border: 2px solid var(--color-error);
  color: var(--color-error) !important;
  padding: 12px;
  border-radius: var(--radius-full);
  font-size: 16px;
  font-weight: bold;
  margin-top: 12px;
  cursor: pointer;
}

.mobile-logout:hover { background: var(--color-error); color: #FFFFFF !important; }

.slide-enter-active, .slide-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 768px) {
  .navbar__center, .logout-desktop { display: none; }
  .hamburger { display: flex; }
  .mobile-menu { display: flex; }
  .navbar { height: 80px; }
  .navbar__container { padding: 0 16px; }
  .mobile-menu { top: 80px; }
}
</style>