import Overview from '@/views/user/Overview.vue'
import GettingStarted from '@/views/user/GettingStarted.vue'

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
