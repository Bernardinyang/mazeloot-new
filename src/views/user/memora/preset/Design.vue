<template>
  <PresetLayout>
    <div
      class="mx-auto p-8 pb-16 transition-all duration-300"
      :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-7xl'"
    >
      <div class="mb-10">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold mb-2" :class="theme.textPrimary">Design</h1>
            <p class="text-sm leading-relaxed max-w-2xl" :class="theme.textSecondary">
              Customize the visual appearance and design settings for your collection preset. See
              your changes in real-time in the preview panel.
            </p>
          </div>
          <!-- Quick Stats -->
          <div class="hidden md:flex gap-4">
            <div class="px-4 py-2 rounded-lg border" :class="[theme.borderSecondary, theme.bgCard]">
              <div class="text-xs" :class="theme.textTertiary">Cover Style</div>
              <div class="text-sm font-semibold mt-0.5" :class="theme.textPrimary">
                {{ coverOptions.find(c => c.id === formData.cover)?.label || 'Modern' }}
              </div>
            </div>
            <div class="px-4 py-2 rounded-lg border" :class="[theme.borderSecondary, theme.bgCard]">
              <div class="text-xs" :class="theme.textTertiary">Color Palette</div>
              <div class="text-sm font-semibold mt-0.5" :class="theme.textPrimary">
                {{ colorPalettes.find(p => p.id === formData.colorPalette)?.label || 'Light' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-12">
          <!-- Cover Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="flex items-center justify-between mb-1">
              <div>
                <h3 class="text-lg font-bold mb-1" :class="theme.textPrimary">Cover Style</h3>
                <p class="text-xs" :class="theme.textSecondary">
                  Choose how your collection title appears on the cover
                </p>
              </div>
              <div class="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <span class="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {{ coverOptions.find(c => c.id === formData.cover)?.label || 'Modern' }}
                </span>
              </div>
            </div>
            <div class="grid grid-cols-4 md:grid-cols-7 gap-3">
              <button
                v-for="cover in coverOptions"
                :key="cover.id"
                @click="formData.cover = cover.id"
                class="group relative aspect-square rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden cursor-pointer"
                :class="[
                  formData.cover === cover.id
                    ? 'border-teal-500 shadow-lg shadow-teal-500/30 ring-2 ring-teal-500/20'
                    : [
                        theme.borderSecondary,
                        'hover:border-teal-500/60 hover:shadow-md',
                        'active:scale-95',
                      ],
                  theme.bgCard,
                ]"
              >
                <!-- Selected indicator -->
                <div
                  v-if="formData.cover === cover.id"
                  class="absolute top-1 right-1 z-20 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center shadow-md"
                >
                  <Check class="h-2.5 w-2.5 text-white" />
                </div>

                <!-- Cover previews based on type -->
                <CoverPreview :type="cover.id" />
              </button>
            </div>
          </div>

          <!-- Cover Focal Point Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="mb-1">
              <h3 class="text-lg font-bold mb-1" :class="theme.textPrimary">Cover Focal Point</h3>
              <p class="text-xs" :class="theme.textSecondary">
                Choose where to focus the cover image
              </p>
            </div>
            <Button
              @click="showFocalPointModal = true"
              variant="outline"
              class="w-full"
              :class="[theme.borderSecondary, theme.bgCard, theme.textPrimary]"
            >
              <span>Set Focal Point</span>
            </Button>
          </div>

          <!-- Focal Point Modal -->
          <Dialog :open="showFocalPointModal" @update:open="showFocalPointModal = $event">
            <DialogContent :class="[theme.bgCard, theme.borderCard, 'sm:max-w-4xl p-0']">
              <DialogHeader class="px-6 pt-6 pb-4">
                <div class="flex items-center justify-between">
                  <DialogTitle :class="['text-lg font-semibold uppercase', theme.textPrimary]">
                    SET FOCAL POINT
                  </DialogTitle>
                  <DialogClose
                    class="p-1 rounded-md transition-colors"
                    :class="[theme.bgButtonHover, 'hover:opacity-70']"
                  >
                    <X class="h-4 w-4" :class="theme.textSecondary" />
                  </DialogClose>
                </div>
              </DialogHeader>

              <div class="px-6 pb-6">
                <div
                  ref="focalPointImageContainer"
                  class="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-crosshair"
                  :style="{
                    aspectRatio: '16/9',
                    backgroundImage:
                      mockPreviewMedia.length > 0 && mockPreviewMedia[0].url
                        ? `url(${mockPreviewMedia[0].url})`
                        : mockPreviewCollection.thumbnail
                          ? `url(${mockPreviewCollection.thumbnail})`
                          : `url(${fallbackImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: `${formData.coverFocalPoint.x}% ${formData.coverFocalPoint.y}%`,
                    backgroundRepeat: 'no-repeat',
                  }"
                  @click="handleFocalPointClick"
                >
                  <!-- Focal Point Indicator -->
                  <div
                    class="absolute w-8 h-8 rounded-full border-4 border-white bg-green-500 shadow-lg pointer-events-none transition-all duration-100"
                    :style="{
                      left: `${formData.coverFocalPoint.x}%`,
                      top: `${formData.coverFocalPoint.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }"
                  >
                    <div class="w-full h-full rounded-full bg-white/30"></div>
                  </div>
                </div>

                <div class="flex items-center justify-end gap-3 mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    :class="[theme.textSecondary, theme.bgButtonHover]"
                    @click="showFocalPointModal = false"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    class="bg-teal-500 hover:bg-teal-600 text-white"
                    @click="showFocalPointModal = false"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <!-- Typography Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="flex items-center justify-between mb-1">
              <div>
                <h3 class="text-lg font-bold mb-1" :class="theme.textPrimary">Typography</h3>
                <p class="text-xs" :class="theme.textSecondary">
                  Select fonts that match your brand and style
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <!-- Font Families -->
              <div>
                <label class="text-xs font-medium mb-2 block" :class="theme.textSecondary"
                  >Font Family</label
                >
                <FontFamilySelect v-model="formData.fontFamily" placeholder="Select font family" />
              </div>
              <!-- Font Weights/Styles -->
              <div>
                <label class="text-xs font-medium mb-2 block" :class="theme.textSecondary"
                  >Font Style</label
                >
                <div class="flex gap-3">
                  <button
                    v-for="style in fontStyles"
                    :key="style.id"
                    @click="formData.fontStyle = style.id"
                    class="group flex-1 px-5 py-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                    :class="[
                      formData.fontStyle === style.id
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                        : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                      theme.bgCard,
                    ]"
                  >
                    <span
                      class="text-base font-medium block text-center transition-colors duration-200"
                      :class="[
                        formData.fontStyle === style.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textPrimary,
                        style.class,
                      ]"
                    >
                      {{ style.label }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Color Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="flex items-center justify-between mb-1">
              <div>
                <h3 class="text-lg font-bold mb-1" :class="theme.textPrimary">Color Palette</h3>
                <p class="text-xs" :class="theme.textSecondary">
                  Choose a color scheme that reflects your collection's mood
                </p>
              </div>
              <div class="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <span class="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {{ colorPalettes.find(p => p.id === formData.colorPalette)?.label || 'Light' }}
                </span>
              </div>
            </div>
            <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <button
                v-for="palette in colorPalettes"
                :key="palette.id"
                @click="formData.colorPalette = palette.id"
                class="group flex flex-col gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                :class="[
                  formData.colorPalette === palette.id
                    ? 'border-teal-500 shadow-lg shadow-teal-500/30 ring-2 ring-teal-500/20'
                    : [
                        theme.borderSecondary,
                        'hover:border-teal-500/60 hover:shadow-md',
                        'active:scale-95',
                      ],
                  theme.bgCard,
                ]"
              >
                <!-- Selected indicator -->
                <div
                  v-if="formData.colorPalette === palette.id"
                  class="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shadow-md"
                >
                  <Check class="h-3 w-3 text-white" />
                </div>

                <div class="flex gap-2 justify-center relative">
                  <div
                    v-for="(color, index) in palette.colors"
                    :key="index"
                    class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 shadow-sm transition-transform duration-300 group-hover:scale-110"
                    :style="{ backgroundColor: color }"
                    :class="{ 'delay-75': index === 1, 'delay-150': index === 2 }"
                  ></div>
                </div>
                <span
                  class="text-xs font-semibold text-center transition-colors duration-200"
                  :class="
                    formData.colorPalette === palette.id
                      ? 'text-teal-600 dark:text-teal-400'
                      : theme.textPrimary
                  "
                >
                  {{ palette.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Grid Style Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="mb-1">
              <h3 class="text-lg font-bold mb-1" :class="theme.textPrimary">Grid Layout</h3>
              <p class="text-xs" :class="theme.textSecondary">
                Choose how photos are arranged in your gallery
              </p>
            </div>
            <div class="flex gap-4">
              <button
                v-for="style in gridStyles"
                :key="style.id"
                @click="formData.gridStyle = style.id"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                :class="[
                  formData.gridStyle === style.id
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                    : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                  theme.bgCard,
                ]"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    class="p-2 rounded-lg transition-all duration-300"
                    :class="
                      formData.gridStyle === style.id
                        ? 'bg-teal-500/20'
                        : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50'
                    "
                  >
                    <component
                      :is="style.id === 'masonry' ? LayoutGrid : Grid3x3"
                      class="h-6 w-6 transition-colors duration-200"
                      :class="
                        formData.gridStyle === style.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textSecondary
                      "
                    />
                  </div>
                  <span
                    class="text-sm font-semibold transition-colors duration-200"
                    :class="
                      formData.gridStyle === style.id
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textPrimary
                    "
                  >
                    {{ style.label }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Grid Columns Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="mb-1">
              <h3 class="text-lg font-bold mb-1" :class="theme.textPrimary">Images Per Row</h3>
              <p class="text-xs" :class="theme.textSecondary">
                Select how many images appear in each row
              </p>
            </div>
            <div class="flex gap-3">
              <button
                v-for="cols in gridColumnsOptions"
                :key="cols.value"
                @click="formData.gridColumns = cols.value"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                :class="[
                  formData.gridColumns === cols.value
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                    : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                  theme.bgCard,
                ]"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    class="p-2 rounded-lg transition-all duration-300"
                    :class="
                      formData.gridColumns === cols.value
                        ? 'bg-teal-500/20'
                        : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50'
                    "
                  >
                    <Grid3x3
                      class="h-6 w-6 transition-colors duration-200"
                      :class="
                        formData.gridColumns === cols.value
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textSecondary
                      "
                    />
                  </div>
                  <span
                    class="text-sm font-semibold transition-colors duration-200"
                    :class="
                      formData.gridColumns === cols.value
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textPrimary
                    "
                  >
                    {{ cols.label }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Thumbnail Size Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="mb-1">
              <h3 class="text-lg font-bold mb-1" :class="theme.textPrimary">Thumbnail Size</h3>
              <p class="text-xs" :class="theme.textSecondary">
                Control the size of gallery thumbnails
              </p>
            </div>
            <div class="flex gap-4">
              <button
                v-for="size in thumbnailSizes"
                :key="size.id"
                @click="formData.thumbnailSize = size.id"
                :disabled="formData.gridStyle === 'masonry' && size.id === 'large'"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                :class="[
                  formData.thumbnailSize === size.id
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                    : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                  theme.bgCard,
                ]"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    class="p-2 rounded-lg transition-all duration-300"
                    :class="
                      formData.thumbnailSize === size.id
                        ? 'bg-teal-500/20'
                        : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50'
                    "
                  >
                    <Grid3x3
                      class="h-6 w-6 transition-colors duration-200"
                      :class="
                        formData.thumbnailSize === size.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textSecondary
                      "
                    />
                  </div>
                  <span
                    class="text-sm font-semibold transition-colors duration-200"
                    :class="
                      formData.thumbnailSize === size.id
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textPrimary
                    "
                  >
                    {{ size.label }}
                  </span>
                </div>
              </button>
            </div>
            <p
              v-if="formData.gridStyle === 'masonry'"
              class="text-xs mt-2"
              :class="theme.textTertiary"
            >
              Large thumbnail size is not available for masonry layout
            </p>
          </div>

          <!-- Grid Spacing Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="mb-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-bold" :class="theme.textPrimary">Grid Spacing</h3>
                <span class="text-sm font-semibold" :class="theme.textSecondary">
                  {{ formData.gridSpacing }}px
                </span>
              </div>
              <p class="text-xs" :class="theme.textSecondary">
                Adjust the gap between gallery items (1-100px)
              </p>
            </div>
            <div class="px-2">
              <Slider v-model="gridSpacingSlider" :min="1" :max="100" :step="1" class="w-full" />
            </div>
          </div>

          <!-- Navigation Style Section -->
          <div
            class="space-y-5 p-6 rounded-2xl border-2"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="mb-1">
              <h3 class="text-lg font-bold mb-1" :class="theme.textPrimary">Navigation Style</h3>
              <p class="text-xs" :class="theme.textSecondary">
                Choose how navigation elements are displayed
              </p>
            </div>
            <div class="flex gap-4">
              <button
                v-for="nav in navigationStyles"
                :key="nav.id"
                @click="formData.navigationStyle = nav.id"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                :class="[
                  formData.navigationStyle === nav.id
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                    : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                  theme.bgCard,
                ]"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    class="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300"
                    :class="[
                      formData.navigationStyle === nav.id
                        ? 'border-teal-500 bg-teal-500/10 shadow-sm'
                        : [
                            theme.borderSecondary,
                            'group-hover:border-teal-500/50',
                            'bg-gray-100/50 dark:bg-gray-800/50',
                          ],
                    ]"
                  >
                    <span
                      v-if="nav.id === 'icon-text'"
                      class="text-xs font-bold transition-colors duration-200"
                      :class="
                        formData.navigationStyle === nav.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textSecondary
                      "
                    >
                      A
                    </span>
                    <div
                      v-else
                      class="w-3 h-3 rounded border transition-colors duration-200"
                      :class="
                        formData.navigationStyle === nav.id
                          ? 'border-teal-500 bg-teal-500/20'
                          : theme.borderSecondary
                      "
                    ></div>
                  </div>
                  <span
                    class="text-sm font-semibold transition-colors duration-200"
                    :class="
                      formData.navigationStyle === nav.id
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textPrimary
                    "
                  >
                    {{ nav.label }}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <div
              class="rounded-xl border-2 overflow-hidden backdrop-blur-md bg-white/50 dark:bg-gray-900/50"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div
                class="p-4 border-b flex items-center justify-between"
                :class="theme.borderSecondary"
              >
                <div>
                  <h3 class="text-lg font-semibold" :class="theme.textPrimary">Live Preview</h3>
                  <p class="text-xs mt-1" :class="theme.textSecondary">
                    See exactly how your design will look
                  </p>
                </div>
                <Button
                  @click="handleOpenPreviewInNewTab"
                  variant="ghost"
                  size="sm"
                  class="shrink-0"
                  :class="[
                    theme.textSecondary,
                    theme.bgButtonHover,
                    'hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200',
                  ]"
                  title="Open preview in new tab"
                >
                  <ExternalLink class="h-4 w-4 mr-1.5" />
                  <span class="text-xs">Open</span>
                </Button>
              </div>
              <div class="h-[800px] overflow-y-auto">
                <!-- Full Collection Preview -->
                <CollectionPreview
                  :preview-mode="true"
                  :preview-collection="mockPreviewCollection"
                  :preview-media="mockPreviewMedia"
                  :preview-design-config="formData"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="flex justify-between mt-12 pt-8 border-t" :class="theme.borderSecondary">
        <Button
          @click="handlePrevious"
          variant="ghost"
          :class="[
            theme.textSecondary,
            theme.bgButtonHover,
            'hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200',
          ]"
        >
          ← Previous
        </Button>
        <Button
          @click="handleNext"
          :disabled="isSubmitting || isSaving"
          class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 px-6"
        >
          <Loader2 v-if="isSubmitting || isSaving" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="isSubmitting || isSaving">Saving...</span>
          <span v-else>Next →</span>
        </Button>
      </div>
    </div>
  </PresetLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, inject, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, Loader2, Grid3x3, LayoutGrid, ExternalLink, X } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Slider } from '@/components/shadcn/slider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/shadcn/dialog'
import PresetLayout from '@/layouts/PresetLayout.vue'
import CoverPreview from '@/components/organisms/CoverPreview.vue'
import FontFamilySelect from '@/components/organisms/FontFamilySelect.vue'
import CollectionPreview from '@/views/user/memora/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import type { Collection } from '@/api/collections'
import type { MediaItem } from '@/api/media'
import { toast } from 'vue-sonner'
import { usePresetStore } from '@/stores/preset'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()

// Inject sidebar collapse state from PresetLayout
const isSidebarCollapsed = inject<Ref<boolean>>('isSidebarCollapsed', ref(false))

// Get preset from store based on route params
const currentPreset = computed(() => {
  const nameParam = route.params.name as string
  if (nameParam) {
    return presetStore.getPresetByName(nameParam)
  }
  return null
})

const presetId = computed(() => {
  return currentPreset.value?.id || null
})

const hasUnsavedChanges = ref(false)
const isSubmitting = ref(false)
const isLoadingData = ref(false)
const showFocalPointModal = ref(false)
const focalPointImageContainer = ref<HTMLElement | null>(null)

// Design form data
const formData = ref({
  cover: 'modern',
  coverFocalPoint: { x: 50, y: 50 }, // Percentage coordinates (0-100)
  fontFamily: 'sans',
  fontStyle: 'bold',
  colorPalette: 'light',
  gridStyle: 'vertical',
  gridColumns: 3,
  thumbnailSize: 'regular',
  gridSpacing: 16, // Numeric value in pixels (1-100)
  navigationStyle: 'icon-only',
})

// Computed property to convert gridSpacing number to array for Slider component
const gridSpacingSlider = computed({
  get: () => [formData.value.gridSpacing],
  set: (value: number[]) => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number') {
      formData.value.gridSpacing = Math.max(1, Math.min(100, value[0]))
    }
  },
})

// Cover options - 20 beautiful cover styles + none
const coverOptions = [
  { id: 'modern', label: 'Modern' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'bold', label: 'Bold' },
  { id: 'asymmetric', label: 'Asymmetric' },
  { id: 'geometric', label: 'Geometric' },
  { id: 'classic', label: 'Classic' },
  { id: 'split', label: 'Split' },
  { id: 'spotlight', label: 'Spotlight' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'celebration', label: 'Celebration' },
  { id: 'horizon', label: 'Horizon' },
  { id: 'floating', label: 'Floating' },
  { id: 'corner', label: 'Corner' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'layered', label: 'Layered' },
  { id: 'framed', label: 'Framed' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'dynamic', label: 'Dynamic' },
  { id: 'structured', label: 'Structured' },
  { id: 'artistic', label: 'Artistic' },
  { id: 'none', label: 'None' },
]

// Handle focal point click
const handleFocalPointClick = (event: MouseEvent) => {
  if (!focalPointImageContainer.value) return

  const rect = focalPointImageContainer.value.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100

  // Clamp values between 0 and 100
  formData.value.coverFocalPoint = {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
  }
}

// Font styles
const fontStyles = [
  { id: 'timeless', label: 'Timeless', class: 'font-light' },
  { id: 'bold', label: 'BOLD', class: 'font-bold' },
  { id: 'subtle', label: 'SUBTLE', class: 'font-normal' },
]

// Color palettes with improved contrast - no duplicates
// Format: [background, accent, text] - ensuring WCAG AA contrast ratios
const colorPalettes = [
  { id: 'light', label: 'Light', colors: ['#FFFFFF', '#E5E7EB', '#1F2937'] }, // White bg, gray accent, dark gray text
  { id: 'gold', label: 'Gold', colors: ['#FEF3C7', '#F59E0B', '#78350F'] }, // Light gold bg, amber accent, dark brown text
  { id: 'rose', label: 'Rose', colors: ['#FDF2F8', '#EC4899', '#831843'] }, // Light pink bg, pink accent, dark pink text
  { id: 'terracotta', label: 'Terracotta', colors: ['#FED7AA', '#EA580C', '#7C2D12'] }, // Light orange bg, orange accent, dark brown text
  { id: 'lavender', label: 'Lavender', colors: ['#F3E8FF', '#A855F7', '#581C87'] }, // Light purple bg, purple accent, dark purple text
  { id: 'olive', label: 'Olive', colors: ['#F7FEE7', '#84CC16', '#365314'] }, // Light green bg, green accent, dark green text
  { id: 'agave', label: 'Agave', colors: ['#D1FAE5', '#10B981', '#064E3B'] }, // Light teal bg, emerald accent, dark teal text
  { id: 'sea', label: 'Sea', colors: ['#E0F2FE', '#0EA5E9', '#0C4A6E'] }, // Light blue bg, sky accent, dark blue text
  { id: 'coral', label: 'Coral', colors: ['#FFF1F2', '#F43F5E', '#9F1239'] }, // Light coral bg, rose accent, dark red text
  { id: 'sage', label: 'Sage', colors: ['#F0FDF4', '#22C55E', '#14532D'] }, // Light sage bg, green accent, dark green text
  { id: 'peach', label: 'Peach', colors: ['#FFF7ED', '#FB923C', '#7C2D12'] }, // Light peach bg, orange accent, dark brown text
  { id: 'mint', label: 'Mint', colors: ['#F0FDFA', '#14B8A6', '#134E4A'] }, // Light mint bg, teal accent, dark teal text
  { id: 'slate', label: 'Slate', colors: ['#F8FAFC', '#64748B', '#0F172A'] }, // Light slate bg, slate accent, dark slate text
  { id: 'amber', label: 'Amber', colors: ['#FFFBEB', '#F59E0B', '#78350F'] }, // Light amber bg, amber accent, dark brown text
  { id: 'indigo', label: 'Indigo', colors: ['#EEF2FF', '#6366F1', '#312E81'] }, // Light indigo bg, indigo accent, dark indigo text
  { id: 'emerald', label: 'Emerald', colors: ['#ECFDF5', '#10B981', '#064E3B'] }, // Light emerald bg, emerald accent, dark emerald text
  { id: 'cyan', label: 'Cyan', colors: ['#ECFEFF', '#06B6D4', '#164E63'] }, // Light cyan bg, cyan accent, dark cyan text
  { id: 'violet', label: 'Violet', colors: ['#F5F3FF', '#8B5CF6', '#4C1D95'] }, // Light violet bg, violet accent, dark violet text
  { id: 'dark', label: 'Dark', colors: ['#1F2937', '#374151', '#F9FAFB'] }, // Dark gray bg, medium gray accent, light text
]

// Grid styles
const gridStyles = [
  { id: 'vertical', label: 'Vertical' },
  { id: 'horizontal', label: 'Horizontal' },
  { id: 'masonry', label: 'Masonry' },
]

// Grid columns options
const gridColumnsOptions = [
  { value: 2, label: '2 Columns' },
  { value: 3, label: '3 Columns' },
  { value: 4, label: '4 Columns' },
  { value: 5, label: '5 Columns' },
]

// Thumbnail sizes
const thumbnailSizes = [
  { id: 'regular', label: 'Regular' },
  { id: 'large', label: 'Large' },
]

// Navigation styles
const navigationStyles = [
  { id: 'icon-only', label: 'Icon Only' },
  { id: 'icon-text', label: 'Icon & Text' },
]

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value) {
    isLoadingData.value = true
    const designData = currentPreset.value.design || {}
    formData.value = {
      cover: designData.cover || 'modern',
      coverFocalPoint:
        designData.coverFocalPoint && typeof designData.coverFocalPoint === 'object'
          ? designData.coverFocalPoint
          : { x: 50, y: 50 },
      fontFamily: designData.fontFamily || 'sans',
      fontStyle: designData.fontStyle || 'bold',
      colorPalette: designData.colorPalette || 'light',
      gridStyle: designData.gridStyle || 'vertical',
      gridColumns: designData.gridColumns || 3,
      thumbnailSize: designData.thumbnailSize || 'regular',
      gridSpacing:
        typeof designData.gridSpacing === 'number'
          ? designData.gridSpacing
          : designData.gridSpacing === 'large'
            ? 24
            : 16,
      navigationStyle: designData.navigationStyle || 'icon-only',
    }
    presetStore.setCurrentPreset(currentPreset.value.id)
    hasUnsavedChanges.value = false
    isLoadingData.value = false
  }
}

// Watch for route changes to reload preset data
watch(
  () => route.params.name,
  () => {
    loadPresetData()
  },
  { immediate: false }
)

// Watch for form changes
watch(
  formData,
  () => {
    if (!isLoadingData.value) {
      hasUnsavedChanges.value = true
    }
  },
  { deep: true }
)

// Watch for grid style changes - disable large thumbnail size for masonry
watch(
  () => formData.value.gridStyle,
  newStyle => {
    if (newStyle === 'masonry' && formData.value.thumbnailSize === 'large') {
      formData.value.thumbnailSize = 'regular'
    }
  }
)

// Keyboard shortcut handler
let keyDownHandler: ((e: KeyboardEvent) => void) | null = null

// Initialize on mount
onMounted(() => {
  loadPresetData()

  // Add keyboard shortcut for save (Cmd+S / Ctrl+S)
  keyDownHandler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      if (!isSaving.value && hasUnsavedChanges.value && presetId.value) {
        handleSave()
      }
    }
  }

  window.addEventListener('keydown', keyDownHandler)
})

// Cleanup on unmount
onUnmounted(() => {
  if (keyDownHandler) {
    window.removeEventListener('keydown', keyDownHandler)
  }
})

// Helper function to save preset design
const savePresetDesign = async (): Promise<boolean> => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return false
  }

  try {
    await presetStore.updatePreset(presetId.value, {
      design: formData.value,
    })
    hasUnsavedChanges.value = false
    return true
  } catch (error: any) {
    toast.error('Failed to save preset', {
      description: error.message || 'An error occurred while saving.',
    })
    return false
  }
}

const handleSave = async () => {
  const success = await savePresetDesign()
  if (success) {
    toast.success('Preset saved successfully', {
      description: 'Design settings have been updated.',
      icon: Check,
    })
  }
}

const handlePrevious = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetDesign()
    if (success) {
      router.push({
        name: 'presetGeneral',
        params: { name: route.params.name },
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleNext = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetDesign()
    if (success) {
      router.push({
        name: 'presetPrivacy',
        params: { name: route.params.name },
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const isSaving = computed(() => presetStore.isLoading)

// Open preview in new tab
const handleOpenPreviewInNewTab = async () => {
  const presetName = route.params.name as string
  if (!presetName || !presetId.value) {
    toast.error('Preset not found')
    return
  }

  // Save current design changes before opening preview
  const success = await savePresetDesign()
  if (success) {
    const previewUrl = router.resolve({
      name: 'presetPreview',
      params: { name: presetName },
    }).href
    window.open(previewUrl, '_blank')
  }
}

// Fallback image URL for broken images
const fallbackImageUrl =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop'

// Mock data for preview
const mockPreviewCollection = computed<Collection>(() => ({
  id: 'preview',
  name: 'JOSEPH X CUPPY',
  date: '2025-11-29',
  eventDate: '2025-11-29',
  thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'active',
  category: 'event',
}))

const mockPreviewMedia = computed<MediaItem[]>(() => {
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

  return photoIds.map((id, index) => ({
    id: `preview-${index}`,
    collectionId: 'preview',
    url: `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop`,
    thumbnail: `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop`,
    type: 'image' as const,
    title: `Photo ${index + 1}`,
    order: index,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
})
</script>
