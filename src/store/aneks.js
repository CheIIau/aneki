/* eslint-disable no-unused-vars */
import { getDatabase, ref, set, push, onValue, update, child, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Vue from 'vue';
class Anek {
  constructor(title, body, author, time, id = null, rating = 0, ratedUsers = {}) {
    this.title = title;
    this.body = body;
    this.author = author;
    this.time = time;
    this.id = id;
    this.rating = rating;
    this.ratedUsers = ratedUsers;
  }
}

export default {
  state: {
    aneks: [],
    bookmarkedAneks: [],
  },
  getters: {
    getAneks(state) {
      return state.aneks;
    },
    // aneksMap(state) {
    //   const map = {};
    //   state.aneks.forEach((an, i) => {
    //     map[an.id.toString()] = i;
    //   });
    //   return map;
    // },
  },
  mutations: {
    addAnek(state, { title, body, author, time }) {
      state.aneks.push({ title, body, author, time });
    },
    loadAneks(state, payload) {
      state.aneks = payload;
    },
    updateRating(state, { id, newRating }) {
      state.aneks.find((anek) => anek.id === id).rating = newRating;
    },
    loadBookmarkedAneks(state, payload) {
      state.bookmarkedAneks = payload;
    },
  },
  actions: {
    async loadBookmarkedAneks({ commit }) {
      const auth = getAuth();
      let aneksRef = null;
      let userId = null;
      const resultAneks = [];
      try {
        Promise.resolve()
          .then(() => {
            onAuthStateChanged(auth, (user) => {
              userId = user.uid;
            });
          })
          .then(() => {
            const db = getDatabase();
            aneksRef = ref(db, 'bookmarkAneks/' + userId);
          })
          .then(() => {
            get(aneksRef)
              .then((snapshot) => {
                const bookmarkedAneks = snapshot.val();
                Object.keys(bookmarkedAneks).forEach((key) => {
                  const anek = bookmarkedAneks[key];
                  resultAneks.push(anek);
                });
              })
              .then(() => {
                console.log(resultAneks);
                return resultAneks;
              });
          });
      } catch (error) {
        commit('setError', error.message);
        throw error;
      }
    },
    async changeAnekBookmark({ commit }, id) {
      commit('setLocalLoading', true);
      let anekRef = null;
      let userId = null;
      const auth = getAuth();
      try {
        Promise.resolve()
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
            update(anekRef, { [id]: id });
            commit('setLocalLoading', false);
          });
      } catch (error) {
        commit('setError', error.message);
        commit('setLocalLoading', false);
        throw error;
      }
    },
    async addAnek({ commit, rootGetters }, { title, body }) {
      commit('clearError');
      commit('setLoading', true);

      const userName = rootGetters['getUserName'] ?? 'Аноним';
      const db = getDatabase();
      const anekListRef = ref(db, 'aneks');
      let userId = null;
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        userId = user.uid;
      });

      try {
        const newAnekRef = await push(anekListRef);
        const newAnek = new Anek(title, body, userName, Date.now(), userId, 0, { key: 'value' });
        await set(newAnekRef, newAnek);
        commit('addAnek', { title, body, author: userName, time: Date.now(), userId });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
      }
    },
    async fetchAneks({ commit }) {
      commit('setLoading', true);
      const resultAneks = [];
      try {
        const db = getDatabase();
        const aneksRef = ref(db, 'aneks');
        await Promise.resolve().then(() => {
          onValue(aneksRef, (snapshot) => {
            const aneks = snapshot.val();
            let i = 0;
            Object.keys(aneks).forEach((key) => {
              const anek = aneks[key];
              const newAnek = new Anek(anek.title, anek.body, anek.author, anek.time, key, anek.rating);
              Vue.set(resultAneks, i, newAnek);
              // resultAneks.push(newAnek);
              ++i;
            });
            //Костыль, но при использовании метода push, при обновлении данных, элементы пушатся еще раз в конец массива
          });
        });
        // commit('setLoading', false);
        commit('loadAneks', resultAneks);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
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

// function getAneks() {
//   return [
//     {
//       title: 'GoodAnek',
//       body: 'Надел мужик шляпу, а она ему как раз',
//       author: 'Жизнь',
//       authorId: '1488',
//       time: '1635241835794',
//     },
//   ];
// }
