import { useUserStore } from '@/shared/stores/user'

function createFeatureGuard(requiredFeature) {
  return (to, from, next) => {
    const userStore = useUserStore()
    const features = userStore.user?.memora_features ?? []
    const hasAccess = Array.isArray(features) && features.includes(requiredFeature)
    if (!hasAccess) {
      next({ name: 'memora-pricing', query: { upgrade: requiredFeature } })
    } else {
      next()
    }
  }
}

export const memoraRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: { name: 'memoraDashboard' },
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/getting-started',
    name: 'gettingStarted',
    component: () => import('@/shared/views/user/GettingStarted.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/dashboard',
    name: 'memoraDashboard',
    component: () => import('@/domains/memora/views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/pricing',
    name: 'memora-pricing',
    component: () => import('@/domains/memora/views/DashboardPricing.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/plan-requests',
    name: 'memora-plan-requests',
    component: () => import('@/domains/memora/views/MyPlanRequests.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/downgrade/confirm',
    name: 'memora-downgrade-confirm',
    component: () => import('@/domains/memora/views/DowngradeConfirm.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/pricing/checkout',
    name: 'memora-plan-summary',
    component: () => import('@/domains/memora/views/PlanSummary.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/pricing/status',
    name: 'memora-pricing-status',
    component: () => import('@/domains/memora/views/DashboardSubscriptionStatus.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/build-your-own',
    name: 'memora-build-your-own',
    component: () => import('@/domains/memora/views/DashboardBuildYourOwn.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/usage',
    name: 'memora-usage',
    component: () => import('@/domains/memora/views/UsageAnalytics.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections',
    name: 'manageCollections',
    component: () => import('@/domains/memora/views/Collections.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/starred',
    name: 'starredCollections',
    component: () => import('@/domains/memora/views/starred/StarredCollections.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/folders/starred',
    name: 'starredFolders',
    component: () => import('@/domains/memora/views/starred/StarredFolders.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/photos/starred',
    name: 'starredMedias',
    component: () => import('@/domains/memora/views/starred/StarredMedia.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/photos/featured',
    name: 'featuredMedias',
    component: () => import('@/domains/memora/views/starred/FeaturedMedia.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/media/my',
    name: 'myMedia',
    component: () => import('@/domains/memora/views/MyMedia.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/projects/starred',
    name: 'starredProjects',
    component: () => import('@/domains/memora/views/starred/StarredProjects.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/selections/starred',
    name: 'starredSelections',
    component: () => import('@/domains/memora/views/starred/StarredSelections.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/raw-files/starred',
    name: 'starredRawFiles',
    component: () => import('@/domains/memora/views/starred/StarredRawFiles.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/proofing/starred',
    name: 'starredProofing',
    component: () => import('@/domains/memora/views/starred/StarredProofing.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/homepage',
    name: 'homepageConfig',
    component: () => import('@/domains/memora/views/Homepage.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/branding',
    name: 'brandingSettings',
    component: () => import('@/domains/memora/views/settings/Branding.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/watermark',
    name: 'watermarkSettings',
    component: () => import('@/domains/memora/views/settings/watermark/Watermark.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/preset',
    name: 'presetSettings',
    component: () => import('@/domains/memora/views/settings/Preset.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/email-template',
    name: 'emailTemplateSettings',
    component: () => import('@/domains/memora/views/settings/EmailTemplate.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/preference',
    name: 'preferenceSettings',
    component: () => import('@/domains/memora/views/settings/Preference.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/email-notifications',
    name: 'emailNotificationsSettings',
    component: () => import('@/domains/memora/views/settings/EmailNotifications.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/social-links',
    name: 'socialLinksSettings',
    component: () => import('@/domains/memora/views/settings/SocialLinks.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/settings/watermark/add',
    name: 'addWatermark',
    component: () => import('@/domains/memora/views/settings/watermark/AddWatermark.vue'),
    meta: {
      requiresAuth: true,
      parent: 'watermarkSettings',
    },
  },
  {
    path: '/memora/settings/watermark/:id',
    name: 'editWatermark',
    component: () => import('@/domains/memora/views/settings/watermark/AddWatermark.vue'),
    meta: {
      requiresAuth: true,
      parent: 'watermarkSettings',
    },
  },
  {
    path: '/memora/preset/:id/general',
    name: 'presetGeneral',
    component: () => import('@/domains/memora/views/preset/General.vue'),
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/design',
    name: 'presetDesign',
    component: () => import('@/domains/memora/views/preset/Design.vue'),
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/privacy',
    name: 'presetPrivacy',
    component: () => import('@/domains/memora/views/preset/Privacy.vue'),
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/download',
    name: 'presetDownload',
    component: () => import('@/domains/memora/views/preset/Download.vue'),
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:id/favorite',
    name: 'presetFavorite',
    component: () => import('@/domains/memora/views/preset/Favorite.vue'),
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preset/:name/preview',
    name: 'presetPreview',
    component: () => import('@/domains/memora/views/preview/CollectionPreview.vue'),
    meta: {
      requiresAuth: true,
      parent: 'presetSettings',
    },
  },
  {
    path: '/memora/preview/:id',
    name: 'collectionPreview',
    component: () => import('@/domains/memora/views/preview/CollectionPreview.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/collections/:uuid/photos',
    name: 'collectionPhotos',
    component: () => import('@/domains/memora/views/collections/Photos.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/design/cover',
    name: 'collectionCover',
    component: () => import('@/domains/memora/views/collections/design/Cover.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
    beforeEnter: async (to, from, next) => {
      const { useGalleryStore } = await import('@/shared/stores/gallery')
      const galleryStore = useGalleryStore()
      let collection = galleryStore.collections.find(c => c.id === to.params.uuid)
      if (!collection) {
        try {
          collection = await galleryStore.fetchCollection(to.params.uuid)
        } catch (error) {
          return next()
        }
      }
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
    component: () => import('@/domains/memora/views/collections/design/Typography.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/design/color',
    name: 'collectionColor',
    component: () => import('@/domains/memora/views/collections/design/Color.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/design/grid',
    name: 'collectionGrid',
    component: () => import('@/domains/memora/views/collections/design/Grid.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/settings/general',
    name: 'collectionSettingsGeneral',
    component: () => import('@/domains/memora/views/collections/settings/General.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/settings/privacy',
    name: 'collectionSettingsPrivacy',
    component: () => import('@/domains/memora/views/collections/settings/Privacy.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/settings/download',
    name: 'collectionSettingsDownload',
    component: () => import('@/domains/memora/views/collections/settings/Download.vue'),
    redirect: to => ({
      name: 'collectionSettingsDownloadGeneral',
      params: to.params,
    }),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
    children: [
      {
        path: 'general',
        name: 'collectionSettingsDownloadGeneral',
        component: () => import('@/domains/memora/views/collections/settings/DownloadGeneral.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'advanced',
        name: 'collectionSettingsDownloadAdvanced',
        component: () => import('@/domains/memora/views/collections/settings/DownloadAdvanced.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/memora/collections/:uuid/settings/favorite',
    name: 'collectionSettingsFavorite',
    component: () => import('@/domains/memora/views/collections/settings/Favorite.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities',
    name: 'collectionActivities',
    component: () => import('@/domains/memora/views/collections/activities/Activities.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/download',
    name: 'collectionActivitiesDownload',
    component: () => import('@/domains/memora/views/collections/activities/DownloadActivity.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/favourite',
    name: 'collectionActivitiesFavourite',
    component: () => import('@/domains/memora/views/collections/activities/FavouriteActivity.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/email-registration',
    name: 'collectionActivitiesEmailRegistration',
    component: () => import('@/domains/memora/views/collections/activities/EmailRegistration.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/quick-share',
    name: 'collectionActivitiesQuickShare',
    component: () => import('@/domains/memora/views/collections/activities/QuickShareLinks.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/collections/:uuid/activities/private-media',
    name: 'collectionActivitiesPrivateMedia',
    component: () => import('@/domains/memora/views/collections/activities/PrivateMedia.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/selections',
    name: 'selections',
    component: () => import('@/domains/memora/views/selections/Selections.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/selections/:id',
    name: 'selectionDetail',
    component: () => import('@/domains/memora/views/selections/SelectionDetail.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/raw-files',
    name: 'rawFiles',
    component: () => import('@/domains/memora/views/raw-files/RawFiles.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
    beforeEnter: createFeatureGuard('raw_files'),
  },
  {
    path: '/memora/raw-files/:id',
    name: 'rawFileDetail',
    component: () => import('@/domains/memora/views/raw-files/RawFileDetail.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
    beforeEnter: createFeatureGuard('raw_files'),
  },
  {
    path: '/memora/proofing',
    name: 'proofing',
    component: () => import('@/domains/memora/views/proofing/Proofing.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
    beforeEnter: createFeatureGuard('proofing'),
  },
  {
    path: '/memora/proofing/:id',
    name: 'proofingDetail',
    component: () => import('@/domains/memora/views/proofing/ProofingDetail.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
    beforeEnter: createFeatureGuard('proofing'),
  },
  {
    path: '/memora/proofing/:id/comments',
    name: 'proofingComments',
    component: () => import('@/domains/memora/views/proofing/Comments.vue'),
    meta: { requiresAuth: true, requiresUser: true },
    beforeEnter: createFeatureGuard('proofing'),
  },
  {
    path: '/memora/projects',
    name: 'projects',
    component: () => import('@/domains/memora/views/projects/Projects.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/projects/:id',
    name: 'projectDashboard',
    component: () => import('@/domains/memora/views/projects/ProjectDashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/projects/:id/selections',
    name: 'projectSelections',
    redirect: to => {
      if (to.query.selectionId) {
        return {
          name: 'selectionDetail',
          params: { id: to.query.selectionId },
        }
      }
      return { name: 'selections' }
    },
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/projects/:id/proofing',
    name: 'projectProofing',
    redirect: to => {
      if (to.query.proofingId) {
        return {
          name: 'proofingDetail',
          params: { id: to.query.proofingId },
        }
      }
      return { name: 'proofing' }
    },
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/projects/:id/collections',
    name: 'projectCollections',
    component: () => import('@/domains/memora/views/projects/collections/CollectionPhase.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
]
