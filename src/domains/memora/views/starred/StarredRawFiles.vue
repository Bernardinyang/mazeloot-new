<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Raw Files </template>
    <template #header>
      <div class="flex items-center justify-end w-full"></div>
    </template>

    <div class="space-y-6">
      <PageHeader
        :is-searching="isSearching"
        title="Starred Raw Files"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort raw files by"
        @clear="handleClearSearch"
        @search="handleSearch"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      />

      <LoadingState v-if="isLoading" message="Loading starred raw files..." />

      <EmptyState
        v-else-if="rawFilesList.length === 0"
        message="No starred raw files phases found"
        description="Star raw files phases to quickly access them from this page."
        action-label="Browse Raw Files"
        :icon="Download"
        action-icon="ArrowRight"
        @action="handleBrowseRawFiles"
      />

      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="rawFiles in rawFilesList"
          :key="rawFiles.id"
          class="p-4 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
          @click="handleRawFilesClick(rawFiles)"
        >
          <h3 class="font-semibold">{{ rawFiles.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ rawFiles.mediaCount || 0 }} files</p>
        </div>
      </div>

      <Pagination
        v-if="pagination.totalPages > 1 || pagination.total > 0"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        :show-page-size="true"
        :show-go-to-page="true"
        :show-first-last="true"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Download } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import PageHeader from '@/shared/components/molecules/PageHeader.vue'
import LoadingState from '@/shared/components/molecules/LoadingState.vue'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import Pagination from '@/shared/components/molecules/Pagination.vue'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles.js'
import { useAsyncPagination } from '@/shared/composables/useAsyncPagination.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const rawFilesApi = useRawFilesApi()
const viewMode = ref('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const isSearching = ref(false)

const mapSortToBackend = frontendSort => {
  const mapping = {
    'created-new-old': 'created-desc',
    'created-old-new': 'created-asc',
    'name-a-z': 'name-asc',
    'name-z-a': 'name-desc',
    status: 'status-asc',
  }
  return mapping[frontendSort] || 'created-desc'
}

const fetchStarredRawFiles = async params => {
  const fetchParams = { ...params, starred: true }
  if (searchQuery.value && searchQuery.value.trim()) {
    fetchParams.search = searchQuery.value.trim()
  }
  if (sortBy.value) {
    fetchParams.sortBy = mapSortToBackend(sortBy.value)
  }
  return await rawFilesApi.fetchAllRawFiles(fetchParams)
}

const {
  data: rawFilesList,
  pagination,
  isLoading,
  fetch,
  goToPage,
  resetToFirstPage,
  setPerPage,
} = useAsyncPagination(fetchStarredRawFiles, {
  initialPage: 1,
  initialPerPage: 10,
  autoFetch: false,
  watchForReset: [sortBy],
})

const sortOptions = [
  { label: 'Created (New → Old)', value: 'created-new-old' },
  { label: 'Created (Old → New)', value: 'created-old-new' },
  { label: 'Name (A → Z)', value: 'name-a-z' },
  { label: 'Name (Z → A)', value: 'name-z-a' },
  { label: 'Status', value: 'status' },
]

const handleBrowseRawFiles = () => {
  router.push({ name: 'rawFiles' })
}

const handleRawFilesClick = rawFiles => {
  if (rawFiles && rawFiles.id) {
    router.push({ name: 'rawFilesDetail', params: { id: rawFiles.id } })
  }
}

const handlePageChange = page => {
  goToPage(page)
}

const handlePageSizeChange = async newSize => {
  await setPerPage(newSize)
}

const handleSearch = async () => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    handleClearSearch()
    return
  }
  isSearching.value = true
  await resetToFirstPage()
  isSearching.value = false
}

const handleClearSearch = async () => {
  searchQuery.value = ''
  await resetToFirstPage()
}

onMounted(async () => {
  await fetch()
})
</script>
