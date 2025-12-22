<template>
  <div class="flex items-center justify-between gap-4">
    <!-- Left: Title and Search -->
    <div class="flex items-center gap-4 flex-1">
      <h1 class="text-4xl font-bold tracking-tight" :class="theme.textPrimary">{{ title }}</h1>
      <div v-if="showSearch" class="relative flex-1 max-w-md flex gap-2">
        <div class="relative flex-1">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            :class="theme.textTertiary"
          />
          <Input
            :model-value="searchQuery"
            @update:model-value="value => updateSearchQuery(String(value))"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search"
            :class="[
              'pl-9 w-full',
              theme.bgInput,
              theme.borderInput,
              theme.textInput,
              theme.placeholderInput,
            ]"
          />
        </div>
        <Button
          v-if="searchQuery.trim()"
          variant="ghost"
          size="icon"
          :class="[theme.textSecondary, theme.bgButtonHover]"
          @click="handleClear"
          title="Clear search"
        >
          <X class="h-4 w-4" />
        </Button>
        <Button
          :disabled="isSearching"
          :class="[
            'bg-teal-500 hover:bg-teal-600 text-white',
            { 'opacity-50 cursor-not-allowed': isSearching },
          ]"
          @click="handleSearch"
          title="Search"
        >
          <Loader2 v-if="isSearching" class="h-4 w-4 mr-2 animate-spin" />
          <Search v-else class="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-3">
      <slot name="actions" />

      <!-- Sort Dropdown -->
      <DropdownMenu v-if="showSort && sortOptions.length > 0">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" :class="[theme.textSecondary, theme.bgButtonHover, 'gap-2']">
            <ArrowDownUp class="h-4 w-4" />
            <span class="text-sm">{{ selectedSortLabel }}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[200px]']"
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
            <Grid3x3 class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[160px]']"
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
import { Search, ArrowDownUp, Grid3x3, List, Check, X, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import Input from '@/components/shadcn/input/Input.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'

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
