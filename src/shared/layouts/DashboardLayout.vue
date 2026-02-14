<template>
  <SidebarProvider>
    <slot name="sidebar">
      <component :is="sidebarComponent || AppSidebar" />
    </slot>
    <SidebarInset>
      <header
        :class="[
          'sticky top-0 z-50 flex h-14 md:h-16 shrink-0 items-center gap-1 sm:gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 rounded-tl-lg overflow-x-hidden',
          theme.borderPrimary,
          theme.transitionColors,
        ]"
      >
        <div class="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 min-w-0 flex-1 overflow-hidden">
          <SidebarTrigger :class="['-ml-1 shrink-0 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0', theme.textPrimary, theme.bgButtonHover]" />
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
              <template v-if="breadcrumbItems && breadcrumbItems.length">
                <template v-for="(item, idx) in breadcrumbItems" :key="idx">
                  <BreadcrumbSeparatorSelector
                    :custom-separator="customBreadcrumbSeparator"
                    :separator="breadcrumbSeparator"
                    :separator-class="['hidden md:block shrink-0', theme.textTertiary]"
                  />
                  <BreadcrumbItem :class="[idx === breadcrumbItems.length - 1 && 'min-w-0']">
                    <BreadcrumbLink v-if="item.to" as-child>
                      <RouterLink
                        :class="[theme.textPrimary, 'hover:opacity-80 truncate', theme.transitionColors]"
                        :to="item.to"
                      >
                        {{ item.label }}
                      </RouterLink>
                    </BreadcrumbLink>
                    <BreadcrumbPage v-else :class="[theme.textPrimary, 'truncate']">
                      {{ item.label }}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </template>
              </template>
              <template v-else>
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
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="flex flex-1 items-center justify-end min-w-0 shrink-0">
          <slot name="header" />
          <div class="flex items-center gap-1 sm:gap-2 pr-2 sm:pr-4 shrink-0">
            <!-- Tier Badge -->
            <DropdownMenu v-if="!hideUserFeatures && hasMemora">
              <DropdownMenuTrigger as-child>
                <button
                  :class="[
                    'hidden md:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    tierBadgeClass,
                  ]"
                  :aria-label="`Current plan tier: ${planLabel}`"
                >
                  <Sparkles class="h-3 w-3" aria-hidden="true" />
                  {{ planBadgeLabel }}
                  <ChevronDown class="h-3 w-3 opacity-60" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                :class="['w-64', theme.bgDropdown, theme.borderSecondary]"
                align="end"
              >
                <DropdownMenuLabel :class="theme.textPrimary">
                  <div class="flex items-center gap-2">
                    <Sparkles class="h-4 w-4 text-amber-500" />
                    <span>Memora Plan</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
                <div class="px-2 py-3 space-y-2">
                  <div class="flex items-center justify-between">
                    <span :class="['text-xs font-medium', theme.textSecondary]">Current Tier</span>
                    <span
                      :class="[
                        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold',
                        tierBadgeClass,
                      ]"
                    >
                      {{ planBadgeLabel }}
                    </span>
                  </div>
                  <div v-if="tierSummary" class="pt-2 border-t" :class="theme.borderSecondary">
                    <p :class="['text-xs leading-relaxed tabular-nums', theme.textSecondary]">
                      {{ tierSummary }}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
                <DropdownMenuItem
                  :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                  @click="navigateTo({ name: 'memora-pricing' })"
                >
                  <CreditCard class="h-4 w-4" />
                  <span>{{ hasPaidPlan ? 'Manage Subscription' : 'Upgrade Plan' }}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                  @click="navigateTo({ name: 'memora-usage' })"
                >
                  <BarChart3 class="h-4 w-4" />
                  <span>View Usage</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- Mobile Search Button -->
            <Button
              v-if="!hideUserFeatures && !isSearchOpen"
              :class="[theme.textPrimary, theme.bgButtonHover, theme.transition, 'md:hidden min-h-[44px] min-w-[44px] touch-manipulation']"
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

            <!-- Notifications: all products in admin so contact (general) shows; memora only for regular users -->
            <NotificationDropdown :product="hideUserFeatures ? null : 'memora'" />
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
                'pl-9 pr-4 h-10 w-full',
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
          'flex min-w-0 flex-1 flex-col gap-4 p-3 sm:p-4 md:p-6 lg:p-10 rounded-bl-lg pb-[calc(1rem+env(safe-area-inset-bottom))] overflow-x-hidden',
          'group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-3 sm:p-4 md:group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-6 lg:group-has-[[data-collapsible=icon]]/sidebar-wrapper:p-8',
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
import { computed, h, onMounted, ref } from 'vue'
import { BarChart3, ChevronDown, CreditCard, Search, Sparkles } from '@/shared/utils/lucideAnimated'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
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
import { useAuthApi } from '@/shared/api/auth'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import { useSettingsApi } from '@/domains/memora/api/settings'
import { useRegionalStore } from '@/shared/stores/regional'

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
  /** Admin nested breadcrumbs: [{ label, to? }]. Last item is current page (no to). */
  breadcrumbItems: {
    type: Array,
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

// Tier badge logic
const hasMemora = computed(() => {
  const selectedProducts = userStore.selectedProducts || []
  return selectedProducts.some(p => {
    const product = p.product || p
    return product?.slug === 'memora'
  })
})

const memoraTier = computed(() => userStore.user?.memora_tier ?? 'starter')
const { tierDisplayName } = useMemoraFeatures()

const planLabel = computed(() => tierDisplayName(memoraTier.value))

const planBadgeLabel = computed(() => {
  const t = memoraTier.value
  if (t === 'byo') return 'BYO'
  return planLabel.value
})

const tierBadgeClass = computed(() => {
  const t = memoraTier.value
  if (t === 'pro') return 'bg-amber-500/25 text-amber-800 dark:text-amber-200 border-amber-500/40 hover:bg-amber-500/35'
  if (t === 'byo') return 'bg-purple-500/25 text-purple-800 dark:text-purple-200 border-purple-500/40 hover:bg-purple-500/35'
  return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30 hover:bg-gray-500/30'
})

const hasPaidPlan = computed(() => {
  const t = memoraTier.value
  return t !== 'starter' && t !== null && t !== undefined
})

// Storage and usage data
const authApi = useAuthApi()
const totalStorage = ref(5 * 1024 * 1024 * 1024)
const projectCount = ref(0)
const projectLimit = ref(null)
const collectionCount = ref(0)
const collectionLimit = ref(null)

const tierSummary = computed(() => {
  const parts = []
  parts.push(formatBytes(totalStorage.value) + ' storage')
  if (projectLimit.value != null) {
    parts.push(`${projectCount.value}/${projectLimit.value} projects`)
  } else if (projectCount.value > 0) {
    parts.push(`${projectCount.value} projects`)
  }
  if (collectionLimit.value != null) {
    parts.push(`${collectionCount.value}/${collectionLimit.value} collections`)
  } else if (collectionCount.value > 0) {
    parts.push(`${collectionCount.value} collections`)
  }
  return parts.join(' · ')
})

const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const fetchStorage = async () => {
  try {
    const storageData = await authApi.getStorage()
    if (storageData.total_storage_bytes) {
      totalStorage.value = storageData.total_storage_bytes
    }
    projectCount.value = storageData.project_count ?? 0
    projectLimit.value = storageData.project_limit ?? null
    collectionCount.value = storageData.collection_count ?? 0
    collectionLimit.value = storageData.collection_limit ?? null
    if (userStore.user && (storageData.memora_features || storageData.memora_capabilities)) {
      userStore.updateUser({
        ...(storageData.memora_features && { memora_features: storageData.memora_features }),
        ...(storageData.memora_capabilities && { memora_capabilities: storageData.memora_capabilities }),
      })
    }
  } catch (error) {
    console.error('Failed to fetch storage usage:', error)
  }
}

onMounted(() => {
  if (hasMemora.value) {
    fetchStorage()
    useSettingsApi()
      .fetchSettings()
      .then(settings => useRegionalStore().setFromSettings(settings))
      .catch(() => {})
  }
})

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
