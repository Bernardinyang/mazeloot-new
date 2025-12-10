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
import type { Team, User } from '@/types/navigation'

// Get dynamic navigation based on current product/route
const { navigationItems, navigationLabel } = useProductNavigation()

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

const userData: User = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
}
</script>

