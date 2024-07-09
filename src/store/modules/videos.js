import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, setDoc, getFirestore, getDoc, collection, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import firebaseApp from '@/scripts/firebaseApp';

const functions = getFunctions(firebaseApp);
const db = getFirestore(firebaseApp);

const state = () => ({
  videos: [],
  videoNextPageToken: null,
  feedbackMessages: {},
  savedVideos: [], // 추가
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
  setSavedVideos(state, videos) { // 추가
    state.savedVideos = videos;
  },
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

        const videos = items.map(video => ({
          id: video.id.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.default.url,
        }));

        if (pageToken) {
          commit('addVideos', videos);
        } else {
          commit('setVideos', videos);
        }

        commit('setVideoNextPageToken', result.data.data.nextPageToken);
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
        const userDoc = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDoc);

        if (!userDocSnapshot.exists()) {
          throw new Error('User document does not exist');
        }

        const currentDiveRef = userDocSnapshot.data().currentDiveRef;

        if (!currentDiveRef) {
          throw new Error('No current dive reference found');
        }

        const videoRef = doc(collection(currentDiveRef, 'videos'));
        await setDoc(videoRef, { ...video, timestamp: serverTimestamp() });

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
  async fetchSavedVideos({ commit }) { // 추가
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDoc);

        if (!userDocSnapshot.exists()) {
          throw new Error('User document does not exist');
        }

        const currentDiveRef = userDocSnapshot.data().currentDiveRef;

        if (!currentDiveRef) {
          throw new Error('No current dive reference found');
        }

        const videosQuery = query(collection(currentDiveRef, 'videos'), orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(videosQuery);
        const videos = querySnapshot.docs.map(doc => doc.data());

        commit('setSavedVideos', videos);
      } catch (error) {
        console.error('Error fetching saved videos:', error);
        throw error;
      }
    }
  },
  async deleteVideoFromDive({ commit }, videoId) { // 추가
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDoc);

        if (!userDocSnapshot.exists()) {
          throw new Error('User document does not exist');
        }

        const currentDiveRef = userDocSnapshot.data().currentDiveRef;

        if (!currentDiveRef) {
          throw new Error('No current dive reference found');
        }

        const videoRef = doc(collection(currentDiveRef, 'videos'), videoId);
        await deleteDoc(videoRef);

        const updatedVideos = state.savedVideos.filter(video => video.id !== videoId);
        commit('setSavedVideos', updatedVideos);

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
  getSavedVideos(state) { // 추가
    return state.savedVideos;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
