/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import type { PublicClientApplication } from '@azure/msal-browser'
import type { RouteLocationNormalized } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
// eslint-disable-next-line import/no-duplicates
import { createRouter, createWebHistory } from 'vue-router/auto'
// eslint-disable-next-line import/no-duplicates
import { routes } from 'vue-router/auto-routes'
import { msalInstance } from '@/authConfig.ts'
import { useDeviceStore } from '@/stores/device.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

router.beforeEach(async (to: RouteLocationNormalized) => {
  // login page is always accessible, when user is already logged in
  // it will redirect to the home page when click on the login button
  if (to.name === '/login') {
    return true
  }

  // always redirect to the home page after auth callback
  if (to.path.endsWith('/auth/callback')) {
    return '/'
  }

  // check if the user is authenticated
  const isAuthed: boolean = await isAuthenticated(msalInstance)
  // when the user is not authenticated, redirect to the login page
  if (!isAuthed) {
    return '/login'
  }

  const deviceStore = useDeviceStore()

  if (to.meta.requireDevice && Object.keys(deviceStore.devices).length === 0 && !deviceStore.loading) {
    return '/'
  }

  return true
})

export default router

/**
 * Check if the user is authenticated.
 * @param instance The MSAL PublicClientApplication instance.
 * @return A promise that resolves to true if the user is authenticated, false otherwise.
 */
async function isAuthenticated (instance: PublicClientApplication): Promise<boolean> {
  return instance.handleRedirectPromise().then(() => {
    const accounts = instance.getAllAccounts()
    return accounts.length > 0
  })
}
