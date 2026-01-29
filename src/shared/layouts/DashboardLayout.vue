<template>
  <SidebarProvider>
    <slot name="sidebar">
      <component :is="sidebarComponent || AppSidebar" />
    </slot>
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
                    :to="hideUserFeatures ? { name: 'admin-dashboard' } : { name: 'overview' }"
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
              v-if="!hideUserFeatures && !isSearchOpen"
              :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'md:hidden']"
              size="icon"
              variant="ghost"
              @click="isSearchOpen = true"
            >
              <Search class="h-5 w-5" />
            </Button>

            <!-- Search -->
            <Button
              v-if="!hideUserFeatures"
              :class="[
                'hidden md:flex items-center gap-2 h-9 w-64 justify-start',
                theme.bgInput,
                theme.borderInput,
                theme.textSecondary,
                'hover:' + theme.bgButtonHover,
              ]"
              variant="outline"
              @click="showCommandPalette = true"
            >
              <Search class="h-4 w-4" />
              <span class="text-sm">Search...</span>
              <kbd
                class="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100"
                :class="[theme.borderSecondary, theme.bgMuted, theme.textSecondary]"
              >
                <span class="text-xs">⌘</span>K
              </kbd>
            </Button>

            <!-- Theme Toggle -->
            <ThemeToggle />

            <!-- App Switcher -->
            <AppSwitcherCompact v-if="!hideUserFeatures" :is-admin="isAdmin" :teams="appTeams" />

            <!-- Notifications -->
            <NotificationDropdown v-if="!hideUserFeatures" product="memora" />
          </div>
        </div>
      </header>
      
      <!-- Mobile Search Dialog -->
      <Dialog v-if="!hideUserFeatures" v-model:open="isSearchOpen">
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
    
    <!-- Command Palette -->
    <CommandPalette v-if="!hideUserFeatures" :open="showCommandPalette" @update:open="showCommandPalette = $event" @select="handleSearchSelect" />
  </SidebarProvider>
</template>

<script setup>
import { computed, h, ref } from 'vue'
import { Search } from '@/shared/utils/lucideAnimated'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shared/components/shadcn/sidebar'
import { Separator } from '@/shared/components/shadcn/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/shared/components/shadcn/breadcrumb'
import BreadcrumbSeparatorSelector from '@/shared/components/organisms/BreadcrumbSeparatorSelector.vue'
import { Button } from '@/shared/components/shadcn/button'
import Input from '@/shared/components/shadcn/input/Input.vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { RouterLink } from 'vue-router'
import AppSidebar from '@/shared/components/organisms/AppSidebar.vue'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import AppSwitcherCompact from '@/shared/components/organisms/AppSwitcherCompact.vue'
import NotificationDropdown from '@/shared/components/organisms/NotificationDropdown.vue'
import CommandPalette from '@/shared/components/organisms/CommandPalette.vue'
import ProductIcon from '@/shared/components/atoms/ProductIcon.vue'
import { MAZELOOT_PRODUCTS } from '@/domains/memora/constants/products'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useUserStore } from '@/shared/stores/user'
import { useBreadcrumbSeparator } from '@/shared/composables/useBreadcrumbSeparator'
import { useNavigation } from '@/shared/composables/useNavigation'

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
  hideUserFeatures: {
    type: Boolean,
    default: false,
  },
  sidebarComponent: {
    type: Object,
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
const { navigateTo } = useNavigation()

const isAdmin = computed(() => {
  return userStore.user?.email?.includes('admin') || false
})

const isSearchOpen = ref(false)
const showCommandPalette = ref(false)

const handleSearchSelect = (item) => {
  if (item.route) {
    navigateTo(item.route)
  }
}

// Filter products to only show selected ones
const appTeams = computed(() => {
  const selectedProducts = userStore.selectedProducts || []
  if (selectedProducts.length === 0) {
    return []
  }
  
  // Get slugs of selected products
  const selectedSlugs = selectedProducts.map(p => {
    const product = p.product || p
    return product?.slug
  }).filter(Boolean)
  
  // Filter MAZELOOT_PRODUCTS to only include selected products
  const filteredProducts = MAZELOOT_PRODUCTS.filter(product => {
    const productId = product.id
    const normalizedId = productId.replace(/_/g, '-')
    return selectedSlugs.includes(productId) || 
           selectedSlugs.includes(normalizedId) ||
           selectedSlugs.some(slug => slug.replace(/_/g, '-') === normalizedId)
  })
  
  return filteredProducts.map(product => ({
    name: product.displayName,
    customType: product.customType,
    logo: () => h(ProductIcon, { customType: product.customType }),
    plan: product.description,
    route: product.route || { name: 'overview' },
  }))
})

</script>
