<template>
  <v-list subheader>
    <v-subheader>Ваши чаты</v-subheader>
    <v-list-item v-for="(chat, i) in chats"
                 :key="i"
                 :to="/chat/ + chat.chatId">
      <v-list-item-content>
        <v-list-item-title>{{chat.chatName}}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-icon>mdi-chat</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  created() {
    this.$store.dispatch('loadChats');
  },
  computed: {
    chats() {
      return this.$store.getters.getChats;
    },
  },
};
</script>