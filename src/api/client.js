/**
 * API Client with interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import { useUserStore } from '@/stores/user'

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || '/api'
  }

  /**
   * Get authorization header
   */
  getAuthHeader() {
    const userStore = useUserStore()
    const token = userStore.token
    return token ? `Bearer ${token}` : null
  }

  /**
   * Handle response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    let data
    try {
      data = isJson ? await response.json() : await response.text()
    } catch (error) {
      data = null
    }

    // Handle 401/403 - authentication errors
    if (response.status === 401 || response.status === 403) {
      const { useUserStore } = await import('@/stores/user')
      const userStore = useUserStore()
      userStore.clearAuth()

      // Only redirect if not already on auth pages
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        window.location.href = '/login'
      }
    }

    if (!response.ok) {
      const error = {
        message: data?.message || data?.error || `Request failed with status ${response.status}`,
        code: data?.code,
        status: response.status,
        errors: data?.errors,
      }
      throw error
    }

    return {
      data: data?.data !== undefined ? data.data : data,
      status: response.status,
      statusText: response.statusText,
    }
  }

  /**
   * Make request
   */
  async request(endpoint, options = {}) {
    const { skipAuth = false, skipErrorHandling = false, signal, ...fetchOptions } = options

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

    const headers = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers || {}),
    }

    // Add auth header if not skipped
    if (!skipAuth) {
      const authHeader = this.getAuthHeader()
      if (authHeader) {
        headers['Authorization'] = authHeader
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal, // Support AbortSignal
      })

      // Check if request was aborted
      if (signal?.aborted) {
        throw new DOMException('Request aborted', 'AbortError')
      }

      return await this.handleResponse(response)
    } catch (error) {
      // Don't throw error if request was aborted
      if (error.name === 'AbortError' || signal?.aborted) {
        throw error
      }

      // Network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          status: 0,
        }
      }

      // Re-throw if it's already an ApiError
      if (error.status !== undefined || error.message) {
        throw error
      }

      // Unknown error
      throw {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status: 0,
      }
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * Upload file
   */
  async upload(endpoint, file, options) {
    const { skipAuth = false, ...fetchOptions } = options || {}

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

    const formData = new FormData()
    formData.append('file', file)

    const headers = {
      ...(fetchOptions.headers || {}),
    }

    // Add auth header if not skipped
    if (!skipAuth) {
      const authHeader = this.getAuthHeader()
      if (authHeader) {
        headers['Authorization'] = authHeader
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: 'POST',
        headers,
        body: formData,
      })

      return await this.handleResponse(response)
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          status: 0,
        }
      }

      throw error
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
