<template>
  <div
    v-if="(isInstallable || showManualInstall) && !isInstalled && !isDismissed"
    class="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 animate-in"
  >
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Download class="h-5 w-5 text-white" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          Install Mazeloot
        </h3>
        <p class="text-xs text-gray-600 dark:text-gray-300 mb-3">
          Install our app for a better experience with offline access and faster loading.
        </p>
        <div class="flex gap-2">
          <Button
            size="sm"
            @click="handleInstall"
            class="flex-1"
            :disabled="!isInstallable && !showManualInstall"
          >
            {{ isInstallable ? 'Install' : 'Show Instructions' }}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            @click="dismiss"
            class="flex-1"
          >
            Later
          </Button>
        </div>
        <div v-if="!isInstallable && showManualInstall" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <p class="mb-1">Install manually:</p>
          <ul class="list-disc list-inside space-y-0.5">
            <li v-if="isChrome">Click the install icon (⊕) in the address bar</li>
            <li v-if="isChrome">Or go to menu (⋮) → "Install Mazeloot"</li>
            <li v-if="isIOS">Tap Share → "Add to Home Screen"</li>
            <li v-if="isAndroid">Tap menu (⋮) → "Install app"</li>
          </ul>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        class="flex-shrink-0 h-6 w-6 p-0"
        @click="dismiss"
      >
        <X class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Download, X } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { usePWAInstall } from '@/composables/usePWAInstall'

const { isInstallable, isInstalled, install } = usePWAInstall()
const isDismissed = ref(false)
const showManualInstall = ref(false)

const isChrome = computed(() => {
  return /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent)
})

const isIOS = computed(() => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
})

const isAndroid = computed(() => {
  return /Android/.test(navigator.userAgent)
})

// Check if we should show manual install instructions
const isStandalone = computed(() => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone ||
         (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
})

const handleInstall = async () => {
  if (isInstallable.value) {
    const success = await install()
    if (success) {
      isDismissed.value = true
    }
  } else {
    // Show manual install instructions
    showManualInstallInstructions()
  }
}

const showManualInstallInstructions = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isAndroid = /Android/.test(navigator.userAgent)
  const isChrome = /Chrome/.test(navigator.userAgent) && !isIOS
  
  let message = ''
  if (isIOS) {
    message = 'Tap the Share button, then "Add to Home Screen"'
  } else if (isAndroid && isChrome) {
    message = 'Tap the menu (⋮) and select "Install app" or look for the install icon in the address bar'
  } else if (isChrome) {
    message = 'Click the install icon (⊕) in the address bar, or go to menu → "Install Mazeloot"'
  } else {
    message = 'Use your browser\'s menu to install this app'
  }
  
  alert(message)
}

const dismiss = () => {
  isDismissed.value = true
  // Store dismissal in localStorage to prevent showing again for a while
  localStorage.setItem('pwa-install-dismissed', Date.now().toString())
}

onMounted(() => {
  // Check if app is already installed
  if (isStandalone.value) {
    return
  }

  // Check if user dismissed recently (within 7 days)
  const dismissed = localStorage.getItem('pwa-install-dismissed')
  if (dismissed) {
    const dismissedTime = parseInt(dismissed, 10)
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - dismissedTime < sevenDays) {
      isDismissed.value = true
      return
    }
  }

  // Show manual install option if beforeinstallprompt doesn't fire after a delay
  setTimeout(() => {
    if (!isInstallable.value && !isInstalled.value && !isDismissed.value) {
      // Check if service worker is registered (PWA criteria met)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            // Also check if manifest is accessible
            fetch('/manifest.json')
              .then(res => res.json())
              .then(manifest => {
                if (manifest.icons && manifest.icons.length > 0) {
                  showManualInstall.value = true
                }
              })
              .catch(() => {
                showManualInstall.value = true
              })
          }
        })
      }
    }
  }, 3000)
})
</script>

<style scoped>
.animate-in {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

