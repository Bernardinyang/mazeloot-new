<template>
  <div>
    <div
      :class="[
        'comment-item',
        {
          'is-reply': isReply,
          'has-replies': hasReplies,
          [`depth-${props.depth}`]: true,
        },
      ]"
    >
      <div class="flex gap-3">
        <!-- Avatar with size based on depth -->
        <div class="flex-shrink-0">
          <div
            :class="[
              'rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300 transition-all duration-200',
              avatarSizeClass,
            ]"
          >
            {{ getInitials(comment.createdBy) }}
          </div>
        </div>

        <!-- Comment Content -->
        <div :class="['flex-1 min-w-0', depthOpacity]">
          <!-- Header: Name + Timestamp + Video Timestamp Badge -->
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span
              :class="[
                'font-semibold text-gray-900 dark:text-gray-100',
                props.depth >= 4 ? 'text-xs' : props.depth >= 2 ? 'text-sm' : 'text-sm',
              ]"
            >
              {{ getAuthorName(comment.createdBy) }}
            </span>

            <!-- Video Timestamp Badge -->
            <button
              v-if="comment.timestamp !== null && comment.timestamp !== undefined && isVideo"
              :class="[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200',
                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                'hover:bg-blue-200 dark:hover:bg-blue-900/50',
              ]"
              @click="handleTimestampClick"
            >
              <Play class="w-3 h-3" />
              {{ formatTimestamp(comment.timestamp) }}
            </button>

            <!-- Edited Badge -->
            <span
              v-if="isEdited"
              :class="[
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
                'border border-amber-200 dark:border-amber-800/50',
              ]"
              title="This comment was edited"
            >
              <Pencil class="w-3 h-3" />
              Edited
            </span>

            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatRelativeTime(comment.createdAt) }}
            </span>
          </div>

          <!-- Comment Text -->
          <div
            v-if="!isEditing"
            :class="[
              'text-gray-900 dark:text-gray-100 leading-relaxed mb-2',
              props.depth >= 4 ? 'text-xs' : props.depth >= 2 ? 'text-sm' : 'text-sm',
            ]"
          >
            <span v-html="formatCommentContent(comment.content, comment.mentions)"></span>
          </div>

          <!-- Edit Input -->
          <div v-else class="mb-2">
            <Input
              v-model="editContent"
              :class="[
                'w-full text-sm',
                'bg-white dark:bg-gray-800',
                'border-gray-300 dark:border-gray-600',
                'text-gray-900 dark:text-gray-100',
              ]"
              @keydown.enter.exact="handleSaveEdit"
              @keydown.escape="cancelEdit"
            />
            <div class="flex gap-2 mt-2">
              <Button size="sm" variant="outline" @click="cancelEdit">Cancel</Button>
              <Button size="sm" :disabled="!editContent.trim()" @click="handleSaveEdit"
                >Save</Button
              >
            </div>
          </div>

          <!-- Actions -->
          <div :class="['flex items-center gap-3', props.depth >= 4 ? 'gap-2' : 'gap-4']">
            <button
              v-if="allowReply && props.depth < 6"
              :class="[
                'font-medium transition-colors duration-200',
                'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
                props.depth >= 4 ? 'text-[10px]' : 'text-xs',
              ]"
              @click="$emit('reply', comment)"
            >
              Reply
            </button>

            <!-- Edit Button (only if comment is mine and within 2 minutes) -->
            <button
              v-if="canEdit && !isEditing"
              :class="[
                'font-medium transition-colors duration-200',
                'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
                props.depth >= 4 ? 'text-[10px]' : 'text-xs',
              ]"
              @click.stop="startEdit"
            >
              Edit
            </button>

            <!-- Delete Button (only if comment is mine, no replies, and within 2 minutes) -->
            <button
              v-if="canDelete && !isEditing"
              :class="[
                'font-medium transition-colors duration-200',
                'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300',
                props.depth >= 4 ? 'text-[10px]' : 'text-xs',
              ]"
              @click.stop="handleDelete"
            >
              Delete
            </button>
          </div>

          <!-- Nested Replies -->
          <div v-if="hasReplies" class="mt-3">
            <!-- Collapsible button for deep nesting (levels 4-6) -->
            <button
              v-if="props.depth >= 3 && !isExpanded"
              :class="[
                'flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 mb-2',
                'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
              ]"
              @click="isExpanded = true"
            >
              <ChevronDown class="w-3.5 h-3.5" />
              <span
                >{{ comment.replies.length }}
                {{ comment.replies.length === 1 ? 'reply' : 'replies' }}</span
              >
            </button>

            <!-- Replies Container -->
            <div
              v-if="props.depth < 3 || isExpanded"
              :class="[
                'space-y-3',
                props.depth >= 6 ? 'pl-2' : props.depth >= 4 ? 'pl-3' : 'pl-4',
                props.depth >= 6
                  ? 'border-l border-gray-200/50 dark:border-gray-700/50'
                  : props.depth >= 4
                    ? 'border-l border-gray-200 dark:border-gray-700'
                    : 'border-l-2 border-gray-200 dark:border-gray-700',
              ]"
            >
              <CommentItem
                v-for="reply in comment.replies"
                :key="reply.id"
                :comment="reply"
                :is-reply="true"
                :depth="props.depth + 1"
                :is-video="isVideo"
                :allow-reply="allowReply && props.depth < 5"
                :guest-email="guestEmail"
                :creative-email="creativeEmail"
                @reply="$emit('reply', $event)"
                @seek-to-timestamp="$emit('seek-to-timestamp', $event)"
                @update="$emit('update', $event)"
                @delete="$emit('delete', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Play, ChevronDown, Pencil } from '@/shared/utils/lucideAnimated'
import { Input } from '@/shared/components/shadcn/input'
import { Button } from '@/shared/components/shadcn/button'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  isReply: {
    type: Boolean,
    default: false,
  },
  depth: {
    type: Number,
    default: 0,
  },
  isVideo: {
    type: Boolean,
    default: false,
  },
  allowReply: {
    type: Boolean,
    default: true,
  },
  guestEmail: {
    type: String,
    default: null,
  },
  creativeEmail: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['reply', 'seek-to-timestamp', 'update', 'delete'])

const isEditing = ref(false)
const editContent = ref('')
const isExpanded = ref(props.depth < 3) // Auto-expand for levels 0-2, collapse for 3+

const hasReplies = computed(() => {
  return props.comment.replies && props.comment.replies.length > 0
})

// Avatar size based on depth
const avatarSizeClass = computed(() => {
  if (props.depth >= 5) return 'w-6 h-6 text-xs'
  if (props.depth >= 3) return 'w-7 h-7 text-xs'
  return 'w-8 h-8 text-sm'
})

// Opacity based on depth for visual hierarchy
const depthOpacity = computed(() => {
  if (props.depth === 0) return 'opacity-100'
  if (props.depth === 1) return 'opacity-100'
  if (props.depth === 2) return 'opacity-95'
  if (props.depth === 3) return 'opacity-90'
  if (props.depth === 4) return 'opacity-85'
  if (props.depth >= 5) return 'opacity-80'
  return 'opacity-100'
})

const getAuthorName = createdBy => {
  if (!createdBy) {
    return props.guestEmail || 'Anonymous'
  }

  // Handle JSON string (if createdBy is stored as JSON string)
  let parsed = createdBy
  if (typeof createdBy === 'string') {
    // Check if it's a JSON string
    if (createdBy.startsWith('{') || createdBy.startsWith('[')) {
      try {
        parsed = JSON.parse(createdBy)
      } catch (e) {
        // If parsing fails, treat as regular email string
        return createdBy
      }
    } else {
      // Regular email string
      return createdBy
    }
  }

  // Now handle as object
  if (typeof parsed === 'object' && parsed !== null) {
    // Always show email if available, otherwise fall back to name
    return parsed.email || parsed.name || props.guestEmail || 'Anonymous'
  }

  return props.guestEmail || 'Anonymous'
}

// Check if comment is mine (created by guest email or creative email)
const isMyComment = computed(() => {
  const userEmail = props.creativeEmail || props.guestEmail
  if (!userEmail) return false
  const createdBy = props.comment.createdBy
  if (!createdBy) return false
  if (typeof createdBy === 'string') return createdBy === userEmail
  if (typeof createdBy === 'object') {
    return createdBy.email === userEmail
  }
  return false
})

// Track current time for 2-minute check
const currentTime = ref(new Date())

// Update current time every second to check if 2 minutes have passed
let timeInterval = null

onMounted(() => {
  // Update time every second to check if edit/delete should be disabled
  timeInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Check if comment is within 2 minutes
const isWithin2Minutes = computed(() => {
  if (!props.comment.createdAt) return false
  const createdAt = new Date(props.comment.createdAt)
  const diffMs = currentTime.value - createdAt
  const diffMins = diffMs / 60000
  return diffMins <= 2
})

// Can edit if it's my comment and within 2 minutes
const canEdit = computed(() => {
  return isMyComment.value && isWithin2Minutes.value
})

// Can delete if it's my comment, has no replies, and within 2 minutes
const canDelete = computed(() => {
  return isMyComment.value && !hasReplies.value && isWithin2Minutes.value
})

// Check if comment has been edited (updatedAt exists and is different from createdAt)
const isEdited = computed(() => {
  if (!props.comment.updatedAt || !props.comment.createdAt) {
    return false
  }
  const createdAt = new Date(props.comment.createdAt)
  const updatedAt = new Date(props.comment.updatedAt)
  // Consider edited if updatedAt is at least 1 second after createdAt
  return updatedAt.getTime() > createdAt.getTime() + 1000
})

const startEdit = () => {
  editContent.value = props.comment.content
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editContent.value = ''
}

const handleSaveEdit = () => {
  if (!editContent.value.trim()) return
  emit('update', {
    commentId: props.comment.id,
    content: editContent.value.trim(),
  })
  isEditing.value = false
  editContent.value = ''
}

const handleDelete = () => {
  emit('delete', props.comment.id)
}

const getInitials = createdBy => {
  const name = getAuthorName(createdBy)
  if (!name || name === 'Anonymous') return 'A'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const formatRelativeTime = dateString => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`

  return date.toLocaleDateString()
}

const formatTimestamp = seconds => {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleTimestampClick = () => {
  if (props.comment.timestamp !== null && props.comment.timestamp !== undefined) {
    emit('seek-to-timestamp', props.comment.timestamp)
  }
}

// Format comment content with styled mentions (timeline-style badges)
const formatCommentContent = (content, mentions) => {
  if (!content) return ''

  // Escape HTML first
  let formattedContent = escapeHtml(content)

  // If no mentions, return plain content
  if (!mentions || !Array.isArray(mentions) || mentions.length === 0) {
    return formattedContent
  }

  // Replace each mention with a styled badge (timeline-style)
  // Sort by length (longest first) to avoid partial matches
  const sortedMentions = [...mentions].sort((a, b) => b.length - a.length)

  sortedMentions.forEach(email => {
    // Escape email for regex
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Match @email followed by space, punctuation, or end of string
    const mentionRegex = new RegExp(`@${escapedEmail}(?=\\s|$|,|\\.|!|\\?|:|;)`, 'gi')

    formattedContent = formattedContent.replace(mentionRegex, match => {
      // Extract just the email part (without @)
      const emailPart = match.substring(1)
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 -my-0.5 rounded-md bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200/60 dark:border-purple-700/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">@${emailPart}</span>`
    })
  })

  return formattedContent
}

// Escape HTML to prevent XSS
const escapeHtml = text => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
</script>

<style scoped>
.comment-item {
  @apply py-2 transition-all duration-200;
}

.comment-item.is-reply {
  @apply py-1.5;
}

/* Visual hierarchy for different depths */
.comment-item.depth-0 {
  @apply py-3;
}

.comment-item.depth-1 {
  @apply py-2;
}

.comment-item.depth-2 {
  @apply py-1.5;
}

.comment-item.depth-3 {
  @apply py-1;
}

.comment-item.depth-4,
.comment-item.depth-5,
.comment-item.depth-6 {
  @apply py-0.5;
}

/* Smooth transitions for nested replies */
.comment-item.is-reply {
  animation: fadeIn 0.2s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
