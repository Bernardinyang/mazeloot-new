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

<script setup lang="ts">
import { computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'

interface Props {
  modelValue: boolean
  title?: string
  description?: string
  contentClass?: string
  bodyClass?: string
}

const props = withDefaults(defineProps<Props>(), {
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
