import DashboardView from '@/views/user/memora/Dashboard.vue'
import CollectionsView from '@/views/user/memora/Collections.vue'
import StarredCollectionsView from '@/views/user/memora/starred/StarredCollections.vue'
import StarredFoldersView from '@/views/user/memora/starred/StarredFolders.vue'
import StarredMediaView from '@/views/user/memora/starred/StarredMedia.vue'
import HomepageView from '@/views/user/memora/Homepage.vue'
import BrandingView from '@/views/user/memora/settings/Branding.vue'
import WatermarkView from '@/views/user/memora/settings/watermark/Watermark.vue'
import PresetView from '@/views/user/memora/settings/Preset.vue'
import EmailTemplateView from '@/views/user/memora/settings/EmailTemplate.vue'
import PreferenceView from '@/views/user/memora/settings/Preference.vue'
import AddWatermarkView from '@/views/user/memora/settings/watermark/AddWatermark.vue'
import PresetGeneralView from '@/views/user/memora/preset/General.vue'
import PresetDesignView from '@/views/user/memora/preset/Design.vue'
import PresetPrivacyView from '@/views/user/memora/preset/Privacy.vue'
import PresetDownloadView from '@/views/user/memora/preset/Download.vue'
import PresetFavoriteView from '@/views/user/memora/preset/Favorite.vue'
import CollectionPreviewView from '@/views/user/memora/preview/CollectionPreview.vue'
import CollectionPhotosView from '@/views/user/memora/collections/Photos.vue'
import CollectionCoverView from '@/views/user/memora/collections/design/Cover.vue'
import CollectionTypographyView from '@/views/user/memora/collections/design/Typography.vue'
import CollectionColorView from '@/views/user/memora/collections/design/Color.vue'
import CollectionGridView from '@/views/user/memora/collections/design/Grid.vue'
import CollectionSettingsGeneralView from '@/views/user/memora/collections/settings/General.vue'
import CollectionSettingsPrivacyView from '@/views/user/memora/collections/settings/Privacy.vue'
import CollectionSettingsDownloadView from '@/views/user/memora/collections/settings/Download.vue'
import CollectionSettingsDownloadGeneralView from '@/views/user/memora/collections/settings/DownloadGeneral.vue'
import CollectionSettingsDownloadAdvancedView from '@/views/user/memora/collections/settings/DownloadAdvanced.vue'
import CollectionSettingsFavoriteView from '@/views/user/memora/collections/settings/Favorite.vue'
import CollectionActivitiesView from '@/views/user/memora/collections/activities/Activities.vue'
import CollectionActivitiesDownloadView from '@/views/user/memora/collections/activities/DownloadActivity.vue'
import CollectionActivitiesFavouriteView from '@/views/user/memora/collections/activities/FavouriteActivity.vue'
import CollectionActivitiesEmailRegistrationView from '@/views/user/memora/collections/activities/EmailRegistration.vue'
import CollectionActivitiesQuickShareView from '@/views/user/memora/collections/activities/QuickShareLinks.vue'
import CollectionActivitiesPrivatePhotosView from '@/views/user/memora/collections/activities/PrivatePhotos.vue'
import ProjectDashboardView from '@/views/user/memora/projects/ProjectDashboard.vue'
import CollectionPhaseView from '@/views/user/memora/projects/collections/CollectionPhase.vue'
import SelectionsListView from '@/views/user/memora/selections/Selections.vue'
import SelectionDetailView from '@/views/user/memora/selections/SelectionDetail.vue'
import ProofingListView from '@/views/user/memora/proofing/Proofing.vue'
import ProofingDetailView from '@/views/user/memora/proofing/ProofingDetail.vue'
import ProofingCommentsView from '@/views/user/memora/proofing/Comments.vue'

export const memoraRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: { name: 'memoraDashboard' },
    meta: {
      requiresAuth: true,
    },
  },
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
    name: 'starredMedias',
    component: StarredMediaView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/projects/starred',
    name: 'starredProjects',
    component: () => import('@/views/user/memora/starred/StarredProjects.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/selections/starred',
    name: 'starredSelections',
    component: () => import('@/views/user/memora/starred/StarredSelections.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/proofing/starred',
    name: 'starredProofing',
    component: () => import('@/views/user/memora/starred/StarredProofing.vue'),
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
  {
    path: '/memora/preset/:name/general',
    name: 'presetGeneral',
    component: PresetGeneralView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:name/design',
    name: 'presetDesign',
    component: PresetDesignView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:name/privacy',
    name: 'presetPrivacy',
    component: PresetPrivacyView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:name/download',
    name: 'presetDownload',
    component: PresetDownloadView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:name/favorite',
    name: 'presetFavorite',
    component: PresetFavoriteView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:name/preview',
    name: 'presetPreview',
    component: CollectionPreviewView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preview/:id',
    name: 'collectionPreview',
    component: CollectionPreviewView,
    meta: {
      requiresAuth: false, // Public preview
    },
  },
  {
    path: '/memora/collections/:uuid/photos',
    name: 'collectionPhotos',
    component: CollectionPhotosView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/design/cover',
    name: 'collectionCover',
    component: CollectionCoverView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/design/typography',
    name: 'collectionTypography',
    component: CollectionTypographyView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/design/color',
    name: 'collectionColor',
    component: CollectionColorView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/design/grid',
    name: 'collectionGrid',
    component: CollectionGridView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/settings/general',
    name: 'collectionSettingsGeneral',
    component: CollectionSettingsGeneralView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/settings/privacy',
    name: 'collectionSettingsPrivacy',
    component: CollectionSettingsPrivacyView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/settings/download',
    name: 'collectionSettingsDownload',
    component: CollectionSettingsDownloadView,
    redirect: to => ({
      name: 'collectionSettingsDownloadGeneral',
      params: to.params,
    }),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'general',
        name: 'collectionSettingsDownloadGeneral',
        component: CollectionSettingsDownloadGeneralView,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'advanced',
        name: 'collectionSettingsDownloadAdvanced',
        component: CollectionSettingsDownloadAdvancedView,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/memora/collections/:uuid/settings/favorite',
    name: 'collectionSettingsFavorite',
    component: CollectionSettingsFavoriteView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities',
    name: 'collectionActivities',
    component: CollectionActivitiesView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/download',
    name: 'collectionActivitiesDownload',
    component: CollectionActivitiesDownloadView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/favourite',
    name: 'collectionActivitiesFavourite',
    component: CollectionActivitiesFavouriteView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/email-registration',
    name: 'collectionActivitiesEmailRegistration',
    component: CollectionActivitiesEmailRegistrationView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/quick-share',
    name: 'collectionActivitiesQuickShare',
    component: CollectionActivitiesQuickShareView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/private-photos',
    name: 'collectionActivitiesPrivatePhotos',
    component: CollectionActivitiesPrivatePhotosView,
    meta: {
      requiresAuth: true,
    },
  },
  // Standalone Selections and Proofing Routes
  {
    path: '/memora/selections',
    name: 'selections',
    component: SelectionsListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/selections/:id',
    name: 'selectionDetail',
    component: SelectionDetailView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/proofing',
    name: 'proofing',
    component: ProofingListView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/proofing/:id',
    name: 'proofingDetail',
    component: ProofingDetailView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/proofing/:id/comments',
    name: 'proofingComments',
    component: ProofingCommentsView,
    meta: {
      requiresAuth: true,
    },
  },
  // Project Routes
  {
    path: '/memora/projects',
    name: 'projects',
    component: () => import('@/views/user/memora/projects/Projects.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/projects/:id',
    name: 'projectDashboard',
    component: ProjectDashboardView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/projects/:id/selections',
    name: 'projectSelections',
    redirect: to => {
      // If there's a selectionId query param, redirect to selectionDetail
      if (to.query.selectionId) {
        return {
          name: 'selectionDetail',
          params: { id: to.query.selectionId },
        }
      }
      // Otherwise, redirect to selections list
      return { name: 'selections' }
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/projects/:id/proofing',
    name: 'projectProofing',
    redirect: to => {
      // If there's a proofingId query param, redirect to proofingDetail
      if (to.query.proofingId) {
        return {
          name: 'proofingDetail',
          params: { id: to.query.proofingId },
        }
      }
      // Otherwise, redirect to proofing list
      return { name: 'proofing' }
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/projects/:id/collections',
    name: 'projectCollections',
    component: CollectionPhaseView,
    meta: {
      requiresAuth: true,
    },
  },
]
