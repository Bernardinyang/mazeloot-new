/**
 * API Client with interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import { useUserStore } from '@/shared/stores/user'
import { API_CONFIG } from './config'

class ApiClient {
  constructor(baseURL) {
    // Use provided baseURL, or fall back to API_CONFIG (which auto-detects env)
    this.baseURL = baseURL || API_CONFIG.API_BASE_URL
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

    if (response.status === 401 || response.status === 403) {
      const { useUserStore } = await import('@/shared/stores/user')
      const userStore = useUserStore()
      userStore.clearAuth()

      // Only redirect if not already on auth pages or public routes
      // Use window.location for hard redirect to reset app state properly
      const currentPath = window.location.pathname
      const isOnAuthPage =
        currentPath.includes('/login') ||
        currentPath.includes('/register') ||
        currentPath.includes('/verify-email') ||
        currentPath.includes('/forgot-password') ||
        currentPath.includes('/reset-password')

      // Check if it's a public route (client selection/proofing/collection routes)
      const isPublicRoute =
        currentPath.startsWith('/p/') || currentPath === '/' || currentPath === '/about'

      if (!isOnAuthPage && !isPublicRoute) {
        window.location.href = '/login'
      }
    }

    if (!response.ok) {
      // Always prioritize backend error message
      const error = {
        message: data?.message || data?.error || `Request failed with status ${response.status}`,
        code: data?.code,
        status: response.status,
        errors: data?.errors,
        // Store raw response for direct access to backend message
        response: {
          data: data,
          status: response.status,
        },
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
      Accept: 'application/json',
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

  /**
   * Upload multiple files with progress tracking
   * @param {string} endpoint - API endpoint
   * @param {File[]} files - Array of files to upload
   * @param {object} options - Upload options
   * @param {function} options.onProgress - Progress callback: (fileIndex, loaded, total) => void
   * @param {AbortSignal} options.signal - Abort signal for cancellation
   * @returns {Promise} Response with array of upload results
   */
  async uploadMultiple(endpoint, files, options = {}) {
    const { skipAuth = false, onProgress, signal, ...fetchOptions } = options

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

    // If progress tracking is needed, use XMLHttpRequest
    if (onProgress || signal) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()

        // Append all files
        files.forEach(file => {
          formData.append('files[]', file)
        })

        if (signal) {
          signal.addEventListener('abort', () => {
            xhr.abort()
            reject(new DOMException('Upload cancelled', 'AbortError'))
          })
        }

        // Track progress
        if (onProgress) {
          xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
              // Calculate total progress across all files
              const totalSize = files.reduce((sum, file) => sum + file.size, 0)
              const loaded = e.loaded
              const total = e.total || totalSize

              // Call progress callback for overall progress
              // For per-file progress, we'd need to upload files individually
              onProgress(-1, loaded, total)
            }
          })
        }

        xhr.addEventListener('load', async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const contentType = xhr.getResponseHeader('content-type')
              const isJson = contentType?.includes('application/json')
              const data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText

              if (data?.data !== undefined) {
                resolve({ data: data.data, status: xhr.status, statusText: xhr.statusText })
              } else {
                resolve({ data, status: xhr.status, statusText: xhr.statusText })
              }
            } catch (error) {
              reject({
                message: 'Failed to parse response',
                code: 'PARSE_ERROR',
                status: xhr.status,
              })
            }
          } else {
            try {
              const contentType = xhr.getResponseHeader('content-type')
              const isJson = contentType?.includes('application/json')
              const data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText

              const error = {
                message: data?.message || data?.error || `Request failed with status ${xhr.status}`,
                code: data?.code,
                status: xhr.status,
                errors: data?.errors,
              }
              reject(error)
            } catch (parseError) {
              reject({
                message: `Request failed with status ${xhr.status}`,
                code: 'HTTP_ERROR',
                status: xhr.status,
              })
            }
          }
        })

        xhr.addEventListener('error', () => {
          reject({
            message: 'Network error. Please check your connection.',
            code: 'NETWORK_ERROR',
            status: 0,
          })
        })

        xhr.addEventListener('abort', () => {
          reject(new DOMException('Upload cancelled', 'AbortError'))
        })

        xhr.open('POST', url)

        const authHeader = !skipAuth ? this.getAuthHeader() : null
        if (authHeader) {
          xhr.setRequestHeader('Authorization', authHeader)
        }

        // Don't set Content-Type header - let browser set it with boundary for FormData
        xhr.send(formData)
      })
    }

    // Fallback to fetch if no progress tracking needed
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files[]', file)
    })

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
        signal,
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

  /**
   * Upload a single file with progress tracking
   * @param {string} endpoint - API endpoint
   * @param {File} file - File to upload
   * @param {object} options - Upload options
   * @param {function} options.onProgress - Progress callback: (loaded, total) => void
   * @param {AbortSignal} options.signal - Abort signal for cancellation
   * @returns {Promise} Response with upload result
   */
  async uploadWithProgress(endpoint, file, options = {}) {
    const { skipAuth = false, onProgress, signal } = options

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)

      if (signal) {
        signal.addEventListener('abort', () => {
          xhr.abort()
          reject(new DOMException('Upload cancelled', 'AbortError'))
        })
      }

      // Track progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', e => {
          if (e.lengthComputable) {
            onProgress(e.loaded, e.total)
          }
        })
      }

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const contentType = xhr.getResponseHeader('content-type')
            const isJson = contentType?.includes('application/json')
            const data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText

            if (data?.data !== undefined) {
              resolve({ data: data.data, status: xhr.status, statusText: xhr.statusText })
            } else {
              resolve({ data, status: xhr.status, statusText: xhr.statusText })
            }
          } catch (error) {
            reject({
              message: 'Failed to parse response',
              code: 'PARSE_ERROR',
              status: xhr.status,
            })
          }
        } else {
          try {
            const contentType = xhr.getResponseHeader('content-type')
            const isJson = contentType?.includes('application/json')
            const data = isJson ? JSON.parse(xhr.responseText) : xhr.responseText

            const error = {
              message: data?.message || data?.error || `Request failed with status ${xhr.status}`,
              code: data?.code,
              status: xhr.status,
              errors: data?.errors,
            }
            reject(error)
          } catch (parseError) {
            reject({
              message: `Request failed with status ${xhr.status}`,
              code: 'HTTP_ERROR',
              status: xhr.status,
            })
          }
        }
      })

      xhr.addEventListener('error', () => {
        reject({
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          status: 0,
        })
      })

      xhr.addEventListener('abort', () => {
        reject(new DOMException('Upload cancelled', 'AbortError'))
      })

      xhr.open('POST', url)

      const authHeader = !skipAuth ? this.getAuthHeader() : null
      if (authHeader) {
        xhr.setRequestHeader('Authorization', authHeader)
      }

      xhr.send(formData)
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
