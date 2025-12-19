/**
 * Selections API composable
 * Handles all selection-related API calls
 * Integrates with backend API
 */

import { apiClient } from '@/api/client'
import { parseError } from '@/utils/errors'

export function useSelectionsApi() {
  /**
   * Fetch all selections (optionally filtered by project_uuid)
   */
  const fetchAllSelections = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.projectUuid) {
        queryParams.append('project_uuid', params.projectUuid)
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
   * Get media in a set
   */
  const fetchSetMedia = async (selectionId, setId) => {
    try {
      const response = await apiClient.get(`/v1/selections/${selectionId}/sets/${setId}/media`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Upload media to a set
   */
  const uploadMediaToSet = async (selectionId, setId, data) => {
    try {
      const payload = {
        filename: data.filename,
        mimeType: data.mimeType,
        size: data.size,
        type: data.type || 'image',
        width: data.width || null,
        height: data.height || null,
        thumbnail: data.thumbnail || null,
      }

      // Prefer userFileUuid if available, otherwise use uploadUrl
      if (data.userFileUuid) {
        payload.userFileUuid = data.userFileUuid
      } else {
        payload.uploadUrl = data.uploadUrl
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
    publishSelection,
    completeSelection,
    recoverDeletedMedia,
    getSelectedMedia,
    getSelectedFilenames,
    copyFilenames,

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
    addMediaFeedback,

    // Guest Access
    generateGuestToken,
    fetchSelectionGuest,
    fetchMediaSetsGuest,
    fetchMediaSetGuest,
    fetchSetMediaGuest,
  }
}
