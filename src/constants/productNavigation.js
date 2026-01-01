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
  FolderKanban,
  CheckSquare,
  Eye,
  Bell,
  AtSign,
  Link as LinkIcon,
} from 'lucide-vue-next'

/**
 * Memora (Photo Gallery) Navigation
 */
export const MEMORA_NAVIGATION = [
  {
    title: 'Summary',
  },
  {
    title: 'Overview',
    name: 'overview',
    icon: FolderKanban,
  },
  {
    title: 'Main',
  },
  {
    title: 'Projects',
    name: 'projects',
    icon: FolderKanban,
  },
  {
    title: 'Collections',
    name: 'manageCollections',
    icon: FolderOpen,
  },
  {
    title: 'Selections',
    name: 'selections',
    icon: CheckSquare,
  },
  {
    title: 'Proofing',
    name: 'proofing',
    icon: Eye,
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
        title: 'Media',
        name: 'starredMedias',
      },
      {
        title: 'Projects',
        name: 'starredProjects',
      },
      {
        title: 'Selections',
        name: 'starredSelections',
      },
      {
        title: 'Proofing',
        name: 'starredProofing',
      },
    ],
  },
  {
    title: 'Settings',
  },
  {
    title: 'Homepage',
    name: 'homepageConfig',
    icon: Globe,
  },
  {
    title: 'Watermark',
    name: 'watermarkSettings',
    icon: ImageIcon,
  },
  {
    title: 'Preset',
    name: 'presetSettings',
    icon: Palette,
  },
  {
    title: 'Settings',
    icon: Settings,
    items: [
      {
        title: 'Branding',
        name: 'brandingSettings',
      },
      {
        title: 'Email Template',
        name: 'emailTemplateSettings',
      },
      {
        title: 'Email Notifications',
        name: 'emailNotificationsSettings',
      },
      {
        title: 'Email Settings',
        name: 'emailSettings',
      },
      {
        title: 'Social Links',
        name: 'socialLinksSettings',
      },
      {
        title: 'Preference',
        name: 'preferenceSettings',
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
export const OVERVIEW_NAVIGATION = [
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
        name: 'overviewProducts',
        url: '/overview/products',
      },
      {
        title: 'Analytics',
        name: 'overviewAnalytics',
        url: '/overview/analytics',
      },
    ],
  },
  {
    title: 'Products',
    name: 'overviewProducts',
    url: '/overview/products',
    icon: Grid3x3,
    items: [
      {
        title: 'All Products',
        name: 'overviewProducts',
        url: '/overview/products',
      },
      {
        title: 'Memora',
        name: 'memoraDashboard',
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
    name: 'overviewAccount',
    url: '/overview/account',
    icon: Users,
    items: [
      {
        title: 'Profile',
        name: 'overviewAccount',
        url: '/overview/account',
      },
      {
        title: 'Billing',
        name: 'overviewAccountBilling',
        url: '/overview/account/billing',
      },
      {
        title: 'Settings',
        name: 'overviewAccountSettings',
        url: '/overview/account/settings',
      },
    ],
  },
]

/**
 * Collections Product Navigation
 */
export const COLLECTIONS_NAVIGATION = [
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
        name: 'collectionsStats',
        url: '/collections/stats',
      },
    ],
  },
  {
    title: 'Collections',
    name: 'collectionsAll',
    url: '/collections/all',
    icon: Album,
    items: [
      {
        title: 'All Collections',
        name: 'collectionsAll',
        url: '/collections/all',
      },
      {
        title: 'My Collections',
        name: 'collectionsMy',
        url: '/collections/my',
      },
      {
        title: 'Shared',
        name: 'collectionsShared',
        url: '/collections/shared',
      },
    ],
  },
  {
    title: 'Create',
    name: 'collectionsCreate',
    url: '/collections/create',
    icon: FileImage,
    items: [
      {
        title: 'New Collection',
        name: 'collectionsCreate',
        url: '/collections/create',
      },
      {
        title: 'Import',
        name: 'collectionsImport',
        url: '/collections/import',
      },
    ],
  },
  {
    title: 'Settings',
    name: 'collectionsSettings',
    url: '/collections/settings',
    icon: Settings,
    items: [
      {
        title: 'General',
        name: 'collectionsSettings',
        url: '/collections/settings',
      },
      {
        title: 'Privacy',
        name: 'collectionsSettingsPrivacy',
        url: '/collections/settings/privacy',
      },
    ],
  },
]

/**
 * Default Navigation (fallback)
 */
export const DEFAULT_NAVIGATION = [
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
export const PRODUCT_NAVIGATION_LABELS = {
  memora: 'Memora',
  overview: 'Overview',
  collections: 'Collections',
  default: 'Main',
}

/**
 * Product Navigation Map
 * Maps product IDs to their navigation configurations
 */
export const PRODUCT_NAVIGATION = {
  memora: MEMORA_NAVIGATION,
  overview: OVERVIEW_NAVIGATION,
  collections: COLLECTIONS_NAVIGATION,
  default: DEFAULT_NAVIGATION,
}
