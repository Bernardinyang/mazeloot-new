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

import { ref, reactive } from 'vue'
import { toast } from '@/utils/toast'
import { apiClient } from '@/api/client'
import { validateUploadFile } from '@/utils/media/validateUploadFile'
import { splitDuplicateUploadFiles } from '@/utils/media/splitDuplicateUploadFiles'
import { filterValidUploadFiles } from '@/utils/media/filterValidUploadFiles'
import { getErrorMessage } from '@/utils/errors'

/**
 * @param {object} options - Configuration options
 * @param {function} options.uploadMediaFn - Function to upload a single media item: (uploadResult, file, context) => Promise<media>
 * @param {function|ref|string} options.contextId - Context ID (selectionId, collectionId, proofingId, etc.)
 * @param {function|ref|string} options.setId - Set ID (optional, can be provided per upload)
 * @param {function|ref|Array} options.existingMedia - Array of existing media for duplicate checking
 * @param {function} options.loadMediaItems - Function to reload media after upload
 * @param {function} options.onUploadComplete - Optional callback after successful upload: (results) => Promise
 * @param {function} options.deleteMediaFn - Function to delete existing media when replacing: (mediaId) => Promise
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
    onUploadComplete,
    deleteMediaFn,
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
  const duplicateFileActionsObject = reactive({}) // Reactive object for template binding
  const duplicateFileActionsKey = ref(0) // Key to force reactivity updates
  const newFilesFromProcess = ref([]) // Store new files from processFiles for use in confirmation

  // Track active upload batches to prevent duplicates
  const activeUploadBatches = ref(new Set()) // Set of batch IDs

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
  // Don't retry on client errors (4xx) - these are validation errors, not transient failures
  const retryWithBackoff = async (fn, retries = maxRetries, baseDelay = 1000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        // Don't retry on client errors (4xx) - these are validation/request errors
        const statusCode = error?.response?.status || error?.status
        if (statusCode >= 400 && statusCode < 500) {
          throw error
        }

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
   * @param {File[]} files - Files to process
   * @param {string} setId - Optional set ID to filter duplicates by set
   */
  const processFiles = async (files, setId = null) => {
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
      const fileTypes = Array.from(files)
        .map(f => f.type || 'unknown')
        .join(', ')
      toast.error('Invalid files', {
        description: `The selected files are not supported. Please select valid image or video files. (Received types: ${fileTypes})`,
      })
      return { hasDuplicates: false, filesToUpload: [] }
    }

    // If some files were filtered out, notify user
    if (validFiles.length < files.length) {
      const filteredCount = files.length - validFiles.length
      toast.warning(`${filteredCount} file(s) skipped`, {
        description: 'Some files were not valid image or video files and were skipped.',
      })
    }

    let existingMediaList = getExistingMedia()

    // Filter by set if setId is provided - only check duplicates within the same set
    if (setId) {
      const setIdValue = getSetId(setId)
      if (setIdValue) {
        existingMediaList = existingMediaList.filter(media => {
          return media.setId === setIdValue
        })
      }
    }

    const { duplicates, newFiles } = splitDuplicateUploadFiles(validFiles, existingMediaList)

    if (duplicates.length > 0) {
      duplicateFiles.value = duplicates
      duplicateFileActions.value = new Map()
      // Reset reactive object by clearing all properties
      Object.keys(duplicateFileActionsObject).forEach(key => {
        delete duplicateFileActionsObject[key]
      })
      newFilesFromProcess.value = newFiles // Store new files for later use
      // Default action: skip
      duplicates.forEach(({ file }) => {
        duplicateFileActions.value.set(file.name, 'skip')
        duplicateFileActionsObject[file.name] = 'skip' // Also set in reactive object
      })
      showDuplicateFilesModal.value = true
      return { hasDuplicates: true, filesToUpload: newFiles }
    }

    newFilesFromProcess.value = newFiles
    return { hasDuplicates: false, filesToUpload: newFiles }
  }

  /**
   * Handle duplicate files confirmation
   */
  const handleConfirmDuplicateFiles = async setId => {
    showDuplicateFilesModal.value = false

    const filesToProcess = []
    const mediaToDelete = []

    // Collect files to replace and media to delete
    for (const { file, existingMedia: existingMediaItem } of duplicateFiles.value) {
      const action = duplicateFileActions.value.get(file.name) || 'skip'

      if (action === 'replace') {
        filesToProcess.push(file)
        // Collect existing media to delete
        if (existingMediaItem && existingMediaItem.id) {
          mediaToDelete.push(existingMediaItem.id)
        }
      }
    }

    if (mediaToDelete.length > 0 && deleteMediaFn) {
      try {
        const contextIdValue = getContextId()
        const setIdValue = getSetId(setId)

        for (const mediaId of mediaToDelete) {
          // deleteMediaFn can accept (mediaId) or (contextId, setId, mediaId)
          if (deleteMediaFn.length === 1) {
            await deleteMediaFn(mediaId)
          } else if (deleteMediaFn.length === 3) {
            await deleteMediaFn(contextIdValue, setIdValue, mediaId)
          } else {
            // Try to call with mediaId first, fallback to full signature
            try {
              await deleteMediaFn(mediaId)
            } catch {
              await deleteMediaFn(contextIdValue, setIdValue, mediaId)
            }
          }
        }
      } catch (error) {
        toast.error('Failed to delete some existing media', {
          description: 'Some files may not have been replaced. Please try again.',
        })
      }
    }

    // Combine new files (non-duplicates) with files to replace
    const allFilesToUpload = [...newFilesFromProcess.value, ...filesToProcess]

    if (allFilesToUpload.length > 0) {
      // uploadMediaToSet already calls loadMediaItems() at the end, so no need to call it again here
      await uploadMediaToSet(allFilesToUpload, setId)
    } else {
      toast.info('No files to upload', {
        description: 'All duplicate files were skipped.',
      })
    }

    // Clear stored files
    newFilesFromProcess.value = []
    duplicateFiles.value = []
    duplicateFileActions.value.clear()
  }

  /**
   * Handle setting action for a specific duplicate file
   */
  const handleSetDuplicateAction = (fileName, action) => {
    duplicateFileActions.value.set(fileName, action)
    duplicateFileActionsObject[fileName] = action
    // Increment key to force reactivity
    duplicateFileActionsKey.value++
  }

  /**
   * Handle replace all duplicates
   */
  const handleReplaceAllDuplicates = () => {
    duplicateFiles.value.forEach(({ file }) => {
      duplicateFileActions.value.set(file.name, 'replace')
      duplicateFileActionsObject[file.name] = 'replace'
    })
    // Increment key to force reactivity
    duplicateFileActionsKey.value++
  }

  /**
   * Handle skip all duplicates
   */
  const handleSkipAllDuplicates = () => {
    duplicateFiles.value.forEach(({ file }) => {
      duplicateFileActions.value.set(file.name, 'skip')
      duplicateFileActionsObject[file.name] = 'skip'
    })
    // Increment key to force reactivity
    duplicateFileActionsKey.value++
  }

  /**
   * Cancel duplicate files modal
   */
  const handleCancelDuplicateFiles = () => {
    showDuplicateFilesModal.value = false
    duplicateFiles.value = []
    duplicateFileActions.value.clear()
    // Clear reactive object
    Object.keys(duplicateFileActionsObject).forEach(key => {
      delete duplicateFileActionsObject[key]
    })
    newFilesFromProcess.value = []
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
    uploadErrors.value = [] // Clear errors on cancel
    // Dismiss progress toast
    toast.dismiss('upload-progress')
  }

  /**
   * Upload a single file with retry logic
   */
  const uploadSingleFile = async (file, fileId, contextIdValue, setIdValue, signal) => {
    uploadProgress.value[fileId] = {
      ...uploadProgress.value[fileId],
      status: 'uploading',
      error: null,
    }

    // Upload file with progress tracking (with retry for transient errors only)
    // Use image upload endpoint for images (generates variants), regular upload for videos
    const isImage = file.type.startsWith('image/')
    const uploadEndpoint = isImage ? '/v1/images/upload' : '/v1/uploads'

    let uploadResult
    try {
      // Only retry the API upload part, not the media creation
      uploadResult = await retryWithBackoff(async () => {
        return await apiClient.uploadWithProgress(uploadEndpoint, file, {
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
      })
    } catch (error) {
      // If upload fails, don't proceed to media creation
      const errorMessage = getErrorMessage(error, `Failed to upload "${file.name}"`)
      uploadProgress.value[fileId] = {
        ...uploadProgress.value[fileId],
        status: 'failed',
        error: errorMessage,
      }
      const uploadError = new Error(`Upload failed for "${file.name}": ${errorMessage}`)
      uploadError.originalError = error
      throw uploadError
    }

    uploadProgress.value[fileId] = {
      ...uploadProgress.value[fileId],
      status: 'processing',
      percentage: 100,
    }

    // Extract data from upload response object
    // The upload endpoint returns: { url, path, originalFilename, mimeType, size, width, height, userFileUuid, variants?, thumbnail?, ... }
    const uploadResponse = uploadResult.data

    // For image uploads, use the 'large' variant as the main URL, 'thumb' for thumbnail
    // For videos, use the standard url and thumbnail from response (if available)
    const imageUrl =
      isImage && uploadResponse.variants
        ? uploadResponse.variants.large || uploadResponse.variants.original || uploadResponse.url
        : uploadResponse.url

    // Determine thumbnail URL:
    // - For images: use thumb variant from variants
    // - For videos: use thumbnail from response (generated by backend)
    const thumbnailUrl =
      isImage && uploadResponse.variants
        ? uploadResponse.variants.thumb || uploadResponse.variants.medium || imageUrl
        : uploadResponse.thumbnail || (isImage ? imageUrl : null)

    const userFileUuid = uploadResponse.userFileUuid // Extract the user_file UUID

    // Determine media type
    const type = isImage ? 'image' : 'video'

    // Prepare media data with extracted URL and user_file_uuid
    const mediaData = {
      userFileUuid: userFileUuid, // Pass user_file UUID (will be converted to user_file_uuid by API)
      uploadUrl: imageUrl, // Fallback URL if user_file_uuid not available
      filename: uploadResponse.originalFilename || file.name,
      mimeType: uploadResponse.mimeType || file.type,
      size: uploadResponse.size || file.size,
      type: type,
      width: uploadResponse.width || null,
      height: uploadResponse.height || null,
      thumbnail: thumbnailUrl, // Use thumb variant for images, backend-generated thumbnail for videos
      variants: uploadResponse.variants || null, // Include variants if available (images only)
    }

    // Call context-specific upload function (NO RETRY - this should only be called once)
    if (!uploadMediaFn) {
      throw new Error('uploadMediaFn is required')
    }

    let media
    try {
      media = await uploadMediaFn(uploadResponse, file, {
        contextId: contextIdValue,
        setId: setIdValue,
        mediaData,
      })
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        `Failed to create media record for "${file.name}"`
      )
      uploadProgress.value[fileId] = {
        ...uploadProgress.value[fileId],
        status: 'failed',
        error: errorMessage,
      }
      const mediaError = new Error(
        `Failed to create media record for "${file.name}": ${errorMessage}`
      )
      mediaError.originalError = error
      throw mediaError
    }

    uploadProgress.value[fileId] = {
      ...uploadProgress.value[fileId],
      status: 'completed',
    }

    return { file, media, uploadResult: uploadResult.data }
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

    const toastId = 'upload-progress'
    const completedCount = fileIds.filter(
      fileId => uploadProgress.value[fileId]?.status === 'completed'
    ).length
    const failedCount = fileIds.filter(
      fileId => uploadProgress.value[fileId]?.status === 'failed'
    ).length
    const totalCount = fileIds.length
    const uploadingCount = fileIds.filter(
      fileId =>
        uploadProgress.value[fileId]?.status === 'uploading' ||
        uploadProgress.value[fileId]?.status === 'processing' ||
        uploadProgress.value[fileId]?.status === 'pending'
    ).length

    // Only show/update toast if there are active uploads
    if (isUploading.value && uploadingCount > 0 && overallProgress.value >= 0) {
      toast.loading(
        `Uploading ${completedCount}/${totalCount} file${totalCount > 1 ? 's' : ''}... ${overallProgress.value}%`,
        {
          id: toastId,
          progress: overallProgress.value,
          duration: Infinity,
        }
      )
    } else if (!isUploading.value || uploadingCount === 0) {
      // Dismiss toast if no active uploads (all completed or failed)
      toast.dismiss(toastId)
    }
  }

  /**
   * Generate a unique batch ID from files
   */
  const generateBatchId = files => {
    const fileIds = Array.from(files)
      .map((file, index) => `${file.name}-${file.size}-${file.lastModified}-${index}`)
      .join('|')
    return `${Date.now()}-${fileIds.slice(0, 100)}` // Limit length
  }

  /**
   * Upload media to a set with advanced features
   */
  const uploadMediaToSet = async (files, setId, uploadOptions = {}) => {
    const { skipValidation = false } = uploadOptions

    // Generate batch ID to prevent duplicate uploads of the same files
    const batchId = generateBatchId(files)

    // Prevent multiple simultaneous uploads
    if (isUploading.value) {
      return
    }

    if (activeUploadBatches.value.has(batchId)) {
      return
    }

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

      // Reset state and track this batch
      uploadProgress.value = {}
      overallProgress.value = 0
      uploadErrors.value = []
      isUploading.value = true
      uploadAbortController.value = new AbortController()
      activeUploadBatches.value.add(batchId)

      // Show upload progress toast
      const toastId = 'upload-progress'
      const fileCount = files.length
      toast.loading(`Uploading ${fileCount} file${fileCount > 1 ? 's' : ''}...`, {
        id: toastId,
        duration: Infinity, // Keep it open until we dismiss it
      })

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

      // Note: Duplicate checking is handled by processFiles before uploadMediaToSet is called
      // This function assumes files have already been filtered for duplicates
      const filteredFileArray = fileArray

      const existingMediaList = getExistingMedia()

      // Validate files if not skipped
      // Skip duplicate check since we already handled duplicates above
      if (!skipValidation) {
        for (let i = 0; i < filteredFileArray.length; i++) {
          const file = filteredFileArray[i]
          const fileId = getFileId(file, i)

          try {
            const validation = await validateUploadFile(file, {
              existingMedia: existingMediaList,
              skipDuplicateCheck: true, // Duplicates already handled by processFiles
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
            const errorMessage = getErrorMessage(error, `Validation failed for "${file.name}"`)
            uploadProgress.value[fileId] = {
              ...uploadProgress.value[fileId],
              status: 'failed',
              error: errorMessage,
            }
            results.failed.push({
              file,
              error: errorMessage,
            })
            continue
          }
        }
      }

      // Upload files in batches (use filtered array)
      const filesToUploadBatch = filteredFileArray.filter((file, index) => {
        const fileId = getFileId(file, index)
        return uploadProgress.value[fileId]?.status !== 'failed'
      })

      for (let i = 0; i < filesToUploadBatch.length; i += batchSize) {
        const batch = filesToUploadBatch.slice(i, i + batchSize)

        const batchPromises = batch.map(async (file, batchIndex) => {
          const originalIndex = filteredFileArray.indexOf(file)
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
            const errorMessage = getErrorMessage(error, `Failed to upload "${file.name}"`)
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
              retry: async () => {
                // Each retry gets its own controller to avoid conflicts
                const retryAbortController = new AbortController()

                // Track if we need to manage the global upload state
                const wasUploading = isUploading.value
                const hadAbortController = !!uploadAbortController.value

                if (!wasUploading) {
                  isUploading.value = true
                }

                // Store the retry controller if no global one exists
                if (!hadAbortController) {
                  uploadAbortController.value = retryAbortController
                }

                try {
                  const result = await uploadSingleFile(
                    file,
                    fileId,
                    contextIdValue,
                    setIdValue,
                    retryAbortController.signal
                  )

                  if (uploadProgress.value[fileId]) {
                    uploadProgress.value[fileId] = {
                      ...uploadProgress.value[fileId],
                      status: 'completed',
                      percentage: 100,
                      error: null,
                    }
                  }

                  // Remove from errors array on success
                  const errorIndex = uploadErrors.value.findIndex(e => e.fileId === fileId)
                  if (errorIndex !== -1) {
                    uploadErrors.value.splice(errorIndex, 1)
                  }

                  return result
                } catch (error) {
                  const retryErrorMessage = getErrorMessage(
                    error,
                    `Failed to retry upload for "${file.name}"`
                  )
                  if (uploadProgress.value[fileId]) {
                    uploadProgress.value[fileId] = {
                      ...uploadProgress.value[fileId],
                      status: 'failed',
                      error: retryErrorMessage,
                    }
                  }

                  const errorIndex = uploadErrors.value.findIndex(e => e.fileId === fileId)
                  if (errorIndex !== -1) {
                    uploadErrors.value[errorIndex] = {
                      ...uploadErrors.value[errorIndex],
                      error: retryErrorMessage,
                    }
                  }

                  throw error
                } finally {
                  // Only reset uploading state if we set it and no other uploads are in progress
                  if (!wasUploading) {
                    const hasActiveUploads = Object.values(uploadProgress.value).some(
                      p => p.status === 'uploading' || p.status === 'processing'
                    )

                    if (!hasActiveUploads) {
                      isUploading.value = false
                    }

                    // Only clear abort controller if we created it and no other uploads are active
                    if (!hadAbortController && !hasActiveUploads) {
                      uploadAbortController.value = null
                    } else if (
                      !hadAbortController &&
                      uploadAbortController.value === retryAbortController
                    ) {
                      // If we set it but there are still active uploads, keep it
                      // Otherwise clear it if it's still our retry controller
                      if (!hasActiveUploads) {
                        uploadAbortController.value = null
                      }
                    }
                  }
                }
              },
            })
            // Don't throw - allow batch to continue with other files
          }
        })

        // Wait for batch to complete (using allSettled to allow partial success)
        await Promise.allSettled(batchPromises)
      }

      // Reload media items if any were successful
      // Use nextTick to ensure this happens after any reactive updates
      if (results.successful.length > 0) {
        // Add a small delay to batch any potential duplicate calls
        await new Promise(resolve => setTimeout(resolve, 100))

        // Call loadMediaItems if provided
        if (loadMediaItems) {
          await loadMediaItems()
        }

        // Call optional onUploadComplete callback (e.g., to reload media sets, update counts, etc.)
        if (onUploadComplete) {
          await onUploadComplete(results)
        }
      }

      // Dismiss progress toast
      toast.dismiss('upload-progress')

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
        const failedFileNames = results.failed.map(f => f.file.name).join(', ')
        const errorDetails = results.failed.map(f => `"${f.file.name}": ${f.error}`).join('; ')
        toast.error(`Upload failed for ${results.failed.length} file(s)`, {
          description: errorDetails.length > 200 ? failedFileNames : errorDetails,
        })
      }

      return results
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to upload media files')

      // Dismiss progress toast
      toast.dismiss('upload-progress')

      // Don't show error if upload was cancelled
      if (error.name !== 'AbortError') {
        toast.error('Upload failed', {
          description: errorMessage,
        })
      }
      throw error
    } finally {
      isUploading.value = false
      uploadAbortController.value = null
      activeUploadBatches.value.delete(batchId)
    }
  }

  return {
    // Upload functions
    uploadMediaToSet,
    processFiles,
    handleConfirmDuplicateFiles,
    handleCancelDuplicateFiles,
    handleSetDuplicateAction,
    handleReplaceAllDuplicates,
    handleSkipAllDuplicates,
    cancelUpload,

    // State
    uploadProgress,
    overallProgress,
    uploadErrors,
    isUploading,
    showDuplicateFilesModal,
    duplicateFiles,
    duplicateFileActions,
    duplicateFileActionsObject, // Reactive object for template binding
    duplicateFileActionsKey, // Key to force reactivity updates
  }
}
