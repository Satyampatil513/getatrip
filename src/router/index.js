import { createRouter, createWebHistory } from 'vue-router';
import FormPage from '../pages/FormPage.vue';
import TripsListPage from '../pages/TripsListPage.vue';
import IternaryPage from '../pages/IternaryPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';

const routes = [
  {
    path: '/iternary',
    name: 'IternaryPage',
    component: IternaryPage,
  },
  {
    path: '/',
    name: 'LandingPage',
    component: () => import('../pages/landingPage.vue'),
  },
  {
    path: '/form',
    name: 'FormPage',
    component: FormPage,
  },
  {
    path: '/trips',
    name: 'TripsListPage',
    component: TripsListPage,
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
  },
  {
    path: '/google-callback',
    name: 'GoogleCallback',
    component: () => import('../pages/GoogleCallback.vue'),
  },
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;