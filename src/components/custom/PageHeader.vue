<template>
  <div class="flex items-center justify-between gap-4">
    <!-- Left: Title and Search -->
    <div class="flex items-center gap-4 flex-1">
      <h1 class="text-4xl font-bold tracking-tight" :class="theme.textPrimary">{{ title }}</h1>
      <div v-if="showSearch" class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" :class="theme.textTertiary" />
        <Input
          :model-value="searchQuery"
          @update:model-value="updateSearchQuery"
          type="text"
          placeholder="Search"
          :class="[
            'pl-9 w-full',
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            theme.placeholderInput
          ]"
        />
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-3">
      <slot name="actions" />
      
      <!-- Sort Dropdown -->
      <DropdownMenu v-if="showSort && sortOptions.length > 0">
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            :class="[theme.textSecondary, theme.bgButtonHover]"
          >
            <ArrowDownUp class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[200px]']">
          <DropdownMenuLabel :class="theme.textTertiary">{{ sortLabel }}</DropdownMenuLabel>
          <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
          <DropdownMenuItem
            v-for="option in sortOptions"
            :key="option.value"
            :class="[
              theme.textPrimary,
              theme.bgButtonHover,
              'cursor-pointer',
              { [theme.bgHover]: sortBy === option.value }
            ]"
            @click="$emit('update:sortBy', option.value)"
          >
            {{ option.label }}
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
              viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800' : ''
            ]"
          >
            <Grid3x3 class="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[160px]']">
          <DropdownMenuLabel :class="theme.textTertiary">View Style</DropdownMenuLabel>
          <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
          <DropdownMenuItem
            :class="[
              theme.textPrimary,
              theme.bgButtonHover,
              'cursor-pointer',
              { [theme.bgHover]: viewMode === 'grid' }
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
              { [theme.bgHover]: viewMode === 'list' }
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

<script setup lang="ts">
import { Search, ArrowDownUp, Grid3x3, List, Check } from 'lucide-vue-next'
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
import type { SortOption } from '@/composables/usePageHeader'

interface Props {
  title: string
  searchQuery: string
  sortBy: string
  viewMode: 'grid' | 'list'
  sortOptions?: SortOption[]
  sortLabel?: string
  showSearch?: boolean
  showSort?: boolean
  showViewToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSearch: true,
  showSort: true,
  showViewToggle: true,
  sortLabel: 'Sort by',
  sortOptions: () => [],
})

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:sortBy': [value: string]
  'update:viewMode': [value: 'grid' | 'list']
}>()

const theme = useThemeClasses()

const updateSearchQuery = (value: string) => {
  emit('update:searchQuery', value)
}
</script>

