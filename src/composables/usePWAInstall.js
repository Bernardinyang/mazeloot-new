import { ref, onMounted } from 'vue'

export function usePWAInstall() {
  const deferredPrompt = ref(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)

  onMounted(async () => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      isInstalled.value = true
      console.log('[PWA] App is already installed')
      return
    }

    // Immediate debug checks
    console.log('[PWA Debug] Starting PWA checks...')
    console.log('[PWA Debug] Service Worker support:', 'serviceWorker' in navigator)
    console.log('[PWA Debug] Location:', location.href)
    console.log('[PWA Debug] Protocol:', location.protocol)
    console.log('[PWA Debug] Hostname:', location.hostname)
    
    // Check manifest immediately
    try {
      const manifestResponse = await fetch('/manifest.json')
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json()
        console.log('[PWA Debug] Manifest loaded:', {
          name: manifest.name,
          icons: manifest.icons?.length || 0,
          start_url: manifest.start_url,
          display: manifest.display
        })
        
        // Check each icon
        if (manifest.icons && manifest.icons.length > 0) {
          for (const icon of manifest.icons) {
            try {
              const iconResponse = await fetch(icon.src, { method: 'HEAD' })
              console.log(`[PWA Debug] Icon ${icon.src}:`, iconResponse.ok ? '✓ OK' : `✗ Failed (${iconResponse.status})`)
            } catch (error) {
              console.log(`[PWA Debug] Icon ${icon.src}:`, '✗ Error', error.message)
            }
          }
        }
      } else {
        console.log('[PWA Debug] ✗ Manifest failed:', manifestResponse.status)
      }
    } catch (error) {
      console.log('[PWA Debug] ✗ Manifest error:', error.message)
    }

    // Check service worker
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        console.log('[PWA Debug] SW Registered:', !!reg)
        if (reg) {
          console.log('[PWA Debug] SW Scope:', reg.scope)
          console.log('[PWA Debug] SW State:', reg.active?.state || 'no active worker')
        }
      } catch (error) {
        console.log('[PWA Debug] SW Check error:', error.message)
      }
    }

    // Listen for beforeinstallprompt event
    // This event only fires when ALL PWA criteria are met
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] ✓ beforeinstallprompt event fired!')
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
      console.log('[PWA Debug] Installable set to: true')
    })

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] ✓ App installed successfully')
      isInstalled.value = true
      isInstallable.value = false
      deferredPrompt.value = null
    })

    // Log final status after a delay
    setTimeout(() => {
      console.log('[PWA Debug] Final Status:')
      console.log('[PWA Debug] - Installable:', isInstallable.value)
      console.log('[PWA Debug] - Installed:', isInstalled.value)
      console.log('[PWA Debug] - DeferredPrompt:', !!deferredPrompt.value)
      
      if (!isInstallable.value) {
        console.log('[PWA Debug] ⚠ Install prompt not available. Possible reasons:')
        console.log('[PWA Debug]   1. Browser already dismissed the prompt (clear site data)')
        console.log('[PWA Debug]   2. App already installed (check standalone mode)')
        console.log('[PWA Debug]   3. Missing icons or manifest issues (check above)')
        console.log('[PWA Debug]   4. Not meeting all PWA criteria')
        console.log('[PWA Debug]   Try: DevTools → Application → Clear storage → Clear site data')
      }
    }, 2000)
  })

  const install = async () => {
    if (!deferredPrompt.value) {
      return false
    }

    try {
      deferredPrompt.value.prompt()
      const { outcome } = await deferredPrompt.value.userChoice
      
      if (outcome === 'accepted') {
        isInstalled.value = true
        isInstallable.value = false
      }
      
      deferredPrompt.value = null
      return outcome === 'accepted'
    } catch (error) {
      console.error('Error installing PWA:', error)
      return false
    }
  }

  return {
    isInstallable,
    isInstalled,
    install,
  }
}

