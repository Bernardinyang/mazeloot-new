import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWatermarkStore } from '@/stores/watermark'

const mockApi = {
  fetchWatermarks: vi.fn(),
  createWatermark: vi.fn(),
  updateWatermark: vi.fn(),
  deleteWatermark: vi.fn(),
}

vi.mock('@/api/watermarks', () => ({
  useWatermarksApi: () => mockApi,
}))

describe('Watermark Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty watermarks', () => {
    const store = useWatermarkStore()

    expect(store.watermarks).toEqual([])
    expect(store.currentWatermark).toBeNull()
  })

  it('should fetch watermarks', async () => {
    const store = useWatermarkStore()
    const mockWatermarks = [
      { id: 1, name: 'Watermark 1', type: 'text' },
      { id: 2, name: 'Watermark 2', type: 'image' },
    ]

    mockApi.fetchWatermarks.mockResolvedValue(mockWatermarks)

    await store.fetchWatermarks()

    expect(store.watermarks).toEqual(mockWatermarks)
    expect(store.isLoading).toBe(false)
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
    const createdWatermark = { id: 1, ...data }

    mockApi.createWatermark.mockResolvedValue(createdWatermark)

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
    const updatedWatermark = { ...original, name: 'Updated' }

    mockApi.updateWatermark.mockResolvedValue(updatedWatermark)

    await store.updateWatermark(1, { name: 'Updated' })

    expect(store.watermarks.find(w => w.id === 1)?.name).toBe('Updated')
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

    mockApi.deleteWatermark.mockResolvedValue(undefined)

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
