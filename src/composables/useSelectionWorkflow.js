/**
 * Selection Workflow Composable
 * Handles selection phase operations
 */

import { toast } from '@/utils/toast'
import { useSelectionsApi } from '@/api/selections'
import { useSelectionStore } from '@/stores/selection'
import { useMediaUpload } from './useMediaUpload'
import { getErrorMessage } from '@/utils/errors'

export function useSelectionWorkflow({
  selectionId,
  loadMediaItems,
  existingMedia = [],
  onUploadComplete, // Optional callback for post-upload actions (e.g., reload media sets)
} = {}) {
  const selectionsApi = useSelectionsApi()
  const selectionStore = useSelectionStore()

  const uploadMediaFn = async (uploadResult, file, { contextId, setId, mediaData }) => {
    return await selectionsApi.uploadMediaToSet(contextId, setId, mediaData)
  }

  // Supports both signatures: (mediaId) or (selectionId, setId, mediaId)
  const deleteMediaFn = async (selectionIdOrMediaId, setId, mediaId) => {
    let selectionIdValue
    let setIdValue
    let mediaIdValue

    // Determine which signature is being used
    if (mediaId !== undefined) {
      // Signature: (selectionId, setId, mediaId)
      selectionIdValue = selectionIdOrMediaId
      setIdValue = setId
      mediaIdValue = mediaId
    } else {
      // Signature: (mediaId) - need to find selectionId and setId from existingMedia
      mediaIdValue = selectionIdOrMediaId
      selectionIdValue = getSelectionId()
      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
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

    return await selectionsApi.deleteMedia(selectionIdValue, setIdValue, mediaIdValue)
  }

  // Use generic media upload composable
  const mediaUpload = useMediaUpload({
    uploadMediaFn,
    contextId: selectionId,
    existingMedia,
    loadMediaItems,
    deleteMediaFn,
    onUploadComplete, // Pass through for post-upload actions (e.g., reload media sets)
    contextType: 'selection',
  })

  // Helper to get selectionId value (handles refs, computed, functions, and plain values)
  const getSelectionId = () => {
    if (!selectionId) return null
    if (typeof selectionId === 'function') return selectionId()
    if (typeof selectionId === 'object' && selectionId !== null && 'value' in selectionId)
      return selectionId.value
    return selectionId
  }

  /**
   * Complete selection phase (for guests - sends mediaIds to mark as selected)
   */
  const completeSelection = async (mediaIds = []) => {
    try {
      const selectionIdValue = getSelectionId()

      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
      }

      await selectionStore.completeSelection(selectionIdValue, mediaIds)

      toast.success('Selection completed', {
        description: 'Selected media has been marked and the selection is now completed.',
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to complete selection')
      toast.error('Failed to complete selection', {
        description: errorMessage,
      })
      throw error
    }
  }

  /**
   * Publish selection (for creatives - publishes to active status)
   */
  const publishSelection = async () => {
    try {
      const selectionIdValue = getSelectionId()

      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
      }

      await selectionStore.publishSelection(selectionIdValue)

      toast.success('Selection published', {
        description: 'Selection has been published to active status.',
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to publish selection')
      toast.error('Failed to publish selection', {
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
      const selectionIdValue = getSelectionId()

      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
      }

      const recovered = await selectionStore.recoverMedia(selectionIdValue, mediaIds)

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
      const selectionIdValue = getSelectionId()

      if (!selectionIdValue) {
        throw new Error('Selection ID is required')
      }

      const filenames = await selectionStore.copyFilenames(selectionIdValue)

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

    // Selection-specific functions
    completeSelection,
    publishSelection,
    recoverDeletedMedia,
    copySelectedFilenames,
  }
}
