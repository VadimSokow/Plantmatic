/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import type { App } from 'vue'
import { msalInstance } from '@/authConfig.ts'
import { msalPlugin } from '@/plugins/msal.ts'
import router from '../router'
import pinia from '../stores'
import vuetify from './vuetify'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(msalPlugin, msalInstance)
}
