import { createApp } from 'vue';
import router from './router';
import store from './store';
import './style.css';
import App from './App.vue';
import { createStore } from 'vuex';
import firebaseApp from './scripts/firebaseApp.js';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore 모듈 가져오기
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from 'firebase/functions';



const db = getFirestore();
const functions = getFunctions();






// console.log(firebaseApp);
createApp(App).use(router).use(store).use(ElementPlus).mount('#app');

store.dispatch('initAuthState');