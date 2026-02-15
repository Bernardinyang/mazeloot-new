import { useNotificationsApi } from '@/shared/api/notifications'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i)
  }
  return output
}

export function usePushSubscription() {
  const notificationsApi = useNotificationsApi()

  const getVapidPublicKey = async () => {
    const envKey = typeof import.meta !== 'undefined' && import.meta.env?.VITE_VAPID_PUBLIC_KEY
    if (envKey) return envKey
    return notificationsApi.getPushVapidPublic()
  }

  const subscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push not supported')
    }
    const reg = await navigator.serviceWorker.ready
    const publicKey = await getVapidPublicKey()
    if (!publicKey) throw new Error('VAPID public key not available')
    const applicationServerKey = urlBase64ToUint8Array(publicKey)
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
    await notificationsApi.storePushSubscription(subscription)
    return subscription
  }

  const unsubscribe = async () => {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready
    const subscription = await reg.pushManager.getSubscription()
    if (subscription) {
      await notificationsApi.destroyPushSubscription(subscription.endpoint)
      await subscription.unsubscribe()
    }
  }

  return { subscribe, unsubscribe }
}
