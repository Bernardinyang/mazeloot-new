<template>
  <Sheet v-model:open="isOpen">
    <SheetContent :side="side" :class="['flex flex-col p-0', theme.bgCard, contentClass]">
      <!-- Header Section - Fixed at top -->
      <div
        v-if="title || description"
        :class="['flex-shrink-0 border-b px-6 py-5', theme.borderSecondary]"
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
        :class="['flex-1 overflow-y-auto px-6 py-6', bodyClass, $slots.footer ? 'pb-4' : '']"
        style="scrollbar-width: thin; scrollbar-color: rgba(156, 163, 175, 0.5) transparent"
      >
        <slot />
      </div>

      <!-- Footer Section - Fixed at bottom -->
      <div
        v-if="$slots.footer"
        :class="['flex-shrink-0 border-t px-6 py-4', theme.borderSecondary, theme.bgCard]"
      >
        <SheetFooter class="sm:justify-end sm:gap-3">
          <slot name="footer" />
        </SheetFooter>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/shadcn/sheet'
import { useThemeClasses } from '@/composables/useThemeClasses'

interface Props {
  modelValue: boolean
  title?: string
  description?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  contentClass?: string
  bodyClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  side: 'right',
  contentClass: '',
  bodyClass: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const theme = useThemeClasses()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
