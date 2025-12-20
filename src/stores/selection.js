/**
 * Selection Store
 * Manages selection phase state and operations
 */

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useSelectionsApi } from '@/api/selections'
import { storage } from '@/utils/storage'

const VIEW_MODE_STORAGE_KEY = 'mazeloot_selection_view_mode'

export const useSelectionStore = defineStore('selection', () => {
  const selections = ref([])
  const currentSelection = ref(null)
  const selectedMedia = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const viewMode = ref(storage.get(VIEW_MODE_STORAGE_KEY) || 'grid')

  const selectionsApi = useSelectionsApi()

  // Persist view mode to localStorage
  watch(viewMode, () => {
    storage.set(VIEW_MODE_STORAGE_KEY, viewMode.value)
  })

  /**
   * Set view mode (grid or list)
   */
  const setViewMode = mode => {
    if (mode === 'grid' || mode === 'list') {
      viewMode.value = mode
    } else {
      console.warn(`Invalid view mode: ${mode}. Using 'grid'.`)
      viewMode.value = 'grid'
    }
  }

  /**
   * Fetch selection by ID
   */
  const fetchSelection = async id => {
    isLoading.value = true
    error.value = null

    try {
      const selection = await selectionsApi.fetchSelection(id)
      currentSelection.value = selection
      // Extract selected media if available
      if (selection.mediaSets) {
        const allMedia = []
        for (const set of selection.mediaSets) {
          if (set.media) {
            allMedia.push(...set.media)
          }
        }
        selectedMedia.value = allMedia.filter(m => m.isSelected)
      } else {
        selectedMedia.value = []
      }
      return selection
    } catch (err) {
      error.value = err.message || 'Failed to fetch selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch all selections (both standalone and project-linked)
   */
  const fetchAllSelections = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      return await selectionsApi.fetchAllSelections(params)
    } catch (err) {
      error.value = err.message || 'Failed to fetch selections'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create selection phase
   */
  const createSelection = async data => {
    isLoading.value = true
    error.value = null

    try {
      const newSelection = await selectionsApi.createSelection(data)
      selections.value.push(newSelection)
      return newSelection
    } catch (err) {
      error.value = err.message || 'Failed to create selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update selection
   */
  const updateSelection = async (id, data) => {
    isLoading.value = true
    error.value = null

    try {
      const updated = await selectionsApi.updateSelection(id, data)

      // Update in selections array
      const index = selections.value.findIndex(s => s.id === id || s.uuid === id)
      if (index !== -1) {
        selections.value[index] = updated
      }

      // Update current selection if it's the one being updated
      if (
        currentSelection.value &&
        (currentSelection.value.id === id || currentSelection.value.uuid === id)
      ) {
        currentSelection.value = updated
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
   * Publish selection (creative can only publish to active)
   */
  const publishSelection = async id => {
    isLoading.value = true
    error.value = null

    try {
      const published = await selectionsApi.publishSelection(id)

      // Update in selections array
      const index = selections.value.findIndex(s => s.id === id || s.uuid === id)
      if (index !== -1) {
        selections.value[index] = published
      }

      // Update current selection
      if (
        currentSelection.value &&
        (currentSelection.value.id === id || currentSelection.value.uuid === id)
      ) {
        currentSelection.value = published
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
   * Complete selection (guest access - marks media as selected and completes)
   */
  const completeSelection = async (id, mediaIds = []) => {
    isLoading.value = true
    error.value = null

    try {
      const completed = await selectionsApi.completeSelection(id, mediaIds)

      // Update in selections array
      const index = selections.value.findIndex(s => s.id === id || s.uuid === id)
      if (index !== -1) {
        selections.value[index] = completed
      }

      // Update current selection
      if (
        currentSelection.value &&
        (currentSelection.value.id === id || currentSelection.value.uuid === id)
      ) {
        currentSelection.value = completed
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
   * Recover deleted media
   */
  const recoverMedia = async (selectionId, mediaIds) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await selectionsApi.recoverDeletedMedia(selectionId, mediaIds)
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
      const filenames = await selectionsApi.copyFilenames(selectionId)
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
      const media = await selectionsApi.getSelectedMedia(selectionId, setId)
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
   * Delete selection
   */
  const deleteSelection = async id => {
    isLoading.value = true
    error.value = null

    try {
      await selectionsApi.deleteSelection(id)
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle Star selection
   */
  const toggleStarSelection = async id => {
    isLoading.value = true
    error.value = null

    try {
      await selectionsApi.toggleStarSelection(id)
      return true
    } catch (err) {
      error.value = err.message || 'Failed to add selection to favourite'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    selections,
    currentSelection,
    selectedMedia,
    isLoading,
    error,
    viewMode,
    setViewMode,
    fetchSelection,
    fetchAllSelections,
    createSelection,
    updateSelection,
    deleteSelection,
    toggleStarSelection,
    publishSelection,
    completeSelection,
    recoverMedia,
    copyFilenames,
    getSelectedMedia,
  }
})
