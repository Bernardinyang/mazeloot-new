import Pusher from 'pusher-js'
import { useUserStore } from '@/shared/stores/user'
import { API_CONFIG } from '@/shared/api/config'

let pusherInstance = null

export const usePusher = () => {
  const getPusher = () => {
    if (pusherInstance) {
      return pusherInstance
    }

    const appKey = import.meta.env.VITE_PUSHER_APP_KEY
    const cluster = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'us2'
    const host = import.meta.env.VITE_PUSHER_HOST
    const port = import.meta.env.VITE_PUSHER_PORT || 443
    const scheme = import.meta.env.VITE_PUSHER_SCHEME || 'https'

    if (!appKey) {
      console.warn('Pusher app key not configured')
      return null
    }

    const userStore = useUserStore()
    const token = userStore.token

    const options = {
      cluster,
      encrypted: true,
    }
    if (token) {
      const apiBaseUrl = API_CONFIG.API_BASE_URL || ''
      const backendBaseUrl = apiBaseUrl.replace(/\/api$/, '') || window.location.origin
      options.authEndpoint = `${backendBaseUrl}/broadcasting/auth`
      options.auth = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    }

    if (host) {
      options.wsHost = host
      options.wsPort = port
      options.wssPort = port
      options.enabledTransports = ['ws', 'wss']
    }

    pusherInstance = new Pusher(appKey, options)
    return pusherInstance
  }

  const subscribe = (channelName, eventName, callback) => {
    const pusher = getPusher()
    if (!pusher) return null

    const channel = pusher.subscribe(channelName)
    channel.bind(eventName, callback)
    return channel
  }

  const subscribePrivate = async (channelName, eventName, callback) => {
    const pusher = getPusher()
    if (!pusher) {
      console.warn('Pusher not available')
      return null
    }

    try {
      const channel = pusher.subscribe(channelName)
      
      // Wait for subscription to succeed before binding events
      return new Promise((resolve, reject) => {
        // Set a timeout to avoid hanging forever
        const timeout = setTimeout(() => {
          console.warn('Pusher subscription timeout for:', channelName)
          // Still bind the event in case subscription succeeded but event didn't fire
          channel.bind(eventName, callback)
          resolve(channel)
        }, 5000)

        const onSuccess = () => {
          clearTimeout(timeout)
          // Subscription successful, now bind the event
          channel.bind(eventName, callback)
          console.log('Pusher subscription succeeded:', channelName)
          resolve(channel)
        }

        const onError = (error) => {
          clearTimeout(timeout)
          console.error('Pusher subscription error:', error, 'for channel:', channelName)
          reject(error)
        }

        // Bind to subscription events
        channel.bind('pusher:subscription_succeeded', onSuccess)
        channel.bind('pusher:subscription_error', onError)

        // If already subscribed, resolve immediately
        if (channel.subscribed) {
          clearTimeout(timeout)
          channel.unbind('pusher:subscription_succeeded', onSuccess)
          channel.unbind('pusher:subscription_error', onError)
          channel.bind(eventName, callback)
          resolve(channel)
        }
      })
    } catch (error) {
      console.error('Failed to subscribe to private channel:', error)
      return null
    }
  }

  const unsubscribe = (channelName) => {
    if (!pusherInstance) return
    pusherInstance.unsubscribe(channelName)
  }

  return {
    getPusher,
    subscribe,
    subscribePrivate,
    unsubscribe,
  }
}
