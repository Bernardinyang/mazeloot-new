<template>
  <PhaseLayout phase-type="raw_files">
    <template #topNav>
      <RawFilesTopNav
        :go-back="() => $emit('goBack')"
      />
    </template>

    <template #sidebar>
      <RawFilesSidebar
        :active-tab="activeTab"
        :is-loading="isLoading"
        :is-sidebar-collapsed="isSidebarCollapsed"
        :raw-files="rawFiles"
        @update:is-sidebar-collapsed="isSidebarCollapsed = $event"
      >
        <RawFilesSidebarPanels
          :active-tab="activeTab"
          :is-loading="isLoading"
          :is-sidebar-collapsed="isSidebarCollapsed"
          :raw-files-id="rawFiles?.id || ''"
        />
      </RawFilesSidebar>
    </template>

    <template #content>
      <slot name="content" />
    </template>

    <template #shareModal>
      <RawFilesShareModal
        v-model="showShareModal"
        :raw-files-id="rawFiles?.id || ''"
        :raw-files-name="rawFiles?.name || 'Raw Files'"
        :project-id="rawFiles?.projectId || rawFiles?.project_uuid || null"
        :password="rawFiles?.password || ''"
        :raw-files="rawFiles"
      />
    </template>
  </PhaseLayout>
</template>

<script setup>
import PhaseLayout from '@/shared/layouts/PhaseLayout.vue'
import RawFilesSidebar from '@/shared/components/organisms/RawFilesSidebar.vue'
import RawFilesTopNav from '@/shared/components/organisms/RawFilesTopNav.vue'
import RawFilesSidebarPanels from '@/shared/components/organisms/RawFilesSidebarPanels.vue'
import RawFilesShareModal from '@/domains/memora/modals/RawFilesShareModal.vue'
import { computed, provide, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRawFilesMediaSetsSidebarStore } from '@/domains/memora/stores/rawFilesMediaSetsSidebar'
import { useRawFilesHeaderStore } from '@/domains/memora/stores/rawFilesHeader'
import { useRoute } from 'vue-router'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'

const props = defineProps({
  rawFiles: { type: [Object, null], default: null },
  isLoading: { type: Boolean, required: true },
})

defineEmits(['goBack'])

const route = useRoute()
const { isSidebarCollapsed } = useSidebarCollapse()

const mediaSetsSidebar = useRawFilesMediaSetsSidebarStore()
const headerStore = useRawFilesHeaderStore()
const { showShareModal } = storeToRefs(headerStore)

const tabFromRouteName = routeName => {
  const n = routeName?.toString?.() ?? ''
  if (n === 'rawFilesPhotos' || n === 'rawFilesPreview') return 'photos'
  if (n.startsWith('rawFilesSettings')) return 'settings'
  if (route.query?.tab) {
    return route.query.tab
  }
  return 'photos'
}

const activeTab = computed(() => {
  const queryTab = route.query?.tab
  if (queryTab) {
    return queryTab
  }
  return tabFromRouteName(route.name)
})

// Set raw files in header store
watch(
  () => props.rawFiles,
  rawFiles => {
    if (rawFiles) {
      headerStore.setRawFiles(rawFiles)
    }
  },
  { immediate: true }
)

watch(
  () => props.rawFiles?.id,
  async id => {
    if (!id) return

    if (mediaSetsSidebar.isSavingSets) {
      return
    }

    if (id && id !== mediaSetsSidebar.rawFilesId) {
      await mediaSetsSidebar.setContext(id, null)
    }
  },
  { immediate: false }
)
</script>
