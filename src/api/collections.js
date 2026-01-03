/**
 * Collections API composable
 * Handles all collection-related API calls
 * Uses localStorage for persistence until backend is ready
 */

import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'
import { generateRandomColorFromPalette } from '@/utils/colors'
import { apiClient } from '@/api/client'
import { parseError } from '@/utils/errors'
import { API_CONFIG } from '@/api/config'

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
 * Add default settings to a collection and normalize from organized structure
 */
export const addDefaultSettings = collection => {
  // Only add settings to non-folder collections
  if (collection.isFolder) {
    return collection
  }

  const settings = collection.settings || {}
  const general = settings.general || {}
  const privacy = settings.privacy || {}
  const download = settings.download || {}
  const favorite = settings.favorite || {}
  const design = settings.design || {}

  return {
    ...collection,
    // Keep the organized design structure
    design: design,
    // Extract design settings from organized structure for backward compatibility
    coverDesign: design.cover || collection.coverDesign || {},
    gridDesign: design.grid ? {
      ...design.grid,
      // Normalize field names: thumbnailOrientation -> thumbnailSize, tabStyle -> navigationStyle
      thumbnailSize: design.grid.thumbnailOrientation || design.grid.thumbnailSize,
      navigationStyle: design.grid.tabStyle || design.grid.navigationStyle,
    } : (collection.gridDesign || {}),
    typographyDesign: design.typography || collection.typographyDesign || {},
    colorDesign: design.color || collection.colorDesign || {},
    // Extract settings from organized structure for backward compatibility
    // Settings - General
    url: general.url || collection.url || '',
    tags: general.tags || collection.tags || [],
    emailRegistration: general.emailRegistration ?? collection.emailRegistration ?? false,
    galleryAssist: general.galleryAssist ?? collection.galleryAssist ?? false,
    slideshow: general.slideshow ?? collection.slideshow ?? true,
    slideshowSpeed: general.slideshowSpeed || collection.slideshowSpeed || 'regular',
    slideshowAutoLoop: general.slideshowAutoLoop ?? collection.slideshowAutoLoop ?? true,
    socialSharing: general.socialSharing ?? collection.socialSharing ?? true,
    language: general.language || collection.language || 'en',
    autoExpiryDate: general.autoExpiryDate ?? collection.autoExpiryDate ?? null,
    expiryDate: general.expiryDate ?? collection.expiryDate ?? null,
    expiryDays: general.expiryDays ?? collection.expiryDays ?? null,
    // Settings - Privacy
    collectionPasswordEnabled: privacy.collectionPasswordEnabled ?? privacy.collectionPassword ?? collection.collectionPasswordEnabled ?? collection.collectionPassword ?? false,
    collectionPassword: privacy.collectionPassword ?? privacy.password ?? collection.collectionPassword ?? null, // Actual password (only for owner)
    password: privacy.password ?? collection.password ?? null, // Legacy support
    showOnHomepage: privacy.showOnHomepage ?? collection.showOnHomepage ?? true,
    clientExclusiveAccess: privacy.clientExclusiveAccess ?? collection.clientExclusiveAccess ?? false,
    clientPrivatePassword: privacy.clientPrivatePassword ?? collection.clientPrivatePassword ?? null,
    allowClientsMarkPrivate: privacy.allowClientsMarkPrivate ?? collection.allowClientsMarkPrivate ?? false,
    clientOnlySets: privacy.clientOnlySets ?? collection.clientOnlySets ?? [],
    // Settings - Download
    downloadEnabled: favorite.enabled ?? collection.downloadEnabled ?? true,
    photoDownload: download.photoDownload ?? collection.photoDownload ?? true,
    highResolutionEnabled: download.highResolution?.enabled ?? collection.highResolutionEnabled ?? true,
    highResolutionSize: download.highResolution?.size || collection.highResolutionSize || '3600px',
    webSizeEnabled: download.webSize?.enabled ?? collection.webSizeEnabled ?? true,
    webSize: download.webSize?.size || collection.webSize || '1024px',
    videoDownload: download.videoDownload ?? collection.videoDownload ?? false,
    downloadPin: typeof download.downloadPin === 'string' ? download.downloadPin : (download.downloadPin ? collection.downloadPin : null),
    downloadPinEnabled: download.downloadPinEnabled ?? collection.downloadPinEnabled ?? false,
    limitDownloads: download.limitDownloads ?? collection.limitDownloads ?? false,
    downloadLimit: download.downloadLimit ?? collection.downloadLimit ?? 1,
    restrictToContacts: download.restrictToContacts ?? collection.restrictToContacts ?? false,
    allowedDownloadEmails: download.allowedDownloadEmails ?? collection.allowedDownloadEmails ?? null,
    downloadableSets: download.downloadableSets ?? collection.downloadableSets ?? [],
    // Settings - Favorite
    favoriteEnabled: favorite.enabled ?? collection.favoriteEnabled ?? true,
    favoritePhotos: favorite.photos ?? collection.favoritePhotos ?? true,
    favoriteNotes: favorite.notes ?? collection.favoriteNotes ?? true,
  }
}

/**
 * Initialize mock data in localStorage if not exists
 * This data structure matches what the backend will send
 */
const initializeMockData = async () => {
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

  // Get presets from store instead of localStorage
  const { usePresetStore } = await import('@/stores/preset')
  const presetStore = usePresetStore()
  // Ensure presets are loaded
  if (presetStore.presets.length === 0) {
    try {
      await presetStore.loadPresets()
    } catch (error) {
      // Silently fail - will use empty array
    }
  }
  const presetIds = presetStore.presets.length > 0 ? presetStore.presets.map(p => p.id) : []
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
  const getAllCollections = async () => {
    const collections = storage.get(COLLECTIONS_STORAGE_KEY)
    if (!collections || collections.length === 0) {
      return await initializeMockData()
    }
    return collections
  }

/**
 * Save collections to localStorage
 */
const saveCollections = collections => {
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
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const queryParams = new URLSearchParams()

        if (params?.status && params.status !== 'all') {
          queryParams.append('status', params.status)
        }

        if (params?.search && params.search.trim()) {
          queryParams.append('search', params.search.trim())
        }

        if (params?.starred !== undefined && params.starred !== null) {
          queryParams.append('starred', params.starred.toString())
        }

        if (params?.page) {
          queryParams.append('page', params.page.toString())
        }

        if (params?.perPage) {
          queryParams.append('per_page', params.perPage.toString())
        }

        const endpoint = `/v1/memora/collections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const response = await apiClient.get(endpoint)

        // Backend returns { data: { data: [...], pagination: {...} }, status: 200 }
        // API client extracts data.data, so response.data is { data: [...], pagination: {...} }
        const result = response.data
        if (result?.data && Array.isArray(result.data)) {
          result.data = result.data.map(collection => addDefaultSettings(collection))
        }
        return result
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(500)

    let collections = await getAllCollections()

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
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const response = await apiClient.get(`/v1/memora/collections/${id}`)
        return addDefaultSettings(response.data)
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(500)

    const collections = await getAllCollections()
    const collection = collections.find(c => c.id === id)

    if (!collection) {
      throw new Error(`Collection not found: ${id}`)
    }

    return addDefaultSettings(collection)
  }

  /**
   * Create new collection
   */
  const createCollection = async data => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const queryParams = new URLSearchParams()
        if (data.projectId) {
          queryParams.append('projectId', data.projectId)
        }

        const payload = {
          name: data.name,
          description: data.description || null,
          status: data.status || 'draft',
          presetId: data.presetId || null,
          watermarkId: data.watermarkId || null,
          settings: data.settings || null,
          color: data.color || null,
          eventDate: data.eventDate
            ? typeof data.eventDate === 'string'
              ? data.eventDate
              : data.eventDate.toISOString()
            : null,
        }

        const endpoint = `/v1/memora/collections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const response = await apiClient.post(endpoint, payload)
        return response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(1000)

    const collections = await getAllCollections()

    let preset = null
    if (data.presetId) {
      // Use preset store to get preset
      const { usePresetStore } = await import('@/stores/preset')
      const presetStore = usePresetStore()
      preset = presetStore.getPresetById(data.presetId)
    }

    // If projectId is provided, inherit mediaSets from project
    let mediaSets = data.mediaSets
    if (data.projectId && !data.isFolder) {
      const PROJECTS_STORAGE_KEY = 'mazeloot_projects'
      const projects = storage.get(PROJECTS_STORAGE_KEY) || []
      const project = projects.find(p => p.id === data.projectId)
      if (project && project.mediaSets) {
        mediaSets = project.mediaSets
      }
    }

    // Convert preset photoSets to mediaSets if preset exists and not a folder
    // (only if not already set from project)
    if (!mediaSets && preset && !data.isFolder) {
      if (preset.photoSets && preset.photoSets.length > 0) {
        mediaSets = preset.photoSets.map((setName, index) => ({
          id: `set-${generateUUID()}`,
          name: setName,
          description: '',
          count: 0,
          order: index,
        }))
      } else {
        // Default to Highlights if preset has no photoSets
        mediaSets = [{ id: 'highlights', name: 'Highlights', count: 0, order: 0 }]
      }
    }

    // Determine watermarkId: use provided one, or preset's defaultWatermarkId, or undefined
    let watermarkId = data.watermarkId
    if (!watermarkId && preset && preset.defaultWatermarkId && preset.defaultWatermarkId !== 'none') {
      watermarkId = preset.defaultWatermarkId
    }

    // Parse collection tags from preset
    let tags = []
    if (preset && preset.collectionTags) {
      if (typeof preset.collectionTags === 'string') {
        tags = preset.collectionTags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      } else if (Array.isArray(preset.collectionTags)) {
        tags = [...preset.collectionTags]
      }
    }

    // Build base collection object
    const baseCollection = {
      id: generateUUID(),
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: data.parentId || null,
      projectId: data.projectId || null, // Support project-linked collections
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
      // Store presetId and watermarkId
      presetId: data.presetId || undefined,
      watermarkId: watermarkId || undefined,
      color: data.color || generateRandomColorFromPalette(),
      // If projectId exists, inherit mediaSets from project
      ...(!data.isFolder && mediaSets && { mediaSets }),
    }

    // If projectId is provided, inherit settings from project
    let projectSettings = null
    if (data.projectId) {
      const PROJECTS_STORAGE_KEY = 'mazeloot_projects'
      const projects = storage.get(PROJECTS_STORAGE_KEY) || []
      const project = projects.find(p => p.id === data.projectId)
      if (project && project.settings) {
        projectSettings = project.settings
        // Inherit presetId and watermarkId from project if not provided
        if (!data.presetId && projectSettings.presetId) {
          // Use preset store to get preset
          const { usePresetStore } = await import('@/stores/preset')
          const presetStore = usePresetStore()
          preset = presetStore.getPresetById(projectSettings.presetId)
        }
        if (!watermarkId && projectSettings.watermarkId) {
          watermarkId = projectSettings.watermarkId
        }
      }
    }

    // Apply default settings first (for fields that don't have preset values)
    const collectionWithDefaults = addDefaultSettings(baseCollection)

    // Now apply preset values, which will override defaults
    // Also apply project settings if available
    const newCollection = {
      ...collectionWithDefaults,
      // Apply project settings first (lower priority than preset)
      ...(projectSettings && {
        presetId: data.presetId || projectSettings.presetId || collectionWithDefaults.presetId,
        watermarkId:
          watermarkId || projectSettings.watermarkId || collectionWithDefaults.watermarkId,
        tags: projectSettings.tags || collectionWithDefaults.tags,
      }),
      // Apply preset General settings if preset exists
      ...(preset && {
        emailRegistration: preset.emailRegistration ?? collectionWithDefaults.emailRegistration,
        galleryAssist: preset.galleryAssist ?? collectionWithDefaults.galleryAssist,
        slideshow: preset.slideshow ?? collectionWithDefaults.slideshow,
        socialSharing: preset.socialSharing ?? collectionWithDefaults.socialSharing,
        language: preset.language || collectionWithDefaults.language,
        tags: tags.length > 0 ? tags : collectionWithDefaults.tags,
      }),
      // Apply preset Design settings if preset exists and has design data
      // Split design into separate properties for design views (coverDesign, colorDesign, typographyDesign, gridDesign)
      // Also keep the unified design object for backward compatibility
      ...(preset &&
        preset.design && {
          design: { ...preset.design },
          // Split design into separate properties
          coverDesign: {
            joyCoverTitle: preset.design.joyCover?.title,
            joyCoverAvatar: preset.design.joyCover?.avatar,
            joyCoverShowDate: preset.design.joyCover?.showDate,
            joyCoverShowName: preset.design.joyCover?.showName,
            joyCoverButtonText: preset.design.joyCover?.buttonText,
            joyCoverShowButton: preset.design.joyCover?.showButton,
            joyCoverBackgroundPattern: preset.design.joyCover?.backgroundPattern,
          },
          colorDesign: {
            colorPalette: preset.design.colorPalette,
          },
          typographyDesign: {
            fontFamily: preset.design.fontFamily,
            fontStyle: preset.design.fontStyle,
          },
          gridDesign: {
            gridStyle: preset.design.gridStyle,
            gridColumns: preset.design.gridColumns,
            thumbnailSize: preset.design.thumbnailSize,
            gridSpacing: preset.design.gridSpacing,
            navigationStyle: preset.design.navigationStyle,
          },
        }),
      // Apply preset Privacy settings if preset exists and has privacy data
      ...(preset &&
        preset.privacy && {
          privacy: { ...preset.privacy },
          // Also apply privacy fields directly to collection for backward compatibility
          showOnHomepage:
            preset.privacy.showOnHomepage !== undefined
              ? preset.privacy.showOnHomepage
              : collectionWithDefaults.showOnHomepage,
          clientExclusiveAccess:
            preset.privacy.clientExclusiveAccess ?? collectionWithDefaults.clientExclusiveAccess,
          clientPrivatePassword:
            preset.privacy.clientPrivatePassword || collectionWithDefaults.clientPrivatePassword,
          allowClientsMarkPrivate:
            preset.privacy.allowClientsMarkPrivate ??
            collectionWithDefaults.allowClientsMarkPrivate,
          clientOnlySets: preset.privacy.clientOnlySets || collectionWithDefaults.clientOnlySets,
        }),
      // Apply preset Download settings if preset exists and has download data
      ...(preset &&
        preset.download && {
          download: { ...preset.download },
          // Also apply download fields directly to collection for backward compatibility
          photoDownload:
            preset.download.photoDownload !== undefined
              ? preset.download.photoDownload
              : collectionWithDefaults.photoDownload,
          highResolutionEnabled:
            preset.download.highResolutionEnabled !== undefined
              ? preset.download.highResolutionEnabled
              : collectionWithDefaults.highResolutionEnabled,
          highResolutionSize:
            preset.download.highResolutionSize || collectionWithDefaults.highResolutionSize,
          webSizeEnabled:
            preset.download.webSizeEnabled !== undefined
              ? preset.download.webSizeEnabled
              : collectionWithDefaults.webSizeEnabled,
          webSize: preset.download.webSize || collectionWithDefaults.webSize,
          videoDownload:
            preset.download.videoDownload !== undefined
              ? preset.download.videoDownload
              : collectionWithDefaults.videoDownload,
          downloadPin: preset.download.downloadPin || collectionWithDefaults.downloadPin,
          downloadPinEnabled:
            preset.download.downloadPinEnabled ?? collectionWithDefaults.downloadPinEnabled,
          limitDownloads: preset.download.limitDownloads ?? collectionWithDefaults.limitDownloads,
          downloadLimit: preset.download.downloadLimit || collectionWithDefaults.downloadLimit,
          restrictToContacts:
            preset.download.restrictToContacts ?? collectionWithDefaults.restrictToContacts,
          downloadableSets:
            preset.download.downloadableSets || collectionWithDefaults.downloadableSets,
        }),
      // Apply preset Favorite settings if preset exists and has favorite data
      ...(preset &&
        preset.favorite && {
          favorite: { ...preset.favorite },
          // Also apply favorite fields directly to collection for backward compatibility
          favoriteEnabled:
            preset.favorite.favoriteEnabled !== undefined
              ? preset.favorite.favoriteEnabled
              : collectionWithDefaults.favoriteEnabled,
          favoritePhotos:
            preset.favorite.favoritePhotos !== undefined
              ? preset.favorite.favoritePhotos
              : collectionWithDefaults.favoritePhotos,
          favoriteNotes:
            preset.favorite.favoriteNotes !== undefined
              ? preset.favorite.favoriteNotes
              : collectionWithDefaults.favoriteNotes,
        }),
    }

    // Collection created with preset values
    if (preset) {
    }

    collections.push(newCollection)
    saveCollections(collections)

    return newCollection
  }

  /**
   * Update collection
   */
  const updateCollection = async (id, data) => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const queryParams = new URLSearchParams()
        if (data.projectId) {
          queryParams.append('projectId', data.projectId)
        }

        const payload = {}
        if (data.name !== undefined) payload.name = data.name
        if (data.description !== undefined) payload.description = data.description
        if (data.status !== undefined) payload.status = data.status
        if (data.presetId !== undefined) payload.presetId = data.presetId
        if (data.watermarkId !== undefined) payload.watermarkId = data.watermarkId
        if (data.settings !== undefined) payload.settings = data.settings
        if (data.color !== undefined) payload.color = data.color
        if (data.eventDate !== undefined) {
          payload.eventDate = data.eventDate
            ? typeof data.eventDate === 'string'
              ? data.eventDate
              : data.eventDate.toISOString()
            : null
        }
        if (data.thumbnail !== undefined) payload.thumbnail = data.thumbnail
        if (data.image !== undefined) payload.image = data.image
        if (data.coverDesign !== undefined) payload.coverDesign = data.coverDesign
        if (data.typographyDesign !== undefined) payload.typographyDesign = data.typographyDesign
        if (data.colorDesign !== undefined) payload.colorDesign = data.colorDesign
        if (data.gridDesign !== undefined) payload.gridDesign = data.gridDesign
        if (data.mediaSets !== undefined) payload.mediaSets = data.mediaSets
        // General settings
        if (data.url !== undefined) payload.url = data.url
        if (data.tags !== undefined) payload.tags = data.tags
        if (data.emailRegistration !== undefined) payload.emailRegistration = data.emailRegistration
        if (data.galleryAssist !== undefined) payload.galleryAssist = data.galleryAssist
        if (data.slideshow !== undefined) payload.slideshow = data.slideshow
        if (data.slideshowSpeed !== undefined) payload.slideshowSpeed = data.slideshowSpeed
        if (data.slideshowAutoLoop !== undefined) payload.slideshowAutoLoop = data.slideshowAutoLoop
        if (data.socialSharing !== undefined) payload.socialSharing = data.socialSharing
        if (data.language !== undefined) payload.language = data.language
        if (data.autoExpiryDate !== undefined) payload.autoExpiryDate = data.autoExpiryDate
        if (data.expiryDate !== undefined) {
          payload.expiryDate = data.expiryDate
            ? typeof data.expiryDate === 'string'
              ? data.expiryDate
              : data.expiryDate.toISOString()
            : null
        }
        if (data.expiryDays !== undefined) payload.expiryDays = data.expiryDays
        // Privacy settings
        if (data.password !== undefined) payload.password = data.password
        if (data.showOnHomepage !== undefined) payload.showOnHomepage = data.showOnHomepage
        if (data.clientExclusiveAccess !== undefined) payload.clientExclusiveAccess = data.clientExclusiveAccess
        if (data.clientPrivatePassword !== undefined) payload.clientPrivatePassword = data.clientPrivatePassword
        if (data.allowClientsMarkPrivate !== undefined) payload.allowClientsMarkPrivate = data.allowClientsMarkPrivate
        if (data.clientOnlySets !== undefined) payload.clientOnlySets = data.clientOnlySets
        // Download settings
        if (data.photoDownload !== undefined) payload.photoDownload = data.photoDownload
        if (data.highResolutionEnabled !== undefined) payload.highResolutionEnabled = data.highResolutionEnabled
        if (data.webSizeEnabled !== undefined) payload.webSizeEnabled = data.webSizeEnabled
        if (data.webSize !== undefined) payload.webSize = data.webSize
        if (data.downloadPin !== undefined) payload.downloadPin = data.downloadPin
        if (data.downloadPinEnabled !== undefined) payload.downloadPinEnabled = data.downloadPinEnabled
        if (data.limitDownloads !== undefined) payload.limitDownloads = data.limitDownloads
        if (data.downloadLimit !== undefined) payload.downloadLimit = data.downloadLimit
        if (data.restrictToContacts !== undefined) payload.restrictToContacts = data.restrictToContacts
        if (data.allowedDownloadEmails !== undefined) payload.allowedDownloadEmails = data.allowedDownloadEmails
        if (data.downloadableSets !== undefined) payload.downloadableSets = data.downloadableSets
        // Favorite settings
        if (data.favoritePhotos !== undefined) payload.favoritePhotos = data.favoritePhotos
        if (data.favoriteNotes !== undefined) payload.favoriteNotes = data.favoriteNotes
        if (data.downloadEnabled !== undefined) payload.downloadEnabled = data.downloadEnabled
        if (data.favoriteEnabled !== undefined) payload.favoriteEnabled = data.favoriteEnabled

        const endpoint = `/v1/memora/collections/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const response = await apiClient.patch(endpoint, payload)
        return response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(500)

    const collections = await getAllCollections()
    const index = collections.findIndex(c => c.id === id)

    if (index === -1) {
      throw new Error('Collection not found')
    }

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

    const { eventDate: _, ...collectionToReturn } = collections[index]
    return collectionToReturn
  }

  /**
   * Delete collection
   */
  const deleteCollection = async (id, projectId = null) => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const queryParams = new URLSearchParams()
        if (projectId) {
          queryParams.append('projectId', projectId)
        }

        const endpoint = `/v1/memora/collections/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        await apiClient.delete(endpoint)
        return true
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(500)

    const collections = await getAllCollections()
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
  const toggleStar = async (id, projectId = null) => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const queryParams = new URLSearchParams()
        if (projectId) {
          queryParams.append('projectId', projectId)
        }

        const endpoint = `/v1/memora/collections/${id}/star${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const response = await apiClient.post(endpoint)
        return response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation
    await delay(300)

    const collections = await getAllCollections()
    const index = collections.findIndex(c => c.id === id)

    if (index !== -1) {
      const wasStarred = collections[index].isStarred || false
      collections[index].isStarred = !wasStarred
      saveCollections(collections)
      return { starred: !wasStarred }
    }

    return { starred: false }
  }

  /**
   * Move collection/folder to another folder
   */
  const moveCollection = async (collectionId, targetFolderId) => {
    await delay(500)

    const collections = await getAllCollections()
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

    collections[collectionIndex] = {
      ...collections[collectionIndex],
      parentId: targetFolderId,
      updatedAt: new Date().toISOString(),
    }

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

        targetFolder.itemCount = targetFolder.previewImages?.length || 0
      }
    }

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

    const collections = await getAllCollections()
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

  /**
   * Fetch collections for a project with optional pagination parameters
   * @param {string} projectId - Project ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}|Array>}
   */
  const fetchProjectCollections = async (projectId, params = {}) => {
    // Use real API if configured
    if (API_CONFIG.USE_REAL_API) {
      try {
        const queryParams = new URLSearchParams()

        if (projectId) {
          queryParams.append('projectId', projectId)
        }

        if (params.page) {
          queryParams.append('page', params.page.toString())
        }

        if (params.perPage) {
          queryParams.append('per_page', params.perPage.toString())
        }

        const endpoint = `/v1/memora/collections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const response = await apiClient.get(endpoint)

        // The backend returns { data: { data: [...], pagination: {...} }, status: 200 }
        // The API client extracts data.data, so response.data is { data: [...], pagination: {...} }
        // Return it directly as the composable expects this format
        return response.data
      } catch (error) {
        throw parseError(error)
      }
    }

    // Fallback to localStorage implementation with pagination support
    await delay(500)

    const collections = await getAllCollections()
    let projectCollections = collections.filter(c => c.projectId === projectId)

    // Apply pagination
    const page = params?.page || 1
    const perPage = params?.perPage || 10
    const total = projectCollections.length
    const totalPages = Math.ceil(total / perPage)
    const start = (page - 1) * perPage
    const end = start + perPage
    const paginatedCollections = projectCollections.slice(start, end)

    // Return paginated response format
    return {
      data: paginatedCollections,
      pagination: {
        page,
        limit: perPage,
        total,
        totalPages,
      },
    }
  }

  /**
   * Get media in a set with optional sorting and pagination
   * @param {string} collectionId - Collection ID
   * @param {string} setId - Set ID
   * @param {Object} params - Query parameters
   * @param {string} params.sortBy - Sort field and direction (e.g., 'uploaded-desc', 'name-asc', 'date-taken-desc')
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}|Array>}
   */
  const fetchSetMedia = async (collectionId, setId, params = {}) => {
    try {
      const queryParams = new URLSearchParams()

      if (params.sortBy) {
        queryParams.append('sort_by', params.sortBy)
      }

      if (params.page) {
        queryParams.append('page', params.page.toString())
      }

      if (params.perPage) {
        queryParams.append('per_page', params.perPage.toString())
      }

      const endpoint = `/v1/memora/collections/${collectionId}/sets/${setId}/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

      // The backend returns { data: { data: [...], pagination: {...} }, status: 200 }
      // The API client extracts data.data, so response.data is { data: [...], pagination: {...} }
      // Return it directly as the composable expects this format
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Upload media to a collection set
   * Only requires user_file_uuid - all metadata comes from UserFile relationship
   */
  const uploadMediaToSet = async (collectionId, setId, data) => {
    try {
      // Only send user_file_uuid - backend will get all metadata from UserFile
      const payload = {
        user_file_uuid: data.userFileUuid || data.user_file_uuid,
      }

      if (!payload.user_file_uuid) {
        throw new Error('user_file_uuid is required')
      }

      const response = await apiClient.post(
        `/v1/memora/collections/${collectionId}/sets/${setId}/media`,
        payload
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete media from a collection set
   */
  const deleteMedia = async (collectionId, setId, mediaId) => {
    try {
      const response = await apiClient.delete(
        `/v1/memora/collections/${collectionId}/sets/${setId}/media/${mediaId}`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Toggle star status for media in a collection set
   */
  const starMedia = async (collectionId, setId, mediaId) => {
    try {
      const response = await apiClient.post(
        `/v1/memora/collections/${collectionId}/sets/${setId}/media/${mediaId}/star`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    fetchCollections,
    fetchCollection,
    fetchProjectCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    toggleStar,
    moveCollection,
    duplicateCollection,
    fetchSetMedia,
    uploadMediaToSet,
    deleteMedia,
    starMedia,
  }
}
