<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'relative']"
        size="icon"
        variant="ghost"
      >
        <div class="flex items-center justify-center rounded-lg">
          <component :is="activeTeam.logo" class="size-6" />
        </div>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent :class="['w-72', theme.bgDropdown, theme.borderSecondary]" align="end">
      <DropdownMenuLabel :class="theme.textPrimary">Apps</DropdownMenuLabel>
      <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        v-for="(team, index) in teams"
        :key="team.name"
        :class="[
          theme.textPrimary,
          theme.bgButtonHover,
          'cursor-pointer gap-4 p-3 items-start',
          {
            'bg-sidebar-accent text-sidebar-accent-foreground': activeTeam.name === team.name,
          },
        ]"
        @click="handleTeamClick(team)"
      >
        <div class="flex size-10 items-center justify-center rounded-lg border shrink-0">
          <component :is="team.logo" class="size-6 shrink-0" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-medium">{{ team.name }}</div>
          <div :class="['text-xs mt-0.5', theme.textSecondary]">{{ team.plan }}</div>
        </div>
        <DropdownMenuShortcut class="shrink-0">⌘{{ index + 1 }}</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator v-if="isAdmin" :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        v-if="isAdmin"
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer gap-4 p-3 items-start']"
      >
        <div
          class="flex size-10 items-center justify-center rounded-lg border bg-transparent shrink-0"
        >
          <Plus class="size-6" />
        </div>
        <div class="font-medium">Add app</div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { Button } from '@/components/shadcn/button'
import type { Team } from '@/types/navigation'
import { useNavigation } from '@/composables/useNavigation'
import { useUserStore } from '@/stores/user'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()
const props = defineProps<{
  teams: Team[]
  isAdmin?: boolean
}>()

const { navigateTo } = useNavigation()
const userStore = useUserStore()
const activeTeam = ref(props.teams[0])

// Check if user is admin
const isAdmin = computed(() => {
  if (props.isAdmin !== undefined) return props.isAdmin
  return userStore.user?.email?.includes('admin') || false
})

const handleTeamClick = (team: Team) => {
  activeTeam.value = team
  if (team.route) {
    navigateTo(team.route)
  } else if (team.url) {
    navigateTo({ path: team.url })
  }
}

// Watch for team changes and navigate if route is provided
watch(activeTeam, newTeam => {
  if (newTeam.route) {
    navigateTo(newTeam.route)
  } else if (newTeam.url) {
    navigateTo({ path: newTeam.url })
  }
})
</script>
