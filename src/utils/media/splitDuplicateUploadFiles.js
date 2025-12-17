export const splitDuplicateUploadFiles = (files, mediaItems) => {
  const duplicates = []
  const newFiles = []

  for (const file of files) {
    const fileName = file.name.toLowerCase()
    const existingMedia = mediaItems.find(m => {
      const mediaTitle = (m.title || '').toLowerCase()
      // Check if the title matches the filename (with or without extension)
      return (
        mediaTitle === fileName ||
        mediaTitle === fileName.replace(/\.[^/.]+$/, '') ||
        mediaTitle + file.name.substring(file.name.lastIndexOf('.')) === fileName
      )
    })

    if (existingMedia) {
      duplicates.push({ file, existingMedia })
    } else {
      newFiles.push(file)
    }
  }

  return { duplicates, newFiles }
}
