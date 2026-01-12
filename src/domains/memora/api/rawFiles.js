/**
 * Raw Files API composable
 * Handles all raw files phase-related API calls
 * Integrates with backend API
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'
import { API_CONFIG } from '@/shared/api/config'

export function useRawFilesApi() {
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

  const fetchRawFiles = async id => {
    try {
      const response = await apiClient.get(`/v1/raw-files/${id}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const createRawFiles = async data => {
    try {
      const payload = {
        name: data.name,
        description:
          data.description !== null && data.description !== undefined
            ? data.description.trim() || null
            : null,
        project_uuid: data.projectUuid || data.project_uuid || null,
        color: data.color || '#3B82F6',
      }
      if (data.status) {
        payload.status = data.status
      }
      if (data.coverPhotoUrl || data.cover_photo_url) {
        payload.cover_photo_url = data.coverPhotoUrl || data.cover_photo_url
      }
      const response = await apiClient.post('/v1/raw-files', payload)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updateRawFiles = async (id, data) => {
    try {
      const updateData = {}
      if (data.name !== undefined) updateData.name = data.name
      if ('description' in data) {
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
      if (data.settings !== undefined) updateData.settings = data.settings
      if (data.typographyDesign !== undefined) {
        updateData.typographyDesign = data.typographyDesign
      }
      if (data.downloadPin !== undefined) updateData.downloadPin = data.downloadPin
      if (data.downloadPinEnabled !== undefined) updateData.downloadPinEnabled = data.downloadPinEnabled
      if (data.limitDownloads !== undefined) updateData.limitDownloads = data.limitDownloads
      if (data.downloadLimit !== undefined) updateData.downloadLimit = data.downloadLimit

      const response = await apiClient.patch(`/v1/raw-files/${id}`, updateData)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const deleteRawFiles = async id => {
    try {
      await apiClient.delete(`/v1/raw-files/${id}`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  const toggleStarRawFiles = async id => {
    try {
      await apiClient.post(`/v1/raw-files/${id}/star`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  const duplicateRawFiles = async id => {
    try {
      const response = await apiClient.post(`/v1/raw-files/${id}/duplicate`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const publishRawFiles = async id => {
    try {
      const response = await apiClient.post(`/v1/raw-files/${id}/publish`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const setCoverPhotoFromMedia = async (rawFilesId, mediaUuid, focalPoint = null) => {
    try {
      const payload = {
        media_uuid: mediaUuid,
      }
      if (focalPoint) {
        payload.focal_point = focalPoint
      }
      const response = await apiClient.post(`/v1/raw-files/${rawFilesId}/cover-photo`, payload)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  // ==================== Media Sets ====================

  const fetchMediaSets = async (rawFilesId, params = {}) => {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) {
        queryParams.append('page', params.page.toString())
      }

      if (params.perPage) {
        queryParams.append('per_page', params.perPage.toString())
      }

      const endpoint = `/v1/raw-files/${rawFilesId}/sets${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchMediaSet = async (rawFilesId, setId) => {
    try {
      const response = await apiClient.get(`/v1/raw-files/${rawFilesId}/sets/${setId}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const createMediaSet = async (rawFilesId, data) => {
    try {
      const createData = {
        name: data.name,
        description: data.description || null,
        order: data.order || 0,
      }

      const response = await apiClient.post(`/v1/raw-files/${rawFilesId}/sets`, createData)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const updateMediaSet = async (rawFilesId, setId, data) => {
    try {
      const updateData = {}
      if (data.name !== undefined) updateData.name = data.name
      if (data.description !== undefined) updateData.description = data.description
      if (data.order !== undefined) updateData.order = data.order

      const response = await apiClient.patch(
        `/v1/raw-files/${rawFilesId}/sets/${setId}`,
        updateData
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const deleteMediaSet = async (rawFilesId, setId) => {
    try {
      await apiClient.delete(`/v1/raw-files/${rawFilesId}/sets/${setId}`)
      return true
    } catch (error) {
      throw parseError(error)
    }
  }

  const reorderMediaSets = async (rawFilesId, setIds) => {
    try {
      const response = await apiClient.post(`/v1/raw-files/${rawFilesId}/sets/reorder`, {
        setIds: setIds,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  // ==================== Media ====================

  const fetchSetMedia = async (rawFilesId, setId, params = {}) => {
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

      const endpoint = `/v1/raw-files/${rawFilesId}/sets/${setId}/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint)

      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const uploadMediaToSet = async (rawFilesId, setId, data) => {
    try {
      const payload = {
        user_file_uuid: data.userFileUuid || data.user_file_uuid,
      }

      if (!payload.user_file_uuid) {
        throw new Error('user_file_uuid is required')
      }

      const response = await apiClient.post(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media`,
        payload
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const deleteMedia = async (rawFilesId, setId, mediaId) => {
    try {
      const response = await apiClient.delete(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media/${mediaId}`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const renameMedia = async (rawFilesId, setId, mediaId, filename) => {
    try {
      const response = await apiClient.patch(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media/${mediaId}/rename`,
        {
          filename,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const replaceMedia = async (rawFilesId, setId, mediaId, userFileUuid) => {
    try {
      const response = await apiClient.patch(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media/${mediaId}/replace`,
        {
          user_file_uuid: userFileUuid,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const moveMediaToSet = async (rawFilesId, setId, mediaUuids, targetSetUuid) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media/move`,
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

  const copyMediaToSet = async (rawFilesId, setId, mediaUuids, targetSetUuid) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media/copy`,
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

  const starMedia = async (rawFilesId, setId, mediaId) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media/${mediaId}/star`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const applyWatermarkToMedia = async (rawFilesId, setId, mediaId, watermarkUuid, previewStyle = true) => {
    try {
      const response = await apiClient.post(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media/${mediaId}/watermark`,
        { watermarkUuid, previewStyle }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const removeWatermarkFromMedia = async (rawFilesId, setId, mediaId) => {
    try {
      const response = await apiClient.delete(
        `/v1/raw-files/${rawFilesId}/sets/${setId}/media/${mediaId}/watermark`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const downloadMedia = async mediaUuid => {
    try {
      const endpoint = `/v1/raw-files/media/${mediaUuid}/download`
      const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`
      const authHeader = apiClient.getAuthHeader()

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: authHeader || '',
        },
      })

      if (!response.ok) {
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
      if (error.status !== undefined || error.code) {
        throw error
      }
      throw parseError(error)
    }
  }

  // ==================== Public Access ====================

  const checkRawFilesStatus = async (subdomainOrUsername, rawFilesId) => {
    try {
      const response = await apiClient.get(
        `/v1/memora/${subdomainOrUsername}/raw-files/${rawFilesId}/status`,
        {
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const generateGuestToken = async (subdomainOrUsername, rawFilesId, email) => {
    try {
      const response = await apiClient.post(
        `/v1/memora/${subdomainOrUsername}/raw-files/${rawFilesId}/token`,
        { email },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchRawFilesGuest = async (subdomainOrUsername, id, guestToken, password = null) => {
    try {
      const headers = {
        Authorization: `Bearer ${guestToken}`,
      }
      if (password) {
        headers['X-Raw-Files-Password'] = password
      }
      const response = await apiClient.get(
        `/v1/memora/${subdomainOrUsername}/raw-files/${id}`,
        {
          headers,
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchMediaSetsGuest = async (subdomainOrUsername, id, guestToken, password = null) => {
    try {
      const headers = {
        Authorization: `Bearer ${guestToken}`,
      }
      if (password) {
        headers['X-Raw-Files-Password'] = password
      }
      const response = await apiClient.get(
        `/v1/memora/${subdomainOrUsername}/raw-files/${id}/sets`,
        {
          headers,
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchSetMediaGuest = async (subdomainOrUsername, id, setId, guestToken, password = null) => {
    try {
      const headers = {
        Authorization: `Bearer ${guestToken}`,
      }
      if (password) {
        headers['X-Raw-Files-Password'] = password
      }
      const response = await apiClient.get(
        `/v1/memora/${subdomainOrUsername}/raw-files/${id}/sets/${setId}/media`,
        {
          headers,
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const verifyPassword = async (subdomainOrUsername, rawFilesId, password) => {
    try {
      const response = await apiClient.post(
        `/v1/memora/${subdomainOrUsername}/raw-files/${rawFilesId}/verify-password`,
        { password },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const verifyDownloadPin = async (subdomainOrUsername, rawFilesId, pin) => {
    try {
      const response = await apiClient.post(
        `/v1/memora/${subdomainOrUsername}/raw-files/${rawFilesId}/verify-download-pin`,
        { pin },
        { skipAuth: true }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchRawFilesPublic = async (subdomainOrUsername, id, password = null) => {
    try {
      const headers = {}
      if (password) {
        headers['X-Raw-Files-Password'] = password
      }
      const response = await apiClient.get(
        `/v1/memora/${subdomainOrUsername}/raw-files/${id}`,
        {
          headers,
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchMediaSetsPublic = async (subdomainOrUsername, id, password = null) => {
    try {
      const headers = {}
      if (password) {
        headers['X-Raw-Files-Password'] = password
      }
      const response = await apiClient.get(
        `/v1/memora/${subdomainOrUsername}/raw-files/${id}/sets`,
        {
          headers,
          skipAuth: true,
        }
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const fetchSetMediaPublic = async (subdomainOrUsername, id, setId, params = {}, password = null) => {
    try {
      const queryParams = new URLSearchParams()
      if (params.sortBy) {
        queryParams.append('sort_by', params.sortBy)
      }
      const headers = {}
      if (password) {
        headers['X-Raw-Files-Password'] = password
      }
      const endpoint = `/v1/memora/${subdomainOrUsername}/raw-files/${id}/sets/${setId}/media${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const response = await apiClient.get(endpoint, {
        headers,
        skipAuth: true,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  const downloadMediaPublic = async (subdomainOrUsername, rawFilesId, mediaId, downloadPin = null, password = null) => {
    try {
      const headers = {}
      if (downloadPin) {
        headers['X-Download-PIN'] = downloadPin
      }
      if (password) {
        headers['X-Raw-Files-Password'] = password
      }

      const endpoint = `/v1/memora/${subdomainOrUsername}/raw-files/${rawFilesId}/media/${mediaId}/download`
      const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`

      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      if (!response.ok) {
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
      let filename = `media-${mediaId}`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
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
      if (error.status !== undefined || error.code) {
        throw error
      }
      throw parseError(error)
    }
  }

  return {
    // Raw Files CRUD
    fetchAllRawFiles,
    fetchRawFiles,
    createRawFiles,
    updateRawFiles,
    deleteRawFiles,
    toggleStarRawFiles,
    duplicateRawFiles,
    publishRawFiles,
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
    renameMedia,
    replaceMedia,
    moveMediaToSet,
    copyMediaToSet,
    starMedia,
    applyWatermarkToMedia,
    removeWatermarkFromMedia,
    downloadMedia,

    // Public Access
    checkRawFilesStatus,
    verifyPassword,
    verifyDownloadPin,
    generateGuestToken,
    fetchRawFilesGuest,
    fetchMediaSetsGuest,
    fetchSetMediaGuest,
    fetchRawFilesPublic,
    fetchMediaSetsPublic,
    fetchSetMediaPublic,
    downloadMediaPublic,
  }
}
