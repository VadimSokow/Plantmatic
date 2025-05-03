/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'

// Types
import type { App } from 'vue'
import {msalPlugin} from "@/plugins/msalPlugin.ts";
import {msalInstance} from "@/authConfig.ts";

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(msalPlugin, msalInstance)
}
