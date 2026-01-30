/**
 * Get preview URL for media (low-resolution for viewing)
 * Uses thumb/medium variants to reduce screenshot value
 */

/**
 * Get preview URL for grid/list cards (thumb variant preferred).
 * Never returns original; originals are for download only.
 * @param {Object} item - Media item
 * @returns {string|null} Preview URL
 */
export const getMediaPreviewUrl = (item) => {
  if (!item) return null

  const mediaType = item.type || item.file?.type

  if (mediaType === 'image') {
    if (item.file?.variants?.thumb) return item.file.variants.thumb
    if (item.file?.variants?.medium) return item.file.variants.medium
    if (item.file?.variants?.large) return item.file.variants.large
    return item.thumbnailUrl || item.largeImageUrl || null
  }

  if (mediaType === 'video') {
    if (item.file?.thumbnailUrl && item.file.thumbnailUrl !== item.file?.url) return item.file.thumbnailUrl
    if (item.file?.metadata?.thumbnail) return item.file.metadata.thumbnail
    return item.thumbnailUrl || null
  }

  return item.thumbnailUrl || item.largeImageUrl || null
}

/**
 * Get preview URL for lightbox/full view (medium variant preferred).
 * Never returns original for images; originals are for download only.
 * @param {Object} item - Media item
 * @returns {string|null} Preview URL
 */
export const getMediaLightboxPreviewUrl = (item) => {
  if (!item) return null

  const mediaType = item.type || item.file?.type

  if (mediaType === 'image') {
    if (item.file?.variants?.medium) return item.file.variants.medium
    if (item.file?.variants?.large) return item.file.variants.large
    if (item.file?.variants?.thumb) return item.file.variants.thumb
    if (item.largeImageUrl) return item.largeImageUrl
    return item.thumbnailUrl || null
  }

  if (mediaType === 'video') {
    return item.file?.url || item.url || null
  }

  return item.thumbnailUrl || item.largeImageUrl || null
}

/**
 * Get download URL for media (full-quality original)
 * @param {Object} item - Media item
 * @returns {string|null} Download URL
 */
export const getMediaDownloadUrl = (item) => {
  if (!item) return null

  const mediaType = item.type || item.file?.type

  // For images, prefer: original -> large -> file.url
  if (mediaType === 'image') {
    if (item.file?.variants?.original) {
      return item.file.variants.original
    }
    if (item.file?.variants?.large) {
      return item.file.variants.large
    }
    // Fallback to file.url or url
    return item.file?.url || item.url || null
  }

  // For videos, return video URL
  if (mediaType === 'video') {
    return item.file?.url || item.url || null
  }

  return item.file?.url || item.url || null
}
