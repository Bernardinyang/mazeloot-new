<template>
  <div class="flex flex-col h-screen overflow-hidden" :class="theme.bgPage">
    <!-- Full Width Header - Glassy Effect -->
    <div
      class="w-full border-b flex-shrink-0 backdrop-blur-xl bg-white/40 dark:bg-gray-950/40 sticky top-0 z-50 pt-[env(safe-area-inset-top)]"
      :class="theme.borderPrimary"
    >
      <div class="p-2 md:p-4 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <button
            @click="handleClose"
            class="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 shrink-0 group min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 touch-manipulation"
            :class="theme.textSecondary"
          >
            <X class="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
          </button>
          <button
            v-if="isMobile && !isMobileSidebarOpen"
            @click="isMobileSidebarOpen = true"
            class="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 shrink-0 md:hidden min-h-[44px] min-w-[44px] touch-manipulation"
            :class="theme.textSecondary"
          >
            <Menu class="h-4 w-4" />
          </button>
          <div v-if="!isEditingTitle" class="flex items-center gap-1 md:gap-2 flex-1 min-w-0 group">
            <h2
              v-if="!presetStore.isLoading && currentPreset"
              @click="startEditingTitle"
              class="text-base md:text-lg font-semibold truncate cursor-text hover:opacity-80 transition-opacity px-1 -mx-1 rounded hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              :class="theme.textPrimary"
              title="Click to edit preset name"
            >
              {{ presetName }}
            </h2>
            <div
              v-else
              class="h-5 md:h-6 w-24 md:w-32 rounded-md bg-primary/10 animate-pulse"
            />
            <button
              @click.stop="startEditingTitle"
              class="p-1 md:p-1.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all shrink-0 opacity-0 md:group-hover:opacity-100"
              :class="theme.textSecondary"
              title="Edit preset name"
            >
              <Pencil class="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>
          <form v-else @submit.prevent="saveTitle" class="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
            <input
              ref="titleInputRef"
              v-model="editingTitle"
              @keydown.enter="handleEnterKey"
              @keydown.esc="cancelEditingTitle"
              @blur="handleBlur"
              :disabled="isSavingTitle"
              class="flex-1 text-base md:text-lg font-semibold px-2 md:px-3 py-1 md:py-1.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="[theme.bgInput, theme.borderInput, theme.textInput, 'min-w-0']"
              placeholder="Preset name"
            />
            <div class="flex items-center gap-0.5 md:gap-1 shrink-0">
              <Button
                type="submit"
                variant="ghost"
                size="icon-sm"
                @mousedown.prevent
                :disabled="isSavingTitle"
                :loading="isSavingTitle"
                :icon="!isSavingTitle ? Check : null"
                class="p-1 md:p-1.5 hover:bg-violet-500/20 active:bg-violet-500/30"
                title="Save (Enter)"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                @mousedown.prevent
                @click="cancelEditingTitle"
                :disabled="isSavingTitle"
                :icon="X"
                class="p-1 md:p-1.5 hover:bg-red-500/20 active:bg-red-500/30"
                title="Cancel (Esc)"
              />
            </div>
          </form>
        </div>
        <div class="flex items-center gap-2 md:gap-3 shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Desktop Sidebar Navigation (hidden on mobile) -->
      <div
        class="hidden md:flex border-r flex-shrink-0 flex-col backdrop-blur-md bg-white/30 dark:bg-gray-900/30 transition-all duration-300 ease-in-out"
        :class="[theme.borderPrimary, isSidebarCollapsed ? 'w-16' : 'w-64']"
      >
        <!-- Sidebar Toggle Button -->
        <div class="p-3 border-b flex items-center justify-end" :class="theme.borderPrimary">
          <button
            @click="isSidebarCollapsed = !isSidebarCollapsed"
            class="p-1.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 group"
            :class="theme.textSecondary"
            :title="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          >
            <ChevronLeft
              v-if="!isSidebarCollapsed"
              class="h-4 w-4 group-hover:scale-110 transition-transform"
            />
            <ChevronRight v-else class="h-4 w-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <!-- Navigation Items -->
        <nav class="flex-1 overflow-y-auto p-3 space-y-1">
          <div
            v-for="item in navigationItems"
            :key="item.id"
            @click="handleNavClick(item.id, item.route)"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative"
            :class="[
              activeTab === item.id
                ? [
                    'bg-violet-500/10 dark:bg-violet-500/20',
                    'text-violet-600 dark:text-violet-400',
                    'shadow-sm',
                    'border-l-3 border-violet-500',
                  ]
                : [
                    theme.textPrimary,
                    'hover:bg-gray-100/80 dark:hover:bg-gray-800/50',
                    'hover:text-violet-600 dark:hover:text-violet-400',
                  ],
              isSidebarCollapsed ? 'justify-center px-2' : '',
            ]"
          >
            <component
              :is="item.icon"
              class="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
              :class="activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : ''"
            />
            <span
              v-if="!isSidebarCollapsed"
              class="text-sm font-medium transition-opacity duration-300"
              :class="isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'"
            >
              {{ item.label }}
            </span>
            <!-- Tooltip for collapsed state -->
            <div
              v-if="isSidebarCollapsed"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50"
            >
              {{ item.label }}
            </div>
            <div
              v-if="activeTab === item.id"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-r-full"
            ></div>
          </div>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto p-4 md:p-6">
        <slot />
      </div>
    </div>
  </div>

  <!-- Mobile Sidebar (Sheet/Drawer) -->
  <Sheet v-model:open="isMobileSidebarOpen">
    <SheetContent
      :class="[theme.bgCard, theme.borderSecondary, 'w-80 p-0']"
      side="left"
    >
      <div class="flex flex-col h-full backdrop-blur-md bg-white/30 dark:bg-gray-900/30">
        <!-- Sidebar Header -->
        <div class="p-4 border-b flex items-center justify-between" :class="theme.borderPrimary">
          <h3 :class="[theme.textPrimary, 'text-lg font-semibold']">Navigation</h3>
          <button
            @click="isMobileSidebarOpen = false"
            class="p-1.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
            :class="theme.textSecondary"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Navigation Items -->
        <nav class="flex-1 overflow-y-auto p-3 space-y-1">
          <div
            v-for="item in navigationItems"
            :key="item.id"
            @click="() => { handleNavClick(item.id, item.route); isMobileSidebarOpen = false; }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative"
            :class="[
              activeTab === item.id
                ? [
                    'bg-violet-500/10 dark:bg-violet-500/20',
                    'text-violet-600 dark:text-violet-400',
                    'shadow-sm',
                    'border-l-3 border-violet-500',
                  ]
                : [
                    theme.textPrimary,
                    'hover:bg-gray-100/80 dark:hover:bg-gray-800/50',
                    'hover:text-violet-600 dark:hover:text-violet-400',
                  ],
            ]"
          >
            <component
              :is="item.icon"
              class="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
              :class="activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : ''"
            />
            <span class="text-sm font-medium">
              {{ item.label }}
            </span>
            <div
              v-if="activeTab === item.id"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-r-full"
            ></div>
          </div>
        </nav>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup>
import { computed, ref, provide, nextTick, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  X,
  Settings,
  Palette,
  Lock,
  Download,
  Heart,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Check,
  Loader2,
  Menu,
} from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Sheet, SheetContent } from '@/shared/components/shadcn/sheet'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import { useMediaQuery } from '@vueuse/core'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { toast } from '@/shared/utils/toast'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()

// Preset loading is handled by individual pages, not here

const isMobile = useMediaQuery('(max-width: 768px)')
const isMobileSidebarOpen = ref(false)
const isSidebarCollapsed = ref(isMobile.value)

// Provide sidebar collapse state to child components
provide('isSidebarCollapsed', isSidebarCollapsed)

const currentPreset = computed(() => {
  const idParam = route.params.id
  if (idParam) {
    return presetStore.getPresetById(idParam)
  }
  return null
})

const presetName = computed(() => {
  return currentPreset.value?.name || 'Demo Test Preset'
})

// Title editing state
const isEditingTitle = ref(false)
const editingTitle = ref('')
const titleInputRef = ref(null)
const isSavingTitle = ref(false)
const isBlurring = ref(false)

// Watch preset name changes to update editing title
watch(
  () => currentPreset.value?.name,
  newName => {
    if (newName && !isEditingTitle.value) {
      editingTitle.value = newName
    }
  },
  { immediate: true }
)

const startEditingTitle = async () => {
  if (!currentPreset.value) return
  editingTitle.value = currentPreset.value.name || ''
  isEditingTitle.value = true
  await nextTick()
  titleInputRef.value?.focus()
  titleInputRef.value?.select()
}

const cancelEditingTitle = () => {
  if (isSavingTitle.value) return
  isEditingTitle.value = false
  editingTitle.value = currentPreset.value?.name || ''
}

const handleEnterKey = e => {
  e.preventDefault()
  saveTitle()
}

const handleBlur = () => {
  // Use setTimeout to allow click events on buttons to fire first
  setTimeout(() => {
    if (!isBlurring.value && !isSavingTitle.value) {
      saveTitle()
    }
    isBlurring.value = false
  }, 200)
}

const saveTitle = async () => {
  if (!currentPreset.value || isSavingTitle.value) return

  const newName = editingTitle.value.trim()
  const oldName = currentPreset.value.name

  // Don't save if name hasn't changed or is empty
  if (newName === oldName || !newName) {
    cancelEditingTitle()
    return
  }

  const existingPreset = presetStore.presets.find(
    p => p.name.toLowerCase() === newName.toLowerCase() && p.id !== currentPreset.value?.id
  )
  if (existingPreset) {
    toast.error('A preset with this name already exists')
    titleInputRef.value?.focus()
    return
  }

  isSavingTitle.value = true
  isBlurring.value = true
  try {
    await presetStore.updatePreset(currentPreset.value.id, { name: editingTitle.value })

    // No need to update route params when name changes, UUID stays the same

    toast.success('Preset name updated')
    isEditingTitle.value = false
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    toast.error(errorMessage)
    titleInputRef.value?.focus()
  } finally {
    isSavingTitle.value = false
    isBlurring.value = false
  }
}

// Navigation items
const navigationItems = [
  { id: 'general', label: 'General', icon: Settings, route: 'presetGeneral' },
  { id: 'design', label: 'Design', icon: Palette, route: 'presetDesign' },
  { id: 'privacy', label: 'Privacy', icon: Lock, route: 'presetPrivacy' },
  { id: 'download', label: 'Download', icon: Download, route: 'presetDownload' },
  { id: 'favorite', label: 'Favorite', icon: Heart, route: 'presetFavorite' },
]

// Determine active tab based on current route
const activeTab = computed(() => {
  const routeName = route.name
  if (routeName === 'presetGeneral') return 'general'
  if (routeName === 'presetDesign') return 'design'
  if (routeName === 'presetPrivacy') return 'privacy'
  if (routeName === 'presetDownload') return 'download'
  if (routeName === 'presetFavorite') return 'favorite'
  return 'general'
})

const handleClose = () => {
  router.push({ name: 'presetSettings' })
}

const handleNavClick = tabId => {
  const targetRoute = navigationItems.find(item => item.id === tabId)?.route
  if (targetRoute && targetRoute !== route.name && currentPreset.value?.id) {
    router.push({
      name: targetRoute,
      params: { id: currentPreset.value.id },
    })
  }
}
</script>
