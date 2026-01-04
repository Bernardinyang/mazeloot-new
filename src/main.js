import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import './assets/styles/animations.css'
import 'vue-sonner/style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize theme store to apply theme on mount
import { useThemeStore } from './stores/theme'
useThemeStore() // Initialize theme store

app.mount('#app')

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  // Register immediately, don't wait for load
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then((registration) => {
      console.log('Service Worker registered:', registration.scope)
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available. Refresh to update.')
            }
          })
        }
      })
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error)
    })
  
  // Listen for controller changes (when new SW takes control)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker controller changed')
  })
}
