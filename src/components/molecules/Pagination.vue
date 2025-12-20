<template>
  <div
    class="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 rounded-2xl border"
    :class="[theme.borderSecondary, theme.bgCard, 'shadow-sm']"
  >
    <!-- Left: Info and Page Size -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
      <!-- Results Info -->
      <div class="flex items-center gap-2 text-sm" :class="theme.textSecondary">
        <span class="whitespace-nowrap">
          Showing <span :class="['font-semibold', theme.textPrimary]">{{ startItem }}</span> to
          <span :class="['font-semibold', theme.textPrimary]">{{ endItem }}</span> of
          <span :class="['font-semibold', theme.textPrimary]">{{ total }}</span> results
        </span>
      </div>

      <!-- Page Size Selector -->
      <div v-if="showPageSize" class="flex items-center gap-2">
        <label class="text-xs font-medium whitespace-nowrap" :class="theme.textSecondary">
          Per page:
        </label>
        <select
          :value="limit"
          :class="[
            'h-9 px-3 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            'hover:border-teal-500/50',
          ]"
          @change="handlePageSizeChange($event.target.value)"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>

    <!-- Right: Pagination Controls -->
    <div class="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
      <!-- First Page Button -->
      <Button
        v-if="showFirstLast && totalPages > 7"
        variant="ghost"
        size="sm"
        :disabled="!hasPrevious"
        :class="[
          'h-10 w-10 p-0 rounded-lg transition-all',
          theme.textSecondary,
          theme.bgButtonHover,
          { 'opacity-50 cursor-not-allowed': !hasPrevious },
          'hover:scale-105',
        ]"
        @click="handlePageChange(1)"
        title="First page"
      >
        <ChevronsLeft class="h-4 w-4" />
      </Button>

      <!-- Previous Button -->
      <Button
        variant="ghost"
        size="sm"
        :disabled="!hasPrevious"
        :class="[
          'h-10 px-4 rounded-lg transition-all font-medium',
          theme.textSecondary,
          theme.bgButtonHover,
          { 'opacity-50 cursor-not-allowed': !hasPrevious },
          'hover:scale-105',
        ]"
        @click="handlePrevious"
      >
        <ChevronLeft class="h-4 w-4 mr-1.5" />
        <span class="hidden sm:inline">Previous</span>
      </Button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <!-- First page -->
        <template v-if="showFirstPage">
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'h-10 w-10 p-0 font-semibold rounded-lg transition-all',
              currentPage === 1
                ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-md'
                : [theme.textPrimary, theme.bgButtonHover, 'hover:scale-105'],
            ]"
            @click="handlePageChange(1)"
          >
            1
          </Button>
          <span v-if="showStartEllipsis" :class="['px-2 text-sm font-medium', theme.textTertiary]"
            >...</span
          >
        </template>

        <!-- Middle pages -->
        <Button
          v-for="pageNum in visiblePages"
          :key="pageNum"
          variant="ghost"
          size="sm"
          :class="[
            'h-10 w-10 p-0 font-semibold rounded-lg transition-all',
            pageNum === currentPage
              ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-md scale-105'
              : [theme.textPrimary, theme.bgButtonHover, 'hover:scale-105 hover:shadow-sm'],
          ]"
          @click="handlePageChange(pageNum)"
        >
          {{ pageNum }}
        </Button>

        <!-- Last page -->
        <template v-if="showLastPage">
          <span v-if="showEndEllipsis" :class="['px-2 text-sm font-medium', theme.textTertiary]"
            >...</span
          >
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'h-10 w-10 p-0 font-semibold rounded-lg transition-all',
              currentPage === totalPages
                ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-md'
                : [theme.textPrimary, theme.bgButtonHover, 'hover:scale-105'],
            ]"
            @click="handlePageChange(totalPages)"
          >
            {{ totalPages }}
          </Button>
        </template>
      </div>

      <!-- Next Button -->
      <Button
        variant="ghost"
        size="sm"
        :disabled="!hasNext"
        :class="[
          'h-10 px-4 rounded-lg transition-all font-medium',
          theme.textSecondary,
          theme.bgButtonHover,
          { 'opacity-50 cursor-not-allowed': !hasNext },
          'hover:scale-105',
        ]"
        @click="handleNext"
      >
        <span class="hidden sm:inline">Next</span>
        <ChevronRight class="h-4 w-4 ml-1.5" />
      </Button>

      <!-- Last Page Button -->
      <Button
        v-if="showFirstLast && totalPages > 7"
        variant="ghost"
        size="sm"
        :disabled="!hasNext"
        :class="[
          'h-10 w-10 p-0 rounded-lg transition-all',
          theme.textSecondary,
          theme.bgButtonHover,
          { 'opacity-50 cursor-not-allowed': !hasNext },
          'hover:scale-105',
        ]"
        @click="handlePageChange(totalPages)"
        title="Last page"
      >
        <ChevronsRight class="h-4 w-4" />
      </Button>

      <!-- Go to Page Input -->
      <div
        v-if="showGoToPage && totalPages > 5"
        class="flex items-center gap-2 ml-3 pl-3 border-l rounded-lg"
        :class="theme.borderSecondary"
      >
        <label
          class="text-xs font-medium whitespace-nowrap hidden sm:inline"
          :class="theme.textSecondary"
        >
          Go to:
        </label>
        <input
          v-model.number="goToPageInput"
          type="number"
          :min="1"
          :max="totalPages"
          :class="[
            'h-10 w-20 px-3 text-sm rounded-lg border text-center transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            'hover:border-teal-500/50',
          ]"
          placeholder="Page"
          @keyup.enter="handleGoToPage"
          @blur="goToPageInput = currentPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  limit: {
    type: Number,
    required: true,
    default: 50,
  },
  showPageSize: {
    type: Boolean,
    default: false,
  },
  showGoToPage: {
    type: Boolean,
    default: true,
  },
  showFirstLast: {
    type: Boolean,
    default: true,
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 25, 50, 100],
  },
})

const emit = defineEmits(['page-change', 'page-size-change'])

const theme = useThemeClasses()

const goToPageInput = ref(props.currentPage)

// Watch currentPage to update input
watch(
  () => props.currentPage,
  newPage => {
    goToPageInput.value = newPage
  }
)

const hasPrevious = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.totalPages)

const startItem = computed(() => {
  if (props.total === 0) return 0
  return (props.currentPage - 1) * props.limit + 1
})

const endItem = computed(() => {
  const end = props.currentPage * props.limit
  return Math.min(end, props.total)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  const current = props.currentPage
  const total = props.totalPages

  if (total <= maxVisible + 2) {
    // Show all pages if total is small
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show pages around current page
    let start = Math.max(2, current - Math.floor(maxVisible / 2))
    let end = Math.min(total - 1, start + maxVisible - 1)

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(2, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

const showFirstPage = computed(() => {
  return props.totalPages > 1 && !visiblePages.value.includes(1)
})

const showLastPage = computed(() => {
  return props.totalPages > 1 && !visiblePages.value.includes(props.totalPages)
})

const showStartEllipsis = computed(() => {
  return showFirstPage.value && visiblePages.value[0] > 2
})

const showEndEllipsis = computed(() => {
  return (
    showLastPage.value && visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
  )
})

const handlePageChange = page => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const handlePrevious = () => {
  if (hasPrevious.value) {
    handlePageChange(props.currentPage - 1)
  }
}

const handleNext = () => {
  if (hasNext.value) {
    handlePageChange(props.currentPage + 1)
  }
}

const handleGoToPage = () => {
  const page = parseInt(goToPageInput.value)
  if (page >= 1 && page <= props.totalPages) {
    handlePageChange(page)
  } else {
    goToPageInput.value = props.currentPage
  }
}

const handlePageSizeChange = newSize => {
  const size = parseInt(newSize)
  if (size > 0) {
    emit('page-size-change', size)
  }
}
</script>
