<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="flex items-center gap-2 flex-wrap">
      <Button
        v-for="filter in filters"
        :key="filter.value"
        :variant="activeFilter === filter.value ? 'default' : 'outline'"
        size="sm"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </Button>
    </div>

    <!-- Media Grid with Comments -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="i in 6"
        :key="`skeleton-${i}`"
        class="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
      ></div>
    </div>

    <div v-else-if="filteredMedia.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No media with comments found</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="media in filteredMedia"
        :key="media.id"
        class="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all duration-200"
        @click="$emit('open-comments', media)"
      >
        <!-- Media Thumbnail -->
        <div class="aspect-square relative">
          <img
            v-if="media.type === 'image' || (media.file && media.file.type === 'image')"
            :alt="media.filename || 'Media'"
            :src="media.thumbnailUrl || media.file?.url || '/placeholder-image.png'"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <Play class="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>

          <!-- Comment Count Badge -->
          <div
            v-if="getCommentCount(media) > 0"
            class="absolute top-2 right-2 px-2 py-1 rounded-full bg-teal-500 text-white text-xs font-bold shadow-lg"
          >
            {{ getCommentCount(media) }}
          </div>

          <!-- Unread Indicator -->
          <div
            v-if="hasUnreadComments(media)"
            class="absolute top-2 left-2 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900"
          ></div>
        </div>

        <!-- Media Info -->
        <div class="p-3 bg-white dark:bg-gray-900">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {{ media.filename || 'Untitled' }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {{ getCommentCount(media) }} comment{{ getCommentCount(media) !== 1 ? 's' : '' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Play } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'

const props = defineProps({
  media: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['open-comments'])

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Video Timestamps', value: 'timestamps' },
]

const activeFilter = ref('all')

const filteredMedia = computed(() => {
  let filtered = props.media.filter(m => getCommentCount(m) > 0)

  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(m => hasUnreadComments(m))
  } else if (activeFilter.value === 'timestamps') {
    filtered = filtered.filter(m => hasTimestampComments(m))
  }

  return filtered
})

const getCommentCount = media => {
  if (!media.feedback || !Array.isArray(media.feedback)) return 0

  // Count all comments including replies
  // Counts ALL comments: both top-level comments and replies
  // Uses a Set to avoid double-counting if a reply appears both in the array and nested in replies
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
  return countComments(media.feedback)
}

const hasUnreadComments = media => {
  // This would need to be implemented based on read/unread tracking
  // For now, return false
  return false
}

const hasTimestampComments = media => {
  if (!media.feedback || !Array.isArray(media.feedback)) return false

  const checkComments = comments => {
    for (const comment of comments) {
      if (comment.timestamp !== null && comment.timestamp !== undefined) {
        return true
      }
      if (comment.replies && comment.replies.length > 0) {
        if (checkComments(comment.replies)) {
          return true
        }
      }
    }
    return false
  }

  return checkComments(media.feedback)
}
</script>
