import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from '@/scripts/firebaseApp';
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
  async initAuthState({ commit, dispatch, state }) {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("user uid is : ", user.uid);
        commit('setUser', user);
        console.log("saved user uid: ", state.user.uid);
        
        // Firestore에서 user의 currentDiveDocRef 확인
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef, { source: "server" });

        const userDocData = userDocSnapshot.data();




        console.log("accessToken" in userDocData);

        if (userDocSnapshot.exists() && "currentDiveRef" in userDocData) {
          router.push('/cart');
        } else {
          router.push('/ready');
        }

        if (!("consentGiven" in userDocData)) {
          console.log(userDocData);
          router.push('/consent');
        }
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
    console.log("log in ....");

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const refreshToken = result.user.stsTokenManager.refreshToken;
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnapshot = await getDoc(userDocRef, { source: 'server' });


      console.log(docSnapshot.data());

      console.log("is documentSnapshot exist?  ", docSnapshot.exists());




      if (!docSnapshot.exists()) {
        console.log("setDoc");
        await setDoc(userDocRef, {
          accessToken,
          refreshToken,
          tokenExpiry: Date.now() + 3600 * 1000,
        }, { merge: true });
      } else {
        console.log("updateDoc");
        await updateDoc(userDocRef, {
          accessToken,
          refreshToken,
          tokenExpiry: Date.now() + 3600 * 1000,
        });
      }

      console.log("초기 문서 정보", docSnapshot.data());
      
      commit('setUser', user);
    } catch (error) {
      console.error('Google login error:', error);
    }
  },
  async logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      router.push('/');
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }
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
