/**
 * Collection Media Upload Composable
 * Uses the generic useMediaUpload composable for collections
 */

import { useMediaUpload } from './useMediaUpload'
import { useMediaApi } from '@/api/media'

/**
 * Example usage for collections
 * This shows how to use the generic useMediaUpload composable
 */
export function useCollectionMediaUpload({
  collectionId,
  setId,
  loadMediaItems,
  existingMedia = [],
} = {}) {
  const mediaApi = useMediaApi()

  // Create upload function for collections
  const uploadMediaFn = async (uploadResult, file, { contextId, setId: setIdValue, mediaData }) => {
    // Collections use phase/phaseId approach
    return await mediaApi.addMedia(contextId, {
      phase: 'collection',
      phaseId: contextId,
      setId: setIdValue,
      url: mediaData.uploadUrl,
      thumbnail: mediaData.thumbnail,
      type: mediaData.type,
      title: mediaData.filename,
      order: 0,
    })
  }

  // Use generic media upload composable
  return useMediaUpload({
    uploadMediaFn,
    contextId: collectionId,
    setId,
    existingMedia,
    loadMediaItems,
  })
}
