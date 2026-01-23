<template>
  <DashboardLayout
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
    
    <!-- Main Content -->
    <router-view />
  </DashboardLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/shared/stores/user'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import AdminSidebar from './AdminSidebar.vue'

const userStore = useUserStore()

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

const navItems = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    to: { name: 'admin-dashboard' },
    icon: 'LayoutDashboard',
  },
  {
    name: 'users',
    label: 'Users',
    to: { name: 'admin-users' },
    icon: 'Users',
  },
  {
    name: 'products',
    label: 'Products',
    to: { name: 'admin-products' },
    icon: 'Package',
  },
  {
    name: 'early-access',
    label: 'Early Access',
    to: { name: 'admin-early-access' },
    icon: 'Star',
  },
  {
    name: 'analytics',
    label: 'Analytics',
    to: { name: 'admin-analytics' },
    icon: 'BarChart3',
  },
  {
    name: 'activity-logs',
    label: 'Activity Logs',
    icon: 'FileText',
    children: [
      {
        name: 'user-activity-logs',
        label: 'User Activity',
        to: { name: 'admin-activity-logs-users' },
        icon: 'User',
      },
      {
        name: 'admin-activity-logs',
        label: 'Admin Activity',
        to: { name: 'admin-activity-logs-admins' },
        icon: 'Shield',
      },
    ],
  },
]
</script>
