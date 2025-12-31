<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogContent class="sm:max-w-6xl max-h-[90vh] flex flex-col p-0">
      <!-- Enhanced Header -->
      <DialogHeader
        class="px-6 pt-6 pb-5 border-b bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/20 dark:to-gray-900/10"
        :class="theme.borderSecondary"
      >
        <div class="flex items-start gap-6">
          <!-- Preview Image -->
          <div v-if="revisionPreviewUrl" class="flex-shrink-0">
            <div
              class="relative w-24 h-24 rounded-xl overflow-hidden border-2 shadow-lg group cursor-pointer"
              :class="theme.borderSecondary"
              @click="handleViewRevision"
            >
              <img
                :src="revisionPreviewUrl"
                :alt="revision?.filename || 'Revision preview'"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center"
              >
                <Eye
                  class="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          <!-- Title and Meta -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <DialogTitle :class="theme.textPrimary" class="text-2xl font-bold">
                Revision {{ revision?.revisionNumber || revision?.revision_number || 'Original' }}
              </DialogTitle>
              <span
                v-if="revision?.isCompleted || revision?.is_completed"
                class="px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-1.5"
              >
                <CheckCircle2 class="h-3.5 w-3.5" />
                Approved
              </span>
              <span
                v-else-if="revision?.isRevised || revision?.is_revised"
                class="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 flex items-center gap-1.5"
              >
                <History class="h-3.5 w-3.5" />
                Revised
              </span>
            </div>
            <DialogDescription :class="theme.textSecondary" class="text-sm mb-3">
              {{ revision?.filename || revision?.file?.filename || 'Media revision information' }}
            </DialogDescription>
            <div class="flex items-center gap-4 text-xs" :class="theme.textSecondary">
              <span class="flex items-center gap-1.5">
                <Clock class="h-3.5 w-3.5" />
                {{ formatDate(revision?.createdAt || revision?.created_at) }}
              </span>
              <span
                v-if="revision?.revisionDescription || revision?.revision_description"
                class="flex items-center gap-1.5"
              >
                <Info class="h-3.5 w-3.5" />
                Has description
              </span>
            </div>
          </div>
        </div>
      </DialogHeader>

      <!-- Enhanced Tabs -->
      <div class="px-6 pt-5 pb-0 border-b bg-white dark:bg-gray-900" :class="theme.borderSecondary">
        <div class="flex gap-2 overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'px-5 py-3 text-sm font-medium transition-all rounded-t-lg relative flex items-center gap-2 whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-b-2 border-teal-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="h-4 w-4 flex-shrink-0" />
            <span>{{ tab.label }}</span>
            <span
              v-if="getTabCount(tab.id) > 0"
              :class="[
                'px-2 py-0.5 rounded-full text-xs font-semibold min-w-[20px] text-center',
                activeTab === tab.id
                  ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
              ]"
            >
              {{ getTabCount(tab.id) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/50 dark:bg-gray-950/50">
        <!-- Feedbacks Tab -->
        <div v-if="activeTab === 'feedbacks'" class="max-w-4xl mx-auto">
          <div v-if="isLoadingFeedbacks" class="flex flex-col items-center justify-center py-20">
            <Loader2 class="h-10 w-10 animate-spin mb-4" :class="theme.textSecondary" />
            <span :class="theme.textSecondary" class="text-sm">Loading comments...</span>
          </div>
          <div v-else-if="revisionFeedbacks.length === 0" class="text-center py-20">
            <div
              class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
            >
              <MessageSquare class="h-10 w-10" :class="theme.textTertiary" />
            </div>
            <p :class="theme.textPrimary" class="text-lg font-semibold mb-2">No comments</p>
            <p :class="theme.textSecondary" class="text-sm">
              No comments or feedback for this revision.
            </p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="comment in revisionFeedbacks"
              :key="comment.id || comment.uuid"
              class="p-5 rounded-xl border transition-all hover:shadow-lg"
              :class="[theme.borderSecondary, theme.bgCardSolid]"
            >
              <div class="flex items-start gap-4">
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-md"
                >
                  <span class="text-white text-sm font-bold">
                    {{ getAuthorInitial(comment.createdBy || comment.created_by) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <span :class="theme.textPrimary" class="text-sm font-semibold">
                      {{ getAuthorName(comment.createdBy || comment.created_by) }}
                    </span>
                    <span :class="theme.textTertiary" class="text-xs">
                      {{ formatDate(comment.createdAt || comment.created_at) }}
                    </span>
                  </div>
                  <p :class="theme.textPrimary" class="text-sm leading-relaxed whitespace-pre-wrap">
                    {{ comment.content }}
                  </p>
                  <div
                    v-if="comment.replies && comment.replies.length > 0"
                    class="mt-5 ml-3 space-y-4 border-l-2 pl-5"
                    :class="theme.borderSecondary"
                  >
                    <div
                      v-for="reply in comment.replies"
                      :key="reply.id || reply.uuid"
                      class="flex items-start gap-3"
                    >
                      <div
                        class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                      >
                        <span :class="theme.textSecondary" class="text-xs font-medium">
                          {{ getAuthorInitial(reply.createdBy || reply.created_by) }}
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <span :class="theme.textPrimary" class="text-xs font-semibold">
                            {{ getAuthorName(reply.createdBy || reply.created_by) }}
                          </span>
                          <span :class="theme.textTertiary" class="text-xs">
                            {{ formatDate(reply.createdAt || reply.created_at) }}
                          </span>
                        </div>
                        <p
                          :class="theme.textSecondary"
                          class="text-xs leading-relaxed whitespace-pre-wrap"
                        >
                          {{ reply.content }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Todo Tab -->
        <div v-if="activeTab === 'todo'" class="max-w-4xl mx-auto">
          <div v-if="isLoadingTodos" class="flex flex-col items-center justify-center py-20">
            <Loader2 class="h-10 w-10 animate-spin mb-4" :class="theme.textSecondary" />
            <span :class="theme.textSecondary" class="text-sm">Loading todos...</span>
          </div>
          <div v-else-if="revisionTodos.length === 0" class="text-center py-20">
            <div
              class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
            >
              <CheckCircle2 class="h-10 w-10" :class="theme.textTertiary" />
            </div>
            <p :class="theme.textPrimary" class="text-lg font-semibold mb-2">No action items</p>
            <p :class="theme.textSecondary" class="text-sm">
              No todos were marked as completed in this revision.
            </p>
          </div>
          <div v-else class="space-y-4">
            <div
              class="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 mb-6"
            >
              <div class="flex items-start gap-3">
                <Info class="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p :class="theme.textPrimary" class="text-sm font-semibold mb-1">
                    Action items completed in this revision
                  </p>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    These are the todos that were marked as completed when this revision was
                    uploaded.
                  </p>
                </div>
              </div>
            </div>
            <div class="grid gap-3">
              <div
                v-for="(todo, index) in revisionTodos"
                :key="index"
                class="flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-md"
                :class="[
                  theme.borderSecondary,
                  theme.bgCardSolid,
                  typeof todo === 'object' && todo?.completed
                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
                    : '',
                ]"
              >
                <CheckCircle2
                  :class="[
                    'w-6 h-6 mt-0.5 flex-shrink-0',
                    (typeof todo === 'object' && todo?.completed) || false
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-300 dark:text-gray-600',
                  ]"
                  :fill="typeof todo === 'object' && todo?.completed ? 'currentColor' : 'none'"
                />
                <div class="flex-1 min-w-0">
                  <span
                    :class="[
                      'text-sm block',
                      typeof todo === 'object' && todo?.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : theme.textPrimary,
                    ]"
                  >
                    {{
                      typeof todo === 'string'
                        ? todo
                        : todo?.text || todo?.content || JSON.stringify(todo)
                    }}
                  </span>
                  <p
                    v-if="typeof todo === 'object' && todo?.completed"
                    :class="theme.textSecondary"
                    class="text-xs mt-1.5 flex items-center gap-1.5"
                  >
                    <CheckCircle2 class="h-3 w-3" />
                    Completed in this revision
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Closure Request Tab -->
        <div v-if="activeTab === 'closure'" class="max-w-4xl mx-auto">
          <div v-if="isLoadingClosure" class="flex flex-col items-center justify-center py-20">
            <Loader2 class="h-10 w-10 animate-spin mb-4" :class="theme.textSecondary" />
            <span :class="theme.textSecondary" class="text-sm">Loading closure requests...</span>
          </div>
          <div v-else-if="closureRequests.length === 0" class="text-center py-20">
            <div
              class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
            >
              <Clock class="h-10 w-10" :class="theme.textTertiary" />
            </div>
            <p :class="theme.textPrimary" class="text-lg font-semibold mb-2">No closure requests</p>
            <p :class="theme.textSecondary" class="text-sm">
              No closure requests for this revision.
            </p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="request in closureRequests"
              :key="request.uuid"
              class="p-6 rounded-xl border-2 transition-all hover:shadow-xl"
              :class="[
                theme.borderSecondary,
                request.status === 'approved'
                  ? 'bg-green-50/50 dark:bg-green-900/10 border-green-300 dark:border-green-800/50'
                  : request.status === 'rejected'
                    ? 'bg-red-50/50 dark:bg-red-900/10 border-red-300 dark:border-red-800/50'
                    : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-800/50',
              ]"
            >
              <div class="flex items-start justify-between mb-5">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                    :class="
                      request.status === 'approved'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : request.status === 'rejected'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-amber-100 dark:bg-amber-900/30'
                    "
                  >
                    <CheckCircle2
                      v-if="request.status === 'approved'"
                      class="h-6 w-6 text-green-600 dark:text-green-400"
                    />
                    <X
                      v-else-if="request.status === 'rejected'"
                      class="h-6 w-6 text-red-600 dark:text-red-400"
                    />
                    <Clock v-else class="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div class="flex items-center gap-3 mb-1.5">
                      <span
                        class="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide"
                        :class="
                          request.status === 'approved'
                            ? 'bg-green-500 text-white'
                            : request.status === 'rejected'
                              ? 'bg-red-500 text-white'
                              : 'bg-amber-500 text-white'
                        "
                      >
                        {{ request.status }}
                      </span>
                      <span :class="theme.textSecondary" class="text-xs">
                        {{ formatDate(request.created_at) }}
                      </span>
                    </div>
                    <p :class="theme.textTertiary" class="text-xs">Closure Request</p>
                  </div>
                </div>
                <a
                  v-if="request.public_url"
                  :href="request.public_url"
                  target="_blank"
                  class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <ExternalLink class="h-3.5 w-3.5" />
                  View Request
                </a>
              </div>
              <div v-if="request.todos && request.todos.length > 0" class="mt-5">
                <p
                  :class="theme.textSecondary"
                  class="text-xs font-semibold mb-3 uppercase tracking-wide"
                >
                  Action Items
                </p>
                <div class="grid gap-2">
                  <div
                    v-for="(todo, todoIndex) in request.todos"
                    :key="todoIndex"
                    class="flex items-start gap-3 p-3 rounded-lg"
                    :class="
                      todo.completed
                        ? 'bg-green-50/50 dark:bg-green-900/10'
                        : 'bg-gray-50 dark:bg-gray-900/20'
                    "
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
                      :class="[
                        'text-sm flex-1',
                        todo.completed
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : theme.textPrimary,
                      ]"
                    >
                      {{ todo.text }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                v-if="request.rejection_reason"
                class="mt-5 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50"
              >
                <p
                  :class="theme.textSecondary"
                  class="text-xs font-semibold mb-2 uppercase tracking-wide"
                >
                  Rejection Reason
                </p>
                <p :class="theme.textPrimary" class="text-sm leading-relaxed">
                  {{ request.rejection_reason }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Tab -->
        <div v-if="activeTab === 'details'" class="max-w-5xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Media Preview - Full Width on Mobile, 2 columns on Desktop -->
            <div v-if="revisionPreviewUrl" class="lg:col-span-2">
              <div
                class="relative rounded-xl overflow-hidden border-2 shadow-xl"
                :class="theme.borderSecondary"
              >
                <img
                  :src="revisionPreviewUrl"
                  :alt="revision?.filename || 'Revision preview'"
                  class="w-full h-auto max-h-[500px] object-contain bg-gray-50 dark:bg-gray-900"
                  @click="handleViewRevision"
                />
                <div class="absolute top-4 right-4">
                  <button
                    class="p-2 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-sm text-white transition-all"
                    @click="handleViewRevision"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Revision Info Sidebar -->
            <div class="lg:col-span-1 space-y-6">
              <!-- Revision Information Card -->
              <div
                class="p-5 rounded-xl border"
                :class="[theme.borderSecondary, theme.bgCardSolid]"
              >
                <h3
                  :class="theme.textPrimary"
                  class="text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2"
                >
                  <Info class="h-4 w-4" />
                  Revision Info
                </h3>
                <div class="space-y-4">
                  <div>
                    <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">
                      Revision Number
                    </p>
                    <p :class="theme.textPrimary" class="text-base font-semibold">
                      {{ revision?.revisionNumber || revision?.revision_number || 'Original' }}
                    </p>
                  </div>
                  <div v-if="revision?.revisionDescription || revision?.revision_description">
                    <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">
                      Description
                    </p>
                    <p
                      :class="[theme.textPrimary, theme.borderSecondary]"
                      class="text-sm leading-relaxed p-3 rounded-lg border bg-gray-50 dark:bg-gray-900/50"
                    >
                      {{ revision.revisionDescription || revision.revision_description }}
                    </p>
                  </div>
                  <div>
                    <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">Status</p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-if="revision?.isCompleted || revision?.is_completed"
                        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      >
                        <CheckCircle2 class="h-3.5 w-3.5" />
                        Approved
                      </span>
                      <span
                        v-else-if="revision?.isRevised || revision?.is_revised"
                        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      >
                        <History class="h-3.5 w-3.5" />
                        Revised
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Media Details Card -->
              <div
                class="p-5 rounded-xl border"
                :class="[theme.borderSecondary, theme.bgCardSolid]"
              >
                <h3
                  :class="theme.textPrimary"
                  class="text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2"
                >
                  <Info class="h-4 w-4" />
                  Media Details
                </h3>
                <div class="space-y-4">
                  <div>
                    <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">Filename</p>
                    <p :class="theme.textPrimary" class="text-sm font-mono break-all">
                      {{ revision?.filename || revision?.file?.filename || 'N/A' }}
                    </p>
                  </div>
                  <div v-if="revision?.file?.type || revision?.type" class="grid grid-cols-2 gap-3">
                    <div>
                      <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">Type</p>
                      <p :class="theme.textPrimary" class="text-sm capitalize">
                        {{ revision?.file?.type || revision?.type || 'N/A' }}
                      </p>
                    </div>
                    <div v-if="revision?.file?.size || revision?.size">
                      <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">Size</p>
                      <p :class="theme.textPrimary" class="text-sm">
                        {{ formatFileSize(revision?.file?.size || revision?.size) }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="
                      (revision?.file?.width && revision?.file?.height) ||
                      (revision?.width && revision?.height)
                    "
                  >
                    <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">
                      Dimensions
                    </p>
                    <p :class="theme.textPrimary" class="text-sm">
                      {{ revision?.file?.width || revision?.width }} ×
                      {{ revision?.file?.height || revision?.height }} px
                    </p>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">Created</p>
                      <p :class="theme.textPrimary" class="text-xs">
                        {{ formatDate(revision?.createdAt || revision?.created_at) }}
                      </p>
                    </div>
                    <div v-if="revision?.updatedAt || revision?.updated_at">
                      <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">Updated</p>
                      <p :class="theme.textPrimary" class="text-xs">
                        {{ formatDate(revision?.updatedAt || revision?.updated_at) }}
                      </p>
                    </div>
                  </div>
                  <div v-if="revision?.id || revision?.uuid">
                    <p :class="theme.textSecondary" class="text-xs font-medium mb-1.5">Media ID</p>
                    <p :class="theme.textPrimary" class="text-xs font-mono break-all">
                      {{ revision?.id || revision?.uuid }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter
        class="px-6 py-4 border-t bg-white dark:bg-gray-900"
        :class="theme.borderSecondary"
      >
        <Button variant="outline" @click="isOpen = false">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import {
  Loader2,
  MessageSquare,
  Clock,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
  Eye,
  History,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProofingApi } from '@/api/proofing'

const theme = useThemeClasses()
const proofingApi = useProofingApi()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  revision: {
    type: Object,
    default: null,
  },
  mediaItem: {
    type: Object,
    default: null,
  },
  guestToken: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'view'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const activeTab = ref('feedbacks')
const tabs = [
  { id: 'feedbacks', label: 'Comments', icon: MessageSquare },
  { id: 'todo', label: 'Todo', icon: CheckCircle2 },
  { id: 'closure', label: 'Closure Request', icon: Clock },
  { id: 'details', label: 'Details', icon: Info },
]

const revisionFeedbacks = ref([])
const revisionTodos = ref([])
const closureRequests = ref([])
const isLoadingFeedbacks = ref(false)
const isLoadingTodos = ref(false)
const isLoadingClosure = ref(false)

const revisionPreviewUrl = computed(() => {
  if (!props.revision) return null
  return (
    props.revision.thumbnailUrl ||
    props.revision.thumbnail_url ||
    props.revision.largeImageUrl ||
    props.revision.large_image_url ||
    props.revision.file?.url ||
    props.revision.url
  )
})

const getTabCount = tabId => {
  switch (tabId) {
    case 'feedbacks':
      return revisionFeedbacks.value.length
    case 'todo':
      return revisionTodos.value.length
    case 'closure':
      return closureRequests.value.length
    default:
      return 0
  }
}

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

const formatFileSize = bytes => {
  if (!bytes) return 'N/A'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
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

const getAuthorInitial = createdBy => {
  const name = getAuthorName(createdBy)
  return name.charAt(0).toUpperCase()
}

const handleViewRevision = () => {
  if (props.revision) {
    emit('view', props.revision)
  }
}

const loadFeedbacks = async () => {
  if (!props.revision) return
  isLoadingFeedbacks.value = true
  try {
    let feedback = props.revision.feedback || props.revision.feedbacks || []
    if (!Array.isArray(feedback)) {
      feedback = []
    }
    revisionFeedbacks.value = feedback
  } catch (error) {
    console.error('Failed to load feedbacks:', error)
    revisionFeedbacks.value = []
  } finally {
    isLoadingFeedbacks.value = false
  }
}

const loadTodos = async () => {
  if (!props.revision) return
  isLoadingTodos.value = true
  try {
    let todos =
      props.revision.revisionTodos || props.revision.revision_todos || props.revision.todos || []

    if (!Array.isArray(todos)) {
      todos = []
    }

    revisionTodos.value = todos
  } catch (error) {
    console.error('Failed to load todos:', error)
    revisionTodos.value = []
  } finally {
    isLoadingTodos.value = false
  }
}

const loadClosureRequests = async () => {
  const mediaId =
    props.revision?.id || props.revision?.uuid || props.mediaItem?.id || props.mediaItem?.uuid
  if (!mediaId) return

  isLoadingClosure.value = true
  try {
    const result = await proofingApi.getMediaClosureRequests(mediaId, props.guestToken)
    closureRequests.value = result.closure_requests || result.data?.closure_requests || []
  } catch (error) {
    console.error('Failed to load closure requests:', error)
    closureRequests.value = []
  } finally {
    isLoadingClosure.value = false
  }
}

const loadAllData = async () => {
  await Promise.all([loadFeedbacks(), loadTodos(), loadClosureRequests()])
}

watch(
  () => props.modelValue,
  open => {
    if (open && props.revision) {
      activeTab.value = 'feedbacks'
      nextTick(() => {
        loadAllData()
      })
    } else {
      revisionFeedbacks.value = []
      revisionTodos.value = []
      closureRequests.value = []
    }
  }
)

watch(
  () => props.revision,
  newRevision => {
    if (props.modelValue && newRevision) {
      nextTick(() => {
        loadAllData()
      })
    }
  },
  { deep: true, immediate: true }
)
</script>
