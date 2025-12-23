/**
 * File Storage Utility
 * Stores files in IndexedDB and returns file paths/IDs instead of base64
 * This prevents localStorage quota issues
 *
 * Note: Files are stored in the browser's IndexedDB, not in a physical folder.
 * To view stored files:
 * 1. Open browser DevTools (F12)
 * 2. Go to Application/Storage tab
 * 3. Look for IndexedDB > mazeloot_file_storage > files
 */

const DB_NAME = 'mazeloot_file_storage'
const DB_VERSION = 1
const STORE_NAME = 'files'

let db = null

/**
 * Initialize IndexedDB
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
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * Generate a unique file ID
 */
const generateFileId = () => {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Store a file and return its ID
 */
export const storeFile = async (file, options = {}) => {
  try {
    const database = await initDB()
    const fileId = options.id || generateFileId()

    // Convert file to ArrayBuffer for storage
    const arrayBuffer = await file.arrayBuffer()

    const fileData = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      data: arrayBuffer,
      createdAt: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(fileData)

      request.onsuccess = () => {
        resolve(`file://${fileId}`)
      }

      request.onerror = () => {
        reject(new Error('Failed to store file'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Store a blob and return its ID
 */
export const storeBlob = async (blob, filename, options = {}) => {
  try {
    const database = await initDB()
    const fileId = options.id || generateFileId()

    // Convert blob to ArrayBuffer for storage
    const arrayBuffer = await blob.arrayBuffer()

    const fileData = {
      id: fileId,
      name: filename || `file_${fileId}`,
      type: blob.type || 'application/octet-stream',
      size: blob.size,
      data: arrayBuffer,
      createdAt: new Date().toISOString(),
    }

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(fileData)

      request.onsuccess = () => {
        resolve(`file://${fileId}`)
      }

      request.onerror = () => {
        reject(new Error('Failed to store blob'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Retrieve a file by its ID/path
 */
export const getFile = async filePath => {
  try {
    const database = await initDB()

    // Extract file ID from path (format: file://fileId)
    const fileId = filePath.replace('file://', '')

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(fileId)

      request.onsuccess = () => {
        const fileData = request.result
        if (!fileData) {
          reject(new Error('File not found'))
          return
        }

        // Convert ArrayBuffer back to Blob
        const blob = new Blob([fileData.data], { type: fileData.type })
        resolve(blob)
      }

      request.onerror = () => {
        reject(new Error('Failed to retrieve file'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get a blob URL for a file (for use in img src, etc.)
 */
export const getFileBlobURL = async filePath => {
  try {
    const blob = await getFile(filePath)
    return URL.createObjectURL(blob)
  } catch (error) {
    throw error
  }
}

/**
 * Delete a file by its ID/path
 */
export const deleteFile = async filePath => {
  try {
    const database = await initDB()
    const fileId = filePath.replace('file://', '')

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(fileId)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Failed to delete file'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * List all stored files (for debugging)
 */
export const listStoredFiles = async () => {
  try {
    const database = await initDB()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const files = request.result.map(fileData => ({
          id: fileData.id,
          name: fileData.name,
          type: fileData.type,
          size: fileData.size,
          createdAt: fileData.createdAt,
          path: `file://${fileData.id}`,
        }))
        resolve(files)
      }

      request.onerror = () => {
        reject(new Error('Failed to list files'))
      }
    })
  } catch (error) {
    throw error
  }
}

/**
 * Get storage statistics
 */
export const getStorageStats = async () => {
  try {
    const files = await listStoredFiles()
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0)

    return {
      fileCount: files.length,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      files: files,
    }
  } catch (error) {
    throw error
  }
}

/**
 * Check if IndexedDB is available
 */
export const isFileStorageAvailable = () => {
  return typeof indexedDB !== 'undefined'
}
