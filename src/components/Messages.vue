<template>
  <div>
    <div v-for="(message,i) in messages"
         :key="message.key"
         class="message"
         :class="{own: message.userName == user.nickname}">
      <div v-if="i>0 && messages[i-1].userName != message.userName"
           class="username">
        {{ message.userName }}
      </div>
      <div v-else-if="i === 0"
           class="username">
        {{ message.userName }}
      </div>
      <div style="margin-top: 5px"></div>
      <div class="content">
        <div>{{ message.body }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {
    messages: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {},
};
</script>

<style scoped>
.message {
  margin-bottom: 3px;
}
.message.own {
  text-align: right;
}
.message.own .content {
  background-color: lightgreen;
}
.username {
  font-size: 18px;
  font-weight: bold;
}
.content {
  padding: 8px;
  background-color: lightskyblue;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  max-width: 50%;
  word-wrap: break-word;
}
</style>