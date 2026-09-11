import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// TEMPORARY: only the home route is wired up so this can run standalone
// while the rest of the team's views/scaffolding are still in progress.
// Swap this back to the full route list once merging with Caleb's work.
const routes = [
  { path: '/', name: 'home', component: HomeView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router