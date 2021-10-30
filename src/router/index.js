import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Favorites from '@/views/Favorites.vue';
import New from '@/views/New.vue';
import Registration from '@/views/Registration.vue';
import AuthGuard from './auth-guard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/favs',
    name: 'Favorites',
    component: Favorites,
    beforeEnter: AuthGuard,
  },
  {
    path: '/new',
    name: 'New',
    component: New,
    beforeEnter: AuthGuard,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
