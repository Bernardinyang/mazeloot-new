<template>
  <Button
    variant="outline"
    size="sm"
    :class="[
      'relative rounded-xl border-0 font-medium transition-all hover:shadow-lg hover:shadow-violet-500/20',
      floating
        ? 'fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-50 shadow-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 ring-1 ring-black/10' : '',
    ]"
    @click="$emit('click')"
  >
    <Upload class="h-4 w-4 mr-2" />
    Uploads
    <span
      v-if="activeCount > 0"
      :class="[
        'absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold tabular-nums',
        floating ? 'bg-white text-violet-600 shadow-md ring-2 ring-violet-500/50' : 'bg-accent text-accent-foreground',
      ]"
    >
      {{ activeCount > 99 ? '99+' : activeCount }}
    </span>
    <span
      v-if="!isOnline"
      class="ml-2 h-2 w-2 rounded-full bg-red-400 animate-pulse"
      title="Offline"
      aria-hidden="true"
    />
  </Button>
</template>

<script setup>
import { computed } from 'vue'
import { Upload } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { useBackgroundUploadManager } from '@/shared/composables/useBackgroundUploadManager'

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

