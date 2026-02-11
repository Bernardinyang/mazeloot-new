export const knowledgeBaseRoutes = [
  {
    path: '/memora/knowledge-base/documentation',
    name: 'knowledgeBaseDocumentation',
    component: () => import('@/shared/views/user/knowledge-base/Documentation.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/user-guides',
    name: 'knowledgeBaseUserGuides',
    component: () => import('@/shared/views/user/knowledge-base/UserGuides.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/video-tutorials',
    name: 'knowledgeBaseVideoTutorials',
    component: () => import('@/shared/views/user/knowledge-base/VideoTutorials.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/collections-guide',
    name: 'knowledgeBaseCollectionsGuide',
    component: () => import('@/shared/views/user/knowledge-base/CollectionsGuide.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/projects-workflow',
    name: 'knowledgeBaseProjectsWorkflow',
    component: () => import('@/shared/views/user/knowledge-base/ProjectsWorkflow.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/selections-guide',
    name: 'knowledgeBaseSelectionsGuide',
    component: () => import('@/shared/views/user/knowledge-base/SelectionsGuide.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/proofing-feedback',
    name: 'knowledgeBaseProofingFeedback',
    component: () => import('@/shared/views/user/knowledge-base/ProofingFeedback.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/design-presets',
    name: 'knowledgeBaseDesignPresets',
    component: () => import('@/shared/views/user/knowledge-base/DesignPresets.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/watermark-protection',
    name: 'knowledgeBaseWatermarkProtection',
    component: () => import('@/shared/views/user/knowledge-base/WatermarkProtection.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/homepage-setup',
    name: 'knowledgeBaseHomepageSetup',
    component: () => import('@/shared/views/user/knowledge-base/HomepageSetup.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/raw-files-management',
    name: 'knowledgeBaseRawFilesManagement',
    component: () => import('@/shared/views/user/knowledge-base/RawFilesManagement.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/faqs',
    name: 'knowledgeBaseFAQs',
    component: () => import('@/shared/views/user/knowledge-base/FAQs.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/best-practices',
    name: 'knowledgeBaseBestPractices',
    component: () => import('@/shared/views/user/knowledge-base/BestPractices.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/memora/knowledge-base/branding-customization',
    name: 'knowledgeBaseBrandingCustomization',
    component: () => import('@/shared/views/user/knowledge-base/BrandingCustomization.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
]
