<template>
  <PresetLayout>
    <div
      :class="isSidebarCollapsed ? 'max-w-[calc(100vw-8rem)]' : 'max-w-[calc(100vw-16rem)]'"
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
              <div :class="theme.textTertiary" class="text-xs">Color Palette</div>
              <div :class="theme.textPrimary" class="text-sm font-semibold mt-0.5">
                {{ colorPalettes.find(p => p.id === formData.colorPalette)?.label || 'Light' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="presetStore.isLoading || isLoadingData || !currentPreset" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Skeleton Loader -->
        <div class="lg:col-span-1 space-y-12">
          <div v-for="i in 4" :key="i" :class="[theme.borderSecondary, theme.bgCard]" class="space-y-4 p-6 rounded-2xl border-2">
            <div class="space-y-2">
              <Skeleton class="h-5 w-32" />
              <Skeleton class="h-4 w-48" />
            </div>
            <Skeleton class="h-12 w-full" />
            <Skeleton class="h-10 w-24" />
          </div>
        </div>
        <div class="lg:col-span-2">
          <Skeleton class="h-[600px] w-full rounded-2xl" />
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-1 space-y-12">
          <!-- Joy Cover Customization - Hidden for now -->
          <div v-if="false">
            <div
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
                    class="w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-accent/20 focus:border-accent/50"
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
                    class="w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-accent/20 focus:border-accent/50"
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
                          ? 'border-accent bg-accent/10 dark:bg-accent/20'
                          : '',
                        'hover:border-accent/60',
                        theme.bgCard,
                      ]"
                      class="flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200"
                      @click="handleJoyPatternChange(pattern.id)"
                    >
                      <span
                        :class="
                          formData.joyCoverBackgroundPattern === pattern.id
                            ? 'text-accent'
                            : ''
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
          </div>

          <!-- Removed: Focal Point Modal (cover style/focal point removed from presets) -->
          <Dialog v-if="false" :open="showFocalPointModal" @update:open="showFocalPointModal = $event">
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
                    aspectRatio,
                    backgroundImage:
                      mockPreviewMedia.length > 0 && mockPreviewMedia[0].url
                        ? `url(${mockPreviewMedia[0].url})`
                        : mockPreviewCollection.thumbnail
                          ? `url(${mockPreviewCollection.thumbnail})`
                          : '',
                    backgroundSize,
                    backgroundPosition,
                    backgroundRepeat,
                  }"
                  class="relative w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-crosshair"
                  @click="handleFocalPointClick"
                >
                  <!-- Focal Point Indicator -->
                  <div
                    :style="{
                      left,
                      top,
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
                    variant="primary"
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
            class="space-y-6 p-6 rounded-2xl border-2 transition-shadow duration-300"
          >
            <div class="flex items-center justify-between mb-2">
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Typography</h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                  Select fonts that match your brand and style
                </p>
              </div>
            </div>
            <div class="space-y-5">
              <!-- Font Families -->
              <div>
                <label
                  :class="theme.textSecondary"
                  class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                >
                  Font Family
                </label>
                <FontFamilySelect
                  v-model="formData.fontFamily"
                  placeholder="Select font family"
                />
              </div>
              <!-- Font Style -->
              <div>
                <label
                  :class="theme.textSecondary"
                  class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                >
                  Font Style
                </label>
                <Select v-model="formData.fontStyle">
                  <SelectTrigger
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'focus:ring-2 focus:ring-accent/20 focus:border-accent',
                    ]"
                    class="transition-all"
                  >
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                    <SelectItem
                      v-for="style in fontStyleOptions"
                      :key="style.value"
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      :style="getStylePreview(style.value)"
                      :value="style.value"
                    >
                      {{ style.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
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
              <div class="px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
                <span class="text-xs font-semibold text-accent">
                  {{ colorPalettes.find(p => p.id === formData.colorPalette)?.label || 'Light' }}
                </span>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <button
                v-for="palette in colorPalettes"
                :key="palette.id"
                :class="[
                  formData.colorPalette === palette.id
                    ? 'border-accent shadow-lg shadow-accent/30 ring-2 ring-accent/20'
                    : '',
                  theme.borderSecondary,
                  'hover:border-accent/60 hover:shadow-md',
                  'active:scale-95',
                  theme.bgCard,
                ]"
                class="group flex flex-col gap-3 p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                @click="formData.colorPalette = palette.id"
              >
                <!-- Selected indicator -->
                <div
                  v-if="formData.colorPalette === palette.id"
                  class="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-md"
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
                    formData.colorPalette === palette.id ? 'text-accent' : ''
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
            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="style in gridStyles"
                :key="style.id"
                :class="[
                  formData.gridStyle === style.id
                    ? 'border-accent bg-accent/10 dark:bg-accent/20 shadow-md shadow-accent/10'
                    : '',
                  'hover:border-accent/60',
                  'active:scale-98',
                  theme.bgCard,
                ]"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                @click="formData.gridStyle = style.id"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    :class="formData.gridStyle === style.id ? 'bg-accent/20' : ''"
                    class="p-2 rounded-lg transition-all duration-300"
                  >
                    <component
                      :is="getGridStyleIcon(style.id)"
                      :class="
                        formData.gridStyle === style.id ? 'text-accent' : ''
                      "
                      class="h-6 w-6 transition-colors duration-200"
                    />
                  </div>
                  <span
                    :class="
                      formData.gridStyle === style.id ? 'text-accent' : ''
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
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="cols in gridColumnsOptions"
                :key="cols.value"
                :class="[
                  formData.gridColumns === cols.value
                    ? 'border-accent bg-accent/10 dark:bg-accent/20 shadow-md shadow-accent/10'
                    : '',
                  'hover:border-accent/60',
                  'active:scale-98',
                  theme.bgCard,
                ]"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer"
                @click="formData.gridColumns = cols.value"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    :class="formData.gridColumns === cols.value ? 'bg-accent/20' : ''"
                    class="p-2 rounded-lg transition-all duration-300"
                  >
                    <Grid3x3
                      :class="
                        formData.gridColumns === cols.value
                          ? 'text-accent'
                          : ''
                      "
                      class="h-6 w-6 transition-colors duration-200"
                    />
                  </div>
                  <span
                    :class="
                      formData.gridColumns === cols.value ? 'text-accent' : ''
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
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Thumbnail Orientation</h3>
              <p :class="theme.textSecondary" class="text-xs">
                Choose the aspect ratio for gallery thumbnails
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="size in thumbnailSizes"
                :key="size.id"
                :class="[
                  formData.thumbnailSize === size.id
                    ? 'border-accent bg-accent/10 dark:bg-accent/20 shadow-md shadow-accent/10'
                    : '',
                  'hover:border-accent/60',
                  'active:scale-98',
                  theme.bgCard,
                ]"
                :disabled="formData.gridStyle === 'masonry' && size.id === 'large'"
                class="group flex-1 px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                @click="formData.thumbnailSize = size.id"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    :class="formData.thumbnailSize === size.id ? 'bg-accent/20' : ''"
                    class="p-2 rounded-lg transition-all duration-300"
                  >
                    <Grid3x3
                      :class="
                        formData.thumbnailSize === size.id ? 'text-accent' : ''
                      "
                      class="h-6 w-6 transition-colors duration-200"
                    />
                  </div>
                  <span
                    :class="
                      formData.thumbnailSize === size.id ? 'text-accent' : ''
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
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1">Tab Icons</h3>
              <p :class="theme.textSecondary" class="text-xs">
                Choose how tab icons are displayed
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="nav in navigationStyles"
                :key="nav.id"
                :class="[
                  formData.navigationStyle === nav.id
                    ? 'border-accent bg-accent/10 dark:bg-accent/20 ring-2 ring-accent/20 scale-[1.01]'
                    : [
                        theme.borderSecondary,
                        'hover:border-accent/70',
                        'active:scale-[0.98]',
                      ],
                  theme.bgCard,
                ]"
                class="group px-6 py-5 rounded-xl border-2 transition-all duration-300 hover:scale-[1.03] cursor-pointer min-w-0"
                @click="formData.navigationStyle = nav.id"
              >
                <div class="flex items-center justify-center gap-3">
                  <div
                    :class="formData.navigationStyle === nav.id ? 'bg-accent/20' : ''"
                    class="p-2.5 rounded-lg transition-all duration-300"
                  >
                    <component
                      :is="getNavigationStyleIcon(nav.id)"
                      :class="
                        formData.navigationStyle === nav.id
                          ? 'text-accent'
                          : ''
                      "
                      class="h-5 w-5 transition-colors duration-200"
                    />
                  </div>
                  <span
                    :class="
                      formData.navigationStyle === nav.id
                        ? 'text-accent font-bold'
                        : theme.textSecondary
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
        <div class="lg:col-span-2">
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
                    'hover:text-accent transition-colors duration-200',
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
              'hover:text-accent transition-colors duration-200',
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
              variant="primary"
              :loading="isSubmitting || isSaving"
              loading-label="Saving..."
              class="shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              @click="handleNext"
            >
              Next →
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

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/shared/composables/useUnsavedChangesGuard'
import { Check, ExternalLink, Grid3x3, LayoutGrid, Loader2, Type, Image as ImageIcon } from 'lucide-vue-next'
import {
  gridStyles,
  gridColumnsOptions,
  thumbnailSizes,
  navigationStyles,
  fontStyleOptions,
  defaultDesignValues,
  getGridStyleIcon,
  getNavigationStyleIcon,
} from '@/shared/utils/designConstants'
import { getColorPalettesArray } from '@/shared/utils/colors'
import { Button } from '@/shared/components/shadcn/button'
import { Slider } from '@/shared/components/shadcn/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/shadcn/dialog'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import PresetLayout from '@/shared/layouts/PresetLayout.vue'
import UnsavedChangesModal from '@/domains/memora/modals/UnsavedChangesModal.vue'
import FontFamilySelect from '@/shared/components/organisms/FontFamilySelect.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import CollectionPreview from '@/domains/memora/views/user/memora/preview/CollectionPreview.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'
import { usePresetStore } from '@/shared/stores/preset'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()

// Inject sidebar collapse state from PresetLayout
const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false))

const currentPreset = computed(() => {
  const idParam = route.params.id
  if (idParam) {
    return presetStore.getPresetById(idParam)
  }
  return null
})

const presetId = computed(() => {
  return currentPreset.value?.id || null
})

const isSubmitting = ref(false)
const isLoadingData = ref(false)
const showFocalPointModal = ref(false)
const focalPointImageContainer = ref(null)
const showUnsavedChangesModal = ref(false)
const avatarInputRef = ref(null)

// Default design values - use shared constants
const defaultFontFamily = defaultDesignValues.fontFamily
const defaultFontStyle = defaultDesignValues.fontStyle
const defaultColorPalette = defaultDesignValues.colorPalette
const defaultGridStyle = defaultDesignValues.gridStyle
const defaultGridColumns = defaultDesignValues.gridColumns
const defaultThumbnailSize = defaultDesignValues.thumbnailSize
const defaultGridSpacing = defaultDesignValues.gridSpacing
const defaultNavigationStyle = defaultDesignValues.navigationStyle
const defaultJoyCoverTitle = ''
const defaultJoyCoverAvatar = null
const defaultJoyCoverShowDate = false
const defaultJoyCoverShowName = false
const defaultJoyCoverButtonText = 'View Gallery'
const defaultJoyCoverShowButton = false
const defaultJoyCoverBackgroundPattern = 'crosses'

// Design form data
const formData = reactive({
  fontFamily: defaultFontFamily,
  fontStyle: defaultFontStyle,
  colorPalette: defaultColorPalette,
  gridStyle: defaultGridStyle,
  gridColumns: defaultGridColumns,
  thumbnailSize: defaultThumbnailSize,
  gridSpacing: defaultGridSpacing,
  navigationStyle: defaultNavigationStyle,
  // Joy cover style customization
  joyCoverTitle: defaultJoyCoverTitle,
  joyCoverAvatar: defaultJoyCoverAvatar,
  joyCoverShowDate: defaultJoyCoverShowDate,
  joyCoverShowName: defaultJoyCoverShowName,
  joyCoverButtonText: defaultJoyCoverButtonText,
  joyCoverShowButton: defaultJoyCoverShowButton,
  joyCoverBackgroundPattern: defaultJoyCoverBackgroundPattern,
})

// Store original loaded data for comparison
const originalData = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  return (
    formData.cover !== originalData.value.cover ||
    formData.fontFamily !== originalData.value.fontFamily ||
    formData.fontStyle !== originalData.value.fontStyle ||
    formData.colorPalette !== originalData.value.colorPalette ||
    formData.gridStyle !== originalData.value.gridStyle ||
    formData.gridColumns !== originalData.value.gridColumns ||
    formData.thumbnailSize !== originalData.value.thumbnailSize ||
    formData.gridSpacing !== originalData.value.gridSpacing ||
    formData.navigationStyle !== originalData.value.navigationStyle ||
    formData.joyCoverTitle !== originalData.value.joyCoverTitle ||
    formData.joyCoverAvatar !== originalData.value.joyCoverAvatar ||
    formData.joyCoverShowDate !== originalData.value.joyCoverShowDate ||
    formData.joyCoverShowName !== originalData.value.joyCoverShowName ||
    formData.joyCoverButtonText !== originalData.value.joyCoverButtonText ||
    formData.joyCoverShowButton !== originalData.value.joyCoverShowButton ||
    formData.joyCoverBackgroundPattern !== originalData.value.joyCoverBackgroundPattern
  )
})

// Computed property to convert gridSpacing number to array for Slider component
const gridSpacingSlider = computed({
  get: () => {
    return [formData.gridSpacing]
  },
  set: value => {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number') {
      formData.gridSpacing = Math.max(1, Math.min(100, value[0]))
    }
  },
})

// Cover styles removed from presets


const handleJoyPatternChange = patternId => {
  if (patternId === 'crosses' || patternId === 'sparkles' || patternId === 'none') {
    formData.joyCoverBackgroundPattern = patternId
  }
}

const handleAvatarUpload = () => {
  avatarInputRef.value?.click()
}

const handleAvatarFileChange = event => {
  const target = event.target
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      if (e.target?.result) {
        formData.joyCoverAvatar = e.target.result
      }
    }
    reader.readAsDataURL(file)
  }
}

// Font styles - use shared constants
const fontStyles = fontStyleOptions.map(opt => ({
  id: opt.value,
  label: opt.label,
  class: opt.value === 'normal' ? 'font-normal' : opt.value === 'bold' ? 'font-bold' : 'italic',
}))

// Helper function to convert font style to CSS properties
const getFontStyleProperties = style => {
  if (!style) {
    return {
      fontWeight: 'normal',
      fontStyle: 'normal',
    }
  }
  const styles = style.split(/[\s-]+/).filter(s => s.length > 0)
  return {
    fontWeight: styles.includes('bold') ? 'bold' : 'normal',
    fontStyle: styles.includes('italic') ? 'italic' : 'normal',
  }
}

// Helper function for style preview in Select dropdown
const getStylePreview = styleValue => {
  return getFontStyleProperties(styleValue)
}

// Color palettes - use shared utility
const colorPalettes = getColorPalettesArray()

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value && !isLoadingData.value) {
    isLoadingData.value = true
    const designData = currentPreset.value.design || {}

    // Calculate gridSpacing based on thumbnailSize if not provided
    let calculatedGridSpacing = defaultGridSpacing
    if (typeof designData.gridSpacing === 'number') {
      calculatedGridSpacing = designData.gridSpacing
    } else if (designData.thumbnailSize) {
      if (designData.thumbnailSize === 'small') {
        calculatedGridSpacing = 8
      } else if (designData.thumbnailSize === 'medium') {
        calculatedGridSpacing = 16
      } else if (designData.thumbnailSize === 'large') {
        calculatedGridSpacing = 24
      }
    }

    const joyCover = designData.joyCover || {}
    
    const loadedData = {
      fontFamily: designData.fontFamily || defaultFontFamily,
      fontStyle: designData.fontStyle || defaultFontStyle,
      colorPalette: designData.colorPalette || defaultColorPalette,
      gridStyle: designData.gridStyle || defaultGridStyle,
      gridColumns: designData.gridColumns || defaultGridColumns,
      thumbnailSize: designData.thumbnailOrientation || designData.thumbnailSize || defaultThumbnailSize,
      gridSpacing: calculatedGridSpacing,
      navigationStyle: designData.tabStyle || designData.navigationStyle || defaultNavigationStyle,
      // Joy cover settings
      joyCoverTitle: joyCover.title || defaultJoyCoverTitle,
      joyCoverAvatar: joyCover.avatar || defaultJoyCoverAvatar,
      joyCoverShowDate:
        joyCover.showDate !== undefined
          ? joyCover.showDate
          : defaultJoyCoverShowDate,
      joyCoverShowName:
        joyCover.showName !== undefined
          ? joyCover.showName
          : defaultJoyCoverShowName,
      joyCoverButtonText: joyCover.buttonText || defaultJoyCoverButtonText,
      joyCoverShowButton:
        joyCover.showButton !== undefined
          ? joyCover.showButton
          : defaultJoyCoverShowButton,
      joyCoverBackgroundPattern: ['crosses', 'sparkles', 'none'].includes(
        joyCover.backgroundPattern
      )
        ? joyCover.backgroundPattern
        : defaultJoyCoverBackgroundPattern,
    }
    Object.assign(formData, loadedData)
    originalData.value = { ...loadedData }
    presetStore.setCurrentPreset(currentPreset.value.id)
    isLoadingData.value = false
  }
}

// Watch for route changes to load preset and reload data
watch(
  () => route.params.id,
  async (idParam) => {
    if (idParam) {
      // Check if preset exists in store
      let preset = presetStore.getPresetById(idParam)
      
      // If not found, fetch only this single preset
      if (!preset) {
        try {
          preset = await presetStore.loadPreset(idParam)
        } catch (error) {
          // Silently fail
          console.error('Failed to load preset:', error)
        }
      }
      
      // Load preset data once we have it
      if (preset) {
        loadPresetData()
      }
    }
  },
  { immediate: true }
)

// Watch for grid style changes - disable large thumbnail size for masonry
watch(
  () => formData.gridStyle,
  newStyle => {
    if (newStyle === 'masonry' && formData.thumbnailSize === 'large') {
      formData.thumbnailSize = 'medium'
    }
  }
)

// Keyboard shortcut handler
let keyDownHandler = null

// Initialize on mount
onMounted(async () => {
  // Add keyboard shortcut for save (Cmd+S / Ctrl+S)
  keyDownHandler = e => {
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
const savePresetDesign = async () => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return false
  }

  try {
    // Map form data to backend structure
    await presetStore.updatePreset(presetId.value, {
      design: {
        fontFamily: formData.fontFamily,
        fontStyle: formData.fontStyle,
        colorPalette: formData.colorPalette,
        gridStyle: formData.gridStyle,
        gridColumns: formData.gridColumns,
        thumbnailOrientation: formData.thumbnailSize,
        gridSpacing: formData.gridSpacing,
        tabStyle: formData.navigationStyle,
      },
    })
    if (originalData.value) {
      originalData.value = { ...formData }
    }
    return true
  } catch (error) {
    toast.error('Failed to save preset', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
    return false
  }
}

const handleSave = async () => {
  const success = await savePresetDesign()
  if (success) {
    toast.success('Preset saved successfully')
  }
}

const handlePrevious = async () => {
  isSubmitting.value = true
  try {
    const success = await savePresetDesign()
    if (success && presetId.value) {
      router.push({
        name: 'presetGeneral',
        params: { id: presetId.value },
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
    if (success && presetId.value) {
      router.push({
        name: 'presetPrivacy',
        params: { id: presetId.value },
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const isSaving = computed(() => presetStore.isLoading)

// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    Object.assign(formData, originalData.value)
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
  const presetName = route.params.name
  if (!presetName || !presetId.value) {
    toast.error('Preset not found')
    return
  }

  // Save current design changes before opening preview
  const success = await savePresetDesign()
  if (success) {
    const urlFriendlyName = presetName.toLowerCase().replace(/\s+/g, '-')
    const previewUrl = router.resolve({
      name: 'presetPreview',
      params: { name: urlFriendlyName },
    }).href
    window.open(previewUrl, '_blank')
  }
}

// Fallback image URL for broken images
const fallbackImageUrl =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop'

// Mock data for preview
const mockPreviewCollection = computed(() => ({
  id: 'mock-collection-id',
  name: 'Sample Collection',
  date: new Date().toISOString(),
  eventDate: new Date().toISOString(),
  thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&fit=crop',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 'published',
  category: 'events',
}))

const mockPreviewMedia = computed(() => {
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

  return photoIds.map((photoId, index) => ({
    id: photoId,
    collectionId: 'mock-collection-id',
    url: `https://images.unsplash.com/photo-${photoId}?w=800&fit=crop`,
    thumbnail: `https://images.unsplash.com/photo-${photoId}?w=300&fit=crop`,
    type: 'image',
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
  display: none;
}
</style>
