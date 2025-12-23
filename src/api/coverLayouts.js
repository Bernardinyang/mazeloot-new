/**
 * Cover Layouts API
 * Fetches cover layouts from the backend API
 */

import { apiClient } from './client'

/**
 * Fetch all active cover layouts
 */
export async function fetchCoverLayouts(includeInactive = false) {
  let endpoint = '/v1/cover-layouts'
  if (includeInactive) {
    endpoint += '?include_inactive=true'
  }

  const response = await apiClient.get(endpoint, {
    skipAuth: true, // Cover layouts are public endpoints
  })

  // apiClient.get returns { data: [...], status: 200, statusText: 'OK' }
  // response.data contains the actual array of layouts
  return response.data
}

/**
 * Fetch a single cover layout by UUID
 */
export async function fetchCoverLayoutByUuid(uuid) {
  const endpoint = `/v1/cover-layouts/${uuid}`

  const response = await apiClient.get(endpoint, {
    skipAuth: true, // Cover layouts are public endpoints
  })

  return response.data
}

/**
 * Fetch a single cover layout by slug
 */
export async function fetchCoverLayoutBySlug(slug) {
  const endpoint = `/v1/cover-layouts/slug/${slug}`

  const response = await apiClient.get(endpoint, {
    skipAuth: true, // Cover layouts are public endpoints
  })

  return response.data
}

/**
 * Transform API cover layout response to normalized format
 */
export function transformCoverLayout(apiLayout) {
  let layoutConfig = apiLayout.layoutConfig

  // If layoutConfig is missing or invalid, use default
  if (!layoutConfig || typeof layoutConfig !== 'object') {
    layoutConfig = {
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

  return {
    uuid: apiLayout.uuid,
    name: apiLayout.name,
    slug: apiLayout.slug,
    description: apiLayout.description,
    isActive: apiLayout.isActive,
    isDefault: apiLayout.isDefault,
    layoutConfig: layoutConfig,
    order: apiLayout.order,
    createdAt: apiLayout.createdAt,
    updatedAt: apiLayout.updatedAt,
  }
}

/**
 * Transform API cover layouts array to normalized format
 */
export function transformCoverLayouts(apiLayouts) {
  return apiLayouts.map(transformCoverLayout)
}
