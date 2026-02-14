<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/20 transition-colors overflow-x-hidden">
    <header
      class="sticky top-0 z-50 pt-[env(safe-area-inset-top)] flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-xl border-b border-white/20 dark:border-white/5 bg-white/70 dark:bg-gray-900/80 shadow-sm"
    >
      <div class="flex items-center gap-4 min-w-0">
        <RouterLink
          :to="{ name: 'overview' }"
          class="flex items-center gap-2 rounded-xl px-3 py-2 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 text-gray-700 dark:text-gray-200 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 -ml-1 touch-manipulation"
        >
          <ChevronLeft class="h-5 w-5 shrink-0" aria-hidden="true" />
          <MazelootLogo :show-text="true" size="sm" />
        </RouterLink>
      </div>
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <NotificationDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button
              type="button"
              class="rounded-full ring-2 ring-transparent hover:ring-violet-400/50 focus-visible:ring-violet-500 transition-all duration-200"
              aria-label="Account menu"
            >
              <AvatarDisplay :avatar="user?.avatar" :name="user?.name" size="md" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56 rounded-xl border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl" align="end">
            <DropdownMenuLabel class="py-3">
              <div class="flex flex-col gap-0.5">
                <span class="font-semibold text-gray-900 dark:text-white">{{ user?.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ user?.email }}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator class="bg-gray-100 dark:bg-gray-800" />
            <DropdownMenuItem class="cursor-pointer focus:bg-violet-500/10 focus:text-violet-700 dark:focus:text-violet-300" @click="navigateTo({ name: 'overview' })">
              <LayoutDashboard class="h-4 w-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-500/10" @click="handleSignOut">
              <LogOut class="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <nav
      class="sticky top-[57px] z-40 flex gap-1.5 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-none border-b border-gray-200/60 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
      aria-label="Account sections"
    >
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.name }"
        :class="[
          'px-4 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-200',
          isActive(tab.name)
            ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
        ]"
      >
        {{ tab.label }}
      </RouterLink>
    </nav>

    <main class="px-4 sm:px-6 py-8 sm:py-10 max-w-4xl mx-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronLeft, LayoutDashboard, LogOut } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import AvatarDisplay from '@/shared/components/atoms/AvatarDisplay.vue'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import NotificationDropdown from '@/shared/components/organisms/NotificationDropdown.vue'
import { useUserStore } from '@/shared/stores/user'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useLogout } from '@/shared/composables/useLogout'

const route = useRoute()
const userStore = useUserStore()
const { navigateTo } = useNavigation()
const { logout } = useLogout()

const user = computed(() => userStore.user)

const tabs = [
  { name: 'overview-account-general', label: 'General' },
  { name: 'overview-account-billing', label: 'Billing' },
  { name: 'overview-account-refer', label: 'Refer a Friend' },
]

function isActive(name) {
  return route.name === name
}

async function handleSignOut() {
  await logout()
}
</script>
