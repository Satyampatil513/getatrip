import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/landingPage.vue';
import HomePage from '../components/Dummy.vue'; // Assuming Dummy.vue is the HomePage

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
  },
  // Add other routes here if needed
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;