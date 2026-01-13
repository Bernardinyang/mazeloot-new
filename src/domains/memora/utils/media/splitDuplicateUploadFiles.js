/**
 * Split files into duplicates and new files
 * Checks by filename (case-insensitive) and file size for better duplicate detection
 *
 * @param {File[]} files - Files to check
 * @param {Array} mediaItems - Existing media items to check against
 * @returns {{duplicates: Array, newFiles: File[]}}
 */
export const splitDuplicateUploadFiles = (files, mediaItems) => {
  const duplicates = []
  const newFiles = []

  for (const file of files) {
    const fileName = file.name.toLowerCase().trim()
    const fileSize = file.size

    // Find existing media that matches by filename AND size
    const existingMedia = mediaItems.find(m => {
      // Priority: filename (top-level) > file.filename (nested) > title > originalFilename
      const mediaFilename = (
        m.filename || // Top-level filename (from MediaResource)
        m.file?.filename || // Nested filename (from UserFileResource)
        m.title || // Fallback to title if it exists
        m.originalFilename || // Fallback to originalFilename if it exists
        ''
      )
        .toLowerCase()
        .trim()

      const mediaSize = m.size || m.file?.size || 0

      const filenameMatches =
        mediaFilename === fileName ||
        mediaFilename === fileName.replace(/\.[^/.]+$/, '') ||
        (mediaFilename &&
          fileName &&
          mediaFilename + file.name.substring(file.name.lastIndexOf('.')) === fileName)

      // Also check file size for more accurate duplicate detection
      // Files are considered duplicates if filename matches AND size matches (within 1% tolerance for rounding)
      const sizeMatches =
        mediaSize > 0 && Math.abs(mediaSize - fileSize) <= Math.max(1, fileSize * 0.01)

      // If filename matches and size matches (or size is not available), it's a duplicate
      return filenameMatches && (sizeMatches || mediaSize === 0)
    })

    if (existingMedia) {
      duplicates.push({ file, existingMedia })
    } else {
      newFiles.push(file)
    }
  }

  return { duplicates, newFiles }
}
