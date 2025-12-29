<template>
  <div :class="['comment-item', { 'is-reply': isReply, 'has-replies': hasReplies }]">
    <div class="flex gap-3">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div
          class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300"
        >
          {{ getInitials(comment.createdBy) }}
        </div>
      </div>

      <!-- Comment Content -->
      <div class="flex-1 min-w-0">
        <!-- Header: Name + Timestamp + Video Timestamp Badge -->
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
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

          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatRelativeTime(comment.createdAt) }}
          </span>
        </div>

        <!-- Comment Text -->
        <div
          v-if="!isEditing"
          class="text-sm text-gray-900 dark:text-gray-100 leading-relaxed mb-2"
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
            <Button size="sm" :disabled="!editContent.trim()" @click="handleSaveEdit">Save</Button>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-4">
          <button
            v-if="allowReply"
            :class="[
              'text-xs font-medium transition-colors duration-200',
              'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
            ]"
            @click="$emit('reply', comment)"
          >
            Reply
          </button>

          <!-- Edit Button (only if comment is mine and within 2 minutes) -->
          <button
            v-if="canEdit && !isEditing"
            :class="[
              'text-xs font-medium transition-colors duration-200',
              'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
            ]"
            @click.stop="startEdit"
          >
            Edit
          </button>

          <!-- Delete Button (only if comment is mine, no replies, and within 2 minutes) -->
          <button
            v-if="canDelete && !isEditing"
            :class="[
              'text-xs font-medium transition-colors duration-200',
              'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300',
            ]"
            @click.stop="handleDelete"
          >
            Delete
          </button>
        </div>

        <!-- Nested Replies -->
        <div
          v-if="hasReplies"
          class="mt-4 space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
        >
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :is-reply="true"
            :is-video="isVideo"
            :allow-reply="allowReply"
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
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Play } from 'lucide-vue-next'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
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

const hasReplies = computed(() => {
  return props.comment.replies && props.comment.replies.length > 0
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
  if (confirm('Are you sure you want to delete this comment?')) {
    emit('delete', props.comment.id)
  }
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
  @apply py-2;
}

.comment-item.is-reply {
  @apply opacity-95;
}
</style>
