<template>
  <SidebarModal
    v-model="isOpen"
    title="Folder Details"
    :description="folder?.name || folder?.title || 'Folder information'"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <!-- Content -->
    <div v-else-if="folder" class="space-y-6">
      <!-- Basic Information Section -->
      <DetailSection title="Basic Information">
        <DetailField label="ID" :value="folder.id" format="mono" />
        <DetailField label="Name" :value="folder.name || folder.title" />
        <DetailField v-if="folder.description" label="Description" :value="folder.description" />
        <DetailField v-if="folder.status" label="Status">
          <StatusBadge :status="folder.status" />
        </DetailField>
        <DetailField
          v-if="folder.parentId"
          label="Parent ID"
          :value="folder.parentId"
          format="mono"
        />
        <DetailField
          v-if="folder.itemCount !== undefined"
          label="Collection Count"
          :value="`${folder.itemCount} ${folder.itemCount === 1 ? 'collection' : 'collections'}`"
        />
        <DetailField v-if="folder.category" label="Category" :value="folder.category" />
      </DetailSection>

      <!-- Preview Images Section -->
      <DetailSection
        v-if="folder.previewImages && folder.previewImages.length > 0"
        title="Preview Images"
        container-class="pt-4 border-t"
      >
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="(image, index) in folder.previewImages.slice(0, 4)"
            :key="index"
            class="aspect-square rounded-lg overflow-hidden border"
            :class="[theme.bgCardSolid, theme.borderSecondary]"
          >
            <img
              :src="image"
              :alt="`Preview ${index + 1}`"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
        </div>
        <p v-if="folder.previewImages.length > 4" :class="['text-xs mt-2', theme.textSecondary]">
          +{{ folder.previewImages.length - 4 }} more images
        </p>
      </DetailSection>

      <!-- Timeline Section -->
      <DetailSection title="Timeline" container-class="pt-4 border-t">
        <DetailField label="Created At" :value="folder.createdAt || folder.date" format="date" />
        <DetailField
          v-if="folder.updatedAt"
          label="Updated At"
          :value="folder.updatedAt"
          format="date"
        />
        <DetailField
          v-if="folder.expiryDate"
          label="Expiry Date"
          :value="folder.expiryDate"
          format="date"
        />
      </DetailSection>

      <!-- Properties Section -->
      <DetailSection title="Properties" container-class="pt-4 border-t">
        <div class="grid grid-cols-2 gap-3">
          <div :class="['p-3 rounded-lg text-center', theme.bgCardSolid]">
            <div :class="['text-sm font-medium', theme.textSecondary]">Locked</div>
            <div
              :class="[
                'text-lg font-bold mt-1',
                folder.isLocked
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400',
              ]"
            >
              {{ folder.isLocked ? 'Yes' : 'No' }}
            </div>
          </div>
          <div :class="['p-3 rounded-lg text-center', theme.bgCardSolid]">
            <div :class="['text-sm font-medium', theme.textSecondary]">Starred</div>
            <div
              :class="[
                'text-lg font-bold mt-1',
                folder.isStarred || folder.starred
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : theme.textPrimary,
              ]"
            >
              {{ folder.isStarred || folder.starred ? 'Yes' : 'No' }}
            </div>
          </div>
        </div>
      </DetailSection>

      <!-- Additional Properties Section -->
      <DetailSection
        v-if="hasAdditionalFields"
        title="Additional Properties"
        container-class="pt-4 border-t"
      >
        <div class="space-y-2">
          <div
            v-for="(value, key) in folder"
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
            class="w-full bg-teal-500 hover:bg-teal-600 text-white"
            @click="handleViewFolder"
          >
            <Eye class="h-4 w-4 mr-2" />
            View Folder
          </Button>
          <Button
            variant="outline"
            class="w-full"
            :class="[theme.borderSecondary, theme.textPrimary]"
            @click="handleEdit"
          >
            <Pencil class="h-4 w-4 mr-2" />
            Edit Folder
          </Button>
        </ActionButtonGroup>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle class="h-12 w-12 mb-4" :class="theme.textTertiary" />
      <p :class="['text-sm font-medium', theme.textPrimary]">Folder not found</p>
      <p :class="['text-xs mt-1', theme.textSecondary]">
        The folder you're looking for doesn't exist or has been deleted.
      </p>
    </div>
  </SidebarModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, Eye, Pencil, AlertCircle } from 'lucide-vue-next'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import DetailSection from '@/components/molecules/DetailSection.vue'
import DetailField from '@/components/molecules/DetailField.vue'
import StatusBadge from '@/components/molecules/StatusBadge.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useGalleryStore } from '@/stores/gallery'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  folderId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'edit'])

const theme = useThemeClasses()
const router = useRouter()
const galleryStore = useGalleryStore()

const folder = ref(null)
const isLoading = ref(false)

const excludedKeys = [
  'id',
  'name',
  'title',
  'description',
  'status',
  'parentId',
  'itemCount',
  'createdAt',
  'updatedAt',
  'date',
  'category',
  'expiryDate',
  'isLocked',
  'isStarred',
  'starred',
  'previewImages',
  'isFolder',
  'image',
  'thumbnail',
]

const hasAdditionalFields = computed(() => {
  if (!folder.value) return false
  return Object.keys(folder.value).some(
    key =>
      !excludedKeys.includes(key) && folder.value[key] !== null && folder.value[key] !== undefined
  )
})

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const loadData = async () => {
  if (!props.folderId) return

  isLoading.value = true
  try {
    const collections = galleryStore.collections
    const folderData = collections.find(c => c.id === props.folderId && c.isFolder)

    if (folderData) {
      folder.value = folderData
    }
  } catch (error) {
    console.error('Failed to load folder:', error)
  } finally {
    isLoading.value = false
  }
}

const handleImageError = event => {
  event.target.style.display = 'none'
}

const formatKey = key => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const handleViewFolder = () => {
  // TODO: Navigate to folder view
  console.log('View folder:', folder.value?.id)
  isOpen.value = false
}

const handleEdit = () => {
  emit('edit', folder.value)
  isOpen.value = false
}

watch(
  () => props.folderId,
  () => {
    if (props.folderId && isOpen.value) {
      loadData()
    }
  },
  { immediate: true }
)

watch(isOpen, newVal => {
  if (newVal && props.folderId) {
    loadData()
  }
})
</script>
