/**
 * Upload Queue Storage Utility
 * Manages upload queue and history in IndexedDB
 * Extends mazeloot_file_storage database with upload_queue and upload_history stores
 */

const DB_NAME = 'mazeloot_file_storage'
const DB_VERSION = 2 // Incremented to add new stores
const UPLOAD_QUEUE_STORE = 'upload_queue'
const UPLOAD_HISTORY_STORE = 'upload_history'

let db = null

/**
 * Initialize IndexedDB with upload queue stores
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'))
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = event => {
      const database = event.target.result
      const transaction = event.target.transaction

      // Ensure files store exists (from fileStorage.js)
      if (!database.objectStoreNames.contains('files')) {
        database.createObjectStore('files', { keyPath: 'id' })
      }

      // Create upload_queue store if it doesn't exist
      if (!database.objectStoreNames.contains(UPLOAD_QUEUE_STORE)) {
        const store = database.createObjectStore(UPLOAD_QUEUE_STORE, { keyPath: 'id' })
        store.createIndex('status', 'status', { unique: false })
        store.createIndex('fileHash', 'fileHash', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
        store.createIndex('priority', 'priority', { unique: false })
      }

      // Create upload_history store if it doesn't exist
      if (!database.objectStoreNames.contains(UPLOAD_HISTORY_STORE)) {
        const store = database.createObjectStore(UPLOAD_HISTORY_STORE, { keyPath: 'id' })
        store.createIndex('status', 'status', { unique: false })
        store.createIndex('completedAt', 'completedAt', { unique: false })
      }
    }
  })
}

/**
 * Generate a unique upload ID
 */
const generateUploadId = () => {
  return `upload_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Sanitize upload item to ensure it's serializable for IndexedDB
 */
const sanitizeUploadItem = item => {
  return {
    id: item.id,
    fileId: item.fileId,
    fileHash: item.fileHash,
    filename: item.filename,
    size: item.size,
    type: item.type,
    contextId: item.contextId,
    setId: item.setId,
    contextType: item.contextType,
    status: item.status,
    priority: item.priority ?? 0,
    order: item.order ?? 0,
    progress: item.progress
      ? {
          loaded: item.progress.loaded ?? 0,
          total: item.progress.total ?? 0,
          percentage: item.progress.percentage ?? 0,
          speed: item.progress.speed ?? 0,
          eta: item.progress.eta ?? null,
        }
      : {
          loaded: 0,
          total: 0,
          percentage: 0,
          speed: 0,
          eta: null,
        },
    error: item.error
      ? typeof item.error === 'string'
        ? item.error
        : item.error?.message || item.error?.toString() || null
      : null,
    retryCount: item.retryCount ?? 0,
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: item.completedAt || null,
  }
}

/**
 * Save upload queue item
 */
export const saveUploadItem = async uploadItem => {
  try {
    const database = await initDB()
    if (!uploadItem.id) {
      uploadItem.id = generateUploadId()
    }
    if (!uploadItem.createdAt) {
      uploadItem.createdAt = new Date().toISOString()
    }

    // Sanitize the uploadItem to ensure it's serializable
    const sanitizedItem = sanitizeUploadItem(uploadItem)

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readwrite')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const request = store.put(sanitizedItem)

      request.onsuccess = () => {
        resolve(uploadItem.id)
      }

      request.onerror = (event) => {
        const error = request.error || event.target?.error
        const errorMessage = error?.message || error?.name || 'Unknown IndexedDB error'
        console.error('IndexedDB save error:', error, uploadItem)
        reject(new Error(`Failed to save upload item: ${errorMessage}`))
      }

      transaction.onerror = (event) => {
        const error = transaction.error || event.target?.error
        const errorMessage = error?.message || error?.name || 'Unknown transaction error'
        console.error('IndexedDB transaction error:', error)
        reject(new Error(`Transaction failed: ${errorMessage}`))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get all upload queue items (sorted by priority/order)
 */
export const getUploadQueue = async () => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readonly')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result || []
        // Sort by priority (high to low), then by order
        items.sort((a, b) => {
          if (a.priority !== b.priority) {
            return (b.priority || 0) - (a.priority || 0)
          }
          return (a.order || 0) - (b.order || 0)
        })
        resolve(items)
      }

      request.onerror = () => {
        reject(new Error('Failed to get upload queue'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get upload item by ID
 */
export const getUploadItem = async id => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readonly')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        reject(new Error('Failed to get upload item'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Update upload progress
 */
export const updateUploadProgress = async (id, progress) => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readwrite')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const item = getRequest.result
        if (!item) {
          reject(new Error('Upload item not found'))
          return
        }

        item.progress = { ...item.progress, ...progress }
        item.updatedAt = new Date().toISOString()

        const sanitizedItem = sanitizeUploadItem(item)
        const putRequest = store.put(sanitizedItem)
        putRequest.onsuccess = () => resolve(item)
        putRequest.onerror = () => reject(new Error('Failed to update progress'))
      }

      getRequest.onerror = () => {
        reject(new Error('Failed to get upload item'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Update upload status
 */
export const updateUploadStatus = async (id, status, error = null) => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readwrite')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const item = getRequest.result
        if (!item) {
          reject(new Error('Upload item not found'))
          return
        }

        item.status = status
        item.updatedAt = new Date().toISOString()
        if (error) {
          item.error = typeof error === 'string' ? error : error?.message || error?.toString() || null
        }
        if (status === 'completed') {
          item.completedAt = new Date().toISOString()
        }

        const sanitizedItem = sanitizeUploadItem(item)
        const putRequest = store.put(sanitizedItem)
        putRequest.onsuccess = () => resolve(item)
        putRequest.onerror = () => reject(new Error('Failed to update status'))
      }

      getRequest.onerror = () => {
        reject(new Error('Failed to get upload item'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Update upload priority/order
 */
export const updateUploadPriority = async (id, priority, order) => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readwrite')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const item = getRequest.result
        if (!item) {
          reject(new Error('Upload item not found'))
          return
        }

        if (priority !== undefined) {
          item.priority = priority
        }
        if (order !== undefined) {
          item.order = order
        }
        item.updatedAt = new Date().toISOString()

        const sanitizedItem = sanitizeUploadItem(item)
        const putRequest = store.put(sanitizedItem)
        putRequest.onsuccess = () => resolve(item)
        putRequest.onerror = () => reject(new Error('Failed to update priority'))
      }

      getRequest.onerror = () => {
        reject(new Error('Failed to get upload item'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Remove upload item
 */
export const removeUploadItem = async id => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readwrite')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Failed to remove upload item'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Check for duplicate upload (by file hash)
 */
export const checkDuplicate = async fileHash => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readonly')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const index = store.index('fileHash')
      const request = index.getAll(fileHash)

      request.onsuccess = () => {
        const items = request.result || []
        // Filter out completed/cancelled items
        const activeItems = items.filter(
          item => item.status !== 'completed' && item.status !== 'cancelled'
        )
        resolve(activeItems.length > 0 ? activeItems[0] : null)
      }

      request.onerror = () => {
        reject(new Error('Failed to check duplicate'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Clear completed uploads older than specified hours
 */
export const clearCompletedUploads = async (olderThanHours = 24) => {
  try {
    const database = await initDB()
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000).toISOString()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_QUEUE_STORE], 'readwrite')
      const store = transaction.objectStore(UPLOAD_QUEUE_STORE)
      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result || []
        const toDelete = items.filter(item => {
          if (item.status !== 'completed') return false
          if (!item.completedAt) return true
          return item.completedAt < cutoffTime
        })

        if (toDelete.length === 0) {
          resolve(0)
          return
        }

        let deleted = 0
        let errors = 0

        toDelete.forEach(item => {
          const deleteRequest = store.delete(item.id)
          deleteRequest.onsuccess = () => {
            deleted++
            if (deleted + errors === toDelete.length) {
              resolve(deleted)
            }
          }
          deleteRequest.onerror = () => {
            errors++
            if (deleted + errors === toDelete.length) {
              resolve(deleted)
            }
          }
        })
      }

      request.onerror = () => {
        reject(new Error('Failed to clear completed uploads'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get IndexedDB storage quota usage
 */
export const getStorageQuota = async () => {
  try {
    if (!navigator.storage || !navigator.storage.estimate) {
      return {
        quota: null,
        usage: null,
        usageDetails: null,
        percentage: null,
      }
    }

    const estimate = await navigator.storage.estimate()
    const usage = estimate.usage || 0
    const quota = estimate.quota || 0
    const percentage = quota > 0 ? (usage / quota) * 100 : null

    return {
      quota,
      usage,
      usageDetails: estimate.usageDetails || null,
      percentage,
    }
  } catch (error) {
    console.error('Failed to get storage quota:', error)
    return {
      quota: null,
      usage: null,
      usageDetails: null,
      percentage: null,
    }
  }
}

/**
 * Save upload history item
 */
export const saveUploadHistory = async historyItem => {
  try {
    const database = await initDB()
    if (!historyItem.id) {
      historyItem.id = generateUploadId()
    }
    if (!historyItem.completedAt) {
      historyItem.completedAt = new Date().toISOString()
    }

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_HISTORY_STORE], 'readwrite')
      const store = transaction.objectStore(UPLOAD_HISTORY_STORE)
      const request = store.put(historyItem)

      request.onsuccess = () => {
        resolve(historyItem.id)
      }

      request.onerror = () => {
        reject(new Error('Failed to save upload history'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get upload history
 */
export const getUploadHistory = async (limit = 100, status = null) => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_HISTORY_STORE], 'readonly')
      const store = transaction.objectStore(UPLOAD_HISTORY_STORE)
      const index = store.index('completedAt')
      const request = index.getAll()

      request.onsuccess = () => {
        let items = request.result || []
        if (status) {
          items = items.filter(item => item.status === status)
        }
        // Sort by completedAt descending (newest first)
        items.sort((a, b) => {
          const aTime = new Date(a.completedAt || 0).getTime()
          const bTime = new Date(b.completedAt || 0).getTime()
          return bTime - aTime
        })
        resolve(items.slice(0, limit))
      }

      request.onerror = () => {
        reject(new Error('Failed to get upload history'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Clean up old upload history entries
 */
export const cleanupOldHistory = async (olderThanDays = 7) => {
  try {
    const database = await initDB()
    const cutoffTime = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([UPLOAD_HISTORY_STORE], 'readwrite')
      const store = transaction.objectStore(UPLOAD_HISTORY_STORE)
      const index = store.index('completedAt')
      const request = index.getAll()

      request.onsuccess = () => {
        const items = request.result || []
        const toDelete = items.filter(item => {
          if (!item.completedAt) return true
          return item.completedAt < cutoffTime
        })

        if (toDelete.length === 0) {
          resolve(0)
          return
        }

        let deleted = 0
        let errors = 0

        toDelete.forEach(item => {
          const deleteRequest = store.delete(item.id)
          deleteRequest.onsuccess = () => {
            deleted++
            if (deleted + errors === toDelete.length) {
              resolve(deleted)
            }
          }
          deleteRequest.onerror = () => {
            errors++
            if (deleted + errors === toDelete.length) {
              resolve(deleted)
            }
          }
        })
      }

      request.onerror = () => {
        reject(new Error('Failed to cleanup old history'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Check if IndexedDB is available
 */
export const isUploadQueueStorageAvailable = () => {
  return typeof indexedDB !== 'undefined'
}

