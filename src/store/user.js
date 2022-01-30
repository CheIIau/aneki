import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { User } from '@/classes/index.js';

export default {
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setLocalUser(state, payload) {
      const jsonUser = JSON.stringify(payload);
      localStorage.setItem('user', jsonUser);
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    localUser() {
      return JSON.parse(localStorage.getItem('user'));
    },
    isUserLoggedIn(state) {
      return state.user !== null;
    },
  },
  actions: {
    async registerUser({ commit }, { email, password, nickname }) {
      commit('clearError');
      commit('setLoading', true);
      commit('setLoadingUser', true);

      try {
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            commit('setUser', new User(user.uid, nickname));
          })
          .then(() => {
            updateProfile(auth.currentUser, {
              displayName: nickname,
            });
            commit('setLoadingUser', false);
            commit('setLoading', false);
          });
      } catch (error) {
        commit('setLoading', false);
        commit('setLoadingUser', false);
        commit('setError', error.message);
        throw error;
      }
    },
    async loginUser({ commit }, { email, password }) {
      commit('setLoading', true);
      commit('setLoadingUser', true);
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          commit('setUser', new User(user.uid, user.displayName));
          commit('setLoading', false);
          commit('setLoadingUser', false);
        })
        .catch((error) => {
          commit('setLoading', false);
          commit('setLoadingUser', false);
          commit('setError', error.message);
          throw error;
        });
    },

    autoLoginUser({ commit }, payload) {
      const user = new User(payload.uid, payload.displayName);
      commit('setUser', user);
      commit('setLocalUser', user);
      commit('setLoadingUser', false);
    },

    async logoutUser({ commit }) {
      const auth = getAuth();
      await signOut(auth).catch((error) => {
        commit('setError', error.message);
        throw error;
      });
      localStorage.removeItem('user');
      commit('setUser', null);
    },
  },
};
