<template>
  <ShareModal
    v-model="isOpen"
    phase-type="raw_files"
    :phase-id="rawFilesId"
    :phase-name="rawFilesName"
    :password="password"
    :download-pin="downloadPin"
  />
</template>

<script setup>
import ShareModal from '@/shared/components/organisms/ShareModal.vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  rawFilesId: { type: String, default: '' },
  rawFilesName: { type: String, default: 'Raw Files' },
  projectId: { type: String, default: null },
  password: { type: String, default: '' },
  rawFiles: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const downloadPin = computed(() => {
  if (!props.rawFiles) return ''
  return props.rawFiles.settings?.download?.downloadPin || 
         props.rawFiles.downloadPin || 
         ''
})
</script>
