<template>
  <ShareModal
    v-model="isOpen"
    phase-type="selection"
    :phase-id="selectionId"
    :phase-name="selectionName"
    :password="password"
    :download-pin="downloadPin"
  />
</template>

<script setup>
import ShareModal from '@/shared/components/organisms/ShareModal.vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  selectionId: { type: String, required: true },
  selectionName: { type: String, default: 'Selection' },
  projectId: { type: String, default: null },
  password: { type: String, default: '' },
  downloadPin: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
