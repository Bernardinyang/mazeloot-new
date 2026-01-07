import Pusher from 'pusher-js'

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

    const options = {
      cluster,
      encrypted: true,
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

  const unsubscribe = (channelName) => {
    if (!pusherInstance) return
    pusherInstance.unsubscribe(channelName)
  }

  return {
    getPusher,
    subscribe,
    unsubscribe,
  }
}
