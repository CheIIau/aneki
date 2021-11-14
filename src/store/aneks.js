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
  limitToLast,
  startAt,
  endAt,
  startAfter,
  orderByKey,
  endBefore,
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
      state.aneks = payload;
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

    async fetchAneks({ commit }, { reverse = false, sorted = null, lastAnekId }) {
      commit('setLoading', true);
      console.log(lastAnekId);
      const resultAneks = [];
      try {
        const db = getDatabase();
        let aneksRef = ref(db, 'aneks');
        if (sorted) {
          console.log(sorted);
          aneksRef = query(aneksRef, orderByChild(`${sorted}`), limitToLast(100));
        } else {
          console.log('new');
          //startAfter('-Mnlo81j3yVVFg2NdISg') им и endbefore можно сделать сортировку по дате добавления
          aneksRef = query(aneksRef, orderByKey(), limitToLast(100));
        }

        await new Promise((resolve) => {
          onValue(aneksRef, (snapshot) => {
            let i = 0;
            snapshot.forEach((child) => {
              const anek = child.val();
              const newAnek = new Anek(anek.title, anek.body, anek.author, anek.time, child.key, anek.rating);
              console.log(anek.rating);
              Vue.set(resultAneks, i, newAnek);
              ++i;
              // resultAneks.push(newAnek);
            });
            resolve();
          });
        });
        if (reverse) {
          resultAneks.reverse();
        }
        commit('loadAneks', resultAneks);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    fetchOldAneksFromDB({ dispatch }, { lastAnekId = null } = {}) {
      dispatch('fetchAneks', { lastAnekId }); //new
    },

    fetchNewAneksFromDB({ dispatch }, { lastAnekId = null } = {}) {
      const sorted = 'reverseTime';
      dispatch('fetchAneks', { sorted, lastAnekId }); //old
    },

    fetchFavouriteAneksFromDB({ dispatch }) {
      const sorted = 'rating';
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
