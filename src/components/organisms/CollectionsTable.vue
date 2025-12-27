<template>
  <div class="border rounded-lg overflow-hidden" :class="[theme.bgCard, theme.borderCard]">
    <!-- Table Header -->
    <div
      v-if="!loading && items.length > 0"
      class="flex items-center gap-4 px-4 py-3 border-b font-semibold text-xs uppercase tracking-wider"
      :class="[theme.borderSecondary, theme.textTertiary, theme.bgCardSolid]"
    >
      <div v-if="showCheckbox" class="w-4"></div>
      <!-- Checkbox column -->
      <div v-if="showCheckbox" class="w-10"></div>
      <!-- Icon column -->
      <div class="flex-1">NAME</div>
      <div v-if="showPasswordAndPin" class="w-40 flex items-center gap-1">
        <span>PASSWORD</span>
        <Info class="h-3 w-3" :class="theme.textTertiary" />
      </div>
      <div v-if="showPasswordAndPin" class="w-40 flex items-center gap-1">
        <span>DOWNLOAD PIN</span>
        <Info class="h-3 w-3" :class="theme.textTertiary" />
      </div>
      <div class="w-32">DATE CREATED</div>
      <div class="w-24"></div>
      <!-- Actions column -->
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="divide-y" :class="theme.borderSecondary">
      <div v-for="i in 8" :key="i" class="flex items-center gap-4 px-4 py-3 animate-pulse">
        <!-- Checkbox skeleton -->
        <div v-if="showCheckbox" :class="['h-4 w-4 rounded', theme.bgSkeleton]"></div>
        <!-- Icon skeleton -->
        <div :class="['h-10 w-10 rounded', theme.bgSkeleton]"></div>
        <!-- Name skeleton -->
        <div class="flex-1 space-y-2">
          <div :class="['h-4 w-48 rounded', theme.bgSkeleton]"></div>
          <div :class="['h-3 w-32 rounded', theme.bgSkeleton]"></div>
        </div>
        <!-- Password skeleton -->
        <div v-if="showPasswordAndPin" class="w-32 flex items-center gap-1">
          <div :class="['h-3 w-20 rounded', theme.bgSkeleton]"></div>
        </div>
        <!-- Download PIN skeleton -->
        <div v-if="showPasswordAndPin" class="w-32 flex items-center gap-1">
          <div :class="['h-3 w-16 rounded', theme.bgSkeleton]"></div>
        </div>
        <!-- Date skeleton -->
        <div class="w-32">
          <div :class="['h-3 w-24 rounded', theme.bgSkeleton]"></div>
        </div>
        <!-- Actions skeleton -->
        <div class="w-24 flex items-center justify-end gap-1">
          <div :class="['h-8 w-8 rounded', theme.bgSkeleton]"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="flex items-center justify-center py-16">
      <slot name="empty">
        <EmptyState
          :message="emptyMessage"
          :action-label="emptyActionLabel"
          :icon="emptyIcon"
          @action="$emit('empty-action')"
        />
      </slot>
    </div>

    <!-- List Items -->
    <div v-else>
      <slot name="items" :items="items">
        <CollectionListItem
          v-for="item in items"
          :key="getItemId(item)"
          :caption-text="getItemTitle(item)"
          :subtitle="getItemSubtitle(item)"
          :image-src="getItemImage(item)"
          :preview-images="getItemPreviewImages(item)"
          :folder-icon="getItemIcon(item)"
          :status="getItemStatus(item)"
          :password="showPasswordAndPin ? getItemPassword(item) : null"
          :download-pin="showPasswordAndPin ? getItemDownloadPin(item) : null"
          :date-created="getItemDateCreated(item)"
          :show-password-and-pin="showPasswordAndPin"
          :show-checkbox="showCheckbox"
          :is-selected="selectedItems.includes(getItemId(item))"
          :is-starred="getItemStarred(item)"
          :show-star="getItemShowStar(item)"
          :is-folder="getItemIsFolder(item)"
          :show-move-to="showMoveTo"
          :show-view-details="showViewDetails"
          @select="handleSelectItem(getItemId(item), $event)"
          @star-click="$emit('star-click', item)"
          @link-click="$emit('link-click', item)"
          @copy-pin="$emit('copy-pin', item)"
          @click="$emit('item-click', item)"
          @edit="$emit('edit', item)"
          @duplicate="$emit('duplicate', item)"
          @delete="$emit('delete', item)"
          @publish="$emit('publish', item)"
          @preview="$emit('preview', item)"
          @view-details="$emit('view-details', item)"
          @move-to="$emit('move-to', item)"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { useThemeClasses } from '@/composables/useThemeClasses'
import CollectionListItem from '@/components/molecules/CollectionListItem.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import { Folder, Info } from 'lucide-vue-next'

const theme = useThemeClasses()

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
        // Folders count collections, regular collections count items
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
  showPasswordAndPin: {
    type: Boolean,
    default: true,
  },
  showCheckbox: {
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

const handleSelectItem = (id, checked) => {
  emit('select', id, checked)
}

// Helper function to get subtitle with separator
const getItemSubtitle = item => {
  const subtitle = props.getSubtitle(item)
  // Replace the default separator with the prop separator if different
  const defaultSeparator = ' • '
  const customSeparator = ` ${props.subtitleSeparator} `
  if (props.subtitleSeparator !== '•' && subtitle.includes(defaultSeparator)) {
    return subtitle.replaceAll(defaultSeparator, customSeparator)
  }
  return subtitle
}

// Helper functions using props or defaults
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
</script>
