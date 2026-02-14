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
    path: '/overview/account',
    name: 'overview-account',
    component: () => import('@/shared/views/user/Account.vue'),
    redirect: { name: 'overview-account-general' },
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
    children: [
      {
        path: 'general',
        name: 'overview-account-general',
        component: () => import('@/shared/views/user/account/General.vue'),
        meta: { requiresAuth: true, requiresUser: true },
      },
      {
        path: 'billing',
        name: 'overview-account-billing',
        component: () => import('@/shared/views/user/account/Billing.vue'),
        meta: { requiresAuth: true, requiresUser: true },
      },
      {
        path: 'refer',
        name: 'overview-account-refer',
        component: () => import('@/shared/views/user/account/ReferAFriend.vue'),
        meta: { requiresAuth: true, requiresUser: true },
      },
    ],
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
