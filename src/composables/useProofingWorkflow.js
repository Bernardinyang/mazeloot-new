/**
 * Proofing Workflow Composable
 * Handles proofing phase operations
 */

import { toast } from '@/utils/toast'
import { useProofingApi } from '@/api/proofing'
import { useProofingStore } from '@/stores/proofing'
import { useMediaUpload } from './useMediaUpload'
import { getErrorMessage } from '@/utils/errors'

export function useProofingWorkflow({
  proofingId,
  loadMediaItems,
  existingMedia = [],
  onUploadComplete, // Optional callback for post-upload actions (e.g., reload media sets)
} = {}) {
  const proofingApi = useProofingApi()
  const proofingStore = useProofingStore()

  const uploadMediaFn = async (uploadResult, file, { contextId, setId, mediaData }) => {
    return await proofingApi.uploadMediaToSet(contextId, setId, mediaData)
  }

  // Supports both signatures: (mediaId) or (proofingId, setId, mediaId)
  const deleteMediaFn = async (proofingIdOrMediaId, setId, mediaId) => {
    let proofingIdValue
    let setIdValue
    let mediaIdValue

    // Determine which signature is being used
    if (mediaId !== undefined) {
      // Signature: (proofingId, setId, mediaId)
      proofingIdValue = proofingIdOrMediaId
      setIdValue = setId
      mediaIdValue = mediaId
    } else {
      // Signature: (mediaId) - need to find proofingId and setId from existingMedia
      mediaIdValue = proofingIdOrMediaId
      proofingIdValue = getProofingId()
      if (!proofingIdValue) {
        throw new Error('Proofing ID is required')
      }
      // Try to find the setId from existingMedia
      const existingMediaList =
        typeof existingMedia === 'function' ? existingMedia() : existingMedia
      const media = Array.isArray(existingMediaList)
        ? existingMediaList.find(m => m.id === mediaIdValue)
        : null
      if (media && media.setId) {
        setIdValue = media.setId
      } else {
        throw new Error('Set ID is required to delete media')
      }
    }

    return await proofingApi.deleteMedia(proofingIdValue, setIdValue, mediaIdValue)
  }

  // Use generic media upload composable
  const mediaUpload = useMediaUpload({
    uploadMediaFn,
    contextId: proofingId,
    existingMedia,
    loadMediaItems,
    deleteMediaFn,
    onUploadComplete, // Pass through for post-upload actions (e.g., reload media sets)
    contextType: 'proofing',
  })

  // Helper to get proofingId value (handles refs, computed, functions, and plain values)
  const getProofingId = () => {
    if (!proofingId) return null
    if (typeof proofingId === 'function') return proofingId()
    if (typeof proofingId === 'object' && proofingId !== null && 'value' in proofingId)
      return proofingId.value
    return proofingId
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

      // Get projectId from current proofing if available
      const projectId = proofingStore.currentProofing?.projectId || 
                        proofingStore.currentProofing?.project_uuid || 
                        null

      await proofingStore.completeProofing(proofingIdValue, projectId)

      toast.success('Proofing completed', {
        description: 'You can now move approved media to collections.',
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to complete proofing')
      toast.error('Failed to complete proofing', {
        description: errorMessage,
      })
      throw error
    }
  }

  /**
   * Publish proofing (for creatives - publishes to active status)
   */
  const publishProofing = async () => {
    try {
      const proofingIdValue = getProofingId()

      if (!proofingIdValue) {
        throw new Error('Proofing ID is required')
      }

      await proofingStore.publishProofing(proofingIdValue)

      toast.success('Proofing published', {
        description: 'Proofing has been published to active status.',
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to publish proofing')
      toast.error('Failed to publish proofing', {
        description: errorMessage,
      })
      throw error
    }
  }

  /**
   * Recover deleted media (within 30 days)
   */
  const recoverDeletedMedia = async mediaIds => {
    try {
      const proofingIdValue = getProofingId()

      if (!proofingIdValue) {
        throw new Error('Proofing ID is required')
      }

      const recovered = await proofingStore.recoverMedia(proofingIdValue, mediaIds)

      if (loadMediaItems) {
        await loadMediaItems()
      }

      toast.success('Media recovered', {
        description: `${recovered.recoveredCount || mediaIds.length} file(s) recovered successfully.`,
      })

      return recovered
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to recover media')
      toast.error('Recovery failed', {
        description: errorMessage,
      })
      throw error
    }
  }

  /**
   * Copy selected filenames for editing
   */
  const copySelectedFilenames = async () => {
    try {
      const proofingIdValue = getProofingId()

      if (!proofingIdValue) {
        throw new Error('Proofing ID is required')
      }

      const filenames = await proofingStore.copyFilenames(proofingIdValue)

      if (filenames.length === 0) {
        toast.info('No files selected', {
          description: 'Please select some media first.',
        })
        return
      }

      // Copy to clipboard
      const text = filenames.join('\n')
      await navigator.clipboard.writeText(text)

      toast.success('Filenames copied', {
        description: `${filenames.length} filename(s) copied to clipboard.`,
      })

      return filenames
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to copy filenames')
      toast.error('Failed to copy filenames', {
        description: errorMessage,
      })
      throw error
    }
  }

  return {
    // Upload functions (from generic composable)
    uploadMediaToSet: mediaUpload.uploadMediaToSet,
    processFiles: mediaUpload.processFiles,
    handleConfirmDuplicateFiles: mediaUpload.handleConfirmDuplicateFiles,
    handleCancelDuplicateFiles: mediaUpload.handleCancelDuplicateFiles,
    handleSetDuplicateAction: mediaUpload.handleSetDuplicateAction,
    handleReplaceAllDuplicates: mediaUpload.handleReplaceAllDuplicates,
    handleSkipAllDuplicates: mediaUpload.handleSkipAllDuplicates,
    cancelUpload: mediaUpload.cancelUpload,

    // State (from generic composable)
    uploadProgress: mediaUpload.uploadProgress,
    overallProgress: mediaUpload.overallProgress,
    uploadErrors: mediaUpload.uploadErrors,
    isUploading: mediaUpload.isUploading,
    showDuplicateFilesModal: mediaUpload.showDuplicateFilesModal,
    duplicateFiles: mediaUpload.duplicateFiles,
    duplicateFileActions: mediaUpload.duplicateFileActions,
    duplicateFileActionsObject: mediaUpload.duplicateFileActionsObject,
    duplicateFileActionsKey: mediaUpload.duplicateFileActionsKey,

    // Proofing-specific functions
    completeProofing,
    publishProofing,
    recoverDeletedMedia,
    copySelectedFilenames,
  }
}
