export const getMediaDownloadUrl = item => {
  return item?.url || item?.thumbnail || ''
}
