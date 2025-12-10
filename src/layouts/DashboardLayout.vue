<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        :class="[
          'sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b backdrop-blur-xl bg-white/80 dark:bg-gray-950/80',
          theme.borderPrimary,
          theme.transitionColors,
        ]"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger :class="['-ml-1', theme.textPrimary, theme.bgButtonHover]" />
          <Separator
            orientation="vertical"
            :class="['mr-2 data-[orientation=vertical]:h-4', theme.borderPrimary]"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink as-child>
                  <RouterLink
                    :to="{ name: 'overview' }"
                    :class="[theme.textPrimary, 'hover:opacity-80', theme.transitionColors]"
                  >
                    Dashboard
                  </RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator :class="['hidden md:block', theme.textTertiary]" />
              <BreadcrumbItem>
                <BreadcrumbPage :class="theme.textPrimary">
                  <slot name="breadcrumb" />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="flex flex-1 items-center justify-end">
          <slot name="header" />
          <div class="flex items-center gap-2 pr-4">
            <!-- Search -->
            <div class="hidden md:flex items-center relative max-w-xs">
              <Search
                :class="['absolute left-3 h-4 w-4 pointer-events-none', theme.textTertiary]"
              />
              <Input
                type="search"
                placeholder="Search..."
                :class="[
                  'pl-9 pr-4 h-9 w-64 focus-visible:ring-white/20 dark:focus-visible:ring-white/20 light:focus-visible:ring-gray-400',
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                ]"
              />
            </div>

            <!-- Theme Toggle -->
            <ThemeToggle />

            <!-- App Switcher -->
            <AppSwitcherCompact :teams="appTeams" :is-admin="isAdmin" />

            <!-- Notifications -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'relative']"
                >
                  <Bell class="h-5 w-5" />
                  <span
                    v-if="notifications.length > 0"
                    class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
                  ></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                :class="['w-80', theme.bgDropdown, theme.borderSecondary]"
              >
                <div class="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel :class="theme.textPrimary">Notifications</DropdownMenuLabel>
                  <Button
                    v-if="notifications.length > 0"
                    variant="ghost"
                    size="sm"
                    :class="['h-7 px-2 text-xs', theme.textSecondary, theme.bgButtonHover]"
                    @click.stop="clearNotifications"
                  >
                    Clear all
                  </Button>
                </div>
                <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
                <div class="max-h-96 overflow-y-auto">
                  <div
                    v-if="notifications.length === 0"
                    :class="['p-4 text-center text-sm', theme.textSecondary]"
                  >
                    No notifications
                  </div>
                  <DropdownMenuItem
                    v-for="notification in notifications"
                    :key="notification.id"
                    :class="[
                      theme.textPrimary,
                      theme.bgButtonHover,
                      'cursor-pointer flex flex-col items-start p-3',
                    ]"
                  >
                    <div class="flex items-start gap-2 w-full">
                      <component
                        :is="notification.icon"
                        class="h-4 w-4 mt-0.5 shrink-0"
                        :class="notification.iconColor"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium">{{ notification.title }}</p>
                        <p :class="['text-xs mt-0.5', theme.textSecondary]">
                          {{ notification.message }}
                        </p>
                        <p :class="['text-xs mt-1', theme.textTertiary]">{{ notification.time }}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div :class="['flex flex-1 flex-col gap-4 p-10', theme.bgFooter, theme.transitionColors]">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Bell, CheckCircle2, ShoppingCart } from 'lucide-vue-next'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/shadcn/sidebar'
import { Separator } from '@/components/shadcn/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn/breadcrumb'
import { Button } from '@/components/shadcn/button'
import Input from '@/components/shadcn/input/Input.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { h } from 'vue'
import AppSidebar from '@/components/organisms/AppSidebar.vue'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import AppSwitcherCompact from '@/components/organisms/AppSwitcherCompact.vue'
import ProductIcon from '@/components/atoms/ProductIcon.vue'
import { MAZELOOT_PRODUCTS } from '@/constants/products'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useUserStore } from '@/stores/user'
import type { Team } from '@/types/navigation'

const theme = useThemeClasses()
const userStore = useUserStore()

// Check if user is admin
const isAdmin = computed(() => {
  return userStore.user?.email?.includes('admin') || false
})

// Convert Mazeloot products to teams format for navbar
const appTeams: Team[] = MAZELOOT_PRODUCTS.map(product => ({
  name: product.displayName,
  logo: () => h(ProductIcon, { customType: product.customType }),
  plan: product.description,
  route: product.route || { name: 'overview' },
}))

// Sample notifications - TODO: Replace with actual data from store/API
const notifications = ref([
  {
    id: 1,
    title: 'New Collection Published',
    message: 'Your collection has been published successfully',
    time: '2 minutes ago',
    icon: CheckCircle2,
    iconColor: 'text-green-400',
  },
  {
    id: 2,
    title: 'Order Shipped',
    message: 'Your order has been shipped',
    time: '1 hour ago',
    icon: ShoppingCart,
    iconColor: 'text-blue-400',
  },
])

const clearNotifications = () => {
  notifications.value = []
}
</script>
