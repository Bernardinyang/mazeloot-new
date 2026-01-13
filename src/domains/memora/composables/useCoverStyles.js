/**
 * useCoverStyles composable
 * Fetches and manages cover styles from the API
 */

import { ref, computed } from 'vue'
import { fetchCoverStyles, transformCoverStyles } from '@/domains/memora/api/coverStyles'
import { coverStyleConfigs } from '@/domains/memora/config/coverStyles' // Fallback

const coverStyles = ref([])
const isLoading = ref(false)
const error = ref(null)
const isInitialized = ref(false)

/**
 * Initialize cover styles from API
 * Returns a promise that resolves to the cover styles state
 */
export async function useCoverStyles() {
  // If already initialized, return immediately
  if (isInitialized.value) {
    return {
      coverStyles: computed(() => coverStyles.value),
      isLoading: computed(() => isLoading.value),
      error: computed(() => error.value),
      refresh: loadCoverStyles,
    }
  }

  // Load styles and return state
  await loadCoverStyles()
  return {
    coverStyles: computed(() => coverStyles.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    refresh: loadCoverStyles,
  }
}

/**
 * Load cover styles from API
 */
async function loadCoverStyles() {
  isLoading.value = true
  error.value = null

  try {
    const apiStyles = await fetchCoverStyles()
    coverStyles.value = transformCoverStyles(apiStyles)
    isInitialized.value = true
  } catch (err) {
    error.value = err

    // Fallback to hardcoded config
    coverStyles.value = Object.values(coverStyleConfigs).map(config => ({
      id: config.id,
      uuid: null,
      label: config.label,
      ...config,
    }))
    isInitialized.value = true
  } finally {
    isLoading.value = false
  }
}

/**
 * Get cover style config by ID (slug or UUID)
 * This function matches the signature of getCoverStyleConfig from coverStyles.js
 */
export function getCoverStyleConfig(coverId) {
  if (!coverId) {
    return coverStyleConfigs.modern // Default fallback
  }

  // Ensure styles are loaded (will use cache if already loaded)
  if (!isInitialized.value) {
    loadCoverStyles()
  }

  // First try to find in loaded API styles
  if (coverStyles.value.length > 0) {
    const style = coverStyles.value.find(
      s => s.id === coverId || s.slug === coverId || s.uuid === coverId
    )
    if (style) {
      return style
    }
  }

  // Fallback to hardcoded config
  return coverStyleConfigs[coverId] || coverStyleConfigs.modern
}

/**
 * Get all cover style options for selectors
 */
export function getCoverStyleOptions() {
  if (coverStyles.value.length > 0) {
    return coverStyles.value.map(style => ({
      id: style.id,
      label: style.label,
    }))
  }

  // Fallback to hardcoded config
  return Object.values(coverStyleConfigs).map(config => ({
    id: config.id,
    label: config.label,
  }))
}
