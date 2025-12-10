<template>
  <div
    :class="[
      'group relative flex items-center gap-4 px-4 py-3 border-b transition-colors duration-200',
      'hover:bg-gray-50 dark:hover:bg-gray-800/50',
      theme.borderSecondary,
      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : '',
    ]"
    @click="$emit('click')"
  >
    <!-- Checkbox -->
    <div class="flex items-center">
      <input
        type="checkbox"
        :checked="isSelected"
        :disabled="isFolder"
        @change="isFolder ? null : $emit('select', $event.target.checked)"
        @click.stop
        :class="[
          'h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500',
          isFolder ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        ]"
      />
    </div>

    <!-- Icon/Thumbnail -->
    <div class="flex-shrink-0 w-10 h-10 rounded overflow-hidden" :class="theme.bgCardSolid">
      <!-- Folder Preview Grid -->
      <div
        v-if="previewImages && previewImages.length > 0"
        class="w-full h-full grid grid-cols-2 grid-rows-2 gap-px bg-gray-300 dark:bg-gray-600"
      >
        <div
          v-for="(preview, index) in previewGrid"
          :key="index"
          class="relative bg-gray-200 dark:bg-gray-700 overflow-hidden"
        >
          <img
            v-if="preview"
            :src="preview"
            :alt="`Preview ${index + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <!-- Single Image -->
      <img
        v-else-if="imageSrc"
        :src="imageSrc"
        :alt="captionText"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <!-- Folder Icon -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center"
        :class="theme.bgCardSolid"
      >
        <component
          v-if="folderIcon"
          :is="folderIcon"
          class="h-5 w-5"
          :class="theme.textTertiary"
        />
        <Folder
          v-else
          class="h-5 w-5"
          :class="theme.textTertiary"
        />
      </div>
    </div>

    <!-- Name and Details -->
    <div class="flex-1 min-w-0 max-w-lg">
      <div class="flex items-center gap-2">
        <h3 class="font-medium text-sm truncate" :class="theme.textPrimary">
          {{ captionText }}
        </h3>
        <StatusBadge v-if="status" :status="status" />
      </div>
      <p v-if="subtitle" class="text-xs mt-0.5 truncate" :class="theme.textSecondary">
        {{ subtitle }}
      </p>
    </div>

    <!-- Password -->
    <div class="w-40 flex items-center">
      <div v-if="password" class="flex items-center gap-1.5">
        <span class="text-xs font-mono leading-none" :class="theme.textSecondary">
          {{ showPassword ? password : '••••••••••' }}
        </span>
        <button
          type="button"
          class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          @click.stop="showPassword = !showPassword"
        >
          <Eye v-if="showPassword" class="h-3 w-3" :class="theme.textTertiary" />
          <EyeOff v-else class="h-3 w-3" :class="theme.textTertiary" />
        </button>
      </div>
      <span v-else class="text-xs leading-none" :class="theme.textTertiary">-</span>
    </div>

    <!-- Download PIN -->
    <div class="w-40 relative flex items-center">
      <div v-if="downloadPin" class="flex items-center gap-1.5">
        <span class="text-xs font-mono leading-none" :class="theme.textSecondary">
          {{ showDownloadPin ? downloadPin : '••••' }}
        </span>
        <button
          type="button"
          class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          @click.stop="showDownloadPin = !showDownloadPin"
        >
          <Eye v-if="showDownloadPin" class="h-3 w-3" :class="theme.textTertiary" />
          <EyeOff v-else class="h-3 w-3" :class="theme.textTertiary" />
        </button>
        <button
          type="button"
          class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          @click.stop="handleCopyPin"
          title="Copy PIN"
        >
          <Copy class="h-3 w-3" :class="theme.textTertiary" />
        </button>
      </div>
      <span v-else class="text-xs leading-none" :class="theme.textTertiary">-</span>
      <!-- PIN Strength Indicator (positioned absolutely to not affect column alignment) -->
      <div v-if="downloadPin && showDownloadPin" class="absolute left-0 top-full mt-0.5 flex items-center gap-0.5 pointer-events-none">
        <div
          v-for="(level, index) in pinStrengthLevels"
          :key="index"
          class="h-1 w-4 rounded-full transition-colors"
          :class="level.color"
        />
      </div>
    </div>

    <!-- Date Created -->
    <div class="w-32 flex items-center">
      <span class="text-xs leading-none" :class="theme.textSecondary">{{ dateCreated }}</span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1">
      <button
        v-if="showLink"
        type="button"
        class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        @click.stop="handleCopyLink"
        title="Copy link"
      >
        <Link class="h-4 w-4" :class="theme.textSecondary" />
      </button>
      <button
        v-if="showStar"
        type="button"
        class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        @click.stop="$emit('star-click')"
        :title="isStarred ? 'Unstar' : 'Star'"
      >
        <Star
          :class="[
            'h-4 w-4',
            isStarred ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary
          ]"
        />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            @click.stop
          >
            <MoreVertical class="h-4 w-4" :class="theme.textSecondary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary]">
          <slot name="menu-items">
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Globe class="mr-2 h-4 w-4" />
              Publish
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Eye class="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Pencil class="mr-2 h-4 w-4" />
              Quick edit
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <ArrowRightToLine class="mr-2 h-4 w-4" />
              Move to
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Copy class="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']">
              <Trash2 class="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </slot>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import {
  Folder,
  Star,
  MoreVertical,
  Eye,
  EyeOff,
  Copy,
  Link,
  Globe,
  Pencil,
  ArrowRightToLine,
  Trash2,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import StatusBadge from '@/components/custom/StatusBadge.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'

const theme = useThemeClasses()

const props = withDefaults(defineProps<{
  captionText: string
  subtitle?: string
  imageSrc?: string | null
  previewImages?: string[]
  folderIcon?: Component
  status?: string
  password?: string | null
  downloadPin?: string | null
  dateCreated?: string
  isSelected?: boolean
  isStarred?: boolean
  showLink?: boolean
  showStar?: boolean
  isFolder?: boolean
}>(), {
  isSelected: false,
  isStarred: false,
  showLink: true,
  showStar: true,
  isFolder: false,
})

const emit = defineEmits<{
  click: []
  select: [checked: boolean]
  'star-click': []
  'link-click': []
  'copy-pin': []
}>()

const showPassword = ref(false)
const showDownloadPin = ref(false)

// Copy PIN to clipboard
const handleCopyPin = async () => {
  if (!props.downloadPin) {
    toast.error('No PIN available', {
      description: 'This collection does not have a download PIN.',
    })
    return
  }
  
  try {
    await navigator.clipboard.writeText(props.downloadPin)
    toast.success('PIN copied!', {
      description: 'Download PIN has been copied to clipboard.',
    })
    emit('copy-pin')
  } catch (error) {
    console.error('Failed to copy PIN:', error)
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = props.downloadPin
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success('PIN copied!', {
        description: 'Download PIN has been copied to clipboard.',
      })
      emit('copy-pin')
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
      toast.error('Failed to copy', {
        description: 'Could not copy PIN to clipboard. Please try again.',
      })
    }
  }
}

// Copy link to clipboard
const handleCopyLink = async () => {
  // Generate collection link (in a real app, this would be the actual collection URL)
  const link = `${window.location.origin}/collections/${props.captionText.toLowerCase().replace(/\s+/g, '-')}`
  
  try {
    await navigator.clipboard.writeText(link)
    toast.success('Link copied', {
      description: 'Collection link has been copied to clipboard.',
      duration: 3000,
    })
    emit('link-click')
  } catch (error) {
    console.error('Failed to copy link:', error)
    toast.error('Failed to copy', {
      description: 'Could not copy link to clipboard. Please try again.',
      duration: 3000,
    })
  }
}

// Calculate PIN strength
const pinStrength = computed(() => {
  if (!props.downloadPin) return 0
  
  const pin = props.downloadPin.toString()
  let strength = 0
  
  // Length check
  if (pin.length >= 4) strength++
  if (pin.length >= 6) strength++
  if (pin.length >= 8) strength++
  
  // Complexity checks
  if (/\d/.test(pin)) strength++ // Has numbers
  if (/[a-zA-Z]/.test(pin)) strength++ // Has letters
  if (/[^a-zA-Z0-9]/.test(pin)) strength++ // Has special characters
  
  // Deduct for weak patterns
  if (/^(\d)\1+$/.test(pin)) strength = Math.max(0, strength - 2) // All same digit
  if (/^(.)\1+$/.test(pin)) strength = Math.max(0, strength - 1) // All same character
  if (/1234|4321|0000|1111|2222|3333|4444|5555|6666|7777|8888|9999/.test(pin)) {
    strength = Math.max(0, strength - 2) // Common weak PINs
  }
  
  return Math.min(5, strength) // Cap at 5
})

// PIN strength levels for visual indicator
const pinStrengthLevels = computed(() => {
  const strength = pinStrength.value
  const levels = []
  
  for (let i = 0; i < 5; i++) {
    if (i < strength) {
      // Color based on strength
      if (strength <= 2) {
        levels.push({ color: 'bg-red-500' })
      } else if (strength <= 3) {
        levels.push({ color: 'bg-yellow-500' })
      } else {
        levels.push({ color: 'bg-green-500' })
      }
    } else {
      levels.push({ color: 'bg-gray-300 dark:bg-gray-600' })
    }
  }
  
  return levels
})

// Generate preview grid (always 4 cells)
const previewGrid = computed(() => {
  if (!props.previewImages || props.previewImages.length === 0) {
    return [null, null, null, null]
  }
  const grid = [...props.previewImages]
  while (grid.length < 4) {
    grid.push(null)
  }
  return grid.slice(0, 4)
})
</script>

