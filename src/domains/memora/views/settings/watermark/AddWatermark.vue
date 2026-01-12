<template>
  <div v-if="isLoading" class="flex items-center justify-center h-screen">
    <div class="text-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
      <p :class="theme.textSecondary" class="text-sm">Loading watermark...</p>
    </div>
  </div>
  <div v-else class="flex flex-col h-screen overflow-hidden">
    <!-- Header - Full Width -->
    <div
      :class="[theme.bgPage, theme.borderSecondary]"
      class="flex items-center justify-between px-6 py-4 border-b w-full"
    >
      <div class="flex items-center gap-3">
        <button
          :class="theme.textSecondary"
          aria-label="Close and go back"
          class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Close"
          @click="router.push({ name: 'watermarkSettings' })"
        >
          <X class="h-5 w-5" />
        </button>
        <input
          v-model="watermarkName"
          :class="theme.textPrimary"
          class="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0 px-2 py-1 rounded hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors min-w-[200px]"
          maxlength="50"
          placeholder="Enter watermark name"
          type="text"
          @blur="handleNameBlur"
          @keyup.enter="handleNameBlur"
          @keyup.esc="handleEscKey"
        />
      </div>
      <div class="flex items-center gap-2">
        <!-- Theme Toggle -->
        <ThemeToggle />
        <button
          :class="theme.textSecondary"
          aria-label="More options"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="More options"
        >
          <MoreVertical class="h-5 w-5" />
        </button>
        <Button
          :disabled="isSaving || !isFormValid || watermarkStore.isLoading"
          class="bg-violet-500 hover:bg-violet-600 text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSave"
        >
          <span v-if="isSaving || watermarkStore.isLoading">
            <span
              class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></span>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>{{ isEditing ? 'Update' : 'Create' }}</span>
        </Button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <div :class="theme.borderSecondary" class="w-[420px] border-r overflow-hidden flex flex-col">
        <!-- Settings Section -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <!-- Settings Info -->
          <div class="space-y-3">
            <h3 :class="theme.textPrimary" class="text-sm font-semibold uppercase tracking-wide">
              Settings
            </h3>
            <p :class="theme.textSecondary" class="text-xs leading-relaxed">
              Watermarks will not appear on prints ordered through Store. Any watermark changes will
              only apply to photos uploaded moving forward.
              <a class="text-violet-500 hover:text-violet-600 underline font-medium" href="#"
                >Learn more</a
              >.
            </p>
          </div>

          <!-- Watermark Templates -->
          <div class="space-y-3">
            <h3 :class="theme.textPrimary" class="text-sm font-semibold">Templates</h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="template in watermarkTemplates"
                :key="template.id"
                @click="applyTemplate(template)"
                class="p-3 rounded-md border-2 text-left transition-all hover:border-violet-500"
                :class="[
                  theme.bgCard,
                  theme.borderSecondary,
                  theme.textSecondary,
                  'hover:bg-gray-50 dark:hover:bg-gray-800',
                ]"
              >
                <div class="font-semibold text-xs mb-1" :class="theme.textPrimary">
                  {{ template.name }}
                </div>
                <div class="text-xs opacity-75">{{ template.description }}</div>
              </button>
            </div>
          </div>

          <!-- Watermark Type -->
          <div class="space-y-3">
            <h3 :class="theme.textPrimary" class="text-sm font-semibold">Watermark Type</h3>
            <div class="flex gap-2">
              <button
                :class="
                  watermarkType === 'text'
                    ? 'bg-violet-500 text-white shadow-md'
                    : [
                        theme.bgCard,
                        theme.borderSecondary,
                        'border',
                        theme.textSecondary,
                        'hover:bg-gray-50 dark:hover:bg-gray-800',
                      ]
                "
                class="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200"
                @click="watermarkType = 'text'"
              >
                TEXT
              </button>
              <button
                :class="
                  watermarkType === 'image'
                    ? 'bg-violet-500 text-white shadow-md'
                    : [
                        theme.bgCard,
                        theme.borderSecondary,
                        'border',
                        theme.textSecondary,
                        'hover:bg-gray-50 dark:hover:bg-gray-800',
                      ]
                "
                class="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200"
                @click="watermarkType = 'image'"
              >
                IMAGE
              </button>
            </div>
          </div>

          <!-- Watermark Text (for TEXT type) -->
          <Transition name="fade">
            <div v-if="watermarkType === 'text'" class="space-y-3">
              <h3 :class="theme.textPrimary" class="text-sm font-semibold">Watermark Text</h3>
              <Input
                v-model="watermarkText"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500',
                ]"
                class="transition-all"
                maxlength="50"
                placeholder="Enter watermark text"
                type="text"
                @input="validateWatermarkText"
              />
            </div>
          </Transition>

          <!-- Typography Section (for TEXT type) -->
          <div
            v-if="watermarkType === 'text'"
            :class="theme.borderSecondary"
            class="space-y-4 pt-2 border-t"
          >
              <div class="flex items-center gap-2">
                <h3 :class="theme.textPrimary" class="text-sm font-semibold">Typography</h3>
                <span
                  :class="[theme.bgCard, theme.textSecondary]"
                  class="text-xs px-2 py-0.5 rounded-full"
                >
                  Text Style
                </span>
              </div>

              <!-- Font Family -->
              <div class="space-y-3">
                <h4 :class="theme.textSecondary" class="text-xs font-medium">Font Family</h4>
                <FontFamilySelect v-model="fontFamilyId" placeholder="Select font family" />
              </div>

              <!-- Font Style -->
              <div class="space-y-3">
                <h4 :class="theme.textSecondary" class="text-xs font-medium">Font Style</h4>
                <Select v-model="fontStyle">
                  <SelectTrigger
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500',
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

              <!-- Font Color -->
              <div class="space-y-3">
                <h4 :class="theme.textSecondary" class="text-xs font-medium">Font Color</h4>
                <div class="flex items-center gap-3">
                  <button
                    :class="[
                      fontColor === '#FFFFFF'
                        ? 'border-violet-500 ring-4 ring-violet-500/20 shadow-md'
                        : 'hover:border-violet-500/50',
                    ]"
                    class="w-12 h-12 rounded-full border-2 transition-all hover:scale-110"
                    style="
                      background:
                        linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
                      background-size: 8px 8px;
                      background-position:
                        0 0,
                        0 4px,
                        4px -4px,
                        -4px 0px;
                    "
                    @click="fontColor = '#FFFFFF'"
                  >
                    <div
                      :class="theme.borderSecondary"
                      class="w-full h-full rounded-full bg-white border-2"
                    ></div>
                  </button>
                  <button
                    :class="[
                      fontColor === '#000000'
                        ? 'border-violet-500 ring-4 ring-violet-500/20 shadow-md'
                        : 'hover:border-violet-500/50',
                    ]"
                    class="w-12 h-12 rounded-full bg-black border-2 transition-all hover:scale-110"
                    @click="fontColor = '#000000'"
                  ></button>
                  <div class="flex-1 min-w-0">
                    <ColorPicker v-model="fontColor" />
                  </div>
                </div>
              </div>
            </div>

          <!-- Watermark Image (for IMAGE type) -->
          <Transition name="fade">
            <div v-if="watermarkType === 'image'" class="space-y-3">
              <h3 :class="theme.textPrimary" class="text-sm font-semibold">Watermark Image</h3>
              <div
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                  'hover:border-violet-500 hover:bg-violet-50/50 dark:hover:bg-violet-900/10',
                ]"
                class="w-full h-56 rounded-lg border-2 border-dashed flex items-center justify-center transition-all cursor-pointer group"
                @click="handleUploadImage"
              >
                <div v-if="!watermarkImageUrl" class="text-center space-y-2">
                  <div
                    class="p-3 rounded-full bg-violet-500/10 group-hover:bg-violet-500/20 transition-colors inline-block"
                  >
                    <Plus class="h-8 w-8 text-violet-500" />
                  </div>
                  <p :class="theme.textSecondary" class="text-sm font-medium">
                    Click to upload image
                  </p>
                  <p :class="theme.textTertiary" class="text-xs">PNG, JPG up to 10MB</p>
                </div>
                <div v-else class="relative w-full h-full group">
                  <img
                    :src="watermarkImageUrl"
                    alt="Watermark preview"
                    class="w-full h-full object-contain p-4 rounded"
                  />
                  <button
                    aria-label="Remove watermark image"
                    class="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Remove image"
                    @click.stop="handleRemoveImage"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Spacing & Layout Section (for TEXT type) -->
          <Transition name="fade">
            <div
              v-if="watermarkType === 'text'"
              :class="theme.borderSecondary"
              class="space-y-4 pt-2 border-t"
            >
              <div class="flex items-center gap-2">
                <h3 :class="theme.textPrimary" class="text-sm font-semibold">Spacing & Layout</h3>
                <span
                  :class="[theme.bgCard, theme.textSecondary]"
                  class="text-xs px-2 py-0.5 rounded-full"
                >
                  Text Spacing
                </span>
              </div>

              <!-- Line Height -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 :class="theme.textSecondary" class="text-xs font-medium">Line Height</h4>
                    <span
                      :class="theme.textSecondary"
                      class="text-xs"
                      title="Vertical spacing between lines"
                      >↕️</span
                    >
                  </div>
                  <span
                    :class="[theme.bgCard, theme.textPrimary]"
                    class="text-sm font-bold px-2 py-1 rounded-md"
                  >
                    {{ Number(lineHeight[0] ?? 1.5).toFixed(1) }}
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="lineHeight" :max="3" :min="0.1" :step="0.1" class="w-full" />
                </div>
              </div>

              <!-- Letter Spacing -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 :class="theme.textSecondary" class="text-xs font-medium">Letter Spacing</h4>
                    <span
                      :class="theme.textSecondary"
                      class="text-xs"
                      title="Horizontal spacing between letters"
                      >↔️</span
                    >
                  </div>
                  <span
                    :class="[theme.bgCard, theme.textPrimary]"
                    class="text-sm font-bold px-2 py-1 rounded-md"
                  >
                    {{ (letterSpacing[0] ?? 0) }}px
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="letterSpacing" :max="10" :min="0" :step="0.5" class="w-full" />
                </div>
              </div>

              <!-- Padding -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 :class="theme.textSecondary" class="text-xs font-medium">Padding</h4>
                    <span
                      :class="theme.textSecondary"
                      class="text-xs"
                      title="Internal spacing around text"
                      >📦</span
                    >
                  </div>
                  <span
                    :class="[theme.bgCard, theme.textPrimary]"
                    class="text-sm font-bold px-2 py-1 rounded-md"
                  >
                    {{ (padding[0] ?? 0) }}px
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="padding" :max="50" :min="0" :step="1" class="w-full" />
                </div>
              </div>
            </div>
          </Transition>

          <!-- Background Section (for TEXT type) -->
          <Transition name="fade">
            <div
              v-if="watermarkType === 'text'"
              :class="theme.borderSecondary"
              class="space-y-4 pt-2 border-t"
            >
              <div class="flex items-center gap-2">
                <h3 :class="theme.textPrimary" class="text-sm font-semibold">Background</h3>
                <span
                  :class="[theme.bgCard, theme.textSecondary]"
                  class="text-xs px-2 py-0.5 rounded-full"
                >
                  Optional
                </span>
              </div>

              <!-- Background Color -->
              <div class="space-y-3">
                <h4 :class="theme.textSecondary" class="text-xs font-medium">Background Color</h4>
                <div class="flex items-center gap-3">
                  <button
                    :class="[
                      backgroundColor === null
                        ? 'border-violet-500 ring-4 ring-violet-500/20 shadow-md'
                        : 'hover:border-violet-500/50',
                    ]"
                    aria-label="Remove background"
                    class="w-12 h-12 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center"
                    title="No background"
                    @click="backgroundColor = null"
                  >
                    <X
                      v-if="backgroundColor === null"
                      :class="theme.textSecondary"
                      class="h-5 w-5"
                    />
                    <div v-else :class="theme.bgCard" class="w-full h-full rounded-full"></div>
                  </button>
                  <div class="flex-1 min-w-0">
                    <ColorPicker v-model="backgroundColor" :allow-transparent="true" />
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Text Transform Section (for TEXT type) -->
          <Transition name="fade">
            <div
              v-if="watermarkType === 'text'"
              :class="theme.borderSecondary"
              class="space-y-4 pt-2 border-t"
            >
              <div class="flex items-center gap-2">
                <h3 :class="theme.textPrimary" class="text-sm font-semibold">Text Case</h3>
                <span
                  :class="[theme.bgCard, theme.textSecondary]"
                  class="text-xs px-2 py-0.5 rounded-full"
                >
                  Optional
                </span>
              </div>

              <!-- Text Transform -->
              <div class="space-y-3">
                <h4 :class="theme.textSecondary" class="text-xs font-medium">Text Transform</h4>
                <Select v-model="textTransform">
                  <SelectTrigger
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500',
                    ]"
                    class="transition-all"
                  >
                    <SelectValue placeholder="Select text transform" />
                  </SelectTrigger>
                  <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                    <SelectItem
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      value="none"
                    >
                      None
                    </SelectItem>
                    <SelectItem
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      style="text-transform: uppercase"
                      value="uppercase"
                    >
                      UPPERCASE
                    </SelectItem>
                    <SelectItem
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      style="text-transform: lowercase"
                      value="lowercase"
                    >
                      lowercase
                    </SelectItem>
                    <SelectItem
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      style="text-transform: capitalize"
                      value="capitalize"
                    >
                      Capitalize
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Transition>

          <!-- Size & Position Section -->
          <div :class="theme.borderSecondary" class="space-y-4 pt-2 border-t">
            <div class="flex items-center gap-2">
              <h3 :class="theme.textPrimary" class="text-sm font-semibold">Size & Position</h3>
              <span
                :class="[theme.bgCard, theme.textSecondary]"
                class="text-xs px-2 py-0.5 rounded-full"
              >
                Required
              </span>
            </div>

            <!-- Scale -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h4 :class="theme.textSecondary" class="text-xs font-medium">Scale</h4>
                  <span :class="theme.textSecondary" class="text-xs" title="Watermark size percentage relative to image dimensions"
                    >🔍</span
                  >
                </div>
                <span
                  :class="[theme.bgCard, theme.textPrimary]"
                  class="text-sm font-bold px-2 py-1 rounded-md"
                >
                  {{ (scale[0] ?? (watermarkType === 'image' ? 100 : 50)) }}%
                </span>
              </div>
              <div class="px-2">
                <Slider v-model="scale" :max="100" :min="1" :step="1" class="w-full" />
              </div>
              <p :class="theme.textSecondary" class="text-xs px-2">
                {{ watermarkType === 'image' ? '100% = 25% of image size' : '100% = 10% of image size' }}
              </p>
            </div>

            <!-- Opacity -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h4 :class="theme.textSecondary" class="text-xs font-medium">Opacity</h4>
                  <span :class="theme.textSecondary" class="text-xs" title="Transparency level"
                    >👻</span
                  >
                </div>
                <span
                  :class="[theme.bgCard, theme.textPrimary]"
                  class="text-sm font-bold px-2 py-1 rounded-md"
                >
                  {{ (opacity[0] ?? 80) }}%
                </span>
              </div>
              <div class="px-2">
                <Slider v-model="opacity" :max="100" :min="0" :step="1" class="w-full" />
              </div>
            </div>

            <!-- Position -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <h4 :class="theme.textSecondary" class="text-xs font-medium">Position</h4>
                <span :class="theme.textSecondary" class="text-xs" title="Watermark placement"
                  >📍</span
                >
              </div>
              <div :class="theme.bgCard" class="grid grid-cols-3 gap-3 p-3 rounded-lg">
                <button
                  v-for="(pos, index) in positionOptions"
                  :key="index"
                  :aria-label="`Set position to ${pos.label}`"
                  :class="position === pos.value ? 'bg-violet-500/10' : ''"
                  :title="pos.label"
                  class="relative w-full aspect-square flex items-center justify-center rounded-md transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  @click="position = pos.value"
                >
                  <div
                    :class="position === pos.value ? 'w-4 h-4 bg-violet-500' : 'w-2 h-2 bg-gray-400'"
                    class="rounded-full transition-all"
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Border Section (for TEXT type) -->
          <div
            v-if="watermarkType === 'text'"
            :class="theme.borderSecondary"
            class="space-y-4 pt-2 border-t"
          >
              <div class="flex items-center gap-2">
                <h3 :class="theme.textPrimary" class="text-sm font-semibold">Border & Corners</h3>
                <span
                  :class="[theme.bgCard, theme.textSecondary]"
                  class="text-xs px-2 py-0.5 rounded-full"
                >
                  Optional
                </span>
              </div>

              <!-- Border Radius -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 :class="theme.textSecondary" class="text-xs font-medium">Corner Radius</h4>
                    <span :class="theme.textSecondary" class="text-xs" title="Rounded corners"
                      >⭕</span
                    >
                  </div>
                  <span
                    :class="[theme.bgCard, theme.textPrimary]"
                    class="text-sm font-bold px-2 py-1 rounded-md"
                  >
                    {{ (borderRadius[0] ?? 0) }}px
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="borderRadius" :max="50" :min="0" :step="1" class="w-full" />
                </div>
              </div>

              <!-- Border Width -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 :class="theme.textSecondary" class="text-xs font-medium">Border Width</h4>
                    <span :class="theme.textSecondary" class="text-xs" title="Border thickness"
                      >▢</span
                    >
                  </div>
                  <span
                    :class="[theme.bgCard, theme.textPrimary]"
                    class="text-sm font-bold px-2 py-1 rounded-md"
                  >
                    {{ (borderWidth[0] ?? 0) }}px
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="borderWidth" :max="10" :min="0" :step="1" class="w-full" />
                </div>
                <p v-if="borderWidth[0] === 0" :class="theme.textSecondary" class="text-xs italic">
                  💡 Increase border width to enable border color and style options
                </p>
              </div>

              <!-- Border Color (only when width > 0) -->
              <Transition name="fade">
                <div v-if="borderWidth[0] > 0" class="space-y-3">
                  <h4 :class="theme.textSecondary" class="text-xs font-medium">Border Color</h4>
                  <div class="flex-1 min-w-0">
                    <ColorPicker v-model="borderColor" />
                  </div>
                </div>
              </Transition>

              <!-- Border Style (only when width > 0) -->
              <Transition name="fade">
                <div v-if="borderWidth[0] > 0" class="space-y-3">
                  <h4 :class="theme.textSecondary" class="text-xs font-medium">Border Style</h4>
                  <Select v-model="borderStyle">
                    <SelectTrigger
                      :class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        'focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500',
                      ]"
                      class="transition-all"
                    >
                      <SelectValue placeholder="Select border style" />
                    </SelectTrigger>
                    <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                      <SelectItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        value="solid"
                      >
                        <span class="flex items-center gap-2">
                          <span class="inline-block w-8 h-0.5 bg-current"></span>
                          Solid
                        </span>
                      </SelectItem>
                      <SelectItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        value="dashed"
                      >
                        <span class="flex items-center gap-2">
                          <span
                            class="inline-block w-8 h-0.5 bg-current"
                            style="border-top: 2px dashed"
                          ></span>
                          Dashed
                        </span>
                      </SelectItem>
                      <SelectItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        value="dotted"
                      >
                        <span class="flex items-center gap-2">
                          <span
                            class="inline-block w-8 h-0.5 bg-current"
                            style="border-top: 2px dotted"
                          ></span>
                          Dotted
                        </span>
                      </SelectItem>
                      <SelectItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        value="double"
                      >
                        <span class="flex items-center gap-2">
                          <span
                            class="inline-block w-8 h-0.5 bg-current"
                            style="border-top: 2px double"
                          ></span>
                          Double
                        </span>
                      </SelectItem>
                      <SelectItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        value="none"
                      >
                        None
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Transition>
            </div>
        </div>
      </div>

      <!-- Right Side -->
      <div
        :class="theme.bgPage"
        class="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div class="w-full max-w-5xl space-y-6">
          <!-- Preview Mode Toggle -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <button
              :class="
                previewMode === 'desktop'
                  ? 'bg-violet-500 text-white shadow-md hover:bg-violet-600'
                  : [
                      theme.bgCard,
                      theme.borderSecondary,
                      'border-2',
                      theme.textSecondary,
                      'hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-violet-500/50',
                    ]
              "
              class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              @click="previewMode = 'desktop'"
            >
              <Monitor class="h-4 w-4" />
              Desktop
            </button>
            <button
              :class="
                previewMode === 'mobile'
                  ? 'bg-violet-500 text-white shadow-md hover:bg-violet-600'
                  : [
                      theme.bgCard,
                      theme.borderSecondary,
                      'border-2',
                      theme.textSecondary,
                      'hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-violet-500/50',
                    ]
              "
              class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              @click="previewMode = 'mobile'"
            >
              <Smartphone class="h-4 w-4" />
              Mobile
            </button>
            <button
              :class="
                previewMode === 'grid'
                  ? 'bg-violet-500 text-white shadow-md hover:bg-violet-600'
                  : [
                      theme.bgCard,
                      theme.borderSecondary,
                      'border-2',
                      theme.textSecondary,
                      'hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-violet-500/50',
                    ]
              "
              class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              @click="previewMode = 'grid'"
            >
              <Grid3x3 class="h-4 w-4" />
              Grid
            </button>
          </div>

          <!-- Desktop Preview - MacBook Air Frame -->
          <div v-if="previewMode === 'desktop'" class="flex items-center justify-center">
            <div class="relative">
              <!-- MacBook Air Container -->
              <div :class="theme.bgCard" class="relative">
                <!-- Screen Section -->
                <div
                  :class="[theme.bgCard, 'border-2', theme.borderSecondary]"
                  class="relative rounded-t-[1.5rem] p-2 shadow-2xl"
                >
                  <!-- Screen Bezel (MacBook Air style - thin bezels) -->
                  <div class="bg-black rounded-t-[1.25rem] p-1">
                    <!-- Camera Notch -->
                    <div
                      class="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-b-full z-10"
                    ></div>
                    <!-- Screen -->
                    <div
                      class="relative bg-white dark:bg-gray-900 rounded-t-[1.125rem] overflow-hidden shadow-inner"
                      style="width: 100%"
                    >
                      <img
                        :src="previewImageUrl"
                        alt="Watermark preview"
                        class="w-full h-full object-cover"
                      />
                      <!-- Watermark Overlay - Text -->
                      <div
                        v-if="watermarkType === 'text' && watermarkText"
                        :style="{
                          ...getPositionStyle(),
                          fontSize: `${fontSize}rem`,
                          fontFamily,
                          ...getFontStyleProperties(fontStyle.value),
                          color: color,
                          backgroundColor: previewBackgroundColor,
                          lineHeight: previewLineHeight,
                          letterSpacing: previewLetterSpacing,
                          padding: previewPadding,
                          textTransform: textTransform,
                          borderRadius: previewBorderRadius,
                          borderWidth: previewBorderWidth,
                          borderColor: previewBorderColor,
                          borderStyle: previewBorderStyle,
                          opacity: previewOpacity,
                          maxWidth: maxWidth,
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                          display: 'inline-block',
                          textAlign: 'center',
                        }"
                        class="absolute pointer-events-none select-none transition-all duration-300"
                      >
                        {{ watermarkText }}
                      </div>
                      <!-- Watermark Overlay - Image -->
                      <img
                        v-else-if="watermarkType === 'image' && watermarkImageUrl"
                        :src="watermarkImageUrl"
                        :style="{
                          ...getPositionStyle(),
                          width: width,
                          height: height,
                          maxWidth: maxWidth,
                          maxHeight: maxHeight,
                          opacity: previewOpacity,
                          objectFit: 'contain',
                        }"
                        alt="Watermark"
                        class="absolute pointer-events-none select-none will-change-transform"
                      />
                    </div>
                  </div>
                </div>
                <!-- Hinge -->
                <div
                  :class="theme.bgCard"
                  class="h-2 rounded-full mx-auto"
                  style="width: 60%"
                ></div>
                <!-- Base/Keyboard Section -->
                <div
                  :class="[theme.bgCard, 'border-2 border-t-0', theme.borderSecondary]"
                  class="relative rounded-b-[1.5rem] p-3 shadow-xl"
                >
                  <!-- Trackpad area -->
                  <div
                    :class="[theme.bgInput, theme.borderSecondary, 'border']"
                    class="w-32 h-20 mx-auto rounded-lg"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Preview - iPhone 17 Frame -->
          <div v-else class="flex items-center justify-center">
            <div class="relative">
              <!-- iPhone 17 Container -->
              <div :class="theme.bgCard" class="relative rounded-[3.5rem] p-3 shadow-2xl">
                <!-- Phone Bezel (iPhone 17 - titanium-like finish) -->
                <div
                  class="bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-950 dark:to-black rounded-[3rem] p-2.5 shadow-inner"
                >
                  <!-- Dynamic Island (iPhone 17 style) -->
                  <div
                    class="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-10 flex items-center justify-center"
                  >
                    <div class="w-20 h-1 bg-white/20 rounded-full"></div>
                  </div>
                  <!-- Screen -->
                  <div
                    class="relative bg-white dark:bg-gray-900 rounded-[2.75rem] overflow-hidden shadow-inner"
                    style="width: 100%"
                  >
                    <img
                      :src="previewImageUrl"
                      alt="Watermark preview"
                      class="w-full h-full object-cover"
                    />
                    <!-- Watermark Overlay - Text -->
                    <div
                      v-if="watermarkType === 'text' && watermarkText"
                      :style="{
                        ...getPositionStyle(),
                        fontSize: `${fontSize * 0.7}rem`,
                        fontFamily,
                        ...getFontStyleProperties(fontStyle.value),
                        color: color,
                        backgroundColor: previewBackgroundColor,
                        lineHeight: previewLineHeight,
                        letterSpacing: previewLetterSpacing,
                        padding: previewPadding,
                        textTransform: textTransform,
                        borderRadius: previewBorderRadius,
                        borderWidth: previewBorderWidth,
                        borderColor: previewBorderColor,
                        borderStyle: previewBorderStyle,
                        opacity: previewOpacity,
                        maxWidth: maxWidth,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        display: 'inline-block',
                        textAlign: 'center',
                      }"
                      class="absolute pointer-events-none select-none transition-all duration-300"
                    >
                      {{ watermarkText }}
                    </div>
                    <!-- Watermark Overlay - Image -->
                    <img
                      v-else-if="watermarkType === 'image' && watermarkImageUrl"
                      :src="watermarkImageUrl"
                      :style="{
                        ...getPositionStyle(),
                        width: width,
                        height: height,
                        maxWidth: maxWidth,
                        maxHeight: maxHeight,
                        opacity: previewOpacity,
                        objectFit: 'contain',
                      }"
                      alt="Watermark"
                      class="absolute pointer-events-none select-none will-change-transform"
                    />
                  </div>
                  <!-- Home Indicator (iPhone 17 - thin bar) -->
                  <div
                    class="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 dark:bg-white/20 rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Grid Preview -->
          <WatermarkPreviewGrid
            v-if="previewMode === 'grid'"
            :watermark="computedWatermark"
            :show-preview-on-media="false"
          />

          <!-- Preview Navigation -->
          <div v-if="previewMode !== 'grid'" class="flex items-center justify-center gap-2">
            <button
              :class="
                previewMode === 'desktop'
                  ? 'bg-violet-500 border-violet-500 shadow-md'
                  : 'hover:border-violet-500'
              "
              aria-label="Desktop preview"
              class="w-2.5 h-2.5 rounded-full border-2 transition-all hover:scale-125"
              @click="previewMode = 'desktop'"
            ></button>
            <button
              :class="
                previewMode === 'mobile'
                  ? 'bg-violet-500 border-violet-500 shadow-md'
                  : 'hover:border-violet-500'
              "
              aria-label="Mobile preview"
              class="w-2.5 h-2.5 rounded-full border-2 transition-all hover:scale-125"
              @click="previewMode = 'mobile'"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Grid3x3, Monitor, MoreVertical, Plus, Smartphone, X } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import Input from '@/shared/components/shadcn/input/Input.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import { Slider } from '@/shared/components/shadcn/slider'
import ColorPicker from '@/shared/components/shadcn/ColorPicker.vue'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import FontFamilySelect from '@/shared/components/organisms/FontFamilySelect.vue'
import WatermarkPreviewGrid from '@/shared/components/organisms/WatermarkPreviewGrid.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'

const description = ''

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const watermarkStore = useWatermarkStore()

const isEditing = computed(() => !!route.params.id)
const watermarkId = computed(() => (isEditing.value ? String(route.params.id) : null))

const watermarkName = ref('New Watermark')
const watermarkType = ref('text')
const watermarkText = ref('')
const fontFamilyId = ref('pacifico')
const fontStyle = ref('normal')

const fontFamilyMap = {
  sans: 'sans-serif',
  serif: 'serif',
  modern: 'monospace',
  bebas: "'Bebas Neue', sans-serif",
  oswald: "'Oswald', sans-serif",
  abril: "'Abril Fatface', serif",
  bungee: "'Bungee', sans-serif",
  righteous: "'Righteous', sans-serif",
  playfair: "'Playfair Display', serif",
  montserrat: "'Montserrat', sans-serif",
  lato: "'Lato', sans-serif",
  raleway: "'Raleway', sans-serif",
  opensans: "'Open Sans', sans-serif",
  roboto: "'Roboto', sans-serif",
  poppins: "'Poppins', sans-serif",
  inter: "'Inter', sans-serif",
  nunito: "'Nunito', sans-serif",
  barlow: "'Barlow', sans-serif",
  worksans: "'Work Sans', sans-serif",
  spacegrotesk: "'Space Grotesk', sans-serif",
  outfit: "'Outfit', sans-serif",
  dmsans: "'DM Sans', sans-serif",
  plusjakarta: "'Plus Jakarta Sans', sans-serif",
  manrope: "'Manrope', sans-serif",
  sora: "'Sora', sans-serif",
  figtree: "'Figtree', sans-serif",
  syne: "'Syne', sans-serif",
  source: "'Source Sans Pro', sans-serif",
  ubuntu: "'Ubuntu', sans-serif",
  merriweather: "'Merriweather', serif",
  crimson: "'Crimson Text', serif",
  lora: "'Lora', serif",
  spacemono: "'Space Mono', monospace",
  jetbrains: "'JetBrains Mono', monospace",
  comfortaa: "'Comfortaa', sans-serif",
  quicksand: "'Quicksand', sans-serif",
  rubik: "'Rubik', sans-serif",
  dancing: "'Dancing Script', cursive",
  pacifico: "'Pacifico', cursive",
  caveat: "'Caveat', cursive",
  kalam: "'Kalam', cursive",
  satisfy: "'Satisfy', cursive",
  greatvibes: "'Great Vibes', cursive",
  amatic: "'Amatic SC', cursive",
  shadows: "'Shadows Into Light', cursive",
  permanent: "'Permanent Marker', cursive",
  indie: "'Indie Flower', cursive",
}

const fontFamily = computed(() => {
  return fontFamilyMap[fontFamilyId.value] || fontFamilyMap.pacifico
})

const fontNameToId = fontName => {
  if (!fontName) return 'pacifico'
  
  const cleanName = fontName.replace(/['"]/g, '').toLowerCase()
  
  const entry = Object.entries(fontFamilyMap).find(([id, name]) => {
    const cleanMapName = name.replace(/['"]/g, '').toLowerCase()
    return cleanMapName.includes(cleanName) || cleanName.includes(id) || 
           cleanName.includes(cleanMapName.split(',')[0].trim())
  })
  
  return entry?.[0] || 'pacifico'
}
const fontColor = ref('#FFFFFF')
const backgroundColor = ref(null)
const lineHeight = ref([1.5])
const letterSpacing = ref([0])
const padding = ref([0])
const textTransform = ref('none')
const borderRadius = ref([0])
const borderWidth = ref([0])
const borderColor = ref('#000000')
const borderStyle = ref('none')
const watermarkImageUrl = ref(null)
const watermarkImageFileUuid = ref(null)
const scale = ref([50]) // Default 50%, will be updated based on watermark type
const opacity = ref([90])
const position = ref('center')
const isSaving = ref(false)
const isLoading = ref(false)
const previewMode = ref('desktop')

const computedWatermark = computed(() => {
  return {
    type: watermarkType.value,
    text: watermarkText.value,
    imageUrl: watermarkImageUrl.value,
    name: watermarkName.value,
    scale: scale.value[0] ?? (watermarkType.value === 'image' ? 100 : 50),
    opacity: opacity.value[0] ?? 80,
    position: position.value,
    fontFamily: fontFamily.value,
    fontStyle: Array.isArray(fontStyle.value) ? fontStyle.value.join('-') : fontStyle.value,
    fontColor: color.value,
    backgroundColor: backgroundColor.value,
    lineHeight: lineHeight.value[0] ?? 1.5,
    letterSpacing: letterSpacing.value[0] ?? 0,
    padding: padding.value[0] ?? 0,
    textTransform: textTransform.value,
    borderRadius: borderRadius.value[0] ?? 0,
    borderWidth: borderWidth.value[0] ?? 0,
    borderColor: borderColor.value,
    borderStyle: borderStyle.value,
  }
})

const previewImageUrl = ref(
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'
)

const fontStyleOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'italic', label: 'Italic' },
  { value: 'bold', label: 'Bold' },
  { value: 'bold italic', label: 'Bold Italic' },
]

const positionOptions = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top', label: 'Top' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'bottom-right', label: 'Bottom Right' },
]

const watermarkTemplates = [
  {
    id: 'subtle',
    name: 'Subtle',
    description: 'Low opacity, bottom corner',
    type: 'text',
    scale: 50,
    opacity: 40,
    position: 'bottom-right',
    fontColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 4,
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High opacity, center',
    type: 'text',
    scale: 80,
    opacity: 90,
    position: 'center',
    fontColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    borderRadius: 8,
    fontStyle: ['bold'],
  },
  {
    id: 'corner',
    name: 'Corner',
    description: 'Small, top-left corner',
    type: 'text',
    scale: 30,
    opacity: 70,
    position: 'top-left',
    fontColor: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 6,
    borderRadius: 4,
  },
  {
    id: 'center',
    name: 'Center',
    description: 'Medium, centered',
    type: 'text',
    scale: 60,
    opacity: 80,
    position: 'center',
    fontColor: '#FFFFFF',
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 0,
  },
]

const applyTemplate = templateData => {
  watermarkType.value = templateData.type
  scale.value = [templateData.scale]
  opacity.value = [templateData.opacity]
  position.value = templateData.position
  if (templateData.fontColor) color.value = templateData.fontColor
  if (templateData.backgroundColor) backgroundColor.value = templateData.backgroundColor
  if (templateData.padding !== undefined) padding.value = [templateData.padding]
  if (templateData.borderRadius !== undefined) borderRadius.value = [templateData.borderRadius]
  if (templateData.fontStyle) {
    fontStyle.value = Array.isArray(templateData.fontStyle) ? templateData.fontStyle.join('-') : templateData.fontStyle
  }
  toast.success('Template applied', { description: '' })
}

// Keyboard shortcuts
const handleKeyDown = event => {
  if ((event.metaKey || event.ctrlKey) && event.key === 's') {
    event.preventDefault()
    if (isFormValid.value && !isSaving.value) {
      handleSave()
    }
  }
  if (event.key === 'Escape') {
    router.push({ name: 'watermarkSettings' })
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const getPositionStyle = () => {
  const positions = {
    'top-left': { top: '10%', left: '10%', transform: 'translate(0, 0)' },
    top: { top: '10%', left: '50%', transform: 'translate(-50%, 0)' },
    'top-right': { top: '10%', right: '10%', transform: 'translate(0, 0)' },
    left: { top: '50%', left: '10%', transform: 'translate(0, -50%)' },
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    right: { top: '50%', right: '10%', transform: 'translate(0, -50%)' },
    'bottom-left': { bottom: '10%', left: '10%', transform: 'translate(0, 0)' },
    bottom: { bottom: '10%', left: '50%', transform: 'translate(-50%, 0)' },
    'bottom-right': { bottom: '10%', right: '10%', transform: 'translate(0, 0)' },
  }
  return positions[position.value] || positions.center
}

const getFontStyleProperties = style => {
  if (!style) {
    return {
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    }
  }
  const styles = style.split(/[\s-]+/).filter(s => s.length > 0)
  return {
    fontWeight: styles.includes('bold') ? 'bold' : 'normal',
    fontStyle: styles.includes('italic') ? 'italic' : 'normal',
    textDecoration: styles.includes('underline') ? 'underline' : 'none',
  }
}

const fontSize = computed(() => {
  const baseSize = previewMode.value === 'desktop' ? 2 : 1.4
  const scaleValue = Number(scale.value[0] ?? 50)
  return (scaleValue / 100) * baseSize
})

const width = computed(() => {
  if (watermarkType.value === 'image') {
    const scaleValue = Number(scale.value[0] ?? 100)
    return `${scaleValue}%`
  }
  return 'auto'
})

const height = computed(() => {
  if (watermarkType.value === 'image') {
    return 'auto'
  }
  return 'auto'
})

const maxWidth = computed(() => {
  return previewMode.value === 'desktop' ? '80%' : '90%'
})

const maxHeight = computed(() => {
  return previewMode.value === 'desktop' ? '80%' : '90%'
})

const previewOpacity = computed(() => {
  return opacity.value[0] / 100
})

const color = computed(() => fontColor.value)

const previewLineHeight = computed(() => lineHeight.value[0])

const previewLetterSpacing = computed(() => {
  return letterSpacing.value[0] ? `${letterSpacing.value[0]}px` : '0px'
})

const previewPadding = computed(() => {
  return padding.value[0] ? `${padding.value[0]}px` : '0px'
})

const previewBorderRadius = computed(() => {
  return borderRadius.value[0] ? `${borderRadius.value[0]}px` : '0px'
})

const previewBorderWidth = computed(() => {
  return borderWidth.value[0] ? `${borderWidth.value[0]}px` : '0px'
})

const previewBorderColor = computed(() => borderColor.value)

const previewBorderStyle = computed(() => borderStyle.value)

const previewBackgroundColor = computed(() => backgroundColor.value || 'transparent')

const getStylePreview = styleValue => {
  return getFontStyleProperties(styleValue)
}

const handleUploadImage = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,.svg'
  input.onchange = async e => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast.error('File too large', {
          description,
        })
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description,
        })
        return
      }

      try {
        const reader = new FileReader()
        reader.onload = event => {
          watermarkImageUrl.value = event.target?.result
        }
        reader.readAsDataURL(file)

        const result = await watermarkStore.uploadWatermarkImage(file)
        watermarkImageFileUuid.value = result.uuid
        watermarkImageUrl.value = result.url // Use server URL for preview
        toast.success('Image uploaded successfully')
      } catch (error) {
        watermarkImageUrl.value = null
        watermarkImageFileUuid.value = null
        toast.error('Failed to upload image', {
          description: error.message || 'An error occurred',
        })
      }
    }
  }
  input.click()
}

const handleRemoveImage = () => {
  watermarkImageUrl.value = null
  watermarkImageFileUuid.value = null
}

const handleEscKey = event => {
  const target = event.target
  target?.blur()
}

const handleNameBlur = () => {
  if (!watermarkName.value.trim()) {
    watermarkName.value = route.params.id ? `My Watermark ${route.params.id}` : 'My Watermark'
  } else {
    watermarkName.value = watermarkName.value.trim()
  }
}

const validateWatermarkText = () => {
  watermarkText.value = watermarkText.value.trim()
}

const isFormValid = computed(() => {
  if (!watermarkName.value.trim()) return false
  if (watermarkType.value === 'text' && !watermarkText.value.trim()) return false
  if (watermarkType.value === 'image' && !watermarkImageFileUuid.value) return false
  return true
})

// Load existing watermark data when editing
onMounted(async () => {
  if (isEditing.value && watermarkId.value) {
    isLoading.value = true
    try {
      const watermark = await watermarkStore.fetchWatermark(watermarkId.value)

      // Populate form with existing data
      watermarkName.value = watermark.name
      watermarkType.value = watermark.type
      watermarkText.value = watermark.text || ''
      fontFamilyId.value = fontNameToId(watermark.fontFamily || 'Pacifico')
      fontStyle.value = watermark.fontStyle || 'normal'
      fontColor.value = watermark.fontColor || '#FFFFFF'
      backgroundColor.value = watermark.backgroundColor || null
      lineHeight.value = [watermark.lineHeight ?? 1.5]
      letterSpacing.value = [watermark.letterSpacing ?? 0]
      padding.value = [watermark.padding ?? 0]
      textTransform.value = watermark.textTransform || 'none'
      borderRadius.value = [watermark.borderRadius || 0]
      borderWidth.value = [watermark.borderWidth || 0]
      borderColor.value = watermark.borderColor || '#000000'
      borderStyle.value = watermark.borderStyle || 'none'
      watermarkImageUrl.value = watermark.imageUrl || null
      watermarkImageFileUuid.value = watermark.imageFileUuid || null
      scale.value = [watermark.scale ?? (watermark.type === 'image' ? 100 : 50)]
      opacity.value = [watermark.opacity ?? 80]
      position.value = watermark.position
    } catch (error) {
      toast.error('Failed to load watermark', {
        description,
      })
      router.push({ name: 'watermarkSettings' })
    } finally {
      isLoading.value = false
    }
  }
})

watch(watermarkType, (newType) => {
  const currentScale = scale.value[0] ?? (newType === 'image' ? 100 : 50)
  // Both types now use 0-100% scale
  scale.value = [Math.min(Math.max(currentScale, 1), 100)]
})

const handleSave = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields', {
      description:
        watermarkType.value === 'text'
          ? 'Watermark text is required'
          : 'Watermark image is required',
    })
    return
  }

  handleNameBlur() // Ensure name is valid before saving
  isSaving.value = true

  try {
    const watermarkData = {
      name: watermarkName.value,
      type: watermarkType.value,
      scale: scale.value[0],
      opacity: opacity.value[0],
      position: position.value,
    }

    if (watermarkType.value === 'text') {
      watermarkData.text = watermarkText.value.trim()
      watermarkData.fontFamily = fontFamily.value
      // Ensure fontStyle is a string (handle both string and array formats)
      watermarkData.fontStyle = Array.isArray(fontStyle.value) ? fontStyle.value.join('-') : fontStyle.value
      watermarkData.fontColor = fontColor.value
      // Send backgroundColor as-is (backend accepts various formats)
      watermarkData.backgroundColor = (backgroundColor.value && backgroundColor.value !== 'transparent') ? backgroundColor.value : undefined
      watermarkData.lineHeight = lineHeight.value[0]
      watermarkData.letterSpacing = letterSpacing.value[0]
      watermarkData.padding = padding.value[0]
      watermarkData.textTransform = textTransform.value
      watermarkData.borderRadius = borderRadius.value[0]
      watermarkData.borderWidth = borderWidth.value[0]
      watermarkData.borderColor = borderWidth.value[0] > 0 ? borderColor.value : undefined
      watermarkData.borderStyle = borderWidth.value[0] > 0 ? borderStyle.value : undefined
    } else {
      if (!watermarkImageFileUuid.value) {
        toast.error('Please upload an image', {
          description,
        })
        isSaving.value = false
        return
      }
      watermarkData.imageFileUuid = watermarkImageFileUuid.value
    }

    if (isEditing.value && watermarkId.value) {
      await watermarkStore.updateWatermark(watermarkId.value, watermarkData)
      toast.success('Watermark updated successfully', {
        description,
      })
    } else {
      await watermarkStore.createWatermark(watermarkData)
      toast.success('Watermark created successfully', {
        description,
      })
    }

    router.push({ name: 'watermarkSettings' })
  } catch (error) {
    toast.error('Failed to save watermark', {
      description,
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
