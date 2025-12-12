/**
 * Gallery Store
 * Manages gallery/collection state, starred items, and gallery operations
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useCollectionsApi } from '@/api/collections'
import type { Collection } from '@/api/collections'
import { storage } from '@/utils/storage'

const STARRED_COLLECTIONS_STORAGE_KEY = 'mazeloot_starred_collections'

export const useGalleryStore = defineStore('gallery', () => {
  const collections = ref<Collection[]>([])
  const starredCollectionIds = ref<Set<string>>(new Set())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const collectionsApi = useCollectionsApi()

  /**
   * Initialize starred collections from localStorage
   */
  const initStarred = () => {
    const stored = storage.get<string[]>(STARRED_COLLECTIONS_STORAGE_KEY)
    if (stored && stored.length > 0) {
      starredCollectionIds.value = new Set(stored)
    }
  }

  /**
   * Persist starred collections to localStorage
   */
  const persistStarred = () => {
    storage.set(STARRED_COLLECTIONS_STORAGE_KEY, [...starredCollectionIds.value])
  }

  // Watch starredCollectionIds and persist to localStorage
  watch(
    starredCollectionIds,
    () => {
      persistStarred()
    },
    { deep: true }
  )

  // Initialize on store creation
  initStarred()

  /**
   * Fetch all collections
   */
  const fetchCollections = async (params?: {
    search?: string
    sortBy?: string
    status?: string
    category?: string
    parentId?: string | null
  }) => {
    isLoading.value = true
    error.value = null
    try {
      const data = await collectionsApi.fetchCollections(params)
      collections.value = data
      // Update starred status
      collections.value.forEach(collection => {
        if (starredCollectionIds.value.has(collection.id)) {
          collection.isStarred = true
        }
      })
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch collections'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle star status with optimistic update
   */
  const toggleStar = async (collectionId: string) => {
    const collection = collections.value.find(c => c.id === collectionId)
    if (!collection) return

    const wasStarred = starredCollectionIds.value.has(collectionId)
    const newStarredState = !wasStarred

    // Optimistic update - update UI immediately
    if (newStarredState) {
      starredCollectionIds.value.add(collectionId)
      collection.isStarred = true
    } else {
      starredCollectionIds.value.delete(collectionId)
      collection.isStarred = false
    }

    // Persistence is handled by watcher

    try {
      // Sync with server in background
      await collectionsApi.toggleStar(collectionId, newStarredState)
    } catch (err: any) {
      // Revert optimistic update on error
      if (newStarredState) {
        starredCollectionIds.value.delete(collectionId)
        collection.isStarred = false
      } else {
        starredCollectionIds.value.add(collectionId)
        collection.isStarred = true
      }
      throw err
    }
  }

  /**
   * Create new collection with optimistic update
   */
  const createCollection = async (data: {
    name: string
    description?: string
    parentId?: string | null
    isFolder?: boolean
    password?: string | null
    eventDate?: Date | string | null
  }) => {
    isLoading.value = true
    error.value = null

    // Create temporary collection for optimistic update
    const tempId = `temp-${Date.now()}`
    const tempCollection: Collection = {
      id: tempId,
      name: data.name,
      description: data.description,
      parentId: data.parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      itemCount: 0,
      isStarred: false,
      isLocked: false,
      isFolder: data.isFolder || false,
      previewImages: data.isFolder ? [] : undefined,
      password: data.password || null,
      date: data.eventDate
        ? typeof data.eventDate === 'string'
          ? data.eventDate
          : data.eventDate.toISOString()
        : undefined,
    }

    // Optimistic update - add to UI immediately
    collections.value.push(tempCollection)

    try {
      // Create on server
      const newCollection = await collectionsApi.createCollection(data)

      // Replace temp collection with real one
      const index = collections.value.findIndex(c => c.id === tempId)
      if (index !== -1) {
        collections.value[index] = newCollection
      } else {
        // If not found, just add it
        collections.value.push(newCollection)
      }

      return newCollection
    } catch (err: any) {
      // Revert optimistic update on error
      collections.value = collections.value.filter(c => c.id !== tempId)
      error.value = err.message || 'Failed to create collection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update collection
   */
  const updateCollection = async (
    id: string,
    data: {
      name?: string
      description?: string
      status?: 'active' | 'archived' | 'draft'
      password?: string | null
      downloadPin?: string | null
      category?: 'wedding' | 'portrait' | 'event' | 'other'
      expiryDate?: string | null
      eventDate?: Date | string | null
      presetId?: string | undefined
      watermarkId?: string | undefined
    }
  ) => {
    isLoading.value = true
    error.value = null

    const collection = collections.value.find(c => c.id === id)
    if (!collection) {
      error.value = 'Collection not found'
      isLoading.value = false
      throw new Error('Collection not found')
    }

    // Store original for revert
    const original = { ...collection }

    // Optimistic update
    const index = collections.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const updatedData: any = { ...data }
      // Convert null to undefined for expiryDate to match Collection interface
      if ('expiryDate' in updatedData && updatedData.expiryDate === null) {
        updatedData.expiryDate = undefined
      }
      // Handle eventDate conversion to date field for optimistic update
      if ('eventDate' in updatedData) {
        if (updatedData.eventDate === null || updatedData.eventDate === undefined) {
          ;(updatedData as any).date = undefined
        } else {
          ;(updatedData as any).date =
            typeof updatedData.eventDate === 'string'
              ? updatedData.eventDate
              : updatedData.eventDate.toISOString()
        }
        delete updatedData.eventDate
      }
      // Handle presetId and watermarkId - convert undefined to null for consistency
      if ('presetId' in updatedData && updatedData.presetId === undefined) {
        updatedData.presetId = null
      }
      if ('watermarkId' in updatedData && updatedData.watermarkId === undefined) {
        updatedData.watermarkId = null
      }
      collections.value[index] = {
        ...collections.value[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      }
    }

    try {
      const updatedCollection = await collectionsApi.updateCollection(id, data)
      // Update the collection in the store with the returned data
      if (index !== -1) {
        collections.value[index] = {
          ...collections.value[index],
          ...updatedCollection,
        }
      }
      // Also update in the collections array if it exists there
      const collectionInList = collections.value.find(c => c.id === id)
      if (collectionInList) {
        Object.assign(collectionInList, updatedCollection)
      }
      return updatedCollection
    } catch (err: any) {
      // Revert on error
      if (index !== -1) {
        collections.value[index] = original
      }
      error.value = err.message || 'Failed to update collection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Duplicate collection
   */
  const duplicateCollection = async (id: string) => {
    isLoading.value = true
    error.value = null

    const original = collections.value.find(c => c.id === id)
    if (!original) {
      error.value = 'Collection not found'
      isLoading.value = false
      throw new Error('Collection not found')
    }

    try {
      const duplicated = await collectionsApi.duplicateCollection(id)
      collections.value.push(duplicated)
      return duplicated
    } catch (err: any) {
      error.value = err.message || 'Failed to duplicate collection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete collection with optimistic update
   */
  const deleteCollection = async (id: string) => {
    isLoading.value = true
    error.value = null

    // Store collection for potential revert
    const collectionToDelete = collections.value.find(c => c.id === id)
    const wasStarred = starredCollectionIds.value.has(id)

    // Optimistic update - remove from UI immediately
    collections.value = collections.value.filter(c => c.id !== id)
    starredCollectionIds.value.delete(id)
    // Persistence is handled by watcher

    try {
      // Delete on server
      await collectionsApi.deleteCollection(id)
    } catch (err: any) {
      // Revert optimistic update on error
      if (collectionToDelete) {
        collections.value.push(collectionToDelete)
        // Restore original order (could be improved with index tracking)
        collections.value.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      }
      if (wasStarred) {
        starredCollectionIds.value.add(id)
        // Persistence is handled by watcher
      }
      error.value = err.message || 'Failed to delete collection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Move collection/folder to another folder
   */
  const moveCollection = async (collectionId: string, targetFolderId: string | null) => {
    // Don't set loading state to avoid full reload animation
    error.value = null

    const collection = collections.value.find(c => c.id === collectionId)
    if (!collection) {
      error.value = 'Collection not found'
      throw new Error('Collection not found')
    }

    const oldParentId = collection.parentId
    const oldTargetFolder = targetFolderId
      ? {
          ...collections.value.find(c => c.id === targetFolderId)!,
          previewImages: collections.value.find(c => c.id === targetFolderId)?.previewImages
            ? [...(collections.value.find(c => c.id === targetFolderId)!.previewImages || [])]
            : [],
        }
      : null
    const oldSourceFolder = oldParentId
      ? {
          ...collections.value.find(c => c.id === oldParentId)!,
          previewImages: collections.value.find(c => c.id === oldParentId)?.previewImages
            ? [...(collections.value.find(c => c.id === oldParentId)!.previewImages || [])]
            : [],
        }
      : null

    // Optimistic update - update UI immediately without loading state
    const index = collections.value.findIndex(c => c.id === collectionId)
    if (index !== -1) {
      collections.value[index] = {
        ...collections.value[index],
        parentId: targetFolderId,
        updatedAt: new Date().toISOString(),
      }
    }

    // Update folder preview images and counts optimistically
    collections.value.forEach(c => {
      if (c.isFolder) {
        // Update preview images for target folder
        if (c.id === targetFolderId && collection.thumbnail) {
          const previewImages = c.previewImages || []
          // Add collection thumbnail if not already present
          if (!previewImages.includes(collection.thumbnail)) {
            if (previewImages.length < 4) {
              c.previewImages = [...previewImages, collection.thumbnail]
            } else {
              // Replace last image if at capacity (keep most recent)
              c.previewImages = [...previewImages.slice(0, 3), collection.thumbnail]
            }
          }
        }

        // Update itemCount to match previewImages.length for folders
        if (c.previewImages && c.previewImages.length > 0) {
          c.itemCount = c.previewImages.length
        } else {
          // If no preview images, count children
          const children = collections.value.filter(child => child.parentId === c.id)
          c.itemCount = children.length
        }
      }
    })

    try {
      // Move on server (background, no loading state)
      await collectionsApi.moveCollection(collectionId, targetFolderId)

      // No need to refresh - optimistic update is already applied
      // The API will update localStorage, so data persists
    } catch (err: any) {
      // Revert optimistic update on error
      if (index !== -1) {
        collections.value[index] = {
          ...collections.value[index],
          parentId: oldParentId,
          updatedAt: collection.updatedAt,
        }
      }

      // Revert folder counts and preview images
      collections.value.forEach(c => {
        if (c.isFolder) {
          // Revert preview images
          if (c.id === targetFolderId && oldTargetFolder) {
            c.previewImages = oldTargetFolder.previewImages
              ? [...oldTargetFolder.previewImages]
              : []
            c.itemCount = oldTargetFolder.itemCount
          } else if (c.id === oldParentId && oldSourceFolder) {
            c.previewImages = oldSourceFolder.previewImages
              ? [...oldSourceFolder.previewImages]
              : []
            c.itemCount = oldSourceFolder.itemCount
          } else {
            // Recalculate itemCount for other folders
            if (c.previewImages && c.previewImages.length > 0) {
              c.itemCount = c.previewImages.length
            } else {
              const children = collections.value.filter(child => child.parentId === c.id)
              c.itemCount = children.length
            }
          }
        }
      })

      error.value = err.message || 'Failed to move collection'
      throw err
    }
  }

  /**
   * Get starred collections
   */
  const starredCollections = computed(() => {
    return collections.value.filter(c => starredCollectionIds.value.has(c.id))
  })

  // Initialize on store creation
  initStarred()

  /**
   * Fetch a single collection by ID
   */
  const fetchCollection = async (id: string): Promise<Collection> => {
    isLoading.value = true
    error.value = null
    try {
      const collection = await collectionsApi.fetchCollection(id)
      // Update starred status
      if (starredCollectionIds.value.has(collection.id)) {
        collection.isStarred = true
      }
      return collection
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch collection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    collections,
    starredCollectionIds,
    isLoading,
    error,
    starredCollections,
    fetchCollections,
    fetchCollection,
    toggleStar,
    createCollection,
    updateCollection,
    deleteCollection,
    moveCollection,
    duplicateCollection,
  }
})
