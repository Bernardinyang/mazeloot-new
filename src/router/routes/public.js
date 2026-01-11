import Home from '@/views/public/Home.vue'
import About from '@/views/public/About.vue'
import Products from '@/views/public/Products.vue'
import Pricing from '@/views/public/Pricing.vue'
import ContactUs from '@/views/public/ContactUs.vue'
import Waitlist from '@/views/public/Waitlist.vue'
import ClientSelectionView from '@/views/public/projects/_projectId/selections.vue'
import ClientProofingView from '@/views/public/projects/_projectId/proofing.vue'
import BrandHomepage from '@/views/public/BrandHomepage.vue'

export const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/products',
    name: 'products',
    component: Products,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: Pricing,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactUs,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/waitlist',
    name: 'waitlist',
    component: Waitlist,
    meta: {
      requiresAuth: false,
    },
  },
  // Client project routes
  {
    path: '/p/:projectId/selections',
    name: 'clientSelections',
    component: ClientSelectionView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/p/:projectId/proofing',
    name: 'clientProofing',
    component: ClientProofingView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/p/:projectId/collection',
    name: 'clientCollection',
    component: () => import('@/views/public/projects/_projectId/collection.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/p/:projectId/collection/download',
    name: 'clientCollectionDownload',
    component: () => import('@/views/public/projects/_projectId/download.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/cloud-storage/oauth/callback',
    name: 'cloudStorageOAuthCallback',
    component: () => import('@/views/public/CloudStorageOAuthCallback.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/closure-request/:token',
    name: 'closureRequest',
    component: () => import('@/views/public/ClosureRequest.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/p/approval-request/:token',
    name: 'approvalRequest',
    component: () => import('@/views/public/ApprovalRequest.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/homepage',
    name: 'brandHomepage',
    component: BrandHomepage,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFound.vue'),
  },
]
