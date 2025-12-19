/**
 * Media API composable
 * Handles all media-related API calls for collections
 * Uses localStorage for persistence until backend is ready
 * Falls back to IndexedDB when localStorage quota is exceeded
 */

import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'
import {
  getMediaFromIndexedDB,
  saveMediaToIndexedDB,
  isIndexedDBAvailable,
} from '@/utils/indexedDB'

const MEDIA_STORAGE_KEY = 'mazeloot_media'
const USE_INDEXED_DB_KEY = 'mazeloot_use_indexeddb'
let useIndexedDB = false

// Check if we should use IndexedDB (persisted preference)
const checkIndexedDBPreference = () => {
  const preference = storage.get(USE_INDEXED_DB_KEY)
  return preference === true
}

// Set IndexedDB preference
const setIndexedDBPreference = value => {
  try {
    storage.set(USE_INDEXED_DB_KEY, value)
  } catch {
    // Ignore errors when setting preference
  }
}

// Initialize useIndexedDB from preference
useIndexedDB = checkIndexedDBPreference()

/**
 * Generate unique image URLs
 */
const getImageUrl = index => {
  const photoIds = [
    '1519741497674-611481863552',
    '1516589178581-6cd7833ae3b2',
    '1511285560929-80b456fea0bc',
    '1521119989659-a83eee488004',
    '1475721027785-f74eccf877e2',
    '1511578314322-379afb476865',
    '1494790008762-728dbb2e86b0',
    '1500648767791-00dcc994a43e',
    '1505373877841-8d25f7d46678',
    '1478147427282-58a87a120781',
    '1515934751635-c81c6bc9a2d8',
    '1522673607200-164d1b6ce486',
    '1519225421980-715cb0215aed',
    '1465495976277-4387d4b0b4c6',
    '1506794778202-cad84cf45f1d',
    '1534528741775-53994a69daeb',
    '1492684223066-81342ee5ff30',
    '1507003211169-0a1dd7228f2d',
    '1509316785289-025f5b846b35',
    '1488426862026-3ee34c7d66df',
    '1508214751196-bcfd4ca60f91',
    '1539571696357-5a69c17a67c6',
  ]
  const id = photoIds[index % photoIds.length]
  return `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop`
}

/**
 * Initialize mock media data
 */
const initializeMockMedia = () => {
  const stored = storage.get(MEDIA_STORAGE_KEY)
  if (stored && stored.length > 0) {
    return stored
  }

  // Return empty array - no default images
  return []
}

/**
 * Get all media items
 */
const getAllMedia = async () => {
  // If using IndexedDB, read from there
  if (useIndexedDB && isIndexedDBAvailable()) {
    try {
      const indexedMedia = await getMediaFromIndexedDB()
      if (indexedMedia && indexedMedia.length > 0) {
        return indexedMedia
      }
    } catch (error) {
      console.error('Failed to read from IndexedDB:', error)
      // Fall back to localStorage if IndexedDB fails
    }
  }

  // Try localStorage
  const stored = storage.get(MEDIA_STORAGE_KEY)
  if (stored && stored.length > 0) {
    return stored
  }

  return initializeMockMedia()
}

/**
 * Get all media items synchronously (for backward compatibility)
 * This will use localStorage only
 */
const getAllMediaSync = () => {
  const stored = storage.get(MEDIA_STORAGE_KEY)
  if (stored && stored.length > 0) {
    return stored
  }
  return initializeMockMedia()
}

/**
 * Save media to storage
 * Handles quota exceeded errors gracefully by falling back to IndexedDB
 */
const saveMedia = async media => {
  // Try localStorage first (if not already using IndexedDB)
  if (!useIndexedDB) {
    try {
      storage.set(MEDIA_STORAGE_KEY, media)
      return
    } catch (error) {
      // Check for quota exceeded error in multiple ways
      const isQuotaError =
        error?.name === 'QuotaExceededError' ||
        error?.code === 22 ||
        error?.message?.includes('quota exceeded') ||
        error?.message?.includes('QuotaExceededError') ||
        error?.toString()?.includes('quota') ||
        error?.toString()?.includes('QuotaExceededError') ||
        error?.originalError?.name === 'QuotaExceededError'

      if (isQuotaError) {
        console.warn(
          'localStorage quota exceeded. Switching to IndexedDB for media storage...',
          error
        )

        if (isIndexedDBAvailable()) {
          useIndexedDB = true
          setIndexedDBPreference(true) // Persist preference
          try {
            // Get existing data from localStorage before it's lost
            const existing = getAllMediaSync()
            const allMediaToSave = [...existing, ...media]

            // Remove duplicates based on id
            const uniqueMedia = allMediaToSave.reduce((acc, item) => {
              if (!acc.find(m => m.id === item.id)) {
                acc.push(item)
              }
              return acc
            }, [])

            // Save all media to IndexedDB
            await saveMediaToIndexedDB(uniqueMedia)
            console.log('Successfully migrated to IndexedDB')
            return
          } catch (indexedError) {
            console.error('Failed to save to IndexedDB:', indexedError)
            throw new Error(
              'Storage quota exceeded and IndexedDB save failed. Please clear some data.'
            )
          }
        } else {
          throw new Error(
            'Storage quota exceeded and IndexedDB is not available. Please clear some data or reduce file sizes.'
          )
        }
      }
      // Re-throw other errors
      throw error
    }
  }

  // If using IndexedDB, save there
  if (useIndexedDB && isIndexedDBAvailable()) {
    try {
      await saveMediaToIndexedDB(media)
    } catch (error) {
      console.error('Failed to save media to IndexedDB:', error)
      throw error
    }
  }
}

export function useMediaApi() {
  /**
   * Fetch media for a collection
   */
  const fetchCollectionMedia = async (collectionId, setId) => {
    await delay(300)

    const allMedia = await getAllMedia()
    let collectionMedia = allMedia.filter(m => m.collectionId === collectionId)

    // Filter by set if provided
    if (setId) {
      collectionMedia = collectionMedia.filter(m => m.setId === setId)
    }

    collectionMedia.sort((a, b) => (a.order || 0) - (b.order || 0))

    return collectionMedia
  }

  /**
   * Helper to extract plain value from Vue ref/computed
   */
  const unwrapValue = value => {
    if (value === null || value === undefined) return value
    if (typeof value === 'object' && 'value' in value) return value.value
    if (typeof value === 'function') return value()
    return value
  }

  /**
   * Add media to collection
   */
  const addMedia = async (collectionId, mediaData) => {
    await delay(300)

    // Ensure mediaData is a plain object (not a Vue ref/computed)
    // Extract all values to avoid circular references
    const allMedia = await getAllMedia()
    const newMedia = {
      id: generateUUID(),
      collectionId: collectionId || null,
      phase: unwrapValue(mediaData?.phase) || 'collection',
      phaseId: unwrapValue(mediaData?.phaseId) || collectionId,
      projectId: unwrapValue(mediaData?.projectId) || null,
      setId: unwrapValue(mediaData?.setId) || null,
      url: unwrapValue(mediaData?.url) || '',
      thumbnail: unwrapValue(mediaData?.thumbnail) || null,
      type: unwrapValue(mediaData?.type) || 'image',
      title: unwrapValue(mediaData?.title) || '',
      description: unwrapValue(mediaData?.description) || '',
      order: unwrapValue(mediaData?.order) || 0,
      // Phase-specific fields
      isSelected: unwrapValue(mediaData?.isSelected) || false,
      selectedAt: unwrapValue(mediaData?.selectedAt) || null,
      revisionNumber: unwrapValue(mediaData?.revisionNumber) || null,
      isCompleted: unwrapValue(mediaData?.isCompleted) || false,
      originalMediaId: unwrapValue(mediaData?.originalMediaId) || null,
      lowResCopyUrl: unwrapValue(mediaData?.lowResCopyUrl) || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    allMedia.push(newMedia)

    try {
      await saveMedia(allMedia)
    } catch (error) {
      console.error('Failed to save media:', error)
      // Remove from array if save failed
      allMedia.pop()
      throw new Error(`Failed to save media: ${error.message}`)
    }

    return newMedia
  }

  /**
   * Update media
   */
  const updateMedia = async (mediaId, updates) => {
    await delay(300)

    const allMedia = await getAllMedia()
    const index = allMedia.findIndex(m => m.id === mediaId)
    if (index === -1) {
      throw new Error('Media not found')
    }

    // Unwrap any Vue refs/computed from updates to avoid circular references
    const plainUpdates = {}
    for (const key in updates) {
      plainUpdates[key] = unwrapValue(updates[key])
    }

    allMedia[index] = {
      ...allMedia[index],
      ...plainUpdates,
      updatedAt: new Date().toISOString(),
    }
    await saveMedia(allMedia)
    return allMedia[index]
  }

  /**
   * Delete media
   */
  const deleteMedia = async mediaId => {
    await delay(300)

    const allMedia = await getAllMedia()
    const filtered = allMedia.filter(m => m.id !== mediaId)
    await saveMedia(filtered)
  }

  /**
   * Fetch media for a specific phase
   */
  const fetchPhaseMedia = async (phaseType, phaseId, setId) => {
    await delay(300)

    const allMedia = await getAllMedia()
    let phaseMedia = allMedia.filter(m => m.phase === phaseType && m.phaseId === phaseId)

    // Filter by set if provided
    if (setId) {
      phaseMedia = phaseMedia.filter(m => m.setId === setId)
    }

    phaseMedia.sort((a, b) => (a.order || 0) - (b.order || 0))

    return phaseMedia
  }

  /**
   * Move media between phases
   */
  const moveMediaBetweenPhases = async (mediaIds, fromPhase, toPhase, toPhaseId) => {
    await delay(500)

    const allMedia = await getAllMedia()

    mediaIds.forEach(mediaId => {
      const index = allMedia.findIndex(m => m.id === mediaId)
      if (index !== -1 && allMedia[index].phase === fromPhase) {
        allMedia[index] = {
          ...allMedia[index],
          phase: toPhase,
          phaseId: toPhaseId,
          updatedAt: new Date().toISOString(),
        }
        // Update collectionId for backward compatibility if moving to collection
        if (toPhase === 'collection') {
          allMedia[index].collectionId = toPhaseId
        }
      }
    })

    await saveMedia(allMedia)
    return allMedia.filter(m => mediaIds.includes(m.id))
  }

  /**
   * Create low-res copy of media (for proofing reference)
   */
  const createLowResCopy = async mediaId => {
    await delay(500)

    const allMedia = await getAllMedia()
    const media = allMedia.find(m => m.id === mediaId)

    if (!media) {
      throw new Error('Media not found')
    }

    // Create low-res copy using thumbnail
    const lowResCopy = {
      ...media,
      id: generateUUID(),
      lowResCopyUrl: media.thumbnail || media.url,
      isLowResCopy: true,
      url: media.thumbnail || media.url, // Use thumbnail as main URL for low-res
    }

    allMedia.push(lowResCopy)
    await saveMedia(allMedia)

    return lowResCopy
  }

  /**
   * Mark media as selected (for selection phase)
   */
  const markMediaSelected = async mediaId => {
    await delay(300)

    const allMedia = await getAllMedia()
    const index = allMedia.findIndex(m => m.id === mediaId)

    if (index === -1) {
      throw new Error('Media not found')
    }

    allMedia[index] = {
      ...allMedia[index],
      isSelected: true,
      selectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await saveMedia(allMedia)
    return allMedia[index]
  }

  /**
   * Get all revisions for a media item
   */
  const getMediaRevisions = async mediaId => {
    await delay(300)

    const allMedia = await getAllMedia()
    const media = allMedia.find(m => m.id === mediaId)

    if (!media) {
      throw new Error('Media not found')
    }

    // Find all revisions of this media (by originalMediaId or same originalMediaId)
    const originalId = media.originalMediaId || media.id
    const revisions = allMedia.filter(
      m => (m.originalMediaId === originalId || m.id === originalId) && m.phase === 'proofing'
    )

    return revisions.sort((a, b) => (a.revisionNumber || 0) - (b.revisionNumber || 0))
  }

  /**
   * Toggle star status
   */
  const toggleStar = async (id, isStarred) => {
    await delay(300)

    const allMedia = await getAllMedia()
    const index = allMedia.findIndex(m => m.id === id)

    if (index !== -1) {
      allMedia[index].isStarred = isStarred
      allMedia[index].starred = isStarred
      await saveMedia(allMedia)
    }
  }

  return {
    fetchCollectionMedia,
    addMedia,
    updateMedia,
    deleteMedia,
    fetchPhaseMedia,
    moveMediaBetweenPhases,
    createLowResCopy,
    markMediaSelected,
    getMediaRevisions,
    toggleStar,
  }
}
