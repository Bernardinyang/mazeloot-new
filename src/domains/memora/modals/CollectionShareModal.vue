<template>
  <ShareModal
    v-model="isOpen"
    phase-type="collection"
    :phase-id="collectionId"
    :phase-name="collectionName"
    :password="password"
    :download-pin="downloadPin"
  />
</template>

<script setup>
import ShareModal from '@/shared/components/organisms/ShareModal.vue'
import { computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, required: true },
  collection: { type: Object, default: null },
})

const emit = defineEmits(['update:open'])

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const collectionId = computed(() => {
  if (!props.collection) return ''
  return props.collection.id || props.collection.uuid || ''
})

const collectionName = computed(() => {
  if (!props.collection) return 'Collection'
  return props.collection.name || props.collection.title || 'Collection'
})

const password = computed(() => {
  if (!props.collection) return ''
  return props.collection.password || 
         props.collection.settings?.privacy?.password || 
         props.collection.collectionPassword || 
         ''
})

const downloadPin = computed(() => {
  if (!props.collection) return ''
  return props.collection.downloadPin || 
         props.collection.settings?.download?.downloadPin || 
         ''
})
</script>
