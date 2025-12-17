<template>
  <Sidebar collapsible="icon" variant="inset">
    <SidebarHeader>
      <div
        :class="[
          'px-3 py-4 flex items-center justify-center border-b',
          'group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3',
          theme.bgCard,
          theme.borderPrimary,
          'bg-sidebar-background',
        ]"
      >
        <MazelootLogo :show-text="false" class="group-data-[collapsible=icon]:scale-95" size="sm" />
      </div>
      <AppSwitcher :is-admin="isAdmin" :teams="teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navigationItems" :label="navigationLabel" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="userData" />
    </SidebarFooter>
    <!--    <SidebarRail />-->
  </Sidebar>
</template>

<script setup>
import { computed, h } from 'vue'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/shadcn/sidebar'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'
import AppSwitcher from './AppSwitcher.vue'
import ProductIcon from '@/components/atoms/ProductIcon.vue'
import MazelootLogo from '@/components/atoms/MazelootLogo.vue'
import { useProductNavigation } from '@/composables/useProductNavigation'
import { useUserStore } from '@/stores/user'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { MAZELOOT_PRODUCTS } from '@/constants/products'

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
const teams = MAZELOOT_PRODUCTS.map(product => ({
  name: product.displayName,
  logo: () => h(ProductIcon, { customType: product.customType }),
  plan: product.description,
  route: product.route || { name: 'overview' },
}))

// Use logged-in user from store, fallback to default if not available
const userData = computed(() => {
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
