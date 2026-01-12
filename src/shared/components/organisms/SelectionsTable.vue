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
        <!-- Single Video -->
        <video
          v-else-if="getItemImage(item) && isVideoUrl(getItemImage(item))"
          :src="getItemImage(item)"
          class="w-full h-full object-cover"
          autoplay
          loop
          muted
          playsinline
        />
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
            :is="getItemIcon(item) || CheckSquare"
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
          <h3 :class="theme.textPrimary" class="font-medium text-sm truncate cursor-pointer">
            {{ getItemTitle(item) }}
          </h3>
          <Star
            v-if="getItemStarred(item)"
            class="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400"
          />
          <Lock
            v-if="getItemPassword(item)"
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
    <template #cell-password="{ item }">
      <PasswordCell v-if="getItemPassword(item)" :password="getItemPassword(item)" />
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
                <Info class="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator v-if="showViewDetails" :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                @click.stop="$emit('edit', item)"
              >
                <Pencil class="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
              <DropdownMenuItem
                :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
                @click.stop="$emit('delete', item)"
              >
                <Trash2 class="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </template>

    <!-- Password Header -->
    <template #header-password>
      <div class="flex items-center gap-1">
        <span>PASSWORD</span>
        <Info :class="theme.textTertiary" class="h-3 w-3" />
      </div>
    </template>
  </DataTable>
</template>

<script setup>
import { computed, reactive } from 'vue'
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
import DataTable from '@/shared/components/organisms/DataTable.vue'
import StatusBadge from '@/shared/components/atoms/StatusBadge.vue'
import PasswordCell from '@/shared/components/molecules/PasswordCell.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

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
    default: 'No selections found',
  },
  emptyActionLabel: {
    type: String,
    default: '',
  },
  emptyIcon: {
    type: Object,
    default: () => CheckSquare,
  },
  getId: {
    type: Function,
    default: item => item.id || item.uuid,
  },
  getTitle: {
    type: Function,
    default: item => item.name || item.title,
  },
  getSubtitle: {
    type: Function,
    default: item => {
      const parts = []
      if (item.mediaCount !== undefined) {
        parts.push(`${item.mediaCount} media`)
      }
      if (item.selectedCount !== undefined && item.selectedCount > 0) {
        parts.push(`${item.selectedCount} selected`)
      }
      const status = item.status || 'draft'
      parts.push(status)
      return parts.join(' • ')
    },
  },
  getImage: {
    type: Function,
    default: item => item.coverPhotoUrl || item.cover_photo_url || null,
  },
  getPreviewImages: {
    type: Function,
    default: item => item.previewImages || [],
  },
  getIcon: {
    type: Function,
    default: () => CheckSquare,
  },
  getStatus: {
    type: Function,
    default: item => item.status,
  },
  getPassword: {
    type: Function,
    default: item => (item.hasPassword ? '••••••••' : null),
  },
  getMediaCount: {
    type: Function,
    default: item => item.mediaCount || item.media_count || 0,
  },
  getDateCreated: {
    type: Function,
    default: item => {
      const dateStr =
        item.createdAt || item.created_at || item.dateCreated || item.date_created || ''
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },
  },
  getStarred: {
    type: Function,
    default: item => item.isStarred || item.starred || false,
  },
  showViewDetails: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'item-click',
  'select',
  'star-click',
  'empty-action',
  'edit',
  'delete',
  'view-details',
])

const handleRowClick = (item, index) => {
  emit('item-click', item)
}

// Define columns
const columns = computed(() => [
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
  },
  {
    key: 'password',
    label: 'PASSWORD',
    width: 'w-52',
    slot: 'password',
    dataSelector: item => props.getPassword(item),
  },
  {
    key: 'dateCreated',
    label: 'DATE CREATED',
    width: 'w-32',
    slot: 'dateCreated',
    format: 'date',
    dataSelector: item => props.getDateCreated(item),
  },
  {
    key: 'actions',
    label: '',
    width: 'w-24',
    slot: 'actions',
  },
])

// Helper functions
const getId = item => props.getId(item)
const getItemTitle = item => props.getTitle(item)
const getItemImage = item => props.getImage(item)
const getItemPreviewImages = item => props.getPreviewImages(item)
const getItemIcon = item => props.getIcon(item)
const getItemStatus = item => props.getStatus(item)
const getItemPassword = item => props.getPassword(item)
const getItemDateCreated = item => props.getDateCreated(item)
const getItemStarred = item => props.getStarred(item)
const getItemSubtitle = item => props.getSubtitle(item)

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

const isVideoUrl = url => {
  if (!url) return false
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const lowerUrl = url.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
}

const handleImageError = event => {
  const img = event.target
  if (img.src !== placeholderImage) {
    img.src = placeholderImage
  }
}
</script>
