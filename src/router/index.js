import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Favorites from '@/views/Favorites.vue';
import Best from '@/views/Best.vue';
import New from '@/views/New.vue';
import Registration from '@/views/Registration.vue';
import Login from '@/views/Login.vue';
import E404 from '@/views/E404.vue';
import Search from '@/views/Search.vue';
import AuthGuard from './auth-guard';
import Memes from '@/views/Memes';

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
    path: '/best',
    name: 'Best',
    component: Best,
  },
  {
    path: '/memes',
    name: 'Memes',
    component: Memes,
  },
  {
    path: '/new',
    name: 'New',
    component: New,
    beforeEnter: AuthGuard,
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/:pathMatch(.*)*',
    component: E404,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
