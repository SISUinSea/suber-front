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
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore 모듈 가져오기
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from 'firebase/functions';



const db = getFirestore();
const functions = getFunctions();

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
        async signInWithGoogleAndUpdateUserState(){
        const auth = getAuth(firebaseApp);
  
        // GoogleAuthProvider 객체 생성 및 Scope 설정
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/youtube');
        provider.addScope('https://www.googleapis.com/auth/youtube.force-ssl');
  
        //      const result = await signInWithPopup(auth, provider);
  
        // Google 로그인 팝업 열기
        signInWithPopup(auth, provider)
          .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const refreshToken = result.user.stsTokenManager.refreshToken;

            console.log("accessToken");
            console.log(accessToken);
            console.log("refreshToken" + refreshToken);
            // this.$store.commit('updateUserState', result.user);
            const user = result.user;
            await setDoc(doc(db, 'users', user.uid), {
              accessToken: accessToken,
              refreshToken: refreshToken,
              tokenExpiry: Date.now() + 3600 * 1000
            }, { merge: true});
            
            console.log('Logged in user:', user);
            // this.$router.push('/ready');
          })
          .catch((error) => {
            // 구글 로그인 실패 시 처리
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Google login error:', errorCode, errorMessage);
          });
        },
        async getYouTubeData() {
          try {
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (user) {
              const idToken = await user.getIdToken(true); // ID 토큰 갱신
              const getYouTubeDataCallable = httpsCallable(functions, 'getYouTubeData');
              const result = await getYouTubeDataCallable({ idToken });
              console.log(result.data);
              this.response = result.data;
            } else {
              console.log('User is not authenticated.');
            }
          } catch (error) {
            console.error('Firebase Functions 호출 중 오류 발생:', error);
          }
        },

        async getSubscribedChannelList() {
          try {
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (user) {
              const idToken = await user.getIdToken(true); // ID 토큰 갱신
              const getSubscribedChannelListCallable = httpsCallable(functions, 'getSubscribedChannels');
              const result = await getSubscribedChannelListCallable({ idToken });
              console.log(result.data);
              this.response = result.data;
            } else {
              console.log('User is not authenticated.');
            }
          } catch (error) {
            console.error('In function ::getSubscribedChannelList::, Firebase Functions 호출 중 오류 발생:', error);
          }
        },
        
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