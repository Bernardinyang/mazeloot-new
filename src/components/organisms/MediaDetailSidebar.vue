<template>
  <SidebarModal
    v-model="isOpen"
    title="Media Details"
    :description="media?.title || media?.filename || 'Media information'"
  >
    <!-- Loading State -->
    <div v-if="!media" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
    </div>

    <!-- Content -->
    <div v-else-if="media" class="space-y-6">
      <!-- Media Preview Section -->
      <div v-if="media.thumbnail || media.url" class="w-full">
        <div
          class="aspect-video rounded-lg overflow-hidden border"
          :class="[theme.bgCardSolid, theme.borderSecondary]"
        >
          <img
            v-if="media.thumbnail || media.url"
            :src="media.thumbnail || media.url"
            :alt="media.title || media.filename || 'Media preview'"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Basic Information Section -->
      <DetailSection title="Basic Information">
        <DetailField label="ID" :value="media.id" format="mono" />
        <DetailField
          label="Title / Filename"
          :value="media.title || media.filename || 'Untitled'"
        />
        <DetailField v-if="media.description" label="Description" :value="media.description" />
        <DetailField
          v-if="media.type || media.mimeType"
          label="Type"
          :value="media.type || media.mimeType"
        />
        <DetailField v-if="media.size" label="Size" :value="formatFileSize(media.size)" />
        <DetailField
          v-if="media.width && media.height"
          label="Dimensions"
          :value="`${media.width} × ${media.height} px`"
        />
      </DetailSection>

      <!-- Relationships Section -->
      <DetailSection v-if="hasRelationships" title="Relationships" container-class="pt-4 border-t">
        <DetailField
          v-if="media.collectionId"
          label="Collection ID"
          :value="media.collectionId"
          format="mono"
        />
        <DetailField
          v-if="media.projectId"
          label="Project ID"
          :value="media.projectId"
          format="mono"
        />
        <DetailField v-if="media.phase" label="Phase" :value="media.phase" />
        <DetailField v-if="media.phaseId" label="Phase ID" :value="media.phaseId" format="mono" />
      </DetailSection>

      <!-- Status Section -->
      <DetailSection v-if="hasStatus" title="Status" container-class="pt-4 border-t">
        <div class="grid grid-cols-2 gap-3">
          <div
            v-if="media.isSelected !== undefined"
            :class="['p-3 rounded-lg text-center', theme.bgCardSolid]"
          >
            <div :class="['text-sm font-medium', theme.textSecondary]">Selected</div>
            <div
              :class="[
                'text-lg font-bold mt-1',
                media.isSelected ? 'text-green-600 dark:text-green-400' : theme.textPrimary,
              ]"
            >
              {{ media.isSelected ? 'Yes' : 'No' }}
            </div>
          </div>
          <div
            v-if="media.isCompleted !== undefined"
            :class="['p-3 rounded-lg text-center', theme.bgCardSolid]"
          >
            <div :class="['text-sm font-medium', theme.textSecondary]">Completed</div>
            <div
              :class="[
                'text-lg font-bold mt-1',
                media.isCompleted ? 'text-green-600 dark:text-green-400' : theme.textPrimary,
              ]"
            >
              {{ media.isCompleted ? 'Yes' : 'No' }}
            </div>
          </div>
        </div>
        <DetailField
          v-if="media.revisionNumber"
          label="Revision Number"
          :value="media.revisionNumber"
          format="number"
        />
      </DetailSection>

      <!-- URLs Section -->
      <DetailSection v-if="hasUrls" title="URLs" container-class="pt-4 border-t">
        <DetailField v-if="media.url" label="URL" :value="media.url" />
        <DetailField v-if="media.thumbnail" label="Thumbnail URL" :value="media.thumbnail" />
        <DetailField v-if="media.originalUrl" label="Original URL" :value="media.originalUrl" />
        <DetailField
          v-if="media.lowResCopyUrl"
          label="Low-Res Copy URL"
          :value="media.lowResCopyUrl"
        />
      </DetailSection>

      <!-- Timeline Section -->
      <DetailSection title="Timeline" container-class="pt-4 border-t">
        <DetailField label="Created At" :value="media.createdAt" format="date" />
        <DetailField
          v-if="media.updatedAt"
          label="Updated At"
          :value="media.updatedAt"
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
            v-for="(value, key) in media"
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
            @click="handleViewMedia"
          >
            <Eye class="h-4 w-4 mr-2" />
            View Media
          </Button>
          <Button
            variant="outline"
            class="w-full"
            :class="[theme.borderSecondary, theme.textPrimary]"
            @click="handleDownload"
          >
            <Download class="h-4 w-4 mr-2" />
            Download
          </Button>
        </ActionButtonGroup>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle class="h-12 w-12 mb-4" :class="theme.textTertiary" />
      <p :class="['text-sm font-medium', theme.textPrimary]">Media not found</p>
      <p :class="['text-xs mt-1', theme.textSecondary]">
        The media you're looking for doesn't exist or has been deleted.
      </p>
    </div>
  </SidebarModal>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2, Eye, Download, AlertCircle } from 'lucide-vue-next'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import DetailSection from '@/components/molecules/DetailSection.vue'
import DetailField from '@/components/molecules/DetailField.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  media: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'view', 'download'])

const theme = useThemeClasses()

const excludedKeys = [
  'id',
  'title',
  'filename',
  'description',
  'type',
  'mimeType',
  'size',
  'width',
  'height',
  'collectionId',
  'projectId',
  'phase',
  'phaseId',
  'isSelected',
  'isCompleted',
  'revisionNumber',
  'createdAt',
  'updatedAt',
  'url',
  'thumbnail',
  'originalUrl',
  'lowResCopyUrl',
]

const hasRelationships = computed(() => {
  if (!props.media) return false
  return (
    props.media.collectionId || props.media.projectId || props.media.phase || props.media.phaseId
  )
})

const hasStatus = computed(() => {
  if (!props.media) return false
  return (
    props.media.isSelected !== undefined ||
    props.media.isCompleted !== undefined ||
    props.media.revisionNumber
  )
})

const hasUrls = computed(() => {
  if (!props.media) return false
  return (
    props.media.url || props.media.thumbnail || props.media.originalUrl || props.media.lowResCopyUrl
  )
})

const hasAdditionalFields = computed(() => {
  if (!props.media) return false
  return Object.keys(props.media).some(
    key =>
      !excludedKeys.includes(key) && props.media[key] !== null && props.media[key] !== undefined
  )
})

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const formatFileSize = bytes => {
  if (!bytes) return 'N/A'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatKey = key => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const handleImageError = event => {
  event.target.style.display = 'none'
}

const handleViewMedia = () => {
  emit('view', props.media)
  isOpen.value = false
}

const handleDownload = () => {
  emit('download', props.media)
  isOpen.value = false
}
</script>
