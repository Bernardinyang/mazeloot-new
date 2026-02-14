<template>
  <PhaseLayout phase-type="collection" :show-create-set-modal="false">
    <template #topNav>
      <CollectionTopNav
        v-model:is-date-picker-open="isDatePickerOpen"
        v-model:is-preset-popover-open="isPresetPopoverOpen"
        v-model:is-watermark-popover-open="isWatermarkPopoverOpen"
        :collection="collection"
        :phase-type="phaseType"
        :collection-status="effectiveCollectionStatus"
        :editing-name="editingName"
        :event-date="effectiveEventDate"
        :is-editing-name="isEditingName"
        :is-loading="isLoading"
        :is-saving-name="isSavingName"
        :is-saving-status="isSavingStatus"
        :presets="presets"
        :selected-preset-id="effectiveSelectedPresetId"
        :selected-preset-name="selectedPresetName"
        :selected-watermark="effectiveSelectedWatermark"
        :selected-watermark-name="selectedWatermarkName"
        :watermarks="watermarks"
        @go-back="$emit('goBack')"
        @start-editing-name="startEditingName"
        @update:editing-name="editingName = $event"
        @save-name="saveName"
        @cancel-editing-name="cancelEditingName"
        @handle-name-blur="handleNameBlur"
        @update:collection-status="collectionStatus = $event"
        @handle-status-change="handleStatusChange"
        @handle-date-change="handleDateChange"
        @handle-preset-change="handlePresetChange"
        @handle-watermark-change="handleWatermarkChange"
        @handle-preview="handlePreview"
        @handle-share="showShareModal = true"
        @handle-publish="handlePublish"
        @handle-unpublish="handleUnpublish"
      />
    </template>

    <template #sidebar>
      <CollectionSidebar
        :active-tab="activeTab"
        :collection="collection"
        :is-loading="isLoading"
        :is-sidebar-collapsed="isSidebarCollapsed"
        @update:is-sidebar-collapsed="isSidebarCollapsed = $event"
      >
        <CollectionSidebarPanels
          :active-tab="activeTab"
          :collection-id="collection?.id || ''"
          :download-enabled="downloadEnabled"
          :favorite-enabled="favoriteEnabled"
          :is-loading="isLoading"
          :is-sidebar-collapsed="isSidebarCollapsed"
          :set-limit-reached="props.setLimitReached"
        />
      </CollectionSidebar>
    </template>

    <template #content>
      <slot name="content" />
    </template>

    <template #shareModal>
      <ShareModal
        v-model:open="showShareModal"
        route-name="clientCollection"
        :route-params="{ domain: collection?.brandingDomain || undefined }"
        :route-query="{ collectionId: collection?.id || collection?.uuid || '' }"
        title="Share Collection"
        description="Share this collection with your client via link, QR code, WhatsApp, or email."
        :password="collectionPassword"
        password-description="Share this password with visitors to access this collection"
        :pin="collectionDownloadPin"
        pin-description="Share this PIN with visitors to download from this collection"
        :item-name="collection?.name || collection?.title || 'Collection'"
        qr-code-description="Scan this QR code to access the collection"
        :download-file-name="`collection-${collection?.id || 'qr'}-qr-code.png`"
      />
    </template>
  </PhaseLayout>
</template>

<script setup>
import PhaseLayout from '@/shared/layouts/PhaseLayout.vue'
import CollectionSidebar from '@/domains/memora/components/organisms/CollectionSidebar.vue'
import CollectionTopNav from '@/domains/memora/components/organisms/CollectionTopNav.vue'
import CollectionSidebarPanels from '@/domains/memora/components/organisms/CollectionSidebarPanels.vue'
import { computed, ref, watch, onMounted } from 'vue'
import ShareModal from '@/shared/components/organisms/ShareModal.vue'
import { useCollectionMediaSetsSidebarStore } from '@/domains/memora/stores/collectionMediaSetsSidebar'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useCollectionHeaderActions } from '@/domains/memora/composables/useCollectionHeaderActions'
import { useCollectionCoverActions } from '@/domains/memora/composables/useCollectionCoverActions'
import { useRoute, useRouter } from 'vue-router'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { createThumbnailFromDataURL } from '@/domains/memora/utils/media/createThumbnailFromDataURL'

const props = defineProps({
  collection: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
  setLimitReached: { type: Boolean, default: false },
})

defineEmits(['goBack'])

const route = useRoute()
const router = useRouter()
const galleryStore = useGalleryStore()

// Local, mutable collection ref:
// - Template expects `collection`
// - `useCollectionHeaderActions` expects a ref it can read/write (`collection.value`)
const collection = ref(props.collection)
watch(
  () => props.collection,
  c => {
    collection.value = c
  },
  { immediate: true }
)

// Sidebar collapse state (persisted, owned by the layout for consistency across all collection pages)
const { isSidebarCollapsed } = useSidebarCollapse()

const tabFromRouteName = routeName => {
  const n = routeName?.toString?.() ?? ''
  if (n === 'collectionPhotos' || n === 'collectionPreview') return 'photos'
  if (n.startsWith('collectionSettings')) return 'settings'
  if (n.startsWith('collectionActivities')) return 'activities'
  if (
    n === 'collectionCover' ||
    n === 'collectionTypography' ||
    n === 'collectionColor' ||
    n === 'collectionGrid'
  )
    return 'design'
  return 'photos'
}

const activeTab = computed(() => tabFromRouteName(route.name))

// Header state is now owned by the layout (reduces prop drilling)
const isEditingName = ref(false)
const editingName = ref('')
const isSavingName = ref(false)
const isBlurringName = ref(false)
const nameInputRef = ref(null)

const collectionStatus = ref('draft') // 'draft' | 'published'
const isSavingStatus = ref(false)

const eventDate = ref(null)
const isDatePickerOpen = ref(false)
const isSavingDate = ref(false)

const selectedPresetId = ref('none')
const isPresetPopoverOpen = ref(false)
const isSavingPreset = ref(false)

const selectedWatermark = ref('none')
const isWatermarkPopoverOpen = ref(false)
const isSavingWatermark = ref(false)

const showShareModal = ref(false)

const downloadEnabled = computed(() => {
  if (!collection.value) return false
  return collection.value.downloadEnabled !== false
})

const favoriteEnabled = computed(() => {
  if (!collection.value) return false
  return collection.value.favoriteEnabled !== false
})

const collectionPassword = computed(() => {
  if (!collection.value) return ''
  return (
    collection.value.password ||
    collection.value.settings?.privacy?.password ||
    collection.value.collectionPassword ||
    ''
  )
})

const collectionDownloadPin = computed(() => {
  if (!collection.value) return ''
  return collection.value.downloadPin || collection.value.settings?.download?.downloadPin || ''
})

const mediaSetsSidebar = useCollectionMediaSetsSidebarStore()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()

const phaseType = 'collection'

const presets = computed(() => presetStore.presets || [])
const watermarks = computed(() => watermarkStore.watermarks || [])

const selectedPresetName = computed(() => {
  if (selectedPresetId.value === 'none') return null
  const preset = presets.value.find(p => p.id === selectedPresetId.value)
  return preset?.name || null
})

const selectedWatermarkName = computed(() => {
  if (selectedWatermark.value === 'none') return null
  const watermark = watermarks.value.find(w => w.id === selectedWatermark.value)
  return watermark?.name || null
})

const effectiveCollectionStatus = computed(() => {
  return collectionStatus.value
})

const effectiveEventDate = computed(() => {
  return eventDate.value
})

const effectiveSelectedPresetId = computed(() => {
  return selectedPresetId.value
})

const effectiveSelectedWatermark = computed(() => {
  return selectedWatermark.value
})

watch(
  () => collection.value,
  c => {
    if (!c) return
    if (c.status === 'active') {
      collectionStatus.value = 'published'
    } else if (c.status === 'archived') {
      collectionStatus.value = 'archived'
    } else {
      collectionStatus.value = 'draft'
    }
    const rawDate = c.eventDate || c.date
    if (rawDate) {
      const d = new Date(rawDate)
      eventDate.value = Number.isNaN(d.getTime()) ? null : d
    } else {
      eventDate.value = null
    }
    selectedPresetId.value = c.presetId != null ? String(c.presetId) : 'none'
    selectedWatermark.value = c.watermarkId != null ? String(c.watermarkId) : 'none'
  },
  { immediate: true }
)

watch(
  () => collection.value?.id,
  (id) => {
    // Always fetch fresh from API, not from cached collection.mediaSets
    if (id) {
      mediaSetsSidebar.setContext(id, null)
    }
  },
  { immediate: true }
)

// Load presets and watermarks when popovers open
watch(
  () => isPresetPopoverOpen.value,
  async open => {
    if (open && presetStore.presets.length === 0) {
      try {
        await presetStore.loadPresets()
      } catch (error) {}
    }
  }
)

watch(
  () => isWatermarkPopoverOpen.value,
  async open => {
    if (open && watermarkStore.watermarks.length === 0) {
      try {
        await watermarkStore.fetchWatermarks()
      } catch (error) {}
    }
  }
)

const {
  handlePreview,
  handlePublish,
  handleUnpublish,
  handleStatusChange,
  handleDateChange,
  handlePresetChange,
  handleWatermarkChange,
  startEditingName,
  cancelEditingName,
  handleNameBlur,
  saveName,
} = useCollectionHeaderActions({
  collection,
  collectionStatus,
  isSavingStatus,
  eventDate,
  isDatePickerOpen,
  isSavingDate,
  selectedPresetId,
  isPresetPopoverOpen,
  isSavingPreset,
  selectedWatermark,
  isWatermarkPopoverOpen,
  isSavingWatermark,
  isEditingName,
  editingName,
  isSavingName,
  isBlurringName,
  nameInputRef,
  galleryStore,
  route,
  router,
  description: 'An unknown error occurred',
})

const { handleSetAsCover } = useCollectionCoverActions({
  collection,
  galleryStore,
  createThumbnailFromDataURL,
  description: 'An unknown error occurred',
})
</script>
