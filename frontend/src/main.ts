/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';
import { msalInstance } from './authConfig';
import { type AuthenticationResult, EventType } from '@azure/msal-browser';

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import router from '@/router';

async function msalInit () {
  await msalInstance.initialize();
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }
  msalInstance.addEventCallback(event => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });
}

async function init () {
  await msalInit();
  const app = createApp(App)

  registerPlugins(app)

  router.isReady().then(() => {
    app.mount('#app');
  });
}

init().catch(error => {
  console.error('Error during initialization:', error);
});
