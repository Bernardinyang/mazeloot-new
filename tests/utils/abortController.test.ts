import { describe, it, expect } from 'vitest'
import { RequestCanceller } from '@/shared/utils/abortController'

describe('RequestCanceller', () => {
  it('should create abort signal', () => {
    const canceller = new RequestCanceller()
    const signal = canceller.create('test-key')

    expect(signal).toBeInstanceOf(AbortSignal)
    expect(signal.aborted).toBe(false)
  })

  it('should cancel specific request', () => {
    const canceller = new RequestCanceller()
    const signal = canceller.create('test-key')

    canceller.cancel('test-key')

    expect(signal.aborted).toBe(true)
  })

  it('should cancel all requests', () => {
    const canceller = new RequestCanceller()
    const signal1 = canceller.create('key1')
    const signal2 = canceller.create('key2')

    canceller.cancelAll()

    expect(signal1.aborted).toBe(true)
    expect(signal2.aborted).toBe(true)
  })

  it('should check if request is aborted', () => {
    const canceller = new RequestCanceller()
    const signal = canceller.create('test-key')

    expect(canceller.isAborted('test-key')).toBe(false)
    expect(signal.aborted).toBe(false)

    canceller.cancel('test-key')

    // After cancel, the controller is removed, but signal is still aborted
    expect(signal.aborted).toBe(true)
    // isAborted returns false because controller was removed from map
    expect(canceller.isAborted('test-key')).toBe(false)
  })

  it('should cancel existing request when creating new one with same key', () => {
    const canceller = new RequestCanceller()
    const signal1 = canceller.create('test-key')

    const signal2 = canceller.create('test-key')

    expect(signal1.aborted).toBe(true)
    expect(signal2.aborted).toBe(false)
  })
})
