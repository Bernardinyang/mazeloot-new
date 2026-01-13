import GettingStarted from '@/shared/views/user/GettingStarted.vue'
import DashboardView from '@/domains/memora/views/Dashboard.vue'
import CollectionsView from '@/domains/memora/views/Collections.vue'
import StarredCollectionsView from '@/domains/memora/views/starred/StarredCollections.vue'
import StarredFoldersView from '@/domains/memora/views/starred/StarredFolders.vue'
import StarredMediaView from '@/domains/memora/views/starred/StarredMedia.vue'
import FeaturedMediaView from '@/domains/memora/views/starred/FeaturedMedia.vue'
import HomepageView from '@/domains/memora/views/Homepage.vue'
import BrandingView from '@/domains/memora/views/settings/Branding.vue'
import WatermarkView from '@/domains/memora/views/settings/watermark/Watermark.vue'
import PresetView from '@/domains/memora/views/settings/Preset.vue'
import EmailTemplateView from '@/domains/memora/views/settings/EmailTemplate.vue'
import PreferenceView from '@/domains/memora/views/settings/Preference.vue'
import EmailNotificationsView from '@/domains/memora/views/settings/EmailNotifications.vue'
import EmailSettingsView from '@/domains/memora/views/settings/EmailSettings.vue'
import SocialLinksView from '@/domains/memora/views/settings/SocialLinks.vue'
import AddWatermarkView from '@/domains/memora/views/settings/watermark/AddWatermark.vue'
import PresetGeneralView from '@/domains/memora/views/preset/General.vue'
import PresetDesignView from '@/domains/memora/views/preset/Design.vue'
import PresetPrivacyView from '@/domains/memora/views/preset/Privacy.vue'
import PresetDownloadView from '@/domains/memora/views/preset/Download.vue'
import PresetFavoriteView from '@/domains/memora/views/preset/Favorite.vue'
import CollectionPreviewView from '@/domains/memora/views/preview/CollectionPreview.vue'
import CollectionPhotosView from '@/domains/memora/views/collections/Photos.vue'
import CollectionCoverView from '@/domains/memora/views/collections/design/Cover.vue'
import CollectionTypographyView from '@/domains/memora/views/collections/design/Typography.vue'
import CollectionColorView from '@/domains/memora/views/collections/design/Color.vue'
import CollectionGridView from '@/domains/memora/views/collections/design/Grid.vue'
import CollectionSettingsGeneralView from '@/domains/memora/views/collections/settings/General.vue'
import CollectionSettingsPrivacyView from '@/domains/memora/views/collections/settings/Privacy.vue'
import CollectionSettingsDownloadView from '@/domains/memora/views/collections/settings/Download.vue'
import CollectionSettingsDownloadGeneralView from '@/domains/memora/views/collections/settings/DownloadGeneral.vue'
import CollectionSettingsDownloadAdvancedView from '@/domains/memora/views/collections/settings/DownloadAdvanced.vue'
import CollectionSettingsFavoriteView from '@/domains/memora/views/collections/settings/Favorite.vue'
import CollectionActivitiesView from '@/domains/memora/views/collections/activities/Activities.vue'
import CollectionActivitiesDownloadView from '@/domains/memora/views/collections/activities/DownloadActivity.vue'
import CollectionActivitiesFavouriteView from '@/domains/memora/views/collections/activities/FavouriteActivity.vue'
import CollectionActivitiesEmailRegistrationView from '@/domains/memora/views/collections/activities/EmailRegistration.vue'
import CollectionActivitiesQuickShareView from '@/domains/memora/views/collections/activities/QuickShareLinks.vue'
import CollectionActivitiesPrivateMediaView from '@/domains/memora/views/collections/activities/PrivateMedia.vue'
import ProjectDashboardView from '@/domains/memora/views/projects/ProjectDashboard.vue'
import CollectionPhaseView from '@/domains/memora/views/projects/collections/CollectionPhase.vue'
import SelectionsListView from '@/domains/memora/views/selections/Selections.vue'
import SelectionDetailView from '@/domains/memora/views/selections/SelectionDetail.vue'
import ProofingListView from '@/domains/memora/views/proofing/Proofing.vue'
import ProofingDetailView from '@/domains/memora/views/proofing/ProofingDetail.vue'
import ProofingCommentsView from '@/domains/memora/views/proofing/Comments.vue'

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
    path: '/memora/getting-started',
    name: 'gettingStarted',
    component: GettingStarted,
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
    path: '/memora/photos/featured',
    name: 'featuredMedias',
    component: FeaturedMediaView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/media/my',
    name: 'myMedia',
    component: () => import('@/domains/memora/views/MyMedia.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/projects/starred',
    name: 'starredProjects',
    component: () => import('@/domains/memora/views/starred/StarredProjects.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/selections/starred',
    name: 'starredSelections',
    component: () => import('@/domains/memora/views/starred/StarredSelections.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/proofing/starred',
    name: 'starredProofing',
    component: () => import('@/domains/memora/views/starred/StarredProofing.vue'),
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
    path: '/memora/settings/email-notifications',
    name: 'emailNotificationsSettings',
    component: EmailNotificationsView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/settings/email-settings',
    name: 'emailSettings',
    component: EmailSettingsView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/memora/settings/social-links',
    name: 'socialLinksSettings',
    component: SocialLinksView,
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
    path: '/memora/preset/:id/general',
    name: 'presetGeneral',
    component: PresetGeneralView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/design',
    name: 'presetDesign',
    component: PresetDesignView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/privacy',
    name: 'presetPrivacy',
    component: PresetPrivacyView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/download',
    name: 'presetDownload',
    component: PresetDownloadView,
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/favorite',
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
    beforeEnter: async (to, from, next) => {
      // Dynamically import store to avoid circular dependencies
      const { useGalleryStore } = await import('@/shared/stores/gallery')
      const galleryStore = useGalleryStore()
      
      // Try to get collection from store
      let collection = galleryStore.collections.find(c => c.id === to.params.uuid)
      
      // If not in store, try to fetch it
      if (!collection) {
        try {
          collection = await galleryStore.fetchCollection(to.params.uuid)
        } catch (error) {
          // If fetch fails, allow navigation (component will handle error)
          return next()
        }
      }
      
      // Redirect to Typography if no cover photo
      if (!collection?.image && !collection?.thumbnail) {
        return next({
          name: 'collectionTypography',
          params: { uuid: to.params.uuid },
        })
      }
      
      next()
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
    path: '/memora/collections/:uuid/activities/private-media',
    name: 'collectionActivitiesPrivateMedia',
    component: CollectionActivitiesPrivateMediaView,
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
    component: () => import('@/domains/memora/views/projects/Projects.vue'),
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
