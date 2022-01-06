import {
  getDatabase,
  ref,
  onValue,
  push,
  child,
  update,
  get,
  query,
  orderByKey,
  limitToLast,
  endBefore,
} from 'firebase/database';
import Vue from 'vue';
import { formatDate } from '../functions';
import { MESSAGES_LIMIT } from '../constants';

export default {
  state: {
    chats: [],
    chatsKeys: [],
    messages: [],
  },
  getters: {
    getChats(state) {
      return state.chats;
    },
    getChatsKeys(state) {
      return state.chatsKeys;
    },
    getMessages(state) {
      return state.messages;
    },
  },
  mutations: {
    setChats(state, payload) {
      state.chats = payload;
    },
    setMessages(state, payload) {
      if (state.messages.length !== 0) {
        state.messages = [...payload, ...state.messages];
      } else {
        state.messages = payload;
      }
    },
    addMessageToEnd(state, payload) {
      state.messages = [...state.messages, ...payload];
    },
    setChatsKeys(state, payload) {
      state.chatsKeys = payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  actions: {
    async loadChats({ commit }) {
      commit('clearError');
      commit('setLoading', true);
      const resultChats = [];
      try {
        const db = getDatabase();
        const chatsRef = ref(db, 'chat/chats');
        await new Promise((resolve) => {
          onValue(chatsRef, (snapshot) => {
            let i = 0;
            snapshot.forEach((child) => {
              const chat = child.val();
              const chatKey = child.key;
              const oneChat = { chatName: chat.chatName, userCount: chat.userCount, chatId: chatKey };
              Vue.set(resultChats, i, oneChat);
              ++i;
            });
            resolve();
          });
        });
        commit('setChats', resultChats);
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
      }
    },
    async loadChatsKeys({ commit }) {
      const resultChatsKeys = [];
      try {
        const db = getDatabase();
        const chatsRef = ref(db, 'chat/chats');
        await new Promise((resolve) => {
          onValue(chatsRef, (snapshot) => {
            let i = 0;
            snapshot.forEach((child) => {
              const chatKey = child.key;
              Vue.set(resultChatsKeys, i, chatKey);
              ++i;
            });
            resolve();
          });
        });
        commit('setChatsKeys', resultChatsKeys);
      } catch (error) {
        commit('setError', error.message);
      }
    },
    async addChat({ commit, getters }, chatName) {
      const creatorId = getters?.user.id;
      const createdTime = Date.now();
      const stringTime = formatDate(createdTime);
      const chatData = { creatorUserId: creatorId, time: createdTime, chatName: chatName, userCount: 1 };
      try {
        const db = getDatabase();
        const chatRef = ref(db, 'chat');
        const newChatKey = await push(child(chatRef, 'chats')).key;
        const updates = {};

        updates['/chats/' + newChatKey] = chatData;
        updates['/chatMembers/' + newChatKey + '/users/' + creatorId] = { time: createdTime };
        updates['/users/' + creatorId + '/chats/' + newChatKey] = { time: createdTime };
        const newMessageKey = await push(child(chatRef, 'messages')).key;
        updates['/messages/' + newChatKey + '/' + newMessageKey] = {
          time: createdTime,
          body: `Чат создан ${stringTime}`,
          userName: 'Чат бот',
        };
        return await update(chatRef, updates);
      } catch (error) {
        commit('setError', error.message);
      }
    },
    async addUserToChatMembers({ commit, getters }, chatId) {
      const userId = getters?.user.id;
      try {
        const db = getDatabase();
        const userRef = ref(db, `chat/chatMembers/${chatId}/users/${userId}`);
        await onValue(userRef, async (snapshot) => {
          const data = await snapshot.val();
          if (data === null) {
            const updates = {};
            const createdTime = Date.now();
            updates[`chatMembers/${chatId}/users/${userId}`] = { time: createdTime };
            updates['/users/' + userId + '/chats/' + chatId] = { time: createdTime };

            const chatIdRef = ref(db, `chat/chats/${chatId}`);
            const userCount = child(chatIdRef, `userCount`);
            await get(userCount).then((snapshot) => {
              const userCount = snapshot.val() + 1;
              updates[`chats/${chatId}/userCount`] = userCount;
            });

            const chatRef = ref(db, 'chat');
            return await update(chatRef, updates);
          }
        });
      } catch (error) {
        commit('setError', error.message);
      }
    },
    async loadMessages({ commit }, { chatId, lastMessageId = null }) {
      commit('clearError');
      commit('setLocalLoading', true);
      const resultMessages = [];
      const limit = MESSAGES_LIMIT;
      try {
        const db = getDatabase();
        let messagesRef = ref(db, `chat/messages/${chatId}`);
        if (lastMessageId) {
          messagesRef = query(messagesRef, orderByKey(), endBefore(lastMessageId), limitToLast(limit));
        } else {
          messagesRef = query(messagesRef, orderByKey(), limitToLast(limit));
        }
        await new Promise((resolve) => {
          onValue(messagesRef, (snapshot) => {
            let i = 0;
            snapshot.forEach((child) => {
              const message = child.val();
              const messageKey = child.key;
              const oneMessage = {
                userName: message.userName,
                body: message.body,
                time: message.time,
                key: messageKey,
              };
              Vue.set(resultMessages, i, oneMessage);
              ++i;
            });
            resolve();
          });
        });
        if (resultMessages.length === 1 || resultMessages.length === 0) {
          return false;
        }
        commit('setMessages', resultMessages);
        commit('setLocalLoading', false);
        return true;
      } catch (error) {
        commit('setError', error.message);
        commit('setLocalLoading', false);
      }
    },
    async addMessage({ commit, getters }, { message, chatId }) {
      const updates = {};
      const createdTime = Date.now();
      const userName = getters?.user.nickname;
      try {
        const db = getDatabase();
        const messagesRef = ref(db, 'chat/messages/');
        const messageKey = await push(child(messagesRef, `${chatId}`)).key;
        updates[`${messageKey}/body`] = message;
        updates[`${messageKey}/time`] = createdTime;
        updates[`${messageKey}/userName`] = userName;
        const chatMessagesRef = ref(db, `chat/messages/${chatId}`);
        await update(chatMessagesRef, updates);
      } catch (error) {
        commit('setError', error.message);
      }
    },
  },
};
