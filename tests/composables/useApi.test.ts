import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useApi } from '@/composables/useApi'

// Mock apiClient
vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('useApi Composable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with loading state', () => {
    const { isLoading } = useApi()

    expect(isLoading.value).toBe(false)
  })

  it('should handle successful request', async () => {
    const { apiClient } = await import('@/api/client')
    ;(apiClient.get as any).mockResolvedValueOnce({
      data: { id: 1, name: 'Test' },
      status: 200,
      statusText: 'OK',
    })

    const { request, isLoading } = useApi({ key: 'test' })

    const promise = request('get', '/test')

    expect(isLoading.value).toBe(true)

    const result = await promise

    expect(isLoading.value).toBe(false)
    expect(result?.data).toEqual({ id: 1, name: 'Test' })
  })

  it('should handle request errors', async () => {
    const { apiClient } = await import('@/api/client')
    ;(apiClient.get as any).mockRejectedValueOnce(new Error('Request failed'))

    const { request, error } = useApi({ key: 'test' })

    try {
      await request('get', '/test')
    } catch (e) {
      // Expected to throw
    }

    expect(error.value).toBeTruthy()
  })

  it('should cancel request on unmount', () => {
    const { cancel } = useApi({ key: 'test' })

    expect(() => cancel()).not.toThrow()
  })
})
