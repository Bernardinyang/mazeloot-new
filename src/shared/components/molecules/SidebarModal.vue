<template>
  <Sheet v-model:open="isOpen">
    <SheetContent
      :side="effectiveSide"
      :class="[
        'flex flex-col p-0 min-h-0',
        theme.bgCard,
        contentClass,
        isMobile && 'w-full max-w-none max-h-[90dvh]',
      ]"
    >
      <!-- Header Section - Fixed at top -->
      <div
        v-if="title || description"
        :class="['flex-shrink-0 border-b px-4 sm:px-6 py-4 sm:py-5 pt-[calc(1.25rem+env(safe-area-inset-top))] sm:pt-5', theme.borderSecondary]"
      >
        <SheetHeader class="text-left">
          <SheetTitle v-if="title" :class="['text-xl font-bold leading-tight', theme.textPrimary]">
            {{ title }}
          </SheetTitle>
          <SheetDescription
            v-if="description"
            :class="['mt-2 text-sm leading-relaxed', theme.textSecondary]"
          >
            {{ description }}
          </SheetDescription>
        </SheetHeader>
      </div>

      <!-- Body Section - Scrollable -->
      <div
        :class="['flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6', bodyClass, $slots.footer ? 'pb-4' : '']"
        style="scrollbar-width: thin; scrollbar-color: rgba(156, 163, 175, 0.5) transparent"
      >
        <slot />
      </div>

      <!-- Footer Section - Fixed at bottom -->
      <div
        v-if="$slots.footer"
        :class="['flex-shrink-0 border-t px-4 sm:px-6 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4', theme.borderSecondary, theme.bgCard]"
      >
        <SheetFooter class="sm:justify-end sm:gap-3">
          <slot name="footer" />
        </SheetFooter>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup>
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/components/shadcn/sheet'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: undefined,
  },
  description: {
    type: String,
    default: undefined,
  },
  side: {
    type: String,
    default: 'right',
    validator: value => ['top', 'right', 'bottom', 'left'].includes(value),
  },
  contentClass: {
    type: String,
    default: '',
  },
  bodyClass: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const theme = useThemeClasses()
const isMobile = useMediaQuery('(max-width: 768px)')
const effectiveSide = computed(() => (isMobile.value ? 'bottom' : props.side))

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
