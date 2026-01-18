import { RAW_FILE_MEDIA_TYPES } from './rawFileMediaTypes'

export const VALID_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'application/x-rar-compressed',
  'application/x-rar',
  'application/x-7z-compressed',
  'application/x-tar',
  'application/gzip',
  'application/x-gzip',
  'application/x-compress',
  'application/x-compressed',
]

export const filterValidUploadFiles = (files, contextType = null) => {
  // For raw files, use media/camera file types
  if (contextType === 'rawFile') {
    return files.filter(file => file.type && RAW_FILE_MEDIA_TYPES.includes(file.type))
  }
  
  // For other contexts, filter by allowed types
  return files.filter(file => VALID_UPLOAD_MIME_TYPES.includes(file.type))
}
