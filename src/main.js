import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createWebHistory, createRouter } from 'vue-router';
import SignIn from './components/SignIn.vue';
import Ready from './components/Ready.vue';
// import store from './store/index.js';
import { createStore } from 'vuex';
import firebaseApp from './scripts/firebaseApp.js';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';


const routes = [
  { path: '/', component: SignIn },
  { path: '/ready', component: Ready },
];

const store = createStore( {
    state() {
        return {
            counter : 10,
            user : null,
        }
    },
    mutations : {
        setUser(state, user) {
            state.user = user;
        },

    },
    actions : {
        initAuthState({ commit }) {
            const auth = getAuth(firebaseApp);
            onAuthStateChanged(auth, (user) => {
              if (user) {
                commit('setUser', user);
                router.push('/ready');
              } else {
                commit('setUser', null);
                router.push('/');
              }
            });
        },
        signInWithGoogleAndUpdateUserState(){
        const auth = getAuth(firebaseApp);
  
        // GoogleAuthProvider 객체 생성 및 Scope 설정
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/youtube');
        provider.addScope('https://www.googleapis.com/auth/youtube.force-ssl');
  
        //      const result = await signInWithPopup(auth, provider);
  
        // Google 로그인 팝업 열기
        signInWithPopup(auth, provider)
          .then((result) => {
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // this.$store.commit('updateUserState', result.user);
            const user = result.user;
            //          const googleAccessToken = await user.getIdToken();
  
            console.log('Logged in user:', user);
            // this.$router.push('/ready');
          })
          .catch((error) => {
            // 구글 로그인 실패 시 처리
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Google login error:', errorCode, errorMessage);
          });
        }
    },
    getters : {
        getUserState() {
            return user;
        }, 
        isUserLoggedIn() {
            return !!user;
        }

    }
});



const router = createRouter({
  history: createWebHistory(),
  routes,
});
console.log(firebaseApp);
createApp(App).use(router).use(store).mount('#app');

store.dispatch('initAuthState');