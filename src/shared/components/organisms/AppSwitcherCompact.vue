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
    <DropdownMenuContent :class="['w-80', theme.bgDropdown, theme.borderSecondary]" align="end">
      <DropdownMenuLabel :class="theme.textPrimary">Apps</DropdownMenuLabel>
      <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        v-for="(team, index) in (teams || [])"
        :key="team.name"
        :class="[
          'cursor-pointer p-0 overflow-hidden rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          appItemClasses(team),
        ]"
        @click="handleTeamClick(team)"
      >
        <div
          :class="[
            'flex gap-3 p-3 w-full items-center text-left',
            appItemBgClasses(team),
          ]"
        >
          <div
            :class="[
              'flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-white/30 bg-white/10',
            ]"
          >
            <component :is="team.logo" class="size-6 shrink-0" />
          </div>
          <div class="min-w-0 flex-1">
            <div :class="[activeTeam?.name === team.name ? 'text-white' : '', 'font-semibold truncate']">{{ team.name }}</div>
            <div :class="['text-xs mt-0.5 truncate', activeTeam?.name === team.name ? 'text-white/95' : theme.textSecondary]">{{ team.plan }}</div>
          </div>
          <span
            :class="[
              'shrink-0 text-sm font-medium tabular-nums',
              activeTeam?.name === team.name ? 'text-white/95' : theme.textSecondary,
            ]"
            aria-hidden="true"
          >⌘{{ index + 1 }}</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator v-if="isAdmin" :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        v-if="isAdmin"
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer gap-4 p-3 items-start rounded-xl']"
      >
        <div
          class="flex size-11 items-center justify-center rounded-xl border shrink-0 bg-transparent"
        >
          <Plus class="size-6" />
        </div>
        <div class="font-medium">Add app</div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Plus } from '@/shared/utils/lucideAnimated'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import { Button } from '@/shared/components/shadcn/button'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useUserStore } from '@/shared/stores/user'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()
const props = defineProps({
  teams: { type: Array, required: true },
  isAdmin: { type: Boolean, default: undefined },
})

const { navigateTo } = useNavigation()
const userStore = useUserStore()
const activeTeam = ref(props.teams?.[0] || null)

const isAdmin = computed(() => {
  if (props.isAdmin !== undefined) return props.isAdmin
  return userStore.user?.email?.includes('admin') || false
})

const appAccentGradient = {
  memora: 'from-violet-600 to-purple-700 dark:from-violet-600 dark:to-purple-800',
  'connect-stream': 'from-sky-600 to-blue-700 dark:from-sky-600 dark:to-blue-800',
  'creator-iq': 'from-amber-600 to-orange-700 dark:from-amber-600 dark:to-orange-800',
  'gear-hub': 'from-emerald-600 to-green-700 dark:from-emerald-600 dark:to-green-800',
  'vendor-iq': 'from-rose-600 to-pink-700 dark:from-rose-600 dark:to-pink-800',
  'gig-finder': 'from-indigo-600 to-violet-700 dark:from-indigo-600 dark:to-violet-800',
  profolio: 'from-cyan-600 to-teal-700 dark:from-cyan-600 dark:to-teal-800',
}
const appAccentBorder = {
  memora: 'border-violet-500/30 focus-visible:ring-violet-500',
  'connect-stream': 'border-sky-500/30 focus-visible:ring-sky-500',
  'creator-iq': 'border-amber-500/30 focus-visible:ring-amber-500',
  'gear-hub': 'border-emerald-500/30 focus-visible:ring-emerald-500',
  'vendor-iq': 'border-rose-500/30 focus-visible:ring-rose-500',
  'gig-finder': 'border-indigo-500/30 focus-visible:ring-indigo-500',
  profolio: 'border-cyan-500/30 focus-visible:ring-cyan-500',
}

function appItemClasses(team) {
  const isActive = activeTeam.value?.name === team.name
  const border = team.customType ? appAccentBorder[team.customType] : 'border-gray-500/30 focus-visible:ring-gray-500'
  if (isActive) {
    return `border-2 ${border} focus-visible:ring-offset-background`
  }
  return `border border-transparent hover:border-gray-300 dark:hover:border-gray-600 ${theme.bgButtonHover} focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500`
}

function appItemBgClasses(team) {
  const isActive = activeTeam.value?.name === team.name
  const gradient = team.customType ? appAccentGradient[team.customType] : 'from-gray-600 to-gray-700'
  if (isActive) {
    return `bg-gradient-to-br ${gradient} text-white`
  }
  return theme.textPrimary
}

const handleTeamClick = team => {
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
