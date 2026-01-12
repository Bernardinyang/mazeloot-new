/**
 * Gallery Store
 * Manages gallery/collection state, starred items, and gallery operations
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useCollectionsApi, addDefaultSettings } from '@/domains/memora/api/collections'
import { storage } from '@/shared/utils/storage'

const STARRED_COLLECTIONS_STORAGE_KEY = 'mazeloot_starred_collections'
const VIEW_MODE_STORAGE_KEY = 'mazeloot_collection_view_mode'
const GRID_SIZE_STORAGE_KEY = 'mazeloot_collection_grid_size'
const SHOW_FILENAME_STORAGE_KEY = 'mazeloot_collection_show_filename'
const SORT_ORDER_STORAGE_KEY = 'mazeloot_collection_sort_order'

export const useGalleryStore = defineStore('gallery', () => {
  const collections = ref([])
  const starredCollectionIds = ref(new Set())
  const isLoading = ref(false)
  const error = ref(null)
  
  // View settings
  const viewMode = ref(storage.get(VIEW_MODE_STORAGE_KEY) || 'grid')
  const gridSize = ref(storage.get(GRID_SIZE_STORAGE_KEY) || 'medium')
  const showFilename = ref(storage.get(SHOW_FILENAME_STORAGE_KEY) ?? true)
  const sortOrder = ref(storage.get(SORT_ORDER_STORAGE_KEY) || 'uploaded-new-old')

  const collectionsApi = useCollectionsApi()

  // Persist view settings to localStorage
  watch(viewMode, () => {
    storage.set(VIEW_MODE_STORAGE_KEY, viewMode.value)
  })

  watch(gridSize, () => {
    storage.set(GRID_SIZE_STORAGE_KEY, gridSize.value)
  })

  watch(showFilename, () => {
    storage.set(SHOW_FILENAME_STORAGE_KEY, showFilename.value)
  })

  watch(sortOrder, () => {
    storage.set(SORT_ORDER_STORAGE_KEY, sortOrder.value)
  })

  /**
   * Initialize starred collections from localStorage
   */
  const initStarred = () => {
    // Support legacy key 'starredCollections' used in tests
    const stored = storage.get(STARRED_COLLECTIONS_STORAGE_KEY) || storage.get('starredCollections')
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
  const fetchCollections = async params => {
    isLoading.value = true
    error.value = null
    try {
      const result = await collectionsApi.fetchCollections(params)
      // Handle paginated response from real API: { data: [...], pagination: {...} }
      // Or array from mock API
      const data = result?.data || result
      collections.value = Array.isArray(data) ? data : []
      collections.value.forEach(collection => {
        if (starredCollectionIds.value.has(collection.id)) {
          collection.isStarred = true
        }
      })
      // Return paginated result if available
      if (result?.data && result?.pagination) {
        return result
      }
      // Otherwise return array wrapped in expected format
      return {
        data: collections.value,
        pagination: {
          page: 1,
          limit: collections.value.length,
          total: collections.value.length,
          totalPages: 1,
        },
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch collections'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle star status with optimistic update
   */
  const toggleStar = async collectionId => {
    const collection = collections.value.find(c => c.id === collectionId)
    if (!collection) return

    const wasStarred = collection.isStarred || collection.starred || starredCollectionIds.value.has(collectionId)
    const newStarredState = !wasStarred

    // Optimistic update - update UI immediately
    if (newStarredState) {
      starredCollectionIds.value.add(collectionId)
      collection.isStarred = true
      collection.starred = true
    } else {
      starredCollectionIds.value.delete(collectionId)
      collection.isStarred = false
      collection.starred = false
    }

    // Persistence is handled by watcher

    try {
      // Sync with server in background
      const result = await collectionsApi.toggleStar(collectionId, collection.projectId || null)
      // Update with server response
      if (result?.starred !== undefined) {
        if (result.starred) {
          starredCollectionIds.value.add(collectionId)
          collection.isStarred = true
          collection.starred = true
        } else {
          starredCollectionIds.value.delete(collectionId)
          collection.isStarred = false
          collection.starred = false
        }
      }
      return result
    } catch (err) {
      // Revert optimistic update on error
      if (newStarredState) {
        starredCollectionIds.value.delete(collectionId)
        collection.isStarred = false
        collection.starred = false
      } else {
        starredCollectionIds.value.add(collectionId)
        collection.isStarred = true
        collection.starred = true
      }
      throw err
    }
  }

  /**
   * Create new collection with optimistic update
   */
  const createCollection = async (data, maybeDescription) => {
    isLoading.value = true
    error.value = null

    // Support both (dataObject) and (name, description) signatures used in tests
    if (typeof data === 'string') {
      data = {
        name: data,
        description: maybeDescription,
      }
    }

    // Ensure every new (non-folder) collection starts with a default "Highlights" set.
    // We include it in the create payload, and also enforce it post-create if the API ignores mediaSets.
    const defaultHighlightsSet = [{ id: 'highlights', name: 'Highlights', count: 0, order: 0 }]
    if (!data.isFolder && !('mediaSets' in data)) {
      data.mediaSets = defaultHighlightsSet
    }

    const tempId = `temp-${Date.now()}`
    const tempCollection = {
      id: tempId,
      name: data.name,
      description: data.description,
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
      mediaSets: data.isFolder ? undefined : data.mediaSets,
    }

    // Optimistic update - add to UI immediately
    collections.value.push(tempCollection)

    try {
      const newCollection = await collectionsApi.createCollection(data)

      // Replace temp collection with real one
      const index = collections.value.findIndex(c => c.id === tempId)
      if (index !== -1) {
        collections.value[index] = newCollection
      } else {
        // If not found, just add it
        collections.value.push(newCollection)
      }

      // If backend doesn't persist mediaSets on create, enforce the default set via update.
      if (!newCollection?.isFolder) {
        const sets = Array.isArray(newCollection.mediaSets) ? newCollection.mediaSets : []
        if (sets.length === 0) {
          const updated = await updateCollection(newCollection.id, {
            mediaSets: defaultHighlightsSet,
          })
          // ensure we return the updated collection (and store already updated via updateCollection)
          return updated || newCollection
        }
      }

      return newCollection
    } catch (err) {
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
  const updateCollection = async (id, data) => {
    isLoading.value = true
    error.value = null

    // Try to find collection in store, but don't fail if not found
    // The collection might only exist in the component's local state
    const collection = collections.value.find(c => c.id === id)
    if (!collection) {
      // Collection not in store, but we can still update it via API
      // Just log a warning and continue
      console.warn('Collection not found in store, updating via API only:', id)
    }

    // Store original for revert (only if collection exists in store)
    const original = collection ? { ...collection } : null

    // Optimistic update
    const index = collections.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const updatedData = { ...data }
      // Convert null to undefined for expiryDate to match Collection interface
      if ('expiryDate' in updatedData && updatedData.expiryDate === null) {
        updatedData.expiryDate = undefined
      }
      if ('eventDate' in updatedData) {
        if (updatedData.eventDate === null || updatedData.eventDate === undefined) {
          updatedData.date = undefined
        } else {
          updatedData.date =
            typeof updatedData.eventDate === 'string'
              ? updatedData.eventDate
              : updatedData.eventDate.toISOString()
        }
        delete updatedData.eventDate
      }
      if ('presetId' in updatedData && updatedData.presetId === undefined) {
        updatedData.presetId = null
      }
      if ('watermarkId' in updatedData && updatedData.watermarkId === undefined) {
        updatedData.watermarkId = null
      }
      if ('mediaSets' in updatedData) {
        // Keep mediaSets in updatedData for optimistic update
        // The API response will have the correct format
      }
      collections.value[index] = {
        ...collections.value[index],
        ...updatedData,
        updatedAt: new Date().toISOString(),
      }
    }

    try {
      const updatedCollection = await collectionsApi.updateCollection(id, data)
      const processedCollection = addDefaultSettings(updatedCollection)
      if (index !== -1) {
        collections.value[index] = {
          ...collections.value[index],
          ...processedCollection,
        }
      }
      // Also update in the collections array if it exists there
      const collectionInList = collections.value.find(c => c.id === id)
      if (collectionInList) {
        Object.assign(collectionInList, processedCollection)
      }
      return processedCollection
    } catch (err) {
      // Revert on error (only if we had an original collection in store)
      if (index !== -1 && original) {
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
  const duplicateCollection = async id => {
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
    } catch (err) {
      error.value = err.message || 'Failed to duplicate collection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete collection with optimistic update
   */
  const deleteCollection = async id => {
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
      await collectionsApi.deleteCollection(id)
    } catch (err) {
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
  const moveCollection = async (collectionId, targetFolderId) => {
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
          ...collections.value.find(c => c.id === targetFolderId),
          previewImages: collections.value.find(c => c.id === targetFolderId)?.previewImages
            ? [...(collections.value.find(c => c.id === targetFolderId).previewImages || [])]
            : [],
        }
      : null
    const oldSourceFolder = oldParentId
      ? {
          ...collections.value.find(c => c.id === oldParentId),
          previewImages: collections.value.find(c => c.id === oldParentId)?.previewImages
            ? [...(collections.value.find(c => c.id === oldParentId).previewImages || [])]
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

    collections.value.forEach(c => {
      if (c.isFolder) {
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
    } catch (err) {
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
  const fetchCollection = async (id, forceRefresh = false) => {
    // Check if collection is already in store (unless forcing refresh)
    if (!forceRefresh) {
      const existing = collections.value.find(c => c.id === id)
      if (existing) {
        return existing
      }
    }

    isLoading.value = true
    error.value = null
    try {
      const collection = await collectionsApi.fetchCollection(id)
      if (starredCollectionIds.value.has(collection.id)) {
        collection.isStarred = true
      }
      // Cache in store
      const index = collections.value.findIndex(c => c.id === id)
      if (index !== -1) {
        collections.value[index] = collection
      } else {
        collections.value.push(collection)
      }
      return collection
    } catch (err) {
      error.value = err.message || 'Failed to fetch collection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set view mode (grid or list)
   */
  const setViewMode = mode => {
    if (mode === 'grid' || mode === 'list') {
      viewMode.value = mode
    } else {
      viewMode.value = 'grid'
    }
  }

  /**
   * Set grid size
   */
  const setGridSize = size => {
    if (['small', 'medium', 'large'].includes(size)) {
      gridSize.value = size
    } else {
      gridSize.value = 'medium'
    }
  }

  /**
   * Set show filename
   */
  const setShowFilename = value => {
    showFilename.value = Boolean(value)
  }

  /**
   * Set sort order
   */
  const setSortOrder = order => {
    sortOrder.value = order
  }

  return {
    collections,
    starredCollectionIds,
    isLoading,
    error,
    viewMode,
    gridSize,
    showFilename,
    sortOrder,
    setViewMode,
    setGridSize,
    setShowFilename,
    setSortOrder,
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
