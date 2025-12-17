/**
 * Collections API composable
 * Handles all collection-related API calls
 * Uses localStorage for persistence until backend is ready
 */

import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'

const COLLECTIONS_STORAGE_KEY = 'mazeloot_collections'

/**
 * Generate unique image URLs from multiple sources
 * Uses: Unsplash, Picsum, Lorem Picsum, Placeholder.com, Placeholder.pics
 */
const getImageUrl = (source, index) => {
  const sources = {
    unsplash: i => {
      // Use actual Unsplash photo IDs that exist
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
      return `https://images.unsplash.com/photo-${photoIds[i % photoIds.length]}?w=400&h=300&fit=crop`
    },
    picsum: i => `https://picsum.photos/400/300?random=${i}`,
    lorem: i => {
      const categories = [
        'wedding',
        'portrait',
        'event',
        'nature',
        'people',
        'city',
        'business',
        'technology',
      ]
      return `https://loremflickr.com/400/300/${categories[i % categories.length]}?lock=${i}`
    },
    placeholder: i => `https://via.placeholder.com/400x300/cccccc/666666?text=Image+${i}`,
    via: i => `https://picsum.photos/seed/${i}/400/300`,
  }
  return sources[source](index)
}

/**
 * Add default settings to a collection
 */
const addDefaultSettings = collection => {
  // Only add settings to non-folder collections
  if (collection.isFolder) {
    return collection
  }

  return {
    ...collection,
    // Settings - General
    url: collection.url || '',
    tags: collection.tags || [],
    emailRegistration: collection.emailRegistration ?? false,
    galleryAssist: collection.galleryAssist ?? false,
    slideshow: collection.slideshow ?? true,
    slideshowOptions: collection.slideshowOptions || [],
    socialSharing: collection.socialSharing ?? true,
    language: collection.language || 'en',
    // Settings - Privacy
    showOnHomepage: collection.showOnHomepage ?? true,
    clientExclusiveAccess: collection.clientExclusiveAccess ?? false,
    clientPrivatePassword: collection.clientPrivatePassword || null,
    allowClientsMarkPrivate: collection.allowClientsMarkPrivate ?? false,
    clientOnlySets: collection.clientOnlySets || [],
    // Settings - Download
    downloadEnabled: collection.downloadEnabled ?? true,
    photoDownload: collection.photoDownload ?? true,
    highResolutionEnabled: collection.highResolutionEnabled ?? true,
    highResolutionSize: collection.highResolutionSize || '3600px',
    webSizeEnabled: collection.webSizeEnabled ?? true,
    webSize: collection.webSize || '1024px',
    downloadPinEnabled: collection.downloadPinEnabled ?? false,
    limitDownloads: collection.limitDownloads ?? false,
    downloadLimit: collection.downloadLimit || 1,
    restrictToContacts: collection.restrictToContacts ?? false,
    downloadableSets: collection.downloadableSets || [],
    // Settings - Favorite
    favoriteEnabled: collection.favoriteEnabled ?? true,
    favoritePhotos: collection.favoritePhotos ?? true,
    favoriteNotes: collection.favoriteNotes ?? true,
  }
}

/**
 * Initialize mock data in localStorage if not exists
 * This data structure matches what the backend will send
 */
const initializeMockData = () => {
  // Check if data already exists
  const existing = storage.get(COLLECTIONS_STORAGE_KEY)
  if (existing && existing.length > 0) {
    // Add default settings to existing collections that don't have them
    return existing.map(collection => {
      if (collection.isFolder) return collection
      return addDefaultSettings(collection)
    })
  }

  // Mock data structured to match backend format
  const now = new Date()
  const recentDate = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  const oldDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) // 60 days ago
  const expiringSoon = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  const expiredDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) // 10 days ago

  // Get available presets from localStorage to assign to collections
  const PRESETS_STORAGE_KEY = 'mazeloot_presets'
  const presets = storage.get(PRESETS_STORAGE_KEY) || []
  const presetIds = presets.length > 0 ? presets.map(p => p.id) : []
  const firstPresetId = presetIds.length > 0 ? presetIds[0] : undefined
  const secondPresetId = presetIds.length > 1 ? presetIds[1] : undefined

  let imageIndex = 0

  const mockCollections = [
    // Folders (must be created first for parentId references)
    // Only folders have previewImages
    {
      id: generateUUID(),
      name: 'Wedding Folder',
      description: 'Folder containing wedding collections',
      status: 'active',
      category: 'wedding',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      isStarred: false,
      isLocked: true,
      isFolder: true,
      parentId: null,
      previewImages: [
        getImageUrl('unsplash', imageIndex++),
        getImageUrl('picsum', imageIndex++),
        getImageUrl('lorem', imageIndex++),
        getImageUrl('via', imageIndex++),
      ],
      itemCount: 4, // Matches previewImages.length
    },
    {
      id: generateUUID(),
      name: 'Portrait Sessions Folder',
      description: 'All portrait session collections',
      status: 'active',
      category: 'portrait',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      isStarred: true,
      isLocked: true,
      isFolder: true,
      parentId: null,
      previewImages: [getImageUrl('unsplash', imageIndex++)],
      itemCount: 1, // Matches previewImages.length
    },
    {
      id: generateUUID(),
      name: 'Event Archives',
      description: 'Archived event collections',
      status: 'archived',
      category: 'event',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
      isStarred: false,
      isLocked: false,
      isFolder: true,
      parentId: null,
      previewImages: [getImageUrl('picsum', imageIndex++), getImageUrl('lorem', imageIndex++)],
      itemCount: 2, // Matches previewImages.length
    },
    {
      id: generateUUID(),
      name: 'Draft Collections',
      description: 'Work in progress',
      status: 'draft',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      isStarred: false,
      isLocked: true,
      isFolder: true,
      parentId: null,
      previewImages: [],
      itemCount: 0, // Matches previewImages.length
    },
    {
      id: generateUUID(),
      name: 'Test Folder',
      description: 'Test folder with no preview images',
      status: 'active',
      createdAt: new Date('2025-11-12').toISOString(),
      updatedAt: new Date('2025-11-12').toISOString(),
      isStarred: false,
      isLocked: true,
      isFolder: true,
      parentId: null,
      previewImages: [],
      itemCount: 0, // Matches previewImages.length
    },

    // Active collections (NO previewImages - only folders have them)
    {
      id: generateUUID(),
      name: 'Summer Wedding 2024',
      description: 'Beautiful outdoor wedding ceremony',
      thumbnail: getImageUrl('unsplash', imageIndex++),
      status: 'active',
      category: 'wedding',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      itemCount: 45,
      isStarred: true,
      isLocked: false,
      expiryDate: expiringSoon.toISOString(),
      password: 'wedding2024',
      downloadPin: '1234',
      parentId: null,
      presetId: firstPresetId,
      watermarkId: undefined,
      date: new Date('2024-06-15').toISOString(),
    },
    {
      id: generateUUID(),
      name: 'Portrait Session - Family',
      description: 'Family portrait session in the park',
      thumbnail: getImageUrl('picsum', imageIndex++),
      status: 'active',
      category: 'portrait',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      itemCount: 28,
      isStarred: false,
      isLocked: true,
      password: 'family2024',
      downloadPin: '5678',
      parentId: null,
      presetId: secondPresetId || firstPresetId,
      watermarkId: undefined,
      date: new Date('2024-07-20').toISOString(),
    },
    {
      id: generateUUID(),
      name: 'Corporate Event 2024',
      description: 'Annual company event photos',
      thumbnail: getImageUrl('lorem', imageIndex++),
      status: 'active',
      category: 'event',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      itemCount: 120,
      isStarred: true,
      isLocked: false,
      downloadPin: '9012',
      parentId: null,
      presetId: firstPresetId,
      watermarkId: undefined,
    },

    // Draft collections (NO previewImages)
    {
      id: generateUUID(),
      name: 'Wedding Prep - Draft',
      description: 'Pre-wedding photoshoot',
      thumbnail: getImageUrl('via', imageIndex++),
      status: 'draft',
      category: 'wedding',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      itemCount: 15,
      isStarred: false,
      isLocked: true,
      password: 'prep2024',
      parentId: null,
      presetId: firstPresetId,
      watermarkId: undefined,
    },
    {
      id: generateUUID(),
      name: 'Portrait Session - Individual',
      description: 'Individual portrait session',
      thumbnail: getImageUrl('unsplash', imageIndex++),
      status: 'draft',
      category: 'portrait',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
      itemCount: 8,
      isStarred: false,
      isLocked: false,
      parentId: null,
      presetId: undefined,
      watermarkId: undefined,
    },
    {
      id: generateUUID(),
      name: 'Event Coverage - Draft',
      description: 'Event coverage draft',
      thumbnail: getImageUrl('picsum', imageIndex++),
      status: 'draft',
      category: 'event',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
      itemCount: 0,
      isStarred: false,
      isLocked: true,
      parentId: null,
      presetId: secondPresetId || firstPresetId,
      watermarkId: undefined,
    },

    // Archived collections (NO previewImages)
    {
      id: generateUUID(),
      name: 'Old Wedding Collection',
      description: 'Archived wedding from 2023',
      thumbnail: getImageUrl('lorem', imageIndex++),
      status: 'archived',
      category: 'wedding',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
      itemCount: 60,
      isStarred: false,
      isLocked: false,
      expiryDate: expiredDate.toISOString(),
      parentId: null,
    },
    {
      id: generateUUID(),
      name: 'Portrait Archive',
      description: 'Old portrait sessions',
      thumbnail: getImageUrl('via', imageIndex++),
      status: 'archived',
      category: 'portrait',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
      itemCount: 35,
      isStarred: true,
      isLocked: false,
      expiryDate: expiredDate.toISOString(),
      parentId: null,
    },
    {
      id: generateUUID(),
      name: 'Past Events Archive',
      description: 'Historical event photos',
      thumbnail: getImageUrl('unsplash', imageIndex++),
      status: 'archived',
      category: 'event',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
      itemCount: 200,
      isStarred: false,
      isLocked: false,
      parentId: null,
    },

    // More recent collections for testing (NO previewImages)
    {
      id: generateUUID(),
      name: 'New Wedding Collection',
      description: 'Latest wedding shoot',
      thumbnail: getImageUrl('picsum', imageIndex++),
      status: 'active',
      category: 'wedding',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 30,
      isStarred: true,
      isLocked: true,
      expiryDate: expiringSoon.toISOString(),
      parentId: null,
      presetId: firstPresetId,
      watermarkId: undefined,
    },
    {
      id: generateUUID(),
      name: 'Portrait Gallery',
      description: 'Collection of portrait sessions',
      thumbnail: getImageUrl('lorem', imageIndex++),
      status: 'active',
      category: 'portrait',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 50,
      isStarred: false,
      isLocked: false,
      parentId: null,
      presetId: secondPresetId || firstPresetId,
      watermarkId: undefined,
    },
    {
      id: generateUUID(),
      name: 'Event Showcase',
      description: 'Various event photography',
      thumbnail: getImageUrl('via', imageIndex++),
      status: 'active',
      category: 'event',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      itemCount: 75,
      isStarred: true,
      isLocked: false,
      parentId: null,
      presetId: firstPresetId,
      watermarkId: undefined,
    },

    // Collections with expiring soon (NO previewImages)
    {
      id: generateUUID(),
      name: 'Expiring Wedding Collection',
      description: 'This collection expires soon',
      thumbnail: getImageUrl('unsplash', imageIndex++),
      status: 'active',
      category: 'wedding',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      itemCount: 20,
      isStarred: false,
      isLocked: true,
      expiryDate: expiringSoon.toISOString(),
      parentId: null,
    },

    // Collections with expired dates (NO previewImages)
    {
      id: generateUUID(),
      name: 'Expired Portrait Session',
      description: 'This collection has expired',
      thumbnail: getImageUrl('picsum', imageIndex++),
      status: 'archived',
      category: 'portrait',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
      itemCount: 12,
      isStarred: false,
      isLocked: false,
      expiryDate: expiredDate.toISOString(),
      parentId: null,
    },
    {
      id: generateUUID(),
      name: 'Locked Collection',
      description: 'A locked collection for testing',
      thumbnail: getImageUrl('lorem', imageIndex++),
      status: 'active',
      category: 'portrait',
      createdAt: recentDate.toISOString(),
      updatedAt: recentDate.toISOString(),
      itemCount: 15,
      isStarred: false,
      isLocked: true,
      parentId: null,
    },
  ]

  // Calculate itemCount for folders based on children
  const updateFolderCounts = collections => {
    collections.forEach(collection => {
      if (collection.isFolder) {
        const children = collections.filter(c => c.parentId === collection.id)
        // itemCount should match previewImages.length for folders
        collection.itemCount = collection.previewImages?.length || children.length
      }
    })
  }

  updateFolderCounts(mockCollections)

  // Add default settings to all non-folder collections
  const collectionsWithSettings = mockCollections.map(collection => addDefaultSettings(collection))

  // Save to localStorage
  storage.set(COLLECTIONS_STORAGE_KEY, collectionsWithSettings)

  return collectionsWithSettings
}

/**
 * Get all collections from localStorage
 */
const getAllCollections = () => {
  const collections = storage.get(COLLECTIONS_STORAGE_KEY)
  if (!collections || collections.length === 0) {
    return initializeMockData()
  }
  return collections
}

/**
 * Save collections to localStorage
 */
const saveCollections = collections => {
  // Update folder counts before saving
  collections.forEach(collection => {
    if (collection.isFolder) {
      // itemCount should match previewImages.length for folders
      if (collection.previewImages && collection.previewImages.length > 0) {
        collection.itemCount = collection.previewImages.length
      } else {
        // If no preview images, count children
        const children = collections.filter(c => c.parentId === collection.id)
        collection.itemCount = children.length
      }
    }
  })
  storage.set(COLLECTIONS_STORAGE_KEY, collections)
}

export function useCollectionsApi() {
  /**
   * Fetch all collections
   */
  const fetchCollections = async params => {
    // Simulate API delay
    await delay(500)

    let collections = getAllCollections()

    // Filter by parentId first
    if (params?.parentId !== undefined) {
      collections = collections.filter(c => c.parentId === params.parentId)
    } else {
      // If no parentId specified, show only root-level items
      collections = collections.filter(c => c.parentId === null)
    }

    // Apply other filters if provided
    if (params?.status && params.status !== 'all') {
      collections = collections.filter(c => c.status === params.status)
    }

    if (params?.category && params.category !== 'all') {
      collections = collections.filter(c => c.category === params.category)
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      collections = collections.filter(
        c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description?.toLowerCase().includes(searchLower)
      )
    }

    return collections
  }

  /**
   * Fetch single collection by ID
   */
  const fetchCollection = async id => {
    await delay(500)

    const collections = getAllCollections()
    const collection = collections.find(c => c.id === id)

    if (!collection) {
      console.error('Collection not found. ID:', id)
      console.error(
        'Available collections:',
        collections.map(c => ({ id: c.id, name: c.name }))
      )
      throw new Error(`Collection not found: ${id}`)
    }

    return collection
  }

  /**
   * Create new collection
   */
  const createCollection = async data => {
    await delay(1000)

    const collections = getAllCollections()
    const newCollection = {
      id: generateUUID(),
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: data.parentId || null,
      status: 'draft',
      itemCount: 0,
      isStarred: false,
      isLocked: false,
      isFolder: data.isFolder || false,
      previewImages: data.isFolder ? [] : undefined,
      password: data.password || null,
      date: data.eventDate
        ? typeof data.eventDate === 'string'
          ? data.eventDate
          : data.eventDate.toISOString()
        : undefined,
    }

    collections.push(newCollection)
    saveCollections(collections)

    return newCollection
  }

  /**
   * Update collection
   */
  const updateCollection = async (id, data) => {
    await delay(500)

    const collections = getAllCollections()
    const index = collections.findIndex(c => c.id === id)

    if (index === -1) {
      throw new Error('Collection not found')
    }

    // Handle eventDate conversion to date field
    let dateValue = collections[index].date
    if (data.eventDate !== undefined) {
      if (data.eventDate === null) {
        dateValue = undefined
      } else {
        dateValue =
          typeof data.eventDate === 'string' ? data.eventDate : data.eventDate.toISOString()
      }
    }

    collections[index] = {
      ...collections[index],
      ...data,
      expiryDate: data.expiryDate === null ? undefined : data.expiryDate,
      date: dateValue,
      presetId: data.presetId !== undefined ? data.presetId : collections[index].presetId,
      watermarkId:
        data.watermarkId !== undefined ? data.watermarkId : collections[index].watermarkId,
      mediaSets: data.mediaSets !== undefined ? data.mediaSets : collections[index].mediaSets,
      updatedAt: new Date().toISOString(),
    }

    saveCollections(collections)

    // Return collection without eventDate (it's stored as 'date')
    const { eventDate: _, ...collectionToReturn } = collections[index]
    return collectionToReturn
  }

  /**
   * Delete collection
   */
  const deleteCollection = async id => {
    await delay(500)

    const collections = getAllCollections()
    const filtered = collections.filter(c => c.id !== id)

    // Also remove any children if this is a folder
    const children = collections.filter(c => c.parentId === id)
    children.forEach(child => {
      const childIndex = filtered.findIndex(c => c.id === child.id)
      if (childIndex !== -1) {
        filtered.splice(childIndex, 1)
      }
    })

    saveCollections(filtered)
  }

  /**
   * Toggle star status
   */
  const toggleStar = async (id, isStarred) => {
    await delay(300)

    const collections = getAllCollections()
    const index = collections.findIndex(c => c.id === id)

    if (index !== -1) {
      collections[index].isStarred = isStarred
      saveCollections(collections)
    }
  }

  /**
   * Move collection/folder to another folder
   */
  const moveCollection = async (collectionId, targetFolderId) => {
    await delay(500)

    const collections = getAllCollections()
    const collectionIndex = collections.findIndex(c => c.id === collectionId)

    if (collectionIndex === -1) {
      throw new Error('Collection not found')
    }

    // Validate target folder exists and is actually a folder
    if (targetFolderId !== null) {
      const targetFolder = collections.find(c => c.id === targetFolderId)
      if (!targetFolder) {
        throw new Error('Target folder not found')
      }
      if (!targetFolder.isFolder) {
        throw new Error('Target must be a folder')
      }
      // Prevent moving folder into itself or its children
      if (collectionId === targetFolderId) {
        throw new Error('Cannot move folder into itself')
      }
      // Check if target is a child of the collection being moved
      const isChild = (folderId, checkId) => {
        const folder = collections.find(c => c.id === folderId)
        if (!folder || !folder.isFolder) return false
        const directChildren = collections.filter(c => c.parentId === folderId)
        if (directChildren.some(c => c.id === checkId)) return true
        return directChildren.some(child => isChild(child.id, checkId))
      }
      // Prevent moving folders into other folders
      if (collections[collectionIndex].isFolder) {
        throw new Error('Folders cannot be moved into other folders')
      }
    }

    // Store old parentId before updating
    const oldParentId = collections[collectionIndex].parentId

    // Update parentId
    collections[collectionIndex] = {
      ...collections[collectionIndex],
      parentId: targetFolderId,
      updatedAt: new Date().toISOString(),
    }

    // Update target folder's preview images if it's a folder
    if (targetFolderId !== null) {
      const targetFolder = collections.find(c => c.id === targetFolderId)
      if (targetFolder && targetFolder.isFolder) {
        const movedCollection = collections[collectionIndex]
        const previewImages = targetFolder.previewImages || []

        // Add collection thumbnail to folder preview if not already present and we have space
        if (movedCollection.thumbnail && !previewImages.includes(movedCollection.thumbnail)) {
          if (previewImages.length < 4) {
            targetFolder.previewImages = [...previewImages, movedCollection.thumbnail]
          } else {
            // Replace last image if at capacity (keep most recent)
            targetFolder.previewImages = [...previewImages.slice(0, 3), movedCollection.thumbnail]
          }
        } else if (previewImages.length === 0 && movedCollection.thumbnail) {
          // If folder has no preview images, add the moved collection's thumbnail
          targetFolder.previewImages = [movedCollection.thumbnail]
        }

        // Update folder itemCount to match previewImages.length
        targetFolder.itemCount = targetFolder.previewImages?.length || 0
      }
    }

    // Update old parent folder if collection was moved from another folder
    if (oldParentId !== null && oldParentId !== targetFolderId) {
      const oldParent = collections.find(c => c.id === oldParentId)
      if (oldParent && oldParent.isFolder) {
        // Recalculate itemCount for old parent based on remaining children
        const children = collections.filter(c => c.parentId === oldParentId)
        oldParent.itemCount = children.length
      }
    }

    saveCollections(collections)

    return collections[collectionIndex]
  }

  /**
   * Duplicate collection
   */
  const duplicateCollection = async id => {
    await delay(1000)

    const collections = getAllCollections()
    const original = collections.find(c => c.id === id)

    if (!original) {
      throw new Error('Collection not found')
    }

    const duplicated = {
      ...original,
      id: generateUUID(),
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isStarred: false,
    }

    collections.push(duplicated)
    saveCollections(collections)

    return duplicated
  }

  return {
    fetchCollections,
    fetchCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    toggleStar,
    moveCollection,
    duplicateCollection,
  }
}
