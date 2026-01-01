<template>
  <SidebarModal
    v-model="isOpen"
    title="Revision History"
    :description="mediaItem?.filename || 'Previous versions of this media'"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <Loader2 class="h-8 w-8 animate-spin" :class="theme.textSecondary" />
      <span :class="theme.textSecondary" class="ml-2">Loading revisions...</span>
    </div>

    <!-- Revision Limit Alert -->
    <div
      v-if="(revisions.length > 0 && maxRevisions && currentRevisionNumber) && (isRevisionLimitExceeded || isSecondToLastRevision)"
      class="mb-4 p-3 rounded-lg border"
      :class="[
        isRevisionLimitExceeded
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          : isSecondToLastRevision
            ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            : '',
      ]"
    >
      <div class="flex items-start gap-2">
        <div v-if="isRevisionLimitExceeded" class="flex-shrink-0 mt-0.5">
          <svg
            class="h-5 w-5 text-red-600 dark:text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clip-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              fill-rule="evenodd"
            />
          </svg>
        </div>
        <div v-else-if="isSecondToLastRevision" class="flex-shrink-0 mt-0.5">
          <svg
            class="h-5 w-5 text-amber-600 dark:text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clip-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              fill-rule="evenodd"
            />
          </svg>
        </div>
        <div class="flex-1">
          <p
            v-if="isRevisionLimitExceeded"
            class="text-sm font-semibold text-red-800 dark:text-red-200"
          >
            Revision Limit Exceeded
          </p>
          <p
            v-else-if="isSecondToLastRevision"
            class="text-sm font-semibold text-amber-800 dark:text-amber-200"
          >
            Second-to-Last Revision
          </p>
          <p
            :class="[
              'text-xs mt-1',
              isRevisionLimitExceeded
                ? 'text-red-700 dark:text-red-300'
                : 'text-amber-700 dark:text-amber-300',
            ]"
          >
            <span v-if="isRevisionLimitExceeded">
              Maximum revision limit ({{ maxRevisions }}) has been reached. No more revisions can be
              uploaded.
            </span>
            <span v-else-if="isSecondToLastRevision">
              Current revision is {{ currentRevisionNumber }} of {{ maxRevisions }}. Only one more
              revision is allowed.
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="revisions.length > 0" class="space-y-4">
      <div
        v-for="revision in revisions"
        :key="revision.id"
        :class="[
          'p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md',
          selectedRevision?.id === revision.id
            ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/50 dark:bg-teal-900/20'
            : theme.borderSecondary,
          theme.bgCardSolid,
        ]"
        @click="handleRevisionClick(revision)"
      >
        <div class="flex items-start gap-4">
          <!-- Thumbnail -->
          <div class="flex-shrink-0">
            <img
              :src="getRevisionThumbnail(revision)"
              :alt="revision.filename || 'Revision'"
              class="w-20 h-20 object-cover rounded-lg border"
              :class="theme.borderSecondary"
              @error="handleImageError"
            />
          </div>

          <!-- Details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span
                v-if="revision.revisionNumber || revision.revision_number"
                class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              >
                Revision {{ revision.revisionNumber || revision.revision_number }}
              </span>
              <span
                v-else
                class="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Original
              </span>
              <span
                v-if="revision.isCompleted || revision.is_completed"
                class="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              >
                Approved
              </span>
            </div>
            <p :class="theme.textPrimary" class="text-sm font-medium truncate">
              {{ revision.filename || 'Media' }}
            </p>
            <p :class="theme.textSecondary" class="text-xs mt-1">
              {{ formatDate(revision.createdAt || revision.created_at) }}
            </p>
            <p
              v-if="revision.revisionDescription || revision.revision_description"
              :class="theme.textSecondary"
              class="text-xs mt-2 line-clamp-2"
            >
              {{ revision.revisionDescription || revision.revision_description }}
            </p>
            <div
              v-if="revision.revisionTodos && revision.revisionTodos.length > 0"
              class="mt-2 flex flex-wrap gap-1"
            >
              <span
                v-for="(todo, index) in revision.revisionTodos"
                :key="index"
                :class="[
                  'px-2 py-0.5 rounded text-xs',
                  todo.completed
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                ]"
              >
                {{ typeof todo === 'string' ? todo : todo.text }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <History class="h-12 w-12 mb-4" :class="theme.textTertiary" />
      <p :class="['text-sm font-medium', theme.textPrimary]">No revisions found</p>
      <p :class="['text-xs mt-1', theme.textSecondary]">This media has no previous versions.</p>
    </div>

    <!-- Revision Details Panel -->
    <div v-if="selectedRevision" :class="['mt-6 pt-6 border-t', theme.borderSecondary]">
      <div class="flex items-center justify-between mb-4">
        <h3 :class="theme.textPrimary" class="text-lg font-semibold">
          Revision
          {{ selectedRevision.revisionNumber || selectedRevision.revision_number || 'Original' }}
          Details
        </h3>
        <Button variant="ghost" size="sm" @click="selectedRevision = null">
          <X class="h-4 w-4" />
        </Button>
      </div>

      <!-- Media Preview -->
      <div class="mb-4">
        <img
          :src="getRevisionThumbnail(selectedRevision)"
          :alt="selectedRevision.filename || 'Revision'"
          class="w-full rounded-lg border cursor-pointer"
          :class="theme.borderSecondary"
          @click="handleViewRevision(selectedRevision)"
        />
      </div>

      <!-- Description -->
      <div
        v-if="selectedRevision.revisionDescription || selectedRevision.revision_description"
        class="mb-4"
      >
        <p :class="theme.textSecondary" class="text-xs font-medium mb-1">Description</p>
        <p :class="theme.textPrimary" class="text-sm">
          {{ selectedRevision.revisionDescription || selectedRevision.revision_description }}
        </p>
      </div>

      <!-- Completed Todos -->
      <div
        v-if="selectedRevision.revisionTodos && selectedRevision.revisionTodos.length > 0"
        class="mb-4"
      >
        <p :class="theme.textSecondary" class="text-xs font-medium mb-2">Action Items</p>
        <div class="space-y-2">
          <div
            v-for="(todo, index) in selectedRevision.revisionTodos"
            :key="index"
            class="flex items-start gap-2"
          >
            <CheckCircle2
              :class="[
                'w-4 h-4 mt-0.5 flex-shrink-0',
                todo.completed
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500',
              ]"
            />
            <span
              :class="[
                'text-sm',
                todo.completed
                  ? 'text-gray-600 dark:text-gray-400 line-through'
                  : theme.textPrimary,
              ]"
            >
              {{ typeof todo === 'string' ? todo : todo.text }}
            </span>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div v-if="selectedRevision.feedback && selectedRevision.feedback.length > 0" class="mb-4">
        <p :class="theme.textSecondary" class="text-xs font-medium mb-2">
          Comments ({{ getCommentCount(selectedRevision) }})
        </p>
        <div class="space-y-3 max-h-[300px] overflow-y-auto">
          <div
            v-for="comment in selectedRevision.feedback"
            :key="comment.id"
            class="p-3 rounded-lg border"
            :class="theme.borderSecondary"
          >
            <div class="flex items-center gap-2 mb-2">
              <span :class="theme.textPrimary" class="text-xs font-semibold">
                {{ getAuthorName(comment.created_by) }}
              </span>
              <span :class="theme.textTertiary" class="text-xs">
                {{ formatDate(comment.created_at || comment.createdAt) }}
              </span>
            </div>
            <p :class="theme.textPrimary" class="text-sm">{{ comment.content }}</p>
            <div
              v-if="comment.replies && comment.replies.length > 0"
              class="mt-3 ml-4 space-y-2 border-l-2 pl-3"
              :class="theme.borderSecondary"
            >
              <div v-for="reply in comment.replies" :key="reply.id" class="text-xs">
                <span :class="theme.textPrimary" class="font-semibold">
                  {{ getAuthorName(reply.created_by) }}:
                </span>
                <span :class="theme.textSecondary"> {{ reply.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 mt-4">
        <Button variant="outline" class="flex-1" @click="handleViewRevision(selectedRevision)">
          <Eye class="h-4 w-4 mr-2" />
          View Full Size
        </Button>
        <Button variant="outline" class="flex-1" @click="handleDownloadRevision(selectedRevision)">
          <Download class="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  </SidebarModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Loader2, History, X, Eye, Download, CheckCircle2 } from 'lucide-vue-next'
import SidebarModal from '@/components/molecules/SidebarModal.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProofingApi } from '@/api/proofing'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const proofingApi = useProofingApi()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  mediaItem: {
    type: Object,
    default: null,
  },
  placeholderImage: {
    type: String,
    default: '/placeholder-image.png',
  },
  guestToken: {
    type: String,
    default: null,
  },
  maxRevisions: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'view', 'download', 'revision-click'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const revisions = ref([])
const isLoading = ref(false)
const selectedRevision = ref(null)

const currentRevisionNumber = computed(() => {
  if (revisions.value.length === 0) return null
  const maxRevision = revisions.value.reduce((max, rev) => {
    const revNum = rev.revisionNumber || rev.revision_number || 0
    return Math.max(max, revNum)
  }, 0)
  return maxRevision
})

const isRevisionLimitExceeded = computed(() => {
  if (!props.maxRevisions || !currentRevisionNumber.value) return false
  return currentRevisionNumber.value >= props.maxRevisions
})

const isSecondToLastRevision = computed(() => {
  if (!props.maxRevisions || !currentRevisionNumber.value) return false
  return currentRevisionNumber.value === props.maxRevisions - 1
})

const getRevisionThumbnail = revision => {
  return (
    revision.thumbnailUrl ||
    revision.thumbnail_url ||
    revision.largeImageUrl ||
    revision.large_image_url ||
    revision.file?.url ||
    revision.url ||
    props.placeholderImage
  )
}

const formatDate = date => {
  if (!date) return ''
  const d = new Date(date)
  return (
    d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
}

const getAuthorName = createdBy => {
  if (!createdBy) return 'Anonymous'
  if (typeof createdBy === 'string') {
    try {
      const parsed = JSON.parse(createdBy)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed.email || parsed.name || 'Anonymous'
      }
    } catch {
      return createdBy
    }
  }
  if (typeof createdBy === 'object' && createdBy !== null) {
    return createdBy.email || createdBy.name || 'Anonymous'
  }
  return 'Anonymous'
}

const getCommentCount = revision => {
  if (!revision.feedback || !Array.isArray(revision.feedback)) return 0
  let count = revision.feedback.length
  revision.feedback.forEach(comment => {
    if (comment.replies && Array.isArray(comment.replies)) {
      count += comment.replies.length
    }
  })
  return count
}

const handleImageError = event => {
  event.target.src = props.placeholderImage
}

const selectRevision = revision => {
  selectedRevision.value = selectedRevision.value?.id === revision.id ? null : revision
}

const handleRevisionClick = revision => {
  emit('revision-click', revision)
}

const handleViewRevision = revision => {
  emit('view', revision)
}

const handleDownloadRevision = async revision => {
  try {
    emit('download', revision)
  } catch (error) {
    toast.error('Failed to download', {
      description: error?.message || 'An error occurred while downloading the revision.',
    })
  }
}

const loadRevisions = async () => {
  if (!props.mediaItem?.id && !props.mediaItem?.uuid) return

  isLoading.value = true
  try {
    const mediaId = props.mediaItem.id || props.mediaItem.uuid
    const result = await proofingApi.getMediaRevisions(mediaId, props.guestToken)

    // Handle different response structures
    if (Array.isArray(result)) {
      revisions.value = result
    } else if (result && Array.isArray(result.data)) {
      revisions.value = result.data
    } else {
      revisions.value = []
    }
  } catch (error) {
    console.error('Failed to load revisions:', error)
    toast.error('Failed to load revisions', {
      description: error?.message || 'An error occurred while loading revision history.',
    })
    revisions.value = []
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.modelValue,
  open => {
    if (open) {
      loadRevisions()
      selectedRevision.value = null
    } else {
      revisions.value = []
      selectedRevision.value = null
    }
  }
)

watch(
  () => props.mediaItem,
  () => {
    if (props.modelValue && (props.mediaItem?.id || props.mediaItem?.uuid)) {
      loadRevisions()
    }
  },
  { deep: true }
)
</script>
