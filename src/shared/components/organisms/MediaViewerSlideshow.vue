<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
    @click="emit('close')"
  >
    <div class="relative max-w-7xl max-h-full w-full">
      <Transition mode="out-in" name="fade">
        <div :key="props.currentIndex" class="relative">
          <img
            :alt="currentItem?.title || 'Media'"
            :src="displayUrl"
            class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl mx-auto"
            @error="emit('image-error', $event)"
          />
        </div>
      </Transition>

      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
        @click.stop="emit('close')"
      >
        <X class="w-6 h-6" />
      </button>

      <!-- Navigation Buttons (if more than one image) -->
      <template v-if="props.items.length > 1">
        <button
          v-if="props.currentIndex > 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          @click.stop="emit('navigate', -1)"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>
        <button
          v-if="props.currentIndex < props.items.length - 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          @click.stop="emit('navigate', 1)"
        >
          <ChevronsRight class="w-6 h-6" />
        </button>
      </template>

      <!-- Media Info -->
      <div
        class="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-black/70 backdrop-blur-md text-white max-w-md text-center"
      >
        <p class="font-semibold">{{ currentItem?.title || 'Media' }}</p>
        <p v-if="props.items.length > 1" class="text-sm opacity-90 mt-1">
          {{ props.currentIndex + 1 }} of {{ props.items.length }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronsRight, X } from '@/shared/utils/lucideAnimated'
import { getMediaLightboxPreviewUrl } from '@/domains/memora/utils/media/getMediaPreviewUrl'

const props = defineProps({
  items: { type: Array, required: true },
  currentIndex: { type: Number, required: true },
  placeholderImage: { type: String, required: true },
})

const emit = defineEmits(['close', 'navigate', 'image-error'])

const currentItem = computed(() => props.items[props.currentIndex])

const displayUrl = computed(
  () =>
    getMediaLightboxPreviewUrl(currentItem.value) ||
    currentItem.value?.thumbnailUrl ||
    currentItem.value?.thumbnail ||
    props.placeholderImage
)
</script>
