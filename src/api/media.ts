/**
 * Media API composable
 * Handles all media-related API calls for collections
 * Uses localStorage for persistence until backend is ready
 */

import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'

const MEDIA_STORAGE_KEY = 'mazeloot_media'

export interface MediaItem {
  id: string
  collectionId: string
  url: string
  thumbnail?: string
  type: 'image' | 'video'
  title?: string
  description?: string
  order?: number
  createdAt: string
  updatedAt: string
}

/**
 * Generate unique image URLs
 */
const getImageUrl = (index: number): string => {
  const photoIds = [
    '1519741497674-611481863552',
    '1516589178581-6cd7833ae3b2',
    '1511285560929-80b456fea0bc',
    '1521119989659-a83eee488004',
    '1475721027785-f74eccf877e2',
    '1511578314322-379afb476865',
    '1494790008762-728dbb2e86b0',
    '1500648767791-00dcc994a43e',
    '1505373877841-8d25f7d46678',
    '1478147427282-58a87a120781',
    '1515934751635-c81c6bc9a2d8',
    '1522673607200-164d1b6ce486',
    '1519225421980-715cb0215aed',
    '1465495976277-4387d4b0b4c6',
    '1506794778202-cad84cf45f1d',
    '1534528741775-53994a69daeb',
    '1492684223066-81342ee5ff30',
    '1507003211169-0a1dd7228f2d',
    '1509316785289-025f5b846b35',
    '1488426862026-3ee34c7d66df',
    '1508214751196-bcfd4ca60f91',
    '1539571696357-5a69c17a67c6',
  ]
  const id = photoIds[index % photoIds.length]
  return `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop`
}

/**
 * Initialize mock media data
 */
const initializeMockMedia = (): MediaItem[] => {
  const stored = storage.get<MediaItem[]>(MEDIA_STORAGE_KEY)
  if (stored && stored.length > 0) {
    return stored
  }

  // Generate media for existing collections
  const collections = storage.get<any[]>('mazeloot_collections') || []
  const media: MediaItem[] = []
  let imageIndex = 0

  collections.forEach(collection => {
    if (!collection.isFolder && collection.id) {
      // Generate 6-12 media items per collection
      const itemCount = Math.floor(Math.random() * 7) + 6
      const now = new Date()

      for (let i = 0; i < itemCount; i++) {
        media.push({
          id: generateUUID(),
          collectionId: collection.id,
          url: getImageUrl(imageIndex++),
          thumbnail: getImageUrl(imageIndex - 1) + '&w=400&h=300',
          type: 'image',
          title: `Photo ${i + 1}`,
          order: i,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        })
      }
    }
  })

  storage.set(MEDIA_STORAGE_KEY, media)
  return media
}

/**
 * Get all media items
 */
const getAllMedia = (): MediaItem[] => {
  const stored = storage.get<MediaItem[]>(MEDIA_STORAGE_KEY)
  if (stored && stored.length > 0) {
    return stored
  }
  return initializeMockMedia()
}

/**
 * Save media to storage
 */
const saveMedia = (media: MediaItem[]) => {
  storage.set(MEDIA_STORAGE_KEY, media)
}

export function useMediaApi() {
  /**
   * Fetch media for a collection
   */
  const fetchCollectionMedia = async (collectionId: string): Promise<MediaItem[]> => {
    await delay(300)

    const allMedia = getAllMedia()
    const collectionMedia = allMedia
      .filter(m => m.collectionId === collectionId)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    return collectionMedia
  }

  /**
   * Add media to collection
   */
  const addMedia = async (
    collectionId: string,
    mediaData: Partial<MediaItem>
  ): Promise<MediaItem> => {
    await delay(300)

    const allMedia = getAllMedia()
    const newMedia: MediaItem = {
      id: generateUUID(),
      collectionId,
      url: mediaData.url || '',
      thumbnail: mediaData.thumbnail,
      type: mediaData.type || 'image',
      title: mediaData.title,
      description: mediaData.description,
      order: mediaData.order,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    allMedia.push(newMedia)
    saveMedia(allMedia)
    return newMedia
  }

  /**
   * Delete media
   */
  const deleteMedia = async (mediaId: string): Promise<void> => {
    await delay(300)

    const allMedia = getAllMedia()
    const filtered = allMedia.filter(m => m.id !== mediaId)
    saveMedia(filtered)
  }

  return {
    fetchCollectionMedia,
    addMedia,
    deleteMedia,
  }
}
