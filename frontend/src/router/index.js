/* 
  Purpose: Vue Router configuration.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Global guard forces non-authenticated users to /login. 
         Forces logged-in users to /dashboard.
*/
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';

// Import Placeholder for empty/unfinished pages
import PlaceholderView from '../views/PlaceholderView.vue';

// Import Caleb's Ready Views
import CatalogueView from '../views/CatalogueView.vue';
import CartView from '../views/CartView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import ConfirmationView from '../views/ConfirmationView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import BoxBuilderView from '../views/BoxBuilderView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import PickupLocatorView from '../views/PickupLocatorView.vue';

// Dashboard Views
import DashboardView from '../views/DashboardView.vue';
import ProfileView from '../views/dashboard/ProfileView.vue';
import SubscriptionsView from '../views/dashboard/SubscriptionsView.vue';
import OrdersView from '../views/dashboard/OrdersView.vue';

// Route Guards (Defined BEFORE routes)
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
  // Public Routes (No auth required)
  { path: '/', name: 'Home', component: PlaceholderView },
  { path: '/menu', name: 'Catalogue', component: CatalogueView },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetailView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/builder', name: 'BoxBuilder', component: BoxBuilderView },
  { path: '/pods', name: 'PickupLocator', component: PickupLocatorView },

  // Auth Routes (Guest Only - Redirects logged-in users to dashboard)
  { path: '/login', name: 'Login', component: LoginView, beforeEnter: guestOnly },
  { path: '/register', name: 'Register', component: RegisterView, beforeEnter: guestOnly },

  // Protected Transactional Routes (Requires Auth)
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

// GLOBAL GUARD: Forces everyone to /login if not logged in
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isPublicPage = ['Login', 'Register'].includes(to.name);

  if (!authStore.isAuthenticated && !isPublicPage) {
    // Force them to login
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;