/**
 * useApi composable
 * Provides API calls with cancellation, retry, and caching
 */

import { ref, onUnmounted } from 'vue'
import { requestCanceller } from '@/utils/abortController'
import { apiClient } from '@/api/client'

const cache = new Map()

/**
 * Get cached response if available and not expired
 */
function getCached(key, ttl) {
  const cached = cache.get(key)
  if (!cached) return null

  const now = Date.now()
  if (now - cached.timestamp > ttl) {
    cache.delete(key)
    return null
  }

  return cached.data
}

/**
 * Set cache
 */
function setCache(key, data, ttl) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  })
}

/**
 * Retry a function with exponential backoff
 */
async function retry(fn, retries, delay, signal) {
  try {
    return await fn()
  } catch (error) {
    // Don't retry if aborted
    if (signal?.aborted) {
      throw error
    }

    // Don't retry on 4xx errors (client errors)
    if (error?.status && error.status >= 400 && error.status < 500) {
      throw error
    }

    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
      return retry(fn, retries - 1, delay * 2, signal) // Exponential backoff
    }

    throw error
  }
}

export function useApi(options = {}) {
  const isLoading = ref(false)
  const error = ref(null)
  const requestKey = options.key || `api-${Date.now()}`

  /**
   * Make API request with retry and caching
   */
  const request = async (method, endpoint, data, callOptions = {}) => {
    // Check cache first
    if (options.cache && method === 'get') {
      const cached = getCached(requestKey, options.cacheTTL || 60000)
      if (cached) {
        return cached
      }
    }

    isLoading.value = true
    error.value = null

    // Create abort signal
    const signal = requestCanceller.create(requestKey)

    try {
      const makeRequest = async () => {
        switch (method) {
          case 'get':
            return await apiClient.get(endpoint, { ...callOptions, signal })
          case 'post':
            return await apiClient.post(endpoint, data, { ...callOptions, signal })
          case 'put':
            return await apiClient.put(endpoint, data, { ...callOptions, signal })
          case 'patch':
            return await apiClient.patch(endpoint, data, { ...callOptions, signal })
          case 'delete':
            return await apiClient.delete(endpoint, { ...callOptions, signal })
        }
      }

      const retries = callOptions.retries ?? options.retries ?? 0
      const retryDelay = callOptions.retryDelay ?? options.retryDelay ?? 1000

      const response = await retry(makeRequest, retries, retryDelay, signal)

      // Cache response if enabled
      if (options.cache && method === 'get' && response) {
        setCache(requestKey, response, options.cacheTTL || 60000)
      }

      return response
    } catch (err) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError' || signal.aborted) {
        return null
      }

      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Cancel the current request
   */
  const cancel = () => {
    requestCanceller.cancel(requestKey)
    isLoading.value = false
  }

  /**
   * Clear cache for this request
   */
  const clearCache = () => {
    cache.delete(requestKey)
  }

  // Cleanup on unmount
  onUnmounted(() => {
    cancel()
  })

  return {
    isLoading,
    error,
    request,
    cancel,
    clearCache,
  }
}
