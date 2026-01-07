<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div
        :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-full'"
        class="p-8 pb-16 transition-all duration-300 h-full overflow-y-auto"
      >
        <div class="mb-10">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 :class="theme.textPrimary" class="text-3xl font-bold">Typography</h1>
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 scale-95 -translate-x-2"
                  enter-to-class="opacity-100 scale-100 translate-x-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-x-0"
                  leave-to-class="opacity-0 scale-95 -translate-x-2"
                >
                  <div
                    v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
                    class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                    <span>Unsaved changes</span>
                  </div>
                </Transition>
              </div>
              <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
                Select fonts that match your brand and style. See your changes in real-time in the
                preview panel.
              </p>
            </div>
            <!-- Quick Stats -->
            <div class="hidden md:flex gap-4">
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="px-4 py-2 rounded-lg border"
              >
                <div :class="theme.textTertiary" class="text-xs">Font Style</div>
                <div :class="theme.textPrimary" class="text-sm font-semibold mt-0.5">
                  {{ fontStyleOptions.find(s => s.value === formData.fontStyle)?.label || 'Normal' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-12rem)]">
          <!-- Main Content -->
          <div class="lg:col-span-2 flex flex-col min-h-0">
            <div class="flex-1 overflow-y-auto space-y-12 pr-2 min-h-0">
              <!-- Typography Section -->
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
              >
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Typography</h3>
                    <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                      Select fonts that match your brand and style
                    </p>
                  </div>
                </div>
                <div class="space-y-5">
                  <!-- Font Families -->
                  <div>
                    <label
                      :class="theme.textSecondary"
                      class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                    >
                      Font Family
                    </label>
                    <FontFamilySelect
                      v-model="formData.fontFamily"
                      placeholder="Select font family"
                    />
                  </div>
                  <!-- Font Style -->
                  <div>
                    <label
                      :class="theme.textSecondary"
                      class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                    >
                      Font Style
                    </label>
                    <Select v-model="formData.fontStyle">
                      <SelectTrigger
                        :class="[
                          theme.bgInput,
                          theme.borderInput,
                          theme.textInput,
                          'focus:ring-2 focus:ring-accent/20 focus:border-accent',
                        ]"
                        class="transition-all"
                      >
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                        <SelectItem
                          v-for="style in fontStyleOptions"
                          :key="style.value"
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          :style="getStylePreview(style.value)"
                          :value="style.value"
                        >
                          {{ style.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Navigation -->
            <div
              :class="theme.borderSecondary"
              class="mt-8 pt-6 border-t flex-shrink-0 bg-gradient-to-r from-transparent via-gray-50/50 dark:via-gray-900/50 to-transparent"
            >
              <div class="flex justify-between items-center">
                <Button
                  :class="[
                    theme.textSecondary,
                    theme.bgButtonHover,
                    'hover:text-accent hover:bg-accent/10 dark:hover:bg-accent/20 transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  ]"
                  :disabled="isSubmitting || isSaving"
                  class="px-4 py-2 rounded-lg font-medium"
                  variant="ghost"
                  @click="goBack"
                >
                  ← Back
                </Button>
                <div class="flex items-center gap-4">
                  <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-x-2"
                    enter-to-class="opacity-100 scale-100 translate-x-0"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-x-0"
                    leave-to-class="opacity-0 scale-95 translate-x-2"
                  >
                    <div
                      v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
                      class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50"
                    >
                      <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      <span class="text-xs font-medium text-amber-700 dark:text-amber-400"
                        >Unsaved changes</span
                      >
                    </div>
                  </Transition>
                  <Button
                    variant="default"
                    :disabled="!hasUnsavedChanges"
                    :loading="isSubmitting || isSaving"
                    :icon="!hasUnsavedChanges ? Check : null"
                    loading-label="Saving..."
                    class="hover:scale-105 active:scale-95 transition-all duration-200 px-6 py-2.5 font-medium"
                    @click="handleSave"
                  >
                    {{ !hasUnsavedChanges ? 'Saved' : 'Save Changes' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview Panel -->
          <div class="lg:col-span-3">
            <div class="sticky top-24">
              <div
                :class="[theme.borderSecondary, theme.bgCard]"
                class="rounded-xl border-2 overflow-hidden backdrop-blur-md bg-white/80 dark:bg-gray-900/80"
              >
                <div
                  :class="theme.borderSecondary"
                  class="p-5 border-b bg-gradient-to-r from-violet-50/50 to-blue-50/50 dark:from-violet-950/30 dark:to-blue-950/30"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3
                        :class="theme.textPrimary"
                        class="text-lg font-semibold flex items-center gap-2"
                      >
                        <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                        Live Preview
                      </h3>
                      <p :class="theme.textSecondary" class="text-xs mt-1.5">
                        See exactly how your design will look
                      </p>
                    </div>
                    <Button
                      :class="[
                        theme.textSecondary,
                        'hover:text-accent transition-all duration-200',
                      ]"
                      class="shrink-0 hover:bg-white/80 dark:hover:bg-gray-800/80"
                      size="sm"
                      title="Open preview in new tab"
                      variant="ghost"
                      @click="handleOpenPreviewInNewTab"
                    >
                      <ExternalLink class="h-4 w-4 mr-1.5" />
                      <span class="text-xs font-medium">Open</span>
                    </Button>
                  </div>
                </div>
                <div
                  class="h-[800px] overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-950/50 relative"
                >
                  <!-- Loading State -->
                  <Transition
                    enter-active-class="transition-opacity duration-200"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="transition-opacity duration-200"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <div
                      v-if="isLoading"
                      class="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-sm z-10"
                    >
                      <div class="flex flex-col items-center gap-3">
                        <Loader2 class="h-8 w-8 animate-spin text-accent" />
                        <p :class="theme.textSecondary" class="text-sm font-medium">
                          Loading preview...
                        </p>
                      </div>
                    </div>
                  </Transition>
                  <!-- Full Collection Preview -->
                  <CollectionPreview
                    v-if="!isLoading"
                    :preview-collection="mockPreviewCollection"
                    :preview-design-config="previewDesignConfig"
                    :preview-media="mockPreviewMedia"
                    :preview-mode="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unsaved Changes Modal -->
      <UnsavedChangesModal
        v-model="showUnsavedChangesModal"
        :is-saving="isSubmitting || isSaving"
        @cancel="handleCancelNavigation"
        @discard="handleDiscardAndLeave"
        @save="handleSaveAndLeave"
      />
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { Check, ExternalLink, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import FontFamilySelect from '@/components/organisms/FontFamilySelect.vue'
import CollectionPreview from '@/views/user/memora/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { toast } from '@/utils/toast'
import { fontStyleOptions as baseFontStyleOptions } from '@/utils/designConstants'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)

// UI State
// Sidebar collapse state with persistence
const { isSidebarCollapsed } = useSidebarCollapse()
const isSaving = ref(false)
const isSubmitting = ref(false)
const showUnsavedChangesModal = ref(false)

// Typography form data
const formData = reactive({
  fontFamily: 'sans',
  fontStyle: 'normal',
})

// Store original loaded data for comparison
const originalData = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoading.value) {
    return false
  }
  return (
    formData.fontFamily !== originalData.value.fontFamily ||
    formData.fontStyle !== originalData.value.fontStyle
  )
})

const previewDesignConfig = computed(() => {
  if (!collection.value) {
    // Fallback to formData if collection not loaded
    return {
      cover: 'left',
      coverFocalPoint: { x: 50, y: 50 },
      fontFamily: formData.fontFamily,
      fontStyle: formData.fontStyle,
      colorPalette: 'light',
      gridStyle: 'vertical',
      gridColumns: 3,
      thumbnailSize: 'regular',
      gridSpacing: 16,
      navigationStyle: 'icon-only',
    }
  }

  const collectionInStore = galleryStore.collections.find(c => c.id === collection.value?.id)
  if (!collectionInStore) {
    // Fallback to formData if not in store
    return {
      cover: 'left',
      coverFocalPoint: { x: 50, y: 50 },
      fontFamily: formData.fontFamily,
      fontStyle: formData.fontStyle,
      colorPalette: 'light',
      gridStyle: 'vertical',
      gridColumns: 3,
      thumbnailSize: 'regular',
      gridSpacing: 16,
      navigationStyle: 'icon-only',
    }
  }

  // Use organized design structure from API response
  const coverDesign = collectionInStore.design?.cover || collectionInStore.coverDesign || {}
  const colorDesign = collectionInStore.design?.color || collectionInStore.colorDesign || {}
  const gridDesign = collectionInStore.design?.grid || collectionInStore.gridDesign || {}

  return {
    cover: coverDesign.cover || 'left',
    coverFocalPoint: coverDesign.coverFocalPoint || { x: 50, y: 50 },
    fontFamily: formData.fontFamily || 'sans',
    fontStyle: formData.fontStyle || 'normal',
    colorPalette: colorDesign.colorPalette || 'light',
    gridStyle: gridDesign.gridStyle || 'vertical',
    gridColumns: gridDesign.gridColumns || 3,
    thumbnailSize: gridDesign.thumbnailOrientation || gridDesign.thumbnailSize || 'regular',
    gridSpacing: gridDesign.gridSpacing || 16,
    navigationStyle: gridDesign.tabStyle || gridDesign.navigationStyle || 'icon-only',
  }
})

// Watch formData and immediately update the collection in store (optimistic update)
watch(
  () => formData,
  newData => {
    if (!collection.value || isLoading.value || !originalData.value) return

    // Optimistically update the collection in the store
    const index = galleryStore.collections.findIndex(c => c.id === collection.value?.id)
    if (index !== -1) {
      const collectionInStore = galleryStore.collections[index]
      if (!collectionInStore.design) {
        collectionInStore.design = {}
      }
      collectionInStore.design.typography = { ...newData }
      // Trigger reactivity by updating the array reference
      galleryStore.collections = [...galleryStore.collections]
    }
  },
  { deep: true }
)

// Font style options (matching watermark implementation)
// Font style options - extends base options with 'bold italic'
const fontStyleOptions = [
  ...baseFontStyleOptions,
  { value: 'bold italic', label: 'Bold Italic' },
]

// Helper function to convert font style to CSS properties (like watermark)
const getFontStyleProperties = style => {
  if (!style) {
    return {
      fontWeight: 'normal',
      fontStyle: 'normal',
    }
  }
  const styles = style.split(/[\s-]+/).filter(s => s.length > 0)
  return {
    fontWeight: styles.includes('bold') ? 'bold' : 'normal',
    fontStyle: styles.includes('italic') ? 'italic' : 'normal',
  }
}

// Helper function for style preview in Select dropdown
const getStylePreview = styleValue => {
  return getFontStyleProperties(styleValue)
}

// Load collection data
const loadCollectionData = async () => {
  const collectionId = route.params.uuid
  if (!collectionId) {
    router.push({ name: 'manageCollections' })
    return
  }

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    if (!collectionData) {
      throw new Error('Collection not found')
    }

    collection.value = collectionData

    // Load typography design data - use organized design.typography structure from API
    const typographyDesign =
      collectionData.design?.typography ||
      collectionData.typographyDesign ||
      (collectionData.design
        ? {
            fontFamily: collectionData.design.fontFamily,
            fontStyle: collectionData.design.fontStyle,
          }
        : {})
    const loadedData = {
      fontFamily: typographyDesign.fontFamily || 'sans',
      fontStyle: typographyDesign.fontStyle || 'normal',
    }
    Object.assign(formData, loadedData)
    originalData.value = { ...loadedData }
  } catch (error) {
    toast.error('Failed to load collection', {
      description: error.message || 'An error occurred',
    })
    router.push({ name: 'manageCollections' })
  } finally {
    isLoading.value = false
  }
}

// Watch for route changes
watch(
  () => route.params.uuid,
  () => {
    loadCollectionData()
  },
  { immediate: true }
)

// Save typography design
const saveTypographyDesign = async () => {
  if (!collection.value) {
    toast.error('Collection not found')
    return false
  }

  try {
    isSaving.value = true
    // Convert reactive formData to plain object to ensure proper serialization
    const typographyData = {
      fontFamily: formData.fontFamily,
      fontStyle: formData.fontStyle,
    }
    await galleryStore.updateCollection(collection.value.id, {
      typographyDesign: typographyData,
    })

    if (originalData.value) {
      originalData.value = { ...typographyData }
    }
    return true
  } catch (error) {
    toast.error('Failed to save typography design', {
      description: error.message || 'An error occurred while saving.',
    })
    return false
  } finally {
    isSaving.value = false
  }
}

const handleSave = async () => {
  const success = await saveTypographyDesign()
  if (success) {
    toast.success('Typography design saved successfully', {
      description: 'Typography settings have been updated.',
      icon: Check,
    })
  }
}

// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    Object.assign(formData, originalData.value)
  }
}

const { handleSaveAndLeave, handleDiscardAndLeave, handleCancelNavigation } =
  useUnsavedChangesGuard({
    hasUnsavedChanges,
    isSubmitting,
    isSaving,
    saveFunction: saveTypographyDesign,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })

const goBack = async () => {
  isSubmitting.value = true
  try {
    const success = await saveTypographyDesign()
    if (success) {
      router.push({
        name: 'collectionPhotos',
        params: { uuid: route.params.uuid },
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleOpenPreviewInNewTab = async () => {
  const collectionId = route.params.uuid
  if (!collectionId) {
    toast.error('Collection not found')
    return
  }

  // Save current design changes before opening preview
  const success = await saveTypographyDesign()
  if (success) {
    const previewUrl = router.resolve({
      name: 'collectionPreview',
      params: { id: collectionId },
    }).href
    window.open(previewUrl, '_blank')
  }
}

// Fallback image URL
const fallbackImageUrl =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop'

// Mock data for preview
const mockPreviewCollection = computed(() => ({
  id: collection.value?.id || 'preview',
  name: collection.value?.name || 'My Sample Collection',
  date: collection.value?.eventDate || '2025-09-01',
  eventDate: collection.value?.eventDate || '2025-09-01',
  thumbnail: collection.value?.thumbnail || fallbackImageUrl,
  createdAt: collection.value?.createdAt || new Date().toISOString(),
  updatedAt: collection.value?.updatedAt || new Date().toISOString(),
  status: collection.value?.status || 'active',
  category: collection.value?.category || 'event',
}))

const mockPreviewMedia = computed(() => {
  const photoIds = [
    '1519741497674-611481863552',
    '1516589178581-6cd7833ae3b2',
    '1511285560929-80b456fea0bc',
    '1521119989659-a83eee488004',
    '1475721027785-f74eccf877e2',
    '1511578314322-379afb476865',
    '1494790008762-728dbb2e86b0',
    '1500648767791-00dcc994a43e',
    '1505373877841-8d25f7d46678',
    '1478147427282-58a87a120781',
    '1515934751635-c81c6bc9a2d8',
    '1522673607200-164d1b6ce486',
  ]

  return photoIds.map((id, index) => ({
    id: `preview-${index}`,
    collectionId: collection.value?.id || 'preview',
    url: `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop`,
    thumbnail: `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`,
    type: 'image',
    title: `Photo ${index + 1}`,
    order: index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
})
</script>

<style scoped>
/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 10px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(71, 85, 105, 0.4);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(71, 85, 105, 0.6);
}
</style>
