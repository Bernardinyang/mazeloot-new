import { ref } from 'vue'
import { toast } from 'vue-sonner'

import { fileToDataURL } from '@/utils/fileToDataURL'
import { applyWatermarkToImage } from '@/utils/watermark/applyWatermarkToImage'
import { createThumbnail } from '@/utils/media/createThumbnail'
import { splitDuplicateUploadFiles } from '@/utils/media/splitDuplicateUploadFiles'
import { filterValidUploadFiles } from '@/utils/media/filterValidUploadFiles'
import { getFileBaseName } from '@/utils/media/getFileBaseName'

export function useMediaUploadFlow({
  collection,
  selectedSetId,
  mediaItems,
  selectedWatermark,
  watermarkStore,
  mediaApi,
  updateSetCounts,
  isDragging,
  description,
} = {}) {
  const isUploading = ref(false)

  const showDuplicateFilesModal = ref(false)
  const duplicateFiles = ref([])
  const filesToUpload = ref([])
  const duplicateFileActions = ref(new Map())

  const processFiles = async files => {
    if (!collection.value) {
      toast.error('No set selected', {
        description,
      })
      return
    }
    if (!selectedSetId?.value) {
      toast.error('No set selected', { description })
      return
    }

    // Filter valid image/video files
    const validFiles = filterValidUploadFiles(files)

    if (validFiles.length === 0) {
      toast.error('Invalid files', {
        description,
      })
      return
    }

    // Check for duplicate file names in the current set
    const { duplicates, newFiles } = splitDuplicateUploadFiles(validFiles, mediaItems.value)

    // If there are duplicates, show modal to ask user what to do
    if (duplicates.length > 0) {
      duplicateFiles.value = duplicates
      filesToUpload.value = newFiles
      duplicateFileActions.value = new Map()
      // Default action
      duplicates.forEach(({ file }) => {
        duplicateFileActions.value.set(file.name, 'skip')
      })
      showDuplicateFilesModal.value = true
      return
    }

    // No duplicates, proceed with upload
    await uploadFiles(validFiles)
  }

  const handleConfirmDuplicateFiles = async () => {
    showDuplicateFilesModal.value = false

    // Collect files to upload
    const filesToProcess = []

    for (const { file, existingMedia } of duplicateFiles.value) {
      const action = duplicateFileActions.value.get(file.name) || 'skip'
      if (action === 'replace') {
        filesToProcess.push(file)
        try {
          await mediaApi.deleteMedia(existingMedia.id)
          const index = mediaItems.value.findIndex(m => m.id === existingMedia.id)
          if (index !== -1) {
            mediaItems.value.splice(index, 1)
          }
        } catch (error) {
          console.error('Failed to delete existing media:', error)
        }
      }
    }

    if (filesToProcess.length > 0) {
      await uploadFiles(filesToProcess)
    } else {
      toast.info('No files to upload', {
        description,
      })
    }
  }

  const handleCancelDuplicateFiles = () => {
    showDuplicateFilesModal.value = false
    duplicateFiles.value = []
    filesToUpload.value = []
    duplicateFileActions.value.clear()
  }

  const uploadFiles = async files => {
    if (!collection.value) {
      return
    }
    if (!selectedSetId?.value) return

    isUploading.value = true

    try {
      // Get watermark if selected
      let watermark
      if (selectedWatermark.value && selectedWatermark.value !== 'none') {
        try {
          watermark = await watermarkStore.fetchWatermark(selectedWatermark.value)
        } catch (error) {
          console.error('Failed to fetch watermark:', error)
        }
      }

      // Process each file and save to mock data
      const uploadedItems = []

      for (const file of files) {
        try {
          // Determine media type
          const type = file.type.startsWith('image/') ? 'image' : 'video'

          // Get filename without extension for title
          const fileName = getFileBaseName(file.name)

          if (file.type.startsWith('image/')) {
            // For images
            const thumbnail = await createThumbnail(file, watermark || undefined)

            // Use thumbnail URL for instant display
            // Process full image in background
            const initialUrl = thumbnail

            const newMedia = await mediaApi.addMedia(collection.value.id, {
              url: initialUrl,
              thumbnail: thumbnail,
              type: type,
              title: fileName,
              order: mediaItems.value.length,
              setId: selectedSetId.value,
            })

            mediaItems.value.push(newMedia)
            uploadedItems.push(newMedia)

            // Process full image with watermark in background and update
            ;(async () => {
              try {
                const originalImageUrl = await fileToDataURL(file)
                let fullUrl = originalImageUrl
                if (watermark) {
                  fullUrl = await applyWatermarkToImage(originalImageUrl, watermark)
                  await mediaApi.updateMedia(newMedia.id, {
                    originalUrl: originalImageUrl,
                  })
                }

                const index = mediaItems.value.findIndex(m => m.id === newMedia.id)
                if (index !== -1) {
                  mediaItems.value[index].url = fullUrl
                  if (watermark) {
                    mediaItems.value[index].originalUrl = originalImageUrl
                  }
                }
              } catch (error) {
                console.error('Error processing full image:', error)
              }
            })()
          } else {
            // For videos
            const url = await fileToDataURL(file)
            const newMedia = await mediaApi.addMedia(collection.value.id, {
              url: url,
              thumbnail: undefined, // Videos don't have thumbnails
              originalUrl: undefined, // Videos don't get watermarks
              type: type,
              title: fileName,
              order: mediaItems.value.length,
              setId: selectedSetId.value,
            })

            uploadedItems.push(newMedia)
            mediaItems.value.push(newMedia)
          }
        } catch (error) {
          console.error('Error processing file:', file.name, error)
        }
      }

      if (uploadedItems.length === 0) {
        toast.error('Upload failed', {
          description,
        })
        isUploading.value = false
        return
      }

      // Update set counts based on actual media (more accurate than incrementing)
      await updateSetCounts()

      toast.success('Files uploaded', {
        description: `${uploadedItems.length} file${uploadedItems.length > 1 ? 's' : ''} uploaded successfully.`,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed', {
        description,
      })
    } finally {
      isUploading.value = false
    }
  }

  const handleFileSelect = async event => {
    const input = event.target
    const files = input.files
    if (!files || files.length === 0) return

    await processFiles(Array.from(files))
    // Reset input
    input.value = ''
  }

  const handleDrop = async e => {
    e.preventDefault()
    if (isDragging) isDragging.value = false

    const files = e.dataTransfer?.files
    if (!files || files.length === 0) return

    await processFiles(Array.from(files))
  }

  return {
    isUploading,
    showDuplicateFilesModal,
    duplicateFiles,
    filesToUpload,
    duplicateFileActions,
    processFiles,
    handleConfirmDuplicateFiles,
    handleCancelDuplicateFiles,
    uploadFiles,
    handleFileSelect,
    handleDrop,
  }
}
