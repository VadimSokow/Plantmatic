import { defineStore } from "pinia";

interface AuthState {
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    isAuthenticated: !!localStorage.getItem('authToken'),
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    loginDummy() {
      this.isAuthenticated = true;
      localStorage.setItem('authToken', 'dummyToken');
    },
    logout() {
      this.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
  },
});
