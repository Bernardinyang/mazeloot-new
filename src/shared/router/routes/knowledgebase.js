const kbMeta = { requiresAuth: true, requiresUser: true }
const kbDesc = 'Memora knowledge base and help guides.'

export const knowledgeBaseRoutes = [
  { path: '/memora/knowledge-base/documentation', name: 'knowledgeBaseDocumentation', component: () => import('@/shared/views/user/knowledge-base/Documentation.vue'), meta: { ...kbMeta, title: 'Documentation | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/user-guides', name: 'knowledgeBaseUserGuides', component: () => import('@/shared/views/user/knowledge-base/UserGuides.vue'), meta: { ...kbMeta, title: 'User Guides | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/video-tutorials', name: 'knowledgeBaseVideoTutorials', component: () => import('@/shared/views/user/knowledge-base/VideoTutorials.vue'), meta: { ...kbMeta, title: 'Video Tutorials | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/collections-guide', name: 'knowledgeBaseCollectionsGuide', component: () => import('@/shared/views/user/knowledge-base/CollectionsGuide.vue'), meta: { ...kbMeta, title: 'Collections Guide | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/projects-workflow', name: 'knowledgeBaseProjectsWorkflow', component: () => import('@/shared/views/user/knowledge-base/ProjectsWorkflow.vue'), meta: { ...kbMeta, title: 'Projects & Workflow | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/selections-guide', name: 'knowledgeBaseSelectionsGuide', component: () => import('@/shared/views/user/knowledge-base/SelectionsGuide.vue'), meta: { ...kbMeta, title: 'Selections Guide | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/proofing-feedback', name: 'knowledgeBaseProofingFeedback', component: () => import('@/shared/views/user/knowledge-base/ProofingFeedback.vue'), meta: { ...kbMeta, title: 'Proofing & Feedback | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/design-presets', name: 'knowledgeBaseDesignPresets', component: () => import('@/shared/views/user/knowledge-base/DesignPresets.vue'), meta: { ...kbMeta, title: 'Design Presets | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/watermark-protection', name: 'knowledgeBaseWatermarkProtection', component: () => import('@/shared/views/user/knowledge-base/WatermarkProtection.vue'), meta: { ...kbMeta, title: 'Watermark Protection | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/homepage-setup', name: 'knowledgeBaseHomepageSetup', component: () => import('@/shared/views/user/knowledge-base/HomepageSetup.vue'), meta: { ...kbMeta, title: 'Homepage Setup | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/raw-files-management', name: 'knowledgeBaseRawFilesManagement', component: () => import('@/shared/views/user/knowledge-base/RawFilesManagement.vue'), meta: { ...kbMeta, title: 'Raw Files Management | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/faqs', name: 'knowledgeBaseFAQs', component: () => import('@/shared/views/user/knowledge-base/FAQs.vue'), meta: { ...kbMeta, title: 'FAQs | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/best-practices', name: 'knowledgeBaseBestPractices', component: () => import('@/shared/views/user/knowledge-base/BestPractices.vue'), meta: { ...kbMeta, title: 'Best Practices | Mazeloot', description: kbDesc } },
  { path: '/memora/knowledge-base/branding-customization', name: 'knowledgeBaseBrandingCustomization', component: () => import('@/shared/views/user/knowledge-base/BrandingCustomization.vue'), meta: { ...kbMeta, title: 'Branding & Customization | Mazeloot', description: kbDesc } },
]
