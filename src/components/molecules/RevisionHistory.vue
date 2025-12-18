<template>
  <div class="space-y-4">
    <h3 :class="theme.textPrimary" class="font-semibold">Revision History</h3>

    <div v-if="revisions.length === 0" class="text-center py-8">
      <p :class="theme.textSecondary" class="text-sm">No revisions yet</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="revision in sortedRevisions"
        :key="revision.id"
        :class="[
          theme.bgCard,
          theme.borderCard,
          'border rounded-lg p-3',
          revision.isCompleted ? 'ring-2 ring-green-500' : '',
        ]"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold" :class="theme.textPrimary">
              Revision {{ revision.revisionNumber }}
            </span>
            <span
              v-if="revision.isCompleted"
              class="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white"
            >
              Approved
            </span>
          </div>
          <span class="text-xs" :class="theme.textTertiary">
            {{ formatDate(revision.updatedAt || revision.createdAt) }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <img
            v-if="revision.type === 'image'"
            :src="revision.thumbnail || revision.url"
            :alt="revision.title"
            class="w-16 h-16 object-cover rounded"
          />
          <video v-else :src="revision.url" class="w-16 h-16 object-cover rounded" />
          <div class="flex-1 min-w-0">
            <p :class="theme.textPrimary" class="text-sm truncate">{{ revision.title }}</p>
            <p :class="theme.textSecondary" class="text-xs">
              {{ revision.type === 'image' ? 'Image' : 'Video' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  revisions: {
    type: Array,
    default: () => [],
  },
})

const theme = useThemeClasses()

const sortedRevisions = computed(() => {
  return [...props.revisions].sort((a, b) => (b.revisionNumber || 0) - (a.revisionNumber || 0))
})

const formatDate = dateString => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return (
    date.toLocaleDateString() +
    ' ' +
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
}
</script>
