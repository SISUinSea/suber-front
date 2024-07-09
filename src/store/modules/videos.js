// src/store/modules/videos.js
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import firebaseApp from '@/scripts/firebaseApp';

const functions = getFunctions(firebaseApp);

const state = () => ({
  videos: [],
  videoNextPageToken: null,
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
};

const getters = {
  getVideos(state) {
    return state.videos;
  },
  getVideoNextPageToken(state) {
    return state.videoNextPageToken;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
