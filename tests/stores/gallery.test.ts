import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGalleryStore } from '@/stores/gallery'

describe('Gallery Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with empty collections', () => {
    const store = useGalleryStore()

    expect(store.collections).toEqual([])
    expect(store.starredCollectionIds.size).toBe(0)
  })

  it('should initialize starred collections from localStorage', () => {
    localStorage.setItem('starredCollections', JSON.stringify(['1', '2']))

    const store = useGalleryStore()

    expect(store.starredCollectionIds.has('1')).toBe(true)
    expect(store.starredCollectionIds.has('2')).toBe(true)
  })

  it('should toggle star status', async () => {
    const store = useGalleryStore()
    store.collections = [
      {
        id: '1',
        name: 'Collection 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    await store.toggleStar('1')

    expect(store.starredCollectionIds.has('1')).toBe(true)
    expect(store.collections[0].isStarred).toBe(true)

    await store.toggleStar('1')

    expect(store.starredCollectionIds.has('1')).toBe(false)
    expect(store.collections[0].isStarred).toBe(false)
  })

  it('should create collection', async () => {
    const store = useGalleryStore()

    const collection = await store.createCollection('New Collection', 'Description')

    expect(collection.name).toBe('New Collection')
    expect(collection.description).toBe('Description')
    expect(store.collections.some(c => c.id === collection.id)).toBe(true)
  })

  it('should delete collection', async () => {
    const store = useGalleryStore()
    store.collections = [
      {
        id: '1',
        name: 'Collection 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    store.starredCollectionIds.add('1')

    await store.deleteCollection('1')

    expect(store.collections.find(c => c.id === '1')).toBeUndefined()
    expect(store.starredCollectionIds.has('1')).toBe(false)
  })

  it('should compute starred collections', () => {
    const store = useGalleryStore()
    store.collections = [
      {
        id: '1',
        name: 'Collection 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isStarred: true,
      },
      {
        id: '2',
        name: 'Collection 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isStarred: false,
      },
    ]
    store.starredCollectionIds.add('1')

    const starred = store.starredCollections

    expect(starred).toHaveLength(1)
    expect(starred[0].id).toBe('1')
  })
})
