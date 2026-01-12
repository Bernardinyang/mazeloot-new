/**
 * Raw Files Workflow Composable
 * Handles raw files phase operations
 */

import { toast } from '@/shared/utils/toast'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { useMediaUpload } from './useMediaUpload'
import { getErrorMessage } from '@/shared/utils/errors'
import { VALID_RAW_FILES_MIME_TYPES } from '@/shared/utils/media/filterValidUploadFiles'

export function useRawFilesWorkflow({
  rawFilesId,
  loadMediaItems,
  existingMedia = [],
  onUploadComplete, // Optional callback for post-upload actions (e.g., reload media sets)
} = {}) {
  const rawFilesApi = useRawFilesApi()

  const uploadMediaFn = async (uploadResult, file, { contextId, setId, mediaData }) => {
    return await rawFilesApi.uploadMediaToSet(contextId, setId, mediaData)
  }

  // Supports both signatures: (mediaId) or (rawFilesId, setId, mediaId)
  const deleteMediaFn = async (rawFilesIdOrMediaId, setId, mediaId) => {
    let rawFilesIdValue
    let setIdValue
    let mediaIdValue

    // Determine which signature is being used
    if (mediaId !== undefined) {
      // Signature: (rawFilesId, setId, mediaId)
      rawFilesIdValue = rawFilesIdOrMediaId
      setIdValue = setId
      mediaIdValue = mediaId
    } else {
      // Signature: (mediaId) - need to find rawFilesId and setId from existingMedia
      mediaIdValue = rawFilesIdOrMediaId
      rawFilesIdValue = getRawFilesId()
      if (!rawFilesIdValue) {
        throw new Error('Raw Files ID is required')
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

    return await rawFilesApi.deleteMedia(rawFilesIdValue, setIdValue, mediaIdValue)
  }

  // Use generic media upload composable
  const mediaUpload = useMediaUpload({
    uploadMediaFn,
    contextId: rawFilesId,
    existingMedia,
    loadMediaItems,
    deleteMediaFn,
    onUploadComplete, // Pass through for post-upload actions (e.g., reload media sets)
    contextType: 'raw_files',
    validationOptions: {
      allowedTypes: VALID_RAW_FILES_MIME_TYPES,
    },
  })

  // Helper to get rawFilesId value (handles refs, computed, functions, and plain values)
  const getRawFilesId = () => {
    if (!rawFilesId) return null
    if (typeof rawFilesId === 'function') return rawFilesId()
    if (typeof rawFilesId === 'object' && rawFilesId !== null && 'value' in rawFilesId)
      return rawFilesId.value
    return rawFilesId
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
  }
}
