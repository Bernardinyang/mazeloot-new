export const userRoutes = [
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/shared/views/user/Overview.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/onboarding/:productSlug/:token',
    name: 'onboarding',
    component: () => import('@/shared/views/user/Onboarding.vue'),
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
]
