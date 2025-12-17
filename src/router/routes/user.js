import Overview from '@/views/user/Overview.vue'

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
