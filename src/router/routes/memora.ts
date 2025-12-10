import type { RouteRecordRaw } from 'vue-router'
import DashboardView from '@/views/user/memora/Dashboard.vue'
import CollectionsView from '@/views/user/memora/Collections.vue'
import StarredCollectionsView from '@/views/user/memora/starred/StarredCollections.vue'
import StarredFoldersView from '@/views/user/memora/starred/StarredFolders.vue'
import StarredPhotosView from '@/views/user/memora/starred/StarredPhotos.vue'
import HomepageView from '@/views/user/memora/Homepage.vue'
import BrandingView from '@/views/user/memora/settings/Branding.vue'
import WatermarkView from '@/views/user/memora/settings/watermark/Watermark.vue'
import PresetView from '@/views/user/memora/settings/Preset.vue'
import EmailTemplateView from '@/views/user/memora/settings/EmailTemplate.vue'
import PreferenceView from '@/views/user/memora/settings/Preference.vue'
import AddWatermarkView from '@/views/user/memora/settings/watermark/AddWatermark.vue'

export const memoraRoutes: RouteRecordRaw[] = [
  {
    path: '/memora/dashboard',
    name: 'memoraDashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections',
    name: 'manageCollections',
    component: CollectionsView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/starred',
    name: 'starredCollections',
    component: StarredCollectionsView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/folders/starred',
    name: 'starredFolders',
    component: StarredFoldersView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/photos/starred',
    name: 'starredPhotos',
    component: StarredPhotosView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/homepage',
    name: 'homepageConfig',
    component: HomepageView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/settings/branding',
    name: 'brandingSettings',
    component: BrandingView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/settings/watermark',
    name: 'watermarkSettings',
    component: WatermarkView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/settings/preset',
    name: 'presetSettings',
    component: PresetView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/settings/email-template',
    name: 'emailTemplateSettings',
    component: EmailTemplateView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/settings/preference',
    name: 'preferenceSettings',
    component: PreferenceView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/settings/watermark/add',
    name: 'addWatermark',
    component: AddWatermarkView,
    meta: {
      requiresAuth: true,
      parent: 'watermarkSettings',
    },
  },
  {
    path: '/memora/settings/watermark/:id',
    name: 'editWatermark',
    component: AddWatermarkView,
    meta: {
      requiresAuth: true,
      parent: 'watermarkSettings',
    },
  },
]
