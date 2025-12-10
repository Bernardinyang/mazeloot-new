/**
 * File upload composable
 * Handles file uploads with validation and progress tracking
 */

import { ref } from 'vue'

export interface UploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  multiple?: boolean
}

export interface UploadFile {
  file: File
  preview?: string
  progress: number
  error?: string
}

export function useUploader(options: UploadOptions = {}) {
  const files = ref<UploadFile[]>([])
  const isUploading = ref(false)
  const error = ref<string | null>(null)

  const defaultOptions: Required<UploadOptions> = {
    maxSize: 10 * 1024 * 1024, // 10MB default
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    multiple: false,
  }

  const config = { ...defaultOptions, ...options }

  /**
   * Validate file
   */
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > config.maxSize) {
      return `File size exceeds ${config.maxSize / (1024 * 1024)}MB limit`
    }

    // Check file type
    if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`
    }

    return null
  }

  /**
   * Add files
   */
  const addFiles = (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList)
    error.value = null

    fileArray.forEach(file => {
      const validationError = validateFile(file)

      if (validationError) {
        error.value = validationError
        return
      }

      // Create preview for images
      let preview: string | undefined
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file)
      }

      const uploadFile: UploadFile = {
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
  const removeFile = (index: number) => {
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
  const upload = async (onUpload?: (file: File) => Promise<string>): Promise<string[]> => {
    if (files.value.length === 0) {
      throw new Error('No files to upload')
    }

    isUploading.value = true
    error.value = null

    try {
      const uploadPromises = files.value.map(async (uploadFile, _index) => {
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
    } catch (err: any) {
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
