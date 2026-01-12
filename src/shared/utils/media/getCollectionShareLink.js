/**
 * Get collection share link in the new format: /memora/{domain}/collections/{uuid}
 * @param {string} origin - Base URL origin
 * @param {string} uuid - Collection UUID
 * @param {string} domain - User's domain (optional, defaults to 'default')
 * @returns {string} Public collection share link
 */
export const getCollectionShareLink = (origin, uuid, domain = 'default') => {
  return `${origin}/memora/${domain}/collections/${uuid}`
}
