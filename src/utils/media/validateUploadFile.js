/**
 * File validation utilities for uploads
 */

import { VALID_UPLOAD_MIME_TYPES } from './filterValidUploadFiles'

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes (default: 10MB)
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFileSize = (file, maxSize = 10 * 1024 * 1024) => {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum size of ${maxSizeMB}MB`,
    }
  }
  return { valid: true }
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types (default: VALID_UPLOAD_MIME_TYPES)
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFileType = (file, allowedTypes = VALID_UPLOAD_MIME_TYPES) => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File "${file.name}" has unsupported type: ${file.type}`,
    }
  }
  return { valid: true }
}

/**
 * Validate image dimensions
 * @param {File} file - Image file to validate
 * @param {object} options - Dimension constraints
 * @param {number} options.minWidth - Minimum width in pixels
 * @param {number} options.minHeight - Minimum height in pixels
 * @param {number} options.maxWidth - Maximum width in pixels
 * @param {number} options.maxHeight - Maximum height in pixels
 * @returns {Promise<{ valid: boolean, error?: string, width?: number, height?: number }>}
 */
export const validateImageDimensions = async (
  file,
  { minWidth, minHeight, maxWidth, maxHeight } = {}
) => {
  if (!file.type.startsWith('image/')) {
    return { valid: true } // Not an image, skip dimension validation
  }

  return new Promise(resolve => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const { width, height } = img

      const errors = []

      if (minWidth && width < minWidth) {
        errors.push(`width must be at least ${minWidth}px (got ${width}px)`)
      }
      if (minHeight && height < minHeight) {
        errors.push(`height must be at least ${minHeight}px (got ${height}px)`)
      }
      if (maxWidth && width > maxWidth) {
        errors.push(`width must be at most ${maxWidth}px (got ${width}px)`)
      }
      if (maxHeight && height > maxHeight) {
        errors.push(`height must be at most ${maxHeight}px (got ${height}px)`)
      }

      if (errors.length > 0) {
        resolve({
          valid: false,
          error: `Image "${file.name}" dimensions invalid: ${errors.join(', ')}`,
          width,
          height,
        })
      } else {
        resolve({ valid: true, width, height })
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        valid: false,
        error: `Failed to load image "${file.name}" for dimension validation`,
      })
    }

    img.src = objectUrl
  })
}

/**
 * Check for duplicate filename in existing media
 * @param {string} filename - Filename to check
 * @param {Array} existingMedia - Array of existing media items
 * @returns {{ isDuplicate: boolean, existingMedia?: object }}
 */
export const checkDuplicateFilename = (filename, existingMedia = []) => {
  const fileNameLower = filename.toLowerCase()
  const fileNameWithoutExt = fileNameLower.replace(/\.[^/.]+$/, '')

  const existing = existingMedia.find(m => {
    const mediaFilename = (m.filename || m.title || '').toLowerCase()
    const mediaFilenameWithoutExt = mediaFilename.replace(/\.[^/.]+$/, '')

    return (
      mediaFilename === fileNameLower ||
      mediaFilenameWithoutExt === fileNameWithoutExt ||
      mediaFilename === fileNameWithoutExt ||
      mediaFilenameWithoutExt === fileNameLower
    )
  })

  return {
    isDuplicate: !!existing,
    existingMedia: existing || undefined,
  }
}

/**
 * Validate a file with all checks
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @param {number} options.maxSize - Maximum file size in bytes
 * @param {string[]} options.allowedTypes - Allowed MIME types
 * @param {object} options.dimensions - Image dimension constraints
 * @param {Array} options.existingMedia - Existing media items for duplicate check
 * @returns {Promise<{ valid: boolean, errors: string[], width?: number, height?: number }>}
 */
export const validateUploadFile = async (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = VALID_UPLOAD_MIME_TYPES,
    dimensions = {},
    existingMedia = [],
  } = options

  const errors = []

  // Size validation
  const sizeCheck = validateFileSize(file, maxSize)
  if (!sizeCheck.valid) {
    errors.push(sizeCheck.error)
  }

  // Type validation
  const typeCheck = validateFileType(file, allowedTypes)
  if (!typeCheck.valid) {
    errors.push(typeCheck.error)
  }

  // Dimension validation (for images)
  let width = null
  let height = null
  if (file.type.startsWith('image/') && Object.keys(dimensions).length > 0) {
    const dimensionCheck = await validateImageDimensions(file, dimensions)
    if (!dimensionCheck.valid) {
      errors.push(dimensionCheck.error)
    } else {
      width = dimensionCheck.width
      height = dimensionCheck.height
    }
  }

  // Duplicate check
  const duplicateCheck = checkDuplicateFilename(file.name, existingMedia)
  if (duplicateCheck.isDuplicate) {
    errors.push(`File "${file.name}" already exists in this set`)
  }

  return {
    valid: errors.length === 0,
    errors,
    width,
    height,
    isDuplicate: duplicateCheck.isDuplicate,
    existingMedia: duplicateCheck.existingMedia,
  }
}
