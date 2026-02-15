import { ref, onMounted, onUnmounted } from 'vue'

const PWA_UPDATE_EVENT = 'pwa-update-available'
const PWA_UPDATE_DISMISSED_KEY = 'pwa-update-dismissed-at'
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000

function isDismissedRecently() {
  if (typeof localStorage === 'undefined') return false
  const raw = localStorage.getItem(PWA_UPDATE_DISMISSED_KEY)
  if (!raw) return false
  const at = parseInt(raw, 10)
  return Number.isFinite(at) && Date.now() - at < DISMISS_TTL_MS
}

export function usePWAUpdate() {
  const updateAvailable = ref(false)
  let registrationRef = null

  const handleUpdate = (e) => {
    if (e.detail?.registration && !isDismissedRecently()) {
      registrationRef = e.detail.registration
      updateAvailable.value = true
    }
  }

  const applyUpdate = () => {
    if (registrationRef?.waiting) {
      registrationRef.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  const dismiss = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PWA_UPDATE_DISMISSED_KEY, String(Date.now()))
    }
    updateAvailable.value = false
  }

  onMounted(() => {
    window.addEventListener(PWA_UPDATE_EVENT, handleUpdate)
  })

  onUnmounted(() => {
    window.removeEventListener(PWA_UPDATE_EVENT, handleUpdate)
  })

  return {
    updateAvailable,
    applyUpdate,
    dismiss,
  }
}

export function dispatchPWAUpdateAvailable(registration) {
  window.dispatchEvent(new CustomEvent(PWA_UPDATE_EVENT, { detail: { registration } }))
}
