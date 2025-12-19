/**
 * Get display URL for media
 * Converts file:// paths to blob URLs for display
 */
import { getFileBlobURL } from '@/utils/fileStorage'

const blobUrlCache = new Map()

/**
 * Get display URL for a media item
 * Handles file:// paths (IndexedDB) and data URLs
 */
export const getMediaDisplayUrl = async (url, fallback = null) => {
  if (!url) return fallback

  // If it's already a data URL or http/https URL, return as-is
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If it's a file:// path (IndexedDB), convert to blob URL
  if (url.startsWith('file://')) {
    // Check cache first
    if (blobUrlCache.has(url)) {
      return blobUrlCache.get(url)
    }

    try {
      const blobUrl = await getFileBlobURL(url)
      if (blobUrl) {
        blobUrlCache.set(url, blobUrl)
        return blobUrl
      } else {
        console.warn('getFileBlobURL returned null for:', url)
        return fallback
      }
    } catch (error) {
      console.error('Error getting blob URL for file:', url, error)
      return fallback
    }
  }

  // Fallback for unknown formats
  return url || fallback
}

/**
 * Get display URL synchronously (returns placeholder for file:// paths)
 * Use this for initial render, then update with async version
 */
export const getMediaDisplayUrlSync = (url, fallback = null) => {
  if (!url) return fallback

  // If it's already a data URL or http/https URL, return as-is
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // For file:// paths, return fallback (placeholder) to avoid browser errors
  // The async version will convert it to a blob URL
  if (url.startsWith('file://')) {
    return fallback
  }

  return url || fallback
}

/**
 * Revoke a blob URL (cleanup)
 */
export const revokeMediaBlobUrl = url => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
    // Remove from cache
    for (const [key, value] of blobUrlCache.entries()) {
      if (value === url) {
        blobUrlCache.delete(key)
        break
      }
    }
  }
}
