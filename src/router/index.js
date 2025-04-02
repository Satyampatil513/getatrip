import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../pages/LandingPage.vue';
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
    component: LandingPage,
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
  // Add other routes here
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;