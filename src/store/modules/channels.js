import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import firebaseApp from '@/scripts/firebaseApp';

const functions = getFunctions(firebaseApp);

const state = () => ({
  currentChannelId: '',
  channels: [],
  channelNextPageToken: null,
});

const mutations = {
  setCurrentChannelId(state, channelId) {
    state.currentChannelId = channelId;
  },
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
        const getSubscribedChannels = httpsCallable(functions, 'getSubscribedChannels');
        const result = await getSubscribedChannels({ idToken, pageToken });

        if (!result.data || !result.data.data || !result.data.data.items) {
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
  getCurrentChannelId(state) {
    return state.currentChannelId;
  }
};

export default {
  state,
  mutations,
  actions,
  getters,
};
