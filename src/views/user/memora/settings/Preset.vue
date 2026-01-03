<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Preset </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="w-[50%]">
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Collection Presets
        </h1>
        <p class="text-sm mb-4" :class="theme.textSecondary">
          Save time by setting up default settings for your collections. Create a preset once, use
          it everywhere! 🎨
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Content -->
      <div class="space-y-6 w-[50%]">
        <!-- Presets List -->
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-base font-semibold" :class="theme.textPrimary">Your Presets</h3>
            <div class="flex items-center gap-2 flex-1 max-w-md">
              <div class="relative flex-1">
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  :class="theme.textSecondary"
                />
                <Input
                  v-model="searchQuery"
                  placeholder="Search presets..."
                  :class="[
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'pl-9 pr-9 border-2 transition-all duration-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50',
                  ]"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2"
                  :class="theme.textSecondary"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
            <Button
              @click="handleAddPreset"
              size="sm"
              :disabled="presetStore.isLoading"
              class="bg-teal-500 hover:bg-teal-600 text-white shrink-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus class="mr-1.5 h-3.5 w-3.5" />
              Add New
            </Button>
          </div>

          <!-- Loading State -->
          <div
            v-if="presetStore.isLoading"
            class="flex flex-col items-center justify-center py-12 px-6 rounded-2xl border-2 border-dashed transition-all duration-300"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <Loader2 class="h-8 w-8 animate-spin mb-3" :class="theme.textSecondary" />
            <p class="text-sm text-center" :class="theme.textSecondary">Loading presets...</p>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="presets.length === 0"
            class="flex flex-col items-center justify-center py-12 px-6 rounded-2xl border-2 border-dashed transition-all duration-300"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div
              class="w-12 h-12 rounded-full bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center mb-3"
            >
              <Plus class="h-6 w-6 text-teal-500" />
            </div>
            <p class="text-sm text-center mb-4" :class="theme.textSecondary">
              No presets yet. Create one to get started!
            </p>
            <Button
              @click="handleAddPreset"
              size="sm"
              class="bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus class="mr-1.5 h-3.5 w-3.5" />
              Create Your First Preset
            </Button>
          </div>

          <!-- Presets List -->
          <div v-else class="space-y-0">
            <div
              v-if="selectedPresets.length === 0"
              class="flex items-center gap-2 px-4 py-2 border-b"
              :class="theme.borderSecondary"
            >
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="rounded border-gray-300 dark:border-gray-600"
              />
              <span class="text-xs" :class="theme.textSecondary">Select all</span>
            </div>
            <template v-for="(preset, index) in presets" :key="preset?.id || preset?.uuid">
              <div
                v-if="preset && (preset.id || preset.uuid)"
                @click="selectedPresets.length > 0 ? togglePresetSelection(preset.id || preset.uuid) : handleEditPreset(preset.id || preset.uuid)"
                class="flex items-center justify-between py-3 px-4 border-b transition-all duration-200 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50"
                :class="[
                  theme.borderSecondary,
                  draggedIndex === index ? 'opacity-50' : '',
                  sortBy === 'created_at' && selectedPresets.length === 0 ? 'cursor-move' : '',
                  isPresetSelected(preset.id || preset.uuid)
                    ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/30'
                    : '',
                ]"
                :draggable="sortBy === 'created_at' && selectedPresets.length === 0"
                @dragstart="handleDragStart($event, index)"
                @dragover.prevent="handleDragOver($event, index)"
                @drop="handleDrop($event, index)"
                @dragend="handleDragEnd"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    v-if="selectedPresets.length > 0"
                    type="checkbox"
                    :checked="isPresetSelected(preset.id || preset.uuid)"
                    @click.stop="togglePresetSelection(preset.id || preset.uuid)"
                    class="rounded border-gray-300 dark:border-gray-600 shrink-0"
                  />
                  <PresetQuickPreview
                    :preset="preset"
                    :open="hoveredPresetId === (preset.id || preset.uuid)"
                    @update:open="val => (hoveredPresetId = val ? preset.id || preset.uuid : null)"
                    @edit="handleEditPreset"
                    @use="handleQuickUse"
                  >
                    <div class="flex flex-col gap-1 flex-1 min-w-0 cursor-pointer">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm font-medium truncate" :class="theme.textPrimary">
                          {{ preset.name }}
                        </span>
                        <span
                          v-if="preset.category"
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shrink-0"
                        >
                          {{ preset.category }}
                        </span>
                        <span
                          v-if="preset.isSelected"
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/20 dark:border-teal-500/30 shrink-0"
                        >
                          Default
                        </span>
                        <span
                          v-if="preset.completenessScore !== undefined && preset.completenessScore < 50"
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 shrink-0"
                        >
                          {{ preset.completenessScore }}% complete
                        </span>
                        <span
                          v-if="preset.usageCount > 0"
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 shrink-0"
                        >
                          Used in {{ preset.usageCount }} {{ preset.usageCount === 1 ? 'collection' : 'collections' }}
                        </span>
                      </div>
                      <p
                        v-if="preset.description"
                        class="text-xs truncate"
                        :class="theme.textSecondary"
                      >
                        {{ preset.description }}
                      </p>
                    </div>
                  </PresetQuickPreview>
                </div>

                <!-- Three-dot Menu -->
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button
                      @click.stop
                      class="h-8 w-8 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-sm"
                      :class="theme.textSecondary"
                    >
                      <MoreVertical class="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary]">
                    <DropdownMenuItem
                      :class="[
                        theme.textPrimary,
                        theme.bgButtonHover,
                        'cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors duration-200',
                      ]"
                      @click.stop="handleEditPreset(preset.id || preset.uuid)"
                    >
                      <Pencil class="mr-2 h-4 w-4" :class="theme.textSecondary" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-if="!preset.isSelected"
                      :class="[
                        theme.textPrimary,
                        theme.bgButtonHover,
                        'cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors duration-200',
                      ]"
                      :disabled="presetStore.isLoading"
                      @click.stop="handleSetDefault(preset.id || preset.uuid)"
                    >
                      <Star class="mr-2 h-4 w-4" :class="theme.textSecondary" />
                      Set as Default
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      :class="[
                        theme.textPrimary,
                        theme.bgButtonHover,
                        'cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors duration-200',
                      ]"
                      :disabled="presetStore.isLoading"
                      @click.stop="handleDuplicatePreset(preset.id || preset.uuid)"
                    >
                      <Loader2
                        v-if="presetStore.isLoading"
                        class="mr-2 h-4 w-4 animate-spin"
                        :class="theme.textSecondary"
                      />
                      <Copy v-else class="mr-2 h-4 w-4" :class="theme.textSecondary" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
                    <DropdownMenuItem
                      :class="[
                        'text-red-500',
                        theme.bgButtonHover,
                        'cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200',
                      ]"
                      :disabled="presetStore.isLoading"
                      @click.stop="handleDeletePreset(preset.id || preset.uuid)"
                    >
                      <Loader2
                        v-if="presetStore.isLoading"
                        class="mr-2 h-4 w-4 animate-spin text-red-500"
                      />
                      <Trash2 v-else class="mr-2 h-4 w-4 text-red-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </template>
          </div>

          <!-- Description -->
          <p class="text-xs mt-4 leading-relaxed" :class="theme.textSecondary">
            Presets let you apply your favorite settings to new collections automatically. Set it up
            once, and you're good to go!
            <a
              href="#"
              class="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline font-medium transition-colors"
            >
              Learn more
            </a>
            .
          </p>
        </div>
      </div>
    </div>

    <!-- Create Preset Dialog -->
    <CreatePresetDialog v-model:open="showCreatePresetDialog" @create="handleCreatePresetSubmit" />

    <!-- Comparison Modal -->
    <PresetComparisonModal
      v-model="showComparisonModal"
      :preset-id="presetToCompare"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :item-name="presetToDelete?.id === 'bulk' ? `${selectedPresets.length} preset(s)` : presetToDelete?.name"
      :title="presetToDelete?.id === 'bulk' ? 'Delete Presets' : 'Delete Preset'"
      description="This action cannot be undone."
      :warning-message="presetToDelete?.id === 'bulk'
        ? `You are about to delete ${selectedPresets.length} preset(s). This action cannot be undone.`
        : (presetToDelete?.usageCount > 0 
          ? `This preset is used in ${presetToDelete.usageCount} ${presetToDelete.usageCount === 1 ? 'collection' : 'collections'}. The preset will be removed, but existing collections will keep their current settings.`
          : 'This preset will be permanently removed. Collections using this preset will not be affected, but new collections will no longer be able to use it.')"
      :is-deleting="isDeleting"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, MoreVertical, Pencil, Copy, Trash2, Loader2, Star, Search, X, GitCompare, LayoutGrid, List } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Separator } from '@/components/shadcn/separator'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from '@/utils/toast'
import CreatePresetDialog from '@/components/organisms/CreatePresetDialog.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import PresetComparisonModal from '@/components/organisms/PresetComparisonModal.vue'
import PresetQuickPreview from '@/components/organisms/PresetQuickPreview.vue'
import { usePresetStore } from '@/stores/preset'

const theme = useThemeClasses()
const router = useRouter()
const presetStore = usePresetStore()

const showCreatePresetDialog = ref(false)
const showDeleteModal = ref(false)
const showComparisonModal = ref(false)
const presetToDelete = ref(null)
const presetToCompare = ref(null)
const isDeleting = ref(false)
const searchQuery = ref('')
const categoryFilter = ref('')
const sortBy = ref('created_at')
const viewMode = ref('list')
const draggedIndex = ref(null)
const isReordering = ref(false)
const selectedPresets = ref([])
const hoveredPresetId = ref(null)

const categories = ['Wedding', 'Portrait', 'Event', 'Commercial', 'Other']

const presets = computed(() => {
  let filtered = presetStore.presets

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(preset => preset.category === categoryFilter.value)
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(preset => {
      const nameMatch = preset.name?.toLowerCase().includes(query)
      const descMatch = preset.description?.toLowerCase().includes(query)
      const categoryMatch = preset.category?.toLowerCase().includes(query)
      const tagsMatch = preset.collectionTags?.toLowerCase().includes(query)
      return nameMatch || descMatch || categoryMatch || tagsMatch
    })
  }

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '')
      case 'updated_at':
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      case 'usage_count':
        return (b.usageCount || 0) - (a.usageCount || 0)
      case 'created_at':
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    }
  })

  return sorted
})

// Load presets on mount
onMounted(async () => {
  try {
    await presetStore.loadPresets({ sort_by: sortBy.value })
  } catch (error) {
    toast.error('Failed to load presets', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
})

// Reload presets when component is activated (when navigating back)
onActivated(async () => {
  try {
    await presetStore.loadPresets({ sort_by: sortBy.value })
  } catch (error) {
    // Silently fail on activated - don't show error toast
  }
})

// Watch sortBy and reload presets
watch(sortBy, async () => {
  try {
    await presetStore.loadPresets({ sort_by: sortBy.value })
  } catch (error) {
    // Silently fail
  }
})

const handleEditPreset = id => {
  const preset = presets.value.find(p => p.id === id)
  if (preset) {
    // Convert preset name to URL-friendly format
    router.push({
      name: 'presetGeneral',
      params: { id: preset.id },
    })
  }
}

const handleSetDefault = async id => {
  try {
    await presetStore.setDefaultPreset(id)
    toast.success('Default preset updated', {
      description: 'This preset will be used by default when creating new collections.',
    })
  } catch (error) {
    toast.error('Failed to set default preset', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const handleDuplicatePreset = async id => {
  try {
    await presetStore.duplicatePreset(id)
    toast.success('Preset duplicated successfully')
  } catch (error) {
    toast.error('Failed to duplicate preset', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const handleDeletePreset = id => {
  const preset = presets.value.find(p => p.id === id)
  if (preset) {
    presetToDelete.value = preset
    showDeleteModal.value = true
  }
}

const handleConfirmDelete = async () => {
  if (!presetToDelete.value) return

  isDeleting.value = true
  try {
    if (presetToDelete.value.id === 'bulk') {
      // Bulk delete
      for (const presetId of selectedPresets.value) {
        await presetStore.deletePreset(presetId)
      }
      toast.success(`Deleted ${selectedPresets.value.length} preset(s) successfully`)
      selectedPresets.value = []
    } else {
      // Single delete
      await presetStore.deletePreset(presetToDelete.value.id)
      toast.success('Preset deleted successfully', {
        description: `"${presetToDelete.value.name}" has been permanently deleted.`,
      })
    }
    showDeleteModal.value = false
    presetToDelete.value = null
    await presetStore.loadPresets({ sort_by: sortBy.value })
  } catch (error) {
    toast.error('Failed to delete preset(s)', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isDeleting.value = false
  }
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
  presetToDelete.value = null
}

const handleAddPreset = () => {
  showCreatePresetDialog.value = true
}

const handleDragStart = (event, index) => {
  if (sortBy.value !== 'created_at') return // Only allow drag when using default sort
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.currentTarget.style.opacity = '0.5'
}

const handleDragOver = (event, index) => {
  if (draggedIndex.value === null || draggedIndex.value === index) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

const handleDrop = async (event, dropIndex) => {
  event.preventDefault()
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) return

  const newPresets = [...presets.value]
  const [draggedPreset] = newPresets.splice(draggedIndex.value, 1)
  newPresets.splice(dropIndex, 0, draggedPreset)

  // Update order in backend
  isReordering.value = true
  try {
    const presetIds = newPresets.map(p => p.id || p.uuid)
    await presetStore.reorderPresets(presetIds)
    await presetStore.loadPresets({ sort_by: 'created_at' })
    toast.success('Presets reordered successfully')
  } catch (error) {
    toast.error('Failed to reorder presets', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isReordering.value = false
    draggedIndex.value = null
  }
}

const handleDragEnd = event => {
  event.currentTarget.style.opacity = '1'
  draggedIndex.value = null
}

const isPresetSelected = id => {
  return selectedPresets.value.includes(id)
}

const togglePresetSelection = id => {
  const index = selectedPresets.value.indexOf(id)
  if (index > -1) {
    selectedPresets.value.splice(index, 1)
  } else {
    selectedPresets.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedPresets.value = []
  } else {
    selectedPresets.value = presets.value.map(p => p.id || p.uuid).filter(Boolean)
  }
}

const allSelected = computed(() => {
  return presets.value.length > 0 && selectedPresets.value.length === presets.value.length
})

const handleBulkDuplicate = async () => {
  if (selectedPresets.value.length === 0) return

  try {
    for (const presetId of selectedPresets.value) {
      await presetStore.duplicatePreset(presetId)
    }
    toast.success(`Duplicated ${selectedPresets.value.length} preset(s) successfully`)
    selectedPresets.value = []
    await presetStore.loadPresets({ sort_by: sortBy.value })
  } catch (error) {
    toast.error('Failed to duplicate presets', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const handleBulkDelete = () => {
  if (selectedPresets.value.length === 0) return
  presetToDelete.value = { id: 'bulk', name: `${selectedPresets.value.length} preset(s)` }
  showDeleteModal.value = true
}

const handleComparePreset = id => {
  presetToCompare.value = id
  showComparisonModal.value = true
}

const handleQuickUse = preset => {
  // Navigate to create collection with preset selected
  router.push({
    name: 'collections',
    query: { presetId: preset.id || preset.uuid },
  })
}

const handleCreatePresetSubmit = async data => {
  // Check for duplicate name
  const existingPreset = presets.value.find(
    p => p.name.toLowerCase().trim() === data.name.toLowerCase().trim()
  )
  if (existingPreset) {
    const error = new Error('A preset with this name already exists')
    throw error
  }

  const newPreset = await presetStore.createPreset({ name: data.name })

  toast.success('Preset created successfully', {
    description: 'Your new preset has been created.',
  })

  // Route to preset general page
  if (newPreset) {
    router.push({
      name: 'presetGeneral',
      params: { id: newPreset.id },
    })
  }

  return newPreset
}
</script>
