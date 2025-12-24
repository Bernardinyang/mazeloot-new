<template>
  <SelectionLayout :is-loading="isLoading" :selection="selection" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading settings...</p>
          </div>
        </div>

        <div v-else class="max-w-[50%] p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                General Settings
              </h1>
              <button
                :class="theme.borderSecondary"
                class="w-5 h-5 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95"
                title="More information"
              >
                <Info :class="theme.textSecondary" class="h-3 w-3" />
              </button>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              Configure general settings for your selection including name, color, cover photo, and
              display preferences.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Selection Name -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Selection Name</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  The name of this selection as it appears in your dashboard and to customers.
                </p>
              </div>
              <Input
                v-model="selectionName"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="My Selection"
              />
            </div>

            <!-- Selection Color -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Selection Color</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Choose a color to help identify this selection in your dashboard.
                </p>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <input
                  v-model="selectionColor"
                  :class="theme.borderSecondary"
                  class="h-12 w-20 rounded-lg border-2 cursor-pointer"
                  type="color"
                />
                <Input
                  v-model="selectionColor"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="flex-1 focus:ring-2 focus:ring-teal-500/20 transition-all font-mono text-sm"
                  placeholder="#10B981"
                />
              </div>
            </div>

            <!-- Password Protection -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Password Protection
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Require a password for customers to access this selection.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch
                    v-model="hasPassword"
                    label=""
                    @update:model-value="handlePasswordToggle"
                  />
                </div>
              </div>
              <div v-if="hasPassword" class="space-y-3 max-w-md">
                <PasswordInput
                  v-if="!isChangingPassword"
                  :model-value="passwordPlaceholder"
                  :input-class="[
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'focus:ring-2 focus:ring-teal-500/20 transition-all',
                  ]"
                  disabled
                  placeholder="Enter new password"
                />
                <PasswordInput
                  v-else
                  v-model="newPassword"
                  :input-class="[
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'focus:ring-2 focus:ring-teal-500/20 transition-all',
                  ]"
                  placeholder="Enter new password"
                  @blur="handlePasswordChange"
                />
                <div class="flex items-center gap-2">
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="isChangingPassword = !isChangingPassword"
                  >
                    {{ isChangingPassword ? 'Cancel' : 'Change Password' }}
                  </Button>
                  <Button
                    v-if="isChangingPassword && newPassword"
                    :class="['bg-teal-500 hover:bg-teal-600 text-white']"
                    :disabled="isSavingPassword"
                    size="sm"
                    @click="handleSavePassword"
                  >
                    {{ isSavingPassword ? 'Saving...' : 'Save Password' }}
                  </Button>
                </div>
              </div>
            </div>

            <!-- Auto-Delete Settings -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Auto-Delete Settings
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Configure when unselected media will be automatically deleted after selection
                  completion.
                </p>
              </div>
              <div class="space-y-4">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">
                      Enable Auto-Delete
                    </p>
                    <p :class="theme.textSecondary" class="text-xs">
                      Automatically delete unselected media after a specified number of days.
                    </p>
                  </div>
                  <div class="flex-shrink-0 pt-1">
                    <ToggleSwitch v-model="autoDeleteEnabled" label="" />
                  </div>
                </div>
                <div v-if="autoDeleteEnabled" class="space-y-3 max-w-md">
                  <div>
                    <label :class="theme.textPrimary" class="text-sm font-medium mb-2 block">
                      Days Until Deletion
                    </label>
                    <Input
                      v-model.number="autoDeleteDays"
                      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                      class="focus:ring-2 focus:ring-teal-500/20 transition-all"
                      max="365"
                      min="1"
                      placeholder="30"
                      type="number"
                    />
                    <p :class="theme.textSecondary" class="text-xs mt-1">
                      Unselected media will be deleted this many days after selection completion.
                    </p>
                  </div>
                  <div v-if="autoDeleteDate" :class="theme.bgButtonHover" class="p-3 rounded-lg">
                    <p :class="theme.textSecondary" class="text-xs mb-1">
                      Calculated Auto-Delete Date
                    </p>
                    <p :class="theme.textPrimary" class="text-sm font-medium">
                      {{ formatDate(autoDeleteDate) }}
                    </p>
                    <p
                      v-if="selection?.status === 'completed'"
                      :class="theme.textSecondary"
                      class="text-xs mt-1"
                    >
                      Based on completion date + {{ autoDeleteDays }} days
                    </p>
                    <p v-else :class="theme.textSecondary" class="text-xs mt-1">
                      Will be calculated when selection is completed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Display Preferences -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Display Preferences
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Configure how media is displayed in this selection (your view only).
                </p>
              </div>
              <div class="space-y-4">
                <!-- View Mode -->
                <div>
                  <label :class="theme.textPrimary" class="text-sm font-medium mb-2 block">
                    Default View Mode
                  </label>
                  <Select v-model="viewMode">
                    <SelectTrigger
                      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                      class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent :class="[theme.bgCard, theme.borderCard]">
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="grid"
                        >Grid</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="list"
                        >List</SelectItem
                      >
                    </SelectContent>
                  </Select>
                </div>

                <!-- Grid Size -->
                <div v-if="viewMode === 'grid'">
                  <label :class="theme.textPrimary" class="text-sm font-medium mb-2 block">
                    Grid Size
                  </label>
                  <Select v-model="gridSize">
                    <SelectTrigger
                      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                      class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent :class="[theme.bgCard, theme.borderCard]">
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="small"
                        >Small</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="medium"
                        >Medium</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="large"
                        >Large</SelectItem
                      >
                    </SelectContent>
                  </Select>
                </div>

                <!-- Show Filenames -->
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">
                      Show Filenames
                    </p>
                    <p :class="theme.textSecondary" class="text-xs">
                      Display file names below media thumbnails.
                    </p>
                  </div>
                  <div class="flex-shrink-0 pt-1">
                    <ToggleSwitch v-model="showFilename" label="" />
                  </div>
                </div>

                <!-- Sort Order -->
                <div>
                  <label :class="theme.textPrimary" class="text-sm font-medium mb-2 block">
                    Default Sort Order
                  </label>
                  <Select v-model="sortOrder">
                    <SelectTrigger
                      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                      class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent :class="[theme.bgCard, theme.borderCard]">
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="uploaded-new-old"
                        >Uploaded (Newest First)</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="uploaded-old-new"
                        >Uploaded (Oldest First)</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="name-a-z"
                        >Name (A-Z)</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="name-z-a"
                        >Name (Z-A)</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="date-taken-new-old"
                        >Date Taken (Newest First)</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="date-taken-old-new"
                        >Date Taken (Oldest First)</SelectItem
                      >
                      <SelectItem
                        :class="[
                          theme.textPrimary,
                          theme.bgButtonHover,
                          'hover:bg-teal-50 dark:hover:bg-teal-950/20',
                        ]"
                        value="random"
                        >Random</SelectItem
                      >
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div :class="theme.borderSecondary" class="mt-10 pt-6 border-t">
            <div class="flex items-center justify-end gap-3">
              <Button
                :class="[theme.borderSecondary, theme.textPrimary]"
                class="group hover:bg-gray-50 dark:hover:bg-gray-800/70 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                variant="outline"
                @click="goBack"
              >
                Cancel
              </Button>
              <Button
                :class="['bg-teal-500 hover:bg-teal-600 text-white']"
                :disabled="!hasChanges || isSaving"
                @click="handleSave"
              >
                <Loader2 v-if="isSaving" class="h-4 w-4 mr-2 animate-spin" />
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </SelectionLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Info, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import PasswordInput from '@/components/molecules/PasswordInput.vue'
import SelectionLayout from '@/layouts/SelectionLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSelectionStore } from '@/stores/selection'
import { useSelectionsApi } from '@/api/selections'
import { toast } from '@/utils/toast'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const selectionStore = useSelectionStore()
const selectionsApi = useSelectionsApi()

// Selection data
const selection = ref(null)
const isLoading = ref(false)
const isSaving = ref(false)

// Settings state
const selectionName = ref('')
const selectionColor = ref('#10B981')
const hasPassword = ref(false)
const isChangingPassword = ref(false)
const newPassword = ref('')
const isSavingPassword = ref(false)
const autoDeleteEnabled = ref(false)
const autoDeleteDays = ref(30)

// Original values for change tracking
const originalValues = ref({
  name: '',
  color: '#10B981',
  autoDeleteEnabled: false,
  autoDeleteDays: 30,
  viewMode: 'grid',
  gridSize: 'small',
  showFilename: true,
  sortOrder: 'uploaded-new-old',
})

// Display preferences (from store)
const { viewMode, gridSize, showFilename, sortOrder } = storeToRefs(selectionStore)

// Computed

const passwordPlaceholder = computed(() => {
  return hasPassword.value ? '••••••••' : ''
})

const autoDeleteDate = computed(() => {
  if (!autoDeleteEnabled.value) {
    return null
  }
  // If selection is already completed, use existing auto-delete date or calculate from completion
  if (selection.value?.selectionCompletedAt || selection.value?.selection_completed_at) {
    if (selection.value.autoDeleteDate || selection.value.auto_delete_date) {
      return new Date(selection.value.autoDeleteDate || selection.value.auto_delete_date)
    }
    const completionDate = new Date(
      selection.value.selectionCompletedAt || selection.value.selection_completed_at
    )
    const deleteDate = new Date(completionDate)
    deleteDate.setDate(deleteDate.getDate() + autoDeleteDays.value)
    return deleteDate
  }
  return null
})

// Check if there are unsaved changes
const hasChanges = computed(() => {
  return (
    selectionName.value !== originalValues.value.name ||
    selectionColor.value !== originalValues.value.color ||
    autoDeleteEnabled.value !== originalValues.value.autoDeleteEnabled ||
    autoDeleteDays.value !== originalValues.value.autoDeleteDays ||
    viewMode.value !== originalValues.value.viewMode ||
    gridSize.value !== originalValues.value.gridSize ||
    showFilename.value !== originalValues.value.showFilename ||
    sortOrder.value !== originalValues.value.sortOrder
  )
})

// Load selection data
onMounted(async () => {
  const selectionId = route.params.id
  if (!selectionId) return

  isLoading.value = true
  try {
    const selectionData = await selectionStore.fetchSelection(selectionId)
    selection.value = selectionData
    selectionName.value = selectionData.name || ''
    selectionColor.value = selectionData.color || '#10B981'
    hasPassword.value = !!selectionData.hasPassword || !!selectionData.password
    autoDeleteEnabled.value = !!selectionData.autoDeleteDate || !!selectionData.auto_delete_date
    if (selectionData.autoDeleteDate || selectionData.auto_delete_date) {
      // Calculate days from completion date if available
      if (selectionData.selectionCompletedAt) {
        const completionDate = new Date(selectionData.selectionCompletedAt)
        const deleteDate = new Date(selectionData.autoDeleteDate || selectionData.auto_delete_date)
        const diffTime = deleteDate - completionDate
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays > 0) {
          autoDeleteDays.value = diffDays
        }
      }
    }

    // Load display settings from backend
    const displaySettings = selectionData.display_settings || {}
    if (displaySettings.view_mode) {
      selectionStore.setViewMode(displaySettings.view_mode)
    }
    if (displaySettings.grid_size) {
      selectionStore.setGridSize(displaySettings.grid_size)
    }
    if (displaySettings.show_filename !== undefined) {
      selectionStore.showFilename = displaySettings.show_filename
    }
    if (displaySettings.sort_order) {
      selectionStore.sortOrder = displaySettings.sort_order
    }

    // Store original values for change tracking
    originalValues.value = {
      name: selectionName.value,
      color: selectionColor.value,
      autoDeleteEnabled: autoDeleteEnabled.value,
      autoDeleteDays: autoDeleteDays.value,
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
    }
  } catch (error) {
    toast.error('Failed to load selection', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  // Reset to original values if there are unsaved changes
  if (hasChanges.value) {
    selectionName.value = originalValues.value.name
    selectionColor.value = originalValues.value.color
    autoDeleteEnabled.value = originalValues.value.autoDeleteEnabled
    autoDeleteDays.value = originalValues.value.autoDeleteDays
    selectionStore.setViewMode(originalValues.value.viewMode)
    selectionStore.setGridSize(originalValues.value.gridSize)
    selectionStore.showFilename = originalValues.value.showFilename
    selectionStore.sortOrder = originalValues.value.sortOrder
  }

  router.push({
    name: 'selectionDetail',
    params: { id: selection.value?.id },
    query: { tab: 'photos' },
  })
}

// Handlers
const handleSave = async () => {
  if (!selection.value || !hasChanges.value || isSaving.value) return

  // Validate inputs
  if (!selectionName.value.trim()) {
    toast.error('Invalid name', {
      description: 'Selection name cannot be empty.',
    })
    return
  }

  // Validate color format
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  if (!colorRegex.test(selectionColor.value)) {
    toast.error('Invalid color format', {
      description: 'Please use a valid hex color (e.g., #10B981)',
    })
    return
  }

  // Validate auto-delete days
  if (autoDeleteEnabled.value && (autoDeleteDays.value < 1 || autoDeleteDays.value > 365)) {
    toast.error('Invalid auto-delete days', {
      description: 'Auto-delete days must be between 1 and 365.',
    })
    return
  }

  isSaving.value = true

  try {
    const updateData = {}

    // Update selection name
    if (selectionName.value.trim() !== originalValues.value.name) {
      updateData.name = selectionName.value.trim()
    }

    // Update color
    if (selectionColor.value !== originalValues.value.color) {
      updateData.color = selectionColor.value
    }

    // Update auto-delete settings
    if (
      autoDeleteEnabled.value !== originalValues.value.autoDeleteEnabled ||
      (autoDeleteEnabled.value && autoDeleteDays.value !== originalValues.value.autoDeleteDays)
    ) {
      let autoDeleteDateValue = null
      if (autoDeleteEnabled.value) {
        // Calculate date if selection is completed
        if (selection.value.selectionCompletedAt || selection.value.selection_completed_at) {
          const completionDate = new Date(
            selection.value.selectionCompletedAt || selection.value.selection_completed_at
          )
          const deleteDate = new Date(completionDate)
          deleteDate.setDate(deleteDate.getDate() + autoDeleteDays.value)
          autoDeleteDateValue = deleteDate.toISOString().split('T')[0]
        }
      }
      updateData.autoDeleteDate = autoDeleteDateValue
    }

    // Save selection updates
    if (Object.keys(updateData).length > 0) {
      await selectionsApi.updateSelection(selection.value.id, updateData)

      // Update local selection object
      if (updateData.name) selection.value.name = updateData.name
      if (updateData.color) selection.value.color = updateData.color
      if (updateData.autoDeleteDate !== undefined) {
        selection.value.autoDeleteDate = updateData.autoDeleteDate
        selection.value.auto_delete_date = updateData.autoDeleteDate
      }
    }

    // Prepare display settings for backend
    const displaySettings = {}
    if (viewMode.value !== originalValues.value.viewMode) {
      displaySettings.view_mode = viewMode.value
    }
    if (gridSize.value !== originalValues.value.gridSize) {
      displaySettings.grid_size = gridSize.value
    }
    if (showFilename.value !== originalValues.value.showFilename) {
      displaySettings.show_filename = showFilename.value
    }
    if (sortOrder.value !== originalValues.value.sortOrder) {
      displaySettings.sort_order = sortOrder.value
    }

    // Update display settings in backend
    if (Object.keys(displaySettings).length > 0) {
      updateData.display_settings = displaySettings
    }

    // Update display preferences in store (keep for immediate UI updates)
    if (viewMode.value !== originalValues.value.viewMode) {
      selectionStore.setViewMode(viewMode.value)
    }
    if (gridSize.value !== originalValues.value.gridSize) {
      selectionStore.setGridSize(gridSize.value)
    }
    if (showFilename.value !== originalValues.value.showFilename) {
      selectionStore.showFilename = showFilename.value
    }
    if (sortOrder.value !== originalValues.value.sortOrder) {
      selectionStore.sortOrder = sortOrder.value
    }

    // Update original values
    originalValues.value = {
      name: selectionName.value.trim(),
      color: selectionColor.value,
      autoDeleteEnabled: autoDeleteEnabled.value,
      autoDeleteDays: autoDeleteDays.value,
      viewMode: viewMode.value,
      gridSize: gridSize.value,
      showFilename: showFilename.value,
      sortOrder: sortOrder.value,
    }

    toast.success('Settings saved', {
      description: 'All changes have been saved successfully.',
    })
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isSaving.value = false
  }
}

const handlePasswordToggle = enabled => {
  if (enabled && !hasPassword.value) {
    // Password is being enabled but no password set yet
    isChangingPassword.value = true
  } else if (!enabled) {
    // User wants to disable password - they'll need to save it
    hasPassword.value = false
  }
}

const handleSavePassword = async () => {
  if (!selection.value || !newPassword.value.trim()) {
    toast.error('Password required', {
      description: 'Please enter a password.',
    })
    return
  }

  isSavingPassword.value = true
  try {
    await selectionsApi.updateSelection(selection.value.id, {
      password: newPassword.value,
    })
    hasPassword.value = true
    isChangingPassword.value = false
    newPassword.value = ''
    toast.success('Password set', {
      description: 'Password protection has been enabled for this selection.',
    })
  } catch (error) {
    toast.error('Failed to set password', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isSavingPassword.value = false
  }
}

const handlePasswordChange = async () => {
  if (!newPassword.value.trim() || !isChangingPassword.value) return
  // Only save if user explicitly clicks save button
}

const handleImageError = event => {
  const img = event.target
  if (img && img.src) {
    img.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
  }
}

const formatDate = date => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
