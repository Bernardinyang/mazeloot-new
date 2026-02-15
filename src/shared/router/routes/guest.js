const appDesc = 'Professional gallery and client proofing platform for creatives.'

export const guestRoutes = [
  { path: '/product-selection/:token', name: 'productSelection', component: () => import('@/shared/views/guest/ProductSelection.vue'), meta: { requiresAuth: false, isGuestRoute: true, title: 'Select Product | Mazeloot', description: appDesc } },
  { path: '/login', name: 'login', component: () => import('@/shared/views/guest/Login.vue'), meta: { isGuestRoute: true, title: 'Log In | Mazeloot', description: appDesc } },
  { path: '/register', name: 'register', component: () => import('@/shared/views/guest/Register.vue'), meta: { isGuestRoute: true, title: 'Sign Up | Mazeloot', description: appDesc } },
  { path: '/verify-email', name: 'verifyEmail', component: () => import('@/shared/views/guest/VerifyEmail.vue'), meta: { isGuestRoute: true, title: 'Verify Email | Mazeloot', description: appDesc } },
  { path: '/forgot-password', name: 'forgotPassword', component: () => import('@/shared/views/guest/ForgotPassword.vue'), meta: { isGuestRoute: true, title: 'Forgot Password | Mazeloot', description: appDesc } },
  { path: '/reset-password', name: 'resetPassword', component: () => import('@/shared/views/guest/ResetPassword.vue'), meta: { isGuestRoute: true, title: 'Reset Password | Mazeloot', description: appDesc } },
  { path: '/auth/oauth/callback', name: 'oauthCallback', component: () => import('@/shared/views/guest/OAuthCallback.vue'), meta: { isGuestRoute: true, title: 'Mazeloot', description: appDesc } },
  { path: '/auth/magic-link/verify', name: 'magicLinkVerify', component: () => import('@/shared/views/guest/MagicLinkVerify.vue'), meta: { isGuestRoute: true, title: 'Verify Magic Link | Mazeloot', description: appDesc } },
]
