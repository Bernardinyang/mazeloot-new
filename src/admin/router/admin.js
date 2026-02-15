/**
 * Admin Routes
 * All admin routes require authentication and admin role
 */

import { useUserStore } from '@/shared/stores/user'

const a = (title) => ({ title: `Admin - ${title} | Mazeloot`, description: 'Mazeloot admin.' })

export const adminRoutes = [
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/admin/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Admin | Mazeloot', description: 'Mazeloot admin.' },
    children: [
      { path: '', name: 'admin-dashboard', component: () => import('@/admin/views/Dashboard.vue'), meta: { breadcrumb: 'Dashboard', ...a('Dashboard') } },
      { path: 'users', name: 'admin-users', component: () => import('@/admin/views/users/Index.vue'), meta: { breadcrumb: 'Users', ...a('Users') } },
      { path: 'users/:uuid', name: 'admin-user-show', component: () => import('@/admin/views/users/Show.vue'), meta: { breadcrumb: 'User', breadcrumbParent: 'admin-users', ...a('User') } },
      { path: 'products', name: 'admin-products', component: () => import('@/admin/views/products/Index.vue'), meta: { breadcrumb: 'Products', ...a('Products') } },
      { path: 'products/:slug', name: 'admin-product-show', component: () => import('@/admin/views/products/Show.vue'), meta: { breadcrumb: 'Product', breadcrumbParent: 'admin-products', ...a('Product') } },
      { path: 'products/memora/pricing', name: 'admin-pricing', component: () => import('@/domains/memora/views/pricing-admin/Index.vue'), meta: { breadcrumb: 'Pricing', breadcrumbParent: 'admin-products', ...a('Pricing') } },
      { path: 'products/memora/pricing/tiers/new', name: 'admin-pricing-tier-create', component: () => import('@/domains/memora/views/pricing-admin/TierCreate.vue'), meta: { breadcrumb: 'New tier', breadcrumbParent: 'admin-pricing', ...a('New Tier') } },
      { path: 'products/memora/pricing/tiers/:slug/view', name: 'admin-pricing-tier-view', component: () => import('@/domains/memora/views/pricing-admin/TierView.vue'), meta: { breadcrumb: 'Tier', breadcrumbParent: 'admin-pricing', ...a('Tier') } },
      { path: 'products/memora/pricing/tiers/:slug', name: 'admin-pricing-tier-edit', component: () => import('@/domains/memora/views/pricing-admin/TierEdit.vue'), meta: { breadcrumb: 'Edit tier', breadcrumbParent: 'admin-pricing', ...a('Edit Tier') } },
      { path: 'early-access', name: 'admin-early-access', component: () => import('@/admin/views/early-access/Index.vue'), meta: { breadcrumb: 'Early Access', ...a('Early Access') } },
      { path: 'early-access/requests/:uuid', name: 'admin-early-access-request-show', component: () => import('@/admin/views/early-access/ShowRequest.vue'), meta: { breadcrumb: 'Request', breadcrumbParent: 'admin-early-access', ...a('Request') } },
      { path: 'early-access/:uuid', name: 'admin-early-access-show', component: () => import('@/admin/views/early-access/Show.vue'), meta: { breadcrumb: 'Early Access', breadcrumbParent: 'admin-early-access', ...a('Early Access') } },
      { path: 'contact', name: 'admin-contact', component: () => import('@/admin/views/contact/Index.vue'), meta: { breadcrumb: 'Contact', ...a('Contact') } },
      { path: 'faq', name: 'admin-faq', component: () => import('@/admin/views/faq/Index.vue'), meta: { breadcrumb: 'FAQ', ...a('FAQ') } },
      { path: 'faq/new', name: 'admin-faq-create', component: () => import('@/admin/views/faq/Form.vue'), meta: { breadcrumb: 'New FAQ', breadcrumbParent: 'admin-faq', ...a('New FAQ') } },
      { path: 'faq/:uuid', name: 'admin-faq-edit', component: () => import('@/admin/views/faq/Form.vue'), meta: { breadcrumb: 'Edit FAQ', breadcrumbParent: 'admin-faq', ...a('Edit FAQ') } },
      { path: 'contact/:uuid', name: 'admin-contact-show', component: () => import('@/admin/views/contact/Show.vue'), meta: { breadcrumb: 'Submission', breadcrumbParent: 'admin-contact', ...a('Submission') } },
      { path: 'waitlist', name: 'admin-waitlist', component: () => import('@/admin/views/waitlist/Index.vue'), meta: { breadcrumb: 'Waitlist', ...a('Waitlist') } },
      { path: 'waitlist/:uuid', name: 'admin-waitlist-show', component: () => import('@/admin/views/waitlist/Show.vue'), meta: { breadcrumb: 'Entry', breadcrumbParent: 'admin-waitlist', ...a('Waitlist Entry') } },
      { path: 'newsletter', name: 'admin-newsletter', component: () => import('@/admin/views/newsletter/Index.vue'), meta: { breadcrumb: 'Newsletter', ...a('Newsletter') } },
      { path: 'health', name: 'admin-health', component: () => import('@/admin/views/health/Index.vue'), meta: { breadcrumb: 'Health', ...a('Health') } },
      { path: 'analytics', name: 'admin-analytics', component: () => import('@/admin/views/analytics/Index.vue'), meta: { breadcrumb: 'Analytics', ...a('Analytics') } },
      { path: 'system', name: 'admin-system', component: () => import('@/admin/views/system/Index.vue'), meta: { breadcrumb: 'System', ...a('System') } },
      { path: 'activity-logs/users', name: 'admin-activity-logs-users', component: () => import('@/admin/views/activity-logs/UserActivityLogs.vue'), meta: { breadcrumb: 'User Activity', ...a('User Activity') } },
      { path: 'activity-logs/admins', name: 'admin-activity-logs-admins', component: () => import('@/admin/views/activity-logs/AdminActivityLogs.vue'), meta: { breadcrumb: 'Admin Activity', ...a('Admin Activity') } },
      { path: 'activity-logs/sensitive', name: 'admin-activity-logs-sensitive', component: () => import('@/admin/views/activity-logs/SensitiveActivityLogs.vue'), meta: { breadcrumb: 'Sensitive Actions', requiresSuperAdmin: true, ...a('Sensitive Actions') }, beforeEnter: (to, from, next) => { if (!useUserStore().isSuperAdmin) next({ name: 'admin-activity-logs-admins' }); else next() } },
      { path: 'products/memora/downgrade-requests', name: 'admin-downgrade-requests', component: () => import('@/admin/views/downgrade-requests/Index.vue'), meta: { breadcrumb: 'Downgrade requests', breadcrumbParent: 'admin-products', ...a('Downgrade Requests') } },
      { path: 'products/memora/downgrade-requests/:uuid', name: 'admin-downgrade-request-show', component: () => import('@/admin/views/downgrade-requests/Show.vue'), meta: { breadcrumb: 'Request', breadcrumbParent: 'admin-downgrade-requests', ...a('Downgrade Request') } },
      { path: 'products/memora/upgrade-requests', name: 'admin-upgrade-requests', component: () => import('@/admin/views/upgrade-requests/Index.vue'), meta: { breadcrumb: 'Upgrade requests', breadcrumbParent: 'admin-products', ...a('Upgrade Requests') } },
      { path: 'products/memora/upgrade-requests/:uuid', name: 'admin-upgrade-request-show', component: () => import('@/admin/views/upgrade-requests/Show.vue'), meta: { breadcrumb: 'Request', breadcrumbParent: 'admin-upgrade-requests', ...a('Upgrade Request') } },
    ],
  },
]
