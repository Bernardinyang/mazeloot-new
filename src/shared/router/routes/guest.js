import Login from '@/shared/views/guest/Login.vue'
import Register from '@/shared/views/guest/Register.vue'
import VerifyEmail from '@/shared/views/guest/VerifyEmail.vue'
import ForgotPassword from '@/shared/views/guest/ForgotPassword.vue'
import ResetPassword from '@/shared/views/guest/ResetPassword.vue'
import ProductSelection from '@/shared/views/guest/ProductSelection.vue'

export const guestRoutes = [
  {
    path: '/product-selection/:token',
    name: 'productSelection',
    component: ProductSelection,
    meta: {
      requiresAuth: false,
      isGuestRoute: true,
    },
  },
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
