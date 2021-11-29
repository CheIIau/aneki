import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    const firebaseConfig = {
      apiKey: process.env.VUE_APP_API_TOKEN,
      authDomain: process.env.VUE_APP_AUTH_DOMAIN,
      projectId: process.env.VUE_APP_PROJECT_ID,
      storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_APP_ID,
      measurementId: process.env.VUE_APP_MEASUREMENT_ID,
      databaseURL: process.env.VUE_APP_DATABASE_URL,
    };
    initializeApp(firebaseConfig);
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.$store.dispatch('autoLoginUser', user);
      } else {
        this.$store.dispatch('setLoadingUser', false);
      }
    });
  },
}).$mount('#app');
