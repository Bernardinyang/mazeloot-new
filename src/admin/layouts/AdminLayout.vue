<template>
  <DashboardLayout
    :breadcrumb-items="breadcrumbItems"
    :breadcrumb-separator="breadcrumbSeparator"
    :custom-breadcrumb-separator="customBreadcrumbSeparator"
    :hide-user-features="true"
  >
    <template #breadcrumb>
      <slot name="breadcrumb" />
    </template>
    <template #header>
      <slot name="header" />
    </template>
    
    <!-- Admin Sidebar Slot -->
    <template #sidebar>
      <AdminSidebar :nav-items="navItems" :user-data="userData" />
    </template>
    
    <!-- Main Content: flat background (no gradient) across admin -->
    <div class="min-h-full min-w-0 w-full bg-background dark:bg-gray-950 overflow-x-hidden">
      <router-view />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/shared/stores/user'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import AdminSidebar from './AdminSidebar.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const breadcrumbItems = computed(() => {
  const items = []
  const routes = router.getRoutes()
  let name = route.name
  while (name) {
    const r = routes.find(rec => rec.name === name)
    const meta = r?.meta || {}
    const label = meta.breadcrumb
    if (label && name !== 'admin-dashboard') {
      items.unshift({
        label,
        to: name === route.name ? undefined : { name },
      })
    }
    name = meta.breadcrumbParent
  }
  if (items.length > 0 && (!items[0].to || items[0].to?.name !== 'admin-dashboard')) {
    items.unshift({ label: 'Dashboard', to: { name: 'admin-dashboard' } })
  }
  return items
})

const breadcrumbSeparator = '/'
const customBreadcrumbSeparator = null

const userData = computed(() => {
  if (userStore.user) {
    return {
      name: userStore.user.name || 'Admin',
      email: userStore.user.email || '',
      avatar: userStore.user.avatar || null,
    }
  }
  return {
    name: 'Admin',
    email: '',
    avatar: null,
  }
})

const navItems = computed(() => {
  const activityChildren = [
    { name: 'user-activity-logs', label: 'User Activity', to: { name: 'admin-activity-logs-users' }, icon: 'User' },
    { name: 'admin-activity-logs', label: 'Admin Activity', to: { name: 'admin-activity-logs-admins' }, icon: 'Shield' },
  ]
  if (userStore.isSuperAdmin) {
    activityChildren.push({ name: 'sensitive-activity-logs', label: 'Sensitive Actions', to: { name: 'admin-activity-logs-sensitive' }, icon: 'AlertTriangle' })
  }
  const items = [
    { name: 'dashboard', label: 'Dashboard', to: { name: 'admin-dashboard' }, icon: 'LayoutDashboard' },
    { name: 'users', label: 'Users', to: { name: 'admin-users' }, icon: 'Users' },
    { name: 'products', label: 'Products', to: { name: 'admin-products' }, icon: 'Package' },
    { name: 'early-access', label: 'Early Access', to: { name: 'admin-early-access' }, icon: 'Star' },
    { name: 'contact', label: 'Contact', to: { name: 'admin-contact' }, icon: 'Mail' },
    { name: 'faq', label: 'FAQ', to: { name: 'admin-faq' }, icon: 'HelpCircle' },
    { name: 'waitlist', label: 'Waitlist', to: { name: 'admin-waitlist' }, icon: 'ClipboardList' },
    { name: 'newsletter', label: 'Newsletter', to: { name: 'admin-newsletter' }, icon: 'Mail' },
    { name: 'analytics', label: 'Analytics', to: { name: 'admin-analytics' }, icon: 'BarChart3' },
    { name: 'activity-logs', label: 'Activity Logs', icon: 'FileText', children: activityChildren },
  ]
  if (userStore.isSuperAdmin) {
    items.splice(items.length - 1, 0,
      { name: 'health', label: 'Health', to: { name: 'admin-health' }, icon: 'Heart' },
      { name: 'system', label: 'System', to: { name: 'admin-system' }, icon: 'Server' }
    )
  }
  return items
})
</script>
