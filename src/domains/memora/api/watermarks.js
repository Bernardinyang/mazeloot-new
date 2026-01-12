/**
 * Watermarks API composable
 * Handles all watermark-related API calls
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'

export function useWatermarksApi() {
  /**
   * Fetch all watermarks
   */
  const fetchWatermarks = async () => {
    try {
      const response = await apiClient.get('/v1/memora/settings/watermarks')
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Fetch single watermark by ID
   */
  const fetchWatermark = async id => {
    try {
      const response = await apiClient.get(`/v1/memora/settings/watermarks/${id}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create new watermark
   */
  const createWatermark = async data => {
    try {
      const response = await apiClient.post('/v1/memora/settings/watermarks', data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update watermark
   */
  const updateWatermark = async (id, data) => {
    try {
      const response = await apiClient.patch(`/v1/memora/settings/watermarks/${id}`, data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete watermark
   */
  const deleteWatermark = async id => {
    try {
      await apiClient.delete(`/v1/memora/settings/watermarks/${id}`)
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Upload watermark image
   */
  const uploadWatermarkImage = async file => {
    try {
      const response = await apiClient.upload('/v1/memora/settings/watermarks/upload-image', file)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Duplicate a watermark
   */
  const duplicateWatermark = async id => {
    try {
      const response = await apiClient.post(`/v1/memora/settings/watermarks/${id}/duplicate`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get watermark usage count
   */
  const fetchWatermarkUsage = async id => {
    try {
      const response = await apiClient.get(`/v1/memora/settings/watermarks/${id}/usage`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    fetchWatermarks,
    fetchWatermark,
    createWatermark,
    updateWatermark,
    deleteWatermark,
    uploadWatermarkImage,
    duplicateWatermark,
    fetchWatermarkUsage,
  }
}
