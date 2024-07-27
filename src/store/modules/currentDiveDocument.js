import { getAuth } from 'firebase/auth';
import { doc, getFirestore, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import firebaseApp from '@/scripts/firebaseApp';

const db = getFirestore(firebaseApp);

const state = () => ({
  currentDive: null,
});

const mutations = {
  setCurrentDive(state, dive) {
    state.currentDive = dive;
  },

};

const actions = {
  async fetchCurrentDiveDocument({ commit }) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        const userDocData = userDocSnapshot.data();

        if (!userDocData || !userDocData.currentDiveRef) {
          commit('setCurrentDive', null);
          return;
        }

        const currentDiveRef = userDocData.currentDiveRef;
        const diveDocSnapshot = await getDoc(currentDiveRef);

        if (diveDocSnapshot.exists()) {
          const currentDiveData = diveDocSnapshot.data();
          commit('setCurrentDive', { id: diveDocSnapshot.id, ...currentDiveData });
          console.log(currentDiveData);
          // console.log(state.currentDive.watchTime);
          // console.log(state.currentDive.endTime);
        } else {
          console.log('No current dive found.');
          commit('setCurrentDive', null);
        }
      } catch (error) {
        console.error('Error fetching current dive:', error);
      }
    }
  },
};

const getters = {
  getCurrentDive(state) {
    return state.currentDive;
  },
  getCurrentDiveWatchTime: (state) => {
    return state.currentDive ? state.currentDive.watchTime : undefined;
  }
};

export default {
  state,
  mutations,
  actions,
  getters,
};
