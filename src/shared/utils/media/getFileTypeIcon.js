/**
 * Get file type icon component based on MIME type or filename
 * @param {string} mimeType - MIME type of the file
 * @param {string} filename - Filename (optional, used as fallback)
 * @returns {string} Icon component name from lucide-vue-next
 */
export function getFileTypeIcon(mimeType, filename = '') {
  if (!mimeType && !filename) return 'File'

  const mime = (mimeType || '').toLowerCase()
  const ext = filename ? filename.split('.').pop()?.toLowerCase() : ''

  // Camera Raw Formats
  if (
    mime.includes('cr2') ||
    mime.includes('crw') ||
    mime.includes('nef') ||
    mime.includes('nrw') ||
    mime.includes('arw') ||
    mime.includes('sr2') ||
    mime.includes('srf') ||
    mime.includes('raf') ||
    mime.includes('rw2') ||
    mime.includes('rwl') ||
    mime.includes('orf') ||
    mime.includes('pef') ||
    mime.includes('dng') ||
    mime.includes('3fr') ||
    mime.includes('raw') ||
    ['cr2', 'crw', 'nef', 'nrw', 'arw', 'sr2', 'srf', 'raf', 'rw2', 'rwl', 'orf', 'pef', 'dng', '3fr', 'raw'].includes(ext)
  ) {
    return 'Camera'
  }

  // Images
  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'heic', 'heif', 'svg'].includes(ext)) {
    return 'Image'
  }

  // Videos
  if (
    mime.startsWith('video/') ||
    ['mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', 'm4v', '3gp', '3g2', 'mts', 'm2ts', 'mod', 'tod', 'mxf', 'avchd', 'dv', 'ts', 'trp', 'mpg', 'mpeg'].includes(ext)
  ) {
    return 'Video'
  }

  // Audio
  if (
    mime.startsWith('audio/') ||
    ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg', 'amr', 'aiff', 'wma', 'opus', 'au'].includes(ext)
  ) {
    return 'Music'
  }

  // Documents
  if (
    mime.includes('pdf') ||
    mime.includes('document') ||
    mime.includes('word') ||
    mime.includes('excel') ||
    mime.includes('powerpoint') ||
    mime.includes('text') ||
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'].includes(ext)
  ) {
    return 'FileText'
  }

  // Archives
  if (
    mime.includes('zip') ||
    mime.includes('rar') ||
    mime.includes('7z') ||
    mime.includes('tar') ||
    mime.includes('gzip') ||
    ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)
  ) {
    return 'Archive'
  }

  // Default
  return 'File'
}

/**
 * Get file type category for styling
 * @param {string} mimeType - MIME type of the file
 * @param {string} filename - Filename (optional)
 * @returns {string} Category: 'image', 'video', 'audio', 'document', 'archive', 'raw', 'other'
 */
export function getFileTypeCategory(mimeType, filename = '') {
  if (!mimeType && !filename) return 'other'

  const mime = (mimeType || '').toLowerCase()
  const ext = filename ? filename.split('.').pop()?.toLowerCase() : ''

  // Camera Raw Formats
  if (
    mime.includes('cr2') ||
    mime.includes('crw') ||
    mime.includes('nef') ||
    mime.includes('nrw') ||
    mime.includes('arw') ||
    mime.includes('sr2') ||
    mime.includes('srf') ||
    mime.includes('raf') ||
    mime.includes('rw2') ||
    mime.includes('rwl') ||
    mime.includes('orf') ||
    mime.includes('pef') ||
    mime.includes('dng') ||
    mime.includes('3fr') ||
    mime.includes('raw') ||
    ['cr2', 'crw', 'nef', 'nrw', 'arw', 'sr2', 'srf', 'raf', 'rw2', 'rwl', 'orf', 'pef', 'dng', '3fr', 'raw'].includes(ext)
  ) {
    return 'raw'
  }

  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'heic', 'heif', 'svg'].includes(ext)) {
    return 'image'
  }

  if (
    mime.startsWith('video/') ||
    ['mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', 'm4v', '3gp', '3g2', 'mts', 'm2ts', 'mod', 'tod', 'mxf', 'avchd', 'dv', 'ts', 'trp', 'mpg', 'mpeg'].includes(ext)
  ) {
    return 'video'
  }

  if (
    mime.startsWith('audio/') ||
    ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg', 'amr', 'aiff', 'wma', 'opus', 'au'].includes(ext)
  ) {
    return 'audio'
  }

  if (
    mime.includes('pdf') ||
    mime.includes('document') ||
    mime.includes('word') ||
    mime.includes('excel') ||
    mime.includes('powerpoint') ||
    mime.includes('text') ||
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'].includes(ext)
  ) {
    return 'document'
  }

  if (
    mime.includes('zip') ||
    mime.includes('rar') ||
    mime.includes('7z') ||
    mime.includes('tar') ||
    mime.includes('gzip') ||
    ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)
  ) {
    return 'archive'
  }

  return 'other'
}
