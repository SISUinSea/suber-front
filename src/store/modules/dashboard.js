// src/store/modules/dashboard.js
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import firebaseApp from '@/scripts/firebaseApp';

const db = getFirestore(firebaseApp);

const state = () => ({
  remainingDays: null,
  progress: null,
  frequentUsage: null,
  totalUsageTime: null,
});

const mutations = {
  setRemainingDays(state, remainingDays) {
    state.remainingDays = remainingDays;
  },
  setProgress(state, progress) {
    state.progress = progress;
  },
  setFrequentUsage(state, frequentUsage) {
    state.frequentUsage = frequentUsage;
  },
  setTotalUsageTime(state, totalUsageTime) {
    state.totalUsageTime = totalUsageTime;
  },
};

const actions = {
  async fetchDashboardData({ commit }) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const userDoc = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDoc);

        if (!userDocSnapshot.exists()) {
          throw new Error('User document does not exist');
        }

        const userData = userDocSnapshot.data();

        // 가정: Firestore 문서에 `remainingDays`, `progress`, `frequentUsage`, `totalUsageTime` 필드가 있음
        commit('setRemainingDays', userData.remainingDays);
        commit('setProgress', userData.progress);
        commit('setFrequentUsage', userData.frequentUsage);
        commit('setTotalUsageTime', userData.totalUsageTime);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    }
  },
};

const getters = {
  getRemainingDays(state) {
    return state.remainingDays;
  },
  getProgress(state) {
    return state.progress;
  },
  getFrequentUsage(state) {
    return state.frequentUsage;
  },
  getTotalUsageTime(state) {
    return state.totalUsageTime;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
