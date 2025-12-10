import type { RouteRecordRaw } from 'vue-router'
import Overview from '@/views/user/Overview.vue'

export const userRoutes: RouteRecordRaw[] = [
  {
    path: '/overview',
    name: 'overview',
    component: Overview,
    meta: {
      requiresAuth: true,
    },
  },
]

