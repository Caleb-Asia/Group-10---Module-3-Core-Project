/* 
  Purpose: Vue Router configuration.
  Module: Frontend - Core Infrastructure
  Owner: Caleb Asia
  Created: 2026-08-31
  Notes: Global guard forces ALL pages (except /login and /register) to require authentication.
*/
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';

// Import Views
import HomeView from '../views/HomeView.vue';
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

// ROUTE GUARDS

// Requires the user to be logged in. Redirects to /login with the intended URL saved.
const requireAuth = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
};

// Only accessible when logged OUT. Logged-in users get bounced to /menu.
const guestOnly = (to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    next({ name: 'Catalogue' });
  } else {
    next();
  }
};

const routes = [
  // AUTH ROUTES (Guest only — must be logged OUT to view)
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView, 
    beforeEnter: guestOnly, 
    meta: { hideLayout: true } 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: RegisterView, 
    beforeEnter: guestOnly, 
    meta: { hideLayout: true } 
  },

  // PROTECTED ROUTES (Require authentication)
  { path: '/', name: 'Home', component: HomeView, beforeEnter: requireAuth },
  { path: '/menu', name: 'Catalogue', component: CatalogueView, beforeEnter: requireAuth },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetailView, beforeEnter: requireAuth },
  { path: '/cart', name: 'Cart', component: CartView, beforeEnter: requireAuth },
  { path: '/builder', name: 'BoxBuilder', component: BoxBuilderView, beforeEnter: requireAuth },
  { path: '/pods', name: 'PickupLocator', component: PickupLocatorView, beforeEnter: requireAuth },
  { path: '/checkout', name: 'Checkout', component: CheckoutView, beforeEnter: requireAuth },
  { path: '/confirmation', name: 'Confirmation', component: ConfirmationView, beforeEnter: requireAuth },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView, beforeEnter: requireAuth },
  { path: '/dashboard/profile', name: 'Profile', component: ProfileView, beforeEnter: requireAuth },
  { path: '/dashboard/subscriptions', name: 'Subscriptions', component: SubscriptionsView, beforeEnter: requireAuth },
  { path: '/dashboard/orders', name: 'Orders', component: OrdersView, beforeEnter: requireAuth },

  // CATCH-ALL: Unknown routes bounce to login (or home if authed)
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// GLOBAL GUARD: Belt-and-suspenders. Even if a route forgets `requireAuth`,
// this ensures non-authenticated users can never escape /login or /register.
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthRoute = to.name === 'Login' || to.name === 'Register';

  if (!authStore.isAuthenticated && !isAuthRoute) {
    // Not logged in and trying to leave the auth pages → redirect to login
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (authStore.isAuthenticated && isAuthRoute) {
    // Logged in and trying to visit login/register → bounce to menu
    next({ name: 'Catalogue' });
  } else {
    next();
  }
});

export default router;