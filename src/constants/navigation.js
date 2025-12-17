/**
 * Legacy navigation constants
 * @deprecated Use product-specific navigation from productNavigation.js instead
 * This file is kept for backward compatibility
 */
import { LayoutDashboard, Images, Upload, Users } from 'lucide-vue-next'

/**
 * @deprecated Use PRODUCT_NAVIGATION from productNavigation.js
 * This is the old static navigation - kept for reference
 */
export const NAV_MAIN_ITEMS = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: 'Overview',
        url: '/dashboard',
      },
      {
        title: 'Analytics',
        url: '/dashboard/analytics',
      },
    ],
  },
  {
    title: 'Gallery',
    url: '/dashboard/gallery',
    icon: Images,
    items: [
      {
        title: 'All Photos',
        url: '/dashboard/gallery',
      },
      {
        title: 'Recent',
        url: '/dashboard/gallery?filter=recent',
      },
      {
        title: 'Favorites',
        url: '/dashboard/gallery?filter=favorites',
      },
    ],
  },
  {
    title: 'Upload',
    url: '/dashboard/upload',
    icon: Upload,
    items: [
      {
        title: 'New Upload',
        url: '/dashboard/upload',
      },
      {
        title: 'Bulk Upload',
        url: '/dashboard/upload?mode=bulk',
      },
    ],
  },
  {
    title: 'Management',
    url: '#',
    icon: Users,
    items: [
      {
        title: 'Clients',
        url: '/dashboard/clients',
      },
      {
        title: 'Albums',
        url: '/dashboard/albums',
      },
      {
        title: 'Settings',
        url: '/dashboard/settings',
      },
    ],
  },
]
