import { toast } from '@/shared/utils/toast'
import { useRouter } from 'vue-router'

export function useMediaShareDownloadActions({
  getMediaDownloadUrl,
  getDownloadFilename,
  fetchDownloadBlob,
  triggerBrowserDownload,
  triggerFallbackDownloadLink,
  copyTextToClipboard,
  getMediaFilename,
  route,
  description,
  collectionId,
  publicMode = false,
} = {}) {
  const router = useRouter()
  
  const handleQuickShare = async item => {
    try {
      const resolvedRoute = router.resolve({
        name: 'clientCollection',
        query: {
          collectionId: collectionId || route.params.uuid,
          mediaId: item.id,
        },
      })
      const shareUrl = `${window.location.origin}${resolvedRoute.href}`
      await copyTextToClipboard(shareUrl)
      
      // Track share link click (only in public mode)
      if (publicMode && collectionId) {
        try {
          const { useCollectionsApi } = await import('@/domains/memora/api/collections')
          const { trackShareLinkClick } = useCollectionsApi()
          await trackShareLinkClick(collectionId, null, shareUrl)
        } catch (err) {
          console.warn('Failed to track share link click:', err)
        }
      }
      
      toast.success('The share link has been copied to your clipboard.')
    } catch (error) {
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
      toast.error(description || 'Download failed')
    }
  }

  const handleCopyFilenames = async item => {
    try {
      const filename = getMediaFilename(item.title, item.id)
      await copyTextToClipboard(filename)
      toast.success(description || 'Filename copied')
    } catch (error) {
      toast.error(description || 'Failed to copy filename')
    }
  }

  const handleCopyLink = () => {
    const uuid = route.params.uuid
    const resolvedRoute = router.resolve({
      name: 'collectionPhotos',
      params: { uuid },
    })
    const link = `${window.location.origin}${resolvedRoute.href}`

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
