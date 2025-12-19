/**
 * Generic Media Upload Composable
 * Reusable upload functionality for selections, collections, proofing, etc.
 * Handles progress tracking, validation, batch optimization, retry logic, and duplicate detection
 *
 * @example
 * // For Selections:
 * const uploadMediaFn = async (uploadResult, file, { contextId, setId, mediaData }) => {
 *   return await selectionsApi.uploadMediaToSet(contextId, setId, mediaData)
 * }
 * const mediaUpload = useMediaUpload({
 *   uploadMediaFn,
 *   contextId: selectionId,
 *   existingMedia: () => mediaItems.value,
 *   loadMediaItems,
 * })
 *
 * @example
 * // For Collections:
 * const uploadMediaFn = async (uploadResult, file, { contextId, setId, mediaData }) => {
 *   return await mediaApi.addMedia(contextId, {
 *     phase: 'collection',
 *     phaseId: contextId,
 *     setId,
 *     url: mediaData.uploadUrl,
 *     thumbnail: mediaData.thumbnail,
 *     type: mediaData.type,
 *     title: mediaData.filename,
 *   })
 * }
 * const mediaUpload = useMediaUpload({
 *   uploadMediaFn,
 *   contextId: collectionId,
 *   setId,
 *   existingMedia: () => mediaItems.value,
 *   loadMediaItems,
 * })
 */

import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { apiClient } from '@/api/client'
import { validateUploadFile } from '@/utils/media/validateUploadFile'
import { splitDuplicateUploadFiles } from '@/utils/media/splitDuplicateUploadFiles'
import { filterValidUploadFiles } from '@/utils/media/filterValidUploadFiles'

/**
 * @param {object} options - Configuration options
 * @param {function} options.uploadMediaFn - Function to upload a single media item: (uploadResult, file, context) => Promise<media>
 * @param {function|ref|string} options.contextId - Context ID (selectionId, collectionId, proofingId, etc.)
 * @param {function|ref|string} options.setId - Set ID (optional, can be provided per upload)
 * @param {function|ref|Array} options.existingMedia - Array of existing media for duplicate checking
 * @param {function} options.loadMediaItems - Function to reload media after upload
 * @param {object} options.validationOptions - Validation options (maxSize, allowedTypes, dimensions)
 * @param {number} options.batchSize - Number of concurrent uploads (default: 3)
 * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
 */
export function useMediaUpload(options = {}) {
  const {
    uploadMediaFn,
    contextId,
    setId: defaultSetId,
    existingMedia = [],
    loadMediaItems,
    validationOptions = {},
    batchSize = 3,
    maxRetries = 3,
  } = options

  // Upload progress tracking
  const uploadProgress = ref({}) // { fileId: { loaded, total, percentage, status, error } }
  const overallProgress = ref(0)
  const uploadErrors = ref([]) // Array of failed uploads with retry capability
  const isUploading = ref(false)
  const uploadAbortController = ref(null)
  const showDuplicateFilesModal = ref(false)
  const duplicateFiles = ref([])
  const duplicateFileActions = ref(new Map())

  // Helper to get context ID value (handles refs, computed, functions, and plain values)
  const getContextId = () => {
    if (!contextId) return null
    if (typeof contextId === 'function') return contextId()
    if (typeof contextId === 'object' && contextId !== null && 'value' in contextId)
      return contextId.value
    return contextId
  }

  // Helper to get set ID value
  const getSetId = providedSetId => {
    const setId = providedSetId || defaultSetId
    if (!setId) return null
    if (typeof setId === 'function') return setId()
    if (typeof setId === 'object' && setId !== null && 'value' in setId) return setId.value
    return setId
  }

  // Helper to get existing media list
  const getExistingMedia = () => {
    if (typeof existingMedia === 'function') return existingMedia()
    if (Array.isArray(existingMedia)) return existingMedia
    if (existingMedia && typeof existingMedia === 'object' && 'value' in existingMedia)
      return existingMedia.value
    return []
  }

  // Helper to generate file ID
  const getFileId = (file, index) => {
    return `${file.name}-${file.size}-${index}-${file.lastModified}`
  }

  // Retry with exponential backoff
  const retryWithBackoff = async (fn, retries = maxRetries, baseDelay = 1000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        if (attempt === retries - 1) {
          throw error
        }
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  /**
   * Process files and check for duplicates
   */
  const processFiles = async files => {
    const contextIdValue = getContextId()

    if (!contextIdValue) {
      toast.error('No context loaded', {
        description: 'Please select a context first.',
      })
      return { hasDuplicates: false, filesToUpload: [] }
    }

    // Filter valid files
    const validFiles = filterValidUploadFiles(Array.from(files))

    if (validFiles.length === 0) {
      toast.error('Invalid files', {
        description: 'Please select valid image or video files.',
      })
      return { hasDuplicates: false, filesToUpload: [] }
    }

    // Get existing media for duplicate check
    const existingMediaList = getExistingMedia()

    // Check for duplicates
    const { duplicates, newFiles } = splitDuplicateUploadFiles(validFiles, existingMediaList)

    if (duplicates.length > 0) {
      duplicateFiles.value = duplicates
      duplicateFileActions.value = new Map()
      // Default action: skip
      duplicates.forEach(({ file }) => {
        duplicateFileActions.value.set(file.name, 'skip')
      })
      showDuplicateFilesModal.value = true
      return { hasDuplicates: true, filesToUpload: newFiles }
    }

    return { hasDuplicates: false, filesToUpload: newFiles }
  }

  /**
   * Handle duplicate files confirmation
   */
  const handleConfirmDuplicateFiles = async setId => {
    showDuplicateFilesModal.value = false

    const filesToProcess = []

    for (const { file } of duplicateFiles.value) {
      const action = duplicateFileActions.value.get(file.name) || 'skip'
      if (action === 'replace') {
        filesToProcess.push(file)
        // Note: Existing media deletion would need to be handled by the specific context
      }
    }

    if (filesToProcess.length > 0) {
      await uploadMediaToSet(filesToProcess, setId)
    } else {
      toast.info('No files to upload', {
        description: 'All duplicate files were skipped.',
      })
    }
  }

  /**
   * Cancel duplicate files modal
   */
  const handleCancelDuplicateFiles = () => {
    showDuplicateFilesModal.value = false
    duplicateFiles.value = []
    duplicateFileActions.value.clear()
  }

  /**
   * Cancel ongoing upload
   */
  const cancelUpload = () => {
    if (uploadAbortController.value) {
      uploadAbortController.value.abort()
      uploadAbortController.value = null
    }
    isUploading.value = false
    uploadProgress.value = {}
    overallProgress.value = 0
  }

  /**
   * Upload a single file with retry logic
   */
  const uploadSingleFile = async (file, fileId, contextIdValue, setIdValue, signal) => {
    return retryWithBackoff(async () => {
      // Update status to uploading
      uploadProgress.value[fileId] = {
        ...uploadProgress.value[fileId],
        status: 'uploading',
        error: null,
      }

      // Upload file with progress tracking
      const uploadResult = await apiClient.uploadWithProgress('/v1/uploads', file, {
        signal,
        onProgress: (loaded, total) => {
          uploadProgress.value[fileId] = {
            ...uploadProgress.value[fileId],
            loaded,
            total,
            percentage: total > 0 ? Math.round((loaded / total) * 100) : 0,
          }
          updateOverallProgress()
        },
      })

      // Update status to processing
      uploadProgress.value[fileId] = {
        ...uploadProgress.value[fileId],
        status: 'processing',
        percentage: 100,
      }

      // Extract data from upload response object
      // The upload endpoint returns: { url, path, originalFilename, mimeType, size, width, height, userFileUuid, ... }
      const uploadResponse = uploadResult.data
      const imageUrl = uploadResponse.url // Extract the URL from the upload response
      const userFileUuid = uploadResponse.userFileUuid // Extract the user_file UUID

      // Determine media type
      const type = file.type.startsWith('image/') ? 'image' : 'video'

      // Prepare media data with extracted URL and userFileUuid
      const mediaData = {
        userFileUuid: userFileUuid, // Pass user_file UUID to use stored URL
        uploadUrl: imageUrl, // Fallback URL if userFileUuid not available
        filename: uploadResponse.originalFilename || file.name,
        mimeType: uploadResponse.mimeType || file.type,
        size: uploadResponse.size || file.size,
        type: type,
        width: uploadResponse.width || null,
        height: uploadResponse.height || null,
        thumbnail: type === 'image' ? imageUrl : null, // Use extracted URL for thumbnail
      }

      // Call context-specific upload function
      if (!uploadMediaFn) {
        throw new Error('uploadMediaFn is required')
      }

      const media = await uploadMediaFn(uploadResponse, file, {
        contextId: contextIdValue,
        setId: setIdValue,
        mediaData,
      })

      // Update status to completed
      uploadProgress.value[fileId] = {
        ...uploadProgress.value[fileId],
        status: 'completed',
      }

      return { file, media, uploadResult: uploadResult.data }
    })
  }

  /**
   * Update overall progress
   */
  const updateOverallProgress = () => {
    const fileIds = Object.keys(uploadProgress.value)
    if (fileIds.length === 0) {
      overallProgress.value = 0
      return
    }

    let totalLoaded = 0
    let totalSize = 0

    fileIds.forEach(fileId => {
      const progress = uploadProgress.value[fileId]
      if (progress.total > 0) {
        totalLoaded += progress.loaded || 0
        totalSize += progress.total
      }
    })

    overallProgress.value = totalSize > 0 ? Math.round((totalLoaded / totalSize) * 100) : 0
  }

  /**
   * Upload media to a set with advanced features
   */
  const uploadMediaToSet = async (files, setId, uploadOptions = {}) => {
    const { skipValidation = false } = uploadOptions

    try {
      const contextIdValue = getContextId()

      if (!contextIdValue) {
        throw new Error('Context ID is required')
      }

      const setIdValue = getSetId(setId)

      if (!setIdValue) {
        throw new Error('Set ID is required')
      }

      if (!files || files.length === 0) {
        throw new Error('No files provided')
      }

      if (!uploadMediaFn) {
        throw new Error('uploadMediaFn is required')
      }

      // Reset state
      uploadProgress.value = {}
      overallProgress.value = 0
      uploadErrors.value = []
      isUploading.value = true
      uploadAbortController.value = new AbortController()

      const fileArray = Array.from(files)
      const results = {
        successful: [],
        failed: [],
      }

      // Initialize progress for all files
      fileArray.forEach((file, index) => {
        const fileId = getFileId(file, index)
        uploadProgress.value[fileId] = {
          file,
          fileId,
          loaded: 0,
          total: file.size,
          percentage: 0,
          status: 'pending',
          error: null,
        }
      })

      // Validate files if not skipped
      if (!skipValidation) {
        const existingMediaList = getExistingMedia()

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i]
          const fileId = getFileId(file, i)

          try {
            const validation = await validateUploadFile(file, {
              existingMedia: existingMediaList,
              ...validationOptions,
            })

            if (!validation.valid) {
              uploadProgress.value[fileId] = {
                ...uploadProgress.value[fileId],
                status: 'failed',
                error: validation.errors.join(', '),
              }
              results.failed.push({
                file,
                error: validation.errors.join(', '),
              })
              continue
            }
          } catch (error) {
            uploadProgress.value[fileId] = {
              ...uploadProgress.value[fileId],
              status: 'failed',
              error: error.message || 'Validation failed',
            }
            results.failed.push({
              file,
              error: error.message || 'Validation failed',
            })
            continue
          }
        }
      }

      // Upload files in batches
      const filesToUpload = fileArray.filter((file, index) => {
        const fileId = getFileId(file, index)
        return uploadProgress.value[fileId]?.status !== 'failed'
      })

      for (let i = 0; i < filesToUpload.length; i += batchSize) {
        const batch = filesToUpload.slice(i, i + batchSize)

        const batchPromises = batch.map(async (file, batchIndex) => {
          const originalIndex = fileArray.indexOf(file)
          const fileId = getFileId(file, originalIndex)

          try {
            const result = await uploadSingleFile(
              file,
              fileId,
              contextIdValue,
              setIdValue,
              uploadAbortController.value.signal
            )
            results.successful.push(result)
            return result
          } catch (error) {
            const errorMessage = error.message || 'Upload failed'
            uploadProgress.value[fileId] = {
              ...uploadProgress.value[fileId],
              status: 'failed',
              error: errorMessage,
            }
            results.failed.push({
              file,
              error: errorMessage,
            })
            uploadErrors.value.push({
              file,
              fileId,
              error: errorMessage,
              retry: () => {
                return uploadSingleFile(
                  file,
                  fileId,
                  contextIdValue,
                  setIdValue,
                  uploadAbortController.value.signal
                )
              },
            })
            throw error
          }
        })

        // Wait for batch to complete (using allSettled to allow partial success)
        await Promise.allSettled(batchPromises)
      }

      // Reload media items if any were successful
      if (results.successful.length > 0 && loadMediaItems) {
        await loadMediaItems()
      }

      // Show results
      if (results.successful.length > 0 && results.failed.length === 0) {
        toast.success('Media uploaded', {
          description: `${results.successful.length} file(s) uploaded successfully.`,
        })
      } else if (results.successful.length > 0 && results.failed.length > 0) {
        toast.warning('Partial upload', {
          description: `${results.successful.length} succeeded, ${results.failed.length} failed.`,
        })
      } else if (results.failed.length > 0) {
        toast.error('Upload failed', {
          description: `${results.failed.length} file(s) failed to upload.`,
        })
      }

      return results
    } catch (error) {
      console.error('Failed to upload media:', error)

      // Don't show error if upload was cancelled
      if (error.name !== 'AbortError') {
        toast.error('Upload failed', {
          description: error instanceof Error ? error.message : 'Failed to upload media.',
        })
      }
      throw error
    } finally {
      isUploading.value = false
      uploadAbortController.value = null
    }
  }

  return {
    // Upload functions
    uploadMediaToSet,
    processFiles,
    handleConfirmDuplicateFiles,
    handleCancelDuplicateFiles,
    cancelUpload,

    // State
    uploadProgress,
    overallProgress,
    uploadErrors,
    isUploading,
    showDuplicateFilesModal,
    duplicateFiles,
    duplicateFileActions,
  }
}
