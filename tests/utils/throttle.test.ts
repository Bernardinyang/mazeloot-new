import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from '@/utils/throttle'

describe('Throttle Utility', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should throttle function calls', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(mockFn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should call function with correct arguments', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn('arg1', 'arg2')

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should allow call after throttle period', () => {
    const mockFn = vi.fn()
    const throttledFn = throttle(mockFn, 100)

    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(2)
  })
})
