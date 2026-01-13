export const VALID_UPLOAD_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
]

export const filterValidUploadFiles = files => {
  return files.filter(file => VALID_UPLOAD_MIME_TYPES.includes(file.type))
}
