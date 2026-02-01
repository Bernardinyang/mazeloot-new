<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent class="sm:max-w-3xl max-h-[90vh] flex flex-col p-0">
      <DialogHeader
        class="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/20 dark:to-gray-900/10"
      >
        <DialogTitle
          class="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2"
        >
          <History class="h-6 w-6 text-gray-600 dark:text-gray-400" />
          Closure Request History
        </DialogTitle>
        <DialogDescription class="text-sm mt-2 text-gray-600 dark:text-gray-400">
          View all closure requests for this media item. If the client doesn't respond, resend the
          email or cancel the request to send a new one later.
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto px-6 py-4">
        <div v-if="closureRequests.length === 0" class="text-center py-12">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
          >
            <History class="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p class="text-gray-500 dark:text-gray-400 font-medium">No closure requests yet</p>
          <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Closure requests will appear here once created
          </p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="(request, index) in closureRequests" :key="request.uuid" class="relative">
            <!-- Timeline connector -->
            <div
              v-if="index < closureRequests.length - 1"
              class="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
            />

            <!-- Request Card -->
            <div
              class="relative bg-white dark:bg-gray-800 rounded-xl border-2 shadow-sm transition-all hover:shadow-md"
              :class="
                request.status === 'approved'
                  ? 'border-green-200 dark:border-green-800/50 bg-green-50/30 dark:bg-green-900/10'
                  : request.status === 'rejected'
                    ? 'border-red-200 dark:border-red-800/50 bg-red-50/30 dark:bg-red-900/10'
                    : request.status === 'cancelled'
                      ? 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50'
                      : 'border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-900/10'
              "
            >
              <div class="p-5">
                <!-- Header -->
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <!-- Status Icon -->
                    <div
                      class="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 shadow-sm"
                      :class="
                        request.status === 'approved'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : request.status === 'rejected'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : request.status === 'cancelled'
                              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      "
                    >
                      <CheckCircle2 v-if="request.status === 'approved'" class="h-6 w-6" />
                      <X v-else-if="request.status === 'rejected'" class="h-6 w-6" />
                      <Clock v-else-if="request.status === 'pending'" class="h-6 w-6" />
                      <X v-else class="h-6 w-6" />
                    </div>

                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                          :class="
                            request.status === 'approved'
                              ? 'bg-green-500 text-white'
                              : request.status === 'rejected'
                                ? 'bg-red-500 text-white'
                                : request.status === 'cancelled'
                                  ? 'bg-gray-500 text-white'
                                  : 'bg-amber-500 text-white'
                          "
                        >
                          {{ request.status }}
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {{ formatDate(request.created_at) }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        Request #{{ closureRequests.length - index }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      v-if="request.status === 'pending'"
                      type="button"
                      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors disabled:opacity-50"
                      :disabled="resendingRequestUuid === request.uuid || cancellingRequestUuid === request.uuid"
                      @click="handleResend(request)"
                    >
                      <Mail
                        v-if="resendingRequestUuid !== request.uuid"
                        class="h-3.5 w-3.5"
                      />
                      <Loader2
                        v-else
                        class="h-3.5 w-3.5 animate-spin"
                      />
                      Resend email
                    </button>
                    <button
                      v-if="request.status === 'pending'"
                      type="button"
                      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
                      :disabled="resendingRequestUuid === request.uuid || cancellingRequestUuid === request.uuid"
                      @click="handleCancel(request)"
                    >
                      <X
                        v-if="cancellingRequestUuid !== request.uuid"
                        class="h-3.5 w-3.5"
                      />
                      <Loader2
                        v-else
                        class="h-3.5 w-3.5 animate-spin"
                      />
                      Cancel request
                    </button>
                    <a
                      v-if="request.public_url || request.token"
                      :href="request.public_url || closureRequestUrl(request.token)"
                      class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <ExternalLink class="h-3.5 w-3.5" />
                      View Request
                    </a>
                  </div>
                </div>

                <!-- Action Items -->
                <div v-if="request.todos && request.todos.length > 0" class="mb-4">
                  <button
                    class="flex items-center justify-between w-full mb-2 group"
                    @click="toggleTodos(request.uuid)"
                  >
                    <div class="flex items-center gap-2">
                      <ListChecks class="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Action Items ({{ request.todos.length }})
                      </p>
                    </div>
                    <ChevronDown
                      :class="[
                        'h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200',
                        expandedTodos[request.uuid] ? 'rotate-180' : '',
                      ]"
                    />
                  </button>
                  <Transition
                    enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="opacity-0 max-h-0"
                    enter-to-class="opacity-100 max-h-[500px]"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 max-h-[500px]"
                    leave-to-class="opacity-0 max-h-0"
                  >
                    <div
                      v-if="expandedTodos[request.uuid]"
                      class="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2 max-h-[300px] overflow-y-auto"
                    >
                      <div
                        v-for="(todo, todoIndex) in request.todos"
                        :key="todoIndex"
                        class="flex items-start gap-2.5 text-sm"
                      >
                        <CheckCircle2
                          :class="[
                            'w-4 h-4 mt-0.5 flex-shrink-0',
                            todo.completed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-300 dark:text-gray-600',
                          ]"
                          :fill="todo.completed ? 'currentColor' : 'none'"
                        />
                        <span
                          :class="
                            todo.completed
                              ? 'line-through text-gray-400 dark:text-gray-500'
                              : 'text-gray-700 dark:text-gray-300'
                          "
                        >
                          {{ todo.text }}
                        </span>
                      </div>
                    </div>
                  </Transition>
                </div>

                <!-- Status Details -->
                <div class="space-y-2">
                  <!-- Approved Details -->
                  <div
                    v-if="request.status === 'approved' && request.approved_by_email"
                    class="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50"
                  >
                    <CheckCircle2
                      class="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0"
                    />
                    <div class="flex-1">
                      <p class="text-xs font-medium text-green-800 dark:text-green-300">
                        Approved by {{ request.approved_by_email }}
                      </p>
                      <p
                        v-if="request.approved_at"
                        class="text-xs text-green-600 dark:text-green-400 mt-0.5"
                      >
                        {{ formatDate(request.approved_at) }}
                      </p>
                    </div>
                  </div>

                  <!-- Rejected Details -->
                  <div v-if="request.status === 'rejected'">
                    <div
                      v-if="request.rejected_by_email"
                      class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50 mb-2"
                    >
                      <X class="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <div class="flex-1">
                        <p class="text-xs font-medium text-red-800 dark:text-red-300">
                          Rejected by {{ request.rejected_by_email }}
                        </p>
                        <p
                          v-if="request.rejected_at"
                          class="text-xs text-red-600 dark:text-red-400 mt-0.5"
                        >
                          {{ formatDate(request.rejected_at) }}
                        </p>
                      </div>
                    </div>
                    <div
                      v-if="request.rejection_reason"
                      class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/50"
                    >
                      <p class="text-xs font-semibold text-red-800 dark:text-red-300 mb-1.5">
                        Rejection Reason:
                      </p>
                      <p class="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                        {{ request.rejection_reason }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20"
      >
        <Button variant="outline" @click="isOpen = false">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  History,
  ListChecks,
  Loader2,
  Mail,
  X,
  ExternalLink,
} from '@/shared/utils/lucideAnimated'
import { useProofingApi } from '@/domains/memora/api/proofing'
import { toast } from '@/shared/utils/toast'
import { closureRequestUrl } from '@/shared/utils/memoraPublicUrls'
import { Button } from '@/shared/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  closureRequests: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const proofingApi = useProofingApi()
const resendingRequestUuid = ref(null)
const cancellingRequestUuid = ref(null)

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const expandedTodos = ref({})

const handleResend = async request => {
  if (!request?.uuid || resendingRequestUuid.value) return
  resendingRequestUuid.value = request.uuid
  try {
    await proofingApi.resendClosureRequest(request.uuid)
    toast.success('Closure request email resent to client.')
    emit('resend-done')
  } catch (error) {
    toast.apiError(error, 'Failed to resend email')
  } finally {
    resendingRequestUuid.value = null
  }
}

const handleCancel = async request => {
  if (!request?.uuid || cancellingRequestUuid.value) return
  if (!confirm('Cancel this closure request? You can send a new request afterward if the client becomes available.')) return
  cancellingRequestUuid.value = request.uuid
  try {
    await proofingApi.cancelClosureRequest(request.uuid)
    toast.success('Closure request cancelled. You can send a new request when ready.')
    emit('resend-done')
  } catch (error) {
    toast.apiError(error, 'Failed to cancel request')
  } finally {
    cancellingRequestUuid.value = null
  }
}

const toggleTodos = requestUuid => {
  expandedTodos.value[requestUuid] = !expandedTodos.value[requestUuid]
}

// Auto-expand first request's todos by default
const autoExpandFirst = () => {
  if (props.closureRequests.length > 0 && !expandedTodos.value[props.closureRequests[0].uuid]) {
    expandedTodos.value[props.closureRequests[0].uuid] = true
  }
}

// Watch for closure requests changes
watch(
  () => props.closureRequests,
  () => {
    autoExpandFirst()
  },
  { immediate: true }
)

const formatDate = date => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Today at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'Yesterday at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays < 7) {
    return (
      d.toLocaleDateString('en-US', { weekday: 'short' }) +
      ' at ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
  } else {
    return (
      d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      }) +
      ' at ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    )
  }
}
</script>
