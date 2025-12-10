<template>
  <Sidebar variant="inset" collapsible="icon">
    <SidebarHeader>
      <TeamSwitcher :teams="teams" />
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
import { computed } from 'vue'
import { GalleryVerticalEnd } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/shadcn/sidebar'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'
import TeamSwitcher from './TeamSwitcher.vue'
import { useProductNavigation } from '@/composables/useProductNavigation'
import { useUserStore } from '@/stores/user'
import type { Team, User } from '@/types/navigation'

// Get dynamic navigation based on current product/route
const { navigationItems, navigationLabel } = useProductNavigation()

// Get logged-in user from store
const userStore = useUserStore()

// TODO: Replace with actual data from store/API
const teams: Team[] = [
  {
    name: 'Mazeloot',
    logo: GalleryVerticalEnd,
    plan: 'Photo Gallery',
    route: { name: 'overview' },
  },
  {
    name: 'Mazeloot Pro',
    logo: GalleryVerticalEnd,
    plan: 'Enterprise',
    route: { name: 'overview' },
  },
]

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
