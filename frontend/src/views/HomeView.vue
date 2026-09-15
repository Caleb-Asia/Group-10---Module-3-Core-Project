<!-- 
  Purpose: Homepage / Landing page.
  Module: Frontend - Views
  Owner: Sisamila Sigab
  Created: 2026-08-31
  Notes: Uses FoodBoxx design tokens. No duplicate navbar.
-->
<template>
  <div class="home-page">
    <main>
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="container hero-content">
          <div class="hero-text">
            <span class="hero-eyebrow">PERFORMANCE FUEL — NOT DIET FOOD</span>
            <h1 class="hero-title">
              Fuel your study session —<br/>
              <span class="text-orange">not your food coma.</span>
            </h1>
            <p class="hero-subtitle">
              Fresh, nutrient-dense meal boxes for Cape Town's busy students and young professionals.
              Pickup on campus, scan your QR, and get back to what matters.
            </p>
            <div class="hero-actions">
              <router-link to="/menu" class="btn btn--primary btn--lg">Order Now →</router-link>
              <router-link to="/builder" class="btn btn--outline-white btn--lg">Build My Box</router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- BOXES SECTION -->
      <section class="content-section boxes-section">
        <div class="section-heading">
          <div>
            <span class="section-eyebrow">OUR BOXES</span>
            <h2 class="section-title">Choose your Performance Fuel</h2>
          </div>
          <router-link to="/menu" class="outline-button">
            Browse Full Menu <span aria-hidden="true">→</span>
          </router-link>
        </div>

        <div v-if="isLoading" class="home-product-state">Loading boxes...</div>
        <div v-else-if="productError" class="home-product-state">{{ productError }}</div>
        <div v-else-if="featuredBoxes.length === 0" class="home-product-state">No boxes are available right now.</div>
        <div v-else class="box-grid">
          <article v-for="box in featuredBoxes" :key="box.id" class="box-card">
            <div class="box-image-wrap">
              <img :src="box.image_url || '/images/placeholder-product.png'" :alt="`${box.name} meal box`" class="box-image" />
            </div>

            <div class="box-content">
              <h3 class="box-name">{{ box.name }}</h3>
              <p class="price">R{{ box.price }}</p>

              <div class="tags">
                <span v-for="tag in getDietaryTags(box)" :key="tag" class="tag">{{ tag }}</span>
              </div>

              <button class="btn btn--primary btn--full" @click="addToCart(box)">
                Add to Cart
              </button>
            </div>
          </article>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="content-section how-section">
        <div class="section-heading center">
          <div>
            <span class="section-eyebrow">HOW IT WORKS</span>
            <h2 class="section-title">From cart to campus in 3 steps</h2>
          </div>
        </div>

        <div class="steps">
          <article v-for="step in steps" :key="step.number" class="step">
            <span class="step-number">{{ step.number }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <!-- PROMO SECTION -->
      <section class="content-section promo-section">
        <div class="promo-card">
          <div class="promo-overlay"></div>
          <div class="promo-content">
            <span class="eyebrow">LIMITED TIME</span>
            <h2>
              Join the box club.<br/>
              <strong>Skip the campus queue.</strong>
            </h2>
            <p class="promo-subtitle">
              Subscribe and save 10% on every box. Pause, skip or switch anytime.
            </p>
            <div class="promo-actions">
              <router-link to="/menu" class="btn btn--primary btn--lg">Order Now</router-link>
              <router-link to="/builder" class="btn btn--outline-white btn--lg light-button">Build My Box</router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- STATS -->
      <section class="stats-section" aria-label="FoodBoxx statistics">
        <div v-for="stat in stats" :key="stat.label" class="stat">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </section>
    </main>

    <!-- TOAST -->
    <transition name="toast">
      <div v-if="message" class="toast" role="status">
        <span class="toast-check">✓</span>
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
/**
 * HomeView
 * Owner: Sisamila Sigab
 * Notes: Uses local cart state via localStorage. Uses FoodBoxx design tokens.
 */
import { computed, onMounted, ref } from "vue";
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';

const cartStore = useCartStore();
const productStore = useProductStore();
const isLoading = ref(false);
const productError = ref('');
const featuredBoxes = computed(() => productStore.products.filter(product => product.category === 'box'));

const steps = [
  { number: 1, title: "Order by Fri 6PM", description: "Place your order before the weekend cutoff" },
  { number: 2, title: "Visit a Pickup Pod", description: "Choose from 6 campus locations on Monday" },
  { number: 3, title: "Scan & Collect", description: "Show your unique QR code to grab your box" },
];

const stats = [
  { value: "30k+", label: "UCT Students" },
  { value: "6", label: "Campus Pods" },
  { value: "4.8★", label: "Avg Rating" },
];

const message = ref("");

function addToCart(box) {
  // Use the shared cart store so home-page additions survive navigation and reloads.
  cartStore.addToCart({
    id: box.id,
    name: box.name,
    price: parseFloat(box.price),
    quantity: 1,
    image_url: box.image_url || '',
    dietary_tags: box.dietary_tags || []
  });
  message.value = `${box.name} added to your cart`;
  window.clearTimeout(addToCart.timeout);
  addToCart.timeout = window.setTimeout(() => {
    message.value = "";
  }, 2200);
}

function getDietaryTags(product) {
  if (Array.isArray(product.dietary_tags)) return product.dietary_tags;
  if (typeof product.dietary_tags === 'string' && product.dietary_tags.trim()) {
    return product.dietary_tags.split(',').map(tag => tag.trim());
  }
  return [];
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await productStore.fetchProducts();
  } catch (error) {
    productError.value = 'Unable to load boxes right now.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* ============================================
   HOME PAGE STYLES
   ============================================ */

.home-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--color-cream);
}

/* HERO */
.hero-section {
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
  padding: var(--spacing-16) 0;
  border-bottom: 4px solid var(--color-orange);
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.hero-eyebrow {
  display: block;
  margin-bottom: var(--spacing-3);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.14em;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: var(--font-weight-bold);
  color: #FFFFFF;
  line-height: 1.1;
  margin-bottom: var(--spacing-4);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.75);
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: var(--spacing-6);
}

.hero-actions {
  display: flex;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

/* CONTENT SECTIONS */
.content-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

.boxes-section {
  padding: var(--spacing-12) var(--spacing-6) var(--spacing-8);
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
}

/* FIX: Centered heading variant */
.section-heading.center {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
}

.section-heading.center > div {
  text-align: center;
  margin: 0 auto;
}

.section-eyebrow {
  display: block;
  margin-bottom: var(--spacing-2);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.14em;
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin: 0;
}

.outline-button {
  border: 2px solid var(--color-orange);
  border-radius: var(--radius-full);
  padding: var(--spacing-3) var(--spacing-5);
  background: transparent;
  color: var(--color-orange);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.outline-button:hover {
  background: var(--color-orange);
  color: #FFFFFF;
}

/* BOXES GRID */
.box-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-6);
}

.home-product-state {
  padding: var(--spacing-8) 0;
  color: var(--color-gray-600);
  text-align: center;
}

.box-card {
  overflow: hidden;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-2xl);
  background: var(--color-white);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.box-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.box-image-wrap {
  height: 200px;
  overflow: hidden;
  background: var(--color-gray-100);
}

.box-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.box-card:hover .box-image {
  transform: scale(1.05);
}

.box-content {
  padding: var(--spacing-5);
}

.box-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-1);
}

.price {
  margin: 0 0 var(--spacing-3);
  color: var(--color-orange);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.tags {
  min-height: 25px;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-4);
}

.tag {
  padding: 4px 11px;
  border-radius: var(--radius-full);
  background: var(--color-cream);
  color: var(--color-navy);
  border: 1px solid var(--color-gray-200);
  font-size: 11px;
  font-weight: var(--font-weight-bold);
}

/* HOW IT WORKS */
.how-section {
  padding: var(--spacing-12) var(--spacing-6);
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-6);
  margin-top: var(--spacing-8);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.step-number {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--color-orange);
  color: #FFFFFF;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  box-shadow: 0 4px 12px rgba(242, 106, 27, 0.3);
}

.step h3 {
  margin: 0;
  color: var(--color-navy);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
}

.step p {
  margin: 0;
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

/* PROMO */
.promo-section {
  padding: var(--spacing-12) var(--spacing-6);
}

.promo-card {
  position: relative;
  min-height: 280px;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  background: linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.promo-content {
  padding: var(--spacing-10) var(--spacing-6);
  color: #FFFFFF;
  max-width: 700px;
}

.eyebrow {
  display: block;
  margin-bottom: var(--spacing-3);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.14em;
}

.promo-content h2 {
  margin: 0 0 var(--spacing-4);
  color: #FFFFFF;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  line-height: 1.2;
  font-weight: var(--font-weight-bold);
}

.promo-content h2 strong {
  color: var(--color-orange);
}

.promo-subtitle {
  color: rgba(255, 255, 255, 0.75);
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-6);
}

.promo-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
  flex-wrap: wrap;
}

/* FIX: Force white text on outline-white button */
.btn--outline-white,
.light-button {
  border: 2px solid #FFFFFF !important;
  padding: 10px 18px;
  background: transparent;
  color: #FFFFFF !important;
  font-weight: var(--font-weight-bold);
}

.btn--outline-white:hover,
.light-button:hover {
  background: #FFFFFF;
  color: var(--color-navy) !important;
}

/* STATS */
.stats-section {
  max-width: 1100px;
  margin: 0 auto var(--spacing-12);
  padding: var(--spacing-5) var(--spacing-6);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  border-radius: var(--radius-xl);
  background: var(--color-navy);
  color: #FFFFFF;
}

.stat {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat + .stat {
  border-left: 1px solid rgba(255, 255, 255, 0.15);
}

.stat strong {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.stat span {
  margin-top: var(--spacing-1);
  color: var(--color-orange);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.05em;
}

/* TOAST */
.toast {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-lg);
  background: var(--color-navy);
  color: #FFFFFF;
  box-shadow: var(--shadow-xl);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.toast-check {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--color-orange);
  color: #FFFFFF;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* DARK MODE */
[data-theme="dark"] .home-page { background: #0B1120; }
[data-theme="dark"] .box-card,
[data-theme="dark"] .step { background: #1A2436; border-color: #2D3748; }
[data-theme="dark"] .box-name,
[data-theme="dark"] .section-title,
[data-theme="dark"] .step h3 { color: #FFFFFF; }
[data-theme="dark"] .step p { color: #CBD5E1; }
[data-theme="dark"] .tag { background: #0B1120; border-color: #2D3748; color: #FFFFFF; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .box-grid { grid-template-columns: 1fr; }
  .steps { grid-template-columns: 1fr; }
  .stats-section { grid-template-columns: 1fr; gap: var(--spacing-4); }
  .stat + .stat { border-left: none; border-top: 1px solid rgba(255,255,255,0.15); padding-top: var(--spacing-4); }
  .section-heading { flex-direction: column; align-items: flex-start; gap: var(--spacing-3); }
}
</style>
