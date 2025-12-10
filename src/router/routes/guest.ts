import type { RouteRecordRaw } from 'vue-router'
import Login from '@/views/guest/Login.vue'
import Register from '@/views/guest/Register.vue'
import VerifyEmail from '@/views/guest/VerifyEmail.vue'
import ForgotPassword from '@/views/guest/ForgotPassword.vue'
import ResetPassword from '@/views/guest/ResetPassword.vue'

export const guestRoutes: RouteRecordRaw[] = [
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
    name: 'verify-email',
    component: VerifyEmail,
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: {
      isGuestRoute: true,
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
    meta: {
      isGuestRoute: true,
    },
  },
]
