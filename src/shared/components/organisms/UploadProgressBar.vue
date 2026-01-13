<template>
  <CenterModal
    :model-value="props.modelValue"
    content-class="sm:max-w-[700px]"
    :title="modalTitle"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-5 py-4">
      <!-- Overall Progress Card -->
      <div
        :class="[theme.bgCard, theme.borderCard, 'rounded-xl border p-4 shadow-sm transition-all']"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                :class="[
                  props.isUploading
                    ? 'bg-accent/10 text-accent'
                    : failedCount > 0
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-green-500/10 text-green-500',
                  'p-2 rounded-lg',
                ]"
              >
                <Loader2 v-if="props.isUploading" class="h-5 w-5 animate-spin" />
                <CheckCircle2 v-else-if="failedCount === 0" class="h-5 w-5" />
                <XCircle v-else class="h-5 w-5" />
              </div>
              <div>
                <p :class="theme.textPrimary" class="text-sm font-semibold">
                  {{ overallProgressText }}
                </p>
                <p :class="theme.textTertiary" class="text-xs">
                  {{ statusSummary }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p :class="theme.textPrimary" class="text-lg font-bold">{{ overallProgress }}%</p>
              <p :class="theme.textTertiary" class="text-xs">
                {{ completedCount }} / {{ totalCount }} files
              </p>
            </div>
          </div>
          <!-- Progress Bar -->
          <div :class="[theme.bgInput, 'h-3 rounded-full overflow-hidden relative']">
            <div
              :class="[
                props.isUploading ? 'bg-accent' : failedCount > 0 ? 'bg-red-500' : 'bg-green-500',
                'h-full transition-all duration-500 ease-out relative',
              ]"
              :style="{ width: `${overallProgress}%` }"
            >
              <div v-if="props.isUploading" class="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <!-- File List with Grouping -->
      <div class="space-y-4">
        <!-- Uploading Files -->
        <div v-if="uploadingFiles.length > 0" class="space-y-2">
          <h3 :class="theme.textSecondary" class="text-xs font-semibold uppercase tracking-wide">
            Uploading ({{ uploadingFiles.length }})
          </h3>
          <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            <FileProgressItem
              v-for="[fileId, progress] in uploadingFiles"
              :key="fileId"
              :file-id="fileId"
              :progress="progress"
              :upload-errors="props.uploadErrors"
              :is-uploading="props.isUploading"
              @retry="handleRetry"
            />
          </div>
        </div>

        <!-- Failed Files -->
        <div v-if="failedFiles.length > 0" class="space-y-2">
          <div class="flex items-center justify-between">
            <h3 :class="theme.textError" class="text-xs font-semibold uppercase tracking-wide">
              Failed ({{ failedFiles.length }})
            </h3>
            <Button
              v-if="failedFiles.length > 1 && !props.isUploading"
              size="sm"
              variant="outline"
              class="text-xs"
              @click="handleRetryAll"
            >
              <RefreshCw class="h-3 w-3 mr-1" />
              Retry All
            </Button>
          </div>
          <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            <FileProgressItem
              v-for="[fileId, progress] in failedFiles"
              :key="fileId"
              :file-id="fileId"
              :progress="progress"
              :upload-errors="props.uploadErrors"
              :is-uploading="props.isUploading"
              @retry="handleRetry"
            />
          </div>
        </div>

        <!-- Completed Files (Collapsible) -->
        <div v-if="completedFiles.length > 0" class="space-y-2">
          <button
            :class="[
              theme.bgInput,
              theme.borderSecondary,
              theme.textSecondary,
              'flex items-center justify-between w-full p-2 rounded-lg border text-xs font-semibold uppercase tracking-wide hover:opacity-80 transition-opacity',
            ]"
            @click="showCompleted = !showCompleted"
          >
            <span>Completed ({{ completedFiles.length }})</span>
            <ChevronDown
              :class="['h-4 w-4 transition-transform', showCompleted ? 'rotate-180' : '']"
            />
          </button>
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[500px]"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 max-h-[500px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="showCompleted" class="space-y-2 overflow-hidden">
              <FileProgressItem
                v-for="[fileId, progress] in completedFiles"
                :key="fileId"
                :file-id="fileId"
                :progress="progress"
                :upload-errors="props.uploadErrors"
                :is-uploading="props.isUploading"
                @retry="handleRetry"
              />
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <template #footer>
      <ActionButtonGroup
        v-if="props.isUploading"
        cancel-label="Cancel Upload"
        confirm-label=""
        cancel-variant="destructive"
        @cancel="emit('cancel')"
      />
      <ActionButtonGroup v-else cancel-label="Close" confirm-label="" @cancel="emit('close')" />
    </template>
  </CenterModal>
</template>

<script setup>
import { computed, ref, Transition } from 'vue'
import { CheckCircle2, Loader2, RefreshCw, XCircle, ChevronDown } from 'lucide-vue-next'
import CenterModal from '@/shared/components/molecules/CenterModal.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import FileProgressItem from './FileProgressItem.vue'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  uploadProgress: { type: Object, required: true }, // { fileId: { file, loaded, total, percentage, status, error } }
  overallProgress: { type: Number, default: 0 },
  uploadErrors: { type: Array, default: () => [] }, // Array of { file, fileId, error, retry }
  isUploading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'cancel', 'close', 'retry'])

const showCompleted = ref(false)

const completedCount = computed(() => {
  return Object.values(props.uploadProgress).filter(p => p.status === 'completed').length
})

const failedCount = computed(() => {
  return Object.values(props.uploadProgress).filter(p => p.status === 'failed').length
})

const totalCount = computed(() => {
  return Object.keys(props.uploadProgress).length
})

const uploadingCount = computed(() => {
  return Object.values(props.uploadProgress).filter(
    p => p.status === 'uploading' || p.status === 'processing' || p.status === 'pending'
  ).length
})

const modalTitle = computed(() => {
  if (props.isUploading) {
    return 'UPLOADING FILES'
  }
  if (failedCount.value > 0) {
    return 'UPLOAD COMPLETE (WITH ERRORS)'
  }
  return 'UPLOAD COMPLETE'
})

const overallProgressText = computed(() => {
  if (props.isUploading) {
    return 'Uploading files...'
  }
  if (failedCount.value > 0) {
    return 'Upload completed with errors'
  }
  return 'All files uploaded successfully'
})

const statusSummary = computed(() => {
  if (props.isUploading) {
    return `${uploadingCount.value} file${uploadingCount.value !== 1 ? 's' : ''} uploading`
  }
  if (failedCount.value > 0) {
    return `${completedCount.value} succeeded, ${failedCount.value} failed`
  }
  return 'All files uploaded successfully'
})

// Group files by status
const uploadingFiles = computed(() => {
  return Object.entries(props.uploadProgress).filter(
    ([, progress]) =>
      progress.status === 'uploading' ||
      progress.status === 'processing' ||
      progress.status === 'pending'
  )
})

const failedFiles = computed(() => {
  return Object.entries(props.uploadProgress).filter(([, progress]) => progress.status === 'failed')
})

const completedFiles = computed(() => {
  return Object.entries(props.uploadProgress).filter(
    ([, progress]) => progress.status === 'completed'
  )
})

const handleRetry = fileId => {
  const error = props.uploadErrors.find(e => e.fileId === fileId)
  if (error && error.retry) {
    emit('retry', fileId, error.retry)
  }
}

const handleRetryAll = () => {
  failedFiles.value.forEach(([fileId]) => {
    handleRetry(fileId)
  })
}
</script>
