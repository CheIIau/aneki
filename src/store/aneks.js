import { getDatabase, ref, set, push, onValue } from 'firebase/database';

class Anek {
  constructor(title, body, author, id = null) {
    this.title = title;
    this.body = body;
    this.author = author;
    this.id = id;
  }
}

export default {
  state: { aneks: [] },
  getters: {
    getAneks(state) {
      return state.aneks;
    },
  },
  mutations: {
    addAnek(state, { title, body, author }) {
      state.aneks.push({ title, body, author });
    },
    loadAneks(state, payload) {
      state.aneks = payload;
    },
  },
  actions: {
    async addAnek({ commit, rootGetters }, { title, body }) {
      commit('clearError');
      commit('setLoading', true);

      const userName = rootGetters['getUserName'] ?? 'Аноним';
      const db = getDatabase();
      const postListRef = ref(db, 'aneks');

      try {
        const newPostRef = await push(postListRef);
        await set(newPostRef, {
          title,
          body,
          author: userName,
        });
        commit('addAnek', { title, body, author: userName });
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
      }
    },
    async fetchAneks({ commit }) {
      commit('clearError');
      commit('setLoading', true);
      const resultAneks = [];

      try {
        const db = getDatabase();
        const aneksRef = ref(db, 'aneks');
        await onValue(aneksRef, (snapshot) => {
          const aneks = snapshot.val();
          Object.keys(aneks).forEach((key) => {
            const anek = aneks[key];
            resultAneks.push(new Anek(anek.title, anek.body, anek.author, key));
          });
        });
        commit('loadAneks', resultAneks);
        commit('setLoading', false);
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
