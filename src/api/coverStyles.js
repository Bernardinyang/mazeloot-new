/**
 * Cover Styles API
 * Fetches cover styles from the backend API
 */

import { apiClient } from './client'

/**
 * Fetch all active cover styles
 */
export async function fetchCoverStyles(includeInactive = false) {
  let endpoint = '/v1/cover-styles'
  if (includeInactive) {
    endpoint += '?include_inactive=true'
  }

  const response = await apiClient.get(endpoint, {
    skipAuth: true, // Cover styles are public endpoints
  })

  return response.data || response
}

/**
 * Fetch a single cover style by UUID
 */
export async function fetchCoverStyleByUuid(uuid) {
  const endpoint = `/v1/cover-styles/${uuid}`

  const response = await apiClient.get(endpoint, {
    skipAuth: true, // Cover styles are public endpoints
  })

  return response.data || response
}

/**
 * Fetch a single cover style by slug
 */
export async function fetchCoverStyleBySlug(slug) {
  const endpoint = `/v1/cover-styles/slug/${slug}`

  const response = await apiClient.get(endpoint, {
    skipAuth: true, // Cover styles are public endpoints
  })

  return response.data || response
}

/**
 * Convert API cover style response to frontend format
 */
export function transformCoverStyle(apiStyle) {
  return {
    id: apiStyle.slug || apiStyle.uuid,
    uuid: apiStyle.uuid,
    label: apiStyle.name,
    ...apiStyle.config, // Spread the config which contains textPosition, textAlignment, etc.
  }
}

/**
 * Convert API cover styles array to frontend format
 */
export function transformCoverStyles(apiStyles) {
  return apiStyles.map(transformCoverStyle)
}
