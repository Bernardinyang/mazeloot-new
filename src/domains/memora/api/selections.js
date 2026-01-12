/**
 * Selections API composable
 * Handles all selection-related API calls
 * Integrates with backend API
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'
import { API_CONFIG } from '@/shared/api/config'

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
   * @param {number} params.perPage - Items per page (default: 10)
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
        description:
          data.description !== null && data.description !== undefined
            ? data.description.trim() || null
            : null,
        project_uuid: data.projectUuid || data.project_uuid || null,
        status: data.status || 'active',
        color: data.color || '#8B5CF6', // Default accent, but use CSS classes in components
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
      const updateData = {}
      if (data.name !== undefined) updateData.name = data.name
      // Always include description if it's provided (even if null)
      // Note: We check !== undefined because null is a valid value we want to send
      if ('description' in data) {
        // If description is null, send null. If it's a string, trim it and send null if empty
        updateData.description =
          data.description === null || data.description === undefined
            ? null
            : String(data.description).trim() || null
      }
      if (data.status !== undefined) updateData.status = data.status
      if (data.color !== undefined) updateData.color = data.color
      if (data.coverPhotoUrl !== undefined || data.cover_photo_url !== undefined) {
        updateData.cover_photo_url = data.coverPhotoUrl || data.cover_photo_url
      }
      if (data.coverFocalPoint !== undefined || data.cover_focal_point !== undefined) {
        updateData.cover_focal_point = data.coverFocalPoint || data.cover_focal_point
      }
      if (data.password !== undefined) updateData.password = data.password
      if (data.allowedEmails !== undefined || data.allowed_emails !== undefined) {
        updateData.allowedEmails =
          data.allowedEmails !== undefined ? data.allowedEmails : data.allowed_emails
      }
      if (data.autoDeleteDate !== undefined) updateData.auto_delete_date = data.autoDeleteDate
      if (data.selectionLimit !== undefined || data.selection_limit !== undefined) {
        updateData.selection_limit =
          data.selectionLimit !== undefined ? data.selectionLimit : data.selection_limit
      }
      if (data.display_settings !== undefined || data.displaySettings !== undefined) {
        updateData.display_settings = data.display_settings || data.displaySettings
      }
      if (data.typographyDesign !== undefined) {
        updateData.typographyDesign = data.typographyDesign
      }

      const response = await apiClient.patch(`/v1/selections/${id}`, updateData)
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
   * Duplicate a selection
   */
  const duplicateSelection = async id => {
    try {
      const response = await apiClient.post(`/v1/selections/${id}/duplicate`)
      return response.data
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
   * Complete selection (works for both authenticated and guest access)
   * For guest access, guest token should be in headers
   */
  const completeSelection = async (id, mediaIds, guestToken = null) => {
    try {
      const headers = {}
      if (guestToken) {
        headers.Authorization = `Bearer ${guestToken}`
      }

      const endpoint = guestToken
        ? `/v1/public/selections/${id}/complete`
        : `/v1/selections/${id}/complete`

      const response = await apiClient.post(
        endpoint,
        {
          mediaIds: mediaIds || [],
        },
        {
          headers,
          skipAuth: !!guestToken, // Skip auth if using guest token
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
   * @param {string} id - Selection ID
   * @param {string|null} setId - Optional Media Set ID to filter by set
   */
  const getSelectedFilenames = async (id, setId = null) => {
    try {
      const queryParams = new URLSearchParams()
      if (setId) {
        queryParams.append('setId', setId)
      }
      const url = `/v1/selections/${id}/filenames${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Copy selected filenames (helper that gets and formats filenames)
   * @param {string} id - Selection ID
   * @param {string|null} setId - Optional Media Set ID to filter by set
   */
  const copyFilenames = async (id, setId = null) => {
    try {
      const result = await getSelectedFilenames(id, setId)
      return result.filenames || []
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reset selection limit
   * @param {string} id - Selection ID
   */
  const resetSelectionLimit = async id => {
    try {
      const response = await apiClient.post(`/v1/selections/${id}/reset-limit`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Set cover photo from media thumbnail URL
   * @param {string} selectionId - Selection ID
   * @param {string} mediaUuid - Media UUID
   */
  const setCoverPhotoFromMedia = async (selectionId, mediaUuid, focalPoint = null) => {
    try {
      const payload = {
        media_uuid: mediaUuid,
      }
      if (focalPoint) {
        payload.focal_point = focalPoint
      }
      const response = await apiClient.post(`/v1/selections/${selectionId}/cover-photo`, payload)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  // ==================== Media Sets ====================

  /**
   * Get all media sets for a selection
   */
  /**
   * Fetch media sets for a selection with optional pagination parameters
   * @param {string} selectionId - Selection ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}|Array>}
   */
  const fetchMediaSets = async (selectionId, params = {}) => {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) {
        queryParams.append('page', params.page.toString())
      }

      if (params.perPage) {
        queryParams.append('per_page', params.perPage.toString())
      }

      const endpoint = `/v1/selections/${selectionId}/sets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Fetch all starred media for the authenticated user
   * @param {Object} params - Query parameters
   * @param {string} params.sortBy - Sort field and direction (e.g., 'uploaded-desc', 'name-asc')
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}>}
   */
  const fetchStarredMedia = async (params = {}) => {
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

      const endpoint = `/v1/selections/media/starred${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Fetch all user media with optional sort and pagination parameters
   * @param {Object} params - Query parameters
   * @param {string} params.sortBy - Sort field and direction (e.g., 'uploaded-desc', 'name-asc')
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}>}
   */
  const fetchUserMedia = async (params = {}) => {
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

      const endpoint = `/v1/memora/media/user${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

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
      const { normalizeSelectionLimit } = await import('@/shared/utils/selectionLimit')
      const createData = {
        name: data.name,
        description: data.description || null,
        order: data.order || 0,
      }

      // Include selectionLimit if provided (including null to clear limit)
      if (data.selectionLimit !== undefined || data.selection_limit !== undefined) {
        const limit = data.selectionLimit !== undefined ? data.selectionLimit : data.selection_limit
        createData.selection_limit = normalizeSelectionLimit(limit)
      }

      const response = await apiClient.post(`/v1/selections/${selectionId}/sets`, createData)
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
      const updateData = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.order !== undefined) updateData.order = data.order

      // Always include selection_limit if it's provided in data (check for both camelCase and snake_case)
      if ('selectionLimit' in data || 'selection_limit' in data) {
        const { normalizeSelectionLimit } = await import('@/shared/utils/selectionLimit')
        const limit = data.selectionLimit !== undefined ? data.selectionLimit : data.selection_limit
        updateData.selection_limit = normalizeSelectionLimit(limit)
      }
      const response = await apiClient.patch(
        `/v1/selections/${selectionId}/sets/${setId}`,
        updateData
      )
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
   * Get media in a set with optional sorting and pagination
   * @param {string} selectionId - Selection ID
   * @param {string} setId - Set ID
   * @param {Object} params - Query parameters
   * @param {string} params.sortBy - Sort field and direction (e.g., 'uploaded-desc', 'name-asc', 'date-taken-desc')
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}|Array>}
   */
  const fetchSetMedia = async (selectionId, setId, params = {}) => {
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

      const endpoint = `/v1/selections/${selectionId}/sets/${setId}/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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
   * Delete media directly (without selection/set context)
   */
  const deleteMediaDirect = async mediaId => {
    try {
      const response = await apiClient.delete(`/v1/memora/media/${mediaId}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Rename media by updating the filename
   * @param {string} selectionId - Selection ID
   * @param {string} setId - Set ID
   * @param {string} mediaId - Media ID
   * @param {string} filename - New filename
   */
  const renameMedia = async (selectionId, setId, mediaId, filename) => {
    try {
      const response = await apiClient.patch(
        `/v1/selections/${selectionId}/sets/${setId}/media/${mediaId}/rename`,
        {
          filename,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Replace media file by updating the user_file_uuid
   * @param {string} selectionId - Selection ID
   * @param {string} setId - Set ID
   * @param {string} mediaId - Media ID
   * @param {string} userFileUuid - New UserFile UUID
   */
  const replaceMedia = async (selectionId, setId, mediaId, userFileUuid) => {
    try {
      const response = await apiClient.patch(
        `/v1/selections/${selectionId}/sets/${setId}/media/${mediaId}/replace`,
        {
          user_file_uuid: userFileUuid,
        }
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
   * Toggle star status for a media item
   * @param {string} selectionId - Selection ID
   * @param {string} setId - Set ID
   * @param {string} mediaId - Media ID
   */
  const starMedia = async (selectionId, setId, mediaId) => {
    try {
      const response = await apiClient.post(
        `/v1/selections/${selectionId}/sets/${setId}/media/${mediaId}/star`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Toggle star status for a media item (direct, without selection/set context)
   * @param {string} mediaId - Media ID
   */
  const starMediaDirect = async mediaId => {
    try {
      const response = await apiClient.post(`/v1/memora/media/${mediaId}/toggle-star`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Toggle creative pre-selection status for a media item
   * @param {string} selectionId - Selection ID
   * @param {string} setId - Media Set ID
   * @param {string} mediaId - Media ID
   */
  const toggleCreativeSelected = async (selectionId, setId, mediaId) => {
    try {
      const response = await apiClient.post(
        `/v1/selections/${selectionId}/sets/${setId}/media/${mediaId}/toggle-creative-selected`
      )
      return response.data?.data || response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Apply watermark to media
   */
  const applyWatermarkToMedia = async (selectionId, setId, mediaId, watermarkUuid, previewStyle = true) => {
    try {
      const response = await apiClient.post(
        `/v1/selections/${selectionId}/sets/${setId}/media/${mediaId}/watermark`,
        { watermarkUuid, previewStyle }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Remove watermark from media
   */
  const removeWatermarkFromMedia = async (selectionId, setId, mediaId) => {
    try {
      const response = await apiClient.delete(
        `/v1/selections/${selectionId}/sets/${setId}/media/${mediaId}/watermark`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Toggle featured status for media
   */
  const toggleFeatured = async mediaId => {
    try {
      const response = await apiClient.post(`/v1/memora/media/${mediaId}/toggle-featured`)
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

  // ==================== Guest Access ====================

  /**
   * Generate guest token for a selection
   */
  /**
   * Verify password for a public selection
   */
  const verifyPassword = async (selectionId, password) => {
    try {
      const response = await apiClient.post(
        `/v1/public/selections/${selectionId}/verify-password`,
        { password },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const checkSelectionStatus = async selectionId => {
    try {
      const response = await apiClient.get(`/v1/public/selections/${selectionId}/status`, {
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const generateGuestToken = async (selectionId, email) => {
    try {
      const response = await apiClient.post(
        `/v1/public/selections/${selectionId}/token`,
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
      const response = await apiClient.get(`/v1/public/selections/${id}`, {
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
      const response = await apiClient.get(`/v1/public/selections/${id}/sets`, {
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
      const response = await apiClient.get(`/v1/public/selections/${id}/sets/${setId}`, {
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
      const response = await apiClient.get(`/v1/public/selections/${id}/sets/${setId}/media`, {
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
   * Toggle selected status for media (guest access)
   */
  const toggleSelectedGuest = async (id, mediaId, guestToken) => {
    try {
      const response = await apiClient.patch(
        `/v1/public/selections/${id}/media/${mediaId}/toggle-selected`,
        {},
        {
          headers: {
            Authorization: `Bearer ${guestToken}`,
          },
          skipAuth: true, // Using guest token instead
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get selected filenames (guest access)
   */
  const getSelectedFilenamesGuest = async (id, guestToken, setId = null) => {
    try {
      const queryParams = new URLSearchParams()
      if (setId) {
        queryParams.append('setId', setId)
      }
      const url = `/v1/public/selections/${id}/filenames${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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

  return {
    // Selection CRUD
    fetchAllSelections,
    fetchSelection,
    createSelection,
    updateSelection,
    deleteSelection,
    toggleStarSelection,
    duplicateSelection,
    publishSelection,
    completeSelection,
    recoverDeletedMedia,
    getSelectedMedia,
    getSelectedFilenames,
    copyFilenames,
    resetSelectionLimit,
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
    fetchStarredMedia,
    fetchUserMedia,
    uploadMediaToSet,
    deleteMedia,
    deleteMediaDirect,
    renameMedia,
    replaceMedia,
    moveMediaToSet,
    copyMediaToSet,
    starMedia,
    starMediaDirect,
    toggleCreativeSelected,
    applyWatermarkToMedia,
    removeWatermarkFromMedia,
    downloadMedia,
    toggleFeatured,

    // Guest Access
    checkSelectionStatus,
    verifyPassword,
    generateGuestToken,
    fetchSelectionGuest,
    fetchMediaSetsGuest,
    fetchMediaSetGuest,
    fetchSetMediaGuest,
    toggleSelectedGuest,
    getSelectedFilenamesGuest,
  }
}
