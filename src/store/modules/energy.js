const state = {
  energy: 10
};

const mutations = {
  REDUCE_ENERGY(state) {
    if (state.energy > 0) {
      state.energy--;
    }
  },
  RESET_ENERGY_LEVEL(state) {
    state.energy = 10;
  }
};

const actions = {
  reduceEnergy({ state, commit }) {
    commit('REDUCE_ENERGY');
  },
  resetEnergyLevel({ commit }) {
    commit('RESET_ENERGY_LEVEL');
  }
};

const getters = {
  currentEnergy: (state) => state.energy
};

export default {
  state,
  mutations,
  actions,
  getters
};
