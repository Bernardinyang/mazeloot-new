const Login = () => import('@/domains/memora/views/guest/Login.vue')
const Register = () => import('@/domains/memora/views/guest/Register.vue')
const VerifyEmail = () => import('@/domains/memora/views/guest/VerifyEmail.vue')
const ForgotPassword = () => import('@/domains/memora/views/guest/ForgotPassword.vue')
const ResetPassword = () => import('@/domains/memora/views/guest/ResetPassword.vue')

export const guestRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/verify-email',
    name: 'verifyEmail',
    component: VerifyEmail,
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgotPassword',
    component: ForgotPassword,
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/reset-password',
    name: 'resetPassword',
    component: ResetPassword,
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/auth/oauth/callback',
    name: 'oauthCallback',
    component: () => import('@/domains/memora/views/guest/OAuthCallback.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/auth/magic-link/verify',
    name: 'magicLinkVerify',
    component: () => import('@/domains/memora/views/guest/MagicLinkVerify.vue'),
    meta: {
      isGuestRoute: true,
    },
  },
]
