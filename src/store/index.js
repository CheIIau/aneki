import Vue from 'vue';
import Vuex from 'vuex';
import aneks from './aneks';
import user from './user';
import shared from './shared';
import memes from './memes';
import chats from './chats';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: process.env.NODE_ENV !== 'production',
  modules: {
    user,
    aneks,
    shared,
    memes,
    chats,
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});
