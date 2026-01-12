import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './shared/router'
import './assets/main.css'
import './assets/styles/animations.css'
import 'vue-sonner/style.css'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('apexchart', VueApexCharts)

import { useThemeStore } from './shared/stores/theme'
useThemeStore()

app.mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
            }
          })
        }
      })
    })
    .catch(() => {
      // Service worker registration failed
    })
}
