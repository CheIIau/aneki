import Vue from 'vue';
import Vuex from 'vuex';
import aneks from './aneks';
import user from './user';
import shared from './shared';
import memes from './memes';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    user,
    aneks,
    shared,
    memes,
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});
