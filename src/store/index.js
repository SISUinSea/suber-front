// // src/store/index.js
// import { createStore } from 'vuex';
// import { auth } from '@/scripts/firebaseApp.js';
// import router from '@/router';

// const store = createStore({
//     state: {
//         user: null
//       },
//       mutations: {
//         setUser(state, user) {
//           state.user = user;
//         }
//       },
//       actions: {
//         onAuthStateChanged({ commit }) {
//           auth.onAuthStateChanged(user => {
//             commit('setUser', user);
//             if (user) {
//               if (router.currentRoute.path === '/' || router.currentRoute.path === '/signin') {
//                 router.push('/ready');
//               }
//             } else {
//               router.push('/');
//             }
//           });
//         },
//         fetchUser({ commit }) {
//             const auth = getAuth();
//             onAuthStateChanged(auth, (user)=> {
//               commit('setUser', user || null);
//             });
//           },
//           signInWithGoogle({dispatch}) {
//             const auth = getAuth();
//             const provider = new GoogleAuthProvider();
//             signInWithPopup(auth, provider)
//             .then((result) => {
//               dispatch('fetchUser');
//             })
//             .catch((error) => {
//               console.error('Google login error:', error.code, error.message);
//             })
//           },
//       },
//       getters: {
//         isAuthenticated(state) {
//           return !!state.user;
//         }
//       }
// })

// export default store;