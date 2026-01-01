<template>
  <div
    :class="[
      theme.borderSecondary,
      props.isSelected
        ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/50 dark:bg-teal-900/20 opacity-100'
        : props.wasSelectedOnCompletion && props.selectionStatus === 'completed'
          ? 'opacity-100'
          : props.selectionStatus === 'completed'
            ? 'opacity-50 grayscale'
            : 'opacity-90 hover:opacity-100',
      props.wasSelectedOnCompletion && !props.isSelected ? 'ring-1 ring-green-500/50' : '',
      hasPendingClosureRequest
        ? 'ring-1 ring-amber-500 border-amber-500 bg-amber-50/30 dark:bg-amber-900/10 animate-pulse'
        : '',
      hasApprovedClosureRequest
        ? 'ring-2 ring-green-500 border-green-500 bg-green-50/30 dark:bg-green-900/10 animate-pulse'
        : '',
      hasRejectedClosureRequest
        ? 'ring-2 ring-red-500 border-red-500 bg-red-50/30 dark:bg-red-900/10'
        : '',
      hasPendingApprovalRequest
        ? 'ring-1 ring-blue-500 border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 animate-pulse'
        : '',
      isRejected ? 'ring-2 ring-red-600 border border-red-600 bg-red-50/30 dark:bg-red-900/10' : '',
      'group flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-200',
      isRejected ? 'border border-red-600' : 'border border-gray-200 dark:border-gray-700',
    ]"
    :title="
      hasPendingClosureRequest
        ? 'Closure request pending - Click clock icon to view'
        : hasPendingApprovalRequest
          ? 'Approval request pending'
          : ''
    "
    :style="
      props.isSelected || (props.wasSelectedOnCompletion && props.selectionStatus === 'completed')
        ? { opacity: 1 }
        : {}
    "
  >
    <!-- Selection Checkbox -->
    <button
      v-if="props.showSelectionCheckbox"
      class="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      @click.stop="emit('toggle-selection')"
    >
      <CheckSquare2 v-if="props.isSelected" class="h-5 w-5 text-teal-500" />
      <Square v-else :class="theme.textSecondary" class="h-5 w-5" />
    </button>

    <div
      class="flex items-center gap-4 flex-1 cursor-pointer relative"
      @click="emit('open-viewer')"
    >
      <div class="relative">
        <!-- Image thumbnail -->
        <img
          v-if="(props.item?.type || props.item?.file?.type) !== 'video'"
          ref="imageElementRef"
          :alt="props.item?.filename || 'Media'"
          :class="[
            'w-20 h-20 object-cover rounded-lg shadow-sm transition-all duration-300 will-change-transform',
            isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]',
            isRejected ? 'grayscale' : '',
          ]"
          :style="props.isSelected ? { opacity: 1 } : {}"
          :src="imageSrc"
          @error="emit('image-error', $event)"
          @load="isImageLoaded = true"
        />
        <!-- Video thumbnail with play icon -->
        <div v-else class="w-20 h-20 relative rounded-lg overflow-hidden">
          <img
            v-if="imageSrc && imageSrc !== placeholderImage"
            ref="videoThumbnailRef"
            :alt="props.item?.filename || 'Video'"
            :class="[
              'w-full h-full object-cover transition-all duration-300 will-change-transform',
              isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]',
              isRejected ? 'grayscale' : '',
            ]"
            :style="props.isSelected ? { opacity: 1 } : {}"
            :src="imageSrc"
            @error="emit('image-error', $event)"
            @load="isImageLoaded = true"
          />
          <!-- Video play icon overlay -->
          <div
            class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Play class="h-5 w-5 text-teal-600 dark:text-teal-400 ml-0.5" />
            </div>
          </div>
        </div>
        <!-- Comment Count Badge (bottom-right) -->
        <div
          v-if="commentCount > 0"
          :class="[
            'absolute z-30 px-1.5 py-0.5 rounded-full bg-teal-500 text-white text-xs font-bold shadow-lg flex items-center gap-1',
            props.wasSelectedOnCompletion && props.selectionStatus === 'completed'
              ? 'bottom-8 right-1'
              : 'bottom-1 right-1',
          ]"
        >
          <MessageSquare class="w-2.5 h-2.5" />
          {{ commentCount }}
        </div>
        <!-- Was Selected on Completion Badge (bottom right) -->
        <div
          v-if="props.wasSelectedOnCompletion && props.selectionStatus === 'completed'"
          class="absolute bottom-1 right-1 z-30"
        >
          <div
            class="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/90 backdrop-blur-sm shadow-lg"
            title="Selected when completed"
          >
            <CheckCircle2 class="h-3 w-3 fill-white text-white" />
          </div>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <p
            v-if="props.showFilename && props.item?.filename"
            :class="theme.textPrimary"
            class="text-sm font-medium truncate"
          >
            {{ props.item.filename }}
          </p>
          <p v-else :class="theme.textTertiary" class="text-sm font-medium truncate">Media Item</p>
          <Star
            v-if="props.item?.isStarred"
            class="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400"
          />
        </div>
        <p :class="theme.textTertiary" class="text-xs mt-1">
          {{ props.subtitle }}
        </p>
        <!-- Proofing Badges (only show when NOT in selection context) -->
        <template v-if="!props.selectionStatus">
          <!-- Draft/Revision Badge (under date) -->
          <div
            v-if="!(props.item?.isCompleted || props.item?.is_completed)"
            class="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm border"
            :class="
              hasRevisions && (props.item?.revisionNumber || props.item?.revision_number)
                ? 'bg-purple-500/90 dark:bg-purple-600/90 border-purple-400/50'
                : 'bg-amber-500/90 dark:bg-amber-600/90 border-amber-400/50'
            "
            :title="
              hasRevisions && (props.item?.revisionNumber || props.item?.revision_number)
                ? `Revision ${props.item?.revisionNumber || props.item?.revision_number}`
                : 'Draft'
            "
          >
            <span class="text-[10px] font-semibold text-white">
              {{
                hasRevisions && (props.item?.revisionNumber || props.item?.revision_number)
                  ? `Rev ${props.item?.revisionNumber || props.item?.revision_number}`
                  : 'Draft'
              }}
            </span>
          </div>
          <!-- Approved Badge (under date) -->
          <div
            v-if="props.item?.isCompleted || props.item?.is_completed"
            class="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/90 dark:bg-green-600/90 backdrop-blur-sm shadow-sm border border-green-400/50"
            title="Approved"
          >
            <CheckCircle2 class="h-3 w-3 fill-white text-white" />
            <span class="text-[10px] font-semibold text-white">Approved</span>
          </div>
          <!-- Rejected Badge (under date) -->
          <div
            v-if="isRejected"
            class="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/90 dark:bg-red-600/90 backdrop-blur-sm shadow-sm border border-red-600"
            title="Rejected"
          >
            <X class="h-3 w-3 fill-white text-white" />
            <span class="text-[10px] font-semibold text-white">Rejected</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Star Toggle Button (on hover) -->
    <button
      class="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
      @click.stop="emit('star-click')"
      :title="props.item?.isStarred ? 'Unstar' : 'Star'"
    >
      <Star
        :class="[
          'h-4 w-4',
          props.item?.isStarred ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary,
        ]"
      />
    </button>

    <!-- Closure Request Indicators (only show when NOT in selection context) -->
    <template v-if="!props.selectionStatus">
      <!-- Pending Closure Request Indicator -->
      <TooltipProvider v-if="hasPendingClosureRequest">
        <Tooltip>
          <TooltipTrigger as-child>
            <button
              class="flex-shrink-0 p-2 rounded-lg bg-amber-500/90 hover:bg-amber-600/90 transition-all duration-200 hover:scale-110 animate-pulse"
              @click.stop="handlePendingClosureClick"
            >
              <Clock class="h-4 w-4 text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Closure request pending - Click to view</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <!-- Approved Closure Request Indicator -->
      <TooltipProvider v-if="hasApprovedClosureRequest">
        <Tooltip>
          <TooltipTrigger as-child>
            <button
              class="flex-shrink-0 p-2 rounded-lg bg-green-500/90 hover:bg-green-600/90 transition-all duration-200 hover:scale-110"
              @click.stop="emit('view-closure-history')"
            >
              <Clock class="h-4 w-4 text-white animate-pulse" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Closure request approved - Click to view</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <!-- Rejected Closure Request Indicator -->
      <TooltipProvider v-if="hasRejectedClosureRequest">
        <Tooltip>
          <TooltipTrigger as-child>
            <button
              class="flex-shrink-0 p-2 rounded-lg bg-red-500/90 hover:bg-red-600/90 transition-all duration-200 hover:scale-110"
              @click.stop="emit('view-closure-history')"
            >
              <Clock class="h-4 w-4 text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Closure request rejected - Click to view</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </template>
    <!-- Revision Indicator (only show when NOT in selection context) -->
    <TooltipProvider v-if="!props.selectionStatus && hasRevisions">
      <Tooltip>
        <TooltipTrigger as-child>
          <div
            class="flex-shrink-0 p-2 rounded-lg bg-purple-500/90 dark:bg-purple-600/90 transition-all duration-200 border border-purple-400/50"
          >
            <History class="h-4 w-4 text-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Has revisions - Click to view revision history</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <!-- Context Menu Button -->
    <div
      :class="[
        'flex-shrink-0 transition-opacity duration-200',
        isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      ]"
      @click.stop
    >
      <DropdownMenu v-model:open="isDropdownOpen">
        <DropdownMenuTrigger as-child>
          <button
            :class="theme.textSecondary"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            @click.stop
          >
            <MoreVertical class="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          :class="[theme.bgDropdown, theme.borderSecondary]"
          align="end"
          class="w-56 max-h-[80vh] overflow-y-auto"
          @click.stop
        >
          <!-- View Actions -->
          <DropdownMenuLabel
            :class="theme.textSecondary"
            class="text-xs font-semibold uppercase px-2 py-1.5"
          >
            View
          </DropdownMenuLabel>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('view-details')"
          >
            <Eye class="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('open')"
          >
            <ExternalLink class="h-4 w-4 mr-2" />
            Open
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
            @click.stop="emit('download')"
          >
            <Download class="h-4 w-4 mr-2" />
            Download
          </DropdownMenuItem>

          <!-- Management Actions -->
          <template v-if="props.showManagementActions">
            <DropdownMenuSeparator />
            <DropdownMenuLabel
              :class="theme.textSecondary"
              class="text-xs font-semibold uppercase px-2 py-1.5"
            >
              Manage
            </DropdownMenuLabel>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('move-copy')"
            >
              <Move class="h-4 w-4 mr-2" />
              Move/Copy
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('copy-filenames')"
            >
              <Copy class="h-4 w-4 mr-2" />
              Copy filenames
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('set-as-cover')"
            >
              <FileImage class="h-4 w-4 mr-2" />
              Set as cover photo
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('rename')"
            >
              <Pencil class="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('replace')"
            >
              <FileImage class="h-4 w-4 mr-2" />
              Replace photo
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="props.item?.originalUrl"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('remove-watermark')"
            >
              <X class="h-4 w-4 mr-2" />
              Remove Watermark
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('watermark')"
            >
              <Eye class="h-4 w-4 mr-2" />
              {{ props.item?.originalUrl ? 'Change Watermark' : 'Add Watermark' }}
            </DropdownMenuItem>
          </template>

          <!-- Closure Actions (only show when NOT in selection context) -->
          <template
            v-if="
              !props.selectionStatus &&
              (hasPendingClosureRequest ||
                (closureRequests && closureRequests.length > 0) ||
                (!props.item?.isCompleted && !props.item?.is_completed) ||
                props.item?.originalMediaUuid ||
                props.item?.original_media_uuid ||
                props.item?.revisionNumber ||
                props.item?.revision_number)
            "
          >
            <DropdownMenuSeparator />
            <DropdownMenuLabel
              :class="theme.textSecondary"
              class="text-xs font-semibold uppercase px-2 py-1.5"
            >
              Closure
            </DropdownMenuLabel>
            <DropdownMenuItem
              v-if="
                props.showManagementActions &&
                ((!props.item?.isCompleted && !props.item?.is_completed) ||
                  props.item?.originalMediaUuid ||
                  props.item?.original_media_uuid ||
                  props.item?.revisionNumber ||
                  props.item?.revision_number) &&
                !hasPendingClosureRequest &&
                !hasApprovedClosureRequest &&
                !props.isRevisionLimitExceeded
              "
              :class="[
                'text-amber-600 dark:text-amber-400',
                'hover:bg-amber-50 dark:hover:bg-amber-900/20',
                'cursor-pointer',
              ]"
              @click.stop="emit('request-closure')"
            >
              <MessageSquare class="h-4 w-4 mr-2" />
              Request Closure
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="hasPendingClosureRequest"
              :class="[
                'text-amber-600 dark:text-amber-400',
                'hover:bg-amber-50 dark:hover:bg-amber-900/20',
                'cursor-pointer',
              ]"
              @click.stop="emit('view-closure-history')"
            >
              <Clock class="h-4 w-4 mr-2" />
              Closure Request Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="closureRequests && closureRequests.length > 0"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('view-closure-history')"
            >
              <History class="h-4 w-4 mr-2" />
              View Closure History
            </DropdownMenuItem>
          </template>

          <!-- Revision History (only show when NOT in selection context) -->
          <template
            v-if="
              !props.selectionStatus &&
              (props.item?.originalMediaId ||
                props.item?.original_media_uuid ||
                props.item?.revisionNumber ||
                props.item?.revision_number)
            "
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="emit('view-revision-history')"
            >
              <History class="h-4 w-4 mr-2" />
              View Revision History
            </DropdownMenuItem>
          </template>

          <!-- Upload Revision - Only when media is ready for revision (only show when NOT in selection context) -->
          <template
            v-if="
              !props.selectionStatus &&
              (props.item?.isReadyForRevision || props.item?.is_ready_for_revision)
            "
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              :class="[
                'text-blue-600 dark:text-blue-400',
                'hover:bg-blue-50 dark:hover:bg-blue-900/20',
                'cursor-pointer',
                'font-semibold',
              ]"
              @click.stop="emit('upload-revision')"
            >
              <Upload class="h-4 w-4 mr-2" />
              Upload Revision
            </DropdownMenuItem>
          </template>

          <!-- Approval Request (only show when NOT in selection context) -->
          <template v-if="!props.selectionStatus && hasAnyApprovalRequest">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              v-if="hasPendingApprovalRequest"
              :class="[
                'text-blue-600 dark:text-blue-400',
                'hover:bg-blue-50 dark:hover:bg-blue-900/20',
                'cursor-pointer',
              ]"
              @click.stop="handleViewApprovalRequest"
            >
              <Upload class="h-4 w-4 mr-2" />
              Approval Request Pending
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="approvalRequests && approvalRequests.length > 0"
              :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
              @click.stop="handleViewApprovalRequest"
            >
              <History class="h-4 w-4 mr-2" />
              View Approval Request
            </DropdownMenuItem>
          </template>
          <!-- Request Approval (only show when NOT in selection context) -->
          <template v-else-if="!props.selectionStatus && props.isRevisionLimitExceeded">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              :class="[
                'text-amber-600 dark:text-amber-400',
                'hover:bg-amber-50 dark:hover:bg-amber-900/20',
                'cursor-pointer',
              ]"
              @click.stop="emit('request-approval')"
            >
              <Upload class="h-4 w-4 mr-2" />
              Request Approval
            </DropdownMenuItem>
          </template>

          <!-- Delete Action -->
          <template v-if="props.showManagementActions">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              :class="[
                'text-red-600 dark:text-red-400',
                'hover:bg-red-50 dark:hover:bg-red-900/20',
                'cursor-pointer',
              ]"
              @click.stop="emit('delete')"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </template>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  getMediaDisplayUrl,
  getMediaDisplayUrlSync,
  revokeMediaBlobUrl,
} from '@/utils/media/getMediaDisplayUrl'
import {
  CheckCircle2,
  CheckSquare2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileImage,
  History,
  MessageSquare,
  MoreVertical,
  Move,
  Pencil,
  Play,
  Square,
  Star,
  Trash2,
  X,
  Upload,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import { useThemeClasses } from '@/composables/useThemeClasses'

const theme = useThemeClasses()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    required: true,
  },
  showFilename: {
    type: Boolean,
    required: true,
  },
  placeholderImage: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  selectionStatus: {
    type: String,
    default: null,
  },
  wasSelectedOnCompletion: {
    type: Boolean,
    default: false,
  },
  showManagementActions: {
    type: Boolean,
    default: true,
  },
  showSelectionCheckbox: {
    type: Boolean,
    default: true,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  closureRequests: {
    type: Array,
    default: () => [],
  },
  approvalRequests: {
    type: Array,
    default: () => [],
  },
  maxRevisions: {
    type: Number,
    default: null,
  },
  isRevisionLimitExceeded: {
    type: Boolean,
    default: false,
  },
})

const imageSrc = ref(props.placeholderImage)
const isImageLoaded = ref(false)
const isDropdownOpen = ref(false)
const imageElementRef = ref(null)
const videoThumbnailRef = ref(null)

const latestClosureRequest = computed(() => {
  if (!props.closureRequests || props.closureRequests.length === 0) return null
  // Sort by created_at descending and get the first one (latest)
  const sorted = [...props.closureRequests].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || 0)
    const dateB = new Date(b.created_at || b.createdAt || 0)
    return dateB - dateA
  })
  return sorted[0]
})

const hasPendingClosureRequest = computed(() => {
  return latestClosureRequest.value?.status === 'pending'
})

const hasApprovedClosureRequest = computed(() => {
  return latestClosureRequest.value?.status === 'approved'
})

const hasRejectedClosureRequest = computed(() => {
  return latestClosureRequest.value?.status === 'rejected'
})

const latestApprovalRequest = computed(() => {
  if (!props.approvalRequests || props.approvalRequests.length === 0) return null
  // Sort by created_at descending and get the first one (latest)
  const sorted = [...props.approvalRequests].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || 0)
    const dateB = new Date(b.created_at || b.createdAt || 0)
    return dateB - dateA
  })
  return sorted[0]
})

const hasPendingApprovalRequest = computed(() => {
  return latestApprovalRequest.value?.status === 'pending'
})

const hasAnyApprovalRequest = computed(() => {
  return props.approvalRequests && props.approvalRequests.length > 0
})

const isRejected = computed(() => {
  return !!(props.item?.isRejected || props.item?.is_rejected)
})

const hasRevisions = computed(() => {
  return (
    (props.item?.revisionNumber && props.item.revisionNumber > 0) ||
    (props.item?.revision_number && props.item.revision_number > 0) ||
    !!props.item?.originalMediaId ||
    !!props.item?.original_media_uuid
  )
})

const pendingClosureRequest = computed(() => {
  return latestClosureRequest.value?.status === 'pending' ? latestClosureRequest.value : null
})

const closureRequests = computed(() => props.closureRequests || [])

const handlePendingClosureClick = () => {
  if (pendingClosureRequest.value?.public_url) {
    window.open(pendingClosureRequest.value.public_url, '_blank')
  } else {
    emit('view-closure-history')
  }
}

const handleViewApprovalRequest = () => {
  if (latestApprovalRequest.value?.public_url) {
    window.open(latestApprovalRequest.value.public_url, '_blank')
  } else if (latestApprovalRequest.value?.token) {
    window.open(`/p/approval-request/${latestApprovalRequest.value.token}`, '_blank')
  }
}

// Compute comment count from item feedback if not provided as prop
const commentCount = computed(() => {
  if (props.commentCount > 0) {
    return props.commentCount
  }

  // Fallback: count from item.feedback if available
  // Counts ALL comments: both top-level comments and replies
  // Uses a Set to avoid double-counting if a reply appears both in the array and nested in replies
  if (props.item?.feedback && Array.isArray(props.item.feedback)) {
    const countedIds = new Set()

    const countComments = commentList => {
      let count = 0
      for (const comment of commentList) {
        // Skip if already counted (to avoid double-counting)
        if (countedIds.has(comment.id)) {
          continue
        }

        // Count this comment (whether it's top-level or a reply)
        count++
        countedIds.add(comment.id)

        // Count nested replies recursively
        if (comment.replies && comment.replies.length > 0) {
          count += countComments(comment.replies)
        }
      }
      return count
    }

    // Count all comments in the array (both top-level and replies)
    return countComments(props.item.feedback)
  }

  return 0
})

const getThumbnailUrl = () => {
  const item = props.item
  if (!item) return null

  const mediaType = item.type || item.file?.type

  // Priority order for thumbnails:
  // 1. Direct thumbnailUrl from media
  if (item.thumbnailUrl) {
    return item.thumbnailUrl
  }

  // 2. For videos, check file thumbnailUrl or metadata thumbnail
  if (mediaType === 'video') {
    if (item.file?.thumbnailUrl && item.file.thumbnailUrl !== item.file?.url) {
      return item.file.thumbnailUrl
    }
    if (item.file?.metadata?.thumbnail) {
      return item.file.metadata.thumbnail
    }
    // Fallback to video URL (will show video player)
    return item.file?.url || null
  }

  // 3. For images, use file URL or variants
  if (mediaType === 'image') {
    if (item.file?.variants?.thumb) {
      return item.file.variants.thumb
    }
    return item.file?.url || null
  }

  // 4. Fallback
  return item.file?.url || item.thumbnail || null
}
const updateImageSrc = async () => {
  const url = getThumbnailUrl()
  if (!url) {
    imageSrc.value = props.placeholderImage
    return
  }

  try {
    const displayUrl = await getMediaDisplayUrl(url, props.placeholderImage)
    imageSrc.value = displayUrl || props.placeholderImage
  } catch (error) {
    imageSrc.value = props.placeholderImage
  }
}

// Helper to check if image is already loaded (for cached images)
const checkImageLoaded = () => {
  // Use nextTick to ensure DOM is updated
  nextTick(() => {
    const img = imageElementRef.value || videoThumbnailRef.value
    if (img && img.complete && img.naturalHeight !== 0) {
      isImageLoaded.value = true
    }
  })
}

onMounted(() => {
  const url = getThumbnailUrl()
  if (url) {
    imageSrc.value = getMediaDisplayUrlSync(url, props.placeholderImage)
    updateImageSrc().then(() => {
      checkImageLoaded()
    })
  } else {
    imageSrc.value = props.placeholderImage
    checkImageLoaded()
  }
})

watch(
  () => [
    props.item?.thumbnailUrl,
    props.item?.file?.url,
    props.item?.file?.variants?.thumb,
    props.item?.file?.thumbnailUrl,
    props.item?.file?.metadata?.thumbnail,
    props.item?.url,
    props.item?.type,
    props.item?.file?.type,
  ],
  () => {
    isImageLoaded.value = false
    updateImageSrc().then(() => {
      checkImageLoaded()
    })
  },
  { immediate: true }
)

// Watch imageSrc changes to check if image is already loaded (for cached images)
watch(imageSrc, () => {
  if (imageSrc.value && imageSrc.value !== props.placeholderImage) {
    checkImageLoaded()
  }
})

onUnmounted(() => {
  if (imageSrc.value && imageSrc.value.startsWith('blob:')) {
    revokeMediaBlobUrl(imageSrc.value)
  }
})

const emit = defineEmits([
  'request-approval',
  'toggle-selection',
  'open-viewer',
  'view-details',
  'image-error',
  'open',
  'download',
  'move-copy',
  'copy-filenames',
  'set-as-cover',
  'rename',
  'replace',
  'remove-watermark',
  'watermark',
  'request-closure',
  'view-closure-history',
  'delete',
  'star-click',
])
</script>
