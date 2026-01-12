/**
 * useCoverLayouts composable
 * Fetches and manages cover layouts from the API
 */

import { ref, computed } from 'vue'
import {
  fetchCoverLayouts,
  transformCoverLayouts,
  fetchCoverLayoutBySlug,
  fetchCoverLayoutByUuid,
  transformCoverLayout,
} from '@/domains/memora/api/coverLayouts'

const coverLayouts = ref([])
const isLoading = ref(false)
const error = ref(null)
const isInitialized = ref(false)

/**
 * Initialize cover layouts from API
 * Returns a promise that resolves to the cover layouts state
 */
export async function useCoverLayouts() {
  // If already initialized, return immediately
  if (isInitialized.value) {
    return {
      coverLayouts: computed(() => coverLayouts.value),
      isLoading: computed(() => isLoading.value),
      error: computed(() => error.value),
      refresh: loadCoverLayouts,
    }
  }

  // Load layouts and return state
  await loadCoverLayouts()
  return {
    coverLayouts: computed(() => coverLayouts.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    refresh: loadCoverLayouts,
  }
}

/**
 * Load cover layouts from API
 */
async function loadCoverLayouts() {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetchCoverLayouts()
    // API returns { data: [...], status: 200, statusText: 'OK' }
    // fetchCoverLayouts already extracts response.data, so response should be the array
    const layoutsData = Array.isArray(response) ? response : response?.data ? response.data : []
    coverLayouts.value = transformCoverLayouts(layoutsData)
    isInitialized.value = true
  } catch (err) {
    error.value = err
    coverLayouts.value = []
    isInitialized.value = true
  } finally {
    isLoading.value = false
  }
}

/**
 * Get cover layout config by UUID or slug
 */
export async function getCoverLayoutConfig(identifier) {
  if (!identifier) {
    return getDefaultLayoutConfig()
  }

  // First try to find in loaded layouts
  if (coverLayouts.value.length > 0) {
    const layout = coverLayouts.value.find(l => l.uuid === identifier || l.slug === identifier)
    if (layout && layout.layoutConfig) {
      return layout.layoutConfig
    }
  }

  // If not found, try to fetch from API
  try {
    const apiLayout = await fetchCoverLayoutByUuid(identifier).catch(() =>
      fetchCoverLayoutBySlug(identifier)
    )
    const transformed = transformCoverLayout(apiLayout)
    return transformed.layoutConfig || getDefaultLayoutConfig()
  } catch (err) {
    return getDefaultLayoutConfig()
  }
}

/**
 * Get default layout config
 */
export function getDefaultLayoutConfig() {
  return {
    layout: 'stack',
    media: {
      type: 'image',
      aspect_ratio: '16:9',
      fit: 'cover',
      bleed: 'full',
      max_width: null,
    },
    content: {
      placement: 'overlay',
      alignment: 'bottom-left',
    },
    overlay: {
      enabled: true,
      gradient: 'bottom',
      opacity: 0.55,
    },
    spacing: {
      padding_x: 80,
      padding_y: 60,
    },
  }
}

/**
 * Get all cover layout options for selectors
 */
export function getCoverLayoutOptions() {
  if (coverLayouts.value.length > 0) {
    return coverLayouts.value.map(layout => ({
      uuid: layout.uuid,
      slug: layout.slug,
      name: layout.name,
      description: layout.description,
      layoutConfig: layout.layoutConfig,
    }))
  }

  return []
}
