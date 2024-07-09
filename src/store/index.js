// src/store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth';
import channels from './modules/channels';
import videos from './modules/videos';

const store = createStore({
  modules: {
    auth,
    channels,
    videos,
  },
});

export default store;
