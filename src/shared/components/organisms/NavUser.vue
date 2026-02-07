<script setup>
import { computed } from 'vue'
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from '@/shared/utils/lucideAnimated'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/shadcn/sidebar'
import AvatarDisplay from '@/shared/components/atoms/AvatarDisplay.vue'
import Badge from '@/shared/components/shadcn/badge/Badge.vue'
import { useNavigation } from '@/shared/composables/useNavigation'
import { useLogout } from '@/shared/composables/useLogout'
import { useUserStore } from '@/shared/stores/user'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const { isMobile, state } = useSidebar()
const { navigateTo } = useNavigation()
const { logout } = useLogout()
const userStore = useUserStore()
const { recommendedTierDisplayName } = useMemoraFeatures()
const upgradeTierLabel = recommendedTierDisplayName('proofing')

const roleLabel = computed(() => {
  if (userStore.isSuperAdmin) return 'Super Admin'
  if (userStore.isAdmin) return 'Admin'
  return null
})

const roleVariant = computed(() => {
  if (userStore.isSuperAdmin) return 'destructive'
  if (userStore.isAdmin) return 'secondary'
  return 'default'
})

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            :tooltip="props.user.name"
            class="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            size="lg"
          >
            <AvatarDisplay
              :avatar="props.user.avatar"
              :name="props.user.name"
              :size="state === 'collapsed' && !isMobile ? 'lg' : 'md'"
            />
            <div
              v-if="state !== 'collapsed' || isMobile"
              class="grid flex-1 text-left text-sm leading-tight"
            >
              <div class="flex items-center gap-2">
                <span class="truncate font-medium">{{ props.user.name }}</span>
                <Badge v-if="roleLabel" :variant="roleVariant" class="text-xs">
                  {{ roleLabel }}
                </Badge>
              </div>
              <span class="truncate text-xs">{{ props.user.email }}</span>
            </div>
            <ChevronsUpDown v-if="state !== 'collapsed' || isMobile" class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
          align="end"
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <AvatarDisplay :avatar="props.user.avatar" :name="props.user.name" />
              <div class="grid flex-1 text-left text-sm leading-tight">
                <div class="flex items-center gap-2">
                  <span class="truncate font-semibold">{{ props.user.name }}</span>
                  <Badge v-if="roleLabel" :variant="roleVariant" class="text-xs">
                    {{ roleLabel }}
                  </Badge>
                </div>
                <span class="truncate text-xs">{{ props.user.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="navigateTo({ name: 'memora-pricing' })">
              <Sparkles />
              Upgrade to {{ upgradeTierLabel }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem @click="navigateTo({ name: 'overview-account' })">
              <BadgeCheck />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="text-red-500 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500/20 cursor-pointer focus:bg-red-500/20 dark:focus:bg-red-500/20"
            @click="handleLogout"
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
