<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        :class="[
          'sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 rounded-tl-lg',
          theme.borderPrimary,
          theme.transitionColors,
        ]"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger :class="['-ml-1', theme.textPrimary, theme.bgButtonHover]" />
          <Separator
            :class="['mr-2 data-[orientation=vertical]:h-4', theme.borderPrimary]"
            orientation="vertical"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink as-child>
                  <RouterLink
                    :class="[theme.textPrimary, 'hover:opacity-80', theme.transitionColors]"
                    :to="{ name: 'overview' }"
                  >
                    Dashboard
                  </RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparatorSelector
                :custom-separator="customBreadcrumbSeparator"
                :separator="breadcrumbSeparator"
                :separator-class="['hidden md:block', theme.textTertiary]"
              />
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
                :class="[
                  'pl-9 pr-4 h-9 w-64 focus-visible:ring-white/20 dark:focus-visible:ring-white/20 light:focus-visible:ring-gray-400',
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                ]"
                placeholder="Search..."
                type="search"
              />
            </div>

            <!-- Theme Toggle -->
            <ThemeToggle />

            <!-- App Switcher -->
            <AppSwitcherCompact :is-admin="isAdmin" :teams="appTeams" />

            <!-- Notifications -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'relative']"
                  size="icon"
                  variant="ghost"
                >
                  <Bell class="h-5 w-5" />
                  <span
                    v-if="notifications.length > 0"
                    class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
                  ></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                :class="['w-80', theme.bgDropdown, theme.borderSecondary]"
                align="end"
              >
                <div class="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel :class="theme.textPrimary">Notifications</DropdownMenuLabel>
                  <Button
                    v-if="notifications.length > 0"
                    :class="['h-7 px-2 text-xs', theme.textSecondary, theme.bgButtonHover]"
                    size="sm"
                    variant="ghost"
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
                        :class="notification.iconColor"
                        class="h-4 w-4 mt-0.5 shrink-0"
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
      <div
        :class="[
          'flex flex-1 flex-col gap-4 p-6 md:p-10 rounded-bl-lg',
          'group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-6 md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-8',
          theme.bgFooter,
          theme.transitionColors,
        ]"
      >
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import { Bell, CheckCircle2, Search, ShoppingCart } from 'lucide-vue-next'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar'
import { Separator } from '@/components/shadcn/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/shadcn/breadcrumb'
import BreadcrumbSeparatorSelector from '@/components/organisms/BreadcrumbSeparatorSelector.vue'
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
import { RouterLink } from 'vue-router'
import AppSidebar from '@/components/organisms/AppSidebar.vue'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import AppSwitcherCompact from '@/components/organisms/AppSwitcherCompact.vue'
import ProductIcon from '@/components/atoms/ProductIcon.vue'
import { MAZELOOT_PRODUCTS } from '@/constants/products'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useUserStore } from '@/stores/user'
import { useBreadcrumbSeparator } from '@/composables/useBreadcrumbSeparator'

const props = defineProps({
  breadcrumbSeparator: {
    type: String,
    default: null, // null means use stored preference
    validator: value =>
      !value || ['chevron-right', 'chevron-left', 'slash', 'dot', 'custom'].includes(value),
  },
  customBreadcrumbSeparator: {
    type: [String, Object, Function],
    default: null,
  },
})

// Breadcrumb separator management (optional - can be overridden by props)
const { separator: defaultSeparator, customSeparator: defaultCustomSeparator } =
  useBreadcrumbSeparator()

// Use props separator if provided, otherwise use stored preference
const breadcrumbSeparator = computed(() => props.breadcrumbSeparator || defaultSeparator.value)
const customBreadcrumbSeparator = computed(
  () => props.customBreadcrumbSeparator || defaultCustomSeparator.value
)

const theme = useThemeClasses()
const userStore = useUserStore()

const isAdmin = computed(() => {
  return userStore.user?.email?.includes('admin') || false
})

// Convert Mazeloot products to teams format for navbar
const appTeams = MAZELOOT_PRODUCTS.map(product => ({
  name: product.displayName,
  logo: () => h(ProductIcon, { customType: product.customType }),
  plan: product.description,
  route: product.route || { name: 'overview' },
}))

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
