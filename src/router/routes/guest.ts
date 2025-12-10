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
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/verify-email',
    name: 'verify-email',
    component: VerifyEmail,
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
  },
]

