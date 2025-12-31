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
    <div v-if="showCheckbox" class="flex items-center">
      <input
        type="checkbox"
        :checked="isSelected"
        :disabled="isFolder"
        @change="isFolder ? null : $emit('select', $event.target?.checked ?? false)"
        @click.stop
        :class="[
          'h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500',
          isFolder ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
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
            @error="handleImageError($event)"
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
        @error="handleImageError($event)"
      />
      <!-- Folder Icon -->
      <div v-else class="w-full h-full flex items-center justify-center" :class="theme.bgCardSolid">
        <component v-if="folderIcon" :is="folderIcon" class="h-5 w-5" :class="theme.textTertiary" />
        <Folder v-else class="h-5 w-5" :class="theme.textTertiary" />
      </div>
    </div>

    <!-- Name and Details -->
    <div class="flex-1 min-w-0 cursor-pointer">
      <div class="flex items-center gap-2">
        <component
          v-if="isFolder"
          :is="folderIcon || Folder"
          class="h-4 w-4 shrink-0"
          :class="theme.textSecondary"
        />
        <h3 class="font-medium text-sm truncate" :class="theme.textPrimary">
          {{ captionText }}
        </h3>
        <Star v-if="isStarred" class="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
        <Lock
          v-if="password && showPassword"
          class="h-3.5 w-3.5 shrink-0"
          :class="theme.textSecondary"
        />
        <StatusBadge v-if="status" :status="status" />
      </div>
      <p v-if="subtitle" class="text-xs mt-0.5 truncate" :class="theme.textSecondary">
        {{ subtitle }}
      </p>
    </div>

    <!-- Password -->
    <div v-if="showPassword" class="w-40 flex items-center">
      <div v-if="password" class="flex items-center gap-1.5">
        <span class="text-xs font-mono leading-none" :class="theme.textSecondary">
          {{ showPassword ? password : '••••••••' }}
        </span>
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            @click.stop="togglePasswordVisibility"
            :title="showPassword ? 'Hide password' : 'Show password'"
          >
            <EyeOff v-if="showPassword" class="h-3 w-3" :class="theme.textTertiary" />
            <Eye v-else class="h-3 w-3" :class="theme.textTertiary" />
          </button>
          <button
            type="button"
            class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            @click.stop="handleCopyPassword"
            title="Copy password"
          >
            <Copy class="h-3 w-3" :class="theme.textTertiary" />
          </button>
        </div>
      </div>
      <span v-else class="text-xs leading-none" :class="theme.textTertiary">-</span>
    </div>

    <!-- Download PIN -->
    <div v-if="showDownloadPin" class="w-40 flex items-center">
      <div v-if="downloadPin" class="flex items-center gap-1.5">
        <span class="text-xs font-mono leading-none" :class="theme.textSecondary">
          {{ showPin ? downloadPin : '••••' }}
        </span>
        <div class="flex items-center gap-0.5">
          <button
            type="button"
            class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            @click.stop="togglePinVisibility"
            :title="showPin ? 'Hide PIN' : 'Show PIN'"
          >
            <EyeOff v-if="showPin" class="h-3 w-3" :class="theme.textTertiary" />
            <Eye v-else class="h-3 w-3" :class="theme.textTertiary" />
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
      </div>
      <span v-else class="text-xs leading-none" :class="theme.textTertiary">-</span>
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
          :class="['h-4 w-4', isStarred ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary]"
        />
      </button>
      <div
        :class="[
          'transition-opacity duration-200',
          isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        ]"
        @click.stop
      >
        <DropdownMenu v-model:open="isDropdownOpen">
          <DropdownMenuTrigger as-child>
            <button
              type="button"
              class="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              @click.stop
            >
              <MoreVertical class="h-4 w-4" :class="theme.textSecondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary]">
            <slot name="menu-items">
              <DropdownMenuItem
                v-if="showViewDetails"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('view-details')"
              >
                <Info class="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator v-if="showViewDetails" :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('publish')"
              >
                <Globe class="mr-2 h-4 w-4" />
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('preview')"
              >
                <Eye class="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('edit')"
              >
                <Pencil class="mr-2 h-4 w-4" />
                Quick edit
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="showMoveTo"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('move-to')"
              >
                <ArrowRightToLine class="mr-2 h-4 w-4" />
                Move to
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('duplicate')"
              >
                <Copy class="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
                @click.stop="$emit('delete')"
              >
                <Trash2 class="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </slot>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Folder,
  Star,
  MoreVertical,
  Copy,
  Link,
  Globe,
  Pencil,
  ArrowRightToLine,
  Trash2,
  Eye,
  EyeOff,
  Info,
  Lock,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import StatusBadge from '@/components/atoms/StatusBadge.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()

const props = defineProps({
  captionText: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: undefined,
  },
  imageSrc: {
    type: [String, null],
    default: null,
  },
  previewImages: {
    type: Array,
    default: () => [],
  },
  folderIcon: {
    type: Object,
    default: undefined,
  },
  status: {
    type: String,
    default: undefined,
  },
  password: {
    type: [String, null],
    default: null,
  },
  downloadPin: {
    type: [String, null],
    default: null,
  },
  dateCreated: {
    type: String,
    default: undefined,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isStarred: {
    type: Boolean,
    default: false,
  },
  showLink: {
    type: Boolean,
    default: true,
  },
  showStar: {
    type: Boolean,
    default: true,
  },
  isFolder: {
    type: Boolean,
    default: false,
  },
  showMoveTo: {
    type: Boolean,
    default: true,
  },
  showViewDetails: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: true,
  },
  showDownloadPin: {
    type: Boolean,
    default: true,
  },
  showPasswordAndPin: {
    type: Boolean,
    default: undefined,
  },
  showCheckbox: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'click',
  'select',
  'star-click',
  'link-click',
  'copy-pin',
  'edit',
  'duplicate',
  'delete',
  'publish',
  'preview',
  'view-details',
  'move-to',
])

// View/hide state for password and PIN
const showPassword = ref(false)
const showPin = ref(false)
const isDropdownOpen = ref(false)

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Toggle PIN visibility
const togglePinVisibility = () => {
  showPin.value = !showPin.value
}

// Copy password to clipboard
const handleCopyPassword = async () => {
  if (!props.password) {
    toast.error('No password available', {
      description: 'This collection does not have a password.',
    })
    return
  }

  try {
    await navigator.clipboard.writeText(props.password)
    toast.success('Password copied!', {
      description: 'Password has been copied to clipboard.',
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: 'Could not copy password to clipboard. Please try again.',
    })
  }
}

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
  } catch (error) {
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
    } catch (fallbackError) {
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
    toast.error('Failed to copy', {
      description: 'Could not copy link to clipboard. Please try again.',
      duration: 3000,
    })
  }
}

// Calculate PIN strength (currently unused, kept for future use)
// const pinStrength = computed(() => {
//   if (!props.downloadPin) return 0

//   const pin = props.downloadPin.toString()
//   let strength = 0

//   // Length check
//   if (pin.length >= 4) strength++
//   if (pin.length >= 6) strength++
//   if (pin.length >= 8) strength++

//   // Complexity checks
//   if (/\d/.test(pin)) strength++ // Has numbers
//   if (/[a-zA-Z]/.test(pin)) strength++ // Has letters
//   if (/[^a-zA-Z0-9]/.test(pin)) strength++ // Has special characters

//   // Deduct for weak patterns
//   if (/^(\d)\1+$/.test(pin)) strength = Math.max(0, strength - 2) // All same digit
//   if (/^(.)\1+$/.test(pin)) strength = Math.max(0, strength - 1) // All same character
//   if (/1234|4321|0000|1111|2222|3333|4444|5555|6666|7777|8888|9999/.test(pin)) {
//     strength = Math.max(0, strength - 2) // Common weak PINs
//   }

// })

// PIN strength levels for visual indicator (currently unused, kept for future use)
// const pinStrengthLevels = computed(() => {
//   const strength = pinStrength.value
//   const levels = []

//   for (let i = 0; i < 5; i++) {
//     if (i < strength) {
//       // Color based on strength
//       if (strength <= 2) {
//         levels.push({ color: 'bg-red-500' })
//       } else if (strength <= 3) {
//         levels.push({ color: 'bg-yellow-500' })
//       } else {
//         levels.push({ color: 'bg-green-500' })
//       }
//     } else {
//       levels.push({ color: 'bg-gray-300 dark:bg-gray-600' })
//     }
//   }

// })

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

// Fallback placeholder image (SVG data URL)
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

const handleImageError = event => {
  const img = event.target
  if (img.src !== placeholderImage) {
    img.src = placeholderImage
  }
}
</script>
