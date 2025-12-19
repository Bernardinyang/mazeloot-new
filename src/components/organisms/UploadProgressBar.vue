<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[600px]"
    title="UPLOADING FILES"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <!-- Overall Progress -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <p :class="theme.textSecondary" class="text-sm font-medium">Overall Progress</p>
          <p :class="theme.textSecondary" class="text-sm">{{ overallProgress }}%</p>
        </div>
        <div :class="[theme.bgInput, 'h-2 rounded-full overflow-hidden']">
          <div
            :class="['h-full bg-teal-500 transition-all duration-300']"
            :style="{ width: `${overallProgress}%` }"
          />
        </div>
      </div>

      <!-- File List -->
      <div class="space-y-3 max-h-[400px] overflow-y-auto">
        <div
          v-for="(progress, fileId) in props.uploadProgress"
          :key="fileId"
          :class="[theme.bgInput, theme.borderSecondary]"
          class="p-3 rounded-lg border"
        >
          <div class="space-y-2">
            <!-- File Name and Status -->
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <p :class="theme.textPrimary" class="text-sm font-medium truncate">
                  {{ progress.file.name }}
                </p>
                <p :class="theme.textTertiary" class="text-xs mt-1">
                  {{ formatFileSize(progress.file.size) }}
                </p>
              </div>
              <div class="flex items-center gap-2 ml-4">
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
              :class="[theme.bgInput, 'h-1.5 rounded-full overflow-hidden']"
            >
              <div
                :class="[
                  progress.status === 'failed' ? 'bg-red-500' : 'bg-teal-500',
                  'h-full transition-all duration-300',
                ]"
                :style="{ width: `${progress.percentage || 0}%` }"
              />
            </div>

            <!-- Error Message -->
            <p v-if="progress.error" :class="theme.textError" class="text-xs mt-1">
              {{ progress.error }}
            </p>

            <!-- Retry Button -->
            <Button
              v-if="
                progress.status === 'failed' && props.uploadErrors.find(e => e.fileId === fileId)
              "
              :disabled="props.isUploading"
              class="mt-2"
              size="sm"
              variant="outline"
              @click="handleRetry(fileId)"
            >
              <RefreshCw class="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div
        v-if="!props.isUploading && Object.keys(props.uploadProgress).length > 0"
        :class="[theme.borderSecondary, theme.bgInput]"
        class="pt-3 border-t"
      >
        <div class="flex items-center justify-between text-sm">
          <span :class="theme.textSecondary">Completed:</span>
          <span :class="theme.textPrimary" class="font-medium">
            {{ completedCount }} / {{ totalCount }}
          </span>
        </div>
        <div v-if="failedCount > 0" class="flex items-center justify-between text-sm mt-1">
          <span :class="theme.textError">Failed:</span>
          <span :class="theme.textError" class="font-medium">{{ failedCount }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        v-if="props.isUploading"
        cancel-label="Cancel"
        confirm-label=""
        @cancel="emit('cancel')"
      />
      <ActionButtonGroup v-else cancel-label="Close" confirm-label="" @cancel="emit('close')" />
    </template>
  </CenterModal>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle2, Loader2, RefreshCw, XCircle } from 'lucide-vue-next'
import CenterModal from '@/components/molecules/CenterModal.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  uploadProgress: { type: Object, required: true }, // { fileId: { file, loaded, total, percentage, status, error } }
  overallProgress: { type: Number, default: 0 },
  uploadErrors: { type: Array, default: () => [] }, // Array of { file, fileId, error, retry }
  isUploading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'cancel', 'close', 'retry'])

const completedCount = computed(() => {
  return Object.values(props.uploadProgress).filter(p => p.status === 'completed').length
})

const failedCount = computed(() => {
  return Object.values(props.uploadProgress).filter(p => p.status === 'failed').length
})

const totalCount = computed(() => {
  return Object.keys(props.uploadProgress).length
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

const handleRetry = fileId => {
  const error = props.uploadErrors.find(e => e.fileId === fileId)
  if (error && error.retry) {
    emit('retry', fileId, error.retry)
  }
}
</script>
