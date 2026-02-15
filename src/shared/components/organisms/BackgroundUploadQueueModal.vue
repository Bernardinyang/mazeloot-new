<template>
  <Teleport to="body">
    <div
      v-if="uploadQueue.length > 0"
      :class="[
        theme.bgCard,
        'fixed z-50 rounded-2xl border-0 shadow-xl transition-all overflow-hidden backdrop-blur-sm',
        'bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]',
        'w-[calc(100vw-2rem)] max-w-[420px] sm:w-[420px]',
        'ring-1 ring-black/5 dark:ring-white/10',
      ]"
    >
      <!-- Header: gradient strip + title -->
      <div class="relative overflow-hidden">
        <div
          class="absolute inset-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-90"
          :style="{ width: `${aggregate.percentage}%` }"
        />
        <div class="p-3 pt-3.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <div
                class="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25"
              >
                <Upload class="h-4 w-4 text-white" />
              </div>
              <p :class="theme.textPrimary" class="text-sm font-semibold truncate">
                Uploading {{ uploadQueue.length }} file{{ uploadQueue.length !== 1 ? 's' : '' }}…
              </p>
            </div>
            <div class="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                :class="[theme.textTertiary, 'p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors']"
                :aria-label="expanded ? 'Minimize' : 'Expand'"
                @click="expanded = !expanded"
              >
                <ChevronUp v-if="expanded" class="h-4 w-4" />
                <ChevronDown v-else class="h-4 w-4" />
              </button>
              <button
                type="button"
                :class="[theme.textTertiary, 'p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors']"
                aria-label="Close"
                @click="emit('update:modelValue', false)"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="mt-3 space-y-2">
            <div
              :class="theme.textTertiary"
              class="flex flex-wrap items-center gap-x-4 gap-y-0 text-xs font-medium tabular-nums"
            >
              <span v-if="aggregate.speed > 0" class="text-emerald-600 dark:text-emerald-400">
                {{ formatSpeed(aggregate.speed) }}
              </span>
              <span v-if="aggregate.eta != null">{{ formatETA(aggregate.eta) }} left</span>
              <span class="text-violet-600 dark:text-violet-400">{{ aggregate.percentage }}%</span>
              <span>{{ formatSize(aggregate.loaded) }} / {{ formatSize(aggregate.total) }}</span>
            </div>
            <div class="h-2 rounded-full overflow-hidden bg-black/5 dark:bg-white/10">
              <div
                class="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 transition-all duration-500 ease-out relative overflow-hidden"
                :style="{ width: `${aggregate.percentage}%` }"
              >
                <div class="absolute inset-0 bg-white/25 animate-shimmer motion-reduce:animate-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[500px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[500px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="expanded" class="border-t border-black/5 dark:border-white/10 overflow-hidden">
          <div
            v-if="!isOnline"
            class="mx-3 mt-3 p-3 rounded-xl bg-red-500/10 border border-red-400/30 flex items-center gap-2"
          >
            <AlertCircle class="h-4 w-4 text-red-500 shrink-0" />
            <p class="text-xs font-medium text-red-600 dark:text-red-400">Offline – uploads paused</p>
          </div>
          <div
            v-if="isQuotaHigh"
            class="mx-3 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center gap-2"
          >
            <AlertCircle class="h-4 w-4 text-amber-500 shrink-0" />
            <p class="text-xs font-medium text-amber-700 dark:text-amber-400">Storage {{ Math.round(quotaPercentage) }}% – cleanup suggested</p>
          </div>

          <div class="p-3 space-y-2.5 max-h-[400px] overflow-y-auto">
            <div
              v-for="item in uploadQueue"
              :key="item.id"
              :class="[
                'rounded-xl p-3 transition-all',
                theme.bgInput,
                item.status === 'failed' ? 'ring-1 ring-red-400/40 bg-red-500/5' : '',
                item.status === 'completed' ? 'ring-1 ring-emerald-400/40 bg-emerald-500/5' : '',
                !['failed', 'completed'].includes(item.status) ? 'ring-1 ring-black/5 dark:ring-white/10' : '',
              ]"
            >
              <div class="flex items-start gap-3">
                <div
                  :class="[
                    'shrink-0 w-9 h-9 rounded-lg flex items-center justify-center',
                    item.status === 'uploading' && 'bg-gradient-to-br from-violet-500 to-fuchsia-500',
                    item.status === 'completed' && 'bg-emerald-500/20',
                    item.status === 'failed' && 'bg-red-500/20',
                    item.status === 'paused' && 'bg-amber-500/20',
                    ['pending', 'cancelled'].includes(item.status) && 'bg-black/5 dark:bg-white/10',
                  ]"
                >
                  <Loader2
                    v-if="item.status === 'uploading'"
                    class="h-4 w-4 animate-spin text-white"
                  />
                  <CheckCircle2
                    v-else-if="item.status === 'completed'"
                    class="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                  />
                  <XCircle v-else-if="item.status === 'failed'" class="h-4 w-4 text-red-500" />
                  <Pause v-else-if="item.status === 'paused'" class="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <Upload v-else class="h-4 w-4 opacity-50" />
                </div>
                <div class="flex-1 min-w-0">
                  <p :class="theme.textPrimary" class="text-sm font-medium truncate">
                    {{ item.filename }}
                  </p>
                  <p :class="theme.textTertiary" class="text-xs mt-0.5 tabular-nums">
                    {{ formatFileSize(item.size) }}
                    <span v-if="item.progress?.speed > 0" class="text-emerald-600 dark:text-emerald-400">
                      · {{ formatSpeed(item.progress.speed) }}
                      <span v-if="item.progress?.eta"> · {{ formatETA(item.progress.eta) }}</span>
                    </span>
                  </p>
                </div>
              </div>
              <div
                v-if="item.status === 'uploading' && item.progress"
                class="h-1.5 rounded-full overflow-hidden mt-2 bg-black/5 dark:bg-white/10"
              >
                <div
                  class="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                  :style="{ width: `${item.progress.percentage || 0}%` }"
                />
              </div>
              <div
                v-if="item.error"
                :class="[theme.bgError, theme.textError, 'rounded-lg p-2 text-xs mt-2']"
              >
                {{ item.error.message || item.error }}
              </div>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <Button
                  v-if="item.status === 'uploading'"
                  size="sm"
                  variant="ghost"
                  class="h-7 text-xs px-2 rounded-lg"
                  @click="handlePause(item.id)"
                >
                  <Pause class="h-3 w-3 mr-1" />
                  Pause
                </Button>
                <Button
                  v-if="item.status === 'paused' && isOnline"
                  size="sm"
                  variant="ghost"
                  class="h-7 text-xs px-2 rounded-lg"
                  @click="handleResume(item.id)"
                >
                  <Play class="h-3 w-3 mr-1" />
                  Resume
                </Button>
                <Button
                  v-if="item.status === 'failed' || item.status === 'cancelled'"
                  size="sm"
                  variant="ghost"
                  class="h-7 text-xs px-2 rounded-lg"
                  @click="handleRetry(item.id)"
                >
                  <RefreshCw class="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button
                  v-if="['uploading', 'paused', 'pending'].includes(item.status)"
                  size="sm"
                  variant="ghost"
                  class="h-7 text-xs px-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-500/10 dark:text-red-400"
                  @click="handleCancel(item.id)"
                >
                  <X class="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          <div class="p-3 flex flex-wrap gap-2 border-t border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
            <Button
              v-if="failedUploadCount > 0"
              size="sm"
              variant="outline"
              class="h-8 text-xs rounded-lg border-amber-500/50 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
              @click="handleRetryAllFailed"
            >
              <RefreshCw class="h-3.5 w-3.5 mr-1" />
              Retry failed
            </Button>
            <Button
              v-if="activeUploadCount > 0"
              size="sm"
              variant="outline"
              class="h-8 text-xs rounded-lg"
              @click="handlePauseAll"
            >
              <Pause class="h-3.5 w-3.5 mr-1" />
              Pause all
            </Button>
            <Button
              v-if="pausedUploadCount > 0 && isOnline"
              size="sm"
              variant="outline"
              class="h-8 text-xs rounded-lg"
              @click="handleResumeAll"
            >
              <Play class="h-3.5 w-3.5 mr-1" />
              Resume all
            </Button>
            <Button
              v-if="uploadQueue.length > 0"
              size="sm"
              variant="outline"
              class="h-8 text-xs rounded-lg text-red-600 border-red-400/50 hover:bg-red-500/10 dark:text-red-400"
              @click="handleDeleteAll"
            >
              <Trash2 class="h-3.5 w-3.5 mr-1" />
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
  Upload,
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
