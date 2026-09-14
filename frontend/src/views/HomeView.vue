<script setup>
import { computed, ref } from "vue";

const CART_KEY = "foodboxx-cart";

const boxes = [
  {
    id: "starter",
    name: "Starter Box",
    price: 49,
    tags: ["Standard"],
    image: "/images/boxes/Starter.jpg",
  },
  {
    id: "standard",
    name: "Standard Box",
    price: 79,
    tags: ["Halal", "Standard"],
    image: "/images/boxes/Standard.jpg",
  },
];

const steps = [
  {
    number: 1,
    title: "Order by Fri 6PM",
    description: "Place your order before the weekend cutoff",
  },
  {
    number: 2,
    title: "Pickup Pod",
    description: "Visit your nearest campus pod on Monday",
  },
  {
    number: 3,
    title: "Scan QR",
    description: "Scan your unique QR code to collect your box",
  },
];

const stats = [
  { value: "30k+", label: "UCT Students" },
  { value: "6", label: "Campus Pods" },
  { value: "4.8★", label: "Avg Rating" },
];

function readCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const cartItems = ref(readCart());
const message = ref("");

const cartCount = computed(() =>
  cartItems.value.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0,
  ),
);

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems.value));
  window.dispatchEvent(new CustomEvent("foodboxx-cart-updated"));
}

function addToCart(box) {
  const existing = cartItems.value.find((item) => item.id === box.id);

  if (existing) {
    existing.quantity = Number(existing.quantity || 1) + 1;
  } else {
    cartItems.value.push({
      ...box,
      quantity: 1,
    });
  }

  saveCart();
  message.value = `${box.name} added to your cart`;
  window.clearTimeout(addToCart.timeout);
  addToCart.timeout = window.setTimeout(() => {
    message.value = "";
  }, 2200);
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}
</script>

<template>
  <div class="home-page">
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="/" aria-label="Food Boxx home">
          <span>Food</span> Boxx
        </a>

        <div class="fuel-pill">Performance Fuel</div>

        <nav class="main-nav" aria-label="Main navigation">
          <a class="nav-item active" href="/" aria-current="page">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
              />
            </svg>
            <span>Home</span>
          </a>

          <button class="nav-item" type="button" @click="scrollTo('boxes')">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 6h14M5 12h14M5 18h14" />
            </svg>
            <span>Menu</span>
          </button>

          <button
            class="nav-item cart-nav"
            type="button"
            @click="scrollTo('boxes')"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
              />
              <circle cx="10" cy="20" r="1.2" />
              <circle cx="18" cy="20" r="1.2" />
            </svg>
            <span>Cart</span>
            <b v-if="cartCount" class="cart-badge">{{ cartCount }}</b>
          </button>

          <button class="nav-item" type="button" @click="scrollTo('boxes')">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
            <span>Account</span>
          </button>
        </nav>
      </div>
    </header>

    <main>
      <section id="boxes" class="content-section boxes-section">
        <div class="section-heading">
          <h1>Our Boxes</h1>
          <button
            class="outline-button"
            type="button"
            @click="scrollTo('boxes')"
          >
            Browse Full Menu <span aria-hidden="true">→</span>
          </button>
        </div>

        <div class="box-grid">
          <article v-for="box in boxes" :key="box.id" class="box-card">
            <div class="box-image-wrap">
              <img
                :src="box.image"
                :alt="`${box.name} meal box`"
                class="box-image"
              />
            </div>

            <div class="box-content">
              <h2>{{ box.name }}</h2>
              <p class="price">R{{ box.price }}</p>

              <div class="tags">
                <span v-for="tag in box.tags" :key="tag" class="tag">{{
                  tag
                }}</span>
              </div>

              <button
                class="primary-button"
                type="button"
                @click="addToCart(box)"
              >
                Add to Cart
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="content-section how-section">
        <h2 class="section-title">How It Works</h2>

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

      <section class="content-section promo-section">
        <div class="promo-card">
          <div class="promo-overlay"></div>

          <div class="promo-content">
            <p class="eyebrow">PERFORMANCE FUEL – NOT DIET FOOD.</p>
            <h2>
              Fuel your study session – <strong>not your food coma.</strong>
            </h2>

            <div class="promo-actions">
              <button
                class="primary-button promo-button"
                type="button"
                @click="scrollTo('boxes')"
              >
                Order Now
              </button>
              <button
                class="light-button promo-button"
                type="button"
                @click="scrollTo('boxes')"
              >
                Build My Box
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-section" aria-label="Food Boxx statistics">
        <div v-for="stat in stats" :key="stat.label" class="stat">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </div>
      </section>
    </main>

    <transition name="toast">
      <div v-if="message" class="toast" role="status">
        <span class="toast-check">✓</span>
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(html) {
  scroll-behavior: smooth;
}

:global(body) {
  margin: 0;
  background: #fdfbf8;
  color: #172a3b;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

:global(button),
:global(a) {
  font: inherit;
}

.home-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #fdfbf8;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #172a3b;
  color: #fff;
  box-shadow: 0 3px 14px rgba(16, 31, 44, 0.2);
}

.nav-shell {
  width: min(1120px, calc(100% - 48px));
  min-height: 116px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 53px 63px;
  align-items: center;
}

.brand {
  justify-self: start;
  color: #fff;
  text-decoration: none;
  font-size: 25px;
  font-weight: 800;
  letter-spacing: -0.7px;
}

.brand span {
  color: #f56600;
}

.fuel-pill {
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
  padding: 7px 17px;
  border-radius: 999px;
  background: #a8d500;
  color: #19310d;
  font-size: 12px;
  font-weight: 800;
}

.main-nav {
  grid-column: 1 / -1;
  grid-row: 2;
  height: 100%;
  display: flex;
  justify-content: center;
}

.nav-item {
  position: relative;
  width: 150px;
  min-width: 0;
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: #aeb9c3;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
}

.nav-item:hover,
.nav-item.active {
  color: #f56600;
  border-bottom-color: #f56600;
}

.nav-item svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cart-badge {
  position: absolute;
  top: 7px;
  right: 43px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #f56600;
  color: #fff;
  font-size: 10px;
  line-height: 1;
}

.content-section {
  width: min(900px, calc(100% - 48px));
  margin: 0 auto;
}

.boxes-section {
  padding: 27px 0 46px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.section-heading h1,
.section-title {
  margin: 0;
  color: #172a3b;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.6px;
}

.outline-button {
  border: 1.5px solid #f56600;
  border-radius: 999px;
  padding: 9px 17px;
  background: transparent;
  color: #e85c00;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
}

.outline-button:hover {
  background: #fff4ec;
}

.box-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.box-card {
  overflow: hidden;
  border: 1px solid #e7e3df;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 3px 10px rgba(25, 45, 62, 0.13);
}

.box-image-wrap {
  height: 176px;
  overflow: hidden;
  background: #eee;
}

.box-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
}

.box-card:hover .box-image {
  transform: scale(1.025);
}

.box-content {
  padding: 16px 18px 18px;
}

.box-content h2 {
  margin: 0 0 5px;
  color: #172a3b;
  font-size: 18px;
  font-weight: 800;
}

.price {
  margin: 0 0 7px;
  color: #f15c00;
  font-size: 22px;
  font-weight: 800;
}

.tags {
  min-height: 25px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 11px;
  border-radius: 999px;
  background: #a8d500;
  color: #1d320c;
  font-size: 10px;
  font-weight: 800;
}

.primary-button,
.light-button {
  min-height: 40px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease;
}

.primary-button {
  width: 100%;
  margin-top: 12px;
  border: 0;
  padding: 11px 18px;
  background: #f56600;
  color: #fff;
  box-shadow: 0 3px 7px rgba(245, 102, 0, 0.18);
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 11px rgba(245, 102, 0, 0.25);
}

.how-section {
  padding: 8px 0 34px;
}

.section-title {
  margin-bottom: 19px;
}

.steps {
  display: grid;
  gap: 12px;
}

.step {
  display: flex;
  align-items: center;
  gap: 15px;
}

.step-number {
  flex: 0 0 51px;
  width: 51px;
  height: 51px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f56600;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  box-shadow: 0 3px 6px rgba(245, 102, 0, 0.18);
}

.step h3 {
  margin: 0 0 3px;
  color: #172a3b;
  font-size: 14px;
  font-weight: 800;
}

.step p {
  margin: 0;
  color: #71818d;
  font-size: 12px;
}

.promo-section {
  padding-bottom: 16px;
}

.promo-card {
  position: relative;
  min-height: 176px;
  overflow: hidden;
  isolation: isolate;
  border-radius: 16px;
  background: url("/images/hero-banner.jpg") center / cover no-repeat;
}

.promo-overlay {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    90deg,
    rgba(12, 27, 38, 0.86),
    rgba(12, 27, 38, 0.34)
  );
}

.promo-content {
  padding: 36px 22px 28px;
  color: #fff;
}

.eyebrow {
  margin: 0 0 8px;
  color: #a8d500;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.promo-content h2 {
  max-width: 670px;
  margin: 0 0 19px;
  color: #fff;
  font-size: 23px;
  line-height: 1.18;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.promo-content h2 strong {
  color: #f56600;
}

.promo-actions {
  max-width: 660px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.promo-button {
  margin-top: 0;
}

.light-button {
  border: 2px solid #fff;
  padding: 10px 18px;
  background: transparent;
  color: #fff;
}

.light-button:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.stats-section {
  width: min(900px, calc(100% - 48px));
  min-height: 76px;
  margin: 0 auto 40px;
  padding: 12px 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  border-radius: 15px;
  background: #172a3b;
  color: #fff;
}

.stat {
  min-height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat + .stat {
  border-left: 1px solid rgba(255, 255, 255, 0.24);
}

.stat strong {
  font-size: 18px;
  font-weight: 800;
}

.stat span {
  margin-top: 2px;
  color: #a8d500;
  font-size: 10px;
  font-weight: 700;
}

.toast {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 17px;
  border-radius: 12px;
  background: #172a3b;
  color: #fff;
  box-shadow: 0 8px 25px rgba(23, 42, 59, 0.25);
  font-size: 13px;
  font-weight: 700;
}

.toast-check {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #a8d500;
  color: #17300e;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 700px) {
  .nav-shell {
    width: calc(100% - 28px);
    grid-template-rows: 54px 60px;
  }

  .nav-item {
    width: 25vw;
    max-width: 115px;
  }

  .fuel-pill {
    padding: 6px 11px;
    font-size: 10px;
  }

  .content-section,
  .stats-section {
    width: calc(100% - 28px);
  }

  .box-grid {
    grid-template-columns: 1fr;
  }

  .box-image-wrap {
    height: 190px;
  }
}

@media (max-width: 480px) {
  .brand {
    font-size: 21px;
  }

  .section-heading {
    align-items: flex-start;
    gap: 12px;
  }

  .section-heading h1,
  .section-title {
    font-size: 21px;
  }

  .outline-button {
    padding: 8px 11px;
    font-size: 10px;
    white-space: nowrap;
  }

  .promo-content {
    padding: 30px 18px 24px;
  }

  .promo-content h2 {
    font-size: 20px;
  }

  .promo-actions {
    grid-template-columns: 1fr;
  }

  .stats-section {
    padding: 10px 8px;
  }

  .stat strong {
    font-size: 16px;
  }

  .stat span {
    font-size: 9px;
  }

  .toast {
    right: 14px;
    bottom: 14px;
    left: 14px;
    justify-content: center;
  }
}
</style>
