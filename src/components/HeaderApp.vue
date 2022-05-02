<template>
  <v-app-bar
    app
    color="primary"
    dark
  >
    <v-app-bar-nav-icon
      class="hidden-lg-and-up"
      @click.stop="toggleDrawer"
    ></v-app-bar-nav-icon>
    <div class="d-flex align-center">
      <router-link
        to="/"
        class="pointer"
      >
        <v-img
          class="shrink"
          contain
          src="@/assets/logo2.png"
          transition="scale-transition"
          width="55"
        />
      </router-link>
      <transition
        appear
        appear-active-class="fade-enter-active"
      >
        <div class="app-bar_title pointer">
          <router-link
            tag="span"
            to="/"
          >
            неки
          </router-link>
        </div>
      </transition>
    </div>
    <v-spacer></v-spacer>
    <v-toolbar-items
      v-if="!loadingUser"
      class="hidden-md-and-down"
    >
      <v-btn
        v-for="link in links"
        :key="link.title"
        elevation="0"
        color="primary"
        :to="link.url"
      >
        <!-- <v-icon left>
          {{ link.icon }}
        </v-icon> -->
        {{ link.title }}
      </v-btn>
    </v-toolbar-items>
    <div v-else>
      <v-progress-circular
        :size="40"
        :width="3"
        color="white"
        class="hidden-sm-and-down"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        v-if="isUserLoggedIn && !loadingUser"
        text
        @click="onLogout"
      >
        <span class="mr-2">Выйти</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn
        v-else-if="!isUserLoggedIn && !loadingUser"
        :to="'/login'"
        text
      >
        <span class="mr-2">Войти</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <div
        v-else
        class="blank"
      >
        &nbsp;
      </div>
    </v-toolbar-items>
    <v-switch
      v-model="darkThemeSwitchValue"
      inset
      hide-details
      color="indigo darken-3"
      flat
      class="hidden-md-and-up"
      @change="changeTheme"
    ></v-switch>
    <v-icon class="hidden-md-and-up">
      mdi-weather-night
    </v-icon>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { changeTheme } from '../functions/darkmode';
export default {
  props: {
    links: { type: Array, required: true },
    isUserLoggedIn: { type: Boolean, required: true },
  },
  data() {
    return {
      darkThemeSwitchValue: this.$vuetify.theme.dark,
    };
  },
  computed: {
    ...mapGetters(['loading', 'loadingUser']),
  },
  created() {
    this.setLoadingUser(true);
  },
  methods: {
    ...mapActions(['logoutUser', 'setLoadingUser']),
    onLogout() {
      this.logoutUser();
      this.$router.push('/');
    },
    toggleDrawer() {
      this.$emit('toggleDrawer');
    },
    changeTheme,
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