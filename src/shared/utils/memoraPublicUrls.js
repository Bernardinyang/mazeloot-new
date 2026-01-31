/**
 * Builds public (guest) URLs for memora routes. Use these instead of hardcoding paths
 * so route changes are applied in one place.
 */

const BASE = '/memora'

/** @param domain Creative branding slug (preferred) or projectId/fallback */
export function publicProofingUrl(proofingId, domain = null) {
  if (!proofingId) return null
  const segment = domain || proofingId
  return `${BASE}/${segment}/proofing/${proofingId}`
}

export function closureRequestUrl(token) {
  if (!token) return null
  return `${BASE}/closure-request/${token}`
}

export function approvalRequestUrl(token) {
  if (!token) return null
  return `${BASE}/approval-request/${token}`
}

export function publicCollectionUrl(domain, collectionId) {
  if (!domain || !collectionId) return null
  return `${BASE}/${domain}/collection/${collectionId}`
}

export function publicCollectionDownloadUrl(domain, collectionId) {
  if (!domain || !collectionId) return null
  return `${BASE}/${domain}/collection/${collectionId}/download`
}

export function publicSelectionUrl(domain, selectionId) {
  if (!domain || !selectionId) return null
  return `${BASE}/${domain}/selections/${selectionId}`
}

export function publicRawFileUrl(domain, rawFileId) {
  if (!domain || !rawFileId) return null
  return `${BASE}/${domain}/raw-files/${rawFileId}`
}
