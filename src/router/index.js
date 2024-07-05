// src/router/index.js
import Router from 'vue-router';
import SignIn from '@/components/SignIn.vue';
import Ready from '@/components/Ready.vue';

// Vue.use(Router);

const routes = [
  { path: '/', component: SignIn },
  { path: '/ready', component: Ready },
];

const router = new Router({
  mode: 'history',
  routes
});

export default router;
