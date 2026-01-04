import { ref, onMounted } from 'vue'

export function usePWAInstall() {
  const deferredPrompt = ref(null)
  const isInstallable = ref(false)
  const isInstalled = ref(false)

  onMounted(async () => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      isInstalled.value = true
      return
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      isInstallable.value = true
    })

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      isInstallable.value = false
      deferredPrompt.value = null
    })
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

