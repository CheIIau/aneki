export default {
  state: { aneks: getAneks() },
  getters: {
    getAneks(state) {
      return state.aneks;
    },
  },
  mutations: {
    addAnek(state, { title, body, author }) {
      state.aneks.push({ title, body, author });
    },
  },
  actions: {
    addAnek({ commit, rootGetters }, { title, body }) {
      const userName = rootGetters['getUserName'] ?? 'Аноним';
      commit('addAnek', { title, body, author: userName });
    },
  },
};

function getAneks() {
  return [
    {
      title: 'GoodAnek',
      body: 'Надел мужик шляпу, а она ему как раз',
      author: 'Жизнь',
      authorId: '1488',
      time: '1635241835794',
    },
  ];
}
