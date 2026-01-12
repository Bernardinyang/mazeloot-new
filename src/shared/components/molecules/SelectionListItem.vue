<template>
  <tr
    :class="[
      'group border-b transition-colors duration-200',
      'hover:bg-gray-50 dark:hover:bg-gray-800/50',
      theme.borderSecondary,
      isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : '',
    ]"
    @click="$emit('click')"
  >
    <!-- Icon/Thumbnail -->
    <td class="w-10 px-4 py-3">
      <div :class="theme.bgCardSolid" class="w-10 h-10 rounded overflow-hidden">
        <!-- Preview Grid -->
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
        <!-- Icon -->
        <div
          v-else
          :class="theme.bgCardSolid"
          class="w-full h-full flex items-center justify-center"
        >
          <component :is="icon" v-if="icon" :class="theme.textTertiary" class="h-5 w-5" />
          <CheckSquare v-else :class="theme.textTertiary" class="h-5 w-5" />
        </div>
      </div>
    </td>

    <!-- Name and Details -->
    <td class="px-4 py-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h3 :class="theme.textPrimary" class="font-medium text-sm truncate cursor-pointer">
            {{ captionText }}
          </h3>
          <Star v-if="isStarred" class="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
          <Lock v-if="password" :class="theme.textSecondary" class="h-3.5 w-3.5 shrink-0" />
          <StatusBadge v-if="status" :status="status" />
        </div>
        <p v-if="subtitle" :class="theme.textSecondary" class="text-xs mt-0.5 truncate">
          {{ subtitle }}
        </p>
      </div>
    </td>

    <!-- Password -->
    <td class="w-52 px-4 py-3">
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
    </td>

    <!-- Date Created -->
    <td class="w-32 px-4 py-3">
      <span :class="theme.textSecondary" class="text-xs leading-none">{{ dateCreated }}</span>
    </td>

    <!-- Actions -->
    <td class="w-24 px-4 py-3">
      <div class="flex items-center gap-1">
        <button
          :title="isStarred ? 'Unstar' : 'Star'"
          class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          type="button"
          @click.stop="$emit('star-click')"
        >
          <Star
            :class="[
              'h-4 w-4',
              isStarred ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary,
            ]"
          />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button
              class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              type="button"
              @click.stop
            >
              <MoreVertical :class="theme.textSecondary" class="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :class="[theme.bgDropdown, theme.borderSecondary]" align="end">
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
              @click.stop="$emit('edit')"
            >
              <Pencil class="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
            <DropdownMenuItem
              :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
              @click.stop="$emit('delete')"
            >
              <Trash2 class="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  CheckSquare,
  Copy,
  Eye,
  EyeOff,
  Info,
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
  selection: {
    type: Object,
    default: null,
  },
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
  icon: {
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
  mediaCount: {
    type: [Number, String],
    default: 0,
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
  showViewDetails: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click', 'select', 'star-click', 'edit', 'delete', 'view-details'])

// View/hide state for password
const showPassword = ref(false)

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Copy password to clipboard
const handleCopyPassword = async () => {
  if (!props.password) {
    toast.error('No password available', {
      description: 'This selection does not have a password.',
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
