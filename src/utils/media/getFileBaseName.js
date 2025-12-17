export const getFileBaseName = fileName => {
  return fileName.replace(/\.[^/.]+$/, '')
}
