/**
 * Auto-Delete Service
 * Handles automatic deletion of unselected media after 30 days
 * with recovery mechanism
 */

import { storage } from '@/utils/storage'

const DELETED_MEDIA_STORAGE_KEY = 'mazeloot_deleted_media'
const SELECTIONS_STORAGE_KEY = 'mazeloot_selections'

/**
 * Check and process auto-deletions
 * Should be called periodically (e.g., on app startup, daily)
 */
export const processAutoDeletions = () => {
  const deletedMedia = storage.get(DELETED_MEDIA_STORAGE_KEY) || []
  const now = new Date()

  // Find media that can no longer be recovered (past 30 days)
  const expired = deletedMedia.filter(media => {
    if (!media.canRecoverUntil) return false
    return new Date(media.canRecoverUntil) < now
  })

  // Find media that can still be recovered
  const recoverable = deletedMedia.filter(media => {
    if (!media.canRecoverUntil) return false
    return new Date(media.canRecoverUntil) >= now
  })

  // Update storage with only recoverable media
  storage.set(DELETED_MEDIA_STORAGE_KEY, recoverable)

  return {
    expired: expired.length,
    recoverable: recoverable.length,
  }
}

/**
 * Get count of media pending deletion for a selection
 */
export const getPendingDeletionCount = selectionId => {
  const deletedMedia = storage.get(DELETED_MEDIA_STORAGE_KEY) || []
  const now = new Date()

  return deletedMedia.filter(
    media => media.selectionId === selectionId && new Date(media.canRecoverUntil) >= now
  ).length
}

/**
 * Get count of media that can be recovered for a selection
 */
export const getRecoverableCount = selectionId => {
  const deletedMedia = storage.get(DELETED_MEDIA_STORAGE_KEY) || []
  const now = new Date()

  return deletedMedia.filter(
    media => media.selectionId === selectionId && new Date(media.canRecoverUntil) >= now
  ).length
}

/**
 * Get days remaining until permanent deletion
 */
export const getDaysUntilDeletion = selectionId => {
  const selections = storage.get(SELECTIONS_STORAGE_KEY) || []
  const selection = selections.find(s => s.id === selectionId)

  if (!selection || !selection.autoDeleteDate) {
    return null
  }

  const deleteDate = new Date(selection.autoDeleteDate)
  const now = new Date()
  const diffTime = deleteDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays > 0 ? diffDays : 0
}

/**
 * Initialize auto-delete service
 * Call this on app startup
 */
export const initializeAutoDeleteService = () => {
  // Process deletions on startup
  const result = processAutoDeletions()

  if (result.expired > 0) {
    console.log(`Auto-deleted ${result.expired} expired media items`)
  }

  // Set up periodic check (every 24 hours)
  if (typeof window !== 'undefined') {
    setInterval(
      () => {
        processAutoDeletions()
      },
      24 * 60 * 60 * 1000
    ) // 24 hours
  }

  return result
}
