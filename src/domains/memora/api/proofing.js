/**
 * Proofing API composable
 * Handles all proofing phase-related API calls
 * Integrates with backend API
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'
import { storage } from '@/shared/utils/storage'
import { generateUUID } from '@/shared/utils/uuid'
import { delay } from '@/shared/utils/delay'
import { generateRandomColorFromPalette } from '@/shared/utils/colors'

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
   * Create proofing phase (standalone or project-based)
   * @param {string|null} projectId - Project UUID (optional, null for standalone)
   * @param {Object} data - Proofing data
   * @param {string} data.name - Proofing name
   * @param {number} data.maxRevisions - Maximum revisions
   * @param {string} data.color - Proofing color
   */
  const createProofing = async (projectId, data) => {
    try {
      const payload = {
        name: data.name || 'Proofing',
        description: data.description || undefined,
        maxRevisions: data.maxRevisions || 5,
        color: data.color || undefined,
      }

      if (projectId) {
        payload.projectId = projectId
      }

      const response = await apiClient.post('/v1/memora/proofing', payload)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Fetch proofing by ID
   * @param {string} id - Proofing UUID
   * @param {string|null} projectId - Optional project UUID for project-based proofing
   */
  const fetchProofing = async (id, projectId = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${id}`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.get(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update proofing (standalone or project-based)
   */
  const updateProofing = async (projectId, id, data) => {
    try {
      let endpoint = `/v1/memora/proofing/${id}`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const payload = {}
      if (data.name !== undefined) payload.name = data.name
      if (data.description !== undefined) payload.description = data.description
      if (data.maxRevisions !== undefined) payload.maxRevisions = data.maxRevisions
      if (data.color !== undefined) payload.color = data.color
      if (data.status !== undefined) payload.status = data.status
      if (data.allowedEmails !== undefined) payload.allowedEmails = data.allowedEmails
      if (data.primaryEmail !== undefined) payload.primaryEmail = data.primaryEmail
      if (data.password !== undefined) payload.password = data.password
      if (data.coverFocalPoint !== undefined || data.cover_focal_point !== undefined) {
        payload.cover_focal_point = data.coverFocalPoint || data.cover_focal_point
      }
      if (data.typographyDesign !== undefined) {
        payload.typographyDesign = data.typographyDesign
      }

      const response = await apiClient.patch(endpoint, payload)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Upload new revision
   * @param {string|null} projectId - Project UUID (optional, null for standalone)
   * @param {string} proofingId - Proofing UUID
   * @param {string} mediaId - Media UUID
   * @param {number} revisionNumber - Revision number
   * @param {string} description - Revision description
   * @param {string} userFileUuid - User file UUID from upload
   */
  const uploadRevision = async (
    projectId,
    proofingId,
    mediaId,
    revisionNumber,
    description,
    userFileUuid,
    completedTodos = []
  ) => {
    try {
      const payload = {
        mediaId,
        revisionNumber,
        userFileUuid,
      }
      if (description) {
        payload.description = description
      }
      if (completedTodos && completedTodos.length > 0) {
        payload.completedTodos = completedTodos
      }

      let endpoint = `/v1/memora/proofing/${proofingId}/revisions`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.post(endpoint, payload)

      return response.data
    } catch (error) {
      throw parseError(error)
    }
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
      parentId: feedbackData.parentId || null,
      timestamp: feedbackData.timestamp || null,
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
   * Complete proofing phase (standalone or project-based)
   */
  const completeProofing = async (projectId, id) => {
    try {
      let endpoint = `/v1/memora/proofing/${id}/complete`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.post(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
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

      const { generateUUID } = await import('@/shared/utils/uuid')
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

    const { createLowResMediaItem } = await import('@/shared/utils/media/generateLowResCopy')
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
   * Fetch all proofing with optional search, sort, filter, and pagination parameters
   * @param {Object} params - Query parameters
   * @param {string} params.projectUuid - Filter by project UUID
   * @param {string} params.search - Search query (searches in name)
   * @param {string} params.sortBy - Sort field and direction (e.g., 'created-desc', 'name-asc', 'status-asc')
   * @param {string} params.status - Filter by status (e.g., 'draft', 'completed')
   * @param {boolean} params.starred - Filter by starred status
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}>}
   */
  const fetchAllProofing = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams()

      if (params.projectUuid) {
        queryParams.append('project_uuid', params.projectUuid)
      }

      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim())
      }

      if (params.sortBy) {
        queryParams.append('sort_by', params.sortBy)
      }

      if (params.status) {
        queryParams.append('status', params.status)
      }

      if (params.starred !== undefined && params.starred !== null) {
        queryParams.append('starred', params.starred.toString())
      }

      if (params.page) {
        queryParams.append('page', params.page.toString())
      }

      if (params.perPage) {
        queryParams.append('per_page', params.perPage.toString())
      }

      const endpoint = `/v1/memora/proofing${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete proofing (standalone or project-based)
   */
  const deleteProofing = async (projectId, id) => {
    try {
      let endpoint = `/v1/memora/proofing/${id}`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      await apiClient.delete(endpoint)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Publish proofing (standalone or project-based)
   */
  const publishProofing = async (projectId, id) => {
    try {
      let endpoint = `/v1/memora/proofing/${id}/publish`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.post(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Toggle star status (standalone or project-based)
   */
  const toggleStar = async (projectId, id) => {
    try {
      let endpoint = `/v1/memora/proofing/${id}/star`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.post(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Duplicate proofing (standalone or project-based)
   */
  const duplicateProofing = async (projectId, id) => {
    try {
      let endpoint = `/v1/memora/proofing/${id}/duplicate`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.post(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Set cover photo from media (standalone or project-based)
   */
  const setCoverPhoto = async (projectId, proofingId, mediaUuid, focalPoint = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/cover-photo`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const payload = {
        media_uuid: mediaUuid,
      }
      if (focalPoint) {
        payload.focal_point = focalPoint
      }

      const response = await apiClient.post(endpoint, payload)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Recover deleted media (standalone or project-based)
   */
  const recoverDeletedMedia = async (projectId, proofingId, mediaIds) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/recover`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.post(endpoint, { mediaIds })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Check proofing status (public endpoint)
   */
  const checkProofingStatus = async proofingId => {
    try {
      const response = await apiClient.get(`/v1/public/proofing/${proofingId}/status`, {
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Verify password for proofing (public endpoint)
   */
  const verifyProofingPassword = async (proofingId, password) => {
    try {
      const response = await apiClient.post(
        `/v1/public/proofing/${proofingId}/verify-password`,
        { password },
        {
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Generate guest token for proofing (public endpoint)
   */
  const generateProofingToken = async (proofingId, email) => {
    try {
      const response = await apiClient.post(
        `/v1/public/proofing/${proofingId}/token`,
        { email },
        {
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get proofing (guest access)
   */
  const fetchPublicProofing = async (id, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/public/proofing/${id}`, {
        headers: {
          Authorization: `Bearer ${guestToken}`,
        },
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get media sets for proofing (guest access)
   */
  const fetchProofingSets = async (id, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/public/proofing/${id}/sets`, {
        headers: {
          Authorization: `Bearer ${guestToken}`,
        },
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get media set for proofing (guest access)
   */
  const fetchProofingMediaSet = async (id, setId, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/public/proofing/${id}/sets/${setId}`, {
        headers: {
          Authorization: `Bearer ${guestToken}`,
        },
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get media in proofing set (guest access)
   */
  const fetchProofingSetMedia = async (id, setId, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/public/proofing/${id}/sets/${setId}/media`, {
        headers: {
          Authorization: `Bearer ${guestToken}`,
        },
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Toggle selected status for proofing media (guest access)
   */
  const toggleProofingMediaSelected = async (id, mediaId, guestToken) => {
    try {
      const response = await apiClient.patch(
        `/v1/public/proofing/${id}/media/${mediaId}/toggle-selected`,
        {},
        {
          headers: {
            Authorization: `Bearer ${guestToken}`,
          },
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Complete proofing (guest access)
   */
  const completePublicProofing = async (id, guestToken) => {
    try {
      const response = await apiClient.post(
        `/v1/public/proofing/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${guestToken}`,
          },
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get selected filenames for proofing (guest access)
   */
  const getProofingSelectedFilenames = async (id, guestToken, setId = null) => {
    try {
      const queryParams = new URLSearchParams()
      if (setId) {
        queryParams.append('setId', setId)
      }
      const url = `/v1/public/proofing/${id}/filenames${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(url, {
        headers: {
          Authorization: `Bearer ${guestToken}`,
        },
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Approve media for proofing (guest access)
   */
  const approveProofingMedia = async (proofingId, mediaId, guestToken) => {
    try {
      const response = await apiClient.post(
        `/v1/public/proofing/${proofingId}/media/${mediaId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${guestToken}`,
          },
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  // ==================== Media Sets ====================

  /**
   * Fetch media sets for proofing
   */
  const fetchMediaSets = async (proofingId, projectId = null, params = {}) => {
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

      const endpoint = `/v1/memora/proofing/${proofingId}/sets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get single media set
   */
  const fetchMediaSet = async (proofingId, setId, projectId = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      const response = await apiClient.get(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create media set
   */
  const createMediaSet = async (proofingId, data, projectId = null) => {
    if (!proofingId) {
      throw new Error('Proofing ID is required to create a media set')
    }
    try {
      const createData = {
        name: data.name,
        description: data.description || null,
        order: data.order || 0,
      }

      let endpoint = `/v1/memora/proofing/${proofingId}/sets`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.post(endpoint, createData)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update media set
   */
  const updateMediaSet = async (proofingId, setId, data, projectId = null) => {
    if (!proofingId) {
      throw new Error('Proofing ID is required to update a media set')
    }
    if (!setId) {
      throw new Error('Set ID is required to update a media set')
    }
    try {
      const updateData = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.order !== undefined) updateData.order = data.order

      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.patch(endpoint, updateData)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete media set
   */
  const deleteMediaSet = async (proofingId, setId, projectId = null) => {
    if (!proofingId) {
      throw new Error('Proofing ID is required to delete a media set')
    }
    if (!setId) {
      throw new Error('Set ID is required to delete a media set')
    }
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      await apiClient.delete(endpoint)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reorder media sets
   */
  const reorderMediaSets = async (proofingId, setIds, projectId = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/reorder`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      const response = await apiClient.post(endpoint, { setIds: setIds })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  // ==================== Media Operations ====================

  /**
   * Get media in a set with optional sorting and pagination
   */
  const fetchSetMedia = async (proofingId, setId, projectId = null, params = {}) => {
    if (!proofingId) {
      throw new Error('Proofing ID is required to fetch media')
    }
    if (!setId) {
      throw new Error('Set ID is required to fetch media')
    }
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
      if (params.sortBy) {
        queryParams.append('sort_by', params.sortBy)
      }

      const endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Upload media to a set
   */
  const uploadMediaToSet = async (proofingId, setId, data, projectId = null) => {
    if (!proofingId) {
      throw new Error('Proofing ID is required to upload media')
    }
    if (!setId) {
      throw new Error('Set ID is required to upload media')
    }
    try {
      const payload = {
        user_file_uuid: data.userFileUuid || data.user_file_uuid,
      }

      if (!payload.user_file_uuid) {
        throw new Error('user_file_uuid is required')
      }

      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }

      const response = await apiClient.post(endpoint, payload)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete media from a set
   */
  const deleteMedia = async (proofingId, setId, mediaId, projectId = null) => {
    if (!proofingId) {
      throw new Error('Proofing ID is required to delete media')
    }
    if (!setId) {
      throw new Error('Set ID is required to delete media')
    }
    if (!mediaId) {
      throw new Error('Media ID is required to delete media')
    }
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/${mediaId}`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      const response = await apiClient.delete(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Rename media
   */
  const renameMedia = async (proofingId, setId, mediaId, filename, projectId = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/${mediaId}/rename`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      const response = await apiClient.patch(endpoint, { filename })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Replace media file
   */
  const replaceMedia = async (proofingId, setId, mediaId, userFileUuid, projectId = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/${mediaId}/replace`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      const response = await apiClient.patch(endpoint, { user_file_uuid: userFileUuid })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Move media items to a different set
   */
  const moveMediaToSet = async (proofingId, setId, mediaIds, targetSetId, projectId = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/move`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      const response = await apiClient.post(endpoint, {
        media_ids: mediaIds,
        target_set_uuid: targetSetId,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Copy media items to a different set
   */
  const copyMediaToSet = async (proofingId, setId, mediaIds, targetSetId, projectId = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/copy`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      const response = await apiClient.post(endpoint, {
        media_ids: mediaIds,
        target_set_uuid: targetSetId,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Toggle star for media
   */
  const starMedia = async (proofingId, setId, mediaId, projectId = null) => {
    try {
      let endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/${mediaId}/star`
      if (projectId) {
        endpoint += `?projectId=${projectId}`
      }
      const response = await apiClient.post(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Add feedback to media
   */
  const addMediaFeedback = async (
    proofingId,
    setId,
    mediaId,
    feedbackData,
    projectId = null,
    guestToken = null
  ) => {
    try {
      let endpoint
      let headers = {}

      // Use public endpoint if guest token is provided
      if (guestToken) {
        endpoint = `/v1/public/proofing/${proofingId}/sets/${setId}/media/${mediaId}/feedback`
        headers = {
          Authorization: `Bearer ${guestToken}`,
        }
      } else {
        endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/${mediaId}/feedback`
        if (projectId) {
          endpoint += `?projectId=${projectId}`
        }
      }

      const response = await apiClient.post(endpoint, feedbackData, {
        headers,
        skipAuth: !!guestToken, // Skip auth for guest token requests
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update feedback for media
   */
  const updateMediaFeedback = async (
    proofingId,
    setId,
    mediaId,
    feedbackId,
    content,
    projectId = null,
    guestToken = null
  ) => {
    try {
      let endpoint
      let headers = {}
      let skipAuth = false

      if (guestToken) {
        endpoint = `/v1/public/proofing/${proofingId}/sets/${setId}/media/${mediaId}/feedback/${feedbackId}`
        headers.Authorization = `Bearer ${guestToken}`
        skipAuth = true
      } else {
        endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/${mediaId}/feedback/${feedbackId}`
        if (projectId) {
          endpoint += `?projectId=${projectId}`
        }
      }

      const response = await apiClient.patch(endpoint, { content }, { headers, skipAuth })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete feedback for media
   */
  const deleteMediaFeedback = async (
    proofingId,
    setId,
    mediaId,
    feedbackId,
    projectId = null,
    guestToken = null
  ) => {
    try {
      let endpoint
      let headers = {}
      let skipAuth = false

      if (guestToken) {
        endpoint = `/v1/public/proofing/${proofingId}/sets/${setId}/media/${mediaId}/feedback/${feedbackId}`
        headers.Authorization = `Bearer ${guestToken}`
        skipAuth = true
      } else {
        endpoint = `/v1/memora/proofing/${proofingId}/sets/${setId}/media/${mediaId}/feedback/${feedbackId}`
        if (projectId) {
          endpoint += `?projectId=${projectId}`
        }
      }

      const response = await apiClient.delete(endpoint, { headers, skipAuth })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Download media
   */
  const downloadMedia = async mediaId => {
    try {
      const response = await apiClient.get(`/v1/selections/media/${mediaId}/download`, {
        responseType: 'blob',
      })
      const blob = response.data
      const contentDisposition = response.headers['content-disposition']
      const filenameMatch = contentDisposition?.match(/filename="?([^"]+)"?/)
      const filename = filenameMatch ? filenameMatch[1] : 'download'
      return { blob, filename }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get approved filenames for proofing
   * @param {string} id - Proofing ID
   * @param {string|null} setId - Optional Media Set ID to filter by set
   */
  const getApprovedFilenames = async (id, setId = null) => {
    try {
      const queryParams = new URLSearchParams()
      if (setId) {
        queryParams.append('setId', setId)
      }
      const url = `/v1/memora/proofing/${id}/approved-filenames${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create closure request
   */
  const createClosureRequest = async (proofingId, mediaId, todos) => {
    try {
      const response = await apiClient.post('/v1/memora/closure-requests', {
        proofing_id: proofingId,
        media_id: mediaId,
        todos: todos,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get closure request by token (public)
   */
  const getClosureRequest = async token => {
    try {
      const response = await apiClient.get(`/v1/public/closure-requests/${token}`, {
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Approve closure request (public)
   */
  const approveClosureRequest = async (token, email) => {
    try {
      const response = await apiClient.post(
        `/v1/public/closure-requests/${token}/approve`,
        { email },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reject closure request (public)
   */
  const rejectClosureRequest = async (token, email, reason = null) => {
    try {
      const response = await apiClient.post(
        `/v1/public/closure-requests/${token}/reject`,
        { email, reason },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get closure requests for a media item
   */
  const getMediaClosureRequests = async (mediaId, guestToken = null) => {
    try {
      if (guestToken) {
        // Use public endpoint with guest token
        const response = await apiClient.get(`/v1/public/media/${mediaId}/closure-requests`, {
          headers: {
            Authorization: `Bearer ${guestToken}`,
          },
          skipAuth: true,
        })
        return response.data
      } else {
        // Use authenticated endpoint
        const response = await apiClient.get(`/v1/memora/media/${mediaId}/closure-requests`)
        return response.data
      }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get media revisions
   */
  const getMediaRevisions = async (mediaId, guestToken = null) => {
    try {
      if (guestToken) {
        // Use public endpoint with guest token
        const response = await apiClient.get(`/v1/public/media/${mediaId}/revisions`, {
          headers: {
            Authorization: `Bearer ${guestToken}`,
          },
          skipAuth: true,
        })
        return response.data
      } else {
        // Use authenticated endpoint
        const response = await apiClient.get(`/v1/memora/media/${mediaId}/revisions`)
        return response.data
      }
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create an approval request (authenticated - creative only)
   */
  const createApprovalRequest = async (proofingId, mediaId, message = null) => {
    try {
      const response = await apiClient.post('/v1/memora/approval-requests', {
        proofing_id: proofingId,
        media_id: mediaId,
        message: message,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get approval request by token (public)
   */
  const getApprovalRequest = async token => {
    try {
      const response = await apiClient.get(`/v1/public/approval-requests/${token}`, {
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Approve approval request (public)
   */
  const approveApprovalRequest = async (token, email) => {
    try {
      const response = await apiClient.post(
        `/v1/public/approval-requests/${token}/approve`,
        { email },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reject approval request (public)
   */
  const rejectApprovalRequest = async (token, email, reason = null) => {
    try {
      const response = await apiClient.post(
        `/v1/public/approval-requests/${token}/reject`,
        { email, reason },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get approval requests for a media item
   */
  const getMediaApprovalRequests = async (mediaId, guestToken = null) => {
    try {
      if (guestToken) {
        // Use public endpoint with guest token
        const response = await apiClient.get(`/v1/public/media/${mediaId}/approval-requests`, {
          headers: {
            Authorization: `Bearer ${guestToken}`,
          },
          skipAuth: true,
        })
        return response.data
      } else {
        // Use authenticated endpoint
        const response = await apiClient.get(`/v1/memora/media/${mediaId}/approval-requests`)
        return response.data
      }
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    createProofing,
    fetchProofing,
    fetchAllProofing,
    updateProofing,
    deleteProofing,
    duplicateProofing,
    publishProofing,
    uploadRevision,
    addFeedback,
    markMediaCompleted,
    completeProofing,
    moveToCollection,
    toggleStar,
    setCoverPhoto,
    recoverDeletedMedia,
    // Media Sets
    fetchMediaSets,
    fetchMediaSet,
    createMediaSet,
    updateMediaSet,
    deleteMediaSet,
    reorderMediaSets,
    // Media Operations
    fetchSetMedia,
    uploadMediaToSet,
    deleteMedia,
    renameMedia,
    replaceMedia,
    moveMediaToSet,
    copyMediaToSet,
    starMedia,
    addMediaFeedback,
    updateMediaFeedback,
    deleteMediaFeedback,
    downloadMedia,
    getApprovedFilenames,
    // Closure Requests
    createClosureRequest,
    getClosureRequest,
    approveClosureRequest,
    rejectClosureRequest,
    getMediaClosureRequests,
    // Approval Requests
    createApprovalRequest,
    getApprovalRequest,
    approveApprovalRequest,
    rejectApprovalRequest,
    getMediaApprovalRequests,
    getMediaRevisions,
    // Public/Guest Access
    checkProofingStatus,
    verifyProofingPassword,
    generateProofingToken,
    fetchPublicProofing,
    fetchProofingSets,
    fetchProofingMediaSet,
    fetchProofingSetMedia,
    toggleProofingMediaSelected,
    completePublicProofing,
    getProofingSelectedFilenames,
    approveProofingMedia,
  }
}
