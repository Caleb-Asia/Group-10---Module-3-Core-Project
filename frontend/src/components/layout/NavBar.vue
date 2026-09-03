<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <div class="navbar__container">
      
      <!-- LEFT: Logo -->
      <div class="navbar__left">
        <router-link to="/" class="navbar__logo">
          <span class="navbar__logo-text"><span class="navbar__logo-food">Food</span><span class="navbar__logo-boxx">Boxx</span></span>
        </router-link>
      </div>

      <!-- CENTER: Navigation Links & Actions -->
      <div class="navbar__center">
        <ul class="navbar__links">
          <li>
            <router-link to="/" class="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Home</span>
            </router-link>
          </li>
          <li>
            <router-link to="/menu" class="nav-item">
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
          </li>
          <li>
            <router-link to="/pods" class="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Pickup Pods</span>
            </router-link>
          </li>
          <!-- Added Custom Box -->
          <li>
            <router-link to="/builder" class="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <span>Custom Box</span>
            </router-link>
          </li>
        </ul>

        <!-- Actions -->
        <div class="navbar__actions">
          <router-link to="/cart" class="navbar__action-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span>Cart</span>
            <span v-if="cartStore.itemCount > 0" class="navbar__cart-badge">
              {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
            </span>
          </router-link>

          <router-link to="/dashboard" class="navbar__action-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Account</span>
          </router-link>
        </div>
      </div>

      <!-- RIGHT: Logout -->
      <div class="navbar__right">
        <button v-if="authStore.isAuthenticated" class="logout-btn" @click="handleLogout">
          Logout
        </button>
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

    <router-link to="/pods" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <span>Pods</span>
    </router-link>

    <router-link to="/builder" class="mobile-bottom-nav__item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
      <span>Custom</span>
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
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { showSuccess } from '@/services/ui';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

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
  height: 80px;
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
  width: 100%;
  height: 100%;
  padding: 0 40px; 
  display: grid;
  grid-template-columns: 1fr auto 1fr; 
  align-items: center;
}

.navbar__left {
  justify-self: start;
}

.navbar__logo {
  text-decoration: none;
}

.navbar__logo-text {
  font-size: 26px;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.5px;
}

.navbar__logo-food {
  color: var(--color-white);
}

.navbar__logo-boxx {
  color: var(--color-orange);
}

.navbar__center {
  display: flex;
  align-items: center;
  gap: 40px;
  justify-self: center;
}

.navbar__links {
  display: none;
  list-style: none;
  gap: 40px;
  margin: 0;
  padding: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  transition: color var(--transition-fast);
  line-height: 1;
}

.nav-item svg {
  width: 30px;
  height: 30px;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--color-orange);
}

.navbar__actions {
  display: none;
  align-items: center;
  gap: 40px;
}

.navbar__action-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  transition: color var(--transition-fast);
  line-height: 1;
}

.navbar__action-item svg {
  width: 30px;
  height: 30px;
}

.navbar__action-item:hover,
.navbar__action-item.router-link-active {
  color: var(--color-orange);
}

.navbar__cart-badge {
  position: absolute;
  top: -8px;
  right: 14px;
  background: var(--color-orange);
  color: var(--color-white);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  min-width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
  z-index: 10;
}

.navbar__right {
  justify-self: end;
}

.logout-btn {
  background: transparent;
  border: 2px solid var(--color-error);
  color: var(--color-error);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.logout-btn:hover {
  background: var(--color-error);
  color: var(--color-white);
}

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  position: relative;
  width: 100%;
  height: 100%;
}

.mobile-bottom-nav__item svg {
  width: 28px;
  height: 28px;
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
  font-size: 10px;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

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