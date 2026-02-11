export const guestRoutes = [
  {
    path: '/product-selection/:token',
    name: 'productSelection',
    component: () => import('@/shared/views/guest/ProductSelection.vue'),
    meta: {
      requiresAuth: false,
      isGuestRoute: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/shared/views/guest/Login.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/shared/views/guest/Register.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/verify-email',
    name: 'verifyEmail',
    component: () => import('@/shared/views/guest/VerifyEmail.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: () => import('@/shared/views/guest/ForgotPassword.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: () => import('@/shared/views/guest/ResetPassword.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/auth/oauth/callback',
    name: 'oauthCallback',
    component: () => import('@/shared/views/guest/OAuthCallback.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/auth/magic-link/verify',
    name: 'magicLinkVerify',
    component: () => import('@/shared/views/guest/MagicLinkVerify.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
]
