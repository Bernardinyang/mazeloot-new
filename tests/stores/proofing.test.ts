import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProofingStore } from '@/stores/proofing'

const mockApi = {
  fetchProofing: vi.fn(),
  createProofing: vi.fn(),
  updateProofing: vi.fn(),
  deleteProofing: vi.fn(),
}

vi.mock('@/api/proofing', () => ({
  useProofingApi: () => mockApi,
}))

describe('Proofing Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const store = useProofingStore()

    expect(store.proofings).toEqual([])
    expect(store.currentProofing).toBeNull()
    expect(store.isLoading).toBe(false)
  })

  it('should fetch single proofing', async () => {
    const store = useProofingStore()
    const mockProofing = { id: '1', name: 'Proofing 1' }

    mockApi.fetchProofing.mockResolvedValue(mockProofing)

    await store.fetchProofing('1')

    expect(store.currentProofing).toEqual(mockProofing)
    expect(store.isLoading).toBe(false)
  })

  it('should create proofing', async () => {
    const store = useProofingStore()
    const newProofing = { name: 'New Proofing' }
    const createdProofing = { id: '1', ...newProofing }

    mockApi.createProofing.mockResolvedValue(createdProofing)

    await store.createProofing('project-id', newProofing)

    expect(store.proofings).toContainEqual(createdProofing)
  })

  it('should update proofing', async () => {
    const store = useProofingStore()
    store.proofings = [{ id: '1', name: 'Old Name' }]
    const updatedProofing = { id: '1', name: 'New Name' }

    mockApi.updateProofing.mockResolvedValue(updatedProofing)

    await store.updateProofing('1', { name: 'New Name' }, 'project-id')

    expect(store.proofings.find(p => p.id === '1')?.name).toBe('New Name')
  })

  it('should delete proofing', async () => {
    const store = useProofingStore()
    store.proofings = [{ id: '1', name: 'Proofing 1' }]

    mockApi.deleteProofing.mockResolvedValue(undefined)

    await store.deleteProofing('1', 'project-id')

    // The store doesn't remove from array, just calls API
    expect(mockApi.deleteProofing).toHaveBeenCalledWith('project-id', '1')
    expect(store.isLoading).toBe(false)
  })
})

