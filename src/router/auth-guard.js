import store from '../store/index.js';

export default function (to, from, next) {
  if (store.getters.user || store.getters.localUser) {
    next();
  } else {
    next('/login?loginError=true');
  }
}
