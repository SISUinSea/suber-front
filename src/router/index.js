import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '../components/SignIn.vue';
import Ready from '../components/Ready.vue';
import Console from '../components/Console.vue';
import Search from '../components/Search.vue';
import Cart from '../components/Cart.vue';
import DashBoard from '../components/Dashboard.vue';
import Finish from '../components/Finish.vue';
// Vue.use(Router);

const routes = [
  { path: '/', component: SignIn },
  { path: '/console', component: Console },
  { path: '/ready', component: Ready },
  { path: '/search', component: Search },
  { path: '/cart', component: Cart },
  { path: '/dashboard', component: DashBoard },
  { path: '/finish', component: Finish },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

