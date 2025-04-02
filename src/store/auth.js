import {defineStore} from 'pinia';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null,
    token: null,
  }),
  actions: {
    login(user, token) {
      this.user = user;
      this.token = token;
      this.isLoggedIn = true;
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
    },
  },
});
