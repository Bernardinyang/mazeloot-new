<template>
  <div class="w-full h-full relative overflow-hidden" style="min-height: 200px">
    <DynamicCoverRenderer
      :config="layoutConfig"
      :media="{
        url: previewImageUrl,
        src: previewImageUrl,
        alt: 'Preview',
      }"
      :content="{
        title: 'TITLE',
        date: 'DATE',
      }"
    >
      <template #content="{ content: slotContent }">
        <div class="text-white">
          <div v-if="slotContent.title" class="text-xs font-bold mb-1">
            {{ slotContent.title }}
          </div>
          <div v-if="slotContent.date" class="text-[10px] opacity-90">
            {{ slotContent.date }}
          </div>
        </div>
      </template>
    </DynamicCoverRenderer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DynamicCoverRenderer from '@/components/covers/DynamicCoverRenderer.vue'
import { getDefaultLayoutConfig } from '@/composables/useCoverLayouts'

const props = defineProps({
  layoutConfig: {
    type: Object,
    default: () => getDefaultLayoutConfig(),
  },
})

// Use a small preview image for layout previews
const previewImageUrl =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
</script>
