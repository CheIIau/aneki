<template>
  <v-container fluid
               v-if="existChatId"
               class="chat-layout">
    <v-row no-gutters
           class="chat-row">
      <v-col sm="2"
             class="scrollable hidden-sm-and-down chat-list-column">
        <chat-list-column></chat-list-column>
      </v-col>
      <v-col class="chat-coloumn">
        <div class="chat-container"
             ref="chatContainer">
          <div ref="observer"
               class="observer"></div>
          <chat-messages :messages="messages"></chat-messages>
        </div>
        <div class="typer">
          <v-btn elevation="2"
                 fab
                 icon
                 outlined
                 rounded
                 small
                 class="hidden-md-and-up"
                 @click="chatListDrawer =! chatListDrawer">
            <v-icon>mdi-chat</v-icon>
          </v-btn>
          <input type="text"
                 placeholder="Напишите сообщение..."
                 @keyup.enter="sendMessage(message)"
                 v-model="message">
          <v-spacer></v-spacer>
          <v-icon class="chat-sendIcon"
                  @click="sendMessage(message)">mdi-send</v-icon>
        </div>
      </v-col>
    </v-row>
    <v-navigation-drawer v-model="chatListDrawer"
                         absolute
                         temporary
                         class="chat-drawer"
                         right>
      <chat-list-column></chat-list-column>
    </v-navigation-drawer>
  </v-container>
  <spinner v-else></spinner>
</template>

<script>
import { getDatabase, ref, onChildAdded } from 'firebase/database';
import ChatMessages from '../components/Messages.vue';
import ChatListColumn from '../components/ChatListColumn.vue';
import { mapActions, mapGetters } from 'vuex';
import Spinner from '@/components/Spinner.vue';
import { MESSAGES_LIMIT } from '../constants';
export default {
  data() {
    return {
      message: '',
      chatListDrawer: false,
    };
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    ChatListColumn,
    Spinner,
    ChatMessages,
  },
  methods: {
    ...mapActions(['loadChatsKeys', 'setLoading', 'loadMessages', 'addMessage']),
    async sendMessage(message) {
      if (message !== '') {
        this.addMessage({ message: message, chatId: this.chatId });
      }
      this.message = '';
    },
    startObserving() {
      const optionsObserver = {
        rootMargin: '0px',
        threshold: 1.0,
      };
      const callbackObserver = async (entries) => {
        if (entries[0].isIntersecting && this.messages.length !== 0) {
          const lastMessageId = this.messages[0].key;
          await this.loadMessages({ chatId: this.chatId, lastMessageId });
        }
      };
      const observer = new IntersectionObserver(callbackObserver, optionsObserver);
      observer.observe(this.$refs.observer);
    },
    onMessageAdded() {
      const db = getDatabase();
      const dbRef = ref(db, `chat/messages/${this.chatId}`);
      onChildAdded(dbRef, (data) => {
        if (this.messages.length > MESSAGES_LIMIT) {
          this.$store.commit('addMessageToEnd', [data.val()]);
        }
      });
    },
  },
  async beforeMount() {
    await this.loadChatsKeys();
    if (!this.existChatId) {
      this.$router.push('/404');
    }
  },
  async mounted() {
    await this.loadMessages({ chatId: this.chatId });
    this.startObserving();
    const el = this.$refs.chatContainer;
    el.scrollTop = el.scrollHeight - el.clientHeight;
    this.scrollTopMessages = el.scrollHeight;
    this.onMessageAdded();
  },
  computed: {
    ...mapGetters({ chatKeys: 'getChatsKeys', loading: 'loading', messages: 'getMessages' }),

    chatId() {
      return this.id;
    },
    chatsKeys() {
      return this.$store.getters.getChatsKeys;
    },
    existChatId() {
      return this.chatsKeys.includes(this.chatId);
    },
  },
  watch: {
    messages() {
      this.$nextTick().then(() => {
        const el = this.$refs.chatContainer;
        if (el.scrollHeight - el.clientHeight - 200 < el.scrollTop) {
          el.scrollTop = el.scrollHeight - el.clientHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.scrollable {
  overflow-y: auto;
  height: 90vh;
}
.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.2);
}
.typer input[type='text'] {
  position: absolute;
  left: 2rem;
  padding: 1rem;
  width: 80%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
}
.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.3rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}
.chat-layout {
  padding: 0;
}
.chat-coloumn {
  position: relative;
}
.chat-sendIcon {
  margin: 10px 20px 10px 0;
  font-size: 2.3rem;
  cursor: pointer;
}
.chat-list-button {
  position: absolute;
  top: 5px;
  right: 15px;
  z-index: 1;
}
.chat-list-column {
  min-width: 190px;
}
.chat-row {
  margin-top: -18px;
}
.chat-drawer {
  margin-top: -18px;
}
.observer {
  height: 10px;
}
</style>