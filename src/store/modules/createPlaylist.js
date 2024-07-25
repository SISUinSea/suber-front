import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import firebaseApp from '@/scripts/firebaseApp';

const functions = getFunctions(firebaseApp);

const state = () => ({

});

const mutations = {

};

const actions = {
    async createPlaylist({commit}, {playlistTitle, videoIds}) {
        console.log("createPlaylist");
        console.log(playlistTitle, videoIds);

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
            const idToken = await user.getIdToken(true);
            const createYoutubePlaylistCallable = httpsCallable(functions, 'createYoutubePlaylist');
            const result = await createYoutubePlaylistCallable({ idToken:idToken, playlistTitle: playlistTitle, videoIds: videoIds});
            console.log('Playlist created:', result.data);
            } else {
            console.log('User is not authenticated.');
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    },
};

const getters = {

};

export default {
  state,
  mutations,
  actions,
  getters,
};
