/**
 * Proofing Store
 * Manages proofing phase state and operations
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProofingApi } from '@/api/proofing'

export const useProofingStore = defineStore('proofing', () => {
  const proofings = ref([])
  const currentProofing = ref(null)
  const feedback = ref([])
  const revisions = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const proofingApi = useProofingApi()

  /**
   * Fetch proofing by ID
   */
  const fetchProofing = async id => {
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
   * Update proofing
   */
  const updateProofing = async (id, data) => {
    isLoading.value = true
    error.value = null

    try {
      const updated = await proofingApi.updateProofing(id, data)

      const index = proofings.value.findIndex(p => p.id === id)
      if (index !== -1) {
        proofings.value[index] = updated
      }

      if (currentProofing.value && currentProofing.value.id === id) {
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
  const completeProofing = async id => {
    isLoading.value = true
    error.value = null

    try {
      const completed = await proofingApi.completeProofing(id)

      const index = proofings.value.findIndex(p => p.id === id)
      if (index !== -1) {
        proofings.value[index] = completed
      }

      if (currentProofing.value && currentProofing.value.id === id) {
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
   */
  const fetchAllProofing = async () => {
    isLoading.value = true
    error.value = null

    try {
      const allProofing = await proofingApi.fetchAllProofing()
      proofings.value = allProofing
      return allProofing
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
  const toggleStar = async proofingId => {
    const proofing = proofings.value.find(p => p.id === proofingId)
    if (!proofing) return

    const wasStarred = proofing.isStarred || proofing.starred || false
    const newStarredState = !wasStarred

    // Optimistic update - update UI immediately
    proofing.isStarred = newStarredState
    proofing.starred = newStarredState

    if (currentProofing.value && currentProofing.value.id === proofingId) {
      currentProofing.value.isStarred = newStarredState
      currentProofing.value.starred = newStarredState
    }

    try {
      // Sync with server in background
      await proofingApi.toggleStar(proofingId, newStarredState)
    } catch (err) {
      // Revert optimistic update on error
      proofing.isStarred = wasStarred
      proofing.starred = wasStarred
      if (currentProofing.value && currentProofing.value.id === proofingId) {
        currentProofing.value.isStarred = wasStarred
        currentProofing.value.starred = wasStarred
      }
      throw err
    }
  }

  return {
    proofings,
    currentProofing,
    feedback,
    revisions,
    isLoading,
    error,
    fetchProofing,
    fetchAllProofing,
    createProofing,
    updateProofing,
    uploadRevision,
    addFeedback,
    markCompleted,
    completeProofing,
    moveToCollection,
    toggleStar,
  }
})
