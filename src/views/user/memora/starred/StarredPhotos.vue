<template>
  <DashboardLayout>
    <template #breadcrumb> Starred Media</template>
    <template #header>
      <div class="flex items-center justify-end w-full">
        <!-- Header actions can go here -->
      </div>
    </template>

    <div class="space-y-6">
      <!-- Top Header Bar -->
      <PageHeader
        :search-query="searchQuery"
        :sort-by="sortBy"
        :sort-options="sortOptions"
        :view-mode="viewMode"
        sort-label="Sort photos by"
        title="Starred Media"
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
            :class="theme.bgSkeleton"
            class="aspect-square rounded-lg overflow-hidden animate-pulse"
          />
        </div>

        <!-- Empty State -->
        <div v-else-if="sortedPhotos.length === 0" class="flex items-center justify-center py-16">
          <EmptyState
            :icon="Image"
            action-label="Browse Photos"
            message="No starred photos found"
            @action="handleBrowsePhotos"
          />
        </div>

        <!-- Photos Grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="photo in sortedPhotos"
            :key="photo.id"
            :class="[theme.bgCardSolid, theme.borderSecondary, 'border']"
            class="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            @click="handlePhotoClick(photo)"
          >
            <img
              :alt="photo.title || 'Photo'"
              :src="
                photo.thumbnailUrl ||
                photo.thumbnail ||
                photo.largeImageUrl ||
                photo.file?.url ||
                photo.url
              "
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <!-- Overlay on hover -->
            <div
              class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"
            >
              <!-- Star button - bottom right -->
              <button
                :title="photo.starred ? 'Unstar' : 'Star'"
                class="absolute bottom-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                type="button"
                @click.stop="toggleStar(photo)"
              >
                <Star
                  :class="['h-4 w-4', photo.starred ? 'fill-yellow-400 text-yellow-400' : '']"
                />
              </button>

              <!-- More options button - top right -->
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button
                    class="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
                    title="More options"
                    type="button"
                    @click.stop
                  >
                    <MoreVertical class="h-4 w-4 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[180px]']"
                  align="end"
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
            :class="theme.bgSkeleton"
            class="flex items-center gap-4 p-4 rounded-lg animate-pulse"
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
            :icon="Image"
            action-label="Browse Photos"
            message="No starred photos found"
            @action="handleBrowsePhotos"
          />
        </div>

        <!-- Photos List -->
        <div v-else class="space-y-2">
          <div
            v-for="photo in sortedPhotos"
            :key="photo.id"
            :class="[theme.bgCard, theme.borderSecondary]"
            class="flex items-center gap-4 p-4 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
            @click="handlePhotoClick(photo)"
          >
            <img
              :alt="photo.title || 'Photo'"
              :src="
                photo.thumbnailUrl ||
                photo.thumbnail ||
                photo.largeImageUrl ||
                photo.file?.url ||
                photo.url
              "
              class="w-16 h-16 rounded object-cover flex-shrink-0"
              loading="lazy"
            />
            <div class="flex-1 min-w-0">
              <h3 :class="theme.textPrimary" class="font-medium text-sm truncate">
                {{ photo.title || 'Untitled Photo' }}
              </h3>
              <p :class="theme.textSecondary" class="text-xs mt-0.5 truncate">
                {{ photo.collection || 'No collection' }} • {{ photo.date || 'Unknown date' }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                :title="photo.starred ? 'Unstar' : 'Star'"
                class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                type="button"
                @click.stop="toggleStar(photo)"
              >
                <Star
                  :class="['h-4 w-4', photo.starred ? 'fill-yellow-400 text-yellow-400' : '']"
                />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button
                    class="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                    title="More options"
                    type="button"
                    @click.stop
                  >
                    <MoreVertical :class="theme.textSecondary" class="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  :class="[theme.bgDropdown, theme.borderSecondary, 'min-w-[180px]']"
                  align="end"
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
    <MediaLightbox
      v-model="showPhotoViewer"
      :initial-index="selectedPhotoIndex"
      :items="sortedPhotos"
      :placeholder-image="'/placeholder-image.png'"
      @download="handleDownloadPhoto"
    />
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Copy, Download, FolderOpen, Image, Maximize2, MoreVertical, Star } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
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
import MediaLightbox from '@/components/organisms/MediaLightbox.vue'
import { toast } from '@/utils/toast'

const router = useRouter()
const theme = useThemeClasses()

// Loading state
const loadingKeys = ['photos']
const {
  states,
  setLoading,
  setAllLoading,
  isLoading: loadingStates,
} = useLoadingStates(loadingKeys, true)
const isLoadingPhotos = loadingStates.photos

// View mode and sorting
const viewMode = ref('grid')
const sortBy = ref('date-new-old')
const searchQuery = ref('')
const sortOptions = PHOTO_SORT_OPTIONS

// Filter photos to only show starred ones, then sort
const starredMedias = computed(() => {
  return photos.value.filter(photo => photo.starred === true)
})

const filteredPhotos = computed(() => {
  if (!searchQuery.value.trim()) {
    return starredMedias.value
  }
  const query = searchQuery.value.toLowerCase()
  return starredMedias.value.filter(
    photo =>
      (photo.title || '').toLowerCase().includes(query) ||
      (photo.collection || '').toLowerCase().includes(query)
  )
})

const { sortedItems: sortedPhotos } = useCollectionSort(
  computed(() => filteredPhotos.value),
  sortBy
)

const toggleStar = photo => {
  photo.starred = !photo.starred
}

const showPhotoViewer = ref(false)
const selectedPhotoIndex = ref(0)

const handlePhotoClick = photo => {
  const index = sortedPhotos.value.findIndex(p => p.id === photo.id)
  if (index !== -1) {
    selectedPhotoIndex.value = index
    showPhotoViewer.value = true
  }
}

const handleOpenPhoto = photo => {
  handlePhotoClick(photo)
}

const handleViewCollection = photo => {
  if (photo.collection) {
    toast.info('Viewing collection...', {
      description: 'Opening collection in a new tab',
    })
    // router.push({ name)
  } else {
    toast.error('No collection found', {
      description: 'This photo is not associated with a collection',
    })
  }
}

const handleDownloadPhoto = async photo => {
  try {
    const link = document.createElement('a')
    link.href =
      photo.largeImageUrl || photo.file?.url || photo.url || photo.thumbnailUrl || photo.thumbnail
    link.download = photo.title || 'photo.jpg'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Download started', {
      description: 'Your download has started',
    })
  } catch (error) {
    toast.error('Download failed', {
      description: error.message || 'Failed to start download',
    })
  }
}

const handleCopyFilenames = async photo => {
  try {
    const filename = photo.title || photo.filename || 'untitled.jpg'
    await navigator.clipboard.writeText(filename)
    toast.success('Filename copied', {
      description: 'The filename has been copied to your clipboard',
    })
  } catch (error) {
    toast.error('Failed to copy', {
      description: error.message || 'Could not copy to clipboard',
    })
  }
}

const handleBrowsePhotos = () => {
  router.push({ name: 'manageCollections' })
}

// Simulate loading on mount
onMounted(() => {
  setAllLoading(true)
  // Simulate data fetch - keep loading for 1.5 seconds to see skeleton loaders
  setTimeout(() => {
    setAllLoading(false)
  }, 1500)
})

// Sample photos data
// In a real app, this would come from an API/store
const photos = ref([])
</script>
