/**
 * RawFile Workflow Composable
 * Handles rawFile phase operations
 */

import { toast } from '@/shared/utils/toast'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { useRawFileStore } from '@/domains/memora/stores/rawFile'
import { useMediaUpload } from './useMediaUpload'
import { getErrorMessage } from '@/shared/utils/errors'

export function useRawFileWorkflow({
  rawFileId,
  loadMediaItems,
  existingMedia = [],
  onUploadComplete, // Optional callback for post-upload actions (e.g., reload media sets)
} = {}) {
  const rawFilesApi = useRawFilesApi()
  const rawFileStore = useRawFileStore()

  const uploadMediaFn = async (uploadResult, file, { contextId, setId, mediaData }) => {
    return await rawFilesApi.uploadMediaToSet(contextId, setId, mediaData)
  }

  // Supports both signatures: (mediaId) or (rawFileId, setId, mediaId)
  const deleteMediaFn = async (rawFileIdOrMediaId, setId, mediaId) => {
    let rawFileIdValue
    let setIdValue
    let mediaIdValue

    // Determine which signature is being used
    if (mediaId !== undefined) {
      // Signature: (rawFileId, setId, mediaId)
      rawFileIdValue = rawFileIdOrMediaId
      setIdValue = setId
      mediaIdValue = mediaId
    } else {
      // Signature: (mediaId) - need to find rawFileId and setId from existingMedia
      mediaIdValue = rawFileIdOrMediaId
      rawFileIdValue = getRawFileId()
      if (!rawFileIdValue) {
        throw new Error('RawFile ID is required')
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

    return await rawFilesApi.deleteMedia(rawFileIdValue, setIdValue, mediaIdValue)
  }

  // Use generic media upload composable
  const mediaUpload = useMediaUpload({
    uploadMediaFn,
    contextId: rawFileId,
    existingMedia,
    loadMediaItems,
    deleteMediaFn,
    onUploadComplete, // Pass through for post-upload actions (e.g., reload media sets)
    contextType: 'rawFile',
  })

  // Helper to get rawFileId value (handles refs, computed, functions, and plain values)
  const getRawFileId = () => {
    if (!rawFileId) return null
    if (typeof rawFileId === 'function') return rawFileId()
    if (typeof rawFileId === 'object' && rawFileId !== null && 'value' in rawFileId)
      return rawFileId.value
    return rawFileId
  }

  /**
   * Complete rawFile phase (for guests - sends mediaIds to mark as selected)
   */
  const completeRawFile = async (mediaIds = []) => {
    try {
      const rawFileIdValue = getRawFileId()

      if (!rawFileIdValue) {
        throw new Error('RawFile ID is required')
      }

      await rawFileStore.completeRawFile(rawFileIdValue, mediaIds)

      toast.success('RawFile completed', {
        description: 'Selected media has been marked and the rawFile is now completed.',
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to complete rawFile')
      toast.error('Failed to complete rawFile', {
        description: errorMessage,
      })
      throw error
    }
  }

  /**
   * Publish rawFile (for creatives - publishes to active status)
   */
  const publishRawFile = async () => {
    try {
      const rawFileIdValue = getRawFileId()

      if (!rawFileIdValue) {
        throw new Error('RawFile ID is required')
      }

      await rawFileStore.publishRawFile(rawFileIdValue)

      toast.success('RawFile published', {
        description: 'RawFile has been published to active status.',
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to publish rawFile')
      toast.error('Failed to publish rawFile', {
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
      const rawFileIdValue = getRawFileId()

      if (!rawFileIdValue) {
        throw new Error('RawFile ID is required')
      }

      const recovered = await rawFileStore.recoverMedia(rawFileIdValue, mediaIds)

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
      const rawFileIdValue = getRawFileId()

      if (!rawFileIdValue) {
        throw new Error('RawFile ID is required')
      }

      const filenames = await rawFileStore.copyFilenames(rawFileIdValue)

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

    // RawFile-specific functions
    completeRawFile,
    publishRawFile,
    recoverDeletedMedia,
    copySelectedFilenames,
  }
}
