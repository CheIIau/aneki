import Vue from 'vue';
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  update,
  child,
  get,
  query,
  orderByChild,
  limitToFirst,
  startAfter,
  equalTo,
} from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Anek } from '@/classes/index.js';
import { ANEKS_LIMIT, ANEKS_RATED_LIMIT } from '../constants';

export default {
  state: {
    aneks: [],
    bookmarkedAneks: [],
    aneksCount: null,
    searchedAneks: [],
  },
  getters: {
    getAneks(state) {
      return state.aneks;
    },
    getSearchedAneks(state) {
      return state.searchedAneks;
    },
    getBookmarkedAneks(state) {
      return state.bookmarkedAneks;
    },
    getAneksCount(state) {
      return state.aneksCount;
    },
  },
  mutations: {
    loadAneks(state, payload) {
      //better use the word 'set'
      if (state.aneks.length !== 0) {
        state.aneks = [...state.aneks, ...payload];
      } else {
        state.aneks = payload;
      }
    },
    loadSearchedAneks(state, payload) {
      state.searchedAneks = payload;
    },
    clearAneks(state) {
      state.aneks = [];
    },
    clearSearchedAneks(state) {
      state.searchedAneks = [];
    },
    loadAneksCount(state, payload) {
      state.aneksCount = payload;
    },
    loadBookmarkedAneks(state, id) {
      if (!state.bookmarkedAneks.includes(id)) {
        state.bookmarkedAneks.push(id);
      } else {
        state.bookmarkedAneks = state.bookmarkedAneks.filter((anekId) => anekId !== id);
      }
    },
  },
  actions: {
    async loadBookmarkedAneks({ commit, getters }) {
      commit('setLoading', true);
      const auth = getAuth();
      let userId = null;
      try {
        await new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            if (user === null) {
              return;
            }
            userId = user.uid;
            resolve();
          });
        });
        const db = getDatabase();
        const aneksRef = ref(db, 'bookmarkAneks/' + userId);
        await get(aneksRef).then((snapshot) => {
          const bookmarkedAneks = snapshot.val();
          if (bookmarkedAneks) {
            Object.keys(bookmarkedAneks).forEach((key) => {
              const anek = bookmarkedAneks[key];
              if (!getters.getBookmarkedAneks.includes(anek)) {
                commit('loadBookmarkedAneks', anek);
              }
            });
          }
        });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },
    async changeAnekBookmark({ commit, getters }, id) {
      commit('setLocalLoading', true);
      let anekRef = null;
      let userId = null;
      const auth = getAuth();
      try {
        await new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            if (user === null) {
              return;
            }
            userId = user.uid;
          });
          resolve();
        });

        if (userId === null) {
          commit('setLocalLoading', false);
          commit('setError', 'Чтобы добавить анек в избранное, необходимо зарегистрироваться');
          return;
        }
        
        const db = getDatabase();
        anekRef = ref(db, 'bookmarkAneks/' + userId);
        if (!getters.getBookmarkedAneks.includes(id)) {
          await update(anekRef, { [id]: id });
          commit('loadBookmarkedAneks', id);
          commit('setLocalLoading', false);
        } else {
          await update(anekRef, { [id]: null });
          commit('loadBookmarkedAneks', id);
          commit('setLocalLoading', false);
        }
      } catch (error) {
        commit('setError', error.message);
        commit('setLocalLoading', false);
        throw error;
      }
    },

    async addAnek({ commit, dispatch, getters }, { title, body }) {
      commit('clearError');
      commit('setLoading', true);

      let userName = '';
      let userId = null;
      const db = getDatabase();
      const anekListRef = ref(db, 'aneks');
      const aneksCountRef = ref(db, `aneksCount`);
      const auth = getAuth();
      await dispatch('fetchAneksCount');
      let aneksCount = getters.getAneksCount;
      onAuthStateChanged(auth, (user) => {
        userName = user.displayName;
        userId = user.uid;
      });

      try {
        const newAnekRef = await push(anekListRef);
        const newAnek = new Anek(title, body, userName, Date.now(), userId, 0, 0 - Date.now());
        await set(newAnekRef, newAnek);
        aneksCount++;
        await update(aneksCountRef, { aneksCount });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
      }
    },

    async fetchSearchedAneks({ commit }, searchQuery) {
      commit('setLoading', true);
      commit('clearError');
      commit('clearSearchedAneks');

      const resultAneks = [];
      searchQuery = searchQuery.toString();
      try {
        const db = getDatabase();
        let aneksRef = ref(db, 'aneks');
        aneksRef = query(aneksRef, orderByChild('author'), equalTo(searchQuery));
        await new Promise((resolve) => {
          onValue(aneksRef, (snapshot) => {
            let i = 0;
            snapshot.forEach((child) => {
              const anek = child.val();
              const newAnek = new Anek(
                anek.title,
                anek.body,
                anek.author,
                anek.time,
                child.key,
                anek.rating,
                anek.reverseTime,
              );
              Vue.set(resultAneks, i, newAnek);
              ++i;
            });
            resolve();
          });
        });
        commit('loadSearchedAneks', resultAneks);
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
      }
    },

    async fetchAneks({ commit }, { reverse = false, sorted = null, lastAnekVal = null }) {
      commit('clearError');
      if (!lastAnekVal) commit('setLoading', true);
      const limit = sorted == 'rating' ? ANEKS_RATED_LIMIT : ANEKS_LIMIT;
      const resultAneks = [];
      try {
        const db = getDatabase();
        let aneksRef = ref(db, 'aneks');
        if (lastAnekVal) {
          aneksRef = query(aneksRef, orderByChild(`${sorted}`), startAfter(lastAnekVal), limitToFirst(limit));
        } else {
          aneksRef = query(aneksRef, orderByChild(`${sorted}`), limitToFirst(limit));
        }
        await new Promise((resolve) => {
          onValue(aneksRef, (snapshot) => {
            let i = 0;
            snapshot.forEach((child) => {
              const anek = child.val();
              const newAnek = new Anek(
                anek.title,
                anek.body,
                anek.author,
                anek.time,
                child.key,
                anek.rating,
                anek.reverseTime,
              );
              Vue.set(resultAneks, i, newAnek);
              ++i;
            });
            resolve();
          });
        });
        if (reverse) resultAneks.reverse();
        commit('loadAneks', resultAneks);
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    fetchOldAneksFromDB({ dispatch }, { lastAnekVal = null } = {}) {
      const sorted = 'time';
      dispatch('fetchAneks', { sorted, lastAnekVal });
    },

    fetchNewAneksFromDB({ dispatch }, { lastAnekVal = null } = {}) {
      const sorted = 'reverseTime';
      dispatch('fetchAneks', { sorted, lastAnekVal });
    },

    fetchFavouriteAneksFromDB({ dispatch, commit }) {
      const sorted = 'rating';
      commit('clearAneks');
      dispatch('fetchAneks', { reverse: true, sorted }); //rating
    },

    async fetchAneksCount({ commit }) {
      try {
        const db = getDatabase();
        const aneksCountRef = ref(db, `aneksCount`);
        const aneksCount = child(aneksCountRef, `aneksCount`);
        await get(aneksCount).then((snapshot) => {
          commit('loadAneksCount', snapshot.val());
        });
      } catch (error) {
        commit('setError', error.message);
      }
    },

    async changeVote({ commit }, { id, vote }) {
      let rate = 0;
      vote == 'up' ? rate++ : rate--;

      try {
        const db = getDatabase();
        const anekRef = ref(db, 'aneks/');
        const anek = child(anekRef, `${id}`);
        let userId = null;
        const auth = getAuth();
        await new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            userId = user.uid;
          });
          resolve();
        });
        await get(anek).then(async (snapshot) => {
          if (snapshot.exists()) {
            const ratedUsers = child(anek, `/ratedUsers`);
            let alreadyVoted = false;
            await get(ratedUsers).then(async (s) => {
              const ratedUsersObj = s.val();
              Object.keys(ratedUsersObj).forEach((key) => {
                if (ratedUsersObj[key] == userId) {
                  commit('setError', 'Вы уже голосовали за этот анек');
                  alreadyVoted = true;
                }
              });
              if (!alreadyVoted) {
                const newRating = snapshot.val().rating + rate;
                await update(anek, { rating: newRating });
                await update(ratedUsers, { [userId]: userId });
              }
            });
          } else {
            commit('setError', 'Данные недоступны');
          }
        });
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },
  },
};
