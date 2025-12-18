<template>
  <div class="space-y-4">
    <h3 :class="theme.textPrimary" class="font-semibold">Feedback History</h3>

    <div v-if="feedback.length === 0" class="text-center py-8">
      <p :class="theme.textSecondary" class="text-sm">No feedback yet</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="item in feedback"
        :key="item.id"
        :class="[theme.bgCard, theme.borderCard, 'border rounded-lg p-3']"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <component
              :is="getFeedbackIcon(item.type)"
              class="h-4 w-4"
              :class="theme.textSecondary"
            />
            <span class="text-xs font-medium capitalize" :class="theme.textSecondary">
              {{ item.type }}
            </span>
          </div>
          <span class="text-xs" :class="theme.textTertiary">
            {{ formatDate(item.createdAt) }}
          </span>
        </div>

        <!-- Text Feedback -->
        <p v-if="item.type === 'text'" :class="theme.textPrimary" class="text-sm">
          {{ item.content }}
        </p>

        <!-- Video/Audio Feedback -->
        <div v-else class="space-y-2">
          <component
            :is="item.type === 'video' ? 'video' : 'audio'"
            :src="item.content"
            controls
            class="w-full rounded"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { MessageSquare, Video, Mic } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  feedback: {
    type: Array,
    default: () => [],
  },
})

const theme = useThemeClasses()

const getFeedbackIcon = type => {
  switch (type) {
    case 'text':
      return MessageSquare
    case 'video':
      return Video
    case 'audio':
      return Mic
    default:
      return MessageSquare
  }
}

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
