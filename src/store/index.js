import Vue from 'vue';
import Vuex from 'vuex';
import aneks from './aneks';
import user from './user';
import shared from './shared';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    aneks,
    shared,
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});
