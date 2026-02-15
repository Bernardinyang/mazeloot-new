const clientDesc = 'View and interact with your client gallery on Mazeloot.'

export const memoraPublicRoutes = [
  { path: '/memora/:domain/selections/:selectionId', name: 'clientSelections', component: () => import('@/domains/memora/views/public-projects/_projectId/selections.vue'), meta: { requiresAuth: false, title: 'Selections | Mazeloot', description: clientDesc } },
  { path: '/memora/:domain/raw-files/:rawFileId', name: 'clientRawFiles', component: () => import('@/domains/memora/views/public-projects/_projectId/raw-files.vue'), meta: { requiresAuth: false, title: 'Raw Files | Mazeloot', description: clientDesc } },
  { path: '/memora/:domain/proofing/:proofingId', name: 'clientProofing', component: () => import('@/domains/memora/views/public-projects/_projectId/proofing.vue'), meta: { requiresAuth: false, title: 'Proofing | Mazeloot', description: clientDesc } },
  { path: '/memora/:domain/collection/:collectionId', name: 'clientCollection', component: () => import('@/domains/memora/views/public-projects/_projectId/collection.vue'), meta: { requiresAuth: false, title: 'Collection | Mazeloot', description: clientDesc } },
  { path: '/memora/:domain/collection/:collectionId/download', name: 'clientCollectionDownload', component: () => import('@/domains/memora/views/public-projects/_projectId/download.vue'), meta: { requiresAuth: false, title: 'Download | Mazeloot', description: clientDesc } },
  { path: '/memora/:domain/raw-files/:rawFileId/download', name: 'clientRawFileDownload', component: () => import('@/domains/memora/views/public-projects/_projectId/download-raw-file.vue'), meta: { requiresAuth: false, title: 'Download | Mazeloot', description: clientDesc } },
  { path: '/memora/client/cloud-storage/oauth/callback', name: 'cloudStorageOAuthCallback', component: () => import('@/shared/views/public/CloudStorageOAuthCallback.vue'), meta: { requiresAuth: false, title: 'Mazeloot', description: clientDesc } },
  { path: '/memora/closure-request/:token', name: 'closureRequest', component: () => import('@/shared/views/public/ClosureRequest.vue'), meta: { requiresAuth: false, title: 'Closure Request | Mazeloot', description: clientDesc } },
  { path: '/memora/approval-request/:token', name: 'approvalRequest', component: () => import('@/shared/views/public/ApprovalRequest.vue'), meta: { requiresAuth: false, title: 'Approval Request | Mazeloot', description: clientDesc } },
  { path: '/memora/homepage', name: 'brandHomepage', component: () => import('@/shared/views/public/BrandHomepage.vue'), meta: { requiresAuth: false, title: 'Home | Mazeloot', description: clientDesc } },
]
