<template>
  <Teleport to="body">
    <!-- Compact bar: only when queue has items -->
    <div
      v-if="uploadQueue.length > 0"
      :class="[
        theme.bgCard,
        theme.borderCard,
        'fixed z-50 rounded-lg border shadow-lg transition-all overflow-hidden',
        'bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]',
        'w-[calc(100vw-2rem)] max-w-[420px] sm:w-[420px]',
      ]"
    >
      <!-- Bar header + progress -->
      <div class="p-3">
        <div class="flex items-center justify-between gap-2">
          <p :class="theme.textPrimary" class="text-sm font-semibold truncate">
            Uploading {{ uploadQueue.length }} file{{ uploadQueue.length !== 1 ? 's' : '' }}...
          </p>
          <div class="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              :class="[theme.textTertiary, 'p-1.5 rounded hover:opacity-80']"
              :aria-label="expanded ? 'Minimize' : 'Expand'"
              @click="expanded = !expanded"
            >
              <ChevronUp v-if="expanded" class="h-4 w-4" />
              <ChevronDown v-else class="h-4 w-4" />
            </button>
            <button
              type="button"
              :class="[theme.textTertiary, 'p-1.5 rounded hover:opacity-80']"
              aria-label="Close"
              @click="emit('update:modelValue', false)"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="mt-2 space-y-1">
          <div :class="theme.textTertiary" class="flex flex-wrap items-center gap-x-3 gap-y-0 text-xs">
            <span v-if="aggregate.speed > 0">{{ formatSpeed(aggregate.speed) }}</span>
            <span v-if="aggregate.eta != null">{{ formatETA(aggregate.eta) }} remaining</span>
            <span>{{ aggregate.percentage }}% Completed</span>
            <span>{{ formatSize(aggregate.loaded) }} / {{ formatSize(aggregate.total) }}</span>
          </div>
          <div :class="[theme.bgInput, 'h-1.5 rounded-full overflow-hidden']">
            <div
              class="h-full bg-green-500 transition-all duration-300"
              :style="{ width: `${aggregate.percentage}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Expanded list -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[500px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[500px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="expanded" :class="[theme.borderCard, 'border-t overflow-hidden']">
          <!-- Alerts -->
          <div
            v-if="!isOnline"
            class="mx-3 mt-2 p-2 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center gap-2"
          >
            <AlertCircle class="h-4 w-4 text-red-500 shrink-0" />
            <p class="text-xs text-red-500">Offline – uploads paused</p>
          </div>
          <div
            v-if="isQuotaHigh"
            class="mx-3 mt-2 p-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 flex items-center gap-2"
          >
            <AlertCircle class="h-4 w-4 text-yellow-500 shrink-0" />
            <p class="text-xs text-yellow-500">Storage {{ Math.round(quotaPercentage) }}% – cleanup suggested</p>
          </div>

          <div class="p-3 space-y-2 max-h-[400px] overflow-y-auto">
            <div
              v-for="item in uploadQueue"
              :key="item.id"
              :class="[
                theme.bgInput,
                theme.borderSecondary,
                'rounded-lg border p-2',
                item.status === 'failed' ? 'border-red-500/30 bg-red-500/5' : '',
                item.status === 'completed' ? 'border-green-500/30 bg-green-500/5' : '',
              ]"
            >
              <div class="flex items-start gap-2">
                <div class="flex-1 min-w-0">
                  <p :class="theme.textPrimary" class="text-xs font-medium truncate">
                    {{ item.filename }}
                  </p>
                  <p :class="theme.textTertiary" class="text-xs mt-0.5">
                    {{ formatFileSize(item.size) }}
                    <span v-if="item.progress?.speed > 0">
                      · {{ formatSpeed(item.progress.speed) }}
                      <span v-if="item.progress?.eta"> · {{ formatETA(item.progress.eta) }}</span>
                    </span>
                  </p>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <Loader2
                    v-if="item.status === 'uploading'"
                    class="h-3.5 w-3.5 animate-spin text-accent"
                  />
                  <CheckCircle2
                    v-else-if="item.status === 'completed'"
                    class="h-3.5 w-3.5 text-green-500"
                  />
                  <XCircle v-else-if="item.status === 'failed'" class="h-3.5 w-3.5 text-red-500" />
                  <Pause v-else-if="item.status === 'paused'" class="h-3.5 w-3.5 text-yellow-500" />
                </div>
              </div>
              <div
                v-if="item.status === 'uploading' && item.progress"
                :class="[theme.bgInput, 'h-1.5 rounded-full overflow-hidden mt-1.5']"
              >
                <div
                  class="bg-accent h-full transition-all duration-300"
                  :style="{ width: `${item.progress.percentage || 0}%` }"
                />
              </div>
              <div
                v-if="item.error"
                :class="[theme.bgError, theme.textError, 'rounded p-1.5 text-xs mt-1']"
              >
                {{ item.error.message || item.error }}
              </div>
              <div class="flex flex-wrap gap-1 mt-1.5">
                <Button
                  v-if="item.status === 'uploading'"
                  size="sm"
                  variant="ghost"
                  class="h-6 text-xs px-1.5"
                  @click="handlePause(item.id)"
                >
                  <Pause class="h-3 w-3 mr-0.5" />
                  Pause
                </Button>
                <Button
                  v-if="item.status === 'paused' && isOnline"
                  size="sm"
                  variant="ghost"
                  class="h-6 text-xs px-1.5"
                  @click="handleResume(item.id)"
                >
                  <Play class="h-3 w-3 mr-0.5" />
                  Resume
                </Button>
                <Button
                  v-if="item.status === 'failed' || item.status === 'cancelled'"
                  size="sm"
                  variant="ghost"
                  class="h-6 text-xs px-1.5"
                  @click="handleRetry(item.id)"
                >
                  <RefreshCw class="h-3 w-3 mr-0.5" />
                  Retry
                </Button>
                <Button
                  v-if="['uploading', 'paused', 'pending'].includes(item.status)"
                  size="sm"
                  variant="ghost"
                  class="h-6 text-xs px-1.5 text-red-500"
                  @click="handleCancel(item.id)"
                >
                  <X class="h-3 w-3 mr-0.5" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          <div :class="[theme.borderCard, 'border-t p-2 flex flex-wrap gap-1']">
            <Button
              v-if="failedUploadCount > 0"
              size="sm"
              variant="outline"
              class="h-7 text-xs"
              @click="handleRetryAllFailed"
            >
              Retry failed
            </Button>
            <Button
              v-if="activeUploadCount > 0"
              size="sm"
              variant="outline"
              class="h-7 text-xs"
              @click="handlePauseAll"
            >
              Pause all
            </Button>
            <Button
              v-if="pausedUploadCount > 0 && isOnline"
              size="sm"
              variant="outline"
              class="h-7 text-xs"
              @click="handleResumeAll"
            >
              Resume all
            </Button>
            <Button
              v-if="uploadQueue.length > 0"
              size="sm"
              variant="outline"
              class="h-7 text-xs text-red-500 border-red-500/50"
              @click="handleDeleteAll"
            >
              <Trash2 class="h-3 w-3 mr-0.5" />
              Clear
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  RefreshCw,
  X,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
} from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useBackgroundUploadManager } from '@/shared/composables/useBackgroundUploadManager'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
})

const emit = defineEmits(['update:modelValue'])

const backgroundUploadManager = useBackgroundUploadManager()

const expanded = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

watch(
  () => props.modelValue,
  open => {
    if (open) expanded.value = true
  }
)

const uploadQueue = computed(() => backgroundUploadManager.uploadQueue.value || [])
const isOnline = computed(() => backgroundUploadManager.isOnline.value)
const isQuotaHigh = computed(() => backgroundUploadManager.isQuotaHigh.value)
const quotaPercentage = computed(() => backgroundUploadManager.quotaUsage.value?.percentage || 0)
const activeUploadCount = computed(() => backgroundUploadManager.activeUploadCount.value)
const pausedUploadCount = computed(() => backgroundUploadManager.pausedUploadCount.value)
const failedUploadCount = computed(() => backgroundUploadManager.failedUploadCount.value)

const aggregate = computed(() => {
  const queue = uploadQueue.value
  let total = 0
  let loaded = 0
  let speedSum = 0
  let etaMax = null
  for (const item of queue) {
    total += item.size ?? 0
    if (item.status === 'completed') {
      loaded += item.size ?? 0
    } else if (item.status === 'uploading' && item.progress) {
      loaded += item.progress.loaded ?? 0
      speedSum += item.progress.speed ?? 0
      if (item.progress.eta != null) {
        etaMax = etaMax == null ? item.progress.eta : Math.max(etaMax, item.progress.eta)
      }
    }
  }
  const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0
  return {
    total,
    loaded,
    percentage,
    speed: speedSum,
    eta: etaMax,
  }
})

const formatFileSize = bytes => {
  if (bytes == null || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatSize = formatFileSize

const formatSpeed = bytesPerSec => {
  return formatFileSize(bytesPerSec) + '/s'
}

const formatETA = seconds => {
  if (seconds == null || seconds === Infinity) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const handlePause = async id => backgroundUploadManager.pause(id)
const handleResume = async id => backgroundUploadManager.resume(id)
const handleRetry = async id => backgroundUploadManager.retry(id)
const handleCancel = async id => {
  if (confirm('Cancel this upload?')) await backgroundUploadManager.cancel(id)
}
const handlePauseAll = async () => backgroundUploadManager.pauseAllActive()
const handleResumeAll = async () => backgroundUploadManager.resumeAllPaused()
const handleRetryAllFailed = async () => backgroundUploadManager.retryAllFailed()
const handleDeleteAll = async () => {
  if (confirm('Remove all items from the queue? This cannot be undone.')) {
    await backgroundUploadManager.deleteAll()
  }
}
</script>
