<template>
  <v-card class="mx-auto"
          tile
          width="300">
    <v-navigation-drawer v-model="drawer"
                         app
                         dark
                         src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
                         temporary>
      <v-list>
        <v-subheader>Анеки</v-subheader>
        <v-list-item v-for="link of links"
                     :key="link.title"
                     :to="link.url"
                     link>
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div v-if="isUserLoggedIn"
             class="pa-2 mb-9">
          <v-btn block
                 @click="onLogout">
            <v-icon>mdi-logout</v-icon>Выйти
          </v-btn>
        </div>
        <div v-else
             class="pa-2 mb-9">
          <v-btn :to="'/login'"
                 block>
            <v-icon>mdi-login</v-icon>Войти
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    showDrawer: { type: Boolean, required: true },
    links: { type: Array, required: true },
    isUserLoggedIn: { type: Boolean, required: true },
  },
  data() {
    return {
      drawer: this.showDrawer,
    };
  },
  watch: {
    showDrawer() {
      this.drawer = !this.drawer;
    },
  },
  methods: {
    ...mapActions(['logoutUser']),
    onLogout() {
      this.logoutUser();
      this.$router.push('/');
    },
  },
};
</script>