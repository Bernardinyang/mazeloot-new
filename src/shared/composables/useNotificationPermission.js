import { ref, computed } from 'vue'

export function useNotificationPermission() {
  const permission = ref(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  )

  const supported = computed(
    () => typeof window !== 'undefined' && 'Notification' in window
  )

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
    if (supported.value) permission.value = Notification.permission
  }

  return {
    supported,
    permission,
    requestPermission,
    syncPermission,
  }
}
