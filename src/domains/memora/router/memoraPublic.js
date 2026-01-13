import ClientSelectionView from '@/domains/memora/views/public-projects/_projectId/selections.vue'
import ClientProofingView from '@/domains/memora/views/public-projects/_projectId/proofing.vue'
import BrandHomepage from '@/shared/views/public/BrandHomepage.vue'

export const memoraPublicRoutes = [
  {
    path: '/memora/client/selections',
    name: 'clientSelections',
    component: ClientSelectionView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/client/proofing',
    name: 'clientProofing',
    component: ClientProofingView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/client/collection',
    name: 'clientCollection',
    component: () => import('@/domains/memora/views/public-projects/_projectId/collection.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/client/collection/download',
    name: 'clientCollectionDownload',
    component: () => import('@/domains/memora/views/public-projects/_projectId/download.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/client/cloud-storage/oauth/callback',
    name: 'cloudStorageOAuthCallback',
    component: () => import('@/shared/views/public/CloudStorageOAuthCallback.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/closure-request/:token',
    name: 'closureRequest',
    component: () => import('@/shared/views/public/ClosureRequest.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/approval-request/:token',
    name: 'approvalRequest',
    component: () => import('@/shared/views/public/ApprovalRequest.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/homepage',
    name: 'brandHomepage',
    component: BrandHomepage,
    meta: {
      requiresAuth: false,
    },
  },
]
