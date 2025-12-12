<template>
  <div class="flex flex-col h-screen overflow-hidden" :class="theme.bgPage">
    <!-- Full Width Header - Glassy Effect -->
    <div
      class="w-full border-b flex-shrink-0 backdrop-blur-xl bg-white/40 dark:bg-gray-950/40 sticky top-0 z-50"
      :class="theme.borderPrimary"
    >
      <div class="p-4 flex items-center justify-between">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <button
            @click="handleClose"
            class="p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 shrink-0 group"
            :class="theme.textSecondary"
          >
            <X class="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>
          <div v-if="!isEditingTitle" class="flex items-center gap-2 flex-1 min-w-0 group">
            <h2
              @click="startEditingTitle"
              class="text-lg font-semibold truncate cursor-text hover:opacity-80 transition-opacity px-1 -mx-1 rounded hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              :class="theme.textPrimary"
              title="Click to edit preset name"
            >
              {{ presetName }}
            </h2>
            <button
              @click.stop="startEditingTitle"
              class="p-1.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all shrink-0 opacity-0 group-hover:opacity-100"
              :class="theme.textSecondary"
              title="Edit preset name"
            >
              <Pencil class="h-4 w-4" />
            </button>
          </div>
          <form v-else @submit.prevent="saveTitle" class="flex items-center gap-2 flex-1 min-w-0">
            <input
              ref="titleInputRef"
              v-model="editingTitle"
              @keydown.enter="handleEnterKey"
              @keydown.esc="cancelEditingTitle"
              @blur="handleBlur"
              :disabled="isSavingTitle"
              class="flex-1 text-lg font-semibold px-3 py-1.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="[theme.bgInput, theme.borderInput, theme.textInput, 'min-w-0']"
              placeholder="Preset name"
            />
            <div class="flex items-center gap-1 shrink-0">
              <button
                type="submit"
                @mousedown.prevent
                :disabled="isSavingTitle"
                class="p-1.5 rounded-lg hover:bg-teal-500/20 active:bg-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="theme.textSecondary"
                title="Save (Enter)"
              >
                <Check v-if="!isSavingTitle" class="h-4 w-4 text-teal-500" />
                <Loader2 v-else class="h-4 w-4 text-teal-500 animate-spin" />
              </button>
              <button
                type="button"
                @mousedown.prevent
                @click="cancelEditingTitle"
                :disabled="isSavingTitle"
                class="p-1.5 rounded-lg hover:bg-red-500/20 active:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="theme.textSecondary"
                title="Cancel (Esc)"
              >
                <X class="h-4 w-4 text-red-500" />
              </button>
            </div>
          </form>
        </div>
        <div class="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar Navigation -->
      <div
        class="border-r flex-shrink-0 flex flex-col backdrop-blur-md bg-white/30 dark:bg-gray-900/30 transition-all duration-300 ease-in-out"
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
                    'bg-teal-500/10 dark:bg-teal-500/20',
                    'text-teal-600 dark:text-teal-400',
                    'shadow-sm',
                    'border-l-3 border-teal-500',
                  ]
                : [
                    theme.textPrimary,
                    'hover:bg-gray-100/80 dark:hover:bg-gray-800/50',
                    'hover:text-teal-600 dark:hover:text-teal-400',
                  ],
              isSidebarCollapsed ? 'justify-center px-2' : '',
            ]"
          >
            <component
              :is="item.icon"
              class="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110"
              :class="
                activeTab === item.id ? 'text-teal-600 dark:text-teal-400' : theme.textSecondary
              "
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
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full"
            ></div>
          </div>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, provide, nextTick, watch } from 'vue'
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
} from 'lucide-vue-next'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { usePresetStore, type Preset } from '@/stores/preset'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()

// Sidebar collapse state
const isSidebarCollapsed = ref(false)

// Provide sidebar collapse state to child components
provide('isSidebarCollapsed', isSidebarCollapsed)

// Get preset from store based on route params
const currentPreset = computed(() => {
  const nameParam = route.params.name as string
  if (nameParam) {
    return presetStore.getPresetByName(nameParam)
  }
  return null
})

const presetName = computed(() => {
  return currentPreset.value?.name || 'Demo Test Preset'
})

// Title editing state
const isEditingTitle = ref(false)
const editingTitle = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)
const isSavingTitle = ref(false)
const isBlurring = ref(false)

// Watch preset name changes to update editing title
watch(
  () => currentPreset.value?.name,
  (newName: string | undefined) => {
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

const handleEnterKey = (e: KeyboardEvent) => {
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

  // Check if name already exists (excluding current preset)
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
    await presetStore.updatePreset(currentPreset.value.id, { name: newName })

    // Update route if name changed
    if (oldName !== newName) {
      router.replace({
        name: route.name as string,
        params: { name: newName },
      })
    }

    toast.success('Preset name updated')
    isEditingTitle.value = false
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update preset name'
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
  const routeName = route.name as string
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

const handleNavClick = (_tabId: string, routeName?: string) => {
  if (routeName && routeName !== route.name) {
    router.push({
      name: routeName,
      params: { name: route.params.name },
    })
  }
}
</script>
