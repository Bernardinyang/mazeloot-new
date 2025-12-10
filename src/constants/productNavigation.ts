/**
 * Product-specific navigation configurations
 * Each product can have its own set of navigation items
 */
import {
  LayoutDashboard,
  Upload,
  Users,
  Settings,
  FolderOpen,
  Album,
  Grid3x3,
  FileImage,
  Star,
  Globe,
  Palette,
  Image as ImageIcon,
  Mail,
  Sliders,
} from 'lucide-vue-next'
import type { NavItem } from '@/types/navigation'

/**
 * Memora (Photo Gallery) Navigation
 */
export const MEMORA_NAVIGATION: NavItem[] = [
  {
    title: 'Main',
  },
  {
    title: 'Collections',
    name: 'manageCollections',
    icon: FolderOpen,
  },
  {
    title: 'Starred',
    icon: Star,
    items: [
      {
        title: 'Collections',
        name: 'starredCollections',
      },
      {
        title: 'Folders',
        name: 'starredFolders',
      },
      {
        title: 'Photos',
        name: 'starredPhotos',
      },
    ],
  },
  {
    title: 'Homepage',
    name: 'homepageConfig',
    icon: Globe,
  },
  {
    title: 'Settings',
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      {
        title: 'Branding',
        name: 'brandingSettings',
        icon: Palette,
      },
      {
        title: 'Watermark',
        name: 'watermarkSettings',
        icon: ImageIcon,
      },
      {
        title: 'Preset',
        name: 'presetSettings',
        icon: Sliders,
      },
      {
        title: 'Email Template',
        name: 'emailTemplateSettings',
        icon: Mail,
      },
      {
        title: 'Preference',
        name: 'preferenceSettings',
        icon: Settings,
      },
    ],
  },
  {
    title: 'Storage',
  },
  {
    title: 'Storage',
    name: 'about',
    icon: Upload,
  },
]

/**
 * Overview/Main App Navigation
 */
export const OVERVIEW_NAVIGATION: NavItem[] = [
  {
    title: 'Overview',
    name: 'overview',
    url: '/overview',
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: 'Dashboard',
        name: 'overview',
        url: '/overview',
      },
      {
        title: 'Products',
        name: 'overview-products',
        url: '/overview/products',
      },
      {
        title: 'Analytics',
        name: 'overview-analytics',
        url: '/overview/analytics',
      },
    ],
  },
  {
    title: 'Products',
    name: 'overview-products',
    url: '/overview/products',
    icon: Grid3x3,
    items: [
      {
        title: 'All Products',
        name: 'overview-products',
        url: '/overview/products',
      },
      {
        title: 'Memora',
        name: 'memora-dashboard',
        url: '/dashboard/memora',
      },
      {
        title: 'Collections',
        name: 'collections',
        url: '/collections',
      },
    ],
  },
  {
    title: 'Account',
    name: 'overview-account',
    url: '/overview/account',
    icon: Users,
    items: [
      {
        title: 'Profile',
        name: 'overview-account',
        url: '/overview/account',
      },
      {
        title: 'Billing',
        name: 'overview-account-billing',
        url: '/overview/account/billing',
      },
      {
        title: 'Settings',
        name: 'overview-account-settings',
        url: '/overview/account/settings',
      },
    ],
  },
]

/**
 * Collections Product Navigation
 */
export const COLLECTIONS_NAVIGATION: NavItem[] = [
  {
    title: 'Dashboard',
    name: 'collections',
    url: '/collections',
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: 'Overview',
        name: 'collections',
        url: '/collections',
      },
      {
        title: 'Stats',
        name: 'collections-stats',
        url: '/collections/stats',
      },
    ],
  },
  {
    title: 'Collections',
    name: 'collections-all',
    url: '/collections/all',
    icon: Album,
    items: [
      {
        title: 'All Collections',
        name: 'collections-all',
        url: '/collections/all',
      },
      {
        title: 'My Collections',
        name: 'collections-my',
        url: '/collections/my',
      },
      {
        title: 'Shared',
        name: 'collections-shared',
        url: '/collections/shared',
      },
    ],
  },
  {
    title: 'Create',
    name: 'collections-create',
    url: '/collections/create',
    icon: FileImage,
    items: [
      {
        title: 'New Collection',
        name: 'collections-create',
        url: '/collections/create',
      },
      {
        title: 'Import',
        name: 'collections-import',
        url: '/collections/import',
      },
    ],
  },
  {
    title: 'Settings',
    name: 'collections-settings',
    url: '/collections/settings',
    icon: Settings,
    items: [
      {
        title: 'General',
        name: 'collections-settings',
        url: '/collections/settings',
      },
      {
        title: 'Privacy',
        name: 'collections-settings-privacy',
        url: '/collections/settings/privacy',
      },
    ],
  },
]

/**
 * Default Navigation (fallback)
 */
export const DEFAULT_NAVIGATION: NavItem[] = [
  {
    title: 'Dashboard',
    name: 'overview',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: 'Home',
        name: 'overview',
        url: '/dashboard',
      },
    ],
  },
]

/**
 * Product Navigation Labels
 * Maps product IDs to their sidebar group labels
 */
export const PRODUCT_NAVIGATION_LABELS: Record<string, string> = {
  memora: 'Memora',
  overview: 'Overview',
  collections: 'Collections',
  default: 'Main',
}

/**
 * Product Navigation Map
 * Maps product IDs to their navigation configurations
 */
export const PRODUCT_NAVIGATION: Record<string, NavItem[]> = {
  memora: MEMORA_NAVIGATION,
  overview: OVERVIEW_NAVIGATION,
  collections: COLLECTIONS_NAVIGATION,
  default: DEFAULT_NAVIGATION,
}
