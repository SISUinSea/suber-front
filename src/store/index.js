import { createStore } from 'vuex';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import firebaseApp from '../scripts/firebaseApp.js';
import router from '@/router';

const db = getFirestore();
const functions = getFunctions();

const store = createStore({
    state() {
        return {
            user: null,
            response: null,
        };
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setResponse(state, response) {
            state.response = response;
        }
    },
    actions: {
        initAuthState({ commit }) {
            const auth = getAuth(firebaseApp);
            onAuthStateChanged(auth, (user) => {
              if (user) {
                commit('setUser', user);
                router.push('/ready');
                // router.push('/console');
              } else {
                commit('setUser', null);
                router.push('/');
              }
            });
        },
        async signInWithGoogleAndUpdateUserState({ commit }) {
            const auth = getAuth(firebaseApp);
            const provider = new GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/youtube');
            provider.addScope('https://www.googleapis.com/auth/youtube.force-ssl');
        
            try {
                const result = await signInWithPopup(auth, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const refreshToken = result.user.stsTokenManager.refreshToken;
                const user = result.user;
                await setDoc(doc(db, 'users', user.uid), {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    tokenExpiry: Date.now() + 3600 * 1000,
                }, { merge: true });
                commit('setUser', user);
            } catch (error) {
                console.error('Google login error:', error);
            }
        },
        async getYouTubeData({ commit }) {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const idToken = await user.getIdToken(true);
                    const getYouTubeDataCallable = httpsCallable(functions, 'getYouTubeData');
                    const result = await getYouTubeDataCallable({ idToken });
                    console.log(result);
                    commit('setResponse', result.data);
                } else {
                    console.log('User is not authenticated.');
                }
            } catch (error) {
                console.error('Firebase Functions 호출 중 오류 발생:', error);
            }
        },
        async getSubscribedChannelList({ commit }) {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const idToken = await user.getIdToken(true);
                    const getSubscribedChannelListCallable = httpsCallable(functions, 'getSubscribedChannels');
                    const result = await getSubscribedChannelListCallable({ idToken });
                    // commit('setResponse', result.data);
                    console.log(result);
                } else {
                    console.log('User is not authenticated.');
                }
            } catch (error) {
                console.error('Firebase Functions 호출 중 오류 발생:', error);
            }
        }
    },
    getters: {
        getUserState(state) {
            return state.user;
        },
        isUserLoggedIn(state) {
            return !!state.user;
        },
        getResponse(state) {
            return state.response;
        }
    }
});

export default store;
