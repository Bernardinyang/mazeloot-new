/**
 * IndexedDB utility for storing large media files
 * Provides a fallback when localStorage quota is exceeded
 */

const DB_NAME = 'mazeloot_db'
const DB_VERSION = 1
const MEDIA_STORE = 'media'

let dbInstance = null

/**
 * Initialize IndexedDB database
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'))
    }

    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = event => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        const store = db.createObjectStore(MEDIA_STORE, { keyPath: 'id' })
        store.createIndex('collectionId', 'collectionId', { unique: false })
        store.createIndex('setId', 'setId', { unique: false })
      }
    }
  })
}

/**
 * Get all media items from IndexedDB
 */
export const getMediaFromIndexedDB = async () => {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MEDIA_STORE], 'readonly')
      const store = transaction.objectStore(MEDIA_STORE)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        reject(new Error('Failed to read from IndexedDB'))
      }
    })
  } catch (error) {
    console.error('IndexedDB not available:', error)
    return []
  }
}

/**
 * Save media items to IndexedDB
 */
export const saveMediaToIndexedDB = async media => {
  try {
    const db = await initDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([MEDIA_STORE], 'readwrite')
      const store = transaction.objectStore(MEDIA_STORE)

      // Use put instead of clear + add to handle duplicates better
      let completed = 0
      let hasError = false
      const total = media.length

      if (total === 0) {
        resolve()
        return
      }

      // Clear first, then add all items
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => {
        media.forEach(item => {
          if (hasError) return

          const request = store.put(item) // Use put to handle duplicates
          request.onsuccess = () => {
            completed++
            if (completed === total && !hasError) {
              resolve()
            }
          }
          request.onerror = event => {
            hasError = true
            console.error('Failed to save media item:', item.id, event)
            reject(new Error(`Failed to save media item ${item.id}`))
          }
        })
      }
      clearRequest.onerror = () => {
        reject(new Error('Failed to clear IndexedDB store'))
      }
    })
  } catch (error) {
    console.error('IndexedDB not available:', error)
    throw error
  }
}

/**
 * Check if IndexedDB is available
 */
export const isIndexedDBAvailable = () => {
  return typeof indexedDB !== 'undefined'
}
