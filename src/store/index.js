// src/store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth';
import channels from './modules/channels';
import videos from './modules/videos';
import dashboard from './modules/dashboard';

const store = createStore({
  modules: {
    auth,
    channels,
    videos,
    dashboard,
  },
});

export default store;
