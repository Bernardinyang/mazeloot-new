import { ref } from 'vue'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/errors'

import { fileToDataURL } from '@/utils/fileToDataURL'
import { applyWatermarkToImage } from '@/utils/watermark/applyWatermarkToImage'
import { createThumbnail } from '@/utils/media/createThumbnail'
import { storeFile, storeBlob, getFile, getFileBlobURL } from '@/utils/fileStorage'
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
      toast.error('No collection/selection loaded', {
        description,
      })
      return
    }
    // Require a set to be selected for uploads
    if (!selectedSetId?.value) {
      toast.error('No set selected', {
        description: 'Please select a set from the sidebar before uploading.',
      })
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
    // Filter mediaItems to only check against items in the selected set
    const mediaInSelectedSet = selectedSetId?.value
      ? mediaItems.value.filter(item => item.setId === selectedSetId.value)
      : mediaItems.value
    const { duplicates, newFiles } = splitDuplicateUploadFiles(validFiles, mediaInSelectedSet)

    // If there are duplicates, show modal to ask user what to do
    if (duplicates.length > 0) {
      duplicateFiles.value = duplicates
      filesToUpload.value = newFiles
      duplicateFileActions.value = new Map()
      // Default action: skip
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

      // Determine if this is a selection or collection
      // Selections don't have a 'uuid' property, collections do
      const isSelection = !collection.value?.uuid
      const collectionId = isSelection ? null : collection.value.id
      const phase = isSelection ? 'selection' : 'collection'
      const phaseId = collection.value.id

      if (!phaseId) {
        toast.error('Invalid selection/collection', {
          description: 'Unable to determine selection/collection ID.',
        })
        isUploading.value = false
        return
      }

      // Process each file and save to mock data
      const uploadedItems = []
      let failedFiles = []

      for (const file of files) {
        try {
          // Determine media type
          const type = file.type.startsWith('image/') ? 'image' : 'video'

          // Get filename without extension for title
          const fileName = getFileBaseName(file.name)

          if (file.type.startsWith('image/')) {
            // Store the original file in IndexedDB
            let filePath
            try {
              filePath = await storeFile(file)
            } catch (error) {
              console.error('Error storing file in IndexedDB:', error)
              toast.error('Failed to store file', {
                description: `Error storing ${file.name}: ${error.message}`,
              })
              continue
            }

            // Create thumbnail and store it in IndexedDB
            let thumbnailPath
            try {
              const thumbnailDataURL = await createThumbnail(file, watermark || undefined)
              const thumbnailBlob = await (await fetch(thumbnailDataURL)).blob()
              thumbnailPath = await storeBlob(thumbnailBlob, `thumb_${fileName}.jpg`)
            } catch (error) {
              console.error('Error creating/storing thumbnail:', error)
              // Continue with upload even if thumbnail fails
              thumbnailPath = filePath
            }

            // Store file path (file://...) instead of base64
            let newMedia
            try {
              newMedia = await mediaApi.addMedia(collectionId, {
                phase: phase,
                phaseId: phaseId,
                url: filePath,
                thumbnail: thumbnailPath,
                type: type,
                title: fileName,
                order: mediaItems.value.length,
                setId: selectedSetId.value,
              })

              // Verify the media was actually saved by checking if it has an ID
              if (!newMedia || !newMedia.id) {
                throw new Error('Media was not created properly')
              }

              mediaItems.value.push(newMedia)
              uploadedItems.push(newMedia)

              // Small delay to ensure media is persisted before background processing
              await new Promise(resolve => setTimeout(resolve, 100))
            } catch (error) {
              console.error('Error adding media to API:', error)
              toast.error('Failed to add media', {
                description: `Error adding ${file.name}: ${error.message}`,
              })
              continue
            }

            // Process full image with watermark in background and update
            ;(async () => {
              try {
                // Wait a bit longer to ensure media is fully saved to storage
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Get the file from IndexedDB
                const storedFile = await getFile(filePath)
                const originalImageUrl = await fileToDataURL(storedFile)
                let watermarkedPath = filePath

                if (watermark) {
                  const fullUrl = await applyWatermarkToImage(originalImageUrl, watermark)
                  // Store watermarked version in IndexedDB
                  const watermarkedBlob = await (await fetch(fullUrl)).blob()
                  watermarkedPath = await storeBlob(watermarkedBlob, `watermarked_${fileName}.jpg`)

                  // Store original separately in IndexedDB
                  const originalBlob = await storedFile.arrayBuffer()
                  const originalFile = new File([originalBlob], file.name, { type: file.type })
                  const originalPath = await storeFile(originalFile, {
                    id: `${newMedia.id}_original`,
                  })

                  // Retry logic for updateMedia in case of race condition
                  let retries = 3
                  while (retries > 0) {
                    try {
                      await mediaApi.updateMedia(newMedia.id, {
                        originalUrl: originalPath,
                      })
                      break
                    } catch (error) {
                      retries--
                      if (retries === 0) {
                        console.error('Error updating media after retries:', error)
                        // Don't throw, just log - the media is already added
                      } else {
                        // Wait before retry
                        await new Promise(resolve => setTimeout(resolve, 300))
                      }
                    }
                  }
                }

                const index = mediaItems.value.findIndex(m => m.id === newMedia.id)
                if (index !== -1) {
                  mediaItems.value[index].url = watermarkedPath || filePath
                  if (watermark) {
                    try {
                      const storedFile = await getFile(filePath)
                      const originalBlob = await storedFile.arrayBuffer()
                      const originalFile = new File([originalBlob], file.name, { type: file.type })
                      const originalPath = await storeFile(originalFile, {
                        id: `${newMedia.id}_original`,
                      })
                      mediaItems.value[index].originalUrl = originalPath
                    } catch (error) {
                      console.error('Error storing original file:', error)
                    }
                  }
                }
              } catch (error) {
                console.error('Error processing full image:', error)
                // Don't show error toast for background processing failures
              }
            })()
          } else {
            // For videos - store the file in IndexedDB
            const filePath = await storeFile(file)
            const newMedia = await mediaApi.addMedia(collectionId, {
              phase: phase,
              phaseId: phaseId,
              url: filePath,
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
          const errorMessage = getErrorMessage(error, `Failed to process "${file.name}"`)
          console.error('Error processing file:', file.name, error)
          // Track failed files for better error reporting
          failedFiles.push({ file: file.name, error: errorMessage })
        }
      }

      if (uploadedItems.length === 0) {
        const errorDetails =
          failedFiles.length > 0
            ? failedFiles.map(f => `"${f.file}": ${f.error}`).join('; ')
            : description || 'No files were uploaded successfully'
        toast.error('Upload failed', {
          description:
            errorDetails.length > 200
              ? `${failedFiles.length} file(s) failed to upload`
              : errorDetails,
        })
        isUploading.value = false
        return
      }

      // Update set counts based on actual media (more accurate than incrementing)
      await updateSetCounts()

      const successMessage = `${uploadedItems.length} file${uploadedItems.length > 1 ? 's' : ''} uploaded successfully.`
      if (failedFiles && failedFiles.length > 0) {
        toast.warning('Partial upload', {
          description: `${successMessage} ${failedFiles.length} file(s) failed.`,
        })
      } else {
        toast.success('Files uploaded', {
          description: successMessage,
        })
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, 'Failed to upload files')
      console.error('Upload error:', error)
      toast.error('Upload failed', {
        description: errorMessage,
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
