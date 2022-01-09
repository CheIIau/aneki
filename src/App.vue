<template>
  <v-app>
    <drawer :show-drawer="showDrawer"
            :links="links"
            :is-user-logged-in="isUserLoggedIn"></drawer>
    <header-app :links="links"
                :is-user-logged-in="isUserLoggedIn"
                @toggleDrawer="toggleDrawer"></header-app>
    <v-main class="mt-6">
      <transition name="fade-transition"
                  mode="out-in"
                  appear
                  appear-active-class="fade-transition">
        <router-view />
      </transition>
      <v-btn class="mx-2 dark-mode hidden-sm-and-down"
             fab
             fixed
             dark
             small
             @click="changeTheme">
        <v-icon>mdi-weather-night</v-icon>
      </v-btn>
    </v-main>
    <template v-if="error">
      <v-snackbar v-model="snackbar"
                  :multi-line="true"
                  color="error">
        {{ error }}
        <template v-slot:action>
          <v-btn dark
                 text
                 @click="clearError">
            Закрыть
          </v-btn>
        </template>
      </v-snackbar>
    </template>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Drawer from '@/components/Drawer.vue';
import HeaderApp from '@/components/HeaderApp.vue';
export default {
  name: 'App',
  components: {
    Drawer,
    HeaderApp,
  },
  data: () => ({
    snackbar: true,
    showDrawer: false,
  }),
  computed: {
    ...mapGetters(['isUserLoggedIn', 'error']),
    links() {
      if (this.isUserLoggedIn) {
        return [
          { title: 'Все анеки', icon: 'mdi-format-list-bulleted', url: '/' },
          { title: 'Топ 100', icon: 'mdi-star', url: '/best' },
          { title: 'Поиск', icon: 'mdi-magnify', url: '/search' },
          { title: 'Закладки', icon: 'mdi-bookmark', url: '/favs' },
          { title: 'Добавить анек', icon: 'mdi-file-plus', url: '/new' },
          { title: 'Мемесы', icon: 'mdi-one-up', url: '/memes' },
        ];
      }
      return [
        { title: 'Все анеки', icon: 'mdi-format-list-bulleted', url: '/' },
        { title: 'Топ 100', icon: 'mdi-star', url: '/best' },
        { title: 'Поиск', icon: 'mdi-magnify', url: '/search' },
        { title: 'Мемесы', icon: 'mdi-one-up', url: '/memes' },
        { title: 'Чат', icon: 'mdi-chat', url: '/chatlist' },
        { title: 'Регистрация', icon: 'mdi-account-plus', url: '/registration' },
      ];
    },
  },
  watch: {
    error() {
      if (this.error !== false)
        setTimeout(() => {
          this.clearError();
        }, 4000);
    },
  },
  methods: {
    ...mapActions(['clearError']),
    toggleDrawer() {
      this.showDrawer = !this.showDrawer;
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
  },
};
</script>

<style>
.pointer {
  cursor: pointer;
}
.dark-mode {
  bottom: 15px;
  right: 15px;
}
</style>