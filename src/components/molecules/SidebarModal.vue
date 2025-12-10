<template>
  <Sheet v-model:open="isOpen">
    <SheetContent :side="side" :class="contentClass">
      <SheetHeader v-if="title || description">
        <SheetTitle v-if="title">
          {{ title }}
        </SheetTitle>
        <SheetDescription v-if="description">
          {{ description }}
        </SheetDescription>
      </SheetHeader>

      <div :class="['flex-1', bodyClass]">
        <slot />
      </div>

      <SheetFooter v-if="$slots.footer">
        <slot name="footer" />
      </SheetFooter>
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

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
