import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient } from '@/shared/api/client'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/shared/stores/user'

// Mock fetch
global.fetch = vi.fn()

describe('API Client', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('GET request', () => {
    it('should make GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' }
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockData }),
      })

      const response = await apiClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      )
      expect(response.data).toEqual(mockData)
      expect(response.status).toBe(200)
    })

    it('should include auth header when user is authenticated', async () => {
      const store = useUserStore()
      store.token = 'test-token'
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: {} }),
      })

      await apiClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
    })

    it('should skip auth header when skipAuth is true', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: {} }),
      })

      await apiClient.get('/test', { skipAuth: true })

      const callArgs = (fetch as any).mock.calls[0][1]
      expect(callArgs.headers).not.toHaveProperty('Authorization')
    })
  })

  describe('POST request', () => {
    it('should make POST request with data', async () => {
      const requestData = { name: 'Test' }
      const mockData = { id: 1, ...requestData }

      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ data: mockData }),
      })

      const response = await apiClient.post('/test', requestData)

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      )
      expect(response.data).toEqual(mockData)
    })
  })

  describe('Error handling', () => {
    it('should handle API errors', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          message: 'Validation failed',
          errors: { email: ['Email is required'] },
        }),
      })

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        message: 'Validation failed',
        status: 400,
        errors: { email: ['Email is required'] },
      })
    })

    it('should handle network errors', async () => {
      ;(fetch as any).mockRejectedValueOnce(new TypeError('Failed to fetch'))

      await expect(apiClient.get('/test')).rejects.toMatchObject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      })
    })
  })
})
