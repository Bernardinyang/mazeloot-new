<script setup>
import { ChevronsUpDown, Plus } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from '@/shared/components/shadcn/sidebar'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useUserStore } from '@/shared/stores/user'

const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
  isAdmin: Boolean,
})

const { isMobile, state } = useSidebar()
const { navigateTo } = useNavigation()
const userStore = useUserStore()
const activeTeam = ref(props.teams[0])

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
            :tooltip="activeTeam?.name"
            class="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
            size="lg"
          >
            <div
              class="flex aspect-square size-10 items-center justify-center rounded-lg border border-sidebar-border bg-sidebar-background shadow-sm"
            >
              <component :is="activeTeam.logo" class="size-10" />
            </div>
            <div
              v-if="state !== 'collapsed' || isMobile"
              class="grid flex-1 text-left text-sm leading-tight gap-0.5"
            >
              <span class="truncate font-semibold text-white">
                {{ activeTeam.name }}
              </span>
              <span class="truncate text-xs text-gray-300">{{ activeTeam.plan }}</span>
            </div>
            <ChevronsUpDown
              v-if="state !== 'collapsed' || isMobile"
              class="ml-auto size-4 text-gray-300"
            />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
          align="start"
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground px-2 py-1.5">
            Apps
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(team, index) in teams"
            :key="team.name"
            :class="{
              'bg-sidebar-accent text-gray-300': activeTeam.name === team.name,
            }"
            class="gap-2.5 p-2.5 mx-1 rounded-md group"
            @click="activeTeam = team"
          >
            <div
              :class="{
                'border-gray-400': activeTeam.name === team.name,
              }"
              class="flex size-10 items-center justify-center rounded-md border border-sidebar-border group-hover:border-gray-400 bg-sidebar-background"
            >
              <component :is="team.logo" class="size-10 shrink-0" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ team.name }}</div>
              <div
                :class="{
                  'text-gray-100': activeTeam.name === team.name,
                }"
                class="text-xs text-gray-500 truncate group-hover:text-gray-100"
              >
                {{ team.plan }}
              </div>
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
