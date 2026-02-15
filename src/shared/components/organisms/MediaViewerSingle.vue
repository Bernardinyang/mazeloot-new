<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-[max(1rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] backdrop-blur-sm"
    @click="emit('close')"
  >
    <div class="relative max-w-7xl max-h-full">
      <img
        :alt="props.media?.title || 'Media'"
        :src="displayUrl"
        class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        @error="emit('image-error', $event)"
      />
      <button
        class="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
        @click.stop="emit('close')"
      >
        <X class="w-6 h-6" />
      </button>

      <!-- Media Info -->
      <div
        v-if="props.media?.title"
        class="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-black/70 backdrop-blur-md text-white max-w-md text-center"
      >
        <p class="font-semibold">{{ props.media.title }}</p>
        <p v-if="props.media.description" class="text-sm opacity-90 mt-1">
          {{ props.media.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X } from '@/shared/utils/lucideAnimated'
import { getMediaLightboxPreviewUrl } from '@/domains/memora/utils/media/getMediaPreviewUrl'

const props = defineProps({
  media: { type: Object, required: true },
  placeholderImage: { type: String, required: true },
})

const emit = defineEmits(['close', 'image-error'])

const displayUrl = computed(
  () =>
    getMediaLightboxPreviewUrl(props.media) ||
    props.media?.thumbnailUrl ||
    props.media?.thumbnail ||
    props.placeholderImage
)
</script>
