<script setup lang="ts">
import { ChevronsUpDown, Plus } from 'lucide-vue-next'
import { ref, watch, computed } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/shadcn/sidebar'
import type { Team } from '@/types/navigation'
import { useNavigation } from '@/composables/useNavigation'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  teams: Team[]
  isAdmin?: boolean
}>()

const { isMobile } = useSidebar()
const { navigateTo } = useNavigation()
const userStore = useUserStore()
const activeTeam = ref(props.teams[0])

// Check if user is admin (for now, check if email contains admin or if user has admin role)
// TODO: Replace with actual admin check from user store/API
const isAdmin = computed(() => {
  if (props.isAdmin !== undefined) return props.isAdmin
  // Mock admin check - in production, this would come from user store/API
  return userStore.user?.email?.includes('admin') || false
})

// Watch for team changes and navigate if route is provided
watch(activeTeam, newTeam => {
  if (newTeam.route) {
    navigateTo(newTeam.route)
  } else if (newTeam.url) {
    // Fallback for deprecated url property
    navigateTo({ path: newTeam.url })
  }
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <div
              class="flex aspect-square size-9 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-background shadow-sm"
            >
              <component :is="activeTeam.logo" class="size-4.5" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight gap-0.5">
              <span class="truncate font-semibold">
                {{ activeTeam.name }}
              </span>
              <span class="truncate text-xs text-muted-foreground">{{ activeTeam.plan }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4 text-muted-foreground" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground px-2 py-1.5">
            Apps
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(team, index) in teams"
            :key="team.name"
            class="gap-2.5 p-2.5 mx-1 rounded-md"
            :class="{
              'bg-sidebar-accent text-sidebar-accent-foreground': activeTeam.name === team.name,
            }"
            @click="activeTeam = team"
          >
            <div
              class="flex size-7 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-background"
            >
              <component :is="team.logo" class="size-4 shrink-0" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ team.name }}</div>
              <div class="text-xs text-muted-foreground truncate">{{ team.plan }}</div>
            </div>
            <DropdownMenuShortcut class="ml-auto">⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator v-if="isAdmin" class="my-1" />
          <DropdownMenuItem
            v-if="isAdmin"
            class="gap-2.5 p-2.5 mx-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <div
              class="flex size-7 items-center justify-center rounded-md border border-sidebar-border bg-transparent"
            >
              <Plus class="size-4" />
            </div>
            <div class="font-medium">Add app</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
