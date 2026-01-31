import { publicRawFileUrl } from '@/shared/utils/memoraPublicUrls'

export const getRawFileShareLink = (origin, domain, rawFileId) => {
  const path = publicRawFileUrl(domain, rawFileId)
  return path ? `${origin}${path}` : ''
}
