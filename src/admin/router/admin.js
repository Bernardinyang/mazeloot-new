/**
 * Admin Routes
 * All admin routes require authentication and admin role
 */

export const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/admin/layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/admin/views/Dashboard.vue'),
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/admin/views/users/Index.vue'),
      },
      {
        path: 'users/:uuid',
        name: 'admin-user-show',
        component: () => import('@/admin/views/users/Show.vue'),
      },
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/admin/views/products/Index.vue'),
      },
      {
        path: 'products/:slug',
        name: 'admin-product-show',
        component: () => import('@/admin/views/products/Show.vue'),
      },
      {
        path: 'early-access',
        name: 'admin-early-access',
        component: () => import('@/admin/views/early-access/Index.vue'),
      },
      {
        path: 'early-access/requests/:uuid',
        name: 'admin-early-access-request-show',
        component: () => import('@/admin/views/early-access/ShowRequest.vue'),
      },
      {
        path: 'early-access/:uuid',
        name: 'admin-early-access-show',
        component: () => import('@/admin/views/early-access/Show.vue'),
      },
      {
        path: 'analytics',
        name: 'admin-analytics',
        component: () => import('@/admin/views/analytics/Index.vue'),
      },
      {
        path: 'activity-logs/users',
        name: 'admin-activity-logs-users',
        component: () => import('@/admin/views/activity-logs/UserActivityLogs.vue'),
      },
      {
        path: 'activity-logs/admins',
        name: 'admin-activity-logs-admins',
        component: () => import('@/admin/views/activity-logs/AdminActivityLogs.vue'),
      },
    ],
  },
]
