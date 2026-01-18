/**
 * Utility functions for clearing guest user data from localStorage
 */

/**
 * Clear all guest data for a collection
 */
export const clearCollectionGuestData = (collectionId) => {
  if (!collectionId) return
  
  localStorage.removeItem(`collection_${collectionId}_client_verified`)
  localStorage.removeItem(`collection_${collectionId}_user_mode`)
  localStorage.removeItem(`collection_email_${collectionId}`)
  localStorage.removeItem(`collection_guest_token_${collectionId}`)
  localStorage.removeItem(`collection_download_pin_${collectionId}`)
}

/**
 * Clear all guest data for a selection
 */
export const clearSelectionGuestData = (selectionId) => {
  if (!selectionId) return
  
  localStorage.removeItem(`guest_token_${selectionId}`)
  localStorage.removeItem(`guest_email_${selectionId}`)
}

/**
 * Clear all guest data for a raw file
 */
export const clearRawFileGuestData = (rawFileId) => {
  if (!rawFileId) return
  
  localStorage.removeItem(`guest_token_${rawFileId}`)
  localStorage.removeItem(`guest_email_${rawFileId}`)
}

/**
 * Clear all guest data for a proofing
 */
export const clearProofingGuestData = (proofingId) => {
  if (!proofingId) return
  
  localStorage.removeItem(`guest_token_proofing_${proofingId}`)
  localStorage.removeItem(`guest_email_proofing_${proofingId}`)
}

/**
 * Clear all guest data (collections, selections, proofing)
 * Useful for a global logout
 */
export const clearAllGuestData = () => {
  // Clear all collection-related keys
  const collectionKeys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (
      key.startsWith('collection_') ||
      key.startsWith('guest_token_') ||
      key.startsWith('guest_email_') ||
      key.startsWith('guest_token_proofing_') ||
      key.startsWith('guest_email_proofing_')
    )) {
      collectionKeys.push(key)
    }
  }
  collectionKeys.forEach(key => localStorage.removeItem(key))
}

