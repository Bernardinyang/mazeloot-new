/**
 * Get preview URL for media (low-resolution for viewing)
 * Uses thumb/medium variants to reduce screenshot value
 */

/**
 * Get preview URL for grid/list cards (thumb variant preferred)
 * @param {Object} item - Media item
 * @returns {string|null} Preview URL
 */
export const getMediaPreviewUrl = (item) => {
  if (!item) return null

  const mediaType = item.type || item.file?.type

  // For images, prefer variants in order: thumb -> medium -> large -> original
  if (mediaType === 'image') {
    if (item.file?.variants?.thumb) {
      return item.file.variants.thumb
    }
    if (item.file?.variants?.medium) {
      return item.file.variants.medium
    }
    if (item.file?.variants?.large) {
      return item.file.variants.large
    }
    // Fallback to thumbnailUrl or file.url
    return item.thumbnailUrl || item.file?.url || item.url
  }

  // For videos, use thumbnail
  if (mediaType === 'video') {
    if (item.file?.thumbnailUrl && item.file.thumbnailUrl !== item.file?.url) {
      return item.file.thumbnailUrl
    }
    if (item.file?.metadata?.thumbnail) {
      return item.file.metadata.thumbnail
    }
    return item.thumbnailUrl || null
  }

  // Fallback
  return item.thumbnailUrl || item.file?.url || item.url || null
}

/**
 * Get preview URL for lightbox/full view (medium variant preferred)
 * @param {Object} item - Media item
 * @returns {string|null} Preview URL
 */
export const getMediaLightboxPreviewUrl = (item) => {
  if (!item) return null

  const mediaType = item.type || item.file?.type

  // For images, prefer variants in order: medium -> large -> thumb -> original
  if (mediaType === 'image') {
    if (item.largeImageUrl) {
      // Check if largeImageUrl is actually a variant URL
      // If item has variants, prefer medium over largeImageUrl
      if (item.file?.variants?.medium) {
        return item.file.variants.medium
      }
      return item.largeImageUrl
    }
    if (item.file?.variants?.medium) {
      return item.file.variants.medium
    }
    if (item.file?.variants?.large) {
      return item.file.variants.large
    }
    if (item.file?.variants?.thumb) {
      return item.file.variants.thumb
    }
    return item.file?.url || item.url || null
  }

  // For videos, return video URL
  if (mediaType === 'video') {
    return item.file?.url || item.url || null
  }

  return item.file?.url || item.url || null
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
