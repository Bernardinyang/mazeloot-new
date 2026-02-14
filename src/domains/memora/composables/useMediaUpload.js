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
import { toast } from '@/shared/utils/toast'
import { apiClient } from '@/shared/api/client'
import { validateUploadFile } from '@/domains/memora/utils/media/validateUploadFile'
import { splitDuplicateUploadFiles } from '@/domains/memora/utils/media/splitDuplicateUploadFiles'
import { filterValidUploadFiles } from '@/domains/memora/utils/media/filterValidUploadFiles'
import { getErrorMessage } from '@/shared/utils/errors'
import { useBackgroundUploadManager } from '@/shared/composables/useBackgroundUploadManager'

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
 * @param {number} options.batchSize - Number of concurrent uploads (default: 1, serial uploads)
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
    batchSize = 1,
    maxRetries = 3,
    contextType = 'collection', // collection, selection, or proofing
    useBackgroundUploads = true,
  } = options

  // Background upload manager (shared instance) - serial uploads
  const backgroundUploadManager = useBackgroundUploadManager({
    concurrentLimit: 1,
  })

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

    // Filter valid files (raw files allow all file types)
    const validFiles = filterValidUploadFiles(Array.from(files), contextType)

    if (validFiles.length === 0) {
      const fileTypes = Array.from(files)
        .map(f => f.type || 'unknown')
        .join(', ')
      const errorMsg = contextType === 'rawFile'
        ? `The selected files are not supported. (Received types: ${fileTypes})`
        : `The selected files are not supported. Please select valid image or video files. (Received types: ${fileTypes})`
      toast.error('Invalid files', {
        description: errorMsg,
      })
      return { hasDuplicates: false, filesToUpload: [] }
    }

    // If some files were filtered out, notify user (only for non-raw files)
    if (contextType !== 'rawFile' && validFiles.length < files.length) {
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
      // Files with action 'skip' are intentionally excluded and will not be uploaded
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

    // Re-check duplicates for newFilesFromProcess in case media list changed
    // This ensures skipped duplicates don't accidentally get uploaded
    let existingMediaList = getExistingMedia()
    if (setId) {
      const setIdValue = getSetId(setId)
      if (setIdValue) {
        existingMediaList = existingMediaList.filter(media => {
          return media.setId === setIdValue
        })
      }
    }

    // Filter out any files from newFilesFromProcess that are now duplicates
    const { duplicates: newDuplicates, newFiles: verifiedNewFiles } =
      splitDuplicateUploadFiles(newFilesFromProcess.value, existingMediaList)

    // Log if any previously non-duplicate files are now duplicates (shouldn't happen but safety check)
    if (newDuplicates.length > 0) {
      console.warn(
        `${newDuplicates.length} file(s) became duplicates after processing and will be skipped`
      )
    }

    // Combine verified new files (non-duplicates) with files to replace
    // Only include files that are not skipped
    const allFilesToUpload = [...verifiedNewFiles, ...filesToProcess]

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
  const cancelUpload = async () => {
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
    
    // Reload media to show any completed uploads before cancellation
    if (loadMediaItems && typeof loadMediaItems === 'function') {
      try {
        await loadMediaItems()
      } catch (error) {
        console.error('Failed to reload media after cancellation:', error)
      }
    }
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
   * Generate a unique batch ID from files (without timestamp to detect duplicates)
   */
  const generateBatchId = files => {
    const fileIds = Array.from(files)
      .map((file, index) => `${file.name}-${file.size}-${file.lastModified}-${index}`)
      .sort()
      .join('|')
    return fileIds.slice(0, 200) // Limit length, no timestamp to allow duplicate detection
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
      console.warn('Upload already in progress, skipping duplicate call')
      return
    }

    // Mark batch as active immediately to prevent race conditions
    if (activeUploadBatches.value.has(batchId)) {
      console.warn('Batch already being processed, skipping duplicate call', batchId)
      return
    }
    activeUploadBatches.value.add(batchId)

    try {
      const contextIdValue = getContextId()

      if (!contextIdValue) {
        activeUploadBatches.value.delete(batchId)
        throw new Error('Context ID is required')
      }

      const setIdValue = getSetId(setId)

      if (!setIdValue) {
        activeUploadBatches.value.delete(batchId)
        throw new Error('Set ID is required')
      }

      if (!files || files.length === 0) {
        activeUploadBatches.value.delete(batchId)
        throw new Error('No files provided')
      }

      if (!uploadMediaFn) {
        activeUploadBatches.value.delete(batchId)
        throw new Error('uploadMediaFn is required')
      }

      const fileArray = Array.from(files)
      const results = {
        successful: [],
        failed: [],
      }

      // Note: Duplicate checking is handled by processFiles before uploadMediaToSet is called
      // This function assumes files have already been filtered for duplicates
      const filteredFileArray = fileArray

      const existingMediaList = getExistingMedia()

      // Validate files if not skipped
      const validFiles = []
      if (!skipValidation) {
        for (let i = 0; i < filteredFileArray.length; i++) {
          const file = filteredFileArray[i]

          try {
            const validation = await validateUploadFile(file, {
              existingMedia: existingMediaList,
              skipDuplicateCheck: true, // Duplicates already handled by processFiles
              contextType, // Pass contextType for raw file type validation
              ...validationOptions,
            })

            if (!validation.valid) {
              results.failed.push({
                file,
                error: validation.errors.join(', '),
              })
              continue
            }
            validFiles.push(file)
          } catch (error) {
            const errorMessage = getErrorMessage(error, `Validation failed for "${file.name}"`)
            results.failed.push({
              file,
              error: errorMessage,
            })
            continue
          }
        }
      } else {
        validFiles.push(...filteredFileArray)
      }

      // Use background upload manager if enabled
      if (useBackgroundUploads) {
        // Deduplicate files by name+size before adding to queue
        const seenFiles = new Map()
        const uniqueFiles = []
        for (const file of validFiles) {
          const fileKey = `${file.name}-${file.size}-${file.lastModified}`
          if (!seenFiles.has(fileKey)) {
            seenFiles.set(fileKey, true)
            uniqueFiles.push(file)
          } else {
            console.warn('Skipping duplicate file:', file.name)
          }
        }

        // Get existing media for duplicate checking
        const existingMediaList = getExistingMedia()
        const existingMediaForSet = setIdValue
          ? existingMediaList.filter(media => media.setId === setIdValue)
          : existingMediaList

        // Add files to background upload queue serially (one at a time)
        for (const file of uniqueFiles) {
          try {
            // Add to background queue (duplicate check happens inside addToQueue)
            const result = await backgroundUploadManager.addToQueue(file, {
              contextId: contextIdValue,
              setId: setIdValue,
              uploadMediaFn,
              contextType,
              validationOptions,
              loadMediaItems,
              onUploadComplete,
              existingMedia: existingMediaForSet, // Pass existing media for duplicate checking
            })

            if (!result.success) {
              console.error('Failed to queue file:', file.name, result)
              if (result.duplicate) {
                results.failed.push({
                  file,
                  error: 'File already in upload queue. Cancel it from the upload queue to retry.',
                })
              } else {
                let errorMessage = 'Failed to add to upload queue'
                if (result.error) {
                  if (typeof result.error === 'string') {
                    errorMessage = result.error
                  } else if (result.error.message) {
                    errorMessage = result.error.message
                  } else {
                    errorMessage = JSON.stringify(result.error)
                  }
                }
                results.failed.push({
                  file,
                  error: errorMessage,
                })
              }
            } else {
              results.successful.push({
                file,
                uploadId: result.uploadId,
              })
            }
          } catch (error) {
            const errorMessage = getErrorMessage(error, `Failed to queue "${file.name}"`)
            results.failed.push({
              file,
              error: errorMessage,
            })
          }
        }

        // Show success message
        if (results.successful.length > 0) {
          toast.success(`${results.successful.length} file(s) added to upload queue`, {
            description: 'Uploads will continue in the background.',
          })
        }

        if (results.failed.length > 0) {
          const errorDetails = results.failed.map(f => `"${f.file?.name}": ${f.error || 'Unknown error'}`).join('; ')
          toast.warning(`${results.failed.length} file(s) failed to queue`, {
            description: errorDetails.length > 200 
              ? results.failed.map(f => f.file?.name).join(', ') 
              : errorDetails,
          })
        }

        // Do not call onUploadComplete or dispatch storage:shouldRefresh here: files are only queued.
        // Background manager will call loadMediaItems/onUploadComplete and dispatch when each upload completes.

        // Clean up batch ID
        activeUploadBatches.value.delete(batchId)
        return results
      }

      // Legacy direct upload path (fallback if useBackgroundUploads is false)
      // Reset state and track this batch
      uploadProgress.value = {}
      overallProgress.value = 0
      uploadErrors.value = []
      isUploading.value = true
      uploadAbortController.value = new AbortController()

      // Show upload progress toast
      const toastId = 'upload-progress'
      const fileCount = validFiles.length
      toast.loading(`Uploading ${fileCount} file${fileCount > 1 ? 's' : ''}...`, {
        id: toastId,
        duration: Infinity, // Keep it open until we dismiss it
      })

      // Initialize progress for all files
      validFiles.forEach((file, index) => {
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

      // Upload files serially (one at a time)
      const filesToUploadBatch = validFiles

      for (let i = 0; i < filesToUploadBatch.length; i++) {
        const file = filesToUploadBatch[i]
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

          // Call callbacks immediately after each successful upload
          if (loadMediaItems) {
            try {
              await loadMediaItems()
            } catch (error) {
              console.error('Error reloading media items:', error)
            }
          }

          if (onUploadComplete) {
            try {
              await onUploadComplete({ successful: [result], failed: [] })
            } catch (error) {
              console.error('Error in onUploadComplete callback:', error)
            }
          }
          window.dispatchEvent(new CustomEvent('storage:shouldRefresh'))
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

                // Call callbacks immediately after successful retry
                if (loadMediaItems) {
                  try {
                    await loadMediaItems()
                  } catch (error) {
                    console.error('Error reloading media items:', error)
                  }
                }

                if (onUploadComplete) {
                  try {
                    await onUploadComplete({ successful: [result], failed: [] })
                  } catch (error) {
                    console.error('Error in onUploadComplete callback:', error)
                  }
                }
                window.dispatchEvent(new CustomEvent('storage:shouldRefresh'))

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
          // Continue with next file even if this one failed
        }
      }

      // Dismiss progress toast
      toast.dismiss('upload-progress')

      // Show results - only show error toast if ALL uploads failed
      const hasSuccessful = results.successful && results.successful.length > 0
      const hasFailed = results.failed && results.failed.length > 0

      if (hasSuccessful && !hasFailed) {
        toast.success('Media uploaded', {
          description: `${results.successful.length} file(s) uploaded successfully.`,
        })
      } else if (hasSuccessful && hasFailed) {
        toast.warning('Partial upload', {
          description: `${results.successful.length} succeeded, ${results.failed.length} failed.`,
        })
      } else if (!hasSuccessful && hasFailed) {
        const failedFileNames = results.failed.map(f => f.file?.name || 'Unknown').join(', ')
        const errorDetails = results.failed.map(f => `"${f.file?.name || 'Unknown'}": ${f.error || 'Unknown error'}`).join('; ')
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
