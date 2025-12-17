import Login from '@/views/guest/Login.vue'
import Register from '@/views/guest/Register.vue'
import VerifyEmail from '@/views/guest/VerifyEmail.vue'
import ForgotPassword from '@/views/guest/ForgotPassword.vue'
import ResetPassword from '@/views/guest/ResetPassword.vue'

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
]
