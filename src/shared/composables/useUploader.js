/**
 * File upload composable
 * Handles file uploads with validation and progress tracking
 */

import { ref } from 'vue'

export function useUploader(options = {}) {
  const files = ref([])
  const isUploading = ref(false)
  const error = ref(null)

  const defaultOptions = {
    maxSize: 10 * 1024 * 1024, // 10MB default
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    multiple: false,
  }

  const config = { ...defaultOptions, ...options }

  /**
   * Validate file
   */
  const validateFile = file => {
    if (file.size > config.maxSize) {
      return `File size exceeds ${config.maxSize / (1024 * 1024)}MB limit`
    }

    if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`
    }

    return null
  }

  /**
   * Add files
   */
  const addFiles = fileList => {
    const fileArray = Array.from(fileList)
    error.value = null

    fileArray.forEach(file => {
      const validationError = validateFile(file)

      if (validationError) {
        error.value = validationError
        return
      }

      let preview
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file)
      }

      const uploadFile = {
        file,
        preview,
        progress: 0,
      }

      if (config.multiple) {
        files.value.push(uploadFile)
      } else {
        // Clear existing files if single file mode
        files.value.forEach(f => {
          if (f.preview) {
            URL.revokeObjectURL(f.preview)
          }
        })
        files.value = [uploadFile]
      }
    })
  }

  /**
   * Remove file
   */
  const removeFile = index => {
    const file = files.value[index]
    if (file?.preview) {
      URL.revokeObjectURL(file.preview)
    }
    files.value.splice(index, 1)
  }

  /**
   * Clear all files
   */
  const clearFiles = () => {
    files.value.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    files.value = []
    error.value = null
  }

  /**
   * Upload files (mock implementation - replace with actual API call)
   */
  const upload = async onUpload => {
    if (files.value.length === 0) {
      throw new Error('No files to upload')
    }

    isUploading.value = true
    error.value = null

    try {
      const uploadPromises = files.value.map(async uploadFile => {
        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          uploadFile.progress = i
          await new Promise(resolve => setTimeout(resolve, 50))
        }

        if (onUpload) {
          return await onUpload(uploadFile.file)
        }

        // Mock upload
        return URL.createObjectURL(uploadFile.file)
      })

      const urls = await Promise.all(uploadPromises)
      return urls
    } catch (err) {
      error.value = err.message || 'Upload failed'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  return {
    files,
    isUploading,
    error,
    addFiles,
    removeFile,
    clearFiles,
    upload,
  }
}
