<!-- 
  Purpose: Global Footer component with branding, social links and quick navigation.
  Module: Frontend - Components - Layout
  Owner: Caleb Asia (originally Sisamila's file, built as lead)
  Created: 2026-09-01
  Notes: Used on all pages. TikTok/Instagram/WhatsApp links as per brief.
-->
<template>
  <footer class="footer">
    <div class="footer__container">
      
      <!-- TOP: Brand + Tagline -->
      <div class="footer__top">
        <div class="footer__brand">
          <span class="footer__brand-text">
            <span class="footer__brand-food">Food</span><span class="footer__brand-boxx">Boxx</span>
          </span>
          <p class="footer__tagline">Fuel your day. The smart way.</p>
        </div>

        <!-- SOCIAL LINKS -->
        <div class="footer__socials">
          <a 
            href="https://www.tiktok.com/@foodboxx" 
            target="_blank" 
            rel="noopener noreferrer"
            class="social-link" 
            aria-label="TikTok"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/foodboxx" 
            target="_blank" 
            rel="noopener noreferrer"
            class="social-link" 
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a 
            href="https://wa.me/27000000000" 
            target="_blank" 
            rel="noopener noreferrer"
            class="social-link" 
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- MIDDLE: Quick Links -->
      <div class="footer__links">
        <div class="footer__column">
          <h4 class="footer__column-title">Explore</h4>
          <router-link to="/menu" class="footer__link">Menu</router-link>
          <router-link to="/builder" class="footer__link">Custom Box</router-link>
          <router-link to="/pods" class="footer__link">Pickup Pods</router-link>
        </div>

        <div class="footer__column">
          <h4 class="footer__column-title">Account</h4>
          <router-link to="/login" class="footer__link">Login</router-link>
          <router-link to="/register" class="footer__link">Sign Up</router-link>
          <router-link to="/dashboard" class="footer__link">Dashboard</router-link>
        </div>

        <div class="footer__column">
          <h4 class="footer__column-title">Support</h4>
          <a href="mailto:hello@foodboxx.co.za" class="footer__link">Email Us</a>
          <a href="https://wa.me/27000000000" target="_blank" rel="noopener noreferrer" class="footer__link">WhatsApp</a>
          <router-link to="/pods" class="footer__link">Find a Pod</router-link>
        </div>
      </div>

      <!-- BOTTOM: Copyright -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ currentYear }} FoodBoxx. Fuel your day. The smart way.
        </p>
        <p class="footer__credit">Performance Fuel · Cape Town · Module 3 Core Project</p>
      </div>

    </div>
  </footer>
</template>

<script setup>
/**
 * Footer Component
 * Owner: Caleb Asia
 * Notes: Global footer. TikTok/Instagram/WhatsApp links per brief.
 */
import { computed } from 'vue';

// Dynamic copyright year
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
/* ============================================
   FOOTER STYLES
   ============================================ */
.footer {
  background: var(--color-navy);
  color: #FFFFFF;
  padding: var(--spacing-12) 0 var(--spacing-6);
  margin-top: var(--spacing-16);
  border-top: 4px solid var(--color-orange);
}

[data-theme="dark"] .footer {
  background: #0B1120;
}

.footer__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-6);
}

/* TOP: Brand + Socials */
.footer__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-8);
  padding-bottom: var(--spacing-8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--spacing-8);
}

.footer__brand-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.5px;
}

.footer__brand-food {
  color: #FFFFFF;
}

.footer__brand-boxx {
  color: var(--color-orange);
}

/* DARK MODE LOGO SWAP */
[data-theme="dark"] .footer__brand-food {
  color: var(--color-orange);
}
[data-theme="dark"] .footer__brand-boxx {
  color: #FFFFFF;
}

.footer__tagline {
  margin-top: var(--spacing-2);
  color: rgba(255, 255, 255, 0.6);
  font-size: var(--font-size-sm);
}

/* SOCIAL LINKS */
.footer__socials {
  display: flex;
  gap: var(--spacing-3);
}

.social-link {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.social-link svg {
  width: 22px;
  height: 22px;
}

.social-link:hover {
  background: var(--color-orange);
  transform: translateY(-3px);
}

/* MIDDLE: Quick Links Grid */
.footer__links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-8);
  padding-bottom: var(--spacing-8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: var(--spacing-6);
}

.footer__column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.footer__column-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-orange);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-2);
}

.footer__link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
  width: fit-content;
}

.footer__link:hover {
  color: var(--color-orange);
}

/* BOTTOM: Copyright */
.footer__bottom {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.footer__copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: var(--font-size-sm);
  margin: 0;
}

.footer__credit {
  color: rgba(255, 255, 255, 0.3);
  font-size: var(--font-size-xs);
  margin: 0;
  letter-spacing: 0.05em;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .footer__top {
    flex-direction: column;
    gap: var(--spacing-6);
  }

  .footer__links {
    grid-template-columns: 1fr;
    gap: var(--spacing-6);
  }
}
</style>