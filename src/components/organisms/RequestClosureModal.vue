<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent
      class="!fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 sm:max-w-[1200px] w-[95vw] max-w-[95vw] max-h-[90vh] p-0 flex flex-col overflow-hidden"
    >
      <DialogHeader
        class="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10"
      >
        <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Request Closure
        </DialogTitle>
        <DialogDescription class="text-sm mt-2 text-gray-600 dark:text-gray-400">
          Review client feedback and create action items before requesting closure for this media.
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 flex overflow-hidden min-h-[300px] md:min-h-[400px] flex-col md:flex-row">
        <!-- Comments Section (View Only) -->
        <div
          class="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50/30 dark:bg-gray-900/50 min-h-0"
        >
          <div
            class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-accent/20 dark:bg-accent/30 flex items-center justify-center shadow-sm"
              >
                <MessageSquare class="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Client Feedback
                </h3>
                <p
                  v-if="totalCommentCount > 0"
                  class="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                >
                  {{ totalCommentCount }}
                  {{ totalCommentCount === 1 ? 'comment' : 'comments' }} from clients
                </p>
                <p v-else class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  No comments yet
                </p>
              </div>
            </div>
            <div
              class="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            >
              <span class="text-xs font-medium text-blue-700 dark:text-blue-300">View Only</span>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            <div v-if="isLoadingComments" class="space-y-4">
              <div
                v-for="i in 3"
                :key="`skeleton-${i}`"
                class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4"
              >
                <div class="flex gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"
                  ></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div
                      class="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                    <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div
                      class="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else-if="comments.length === 0 && !isLoadingComments"
              class="flex flex-col items-center justify-center py-20 text-center px-4"
            >
              <div
                class="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-5 shadow-inner"
              >
                <MessageSquare class="w-12 h-12 text-gray-300 dark:text-gray-600" />
              </div>
              <p class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No client feedback yet
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                Clients haven't left any comments on this media item.
              </p>
            </div>

            <TransitionGroup v-else name="comment-list" tag="div" class="space-y-4">
              <div
                v-for="comment in topLevelComments"
                :key="comment.id"
                class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4"
              >
                <CommentItem
                  :comment="comment"
                  :is-video="isVideo"
                  :allow-reply="false"
                  :guest-email="null"
                  :creative-email="null"
                />
              </div>
            </TransitionGroup>
          </div>
        </div>

        <!-- Todos Section -->
        <div class="w-full md:w-1/2 flex flex-col bg-amber-50/30 dark:bg-amber-900/10 min-h-0">
          <div
            class="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-sm"
              >
                <CheckCircle2 class="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Action Items
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Create todos based on client feedback
                </p>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-5 py-5 space-y-3">
            <div
              v-if="todos.length === 0"
              class="flex flex-col items-center justify-center py-16 text-center"
            >
              <div
                class="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4"
              >
                <CheckCircle2 class="w-10 h-10 text-amber-400 dark:text-amber-600" />
              </div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                No action items yet
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-500">
                Add todos to track what needs to be done
              </p>
            </div>

            <TransitionGroup v-else name="todo-list" tag="div" class="space-y-3">
              <div
                v-for="(todo, index) in todos"
                :key="index"
                :class="[
                  'flex items-start gap-3 p-4 rounded-lg border transition-all',
                  todo.completed
                    ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
                    : 'bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-800/50 shadow-sm hover:shadow-md',
                ]"
              >
                <input
                  v-model="todo.completed"
                  type="checkbox"
                  :class="[
                    'mt-0.5 w-5 h-5 rounded border-2 cursor-pointer transition-all',
                    'text-amber-600 border-gray-300 dark:border-gray-600',
                    'focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
                    'checked:bg-amber-500 checked:border-amber-500',
                  ]"
                  @change="saveTodos"
                />
                <input
                  v-model="todo.text"
                  :class="[
                    'flex-1 bg-transparent border-none outline-none text-sm font-medium transition-all',
                    todo.completed
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-gray-100',
                  ]"
                  placeholder="What needs to be done?"
                  @blur="saveTodos"
                  @keydown.enter="saveTodos"
                />
                <button
                  class="flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  @click="removeTodo(index)"
                  title="Remove todo"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </TransitionGroup>

            <button
              class="w-full mt-4 p-4 text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-lg hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center justify-center gap-2"
              @click="addTodo"
            >
              <Plus class="w-4 h-4" />
              Add Action Item
            </button>
          </div>
        </div>
      </div>

      <DialogFooter
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50"
      >
        <Button
          variant="outline"
          :disabled="isSubmitting || isLoadingComments"
          @click="isOpen = false"
        >
          Cancel
        </Button>
        <Button
          :disabled="
            isLoadingComments ||
            todos.length === 0 ||
            todos.every(t => !t.text.trim())
          "
          :loading="isSubmitting"
          :icon="CheckCircle2"
          loading-label="Submitting..."
          variant="warning"
          @click="handleRequestClosure"
        >
          Request Closure
        </Button>
      </DialogFooter>

      <!-- Loading Overlay -->
      <div
        v-if="isSubmitting"
        class="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          <div class="flex flex-col items-center gap-3">
            <Loader2 class="w-8 h-8 animate-spin text-amber-500" />
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              Submitting request...
            </p>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { MessageSquare, CheckCircle2, X, Loader2, Plus } from 'lucide-vue-next'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import CommentItem from '@/components/molecules/CommentItem.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  mediaId: {
    type: String,
    required: true,
  },
  mediaItem: {
    type: Object,
    default: null,
  },
  comments: {
    type: Array,
    default: () => [],
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

const emit = defineEmits(['update:modelValue', 'request-closure'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const isLoadingComments = ref(false)
const isSubmitting = ref(false)

// Todos
const todos = ref([])

const addTodo = () => {
  todos.value.push({ text: '', completed: false })
}

const removeTodo = index => {
  todos.value.splice(index, 1)
  saveTodos()
}

const saveTodos = () => {
  if (props.mediaId) {
    localStorage.setItem(`todos_${props.mediaId}`, JSON.stringify(todos.value))
  }
}

const loadTodos = () => {
  if (props.mediaId) {
    const saved = localStorage.getItem(`todos_${props.mediaId}`)
    if (saved) {
      try {
        todos.value = JSON.parse(saved)
      } catch (e) {
        todos.value = []
      }
    }
  }
}

const handleRequestClosure = () => {
  isSubmitting.value = true
  emit('request-closure', {
    mediaId: props.mediaId,
    todos: todos.value,
  })
  // Note: The parent should handle closing the modal after successful submission
}

const totalCommentCount = computed(() => {
  const countedIds = new Set()
  const countComments = commentList => {
    let count = 0
    for (const comment of commentList) {
      if (countedIds.has(comment.id)) continue
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
  return props.comments.filter(comment => !comment.parentId && !comment.parent_id)
})

onMounted(() => {
  loadTodos()
  // Set loading state when modal opens if comments are not yet loaded
  if (!props.comments || props.comments.length === 0) {
    isLoadingComments.value = true
    setTimeout(() => {
      isLoadingComments.value = false
    }, 500)
  }
})

watch(
  () => props.mediaId,
  () => {
    loadTodos()
    isLoadingComments.value = true
    setTimeout(() => {
      isLoadingComments.value = false
    }, 300)
  }
)

watch(
  () => props.comments,
  () => {
    if (props.comments && props.comments.length > 0) {
      isLoadingComments.value = false
    }
  },
  { immediate: true }
)
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
  transform: translateY(10px);
}

.comment-list-move {
  transition: transform 0.3s ease;
}

.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.todo-list-move {
  transition: transform 0.3s ease;
}
</style>
