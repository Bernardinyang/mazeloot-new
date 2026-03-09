<template>
  <div
    v-if="props.isEmpty"
    :class="[
      'rounded-2xl p-20 text-center transition-all duration-300',
      'bg-gradient-to-br from-primary-50/50 via-white to-accent/5 dark:from-primary-900/20 dark:via-gray-900 dark:to-accent/10',
      'border-2 border-dashed',
      props.isDragging
        ? 'border-accent bg-accent/15 dark:bg-accent/25 scale-[1.01] shadow-xl shadow-accent/10 ring-4 ring-accent/25'
        : 'border-primary-200 dark:border-primary-700 hover:border-accent/50 hover:bg-accent/5 dark:hover:bg-accent/10',
    ]"
    @dragleave="emit('update:isDragging', false)"
    @drop="emit('drop', $event)"
    @dragover.prevent="emit('update:isDragging', true)"
  >
    <div class="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto">
      <div
        :class="[
          'p-6 rounded-2xl transition-all duration-300',
          props.isDragging
            ? 'bg-accent/25 dark:bg-accent/40 scale-110 ring-4 ring-accent/30 shadow-lg'
            : 'bg-accent/10 dark:bg-accent/20',
        ]"
      >
        <ImagePlus
          :class="[
            'h-14 w-14 transition-all duration-300',
            props.isDragging ? 'text-accent scale-110 rotate-6' : 'text-accent',
          ]"
        />
      </div>
      <div class="space-y-3">
        <p class="text-xl font-bold text-primary-700 dark:text-primary-200">
          Drag media here to upload
        </p>
        <p class="text-sm text-primary-600/80 dark:text-primary-300/80">
          or
          <button
            type="button"
            class="text-accent font-semibold underline underline-offset-4 hover:text-accent-600 dark:hover:text-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded transition-colors"
            @click="emit('browse')"
          >
            browse files
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ImagePlus } from '@/shared/utils/lucideAnimated'

const props = defineProps({
  isEmpty: {
    type: Boolean,
    required: true,
  },
  isDragging: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['browse', 'drop', 'update:isDragging'])
</script>
