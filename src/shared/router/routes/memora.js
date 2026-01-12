const GettingStarted = () => import('@/domains/memora/views/user/GettingStarted.vue')
const DashboardView = () => import('@/domains/memora/views/Dashboard.vue')
const CollectionsView = () => import('@/domains/memora/views/Collections.vue')
const StarredCollectionsView = () => import('@/domains/memora/views/starred/StarredCollections.vue')
const StarredFoldersView = () => import('@/domains/memora/views/starred/StarredFolders.vue')
const StarredMediaView = () => import('@/domains/memora/views/starred/StarredMedia.vue')
const FeaturedMediaView = () => import('@/domains/memora/views/starred/FeaturedMedia.vue')
const HomepageView = () => import('@/domains/memora/views/Homepage.vue')
const BrandingView = () => import('@/domains/memora/views/settings/Branding.vue')
const WatermarkView = () => import('@/domains/memora/views/settings/watermark/Watermark.vue')
const PresetView = () => import('@/domains/memora/views/settings/Preset.vue')
const EmailTemplateView = () => import('@/domains/memora/views/settings/EmailTemplate.vue')
const PreferenceView = () => import('@/domains/memora/views/settings/Preference.vue')
const EmailNotificationsView = () => import('@/domains/memora/views/settings/EmailNotifications.vue')
const EmailSettingsView = () => import('@/domains/memora/views/settings/EmailSettings.vue')
const SocialLinksView = () => import('@/domains/memora/views/settings/SocialLinks.vue')
const AddWatermarkView = () => import('@/domains/memora/views/settings/watermark/AddWatermark.vue')
const PresetGeneralView = () => import('@/domains/memora/views/preset/General.vue')
const PresetDesignView = () => import('@/domains/memora/views/preset/Design.vue')
const PresetPrivacyView = () => import('@/domains/memora/views/preset/Privacy.vue')
const PresetDownloadView = () => import('@/domains/memora/views/preset/Download.vue')
const PresetFavoriteView = () => import('@/domains/memora/views/preset/Favorite.vue')
const CollectionPreviewView = () => import('@/domains/memora/views/preview/CollectionPreview.vue')
const CollectionPhotosView = () => import('@/domains/memora/views/collections/Photos.vue')
const CollectionCoverView = () => import('@/domains/memora/views/collections/design/Cover.vue')
const CollectionTypographyView = () => import('@/domains/memora/views/collections/design/Typography.vue')
const CollectionColorView = () => import('@/domains/memora/views/collections/design/Color.vue')
const CollectionGridView = () => import('@/domains/memora/views/collections/design/Grid.vue')
const CollectionSettingsGeneralView = () => import('@/domains/memora/views/collections/settings/General.vue')
const CollectionSettingsPrivacyView = () => import('@/domains/memora/views/collections/settings/Privacy.vue')
const CollectionSettingsDownloadView = () => import('@/domains/memora/views/collections/settings/Download.vue')
const CollectionSettingsDownloadGeneralView = () => import('@/domains/memora/views/collections/settings/DownloadGeneral.vue')
const CollectionSettingsDownloadAdvancedView = () => import('@/domains/memora/views/collections/settings/DownloadAdvanced.vue')
const CollectionSettingsFavoriteView = () => import('@/domains/memora/views/collections/settings/Favorite.vue')
const CollectionActivitiesView = () => import('@/domains/memora/views/collections/activities/Activities.vue')
const CollectionActivitiesDownloadView = () => import('@/domains/memora/views/collections/activities/DownloadActivity.vue')
const CollectionActivitiesFavouriteView = () => import('@/domains/memora/views/collections/activities/FavouriteActivity.vue')
const CollectionActivitiesEmailRegistrationView = () => import('@/domains/memora/views/collections/activities/EmailRegistration.vue')
const CollectionActivitiesQuickShareView = () => import('@/domains/memora/views/collections/activities/QuickShareLinks.vue')
const CollectionActivitiesPrivateMediaView = () => import('@/domains/memora/views/collections/activities/PrivateMedia.vue')
const ProjectDashboardView = () => import('@/domains/memora/views/projects/ProjectDashboard.vue')
const CollectionPhaseView = () => import('@/domains/memora/views/projects/collections/CollectionPhase.vue')
const SelectionsListView = () => import('@/domains/memora/views/selections/Selections.vue')
const SelectionDetailView = () => import('@/domains/memora/views/selections/SelectionDetail.vue')
const ProofingListView = () => import('@/domains/memora/views/proofing/Proofing.vue')
const ProofingDetailView = () => import('@/domains/memora/views/proofing/ProofingDetail.vue')
const ProofingCommentsView = () => import('@/domains/memora/views/proofing/Comments.vue')
const RawFilesListView = () => import('@/domains/memora/views/user/memora/rawFiles/RawFiles.vue')
const RawFilesDetailView = () => import('@/domains/memora/views/user/memora/rawFiles/RawFilesDetail.vue')

export const memoraRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: { path: '/memora/dashboard' },
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/getting-started',
    name: 'gettingStarted',
    component: GettingStarted,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/dashboard',
    name: 'memoraDashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections',
    name: 'manageCollections',
    component: CollectionsView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/starred',
    name: 'starredCollections',
    component: StarredCollectionsView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/folders/starred',
    name: 'starredFolders',
    component: StarredFoldersView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/photos/starred',
    name: 'starredMedias',
    component: StarredMediaView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/photos/featured',
    name: 'featuredMedias',
    component: FeaturedMediaView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/media/my',
    name: 'myMedia',
    component: () => import('@/domains/memora/views/MyMedia.vue'),
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/projects/starred',
    name: 'starredProjects',
    component: () => import('@/domains/memora/views/starred/StarredProjects.vue'),
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/selections/starred',
    name: 'starredSelections',
    component: () => import('@/domains/memora/views/starred/StarredSelections.vue'),
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/proofing/starred',
    name: 'starredProofing',
    component: () => import('@/domains/memora/views/starred/StarredProofing.vue'),
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/raw-files/starred',
    name: 'starredRawFiles',
    component: () => import('@/domains/memora/views/starred/StarredRawFiles.vue'),
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/homepage',
    name: 'homepageConfig',
    component: HomepageView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/branding',
    name: 'brandingSettings',
    component: BrandingView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/watermark',
    name: 'watermarkSettings',
    component: WatermarkView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/preset',
    name: 'presetSettings',
    component: PresetView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/email-template',
    name: 'emailTemplateSettings',
    component: EmailTemplateView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/preference',
    name: 'preferenceSettings',
    component: PreferenceView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/email-notifications',
    name: 'emailNotificationsSettings',
    component: EmailNotificationsView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/email-settings',
    name: 'emailSettings',
    component: EmailSettingsView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/social-links',
    name: 'socialLinksSettings',
    component: SocialLinksView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/settings/watermark/add',
    name: 'addWatermark',
    component: AddWatermarkView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
      parent: 'watermarkSettings',
    },
  },
  {
    path: '/memora/settings/watermark/:id',
    name: 'editWatermark',
    component: AddWatermarkView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
      parent: 'watermarkSettings',
    },
  },
  {
    path: '/memora/preset/:id/general',
    name: 'presetGeneral',
    component: PresetGeneralView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/design',
    name: 'presetDesign',
    component: PresetDesignView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/privacy',
    name: 'presetPrivacy',
    component: PresetPrivacyView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/download',
    name: 'presetDownload',
    component: PresetDownloadView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/favorite',
    name: 'presetFavorite',
    component: PresetFavoriteView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:name/preview',
    name: 'presetPreview',
    component: CollectionPreviewView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
      parent: 'presetSettings',
    },
  },
  // Public collection route - format: /memora/:domainOrUsername/collections/:id
  {
    path: '/memora/:domainOrUsername/collections/:id',
    name: 'publicCollection',
    component: CollectionPreviewView,
    meta: {
      requiresAuth: false, // Public route
    },
  },
  // Legacy preview route - redirect to new format
  {
    path: '/memora/preview/:id',
    name: 'collectionPreview',
    redirect: to => {
      // Try to get domain from route params if available, otherwise use 'default'
      const domainOrUsername = to.params.domainOrUsername || 'default'
      return {
        name: 'publicCollection',
        params: {
          domainOrUsername,
          id: to.params.id,
        },
        query: to.query,
      }
    },
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/collections/:uuid/photos',
    name: 'collectionPhotos',
    component: CollectionPhotosView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/design/cover',
    name: 'collectionCover',
    component: CollectionCoverView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
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
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/design/color',
    name: 'collectionColor',
    component: CollectionColorView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/design/grid',
    name: 'collectionGrid',
    component: CollectionGridView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/settings/general',
    name: 'collectionSettingsGeneral',
    component: CollectionSettingsGeneralView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/settings/privacy',
    name: 'collectionSettingsPrivacy',
    component: CollectionSettingsPrivacyView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
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
      productSlug: 'memora',
    },
    children: [
      {
        path: 'general',
        name: 'collectionSettingsDownloadGeneral',
        component: CollectionSettingsDownloadGeneralView,
        meta: {
          requiresAuth: true,
      productSlug: 'memora',
        },
      },
      {
        path: 'advanced',
        name: 'collectionSettingsDownloadAdvanced',
        component: CollectionSettingsDownloadAdvancedView,
        meta: {
          requiresAuth: true,
      productSlug: 'memora',
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
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/activities',
    name: 'collectionActivities',
    component: CollectionActivitiesView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/activities/download',
    name: 'collectionActivitiesDownload',
    component: CollectionActivitiesDownloadView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/activities/favourite',
    name: 'collectionActivitiesFavourite',
    component: CollectionActivitiesFavouriteView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/activities/email-registration',
    name: 'collectionActivitiesEmailRegistration',
    component: CollectionActivitiesEmailRegistrationView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/activities/quick-share',
    name: 'collectionActivitiesQuickShare',
    component: CollectionActivitiesQuickShareView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/collections/:uuid/activities/private-media',
    name: 'collectionActivitiesPrivateMedia',
    component: CollectionActivitiesPrivateMediaView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  // Standalone Selections and Proofing Routes
  {
    path: '/memora/selections',
    name: 'selections',
    component: SelectionsListView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/selections/:id',
    name: 'selectionDetail',
    component: SelectionDetailView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/proofing',
    name: 'proofing',
    component: ProofingListView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/proofing/:id',
    name: 'proofingDetail',
    component: ProofingDetailView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/proofing/:id/comments',
    name: 'proofingComments',
    component: ProofingCommentsView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/raw-files',
    name: 'rawFiles',
    component: RawFilesListView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/raw-files/:id',
    name: 'rawFilesDetail',
    component: RawFilesDetailView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  // Project Routes
  {
    path: '/memora/projects',
    name: 'projects',
    component: () => import('@/domains/memora/views/projects/Projects.vue'),
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/projects/:id',
    name: 'projectDashboard',
    component: ProjectDashboardView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
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
      productSlug: 'memora',
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
      productSlug: 'memora',
    },
  },
  {
    path: '/memora/projects/:id/collections',
    name: 'projectCollections',
    component: CollectionPhaseView,
    meta: {
      requiresAuth: true,
      productSlug: 'memora',
    },
  },
]
