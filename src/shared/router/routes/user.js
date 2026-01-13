import Overview from '@/shared/views/user/Overview.vue'
import GettingStarted from '@/shared/views/user/GettingStarted.vue'

export const userRoutes = [
  {
    path: '/overview',
    name: 'overview',
    component: Overview,
    meta: {
      requiresAuth: true,
    },
  },
]
