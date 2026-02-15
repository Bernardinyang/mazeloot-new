/**
 * Proofing Store
 * Manages proofing phase state and operations
 */

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useProofingApi } from '@/domains/memora/api/proofing'
import { storage } from '@/shared/utils/storage'

// Storage keys for view settings
const VIEW_MODE_STORAGE_KEY = 'mazeloot_proofing_view_mode'
const GRID_SIZE_STORAGE_KEY = 'mazeloot_proofing_grid_size'
const SHOW_FILENAME_STORAGE_KEY = 'mazeloot_proofing_show_filename'
const SORT_ORDER_STORAGE_KEY = 'mazeloot_proofing_sort_order'
const SORT_BY_STORAGE_KEY = 'mazeloot_proofing_sort_by'

export const useProofingStore = defineStore('proofing', () => {
  const proofings = ref([])
  const currentProofing = ref(null)
  const feedback = ref([])
  const revisions = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // View settings
  const viewMode = ref(storage.get(VIEW_MODE_STORAGE_KEY) || 'grid')
  const gridSize = ref(storage.get(GRID_SIZE_STORAGE_KEY) || 'medium')
  const showFilename = ref(storage.get(SHOW_FILENAME_STORAGE_KEY) ?? true)
  const sortOrder = ref(storage.get(SORT_ORDER_STORAGE_KEY) || 'uploaded-new-old')
  const sortBy = ref(storage.get(SORT_BY_STORAGE_KEY) || 'created-new-old')

  // Persist view settings
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
  watch(sortBy, () => {
    storage.set(SORT_BY_STORAGE_KEY, sortBy.value)
  })

  // View setting methods
  const setViewMode = mode => {
    if (['grid', 'list'].includes(mode)) {
      viewMode.value = mode
    } else {
      viewMode.value = 'grid'
    }
  }

  const setGridSize = size => {
    if (['small', 'medium', 'large'].includes(size)) {
      gridSize.value = size
    } else {
      gridSize.value = 'medium'
    }
  }

  const setShowFilename = value => {
    showFilename.value = Boolean(value)
  }

  const setSortOrder = order => {
    sortOrder.value = order
  }

  const setSortBy = value => {
    sortBy.value = value
  }

  const proofingApi = useProofingApi()

  /**
   * Fetch proofing by ID
   * @param {string} id
   * @param {boolean} forceRefresh - if true, refetch even when same id is cached (e.g. for storage refresh)
   */
  const fetchProofing = async (id, forceRefresh = false) => {
    // Skip if already loading the same proofing
    if (isLoading.value && currentProofing.value?.id === id) {
      return currentProofing.value
    }

    // Skip if already loaded with same ID (unless force refresh)
    if (!forceRefresh && currentProofing.value?.id === id && !error.value) {
      return currentProofing.value
    }

    isLoading.value = true
    error.value = null

    try {
      const proofing = await proofingApi.fetchProofing(id)
      currentProofing.value = proofing
      feedback.value = proofing.feedback || []
      return proofing
    } catch (err) {
      error.value = err.message || 'Failed to fetch proofing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create proofing phase
   */
  const createProofing = async (projectId, data) => {
    isLoading.value = true
    error.value = null

    try {
      const newProofing = await proofingApi.createProofing(projectId, data)
      proofings.value.push(newProofing)
      return newProofing
    } catch (err) {
      error.value = err.message || 'Failed to create proofing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update proofing (standalone or project-based)
   */
  const updateProofing = async (id, data, projectId = null) => {
    isLoading.value = true
    error.value = null

    try {
      const updated = await proofingApi.updateProofing(projectId, id, data)

      const index = proofings.value.findIndex(p => p.id === id || p.uuid === id)
      if (index !== -1) {
        proofings.value[index] = updated
      }

      if (
        currentProofing.value &&
        (currentProofing.value.id === id || currentProofing.value.uuid === id)
      ) {
        currentProofing.value = updated
      }

      return updated
    } catch (err) {
      error.value = err.message || 'Failed to update proofing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete proofing
   */
  const deleteProofing = async (id, projectId = null) => {
    isLoading.value = true
    error.value = null

    try {
      await proofingApi.deleteProofing(projectId, id)
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete proofing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Publish proofing
   */
  const publishProofing = async (id, projectId = null) => {
    isLoading.value = true
    error.value = null

    try {
      const published = await proofingApi.publishProofing(projectId, id)

      const index = proofings.value.findIndex(p => p.id === id || p.uuid === id)
      if (index !== -1) {
        proofings.value[index] = published
      }

      if (
        currentProofing.value &&
        (currentProofing.value.id === id || currentProofing.value.uuid === id)
      ) {
        currentProofing.value = published
      }

      return published
    } catch (err) {
      error.value = err.message || 'Failed to publish proofing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Upload revision
   */
  const uploadRevision = async (proofingId, mediaData) => {
    isLoading.value = true
    error.value = null

    try {
      const revision = await proofingApi.uploadRevision(proofingId, mediaData)
      return revision
    } catch (err) {
      error.value = err.message || 'Failed to upload revision'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Add feedback
   */
  const addFeedback = async (mediaId, feedbackData) => {
    isLoading.value = true
    error.value = null

    try {
      const newFeedback = await proofingApi.addFeedback(mediaId, feedbackData)
      feedback.value.push(newFeedback)
      return newFeedback
    } catch (err) {
      error.value = err.message || 'Failed to add feedback'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Mark media as completed
   */
  const markCompleted = async mediaId => {
    isLoading.value = true
    error.value = null

    try {
      const media = await proofingApi.markMediaCompleted(mediaId)
      return media
    } catch (err) {
      error.value = err.message || 'Failed to mark media as completed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Complete proofing
   */
  const completeProofing = async (id, projectId = null) => {
    isLoading.value = true
    error.value = null

    try {
      const completed = await proofingApi.completeProofing(projectId, id)

      const index = proofings.value.findIndex(p => p.id === id || p.uuid === id)
      if (index !== -1) {
        proofings.value[index] = completed
      }

      if (currentProofing.value && (currentProofing.value.id === id || currentProofing.value.uuid === id)) {
        currentProofing.value = completed
      }

      return completed
    } catch (err) {
      error.value = err.message || 'Failed to complete proofing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Move approved media to collection
   * If collectionId is null, a new collection will be created
   */
  const moveToCollection = async (proofingId, collectionId = null) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await proofingApi.moveToCollection(proofingId, collectionId)
      return result
    } catch (err) {
      error.value = err.message || 'Failed to move media to collection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all proofing (both standalone and project-linked)
   * @param {Object} params - Query parameters for pagination, search, sort, filter
   * @returns {Promise<{data: Array, pagination: Object}>} Paginated response
   */
  const fetchAllProofing = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await proofingApi.fetchAllProofing(params)
      // If result has pagination structure, return it as-is
      if (result.data && result.pagination) {
        proofings.value = result.data
        return result
      }
      // Backward compatibility: if it's just an array, wrap it
      proofings.value = Array.isArray(result) ? result : result.data || []
      return result
    } catch (err) {
      error.value = err.message || 'Failed to fetch proofing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle star status with optimistic update
   */
  const toggleStar = async (proofingId, projectId = null) => {
    const proofingIdStr = String(proofingId)
    const proofing = proofings.value.find(
      p => String(p.id) === proofingIdStr || String(p.uuid) === proofingIdStr
    )
    const isCurrentProofing =
      currentProofing.value &&
      (String(currentProofing.value.id) === proofingIdStr || String(currentProofing.value.uuid) === proofingIdStr)

    // Need at least one to update
    if (!proofing && !isCurrentProofing) return

    // Get the starred state from whichever source is available
    const sourceProofing = proofing || currentProofing.value
    const wasStarred = sourceProofing.isStarred || sourceProofing.starred || false
    const newStarredState = !wasStarred

    // Optimistic update - update UI immediately
    if (proofing) {
      proofing.isStarred = newStarredState
      proofing.starred = newStarredState
    }

    if (isCurrentProofing) {
      currentProofing.value.isStarred = newStarredState
      currentProofing.value.starred = newStarredState
    }

    try {
      // Sync with server in background
      const result = await proofingApi.toggleStar(projectId, proofingId)
      // Update with server response
      if (result.starred !== undefined) {
        if (proofing) {
          proofing.isStarred = result.starred
          proofing.starred = result.starred
        }
        if (isCurrentProofing) {
          currentProofing.value.isStarred = result.starred
          currentProofing.value.starred = result.starred
        }
      }
      return result
    } catch (err) {
      // Revert optimistic update on error
      if (proofing) {
        proofing.isStarred = wasStarred
        proofing.starred = wasStarred
      }
      if (isCurrentProofing) {
        currentProofing.value.isStarred = wasStarred
        currentProofing.value.starred = wasStarred
      }
      throw err
    }
  }

  /**
   * Set cover photo from media
   */
  const setCoverPhoto = async (proofingId, mediaUuid, focalPoint = null, projectId = null) => {
    isLoading.value = true
    error.value = null

    try {
      const updated = await proofingApi.setCoverPhoto(projectId, proofingId, mediaUuid, focalPoint)

      const index = proofings.value.findIndex(p => p.id === proofingId || p.uuid === proofingId)
      if (index !== -1) {
        proofings.value[index] = updated
      }

      if (
        currentProofing.value &&
        (currentProofing.value.id === proofingId || currentProofing.value.uuid === proofingId)
      ) {
        currentProofing.value = updated
      }

      return updated
    } catch (err) {
      error.value = err.message || 'Failed to set cover photo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Duplicate proofing
   */
  const duplicateProofing = async (proofingId, projectId = null) => {
    isLoading.value = true
    error.value = null

    try {
      const duplicated = await proofingApi.duplicateProofing(projectId, proofingId)
      proofings.value.push(duplicated)
      return duplicated
    } catch (err) {
      error.value = err.message || 'Failed to duplicate proofing'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Recover deleted media
   */
  const recoverMedia = async (proofingId, mediaIds, projectId = null) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await proofingApi.recoverDeletedMedia(projectId, proofingId, mediaIds)
      return result
    } catch (err) {
      error.value = err.message || 'Failed to recover media'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    proofings,
    currentProofing,
    feedback,
    revisions,
    isLoading,
    error,
    // View settings
    viewMode,
    gridSize,
    showFilename,
    sortOrder,
    sortBy,
    setViewMode,
    setGridSize,
    setShowFilename,
    setSortOrder,
    setSortBy,
    // Actions
    fetchProofing,
    fetchAllProofing,
    createProofing,
    updateProofing,
    deleteProofing,
    duplicateProofing,
    publishProofing,
    uploadRevision,
    addFeedback,
    markCompleted,
    completeProofing,
    moveToCollection,
    toggleStar,
    setCoverPhoto,
    recoverMedia,
  }
})
