/**
 * Raw Files API composable
 * Handles all raw file-related API calls
 * Integrates with backend API
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'
import { API_CONFIG } from '@/shared/api/config'

export function useRawFilesApi() {
  /**
   * Fetch all raw files with optional search, sort, filter, and pagination parameters
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
  const fetchAllRawFiles = async (params = {}) => {
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

      const endpoint = `/v1/raw-files${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Fetch raw file by ID
   */
  const fetchRawFile = async id => {
    try {
      const response = await apiClient.get(`/v1/raw-files/${id}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchStorage = async id => {
    try {
      const response = await apiClient.get(`/v1/raw-files/${id}/storage`)
      return response.data?.storageUsedBytes ?? 0
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create raw file (standalone or project-based)
   */
  const createRawFile = async data => {
    try {
      const response = await apiClient.post('/v1/raw-files', {
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
   * Update raw file
   */
  const updateRawFile = async (id, data) => {
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
      if (data.rawFileLimit !== undefined || data.raw_file_limit !== undefined) {
        updateData.raw_file_limit =
          data.rawFileLimit !== undefined ? data.rawFileLimit : data.raw_file_limit
      }
      if (data.display_settings !== undefined || data.displaySettings !== undefined) {
        updateData.display_settings = data.display_settings || data.displaySettings
      }
      if (data.typographyDesign !== undefined) {
        updateData.typographyDesign = data.typographyDesign
      }
      if (data.galleryAssist !== undefined) {
        updateData.galleryAssist = data.galleryAssist
      }
      if (data.download !== undefined) {
        updateData.download = data.download
      }
      if (data.downloadEnabled !== undefined) {
        updateData.downloadEnabled = data.downloadEnabled
      }

      const response = await apiClient.patch(`/v1/raw-files/${id}`, updateData)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete raw file
   */
  const deleteRawFile = async id => {
    try {
      await apiClient.delete(`/v1/raw-files/${id}`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Star raw file
   */
  const toggleStarRawFile = async id => {
    try {
      await apiClient.post(`/v1/raw-files/${id}/star`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Duplicate a raw file
   */
  const duplicateRawFile = async id => {
    try {
      const response = await apiClient.post(`/v1/raw-files/${id}/duplicate`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Publish raw file (creative can only publish to active)
   */
  const publishRawFile = async id => {
    try {
      const response = await apiClient.post(`/v1/raw-files/${id}/publish`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Complete raw file (works for both authenticated and guest access)
   * For guest access, guest token should be in headers
   */
  const completeRawFile = async (id, mediaIds, guestToken = null) => {
    try {
      const headers = {}
      if (guestToken) {
        headers.Authorization = `Bearer ${guestToken}`
      }

      const endpoint = guestToken
        ? `/v1/public/raw-files/${id}/complete`
        : `/v1/raw-files/${id}/complete`

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
      const response = await apiClient.post(`/v1/raw-files/${id}/recover`, {
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

      const endpoint = `/v1/raw-files/${id}/selected${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get selected filenames
   * @param {string} id - Raw File ID
   * @param {string|null} setId - Optional Media Set ID to filter by set
   */
  const getSelectedFilenames = async (id, setId = null) => {
    try {
      const queryParams = new URLSearchParams()
      if (setId) {
        queryParams.append('setId', setId)
      }
      const url = `/v1/raw-files/${id}/filenames${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(url)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Copy selected filenames (helper that gets and formats filenames)
   * @param {string} id - Raw File ID
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
   * @param {string} id - Raw File ID
   */
  const resetRawFileLimit = async id => {
    try {
      const response = await apiClient.post(`/v1/raw-files/${id}/reset-limit`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Set cover photo from media thumbnail URL
   * @param {string} rawFileId - Raw File ID
   * @param {string} mediaUuid - Media UUID
   */
  const setCoverPhotoFromMedia = async (rawFileId, mediaUuid, focalPoint = null) => {
    try {
      const payload = {
        media_uuid: mediaUuid,
      }
      if (focalPoint) {
        payload.focal_point = focalPoint
      }
      const response = await apiClient.post(`/v1/raw-files/${rawFileId}/cover-photo`, payload)
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
   * @param {string} rawFileId - Raw File ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}|Array>}
   */
  const fetchMediaSets = async (rawFileId, params = {}) => {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) {
        queryParams.append('page', params.page.toString())
      }

      if (params.perPage) {
        queryParams.append('per_page', params.perPage.toString())
      }

      const endpoint = `/v1/raw-files/${rawFileId}/sets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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

      const endpoint = `/v1/raw-files/media/starred${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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
  const fetchMediaSet = async (rawFileId, setId) => {
    try {
      const response = await apiClient.get(`/v1/raw-files/${rawFileId}/sets/${setId}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create media set
   */
  const createMediaSet = async (rawFileId, data) => {
    try {
      const { normalizeRawFileLimit } = await import('@/domains/memora/utils/rawFileLimit')
      const createData = {
        name: data.name,
        description: data.description || null,
        order: data.order || 0,
      }

      // Include selectionLimit if provided (including null to clear limit)
      // Note: Media sets use selection_limit column even for raw files
      if (data.selectionLimit !== undefined || data.rawFileLimit !== undefined || data.raw_file_limit !== undefined || data.selection_limit !== undefined) {
        const limit = data.selectionLimit ?? data.rawFileLimit ?? data.raw_file_limit ?? data.selection_limit ?? null
        createData.selection_limit = normalizeRawFileLimit(limit)
      }

      const response = await apiClient.post(`/v1/raw-files/${rawFileId}/sets`, createData)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update media set
   */
  const updateMediaSet = async (rawFileId, setId, data) => {
    try {
      const updateData = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.order !== undefined) updateData.order = data.order

      // Always include selection_limit if it's provided in data (check for both camelCase and snake_case)
      // Note: Media sets use selection_limit column even for raw files
      if ('selectionLimit' in data || 'rawFileLimit' in data || 'raw_file_limit' in data || 'selection_limit' in data) {
        const { normalizeRawFileLimit } = await import('@/domains/memora/utils/rawFileLimit')
        const limit = data.selectionLimit ?? data.rawFileLimit ?? data.raw_file_limit ?? data.selection_limit ?? null
        updateData.selection_limit = normalizeRawFileLimit(limit)
      }
      const response = await apiClient.patch(
        `/v1/raw-files/${rawFileId}/sets/${setId}`,
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
  const deleteMediaSet = async (rawFileId, setId) => {
    try {
      await apiClient.delete(`/v1/raw-files/${rawFileId}/sets/${setId}`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reorder media sets
   */
  const reorderMediaSets = async (rawFileId, setIds) => {
    try {
      const response = await apiClient.post(`/v1/raw-files/${rawFileId}/sets/reorder`, {
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
   * @param {string} rawFileId - Raw File ID
   * @param {string} setId - Set ID
   * @param {Object} params - Query parameters
   * @param {string} params.sortBy - Sort field and direction (e.g., 'uploaded-desc', 'name-asc', 'date-taken-desc')
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.perPage - Items per page (default: 10)
   * @returns {Promise<{data: Array, pagination: {page: number, limit: number, total: number, totalPages: number}}|Array>}
   */
  const fetchSetMedia = async (rawFileId, setId, params = {}) => {
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

      const endpoint = `/v1/raw-files/${rawFileId}/sets/${setId}/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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
  const uploadMediaToSet = async (rawFileId, setId, data) => {
    try {
      // Only send user_file_uuid - backend will get all metadata from UserFile
      const payload = {
        user_file_uuid: data.userFileUuid || data.user_file_uuid,
      }

      if (!payload.user_file_uuid) {
        throw new Error('user_file_uuid is required')
      }

      const response = await apiClient.post(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media`,
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
  const deleteMedia = async (rawFileId, setId, mediaId) => {
    try {
      const response = await apiClient.delete(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/${mediaId}`
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
   * @param {string} rawFileId - Raw File ID
   * @param {string} setId - Set ID
   * @param {string} mediaId - Media ID
   * @param {string} filename - New filename
   */
  const renameMedia = async (rawFileId, setId, mediaId, filename) => {
    try {
      const response = await apiClient.patch(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/${mediaId}/rename`,
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
   * @param {string} rawFileId - Raw File ID
   * @param {string} setId - Set ID
   * @param {string} mediaId - Media ID
   * @param {string} userFileUuid - New UserFile UUID
   */
  const replaceMedia = async (rawFileId, setId, mediaId, userFileUuid) => {
    try {
      const response = await apiClient.patch(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/${mediaId}/replace`,
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
   * @param {string} rawFileId - Raw File ID
   * @param {string} setId - Source set ID
   * @param {Array<string>} mediaUuids - Array of media UUIDs to move
   * @param {string} targetSetUuid - Target set UUID
   */
  const moveMediaToSet = async (rawFileId, setId, mediaUuids, targetSetUuid) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/move`,
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
   * @param {string} rawFileId - Raw File ID
   * @param {string} setId - Source set ID
   * @param {Array<string>} mediaUuids - Array of media UUIDs to copy
   * @param {string} targetSetUuid - Target set UUID
   */
  const copyMediaToSet = async (rawFileId, setId, mediaUuids, targetSetUuid) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/copy`,
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
   * @param {string} rawFileId - Raw File ID
   * @param {string} setId - Set ID
   * @param {string} mediaId - Media ID
   */
  const starMedia = async (rawFileId, setId, mediaId) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/${mediaId}/star`
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
   * Toggle recommended status for a media item in a selection set
   * @param {string} rawFileId - Raw File ID
   * @param {string} setId - Set ID
   * @param {string} mediaId - Media ID
   */
  const toggleRecommended = async (rawFileId, setId, mediaId) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/${mediaId}/recommend`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Apply watermark to media
   */
  const applyWatermarkToMedia = async (rawFileId, setId, mediaId, watermarkUuid, previewStyle = true) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/${mediaId}/watermark`,
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
  const removeWatermarkFromMedia = async (rawFileId, setId, mediaId) => {
    try {
      const response = await apiClient.delete(
        `/v1/raw-files/${rawFileId}/sets/${setId}/media/${mediaId}/watermark`
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
  const downloadMedia = async (mediaUuid, downloadPin = null) => {
    try {
      const endpoint = `/v1/raw-files/media/${mediaUuid}/download`
      const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`
      const authHeader = apiClient.getAuthHeader()
      
      const headers = {
        Authorization: authHeader || '',
      }
      
      // Add download PIN if provided
      if (downloadPin) {
        headers['X-Download-PIN'] = downloadPin
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
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
   * Generate guest token for a raw file
   */
  /**
   * Verify download PIN for a raw file
   */
  const verifyDownloadPin = async (rawFileId, pin) => {
    try {
      const response = await apiClient.post(
        `/v1/public/raw-files/${rawFileId}/verify-download-pin`,
        { pin },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Verify password for a public raw file
   */
  const verifyPassword = async (rawFileId, password) => {
    try {
      const response = await apiClient.post(
        `/v1/public/raw-files/${rawFileId}/verify-password`,
        { password },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const checkRawFileStatus = async rawFileId => {
    try {
      const response = await apiClient.get(`/v1/public/raw-files/${rawFileId}/status`, {
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const generateGuestToken = async (rawFileId, email) => {
    try {
      const response = await apiClient.post(
        `/v1/public/raw-files/${rawFileId}/token`,
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
   * Get raw file (guest access)
   */
  const fetchRawFileGuest = async (id, guestToken) => {
    try {
      const response = await apiClient.get(`/v1/public/raw-files/${id}`, {
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
      const response = await apiClient.get(`/v1/public/raw-files/${id}/sets`, {
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
      const response = await apiClient.get(`/v1/public/raw-files/${id}/sets/${setId}`, {
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
      const response = await apiClient.get(`/v1/public/raw-files/${id}/sets/${setId}/media`, {
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
        `/v1/public/raw-files/${id}/media/${mediaId}/toggle-selected`,
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
      const url = `/v1/public/raw-files/${id}/filenames${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
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
    // Raw File CRUD
    fetchAllRawFiles,
    fetchRawFile,
    fetchStorage,
    createRawFile,
    updateRawFile,
    deleteRawFile,
    toggleStarRawFile,
    duplicateRawFile,
    publishRawFile,
    completeRawFile,
    recoverDeletedMedia,
    getSelectedMedia,
    getSelectedFilenames,
    copyFilenames,
    resetRawFileLimit,
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
    toggleRecommended,
    applyWatermarkToMedia,
    removeWatermarkFromMedia,
    downloadMedia,
    verifyDownloadPin,
    toggleFeatured,

    // Guest Access
    checkRawFileStatus,
    verifyPassword,
    generateGuestToken,
    fetchRawFileGuest,
    fetchMediaSetsGuest,
    fetchMediaSetGuest,
    fetchSetMediaGuest,
    toggleSelectedGuest,
    getSelectedFilenamesGuest,
  }
}
