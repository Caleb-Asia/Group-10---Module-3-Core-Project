<template>
  <div class="home">
    <!-- HERO -->
    <section class="hero">
      <img class="hero-bg" src="/images/hero-banner.jpg" alt="FoodBoxx meals" />
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <p class="hero-tag">PERFORMANCE FUEL — NOT DIET FOOD</p>
        <h1 class="hero-title">
          Fuel your study session –
          <span class="hero-highlight">not your food coma.</span>
        </h1>

        <div class="hero-actions">
          <router-link to="/menu" class="btn btn-primary"
            >Order Now</router-link
          >
          <router-link to="/builder" class="btn btn-outline"
            >Build My Box</router-link
          >
        </div>
      </div>
    </section>

    <!-- OUR BOXES -->
    <section class="boxes-section">
      <div class="boxes-header">
        <h2>Our Boxes</h2>
        <router-link to="/menu" class="browse-link"
          >Browse Full Menu →</router-link
        >
      </div>

      <div class="boxes-grid">
        <article v-for="box in boxes" :key="box.id" class="box-card">
          <div class="box-image-wrap">
            <span v-if="box.badge" class="box-badge">{{ box.badge }}</span>
            <div
              class="box-image box-image--placeholder"
              :style="{ background: box.placeholderColor }"
            >
              <span class="placeholder-icon">{{ box.icon }}</span>
            </div>
          </div>

          <div class="box-info">
            <h3 class="box-name">{{ box.name }}</h3>
            <p class="box-price">R{{ box.price }}</p>

            <div class="box-tags">
              <span
                v-for="tag in box.tags"
                :key="tag"
                class="box-tag"
                :class="`box-tag--${tag.toLowerCase()}`"
              >
                {{ tag }}
              </span>
            </div>

            <button class="btn btn-add" @click="addToCart(box)">
              Add to Cart
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-it-works">
      <h2 class="how-title">How It Works</h2>

      <div class="steps-grid">
        <div v-for="step in steps" :key="step.number" class="step">
          <div class="step-number">{{ step.number }}</div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- STATS BAR -->
    <section class="stats-bar">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <p class="stat-value">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

// TODO: replace with API call to backend menu endpoint (Adam's product/order service)
const boxes = ref([
  {
    id: "budget",
    name: "Budget Box",
    price: 49,
    tags: ["Standard"],
    badge: null,
    icon: "🥗",
    placeholderColor: "linear-gradient(135deg, #fbeee0, #f5d5b8)",
  },
  {
    id: "standard",
    name: "Standard Box",
    price: 79,
    tags: ["Halal"],
    badge: null,
    icon: "🍱",
    placeholderColor: "linear-gradient(135deg, #eef0fb, #d7dcf5)",
  },
  {
    id: "premium",
    name: "Premium Box",
    price: 99,
    tags: ["Keto"],
    badge: "Sales Rate",
    icon: "🥩",
    placeholderColor: "linear-gradient(135deg, #fdeef0, #f6c9cf)",
  },
  {
    id: "vegan",
    name: "Vegan Box",
    price: 79,
    tags: ["Vegan"],
    badge: null,
    icon: "🥦",
    placeholderColor: "linear-gradient(135deg, #eef7ee, #c9e8c9)",
  },
]);

const steps = ref([
  {
    number: 1,
    title: "Order by Fri 6PM",
    description:
      "Place your order before the weekend cutoff to reserve your slot.",
  },
  {
    number: 2,
    title: "Pickup Pod",
    description:
      "Visit your nearest campus pod on Monday when delivery arrives.",
  },
  {
    number: 3,
    title: "Scan QR",
    description:
      "Scan your unique QR code at the pod kiosk to collect your box.",
  },
]);

const stats = ref([
  { value: "30k+", label: "UCT Students" },
  { value: "6", label: "Campus Pods" },
  { value: "4.8★", label: "Avg Rating" },
]);

// TODO: wire up to shared cart store/utility (Caleb's cart utils) once available
function addToCart(box) {
  console.log("Add to cart:", box);
}
</script>

<style scoped>
:root {
  --fb-navy: #1e1e1e;
  --fb-orange: #f05a28;
  --fb-orange-light: #f7c948;
  --fb-cream: #f5efe6;
  --fb-white: #ffffff;
  --fb-text-dark: #1e1e1e;
  --fb-text-muted: #6b6b6b;
}

.home {
  width: 100%;
  overflow-x: hidden;
}

/* HERO */
.hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: flex-end;
  padding: 48px 40px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-bg--placeholder {
  background: linear-gradient(135deg, #3a3a3a, #1e1e1e);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-bg--placeholder .placeholder-icon {
  font-size: 64px;
  opacity: 0.25;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.35) 55%,
    rgba(0, 0, 0, 0.15) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 560px;
  color: var(--fb-white);
}

.hero-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--fb-orange-light);
  margin-bottom: 10px;
}

.hero-title {
  font-size: 34px;
  line-height: 1.25;
  font-weight: 700;
  margin-bottom: 24px;
}

.hero-highlight {
  color: var(--fb-orange);
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition:
    opacity 0.15s ease,
    transform 0.1s ease;
}

.btn:hover {
  opacity: 0.9;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background: var(--fb-orange);
  color: var(--fb-white);
}

.btn-outline {
  background: transparent;
  color: var(--fb-white);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

/* OUR BOXES */
.boxes-section {
  background: var(--fb-white);
  padding: 48px 40px;
}

.boxes-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 24px;
}

.boxes-header h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--fb-text-dark);
}

.browse-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--fb-orange);
  text-decoration: none;
  border: 1px solid var(--fb-orange);
  padding: 6px 12px;
  border-radius: 20px;
}

.boxes-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.box-card {
  background: var(--fb-white);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
}

.box-image-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  background: #eee;
}

.box-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.box-image--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-image--placeholder .placeholder-icon {
  font-size: 40px;
  opacity: 0.6;
}

.box-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--fb-orange);
  color: var(--fb-white);
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
  z-index: 1;
}

.box-info {
  padding: 14px;
}

.box-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--fb-text-dark);
  margin-bottom: 2px;
}

.box-price {
  font-size: 14px;
  font-weight: 700;
  color: var(--fb-orange);
  margin-bottom: 8px;
}

.box-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.box-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: #eef7ee;
  color: #3a8a3a;
}

.box-tag--halal {
  background: #eef0fb;
  color: #4a55c9;
}

.box-tag--keto {
  background: #fdeef0;
  color: #c94a5a;
}

.btn-add {
  width: 100%;
  background: var(--fb-orange);
  color: var(--fb-white);
  padding: 8px 0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

/* HOW IT WORKS */
.how-it-works {
  background: var(--fb-cream);
  padding: 48px 40px;
}

.how-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--fb-text-dark);
  margin-bottom: 28px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--fb-orange);
  color: var(--fb-white);
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.step-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--fb-text-dark);
  margin-bottom: 6px;
}

.step-desc {
  font-size: 13px;
  color: var(--fb-text-muted);
  line-height: 1.5;
}

/* STATS BAR */
.stats-bar {
  background: var(--fb-navy);
  display: flex;
  justify-content: space-around;
  padding: 32px 40px;
}

.stat {
  text-align: center;
  color: var(--fb-white);
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--fb-orange-light);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .boxes-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .stats-bar {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 32px 20px;
  }

  .hero-title {
    font-size: 26px;
  }

  .boxes-section,
  .how-it-works {
    padding: 32px 20px;
  }

  .boxes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
