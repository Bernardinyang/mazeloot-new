import { toast } from '@/utils/toast'

export function useMediaShareDownloadActions({
  getMediaShareUrl,
  getMediaDownloadUrl,
  getDownloadFilename,
  fetchDownloadBlob,
  triggerBrowserDownload,
  triggerFallbackDownloadLink,
  copyTextToClipboard,
  getMediaFilename,
  getCollectionShareLink,
  route,
  description,
} = {}) {
  const handleQuickShare = async item => {
    try {
      const shareUrl = getMediaShareUrl(window.location.origin, item.id)
      await copyTextToClipboard(shareUrl)
      toast.success('The share link has been copied to your clipboard.')
    } catch (error) {
      console.error('Failed to copy share link:', error)
      toast.error('Please try again.')
    }
  }

  const handleDownloadMedia = async item => {
    try {
      // Download the image currently is (with or without watermark)
      const downloadUrl = getMediaDownloadUrl(item)

      if (!downloadUrl) {
        toast.error(description || 'Download failed')
        return
      }

      // Fetch the image to handle data URLs and CORS
      const blob = await fetchDownloadBlob(downloadUrl)
      if (!blob) {
        // Fallback
        triggerFallbackDownloadLink(downloadUrl, item.title || `media-${item.id}`)
        toast.success(description || 'Download started')
        return
      }

      triggerBrowserDownload(blob, getDownloadFilename(item.title, item.id))

      toast.success(description || 'Download started')
    } catch (error) {
      console.error('Download error:', error)
      toast.error(description || 'Download failed')
    }
  }

  const handleCopyFilenames = async item => {
    try {
      const filename = getMediaFilename(item.title, item.id)
      await copyTextToClipboard(filename)
      toast.success(description || 'Filename copied')
    } catch (error) {
      console.error('Failed to copy filename:', error)
      toast.error(description || 'Failed to copy filename')
    }
  }

  const handleCopyLink = () => {
    const uuid = route.params.uuid
    const link = getCollectionShareLink(window.location.origin, uuid)

    copyTextToClipboard(link)
      .then(() => {
        toast.success('The link has been copied to your clipboard.')
      })
      .catch(() => {
        toast.error('Please try again.')
      })
  }

  return {
    handleQuickShare,
    handleDownloadMedia,
    handleCopyFilenames,
    handleCopyLink,
  }
}
