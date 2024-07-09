// src/store/modules/auth.js
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import firebaseApp from '@/scripts/firebaseApp';
import router from '@/router';

const db = getFirestore();

const state = () => ({
  user: null,
});

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
};

const actions = {
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
        accessToken,
        refreshToken,
        tokenExpiry: Date.now() + 3600 * 1000,
      }, { merge: true });
      commit('setUser', user);
    } catch (error) {
      console.error('Google login error:', error);
    }
  },
};

const getters = {
  getUserState(state) {
    return state.user;
  },
  isUserLoggedIn(state) {
    return !!state.user;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
