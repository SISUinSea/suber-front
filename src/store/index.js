// src/store/index.js
import { createStore } from 'vuex';
import auth from './modules/auth';
import channels from './modules/channels';
import videos from './modules/videos';
import dashboard from './modules/dashboard';
import createPlaylist from './modules/createPlaylist';
import currentDiveDocument from './modules/currentDiveDocument';
import energy from './modules/energy';


const store = createStore({
  modules: {
    auth,
    channels,
    videos,
    dashboard,
    createPlaylist,
    currentDiveDocument,
    energy,
  },
});

export default store;
