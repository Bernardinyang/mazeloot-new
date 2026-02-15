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

const m = (title, rest = {}) => ({ title: title ? `${title} | Mazeloot` : 'Mazeloot', description: 'Professional gallery and client proofing platform for creatives.', ...rest })

export const memoraRoutes = [
  { path: '/dashboard', name: 'dashboard', redirect: { name: 'memoraDashboard' }, meta: { requiresAuth: true, requiresUser: true, ...m('Dashboard') } },
  { path: '/memora/getting-started', name: 'gettingStarted', component: () => import('@/shared/views/user/GettingStarted.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Getting Started') } },
  { path: '/memora/dashboard', name: 'memoraDashboard', component: () => import('@/domains/memora/views/Dashboard.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Dashboard') } },
  { path: '/memora/pricing', name: 'memora-pricing', component: () => import('@/domains/memora/views/DashboardPricing.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Pricing') } },
  { path: '/memora/plan-requests', name: 'memora-plan-requests', component: () => import('@/domains/memora/views/MyPlanRequests.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Plan Requests') } },
  { path: '/memora/downgrade/confirm', name: 'memora-downgrade-confirm', component: () => import('@/domains/memora/views/DowngradeConfirm.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Downgrade') } },
  { path: '/memora/pricing/checkout', name: 'memora-plan-summary', component: () => import('@/domains/memora/views/PlanSummary.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Checkout') } },
  { path: '/memora/pricing/status', name: 'memora-pricing-status', component: () => import('@/domains/memora/views/DashboardSubscriptionStatus.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Subscription Status') } },
  { path: '/memora/build-your-own', name: 'memora-build-your-own', component: () => import('@/domains/memora/views/DashboardBuildYourOwn.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Build Your Own') } },
  { path: '/memora/usage', name: 'memora-usage', component: () => import('@/domains/memora/views/UsageAnalytics.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Usage') } },
  { path: '/memora/collections', name: 'manageCollections', component: () => import('@/domains/memora/views/Collections.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collections') } },
  { path: '/memora/collections/starred', name: 'starredCollections', component: () => import('@/domains/memora/views/starred/StarredCollections.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Starred Collections') } },
  { path: '/memora/folders/starred', name: 'starredFolders', component: () => import('@/domains/memora/views/starred/StarredFolders.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Starred Folders') } },
  { path: '/memora/photos/starred', name: 'starredMedias', component: () => import('@/domains/memora/views/starred/StarredMedia.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Starred Photos') } },
  { path: '/memora/photos/featured', name: 'featuredMedias', component: () => import('@/domains/memora/views/starred/FeaturedMedia.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Featured Photos') } },
  { path: '/memora/media/my', name: 'myMedia', component: () => import('@/domains/memora/views/MyMedia.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('My Media') } },
  { path: '/memora/projects/starred', name: 'starredProjects', component: () => import('@/domains/memora/views/starred/StarredProjects.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Starred Projects') } },
  { path: '/memora/selections/starred', name: 'starredSelections', component: () => import('@/domains/memora/views/starred/StarredSelections.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Starred Selections') } },
  { path: '/memora/raw-files/starred', name: 'starredRawFiles', component: () => import('@/domains/memora/views/starred/StarredRawFiles.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Starred Raw Files') } },
  { path: '/memora/proofing/starred', name: 'starredProofing', component: () => import('@/domains/memora/views/starred/StarredProofing.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Starred Proofing') } },
  { path: '/memora/settings/homepage', name: 'homepageConfig', component: () => import('@/domains/memora/views/Homepage.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Homepage Settings') } },
  { path: '/memora/settings/branding', name: 'brandingSettings', component: () => import('@/domains/memora/views/settings/Branding.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Branding') } },
  { path: '/memora/settings/watermark', name: 'watermarkSettings', component: () => import('@/domains/memora/views/settings/watermark/Watermark.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Watermarks') } },
  { path: '/memora/settings/preset', name: 'presetSettings', component: () => import('@/domains/memora/views/settings/Preset.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Design Presets') } },
  { path: '/memora/settings/email-template', name: 'emailTemplateSettings', component: () => import('@/domains/memora/views/settings/EmailTemplate.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Email Template') } },
  { path: '/memora/settings/preference', name: 'preferenceSettings', component: () => import('@/domains/memora/views/settings/Preference.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Preferences') } },
  { path: '/memora/settings/email-notifications', name: 'emailNotificationsSettings', component: () => import('@/domains/memora/views/settings/EmailNotifications.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Email Notifications') } },
  { path: '/memora/settings/social-links', name: 'socialLinksSettings', component: () => import('@/domains/memora/views/settings/SocialLinks.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Social Links') } },
  { path: '/memora/settings/watermark/add', name: 'addWatermark', component: () => import('@/domains/memora/views/settings/watermark/AddWatermark.vue'), meta: { requiresAuth: true, parent: 'watermarkSettings', ...m('Add Watermark') } },
  { path: '/memora/settings/watermark/:id', name: 'editWatermark', component: () => import('@/domains/memora/views/settings/watermark/AddWatermark.vue'), meta: { requiresAuth: true, parent: 'watermarkSettings', ...m('Edit Watermark') } },
  { path: '/memora/preset/:id/general', name: 'presetGeneral', component: () => import('@/domains/memora/views/preset/General.vue'), meta: { requiresAuth: true, parent: 'presetSettings', ...m('Preset General') } },
  { path: '/memora/preset/:id/design', name: 'presetDesign', component: () => import('@/domains/memora/views/preset/Design.vue'), meta: { requiresAuth: true, parent: 'presetSettings', ...m('Preset Design') } },
  { path: '/memora/preset/:id/privacy', name: 'presetPrivacy', component: () => import('@/domains/memora/views/preset/Privacy.vue'), meta: { requiresAuth: true, parent: 'presetSettings', ...m('Preset Privacy') } },
  { path: '/memora/preset/:id/download', name: 'presetDownload', component: () => import('@/domains/memora/views/preset/Download.vue'), meta: { requiresAuth: true, parent: 'presetSettings', ...m('Preset Download') } },
  { path: '/memora/preset/:id/favorite', name: 'presetFavorite', component: () => import('@/domains/memora/views/preset/Favorite.vue'), meta: { requiresAuth: true, parent: 'presetSettings', ...m('Preset Favorites') } },
  { path: '/memora/preset/:name/preview', name: 'presetPreview', component: () => import('@/domains/memora/views/preview/CollectionPreview.vue'), meta: { requiresAuth: true, parent: 'presetSettings', ...m('Collection Preview') } },
  { path: '/memora/preview/:id', name: 'collectionPreview', component: () => import('@/domains/memora/views/preview/CollectionPreview.vue'), meta: { requiresAuth: false, ...m('Preview') } },
  { path: '/memora/collections/:uuid/photos', name: 'collectionPhotos', component: () => import('@/domains/memora/views/collections/Photos.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collection Photos') } },
  {
    path: '/memora/collections/:uuid/design/cover',
    name: 'collectionCover',
    component: () => import('@/domains/memora/views/collections/design/Cover.vue'),
    meta: { requiresAuth: true, requiresUser: true, ...m('Collection Cover') },
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
  { path: '/memora/collections/:uuid/design/typography', name: 'collectionTypography', component: () => import('@/domains/memora/views/collections/design/Typography.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collection Typography') } },
  { path: '/memora/collections/:uuid/design/color', name: 'collectionColor', component: () => import('@/domains/memora/views/collections/design/Color.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collection Color') } },
  { path: '/memora/collections/:uuid/design/grid', name: 'collectionGrid', component: () => import('@/domains/memora/views/collections/design/Grid.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collection Grid') } },
  { path: '/memora/collections/:uuid/settings/general', name: 'collectionSettingsGeneral', component: () => import('@/domains/memora/views/collections/settings/General.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collection Settings') } },
  { path: '/memora/collections/:uuid/settings/privacy', name: 'collectionSettingsPrivacy', component: () => import('@/domains/memora/views/collections/settings/Privacy.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collection Privacy') } },
  { path: '/memora/collections/:uuid/settings/download', name: 'collectionSettingsDownload', component: () => import('@/domains/memora/views/collections/settings/Download.vue'), redirect: to => ({ name: 'collectionSettingsDownloadGeneral', params: to.params }), meta: { requiresAuth: true, requiresUser: true, ...m('Download Settings') }, children: [{ path: 'general', name: 'collectionSettingsDownloadGeneral', component: () => import('@/domains/memora/views/collections/settings/DownloadGeneral.vue'), meta: { requiresAuth: true, ...m('Download General') } }, { path: 'advanced', name: 'collectionSettingsDownloadAdvanced', component: () => import('@/domains/memora/views/collections/settings/DownloadAdvanced.vue'), meta: { requiresAuth: true, ...m('Download Advanced') } }] },
  { path: '/memora/collections/:uuid/settings/favorite', name: 'collectionSettingsFavorite', component: () => import('@/domains/memora/views/collections/settings/Favorite.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collection Favorites') } },
  { path: '/memora/collections/:uuid/activities', name: 'collectionActivities', component: () => import('@/domains/memora/views/collections/activities/Activities.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Collection Activities') } },
  { path: '/memora/collections/:uuid/activities/download', name: 'collectionActivitiesDownload', component: () => import('@/domains/memora/views/collections/activities/DownloadActivity.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Download Activity') } },
  { path: '/memora/collections/:uuid/activities/favourite', name: 'collectionActivitiesFavourite', component: () => import('@/domains/memora/views/collections/activities/FavouriteActivity.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Favourite Activity') } },
  { path: '/memora/collections/:uuid/activities/email-registration', name: 'collectionActivitiesEmailRegistration', component: () => import('@/domains/memora/views/collections/activities/EmailRegistration.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Email Registration') } },
  { path: '/memora/collections/:uuid/activities/quick-share', name: 'collectionActivitiesQuickShare', component: () => import('@/domains/memora/views/collections/activities/QuickShareLinks.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Quick Share') } },
  { path: '/memora/collections/:uuid/activities/private-media', name: 'collectionActivitiesPrivateMedia', component: () => import('@/domains/memora/views/collections/activities/PrivateMedia.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Private Media') } },
  { path: '/memora/selections', name: 'selections', component: () => import('@/domains/memora/views/selections/Selections.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Selections') } },
  { path: '/memora/selections/:id', name: 'selectionDetail', component: () => import('@/domains/memora/views/selections/SelectionDetail.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Selection') } },
  { path: '/memora/raw-files', name: 'rawFiles', component: () => import('@/domains/memora/views/raw-files/RawFiles.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Raw Files') }, beforeEnter: createFeatureGuard('raw_files') },
  { path: '/memora/raw-files/:id', name: 'rawFileDetail', component: () => import('@/domains/memora/views/raw-files/RawFileDetail.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Raw File') }, beforeEnter: createFeatureGuard('raw_files') },
  { path: '/memora/proofing', name: 'proofing', component: () => import('@/domains/memora/views/proofing/Proofing.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Proofing') }, beforeEnter: createFeatureGuard('proofing') },
  { path: '/memora/proofing/:id', name: 'proofingDetail', component: () => import('@/domains/memora/views/proofing/ProofingDetail.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Proofing') }, beforeEnter: createFeatureGuard('proofing') },
  { path: '/memora/proofing/:id/comments', name: 'proofingComments', component: () => import('@/domains/memora/views/proofing/Comments.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Proofing Comments') }, beforeEnter: createFeatureGuard('proofing') },
  { path: '/memora/projects', name: 'projects', component: () => import('@/domains/memora/views/projects/Projects.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Projects') } },
  { path: '/memora/projects/:id', name: 'projectDashboard', component: () => import('@/domains/memora/views/projects/ProjectDashboard.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Project') } },
  { path: '/memora/projects/:id/selections', name: 'projectSelections', redirect: to => (to.query.selectionId ? { name: 'selectionDetail', params: { id: to.query.selectionId } } : { name: 'selections' }), meta: { requiresAuth: true, requiresUser: true, ...m('Project Selections') } },
  { path: '/memora/projects/:id/proofing', name: 'projectProofing', redirect: to => (to.query.proofingId ? { name: 'proofingDetail', params: { id: to.query.proofingId } } : { name: 'proofing' }), meta: { requiresAuth: true, requiresUser: true, ...m('Project Proofing') } },
  { path: '/memora/projects/:id/collections', name: 'projectCollections', component: () => import('@/domains/memora/views/projects/collections/CollectionPhase.vue'), meta: { requiresAuth: true, requiresUser: true, ...m('Project Collections') } },
]
