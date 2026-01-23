import Overview from '@/shared/views/user/Overview.vue'
import GettingStarted from '@/shared/views/user/GettingStarted.vue'
import Onboarding from '@/shared/views/user/Onboarding.vue'

export const userRoutes = [
  {
    path: '/overview',
    name: 'overview',
    component: Overview,
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
  {
    path: '/onboarding/:productSlug/:token',
    name: 'onboarding',
    component: Onboarding,
    meta: {
      requiresAuth: true,
      requiresUser: true,
    },
  },
]
