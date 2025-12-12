<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import type { SelectContentEmits, SelectContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SelectContent, SelectPortal, SelectViewport, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import { SelectScrollDownButton, SelectScrollUpButton } from '.'
import { Input } from '@/components/shadcn/input'
import { Search, X } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'

defineOptions({
  inheritAttrs: false,
})

const theme = useThemeClasses()

const props = withDefaults(
  defineProps<SelectContentProps & { class?: HTMLAttributes['class']; searchable?: boolean }>(),
  {
    position: 'popper',
    searchable: true,
  }
)
const emits = defineEmits<SelectContentEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'searchable')

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const searchQuery = ref('')

// Provide search query to child components for filtering
provide('selectSearchQuery', searchQuery)

// Clear search when content closes
watch(
  () => props.open,
  (isOpen: boolean) => {
    if (!isOpen) {
      searchQuery.value = ''
    }
  }
)

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="
        cn(
          'relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          props.class
        )
      "
    >
      <!-- Search Input -->
      <div v-if="searchable" class="p-2 border-b" :class="theme.borderSecondary">
        <div class="relative">
          <Search
            class="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4"
            :class="theme.textTertiary"
          />
          <Input
            v-model="searchQuery"
            placeholder="Search..."
            :class="['pl-8 pr-8 h-9 text-sm', theme.bgInput, theme.borderInput, theme.textInput]"
            @click.stop
            @keydown.stop
          />
          <button
            v-if="searchQuery"
            @click.stop="clearSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="theme.textSecondary"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <SelectScrollUpButton />
      <SelectViewport
        :class="
          cn(
            'p-1',
            position === 'popper' &&
              'h-[--reka-select-trigger-height] w-full min-w-[--reka-select-trigger-width]'
          )
        "
      >
        <slot />
      </SelectViewport>
      <SelectScrollDownButton />
    </SelectContent>
  </SelectPortal>
</template>
