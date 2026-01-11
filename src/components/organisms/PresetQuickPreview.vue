<template>
  <div
    @mouseenter="$emit('update:open', true)"
    @mouseleave="$emit('update:open', false)"
    class="relative"
  >
    <slot />
    <div
      v-if="open"
      class="absolute z-50 mt-2 w-[400px] p-4 rounded-lg border-2 shadow-lg"
      :class="[theme.bgCard, theme.borderCard]"
      style="left: 0; top: 100%;"
    >
      <div class="space-y-4">
        <!-- Header -->
        <div>
          <h4 class="font-semibold text-sm mb-1" :class="theme.textPrimary">{{ preset.name }}</h4>
          <p v-if="preset.description" class="text-xs" :class="theme.textSecondary">
            {{ preset.description }}
          </p>
        </div>

        <!-- Badges -->
        <div class="flex items-center gap-2 flex-wrap">
          <span
            v-if="preset.category"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          >
            {{ preset.category }}
          </span>
          <span
            v-if="preset.isSelected"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 dark:bg-accent/20 text-accent"
          >
            Default
          </span>
          <span
            v-if="preset.usageCount > 0"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            {{ preset.usageCount }} uses
          </span>
        </div>

        <!-- Settings Summary -->
        <div class="space-y-2 pt-2 border-t" :class="theme.borderSecondary">
          <h5 class="text-xs font-semibold" :class="theme.textPrimary">Settings Summary</h5>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span :class="theme.textSecondary">Email Reg:</span>
              <span class="ml-1" :class="theme.textPrimary">
                {{ preset.emailRegistration ? 'Yes' : 'No' }}
              </span>
            </div>
            <div>
              <span :class="theme.textSecondary">Slideshow:</span>
              <span class="ml-1" :class="theme.textPrimary">
                {{ preset.slideshow ? 'Yes' : 'No' }}
              </span>
            </div>
            <div>
              <span :class="theme.textSecondary">Social Share:</span>
              <span class="ml-1" :class="theme.textPrimary">
                {{ preset.socialSharing ? 'Yes' : 'No' }}
              </span>
            </div>
            <div>
              <span :class="theme.textSecondary">Downloads:</span>
              <span class="ml-1" :class="theme.textPrimary">
                {{ preset.download?.photoDownload ? 'Yes' : 'No' }}
              </span>
            </div>
            <div v-if="preset.design?.fontFamily">
              <span :class="theme.textSecondary">Font:</span>
              <span class="ml-1 capitalize" :class="theme.textPrimary">
                {{ preset.design.fontFamily }}
              </span>
            </div>
            <div v-if="preset.design?.colorPalette">
              <span :class="theme.textSecondary">Palette:</span>
              <span class="ml-1 capitalize" :class="theme.textPrimary">
                {{ preset.design.colorPalette }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex items-center gap-2 pt-2 border-t" :class="theme.borderSecondary">
          <Button
            size="sm"
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary, 'flex-1']"
            @click="handleEdit"
          >
            <Pencil class="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="primary"
            size="sm"
            :icon="Sparkles"
            class="flex-1"
            @click="handleUse"
          >
            Use
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/shadcn/button'
import { Pencil, Sparkles } from 'lucide-vue-next'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useRouter } from 'vue-router'

const props = defineProps({
  preset: {
    type: Object,
    required: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:open', 'edit', 'use'])

const theme = useThemeClasses()
const router = useRouter()

const handleEdit = () => {
  emit('edit', props.preset)
  emit('update:open', false)
}

const handleUse = () => {
  emit('use', props.preset)
  emit('update:open', false)
}
</script>

