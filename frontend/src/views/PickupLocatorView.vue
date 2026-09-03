<!-- 
  Purpose: Interactive pickup pod locator with a stylized metro-style map.
  Module: Frontend - Views
  Owner: Caleb Asia
  Created: 2026-09-01
  Notes: Fully offline. Map is schematic (not to scale). 
         Supports mouse drag, touch drag, and zoom buttons.
-->
<template>
  <div class="locator-page">
    <div class="container">
      
      <!-- Page Header -->
      <div class="header-section mb-8">
        <h1 class="page-title">Find Your Pickup Pod</h1>
        <p class="page-subtitle">Grab your Performance Fuel at one of our 6 convenient Cape Town locations.</p>
      </div>

      <!-- Interactive Map Container -->
      <div class="map-container mb-8">
        <div 
          class="map-viewport" 
          :style="{ transform: `translate(${panX}px, ${panY}px) scale(${zoom})` }"
          @pointerdown="startDrag"
          @pointermove="drag"
          @pointerup="endDrag"
          @pointercancel="endDrag"
        >
          <!-- Stylized Schematic Map -->
          <svg viewBox="0 0 800 500" class="map-svg" preserveAspectRatio="xMidYMid slice">
            <!-- Coastline -->
            <path d="M0 400 Q 200 350 400 450 T 800 500 L 800 500 L 0 500 Z" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="2" />
            
            <!-- Major Park / Green space -->
            <rect x="550" y="80" width="180" height="120" fill="#DCFCE7" stroke="#BBF7D0" rx="10" />

            <!-- Main Roads -->
            <path d="M0 250 Q 300 200 800 250" fill="none" stroke="#CBD5E1" stroke-width="18" />
            <path d="M200 0 Q 300 250 200 500" fill="none" stroke="#CBD5E1" stroke-width="14" />
            <path d="M600 0 L 600 500" fill="none" stroke="#CBD5E1" stroke-width="12" />
            
            <!-- Minor Roads -->
            <path d="M0 150 L 800 100" fill="none" stroke="#E2E8F0" stroke-width="8" />
            <path d="M0 350 L 800 300" fill="none" stroke="#E2E8F0" stroke-width="6" />
            <path d="M300 0 L 350 500" fill="none" stroke="#E2E8F0" stroke-width="4" />
            <path d="M700 0 L 650 500" fill="none" stroke="#E2E8F0" stroke-width="4" />

            <!-- Buildings / Landmarks -->
            <rect x="80" y="200" width="120" height="80" fill="#F1F5F9" stroke="#CBD5E1" rx="6" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.05));" />
            <rect x="350" y="120" width="160" height="100" fill="#F1F5F9" stroke="#CBD5E1" rx="6" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.05));" />
            <rect x="500" y="300" width="140" height="90" fill="#F1F5F9" stroke="#CBD5E1" rx="6" style="filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.05));" />
            
            <!-- Road Labels -->
            <text x="270" y="240" font-size="12" fill="#94A3B8" font-family="sans-serif" transform="rotate(-3 270 240)">N2</text>
            <text x="610" y="90" font-size="12" fill="#94A3B8" font-family="sans-serif" transform="rotate(90 610 90)">M3</text>
          </svg>

          <!-- Clickable Pins (Move with the map) -->
          <div 
            v-for="(pod, index) in pickupPods" 
            :key="pod.id" 
            class="map-pin" 
            :class="{ 'map-pin--active': activePodId === pod.id }"
            :style="pinPosition(index)"
            @click.stop="focusPod(pod.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" class="pin-icon">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#F26A1B" stroke="#FFFFFF" stroke-width="2"/>
              <circle cx="12" cy="10" r="3" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>

        <!-- Zoom Controls -->
        <div class="zoom-controls">
          <button class="zoom-btn" @mousedown.prevent @click="zoomIn">+</button>
          <div class="zoom-divider"></div>
          <button class="zoom-btn" @mousedown.prevent @click="zoomOut">−</button>
        </div>

        <div class="map-instruction">Drag to pan · Use buttons to zoom</div>
      </div>

      <!-- Pods List -->
      <h3 class="section-title mb-4">All Locations</h3>
      <div class="pods-grid">
        <div 
          v-for="pod in pickupPods" 
          :key="pod.id" 
          class="pod-card" 
          :class="{ 'pod-card--active': activePodId === pod.id }"
          @mouseenter="activePodId = pod.id"
          @mouseleave="activePodId = null"
        >
          <div class="pod-card-header">
            <div class="pod-icon">
              <svg viewBox="0 0 24 24" fill="none" class="pod-svg-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#F26A1B" stroke="#FFFFFF" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" fill="#FFFFFF"/>
              </svg>
            </div>
            <div>
              <h4 class="pod-name">{{ pod.name }}</h4>
              <p class="pod-address">{{ pod.address }}</p>
            </div>
          </div>
          
          <div class="pod-info">
            <span class="pod-hours">🕒 {{ pod.hours }}</span>
          </div>

          <button class="btn btn--outline btn--sm" @click="openDirections(pod.name)">
            Get Directions →
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { showSuccess } from '@/services/ui';

// State
const activePodId = ref(null);
const zoom = ref(1);
const panX = ref(0);
const panY = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);

// Limit zoom
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 2.5;

// Zoom functions
const zoomIn = () => {
  zoom.value = Math.min(MAX_ZOOM, zoom.value + 0.2);
};

const zoomOut = () => {
  zoom.value = Math.max(MIN_ZOOM, zoom.value - 0.2);
};

// Drag / Pan functions (Uses Pointer Events for Mouse + Touch)
const startDrag = (e) => {
  isDragging.value = true;
  startX.value = e.clientX - panX.value;
  startY.value = e.clientY - panY.value;
};

const drag = (e) => {
  if (!isDragging.value) return;
  panX.value = e.clientX - startX.value;
  panY.value = e.clientY - startY.value;
};

const endDrag = () => {
  isDragging.value = false;
};

// Static data for the 6 pods
const pickupPods = [
  { id: 1, name: 'UCT Library', address: 'University of Cape Town, Rondebosch', hours: 'Mon–Fri, 08:00–17:00' },
  { id: 2, name: 'Res Hall A', address: 'Upper Campus, Rondebosch', hours: 'Mon–Fri, 08:00–17:00' },
  { id: 3, name: 'Stellenbosch Neelsie', address: 'Neelsie Student Centre, Stellenbosch', hours: 'Mon–Fri, 08:00–17:00' },
  { id: 4, name: 'CPUT Woodstock', address: 'Cape Peninsula University of Tech, Woodstock', hours: 'Mon–Fri, 08:00–17:00' },
  { id: 5, name: 'Workshop17 Woodstock', address: '17 Dysseldorp Rd, Woodstock', hours: 'Mon–Fri, 08:00–17:00' },
  { id: 6, name: 'Virgin Active Woodstock', address: 'The Woodstock Exchange, Woodstock', hours: 'Mon–Fri, 06:00–20:00' },
];

// Mock pin positions on the SVG map
const pinPosition = (index) => {
  const positions = [
    { top: '30%', left: '20%' },
    { top: '20%', left: '70%' },
    { top: '60%', left: '30%' },
    { top: '50%', left: '50%' },
    { top: '70%', left: '70%' },
    { top: '80%', left: '40%' },
  ];
  return positions[index];
};

// Function to focus a pod when a map pin is clicked
const focusPod = (id) => {
  activePodId.value = id;
};

const openDirections = (name) => {
  showSuccess('Opening Maps', `Directions to ${name} would open here in the real app.`);
};
</script>

<style scoped>
.locator-page {
  background-color: var(--color-cream);
  min-height: 100vh;
  padding: var(--spacing-8) 0;
}

.header-section {
  text-align: center;
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: var(--spacing-2);
}

.page-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-gray-500);
  max-width: 600px;
  margin: 0 auto;
}

/* Map Container */
.map-container {
  background: var(--color-white);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  position: relative;
}

/* CRITICAL FIX: Use Touch-action to prevent mobile scrolling hijacking */
.map-viewport {
  width: 100%;
  height: 300px;
  cursor: grab;
  transition: transform 0.2s ease;
  transform-origin: center;
  touch-action: none; 
}

.map-viewport:active {
  cursor: grabbing;
}

.map-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Map Pins */
.map-pin {
  position: absolute;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -100%);
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition-fast);
}

.map-pin:hover {
  transform: translate(-50%, -100%) scale(1.2);
}

.map-pin--active {
  transform: translate(-50%, -100%) scale(1.3);
  filter: drop-shadow(0 4px 6px rgba(15, 33, 55, 0.3));
}

.pin-icon {
  width: 100%;
  height: 100%;
}

/* Zoom Controls */
.zoom-controls {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--color-white);
  border-radius: 10px;
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 20;
}

.zoom-btn {
  width: 35px;
  height: 35px;
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  color: var(--color-navy);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.zoom-btn:hover {
  background: var(--color-gray-100);
}

.zoom-divider {
  height: 1px;
  background: var(--color-gray-200);
}

.map-instruction {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 33, 55, 0.8);
  color: white;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  z-index: 20;
  pointer-events: none;
}

/* Section Title */
.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
}

/* Pods Grid */
.pods-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

@media (min-width: 768px) {
  .pods-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.pod-card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  padding: var(--spacing-5);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
}

.pod-card:hover,
.pod-card--active {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-orange);
}

.pod-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.pod-icon {
  width: 24px;
  height: 24px;
}

.pod-svg-icon {
  width: 100%;
  height: 100%;
}

.pod-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-navy);
  margin-bottom: 2px;
}

.pod-address {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin-bottom: 0;
}

.pod-info {
  margin-bottom: var(--spacing-4);
  flex-grow: 1;
}

.pod-hours {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

/* Utility */
.mb-0 { margin-bottom: 0; }
.mb-2 { margin-bottom: var(--spacing-2); }
.mb-4 { margin-bottom: var(--spacing-4); }
.mb-8 { margin-bottom: var(--spacing-8); }
</style>