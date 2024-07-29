import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, setDoc, addDoc, getFirestore, getDoc, collection, getDocs, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import firebaseApp from '@/scripts/firebaseApp';
import { Duration } from 'luxon';

const functions = getFunctions(firebaseApp);
const db = getFirestore(firebaseApp);

const state = () => ({
  videos: [],
  videoNextPageToken: null,
  feedbackMessages: {},
  cartVideos: [],
  selectedVideos: [],
});

const mutations = {
  setVideos(state, videos) {
    state.videos = videos;
  },
  addVideos(state, videos) {
    state.videos = [...state.videos, ...videos];
  },
  setVideoNextPageToken(state, token) {
    state.videoNextPageToken = token;
  },
  setFeedbackMessage(state, { videoId, message }) {
    state.feedbackMessages = { ...state.feedbackMessages, [videoId]: message };
  },
  removeVideo(state, videoId) {
    state.videos = state.videos.filter(video => video.id !== videoId);
  },
  setCartVideos(state, videos) {
    state.cartVideos = videos;
  },
  toggleVideoFromSelectedVideos(state, video) {
    if (video.selected) {
      if (!state.selectedVideos.some(v => v.id === video.id)) {
        state.selectedVideos.push(video);
      }
    } else {
      state.selectedVideos = state.selectedVideos.filter(v => v.id !== video.id);
    }
    console.log('Selected videos:', state.selectedVideos);
    state.selectedVideos.forEach(video => {
      console.log(video.id);
    });
  },
  clearSelectedVideos(state) {
    state.selectedVideos = [];
  } 
};

const actions = {
  async getChannelVideos({ commit, state }, { channelId, pageToken = '' }) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        const getChannelVideos = httpsCallable(functions, 'getChannelVideos');
        const result = await getChannelVideos({ idToken, channelId, pageToken });

        if (!result.data || !result.data.data || !result.data.data.items) {
          throw new Error('Invalid response from getChannelVideos');
        }

        const items = result.data.data.items;

        console.log(items);

        const videos = items.map(video => {
          const { duration } = video.contentDetails;
          const durationObj = Duration.fromISO(duration);
          const hours = durationObj.hours;
          const minutes = durationObj.minutes;
          const seconds = durationObj.seconds;

          return {
            id: video.id,
            // id: video.id.videoId,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.default.url,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            selected: false,
          };
        });

        if (pageToken) {
          commit('addVideos', videos);
        } else {
          commit('setVideos', videos);
        }
        
        commit('setVideoNextPageToken', result.data.nextPageToken);
        
        console.log("videoNEXTPageToken is", result.data.nextPageToken);
        console.log(result.data);
        return state.videos;
      } catch (error) {
        console.error('Error fetching channel videos:', error);
        throw error;
      }
    }
  },
  async saveVideoToDive({ commit, state }, video) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);

        const videosCollectionRef = collection(userDocRef, 'videos');
        const videoDocRef = doc(videosCollectionRef, video.id);

        await setDoc(videoDocRef, { ...video, timestamp: serverTimestamp() });

        commit('setFeedbackMessage', { videoId: video.id, message: 'Video saved!' });
        commit('removeVideo', video.id);

        setTimeout(() => {
          commit('setFeedbackMessage', { videoId: video.id, message: '' });
        }, 3000);

        console.log('Video saved to dive:', video);
      } catch (error) {
        console.error('Error saving video to dive:', error);
        throw error;
      }
    }
  },
  async fetchCartVideos({ commit }) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        // const userDocSnapshot = await getDoc(userDoc);

        // if (!userDocSnapshot.exists()) {
        //   throw new Error('User document does not exist');
        // }

        // const currentDiveRef = userDocSnapshot.data().currentDiveRef;

        // if (!currentDiveRef) {
        //   throw new Error('No current dive reference found');
        // }

        const videosQuery = query(collection(userDocRef, 'videos'), orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(videosQuery);
        const videos = querySnapshot.docs.map(doc => doc.data());

        commit('setCartVideos', videos);
      } catch (error) {
        console.error('Error fetching saved videos:', error);
        throw error;
      }
    }
  },
  async deleteVideoFromDive({ commit, state }, videoId) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        // const userDocSnapshot = await getDoc(userDoc);

        // if (!userDocSnapshot.exists()) {
        //   throw new Error('User document does not exist');
        // }

        // const currentDiveRef = userDocSnapshot.data().currentDiveRef;

        // if (!currentDiveRef) {
        //   throw new Error('No current dive reference found');
        // }

        const videoRef = doc(collection(userDocRef, 'videos'), videoId);

        await deleteDoc(videoRef);

        const updatedVideos = state.cartVideos.filter(video => video.id !== videoId);
        commit('setCartVideos', updatedVideos);

        console.log('Video deleted from dive:', videoId);
      } catch (error) {
        console.error('Error deleting video from dive:', error);
        throw error;
      }
    }
  },
};

const getters = {
  getVideos(state) {
    return state.videos;
  },
  getVideoNextPageToken(state) {
    return state.videoNextPageToken;
  },
  getFeedbackMessages(state) {
    return state.feedbackMessages;
  },
  getSavedVideos(state) {
    return state.cartVideos;
  },
  getSelectedVideos(state) {
    console.log("selected Videos", state.selectedVideos);
    return state.selectedVideos;
  }
};

export default {
  state,
  mutations,
  actions,
  getters,
};
