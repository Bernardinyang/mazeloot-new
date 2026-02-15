/**
 * Get stored download PIN for a resource
 * @param {string} id - Resource ID (collection ID, raw file ID, etc.)
 * @returns {string|null} - Stored PIN or null if not found/expired
 */
export const getStoredDownloadPin = (id) => {
    if (typeof localStorage === 'undefined') return null
    const stored = localStorage.getItem(`download_pin_${id}`)
    if (!stored) return null

    try {
        const data = JSON.parse(stored)
        const expiresAt = data.expiresAt
        if (expiresAt && Date.now() > expiresAt) {
            // Expired - remove it
            localStorage.removeItem(`download_pin_${id}`)
            localStorage.removeItem(`download_pin_expiry_${id}`)
            return null
        }
        return data.pin
    } catch {
        // Fallback for old format (just the PIN as string)
        return stored
    }
}

/**
 * Store download PIN for a resource
 * @param {string} id - Resource ID (collection ID, raw file ID, etc.)
 * @param {string} pin - PIN to store
 */
export const storeDownloadPin = (id, pin) => {
    if (typeof localStorage === 'undefined') return
    // Store for 30 minutes
    const expiresAt = Date.now() + 30 * 60 * 1000
    localStorage.setItem(`download_pin_${id}`, JSON.stringify({ pin, expiresAt }))
}

/**
 * Remove stored download PIN for a resource
 * @param {string} id - Resource ID (collection ID, raw file ID, etc.)
 */
export const removeStoredDownloadPin = (id) => {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(`download_pin_${id}`)
    localStorage.removeItem(`download_pin_expiry_${id}`)
}

const POST_AUTH_REDIRECT_KEY = 'mazeloot_post_auth_redirect'

export const setPostAuthRedirect = (pathOrLocation) => {
  if (typeof localStorage === 'undefined') return
  if (!pathOrLocation) {
    localStorage.removeItem(POST_AUTH_REDIRECT_KEY)
    return
  }
  localStorage.setItem(
    POST_AUTH_REDIRECT_KEY,
    typeof pathOrLocation === 'object' ? JSON.stringify(pathOrLocation) : pathOrLocation
  )
}

export const getPostAuthRedirect = () => {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(POST_AUTH_REDIRECT_KEY) || null
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && 'name' in parsed) return parsed
  } catch {
    // not JSON, treat as path string
  }
  return raw
}

export const clearPostAuthRedirect = () => {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(POST_AUTH_REDIRECT_KEY)
}
