<template>
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <!-- Title and Search Section -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight shrink-0" :class="theme.textPrimary">{{ title }}</h1>
      <div v-if="showSearch" class="w-full sm:w-auto sm:max-w-xs flex-1 sm:flex-initial min-w-0">
        <SearchBar
          :model-value="searchQuery"
          :is-loading="isSearching"
          @update:model-value="updateSearchQuery"
          @search="handleSearch"
          @clear="handleClear"
        />
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap shrink-0 w-full sm:w-auto justify-start sm:justify-end">
      <slot name="actions" />

      <!-- Sort Dropdown -->
      <DropdownMenu v-if="showSort && sortOptions.length > 0">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" :class="[theme.textSecondary, theme.bgButtonHover, 'gap-1 sm:gap-2']" size="sm">
            <ArrowDownUp class="h-4 w-4 shrink-0" />
            <span class="text-xs sm:text-sm hidden sm:inline">{{ selectedSortLabel }}</span>
            <span class="text-xs sm:text-sm sm:hidden">Sort</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          :class="[theme.bgDropdown, theme.borderSecondary, 'w-[calc(100vw-2rem)] sm:min-w-[200px] sm:w-auto']"
        >
          <DropdownMenuLabel :class="theme.textTertiary">{{ sortLabel }}</DropdownMenuLabel>
          <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
          <DropdownMenuItem
            v-for="option in sortOptions"
            :key="option.value"
            :class="[
              theme.textPrimary,
              theme.bgButtonHover,
              'cursor-pointer',
              { [theme.bgHover]: sortBy === option.value },
            ]"
            @click="$emit('update:sortBy', option.value)"
          >
            {{ option.label }}
            <Check v-if="sortBy === option.value" class="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <slot name="afterSort" />

      <!-- View Style Toggle -->
      <DropdownMenu v-if="showViewToggle">
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            :class="[
              theme.textSecondary,
              theme.bgButtonHover,
              viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800' : '',
            ]"
          >
            <Grid3x3 class="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          :class="[theme.bgDropdown, theme.borderSecondary, 'w-[calc(100vw-2rem)] sm:min-w-[160px] sm:w-auto']"
        >
          <DropdownMenuLabel :class="theme.textTertiary">View Style</DropdownMenuLabel>
          <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
          <DropdownMenuItem
            :class="[
              theme.textPrimary,
              theme.bgButtonHover,
              'cursor-pointer',
              { [theme.bgHover]: viewMode === 'grid' },
            ]"
            @click="$emit('update:viewMode', 'grid')"
          >
            <Grid3x3 class="mr-2 h-4 w-4" />
            Grid View
            <Check v-if="viewMode === 'grid'" class="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            :class="[
              theme.textPrimary,
              theme.bgButtonHover,
              'cursor-pointer',
              { [theme.bgHover]: viewMode === 'list' },
            ]"
            @click="$emit('update:viewMode', 'list')"
          >
            <List class="mr-2 h-4 w-4" />
            List View
            <Check v-if="viewMode === 'list'" class="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowDownUp, Grid3x3, List, Check } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import SearchBar from '@/shared/components/molecules/SearchBar.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
  sortBy: {
    type: String,
    required: true,
  },
  viewMode: {
    type: String,
    required: true,
    validator: value => ['grid', 'list'].includes(value),
  },
  sortOptions: {
    type: Array,
    default: () => [],
  },
  sortLabel: {
    type: String,
    default: 'Sort by',
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  showSort: {
    type: Boolean,
    default: true,
  },
  showViewToggle: {
    type: Boolean,
    default: true,
  },
  isSearching: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:searchQuery',
  'update:sortBy',
  'update:viewMode',
  'search',
  'clear',
])

const theme = useThemeClasses()

const selectedSortLabel = computed(() => {
  const selectedOption = props.sortOptions.find(option => option.value === props.sortBy)
  return selectedOption ? selectedOption.label : 'Sort'
})

const updateSearchQuery = value => {
  emit('update:searchQuery', value)
}

const handleSearch = () => {
  emit('search')
}

const handleClear = () => {
  emit('update:searchQuery', '')
  emit('clear')
}
</script>
