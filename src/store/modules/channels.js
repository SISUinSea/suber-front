// src/store/modules/channels.js
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import firebaseApp from '@/scripts/firebaseApp';

const functions = getFunctions(firebaseApp);

const state = () => ({
  channels: [],
  channelNextPageToken: null,
});

const mutations = {
  setChannels(state, channels) {
    state.channels = channels;
  },
  addChannels(state, channels) {
    state.channels = [...state.channels, ...channels];
  },
  setChannelNextPageToken(state, token) {
    state.channelNextPageToken = token;
  },
};

const actions = {
  async getSubscribedChannelList({ commit, state }, pageToken = '') {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const idToken = await user.getIdToken(true);
        console.log('Obtained ID token:', idToken);

        const getSubscribedChannels = httpsCallable(functions, 'getSubscribedChannels');
        const result = await getSubscribedChannels({ idToken, pageToken });

        console.log('getSubscribedChannels result:', result);

        if (!result.data || !result.data.data || !result.data.data.items) {
          console.error('Invalid response structure:', result.data);
          throw new Error('Invalid response from getSubscribedChannels');
        }

        const items = result.data.data.items;

        const channels = items.map(channel => ({
          id: channel.snippet.resourceId.channelId,
          thumbnail: channel.snippet.thumbnails.default.url,
          title: channel.snippet.title,
        }));

        if (pageToken) {
          commit('addChannels', channels);
        } else {
          commit('setChannels', channels);
        }

        commit('setChannelNextPageToken', result.data.data.nextPageToken);

        return state.channels;
      } catch (error) {
        console.error('Error fetching subscribed channels:', error);
        throw error;
      }
    }
  },
};

const getters = {
  getChannels(state) {
    return state.channels;
  },
  getChannelNextPageToken(state) {
    return state.channelNextPageToken;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
