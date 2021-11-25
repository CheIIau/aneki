import { getStorage, ref as storRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  query,
  child,
  orderByChild,
  startAfter,
  limitToFirst,
  onValue,
} from 'firebase/database';
import Vue from 'vue';
import { Meme } from '@/classes/index.js';

export default {
  state: {
    memes: [],
  },
  getters: {
    getMemes(state) {
      return state.memes;
    },
  },
  mutations: {
    setMemes(state, payload) {
      if (state.memes.length !== 0) {
        state.memes = [...state.memes, payload];
      } else {
        state.memes = payload;
      }
    },
    clearMemes(state) {
      state.memes = [];
    },
  },
  actions: {
    async uploadMeme({ commit, getters }, image) {
      commit('clearError');
      commit('setLoading', true);
      try {
        const user = getters.user;
        const db = getDatabase();
        const memesRef = ref(db, 'memes');
        const newMemeRef = await push(memesRef);
        const newMeme = new Meme('', user.nickname, user.id);
        await set(newMemeRef, newMeme);

        const imageExt = image.name.slice(image.name.lastIndexOf('.'));
        const st = getStorage();
        const memesSt = storRef(st, `memes/${newMemeRef.key}${imageExt}`);
        const uploadedMeme = await uploadBytes(memesSt, image);
        console.log(uploadedMeme);
        const imageUrl = await getDownloadURL(memesSt);
        await update(newMemeRef, { imageUrl });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },
    // eslint-disable-next-line no-unused-vars
    async fetchMemes({ commit }, { reverse = false, sorted = null, lastMemesVal = null }) {
      commit('clearError');
      if (!lastMemesVal) commit('setLoading', true);
      const limit = sorted == 'rating' ? 100 : 5;
      const resultMemes = [];
      try {
        const db = getDatabase();
        let memesRef = ref(db, 'memes');
        if (lastMemesVal) {
          memesRef = query(memesRef, orderByChild(`${sorted}`), startAfter(lastMemesVal), limitToFirst(limit));
        } else {
          memesRef = query(memesRef, orderByChild(`time`), limitToFirst(limit)); //order
        }
        await new Promise((resolve) => {
          onValue(memesRef, (snapshot) => {
            let i = 0;
            snapshot.forEach((child) => {
              const meme = child.val();
              const newMeme = new Meme(
                meme.imageUrl,
                meme.author,
                null,
                meme.time,
                meme.reverseTime,
                meme.rating,
                meme.ratedUsers,
              );
              newMeme.id = child.key;
              Vue.set(resultMemes, i, newMeme);
              ++i;
            });
            resolve();
          });
        });
        commit('setMemes', resultMemes);
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },
    fetchOldMemesFromDB({ dispatch, commit }, { lastMemesVal = null } = {}) {
      const sorted = 'time';
      commit('clearMemes');
      dispatch('fetchMemes', { sorted, lastMemesVal });
    },

    fetchNewMemesFromDB({ dispatch, commit }, { lastMemesVal = null } = {}) {
      const sorted = 'reverseTime';
      commit('clearMemes');
      dispatch('fetchMemes', { sorted, lastMemesVal });
    },

    fetchFavouriteMemesFromDB({ dispatch, commit }) {
      const sorted = 'rating';
      commit('clearMemes');
      dispatch('fetchMemes', { reverse: true, sorted });
    },

    async changeMemeVote({ commit, getters }, { id, vote }) {
      let rate = 0;
      vote == 'up' ? rate++ : rate--;

      try {
        const db = getDatabase();
        const memesRef = ref(db, 'memes/');
        const meme = child(memesRef, `${id}`);
        const userId = getters.user.id;
        await get(meme).then(async (snapshot) => {
          if (snapshot.exists()) {
            const ratedUsers = child(meme, `/ratedUsers`);
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
                await update(meme, { rating: newRating });
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
