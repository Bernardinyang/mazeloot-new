/**
 * Generate Low-Res Copy Utility
 * Creates low-resolution copies of media for proofing reference
 */

/**
 * Generate a low-res copy URL from a media item
 * In production, this would upload to server and return URL
 * For now, uses thumbnail or creates a data URL
 */
export const generateLowResCopy = async (mediaItem, maxWidth = 800, maxHeight = 600) => {
  // If thumbnail exists and is smaller, use it
  if (mediaItem.thumbnail) {
    return mediaItem.thumbnail
  }

  // For images, create a low-res version
  if (mediaItem.type === 'image' && mediaItem.url) {
    try {
      // In production, this would:
      // 1. Fetch the image
      // 2. Create a canvas
      // 3. Resize to maxWidth x maxHeight
      // 4. Convert to blob/data URL
      // 5. Upload to server
      // 6. Return the URL

      // For now, return a placeholder or the original URL
      // In a real implementation, you'd use canvas to resize:
      /*
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = mediaItem.url
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Calculate dimensions
          let width = img.width
          let height = img.height
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          // Convert to data URL or blob
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve(dataUrl)
        }
        img.onerror = reject
      })
      */

      // For now, return thumbnail or a modified URL
      return mediaItem.url
    } catch (error) {
      console.error('Failed to generate low-res copy:', error)
      return mediaItem.thumbnail || mediaItem.url
    }
  }

  // For videos, return thumbnail if available
  if (mediaItem.type === 'video') {
    return mediaItem.thumbnail || mediaItem.url
  }

  // Fallback
  return mediaItem.url
}

/**
 * Generate low-res copy and return media object
 */
export const createLowResMediaItem = async (originalMedia, maxWidth = 800, maxHeight = 600) => {
  const lowResUrl = await generateLowResCopy(originalMedia, maxWidth, maxHeight)

  return {
    ...originalMedia,
    id: `${originalMedia.id}-lowres`,
    url: lowResUrl,
    thumbnail: lowResUrl,
    isLowResCopy: true,
    originalMediaId: originalMedia.id,
  }
}
