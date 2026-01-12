const Home = () => import('@/domains/memora/views/public/Home.vue')
const About = () => import('@/domains/memora/views/public/About.vue')
const Products = () => import('@/domains/memora/views/public/Products.vue')
const Pricing = () => import('@/domains/memora/views/public/Pricing.vue')
const ContactUs = () => import('@/domains/memora/views/public/ContactUs.vue')
const Waitlist = () => import('@/domains/memora/views/public/Waitlist.vue')
const ClientSelectionView = () => import('@/domains/memora/views/public/projects/_projectId/selections.vue')
const ClientProofingView = () => import('@/domains/memora/views/public/projects/_projectId/proofing.vue')
const ClientRawFilesView = () => import('@/domains/memora/views/public/projects/_projectId/rawFiles.vue')
const BrandHomepage = () => import('@/domains/memora/views/public/BrandHomepage.vue')

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
  // Public Memora routes - format: /memora/:domainOrUsername/...
  {
    path: '/memora/:domainOrUsername/selections/:id',
    name: 'publicSelections',
    component: ClientSelectionView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/:domainOrUsername/proofing/:id',
    name: 'publicProofing',
    component: ClientProofingView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/:domainOrUsername/collections/:id/download',
    name: 'publicCollectionDownload',
    component: () => import('@/domains/memora/views/public/projects/_projectId/download.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/memora/:domainOrUsername/raw-files/:id',
    name: 'publicRawFiles',
    component: ClientRawFilesView,
    meta: {
      requiresAuth: false,
    },
  },
  // Legacy client project routes - redirect to new format
  {
    path: '/p/:projectId/selections',
    name: 'clientSelections',
    redirect: to => ({
      name: 'publicSelections',
      params: {
        domainOrUsername: 'default', // Fallback, should be resolved from project
        id: to.params.projectId,
      },
      query: to.query,
    }),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/p/:projectId/proofing',
    name: 'clientProofing',
    redirect: to => ({
      name: 'publicProofing',
      params: {
        domainOrUsername: 'default', // Fallback, should be resolved from project
        id: to.params.projectId,
      },
      query: to.query,
    }),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/p/:projectId/collection',
    name: 'clientCollection',
    redirect: to => ({
      name: 'publicCollection',
      params: {
        domainOrUsername: 'default', // Fallback, should be resolved from project
        id: to.query.collectionId || to.params.projectId,
      },
      query: to.query,
    }),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/p/:projectId/collection/download',
    name: 'clientCollectionDownload',
    redirect: to => ({
      name: 'publicCollectionDownload',
      params: {
        domainOrUsername: 'default', // Fallback, should be resolved from project
        id: to.query.collectionId || to.params.projectId,
      },
      query: to.query,
    }),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/cloud-storage/oauth/callback',
    name: 'cloudStorageOAuthCallback',
    component: () => import('@/domains/memora/views/public/CloudStorageOAuthCallback.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/closure-request/:token',
    name: 'closureRequest',
    component: () => import('@/domains/memora/views/public/ClosureRequest.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/p/approval-request/:token',
    name: 'approvalRequest',
    component: () => import('@/domains/memora/views/public/ApprovalRequest.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  // Public brand homepage - format: /memora/:domainOrUsername/homepage
  {
    path: '/memora/:domainOrUsername/homepage',
    name: 'publicBrandHomepage',
    component: BrandHomepage,
    meta: {
      requiresAuth: false,
    },
  },
  // Legacy homepage route - redirect to new format
  {
    path: '/homepage',
    name: 'brandHomepage',
    redirect: to => ({
      name: 'publicBrandHomepage',
      params: {
        domainOrUsername: to.query.userId || 'default',
      },
      query: to.query,
    }),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/domains/memora/views/NotFound.vue'),
  },
]
