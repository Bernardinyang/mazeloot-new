<template>
  <DataTable
    :columns="columns"
    :empty-action-label="emptyActionLabel"
    :empty-icon="emptyIcon"
    :empty-message="emptyMessage"
    :getId="getId"
    :items="items"
    :loading="loading"
    :selected-items="selectedItems"
    @empty-action="$emit('empty-action')"
    @row-click="handleRowClick"
  >
    <!-- Checkbox Column -->
    <template v-if="showCheckbox" #cell-checkbox="{ item }">
      <input
        :checked="selectedItems.includes(getItemId(item))"
        :class="[
          'h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent',
          getItemIsFolder(item) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ]"
        :disabled="getItemIsFolder(item)"
        type="checkbox"
        @change="handleSelectItem(getItemId(item), $event.target?.checked ?? false)"
        @click.stop
      />
    </template>

    <!-- Icon Column -->
    <template #cell-icon="{ item }">
      <div :class="theme.bgCardSolid" class="w-10 h-10 rounded overflow-hidden">
        <!-- Preview Grid -->
        <div
          v-if="getItemPreviewImages(item) && getItemPreviewImages(item).length > 0"
          class="w-full h-full grid grid-cols-2 grid-rows-2 gap-px bg-gray-300 dark:bg-gray-600"
        >
          <div
            v-for="(preview, index) in getPreviewGrid(getItemPreviewImages(item))"
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
          v-else-if="getItemImage(item)"
          :alt="getItemTitle(item)"
          :src="getItemImage(item)"
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
          <component
            :is="getItemIcon(item) || Folder"
            :class="theme.textTertiary"
            class="h-5 w-5"
          />
        </div>
      </div>
    </template>

    <!-- Name Column -->
    <template #cell-name="{ item }">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <component
            :is="getItemIcon(item) || Folder"
            v-if="getItemIsFolder(item)"
            :class="theme.textSecondary"
            class="h-4 w-4 shrink-0"
          />
          <h3 :class="theme.textPrimary" class="font-medium text-sm truncate cursor-pointer">
            {{ getItemTitle(item) }}
          </h3>
          <Star
            v-if="getItemStarred(item) && getItemShowStar(item)"
            class="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400"
          />
          <Lock
            v-if="getItemPassword(item) && showPasswordComputed"
            :class="theme.textSecondary"
            class="h-3.5 w-3.5 shrink-0"
          />
          <StatusBadge v-if="getItemStatus(item)" :status="getItemStatus(item)" />
        </div>
        <p
          v-if="getItemSubtitle(item)"
          :class="theme.textSecondary"
          class="text-xs mt-0.5 truncate"
        >
          {{ getItemSubtitle(item) }}
        </p>
      </div>
    </template>

    <!-- Password Column -->
    <template v-if="showPasswordComputed" #cell-password="{ item }">
      <PasswordCell v-if="getItemPassword(item)" :password="getItemPassword(item)" />
      <span v-else :class="theme.textTertiary" class="text-xs leading-none">-</span>
    </template>

    <!-- Download PIN Column -->
    <template v-if="showDownloadPinComputed" #cell-downloadPin="{ item }">
      <DownloadPinCell v-if="getItemDownloadPin(item)" :pin="getItemDownloadPin(item)" />
      <span v-else :class="theme.textTertiary" class="text-xs leading-none">-</span>
    </template>

    <!-- Date Created Column -->
    <template #cell-dateCreated="{ value }">
      <span :class="theme.textSecondary" class="text-xs leading-none">{{ value }}</span>
    </template>

    <!-- Actions Column -->
    <template #cell-actions="{ item }">
      <div class="flex items-center gap-1">
        <button
          v-if="showLink"
          class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          title="Copy link"
          type="button"
          @click.stop="handleCopyLink(item)"
        >
          <Link :class="theme.textSecondary" class="h-4 w-4" />
        </button>
        <button
          v-if="getItemShowStar(item)"
          :title="getItemStarred(item) ? 'Unstar' : 'Star'"
          class="h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          type="button"
          @click.stop="$emit('star-click', item)"
        >
          <Star
            :class="[
              'h-4 w-4',
              getItemStarred(item) ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary,
            ]"
          />
        </button>
        <div
          :class="[
            'transition-opacity duration-200',
            getDropdownOpenState(item) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          ]"
          @click.stop
        >
          <DropdownMenu
            :open="getDropdownOpenState(item)"
            @update:open="setDropdownOpenState(item, $event)"
          >
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
              <DropdownMenuItem
                v-if="showViewDetails"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('view-details', item)"
              >
                <Info class="h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator v-if="showViewDetails" :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('publish', item)"
              >
                <Globe class="h-4 w-4" />
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('preview', item)"
              >
                <Eye class="h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('edit', item)"
              >
                <Pencil class="h-4 w-4" />
                Quick edit
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="showMoveTo"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('move-to', item)"
              >
                <ArrowRightToLine class="h-4 w-4" />
                Move to
              </DropdownMenuItem>
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('duplicate', item)"
              >
                <Copy class="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
                @click.stop="$emit('delete', item)"
              >
                <Trash2 class="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </template>

    <!-- Password Header -->
    <template v-if="showPasswordComputed" #header-password>
      <div class="flex items-center gap-1">
        <span>PASSWORD</span>
        <Info :class="theme.textTertiary" class="h-3 w-3" />
      </div>
    </template>

    <!-- Download PIN Header -->
    <template v-if="showDownloadPinComputed" #header-downloadPin>
      <div class="flex items-center gap-1">
        <span>DOWNLOAD PIN</span>
        <Info :class="theme.textTertiary" class="h-3 w-3" />
      </div>
    </template>
  </DataTable>
</template>

<script setup>
import { computed, reactive } from 'vue'
import {
  ArrowRightToLine,
  Copy,
  Eye,
  Folder,
  Globe,
  Info,
  Link,
  Lock,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from '@/shared/utils/lucideAnimated'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import DataTable from '@/shared/components/organisms/DataTable.vue'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'
import PasswordCell from '@/shared/components/molecules/PasswordCell.vue'
import DownloadPinCell from '@/shared/components/molecules/DownloadPinCell.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()

// Track dropdown open state per item
const dropdownOpenStates = reactive({})

const getDropdownOpenState = item => {
  const id = getId(item)
  return dropdownOpenStates[id] || false
}

const setDropdownOpenState = (item, value) => {
  const id = getId(item)
  dropdownOpenStates[id] = value
}

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  emptyMessage: {
    type: String,
    default: 'No items found',
  },
  emptyActionLabel: {
    type: String,
    default: '',
  },
  emptyIcon: {
    type: Object,
    default: () => Folder,
  },
  subtitleSeparator: {
    type: String,
    default: '•',
  },
  getId: {
    type: Function,
    default: item => item.id,
  },
  getTitle: {
    type: Function,
    default: item => item.title || item.name,
  },
  getSubtitle: {
    type: Function,
    default: item => {
      const parts = []
      if (item.itemCount !== undefined) {
        const count = item.itemCount
        if (item.isFolder) {
          const labelText = count === 1 ? 'collection' : 'collections'
          parts.push(`${count} ${labelText}`)
        } else {
          const labelText = count === 1 ? 'item' : 'items'
          parts.push(`${count} ${labelText}`)
        }
      }
      const dateStr = item.date || item.dateCreated || item.createdAt
      if (dateStr) {
        const date = new Date(dateStr)
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        parts.push(formattedDate)
      }
      return parts.join(' • ')
    },
  },
  getImage: {
    type: Function,
    default: item => item.image || item.thumbnail || null,
  },
  getPreviewImages: {
    type: Function,
    default: item => item.previewImages || [],
  },
  getIcon: {
    type: Function,
    default: item => (item.isFolder ? Folder : item.icon),
  },
  getStatus: {
    type: Function,
    default: item => item.status,
  },
  getPassword: {
    type: Function,
    default: item => item.password ?? null,
  },
  getDownloadPin: {
    type: Function,
    default: item => item.downloadPin ?? null,
  },
  getDateCreated: {
    type: Function,
    default: item => {
      const dateStr = item.dateCreated || item.createdAt || item.date || ''
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
  },
  getStarred: {
    type: Function,
    default: item => item.starred || item.isStarred || false,
  },
  getShowStar: {
    type: Function,
    default: item => !item.icon,
  },
  getIsFolder: {
    type: Function,
    default: item => item.isFolder || false,
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
  showLink: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'item-click',
  'select',
  'star-click',
  'link-click',
  'copy-pin',
  'empty-action',
  'edit',
  'duplicate',
  'delete',
  'publish',
  'preview',
  'view-details',
  'move-to',
])

const handleRowClick = (item, index) => {
  emit('item-click', item)
}

const handleSelectItem = (id, checked) => {
  emit('select', id, checked)
}

const handleCopyLink = async item => {
  const link = `${window.location.origin}/collections/${getItemTitle(item)
    .toLowerCase()
    .replace(/\s+/g, '-')}`

  try {
    await navigator.clipboard.writeText(link)
    toast.success('Link copied', {
      description: 'Collection link has been copied to clipboard.',
      duration: 3000,
    })
    emit('link-click', item)
  } catch (error) {
    toast.error('Failed to copy', {
      description: 'Could not copy link to clipboard. Please try again.',
      duration: 3000,
    })
  }
}

// Computed properties for backward compatibility
const showPasswordComputed = computed(() => {
  if (props.showPasswordAndPin !== undefined) {
    return props.showPasswordAndPin
  }
  return props.showPassword
})

const showDownloadPinComputed = computed(() => {
  if (props.showPasswordAndPin !== undefined) {
    return props.showPasswordAndPin
  }
  return props.showDownloadPin
})

// Helper function to get subtitle with separator
const getItemSubtitle = item => {
  const subtitle = props.getSubtitle(item)
  const defaultSeparator = ' • '
  const customSeparator = ` ${props.subtitleSeparator} `
  if (props.subtitleSeparator !== '•' && subtitle.includes(defaultSeparator)) {
    return subtitle.replaceAll(defaultSeparator, customSeparator)
  }
  return subtitle
}

// Helper functions using props or defaults
const getId = item => props.getId(item)
const getItemId = item => props.getId(item)
const getItemTitle = item => props.getTitle(item)
const getItemImage = item => props.getImage(item)
const getItemPreviewImages = item => props.getPreviewImages(item)
const getItemIcon = item => props.getIcon(item)
const getItemStatus = item => props.getStatus(item)
const getItemPassword = item => props.getPassword(item)
const getItemDownloadPin = item => props.getDownloadPin(item)
const getItemDateCreated = item => props.getDateCreated(item)
const getItemStarred = item => props.getStarred(item)
const getItemShowStar = item => props.getShowStar(item)
const getItemIsFolder = item => props.getIsFolder(item)

// Define columns
const columns = computed(() => {
  const cols = []
  if (props.showCheckbox) {
    cols.push({
      key: 'checkbox',
      label: '',
      width: 'w-4',
      slot: 'checkbox',
    })
  }
  cols.push(
    {
      key: 'icon',
      label: '',
      width: 'w-10',
      slot: 'icon',
    },
    {
      key: 'name',
      label: 'NAME',
      width: 'flex-1',
      slot: 'name',
    }
  )
  if (showPasswordComputed.value) {
    cols.push({
      key: 'password',
      label: 'PASSWORD',
      width: 'w-40',
      slot: 'password',
      dataSelector: item => props.getPassword(item),
    })
  }
  if (showDownloadPinComputed.value) {
    cols.push({
      key: 'downloadPin',
      label: 'DOWNLOAD PIN',
      width: 'w-40',
      slot: 'downloadPin',
      dataSelector: item => props.getDownloadPin(item),
    })
  }
  cols.push({
    key: 'dateCreated',
    label: 'DATE CREATED',
    width: 'w-32',
    slot: 'dateCreated',
    format: 'date',
    dataSelector: item => props.getDateCreated(item),
  })
  cols.push({
    key: 'actions',
    label: '',
    width: 'w-24',
    slot: 'actions',
  })
  return cols
})

// Generate preview grid (always 4 cells)
const getPreviewGrid = previewImages => {
  if (!previewImages || previewImages.length === 0) {
    return [null, null, null, null]
  }
  const grid = [...previewImages]
  while (grid.length < 4) {
    grid.push(null)
  }
  return grid.slice(0, 4)
}

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
