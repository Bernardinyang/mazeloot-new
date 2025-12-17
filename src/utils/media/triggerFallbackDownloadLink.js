export const triggerFallbackDownloadLink = (downloadUrl, filename) => {
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
