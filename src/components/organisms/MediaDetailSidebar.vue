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
      <!-- Media Preview Section - Enhanced -->
      <div v-if="mediaPreviewUrl" class="w-full group">
        <div
          class="relative aspect-video rounded-xl overflow-hidden border-2 shadow-lg transition-all duration-300 hover:shadow-xl"
          :class="[theme.bgCardSolid, theme.borderSecondary, isImageLoading ? 'animate-pulse' : '']"
        >
          <img
            v-if="mediaPreviewUrl"
            :src="mediaPreviewUrl"
            :alt="media.title || media.filename || 'Media preview'"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            @error="handleImageError"
            @load="isImageLoading = false"
            @click="handleViewMedia"
          />
          <!-- Click to view overlay -->
          <div
            class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
            @click="handleViewMedia"
          >
            <div
              class="px-4 py-2 rounded-lg bg-black/70 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-2"
            >
              <Eye class="h-4 w-4" />
              Click to view full size
            </div>
          </div>
          <!-- Loading indicator -->
          <div
            v-if="isImageLoading"
            class="absolute inset-0 flex items-center justify-center"
            :class="theme.bgCardSolid"
          >
            <Loader2 class="h-6 w-6 animate-spin" :class="theme.textSecondary" />
          </div>
          <!-- Error state -->
          <div
            v-if="imageError"
            class="absolute inset-0 flex flex-col items-center justify-center p-4"
            :class="theme.bgCardSolid"
          >
            <AlertCircle class="h-8 w-8 mb-2" :class="theme.textTertiary" />
            <p :class="['text-sm', theme.textSecondary]">Failed to load image</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions Bar -->
      <div class="flex gap-2">
        <Button
          variant="default"
          size="sm"
          class="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
          @click="handleViewMedia"
        >
          <Eye class="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          class="flex-1"
          :class="[theme.borderSecondary, theme.textPrimary]"
          @click="handleDownload"
        >
          <Download class="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button
          v-if="media.id"
          variant="ghost"
          size="sm"
          class="px-3"
          :class="theme.textSecondary"
          @click="copyToClipboard(media.id, 'ID')"
          title="Copy ID"
        >
          <Copy class="h-4 w-4" />
        </Button>
      </div>

      <!-- Basic Information Section -->
      <DetailSection title="Basic Information">
        <DetailField label="Title / Filename">
          <div class="flex items-center gap-2">
            <span :class="theme.textPrimary">{{
              media.title || media.filename || 'Untitled'
            }}</span>
            <button
              v-if="media.title || media.filename"
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="theme.textSecondary"
              @click="copyToClipboard(media.title || media.filename, 'Filename')"
              title="Copy filename"
            >
              <Copy class="h-3.5 w-3.5" />
            </button>
          </div>
        </DetailField>
        <DetailField v-if="media.description" label="Description">
          <p :class="theme.textPrimary" class="text-sm leading-relaxed">{{ media.description }}</p>
        </DetailField>
        <div class="grid grid-cols-2 gap-3">
          <DetailField
            v-if="media.type || media.mimeType"
            label="Type"
            :value="media.type || media.mimeType"
          />
          <DetailField v-if="media.size" label="Size" :value="formatFileSize(media.size)" />
        </div>
        <DetailField
          v-if="media.width && media.height"
          label="Dimensions"
          :value="`${media.width} × ${media.height} px`"
        />
        <DetailField label="ID" format="mono">
          <div class="flex items-center gap-2">
            <code
              :class="[
                'text-xs px-2 py-1 rounded',
                theme.bgCardSolid,
                theme.textPrimary,
                'font-mono',
              ]"
            >
              {{ media.id }}
            </code>
            <button
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="theme.textSecondary"
              @click="copyToClipboard(media.id, 'ID')"
              title="Copy ID"
            >
              <Copy class="h-3.5 w-3.5" />
            </button>
          </div>
        </DetailField>
      </DetailSection>

      <!-- Status Section - Enhanced with Badges -->
      <DetailSection v-if="hasStatus" title="Status" container-class="pt-4 border-t">
        <div class="grid grid-cols-2 gap-3">
          <div
            v-if="media.isSelected !== undefined"
            :class="[
              'p-4 rounded-lg border-2 transition-all duration-200',
              media.isSelected
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : theme.bgCardSolid + ' ' + theme.borderSecondary,
            ]"
          >
            <div class="flex items-center gap-2 mb-2">
              <div
                :class="['w-2 h-2 rounded-full', media.isSelected ? 'bg-green-500' : 'bg-gray-400']"
              ></div>
              <div :class="['text-xs font-medium uppercase tracking-wide', theme.textSecondary]">
                Selected
              </div>
            </div>
            <div
              :class="[
                'text-lg font-bold',
                media.isSelected ? 'text-green-600 dark:text-green-400' : theme.textPrimary,
              ]"
            >
              {{ media.isSelected ? 'Yes' : 'No' }}
            </div>
          </div>
          <div
            v-if="media.isCompleted !== undefined"
            :class="[
              'p-4 rounded-lg border-2 transition-all duration-200',
              media.isCompleted
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : theme.bgCardSolid + ' ' + theme.borderSecondary,
            ]"
          >
            <div class="flex items-center gap-2 mb-2">
              <div
                :class="[
                  'w-2 h-2 rounded-full',
                  media.isCompleted ? 'bg-green-500' : 'bg-gray-400',
                ]"
              ></div>
              <div :class="['text-xs font-medium uppercase tracking-wide', theme.textSecondary]">
                Completed
              </div>
            </div>
            <div
              :class="[
                'text-lg font-bold',
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

      <!-- Relationships Section - Enhanced -->
      <DetailSection v-if="hasRelationships" title="Relationships" container-class="pt-4 border-t">
        <DetailField v-if="media.collectionId" label="Collection ID" format="mono">
          <div class="flex items-center gap-2">
            <code
              :class="[
                'text-xs px-2 py-1 rounded',
                theme.bgCardSolid,
                theme.textPrimary,
                'font-mono',
              ]"
            >
              {{ media.collectionId }}
            </code>
            <button
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="theme.textSecondary"
              @click="copyToClipboard(media.collectionId, 'Collection ID')"
              title="Copy Collection ID"
            >
              <Copy class="h-3.5 w-3.5" />
            </button>
          </div>
        </DetailField>
        <DetailField v-if="media.projectId" label="Project ID" format="mono">
          <div class="flex items-center gap-2">
            <code
              :class="[
                'text-xs px-2 py-1 rounded',
                theme.bgCardSolid,
                theme.textPrimary,
                'font-mono',
              ]"
            >
              {{ media.projectId }}
            </code>
            <button
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="theme.textSecondary"
              @click="copyToClipboard(media.projectId, 'Project ID')"
              title="Copy Project ID"
            >
              <Copy class="h-3.5 w-3.5" />
            </button>
          </div>
        </DetailField>
        <DetailField v-if="media.phase" label="Phase" :value="media.phase" />
        <DetailField v-if="media.phaseId" label="Phase ID" format="mono">
          <div class="flex items-center gap-2">
            <code
              :class="[
                'text-xs px-2 py-1 rounded',
                theme.bgCardSolid,
                theme.textPrimary,
                'font-mono',
              ]"
            >
              {{ media.phaseId }}
            </code>
            <button
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              :class="theme.textSecondary"
              @click="copyToClipboard(media.phaseId, 'Phase ID')"
              title="Copy Phase ID"
            >
              <Copy class="h-3.5 w-3.5" />
            </button>
          </div>
        </DetailField>
      </DetailSection>

      <!-- URLs Section - Enhanced with Copy Buttons -->
      <DetailSection v-if="hasUrls" title="URLs" container-class="pt-4 border-t">
        <div class="space-y-3">
          <div v-if="media.largeImageUrl" class="space-y-1">
            <label :class="['text-xs font-medium', theme.textSecondary]">Large Image URL</label>
            <div class="flex items-center gap-2">
              <input
                :value="media.largeImageUrl"
                readonly
                :class="[
                  'flex-1 text-xs px-3 py-2 rounded border',
                  theme.bgCardSolid,
                  theme.borderSecondary,
                  theme.textPrimary,
                  'font-mono truncate',
                ]"
              />
              <button
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="theme.textSecondary"
                @click="copyToClipboard(media.largeImageUrl, 'Large Image URL')"
                title="Copy URL"
              >
                <Copy class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div v-if="media.thumbnailUrl" class="space-y-1">
            <label :class="['text-xs font-medium', theme.textSecondary]">Thumbnail URL</label>
            <div class="flex items-center gap-2">
              <input
                :value="media.thumbnailUrl"
                readonly
                :class="[
                  'flex-1 text-xs px-3 py-2 rounded border',
                  theme.bgCardSolid,
                  theme.borderSecondary,
                  theme.textPrimary,
                  'font-mono truncate',
                ]"
              />
              <button
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="theme.textSecondary"
                @click="copyToClipboard(media.thumbnailUrl, 'Thumbnail URL')"
                title="Copy URL"
              >
                <Copy class="h-4 w-4" />
              </button>
            </div>
          </div>
          <div v-if="media.file?.url" class="space-y-1">
            <label :class="['text-xs font-medium', theme.textSecondary]">File URL</label>
            <div class="flex items-center gap-2">
              <input
                :value="media.file.url"
                readonly
                :class="[
                  'flex-1 text-xs px-3 py-2 rounded border',
                  theme.bgCardSolid,
                  theme.borderSecondary,
                  theme.textPrimary,
                  'font-mono truncate',
                ]"
              />
              <button
                class="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                :class="theme.textSecondary"
                @click="copyToClipboard(media.file.url, 'File URL')"
                title="Copy URL"
              >
                <Copy class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </DetailSection>

      <!-- Timeline Section -->
      <DetailSection title="Timeline" container-class="pt-4 border-t">
        <div class="space-y-2">
          <DetailField label="Created At" :value="formatDate(media.createdAt)" />
          <DetailField
            v-if="media.updatedAt && media.updatedAt !== media.createdAt"
            label="Updated At"
            :value="formatDate(media.updatedAt)"
          />
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
            v-for="(value, key) in media"
            :key="key"
            v-if="!excludedKeys.includes(key) && value !== null && value !== undefined"
            class="py-2 border-b last:border-b-0"
            :class="theme.borderSecondary"
          >
            <DetailField :label="formatKey(key)" :value="String(value)" layout="horizontal" />
          </div>
        </div>
      </DetailSection>
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
import { computed, ref } from 'vue'
import { Loader2, Eye, Download, AlertCircle, Copy, Check } from 'lucide-vue-next'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import DetailSection from '@/components/molecules/DetailSection.vue'
import DetailField from '@/components/molecules/DetailField.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { getMediaDisplayUrl, getMediaDisplayUrlSync } from '@/utils/media/getMediaDisplayUrl'
import { toast } from '@/utils/toast'
import { useSelectionsApi } from '@/api/selections'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  media: {
    type: Object,
    default: null,
  },
  placeholderImage: {
    type: String,
    default: '/placeholder-image.png',
  },
})

const emit = defineEmits(['update:modelValue', 'view', 'download'])

const theme = useThemeClasses()
const selectionsApi = useSelectionsApi()

const isImageLoading = ref(true)
const imageError = ref(false)
const mediaPreviewUrl = ref(null)

// Initialize preview URL
if (props.media) {
  const url =
    props.media.largeImageUrl ||
    props.media.thumbnailUrl ||
    props.media.file?.url ||
    props.media.url
  if (url) {
    if (url.startsWith('file://')) {
      // Convert file:// to blob URL
      mediaPreviewUrl.value = getMediaDisplayUrlSync(url, props.placeholderImage)
      getMediaDisplayUrl(url, props.placeholderImage).then(blobUrl => {
        if (blobUrl) mediaPreviewUrl.value = blobUrl
      })
    } else {
      mediaPreviewUrl.value = url
    }
  }
}

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
  'largeImageUrl',
  'thumbnailUrl',
  'file',
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
    props.media.largeImageUrl ||
    props.media.thumbnailUrl ||
    props.media.file?.url ||
    props.media.originalUrl ||
    props.media.lowResCopyUrl
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

const formatDate = dateString => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

const formatKey = key => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

const copyToClipboard = async (text, label = 'Text') => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  } catch (error) {
    toast.error('Failed to copy to clipboard')
  }
}

const handleImageError = event => {
  imageError.value = true
  isImageLoading.value = false
  event.target.style.display = 'none'
}

const handleViewMedia = () => {
  emit('view', props.media)
  isOpen.value = false
}

const handleDownload = async () => {
  if (!props.media?.id) {
    toast.error('Media not found', {
      description: 'Unable to download media. Please try again.',
    })
    return
  }

  try {
    toast.loading('Preparing download...', {
      id: 'download-media',
    })

    const { blob, filename } = await selectionsApi.downloadMedia(props.media.id)

    // Trigger browser download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.dismiss('download-media')
    toast.success('Download started', {
      description: `Downloading ${filename}`,
    })

    isOpen.value = false
  } catch (error) {
    toast.dismiss('download-media')
    toast.error('Download failed', {
      description: error.message || 'Unable to download media. Please try again.',
    })
  }
}
</script>
