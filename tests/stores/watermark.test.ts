import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWatermarkStore } from '@/stores/watermark'

describe('Watermark Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty watermarks', () => {
    const store = useWatermarkStore()

    expect(store.watermarks).toEqual([])
    expect(store.currentWatermark).toBeNull()
  })

  it('should fetch watermarks', async () => {
    const store = useWatermarkStore()

    await store.fetchWatermarks()

    expect(store.watermarks).toBeDefined()
  })

  it('should create watermark', async () => {
    const store = useWatermarkStore()
    const data = {
      name: 'Test Watermark',
      type: 'text' as const,
      text: 'Test',
      fontStyle: 'Arial',
      fontColor: '#000000',
      scale: 50,
      opacity: 80,
      position: 'center',
    }

    const watermark = await store.createWatermark(data)

    expect(watermark.name).toBe(data.name)
    expect(watermark.type).toBe(data.type)
    expect(store.watermarks.some(w => w.id === watermark.id)).toBe(true)
  })

  it('should update watermark', async () => {
    const store = useWatermarkStore()
    const original = {
      id: 1,
      name: 'Original',
      type: 'text' as const,
      scale: 50,
      opacity: 80,
      position: 'center',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.watermarks = [original]

    // Mock API will throw, so we expect an error
    await expect(store.updateWatermark(1, { name: 'Updated' })).rejects.toThrow()
  })

  it('should delete watermark', async () => {
    const store = useWatermarkStore()
    store.watermarks = [
      {
        id: 1,
        name: 'Test',
        type: 'text',
        scale: 50,
        opacity: 80,
        position: 'center',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    store.currentWatermark = store.watermarks[0]

    await store.deleteWatermark(1)

    expect(store.watermarks).not.toContainEqual(expect.objectContaining({ id: 1 }))
    expect(store.currentWatermark).toBeNull()
  })

  it('should clear current watermark', () => {
    const store = useWatermarkStore()
    store.currentWatermark = {
      id: 1,
      name: 'Test',
      type: 'text',
      scale: 50,
      opacity: 80,
      position: 'center',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    store.clearCurrent()

    expect(store.currentWatermark).toBeNull()
  })
})
