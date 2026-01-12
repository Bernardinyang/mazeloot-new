<template>
  <div class="relative flex-1 max-w-md flex gap-1 sm:gap-2">
    <div class="relative flex-1 min-w-0">
      <Search
        class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4"
        :class="theme.textTertiary"
      />
      <Input
        :model-value="modelValue"
        @update:model-value="value => $emit('update:modelValue', String(value))"
        @keyup.enter="handleSearch"
        type="text"
        :placeholder="placeholder"
        :class="[
          'pl-7 sm:pl-9 w-full text-sm sm:text-base',
          theme.bgInput,
          theme.borderInput,
          theme.textInput,
          theme.placeholderInput,
        ]"
      />
    </div>
    <Button
      v-if="modelValue.trim()"
      variant="ghost"
      size="icon"
      class="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
      :class="[theme.textSecondary, theme.bgButtonHover]"
      @click="handleClear"
      title="Clear search"
    >
      <X class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
    </Button>
    <Button
      :disabled="isLoading"
      size="sm"
      :class="[
        'bg-accent hover:bg-accent/90 text-accent-foreground shrink-0',
        { 'opacity-50 cursor-not-allowed': isLoading },
      ]"
      @click="handleSearch"
      :title="buttonLabel"
    >
      <Loader2 v-if="isLoading" class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
      <Search v-else class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
      <span class="hidden sm:inline">{{ buttonLabel }}</span>
      <span class="sm:hidden">Search</span>
    </Button>
  </div>
</template>

<script setup>
import { Search, X, Loader2 } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import Input from '@/shared/components/shadcn/input/Input.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Search',
  },
  buttonLabel: {
    type: String,
    default: 'Search',
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const theme = useThemeClasses()

const handleSearch = () => {
  emit('search')
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
