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
        <div class="pa-2 mb-9"
             v-if="isUserLoggedIn">
          <v-btn @click="onLogout"
                 block>
            <v-icon>mdi-logout</v-icon>Выйти
          </v-btn>
        </div>
        <div class="pa-2 mb-9"
             v-else>
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
  data() {
    return {
      drawer: this.showDrawer,
    };
  },
  props: {
    showDrawer: { type: Boolean, require: true },
    links: { type: Array, require: true },
    isUserLoggedIn: { type: Boolean, require: true },
  },
  methods: {
    ...mapActions(['logoutUser']),
    onLogout() {
      this.logoutUser();
      this.$router.push('/');
    },
  },
  watch: {
    showDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>