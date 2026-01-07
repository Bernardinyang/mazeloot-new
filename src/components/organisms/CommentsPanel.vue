<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-900">
    <!-- Header -->
    <div
      class="px-4 py-3.5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50"
    >
      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded-full bg-accent/20 dark:bg-accent/30 flex items-center justify-center"
        >
          <MessageSquare class="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Comments</h3>
          <p v-if="totalCommentCount > 0" class="text-xs text-gray-500 dark:text-gray-400">
            {{ totalCommentCount }} {{ totalCommentCount === 1 ? 'comment' : 'comments' }}
          </p>
        </div>
      </div>
      <button
        v-if="showCloseButton"
        class="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        @click.stop="$emit('close')"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Comments List -->
    <div ref="commentsListRef" class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 3" :key="`skeleton-${i}`" class="flex gap-3">
          <div
            class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"
          ></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="comments.length === 0 && !isLoading"
        class="flex flex-col items-center justify-center py-16 text-center px-4"
      >
        <div
          class="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4 shadow-inner"
        >
          <MessageSquare class="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">No comments yet</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
          Start the conversation by adding your first comment!
        </p>
      </div>

      <!-- Comments -->
      <TransitionGroup v-else name="comment-list" tag="div" class="space-y-4">
        <CommentItem
          v-for="comment in topLevelComments"
          :key="comment.id"
          :comment="comment"
          :is-video="isVideo"
          :allow-reply="allowReply"
          :guest-email="guestEmail"
          :creative-email="creativeEmail"
          @reply="handleReply"
          @seek-to-timestamp="handleSeekToTimestamp"
          @update="handleUpdateComment"
          @delete="handleDeleteComment"
        />
      </TransitionGroup>
    </div>

    <!-- Comment Disabled Message -->
    <div
      v-if="!allowReply"
      class="px-4 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
    >
      <div
        class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
      >
        <CheckCircle2 class="w-4 h-4 text-green-500" />
        <span
          >Comments and feedback are disabled. This media has been approved, rejected, or has a
          pending closure request.</span
        >
      </div>
    </div>

    <!-- Comment Input -->
    <div
      v-if="allowReply"
      class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
    >
      <!-- Video Timestamp Display -->
      <div
        v-if="isVideo && currentVideoTime !== null"
        class="mb-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
      >
        <Play class="w-3 h-3" />
        <span>Current time: {{ formatTimestamp(currentVideoTime) }}</span>
        <button
          class="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          @click="toggleTimestamp"
        >
          {{ selectedTimestamp !== null ? 'Remove timestamp' : 'Comment at this time' }}
        </button>
      </div>

      <!-- References (Timestamp and Mentions) -->
      <div
        v-if="selectedTimestamp !== null || mentionedEmails.length > 0"
        class="mb-3 flex flex-wrap gap-2"
      >
        <!-- Timestamp Reference Badge -->
        <div
          v-if="selectedTimestamp !== null"
          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium shadow-sm border border-blue-200 dark:border-blue-800/50"
        >
          <Play class="w-3.5 h-3.5" />
          <span class="font-semibold">{{ formatTimestamp(selectedTimestamp) }}</span>
          <button
            class="ml-1 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-md p-0.5 transition-colors"
            @click="removeTimestamp"
            aria-label="Remove timestamp"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Email Mention Badges -->
        <div
          v-for="(email, index) in mentionedEmails"
          :key="`mention-${index}`"
          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium shadow-sm border border-purple-200 dark:border-purple-800/50"
        >
          <span class="font-semibold">@{{ email }}</span>
          <button
            class="ml-1 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-md p-0.5 transition-colors"
            @click="removeMention(email)"
            :aria-label="`Remove mention ${email}`"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- Reply Indicator with Quoted Comment -->
      <div
        v-if="replyingTo"
        class="mb-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-sm"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <div
              class="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1.5 flex items-center gap-1"
            >
              <MessageSquare class="w-3 h-3" />
              Replying to {{ getAuthorName(replyingTo.createdBy) }}
            </div>
            <div
              class="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2 pl-4 border-l-2 border-blue-300 dark:border-blue-700"
            >
              "{{ replyingTo.content }}"
            </div>
          </div>
          <button
            class="flex-shrink-0 p-1 rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
            @click="cancelReply"
            aria-label="Cancel reply"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Input with Mention Dropdown -->
      <div class="relative flex gap-2">
        <div class="flex-1 relative" ref="inputWrapperRef">
          <Input
            ref="commentInputRef"
            v-model="newComment"
            :class="[
              'w-full',
              'bg-white dark:bg-gray-800',
              'border-gray-300 dark:border-gray-600',
              'text-gray-900 dark:text-gray-100',
            ]"
            :placeholder="replyingTo ? 'Write a reply...' : 'Add a comment...'"
            @keydown="handleKeyDown"
            @input="handleInput"
          />

          <!-- Email Mention Dropdown -->
          <div
            v-if="showMentionDropdown && availableEmails.length > 0"
            class="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 backdrop-blur-sm"
          >
            <div class="p-2 border-b border-gray-200 dark:border-gray-700">
              <p
                class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                Mention someone
              </p>
            </div>
            <div class="py-1">
              <div
                v-for="(email, index) in filteredEmails"
                :key="email"
                :class="[
                  'px-3 py-2 cursor-pointer text-sm transition-colors',
                  selectedMentionIndex === index
                    ? 'bg-accent/10 dark:bg-accent/20 text-accent'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300',
                ]"
                @click="selectMention(email)"
                @mouseenter="selectedMentionIndex = index"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-semibold"
                  >
                    {{ email.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-medium">{{ email }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button
          :disabled="!canSubmit || isSubmitting"
          :class="[
            'bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg light:hover:text-white',
            'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:scale-105 active:scale-95',
          ]"
          @click="handleSubmit"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin mr-1.5" />
          <span v-else class="font-medium">Post</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { MessageSquare, Play, Loader2, X, CheckCircle2 } from 'lucide-vue-next'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import CommentItem from '@/components/molecules/CommentItem.vue'

const props = defineProps({
  mediaId: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    default: () => [],
  },
  isVideo: {
    type: Boolean,
    default: false,
  },
  currentVideoTime: {
    type: Number,
    default: null,
  },
  allowReply: {
    type: Boolean,
    default: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  guestEmail: {
    type: String,
    default: null,
  },
  creativeEmail: {
    type: String,
    default: null,
  },
  showCloseButton: {
    type: Boolean,
    default: false,
  },
  allowedEmails: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'add-comment',
  'seek-to-timestamp',
  'update-comment',
  'delete-comment',
  'close',
])

const newComment = ref('')
const replyingTo = ref(null)
const useCurrentTimestamp = ref(false)
const selectedTimestamp = ref(null) // Store selected timestamp for reference badge
const mentionedEmails = ref([]) // Store mentioned emails
const isSubmitting = ref(false)
const commentsListRef = ref(null)
const commentInputRef = ref(null)
const inputWrapperRef = ref(null)
const showMentionDropdown = ref(false)
const mentionQuery = ref('')
const selectedMentionIndex = ref(0)

const totalCommentCount = computed(() => {
  const countedIds = new Set()

  const countComments = commentList => {
    let count = 0
    for (const comment of commentList) {
      if (countedIds.has(comment.id)) {
        continue
      }

      count++
      countedIds.add(comment.id)

      if (comment.replies && comment.replies.length > 0) {
        count += countComments(comment.replies)
      }
    }
    return count
  }

  return countComments(props.comments)
})

const topLevelComments = computed(() => {
  return props.comments.filter(comment => !comment.parentId)
})

const scrollToBottom = () => {
  if (commentsListRef.value) {
    setTimeout(() => {
      commentsListRef.value.scrollTop = commentsListRef.value.scrollHeight
    }, 100)
  }
}

// Only allow submission if reply is allowed and there's content
const canSubmit = computed(() => {
  if (!props.allowReply) return false
  return newComment.value.trim().length > 0
})

const getAuthorName = createdBy => {
  if (!createdBy) return 'Anonymous'

  let parsed = createdBy
  if (typeof createdBy === 'string') {
    if (createdBy.startsWith('{') || createdBy.startsWith('[')) {
      try {
        parsed = JSON.parse(createdBy)
      } catch (e) {
        return createdBy
      }
    } else {
      return createdBy
    }
  }

  if (typeof parsed === 'object' && parsed !== null) {
    return parsed.email || parsed.name || 'Anonymous'
  }

  return 'Anonymous'
}

const formatTimestamp = seconds => {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const availableEmails = computed(() => {
  const emails = new Set()

  // Add allowed emails from proofing
  if (props.allowedEmails && Array.isArray(props.allowedEmails)) {
    props.allowedEmails.forEach(email => {
      if (email && typeof email === 'string' && email.trim() && email.includes('@')) {
        emails.add(email.trim().toLowerCase())
      }
    })
  }

  // Extract emails from existing comments
  const extractEmails = commentList => {
    commentList.forEach(comment => {
      if (comment.createdBy) {
        const email = getAuthorEmail(comment.createdBy)
        if (email && email !== 'Anonymous') {
          emails.add(email.toLowerCase())
        }
      }
      if (comment.replies && comment.replies.length > 0) {
        extractEmails(comment.replies)
      }
    })
  }

  extractEmails(props.comments)
  return Array.from(emails).sort()
})

const filteredEmails = computed(() => {
  if (!mentionQuery.value) return availableEmails.value
  const query = mentionQuery.value.toLowerCase()
  return availableEmails.value.filter(
    email => email.toLowerCase().includes(query) && !mentionedEmails.value.includes(email)
  )
})

const getAuthorEmail = createdBy => {
  if (!createdBy) return null

  let parsed = createdBy
  if (typeof createdBy === 'string') {
    if (createdBy.startsWith('{') || createdBy.startsWith('[')) {
      try {
        parsed = JSON.parse(createdBy)
      } catch (e) {
        return createdBy.includes('@') ? createdBy : null
      }
    } else {
      return createdBy.includes('@') ? createdBy : null
    }
  }

  if (typeof parsed === 'object' && parsed !== null) {
    return parsed.email || null
  }

  return null
}

const handleInput = event => {
  const value = event.target.value
  const cursorPos = event.target.selectionStart
  const textBeforeCursor = value.substring(0, cursorPos)
  const lastAtIndex = textBeforeCursor.lastIndexOf('@')

  if (lastAtIndex !== -1) {
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1)
    if (textAfterAt.includes(' ') || textAfterAt.includes('\n')) {
      showMentionDropdown.value = false
      mentionQuery.value = ''
    } else {
      mentionQuery.value = textAfterAt
      showMentionDropdown.value = true
      selectedMentionIndex.value = 0
    }
  } else {
    showMentionDropdown.value = false
    mentionQuery.value = ''
  }
}

const handleKeyDown = event => {
  if (showMentionDropdown.value && filteredEmails.value.length > 0) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      selectedMentionIndex.value = Math.min(
        selectedMentionIndex.value + 1,
        filteredEmails.value.length - 1
      )
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      selectedMentionIndex.value = Math.max(selectedMentionIndex.value - 1, 0)
    } else if (event.key === 'Enter' && filteredEmails.value.length > 0) {
      event.preventDefault()
      selectMention(filteredEmails.value[selectedMentionIndex.value])
    } else if (event.key === 'Escape') {
      showMentionDropdown.value = false
      mentionQuery.value = ''
    } else if (event.key === 'Enter' && !event.shiftKey) {
      if (!showMentionDropdown.value) {
        handleSubmit()
      }
    } else if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()
      newComment.value += '\n'
    }
  } else {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

const selectMention = email => {
  if (!mentionedEmails.value.includes(email)) {
    mentionedEmails.value.push(email)
  }

  const value = newComment.value
  const cursorPos = commentInputRef.value?.selectionStart || value.length
  const textBeforeCursor = value.substring(0, cursorPos)
  const lastAtIndex = textBeforeCursor.lastIndexOf('@')

  if (lastAtIndex !== -1) {
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1)
    const newValue = value.substring(0, lastAtIndex + 1) + email + ' ' + value.substring(cursorPos)

    newComment.value = newValue

    nextTick(() => {
      if (commentInputRef.value) {
        const newCursorPos = lastAtIndex + 1 + email.length + 1
        commentInputRef.value.setSelectionRange(newCursorPos, newCursorPos)
        commentInputRef.value.focus()
      }
    })
  }

  showMentionDropdown.value = false
  mentionQuery.value = ''
}

const toggleTimestamp = () => {
  if (selectedTimestamp.value !== null) {
    selectedTimestamp.value = null
    useCurrentTimestamp.value = false
  } else {
    if (props.currentVideoTime !== null) {
      selectedTimestamp.value = props.currentVideoTime
      useCurrentTimestamp.value = true
    }
  }
}

const removeTimestamp = () => {
  selectedTimestamp.value = null
  useCurrentTimestamp.value = false
}

const removeMention = email => {
  mentionedEmails.value = mentionedEmails.value.filter(e => e !== email)
  const regex = new RegExp(`@${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g')
  newComment.value = newComment.value.replace(regex, '')
}

const handleReply = comment => {
  replyingTo.value = comment
  // Focus input after DOM update
  nextTick(() => {
    // Try to focus the native input element within the Input component
    if (inputWrapperRef.value) {
      const nativeInput = inputWrapperRef.value.querySelector('input')
      if (nativeInput && typeof nativeInput.focus === 'function') {
        nativeInput.focus()
        return
      }
    }

    // Fallback: Try focusing the component directly if it exposes focus method
    if (commentInputRef.value && typeof commentInputRef.value.focus === 'function') {
      commentInputRef.value.focus()
    }
  })
}

const cancelReply = () => {
  replyingTo.value = null
}

const handleSubmit = async () => {
  if (!canSubmit.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const commentData = {
      type: 'text',
      content: newComment.value.trim(),
      parentId: replyingTo.value?.id || null,
      timestamp: selectedTimestamp.value !== null ? selectedTimestamp.value : null,
      mentions: mentionedEmails.value.length > 0 ? [...mentionedEmails.value] : null, // Include mentions
      createdBy: props.creativeEmail || props.guestEmail || null,
    }

    await emit('add-comment', commentData)

    newComment.value = ''
    replyingTo.value = null
    useCurrentTimestamp.value = false
    selectedTimestamp.value = null
    mentionedEmails.value = []
    showMentionDropdown.value = false
    mentionQuery.value = ''

    scrollToBottom()
  } catch (error) {
    // Silently handle error
  } finally {
    isSubmitting.value = false
  }
}

const handleUpdateComment = ({ commentId, content }) => {
  emit('update-comment', { commentId, content })
}

const handleDeleteComment = commentId => {
  emit('delete-comment', commentId)
}

const previousCommentCount = ref(0)

watch(
  () => props.comments,
  newComments => {
    const currentCount = totalCommentCount.value
    if (currentCount > previousCommentCount.value) {
      setTimeout(() => {
        scrollToBottom()
      }, 200)
    }
    previousCommentCount.value = currentCount
  },
  { deep: true, immediate: true }
)

const handleSeekToTimestamp = timestamp => {
  emit('seek-to-timestamp', timestamp)
}
</script>

<style scoped>
.comment-list-enter-active,
.comment-list-leave-active {
  transition: all 0.3s ease;
}

.comment-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.comment-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.comment-list-move {
  transition: transform 0.3s ease;
}
</style>
