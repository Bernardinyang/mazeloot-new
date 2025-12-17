/**
 * Preset Store
 * Manages collection preset state and operations
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { storage } from '@/utils/storage'
import { generateUUID } from '@/utils/uuid'

const PRESETS_STORAGE_KEY = 'mazeloot_presets'

/**
 * Initialize mock presets in localStorage if not exists
 */
const initializeMockPresets = () => {
  const stored = storage.get(PRESETS_STORAGE_KEY)
  if (stored && stored.length > 0) {
    return stored
  }

  const defaultPresets = [
    {
      id: generateUUID(),
      name: 'Wedding preset',
      isSelected: false,
      collectionTags: 'wedding, ceremony',
      photoSets: ['Highlights', 'Ceremony', 'Reception'],
      defaultWatermark: 'none',
      emailRegistration: false,
      galleryAssist: false,
      slideshow: true,
      socialSharing: true,
      language: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateUUID(),
      name: 'Demo',
      isSelected: true,
      collectionTags: '',
      photoSets: ['Highlights'],
      defaultWatermark: 'none',
      emailRegistration: false,
      galleryAssist: false,
      slideshow: true,
      socialSharing: true,
      language: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateUUID(),
      name: 'test',
      isSelected: false,
      collectionTags: '',
      photoSets: [],
      defaultWatermark: 'none',
      emailRegistration: false,
      galleryAssist: false,
      slideshow: false,
      socialSharing: false,
      language: 'en',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  storage.set(PRESETS_STORAGE_KEY, defaultPresets)
  return defaultPresets
}

export const usePresetStore = defineStore('preset', () => {
  const presets = ref(initializeMockPresets())
  const isLoading = ref(false)
  const error = ref(null)
  const currentPresetId = ref(null)

  /**
   * Persist presets to localStorage
   */
  const persistPresets = () => {
    storage.set(PRESETS_STORAGE_KEY, presets.value)
  }

  // Watch presets and persist to localStorage
  watch(
    presets,
    () => {
      persistPresets()
    },
    { deep: true }
  )

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
    const normalizedName = name.toLowerCase().replace(/\s+/g, '-')
    return presets.value.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === normalizedName)
  }

  /**
   * Create a new preset
   */
  const createPreset = async data => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

      const newPreset = {
        id: generateUUID(),
        name: data.name,
        isSelected: false,
        collectionTags: data.collectionTags || '',
        photoSets: data.photoSets || [],
        defaultWatermark: data.defaultWatermark || 'none',
        emailRegistration: data.emailRegistration ?? false,
        galleryAssist: data.galleryAssist ?? false,
        slideshow: data.slideshow ?? true,
        socialSharing: data.socialSharing ?? true,
        language: data.language || 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      presets.value.push(newPreset)
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
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

      const presetIndex = presets.value.findIndex(p => p.id === id)
      if (presetIndex === -1) {
        throw new Error('Preset not found')
      }

      const updatedPreset = {
        ...presets.value[presetIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      }

      presets.value[presetIndex] = updatedPreset
      return updatedPreset
    } catch (err) {
      error.value = err.message || 'Failed to update preset'
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
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call

      const index = presets.value.findIndex(p => p.id === id)
      if (index === -1) {
        throw new Error('Preset not found')
      }

      presets.value.splice(index, 1)

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
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call

      const preset = presets.value.find(p => p.id === id)
      if (!preset) {
        throw new Error('Preset not found')
      }

      const duplicatedPreset = {
        ...preset,
        id: generateUUID(),
        name: `${preset.name} (Copy)`,
        isSelected: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

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

  return {
    presets,
    currentPreset,
    isLoading,
    error,
    currentPresetId,
    getPresetById,
    getPresetByName,
    createPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    setCurrentPreset,
    setSelectedPreset,
  }
})
