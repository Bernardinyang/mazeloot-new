<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header
        :class="[
          'sticky top-0 z-50 flex h-14 md:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 rounded-tl-lg',
          theme.borderPrimary,
          theme.transitionColors,
        ]"
      >
        <div class="flex items-center gap-1 md:gap-2 px-2 md:px-4 min-w-0 flex-1">
          <SidebarTrigger :class="['-ml-1', theme.textPrimary, theme.bgButtonHover, 'shrink-0']" />
          <Separator
            :class="['mr-1 md:mr-2 data-[orientation=vertical]:h-4 hidden sm:block', theme.borderPrimary]"
            orientation="vertical"
          />
          <Breadcrumb class="min-w-0 flex-1">
            <BreadcrumbList class="flex-wrap">
              <BreadcrumbItem class="hidden md:block shrink-0">
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
                :separator-class="['hidden md:block shrink-0', theme.textTertiary]"
              />
              <BreadcrumbItem class="min-w-0">
                <BreadcrumbPage :class="[theme.textPrimary, 'truncate']">
                  <slot name="breadcrumb" />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="flex flex-1 items-center justify-end min-w-0">
          <slot name="header" />
          <div class="flex items-center gap-1 md:gap-2 pr-2 md:pr-4 shrink-0">
            <!-- Mobile Search Button -->
            <Button
              v-if="!isSearchOpen"
              :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'md:hidden']"
              size="icon"
              variant="ghost"
              @click="isSearchOpen = true"
            >
              <Search class="h-5 w-5" />
            </Button>

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
            <NotificationDropdown product="memora" />
          </div>
        </div>
      </header>
      
      <!-- Mobile Search Dialog -->
      <Dialog v-model:open="isSearchOpen">
        <DialogContent :class="[theme.bgDropdown, theme.borderSecondary]">
          <DialogHeader>
            <DialogTitle :class="theme.textPrimary">Search</DialogTitle>
          </DialogHeader>
          <div class="flex items-center relative mt-4">
            <Search
              :class="['absolute left-3 h-4 w-4 pointer-events-none', theme.textTertiary]"
            />
            <Input
              :class="[
                'pl-9 pr-4 h-10 w-full focus-visible:ring-white/20 dark:focus-visible:ring-white/20 light:focus-visible:ring-gray-400',
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                theme.placeholderInput,
              ]"
              placeholder="Search..."
              type="search"
              autofocus
              @keydown.escape="isSearchOpen = false"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div
        :class="[
          'flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-10 rounded-bl-lg',
          'group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-4 md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-6 lg:group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-8',
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
import { Search, ShoppingCart } from 'lucide-vue-next'
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { RouterLink } from 'vue-router'
import AppSidebar from '@/components/organisms/AppSidebar.vue'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import AppSwitcherCompact from '@/components/organisms/AppSwitcherCompact.vue'
import NotificationDropdown from '@/components/organisms/NotificationDropdown.vue'
import ProductIcon from '@/components/atoms/ProductIcon.vue'
import { MAZELOOT_PRODUCTS } from '@/constants/products'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useUserStore } from '@/stores/user'
import { useBreadcrumbSeparator } from '@/composables/useBreadcrumbSeparator'

const props = defineProps({
  breadcrumbSeparator: {
    type: String,
    default: null,
    validator: value =>
      !value || ['chevron-right', 'chevron-left', 'slash', 'dot', 'custom'].includes(value),
  },
  customBreadcrumbSeparator: {
    type: [String, Object, Function],
    default: null,
  },
})

const { separator: defaultSeparator, customSeparator: defaultCustomSeparator } =
  useBreadcrumbSeparator()

const breadcrumbSeparator = computed(() => props.breadcrumbSeparator || defaultSeparator.value)
const customBreadcrumbSeparator = computed(
  () => props.customBreadcrumbSeparator || defaultCustomSeparator.value
)

const theme = useThemeClasses()
const userStore = useUserStore()

const isAdmin = computed(() => {
  return userStore.user?.email?.includes('admin') || false
})

const isSearchOpen = ref(false)

const appTeams = MAZELOOT_PRODUCTS.map(product => ({
  name: product.displayName,
  logo: () => h(ProductIcon, { customType: product.customType }),
  plan: product.description,
  route: product.route || { name: 'overview' },
}))

</script>
