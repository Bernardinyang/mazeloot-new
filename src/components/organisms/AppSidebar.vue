<template>
  <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader>
      <div
        :class="[
          'px-3 py-4 flex items-center justify-center border-b',
          theme.bgCard,
          theme.borderPrimary,
          'bg-sidebar-background',
        ]"
      >
        <MazelootLogo size="sm" :show-text="false" />
      </div>
      <AppSwitcher :teams="teams" :is-admin="isAdmin" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navigationItems" :label="navigationLabel" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/shadcn/sidebar'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'
import AppSwitcher from './AppSwitcher.vue'
import ProductIcon from '@/components/atoms/ProductIcon.vue'
import MazelootLogo from '@/components/atoms/MazelootLogo.vue'
import { useProductNavigation } from '@/composables/useProductNavigation'
import { useUserStore } from '@/stores/user'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { MAZELOOT_PRODUCTS } from '@/constants/products'
import type { Team, User } from '@/types/navigation'

const theme = useThemeClasses()

// Get dynamic navigation based on current product/route
const { navigationItems, navigationLabel } = useProductNavigation()

// Get logged-in user from store
const userStore = useUserStore()

// Check if user is admin
const isAdmin = computed(() => {
  // Mock admin check - in production, this would come from user store/API
  return userStore.user?.email?.includes('admin') || false
})

// Convert Mazeloot products to teams format
const teams: Team[] = MAZELOOT_PRODUCTS.map(product => ({
  name: product.displayName,
  logo: () => h(ProductIcon, { customType: product.customType }),
  plan: product.description,
  route: product.route || { name: 'overview' },
}))

// Use logged-in user from store, fallback to default if not available
const userData = computed<User>(() => {
  if (userStore.user) {
    return {
      name: userStore.user.name,
      email: userStore.user.email,
      avatar:
        userStore.user.avatar ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    }
  }
  // Fallback for when user is not logged in (shouldn't happen in protected routes)
  return {
    name: 'Guest',
    email: 'guest@example.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  }
})
</script>
