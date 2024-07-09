import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, setDoc, getFirestore, getDoc, collection, query, getDocs, orderBy, deleteDoc, serverTimestamp } from 'firebase/firestore';
import firebaseApp from '@/scripts/firebaseApp';

const functions = getFunctions(firebaseApp);
const db = getFirestore(firebaseApp);

const state = () => ({
  videos: [],
  videoNextPageToken: null,
  feedbackMessages: {},
  savedVideos: [],
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
  removeVideo(state, videoId) {
    state.videos = state.videos.filter(video => video.id !== videoId);
  },
  setFeedbackMessage(state, { videoId, message }) {
    state.feedbackMessages = {
      ...state.feedbackMessages,
      [videoId]: message,
    };
  },
  clearFeedbackMessage(state, videoId) {
    const { [videoId]: _, ...remainingMessages } = state.feedbackMessages;
    state.feedbackMessages = remainingMessages;
  },
  setSavedVideos(state, videos) {
    state.savedVideos = videos;
  },
  removeSavedVideo(state, videoId) {
    state.savedVideos = state.savedVideos.filter(video => video.id !== videoId);
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

        console.log('getChannelVideos result:', result);

        if (!result.data || !result.data.data || !result.data.data.items) {
          console.error('Invalid response structure:', result.data);
          throw new Error('Invalid response from getChannelVideos');
        }

        const items = result.data.data.items;

        const videos = items.map(video => ({
          id: video.id.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.default.url,
          thumbnailHigh: video.snippet.thumbnails.high.url,
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
  async saveVideoToDive({ commit }, video) {
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
        await setDoc(videoRef, {
          ...video,
          createdAt: serverTimestamp(), // 타임스탬프 필드 추가
        });

        console.log('Video saved to dive:', video);

        // Set feedback message
        commit('setFeedbackMessage', { videoId: video.id, message: '저장 완료' });

        // Remove the video from the list after saving
        commit('removeVideo', video.id);

        // Clear feedback message after a delay
        setTimeout(() => {
          commit('clearFeedbackMessage', video.id);
        }, 3000); // 3초 후에 피드백 메시지 제거
      } catch (error) {
        console.error('Error saving video to dive:', error);
        throw error;
      }
    }
  },
  async fetchSavedVideos({ commit }) {
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

        const videosCollection = collection(currentDiveRef, 'videos');
        const videosSnapshot = await getDocs(query(videosCollection, orderBy('createdAt')));

        const savedVideos = videosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        commit('setSavedVideos', savedVideos);
      } catch (error) {
        console.error('Error fetching saved videos:', error);
        throw error;
      }
    }
  },
  async deleteSavedVideo({ commit }, videoId) {
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

        const videoRef = doc(currentDiveRef, 'videos', videoId);
        await deleteDoc(videoRef);

        console.log('Video deleted from dive:', videoId);

        // Remove the video from the list after deleting
        commit('removeSavedVideo', videoId);
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
    return state.savedVideos;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
