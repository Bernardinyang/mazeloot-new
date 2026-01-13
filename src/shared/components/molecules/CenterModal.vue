<template>
  <Dialog v-model:open="isOpen">
    <DialogContent :class="contentClass">
      <DialogHeader v-if="title || description">
        <DialogTitle v-if="title">
          {{ title }}
        </DialogTitle>
        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <div :class="['flex-1', bodyClass]">
        <slot />
      </div>

      <DialogFooter v-if="$slots.footer">
        <slot name="footer" />
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'

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

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
