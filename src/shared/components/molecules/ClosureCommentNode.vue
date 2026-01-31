<template>
  <div
    :class="[
      'rounded-lg p-4 border border-gray-200 dark:border-gray-700',
      depth === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800',
    ]"
  >
    <div class="flex items-center gap-2 mb-2">
      <span
        :class="[
          'font-semibold text-gray-900 dark:text-gray-100',
          depth === 0 ? 'text-sm' : 'text-xs',
        ]"
      >
        {{ getAuthorName(comment.created_by) }}
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ formatDate(comment.created_at) }}
      </span>
    </div>
    <p
      :class="[
        'text-gray-700 dark:text-gray-300',
        depth === 0 ? 'text-sm' : 'text-xs',
      ]"
    >
      {{ comment.content }}
    </p>
    <div
      v-if="comment.replies && comment.replies.length > 0"
      class="mt-3 ml-4 space-y-2"
    >
      <ClosureCommentNode
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :depth="depth + 1"
        :get-author-name="getAuthorName"
        :format-date="formatDate"
      />
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'ClosureCommentNode' })

defineProps({
  comment: {
    type: Object,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
  getAuthorName: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
})
</script>
