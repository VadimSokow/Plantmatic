/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router/auto'
import {setupLayouts} from 'virtual:generated-layouts'
import {routes} from 'vue-router/auto-routes'
import {useAuthStore} from "@/stores/auth.ts";
import {msalInstance, loginRequest} from "../authConfig";
import {InteractionType, type PopupRequest, PublicClientApplication, type RedirectRequest} from "@azure/msal-browser";
import type {RouteLocationNormalized} from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (to.name === '/login') {
    return true;
  }

  const request = {
    ...loginRequest,
    redirectStartPage: to.fullPath
  }
  const shouldProceed = await isAuthenticated(msalInstance, InteractionType.None, request);
  if (!shouldProceed) {
    return '/login';
  }
  return true;
});

export default router


export async function isAuthenticated(instance: PublicClientApplication, interactionType: InteractionType, loginRequest: PopupRequest | RedirectRequest): Promise<boolean> {
  // If your application uses redirects for interaction, handleRedirectPromise must be called and awaited on each page load before determining if a user is signed in or not
  return instance.handleRedirectPromise().then(() => {
    const accounts = instance.getAllAccounts();
    if (accounts.length > 0) {
      return true;
    }

    // User is not signed in and attempting to access protected route. Sign them in.
    if (interactionType === InteractionType.Popup) {
      return instance.loginPopup(loginRequest).then(() => {
        return true;
      }).catch(() => {
        return false;
      })
    } else if (interactionType === InteractionType.Redirect) {
      return instance.loginRedirect(loginRequest).then(() => {
        return true;
      }).catch(() => {
        return false;
      });
    }

    return false;
  }).catch(() => {
    return false;
  });
}
