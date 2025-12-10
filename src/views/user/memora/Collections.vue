<template>
  <DashboardLayout>
    <template #breadcrumb>
      Collections
    </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Collections"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort collections by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      >
        <template #actions>
          <Button
            variant="ghost"
            size="sm"
            :class="['text-sm', theme.textSecondary, theme.bgButtonHover]"
            @click="handleViewPresets"
          >
            View Presets
          </Button>
          
          <!-- New Collection Button with Split Dropdown -->
          <div class="flex items-center rounded-md overflow-hidden border" :class="theme.borderSecondary">
            <!-- Main Button (Left Side) -->
            <Button
              :class="[
                'bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-r-none border-r',
                'rounded-l-md'
              ]"
              @click="handleCreateCollection"
            >
              New Collection
            </Button>
            
            <!-- Dropdown Trigger (Right Side) -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button
                  :class="[
                    'bg-teal-500 hover:bg-teal-600 text-white px-2 py-2 rounded-l-none border-0',
                    'rounded-r-md'
                  ]"
                >
                  <ChevronDown class="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary]">
                <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
                  Import Collection
                </DropdownMenuItem>
                <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
                  From Template
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </template>
      </PageHeader>

      <!-- Filter/Sort Bar -->
      <div class="flex items-center gap-3 flex-wrap">
        <Select
          :class="[
            'w-[140px]',
            theme.bgInput,
            theme.borderInput,
            theme.textInput
          ]"
        >
          <option value="">Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="draft">Draft</option>
        </Select>

        <Select
          :class="[
            'w-[140px]',
            theme.bgInput,
            theme.borderInput,
            theme.textInput
          ]"
        >
          <option value="">Category Tag</option>
          <option value="wedding">Wedding</option>
          <option value="portrait">Portrait</option>
          <option value="event">Event</option>
        </Select>

        <Select
          :class="[
            'w-[140px]',
            theme.bgInput,
            theme.borderInput,
            theme.textInput
          ]"
        >
          <option value="">Event Date</option>
          <option value="recent">Recent</option>
          <option value="oldest">Oldest</option>
        </Select>

        <Select
          :class="[
            'w-[140px]',
            theme.bgInput,
            theme.borderInput,
            theme.textInput
          ]"
        >
          <option value="">Expiry Date</option>
          <option value="soon">Expiring Soon</option>
          <option value="expired">Expired</option>
        </Select>

        <Select
          :class="[
            'w-[140px]',
            theme.bgInput,
            theme.borderInput,
            theme.textInput
          ]"
        >
          <option value="">Starred</option>
          <option value="yes">Starred Only</option>
          <option value="no">Not Starred</option>
        </Select>
      </div>

      <!-- Collections Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Loading State -->
        <div v-if="isLoadingCollections" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <div
            v-for="i in 8"
            :key="i"
            :class="[
              'rounded-xl border overflow-hidden animate-pulse',
              theme.bgCard,
              theme.borderCard,
            ]"
          >
            <!-- Image skeleton -->
            <div :class="['aspect-[4/3]', theme.bgSkeleton]"></div>
            <!-- Content skeleton -->
            <div class="p-4 space-y-3">
              <div :class="['h-5 w-3/4 rounded', theme.bgSkeleton]"></div>
              <div class="flex items-center gap-2">
                <div :class="['h-3 w-20 rounded', theme.bgSkeleton]"></div>
                <div :class="['h-1 w-1 rounded-full', theme.bgSkeleton]"></div>
                <div :class="['h-3 w-24 rounded', theme.bgSkeleton]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="sortedCollections.length === 0" class="flex items-center justify-center py-16">
          <EmptyState
            message="No collections found"
            action-label="Create New Collection"
            :icon="Folder"
            @action="handleCreateCollection"
          />
        </div>

        <!-- Collections Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <CollectionCard
            v-for="collection in sortedCollections"
            :key="collection.id"
            :image-src="collection.image"
            :alt-text="collection.title"
            :caption-text="collection.title"
            :subtitle="getSubtitle(collection)"
            container-height="auto"
            container-width="100%"
            image-height="240px"
            image-width="100%"
            :rotate-amplitude="12"
            :scale-on-hover="1.05"
            :display-overlay-content="false"
            :show-content="true"
            :show-menu="true"
            :show-star="!(collection.isFolder || !!collection.icon)"
            :is-starred="collection.starred || false"
            :badge="collection.badge || false"
            :badge-icon="collection.badgeIcon"
            :icon="collection.icon"
            :folder-icon="collection.icon"
            :preview-images="collection.previewImages"
            :is-locked="collection.isLocked || false"
            :is-folder="collection.isFolder || !!collection.icon"
            image-container-class="aspect-[4/3]"
            @star-click="toggleStar(collection)"
          >
            <template #subtitle>
              <div class="flex items-center gap-2 flex-wrap">
                <span v-if="collection.itemCount !== undefined" class="flex items-center gap-1">
                  <component
                    v-if="collection.itemIcon"
                    :is="collection.itemIcon"
                    class="h-3 w-3"
                  />
                  <span>{{ collection.itemCount }} {{ collection.itemLabel }}</span>
                </span>
                <span v-if="collection.date" class="flex items-center gap-1.5">
                  <span class="w-1 h-1 rounded-full bg-current opacity-50"></span>
                  <span>{{ collection.date }}</span>
                </span>
              </div>
            </template>
          </CollectionCard>
        </div>
      </div>

      <!-- Collections List View -->
      <CollectionsTable
        v-else
        :items="sortedCollections"
        :loading="isLoadingCollections"
        :selected-items="selectedCollections"
        empty-message="No collections found"
        empty-action-label="Create New Collection"
        :empty-icon="Folder"
        @select="handleSelectCollection"
        @star-click="toggleStar"
        @link-click="handleCopyLink"
        @copy-pin="handleCopyPin"
        @item-click="handleCollectionClick"
        @empty-action="handleCreateCollection"
      />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ChevronDown,
  Folder,
  Circle,
} from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import Select from '@/components/shadcn/Select.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useLoadingStates } from '@/composables/useLoadingStates'
import { useCollectionSort } from '@/composables/useCollectionSort'
import { COLLECTION_SORT_OPTIONS } from '@/constants/sortOptions'
import PageHeader from '@/components/custom/PageHeader.vue'
import CollectionCard from '@/components/custom/CollectionCard.vue'
import CollectionsTable from '@/components/custom/CollectionsTable.vue'
import EmptyState from '@/components/custom/EmptyState.vue'

const theme = useThemeClasses()

// Loading state
const { states: loadingStates, setAllLoading } = useLoadingStates(['collections'], true)
const isLoadingCollections = loadingStates.collections

// View mode and sorting
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('created-new-old')
const searchQuery = ref('')
const sortOptions = COLLECTION_SORT_OPTIONS

// Selected collections (for list view)
const selectedCollections = ref<number[]>([])

const getSubtitle = (collection: any) => {
  const parts = []
  if (collection.itemCount !== undefined) {
    parts.push(`${collection.itemCount} ${collection.itemLabel}`)
  }
  if (collection.date) {
    parts.push(collection.date)
  }
  return parts.join(' • ')
}

// Filter and sort collections
const filteredCollections = computed(() => {
  if (!searchQuery.value.trim()) {
    return collections.value
  }
  const query = searchQuery.value.toLowerCase()
  return collections.value.filter(collection => 
    collection.title.toLowerCase().includes(query)
  )
})

const { sortedItems: sortedCollections } = useCollectionSort(filteredCollections, sortBy)

const handleCreateCollection = () => {
  // TODO: Implement create collection logic
}

const handleViewPresets = () => {
  // TODO: Implement view presets logic
}

const toggleStar = (collection: any) => {
  collection.starred = !collection.starred
}

const handleSelectCollection = (id: number, checked: boolean) => {
  if (checked) {
    selectedCollections.value.push(id)
  } else {
    selectedCollections.value = selectedCollections.value.filter((selId: number) => selId !== id)
  }
}

const handleCollectionClick = (collection: any) => {
  // TODO: Navigate to collection detail page
}

const handleCopyLink = (collection: any) => {
  // TODO: Copy collection link to clipboard
}

const handleCopyPin = (collection: any) => {
  // TODO: Copy download PIN to clipboard
}

// Simulate loading on mount
onMounted(() => {
  // Set loading state to true initially
  setAllLoading(true)
  // Simulate data fetch - keep loading for 1.5 seconds to see skeleton loaders
  setTimeout(() => {
    setAllLoading(false)
  }, 1500)
})

const collections = ref([
  {
    id: 1,
    title: 'Test Foolder',
    itemCount: 0,
    itemLabel: 'collections',
    date: 'Nov 12, 2025',
    dateCreated: 'Nov 30, 2025',
    icon: Folder,
    image: null,
    isFolder: true,
    isLocked: true,
    previewImages: [],
    password: 'password123',
    downloadPin: '1234',
    status: 'DRAFT',
  },
  {
    id: 2,
    title: 'Joseph X Cuppy',
    itemCount: 2,
    itemLabel: 'items',
    date: 'Nov 29, 2025',
    dateCreated: 'Nov 24, 2025',
    itemIcon: Circle,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    password: null,
    downloadPin: '5678',
    status: 'DRAFT',
  },
  {
    id: 3,
    title: 'MazeLoot Demo',
    itemCount: 0,
    itemLabel: 'items',
    dateCreated: 'Nov 24, 2025',
    starred: true,
    badge: true,
    badgeIcon: Circle,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
    password: null,
    downloadPin: '9012',
    status: 'DRAFT',
  },
  {
    id: 4,
    title: 'Test',
    itemCount: 0,
    itemLabel: 'items',
    date: 'Nov 5, 2025',
    dateCreated: 'Nov 17, 2025',
    itemIcon: Circle,
    isLocked: true,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
    password: null,
    downloadPin: '3456',
    status: 'DRAFT',
  },
  {
    id: 5,
    title: 'Mazeloot Demo',
    itemCount: 0,
    itemLabel: 'items',
    date: 'Nov 13, 2025',
    dateCreated: 'Nov 10, 2025',
    itemIcon: Circle,
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=300&fit=crop',
    password: null,
    downloadPin: '7890',
    status: 'DRAFT',
  },
  {
    id: 6,
    title: 'Mazeloot folder',
    itemCount: 1,
    itemLabel: 'collection',
    dateCreated: 'Nov 10, 2025',
    icon: Folder,
    image: null,
    isFolder: true,
    isLocked: true,
    previewImages: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
    ],
    password: null,
    downloadPin: null,
  },
  {
    id: 7,
    title: 'Test Folder',
    itemCount: 0,
    itemLabel: 'collections',
    dateCreated: 'Sep 1, 2025',
    icon: Folder,
    image: null,
    isFolder: true,
    isLocked: false,
    previewImages: [],
    password: null,
    downloadPin: null,
  },
  {
    id: 8,
    title: 'My Collection',
    itemCount: 1,
    itemLabel: 'item',
    dateCreated: 'Sep 1, 2025',
    itemIcon: Circle,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
    password: null,
    downloadPin: '2468',
    status: 'DRAFT',
  },
  {
    id: 9,
    title: 'My Sample Collection',
    itemCount: 42,
    itemLabel: 'items',
    date: 'Sep 1, 2025',
    dateCreated: 'Sep 1, 2025',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    password: null,
    downloadPin: '1357',
    status: 'PUBLISHED',
  },
])
</script>
