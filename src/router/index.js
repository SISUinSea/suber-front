import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '../components/SignIn.vue';
import Ready from '../components/Ready.vue';
import Console from '../components/Console.vue';

// Vue.use(Router);

const routes = [
  { path: '/', component: SignIn },
  { path: '/console', component: Console },
  { path: '/ready', component: Ready },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

