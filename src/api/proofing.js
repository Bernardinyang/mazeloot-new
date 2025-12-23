/**
 * Proofing API composable
 * Handles all proofing phase-related API calls
 * Uses localStorage for persistence until backend is ready
 */

import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'
import { delay } from '@/utils/delay'
import { generateRandomColorFromPalette } from '@/utils/colors'

const PROOFING_STORAGE_KEY = 'mazeloot_proofing'
const MEDIA_STORAGE_KEY = 'mazeloot_media'
const FEEDBACK_STORAGE_KEY = 'mazeloot_feedback'
const COLLECTIONS_STORAGE_KEY = 'mazeloot_collections'

/**
 * Get all proofing from localStorage
 */
const getAllProofing = () => {
  const proofing = storage.get(PROOFING_STORAGE_KEY)
  if (!proofing || proofing.length === 0) {
    return []
  }
  return proofing
}

/**
 * Save proofing to localStorage
 */
const saveProofing = proofing => {
  storage.set(PROOFING_STORAGE_KEY, proofing)
}

/**
 * Get all media from localStorage
 */
const getAllMedia = () => {
  const media = storage.get(MEDIA_STORAGE_KEY)
  if (!media || media.length === 0) {
    return []
  }
  return media
}

/**
 * Save media to localStorage
 */
const saveMedia = media => {
  storage.set(MEDIA_STORAGE_KEY, media)
}

/**
 * Get all feedback from localStorage
 */
const getAllFeedback = () => {
  const feedback = storage.get(FEEDBACK_STORAGE_KEY)
  if (!feedback || feedback.length === 0) {
    return []
  }
  return feedback
}

/**
 * Save feedback to localStorage
 */
const saveFeedback = feedback => {
  storage.set(FEEDBACK_STORAGE_KEY, feedback)
}

/**
 * Get all collections from localStorage
 */
const getAllCollections = () => {
  const collections = storage.get(COLLECTIONS_STORAGE_KEY)
  if (!collections || collections.length === 0) {
    return []
  }
  return collections
}

/**
 * Save collections to localStorage
 */
const saveCollections = collections => {
  storage.set(COLLECTIONS_STORAGE_KEY, collections)
}

export function useProofingApi() {
  /**
   * Create proofing phase
   */
  const createProofing = async (projectId, data) => {
    await delay(500)

    const proofing = getAllProofing()

    const newProofing = {
      id: generateUUID(),
      projectId,
      name: data.name || 'Proofing',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      maxRevisions: data.maxRevisions || 5,
      currentRevision: 0,
      color: data.color || generateRandomColorFromPalette(),
    }

    proofing.push(newProofing)
    saveProofing(proofing)

    return newProofing
  }

  /**
   * Fetch proofing by ID
   */
  const fetchProofing = async id => {
    await delay(300)

    const proofing = getAllProofing()
    const proofingPhase = proofing.find(p => p.id === id)

    if (!proofingPhase) {
      throw new Error(`Proofing not found: ${id}`)
    }

    const allMedia = getAllMedia()
    const proofingMedia = allMedia.filter(m => m.phase === 'proofing' && m.phaseId === id)

    const allFeedback = getAllFeedback()
    const mediaIds = proofingMedia.map(m => m.id)
    const proofingFeedback = allFeedback.filter(f => mediaIds.includes(f.mediaId))

    return {
      ...proofingPhase,
      media: proofingMedia,
      feedback: proofingFeedback,
    }
  }

  /**
   * Update proofing
   */
  const updateProofing = async (id, data) => {
    await delay(300)

    const proofing = getAllProofing()
    const index = proofing.findIndex(p => p.id === id)

    if (index === -1) {
      throw new Error('Proofing not found')
    }

    proofing[index] = {
      ...proofing[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    saveProofing(proofing)

    return proofing[index]
  }

  /**
   * Upload new revision
   */
  const uploadRevision = async (proofingId, mediaData) => {
    await delay(1000)

    const proofing = getAllProofing()
    const proofingPhase = proofing.find(p => p.id === proofingId)

    if (!proofingPhase) {
      throw new Error('Proofing not found')
    }

    const allMedia = getAllMedia()

    // Find existing media or create new
    let existingMedia = allMedia.find(
      m =>
        m.phase === 'proofing' &&
        m.phaseId === proofingId &&
        m.originalMediaId === mediaData.originalMediaId
    )

    const revisionNumber = existingMedia ? (existingMedia.revisionNumber || 0) + 1 : 1

    if (revisionNumber > proofingPhase.maxRevisions) {
      throw new Error(`Maximum revisions (${proofingPhase.maxRevisions}) exceeded`)
    }

    if (existingMedia) {
      existingMedia = {
        ...existingMedia,
        ...mediaData,
        revisionNumber,
        updatedAt: new Date().toISOString(),
      }
      const index = allMedia.findIndex(m => m.id === existingMedia.id)
      allMedia[index] = existingMedia
    } else {
      const newMedia = {
        id: generateUUID(),
        projectId: proofingPhase.projectId,
        phase: 'proofing',
        phaseId: proofingId,
        originalMediaId: mediaData.originalMediaId,
        revisionNumber: 1,
        ...mediaData,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      allMedia.push(newMedia)
      existingMedia = newMedia
    }

    proofingPhase.currentRevision = Math.max(proofingPhase.currentRevision, revisionNumber)
    proofingPhase.updatedAt = new Date().toISOString()

    saveMedia(allMedia)
    saveProofing(proofing)

    return existingMedia
  }

  /**
   * Add feedback to media
   */
  const addFeedback = async (mediaId, feedbackData) => {
    await delay(500)

    const allFeedback = getAllFeedback()

    const newFeedback = {
      id: generateUUID(),
      mediaId,
      type: feedbackData.type, // 'text' | 'video' | 'audio'
      content: feedbackData.content, // string | URL
      createdAt: new Date().toISOString(),
      createdBy: feedbackData.createdBy || 'client',
    }

    allFeedback.push(newFeedback)
    saveFeedback(allFeedback)

    return newFeedback
  }

  /**
   * Mark media as completed/approved
   */
  const markMediaCompleted = async mediaId => {
    await delay(300)

    const allMedia = getAllMedia()
    const media = allMedia.find(m => m.id === mediaId)

    if (!media) {
      throw new Error('Media not found')
    }

    media.isCompleted = true
    media.updatedAt = new Date().toISOString()

    saveMedia(allMedia)

    return media
  }

  /**
   * Complete proofing phase
   */
  const completeProofing = async id => {
    await delay(500)

    const proofing = getAllProofing()
    const index = proofing.findIndex(p => p.id === id)

    if (index === -1) {
      throw new Error('Proofing not found')
    }

    proofing[index] = {
      ...proofing[index],
      status: 'completed',
      updatedAt: new Date().toISOString(),
    }

    saveProofing(proofing)

    return proofing[index]
  }

  /**
   * Move approved media to collection
   */
  const moveToCollection = async (proofingId, collectionId = null) => {
    await delay(1000)

    const allMedia = getAllMedia()
    const proofingMedia = allMedia.filter(
      m => m.phase === 'proofing' && m.phaseId === proofingId && m.isCompleted === true
    )

    if (proofingMedia.length === 0) {
      throw new Error('No completed media to move')
    }

    const collections = getAllCollections()
    let collection = collectionId ? collections.find(c => c.id === collectionId) : null

    // If no collection provided, create one from the proofing's project
    if (!collection) {
      const proofing = getAllProofing().find(p => p.id === proofingId)
      if (!proofing || !proofing.projectId) {
        throw new Error('Cannot create collection: project not found')
      }

      const PROJECTS_STORAGE_KEY = 'mazeloot_projects'
      const projects = storage.get(PROJECTS_STORAGE_KEY) || []
      const project = projects.find(p => p.id === proofing.projectId)

      if (!project) {
        throw new Error('Project not found')
      }

      const { generateUUID } = await import('@/utils/uuid')
      collection = {
        id: generateUUID(),
        name: `${project.name} - Final Collection`,
        description: 'Final approved media from proofing',
        projectId: project.id,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        mediaSets: project.mediaSets || [
          { id: 'highlights', name: 'Highlights', count: 0, order: 0 },
        ],
        itemCount: 0,
        isStarred: false,
        isLocked: false,
        isFolder: false,
      }

      // Apply project settings
      if (project.settings) {
        collection.presetId = project.settings.presetId
        collection.watermarkId = project.settings.watermarkId
        collection.tags = project.settings.tags || []
      }

      collections.push(collection)
      saveCollections(collections)
    }

    const { createLowResMediaItem } = await import('@/utils/media/generateLowResCopy')
    const lowResCopies = []
    for (const media of proofingMedia) {
      const lowResCopy = await createLowResMediaItem(media)
      lowResCopy.id = generateUUID() // New ID for the copy
      lowResCopies.push(lowResCopy)
    }

    // Move full-res media to collection
    proofingMedia.forEach(media => {
      media.phase = 'collection'
      media.phaseId = collectionId
      media.collectionId = collectionId
      media.updatedAt = new Date().toISOString()
    })

    // Add low-res copies back to proofing
    allMedia.push(...lowResCopies)

    saveMedia(allMedia)
    saveCollections(collections)

    return {
      moved: proofingMedia,
      lowResCopies,
    }
  }

  /**
   * Fetch all proofing (both standalone and project-linked)
   */
  const fetchAllProofing = async () => {
    await delay(300)

    const proofing = getAllProofing()
    const allMedia = getAllMedia()
    const allFeedback = getAllFeedback()

    const { useProjectsApi } = await import('@/api/projects')
    const projectsApi = useProjectsApi()
    let projects = []
    try {
      projects = await projectsApi.fetchProjects({ parentId: null })
    } catch (err) {}

    // Enrich each proofing with media count, feedback count, and project name
    return proofing.map(proofingPhase => {
      const proofingMedia = allMedia.filter(
        m => m.phase === 'proofing' && m.phaseId === proofingPhase.id
      )
      const mediaIds = proofingMedia.map(m => m.id)
      const proofingFeedback = allFeedback.filter(f => mediaIds.includes(f.mediaId))
      const project = proofingPhase.projectId
        ? projects.find(p => p.id === proofingPhase.projectId)
        : null

      return {
        ...proofingPhase,
        mediaCount: proofingMedia.length,
        completedMediaCount: proofingMedia.filter(m => m.isCompleted).length,
        feedbackCount: proofingFeedback.length,
        projectName: project?.name || null,
      }
    })
  }

  /**
   * Toggle star status
   */
  const toggleStar = async (id, isStarred) => {
    await delay(300)

    const proofing = getAllProofing()
    const index = proofing.findIndex(p => p.id === id)

    if (index !== -1) {
      proofing[index].isStarred = isStarred
      proofing[index].starred = isStarred
      saveProofing(proofing)
    }
  }

  return {
    createProofing,
    fetchProofing,
    fetchAllProofing,
    updateProofing,
    uploadRevision,
    addFeedback,
    markMediaCompleted,
    completeProofing,
    moveToCollection,
    toggleStar,
  }
}
