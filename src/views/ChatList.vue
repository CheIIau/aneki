<template>
  <div>
    <v-flex md10
            offset-md1
            offset-sm2
            offset-xs1
            sm8
            v-if="!loading"
            xs10>
      <div class="text-right">
        <span class="hidden-sm-and-down">&nbsp;</span>
        <v-menu offset-y
                transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="hidden-sm-and-down"
                   color="primary"
                   dark
                   v-bind="attrs"
                   v-on="on"
                   @click="showCreateChatModal">Создать новый чат</v-btn>
            <v-btn block
                   class="hidden-md-and-up mb-3"
                   color="primary"
                   dark
                   v-bind="attrs"
                   v-on="on"
                   @click="showCreateChatModal">
              Создать новый чат &nbsp;
              <v-icon>mdi-chat-plus</v-icon>
            </v-btn>
          </template>
        </v-menu>
      </div>
    </v-flex>

    <v-flex md6
            offset-md3
            offset-sm2
            offset-xs1
            sm8
            v-if="!loading"
            xs10>
      <v-list subheader>
        <v-subheader>Все чаты</v-subheader>

        <v-list-item-group color="primary">
          <v-list-item v-for="(chat, i) in chats"
                       :key="i"
                       @click="openChat(chat.chatId)">
            <v-list-item-icon>
              <v-icon>mdi-chat</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="chat.chatName"></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action-text v-text="chat.userCount">Количество участников</v-list-item-action-text>
            <v-list-item-action>
              <v-icon color="green lighten-2">mdi-account-group</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-flex>
    <spinner v-else></spinner>

    <modal :showDialog="showDialog"
           @toggleDialog="toggleDialog">
      <template v-slot:header>
        Напишите имя чата
      </template>
      <template v-slot:modal-body>
        <v-text-field prepend-icon="mdi-chat-plus-outline"
                      label="Имя чата"
                      v-model="chatName"
                      :rules="chatNameRules"
                      hide-details="auto"></v-text-field>
      </template>
      <template v-slot:button>
        <v-btn color="success"
               text
               outlined
               @click="addChatTrigger">
          Создать
        </v-btn>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Spinner from '@/components/Spinner.vue';
import Modal from '@/components/Modal.vue';
export default {
  data() {
    return {
      chatName: '',
      showDialog: false,
      chatNameRules: [
        (v) => !!v || 'Нужно ввести имя чата',
        (v) => (v && v.length >= 3 && v.length <= 20) || 'Имя чата должно быть длиннее 3 и короче 20 символов',
        (v) => /^[A-zА-я0-9]+([-_]?[A-zА-я0-9]+){0,2}$/i.test(v) || 'Имя чата не может содержать  символы кроме - и _',
      ],
    };
  },
  components: {
    Spinner,
    Modal,
  },
  computed: {
    ...mapGetters({ loading: 'loading', chats: 'getChats' }),
  },
  async created() {
    this.$store.dispatch('loadChats');
    // const res = await fetch('http://localhost:3000/api');
    // const qwe = await res.text();
    // console.log(qwe);
  },
  methods: {
    ...mapActions(['addChat', 'addUserToChatMembers']),
    showCreateChatModal() {
      this.showDialog = true;
    },
    toggleDialog() {
      this.showDialog = !this.showDialog;
    },
    addChatTrigger() {
      this.addChat(this.chatName);
      this.showDialog = false;
      this.chatName = '';
    },
    async openChat(chatId) {
      this.addUserToChatMembers(chatId);
      this.$router.push(`/chat/${chatId}`);
    },
  },
};
</script>

<style scoped>
.v-card.on-hover.theme--dark {
  background-color: rgba(#fff, 0.8);
}
</style>