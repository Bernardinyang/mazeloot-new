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
        :checked="isSelected"
        :class="[
          'h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent',
          isFolder ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ]"
        :disabled="isFolder"
        type="checkbox"
        @change="isFolder ? null : $emit('select', $event.target?.checked ?? false)"
        @click.stop
      />
    </div>

    <!-- Icon/Thumbnail -->
    <div :class="theme.bgCardSolid" class="flex-shrink-0 w-10 h-10 rounded overflow-hidden">
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
            :alt="`Preview ${index + 1}`"
            :src="preview"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="handleImageError($event)"
          />
        </div>
      </div>
      <!-- Single Image -->
      <img
        v-else-if="imageSrc"
        :alt="captionText"
        :src="imageSrc"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="handleImageError($event)"
      />
      <!-- Folder Icon -->
      <div v-else :class="theme.bgCardSolid" class="w-full h-full flex items-center justify-center">
        <component :is="folderIcon" v-if="folderIcon" :class="theme.textTertiary" class="h-5 w-5" />
        <Folder v-else :class="theme.textTertiary" class="h-5 w-5" />
      </div>
    </div>

    <!-- Name and Details -->
    <div class="flex-1 min-w-0 cursor-pointer">
      <div class="flex items-center gap-2">
        <component
          :is="folderIcon || Folder"
          v-if="isFolder"
          :class="theme.textSecondary"
          class="h-4 w-4 shrink-0"
        />
        <h3 :class="theme.textPrimary" class="font-medium text-sm truncate">
          {{ captionText }}
        </h3>
        <Star v-if="isStarred" class="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
        <Lock
          v-if="password && showPassword"
          :class="theme.textSecondary"
          class="h-3.5 w-3.5 shrink-0"
        />
        <StatusBadge v-if="status" :status="status" />
      </div>
      <p v-if="subtitle" :class="theme.textSecondary" class="text-xs mt-0.5 truncate">
        {{ subtitle }}
      </p>
    </div>

    <!-- Password -->
    <div v-if="showPassword" class="w-40 flex items-center">
      <div v-if="password" class="flex items-center gap-1.5">
        <span :class="theme.textSecondary" class="text-xs font-mono leading-none">
          {{ showPassword ? password : '••••••••' }}
        </span>
        <div class="flex items-center gap-0.5">
          <button
            :title="showPassword ? 'Hide password' : 'Show password'"
            class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            type="button"
            @click.stop="togglePasswordVisibility"
          >
            <EyeOff v-if="showPassword" :class="theme.textTertiary" class="h-3 w-3" />
            <Eye v-else :class="theme.textTertiary" class="h-3 w-3" />
          </button>
          <button
            class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Copy password"
            type="button"
            @click.stop="handleCopyPassword"
          >
            <Copy :class="theme.textTertiary" class="h-3 w-3" />
          </button>
        </div>
      </div>
      <span v-else :class="theme.textTertiary" class="text-xs leading-none">-</span>
    </div>

    <!-- Download PIN -->
    <div v-if="showDownloadPin" class="w-40 flex items-center">
      <div v-if="downloadPin" class="flex items-center gap-1.5">
        <span :class="theme.textSecondary" class="text-xs font-mono leading-none">
          {{ showPin ? downloadPin : '••••' }}
        </span>
        <div class="flex items-center gap-0.5">
          <button
            :title="showPin ? 'Hide PIN' : 'Show PIN'"
            class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            type="button"
            @click.stop="togglePinVisibility"
          >
            <EyeOff v-if="showPin" :class="theme.textTertiary" class="h-3 w-3" />
            <Eye v-else :class="theme.textTertiary" class="h-3 w-3" />
          </button>
          <button
            class="h-4 w-4 flex-shrink-0 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Copy PIN"
            type="button"
            @click.stop="handleCopyPin"
          >
            <Copy :class="theme.textTertiary" class="h-3 w-3" />
          </button>
        </div>
      </div>
      <span v-else :class="theme.textTertiary" class="text-xs leading-none">-</span>
    </div>

    <!-- Date Created -->
    <div class="w-32 flex items-center">
      <span :class="theme.textSecondary" class="text-xs leading-none">{{ dateCreated }}</span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-1">
      <button
        v-if="showLink"
        class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        title="Copy link"
        type="button"
        @click.stop="handleCopyLink"
      >
        <Link :class="theme.textSecondary" class="h-4 w-4" />
      </button>
      <button
        v-if="showStar"
        :title="isStarred ? 'Unstar' : 'Star'"
        class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        type="button"
        @click.stop="$emit('star-click')"
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
              class="h-8 w-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              type="button"
              @click.stop
            >
              <MoreVertical :class="theme.textSecondary" class="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :class="[theme.bgDropdown, theme.borderSecondary]" align="end">
            <slot name="menu-items">
              <DropdownMenuItem
                v-if="showViewDetails"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('view-details')"
              >
                <Info class="h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator v-if="showViewDetails" :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('publish')"
              >
                <Globe class="h-4 w-4" />
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('preview')"
              >
                <Eye class="h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('edit')"
              >
                <Pencil class="h-4 w-4" />
                Quick edit
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="showMoveTo"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('move-to')"
              >
                <ArrowRightToLine class="h-4 w-4" />
                Move to
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('duplicate')"
              >
                <Copy class="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
                @click.stop="$emit('delete')"
              >
                <Trash2 class="h-4 w-4" />
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
import { computed, ref } from 'vue'
import {
  ArrowRightToLine,
  Copy,
  Eye,
  EyeOff,
  Folder,
  Globe,
  Info,
  Link,
  Lock,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'

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
