export default {
  state: {
    loading: false,
    localLoading: false,
    loadingUser: false,
    error: null,
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setLocalLoading(state, payload) {
      state.localLoading = payload;
    },
    setLoadingUser(state, payload) {
      state.loadingUser = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    setLoading({ commit }, payload) {
      commit('setLoading', payload);
    },
    setLocalLoading({ commit }, payload) {
      commit('setLocalLoading', payload);
    },
    setLoadingUser({ commit }, payload) {
      commit('setLoadingUser', payload);
    },
    setError({ commit }, payload) {
      commit('setError', payload);
    },
    clearError({ commit }) {
      commit('clearError');
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    localLoading(state) {
      return state.localLoading;
    },
    loadingUser(state) {
      return state.loadingUser;
    },
    error(state) {
      return state.error;
    },
  },
};
