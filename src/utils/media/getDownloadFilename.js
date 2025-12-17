export const getDownloadFilename = (title, id) => {
  const filename = title || `media-${id}`
  const extension = filename.includes('.') ? filename.substring(filename.lastIndexOf('.')) : '.jpg'
  return filename.endsWith(extension) ? filename : `${filename}${extension}`
}
