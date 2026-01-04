<template>
  <div
    v-if="showDebug"
    class="fixed top-4 left-4 z-50 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 text-xs"
  >
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-semibold">PWA Debug Info</h3>
      <button @click="showDebug = false" class="text-gray-500 hover:text-gray-700">×</button>
    </div>
    <div class="space-y-1">
      <div><strong>Service Worker:</strong> {{ swStatus }}</div>
      <div><strong>Installable:</strong> {{ isInstallable ? 'Yes' : 'No' }}</div>
      <div><strong>Installed:</strong> {{ isInstalled ? 'Yes' : 'No' }}</div>
      <div><strong>Standalone:</strong> {{ isStandalone ? 'Yes' : 'No' }}</div>
      <div><strong>Icons:</strong> {{ iconStatus }}</div>
      <div><strong>Manifest:</strong> {{ manifestStatus }}</div>
    </div>
    <button
      @click="checkIcons"
      class="mt-2 px-2 py-1 bg-purple-500 text-white rounded text-xs"
    >
      Check Icons
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePWAInstall } from '@/composables/usePWAInstall'

const { isInstallable, isInstalled } = usePWAInstall()
const showDebug = ref(false)
const swStatus = ref('Checking...')
const iconStatus = ref('Checking...')
const manifestStatus = ref('Checking...')

const isStandalone = computed(() => {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
})

const checkIcons = async () => {
  const icons = ['/icon-192.png', '/icon-512.png']
  const results = []
  
  for (const icon of icons) {
    try {
      const response = await fetch(icon, { method: 'HEAD' })
      results.push(`${icon}: ${response.ok ? '✓' : '✗'} (${response.status})`)
    } catch (error) {
      results.push(`${icon}: ✗ Error`)
    }
  }
  
  iconStatus.value = results.join(', ')
}

const checkManifest = async () => {
  try {
    const response = await fetch('/manifest.json')
    if (response.ok) {
      const manifest = await response.json()
      manifestStatus.value = `✓ Loaded (${manifest.icons?.length || 0} icons)`
    } else {
      manifestStatus.value = `✗ Failed (${response.status})`
    }
  } catch (error) {
    manifestStatus.value = '✗ Error'
  }
}

onMounted(() => {
  // Show debug panel if ?pwa-debug is in URL
  if (window.location.search.includes('pwa-debug')) {
    showDebug.value = true
  }

  // Check service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(reg => {
      swStatus.value = reg ? '✓ Registered' : '✗ Not registered'
    })
  } else {
    swStatus.value = '✗ Not supported'
  }

  // Check icons and manifest
  checkIcons()
  checkManifest()
})
</script>

