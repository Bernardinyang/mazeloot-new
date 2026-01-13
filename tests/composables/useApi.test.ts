import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useApi } from '@/shared/composables/useApi'

// Mock apiClient
vi.mock('@/shared/api/client', () => ({
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
    const TestComponent = defineComponent({
      setup() {
        const { isLoading } = useApi()
        return { isLoading }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.isLoading).toBe(false)
    wrapper.unmount()
  })

  it('should handle successful request', async () => {
      const { apiClient } = await import('@/shared/api/client')
    ;(apiClient.get as any).mockResolvedValueOnce({
      data: { id: 1, name: 'Test' },
      status: 200,
      statusText: 'OK',
    })

    const TestComponent = defineComponent({
      setup() {
        const { request, isLoading } = useApi({ key: 'test' })
        return { request, isLoading }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)
    const promise = wrapper.vm.request('get', '/test')

    expect(wrapper.vm.isLoading).toBe(true)

    const result = await promise

    expect(wrapper.vm.isLoading).toBe(false)
    expect(result?.data).toEqual({ id: 1, name: 'Test' })
    wrapper.unmount()
  })

  it('should handle request errors', async () => {
      const { apiClient } = await import('@/shared/api/client')
    ;(apiClient.get as any).mockRejectedValueOnce(new Error('Request failed'))

    const TestComponent = defineComponent({
      setup() {
        const { request, error } = useApi({ key: 'test' })
        return { request, error }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    try {
      await wrapper.vm.request('get', '/test')
    } catch (e) {
      // Expected to throw
    }

    expect(wrapper.vm.error).toBeTruthy()
    wrapper.unmount()
  })

  it('should cancel request on unmount', () => {
    const TestComponent = defineComponent({
      setup() {
        const { cancel } = useApi({ key: 'test' })
        return { cancel }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)
    expect(() => wrapper.vm.cancel()).not.toThrow()
    wrapper.unmount()
  })
})
