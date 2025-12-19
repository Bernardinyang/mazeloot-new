<template>
  <div :style="{ backgroundColor: backgroundColor }">
    <!-- Navbar Style (when cover is 'none') -->
    <div
      v-if="
        coverLayoutConfig && (coverLayoutConfig.layout === 'none' || designConfig.cover === 'none')
      "
      :style="{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }"
      class="sticky top-0 z-50 w-full border-b backdrop-blur-md"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ color: textColor }"
              class="text-xl md:text-2xl font-bold"
            >
              {{ collectionName }}
            </h1>
            <p
              v-if="eventDate"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ color: textColor, opacity: 0.8 }"
              class="text-xs md:text-sm mt-1 uppercase tracking-wide"
            >
              {{ formattedDate }}
            </p>
          </div>
          <div class="flex gap-4">
            <button
              v-for="tab in tabs"
              :key="tab"
              :class="[fontFamilyClass, activeTab === tab ? 'font-bold' : 'font-normal']"
              :style="{
                color: activeTab === tab ? accentColor : textColor,
                borderBottom: activeTab === tab ? `3px solid ${accentColor}` : 'none',
                paddingBottom: '8px',
                opacity: activeTab === tab ? 1 : 0.7,
              }"
              class="flex items-center gap-2 text-sm uppercase tracking-wide transition-all duration-200 font-medium"
              @click="activeTab = tab"
            >
              <component
                :is="getTabIcon(tab)"
                v-if="
                  designConfig.navigationStyle === 'icon-only' ||
                  designConfig.navigationStyle === 'icon-text'
                "
                class="h-4 w-4"
              />
              <span
                v-if="!designConfig.navigationStyle || designConfig.navigationStyle === 'icon-text'"
              >
                {{ tab }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cover Section (when cover is not 'none') -->
    <div v-else :style="{ backgroundColor: backgroundColor }" class="relative w-full min-h-screen">
      <!-- Use Dynamic Cover Renderer -->
      <DynamicCoverRenderer
        v-if="coverLayoutConfig && coverLayoutConfig.layout !== 'none'"
        :config="coverLayoutConfig"
        :content="{
          title: collectionName,
          date: formattedDate,
        }"
        :media="{
          url: coverImageWithFallback,
          src: coverImageWithFallback,
          alt: collectionName,
        }"
      >
        <template #content="{ content: slotContent }">
          <div
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{
              color: textColor,
              textShadow: coverImageWithFallback
                ? '0 4px 20px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
                : 'none',
            }"
          >
            <div v-if="slotContent.title" class="text-3xl md:text-5xl font-bold mb-4">
              {{ slotContent.title }}
            </div>
            <div
              v-if="slotContent.date"
              :style="{ opacity: 0.9 }"
              class="text-base md:text-lg uppercase tracking-wide"
            >
              {{ slotContent.date }}
            </div>
            <!-- View Gallery Button -->
            <button
              :style="{
                backgroundColor: accentColor,
                boxShadow: `0 4px 12px rgba(0,0,0,0.2)`,
                marginTop: '2rem',
              }"
              class="px-8 py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider text-white shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-110 hover:-translate-y-0.5"
              @click="scrollToGallery"
            >
              View Gallery
            </button>
          </div>
        </template>
      </DynamicCoverRenderer>

      <!-- Cover Decorations (kept for backward compatibility, can be removed later) -->
      <CoverDecorations :config="coverConfig" :palette-colors="paletteColors" />
      <!-- Top Branding -->
      <div
        v-if="showBranding"
        :class="[fontFamilyClass, fontStyleClass]"
        :style="{
          color: textColor,
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          opacity: 0.8,
        }"
        class="text-xs uppercase tracking-wider mb-4 font-semibold"
      >
        {{ brandingText }}
      </div>

      <!-- Cover Type, avatar in O, date, name, button -->
      <div
        v-if="coverConfig.specialLayout === 'joy'"
        :style="{ backgroundColor: backgroundColor }"
        class="flex flex-col items-center justify-center h-full relative"
      >
        <!-- Background pattern (subtle stars/plus signs) -->
        <div
          v-if="joyCoverBackgroundPattern === 'crosses' || !joyCoverBackgroundPattern"
          class="absolute inset-0 opacity-20"
        >
          <!-- Scattered star/plus patterns -->
          <div
            v-for="i in 25"
            :key="i"
            :style="{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 80}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              transform: `rotate(${Math.random() * 360}deg)`,
              backgroundColor:
                Math.random() > 0.5 ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.1)',
              border: Math.random() > 0.5 ? '1px solid rgba(220, 38, 38, 0.2)' : 'none',
              filter: 'blur(0.5px)',
            }"
            class="absolute"
          ></div>
        </div>

        <!-- Top Branding -->
        <div
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{
            color: textColor,
            letterSpacing: '0.2em',
          }"
          class="text-xs uppercase tracking-[0.2em] mb-8 z-10"
        >
          BERNODE
        </div>

        <!-- Title with avatar in O -->
        <div class="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 z-10">
          <template v-for="(char, index) in joyCoverTitle.split('')" :key="`char-${index}`">
            <span
              v-if="char.toUpperCase() !== 'O'"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{
                color: textColor,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }"
              class="text-7xl md:text-8xl lg:text-9xl leading-none"
            >
              {{ char }}
            </span>
            <div v-else class="relative">
              <div
                v-if="joyCoverAvatar || coverImageWithFallback"
                :style="{
                  border,
                }"
                class="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100"
              >
                <img
                  :src="joyCoverAvatar || coverImageWithFallback"
                  alt="Avatar"
                  class="w-full h-full object-cover"
                  @error="handleCoverImageError"
                />
              </div>
              <div
                v-else
                class="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-amber-50 to-amber-100"
              ></div>
            </div>
          </template>
        </div>

        <!-- Date -->
        <div
          v-if="joyCoverShowDate !== false && eventDate"
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{
            color: textColor,
            letterSpacing: '0.2em',
          }"
          class="text-sm md:text-base uppercase tracking-[0.15em] mb-4 z-10"
        >
          {{ formattedDate }}
        </div>

        <!-- Collection Title (Name) -->
        <div
          v-if="joyCoverShowName !== false"
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{
            color: textColor,
          }"
          class="text-xl md:text-2xl lg:text-3xl italic mb-6 md:mb-8 z-10"
        >
          {{ collectionName }}
        </div>

        <!-- Button -->
        <button
          v-if="joyCoverShowButton !== false"
          :style="{
            backgroundColor: accentColor,
            borderRadius: '8px',
          }"
          class="px-8 md:px-10 py-3 md:py-3.5 text-sm md:text-base font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:opacity-90 z-10"
          @click="scrollToGallery"
        >
          {{ joyCoverButtonText || 'VIEW GALLERY' }}
        </button>
      </div>

      <!-- Cover Type) -->
      <div
        v-else-if="
          coverConfig.textPosition === 'center' &&
          coverConfig.textAlignment === 'center' &&
          !coverConfig.specialLayout
        "
        class="text-center"
      >
        <!-- Decorative elements -->
        <div
          :style="{ backgroundColor: backgroundColor }"
          class="absolute top-1/4 left-1/4 w-2 h-2 rounded-full opacity-20"
        ></div>
        <div
          :style="{ backgroundColor: backgroundColor }"
          class="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full opacity-30"
        ></div>
        <div
          :style="{ backgroundColor: backgroundColor }"
          class="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full opacity-25"
        ></div>

        <div
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{
            color: textColor,
            textShadow: `0 2px 4px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.15)`,
          }"
          class="text-5xl md:text-7xl font-black mb-6 leading-tight"
        >
          {{ collectionName }}
        </div>
        <div
          v-if="eventDate"
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{
            color: textColor,
            opacity: 0.9,
            letterSpacing: '0.05em',
          }"
          class="text-base md:text-xl uppercase tracking-widest font-medium"
        >
          {{ formattedDate }}
        </div>
      </div>

      <!-- Cover Type) -->
      <div
        v-else-if="
          coverConfig.textPosition === 'bottom' &&
          coverConfig.textAlignment === 'left' &&
          !coverConfig.specialLayout
        "
        class="absolute bottom-12 left-8 md:left-12 text-left max-w-2xl"
      >
        <!-- Decorative line -->
        <div
          :style="{ backgroundColor: backgroundColor, opacity: 0.8 }"
          class="w-16 h-0.5 mb-4"
        ></div>

        <div
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{
            color,
            textShadow: `0 2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)`,
          }"
          class="text-4xl md:text-6xl font-black mb-3 leading-tight"
        >
          {{ collectionName }}
        </div>
        <div
          v-if="eventDate"
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{
            color: textColor,
            opacity: 0.9,
            letterSpacing: '0.05em',
          }"
          class="text-sm md:text-lg uppercase tracking-widest font-medium"
        >
          {{ formattedDate }}
        </div>
      </div>

      <!-- Dynamic Cover - Based on config -->
      <div v-else class="w-full">
        <div
          :class="[
            fontFamilyClass,
            fontStyleClass,
            coverConfig.textAlignment === 'center'
              ? 'text-center'
              : coverConfig.textAlignment === 'right'
                ? 'text-right'
                : 'text-left',
          ]"
          :style="{
            color: textColor,
            textShadow: coverImageWithFallback
              ? '0 4px 20px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)'
              : 'none',
          }"
          class="text-3xl md:text-5xl font-bold mb-4"
        >
          {{ collectionName }}
        </div>
        <div
          v-if="eventDate"
          :class="[
            fontFamilyClass,
            fontStyleClass,
            coverConfig.textAlignment === 'center'
              ? 'text-center'
              : coverConfig.textAlignment === 'right'
                ? 'text-right'
                : 'text-left',
          ]"
          :style="{
            color: textColor,
            opacity: 0.9,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }"
          class="text-base md:text-lg uppercase tracking-wide"
        >
          {{ formattedDate }}
        </div>
      </div>
    </div>

    <!-- Gallery Content Section -->
    <div
      id="gallery"
      :style="{ backgroundColor: backgroundColor }"
      class="container mx-auto px-4 py-8 md:py-12"
    >
      <!-- Navigation Tabs (only show if cover is not 'none', handles it) -->
      <div
        v-if="coverLayoutConfig.layout !== 'none' && designConfig.cover !== 'none'"
        :style="{ borderColor: borderColor }"
        class="mb-8 flex items-center justify-between pb-4"
      >
        <!-- Left -->
        <div class="flex flex-col">
          <div
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{ color: textColor }"
            class="text-base md:text-lg uppercase tracking-wide"
          >
            {{ collectionName.toUpperCase() }}
          </div>
          <div
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{ color: textColor, opacity: 0.8 }"
            class="text-xs md:text-sm uppercase tracking-wide mt-0.5"
          >
            {{ brandingText }}
          </div>
        </div>

        <!-- Center -->
        <div class="flex items-center gap-6">
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{
              color: activeTab === tab ? accentColor : textColor,
              opacity: activeTab === tab ? 1 : 0.7,
            }"
            class="text-sm transition-all duration-200"
            @click="activeTab = tab"
          >
            {{ tab }}
          </button>
        </div>

        <!-- Right -->
        <div class="flex items-center gap-4">
          <button
            :style="{ color: textColor }"
            class="p-2 transition-opacity duration-200 hover:opacity-70"
            title="Like"
          >
            <Heart class="h-5 w-5" />
          </button>
          <button
            :style="{ color: textColor }"
            class="p-2 transition-opacity duration-200 hover:opacity-70"
            title="Share"
          >
            <Share2 class="h-5 w-5" />
          </button>
          <button
            :style="{ color: textColor }"
            class="p-2 transition-opacity duration-200 hover:opacity-70"
            title="More"
          >
            <MoreVertical class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Media Grid -->
      <div
        v-if="isLoading"
        :class="[gridClasses, 'overflow-hidden']"
        :style="
          designConfig.gridStyle === 'masonry'
            ? { columnGap: `${designConfig.gridSpacing * 0.5}rem` }
            : {}
        "
      >
        <div
          v-for="i in 6"
          :key="i"
          :class="[
            designConfig.gridStyle === 'masonry' ? 'break-inside-avoid' : '',
            designConfig.gridStyle === 'masonry' ? thumbnailSizeClasses : '',
          ]"
          :style="
            designConfig.gridStyle === 'masonry'
              ? { marginBottom: '1rem', height: 'auto' }
              : { aspectRatio: designConfig.thumbnailSize === 'vertical' ? '3/4' : '4/3' }
          "
          class="overflow-hidden rounded-lg"
        >
          <div class="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
      </div>

      <div
        v-else-if="filteredMedia.length > 0"
        :class="[gridClasses, 'overflow-hidden']"
        :style="
          designConfig.gridStyle === 'masonry'
            ? { columnGap: `${designConfig.gridSpacing * 0.5}rem` }
            : {}
        "
      >
        <div
          v-for="item in paginatedMedia"
          :key="item.id"
          :class="[
            designConfig.gridStyle === 'masonry' ? 'break-inside-avoid' : '',
            designConfig.gridStyle === 'masonry' ? thumbnailSizeClasses : '',
          ]"
          :style="
            designConfig.gridStyle === 'masonry'
              ? { marginBottom: '1rem' }
              : {
                  aspectRatio: designConfig.thumbnailSize === 'vertical' ? '3/4' : '4/3',
                }
          "
          class="overflow-hidden rounded-xl"
        >
          <div
            class="group relative w-full h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
            @click="openMediaViewer(item)"
          >
            <img
              :alt="item.title || 'Media'"
              :class="['w-full object-cover', designConfig.gridStyle === 'masonry' ? 'h-auto' : '']"
              :src="item.thumbnail || item.url"
              loading="lazy"
            />
            <div
              class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"
            ></div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p
          :style="{
            color: textColor,
            opacity: 0.8,
          }"
          class="text-lg font-medium"
        >
          No media found in this collection.
        </p>
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="filteredMedia.length > 0 && pagination.totalPages.value > 1"
        :style="{ borderColor: borderColor }"
        class="flex items-center justify-center gap-2 mt-8 pt-6 border-t"
      >
        <button
          :class="[!pagination.hasPrev.value ? 'cursor-not-allowed' : '']"
          :disabled="!pagination.hasPrev.value"
          :style="{
            borderColor: borderColor,
            color: textColor,
            backgroundColor: backgroundColor,
          }"
          class="px-4 py-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="pagination.prev()"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            :class="pagination.currentPage.value === page ? 'shadow-md' : ''"
            :style="
              pagination.currentPage.value === page
                ? {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    color: textColor,
                  }
                : {
                    borderColor: borderColor,
                    color: textColor,
                    backgroundColor: backgroundColor,
                  }
            "
            class="min-w-[2.5rem] px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium"
            @click="pagination.goTo(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          :class="[!pagination.hasNext.value ? 'cursor-not-allowed' : '']"
          :disabled="!pagination.hasNext.value"
          :style="{
            borderColor: borderColor,
            color: textColor,
            backgroundColor: backgroundColor,
          }"
          class="px-4 py-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="pagination.next()"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Media Viewer Modal -->
    <div
      v-if="selectedMedia"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
      @click="closeMediaViewer"
    >
      <div class="relative max-w-7xl max-h-full">
        <img
          :alt="selectedMedia.title || 'Media'"
          :src="selectedMedia.url"
          class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
        <button
          class="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
          @click.stop="closeMediaViewer"
        >
          <X class="w-6 h-6" />
        </button>
        <!-- Media Info -->
        <div
          v-if="selectedMedia.title"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-black/70 backdrop-blur-md text-white max-w-md text-center"
        >
          <p class="font-semibold">{{ selectedMedia.title }}</p>
          <p v-if="selectedMedia.description" class="text-sm opacity-90 mt-1">
            {{ selectedMedia.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Preview Controls Footer -->
    <div
      :style="{ borderColor: borderColor }"
      class="sticky bottom-0 w-full border-t bg-gray-100 dark:bg-gray-900 px-4 py-2 flex items-center justify-center gap-4 z-50"
    >
      <button
        :style="{ color: textColor }"
        class="p-2 transition-opacity duration-200 hover:opacity-70"
        title="Desktop View"
      >
        <Monitor class="h-4 w-4" />
      </button>
      <button
        :style="{ color: textColor }"
        class="p-2 transition-opacity duration-200 hover:opacity-70 opacity-60"
        title="Mobile View"
      >
        <Smartphone class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import {
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  Heart,
  Monitor,
  MoreVertical,
  Share2,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-vue-next'
import { useCollectionsApi } from '@/api/collections'
import { useMediaApi } from '@/api/media'
import { usePresetStore } from '@/stores/preset'
import { useGalleryStore } from '@/stores/gallery'
import { format } from 'date-fns'
import { getCoverStyleConfig } from '@/composables/useCoverStyles'
import { getDefaultLayoutConfig } from '@/composables/useCoverLayouts'
import CoverDecorations from '@/components/organisms/CoverDecorations.vue'
import DynamicCoverRenderer from '@/components/covers/DynamicCoverRenderer.vue'
import { usePagination } from '@/composables/usePagination'

// Props for preview mode
const props = defineProps({
  previewMode: String,
  previewCollection: Object,
  previewMedia: Array,
  previewDesignConfig: Object,
})

const route = useRoute()
const collectionsApi = useCollectionsApi()
const mediaApi = useMediaApi()
const presetStore = usePresetStore()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const media = ref([])
const isLoading = ref(true)
const selectedMedia = ref(null)
const activeTab = ref('Highlights')

// Track if we're in initial load to prevent store updates from overwriting API data
let isInitialLoad = true

// Get collection ID from route (only if not in preview mode)
const collectionId = computed(() => {
  if (props.previewMode) return ''
  return route.params.id || ''
})

// Get preset design config (use preview config, collection's preset, or default)
// Force reactivity by tracking the prop explicitly
const designConfig = computed(() => {
  // Access props.previewDesignConfig to ensure this computed tracks it
  const previewConfig = props.previewMode ? props.previewDesignConfig : null

  // If in preview mode with provided config, use it
  if (previewConfig) {
    // Access coverLayoutConfig to ensure it's tracked as a dependency
    const previewCoverLayoutConfig = previewConfig.coverLayoutConfig

    // Create a new object reference to ensure reactivity
    const coverLayoutConfig = previewCoverLayoutConfig ? { ...previewCoverLayoutConfig } : undefined

    return {
      ...previewConfig,
      // Explicitly include coverLayoutConfig to ensure it's reactive
      coverLayoutConfig,
    }
  }

  // Check if this is a preset preview route
  if (route.name === 'presetPreview') {
    const presetName = route.params.name
    if (presetName) {
      const preset = presetStore.getPresetByName(presetName)
      if (preset?.design) {
        return preset.design
      }
    }
  }

  // Try to get preset from collection if it has a presetId
  // Otherwise use the current preset from store or defaults
  const collectionPresetId = collection.value?.presetId
  let preset = null

  if (collectionPresetId) {
    preset = presetStore.getPresetById(collectionPresetId)
  }

  if (!preset) {
    preset = presetStore.currentPreset
  }

  // First, check if collection has coverDesign - this takes priority over everything
  const collectionCoverDesign = collection.value?.coverDesign

  // If collection has coverDesign with layout config, use it directly
  if (
    collectionCoverDesign &&
    (collectionCoverDesign.coverLayoutConfig || collectionCoverDesign.coverLayoutUuid)
  ) {
    // Get base design from preset (for other design properties like colors, fonts, etc.)
    const presetDesign = preset?.design || {}
    const baseDesign = {
      coverFocalPoint: presetDesign.coverFocalPoint || { x: 50, y: 50 },
      fontFamily: presetDesign.fontFamily || 'sans',
      fontStyle: presetDesign.fontStyle || 'normal',
      colorPalette: presetDesign.colorPalette || 'light',
      gridStyle: presetDesign.gridStyle || 'vertical',
      gridColumns: presetDesign.gridColumns || 3,
      thumbnailSize: presetDesign.thumbnailSize || 'medium',
      gridSpacing: presetDesign.gridSpacing || 16,
      navigationStyle: presetDesign.navigationStyle || 'icon-text',
    }

    // Merge base design with collection's coverDesign
    // coverDesign contains: { coverLayoutUuid, coverLayoutConfig, coverFocalPoint }
    return {
      ...baseDesign,
      ...collectionCoverDesign,
      // Explicitly preserve layout config properties
      coverLayoutConfig: collectionCoverDesign.coverLayoutConfig,
      coverLayoutUuid: collectionCoverDesign.coverLayoutUuid || null,
      // Don't include old 'cover' field - use layout config instead
      cover: undefined,
    }
  }

  // If no collection coverDesign, build base design from preset or defaults
  const baseDesign = preset?.design || {
    cover: 'center',
    coverFocalPoint: { x: 50, y: 50 },
    fontFamily: 'sans',
    fontStyle: 'normal',
    colorPalette: 'light',
    gridStyle: 'vertical',
    gridColumns: 3,
    thumbnailSize: 'medium',
    gridSpacing: 16,
    navigationStyle: 'icon-text',
  }

  // Also check collection.design.coverDesign for backward compatibility
  if (collection.value?.design?.coverDesign) {
    const designCoverDesign = collection.value.design.coverDesign
    if (designCoverDesign.coverLayoutConfig || designCoverDesign.coverLayoutUuid) {
      return {
        ...baseDesign,
        ...designCoverDesign,
        coverLayoutConfig: designCoverDesign.coverLayoutConfig || baseDesign.coverLayoutConfig,
        coverLayoutUuid: designCoverDesign.coverLayoutUuid || baseDesign.coverLayoutUuid,
      }
    }
  }

  // Check collection.design directly for coverLayoutConfig (another fallback)
  if (collection.value?.design?.coverLayoutConfig || collection.value?.design?.coverLayoutUuid) {
    return {
      ...baseDesign,
      ...collection.value.design,
      coverLayoutConfig: collection.value.design.coverLayoutConfig || baseDesign.coverLayoutConfig,
      coverLayoutUuid: collection.value.design.coverLayoutUuid || baseDesign.coverLayoutUuid,
    }
  }

  return baseDesign
})

// Color palette mapping with improved contrast - no duplicates
// Format: [background, accent, text] - ensuring WCAG AA contrast ratios
const colorPalettes = {
  light: ['#E5E7EB', '#1F2937', '#000000'],
  gold: ['#F59E0B', '#78350F', '#000000'],
  rose: ['#EC4899', '#831843', '#000000'],
  terracotta: ['#EA580C', '#7C2D12', '#000000'],
  lavender: ['#A855F7', '#581C87', '#FFFFFF'],
  olive: ['#84CC16', '#365314', '#000000'],
  agave: ['#10B981', '#064E3B', '#FFFFFF'],
  sea: ['#0EA5E9', '#0C4A6E', '#FFFFFF'],
  coral: ['#F43F5E', '#9F1239', '#FFFFFF'],
  sage: ['#22C55E', '#14532D', '#000000'],
  peach: ['#FB923C', '#7C2D12', '#000000'],
  mint: ['#14B8A6', '#134E4A', '#FFFFFF'],
  slate: ['#64748B', '#0F172A', '#FFFFFF'],
  amber: ['#F59E0B', '#78350F', '#000000'],
  indigo: ['#6366F1', '#312E81', '#FFFFFF'],
  emerald: ['#10B981', '#064E3B', '#FFFFFF'],
  cyan: ['#06B6D4', '#164E63', '#FFFFFF'],
  violet: ['#8B5CF6', '#4C1D95', '#FFFFFF'],
  dark: ['#374151', '#F9FAFB', '#FFFFFF'],
}

const paletteColors = computed(() => {
  return colorPalettes[designConfig.value.colorPalette || 'light'] || colorPalettes.light
})

// Style computed properties with improved contrast
const backgroundColor = computed(() => paletteColors.value[0])
const contentBackgroundColor = computed(() => paletteColors.value[0])
// Use the text color from palette (already optimized for contrast)
const textColor = computed(() => paletteColors.value[2])
const accentColor = computed(() => paletteColors.value[1])
const primaryColor = computed(() => paletteColors.value[0])
// Tab text color - ensures good contrast with background
const tabTextColor = computed(() => {
  const bg = paletteColors.value[0]
  const text = paletteColors.value[2]

  // For dark backgrounds, use light text; for light backgrounds, use dark text
  // This ensures tabs always contrast well with the background
  const isDarkBg = bg === '#1F2937' || bg === '#2C2C2C' || bg === '#1C1C1C'

  if (isDarkBg) {
    // Dark background - use light text with good contrast
    return '#E5E7EB' // Light gray that contrasts well with dark backgrounds
  } else {
    // Light background - use dark text with good contrast
    return text || '#1F2937' // Use palette text color or fallback to dark gray
  }
})

const borderColor = computed(() => {
  const bg = paletteColors.value[0]
  // Determine if we're on a light or dark background
  const isDarkBg = bg === '#1F2937' || bg === '#2C2C2C' || bg === '#1C1C1C'
  // For dark backgrounds, use lighter borders; for light, use darker
  return isDarkBg ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
})

const coverType = computed(() => designConfig.value.cover || 'center')
const coverConfig = computed(() => getCoverStyleConfig(coverType.value))

/**
 * Transform old cover config to new layout config format
 * Supports backward compatibility by converting old style configs to layout configs
 */
const coverLayoutConfig = computed(() => {
  // Access designConfig.value to ensure this computed tracks it
  const config = designConfig.value

  // Access config.coverLayoutConfig to ensure it's tracked
  const configCoverLayoutConfig = config.coverLayoutConfig

  // Check if cover is 'none' first (backward compatibility)
  if (config.cover === 'none' && !configCoverLayoutConfig && !config.coverLayoutUuid) {
    return {
      layout: 'none',
      media: { type: 'image', aspect_ratio: '16:9', fit: 'cover', bleed: 'none', max_width: null },
      content: { placement: 'below', alignment: 'center' },
      overlay: { enabled: false, gradient: 'none', opacity: 0 },
      spacing: { padding_x: 0, padding_y: 0 },
    }
  }

  // If new layout config exists, use it (this is the primary path)
  if (configCoverLayoutConfig && typeof configCoverLayoutConfig === 'object') {
    // Ensure it has a layout property, if not add default
    // Always create a new object reference to ensure reactivity
    const layoutConfig = configCoverLayoutConfig.layout
      ? { ...configCoverLayoutConfig } // Create new reference
      : { ...getDefaultLayoutConfig(), ...configCoverLayoutConfig }

    return layoutConfig
  }

  // If we have a coverLayoutUuid but no config, use default
  // The config should be included when saving, but as a fallback use default
  if (config.coverLayoutUuid && !configCoverLayoutConfig) {
    return getDefaultLayoutConfig()
  }

  // Otherwise, transform old cover config to new format
  const oldConfig = coverConfig.value
  const defaultLayout = getDefaultLayoutConfig()

  // Map old textPosition/textAlignment to new content placement/alignment
  let placement = 'overlay'
  let alignment = 'bottom-left'

  if (oldConfig.textPosition === 'bottom' && oldConfig.textAlignment === 'left') {
    placement = 'overlay'
    alignment = 'bottom-left'
  } else if (oldConfig.textPosition === 'center' && oldConfig.textAlignment === 'center') {
    placement = 'overlay'
    alignment = 'middle-center'
  } else if (oldConfig.textPosition === 'top') {
    placement = 'overlay'
    alignment = 'top-center'
  }

  // Handle special layouts
  if (oldConfig.specialLayout === 'none') {
    // For 'none', we still use the layout engine but with minimal styling
    return {
      ...defaultLayout,
      layout: 'none',
      media: {
        ...defaultLayout.media,
        bleed: 'none',
      },
      overlay: {
        ...defaultLayout.overlay,
        enabled: false,
      },
    }
  }

  // Default transformation
  return {
    ...defaultLayout,
    layout: 'stack', // Most old covers were stack-based
    content: {
      placement,
      alignment,
    },
    overlay: {
      enabled: true,
      gradient: 'bottom',
      opacity: 0.55,
    },
  }
})
// Fallback image URL for broken images
const fallbackImageUrl =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop'

const coverImage = computed(() => {
  const mediaToUse = props.previewMode && props.previewMedia ? props.previewMedia : null
  const collectionToUse =
    props.previewMode && props.previewCollection ? props.previewCollection : null

  // Use first media item photo
  if (mediaToUse && mediaToUse.length > 0) {
    return mediaToUse[0].url
  }

  // Fallback to collection thumbnail
  if (collectionToUse?.thumbnail) {
    return collectionToUse.thumbnail
  }

  // Final fallback
  return fallbackImageUrl
})

const coverImageWithFallback = computed(() => {
  return coverImage.value || fallbackImageUrl
})

// Handle image load errors - no longer needed since we use computed, but kept for compatibility
const handleCoverImageError = () => {
  // Error handling is now done at the component level
  console.warn('[CollectionPreview] Cover image failed to load')
}

// Get focal point for cover image positioning
const coverFocalPoint = computed(() => {
  const focalPoint = designConfig.value.coverFocalPoint
  // Support both old string format and new object format
  if (
    typeof focalPoint === 'object' &&
    focalPoint !== null &&
    'x' in focalPoint &&
    'y' in focalPoint
  ) {
    return `${focalPoint.x}% ${focalPoint.y}%`
  }
  // Fallback for old string format
  if (typeof focalPoint === 'string') {
    const focalPointMap = {
      center: 'center center',
      top: 'center top',
      bottom: 'center bottom',
      left: 'left center',
      right: 'right center',
      'top-left': 'left top',
      'top-right': 'right top',
      'bottom-left': 'left bottom',
      'bottom-right': 'right bottom',
    }
    return focalPointMap[focalPoint] || 'center center'
  }
  return 'center center'
})

const coverGradient = computed(() => {
  const cover = coverType.value
  if (cover === 'joy' || cover === 'celebration') {
    return 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
  }
  if (cover === 'center' || cover === 'summit') {
    return `linear-gradient(135deg, ${paletteColors.value[0]} 0%, ${paletteColors.value[0]} 40%, ${paletteColors.value[1]} 100%)`
  }
  if (cover === 'left' || cover === 'horizon') {
    return `linear-gradient(135deg, ${paletteColors.value[1]} 0%, ${paletteColors.value[0]} 60%, ${paletteColors.value[0]} 100%)`
  }
  return `linear-gradient(135deg, ${paletteColors.value[0]} 0%, ${paletteColors.value[1]} 100%)`
})

const overlayColor = computed(() => {
  if (coverImageWithFallback.value) {
    const cover = coverType.value
    if (cover === 'joy' || cover === 'celebration') {
      return 'rgba(255, 255, 255, 0.15)'
    }
    // Increased contrast for better text readability
    return 'rgba(0, 0, 0, 0.5)'
  }
  return 'transparent'
})

const fontFamilyClass = computed(() => {
  const fontMap = {
    sans: 'font-sans',
    serif: 'font-serif',
    modern: 'font-serif',
    playfair: 'font-serif',
    montserrat: 'font-sans',
    lato: 'font-sans',
    raleway: 'font-sans',
    opensans: 'font-sans',
    roboto: 'font-sans',
    poppins: 'font-sans',
    inter: 'font-sans',
    nunito: 'font-sans',
    merriweather: 'font-serif',
    crimson: 'font-serif',
    lora: 'font-serif',
    source: 'font-sans',
    ubuntu: 'font-sans',
    dancing: 'font-serif',
    pacifico: 'font-serif',
    caveat: 'font-serif',
  }
  return fontMap[designConfig.value.fontFamily || 'sans'] || 'font-sans'
})

const fontStyleClass = computed(() => {
  const styleMap = {
    timeless: 'font-serif',
    bold: 'font-bold',
    subtle: 'font-light',
  }
  return styleMap[designConfig.value.fontStyle || 'bold'] || 'font-bold'
})

// Get grid spacing value (convert string to number for backward compatibility)
const gridSpacingValue = computed(() => {
  const spacing = designConfig.value.gridSpacing
  if (typeof spacing === 'number') {
    return spacing
  }
  // Backward compatibility with string values
  if (spacing === 'large') return 24
  if (spacing === 'regular') return 16
  return 16
})

const gridClasses = computed(() => {
  const gridStyle = designConfig.value.gridStyle
  const gridColumns = adjustedGridColumns.value

  // Masonry layout uses CSS columns
  if (gridStyle === 'masonry') {
    const columns =
      gridColumns === 2
        ? 'md:columns-2'
        : gridColumns === 4
          ? 'md:columns-4'
          : gridColumns === 5
            ? 'md:columns-5'
            : 'md:columns-3'
    return `columns-2 ${columns}`
  }

  // Regular grid layouts
  const isVertical = gridStyle === 'vertical'
  const colsClass =
    gridColumns === 2
      ? 'md:grid-cols-2'
      : gridColumns === 4
        ? 'md:grid-cols-4'
        : gridColumns === 5
          ? 'md:grid-cols-5'
          : 'md:grid-cols-3'

  if (isVertical) {
    return `grid grid-cols-2 ${colsClass}`
  }
  return `grid grid-cols-2 ${colsClass}`
})

// Thumbnail size classes - affects the minimum size of grid items (only for masonry)
const thumbnailSizeClasses = computed(() => {
  const size = designConfig.value.thumbnailSize || 'regular'
  if (size === 'large') {
    // For large thumbnails in masonry layout, increase minimum height
    return 'min-h-[250px] md:min-h-[350px]'
  }
  // regular size - default, no additional classes needed
  return ''
})

// Adjust grid columns based on thumbnail size for regular grids
const adjustedGridColumns = computed(() => {
  const baseColumns = designConfig.value.gridColumns || 3
  const thumbnailSize = designConfig.value.thumbnailSize || 'regular'

  // For large thumbnails, reduce columns to make items appear larger
  if (thumbnailSize === 'large' && designConfig.value.gridStyle !== 'masonry') {
    // Reduce by 1 column, but not below 2
    return Math.max(2, baseColumns - 1)
  }

  return baseColumns
})

const coverContentClasses = computed(() => {
  const config = coverConfig.value
  if (config.textPosition === 'bottom' && config.textAlignment === 'left') {
    return 'flex items-end justify-start h-full'
  }
  if (config.textPosition === 'bottom' && config.textAlignment === 'center') {
    return 'flex items-end justify-center h-full'
  }
  if (config.textPosition === 'top') {
    return 'flex items-start justify-center h-full'
  }
  return 'flex flex-col items-center justify-center h-full'
})

const collectionName = computed(() => {
  if (props.previewMode && props.previewCollection) {
    return props.previewCollection.name || 'Collection'
  }
  return collection.value?.name || 'Collection'
})

const eventDate = computed(() => {
  if (props.previewMode && props.previewCollection) {
    return props.previewCollection.date || props.previewCollection.eventDate
  }
  return collection.value?.date || collection.value?.eventDate
})
const formattedDate = computed(() => {
  if (!eventDate.value) return ''
  try {
    let date
    if (typeof eventDate.value === 'string') {
      date = new Date(eventDate.value)
    } else if (eventDate.value instanceof Date) {
      date = eventDate.value
    } else {
      return eventDate.value.toString().toUpperCase()
    }
    if (isNaN(date.getTime())) {
      return eventDate.value.toString().toUpperCase()
    }
    return format(date, 'MMMM do, yyyy').toUpperCase()
  } catch {
    return eventDate.value.toString().toUpperCase()
  }
})

const showBranding = computed(() => true) // Can be made configurable
const brandingText = computed(() => 'BERNODE') // Can come from branding settings

// Joy cover config computed properties
const joyCoverTitle = computed(() => designConfig.value.joyCoverTitle || 'JOY')
const joyCoverAvatar = computed(() => designConfig.value.joyCoverAvatar)
const joyCoverBackgroundPattern = computed(() => designConfig.value.joyCoverBackgroundPattern)
const joyCoverShowDate = computed(() => designConfig.value.joyCoverShowDate)
const joyCoverShowName = computed(() => designConfig.value.joyCoverShowName)
const joyCoverShowButton = computed(() => designConfig.value.joyCoverShowButton)
const joyCoverButtonText = computed(() => designConfig.value.joyCoverButtonText)

const tabs = computed(() => {
  // Get tabs from preset or use defaults
  let preset = presetStore.currentPreset

  // If this is a preset preview route, get the preset by name
  if (route.name === 'presetPreview') {
    const presetName = route.params.name
    if (presetName) {
      const presetByName = presetStore.getPresetByName(presetName)
      if (presetByName) {
        preset = presetByName
      }
    }
  }

  return preset?.photoSets && preset.photoSets.length > 0 ? preset.photoSets : []
})

// Generate placeholder media items for empty sets
const generatePlaceholderMedia = (count = 10) => {
  const placeholderPhotoIds = [
    '1519741497674-611481863552',
    '1516589178581-6cd7833ae3b2',
    '1511285560929-80b456fea0bc',
    '1521119989659-a83eee488004',
    '1475721027785-f74eccf877e2',
    '1511578314322-379afb476865',
    '1494790008762-728dbb2e86b0',
    '1500648767791-00dcc994a43e',
    '1505373877841-8d25f7d46678',
    '1478147427282-58a87a120781',
    '1515934751635-c81c6bc9a2d8',
    '1522673607200-164d1b6ce486',
    '1511285560929-80b456fea0bc',
    '1521119989659-a83eee488004',
    '1475721027785-f74eccf877e2',
  ]

  return Array.from({ length: count }, (_, index) => {
    const photoId = placeholderPhotoIds[index % placeholderPhotoIds.length]
    return {
      id: `placeholder-${activeTab.value}-${index}`,
      collectionId: collection.value?.id || 'placeholder-collection',
      url: `https://images.unsplash.com/photo-${photoId}?w=800&h=800&fit=crop`,
      thumbnail: `https://images.unsplash.com/photo-${photoId}?w=300&h=300&fit=crop`,
      type: 'image',
      title: `Placeholder ${index + 1}`,
      order: index,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPlaceholder: true, // Mark as placeholder
    }
  })
}

const filteredMedia = computed(() => {
  const mediaToUse = props.previewMode && props.previewMedia ? props.previewMedia : media.value
  const coverImageUrl = coverImageWithFallback.value

  // Filter out the cover image to avoid repetition
  let filtered = mediaToUse.filter(item => {
    if (!coverImageUrl) return true
    // Check if this item's URL matches the cover image URL
    return item.url !== coverImageUrl && item.thumbnail !== coverImageUrl
  })

  // Filter by set if activeTab is not 'Highlights'
  if (activeTab.value !== 'Highlights') {
    // Find the set ID for the active tab name
    // Check if collection has mediaSets with matching names
    const collectionSets = collection.value?.mediaSets || []
    const matchingSet = collectionSets.find(set => set.name === activeTab.value)

    if (matchingSet) {
      // Filter by set ID - only show items that belong to this set
      filtered = filtered.filter(item => item.setId === matchingSet.id)
    } else {
      // If no matching set found in collection, try to match by setName if available
      // In preview mode with mock data, items might not have setId
      // So we check if any items have a setName matching the active tab
      const itemsWithMatchingSetName = filtered.filter(item => item.setName === activeTab.value)

      if (itemsWithMatchingSetName.length > 0) {
        // Use items that match the set name
        filtered = itemsWithMatchingSetName
      } else {
        // No items match this set - will generate placeholders below
        filtered = []
      }
    }
  } else {
    // For Highlights, limit to 12 items
    filtered = filtered.slice(0, Math.min(filtered.length, 12))
  }

  // If no media found for the current set, generate placeholder items
  // Generate at least 10 items per set (12 for Highlights)
  const minItems = activeTab.value === 'Highlights' ? 12 : 10
  if (filtered.length === 0) {
    return generatePlaceholderMedia(minItems)
  }

  return filtered
})

// Pagination setup
const itemsPerPage = 12 // Show 12 items per page
const totalItems = computed(() => filteredMedia.value.length)
const initialPage = 1
const pagination = usePagination({
  totalItems,
  itemsPerPage,
  initialPage,
})

// Update pagination total when filteredMedia changes
watch(
  () => filteredMedia.value.length,
  newLength => {
    pagination.updateTotal(newLength)
  }
)

// Paginated media
const paginatedMedia = computed(() => {
  const { start, end } = pagination.range.value
  return filteredMedia.value.slice(start, end)
})

// Visible page numbers (show max 5 pages)
const visiblePages = computed(() => {
  const total = pagination.totalPages.value
  const current = pagination.currentPage.value
  const pages = []

  if (total <= 5) {
    // Show all pages if 5 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show pages around current page
    if (current <= 3) {
      // Near the start
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (current >= total - 2) {
      // Near the end
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // In the middle
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
    }
  }

  return pages
})

// Reset pagination when tab changes
watch(activeTab, () => {
  pagination.reset()
})

// Methods
const scrollToGallery = () => {
  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
}

const openMediaViewer = item => {
  selectedMedia.value = item
}

const closeMediaViewer = () => {
  selectedMedia.value = null
}

// Get icon for navigation tabs
const getTabIcon = tab => {
  const iconMap = {
    Highlights: Sparkles,
    All: Grid3x3,
    Photos: Grid3x3,
  }
  return iconMap[tab] || Grid3x3
}

// Watch for preview props changes - watch each prop separately for better reactivity
if (props.previewMode) {
  // Watch previewCollection
  watch(
    () => props.previewCollection,
    newCollection => {
      if (newCollection) {
        collection.value = newCollection
      }
    },
    { immediate: true, deep: true }
  )

  // Watch previewMedia
  watch(
    () => props.previewMedia,
    newMedia => {
      if (newMedia) {
        media.value = newMedia
        isLoading.value = false
      }
    },
    { immediate: true, deep: true }
  )

  // Watch previewDesignConfig - computed properties will automatically update when props change
  // This deep watch ensures we detect nested property changes
  watch(
    () => props.previewDesignConfig,
    () => {
      // The computed properties (designConfig, coverLayoutConfig) will automatically update
      // This watcher ensures Vue tracks the prop deeply for reactivity
    },
    { immediate: false, deep: true }
  )
}

// Load data (only if not in preview mode)
onMounted(async () => {
  if (props.previewMode) {
    // In preview mode, use provided props
    if (props.previewCollection) {
      collection.value = props.previewCollection
    }
    if (props.previewMedia) {
      media.value = props.previewMedia
    }
    isLoading.value = false
    return
  }

  // Check if this is a preset preview route
  if (route.name === 'presetPreview') {
    // Get preset to use its name and settings
    const presetName = route.params.name
    const preset = presetName ? presetStore.getPresetByName(presetName) : null

    // Set current preset so tabs and other computed properties work
    if (preset) {
      presetStore.setCurrentPreset(preset.id)
    }

    // Use mock data for preset preview with a good collection name
    collection.value = {
      id: 'mock-collection-id',
      name: 'Sample Collection',
      date: new Date().toISOString().split('T')[0],
      eventDate: new Date().toISOString().split('T')[0],
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      category: 'wedding',
    }

    // Generate mock media
    const photoIds = [
      '1519741497674-611481863552',
      '1516589178581-6cd7833ae3b2',
      '1511285560929-80b456fea0bc',
      '1521119989659-a83eee488004',
      '1475721027785-f74eccf877e2',
      '1511578314322-379afb476865',
      '1494790008762-728dbb2e86b0',
      '1500648767791-00dcc994a43e',
      '1505373877841-8d25f7d46678',
      '1478147427282-58a87a120781',
      '1515934751635-c81c6bc9a2d8',
      '1522673607200-164d1b6ce486',
    ]

    media.value = photoIds.map((id, index) => ({
      id: `mock-media-${id}`,
      collectionId: 'mock-collection-id',
      url: `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop`,
      thumbnail: `https://images.unsplash.com/photo-${id}?w=300&h=300&fit=crop`,
      type: 'image',
      title: `Photo ${index + 1}`,
      order: index,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    isLoading.value = false
    return
  }

  // Normal mode
  try {
    isLoading.value = true
    isInitialLoad = true

    const [collectionData, mediaData] = await Promise.all([
      collectionsApi.fetchCollection(collectionId.value),
      mediaApi.fetchCollectionMedia(collectionId.value),
    ])

    // Use API data as source of truth for initial load
    // The API should have the saved coverDesign from the backend
    const apiHasCoverDesign =
      collectionData?.coverDesign &&
      (collectionData.coverDesign.coverLayoutConfig || collectionData.coverDesign.coverLayoutUuid)

    collection.value = collectionData
    media.value = mediaData

    // Allow store updates after initial load completes
    // Use a delay to ensure API data is fully processed and reactive updates settle
    setTimeout(() => {
      isInitialLoad = false
    }, 1000)
  } catch (error) {
    console.error('Failed to load collection:', error)
    isInitialLoad = false
  } finally {
    isLoading.value = false
  }
})

// Watch store's collections array for real-time updates (preset/watermark/coverDesign changes)
// BUT: Skip during initial load to prevent overwriting API data
watch(
  () => galleryStore.collections,
  collections => {
    // Skip during initial load
    if (isInitialLoad) {
      return
    }

    if (!props.previewMode && collectionId.value && collection.value) {
      const updatedCollection = collections.find(c => c.id === collectionId.value)
      if (!updatedCollection || updatedCollection.id !== collection.value.id) {
        return
      }

      // Get coverDesign from both sources
      const existingCoverDesign = collection.value.coverDesign
      const storeCoverDesign = updatedCollection.coverDesign

      // Check if store has valid coverDesign with layout config
      const storeHasValidCoverDesign =
        storeCoverDesign && (storeCoverDesign.coverLayoutConfig || storeCoverDesign.coverLayoutUuid)

      // Check if existing (API) has valid coverDesign
      const existingHasValidCoverDesign =
        existingCoverDesign &&
        (existingCoverDesign.coverLayoutConfig || existingCoverDesign.coverLayoutUuid)

      // Only update if store has valid coverDesign (meaning it was just updated from Design view)
      // OR if neither has coverDesign (normal update for other properties)
      // BUT: Never overwrite existing valid coverDesign with empty store data
      if (storeHasValidCoverDesign) {
        // Store has valid coverDesign, use it (this is a real update from Design view)
        collection.value = { ...collection.value, ...updatedCollection }
      } else if (existingHasValidCoverDesign) {
        // Existing has valid coverDesign but store doesn't - preserve it and only update other fields
        collection.value = {
          ...collection.value,
          ...updatedCollection,
          coverDesign: existingCoverDesign, // Preserve API coverDesign
        }
      } else {
        // Neither has valid coverDesign, update normally
        collection.value = { ...collection.value, ...updatedCollection }
      }
    }
  },
  { deep: true }
)
</script>
