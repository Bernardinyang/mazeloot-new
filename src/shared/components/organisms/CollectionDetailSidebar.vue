<template>
  <SidebarModal
    v-model="isOpen"
    title="Collection Details"
    :description="collection?.title || collection?.name || 'Collection information'"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <!-- Content -->
    <div v-else-if="collection" class="space-y-6">
      <!-- Project Information Card -->
      <InfoCard
        v-if="project"
        title="Project"
        :description="project.description"
        :icon="FolderKanban"
      >
        <router-link
          :to="{ name: 'projectDashboard', params: { id: project.id } }"
          :class="[
            'text-sm font-semibold hover:underline transition-colors',
            theme.textPrimary,
            'hover:text-accent',
          ]"
        >
          {{ project.name }}
        </router-link>
      </InfoCard>

      <!-- Basic Information Section -->
      <DetailSection title="Basic Information">
        <DetailField label="ID" :value="collection.id" format="mono" />
        <DetailField label="Name" :value="collection.title || collection.name" />
        <DetailField
          v-if="collection.description"
          label="Description"
          :value="collection.description"
        />
        <DetailField v-if="collection.collectionType" label="Type">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
              collection.collectionType === 'gallery'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
            ]"
          >
            {{ collection.collectionType === 'gallery' ? 'Gallery' : 'Selection' }}
          </span>
        </DetailField>
        <DetailField
          v-if="collection.projectId"
          label="Project ID"
          :value="collection.projectId"
          format="mono"
        />
        <DetailField
          v-if="collection.itemCount !== undefined"
          label="Item Count"
          :value="`${collection.itemCount} ${collection.itemCount === 1 ? 'item' : 'items'}`"
        />
        <DetailField v-if="collection.url" label="URL" :value="collection.url" />
      </DetailSection>

      <!-- Download Settings Section -->
      <DetailSection
        v-if="hasDownloadSettings"
        title="Download Settings"
        container-class="pt-4 border-t"
      >
        <DetailField
          v-if="collection.downloadEnabled !== undefined"
          label="Download Enabled"
          :value="collection.downloadEnabled"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.photoDownload !== undefined"
          label="Media Download"
          :value="collection.photoDownload"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.highResolutionEnabled !== undefined"
          label="High Resolution Enabled"
          :value="collection.highResolutionEnabled"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.highResolutionSize"
          label="High Resolution Size"
          :value="collection.highResolutionSize"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.webSizeEnabled !== undefined"
          label="Web Size Enabled"
          :value="collection.webSizeEnabled"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.webSize"
          label="Web Size"
          :value="collection.webSize"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.downloadPinEnabled !== undefined"
          label="Download PIN Enabled"
          :value="collection.downloadPinEnabled"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.downloadPin"
          label="Download PIN"
          :value="collection.downloadPin"
          format="mono"
          layout="horizontal"
        />
      </DetailSection>

      <!-- Sharing & Privacy Settings Section -->
      <DetailSection
        v-if="hasSharingSettings"
        title="Sharing & Privacy"
        container-class="pt-4 border-t"
      >
        <DetailField
          v-if="collection.socialSharing !== undefined"
          label="Social Sharing"
          :value="collection.socialSharing"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.emailRegistration !== undefined"
          label="Email Registration"
          :value="collection.emailRegistration"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.showOnHomepage !== undefined"
          label="Show On Homepage"
          :value="collection.showOnHomepage"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.clientExclusiveAccess !== undefined"
          label="Client Exclusive Access"
          :value="collection.clientExclusiveAccess"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.clientPrivatePassword"
          label="Client Private Password"
          :value="collection.clientPrivatePassword ? '••••' : 'None'"
          format="mono"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.allowClientsMarkPrivate !== undefined"
          label="Allow Clients Mark Private"
          :value="collection.allowClientsMarkPrivate"
          format="boolean"
          layout="horizontal"
        />
      </DetailSection>

      <!-- Display Settings Section -->
      <DetailSection
        v-if="hasDisplaySettings"
        title="Display Settings"
        container-class="pt-4 border-t"
      >
        <DetailField
          v-if="collection.galleryAssist !== undefined"
          label="Gallery Assist"
          :value="collection.galleryAssist"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.slideshow !== undefined"
          label="Slideshow"
          :value="collection.slideshow"
          format="boolean"
          layout="horizontal"
        />
        <DetailField
          v-if="collection.language"
          label="Language"
          :value="collection.language"
          layout="horizontal"
        />
      </DetailSection>

      <!-- Tags & Sets Section -->
      <DetailSection v-if="hasTagsOrSets" title="Tags & Sets" container-class="pt-4 border-t">
        <div v-if="collection.tags && collection.tags.length > 0" class="space-y-2">
          <label :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]"
            >Tags</label
          >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in collection.tags"
              :key="tag"
              :class="[
                'px-2.5 py-1 rounded-md text-xs font-medium',
                theme.bgCardSolid,
                theme.textPrimary,
                'border',
                theme.borderSecondary,
              ]"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div
          v-if="collection.clientOnlySets && collection.clientOnlySets.length > 0"
          class="space-y-2"
        >
          <label :class="['text-xs font-medium uppercase tracking-wider', theme.textTertiary]"
            >Client Only Sets</label
          >
          <div class="flex flex-wrap gap-2">
            <span
              v-for="set in collection.clientOnlySets"
              :key="set"
              :class="[
                'px-2.5 py-1 rounded-md text-xs font-medium',
                theme.bgCardSolid,
                theme.textPrimary,
                'border',
                theme.borderSecondary,
              ]"
            >
              {{ set }}
            </span>
          </div>
        </div>
      </DetailSection>

      <!-- Timeline Section -->
      <DetailSection title="Timeline" container-class="pt-4 border-t">
        <DetailField
          label="Created At"
          :value="collection.createdAt || collection.date"
          format="date"
        />
        <DetailField
          v-if="collection.updatedAt"
          label="Updated At"
          :value="collection.updatedAt"
          format="date"
        />
      </DetailSection>

      <!-- Additional Properties Section -->
      <DetailSection
        v-if="hasAdditionalFields"
        title="Additional Properties"
        container-class="pt-4 border-t"
      >
        <div class="space-y-2">
          <div
            v-for="(value, key) in collection"
            :key="key"
            v-if="!excludedKeys.includes(key) && value !== null && value !== undefined"
          >
            <DetailField :label="formatKey(key)" :value="value" layout="horizontal" />
          </div>
        </div>
      </DetailSection>

      <!-- Actions Section -->
      <div class="pt-4 border-t" :class="theme.borderSecondary">
        <ActionButtonGroup>
          <Button
            variant="default"
            :icon="Eye"
            class="w-full"
            @click="handleViewCollection"
          >
            View Collection
          </Button>
          <Button
            variant="outline"
            class="w-full"
            :class="[theme.borderSecondary, theme.textPrimary]"
            @click="handleEdit"
          >
            <Pencil class="h-4 w-4 mr-2" />
            Edit Collection
          </Button>
        </ActionButtonGroup>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle class="h-12 w-12 mb-4" :class="theme.textTertiary" />
      <p :class="['text-sm font-medium', theme.textPrimary]">Collection not found</p>
      <p :class="['text-xs mt-1', theme.textSecondary]">
        The collection you're looking for doesn't exist or has been deleted.
      </p>
    </div>
  </SidebarModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, FolderKanban, Eye, Pencil, AlertCircle } from 'lucide-vue-next'
import SidebarModal from '@/shared/modals/SidebarModal.vue'
import DetailSection from '@/shared/components/molecules/DetailSection.vue'
import DetailField from '@/shared/components/molecules/DetailField.vue'
import InfoCard from '@/shared/components/molecules/InfoCard.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useGalleryStore } from '@/shared/stores/gallery'
import { useProjectStore } from '@/domains/memora/stores/project'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  collectionId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'edit'])

const theme = useThemeClasses()
const router = useRouter()
const galleryStore = useGalleryStore()
const projectStore = useProjectStore()

const collection = ref(null)
const project = ref(null)
const isLoading = ref(false)

const excludedKeys = [
  'id',
  'title',
  'name',
  'description',
  'collectionType',
  'projectId',
  'itemCount',
  'createdAt',
  'updatedAt',
  'date',
  'url',
  'downloadEnabled',
  'photoDownload',
  'highResolutionEnabled',
  'highResolutionSize',
  'webSizeEnabled',
  'webSize',
  'downloadPinEnabled',
  'downloadPin',
  'socialSharing',
  'emailRegistration',
  'galleryAssist',
  'slideshow',
  'showOnHomepage',
  'clientExclusiveAccess',
  'clientPrivatePassword',
  'allowClientsMarkPrivate',
  'language',
  'tags',
  'clientOnlySets',
  'image',
  'thumbnail',
  'previewImages',
  'isFolder',
  'isLocked',
  'starred',
  'isStarred',
  'badge',
  'icon',
  'mediaSets',
  'presetId',
  'watermarkId',
]

const hasDownloadSettings = computed(() => {
  if (!collection.value) return false
  return (
    collection.value.downloadEnabled !== undefined ||
    collection.value.photoDownload !== undefined ||
    collection.value.highResolutionEnabled !== undefined ||
    collection.value.highResolutionSize ||
    collection.value.webSizeEnabled !== undefined ||
    collection.value.webSize ||
    collection.value.downloadPinEnabled !== undefined ||
    collection.value.downloadPin
  )
})

const hasSharingSettings = computed(() => {
  if (!collection.value) return false
  return (
    collection.value.socialSharing !== undefined ||
    collection.value.emailRegistration !== undefined ||
    collection.value.showOnHomepage !== undefined ||
    collection.value.clientExclusiveAccess !== undefined ||
    collection.value.clientPrivatePassword ||
    collection.value.allowClientsMarkPrivate !== undefined
  )
})

const hasDisplaySettings = computed(() => {
  if (!collection.value) return false
  return (
    collection.value.galleryAssist !== undefined ||
    collection.value.slideshow !== undefined ||
    collection.value.language
  )
})

const hasTagsOrSets = computed(() => {
  if (!collection.value) return false
  return (
    (collection.value.tags && collection.value.tags.length > 0) ||
    (collection.value.clientOnlySets && collection.value.clientOnlySets.length > 0)
  )
})

const hasAdditionalFields = computed(() => {
  if (!collection.value) return false
  return Object.keys(collection.value).some(
    key =>
      !excludedKeys.includes(key) &&
      collection.value[key] !== null &&
      collection.value[key] !== undefined
  )
})

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const loadData = async () => {
  if (!props.collectionId) return

  isLoading.value = true
  try {
    const collections = galleryStore.collections
    const collectionData = collections.find(c => c.id === props.collectionId)

    if (collectionData) {
      collection.value = collectionData

      if (collectionData.projectId) {
        try {
          const projectData = await projectStore.fetchProject(collectionData.projectId)
          project.value = projectData
        } catch (err) {}
      }
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const formatKey = key => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const handleViewCollection = () => {
  if (!collection.value) return
  router.push({
    name: 'collectionPhotos',
    params: { id: collection.value.id },
  })
  isOpen.value = false
}

const handleEdit = () => {
  emit('edit', collection.value)
  isOpen.value = false
}

watch(
  () => props.collectionId,
  () => {
    if (props.collectionId && isOpen.value) {
      loadData()
    }
  },
  { immediate: true }
)

watch(isOpen, newVal => {
  if (newVal && props.collectionId) {
    loadData()
  }
})
</script>
