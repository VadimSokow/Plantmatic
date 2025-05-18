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
import { msalPlugin } from '@/plugins/msalPlugin.ts';
import { msalInstance } from '@/authConfig.ts';
import VueApexCharts from 'vue3-apexcharts';

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(VueApexCharts)
    .use(router)
    .use(pinia)
    .use(msalPlugin, msalInstance)
}
