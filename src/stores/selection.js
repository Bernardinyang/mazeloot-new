/**
 * Selection Store
 * Manages selection phase state and operations
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSelectionsApi } from '@/api/selections'

export const useSelectionStore = defineStore('selection', () => {
  const selections = ref([])
  const currentSelection = ref(null)
  const selectedMedia = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const selectionsApi = useSelectionsApi()

  /**
   * Fetch selection by ID
   */
  const fetchSelection = async id => {
    isLoading.value = true
    error.value = null

    try {
      const selection = await selectionsApi.fetchSelection(id)
      currentSelection.value = selection
      selectedMedia.value = selection.media || []
      return selection
    } catch (err) {
      error.value = err.message || 'Failed to fetch selection'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create selection phase
   */
  const createSelection = async (projectId, data) => {
    isLoading.value = true
    error.value = null

    try {
      const newSelection = await selectionsApi.createSelection(projectId, data)
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
      const index = selections.value.findIndex(s => s.id === id)
      if (index !== -1) {
        selections.value[index] = updated
      }

      // Update current selection if it's the one being updated
      if (currentSelection.value && currentSelection.value.id === id) {
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
   * Complete selection
   */
  const completeSelection = async id => {
    isLoading.value = true
    error.value = null

    try {
      const completed = await selectionsApi.completeSelection(id)

      // Update in selections array
      const index = selections.value.findIndex(s => s.id === id)
      if (index !== -1) {
        selections.value[index] = completed
      }

      // Update current selection
      if (currentSelection.value && currentSelection.value.id === id) {
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
  const recoverMedia = async selectionId => {
    isLoading.value = true
    error.value = null

    try {
      const recovered = await selectionsApi.recoverDeletedMedia(selectionId)
      return recovered
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
  const getSelectedMedia = async selectionId => {
    isLoading.value = true
    error.value = null

    try {
      const media = await selectionsApi.getSelectedMedia(selectionId)
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
   * Fetch all selections (both standalone and project-linked)
   */
  const fetchAllSelections = async () => {
    isLoading.value = true
    error.value = null

    try {
      const allSelections = await selectionsApi.fetchAllSelections()
      selections.value = allSelections
      return allSelections
    } catch (err) {
      error.value = err.message || 'Failed to fetch selections'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle star status with optimistic update
   */
  const toggleStar = async selectionId => {
    const selection = selections.value.find(s => s.id === selectionId)
    if (!selection) return

    const wasStarred = selection.isStarred || selection.starred || false
    const newStarredState = !wasStarred

    // Optimistic update - update UI immediately
    selection.isStarred = newStarredState
    selection.starred = newStarredState

    // Update current selection if it's the one being starred
    if (currentSelection.value && currentSelection.value.id === selectionId) {
      currentSelection.value.isStarred = newStarredState
      currentSelection.value.starred = newStarredState
    }

    try {
      // Sync with server in background
      await selectionsApi.toggleStar(selectionId, newStarredState)
    } catch (err) {
      // Revert optimistic update on error
      selection.isStarred = wasStarred
      selection.starred = wasStarred
      if (currentSelection.value && currentSelection.value.id === selectionId) {
        currentSelection.value.isStarred = wasStarred
        currentSelection.value.starred = wasStarred
      }
      throw err
    }
  }

  return {
    selections,
    currentSelection,
    selectedMedia,
    isLoading,
    error,
    fetchSelection,
    fetchAllSelections,
    createSelection,
    updateSelection,
    completeSelection,
    recoverMedia,
    copyFilenames,
    getSelectedMedia,
    toggleStar,
  }
})
