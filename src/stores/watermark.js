/**
 * Watermark Store
 * Manages watermark state and operations
 * Persists data to localStorage via watchers
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWatermarksApi } from '@/api/watermarks'

export const useWatermarkStore = defineStore('watermark', () => {
  const watermarks = ref([])
  const currentWatermark = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const watermarksApi = useWatermarksApi()

  /**
   * Fetch all watermarks
   */
  const fetchWatermarks = async () => {
    isLoading.value = true
    error.value = null
    try {
      const data = await watermarksApi.fetchWatermarks()
      watermarks.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch watermarks'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch single watermark by ID
   */
  const fetchWatermark = async id => {
    isLoading.value = true
    error.value = null
    try {
      const data = await watermarksApi.fetchWatermark(id)
      currentWatermark.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch watermark'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create new watermark with optimistic update
   */
  const createWatermark = async data => {
    isLoading.value = true
    error.value = null

    // Create temporary watermark for optimistic update
    const tempId = `temp-${Date.now()}`
    const tempWatermark = {
      id: tempId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Optimistic update - add to UI immediately
    watermarks.value.push(tempWatermark)

    try {
      // Create on server
      const newWatermark = await watermarksApi.createWatermark(data)

      // Replace temp watermark with real one
      const index = watermarks.value.findIndex(w => w.id === tempId)
      if (index !== -1) {
        watermarks.value[index] = newWatermark
      } else {
        watermarks.value.push(newWatermark)
      }

      return newWatermark
    } catch (err) {
      // Revert optimistic update on error
      watermarks.value = watermarks.value.filter(w => w.id !== tempId)
      error.value = err.message || 'Failed to create watermark'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update watermark with optimistic update
   */
  const updateWatermark = async (id, data) => {
    isLoading.value = true
    error.value = null

    // Store original watermark for potential revert
    const watermarkIndex = watermarks.value.findIndex(w => w.id === id)
    const originalWatermark = watermarkIndex !== -1 ? { ...watermarks.value[watermarkIndex] } : null
    const originalCurrent = currentWatermark.value?.id === id ? { ...currentWatermark.value } : null

    // Optimistic update - update UI immediately
    if (watermarkIndex !== -1) {
      watermarks.value[watermarkIndex] = {
        ...watermarks.value[watermarkIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      }
    }
    if (currentWatermark.value?.id === id) {
      currentWatermark.value = {
        ...currentWatermark.value,
        ...data,
        updatedAt: new Date().toISOString(),
      }
    }

    try {
      // Update on server
      const updated = await watermarksApi.updateWatermark(id, data)

      // Replace with server response
      if (watermarkIndex !== -1) {
        watermarks.value[watermarkIndex] = updated
      }
      if (currentWatermark.value?.id === id) {
        currentWatermark.value = updated
      }
      return updated
    } catch (err) {
      // Revert optimistic update on error
      if (originalWatermark) {
        watermarks.value[watermarkIndex] = originalWatermark
      }
      if (originalCurrent) {
        currentWatermark.value = originalCurrent
      }
      error.value = err.message || 'Failed to update watermark'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete watermark with optimistic update
   */
  const deleteWatermark = async id => {
    isLoading.value = true
    error.value = null

    // Store watermark for potential revert
    const watermarkToDelete = watermarks.value.find(w => w.id === id)
    const wasCurrent = currentWatermark.value?.id === id

    // Optimistic update - remove from UI immediately
    watermarks.value = watermarks.value.filter(w => w.id !== id)
    if (wasCurrent) {
      currentWatermark.value = null
    }

    try {
      // Delete on server
      await watermarksApi.deleteWatermark(id)
    } catch (err) {
      // Revert optimistic update on error
      if (watermarkToDelete) {
        watermarks.value.push(watermarkToDelete)
        // Restore original order
        watermarks.value.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      }
      if (wasCurrent && watermarkToDelete) {
        currentWatermark.value = watermarkToDelete
      }
      error.value = err.message || 'Failed to delete watermark'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Upload watermark image
   */
  const uploadWatermarkImage = async file => {
    isLoading.value = true
    error.value = null
    try {
      const result = await watermarksApi.uploadWatermarkImage(file)
      return result.url
    } catch (err) {
      error.value = err.message || 'Failed to upload image'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear current watermark
   */
  const clearCurrent = () => {
    currentWatermark.value = null
  }

  return {
    watermarks,
    currentWatermark,
    isLoading,
    error,
    fetchWatermarks,
    fetchWatermark,
    createWatermark,
    updateWatermark,
    deleteWatermark,
    uploadWatermarkImage,
    clearCurrent,
  }
})
