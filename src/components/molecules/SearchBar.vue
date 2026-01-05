<template>
  <div class="relative flex-1 max-w-md flex gap-2">
    <div class="relative flex-1">
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
        :class="theme.textTertiary"
      />
      <Input
        :model-value="modelValue"
        @update:model-value="value => $emit('update:modelValue', String(value))"
        @keyup.enter="handleSearch"
        type="text"
        :placeholder="placeholder"
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
      v-if="modelValue.trim()"
      variant="ghost"
      size="icon"
      :class="[theme.textSecondary, theme.bgButtonHover]"
      @click="handleClear"
      title="Clear search"
    >
      <X class="h-4 w-4" />
    </Button>
    <Button
      :disabled="isLoading"
      :class="[
        'bg-accent hover:bg-accent/90 text-accent-foreground',
        { 'opacity-50 cursor-not-allowed': isLoading },
      ]"
      @click="handleSearch"
      :title="buttonLabel"
    >
      <Loader2 v-if="isLoading" class="h-4 w-4 mr-2 animate-spin" />
      <Search v-else class="h-4 w-4 mr-2" />
      {{ buttonLabel }}
    </Button>
  </div>
</template>

<script setup>
import { Search, X, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import Input from '@/components/shadcn/input/Input.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

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
