/**
 * Collection Workflow Composable
 * Handles collection phase operations
 */

import { toast } from '@/utils/toast'
import { useCollectionsApi } from '@/api/collections'
import { useGalleryStore } from '@/stores/gallery'
import { useMediaUpload } from './useMediaUpload'
import { getErrorMessage } from '@/utils/errors'

export function useCollectionWorkflow({
  collectionId,
  loadMediaItems,
  existingMedia = [],
  onUploadComplete, // Optional callback for post-upload actions (e.g., reload media sets)
} = {}) {
  const collectionsApi = useCollectionsApi()
  const galleryStore = useGalleryStore()

  const uploadMediaFn = async (uploadResult, file, { contextId, setId, mediaData }) => {
    return await collectionsApi.uploadMediaToSet(contextId, setId, mediaData)
  }

  // Supports both signatures: (mediaId) or (collectionId, setId, mediaId)
  const deleteMediaFn = async (collectionIdOrMediaId, setId, mediaId) => {
    let collectionIdValue
    let setIdValue
    let mediaIdValue

    // Determine which signature is being used
    if (mediaId !== undefined) {
      // Signature: (collectionId, setId, mediaId)
      collectionIdValue = collectionIdOrMediaId
      setIdValue = setId
      mediaIdValue = mediaId
    } else {
      // Signature: (mediaId) - need to find collectionId and setId from existingMedia
      mediaIdValue = collectionIdOrMediaId
      collectionIdValue = getCollectionId()
      if (!collectionIdValue) {
        throw new Error('Collection ID is required')
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

    return await collectionsApi.deleteMedia(collectionIdValue, setIdValue, mediaIdValue)
  }

  // Use generic media upload composable
  const mediaUpload = useMediaUpload({
    uploadMediaFn,
    contextId: collectionId,
    existingMedia,
    loadMediaItems,
    deleteMediaFn,
    onUploadComplete, // Pass through for post-upload actions (e.g., reload media sets)
    contextType: 'collection',
  })

  // Helper to get collectionId value (handles refs, computed, functions, and plain values)
  const getCollectionId = () => {
    if (!collectionId) return null
    if (typeof collectionId === 'function') return collectionId()
    if (typeof collectionId === 'object' && collectionId !== null && 'value' in collectionId)
      return collectionId.value
    return collectionId
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
