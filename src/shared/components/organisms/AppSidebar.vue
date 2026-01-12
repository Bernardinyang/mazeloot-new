<template>
  <Sidebar collapsible="icon" variant="inset">
    <SidebarHeader>
      <div
        :class="[
          'px-3 py-4 flex items-center justify-center dark:border-b rounded-lg ',
          'group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3',
          theme.bgCard,
          theme.borderPrimary,
          'bg-sidebar-background',
        ]"
      >
        <MazelootLogo
          :show-text="false"
          :use-favicon="state === 'collapsed'"
          class="group-data-[collapsible=icon]:scale-95"
          size="md"
        />
      </div>
      <div
        :class="{
          'py-2': state === 'collapsed',
        }"
        class="bg-primary-600 dark:bg-primary-500 rounded-lg"
      >
        <AppSwitcher :is-admin="isAdmin" :teams="teams" />
      </div>
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/shared/components/shadcn/sidebar'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'
import AppSwitcher from './AppSwitcher.vue'
import ProductIcon from '@/shared/components/atoms/ProductIcon.vue'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { useProductNavigation } from '@/shared/composables/useProductNavigation'
import { useUserStore } from '@/shared/stores/user'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { MAZELOOT_PRODUCTS } from '@/shared/constants/products'

const theme = useThemeClasses()
const { state } = useSidebar()

const { navigationItems, navigationLabel } = useProductNavigation()

const userStore = useUserStore()

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
