import { ref, onUnmounted, watch } from 'vue'

/**
 * Composable for real-time comment updates
 * Supports WebSocket (Pusher) with fallback to polling
 */
export function useRealtimeComments(mediaId, options = {}) {
  const {
    onCommentCreated = () => {},
    onCommentUpdated = () => {},
    onCommentDeleted = () => {},
    pollingInterval = 3000, // 3 seconds
    enablePolling = true,
  } = options

  const isConnected = ref(false)
  const connectionType = ref(null) // 'websocket' | 'polling' | null
  const pollingIntervalId = ref(null)
  const pusherInstance = ref(null)
  const channel = ref(null)

  /**
   * Initialize WebSocket connection (Pusher)
   */
  const initWebSocket = async () => {
    try {
      // Check if Pusher is available
      if (typeof window.Pusher === 'undefined') {
        console.warn('Pusher not available, falling back to polling')
        if (enablePolling) {
          startPolling()
        }
        return
      }

      // Get Pusher config from environment or use defaults
      const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY
      const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1'
      const pusherHost = import.meta.env.VITE_PUSHER_HOST
      const pusherPort = import.meta.env.VITE_PUSHER_PORT || 443
      const pusherScheme = import.meta.env.VITE_PUSHER_SCHEME || 'https'

      if (!pusherKey) {
        console.warn('Pusher key not configured, falling back to polling')
        if (enablePolling) {
          startPolling()
        }
        return
      }

      const Pusher = window.Pusher
      pusherInstance.value = new Pusher(pusherKey, {
        cluster: pusherCluster,
        host: pusherHost,
        port: pusherPort,
        encrypted: pusherScheme === 'https',
        enabledTransports: ['ws', 'wss'],
      })

      // Subscribe to media feedback channel
      channel.value = pusherInstance.value.subscribe(`media.${mediaId}.feedback`)

      // Listen for comment events
      channel.value.bind('feedback.created', data => {
        onCommentCreated(data.feedback)
      })

      channel.value.bind('feedback.updated', data => {
        onCommentUpdated(data.feedback)
      })

      // Handle connection events
      pusherInstance.value.connection.bind('connected', () => {
        isConnected.value = true
        connectionType.value = 'websocket'
        console.log('WebSocket connected for comments')
      })

      pusherInstance.value.connection.bind('disconnected', () => {
        isConnected.value = false
        console.warn('WebSocket disconnected, falling back to polling')
        if (enablePolling) {
          startPolling()
        }
      })

      pusherInstance.value.connection.bind('error', error => {
        console.error('WebSocket error:', error)
        if (enablePolling && connectionType.value !== 'polling') {
          startPolling()
        }
      })

      connectionType.value = 'websocket'
      isConnected.value = true
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      if (enablePolling) {
        startPolling()
      }
    }
  }

  /**
   * Start polling for updates
   */
  const startPolling = () => {
    if (pollingIntervalId.value) {
      clearInterval(pollingIntervalId.value)
    }

    connectionType.value = 'polling'
    isConnected.value = true

    // Poll immediately, then at intervals
    pollForUpdates()

    pollingIntervalId.value = setInterval(() => {
      pollForUpdates()
    }, pollingInterval)
  }

  /**
   * Poll for comment updates
   * This would typically fetch the latest comments from the API
   * For now, it's a placeholder that the parent component should override
   */
  const pollForUpdates = async () => {
    // This should be implemented by the parent component
    // by providing a fetchComments callback
    if (options.fetchComments) {
      try {
        await options.fetchComments()
      } catch (error) {
        console.error('Failed to poll for comments:', error)
      }
    }
  }

  /**
   * Stop polling
   */
  const stopPolling = () => {
    if (pollingIntervalId.value) {
      clearInterval(pollingIntervalId.value)
      pollingIntervalId.value = null
    }
  }

  /**
   * Disconnect WebSocket
   */
  const disconnectWebSocket = () => {
    if (channel.value) {
      channel.value.unbind_all()
      channel.value.unsubscribe()
      channel.value = null
    }

    if (pusherInstance.value) {
      pusherInstance.value.disconnect()
      pusherInstance.value = null
    }
  }

  /**
   * Initialize connection
   */
  const connect = () => {
    // Try WebSocket first, fallback to polling
    initWebSocket()
  }

  /**
   * Disconnect
   */
  const disconnect = () => {
    stopPolling()
    disconnectWebSocket()
    isConnected.value = false
    connectionType.value = null
  }

  // Watch mediaId changes and reconnect
  watch(
    () => mediaId,
    (newId, oldId) => {
      if (newId && newId !== oldId) {
        disconnect()
        connect()
      }
    }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connectionType,
    connect,
    disconnect,
    startPolling,
    stopPolling,
  }
}
