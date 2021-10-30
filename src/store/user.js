import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

class User {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
  }
}

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
    // userId() {
    //   return JSON.parse(localStorage.getItem('user')).uid;
    // },
    isUserLoggedIn(state) {
      return state.user !== null;
    },
    getUserName(state) {
      return state.user?.nickname;
    },
  },
  actions: {
    setUser(store, userName) {
      localStorage.setItem('userName', userName);
    },
    async registerUser({ commit }, { email, password, nickname }) {
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
          });
      } catch (error) {
        console.log(error.message, 'хуй пизда');
        throw error;
      }
    },
    async loginUser({ commit }, { email, password }) {
      commit('setLoading', true);
      commit('setLoadingUser', true);
      try {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
          const user = userCredential.user;
          commit('setUser', new User(user.uid, user.displayName));
          commit('setLoading', false);
          commit('setLoadingUser', false);
        });
      } catch (error) {
        commit('setLoading', false);
        commit('setLoadingUser', false);
        commit('setError', error.message);
        throw error;
      }
    },

    autoLoginUser({ commit }, payload) {
      commit('setUser', new User(payload.uid, payload.displayName));
      commit('setLocalUser', new User(payload.uid, payload.displayName));
      commit('setLoadingUser', false);
    },

    logoutUser({ commit }) {
      const auth = getAuth();
      signOut(auth).catch((error) => {
        console.log(error.message);
        throw error;
      });
      localStorage.removeItem('user');
      commit('setUser', null);
    },
  },
};
