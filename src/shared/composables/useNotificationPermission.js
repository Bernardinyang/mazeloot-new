import { ref, onMounted } from 'vue'

export function useNotificationPermission() {
  const permission = ref('default')
  const supported = ref(false)

  onMounted(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      supported.value = true
      permission.value = Notification.permission
    }
  })

  const requestPermission = async () => {
    if (!supported.value) return permission.value
    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result
    } catch (err) {
      console.error('Notification permission request failed:', err)
      return permission.value
    }
  }

  const syncPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      supported.value = true
      permission.value = Notification.permission
    }
  }

  return {
    supported,
    permission,
    requestPermission,
    syncPermission,
  }
}
