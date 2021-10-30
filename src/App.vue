<template>
  <v-app>
    <!-- <v-navigation-drawer temporary
                         app
                         v-model="drawer"
                          src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
                         absolute>
      <v-card class="mx-auto"
              max-width="300"
              tile>
        <v-list dense>
          <v-subheader>Анеки</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item v-for="link of links"
                         :key="link.title"
                         :to="link.url"
                         link>
              <v-list-item-icon>
                <v-icon>{{link.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{link.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer> -->

    <v-card class="mx-auto"
            height="300"
            width="300">
      <v-navigation-drawer absolute
                           dark
                           src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
                           width="100%"
                           temporary>
        <v-list>
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
          <div class='app-bar_title'>
            неки
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
      <v-btn text
             v-if="isUserLoggedIn && !loadingUser"
             @click="onLogout">
        <span class="mr-2">Выйти</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn text
             v-else-if="!isUserLoggedIn && !loadingUser"
             @click="onLogout">
        <span class="mr-2">Войти</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <div class="blank"
           v-else>&nbsp;</div>
    </v-app-bar>
    <v-main class="mt-6">
      <router-view />
    </v-main>
  </v-app>

</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'App',
  data: () => ({
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
    this.$store.dispatch('setLoadingUser', true);
  },
};
</script>

<style scoped>
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