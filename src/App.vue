<template>
  <v-app>
    <v-card class="mx-auto"
            tile
            width="300">
      <v-navigation-drawer app
                           v-model="drawer"
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
          <div class="pa-2"
               v-if="isUserLoggedIn">
            <v-btn block
                   @click="onLogout">
              <v-icon>mdi-logout</v-icon>
              Выйти
            </v-btn>
          </div>
          <div class="pa-2"
               v-else>
            <v-btn block
                   :to="'/login'">
              <v-icon>mdi-login</v-icon>
              Войти
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </v-card>
    <v-app-bar app
               color="primary"
               dark>
      <v-app-bar-nav-icon class="hidden-md-and-up"
                          @click="drawer =!drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <router-link to="/"
                     class="pointer">
          <v-img class="shrink"
                 contain
                 src="@/assets/logo2.png"
                 transition="scale-transition"
                 width="55" />
        </router-link>
        <transition appear
                    appear-active-class="fade-enter-active">
          <div class='app-bar_title pointer'>
            <router-link tag="span"
                         to="/">неки</router-link>
          </div>
        </transition>
      </div>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!loadingUser"
                       class="hidden-sm-and-down">
        <v-btn elevation="0"
               color="primary"
               v-for="link in links"
               :key="link.title"
               :to="link.url">
          <v-icon left>{{link.icon}}</v-icon>{{link.title}}
        </v-btn>
      </v-toolbar-items>
      <div v-else>
        <v-progress-circular :size="40"
                             :width="3"
                             color="white"
                             class="hidden-sm-and-down"
                             indeterminate></v-progress-circular>
      </div>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-if="isUserLoggedIn && !loadingUser"
               @click="onLogout"
               text>
          <span class="mr-2">Выйти</span>
          <v-icon>mdi-logout</v-icon>
        </v-btn>
        <v-btn v-else-if="!isUserLoggedIn && !loadingUser"
               :to="'/login'"
               text>
          <span class="mr-2">Войти</span>
          <v-icon>mdi-login</v-icon>
        </v-btn>
        <div class="blank"
             v-else>&nbsp;</div>
      </v-toolbar-items>

    </v-app-bar>
    <v-main class="mt-6">
      <transition name="fade-transition"
                  mode="out-in"
                  appear
                  appear-active-class="fade-transition">
        <router-view />
      </transition>
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
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </template>
  </v-app>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'App',
  data: () => ({
    snackbar: true,
    drawer: false,
  }),
  computed: {
    ...mapGetters(['loading', 'loadingUser', 'error', 'isUserLoggedIn']),
    links() {
      if (this.isUserLoggedIn) {
        return [
          { title: 'Все анеки', icon: 'mdi-format-list-bulleted', url: '/' },
          { title: 'Закладки', icon: 'mdi-bookmark', url: '/favs' },
          { title: 'Добавить анек', icon: 'mdi-file-plus', url: '/new' },
        ];
      }
      return [
        { title: 'Все анеки', icon: 'mdi-format-list-bulleted', url: '/' },
        { title: 'Регистрация', icon: 'mdi-account-plus', url: '/registration' },
      ];
    },
  },
  created() {
    this.setLoadingUser(true);
  },
  methods: {
    ...mapActions(['logoutUser', 'setLoadingUser', 'clearError']),
    onLogout() {
      this.logoutUser();
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.blank {
  height: 100%;
  margin-right: 9em;
}

.app-bar_title {
  font-size: 2.7em;
}
.fade-enter-active {
  animation: go 1s;
}

@keyframes go {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>