import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createWebHistory, createRouter } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import SignIn from './components/SignIn.vue';
import Ready from './components/Ready.vue';
import firebaseApp from './scripts/firebaseApp.js';

const routes = [
  { path: '/', component: SignIn },
  { path: '/ready', component: Ready },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
console.log(firebaseApp);
createApp(App).use(router).mount('#app');

//$ npm install -g firebase-tools
