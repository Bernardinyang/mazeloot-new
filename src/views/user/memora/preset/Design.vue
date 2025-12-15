<template>
  <PresetLayout>
    <div
      :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-full'"
      class="mx-auto p-8 pb-16 transition-all duration-300"
    >
      <div class="mb-10">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 :class="theme.textPrimary" class="text-3xl font-bold">Design</h1>
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 scale-95 -translate-x-2"
                enter-to-class="opacity-100 scale-100 translate-x-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 scale-100 translate-x-0"
                leave-to-class="opacity-0 scale-95 -translate-x-2"
              >
                <div
                  v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
                  class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30"
                >
                  <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <span>Unsaved changes</span>
                </div>
              </Transition>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              Customize the visual appearance and design settings for your collection preset. See
              your changes in real-time in the preview panel.
            </p>
          </div>
          <!-- Quick Stats -->
          <div class="hidden md:flex gap-4">
            <div :class="[theme.borderSecondary, theme.bgCard]" class="px-4 py-2 rounded-lg border">
              <div :class="theme.textTertiary" class="text-xs">Cover Style</div>
              <div :class="theme.textPrimary" class="text-sm font-semibold mt-0.5">
                {{ coverOptions.find(c => c.id === formData.cover)?.label || 'Modern' }}
              </div>
            </div>
            <div :class="[theme.borderSecondary, theme.bgCard]" class="px-4 py-2 rounded-lg border">
              <div :class="theme.textTertiary" class="text-xs">Color Palette</div>
              <div :class="theme.textPrimary" class="text-sm font-semibold mt-0.5">
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
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="flex items-center justify-between mb-1">
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Cover Style</h3>
                <p :class="theme.textSecondary" class="text-xs">
                  Choose how your collection title appears on the cover
                </p>
              </div>
              <div class="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <span class="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {{ coverOptions.find(c => c.id === formData.cover)?.label || 'Modern' }}
                </span>
              </div>
            </div>
            <div
              class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 md:gap-5"
            >
              <div v-for="cover in coverOptions" :key="cover.id" class="flex flex-col gap-3">
                <button
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
                  class="group relative aspect-square rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg overflow-hidden cursor-pointer"
                  @click="formData.cover = cover.id"
                >
                  <!-- Selected indicator -->
                  <div
                    v-if="formData.cover === cover.id"
                    class="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shadow-lg"
                  >
                    <Check class="h-3 w-3 text-white" />
                  </div>

                  <!-- Cover previews based on type -->
                  <CoverPreview :type="cover.id" />
                </button>
                <!-- Cover style label -->
                <span
                  :class="
                    formData.cover === cover.id
                      ? 'text-teal-600 dark:text-teal-400'
                      : theme.textSecondary
                  "
                  class="text-xs md:text-sm font-semibold text-center transition-all duration-200"
                >
                  {{ cover.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Cover Focal Point Section -->
          <div
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="mb-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Cover Focal Point</h3>
              <p :class="theme.textSecondary" class="text-xs">
                Choose where to focus the cover image
              </p>
            </div>
            <Button
              :class="[theme.borderSecondary, theme.bgCard, theme.textPrimary]"
              class="w-full"
              variant="outline"
              @click="showFocalPointModal = true"
            >
              <span>Set Focal Point</span>
            </Button>
          </div>

          <!-- Joy Cover Style Customization -->
          <div
            v-if="formData.cover === 'joy'"
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="mb-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">
                Joy Cover Customization
              </h3>
              <p :class="theme.textSecondary" class="text-xs">
                Customize the title, avatar, and display options for your Joy cover
              </p>
            </div>

            <div class="space-y-4">
              <!-- Title Text -->
              <div>
                <label :class="theme.textSecondary" class="text-xs font-medium mb-2 block">
                  Title Text
                </label>
                <input
                  v-model="formData.joyCoverTitle"
                  :class="[theme.borderSecondary, theme.bgCard, theme.textPrimary]"
                  class="w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="JOY"
                  type="text"
                />
                <p :class="theme.textTertiary" class="text-xs mt-1.5">
                  The letter "O" will be replaced with your avatar image
                </p>
              </div>

              <!-- Avatar Upload -->
              <div>
                <label :class="theme.textSecondary" class="text-xs font-medium mb-2 block">
                  Profile Picture / Avatar
                </label>
                <div class="flex items-center gap-4">
                  <div
                    v-if="formData.joyCoverAvatar"
                    :class="theme.borderSecondary"
                    class="w-20 h-20 rounded-full overflow-hidden border-2"
                  >
                    <img
                      :src="formData.joyCoverAvatar"
                      alt="Avatar"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    :class="[theme.borderSecondary, theme.textTertiary]"
                    class="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center"
                  >
                    <span class="text-xs">No image</span>
                  </div>
                  <Button
                    :class="[theme.borderSecondary, theme.bgCard, theme.textPrimary]"
                    size="sm"
                    variant="outline"
                    @click="handleAvatarUpload"
                  >
                    {{ formData.joyCoverAvatar ? 'Change' : 'Upload' }}
                  </Button>
                  <Button
                    v-if="formData.joyCoverAvatar"
                    :class="[theme.textSecondary, theme.bgButtonHover]"
                    size="sm"
                    variant="ghost"
                    @click="formData.joyCoverAvatar = null"
                  >
                    Remove
                  </Button>
                </div>
                <input
                  ref="avatarInputRef"
                  accept="image/*"
                  class="hidden"
                  type="file"
                  @change="handleAvatarFileChange"
                />
              </div>

              <!-- Show Date Toggle -->
              <div class="flex items-center justify-between">
                <div>
                  <label :class="theme.textPrimary" class="text-xs font-medium block mb-1">
                    Show Date
                  </label>
                  <p :class="theme.textSecondary" class="text-xs">
                    Display the event date below the title
                  </p>
                </div>
                <ToggleSwitch
                  v-model="formData.joyCoverShowDate"
                  label=""
                  off-label="Off"
                  on-label="On"
                />
              </div>

              <!-- Show Name Toggle -->
              <div class="flex items-center justify-between">
                <div>
                  <label :class="theme.textPrimary" class="text-xs font-medium block mb-1">
                    Show Name
                  </label>
                  <p :class="theme.textSecondary" class="text-xs">
                    Display the collection name below the date
                  </p>
                </div>
                <ToggleSwitch
                  v-model="formData.joyCoverShowName"
                  label=""
                  off-label="Off"
                  on-label="On"
                />
              </div>

              <!-- Button Text -->
              <div>
                <label :class="theme.textSecondary" class="text-xs font-medium mb-2 block">
                  Button Text
                </label>
                <input
                  v-model="formData.joyCoverButtonText"
                  :class="[theme.borderSecondary, theme.bgCard, theme.textPrimary]"
                  class="w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-teal-500/20"
                  placeholder="VIEW GALLERY"
                  type="text"
                />
              </div>

              <!-- Show Button Toggle -->
              <div class="flex items-center justify-between">
                <div>
                  <label :class="theme.textPrimary" class="text-xs font-medium block mb-1">
                    Show Button
                  </label>
                  <p :class="theme.textSecondary" class="text-xs">
                    Display the call-to-action button
                  </p>
                </div>
                <ToggleSwitch
                  v-model="formData.joyCoverShowButton"
                  label=""
                  off-label="Off"
                  on-label="On"
                />
              </div>

              <!-- Background Pattern -->
              <div>
                <label :class="theme.textSecondary" class="text-xs font-medium mb-2 block">
                  Background Pattern
                </label>
                <div class="flex gap-3">
                  <button
                    v-for="pattern in [
                      { id: 'crosses', label: 'Crosses' },
                      { id: 'sparkles', label: 'Sparkles' },
                      { id: 'none', label: 'None' },
                    ]"
                    :key="pattern.id"
                    :class="[
                      formData.joyCoverBackgroundPattern === pattern.id
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20'
                        : [theme.borderSecondary, 'hover:border-teal-500/60'],
                      theme.bgCard,
                    ]"
                    class="flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200"
                    @click="handleJoyPatternChange(pattern.id)"
                  >
                    <span
                      :class="
                        formData.joyCoverBackgroundPattern === pattern.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textPrimary
                      "
                      class="text-xs font-medium block text-center"
                    >
                      {{ pattern.label }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Focal Point Modal -->
          <Dialog :open="showFocalPointModal" @update:open="showFocalPointModal = $event">
            <DialogContent
              :class="[theme.bgCard, theme.borderCard, 'sm:max-w-4xl p-0', 'focal-point-dialog']"
            >
              <DialogHeader class="px-6 pt-6 pb-4">
                <DialogTitle :class="['text-lg font-semibold uppercase', theme.textPrimary]">
                  SET FOCAL POINT
                </DialogTitle>
              </DialogHeader>

              <div class="px-6 pb-6">
                <div
                  ref="focalPointImageContainer"
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
                  class="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-crosshair"
                  @click="handleFocalPointClick"
                >
                  <!-- Focal Point Indicator -->
                  <div
                    :style="{
                      left: `${formData.coverFocalPoint.x}%`,
                      top: `${formData.coverFocalPoint.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }"
                    class="absolute w-8 h-8 rounded-full border-4 border-white bg-green-500 shadow-lg pointer-events-none transition-all duration-100"
                  >
                    <div class="w-full h-full rounded-full bg-white/30"></div>
                  </div>
                </div>

                <div class="flex items-center justify-end gap-3 mt-4">
                  <Button
                    :class="[theme.textSecondary, theme.bgButtonHover]"
                    type="button"
                    variant="ghost"
                    @click="showFocalPointModal = false"
                  >
                    Cancel
                  </Button>
                  <Button
                    class="bg-teal-500 hover:bg-teal-600 text-white"
                    type="button"
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
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="flex items-center justify-between mb-1">
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Typography</h3>
                <p :class="theme.textSecondary" class="text-xs">
                  Select fonts that match your brand and style
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <!-- Font Families -->
              <div>
                <label :class="theme.textSecondary" class="text-xs font-medium mb-2 block"
                  >Font Family</label
                >
                <FontFamilySelect v-model="formData.fontFamily" placeholder="Select font family" />
              </div>
              <!-- Font Weights/Styles -->
              <div>
                <label :class="theme.textSecondary" class="text-xs font-medium mb-2 block"
                  >Font Style</label
                >
                <div class="flex gap-3">
                  <button
                    v-for="style in fontStyles"
                    :key="style.id"
                    :class="[
                      formData.fontStyle === style.id
                        ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                        : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                      theme.bgCard,
                    ]"
                    class="group flex-1 px-5 py-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                    @click="formData.fontStyle = style.id"
                  >
                    <span
                      :class="[
                        formData.fontStyle === style.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textPrimary,
                        style.class,
                      ]"
                      class="text-base font-medium block text-center transition-colors duration-200"
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
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="flex items-center justify-between mb-1">
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Color Palette</h3>
                <p :class="theme.textSecondary" class="text-xs">
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
                class="group flex flex-col gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                @click="formData.colorPalette = palette.id"
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
                    :class="{ 'delay-75': index === 1, 'delay-150': index === 2 }"
                    :style="{ backgroundColor: color }"
                    class="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800 shadow-sm transition-transform duration-300 group-hover:scale-110"
                  ></div>
                </div>
                <span
                  :class="
                    formData.colorPalette === palette.id
                      ? 'text-teal-600 dark:text-teal-400'
                      : theme.textPrimary
                  "
                  class="text-xs font-semibold text-center transition-colors duration-200"
                >
                  {{ palette.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Grid Style Section -->
          <div
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="mb-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Grid Layout</h3>
              <p :class="theme.textSecondary" class="text-xs">
                Choose how photos are arranged in your gallery
              </p>
            </div>
            <div class="flex gap-4">
              <button
                v-for="style in gridStyles"
                :key="style.id"
                :class="[
                  formData.gridStyle === style.id
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                    : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                  theme.bgCard,
                ]"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                @click="formData.gridStyle = style.id"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    :class="
                      formData.gridStyle === style.id
                        ? 'bg-teal-500/20'
                        : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50'
                    "
                    class="p-2 rounded-lg transition-all duration-300"
                  >
                    <component
                      :is="style.id === 'masonry' ? LayoutGrid : Grid3x3"
                      :class="
                        formData.gridStyle === style.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textSecondary
                      "
                      class="h-6 w-6 transition-colors duration-200"
                    />
                  </div>
                  <span
                    :class="
                      formData.gridStyle === style.id
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textPrimary
                    "
                    class="text-sm font-semibold transition-colors duration-200"
                  >
                    {{ style.label }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Grid Columns Section -->
          <div
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="mb-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Images Per Row</h3>
              <p :class="theme.textSecondary" class="text-xs">
                Select how many images appear in each row
              </p>
            </div>
            <div class="flex gap-3">
              <button
                v-for="cols in gridColumnsOptions"
                :key="cols.value"
                :class="[
                  formData.gridColumns === cols.value
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                    : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                  theme.bgCard,
                ]"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                @click="formData.gridColumns = cols.value"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    :class="
                      formData.gridColumns === cols.value
                        ? 'bg-teal-500/20'
                        : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50'
                    "
                    class="p-2 rounded-lg transition-all duration-300"
                  >
                    <Grid3x3
                      :class="
                        formData.gridColumns === cols.value
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textSecondary
                      "
                      class="h-6 w-6 transition-colors duration-200"
                    />
                  </div>
                  <span
                    :class="
                      formData.gridColumns === cols.value
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textPrimary
                    "
                    class="text-sm font-semibold transition-colors duration-200"
                  >
                    {{ cols.label }}
                  </span>
                </div>
              </button>
            </div>
          </div>

          <!-- Thumbnail Size Section -->
          <div
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="mb-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Thumbnail Size</h3>
              <p :class="theme.textSecondary" class="text-xs">
                Control the size of gallery thumbnails
              </p>
            </div>
            <div class="flex gap-4">
              <button
                v-for="size in thumbnailSizes"
                :key="size.id"
                :class="[
                  formData.thumbnailSize === size.id
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                    : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                  theme.bgCard,
                ]"
                :disabled="formData.gridStyle === 'masonry' && size.id === 'large'"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                @click="formData.thumbnailSize = size.id"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    :class="
                      formData.thumbnailSize === size.id
                        ? 'bg-teal-500/20'
                        : 'bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50'
                    "
                    class="p-2 rounded-lg transition-all duration-300"
                  >
                    <Grid3x3
                      :class="
                        formData.thumbnailSize === size.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textSecondary
                      "
                      class="h-6 w-6 transition-colors duration-200"
                    />
                  </div>
                  <span
                    :class="
                      formData.thumbnailSize === size.id
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textPrimary
                    "
                    class="text-sm font-semibold transition-colors duration-200"
                  >
                    {{ size.label }}
                  </span>
                </div>
              </button>
            </div>
            <p
              v-if="formData.gridStyle === 'masonry'"
              :class="theme.textTertiary"
              class="text-xs mt-2"
            >
              Large thumbnail size is not available for masonry layout
            </p>
          </div>

          <!-- Grid Spacing Section -->
          <div
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="mb-1">
              <div class="flex items-center justify-between mb-2">
                <h3 :class="theme.textPrimary" class="text-lg font-bold">Grid Spacing</h3>
                <span :class="theme.textSecondary" class="text-sm font-semibold">
                  {{ formData.gridSpacing }}px
                </span>
              </div>
              <p :class="theme.textSecondary" class="text-xs">
                Adjust the gap between gallery items (1-100px)
              </p>
            </div>
            <div class="px-2">
              <Slider v-model="gridSpacingSlider" :max="100" :min="1" :step="1" class="w-full" />
            </div>
          </div>

          <!-- Navigation Style Section -->
          <div
            :class="[theme.borderSecondary, theme.bgCard]"
            class="space-y-5 p-6 rounded-2xl border-2"
          >
            <div class="mb-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Navigation Style</h3>
              <p :class="theme.textSecondary" class="text-xs">
                Choose how navigation elements are displayed
              </p>
            </div>
            <div class="flex gap-4">
              <button
                v-for="nav in navigationStyles"
                :key="nav.id"
                :class="[
                  formData.navigationStyle === nav.id
                    ? 'border-teal-500 bg-teal-500/10 dark:bg-teal-500/20 shadow-md shadow-teal-500/10'
                    : [theme.borderSecondary, 'hover:border-teal-500/60', 'active:scale-98'],
                  theme.bgCard,
                ]"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                @click="formData.navigationStyle = nav.id"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    :class="[
                      formData.navigationStyle === nav.id
                        ? 'border-teal-500 bg-teal-500/10 shadow-sm'
                        : [
                            theme.borderSecondary,
                            'group-hover:border-teal-500/50',
                            'bg-gray-100/50 dark:bg-gray-800/50',
                          ],
                    ]"
                    class="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300"
                  >
                    <span
                      v-if="nav.id === 'icon-text'"
                      :class="
                        formData.navigationStyle === nav.id
                          ? 'text-teal-600 dark:text-teal-400'
                          : theme.textSecondary
                      "
                      class="text-xs font-bold transition-colors duration-200"
                    >
                      A
                    </span>
                    <div
                      v-else
                      :class="
                        formData.navigationStyle === nav.id
                          ? 'border-teal-500 bg-teal-500/20'
                          : theme.borderSecondary
                      "
                      class="w-3 h-3 rounded border transition-colors duration-200"
                    ></div>
                  </div>
                  <span
                    :class="
                      formData.navigationStyle === nav.id
                        ? 'text-teal-600 dark:text-teal-400'
                        : theme.textPrimary
                    "
                    class="text-sm font-semibold transition-colors duration-200"
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
              :class="[theme.borderSecondary, theme.bgCard]"
              class="rounded-xl border-2 overflow-hidden backdrop-blur-md bg-white/50 dark:bg-gray-900/50"
            >
              <div
                :class="theme.borderSecondary"
                class="p-4 border-b flex items-center justify-between"
              >
                <div>
                  <h3 :class="theme.textPrimary" class="text-lg font-semibold">Live Preview</h3>
                  <p :class="theme.textSecondary" class="text-xs mt-1">
                    See exactly how your design will look
                  </p>
                </div>
                <Button
                  :class="[
                    theme.textSecondary,
                    theme.bgButtonHover,
                    'hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200',
                  ]"
                  class="shrink-0"
                  size="sm"
                  title="Open preview in new tab"
                  variant="ghost"
                  @click="handleOpenPreviewInNewTab"
                >
                  <ExternalLink class="h-4 w-4 mr-1.5" />
                  <span class="text-xs">Open</span>
                </Button>
              </div>
              <div class="h-[800px] overflow-y-auto">
                <!-- Full Collection Preview -->
                <CollectionPreview
                  :preview-collection="mockPreviewCollection"
                  :preview-design-config="formData"
                  :preview-media="mockPreviewMedia"
                  :preview-mode="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="lg:col-span-3">
        <div
          :class="theme.borderSecondary"
          class="flex justify-between items-center mt-12 pt-8 border-t"
        >
          <Button
            :class="[
              theme.textSecondary,
              theme.bgButtonHover,
              'hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            ]"
            :disabled="isSubmitting || isSaving"
            variant="ghost"
            @click="handlePrevious"
          >
            ← Previous
          </Button>
          <div class="flex items-center gap-3">
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95 translate-x-2"
              enter-to-class="opacity-100 scale-100 translate-x-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 translate-x-0"
              leave-to-class="opacity-0 scale-95 translate-x-2"
            >
              <span
                v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
                :class="theme.textTertiary"
                class="text-xs"
              >
                Unsaved changes
              </span>
            </Transition>
            <Button
              :disabled="isSubmitting || isSaving"
              class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              @click="handleNext"
            >
              <Loader2 v-if="isSubmitting || isSaving" class="mr-2 h-4 w-4 animate-spin" />
              <span v-if="isSubmitting || isSaving">Saving...</span>
              <span v-else>Next →</span>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Unsaved Changes Modal -->
    <UnsavedChangesModal
      v-model="showUnsavedChangesModal"
      :is-saving="isSubmitting || isSaving"
      @cancel="handleCancelNavigation"
      @discard="handleDiscardAndLeave"
      @save="handleSaveAndLeave"
    />
  </PresetLayout>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, ref, type Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { Check, ExternalLink, Grid3x3, LayoutGrid, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Slider } from '@/components/shadcn/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import PresetLayout from '@/layouts/PresetLayout.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import CoverPreview from '@/components/organisms/CoverPreview.vue'
import FontFamilySelect from '@/components/organisms/FontFamilySelect.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
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

const isSubmitting = ref(false)
const isLoadingData = ref(false)
const showFocalPointModal = ref(false)
const focalPointImageContainer = ref<HTMLElement | null>(null)
const showUnsavedChangesModal = ref(false)
const avatarInputRef = ref<HTMLInputElement | null>(null)

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
  // Joy cover style customization
  joyCoverTitle: 'JOY',
  joyCoverAvatar: null as string | null,
  joyCoverShowDate: true,
  joyCoverShowName: true,
  joyCoverButtonText: 'VIEW GALLERY',
  joyCoverShowButton: true,
  joyCoverBackgroundPattern: 'crosses' as 'crosses' | 'sparkles' | 'none',
})

// Store original loaded data for comparison
const originalData = ref<typeof formData.value | null>(null)

// Check if there are actual unsaved changes by comparing with original data
const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  return (
    formData.value.cover !== originalData.value.cover ||
    formData.value.coverFocalPoint.x !== originalData.value.coverFocalPoint.x ||
    formData.value.coverFocalPoint.y !== originalData.value.coverFocalPoint.y ||
    formData.value.fontFamily !== originalData.value.fontFamily ||
    formData.value.fontStyle !== originalData.value.fontStyle ||
    formData.value.colorPalette !== originalData.value.colorPalette ||
    formData.value.gridStyle !== originalData.value.gridStyle ||
    formData.value.gridColumns !== originalData.value.gridColumns ||
    formData.value.thumbnailSize !== originalData.value.thumbnailSize ||
    formData.value.gridSpacing !== originalData.value.gridSpacing ||
    formData.value.navigationStyle !== originalData.value.navigationStyle ||
    formData.value.joyCoverTitle !== originalData.value.joyCoverTitle ||
    formData.value.joyCoverAvatar !== originalData.value.joyCoverAvatar ||
    formData.value.joyCoverShowDate !== originalData.value.joyCoverShowDate ||
    formData.value.joyCoverShowName !== originalData.value.joyCoverShowName ||
    formData.value.joyCoverButtonText !== originalData.value.joyCoverButtonText ||
    formData.value.joyCoverShowButton !== originalData.value.joyCoverShowButton ||
    formData.value.joyCoverBackgroundPattern !== originalData.value.joyCoverBackgroundPattern
  )
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

// Cover options - 21 beautiful cover styles + none
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
  { id: 'joy', label: 'Joy' },
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

// Handle joy pattern change
const handleJoyPatternChange = (patternId: string) => {
  if (patternId === 'crosses' || patternId === 'sparkles' || patternId === 'none') {
    formData.value.joyCoverBackgroundPattern = patternId
  }
}

// Handle avatar upload
const handleAvatarUpload = () => {
  avatarInputRef.value?.click()
}

const handleAvatarFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Create a preview URL
    const reader = new FileReader()
    reader.onload = e => {
      if (e.target?.result) {
        formData.value.joyCoverAvatar = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
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
    const loadedData = {
      cover: designData.cover || 'modern',
      coverFocalPoint:
        designData.coverFocalPoint && typeof designData.coverFocalPoint === 'object'
          ? { ...designData.coverFocalPoint }
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
      // Joy cover settings
      joyCoverTitle: designData.joyCoverTitle || 'JOY',
      joyCoverAvatar: designData.joyCoverAvatar || null,
      joyCoverShowDate:
        designData.joyCoverShowDate !== undefined ? designData.joyCoverShowDate : true,
      joyCoverShowName:
        designData.joyCoverShowName !== undefined ? designData.joyCoverShowName : true,
      joyCoverButtonText: designData.joyCoverButtonText || 'VIEW GALLERY',
      joyCoverShowButton:
        designData.joyCoverShowButton !== undefined ? designData.joyCoverShowButton : true,
      joyCoverBackgroundPattern:
        (designData.joyCoverBackgroundPattern as 'crosses' | 'sparkles' | 'none') || 'crosses',
    }
    formData.value = { ...loadedData }
    originalData.value = { ...loadedData }
    presetStore.setCurrentPreset(currentPreset.value.id)
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
    // Update original data after successful save
    if (originalData.value) {
      originalData.value = { ...formData.value }
    }
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

// Set up unsaved changes guard
// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    formData.value = { ...originalData.value }
  }
}

const { handleSaveAndLeave, handleDiscardAndLeave, handleCancelNavigation } =
  useUnsavedChangesGuard({
    hasUnsavedChanges,
    isSubmitting,
    isSaving,
    saveFunction: savePresetDesign,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })

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

<style scoped>
/* Hide the default DialogContent close button in focal point modal */
:deep(.focal-point-dialog > button[class*='absolute'][class*='right-4'][class*='top-4']) {
  display: none !important;
}
</style>
