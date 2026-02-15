import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/shared/router'
import '@/shared/assets/main.css'
import '@/shared/assets/styles/animations.css'
import 'vue-sonner/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

import { useThemeStore } from '@/shared/stores/theme'
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
              newWorker.postMessage({ type: 'SKIP_WAITING' })
            }
          })
        }
      })
      if (registration.waiting && navigator.serviceWorker.controller) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    })
    .catch(() => {})
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone
if (typeof document !== 'undefined') {
  let hiddenAt = 0
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') hiddenAt = Date.now()
    if (document.visibilityState === 'visible' && isStandalone() && hiddenAt && Date.now() - hiddenAt > 60 * 1000) {
      window.location.reload()
    }
  })
}
