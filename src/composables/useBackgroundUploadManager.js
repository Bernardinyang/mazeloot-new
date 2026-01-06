/**
 * Background Upload Manager Composable
 * Manages upload queue with IndexedDB persistence, network handling, concurrency limits,
 * deduplication, speed/ETA tracking, priority/ordering, and enhanced error handling
 */

import { ref, computed, watch } from 'vue'
import { storeFile, getFile, deleteFile } from '@/utils/fileStorage'
import {
  saveUploadItem,
  getUploadQueue,
  getUploadItem,
  updateUploadProgress,
  updateUploadStatus,
  updateUploadPriority,
  removeUploadItem,
  checkDuplicate,
  clearCompletedUploads,
  getStorageQuota,
  saveUploadHistory,
  getUploadHistory,
  cleanupOldHistory,
  isUploadQueueStorageAvailable,
} from '@/utils/uploadQueueStorage'
import { apiClient } from '@/api/client'
import { getErrorMessage, isNetworkError, isValidationError } from '@/utils/errors'
import { validateUploadFile } from '@/utils/media/validateUploadFile'
import { generateUUID } from '@/utils/uuid'
import { useCollectionsApi } from '@/api/collections'
import { useSelectionsApi } from '@/api/selections'
import { useProofingApi } from '@/api/proofing'

// Configuration defaults
const DEFAULT_CONCURRENT_LIMIT = 3
const DEFAULT_CLEANUP_HOURS = 24
const DEFAULT_HISTORY_DAYS = 7
const DEFAULT_QUOTA_WARNING_THRESHOLD = 80
const DEFAULT_RETRY_ATTEMPTS = {
  network: 5,
  server: 3,
  quota: 0,
  validation: 0,
}

/**
 * Generate file hash for deduplication
 */
const generateFileHash = (filename, size, contextId, setId) => {
  const hashString = `${filename}:${size}:${contextId || ''}:${setId || ''}`
  // Simple hash function
  let hash = 0
  for (let i = 0; i < hashString.length; i++) {
    const char = hashString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Categorize error
 */
const categorizeError = error => {
  if (isNetworkError(error) || error?.code === 'NETWORK_ERROR' || error?.status === 0) {
    return 'network'
  }
  if (error?.code === 'QUOTA_EXCEEDED' || error?.name === 'QuotaExceededError') {
    return 'quota'
  }
  if (isValidationError(error) || error?.status === 422) {
    return 'validation'
  }
  if (error?.status >= 500) {
    return 'server'
  }
  return 'unknown'
}

/**
 * Retry with exponential backoff
 */
const retryWithBackoff = async (fn, maxRetries, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error
      }
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

/**
 * Calculate upload speed and ETA
 */
const calculateSpeedAndETA = (progressHistory, total, loaded) => {
  if (!progressHistory || progressHistory.length < 2) {
    return { speed: 0, eta: null }
  }

  // Get last 10 progress updates for average speed calculation
  const recentHistory = progressHistory.slice(-10)
  const firstUpdate = recentHistory[0]
  const lastUpdate = recentHistory[recentHistory.length - 1]

  const timeDiff = (lastUpdate.timestamp - firstUpdate.timestamp) / 1000 // seconds
  const bytesDiff = lastUpdate.loaded - firstUpdate.loaded

  if (timeDiff <= 0) {
    return { speed: 0, eta: null }
  }

  const speed = bytesDiff / timeDiff // bytes per second
  const remaining = total - loaded
  const eta = speed > 0 ? remaining / speed : null // seconds

  return { speed, eta }
}

/**
 * Resolve upload media callback based on context type and metadata
 * This allows callbacks to be reconstructed after page reload
 */
const resolveUploadMediaCallback = (contextType, contextId, setId) => {
  if (!contextType || !contextId) return null

  try {
    switch (contextType) {
      case 'collection': {
        const collectionsApi = useCollectionsApi()
        return async (uploadResult, file, { contextId, setId, mediaData }) => {
          return await collectionsApi.uploadMediaToSet(contextId, setId, mediaData)
        }
      }
      case 'selection': {
        const selectionsApi = useSelectionsApi()
        return async (uploadResult, file, { contextId, setId, mediaData }) => {
          return await selectionsApi.uploadMediaToSet(contextId, setId, mediaData)
        }
      }
      case 'proofing': {
        const proofingApi = useProofingApi()
        return async (uploadResult, file, { contextId, setId, mediaData }) => {
          return await proofingApi.uploadMediaToSet(contextId, setId, mediaData)
        }
      }
      default:
        console.warn(`Unknown contextType: ${contextType}`)
        return null
    }
  } catch (error) {
    console.error('Failed to resolve upload media callback:', error)
    return null
  }
}

/**
 * Resolve loadMediaItems callback based on context type
 * Emits custom event that components can listen to
 */
const resolveLoadMediaItemsCallback = (contextType, contextId, setId) => {
  if (!contextType || !contextId) return null

  try {
    return async () => {
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent('backgroundUpload:loadMediaItems', {
        detail: { contextType, contextId, setId }
      }))
    }
  } catch (error) {
    console.error('Failed to resolve loadMediaItems callback:', error)
    return null
  }
}

/**
 * Resolve onUploadComplete callback based on context type
 * Emits custom event that components can listen to
 */
const resolveOnUploadCompleteCallback = (contextType, contextId, setId) => {
  if (!contextType || !contextId) return null

  try {
    return async (results) => {
      // Emit custom event for components to listen to
      window.dispatchEvent(new CustomEvent('backgroundUpload:uploadComplete', {
        detail: { contextType, contextId, setId, results }
      }))
    }
  } catch (error) {
    console.error('Failed to resolve onUploadComplete callback:', error)
    return null
  }
}

// Singleton instance
let managerInstance = null

/**
 * Background Upload Manager Composable (Singleton)
 */
export function useBackgroundUploadManager(options = {}) {
  // Update existing instance if options provided
  if (managerInstance) {
    if (options.concurrentLimit !== undefined) {
      managerInstance.concurrentLimit.value = options.concurrentLimit
    }
    return managerInstance
  }

  const {
    concurrentLimit: initialConcurrentLimit = DEFAULT_CONCURRENT_LIMIT,
    cleanupHours = DEFAULT_CLEANUP_HOURS,
    historyDays = DEFAULT_HISTORY_DAYS,
    quotaWarningThreshold = DEFAULT_QUOTA_WARNING_THRESHOLD,
    autoResumeOnOnline = true,
    enableHistory = true,
  } = options

  // Reactive state
  const concurrentLimit = ref(initialConcurrentLimit)
  const uploadQueue = ref([])
  const isOnline = ref(navigator.onLine !== false)
  const quotaUsage = ref({ quota: null, usage: null, percentage: null })
  const uploadHistory = ref([])
  const isInitialized = ref(false)

  // Internal state
  const activeUploads = ref(new Map()) // Map<uploadId, AbortController>
  const progressHistory = ref(new Map()) // Map<uploadId, Array<{timestamp, loaded}>>
  const uploadAbortControllers = ref(new Map()) // Map<uploadId, AbortController>
  const uploadCallbacks = ref(new Map()) // Map<uploadId, uploadMediaFn> - callbacks for media creation
  const loadMediaItemsCallbacks = ref(new Map()) // Map<uploadId, loadMediaItems> - callbacks for reloading media
  const onUploadCompleteCallbacks = ref(new Map()) // Map<uploadId, onUploadComplete> - callbacks for post-upload actions

  // Computed
  const activeUploadCount = computed(() => {
    return uploadQueue.value.filter(u => u.status === 'uploading').length
  })

  const failedUploadCount = computed(() => {
    return uploadQueue.value.filter(u => u.status === 'failed').length
  })

  const pausedUploadCount = computed(() => {
    return uploadQueue.value.filter(u => u.status === 'paused').length
  })

  const pendingUploadCount = computed(() => {
    return uploadQueue.value.filter(u => u.status === 'pending').length
  })

  /**
   * Load upload queue from IndexedDB
   */
  const loadQueue = async () => {
    try {
      const items = await getUploadQueue()
      uploadQueue.value = items
      return items
    } catch (error) {
      console.error('Failed to load upload queue:', error)
      return []
    }
  }

  /**
   * Update quota usage
   */
  const updateQuotaUsage = async () => {
    try {
      const quota = await getStorageQuota()
      quotaUsage.value = quota
      return quota
    } catch (error) {
      console.error('Failed to update quota usage:', error)
    }
  }

  /**
   * Check if quota is high
   */
  const isQuotaHigh = computed(() => {
    return quotaUsage.value.percentage !== null && quotaUsage.value.percentage > quotaWarningThreshold
  })

  /**
   * Network connectivity handlers
   */
  const handleOnline = () => {
    isOnline.value = true
    if (autoResumeOnOnline) {
      resumeAllPaused()
    }
  }

  const handleOffline = () => {
    isOnline.value = false
    pauseAllActive()
  }

  /**
   * Initialize network listeners
   */
  const initNetworkListeners = () => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
  }

  /**
   * Cleanup network listeners
   */
  const cleanupNetworkListeners = () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }

  /**
   * Initialize upload manager
   */
  const init = async () => {
    if (isInitialized.value) return

    if (!isUploadQueueStorageAvailable()) {
      console.error('IndexedDB is not available')
      return
    }

    initNetworkListeners()
    await loadQueue()
    await updateQuotaUsage()
    await cleanupCompletedUploads()
    if (enableHistory) {
      await cleanupOldHistoryEntries()
      await loadHistory()
    }
    isInitialized.value = true

    // Auto-resume if online
    if (isOnline.value && autoResumeOnOnline) {
      resumePendingUploads()
    }
  }

  /**
   * Cleanup completed uploads
   */
  const cleanupCompletedUploads = async () => {
    try {
      await clearCompletedUploads(cleanupHours)
    } catch (error) {
      console.error('Failed to cleanup completed uploads:', error)
    }
  }

  /**
   * Cleanup old history
   */
  const cleanupOldHistoryEntries = async () => {
    try {
      await cleanupOldHistory(historyDays)
    } catch (error) {
      console.error('Failed to cleanup old history:', error)
    }
  }

  /**
   * Load upload history
   */
  const loadHistory = async (limit = 50) => {
    try {
      const history = await getUploadHistory(limit)
      uploadHistory.value = history
      return history
    } catch (error) {
      console.error('Failed to load upload history:', error)
      return []
    }
  }

  /**
   * Add upload to queue
   */
  const addToQueue = async (file, uploadConfig) => {
    const { 
      contextId, 
      setId, 
      uploadMediaFn, 
      validationOptions = {}, 
      contextType = 'collection',
      loadMediaItems,
      onUploadComplete,
      existingMedia = [], // Optional: existing media to check against
    } = uploadConfig

    // Generate file hash for deduplication
    const fileHash = generateFileHash(file.name, file.size, contextId, setId)

    // Check for duplicates in upload queue
    const duplicate = await checkDuplicate(fileHash)
    if (duplicate) {
      return { success: false, duplicate: true, existingItem: duplicate }
    }

    // Check against existing media if provided (prevents duplicates after reload)
    if (Array.isArray(existingMedia) && existingMedia.length > 0) {
      const fileName = file.name.toLowerCase().trim()
      const fileSize = file.size
      
      const existingMediaItem = existingMedia.find(m => {
        const mediaFilename = (
          m.filename ||
          m.file?.filename ||
          m.title ||
          m.originalFilename ||
          ''
        ).toLowerCase().trim()
        
        const mediaSize = m.size || m.file?.size || 0
        
        // Check if filename matches (with or without extension)
        const filenameMatches =
          mediaFilename === fileName ||
          mediaFilename === fileName.replace(/\.[^/.]+$/, '') ||
          (mediaFilename && fileName && 
           mediaFilename + file.name.substring(file.name.lastIndexOf('.')) === fileName)
        
        // Check if size matches (within 1% tolerance)
        const sizeMatches =
          mediaSize > 0 && Math.abs(mediaSize - fileSize) <= Math.max(1, fileSize * 0.01)
        
        // Also check setId if provided
        const setIdMatches = !setId || m.setId === setId
        
        return filenameMatches && (sizeMatches || mediaSize === 0) && setIdMatches
      })
      
      if (existingMediaItem) {
        return { 
          success: false, 
          duplicate: true, 
          existingItem: existingMediaItem,
          message: `File "${file.name}" already exists in this set`
        }
      }
    }

    // Check quota
    await updateQuotaUsage()
    if (isQuotaHigh.value) {
      return {
        success: false,
        error: {
          category: 'quota',
          message: 'Storage quota is high. Please cleanup old uploads first.',
        },
      }
    }

    // Store file in IndexedDB
    let fileId
    try {
      fileId = await storeFile(file)
    } catch (error) {
      return {
        success: false,
        error: {
          category: 'quota',
          message: `Failed to store file: ${error.message}`,
        },
      }
    }

    // Generate ID first
    const uploadId = generateUUID()

    // Create upload queue item
    const uploadItem = {
      id: uploadId,
      fileId,
      fileHash,
      filename: file.name,
      size: file.size,
      type: file.type,
      contextId,
      setId,
      contextType, // Store context type for reference
      status: 'pending',
      priority: 0,
      order: uploadQueue.value.length,
      progress: {
        loaded: 0,
        total: file.size,
        percentage: 0,
        speed: 0,
        eta: null,
      },
      error: null,
      retryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store callback functions (can't be serialized, stored in memory)
    if (uploadMediaFn) {
      uploadCallbacks.value.set(uploadId, uploadMediaFn)
    }
    if (loadMediaItems) {
      loadMediaItemsCallbacks.value.set(uploadId, loadMediaItems)
    }
    if (onUploadComplete) {
      onUploadCompleteCallbacks.value.set(uploadId, onUploadComplete)
    }

    try {
      await saveUploadItem(uploadItem)
      await loadQueue()
      processQueue()
      return { success: true, uploadId: uploadItem.id, uploadItem }
    } catch (error) {
      console.error('Failed to add upload to queue:', error)
      console.error('Upload item that failed:', uploadItem)
      const errorMessage = error?.message || error?.toString() || 'Unknown error'
      return {
        success: false,
        error: {
          category: 'unknown',
          message: `Failed to add upload to queue: ${errorMessage}`,
        },
      }
    }
  }

  /**
   * Process upload queue (start uploads up to concurrent limit)
   */
  const processQueue = async () => {
    if (!isOnline.value) return

    const activeCount = activeUploadCount.value
    if (activeCount >= concurrentLimit.value) return

    const toStart = uploadQueue.value
      .filter(u => u.status === 'pending' || (u.status === 'paused' && autoResumeOnOnline))
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return (b.priority || 0) - (a.priority || 0)
        }
        return (a.order || 0) - (b.order || 0)
      })
      .slice(0, concurrentLimit.value - activeCount)

    for (const item of toStart) {
      startUpload(item.id)
    }
  }

  /**
   * Start upload
   */
  const startUpload = async uploadId => {
    const item = uploadQueue.value.find(u => u.id === uploadId)
    if (!item || item.status === 'uploading') return

    if (!isOnline.value) {
      await updateUploadStatus(uploadId, 'paused')
      await loadQueue()
      return
    }

    // Get file from IndexedDB
    let file
    try {
      const blob = await getFile(item.fileId)
      file = new File([blob], item.filename, { type: item.type })
    } catch (error) {
      await updateUploadStatus(uploadId, 'failed', {
        category: 'unknown',
        message: `Failed to retrieve file: ${error.message}`,
      })
      await loadQueue()
      return
    }

    // Update status to uploading
    await updateUploadStatus(uploadId, 'uploading')
    await loadQueue()

    // Create AbortController
    const abortController = new AbortController()
    uploadAbortControllers.value.set(uploadId, abortController)
    activeUploads.value.set(uploadId, abortController)

    // Initialize progress history
    progressHistory.value.set(uploadId, [{ timestamp: Date.now(), loaded: 0 }])

    // Determine upload endpoint
    const isImage = file.type.startsWith('image/')
    const uploadEndpoint = isImage ? '/v1/images/upload' : '/v1/uploads'

    try {
      // Upload file
      const uploadResult = await apiClient.uploadWithProgress(uploadEndpoint, file, {
        signal: abortController.signal,
        onProgress: (loaded, total) => {
          updateUploadProgressHandler(uploadId, loaded, total)
        },
      })

      // Upload successful, create media record
      let uploadMediaFn = uploadCallbacks.value.get(uploadId)
      
      // If callback is not available, try to resolve it from stored metadata
      if (!uploadMediaFn && item.contextType && item.contextId) {
        uploadMediaFn = resolveUploadMediaCallback(item.contextType, item.contextId, item.setId)
        if (uploadMediaFn) {
          uploadCallbacks.value.set(uploadId, uploadMediaFn)
        }
      }
      
      if (uploadMediaFn) {
        try {
          // Prepare media data (similar to useMediaUpload)
          const uploadResponse = uploadResult.data
          const isImage = file.type.startsWith('image/')
          
          const imageUrl =
            isImage && uploadResponse.variants
              ? uploadResponse.variants.large || uploadResponse.variants.original || uploadResponse.url
              : uploadResponse.url

          const thumbnailUrl =
            isImage && uploadResponse.variants
              ? uploadResponse.variants.thumb || uploadResponse.variants.medium || imageUrl
              : uploadResponse.thumbnail || (isImage ? imageUrl : null)

          const type = isImage ? 'image' : 'video'
          
          const mediaData = {
            userFileUuid: uploadResponse.userFileUuid,
            uploadUrl: imageUrl,
            filename: uploadResponse.originalFilename || item.filename,
            mimeType: uploadResponse.mimeType || file.type,
            size: uploadResponse.size || file.size,
            type: type,
            width: uploadResponse.width || null,
            height: uploadResponse.height || null,
            thumbnail: thumbnailUrl,
            variants: uploadResponse.variants || null,
          }

          // Call uploadMediaFn to create media record
          await uploadMediaFn(uploadResponse, file, {
            contextId: item.contextId,
            setId: item.setId,
            mediaData,
          })

          // Execute post-upload callbacks
          let loadMediaItemsFn = loadMediaItemsCallbacks.value.get(uploadId)
          let onUploadCompleteFn = onUploadCompleteCallbacks.value.get(uploadId)

          // Resolve callbacks if missing (after page reload)
          if (!loadMediaItemsFn && item.contextType && item.contextId) {
            loadMediaItemsFn = resolveLoadMediaItemsCallback(item.contextType, item.contextId, item.setId)
            if (loadMediaItemsFn) {
              loadMediaItemsCallbacks.value.set(uploadId, loadMediaItemsFn)
            }
          }

          if (!onUploadCompleteFn && item.contextType && item.contextId) {
            onUploadCompleteFn = resolveOnUploadCompleteCallback(item.contextType, item.contextId, item.setId)
            if (onUploadCompleteFn) {
              onUploadCompleteCallbacks.value.set(uploadId, onUploadCompleteFn)
            }
          }

          if (loadMediaItemsFn) {
            try {
              await loadMediaItemsFn()
            } catch (error) {
              console.error('Error in loadMediaItems callback:', error)
            }
          }

          if (onUploadCompleteFn) {
            try {
              await onUploadCompleteFn({
                successful: [{ file, uploadId }],
                failed: [],
              })
            } catch (error) {
              console.error('Error in onUploadComplete callback:', error)
            }
          }
        } catch (error) {
          // Media creation failed
          const errorObj = {
            category: 'server',
            message: getErrorMessage(error, `Failed to create media record for "${item.filename}"`),
            code: error?.code,
            status: error?.status,
          }
          await updateUploadStatus(uploadId, 'failed', errorObj)
          await loadQueue()
          activeUploads.value.delete(uploadId)
          uploadAbortControllers.value.delete(uploadId)
          progressHistory.value.delete(uploadId)
          uploadCallbacks.value.delete(uploadId)
          loadMediaItemsCallbacks.value.delete(uploadId)
          onUploadCompleteCallbacks.value.delete(uploadId)
          processQueue()
          return
        }
      } else {
        // Callback not available (e.g., after page reload)
        // Mark as failed so user can retry and re-register callback
        await updateUploadStatus(uploadId, 'failed', {
          category: 'server',
          message: 'Upload completed but media creation callback not available. Please retry to create media record.',
        })
        await loadQueue()
        activeUploads.value.delete(uploadId)
        uploadAbortControllers.value.delete(uploadId)
        progressHistory.value.delete(uploadId)
        processQueue()
        return
      }

      await updateUploadStatus(uploadId, 'completed')
      
      // Store in history
      if (enableHistory) {
        const historyItem = {
          filename: item.filename,
          size: item.size,
          type: item.type,
          status: 'completed',
          completedAt: new Date().toISOString(),
          metadata: {
            uploadSpeed: item.progress.speed,
            duration: item.updatedAt ? new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime() : null,
          },
        }
        await saveUploadHistory(historyItem)
      }

      // Delete file from IndexedDB
      if (item.fileId) {
        try {
          await deleteFile(item.fileId)
        } catch (error) {
          console.error(`Failed to delete file ${item.fileId}:`, error)
        }
      }

      // Remove from queue
      await removeUploadItem(uploadId)
      await loadQueue()

      // Cleanup callbacks
      uploadCallbacks.value.delete(uploadId)
      loadMediaItemsCallbacks.value.delete(uploadId)
      onUploadCompleteCallbacks.value.delete(uploadId)

      // Cleanup in-memory state
      activeUploads.value.delete(uploadId)
      uploadAbortControllers.value.delete(uploadId)
      progressHistory.value.delete(uploadId)

      // Process next in queue
      processQueue()
    } catch (error) {
      if (error.name === 'AbortError' || abortController?.signal?.aborted) {
        // Upload was cancelled/paused
        activeUploads.value.delete(uploadId)
        uploadAbortControllers.value.delete(uploadId)
        progressHistory.value.delete(uploadId)
        // Keep callbacks for resume
        return
      }

      // Categorize error
      const category = categorizeError(error)
      const errorObj = {
        category,
        message: getErrorMessage(error, `Failed to upload "${item.filename}"`),
        code: error?.code,
        status: error?.status,
      }

      // Determine if should retry
      const maxRetries = DEFAULT_RETRY_ATTEMPTS[category] || 0
      const shouldRetry = item.retryCount < maxRetries && maxRetries > 0

      if (shouldRetry) {
        // Increment retry count and retry
        item.retryCount = (item.retryCount || 0) + 1
        await saveUploadItem(item)
        await updateUploadStatus(uploadId, 'pending')
        await loadQueue()
      activeUploads.value.delete(uploadId)
      uploadAbortControllers.value.delete(uploadId)
      progressHistory.value.delete(uploadId)
      // Keep callback for retry
      // Retry after delay
      setTimeout(() => processQueue(), 1000 * Math.pow(2, item.retryCount))
      } else {
        // Failed permanently
        await updateUploadStatus(uploadId, 'failed', errorObj)
        await loadQueue()

        // Store in history
        if (enableHistory) {
          const historyItem = {
            filename: item.filename,
            size: item.size,
            type: item.type,
            status: 'failed',
            error: errorObj,
            completedAt: new Date().toISOString(),
          }
          await saveUploadHistory(historyItem)
        }

      activeUploads.value.delete(uploadId)
      uploadAbortControllers.value.delete(uploadId)
      progressHistory.value.delete(uploadId)
      uploadCallbacks.value.delete(uploadId)
    }

    // Process next in queue
    processQueue()
    }
  }

  /**
   * Update upload progress handler
   */
  const updateUploadProgressHandler = async (uploadId, loaded, total) => {
    const item = uploadQueue.value.find(u => u.id === uploadId)
    if (!item) return

    // Update progress history
    const history = progressHistory.value.get(uploadId) || []
    history.push({ timestamp: Date.now(), loaded })
    if (history.length > 20) {
      history.shift() // Keep last 20 updates
    }
    progressHistory.value.set(uploadId, history)

    // Calculate speed and ETA
    const { speed, eta } = calculateSpeedAndETA(history, total, loaded)

    // Update progress
    const progress = {
      loaded,
      total,
      percentage: total > 0 ? Math.round((loaded / total) * 100) : 0,
      speed,
      eta,
    }

    try {
      await updateUploadProgress(uploadId, progress)
      // Reload queue periodically (not on every progress update to avoid overhead)
      if (progress.percentage % 10 === 0 || progress.percentage === 100) {
        await loadQueue()
      }
    } catch (error) {
      console.error('Failed to update upload progress:', error)
    }
  }

  /**
   * Pause upload
   */
  const pause = async uploadId => {
    const item = uploadQueue.value.find(u => u.id === uploadId)
    if (!item) return

    // Only pause if currently uploading
    if (item.status !== 'uploading') {
      return
    }

    // Abort the upload request
    const abortController = uploadAbortControllers.value.get(uploadId)
    if (abortController && !abortController.signal.aborted) {
      abortController.abort()
    }

    // Update status to paused
    await updateUploadStatus(uploadId, 'paused')
    await loadQueue()
    
    // Cleanup active upload state (but keep callbacks for resume)
    activeUploads.value.delete(uploadId)
    uploadAbortControllers.value.delete(uploadId)
    progressHistory.value.delete(uploadId)
    
    // Process next in queue
    processQueue()
  }

  /**
   * Resume upload
   */
  const resume = async uploadId => {
    await updateUploadStatus(uploadId, 'pending')
    await loadQueue()
    processQueue()
  }

  /**
   * Pause all active uploads
   */
  const pauseAllActive = async () => {
    const activeItems = uploadQueue.value.filter(u => u.status === 'uploading')
    await Promise.all(activeItems.map(item => pause(item.id)))
  }

  /**
   * Resume all paused uploads
   */
  const resumeAllPaused = async () => {
    const pausedItems = uploadQueue.value.filter(u => u.status === 'paused')
    await Promise.all(pausedItems.map(item => resume(item.id)))
  }

  /**
   * Resume pending uploads
   */
  const resumePendingUploads = async () => {
    processQueue()
  }

  /**
   * Cancel upload
   */
  const cancel = async uploadId => {
    const abortController = uploadAbortControllers.value.get(uploadId)
    if (abortController) {
      abortController.abort()
    }

    const item = uploadQueue.value.find(u => u.id === uploadId)
    if (item) {
      // Delete file from IndexedDB
      try {
        await deleteFile(item.fileId)
      } catch (error) {
        console.error('Failed to delete file:', error)
      }
    }

    await removeUploadItem(uploadId)
    await loadQueue()
    activeUploads.value.delete(uploadId)
    uploadAbortControllers.value.delete(uploadId)
    progressHistory.value.delete(uploadId)
    uploadCallbacks.value.delete(uploadId)
    processQueue()
  }

  /**
   * Retry failed upload
   */
  const retry = async uploadId => {
    const item = uploadQueue.value.find(u => u.id === uploadId)
    if (!item || item.status !== 'failed') return

    // Reset retry count and status
    item.retryCount = 0
    item.error = null
    item.status = 'pending'
    await saveUploadItem(item)
    await loadQueue()
    processQueue()
  }

  /**
   * Retry all failed uploads
   */
  const retryAllFailed = async () => {
    const failedItems = uploadQueue.value.filter(u => u.status === 'failed')
    await Promise.all(failedItems.map(item => retry(item.id)))
  }

  /**
   * Delete all uploads from queue
   */
  const deleteAll = async () => {
    const allItems = [...uploadQueue.value]
    await Promise.all(
      allItems.map(async item => {
        // Cancel if active
        if (item.status === 'uploading') {
          const abortController = uploadAbortControllers.value.get(item.id)
          if (abortController) {
            abortController.abort()
          }
        }
        // Remove from IndexedDB
        await removeUploadItem(item.id)
        // Delete file from storage
        if (item.fileId) {
          try {
            await deleteFile(item.fileId)
          } catch (error) {
            console.error(`Failed to delete file ${item.fileId}:`, error)
          }
        }
        // Cleanup callbacks
        uploadCallbacks.value.delete(item.id)
        loadMediaItemsCallbacks.value.delete(item.id)
        onUploadCompleteCallbacks.value.delete(item.id)
        // Cleanup in-memory state
        activeUploads.value.delete(item.id)
        uploadAbortControllers.value.delete(item.id)
        progressHistory.value.delete(item.id)
      })
    )
    await loadQueue()
    processQueue()
  }

  /**
   * Set upload priority
   */
  const setPriority = async (uploadId, priority) => {
    await updateUploadPriority(uploadId, priority, undefined)
    await loadQueue()
    processQueue() // Re-evaluate queue order
  }

  /**
   * Reorder uploads
   */
  const reorder = async (uploadIds) => {
    // Update order for all items
    for (let i = 0; i < uploadIds.length; i++) {
      const uploadId = uploadIds[i]
      const item = uploadQueue.value.find(u => u.id === uploadId)
      if (item) {
        await updateUploadPriority(uploadId, item.priority, i)
      }
    }
    await loadQueue()
    processQueue() // Re-evaluate queue order
  }

  /**
   * Check for duplicate
   */
  const checkForDuplicate = async (filename, size, contextId, setId) => {
    const fileHash = generateFileHash(filename, size, contextId, setId)
    return await checkDuplicate(fileHash)
  }

  /**
   * Get quota usage
   */
  const getQuotaUsage = async () => {
    await updateQuotaUsage()
    return quotaUsage.value
  }

  /**
   * Register callback for an upload (useful for restored uploads after page reload)
   */
  const registerCallback = (uploadId, uploadMediaFn) => {
    uploadCallbacks.value.set(uploadId, uploadMediaFn)
  }

  /**
   * Register callbacks for multiple uploads
   */
  const registerCallbacks = (callbacks) => {
    // callbacks: Map<uploadId, uploadMediaFn> or Object<uploadId, uploadMediaFn>
    if (callbacks instanceof Map) {
      callbacks.forEach((fn, id) => {
        uploadCallbacks.value.set(id, fn)
      })
    } else {
      Object.entries(callbacks).forEach(([id, fn]) => {
        uploadCallbacks.value.set(id, fn)
      })
    }
  }

  // Create instance object
  const instance = {
    // State
    uploadQueue,
    isOnline,
    quotaUsage,
    uploadHistory,
    isInitialized,
    isQuotaHigh,
    concurrentLimit,

    // Computed
    activeUploadCount,
    failedUploadCount,
    pausedUploadCount,
    pendingUploadCount,

    // Methods
    init,
    addToQueue,
    pause,
    resume,
    pauseAllActive,
    resumeAllPaused,
    cancel,
    retry,
    retryAllFailed,
    deleteAll,
    setPriority,
    reorder,
    checkForDuplicate,
    getQuotaUsage,
    registerCallback,
    registerCallbacks,
    loadQueue,
    loadHistory,
  }

  // Store singleton instance
  managerInstance = instance

  // Initialize immediately (singleton pattern)
  init()

  return instance
}

