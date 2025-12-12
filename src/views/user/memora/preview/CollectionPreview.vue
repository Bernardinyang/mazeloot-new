<template>
  <div class="min-h-screen" :style="{ backgroundColor: backgroundColor }">
    <!-- Navbar Style (when cover is 'none') -->
    <div
      v-if="coverConfig.specialLayout === 'none'"
      class="sticky top-0 z-50 w-full border-b backdrop-blur-md"
      :style="{
        backgroundColor: `${backgroundColor}dd`,
        borderColor: borderColor,
      }"
    >
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1
              class="text-xl md:text-2xl font-bold"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ color: textColor }"
            >
              {{ collectionName }}
            </h1>
            <p
              v-if="eventDate"
              class="text-xs md:text-sm mt-1 uppercase tracking-wide"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ color: textColor, opacity: 0.8 }"
            >
              {{ formattedDate }}
            </p>
          </div>
          <div class="flex gap-4">
            <button
              v-for="tab in tabs"
              :key="tab"
              class="flex items-center gap-2 text-sm uppercase tracking-wide transition-all duration-200 font-medium"
              :class="[fontFamilyClass, activeTab === tab ? 'font-bold' : '']"
              :style="{
                color: activeTab === tab ? accentColor : tabTextColor,
                borderBottom: activeTab === tab ? `3px solid ${accentColor}` : 'none',
                paddingBottom: '4px',
                opacity: activeTab === tab ? 1 : 0.85,
              }"
              @click="activeTab = tab"
            >
              <component
                v-if="
                  designConfig.navigationStyle === 'icon-only' ||
                  designConfig.navigationStyle === 'icon-text'
                "
                :is="getTabIcon(tab)"
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
    <div
      v-else
      class="relative w-full h-screen"
      :style="{
        backgroundImage: coverImageWithFallback ? `url(${coverImageWithFallback})` : undefined,
        backgroundSize: coverImageWithFallback ? 'cover' : undefined,
        backgroundPosition: coverImageWithFallback ? coverFocalPoint : undefined,
        backgroundRepeat: coverImageWithFallback ? 'no-repeat' : undefined,
        backgroundColor: coverImageWithFallback ? undefined : coverGradient,
      }"
    >
      <!-- Cover Overlay with better contrast -->
      <div
        class="absolute inset-0"
        :style="{
          backgroundColor: overlayColor,
          background: coverImageWithFallback
            ? `linear-gradient(to bottom, ${overlayColor} 0%, ${overlayColor} 40%, rgba(0,0,0,0.5) 100%)`
            : overlayColor,
        }"
      ></div>

      <!-- Cover Decorations (borders, lines, frames, dividers, etc.) -->
      <CoverDecorations :config="coverConfig" :palette-colors="paletteColors" />

      <!-- Cover Content based on cover type -->
      <div class="relative z-10 container mx-auto px-4 h-full flex" :class="coverContentClasses">
        <!-- Top Branding -->
        <div
          v-if="showBranding"
          class="text-xs uppercase tracking-wider mb-4 font-semibold"
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{
            color: textColor,
            textShadow: coverImageWithFallback ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
            opacity: coverImageWithFallback ? 0.95 : 0.8,
          }"
        >
          {{ brandingText }}
        </div>

        <!-- Cover Type: Joy - Special Layout with title, avatar in O, date, name, button -->
        <div
          v-if="coverConfig.specialLayout === 'joy'"
          class="flex flex-col items-center justify-center h-full"
        >
          <!-- Background pattern (crosses) -->
          <div
            v-if="
              (designConfig as any).joyCoverBackgroundPattern === 'crosses' ||
              !(designConfig as any).joyCoverBackgroundPattern
            "
            class="absolute inset-0 opacity-30"
            style="
              background-image:
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(239, 68, 68, 0.1) 2px,
                  rgba(239, 68, 68, 0.1) 4px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(239, 68, 68, 0.1) 2px,
                  rgba(239, 68, 68, 0.1) 4px
                );
            "
          >
            <!-- Scattered crosses -->
            <div
              v-for="i in 20"
              :key="i"
              class="absolute"
              :style="{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: '4px',
                height: '4px',
                transform: 'rotate(45deg)',
                backgroundColor: 'rgba(239, 68, 68, 0.3)',
              }"
            ></div>
          </div>

          <!-- Title with avatar in O -->
          <div class="flex items-center gap-4 md:gap-8 mb-6 md:mb-8 z-10">
            <template
              v-for="(char, index) in ((designConfig as any).joyCoverTitle || 'JOY').split('')"
              :key="index"
            >
              <span
                v-if="char.toUpperCase() !== 'O'"
                class="text-6xl md:text-8xl lg:text-9xl font-black leading-none"
                :class="[fontFamilyClass, fontStyleClass]"
                :style="{
                  color: '#DC2626',
                  textShadow: 'none',
                }"
              >
                {{ char }}
              </span>
              <div v-else class="relative">
                <div
                  v-if="(designConfig as any).joyCoverAvatar || coverImageWithFallback"
                  class="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden"
                  :style="{
                    border: 'none',
                  }"
                >
                  <img
                    :src="(designConfig as any).joyCoverAvatar || coverImageWithFallback"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                    @error="handleCoverImageError"
                  />
                </div>
                <div
                  v-else
                  class="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
                ></div>
              </div>
            </template>
          </div>

          <!-- Date -->
          <div
            v-if="(designConfig as any).joyCoverShowDate !== false && eventDate"
            class="text-sm md:text-base lg:text-lg uppercase tracking-widest font-medium mb-4 z-10"
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{
              color: textColor,
              opacity: 0.8,
              letterSpacing: '0.15em',
            }"
          >
            {{ formattedDate }}
          </div>

          <!-- Name -->
          <div
            v-if="(designConfig as any).joyCoverShowName !== false"
            class="text-2xl md:text-3xl lg:text-4xl font-black uppercase mb-6 md:mb-8 z-10"
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{
              color: textColor,
            }"
          >
            {{ collectionName }}
          </div>

          <!-- Button -->
          <button
            v-if="(designConfig as any).joyCoverShowButton !== false"
            class="px-6 md:px-8 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 z-10"
            :style="{
              backgroundColor: '#6B7280',
            }"
            @click="scrollToGallery"
          >
            {{ (designConfig as any).joyCoverButtonText || 'VIEW GALLERY' }}
          </button>
        </div>

        <!-- Cover Type: Summit (Center) -->
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
            class="absolute top-1/4 left-1/4 w-2 h-2 rounded-full opacity-20"
            :style="{ backgroundColor: accentColor }"
          ></div>
          <div
            class="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full opacity-30"
            :style="{ backgroundColor: accentColor }"
          ></div>
          <div
            class="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full opacity-25"
            :style="{ backgroundColor: accentColor }"
          ></div>

          <div
            class="text-5xl md:text-7xl font-black mb-6 leading-tight"
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{
              color: textColor,
              textShadow: `0 4px 20px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.15)`,
            }"
          >
            {{ collectionName }}
          </div>
          <div
            v-if="eventDate"
            class="text-base md:text-xl uppercase tracking-widest font-medium"
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{
              color: textColor,
              opacity: 0.9,
              letterSpacing: '0.2em',
            }"
          >
            {{ formattedDate }}
          </div>
        </div>

        <!-- Cover Type: Horizon (Left) -->
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
            class="w-16 h-0.5 mb-4"
            :style="{ backgroundColor: accentColor, opacity: 0.8 }"
          ></div>

          <div
            class="text-4xl md:text-6xl font-black mb-3 leading-tight"
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{
              color: textColor,
              textShadow: `0 4px 20px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)`,
            }"
          >
            {{ collectionName }}
          </div>
          <div
            v-if="eventDate"
            class="text-sm md:text-lg uppercase tracking-widest font-medium"
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{
              color: textColor,
              opacity: 0.85,
              letterSpacing: '0.15em',
            }"
          >
            {{ formattedDate }}
          </div>
        </div>

        <!-- Dynamic Cover - Based on config -->
        <div v-else class="w-full">
          <div
            class="text-3xl md:text-5xl font-bold mb-4"
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
          >
            {{ collectionName }}
          </div>
          <div
            v-if="eventDate"
            class="text-base md:text-lg uppercase tracking-wide"
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
              textShadow: coverImageWithFallback ? '0 2px 10px rgba(0,0,0,0.2)' : 'none',
            }"
          >
            {{ formattedDate }}
          </div>
        </div>

        <!-- View Gallery Button -->
        <div
          class="mt-8 flex"
          :class="{
            'justify-center':
              coverConfig.textAlignment === 'center' || coverConfig.textPosition === 'center',
            'justify-start': coverConfig.textAlignment === 'left',
            'justify-end': coverConfig.textAlignment === 'right',
            'absolute bottom-12 left-1/2 -translate-x-1/2':
              (coverConfig.textPosition === 'bottom' && coverConfig.textAlignment === 'left') ||
              coverConfig.specialLayout === 'split' ||
              coverConfig.specialLayout === 'story',
          }"
        >
          <button
            class="px-8 py-3.5 rounded-lg text-sm font-bold uppercase tracking-wider text-white shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-110 hover:-translate-y-0.5"
            :style="{
              backgroundColor: accentColor,
              boxShadow: `0 8px 30px ${accentColor}40, 0 4px 12px rgba(0,0,0,0.2)`,
            }"
            @click="scrollToGallery"
          >
            View Gallery
          </button>
        </div>
      </div>
    </div>

    <!-- Gallery Content Section -->
    <div
      id="gallery"
      class="container mx-auto px-4 py-8 md:py-12"
      :style="{ backgroundColor: contentBackgroundColor }"
    >
      <!-- Navigation Tabs (only show if cover is not 'none', as navbar handles it) -->
      <div
        v-if="coverConfig.specialLayout !== 'none'"
        class="mb-8 flex items-center gap-6 border-b pb-4"
        :style="{ borderColor: borderColor }"
      >
        <div
          class="text-lg md:text-xl font-semibold"
          :class="[fontFamilyClass, fontStyleClass]"
          :style="{ color: textColor }"
        >
          {{ collectionName }}
        </div>
        <div class="flex gap-4">
          <button
            v-for="tab in tabs"
            :key="tab"
            class="flex items-center gap-2 text-sm uppercase tracking-wide transition-all duration-200 font-medium"
            :class="[fontFamilyClass, activeTab === tab ? 'font-bold' : '']"
            :style="{
              color: activeTab === tab ? accentColor : tabTextColor,
              borderBottom: activeTab === tab ? `3px solid ${accentColor}` : 'none',
              paddingBottom: '4px',
              opacity: activeTab === tab ? 1 : 0.85,
            }"
            @click="activeTab = tab"
          >
            <component
              v-if="
                designConfig.navigationStyle === 'icon-only' ||
                designConfig.navigationStyle === 'icon-text'
              "
              :is="getTabIcon(tab)"
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

      <!-- Media Grid -->
      <div
        v-if="isLoading"
        :class="[gridClasses, 'overflow-hidden']"
        :style="
          designConfig.gridStyle === 'masonry'
            ? { columnGap: `${gridSpacingValue}px` }
            : { gap: `${gridSpacingValue}px` }
        "
      >
        <div
          v-for="i in 6"
          :key="i"
          class="overflow-hidden rounded-lg"
          :class="[
            designConfig.gridStyle === 'masonry' ? 'break-inside-avoid' : '',
            designConfig.gridStyle === 'masonry' ? thumbnailSizeClasses : '',
          ]"
          :style="
            designConfig.gridStyle === 'masonry'
              ? { marginBottom: `${gridSpacingValue}px`, height: '192px' }
              : { aspectRatio: designConfig.gridStyle === 'vertical' ? '3/4' : '1/1' }
          "
        >
          <div class="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        </div>
      </div>

      <div
        v-else-if="filteredMedia.length > 0"
        :class="[gridClasses, 'overflow-hidden']"
        :style="
          designConfig.gridStyle === 'masonry'
            ? { columnGap: `${gridSpacingValue}px` }
            : { gap: `${gridSpacingValue}px` }
        "
      >
        <div
          v-for="item in paginatedMedia"
          :key="item.id"
          class="overflow-hidden rounded-lg"
          :class="[
            designConfig.gridStyle === 'masonry' ? 'break-inside-avoid' : '',
            designConfig.gridStyle === 'masonry' ? thumbnailSizeClasses : '',
          ]"
          :style="
            designConfig.gridStyle === 'masonry'
              ? { marginBottom: `${gridSpacingValue}px` }
              : {
                  aspectRatio: designConfig.gridStyle === 'vertical' ? '3/4' : '1/1',
                }
          "
        >
          <div
            class="group relative w-full h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
            @click="openMediaViewer(item)"
          >
            <img
              :src="item.thumbnail || item.url"
              :alt="item.title || 'Media'"
              :class="[
                'w-full object-cover',
                designConfig.gridStyle === 'masonry' ? 'h-auto' : 'h-full',
              ]"
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
          class="text-lg font-medium"
          :style="{
            color: textColor,
            opacity: 0.8,
          }"
        >
          No media found in this collection.
        </p>
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="filteredMedia.length > 0 && pagination.totalPages.value > 1"
        class="flex items-center justify-center gap-2 mt-8 pt-6 border-t"
        :style="{ borderColor: borderColor }"
      >
        <button
          @click="pagination.prev()"
          :disabled="!pagination.hasPrev.value"
          class="px-4 py-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :style="{
            borderColor: !pagination.hasPrev.value ? borderColor : accentColor,
            color: !pagination.hasPrev.value ? textColor : accentColor,
            backgroundColor: 'transparent',
          }"
          :class="[
            !pagination.hasPrev.value ? 'cursor-not-allowed' : 'hover:opacity-80 cursor-pointer',
          ]"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="pagination.goTo(page)"
            class="min-w-[2.5rem] px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium"
            :style="
              pagination.currentPage.value === page
                ? {
                    backgroundColor: accentColor,
                    borderColor: accentColor,
                    color: '#FFFFFF',
                  }
                : {
                    borderColor: borderColor,
                    color: textColor,
                    backgroundColor: 'transparent',
                  }
            "
            :class="
              pagination.currentPage.value === page
                ? 'shadow-md'
                : 'hover:opacity-80 cursor-pointer'
            "
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="pagination.next()"
          :disabled="!pagination.hasNext.value"
          class="px-4 py-2 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :style="{
            borderColor: !pagination.hasNext.value ? borderColor : accentColor,
            color: !pagination.hasNext.value ? textColor : accentColor,
            backgroundColor: 'transparent',
          }"
          :class="[
            !pagination.hasNext.value ? 'cursor-not-allowed' : 'hover:opacity-80 cursor-pointer',
          ]"
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
          :src="selectedMedia.url"
          :alt="selectedMedia.title || 'Media'"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  X,
  Sparkles,
  Grid3x3,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { useCollectionsApi, type Collection } from '@/api/collections'
import { useMediaApi, type MediaItem } from '@/api/media'
import { usePresetStore } from '@/stores/preset'
import { useGalleryStore } from '@/stores/gallery'
import { format } from 'date-fns'
import { getCoverStyleConfig } from '@/config/coverStyles'
import CoverDecorations from '@/components/organisms/CoverDecorations.vue'
import { usePagination } from '@/composables/usePagination'

// Props for preview mode
const props = defineProps<{
  previewMode?: boolean
  previewCollection?: Collection | null
  previewMedia?: MediaItem[]
  previewDesignConfig?: {
    cover?: string
    fontFamily?: string
    fontStyle?: string
    colorPalette?: string
    gridStyle?: string
    thumbnailSize?: string
    gridSpacing?: number | string
    navigationStyle?: string
  } | null
}>()

const route = useRoute()
const collectionsApi = useCollectionsApi()
const mediaApi = useMediaApi()
const presetStore = usePresetStore()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref<Collection | null>(null)
const media = ref<MediaItem[]>([])
const isLoading = ref(true)
const selectedMedia = ref<MediaItem | null>(null)
const activeTab = ref('Highlights')

// Get collection ID from route (only if not in preview mode)
const collectionId = computed(() => {
  if (props.previewMode) return ''
  return (route.params.id as string) || ''
})

// Get preset design config (use preview config, collection's preset, or default)
const designConfig = computed(() => {
  // If in preview mode with provided config, use it
  if (props.previewMode && props.previewDesignConfig) {
    return props.previewDesignConfig
  }

  // Check if this is a preset preview route
  if (route.name === 'presetPreview') {
    const presetName = route.params.name as string
    if (presetName) {
      const preset = presetStore.getPresetByName(presetName)
      if (preset?.design) {
        return preset.design
      }
    }
  }

  // Try to get preset from collection if it has a presetId
  // Otherwise use the current preset from store or defaults
  const collectionPresetId = (collection.value as any)?.presetId
  let preset = null

  if (collectionPresetId) {
    preset = presetStore.getPresetById(collectionPresetId)
  }

  if (!preset) {
    preset = presetStore.currentPreset
  }

  // Use preset design or defaults
  return (
    preset?.design || {
      cover: 'modern',
      coverFocalPoint: { x: 50, y: 50 },
      fontFamily: 'sans',
      fontStyle: 'bold',
      colorPalette: 'light',
      gridStyle: 'vertical',
      gridColumns: 3,
      thumbnailSize: 'regular',
      gridSpacing: 16,
      navigationStyle: 'icon-only',
    }
  )
})

// Color palette mapping with improved contrast - no duplicates
// Format: [background, accent, text] - ensuring WCAG AA contrast ratios
const colorPalettes: Record<string, string[]> = {
  light: ['#FFFFFF', '#E5E7EB', '#1F2937'], // White bg, gray accent, dark gray text
  gold: ['#FEF3C7', '#F59E0B', '#78350F'], // Light gold bg, amber accent, dark brown text
  rose: ['#FDF2F8', '#EC4899', '#831843'], // Light pink bg, pink accent, dark pink text
  terracotta: ['#FED7AA', '#EA580C', '#7C2D12'], // Light orange bg, orange accent, dark brown text
  lavender: ['#F3E8FF', '#A855F7', '#581C87'], // Light purple bg, purple accent, dark purple text
  olive: ['#F7FEE7', '#84CC16', '#365314'], // Light green bg, green accent, dark green text
  agave: ['#D1FAE5', '#10B981', '#064E3B'], // Light teal bg, emerald accent, dark teal text
  sea: ['#E0F2FE', '#0EA5E9', '#0C4A6E'], // Light blue bg, sky accent, dark blue text
  coral: ['#FFF1F2', '#F43F5E', '#9F1239'], // Light coral bg, rose accent, dark red text
  sage: ['#F0FDF4', '#22C55E', '#14532D'], // Light sage bg, green accent, dark green text
  peach: ['#FFF7ED', '#FB923C', '#7C2D12'], // Light peach bg, orange accent, dark brown text
  mint: ['#F0FDFA', '#14B8A6', '#134E4A'], // Light mint bg, teal accent, dark teal text
  slate: ['#F8FAFC', '#64748B', '#0F172A'], // Light slate bg, slate accent, dark slate text
  amber: ['#FFFBEB', '#F59E0B', '#78350F'], // Light amber bg, amber accent, dark brown text
  indigo: ['#EEF2FF', '#6366F1', '#312E81'], // Light indigo bg, indigo accent, dark indigo text
  emerald: ['#ECFDF5', '#10B981', '#064E3B'], // Light emerald bg, emerald accent, dark emerald text
  cyan: ['#ECFEFF', '#06B6D4', '#164E63'], // Light cyan bg, cyan accent, dark cyan text
  violet: ['#F5F3FF', '#8B5CF6', '#4C1D95'], // Light violet bg, violet accent, dark violet text
  dark: ['#1F2937', '#374151', '#F9FAFB'], // Dark gray bg, medium gray accent, light text
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
// Fallback image URL for broken images
const fallbackImageUrl =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop'

const coverImage = computed(() => {
  const mediaToUse = props.previewMode && props.previewMedia ? props.previewMedia : media.value
  const collectionToUse =
    props.previewMode && props.previewCollection ? props.previewCollection : collection.value

  // Use first media item as cover photo
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

const coverImageWithFallback = ref(coverImage.value)

// Watch for cover image changes and reset fallback
watch(coverImage, newUrl => {
  coverImageWithFallback.value = newUrl || fallbackImageUrl
})

// Handle image load errors
const handleCoverImageError = () => {
  if (coverImageWithFallback.value !== fallbackImageUrl) {
    coverImageWithFallback.value = fallbackImageUrl
  }
}

// Get focal point for cover image positioning
const coverFocalPoint = computed(() => {
  const focalPoint = (designConfig.value as any).coverFocalPoint
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
    const focalPointMap: Record<string, string> = {
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
  const fontMap: Record<string, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    modern: 'font-mono',
    playfair: 'font-playfair',
    montserrat: 'font-montserrat',
    lato: 'font-lato',
    raleway: 'font-raleway',
    opensans: 'font-opensans',
    roboto: 'font-roboto',
    poppins: 'font-poppins',
    inter: 'font-inter',
    nunito: 'font-nunito',
    merriweather: 'font-merriweather',
    crimson: 'font-crimson',
    lora: 'font-lora',
    source: 'font-source',
    ubuntu: 'font-ubuntu',
    dancing: 'font-dancing',
    pacifico: 'font-pacifico',
    caveat: 'font-caveat',
  }
  return fontMap[designConfig.value.fontFamily || 'sans'] || 'font-sans'
})

const fontStyleClass = computed(() => {
  const styleMap: Record<string, string> = {
    timeless: 'font-light',
    bold: 'font-bold',
    subtle: 'font-normal',
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
    return (props.previewCollection as any).date || (props.previewCollection as any).eventDate
  }
  return (collection.value as any)?.date || (collection.value as any)?.eventDate
})
const formattedDate = computed(() => {
  if (!eventDate.value) return ''
  try {
    let date: Date
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

const tabs = computed(() => {
  // Get tabs from preset or use defaults
  let preset = presetStore.currentPreset

  // If this is a preset preview route, get the preset by name
  if (route.name === 'presetPreview') {
    const presetName = route.params.name as string
    if (presetName) {
      const presetByName = presetStore.getPresetByName(presetName)
      if (presetByName) {
        preset = presetByName
      }
    }
  }

  return preset?.photoSets && preset.photoSets.length > 0 ? preset.photoSets : ['Highlights']
})

const filteredMedia = computed(() => {
  const mediaToUse = props.previewMode && props.previewMedia ? props.previewMedia : media.value
  const coverImageUrl = coverImageWithFallback.value

  // Filter out the cover image to avoid repetition
  let filtered = mediaToUse.filter(item => {
    if (!coverImageUrl) return true
    // Check if this item's URL matches the cover image URL
    return item.url !== coverImageUrl && item.thumbnail !== coverImageUrl
  })

  if (activeTab.value === 'Highlights') {
    return filtered.slice(0, Math.min(filtered.length, 12))
  }
  return filtered
})

// Pagination setup
const itemsPerPage = 12 // Show 12 items per page
const pagination = usePagination({
  totalItems: filteredMedia.value.length,
  itemsPerPage: itemsPerPage,
  initialPage: 1,
})

// Update pagination total when filteredMedia changes
watch(
  () => filteredMedia.value.length,
  (newLength: number) => {
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
  const pages: number[] = []

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

const openMediaViewer = (item: MediaItem) => {
  selectedMedia.value = item
}

const closeMediaViewer = () => {
  selectedMedia.value = null
}

// Get icon for navigation tabs
const getTabIcon = (tab: string) => {
  const iconMap: Record<string, any> = {
    Highlights: Sparkles,
    All: Grid3x3,
    Photos: ImageIcon,
  }
  return iconMap[tab] || Grid3x3
}

// Watch for preview props changes
watch(
  () => [props.previewCollection, props.previewMedia, props.previewDesignConfig],
  () => {
    if (props.previewMode) {
      if (props.previewCollection) {
        collection.value = props.previewCollection
      }
      if (props.previewMedia) {
        media.value = props.previewMedia
        isLoading.value = false
      }
    }
  },
  { immediate: true }
)

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
    const presetName = route.params.name as string
    const preset = presetName ? presetStore.getPresetByName(presetName) : null

    // Set current preset so tabs and other computed properties work
    if (preset) {
      presetStore.setCurrentPreset(preset.id)
    }

    // Use mock data for preset preview with a good collection name
    collection.value = {
      id: 'preset-preview',
      name: 'JOSEPH X CUPPY',
      date: new Date().toISOString().split('T')[0],
      eventDate: new Date().toISOString().split('T')[0],
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      category: 'event',
    } as Collection

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
      id: `preview-${index}`,
      collectionId: 'preset-preview',
      url: `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop`,
      thumbnail: `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`,
      type: 'image' as const,
      title: `Photo ${index + 1}`,
      order: index,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    isLoading.value = false
    return
  }

  // Normal mode: fetch data
  try {
    isLoading.value = true
    const [collectionData, mediaData] = await Promise.all([
      collectionsApi.fetchCollection(collectionId.value),
      mediaApi.fetchCollectionMedia(collectionId.value),
    ])
    collection.value = collectionData
    media.value = mediaData
  } catch (error) {
    console.error('Failed to load collection:', error)
  } finally {
    isLoading.value = false
  }
})

// Watch store's collections array for real-time updates (preset/watermark changes)
watch(
  () => galleryStore.collections,
  (collections: any[]) => {
    if (!props.previewMode && collectionId.value && collection.value) {
      const updatedCollection = collections.find((c: any) => c.id === collectionId.value)
      if (updatedCollection && updatedCollection.id === collection.value.id) {
        // Update local collection ref with latest data from store
        collection.value = { ...collection.value, ...updatedCollection }
      }
    }
  },
  { deep: true }
)
</script>
