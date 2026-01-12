<template>
  <ShareModal
    v-model="isOpen"
    phase-type="proofing"
    :phase-id="proofingId"
    :phase-name="proofingName"
    :password="password"
  />
</template>

<script setup>
import ShareModal from '@/shared/components/organisms/ShareModal.vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  proofingId: { type: String, required: true },
  proofingName: { type: String, default: 'Proofing' },
  projectId: { type: String, default: null },
  password: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>
