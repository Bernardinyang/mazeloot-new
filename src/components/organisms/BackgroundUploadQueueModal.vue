<template>
  <CenterModal
    v-model="isOpen"
    title="UPLOAD QUEUE"
    content-class="sm:max-w-[800px]"
  >
    <div class="space-y-4 py-4">
      <!-- Network Status -->
      <div
        v-if="!isOnline"
        class="p-3 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center gap-2"
      >
        <AlertCircle class="h-4 w-4 text-red-500" />
        <p class="text-sm text-red-500">Offline - Uploads paused</p>
      </div>

      <!-- Quota Warning -->
      <div
        v-if="isQuotaHigh"
        class="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 flex items-center gap-2"
      >
        <AlertCircle class="h-4 w-4 text-yellow-500" />
        <p class="text-sm text-yellow-500">
          Storage quota high ({{ Math.round(quotaPercentage) }}%) - Cleanup old uploads
        </p>
      </div>

      <!-- Summary -->
      <div :class="[theme.bgCard, theme.borderCard, 'rounded-lg border p-4']">
        <div class="flex items-center justify-between">
          <div>
            <p :class="theme.textPrimary" class="text-sm font-semibold">
              {{ activeUploadCount }} uploading, {{ pausedUploadCount }} paused, {{ failedUploadCount }} failed
            </p>
            <p :class="theme.textSecondary" class="text-xs mt-1">
              Total: {{ uploadQueue.length }} files in queue
            </p>
          </div>
          <div class="flex items-center gap-2">
            <Button
              v-if="failedUploadCount > 0"
              size="sm"
              variant="outline"
              @click="handleRetryAllFailed"
            >
              Retry All Failed
            </Button>
            <Button
              v-if="activeUploadCount > 0"
              size="sm"
              variant="outline"
              @click="handlePauseAll"
            >
              Pause All
            </Button>
            <Button
              v-if="pausedUploadCount > 0 && isOnline"
              size="sm"
              variant="outline"
              @click="handleResumeAll"
            >
              Resume All
            </Button>
            <Button
              v-if="uploadQueue.length > 0"
              size="sm"
              variant="outline"
              class="text-red-500 border-red-500 hover:bg-red-500/10"
              @click="handleDeleteAll"
            >
              <Trash2 class="h-3 w-3 mr-1" />
              Delete All
            </Button>
          </div>
        </div>
      </div>

      <!-- File List -->
      <div class="space-y-2 max-h-[500px] overflow-y-auto">
        <div
          v-for="item in uploadQueue"
          :key="item.id"
          :class="[
            theme.bgInput,
            theme.borderSecondary,
            'rounded-lg border p-3',
            item.status === 'failed' ? 'border-red-500/30 bg-red-500/5' : '',
            item.status === 'completed' ? 'border-green-500/30 bg-green-500/5' : '',
          ]"
        >
          <div class="flex items-start gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <p :class="theme.textPrimary" class="text-sm font-medium truncate">
                    {{ item.filename }}
                  </p>
                  <p :class="theme.textTertiary" class="text-xs mt-1">
                    {{ formatFileSize(item.size) }}
                    <span v-if="item.progress.speed > 0">
                      · {{ formatSpeed(item.progress.speed) }}
                      <span v-if="item.progress.eta"> · {{ formatETA(item.progress.eta) }}</span>
                    </span>
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <Loader2
                    v-if="item.status === 'uploading'"
                    class="h-4 w-4 animate-spin text-accent"
                  />
                  <CheckCircle2
                    v-else-if="item.status === 'completed'"
                    class="h-4 w-4 text-green-500"
                  />
                  <XCircle v-else-if="item.status === 'failed'" class="h-4 w-4 text-red-500" />
                  <Pause v-else-if="item.status === 'paused'" class="h-4 w-4 text-yellow-500" />
                  <span
                    :class="[
                      item.status === 'completed'
                        ? 'text-green-500'
                        : item.status === 'failed'
                          ? 'text-red-500'
                          : item.status === 'paused'
                            ? 'text-yellow-500'
                            : theme.textSecondary,
                      'text-xs font-medium',
                    ]"
                  >
                    {{ item.status }}
                  </span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div
                v-if="item.status === 'uploading'"
                :class="[theme.bgInput, 'h-2 rounded-full overflow-hidden mt-2']"
              >
                <div
                  class="bg-accent h-full transition-all duration-300"
                  :style="{ width: `${item.progress.percentage || 0}%` }"
                />
              </div>

              <!-- Error Message -->
              <div
                v-if="item.error"
                :class="[theme.bgError, theme.textError, 'rounded-md p-2 text-xs mt-2']"
              >
                {{ item.error.message || item.error }}
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 mt-2">
                <!-- Pause: Only show for uploading -->
                <Button
                  v-if="item.status === 'uploading'"
                  size="sm"
                  variant="outline"
                  @click="handlePause(item.id)"
                >
                  <Pause class="h-3 w-3 mr-1" />
                  Pause
                </Button>

                <!-- Resume: Only show for paused -->
                <Button
                  v-if="item.status === 'paused' && isOnline"
                  size="sm"
                  variant="outline"
                  @click="handleResume(item.id)"
                >
                  <Play class="h-3 w-3 mr-1" />
                  Resume
                </Button>

                <!-- Retry: Show for failed or cancelled -->
                <Button
                  v-if="item.status === 'failed' || item.status === 'cancelled'"
                  size="sm"
                  variant="outline"
                  @click="handleRetry(item.id)"
                >
                  <RefreshCw class="h-3 w-3 mr-1" />
                  Retry
                </Button>

                <!-- Cancel: Show for uploading, paused, or pending (NOT completed or failed) -->
                <Button
                  v-if="item.status === 'uploading' || item.status === 'paused' || item.status === 'pending'"
                  size="sm"
                  variant="outline"
                  class="text-red-500 hover:text-red-600"
                  @click="handleCancel(item.id)"
                >
                  <X class="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="uploadQueue.length === 0" :class="theme.textSecondary" class="text-center py-8 text-sm">
          No uploads in queue
        </div>
      </div>
    </div>
  </CenterModal>
</template>

<script setup>
import { computed } from 'vue'
import { Loader2, CheckCircle2, XCircle, Pause, Play, RefreshCw, X, AlertCircle, Trash2 } from 'lucide-vue-next'
import CenterModal from '@/components/molecules/CenterModal.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useBackgroundUploadManager } from '@/composables/useBackgroundUploadManager'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
})

const emit = defineEmits(['update:modelValue'])

const backgroundUploadManager = useBackgroundUploadManager()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const uploadQueue = computed(() => backgroundUploadManager.uploadQueue.value || [])
const isOnline = computed(() => backgroundUploadManager.isOnline.value)
const isQuotaHigh = computed(() => backgroundUploadManager.isQuotaHigh.value)
const quotaPercentage = computed(() => backgroundUploadManager.quotaUsage.value?.percentage || 0)
const activeUploadCount = computed(() => backgroundUploadManager.activeUploadCount.value)
const pausedUploadCount = computed(() => backgroundUploadManager.pausedUploadCount.value)
const failedUploadCount = computed(() => backgroundUploadManager.failedUploadCount.value)

const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatSpeed = bytesPerSec => {
  return formatFileSize(bytesPerSec) + '/s'
}

const formatETA = seconds => {
  if (!seconds || seconds === Infinity) return ''
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`
  return `${Math.round(seconds / 3600)}h`
}

const handlePause = async id => {
  await backgroundUploadManager.pause(id)
}

const handleResume = async id => {
  await backgroundUploadManager.resume(id)
}

const handleRetry = async id => {
  await backgroundUploadManager.retry(id)
}

const handleCancel = async id => {
  if (confirm('Are you sure you want to cancel this upload?')) {
    await backgroundUploadManager.cancel(id)
  }
}

const handlePauseAll = async () => {
  await backgroundUploadManager.pauseAllActive()
}

const handleResumeAll = async () => {
  await backgroundUploadManager.resumeAllPaused()
}

const handleRetryAllFailed = async () => {
  await backgroundUploadManager.retryAllFailed()
}

const handleDeleteAll = async () => {
  if (confirm('Are you sure you want to delete all uploads? This cannot be undone.')) {
    await backgroundUploadManager.deleteAll()
  }
}
</script>

