<template>
  <Button
    variant="outline"
    size="sm"
    :class="[
      'relative',
      floating ? 'fixed bottom-6 right-6 z-50 shadow-lg' : '',
    ]"
    @click="$emit('click')"
  >
    <Upload class="h-4 w-4 mr-2" />
    Uploads
    <span
      v-if="activeCount > 0"
      :class="[
        'absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold',
        'bg-accent text-accent-foreground',
      ]"
    >
      {{ activeCount > 99 ? '99+' : activeCount }}
    </span>
    <span
      v-if="!isOnline"
      class="ml-2 h-2 w-2 rounded-full bg-red-500"
      title="Offline"
    />
  </Button>
</template>

<script setup>
import { computed } from 'vue'
import { Upload } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { useBackgroundUploadManager } from '@/composables/useBackgroundUploadManager'

defineProps({
  floating: { type: Boolean, default: false },
})

defineEmits(['click'])

const backgroundUploadManager = useBackgroundUploadManager()

const activeUploadCount = computed(() => backgroundUploadManager.activeUploadCount.value)
const pausedUploadCount = computed(() => backgroundUploadManager.pausedUploadCount.value)
const isOnline = computed(() => backgroundUploadManager.isOnline.value)

const activeCount = computed(() => activeUploadCount.value + pausedUploadCount.value)
</script>

