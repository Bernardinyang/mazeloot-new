/**
 * Raw File Store
 * Manages raw file phase state and operations
 */

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { storage } from '@/shared/utils/storage'

const VIEW_MODE_STORAGE_KEY = 'mazeloot_raw_file_view_mode'
const GRID_SIZE_STORAGE_KEY = 'mazeloot_raw_file_grid_size'
const SHOW_FILENAME_STORAGE_KEY = 'mazeloot_raw_file_show_filename'
const SORT_ORDER_STORAGE_KEY = 'mazeloot_raw_file_sort_order'

export const useRawFileStore = defineStore('rawFile', () => {
  const rawFiles = ref([])
  const currentRawFile = ref(null)
  const selectedMedia = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const viewMode = ref(storage.get(VIEW_MODE_STORAGE_KEY) || 'grid')
  const gridSize = ref(storage.get(GRID_SIZE_STORAGE_KEY) || 'medium')
  const showFilename = ref(storage.get(SHOW_FILENAME_STORAGE_KEY) ?? true)
  const sortOrder = ref(storage.get(SORT_ORDER_STORAGE_KEY) || 'uploaded-new-old')

  const rawFilesApi = useRawFilesApi()

  // Persist preferences to localStorage
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

  /**
   * Fetch rawFile by ID
   */
  const fetchRawFile = async id => {
    // Skip if already loading the same rawFile
    if (isLoading.value && currentRawFile.value?.id === id) {
      return currentRawFile.value
    }

    // Skip if already loaded with same ID
    if (currentRawFile.value?.id === id && !error.value) {
      return currentRawFile.value
    }

    isLoading.value = true
    error.value = null

    try {
      const rawFile = await rawFilesApi.fetchRawFile(id)
      currentRawFile.value = rawFile       // Extract selected media if available
      if (rawFile.mediaSets) {
        const allMedia = []
        for (const set of rawFile.mediaSets) {
          if (set.media) {
            allMedia.push(...set.media)
          }
        }
        selectedMedia.value = allMedia.filter(m => m.isSelected)
      } else {
        selectedMedia.value = []
      }
      return rawFile
    } catch (err) {
      error.value = err.message || 'Failed to fetch selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all rawFiles (both standalone and project-linked)
   */
  const fetchAllRawFiles = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await rawFilesApi.fetchAllRawFiles(params)
      // Handle paginated response (has data property) or direct array
      if (result?.data && result?.pagination) {
        rawFiles.value = result.data
        return result
      }
      // Backward compatibility: if it's just an array, wrap it
      rawFiles.value = Array.isArray(result) ? result : result.data || []
      return result
    } catch (err) {
      error.value = err.message || 'Failed to fetch rawFiles'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create raw file phase
   */
  const createRawFile = async data => {
    isLoading.value = true
    error.value = null

    try {
      const newSelection = await rawFilesApi.createRawFile(data)
      rawFiles.value.push(newSelection)
      return newSelection
    } catch (err) {
      error.value = err.message || 'Failed to create selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update rawFile    */
  const updateRawFile = async (id, data) => {
    isLoading.value = true
    error.value = null

    try {
      const updated = await rawFilesApi.updateRawFile(id, data)

      const index = rawFiles.value.findIndex(s => s.id === id || s.uuid === id)
      if (index !== -1) {
        rawFiles.value[index] = updated
      }

      if (
        currentRawFile.value &&
        (currentRawFile.value.id === id || currentRawFile.value.uuid === id)
      ) {
        currentRawFile.value = updated
      }

      return updated
    } catch (err) {
      error.value = err.message || 'Failed to update selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Publish rawFile (creative can only publish to active)
   */
  const publishRawFile = async id => {
    isLoading.value = true
    error.value = null

    try {
      const published = await rawFilesApi.publishRawFile(id)

      const index = rawFiles.value.findIndex(s => s.id === id || s.uuid === id)
      if (index !== -1) {
        rawFiles.value[index] = published
      }

      if (
        currentRawFile.value &&
        (currentRawFile.value.id === id || currentRawFile.value.uuid === id)
      ) {
        currentRawFile.value = published
      }

      return published
    } catch (err) {
      error.value = err.message || 'Failed to publish selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Complete rawFile (guest access - marks media as selected and completes)
   */
  const completeSelection = async (id, mediaIds = []) => {
    isLoading.value = true
    error.value = null

    try {
      const completed = await rawFilesApi.completeRawFile(id, mediaIds)

      const index = rawFiles.value.findIndex(s => s.id === id || s.uuid === id)
      if (index !== -1) {
        rawFiles.value[index] = completed
      }

      if (
        currentRawFile.value &&
        (currentRawFile.value.id === id || currentRawFile.value.uuid === id)
      ) {
        currentRawFile.value = completed
      }

      return completed
    } catch (err) {
      error.value = err.message || 'Failed to complete selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Duplicate rawFile    */
  const duplicateRawFile = async id => {
    isLoading.value = true
    error.value = null

    try {
      const duplicated = await rawFilesApi.duplicateRawFile(id)
      rawFiles.value.push(duplicated)
      return duplicated
    } catch (err) {
      error.value = err.message || 'Failed to duplicate selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Recover deleted media
   */
  const recoverMedia = async (selectionId, mediaIds) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await rawFilesApi.recoverDeletedMedia(selectionId, mediaIds)
      return result
    } catch (err) {
      error.value = err.message || 'Failed to recover media'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Copy selected filenames
   */
  const copyFilenames = async selectionId => {
    isLoading.value = true
    error.value = null

    try {
      const filenames = await rawFilesApi.copyFilenames(selectionId)
      return filenames
    } catch (err) {
      error.value = err.message || 'Failed to copy filenames'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get selected media
   */
  const getSelectedMedia = async (selectionId, setId = null) => {
    isLoading.value = true
    error.value = null

    try {
      const media = await rawFilesApi.getSelectedMedia(selectionId, setId)
      selectedMedia.value = media
      return media
    } catch (err) {
      error.value = err.message || 'Failed to get selected media'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete rawFile    */
  const deleteRawFile = async id => {
    isLoading.value = true
    error.value = null

    try {
      await rawFilesApi.deleteRawFile(id)
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle Star rawFile    */
  const toggleStarRawFile = async id => {
    isLoading.value = true
    error.value = null

    try {
      await rawFilesApi.toggleStarRawFile(id)
      return true
    } catch (err) {
      error.value = err.message || 'Failed to add rawFile to favourite'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    rawFiles,
    currentRawFile,
    selectedMedia,
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
    fetchRawFile,
    fetchAllRawFiles,
    createRawFile,
    updateRawFile,
    deleteRawFile,
    duplicateRawFile,
    toggleStarRawFile,
    publishRawFile,
    completeSelection,
    recoverMedia,
    copyFilenames,
    getSelectedMedia,
  }
})
