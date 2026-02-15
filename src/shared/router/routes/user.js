const appDesc = 'Professional gallery and client proofing platform for creatives.'

export const userRoutes = [
  {
    path: '/suspended',
    name: 'suspended',
    component: () => import('@/shared/views/user/AccountSuspended.vue'),
    meta: { requiresAuth: true, requiresUser: true, title: 'Account suspended | Mazeloot', description: appDesc },
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/shared/views/user/Overview.vue'),
    meta: { requiresAuth: true, requiresUser: true, title: 'Overview | Mazeloot', description: appDesc },
  },
  {
    path: '/overview/account',
    name: 'overview-account',
    component: () => import('@/shared/views/user/Account.vue'),
    redirect: { name: 'overview-account-general' },
    meta: { requiresAuth: true, requiresUser: true, title: 'Account | Mazeloot', description: appDesc },
    children: [
      { path: 'general', name: 'overview-account-general', component: () => import('@/shared/views/user/account/General.vue'), meta: { requiresAuth: true, requiresUser: true, title: 'Account - General | Mazeloot', description: appDesc } },
      { path: 'billing', name: 'overview-account-billing', component: () => import('@/shared/views/user/account/Billing.vue'), meta: { requiresAuth: true, requiresUser: true, title: 'Account - Billing | Mazeloot', description: appDesc } },
      { path: 'refer', name: 'overview-account-refer', component: () => import('@/shared/views/user/account/ReferAFriend.vue'), meta: { requiresAuth: true, requiresUser: true, title: 'Refer a Friend | Mazeloot', description: appDesc } },
    ],
  },
  {
    path: '/onboarding/:productSlug/:token',
    name: 'onboarding',
    component: () => import('@/shared/views/user/Onboarding.vue'),
    meta: { requiresAuth: true, requiresUser: true, title: 'Onboarding | Mazeloot', description: appDesc },
  },
]
