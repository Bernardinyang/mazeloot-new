/**
 * Presets API composable
 * Handles all preset-related API calls
 */

import { apiClient } from '@/shared/api/client'
import { parseError } from '@/shared/utils/errors'

export function usePresetsApi() {
  /**
   * Fetch all presets
   */
  const fetchPresets = async (params = {}) => {
    try {
      const response = await apiClient.get('/v1/memora/settings/presets', { params })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Fetch single preset by ID
   */
  const fetchPreset = async id => {
    try {
      const response = await apiClient.get(`/v1/memora/settings/presets/${id}`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Create new preset
   */
  const createPreset = async data => {
    try {
      const response = await apiClient.post('/v1/memora/settings/presets', data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Update preset
   */
  const updatePreset = async (id, data) => {
    try {
      const response = await apiClient.patch(`/v1/memora/settings/presets/${id}`, data)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Delete preset
   */
  const deletePreset = async id => {
    try {
      await apiClient.delete(`/v1/memora/settings/presets/${id}`)
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Duplicate a preset
   */
  const duplicatePreset = async id => {
    try {
      const response = await apiClient.post(`/v1/memora/settings/presets/${id}/duplicate`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Apply preset to collection
   */
  const applyPresetToCollection = async (presetId, collectionId) => {
    try {
      const response = await apiClient.post(
        `/v1/memora/settings/presets/${presetId}/apply-to-collection/${collectionId}`
      )
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Get preset usage count
   */
  const fetchPresetUsage = async id => {
    try {
      const response = await apiClient.get(`/v1/memora/settings/presets/${id}/usage`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Set preset as default
   */
  const setDefaultPreset = async id => {
    try {
      const response = await apiClient.patch(`/v1/memora/settings/presets/${id}/set-default`)
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  /**
   * Reorder presets
   */
  const reorderPresets = async presetIds => {
    try {
      const response = await apiClient.patch('/v1/memora/settings/presets/reorder', {
        preset_ids: presetIds,
      })
      return response.data
    } catch (error) {
      throw parseError(error)
    }
  }

  return {
    fetchPresets,
    fetchPreset,
    createPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    applyPresetToCollection,
    fetchPresetUsage,
    setDefaultPreset,
    reorderPresets,
  }
}

