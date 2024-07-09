import { createStore } from 'vuex';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import firebaseApp from '../scripts/firebaseApp.js';
import router from '@/router';

const db = getFirestore();
const functions = getFunctions();

const store = createStore({
    state() {
        return {
            user: null,
            response: null,
            channels : [],
            nextPageToken: null,
            videos:[],
        };
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setResponse(state, response) {
            state.response = response;
        },
        setChannels(state, channels) {
            state.channels = channels;
        },
        addChannels(state, channels) {
            state.channels = [...state.channels, ...channels];
        },
        setNextPageToken(state, token) {
            state.nextPageToken = token;
        },
        setVideos(state, videos) {
            state.videos = videos;
        },
        addVideos(state, videos) {
            state.videos = [...state.videos, ...videos];
        },
    },
    actions: {
        initAuthState({ commit }) {
            const auth = getAuth(firebaseApp);
            onAuthStateChanged(auth, (user) => {
              if (user) {
                commit('setUser', user);
                router.push('/ready');
                // router.push('/console');
              } else {
                commit('setUser', null);
                router.push('/');
              }
            });
        },
        async signInWithGoogleAndUpdateUserState({ commit }) {
            const auth = getAuth(firebaseApp);
            const provider = new GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/youtube');
            provider.addScope('https://www.googleapis.com/auth/youtube.force-ssl');
        
            try {
                const result = await signInWithPopup(auth, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const refreshToken = result.user.stsTokenManager.refreshToken;
                const user = result.user;
                await setDoc(doc(db, 'users', user.uid), {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    tokenExpiry: Date.now() + 3600 * 1000,
                }, { merge: true });
                commit('setUser', user);
            } catch (error) {
                console.error('Google login error:', error);
            }
        },
        async getYouTubeData({ commit }) {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const idToken = await user.getIdToken(true);
                    const getYouTubeDataCallable = httpsCallable(functions, 'getYouTubeData');
                    const result = await getYouTubeDataCallable({ idToken });
                    console.log(result);
                    commit('setResponse', result.data);
                } else {
                    console.log('User is not authenticated.');
                }
            } catch (error) {
                console.error('Firebase Functions 호출 중 오류 발생:', error);
            }
        },
        async getSubscribedChannelList({ commit, state }, pageToken = '') {
            const functions = getFunctions();
            const auth = getAuth();
            const user = auth.currentUser;
          
            if (user) {
              try {
                const idToken = await user.getIdToken(true);
                console.log('Obtained ID token:', idToken); // 로그 추가
          
                const getSubscribedChannels = httpsCallable(functions, 'getSubscribedChannels');
                const result = await getSubscribedChannels({ idToken:idToken, pageToken:pageToken });
          
                // 전체 응답 데이터 구조를 로그로 출력하여 확인
                console.log('getSubscribedChannels result:', result);
          
                // 응답 데이터의 정확성을 체크
                if (!result.data || !result.data.data || !result.data.data.items) {
                  console.error('Invalid response structure:', result.data);
                  throw new Error('Invalid response from getSubscribedChannels');
                }
          
                const items = result.data.data.items; // 실제 항목 리스트
          
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
          
                commit('setNextPageToken', result.data.data.nextPageToken);
          
                return state.channels;
              } catch (error) {
                console.error('Error fetching subscribed channels:', error);
                throw error;
              }
            }
          },
          async getChannelVideos({ commit, state }, { channelId, pageToken = '' }) {
            const functions = getFunctions();
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    const idToken = await user.getIdToken(true);
                    console.log('Obtained ID token:', idToken); // 로그 추가

                    const getChannelVideos = httpsCallable(functions, 'getChannelVideos');
                    const result = await getChannelVideos({ idToken, channelId, pageToken });

                    // 전체 응답 데이터 구조를 로그로 출력하여 확인
                    console.log('getChannelVideos result:', result);

                    // 응답 데이터의 정확성을 체크
                    if (!result.data || !result.data.data || !result.data.data.items) {
                        console.error('Invalid response structure:', result.data);
                        throw new Error('Invalid response from getChannelVideos');
                    }

                    const items = result.data.data.items; // 실제 항목 리스트

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

                    commit('setNextPageToken', result.data.data.nextPageToken);

                    return state.videos;
                } catch (error) {
                    console.error('Error fetching channel videos:', error);
                    throw error;
                }
            }
        },
          
      
    },
    getters: {
        getUserState(state) {
            return state.user;
        },
        isUserLoggedIn(state) {
            return !!state.user;
        },
        getResponse(state) {
            return state.response;
        },
        getChannels(state) {
            return state.channels;
        },
        getNextPageToken(state) {
            return state.nextPageToken;
        },
        getNextPageToken(state) {
            return state.nextPageToken;
        },
        getVideos(state) {
            return state.videos;
        },
    }
});

export default store;
