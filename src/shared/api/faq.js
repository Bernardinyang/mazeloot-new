/**
 * Public FAQ API (no auth). Used by FAQ page and Refer a Friend.
 */

import { apiClient } from '@/shared/api/client'
import { FAQ_ITEMS } from '@/shared/constants/faq'

/**
 * Fetch published FAQs from API. Falls back to FAQ_ITEMS if request fails or returns empty.
 * @returns {Promise<Array<{ question: string, answer: string }>>}
 */
export async function getPublicFaqs() {
  try {
    const response = await apiClient.get('/v1/faqs', { skipAuth: true })
    const data = response?.data?.data
    if (Array.isArray(data) && data.length > 0) {
      return data
    }
  } catch {
    // ignore
  }
  return FAQ_ITEMS
}
