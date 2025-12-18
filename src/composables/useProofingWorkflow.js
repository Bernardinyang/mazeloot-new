/**
 * Proofing Workflow Composable
 * Handles proofing phase operations
 */

import { toast } from 'vue-sonner'
import { useMediaApi } from '@/api/media'
import { useProofingStore } from '@/stores/proofing'

export function useProofingWorkflow({ proofingId, loadMediaItems } = {}) {
  const mediaApi = useMediaApi()
  const proofingStore = useProofingStore()

  // Helper to get proofingId value (handles refs, computed, functions, and plain values)
  const getProofingId = () => {
    if (!proofingId) return null
    if (typeof proofingId === 'function') return proofingId()
    if (typeof proofingId === 'object' && proofingId !== null && 'value' in proofingId)
      return proofingId.value
    return proofingId
  }

  /**
   * Upload edited media to proofing phase
   */
  const uploadEditedMedia = async (files, originalMediaId, setId) => {
    try {
      const proofingIdValue = getProofingId()

      if (!proofingIdValue) {
        throw new Error('Proofing ID is required')
      }

      const uploaded = []

      for (const file of files) {
        // Determine media type
        const type = file.type.startsWith('image/') ? 'image' : 'video'

        // Create media data for revision (ensure plain object, no refs)
        const mediaData = {
          originalMediaId: originalMediaId,
          phase: 'proofing',
          phaseId: proofingIdValue,
          setId: setId,
          type: type,
          title: file.name,
          url: URL.createObjectURL(file), // In production, upload to server first
          thumbnail: type === 'image' ? URL.createObjectURL(file) : null,
          isCompleted: false,
          order: 0,
        }

        const revision = await proofingStore.uploadRevision(proofingIdValue, mediaData)
        uploaded.push(revision)
      }

      if (loadMediaItems) {
        await loadMediaItems()
      }

      toast.success('Revision uploaded', {
        description: `${uploaded.length} file(s) uploaded successfully.`,
      })

      return uploaded
    } catch (error) {
      console.error('Failed to upload revision:', error)
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Failed to upload revision.',
      })
      throw error
    }
  }

  /**
   * Add client feedback
   */
  const addFeedback = async (mediaId, type, content, createdBy = 'client') => {
    try {
      const feedback = await proofingStore.addFeedback(mediaId, {
        type,
        content,
        createdBy,
      })

      toast.success('Feedback added', {
        description: 'Your feedback has been recorded.',
      })

      return feedback
    } catch (error) {
      console.error('Failed to add feedback:', error)
      toast.error('Failed to add feedback', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      })
      throw error
    }
  }

  /**
   * Mark media as approved/completed
   */
  const markMediaApproved = async mediaId => {
    try {
      await proofingStore.markCompleted(mediaId)

      if (loadMediaItems) {
        await loadMediaItems()
      }

      toast.success('Media approved', {
        description: 'This media has been marked as completed.',
      })
    } catch (error) {
      console.error('Failed to mark media as approved:', error)
      toast.error('Failed to approve media', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      })
      throw error
    }
  }

  /**
   * Upload new revision for existing media
   */
  const uploadRevision = async (mediaId, file, setId) => {
    try {
      const proofingIdValue = getProofingId()

      if (!proofingIdValue) {
        throw new Error('Proofing ID is required')
      }

      // Get original media to find originalMediaId
      const allMedia = await mediaApi.fetchPhaseMedia('proofing', proofingIdValue)
      const originalMedia = allMedia.find(m => m.id === mediaId)

      if (!originalMedia) {
        throw new Error('Media not found')
      }

      const originalMediaId = originalMedia.originalMediaId || mediaId

      // Determine media type
      const type = file.type.startsWith('image/') ? 'image' : 'video'

      // Create revision
      const mediaData = {
        originalMediaId: originalMediaId,
        phase: 'proofing',
        phaseId: proofingIdValue,
        setId: setId || originalMedia.setId,
        type: type,
        title: file.name,
        url: URL.createObjectURL(file), // In production, upload to server first
        thumbnail: type === 'image' ? URL.createObjectURL(file) : null,
        isCompleted: false,
        order: 0,
      }

      const revision = await proofingStore.uploadRevision(proofingIdValue, mediaData)

      if (loadMediaItems) {
        await loadMediaItems()
      }

      toast.success('Revision uploaded', {
        description: 'New revision has been uploaded.',
      })

      return revision
    } catch (error) {
      console.error('Failed to upload revision:', error)
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Failed to upload revision.',
      })
      throw error
    }
  }

  /**
   * Complete proofing phase
   */
  const completeProofing = async () => {
    try {
      const proofingIdValue = getProofingId()

      if (!proofingIdValue) {
        throw new Error('Proofing ID is required')
      }

      await proofingStore.completeProofing(proofingIdValue)

      toast.success('Proofing completed', {
        description: 'You can now move approved media to collections.',
      })
    } catch (error) {
      console.error('Failed to complete proofing:', error)
      toast.error('Failed to complete proofing', {
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      })
      throw error
    }
  }

  /**
   * Move approved media to collection
   * If collectionId is null, a new collection will be created
   */
  const moveApprovedToCollection = async (collectionId = null) => {
    try {
      const proofingIdValue = getProofingId()

      if (!proofingIdValue) {
        throw new Error('Proofing ID is required')
      }

      const result = await proofingStore.moveToCollection(proofingIdValue, collectionId)

      toast.success('Media moved', {
        description: `${result.moved.length} file(s) moved to collection. Low-res copies kept in proofing.`,
      })

      if (loadMediaItems) {
        await loadMediaItems()
      }

      return result
    } catch (error) {
      console.error('Failed to move media to collection:', error)
      toast.error('Move failed', {
        description: error instanceof Error ? error.message : 'Failed to move media to collection.',
      })
      throw error
    }
  }

  return {
    uploadEditedMedia,
    addFeedback,
    markMediaApproved,
    uploadRevision,
    completeProofing,
    moveApprovedToCollection,
  }
}
