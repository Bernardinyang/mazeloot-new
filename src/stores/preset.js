/**
 * Preset Store
 * Manages collection preset state and operations
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePresetsApi } from '@/api/presets'

export const usePresetStore = defineStore('preset', () => {
  const presets = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const currentPresetId = ref(null)
  const presetsApi = usePresetsApi()

  /**
   * Load presets from API
   */
  const loadPresets = async (params = {}) => {
    isLoading.value = true
    error.value = null

    try {
      // fetchPresets returns response.data
      // Laravel's JsonResource::collection() wraps data in a 'data' key
      // ApiResponse wraps it again, so we need to extract nested data
      const response = await presetsApi.fetchPresets(params)
      let data = response
      
      // Handle nested data structure from Laravel resource collection
      if (data && typeof data === 'object' && !Array.isArray(data) && data.data) {
        data = data.data
      }
      
      // Ensure it's an array and filter out invalid entries
      const validPresets = Array.isArray(data) ? data.filter(p => p != null && (p.id || p.uuid)) : []
      presets.value = validPresets
      return validPresets
    } catch (err) {
      error.value = err.message || 'Failed to load presets'
      console.error('Failed to load presets:', err)
      presets.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get current preset
   */
  const currentPreset = computed(() => {
    if (!currentPresetId.value) return null
    return presets.value.find(p => p.id === currentPresetId.value) || null
  })

  /**
   * Get preset by ID
   */
  const getPresetById = id => {
    return presets.value.find(p => p.id === id)
  }

  /**
   * Get preset by name (URL-friendly)
   */
  const getPresetByName = name => {
    if (!name) return null
    const normalizedName = name.toLowerCase().replace(/\s+/g, '-')
    return presets.value.find(p => p && p.name && p.name.toLowerCase().replace(/\s+/g, '-') === normalizedName) || null
  }

  /**
   * Load a single preset by ID or name
   */
  const loadPreset = async (idOrName) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await presetsApi.fetchPreset(idOrName)
      let preset = response
      
      // Handle nested data structure from Laravel resource
      if (preset && typeof preset === 'object' && !Array.isArray(preset) && preset.data) {
        preset = preset.data
      }
      
      // Ensure it's a valid preset object
      if (preset && (preset.id || preset.uuid)) {
        // Update or add preset to the array
        const presetIndex = presets.value.findIndex(p => p && (p.id === preset.id || p.id === preset.uuid || p.uuid === preset.id || p.uuid === preset.uuid))
        if (presetIndex !== -1) {
          presets.value[presetIndex] = preset
        } else {
          presets.value.push(preset)
        }
        return preset
      }
      return null
    } catch (err) {
      error.value = err.message || 'Failed to load preset'
      console.error('Failed to load preset:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a new preset
   */
  const createPreset = async data => {
    isLoading.value = true
    error.value = null

    try {
      const response = await presetsApi.createPreset(data)
      // API returns the preset directly (already extracted by fetchPreset)
      const newPreset = response.data || response
      // Ensure it's a valid preset object
      if (newPreset && (newPreset.id || newPreset.uuid)) {
        presets.value.push(newPreset)
      }
      return newPreset
    } catch (err) {
      error.value = err.message || 'Failed to create preset'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update an existing preset
   */
  const updatePreset = async (id, data) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await presetsApi.updatePreset(id, data)
      // Handle nested data structure from Laravel resource
      let updatedPreset = response
      if (updatedPreset && typeof updatedPreset === 'object' && !Array.isArray(updatedPreset) && updatedPreset.data) {
        updatedPreset = updatedPreset.data
      }
      
      const presetIndex = presets.value.findIndex(p => p && (p.id === id || p.uuid === id))
      if (presetIndex !== -1 && updatedPreset) {
        presets.value[presetIndex] = updatedPreset
      } else if (updatedPreset) {
        // If not found in array, add it
        presets.value.push(updatedPreset)
      }
      return updatedPreset
    } catch (err) {
      error.value = err.message || 'Failed to update preset'
      console.error('Failed to update preset:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a preset
   */
  const deletePreset = async id => {
    isLoading.value = true
    error.value = null

    try {
      await presetsApi.deletePreset(id)
      const index = presets.value.findIndex(p => p.id === id)
      if (index !== -1) {
        presets.value.splice(index, 1)
      }

      // Clear current preset if it was deleted
      if (currentPresetId.value === id) {
        currentPresetId.value = null
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete preset'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Duplicate a preset
   */
  const duplicatePreset = async id => {
    isLoading.value = true
    error.value = null

    try {
      const response = await presetsApi.duplicatePreset(id)
      const duplicatedPreset = response.data
      presets.value.push(duplicatedPreset)
      return duplicatedPreset
    } catch (err) {
      error.value = err.message || 'Failed to duplicate preset'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set current preset
   */
  const setCurrentPreset = id => {
    currentPresetId.value = id
  }

  /**
   * Set preset as selected
   */
  const setSelectedPreset = id => {
    presets.value.forEach(p => {
      p.isSelected = p.id === id
    })
  }

  /**
   * Set preset as default
   */
  const setDefaultPreset = async id => {
    isLoading.value = true
    error.value = null

    try {
      const response = await presetsApi.setDefaultPreset(id)
      const updatedPreset = response.data

      // Update all presets: unset others, set this one
      presets.value.forEach(p => {
        p.isSelected = p.id === id
      })

      // Update the preset in the array
      const presetIndex = presets.value.findIndex(p => p.id === id)
      if (presetIndex !== -1) {
        presets.value[presetIndex] = updatedPreset
      }

      return updatedPreset
    } catch (err) {
      error.value = err.message || 'Failed to set default preset'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get default preset
   */
  const defaultPreset = computed(() => {
    return presets.value.find(p => p.isSelected) || null
  })

  /**
   * Reorder presets
   */
  const reorderPresets = async presetIds => {
    isLoading.value = true
    error.value = null
    try {
      await presetsApi.reorderPresets(presetIds)
    } catch (err) {
      error.value = err.message || 'Failed to reorder presets'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    presets,
    currentPreset,
    defaultPreset,
    isLoading,
    error,
    currentPresetId,
    loadPresets,
    loadPreset,
    getPresetById,
    getPresetByName,
    createPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    setCurrentPreset,
    setSelectedPreset,
    setDefaultPreset,
    reorderPresets,
  }
})
