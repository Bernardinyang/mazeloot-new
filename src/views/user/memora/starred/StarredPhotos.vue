<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Photos </template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        title="Starred Photos"
        :search-query="searchQuery"
        :sort-by="sortBy"
        :view-mode="viewMode"
        :sort-options="sortOptions"
        sort-label="Sort photos by"
        @update:search-query="searchQuery = $event"
        @update:sort-by="sortBy = $event"
        @update:view-mode="viewMode = $event"
      />

      <!-- Photos Grid View -->
      <div v-if="viewMode === 'grid'">
        <!-- Loading State -->
        <div
          v-if="isLoadingPhotos"
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <div
            v-for="i in 20"
            :key="i"
            class="aspect-square rounded-lg overflow-hidden animate-pulse"
            :class="theme.bgSkeleton"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="sortedPhotos.length === 0" class="flex items-center justify-center py-16">
          <EmptyState
            message="No starred photos found"
            action-label="Browse Photos"
            :icon="Image"
            @action="handleBrowsePhotos"
          />
        </div>

        <!-- Photos Grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="photo in sortedPhotos"
            :key="photo.id"
            class="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            :class="[theme.bgCardSolid, theme.borderSecondary, 'border']"
            @click="handlePhotoClick(photo)"
          >
            <img
              :src="photo.thumbnail || photo.url"
              :alt="photo.title || 'Photo'"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <!-- Overlay on hover -->
            <div
              class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"
            >
              <!-- Star button - bottom right -->
              <button
                type="button"
                class="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                @click.stop="toggleStar(photo)"
                :title="photo.starred ? 'Unstar' : 'Star'"
              >
                <Star
                  :class="[
                    'h-4 w-4',
                    photo.starred ? 'fill-yellow-400 text-yellow-400' : 'text-white',
                  ]"
                />
              </button>

              <!-- More options button - top right -->
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button
                    type="button"
                    class="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                    @click.stop
                    title="More options"
                  >
                    <MoreVertical class="h-4 w-4 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[180px]']"
                >
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click.stop="handleOpenPhoto(photo)"
                  >
                    <Maximize2 class="mr-2 h-4 w-4" />
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click.stop="handleViewCollection(photo)"
                  >
                    <FolderOpen class="mr-2 h-4 w-4" />
                    View collection
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click.stop="handleDownloadPhoto(photo)"
                  >
                    <Download class="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click.stop="handleCopyFilenames(photo)"
                  >
                    <Copy class="mr-2 h-4 w-4" />
                    Copy filenames
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <!-- Photos List View -->
      <div v-else>
        <!-- Loading State -->
        <div v-if="isLoadingPhotos" class="space-y-2">
          <div
            v-for="i in 10"
            :key="i"
            class="flex items-center gap-4 p-4 rounded-lg animate-pulse"
            :class="theme.bgSkeleton"
          >
            <div :class="['w-16 h-16 rounded', theme.bgSkeleton]"></div>
            <div class="flex-1 space-y-2">
              <div :class="['h-4 w-48 rounded', theme.bgSkeleton]"></div>
              <div :class="['h-3 w-32 rounded', theme.bgSkeleton]"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="sortedPhotos.length === 0" class="flex items-center justify-center py-16">
          <EmptyState
            message="No starred photos found"
            action-label="Browse Photos"
            :icon="Image"
            @action="handleBrowsePhotos"
          />
        </div>

        <!-- Photos List -->
        <div v-else class="space-y-2">
          <div
            v-for="photo in sortedPhotos"
            :key="photo.id"
            class="flex items-center gap-4 p-4 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
            :class="[theme.bgCard, theme.borderSecondary]"
            @click="handlePhotoClick(photo)"
          >
            <img
              :src="photo.thumbnail || photo.url"
              :alt="photo.title || 'Photo'"
              class="w-16 h-16 rounded object-cover flex-shrink-0"
              loading="lazy"
            />
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-sm truncate" :class="theme.textPrimary">
                {{ photo.title || 'Untitled Photo' }}
              </h3>
              <p class="text-xs mt-0.5 truncate" :class="theme.textSecondary">
                {{ photo.collection || 'No collection' }} • {{ photo.date || 'Unknown date' }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click.stop="toggleStar(photo)"
                :title="photo.starred ? 'Unstar' : 'Star'"
              >
                <Star
                  :class="[
                    'h-4 w-4',
                    photo.starred ? 'fill-yellow-400 text-yellow-400' : theme.textSecondary,
                  ]"
                />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button
                    type="button"
                    class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                    @click.stop
                    title="More options"
                  >
                    <MoreVertical class="h-4 w-4" :class="theme.textSecondary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[180px]']"
                >
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click.stop="handleOpenPhoto(photo)"
                  >
                    <Maximize2 class="mr-2 h-4 w-4" />
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click.stop="handleViewCollection(photo)"
                  >
                    <FolderOpen class="mr-2 h-4 w-4" />
                    View collection
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click.stop="handleDownloadPhoto(photo)"
                  >
                    <Download class="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click.stop="handleCopyFilenames(photo)"
                  >
                    <Copy class="mr-2 h-4 w-4" />
                    Copy filenames
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Viewer Modal -->
    <PhotoViewer
      v-model="showPhotoViewer"
      :photos="sortedPhotos"
      :initial-index="selectedPhotoIndex"
      @download="handleDownloadPhoto"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Star, MoreVertical, Image, Maximize2, FolderOpen, Download, Copy } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useLoadingStates } from '@/composables/useLoadingStates'
import { useCollectionSort } from '@/composables/useCollectionSort'
import { PHOTO_SORT_OPTIONS } from '@/constants/sortOptions'
import PageHeader from '@/components/molecules/PageHeader.vue'
import EmptyState from '@/components/molecules/EmptyState.vue'
import PhotoViewer from '@/components/organisms/PhotoViewer.vue'
import { toast } from 'vue-sonner'

const router = useRouter()
const theme = useThemeClasses()

// Loading state
const { states: loadingStates, setAllLoading } = useLoadingStates(['photos'], true)
const isLoadingPhotos = loadingStates.photos

// View mode and sorting
const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('date-new-old')
const searchQuery = ref('')
const sortOptions = PHOTO_SORT_OPTIONS

// Filter photos to only show starred ones, then sort
const starredPhotos = computed(() => {
  return photos.value.filter(photo => photo.starred === true)
})

const filteredPhotos = computed(() => {
  if (!searchQuery.value.trim()) {
    return starredPhotos.value
  }
  const query = searchQuery.value.toLowerCase()
  return starredPhotos.value.filter(
    photo =>
      (photo.title || '').toLowerCase().includes(query) ||
      (photo.collection || '').toLowerCase().includes(query)
  )
})

const { sortedItems: sortedPhotos } = useCollectionSort(filteredPhotos, sortBy)

const toggleStar = (photo: any) => {
  photo.starred = !photo.starred
}

const showPhotoViewer = ref(false)
const selectedPhotoIndex = ref(0)

const handlePhotoClick = (photo: any) => {
  const index = sortedPhotos.value.findIndex(p => p.id === photo.id)
  if (index !== -1) {
    selectedPhotoIndex.value = index
    showPhotoViewer.value = true
  }
}

const handleOpenPhoto = (photo: any) => {
  handlePhotoClick(photo)
}

const handleViewCollection = (photo: any) => {
  // TODO: Navigate to the collection this photo belongs to
  console.log('View collection:', photo.collection)
  if (photo.collection) {
    toast.info('Viewing collection...', {
      description: photo.collection,
    })
    // router.push({ name: 'collectionDetail', params: { collectionId: photo.collectionId } })
  } else {
    toast.error('No collection found', {
      description: 'This photo does not belong to a collection.',
    })
  }
}

const handleDownloadPhoto = async (photo: any) => {
  try {
    // TODO: Implement actual download logic
    const link = document.createElement('a')
    link.href = photo.url || photo.thumbnail
    link.download = photo.title || 'photo.jpg'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Download started', {
      description: photo.title || 'Photo',
    })
  } catch (error) {
    console.error('Failed to download photo:', error)
    toast.error('Download failed', {
      description: 'Could not download photo. Please try again.',
    })
  }
}

const handleCopyFilenames = async (photo: any) => {
  try {
    const filename = photo.title || photo.filename || 'untitled.jpg'
    await navigator.clipboard.writeText(filename)
    toast.success('Filename copied', {
      description: 'Photo filename has been copied to clipboard.',
    })
  } catch (error) {
    console.error('Failed to copy filename:', error)
    toast.error('Failed to copy', {
      description: 'Could not copy filename to clipboard.',
    })
  }
}

const handleBrowsePhotos = () => {
  // TODO: Navigate to all photos page
  router.push({ name: 'manageCollections' })
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

// Sample photos data
// In a real app, this would come from an API/store
const photos = ref([
  {
    id: 1,
    title: 'Sunset Beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop',
    collection: 'Nature Collection',
    date: '2025-01-15',
    dateCreated: '2025-01-15',
    starred: true,
  },
  {
    id: 2,
    title: 'Mountain View',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    collection: 'Landscape Collection',
    date: '2025-01-14',
    dateCreated: '2025-01-14',
    starred: true,
  },
  {
    id: 3,
    title: 'City Lights',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&h=200&fit=crop',
    collection: 'Urban Collection',
    date: '2025-01-13',
    dateCreated: '2025-01-13',
    starred: true,
  },
  {
    id: 4,
    title: 'Forest Path',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200&fit=crop',
    collection: 'Nature Collection',
    date: '2025-01-12',
    dateCreated: '2025-01-12',
    starred: true,
  },
  {
    id: 5,
    title: 'Ocean Waves',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=200&fit=crop',
    collection: 'Nature Collection',
    date: '2025-01-11',
    dateCreated: '2025-01-11',
    starred: true,
  },
  {
    id: 6,
    title: 'Desert Landscape',
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=200&h=200&fit=crop',
    collection: 'Landscape Collection',
    date: '2025-01-10',
    dateCreated: '2025-01-10',
    starred: true,
  },
])
</script>
