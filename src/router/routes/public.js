import Home from '@/views/public/Home.vue'
import About from '@/views/public/About.vue'
import ClientSelectionView from '@/views/public/projects/_projectId/selections.vue'
import ClientProofingView from '@/views/public/projects/_projectId/proofing.vue'

export const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: About,
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
    component: () => import('@/views/user/memora/preview/CollectionPreview.vue'),
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
