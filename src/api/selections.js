/**
 * Selections API composable
 * Handles all selection-related API calls
 * Integrates with backend API
 */

import { apiClient } from '@/api/client'
import { parseError } from '@/utils/errors'
import { API_CONFIG } from '@/api/config'

export function useSelectionsApi() {
  /**
   * Fetch all selections with optional search, sort, filter, and pagination parameters
   * @param {Object} params - Query parameters
   * @param {string} params.projectUuid - Filter by project UUID
   * @param {string} params.search - Search query (searches in name)
   * @param {string} params.sortBy - Sort field and direction (e.g., 'created-desc', 'name-asc', 'status-asc')
   * @param {string} params.status - Filter by status (e.g., 'draft', 'completed')
   * @param {boolean} params.starred - Filter by starred status
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 50)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}>}
   */
  const fetchAllSelections = async (params = {}) => {
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

      const endpoint = `/v1/selections${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Fetch selection by ID
   */
  const fetchSelection = async id => {
    try {
      const response = await apiClient.get(`/v1/selections/${id}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create selection (standalone or project-based)
   */
  const createSelection = async data => {
    try {
      const response = await apiClient.post('/v1/selections', {
        name: data.name,
        project_uuid: data.projectUuid || data.project_uuid || null,
        status: data.status || 'active',
        color: data.color || '#10B981',
        cover_photo_url: data.coverPhotoUrl || data.cover_photo_url || null,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update selection
   */
  const updateSelection = async (id, data) => {
    try {
      const response = await apiClient.patch(`/v1/selections/${id}`, {
        name: data.name,
        status: data.status,
        color: data.color,
        cover_photo_url: data.coverPhotoUrl || data.cover_photo_url,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete selection
   */
  const deleteSelection = async id => {
    try {
      await apiClient.delete(`/v1/selections/${id}`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Star selection
   */
  const toggleStarSelection = async id => {
    try {
      await apiClient.post(`/v1/selections/${id}/star`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Publish selection (creative can only publish to active)
   */
  const publishSelection = async id => {
    try {
      const response = await apiClient.post(`/v1/selections/${id}/publish`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Complete selection (guest access - marks media as selected and completes)
   */
  const completeSelection = async (id, mediaIds) => {
    try {
      const response = await apiClient.post(
        `/v1/guest/selections/${id}/complete`,
        {
          mediaIds: mediaIds || [],
        },
        {
          skipAuth: true, // Guest token is handled via middleware
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Recover deleted media
   */
  const recoverDeletedMedia = async (id, mediaIds) => {
    try {
      const response = await apiClient.post(`/v1/selections/${id}/recover`, {
        mediaIds: mediaIds || [],
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get selected media
   */
  const getSelectedMedia = async (id, setId = null) => {
    try {
      const queryParams = new URLSearchParams()
      if (setId) {
        queryParams.append('setId', setId)
      }

      const endpoint = `/v1/selections/${id}/selected${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get selected filenames
   */
  const getSelectedFilenames = async id => {
    try {
      const response = await apiClient.get(`/v1/selections/${id}/filenames`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Copy selected filenames (helper that gets and formats filenames)
   */
  const copyFilenames = async id => {
    try {
      const result = await getSelectedFilenames(id)
      return result.filenames || []
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Set cover photo from media thumbnail URL
   * @param {string} selectionId - Selection ID
   * @param {string} mediaUuid - Media UUID
   */
  const setCoverPhotoFromMedia = async (selectionId, mediaUuid) => {
    try {
      const response = await apiClient.post(`/v1/selections/${selectionId}/cover-photo`, {
        media_uuid: mediaUuid,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  // ==================== Media Sets ====================

  /**
   * Get all media sets for a selection
   */
  const fetchMediaSets = async selectionId => {
    try {
      const response = await apiClient.get(`/v1/selections/${selectionId}/sets`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get single media set
   */
  const fetchMediaSet = async (selectionId, setId) => {
    try {
      const response = await apiClient.get(`/v1/selections/${selectionId}/sets/${setId}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create media set
   */
  const createMediaSet = async (selectionId, data) => {
    try {
      const response = await apiClient.post(`/v1/selections/${selectionId}/sets`, {
        name: data.name,
        description: data.description || null,
        order: data.order || 0,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update media set
   */
  const updateMediaSet = async (selectionId, setId, data) => {
    try {
      const response = await apiClient.patch(`/v1/selections/${selectionId}/sets/${setId}`, {
        name: data.name,
        description: data.description,
        order: data.order,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete media set
   */
  const deleteMediaSet = async (selectionId, setId) => {
    try {
      await apiClient.delete(`/v1/selections/${selectionId}/sets/${setId}`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reorder media sets
   */
  const reorderMediaSets = async (selectionId, setIds) => {
    try {
      const response = await apiClient.post(`/v1/selections/${selectionId}/sets/reorder`, {
        setIds: setIds,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  // ==================== Media ====================

  /**
   * Get media in a set with optional sorting
   * @param {string} selectionId - Selection ID
   * @param {string} setId - Set ID
   * @param {Object} params - Query parameters
   * @param {string} params.sortBy - Sort field and direction (e.g., 'uploaded-desc', 'name-asc', 'date-taken-desc')
   */
  const fetchSetMedia = async (selectionId, setId, params = {}) => {
    try {
      const queryParams = new URLSearchParams()

      if (params.sortBy) {
        queryParams.append('sort_by', params.sortBy)
      }

      const endpoint = `/v1/selections/${selectionId}/sets/${setId}/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Upload media to a set
   * Only requires user_file_uuid - all metadata comes from UserFile relationship
   */
  const uploadMediaToSet = async (selectionId, setId, data) => {
    try {
      // Only send user_file_uuid - backend will get all metadata from UserFile
      const payload = {
        user_file_uuid: data.userFileUuid || data.user_file_uuid,
      }

      if (!payload.user_file_uuid) {
        throw new Error('user_file_uuid is required')
      }

      const response = await apiClient.post(
        `/v1/selections/${selectionId}/sets/${setId}/media`,
        payload
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete media from a set
   */
  const deleteMedia = async (selectionId, setId, mediaId) => {
    try {
      const response = await apiClient.delete(
        `/v1/selections/${selectionId}/sets/${setId}/media/${mediaId}`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Move media items to a different set
   * @param {string} selectionId - Selection ID
   * @param {string} setId - Source set ID
   * @param {Array<string>} mediaUuids - Array of media UUIDs to move
   * @param {string} targetSetUuid - Target set UUID
   */
  const moveMediaToSet = async (selectionId, setId, mediaUuids, targetSetUuid) => {
    try {
      const response = await apiClient.post(
        `/v1/selections/${selectionId}/sets/${setId}/media/move`,
        {
          media_uuids: mediaUuids,
          target_set_uuid: targetSetUuid,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Copy media items to a different set
   * @param {string} selectionId - Selection ID
   * @param {string} setId - Source set ID
   * @param {Array<string>} mediaUuids - Array of media UUIDs to copy
   * @param {string} targetSetUuid - Target set UUID
   */
  const copyMediaToSet = async (selectionId, setId, mediaUuids, targetSetUuid) => {
    try {
      const response = await apiClient.post(
        `/v1/selections/${selectionId}/sets/${setId}/media/copy`,
        {
          media_uuids: mediaUuids,
          target_set_uuid: targetSetUuid,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Download media file by UUID
   * Returns a blob that can be downloaded
   */
  const downloadMedia = async mediaUuid => {
    try {
      const endpoint = `/v1/selections/media/${mediaUuid}/download`
      const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`
      const authHeader = apiClient.getAuthHeader()

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: authHeader || '',
        },
      })

      if (!response.ok) {
        // Try to parse error as JSON, fallback to text
        let errorData = {}
        try {
          const contentType = response.headers.get('content-type')
          if (contentType?.includes('application/json')) {
            errorData = await response.json()
          } else {
            const text = await response.text()
            errorData = { message: text || `Download failed with status ${response.status}` }
          }
        } catch {
          errorData = { message: `Download failed with status ${response.status}` }
        }

        throw {
          message:
            errorData.message ||
            errorData.error ||
            `Download failed with status ${response.status}`,
          code: errorData.code,
          status: response.status,
        }
      }

      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `media-${mediaUuid}`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
          // Decode URI if needed
          try {
            filename = decodeURIComponent(filename)
          } catch {
            // Keep original if decode fails
          }
        }
      }

      const blob = await response.blob()
      return { blob, filename }
    } catch (error) {
      // If it's already a parsed error, re-throw it
      if (error.status !== undefined || error.code) {
        throw error
      }
      throw parseError(error)
    }
  }

  /**
   * Add feedback to media
   */
  const addMediaFeedback = async (selectionId, setId, mediaId, data) => {
    try {
      const response = await apiClient.post(
        `/v1/selections/${selectionId}/sets/${setId}/media/${mediaId}/feedback`,
        {
          type: data.type,
          content: data.content,
          createdBy: data.createdBy || null,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  // ==================== Guest Access ====================

  /**
   * Generate guest token for a selection
   */
  const generateGuestToken = async (selectionId, email) => {
    try {
      const response = await apiClient.post(
        `/v1/selections/${selectionId}/guest-token`,
        {
          email: email,
        },
        {
          skipAuth: true, // Public endpoint
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get selection (guest access)
   */
  const fetchSelectionGuest = async (id, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/guest/selections/${id}`, {
        headers: {
          Authorization: `Bearer ${guestToken}`,
        },
        skipAuth: true, // Using guest token instead
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get media sets (guest access)
   */
  const fetchMediaSetsGuest = async (id, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/guest/selections/${id}/sets`, {
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
   * Get media set (guest access)
   */
  const fetchMediaSetGuest = async (id, setId, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/guest/selections/${id}/sets/${setId}`, {
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
   * Get media in set (guest access)
   */
  const fetchSetMediaGuest = async (id, setId, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/guest/selections/${id}/sets/${setId}/media`, {
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

  return {
    // Selection CRUD
    fetchAllSelections,
    fetchSelection,
    createSelection,
    updateSelection,
    deleteSelection,
    toggleStarSelection,
    publishSelection,
    completeSelection,
    recoverDeletedMedia,
    getSelectedMedia,
    getSelectedFilenames,
    copyFilenames,
    setCoverPhotoFromMedia,

    // Media Sets
    fetchMediaSets,
    fetchMediaSet,
    createMediaSet,
    updateMediaSet,
    deleteMediaSet,
    reorderMediaSets,

    // Media
    fetchSetMedia,
    uploadMediaToSet,
    deleteMedia,
    moveMediaToSet,
    copyMediaToSet,
    addMediaFeedback,
    downloadMedia,

    // Guest Access
    generateGuestToken,
    fetchSelectionGuest,
    fetchMediaSetsGuest,
    fetchMediaSetGuest,
    fetchSetMediaGuest,
  }
}
