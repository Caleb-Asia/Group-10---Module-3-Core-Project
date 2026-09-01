/* 
  Purpose: Vue Router configuration.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Maps all routes to specific views. 
*/

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';

// Import Caleb's Ready Views
import CatalogueView from '../views/CatalogueView.vue';
import CartView from '../views/CartView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import ConfirmationView from '../views/ConfirmationView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

// Dashboard Views
import DashboardView from '../views/DashboardView.vue';
import ProfileView from '../views/dashboard/ProfileView.vue';
import SubscriptionsView from '../views/dashboard/SubscriptionsView.vue';
import OrdersView from '../views/dashboard/OrdersView.vue';

// Import Placeholder for empty/unfinished pages (Sisamila's files, etc.)
import PlaceholderView from '../views/PlaceholderView.vue';

// Route Guards
const requireAuth = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
};

const guestOnly = (to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
};

const routes = [
  // Public Routes (Use Placeholder for empty pages)
  { path: '/', name: 'Home', component: PlaceholderView }, // Sisamila's
  { path: '/menu', name: 'Catalogue', component: CatalogueView },
  { path: '/product/:id', name: 'ProductDetail', component: PlaceholderView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/builder', name: 'BoxBuilder', component: PlaceholderView },
  { path: '/pods', name: 'PickupLocator', component: PlaceholderView },

  // Auth Routes (Guest Only)
  { path: '/login', name: 'Login', component: LoginView, beforeEnter: guestOnly },
  { path: '/register', name: 'Register', component: RegisterView, beforeEnter: guestOnly },

  // Protected Transactional Routes
  { path: '/checkout', name: 'Checkout', component: CheckoutView, beforeEnter: requireAuth },
  { path: '/confirmation', name: 'Confirmation', component: ConfirmationView, beforeEnter: requireAuth },

  // Dashboard Routes (Protected)
  { path: '/dashboard', name: 'Dashboard', component: DashboardView, beforeEnter: requireAuth },
  { path: '/dashboard/profile', name: 'Profile', component: ProfileView, beforeEnter: requireAuth },
  { path: '/dashboard/subscriptions', name: 'Subscriptions', component: SubscriptionsView, beforeEnter: requireAuth },
  { path: '/dashboard/orders', name: 'Orders', component: OrdersView, beforeEnter: requireAuth },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;