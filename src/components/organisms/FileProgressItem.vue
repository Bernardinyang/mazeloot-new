<template>
  <div
    :class="[
      theme.bgInput,
      theme.borderSecondary,
      'rounded-lg border p-3 transition-all hover:shadow-sm',
      progress.status === 'failed' ? 'border-red-500/30 bg-red-500/5' : '',
      progress.status === 'completed' ? 'border-green-500/30 bg-green-500/5' : '',
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- File Icon/Thumbnail -->
      <div
        :class="[
          'flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden',
          isImage ? '' : theme.bgInput,
          'flex items-center justify-center',
        ]"
      >
        <img
          v-if="isImage && thumbnailUrl"
          :src="thumbnailUrl"
          :alt="progress.file.name"
          class="w-full h-full object-cover"
        />
        <FileImage v-else-if="isImage" :class="[theme.textSecondary, 'h-6 w-6']" />
        <FileVideo v-else :class="[theme.textSecondary, 'h-6 w-6']" />
      </div>

      <!-- File Info -->
      <div class="flex-1 min-w-0 space-y-2">
        <!-- File Name and Status -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p :class="theme.textPrimary" class="text-sm font-medium truncate">
                {{ progress.file.name }}
              </p>
              <span
                :class="[
                  isImage ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500',
                  'px-1.5 py-0.5 rounded text-xs font-medium',
                ]"
              >
                {{ isImage ? 'IMG' : 'VID' }}
              </span>
            </div>
            <div class="flex items-center gap-3 mt-1">
              <p :class="theme.textTertiary" class="text-xs">
                {{ formatFileSize(progress.file.size) }}
              </p>
              <span
                v-if="progress.status === 'uploading' && progress.percentage"
                :class="theme.textTertiary"
                class="text-xs"
              >
                {{ progress.percentage }}%
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <Loader2
              v-if="progress.status === 'uploading' || progress.status === 'processing'"
              class="h-4 w-4 animate-spin text-teal-500"
            />
            <CheckCircle2
              v-else-if="progress.status === 'completed'"
              class="h-4 w-4 text-green-500"
            />
            <XCircle v-else-if="progress.status === 'failed'" class="h-4 w-4 text-red-500" />
            <span
              :class="[
                progress.status === 'completed'
                  ? 'text-green-500'
                  : progress.status === 'failed'
                    ? 'text-red-500'
                    : theme.textSecondary,
                'text-xs font-medium',
              ]"
            >
              {{ getStatusLabel(progress.status) }}
            </span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div
          v-if="progress.status === 'uploading' || progress.status === 'processing'"
          :class="[theme.bgInput, 'h-2 rounded-full overflow-hidden relative']"
        >
          <div
            :class="[
              progress.status === 'failed' ? 'bg-red-500' : 'bg-teal-500',
              'h-full transition-all duration-300 ease-out relative',
            ]"
            :style="{ width: `${progress.percentage || 0}%` }"
          >
            <div class="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="progress.error"
          :class="[theme.bgError, theme.textError, 'rounded-md p-2 text-xs']"
        >
          <div class="flex items-start gap-2">
            <AlertCircle class="h-3 w-3 mt-0.5 flex-shrink-0" />
            <p class="flex-1">{{ progress.error }}</p>
          </div>
        </div>

        <!-- Retry Button -->
        <Button
          v-if="progress.status === 'failed' && uploadErrors.find(e => e.fileId === fileId)"
          :disabled="isUploading"
          size="sm"
          variant="outline"
          class="mt-1"
          @click="handleRetry"
        >
          <RefreshCw class="h-3 w-3 mr-1" />
          Retry
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  XCircle,
  FileImage,
  FileVideo,
  AlertCircle,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  fileId: { type: String, required: true },
  progress: { type: Object, required: true },
  uploadErrors: { type: Array, default: () => [] },
  isUploading: { type: Boolean, default: false },
})

const emit = defineEmits(['retry'])

const thumbnailUrl = ref(null)

const isImage = computed(() => {
  return props.progress.file?.type?.startsWith('image/') || false
})

watch(
  () => props.progress.file,
  file => {
    if (file && isImage.value) {
      // Create thumbnail for images
      if (file instanceof File) {
        // Clean up old URL if exists
        if (thumbnailUrl.value) {
          URL.revokeObjectURL(thumbnailUrl.value)
        }
        thumbnailUrl.value = URL.createObjectURL(file)
      }
    }
  },
  { immediate: true }
)

// Clean up thumbnail URL on unmount
onUnmounted(() => {
  if (thumbnailUrl.value) {
    URL.revokeObjectURL(thumbnailUrl.value)
  }
})

const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const getStatusLabel = status => {
  const labels = {
    pending: 'Pending',
    uploading: 'Uploading',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
  }
  return labels[status] || status
}

const handleRetry = () => {
  emit('retry', props.fileId)
}
</script>
