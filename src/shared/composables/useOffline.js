import { ref, onMounted, onUnmounted } from 'vue'

export function useOffline() {
  const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false)

  const update = () => {
    isOffline.value = !navigator.onLine
  }

  onMounted(() => {
    window.addEventListener('offline', update)
    window.addEventListener('online', update)
  })

  onUnmounted(() => {
    window.removeEventListener('offline', update)
    window.removeEventListener('online', update)
  })

  return { isOffline }
}
