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
      apiKey: 'AIzaSyA74cum2Hs1H8ybm06JFhL_9JsqNcB2gw0',
      authDomain: 'aneki-af274.firebaseapp.com',
      projectId: 'aneki-af274',
      storageBucket: 'aneki-af274.appspot.com',
      messagingSenderId: '27394706899',
      appId: '1:27394706899:web:31a7aa8c5cad1549fb7326',
      measurementId: 'G-3YLWDV868S',
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
