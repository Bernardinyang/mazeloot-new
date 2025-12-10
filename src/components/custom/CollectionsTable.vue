<template>
  <div class="border rounded-lg overflow-hidden" :class="[theme.bgCard, theme.borderCard]">
    <!-- Table Header -->
    <div v-if="!loading && items.length > 0" class="flex items-center gap-4 px-4 py-3 border-b font-semibold text-xs uppercase tracking-wider" :class="[theme.borderSecondary, theme.textTertiary, theme.bgCardSolid]">
      <div class="w-4"></div> <!-- Checkbox column -->
      <div class="w-10"></div> <!-- Icon column -->
      <div class="flex-1 max-w-lg">NAME</div>
      <div class="w-40">PASSWORD</div>
      <div class="w-40">DOWNLOAD PIN</div>
      <div class="w-32">DATE CREATED</div>
      <div class="w-24"></div> <!-- Actions column -->
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="divide-y" :class="theme.borderSecondary">
      <div
        v-for="i in 8"
        :key="i"
        class="flex items-center gap-4 px-4 py-3 animate-pulse"
      >
        <!-- Checkbox skeleton -->
        <div :class="['h-4 w-4 rounded', theme.bgSkeleton]"></div>
        <!-- Icon skeleton -->
        <div :class="['h-10 w-10 rounded', theme.bgSkeleton]"></div>
        <!-- Name skeleton -->
        <div class="flex-1 space-y-2">
          <div :class="['h-4 w-48 rounded', theme.bgSkeleton]"></div>
          <div :class="['h-3 w-32 rounded', theme.bgSkeleton]"></div>
        </div>
        <!-- Password skeleton -->
        <div class="w-32 flex items-center gap-1">
          <div :class="['h-3 w-20 rounded', theme.bgSkeleton]"></div>
        </div>
        <!-- Download PIN skeleton -->
        <div class="w-32 flex items-center gap-1">
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
          :password="getItemPassword(item)"
          :download-pin="getItemDownloadPin(item)"
          :date-created="getItemDateCreated(item)"
          :is-selected="selectedItems.includes(getItemId(item))"
          :is-starred="getItemStarred(item)"
          :show-star="getItemShowStar(item)"
          :is-folder="getItemIsFolder(item)"
          @select="handleSelectItem(getItemId(item), $event)"
          @star-click="$emit('star-click', item)"
          @link-click="$emit('link-click', item)"
          @copy-pin="$emit('copy-pin', item)"
          @click="$emit('item-click', item)"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import CollectionListItem from '@/components/custom/CollectionListItem.vue'
import EmptyState from '@/components/custom/EmptyState.vue'
import { Folder } from 'lucide-vue-next'

const theme = useThemeClasses()

interface Props {
  items: any[]
  loading?: boolean
  selectedItems?: number[]
  emptyMessage?: string
  emptyActionLabel?: string
  emptyIcon?: any
  // Item accessor functions - can be overridden via props or use defaults
  getId?: (item: any) => number
  getTitle?: (item: any) => string
  getSubtitle?: (item: any) => string
  getImage?: (item: any) => string | null
  getPreviewImages?: (item: any) => string[]
  getIcon?: (item: any) => any
  getStatus?: (item: any) => string | undefined
  getPassword?: (item: any) => string | null
  getDownloadPin?: (item: any) => string | null
  getDateCreated?: (item: any) => string
  getStarred?: (item: any) => boolean
  getShowStar?: (item: any) => boolean
  getIsFolder?: (item: any) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectedItems: () => [],
  emptyMessage: 'No items found',
  emptyActionLabel: '',
  emptyIcon: Folder,
  getId: (item: any) => item.id,
  getTitle: (item: any) => item.title || item.name,
  getSubtitle: (item: any) => {
    const parts = []
    if (item.itemCount !== undefined) {
      parts.push(`${item.itemCount} ${item.itemLabel}`)
    }
    if (item.date) {
      parts.push(item.date)
    }
    return parts.join(' • ')
  },
  getImage: (item: any) => item.image || null,
  getPreviewImages: (item: any) => item.previewImages || [],
  getIcon: (item: any) => item.icon,
  getStatus: (item: any) => item.status,
  getPassword: (item: any) => item.password ?? null,
  getDownloadPin: (item: any) => item.downloadPin ?? null,
  getDateCreated: (item: any) => item.dateCreated || item.date || '',
  getStarred: (item: any) => item.starred || false,
  getShowStar: (item: any) => !(item.isFolder || !!item.icon),
  getIsFolder: (item: any) => item.isFolder || false,
})

const emit = defineEmits<{
  'item-click': [item: any]
  'select': [id: number, checked: boolean]
  'star-click': [item: any]
  'link-click': [item: any]
  'copy-pin': [item: any]
  'empty-action': []
}>()

// Handle select event - CollectionsTable expects (id, checked) but parent might pass (id, checked) or (id, checked)
const handleSelectItem = (id: number, checked: boolean) => {
  emit('select', id, checked)
}

// Helper functions using props or defaults
const getItemId = (item: any) => props.getId(item)
const getItemTitle = (item: any) => props.getTitle(item)
const getItemSubtitle = (item: any) => props.getSubtitle(item)
const getItemImage = (item: any) => props.getImage(item)
const getItemPreviewImages = (item: any) => props.getPreviewImages(item)
const getItemIcon = (item: any) => props.getIcon(item)
const getItemStatus = (item: any) => props.getStatus(item)
const getItemPassword = (item: any) => props.getPassword(item)
const getItemDownloadPin = (item: any) => props.getDownloadPin(item)
const getItemDateCreated = (item: any) => props.getDateCreated(item)
const getItemStarred = (item: any) => props.getStarred(item)
const getItemShowStar = (item: any) => props.getShowStar(item)
const getItemIsFolder = (item: any) => props.getIsFolder(item)
</script>

