/**
 * Mazeloot Products Configuration
 * Defines all products offered by Mazeloot with their metadata
 */

export interface MazelootProduct {
  id: string
  name: string
  displayName: string
  description: string
  customType:
    | 'memora'
    | 'connect-stream'
    | 'creator-iq'
    | 'gear-hub'
    | 'vendor-iq'
    | 'gig-finder'
    | 'profolio'
  route?: { name: string; params?: any; query?: any }
  url?: string
}

export const MAZELOOT_PRODUCTS: MazelootProduct[] = [
  {
    id: 'memora',
    name: 'Memora',
    displayName: 'Memora',
    description: 'Client Photo Gallery / Collections',
    customType: 'memora',
    route: { name: 'manageCollections' },
  },
  {
    id: 'connect-stream',
    name: 'Connect Stream',
    displayName: 'Connect Stream',
    description: 'Community / Newsfeed',
    customType: 'connect-stream',
    route: { name: 'overview' }, // TODO: Add route when created
  },
  {
    id: 'creator-iq',
    name: 'Creator IQ',
    displayName: 'Creator IQ',
    description: 'Analytics (Creative)',
    customType: 'creator-iq',
    route: { name: 'overview' }, // TODO: Add route when created
  },
  {
    id: 'gear-hub',
    name: 'Gear Hub',
    displayName: 'Gear Hub',
    description: 'Marketplace / Rental (for physical product)',
    customType: 'gear-hub',
    route: { name: 'overview' }, // TODO: Add route when created
  },
  {
    id: 'vendor-iq',
    name: 'Vendor IQ',
    displayName: 'Vendor IQ',
    description: 'Analytics (Marketplace)',
    customType: 'vendor-iq',
    route: { name: 'overview' }, // TODO: Add route when created
  },
  {
    id: 'gig-finder',
    name: 'GigFinder',
    displayName: 'GigFinder',
    description: 'Job Listing',
    customType: 'gig-finder',
    route: { name: 'overview' }, // TODO: Add route when created
  },
  {
    id: 'profolio',
    name: 'Profolio',
    displayName: 'Profolio',
    description: 'Services / Portfolio',
    customType: 'profolio',
    route: { name: 'overview' }, // TODO: Add route when created
  },
]

/**
 * Get product by ID
 */
export function getProductById(id: string): MazelootProduct | undefined {
  return MAZELOOT_PRODUCTS.find(p => p.id === id)
}

/**
 * Get product by custom type
 */
export function getProductByType(type: MazelootProduct['customType']): MazelootProduct | undefined {
  return MAZELOOT_PRODUCTS.find(p => p.customType === type)
}
