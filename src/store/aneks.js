/* eslint-disable no-unused-vars */
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
} from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Anek from '@/classes/AnekClass';

export default {
  state: {
    aneks: [],
    bookmarkedAneks: [],
    aneksCount: null,
  },
  getters: {
    getAneks(state) {
      return state.aneks;
    },
    getBookmarkedAneks(state) {
      return state.bookmarkedAneks;
    },
    getAneksCount(state) {
      return state.aneksCount;
    },
  },
  mutations: {
    addAnek(state, { title, body, author, time }) {
      state.aneks.push({ title, body, author, time });
    },
    loadAneks(state, payload) {
      if (state.aneks.length != 0) {
        state.aneks = [...state.aneks, ...payload];
      } else {
        state.aneks = payload;
      }
    },
    clearAneks(state) {
      state.aneks = [];
    },
    loadAneksCount(state, payload) {
      state.aneksCount = payload;
    },
    updateRating(state, { id, newRating }) {
      state.aneks.find((anek) => anek.id === id).rating = newRating;
    },
    loadBookmarkedAneks(state, id) {
      if (!state.bookmarkedAneks.includes(id)) {
        state.bookmarkedAneks.push(id);
      } else {
        state.bookmarkedAneks = state.bookmarkedAneks.filter((anekId) => anekId != id);
      }
    },
  },
  actions: {
    async loadBookmarkedAneks({ commit, getters }) {
      commit('setLoading', true);
      const auth = getAuth();
      let userId = null;
      const resultAneks = [];
      try {
        await new Promise((resolve) => {
          onAuthStateChanged(auth, (user) => {
            userId = user.uid;
            resolve();
          });
        });
        const db = getDatabase();
        const aneksRef = ref(db, 'bookmarkAneks/' + userId);
        get(aneksRef)
          .then((snapshot) => {
            const bookmarkedAneks = snapshot.val();
            if (bookmarkedAneks) {
              Object.keys(bookmarkedAneks).forEach((key) => {
                const anek = bookmarkedAneks[key];
                if (!getters.getBookmarkedAneks.includes(anek)) {
                  commit('loadBookmarkedAneks', anek);
                }
              });
            }
          })
          .then(() => {
            commit('setLoading', false);
          });
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
        await Promise.resolve()
          .then(() => {
            onAuthStateChanged(auth, (user) => {
              userId = user.uid;
            });
          })
          .then(() => {
            const db = getDatabase();
            anekRef = ref(db, 'bookmarkAneks/' + userId);
          })
          .then(() => {
            if (!getters.getBookmarkedAneks.includes(id)) {
              update(anekRef, { [id]: id });
              commit('loadBookmarkedAneks', id);
              commit('setLocalLoading', false);
            } else {
              update(anekRef, { [id]: null });
              commit('loadBookmarkedAneks', id);
              commit('setLocalLoading', false);
            }
          });
      } catch (error) {
        commit('setError', error.message);
        commit('setLocalLoading', false);
        throw error;
      }
    },

    async addAnek({ commit, dispatch, getters }, { title, body }) {
      commit('clearError');
      commit('setLoading', true);

      let userName = 'Аноним';
      const db = getDatabase();
      const anekListRef = ref(db, 'aneks');
      const aneksCountRef = ref(db, `aneksCount`);
      let userId = null;
      const auth = getAuth();
      await dispatch('fetchAneksCount');
      let aneksCount = getters.getAneksCount;
      onAuthStateChanged(auth, (user) => {
        userName = user.displayName;
        userId = user.uid;
      });

      try {
        const newAnekRef = await push(anekListRef);
        const newAnek = new Anek(title, body, userName, Date.now(), userId, 0, 1 - Date.now());
        await set(newAnekRef, newAnek);
        aneksCount++;
        await update(aneksCountRef, { aneksCount });
        commit('addAnek', { title, body, author: userName, time: Date.now(), userId });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
      }
    },

    async fetchAneks({ commit }, { reverse = false, sorted = null, lastAnekVal = null }) {
      !lastAnekVal ? commit('setLoading', true) : '';
      let limit = 5;
      sorted == 'rating' ? (limit = 100) : '';
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
        reverse ? resultAneks.reverse() : '';
        commit('loadAneks', resultAneks);
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    fetchOldAneksFromDB({ dispatch, commit }, { lastAnekVal = null } = {}) {
      const sorted = 'time';
      dispatch('fetchAneks', { sorted, lastAnekVal });
    },

    fetchNewAneksFromDB({ dispatch, commit }, { lastAnekVal = null } = {}) {
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
        await get(anek).then(async function (snapshot) {
          if (snapshot.exists()) {
            const ratedUsers = child(anek, `/ratedUsers`);
            let alreadyVoted = false;
            await Promise.resolve().then(() => {
              const auth = getAuth();
              onAuthStateChanged(auth, (user) => {
                userId = user.uid;
              });
            });
            get(ratedUsers).then((s) => {
              const ratedUsersObj = s.val();
              Object.keys(ratedUsersObj).forEach((key) => {
                if (ratedUsersObj[key] == userId) {
                  commit('setError', 'Вы уже голосовали за этот анек');
                  alreadyVoted = true;
                }
              });
              if (!alreadyVoted) {
                const newRating = snapshot.val().rating + rate;
                update(anek, { rating: newRating });
                update(ratedUsers, { [userId]: userId });
                commit('updateRating', { id, newRating });
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
