/**
 * Preset Store
 * Manages collection preset state and operations
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { storage } from '@/utils/storage'

const PRESETS_STORAGE_KEY = 'mazeloot_presets'

export interface Preset {
  id: string
  name: string
  isSelected?: boolean
  // General settings
  collectionTags?: string
  photoSets?: string[]
  defaultWatermark?: string
  emailRegistration?: boolean
  galleryAssist?: boolean
  slideshow?: boolean
  socialSharing?: boolean
  language?: string
  // Design settings
  design?: {
    cover?: string
    coverFocalPoint?: string | { x: number; y: number }
    fontFamily?: string
    fontStyle?: string
    colorPalette?: string
    gridStyle?: string
    gridColumns?: number
    thumbnailSize?: string
    gridSpacing?: string
    navigationStyle?: string
  }
  // Additional settings can be added here
  createdAt?: string
  updatedAt?: string
}

export interface CreatePresetData {
  name: string
  collectionTags?: string
  photoSets?: string[]
  defaultWatermark?: string
  emailRegistration?: boolean
  galleryAssist?: boolean
  slideshow?: boolean
  socialSharing?: boolean
  language?: string
  design?: {
    cover?: string
    fontFamily?: string
    fontStyle?: string
    colorPalette?: string
    gridStyle?: string
    thumbnailSize?: string
    gridSpacing?: string
    navigationStyle?: string
  }
}

export interface UpdatePresetData extends Partial<CreatePresetData> {}

/**
 * Generate a UUID v4
 */
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Initialize mock presets in localStorage if not exists
 */
const initializeMockPresets = (): Preset[] => {
  const stored = storage.get<Preset[]>(PRESETS_STORAGE_KEY)
  if (stored && stored.length > 0) {
    return stored
  }

  const defaultPresets: Preset[] = [
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
  const presets = ref<Preset[]>(initializeMockPresets())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPresetId = ref<string | null>(null)

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
  const getPresetById = (id: string): Preset | undefined => {
    return presets.value.find(p => p.id === id)
  }

  /**
   * Get preset by name (URL-friendly)
   */
  const getPresetByName = (name: string): Preset | undefined => {
    const normalizedName = name.toLowerCase().replace(/\s+/g, '-')
    return presets.value.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === normalizedName)
  }

  /**
   * Create a new preset
   */
  const createPreset = async (data: CreatePresetData): Promise<Preset> => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

      const newPreset: Preset = {
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
    } catch (err: any) {
      error.value = err.message || 'Failed to create preset'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update an existing preset
   */
  const updatePreset = async (id: string, data: UpdatePresetData): Promise<Preset> => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

      const presetIndex = presets.value.findIndex(p => p.id === id)
      if (presetIndex === -1) {
        throw new Error('Preset not found')
      }

      const updatedPreset: Preset = {
        ...presets.value[presetIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      }

      presets.value[presetIndex] = updatedPreset
      return updatedPreset
    } catch (err: any) {
      error.value = err.message || 'Failed to update preset'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a preset
   */
  const deletePreset = async (id: string): Promise<void> => {
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
    } catch (err: any) {
      error.value = err.message || 'Failed to delete preset'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Duplicate a preset
   */
  const duplicatePreset = async (id: string): Promise<Preset> => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call

      const preset = presets.value.find(p => p.id === id)
      if (!preset) {
        throw new Error('Preset not found')
      }

      const duplicatedPreset: Preset = {
        ...preset,
        id: generateUUID(),
        name: `${preset.name} (Copy)`,
        isSelected: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      presets.value.push(duplicatedPreset)
      return duplicatedPreset
    } catch (err: any) {
      error.value = err.message || 'Failed to duplicate preset'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set current preset
   */
  const setCurrentPreset = (id: string | null) => {
    currentPresetId.value = id
  }

  /**
   * Set preset as selected
   */
  const setSelectedPreset = (id: string) => {
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
