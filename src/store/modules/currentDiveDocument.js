import { getAuth } from 'firebase/auth';
import { doc, getFirestore, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
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
          commit('setCurrentDive', { id: diveDocSnapshot.id, currentDiveRef, ...currentDiveData });
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

  async setCurrentDiveDocumentAsEnd({ state, rootGetters }) {
    const selectedVideos = rootGetters['getSelectedVideos'];

    console.log(selectedVideos);

    if (state.currentDive && state.currentDive.currentDiveRef && selectedVideos.length > 0) {
      const videosCollection = collection(state.currentDive.currentDiveRef, 'videos');
      for (const video of selectedVideos) {
        const videoDocRef = doc(videosCollection, video.id);
        await setDoc(videoDocRef, video);
      }

      // Update dive status if needed
      await updateDoc(state.currentDive.currentDiveRef, {
        status: 'completed',
        endDiveAt: new Date()
      });
    } else {
      console.log('No dive reference or selected videos found');
    }
  },
};

const getters = {
  getCurrentDive(state) {
    return state.currentDive;
  },
  getCurrentDiveWatchTime: (state) => {
    return state.currentDive ? state.currentDive.watchTime : undefined;
  },
  getSelectedVideosFromVideos(state, getters, rootState) {
    return rootState.videos.getSelectedVideos;
  }
};

export default {
  state,
  mutations,
  actions,
  getters,
};
