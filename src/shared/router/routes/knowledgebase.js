import Documentation from '@/shared/views/user/knowledge-base/Documentation.vue'
import UserGuides from '@/shared/views/user/knowledge-base/UserGuides.vue'
import VideoTutorials from '@/shared/views/user/knowledge-base/VideoTutorials.vue'
import CollectionsGuide from '@/shared/views/user/knowledge-base/CollectionsGuide.vue'
import ProjectsWorkflow from '@/shared/views/user/knowledge-base/ProjectsWorkflow.vue'
import SelectionsGuide from '@/shared/views/user/knowledge-base/SelectionsGuide.vue'
import ProofingFeedback from '@/shared/views/user/knowledge-base/ProofingFeedback.vue'
import DesignPresets from '@/shared/views/user/knowledge-base/DesignPresets.vue'
import WatermarkProtection from '@/shared/views/user/knowledge-base/WatermarkProtection.vue'
import HomepageSetup from '@/shared/views/user/knowledge-base/HomepageSetup.vue'
import RawFilesManagement from '@/shared/views/user/knowledge-base/RawFilesManagement.vue'
import FAQs from '@/shared/views/user/knowledge-base/FAQs.vue'
import BestPractices from '@/shared/views/user/knowledge-base/BestPractices.vue'
import BrandingCustomization from '@/shared/views/user/knowledge-base/BrandingCustomization.vue'

export const knowledgeBaseRoutes = [
    {
        path: '/memora/knowledge-base/documentation',
        name: 'knowledgeBaseDocumentation',
        component: Documentation,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/user-guides',
        name: 'knowledgeBaseUserGuides',
        component: UserGuides,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/video-tutorials',
        name: 'knowledgeBaseVideoTutorials',
        component: VideoTutorials,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/collections-guide',
        name: 'knowledgeBaseCollectionsGuide',
        component: CollectionsGuide,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/projects-workflow',
        name: 'knowledgeBaseProjectsWorkflow',
        component: ProjectsWorkflow,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/selections-guide',
        name: 'knowledgeBaseSelectionsGuide',
        component: SelectionsGuide,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/proofing-feedback',
        name: 'knowledgeBaseProofingFeedback',
        component: ProofingFeedback,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/design-presets',
        name: 'knowledgeBaseDesignPresets',
        component: DesignPresets,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/watermark-protection',
        name: 'knowledgeBaseWatermarkProtection',
        component: WatermarkProtection,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/homepage-setup',
        name: 'knowledgeBaseHomepageSetup',
        component: HomepageSetup,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/raw-files-management',
        name: 'knowledgeBaseRawFilesManagement',
        component: RawFilesManagement,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/faqs',
        name: 'knowledgeBaseFAQs',
        component: FAQs,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/best-practices',
        name: 'knowledgeBaseBestPractices',
        component: BestPractices,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
    {
        path: '/memora/knowledge-base/branding-customization',
        name: 'knowledgeBaseBrandingCustomization',
        component: BrandingCustomization,
        meta: {
            requiresAuth: true,
            requiresUser: true,
        },
    },
]
