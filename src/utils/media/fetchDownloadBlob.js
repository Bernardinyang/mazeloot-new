export const fetchDownloadBlob = async downloadUrl => {
  if (!downloadUrl) return null

  // Data URL - convert to blob
  if (downloadUrl.startsWith('data:')) {
    const response = await fetch(downloadUrl)
    return await response.blob()
  }

  // Regular URL - fetch with CORS handling (caller may fall back if this fails)
  try {
    const response = await fetch(downloadUrl, { mode: 'cors' })
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.blob()
  } catch {
    return null
  }
}
