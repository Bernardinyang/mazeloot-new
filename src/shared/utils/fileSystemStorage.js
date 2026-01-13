/**
 * File System Storage Utility
 * Stores files in a physical folder on the user's filesystem
 * Uses File System Access API (requires user permission)
 * Falls back to downloads folder if API not available
 */

const UPLOADS_FOLDER_NAME = 'mazeloot_uploads'
let uploadsDirectoryHandle = null
let uploadsDirectoryPath = null

/**
 * Check if File System Access API is available
 */
export const isFileSystemAccessAvailable = () => {
  return 'showDirectoryPicker' in window
}

/**
 * Request permission to access uploads folder
 * User will be prompted to select/create a folder
 */
export const requestUploadsFolder = async () => {
  try {
    if (!isFileSystemAccessAvailable()) {
      throw new Error('File System Access API is not available in this browser')
    }

    // Request user to select/create a folder
    const handle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents',
    })

    uploadsDirectoryHandle = handle
    uploadsDirectoryPath = handle.name

    // Save the folder path preference
    try {
      localStorage.setItem('mazeloot_uploads_folder', handle.name)
    } catch (e) {
      // Ignore localStorage errors
    }

    return {
      handle,
      path: handle.name,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Folder selection was cancelled')
    }
    throw error
  }
}

/**
 * Get or create uploads folder
 * Will prompt user to select a folder if not already selected
 */
export const getUploadsFolder = async () => {
  if (uploadsDirectoryHandle) {
    return {
      handle: uploadsDirectoryHandle,
      path: uploadsDirectoryPath || UPLOADS_FOLDER_NAME,
    }
  }

  // Request folder selection from user
  // This will show a folder picker dialog
  return await requestUploadsFolder()
}

/**
 * Generate a unique file ID
 */
const generateFileId = () => {
  return `file_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Store a file in the uploads folder and return its path
 */
export const storeFile = async (file, options = {}) => {
  try {
    const folder = await getUploadsFolder()
    const fileId = options.id || generateFileId()
    const fileExtension = file.name.split('.').pop() || 'bin'
    const fileName = options.filename || `${fileId}.${fileExtension}`

    const dirHandle = folder.handle || folder

    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true })
    const writable = await fileHandle.createWritable()

    // Write the file
    await writable.write(file)
    await writable.close()

    const filePath = `${UPLOADS_FOLDER_NAME}/${fileName}`

    return filePath
  } catch (error) {
    throw error
  }
}

/**
 * Store a blob in the uploads folder
 */
export const storeBlob = async (blob, filename, options = {}) => {
  try {
    const folder = await getUploadsFolder()
    const fileId = options.id || generateFileId()
    const fileName = filename || `file_${fileId}.bin`

    const dirHandle = folder.handle || folder

    const fileHandle = await dirHandle.getFileHandle(fileName, { create: true })
    const writable = await fileHandle.createWritable()

    // Write the blob
    await writable.write(blob)
    await writable.close()

    const filePath = `${UPLOADS_FOLDER_NAME}/${fileName}`

    return filePath
  } catch (error) {
    throw error
  }
}

/**
 * Get a file from the uploads folder
 */
export const getFile = async filePath => {
  try {
    const folder = await getUploadsFolder()
    const dirHandle = folder.handle || folder

    // Extract filename from path
    const fileName = filePath.split('/').pop() || filePath

    const fileHandle = await dirHandle.getFileHandle(fileName)

    const file = await fileHandle.getFile()

    return file
  } catch (error) {
    throw error
  }
}

/**
 * Get a blob URL for a file (for use in img src, etc.)
 */
export const getFileBlobURL = async filePath => {
  try {
    const file = await getFile(filePath)
    return URL.createObjectURL(file)
  } catch (error) {
    throw error
  }
}

/**
 * Delete a file from the uploads folder
 */
export const deleteFile = async filePath => {
  try {
    const folder = await getUploadsFolder()
    const dirHandle = folder.handle || folder

    // Extract filename from path
    const fileName = filePath.split('/').pop() || filePath

    // Remove the file
    await dirHandle.removeEntry(fileName)
  } catch (error) {
    throw error
  }
}

/**
 * Get the uploads folder path
 */
export const getUploadsFolderPath = () => {
  return uploadsDirectoryPath || UPLOADS_FOLDER_NAME
}

/**
 * List all files in the uploads folder
 */
export const listStoredFiles = async () => {
  try {
    const folder = await getUploadsFolder()
    const dirHandle = folder.handle || folder

    const files = []
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile()
        files.push({
          name: entry.name,
          path: `${UPLOADS_FOLDER_NAME}/${entry.name}`,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        })
      }
    }

    return files
  } catch (error) {
    throw error
  }
}
