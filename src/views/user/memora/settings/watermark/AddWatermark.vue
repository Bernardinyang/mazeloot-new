<template>
  <div v-if="isLoading" class="flex items-center justify-center h-screen">
    <div class="text-center space-y-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
      <p class="text-sm" :class="theme.textSecondary">Loading watermark...</p>
    </div>
  </div>
  <div v-else class="flex flex-col h-screen overflow-hidden">
    <!-- Header - Full Width -->
    <div
      class="flex items-center justify-between px-6 py-4 border-b w-full"
      :class="[theme.bgPage, theme.borderSecondary]"
    >
      <div class="flex items-center gap-3">
        <button
          @click="$router.push({ name: 'watermarkSettings' })"
          class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :class="theme.textSecondary"
          aria-label="Close and go back"
          title="Close"
        >
          <X class="h-5 w-5" />
        </button>
        <input
          v-model="watermarkName"
          type="text"
          class="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0 px-2 py-1 rounded hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors min-w-[200px]"
          :class="theme.textPrimary"
          @blur="handleNameBlur"
          @keyup.enter="handleNameBlur"
          @keyup.esc="handleEscKey"
          placeholder="Enter watermark name"
          maxlength="50"
        />
      </div>
      <div class="flex items-center gap-2">
        <!-- Theme Toggle -->
        <ThemeToggle />
        <button
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          :class="theme.textSecondary"
          aria-label="More options"
          title="More options"
        >
          <MoreVertical class="h-5 w-5" />
        </button>
        <Button
          class="bg-teal-500 hover:bg-teal-600 text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleSave"
          :disabled="isSaving || !isFormValid || watermarkStore.isLoading"
        >
          <span v-if="isSaving || watermarkStore.isLoading">
            <span
              class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></span>
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>{{ isEditing ? 'Update' : 'Save' }}</span>
        </Button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar: Settings -->
      <div class="w-[420px] border-r overflow-hidden flex flex-col" :class="theme.borderSecondary">
        <!-- Settings Section -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <!-- Settings Info -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide" :class="theme.textPrimary">
              Settings
            </h3>
            <p class="text-xs leading-relaxed" :class="theme.textSecondary">
              Watermarks will not appear on prints ordered through Store. Any watermark changes will
              only apply to photos uploaded moving forward.
              <a href="#" class="text-teal-500 hover:text-teal-600 underline font-medium"
                >Learn more</a
              >.
            </p>
          </div>

          <!-- Watermark Type -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold" :class="theme.textPrimary">Watermark Type</h3>
            <div class="flex gap-2">
              <button
                @click="watermarkType = 'text'"
                class="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200"
                :class="
                  watermarkType === 'text'
                    ? 'bg-teal-500 text-white shadow-md'
                    : [
                        theme.bgCard,
                        theme.borderSecondary,
                        'border',
                        theme.textSecondary,
                        'hover:bg-gray-50 dark:hover:bg-gray-800',
                      ]
                "
              >
                TEXT
              </button>
              <button
                @click="watermarkType = 'image'"
                class="flex-1 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200"
                :class="
                  watermarkType === 'image'
                    ? 'bg-teal-500 text-white shadow-md'
                    : [
                        theme.bgCard,
                        theme.borderSecondary,
                        'border',
                        theme.textSecondary,
                        'hover:bg-gray-50 dark:hover:bg-gray-800',
                      ]
                "
              >
                IMAGE
              </button>
            </div>
          </div>

          <!-- Watermark Text (for TEXT type) -->
          <Transition name="fade">
            <div v-if="watermarkType === 'text'" class="space-y-3">
              <h3 class="text-sm font-semibold" :class="theme.textPrimary">Watermark Text</h3>
              <Input
                v-model="watermarkText"
                type="text"
                placeholder="Enter watermark text"
                class="transition-all"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
                ]"
                maxlength="50"
                @input="validateWatermarkText"
              />
            </div>
          </Transition>

          <!-- Typography Section (for TEXT type) -->
          <Transition name="fade">
            <div
              v-if="watermarkType === 'text'"
              class="space-y-4 pt-2 border-t"
              :class="theme.borderSecondary"
            >
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold" :class="theme.textPrimary">Typography</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="[theme.bgCard, theme.textSecondary]"
                >
                  Text Style
                </span>
              </div>

              <!-- Font Family -->
              <div class="space-y-3">
                <h4 class="text-xs font-medium" :class="theme.textSecondary">Font Family</h4>
                <FontFamilySelect v-model="fontFamilyId" placeholder="Select font family" />
              </div>

              <!-- Font Style -->
              <div class="space-y-3">
                <h4 class="text-xs font-medium" :class="theme.textSecondary">Font Style</h4>
                <Select v-model="fontStyle">
                  <SelectTrigger
                    class="transition-all"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
                    ]"
                  >
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                    <SelectItem
                      v-for="style in fontStyleOptions"
                      :key="style.value"
                      :value="style.value"
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      :style="getStylePreview(style.value)"
                    >
                      {{ style.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Font Color -->
              <div class="space-y-3">
                <h4 class="text-xs font-medium" :class="theme.textSecondary">Font Color</h4>
                <div class="flex items-center gap-3">
                  <button
                    @click="fontColor = '#FFFFFF'"
                    class="w-12 h-12 rounded-full border-2 transition-all hover:scale-110"
                    :class="
                      fontColor === '#FFFFFF'
                        ? 'border-teal-500 ring-4 ring-teal-500/20 shadow-md'
                        : [theme.borderSecondary, 'hover:border-teal-500/50']
                    "
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
                  >
                    <div
                      class="w-full h-full rounded-full bg-white border-2"
                      :class="theme.borderSecondary"
                    ></div>
                  </button>
                  <button
                    @click="fontColor = '#000000'"
                    class="w-12 h-12 rounded-full bg-black border-2 transition-all hover:scale-110"
                    :class="
                      fontColor === '#000000'
                        ? 'border-teal-500 ring-4 ring-teal-500/20 shadow-md'
                        : [theme.borderSecondary, 'hover:border-teal-500/50']
                    "
                  ></button>
                  <div class="flex-1 min-w-0">
                    <ColorPicker v-model="fontColor" />
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Watermark Image (for IMAGE type) -->
          <Transition name="fade">
            <div v-if="watermarkType === 'image'" class="space-y-3">
              <h3 class="text-sm font-semibold" :class="theme.textPrimary">Watermark Image</h3>
              <div
                class="w-full h-56 rounded-lg border-2 border-dashed flex items-center justify-center transition-all cursor-pointer group"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                  'hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-900/10',
                ]"
                @click="handleUploadImage"
              >
                <div v-if="!watermarkImageUrl" class="text-center space-y-2">
                  <div
                    class="p-3 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors inline-block"
                  >
                    <Plus class="h-8 w-8 text-teal-500" />
                  </div>
                  <p class="text-sm font-medium" :class="theme.textSecondary">
                    Click to upload image
                  </p>
                  <p class="text-xs" :class="theme.textTertiary">PNG, JPG up to 10MB</p>
                </div>
                <div v-else class="relative w-full h-full group">
                  <img
                    :src="watermarkImageUrl"
                    alt="Watermark preview"
                    class="w-full h-full object-contain p-4 rounded"
                  />
                  <button
                    @click.stop="watermarkImageUrl = null"
                    class="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Remove image"
                    aria-label="Remove watermark image"
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
              class="space-y-4 pt-2 border-t"
              :class="theme.borderSecondary"
            >
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold" :class="theme.textPrimary">Spacing & Layout</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="[theme.bgCard, theme.textSecondary]"
                >
                  Text Spacing
                </span>
              </div>

              <!-- Line Height -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 class="text-xs font-medium" :class="theme.textSecondary">Line Height</h4>
                    <span
                      class="text-xs"
                      :class="theme.textSecondary"
                      title="Vertical spacing between lines"
                      >↕️</span
                    >
                  </div>
                  <span
                    class="text-sm font-bold px-2 py-1 rounded-md"
                    :class="[theme.bgCard, theme.textPrimary]"
                  >
                    {{ lineHeight[0].toFixed(1) }}
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="lineHeight" :min="0.1" :max="3" :step="0.1" class="w-full" />
                </div>
              </div>

              <!-- Letter Spacing -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 class="text-xs font-medium" :class="theme.textSecondary">Letter Spacing</h4>
                    <span
                      class="text-xs"
                      :class="theme.textSecondary"
                      title="Horizontal spacing between letters"
                      >↔️</span
                    >
                  </div>
                  <span
                    class="text-sm font-bold px-2 py-1 rounded-md"
                    :class="[theme.bgCard, theme.textPrimary]"
                  >
                    {{ letterSpacing[0] }}px
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="letterSpacing" :min="0" :max="10" :step="0.5" class="w-full" />
                </div>
              </div>

              <!-- Padding -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 class="text-xs font-medium" :class="theme.textSecondary">Padding</h4>
                    <span
                      class="text-xs"
                      :class="theme.textSecondary"
                      title="Internal spacing around text"
                      >📦</span
                    >
                  </div>
                  <span
                    class="text-sm font-bold px-2 py-1 rounded-md"
                    :class="[theme.bgCard, theme.textPrimary]"
                  >
                    {{ padding[0] }}px
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="padding" :min="0" :max="50" :step="1" class="w-full" />
                </div>
              </div>
            </div>
          </Transition>

          <!-- Background Section (for TEXT type) -->
          <Transition name="fade">
            <div
              v-if="watermarkType === 'text'"
              class="space-y-4 pt-2 border-t"
              :class="theme.borderSecondary"
            >
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold" :class="theme.textPrimary">Background</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="[theme.bgCard, theme.textSecondary]"
                >
                  Optional
                </span>
              </div>

              <!-- Background Color -->
              <div class="space-y-3">
                <h4 class="text-xs font-medium" :class="theme.textSecondary">Background Color</h4>
                <div class="flex items-center gap-3">
                  <button
                    @click="backgroundColor = null"
                    class="w-12 h-12 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center"
                    :class="
                      backgroundColor === null
                        ? 'border-teal-500 ring-4 ring-teal-500/20 shadow-md'
                        : [theme.borderSecondary, 'hover:border-teal-500/50']
                    "
                    title="No background"
                    aria-label="Remove background"
                  >
                    <X
                      v-if="backgroundColor === null"
                      class="h-5 w-5"
                      :class="theme.textSecondary"
                    />
                    <div v-else class="w-full h-full rounded-full" :class="theme.bgCard"></div>
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
              class="space-y-4 pt-2 border-t"
              :class="theme.borderSecondary"
            >
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold" :class="theme.textPrimary">Text Case</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="[theme.bgCard, theme.textSecondary]"
                >
                  Optional
                </span>
              </div>

              <!-- Text Transform -->
              <div class="space-y-3">
                <h4 class="text-xs font-medium" :class="theme.textSecondary">Text Transform</h4>
                <Select v-model="textTransform">
                  <SelectTrigger
                    class="transition-all"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
                    ]"
                  >
                    <SelectValue placeholder="Select text transform" />
                  </SelectTrigger>
                  <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                    <SelectItem
                      value="none"
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    >
                      None
                    </SelectItem>
                    <SelectItem
                      value="uppercase"
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      style="text-transform: uppercase"
                    >
                      UPPERCASE
                    </SelectItem>
                    <SelectItem
                      value="lowercase"
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      style="text-transform: lowercase"
                    >
                      lowercase
                    </SelectItem>
                    <SelectItem
                      value="capitalize"
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      style="text-transform: capitalize"
                    >
                      Capitalize
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Transition>

          <!-- Size & Position Section -->
          <div class="space-y-4 pt-2 border-t" :class="theme.borderSecondary">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-semibold" :class="theme.textPrimary">Size & Position</h3>
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="[theme.bgCard, theme.textSecondary]"
              >
                Required
              </span>
            </div>

            <!-- Scale -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h4 class="text-xs font-medium" :class="theme.textSecondary">Scale</h4>
                  <span class="text-xs" :class="theme.textSecondary" title="Watermark size"
                    >🔍</span
                  >
                </div>
                <span
                  class="text-sm font-bold px-2 py-1 rounded-md"
                  :class="[theme.bgCard, theme.textPrimary]"
                >
                  {{ scale[0] }}%
                </span>
              </div>
              <div class="px-2">
                <Slider v-model="scale" :min="10" :max="100" :step="1" class="w-full" />
              </div>
            </div>

            <!-- Opacity -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h4 class="text-xs font-medium" :class="theme.textSecondary">Opacity</h4>
                  <span class="text-xs" :class="theme.textSecondary" title="Transparency level"
                    >👻</span
                  >
                </div>
                <span
                  class="text-sm font-bold px-2 py-1 rounded-md"
                  :class="[theme.bgCard, theme.textPrimary]"
                >
                  {{ opacity[0] }}%
                </span>
              </div>
              <div class="px-2">
                <Slider v-model="opacity" :min="0" :max="100" :step="1" class="w-full" />
              </div>
            </div>

            <!-- Position -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <h4 class="text-xs font-medium" :class="theme.textSecondary">Position</h4>
                <span class="text-xs" :class="theme.textSecondary" title="Watermark placement"
                  >📍</span
                >
              </div>
              <div class="grid grid-cols-3 gap-3 p-3 rounded-lg" :class="theme.bgCard">
                <button
                  v-for="(pos, index) in positionOptions"
                  :key="index"
                  @click="position = pos.value"
                  class="relative w-full aspect-square flex items-center justify-center rounded-md transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  :class="position === pos.value ? 'bg-teal-500/10' : ''"
                  :aria-label="`Set position to ${pos.label}`"
                  :title="pos.label"
                >
                  <div
                    class="rounded-full transition-all"
                    :class="
                      position === pos.value
                        ? 'w-4 h-4 bg-teal-500'
                        : 'w-2 h-2 bg-gray-400 dark:bg-gray-500'
                    "
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Border Section (for TEXT type) -->
          <Transition name="fade">
            <div
              v-if="watermarkType === 'text'"
              class="space-y-4 pt-2 border-t"
              :class="theme.borderSecondary"
            >
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-semibold" :class="theme.textPrimary">Border & Corners</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  :class="[theme.bgCard, theme.textSecondary]"
                >
                  Optional
                </span>
              </div>

              <!-- Border Radius -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 class="text-xs font-medium" :class="theme.textSecondary">Corner Radius</h4>
                    <span class="text-xs" :class="theme.textSecondary" title="Rounded corners"
                      >⭕</span
                    >
                  </div>
                  <span
                    class="text-sm font-bold px-2 py-1 rounded-md"
                    :class="[theme.bgCard, theme.textPrimary]"
                  >
                    {{ borderRadius[0] }}px
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="borderRadius" :min="0" :max="50" :step="1" class="w-full" />
                </div>
              </div>

              <!-- Border Width -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <h4 class="text-xs font-medium" :class="theme.textSecondary">Border Width</h4>
                    <span class="text-xs" :class="theme.textSecondary" title="Border thickness"
                      >▢</span
                    >
                  </div>
                  <span
                    class="text-sm font-bold px-2 py-1 rounded-md"
                    :class="[theme.bgCard, theme.textPrimary]"
                  >
                    {{ borderWidth[0] }}px
                  </span>
                </div>
                <div class="px-2">
                  <Slider v-model="borderWidth" :min="0" :max="10" :step="1" class="w-full" />
                </div>
                <p v-if="borderWidth[0] === 0" class="text-xs italic" :class="theme.textSecondary">
                  💡 Increase border width to enable border color and style options
                </p>
              </div>

              <!-- Border Color (only when width > 0) -->
              <Transition name="fade">
                <div v-if="borderWidth[0] > 0" class="space-y-3">
                  <h4 class="text-xs font-medium" :class="theme.textSecondary">Border Color</h4>
                  <div class="flex-1 min-w-0">
                    <ColorPicker v-model="borderColor" />
                  </div>
                </div>
              </Transition>

              <!-- Border Style (only when width > 0) -->
              <Transition name="fade">
                <div v-if="borderWidth[0] > 0" class="space-y-3">
                  <h4 class="text-xs font-medium" :class="theme.textSecondary">Border Style</h4>
                  <Select v-model="borderStyle">
                    <SelectTrigger
                      class="transition-all"
                      :class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        'focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
                      ]"
                    >
                      <SelectValue placeholder="Select border style" />
                    </SelectTrigger>
                    <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                      <SelectItem
                        value="solid"
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      >
                        <span class="flex items-center gap-2">
                          <span class="inline-block w-8 h-0.5 bg-current"></span>
                          Solid
                        </span>
                      </SelectItem>
                      <SelectItem
                        value="dashed"
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      >
                        <span class="flex items-center gap-2">
                          <span
                            class="inline-block w-8 h-0.5 bg-current"
                            style="border-top: 2px dashed currentColor"
                          ></span>
                          Dashed
                        </span>
                      </SelectItem>
                      <SelectItem
                        value="dotted"
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      >
                        <span class="flex items-center gap-2">
                          <span
                            class="inline-block w-8 h-0.5 bg-current"
                            style="border-top: 2px dotted currentColor"
                          ></span>
                          Dotted
                        </span>
                      </SelectItem>
                      <SelectItem
                        value="double"
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      >
                        <span class="flex items-center gap-2">
                          <span
                            class="inline-block w-8 h-0.5 bg-current"
                            style="border-top: 4px double currentColor"
                          ></span>
                          Double
                        </span>
                      </SelectItem>
                      <SelectItem
                        value="none"
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      >
                        None
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Transition>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Right Side: Preview -->
      <div
        class="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        :class="theme.bgPage"
      >
        <div class="w-full max-w-5xl space-y-6">
          <!-- Preview Mode Toggle -->
          <div class="flex items-center justify-center gap-3 mb-6">
            <button
              @click="previewMode = 'desktop'"
              class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              :class="
                previewMode === 'desktop'
                  ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600'
                  : [
                      theme.bgCard,
                      theme.borderSecondary,
                      'border-2',
                      theme.textSecondary,
                      'hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-teal-500/50',
                    ]
              "
            >
              <Monitor class="h-4 w-4" />
              Desktop
            </button>
            <button
              @click="previewMode = 'mobile'"
              class="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              :class="
                previewMode === 'mobile'
                  ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600'
                  : [
                      theme.bgCard,
                      theme.borderSecondary,
                      'border-2',
                      theme.textSecondary,
                      'hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-teal-500/50',
                    ]
              "
            >
              <Smartphone class="h-4 w-4" />
              Mobile
            </button>
          </div>

          <!-- Desktop Preview - MacBook Air Frame -->
          <div v-if="previewMode === 'desktop'" class="flex items-center justify-center">
            <div class="relative">
              <!-- MacBook Air Container -->
              <div class="relative" :class="theme.bgCard">
                <!-- Screen Section -->
                <div
                  class="relative rounded-t-[1.5rem] p-2 shadow-2xl"
                  :class="[theme.bgCard, 'border-2', theme.borderSecondary]"
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
                      style="width: 900px; height: 562px; aspect-ratio: 16/10"
                    >
                      <img
                        :src="previewImageUrl"
                        alt="Watermark preview"
                        class="w-full h-full object-cover"
                      />
                      <!-- Watermark Overlay - Text -->
                      <div
                        v-if="watermarkType === 'text' && watermarkText"
                        class="absolute pointer-events-none select-none transition-all duration-300"
                        :style="{
                          ...getPositionStyle(),
                          fontSize: `${Math.max(scale[0] * 0.12, 1)}rem`,
                          fontFamily: fontFamily,
                          ...getFontStyleProperties(fontStyle),
                          color: fontColor,
                          backgroundColor: backgroundColor || 'transparent',
                          lineHeight: lineHeight[0],
                          letterSpacing: `${letterSpacing[0]}px`,
                          padding: `${padding[0]}px`,
                          textTransform: textTransform,
                          borderRadius: `${borderRadius[0]}px`,
                          borderWidth: `${borderWidth[0]}px`,
                          borderColor: borderWidth[0] > 0 ? borderColor : 'transparent',
                          borderStyle: borderWidth[0] > 0 ? borderStyle : 'none',
                          opacity: opacity[0] / 100,
                          transform: 'translate(-50%, -50%)',
                          maxWidth: '90%',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                        }"
                      >
                        {{ watermarkText }}
                      </div>
                      <!-- Watermark Overlay - Image -->
                      <img
                        v-else-if="watermarkType === 'image' && watermarkImageUrl"
                        :src="watermarkImageUrl"
                        alt="Watermark"
                        class="absolute pointer-events-none select-none will-change-transform"
                        :style="{
                          ...getPositionStyle(),
                          width: `${scale[0]}%`,
                          height: 'auto',
                          maxWidth: '80%',
                          maxHeight: '80%',
                          opacity: opacity[0] / 100,
                          transform: 'translate(-50%, -50%)',
                          objectFit: 'contain',
                        }"
                      />
                    </div>
                  </div>
                </div>
                <!-- Hinge -->
                <div
                  class="h-2 rounded-full mx-auto"
                  style="width: 200px"
                  :class="theme.bgCard"
                ></div>
                <!-- Base/Keyboard Section -->
                <div
                  class="relative rounded-b-[1.5rem] p-3 shadow-xl"
                  :class="[theme.bgCard, 'border-2 border-t-0', theme.borderSecondary]"
                >
                  <!-- Trackpad area -->
                  <div
                    class="w-32 h-20 mx-auto rounded-lg"
                    :class="[theme.bgInput, theme.borderSecondary, 'border']"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Preview - iPhone 17 Frame -->
          <div v-else class="flex items-center justify-center">
            <div class="relative">
              <!-- iPhone 17 Container -->
              <div class="relative rounded-[3.5rem] p-3 shadow-2xl" :class="theme.bgCard">
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
                    style="width: 300px; height: 650px; aspect-ratio: 19.5/9"
                  >
                    <img
                      :src="previewImageUrl"
                      alt="Watermark preview"
                      class="w-full h-full object-cover"
                    />
                    <!-- Watermark Overlay - Text -->
                    <div
                      v-if="watermarkType === 'text' && watermarkText"
                      class="absolute pointer-events-none select-none transition-all duration-300"
                      :style="{
                        ...getPositionStyle(),
                        fontSize: `${Math.max(scale[0] * 0.08, 0.7)}rem`,
                        fontFamily: fontFamily,
                        ...getFontStyleProperties(fontStyle),
                        color: fontColor,
                        backgroundColor: backgroundColor || 'transparent',
                        lineHeight: lineHeight[0],
                        letterSpacing: `${letterSpacing[0]}px`,
                        padding: `${padding[0]}px`,
                        textTransform: textTransform,
                        borderRadius: `${borderRadius[0]}px`,
                        borderWidth: `${borderWidth[0]}px`,
                        borderColor: borderWidth[0] > 0 ? borderColor : 'transparent',
                        borderStyle: borderWidth[0] > 0 ? borderStyle : 'none',
                        opacity: opacity[0] / 100,
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '85%',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                      }"
                    >
                      {{ watermarkText }}
                    </div>
                    <!-- Watermark Overlay - Image -->
                    <img
                      v-else-if="watermarkType === 'image' && watermarkImageUrl"
                      :src="watermarkImageUrl"
                      alt="Watermark"
                      class="absolute pointer-events-none select-none will-change-transform"
                      :style="{
                        ...getPositionStyle(),
                        width: `${scale[0]}%`,
                        height: 'auto',
                        maxWidth: '70%',
                        maxHeight: '70%',
                        opacity: opacity[0] / 100,
                        transform: 'translate(-50%, -50%)',
                        objectFit: 'contain',
                      }"
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

          <!-- Preview Navigation -->
          <div class="flex items-center justify-center gap-2">
            <button
              @click="previewMode = 'desktop'"
              class="w-2.5 h-2.5 rounded-full border-2 transition-all hover:scale-125"
              :class="
                previewMode === 'desktop'
                  ? 'bg-teal-500 border-teal-500 shadow-md'
                  : [theme.borderSecondary, 'hover:border-teal-500']
              "
              aria-label="Desktop preview"
            ></button>
            <button
              @click="previewMode = 'mobile'"
              class="w-2.5 h-2.5 rounded-full border-2 transition-all hover:scale-125"
              :class="
                previewMode === 'mobile'
                  ? 'bg-teal-500 border-teal-500 shadow-md'
                  : [theme.borderSecondary, 'hover:border-teal-500']
              "
              aria-label="Mobile preview"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X, MoreVertical, Plus, Monitor, Smartphone } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import Input from '@/components/shadcn/input/Input.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Slider } from '@/components/shadcn/slider'
import ColorPicker from '@/components/shadcn/ColorPicker.vue'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import FontFamilySelect from '@/components/organisms/FontFamilySelect.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'
import { useWatermarkStore } from '@/stores/watermark'
// import { useThemeStore } from '@/stores/theme' // Unused for now
import type { CreateWatermarkData, UpdateWatermarkData } from '@/api/watermarks'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const watermarkStore = useWatermarkStore()
// const themeStore = useThemeStore() // Unused for now

// Check if editing existing watermark
const isEditing = computed(() => !!route.params.id)
const watermarkId = computed(() => (isEditing.value ? String(route.params.id) : null))

// Form state
const watermarkName = ref('New Watermark')
const watermarkType = ref<'text' | 'image'>('text')
const watermarkText = ref('')
const fontFamilyId = ref('pacifico')
const fontStyle = ref('normal')

// Map FontFamilySelect IDs to actual font family names
const fontFamilyMap: Record<string, string> = {
  sans: 'Arial, sans-serif',
  serif: 'Georgia, serif',
  modern: 'Courier New, monospace',
  playfair: 'Playfair Display, serif',
  montserrat: 'Montserrat, sans-serif',
  lato: 'Lato, sans-serif',
  raleway: 'Raleway, sans-serif',
  opensans: 'Open Sans, sans-serif',
  roboto: 'Roboto, sans-serif',
  poppins: 'Poppins, sans-serif',
  inter: 'Inter, sans-serif',
  nunito: 'Nunito, sans-serif',
  merriweather: 'Merriweather, serif',
  crimson: 'Crimson Text, serif',
  lora: 'Lora, serif',
  source: 'Source Sans Pro, sans-serif',
  ubuntu: 'Ubuntu, sans-serif',
  dancing: 'Dancing Script, cursive',
  pacifico: 'Pacifico, cursive',
  caveat: 'Caveat, cursive',
}

// Computed fontFamily for CSS (converts ID to actual font name)
const fontFamily = computed(() => {
  return fontFamilyMap[fontFamilyId.value] || fontFamilyMap.pacifico
})

// Helper to convert font name to ID (for loading existing watermarks)
const fontNameToId = (fontName: string): string => {
  const entry = Object.entries(fontFamilyMap).find(([_, name]) =>
    name.toLowerCase().includes(fontName.toLowerCase())
  )
  return entry?.[0] || 'pacifico'
}
const fontColor = ref('#FFFFFF')
const backgroundColor = ref<string | null>(null)
const lineHeight = ref([1.5])
const letterSpacing = ref([0])
const padding = ref([0])
const textTransform = ref<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none')
const borderRadius = ref([0])
const borderWidth = ref([0])
const borderColor = ref('#000000')
const borderStyle = ref<'solid' | 'dashed' | 'dotted' | 'none'>('none')
const watermarkImageUrl = ref<string | null>(null)
const scale = ref([70])
const opacity = ref([90])
const position = ref('center')
const isSaving = ref(false)
const isLoading = ref(false)
const previewMode = ref<'desktop' | 'mobile'>('desktop')

// Preview image
const previewImageUrl = ref(
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'
)

const fontStyleOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
  { value: 'underline', label: 'Underline' },
  { value: 'bold-italic', label: 'Bold Italic' },
  { value: 'bold-underline', label: 'Bold Underline' },
  { value: 'italic-underline', label: 'Italic Underline' },
  { value: 'bold-italic-underline', label: 'Bold Italic Underline' },
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

const getPositionStyle = () => {
  const positions: Record<string, { top: string; left: string }> = {
    'top-left': { top: '20%', left: '20%' },
    top: { top: '20%', left: '50%' },
    'top-right': { top: '20%', left: '80%' },
    left: { top: '50%', left: '20%' },
    center: { top: '50%', left: '50%' },
    right: { top: '50%', left: '80%' },
    'bottom-left': { top: '80%', left: '20%' },
    bottom: { top: '80%', left: '50%' },
    'bottom-right': { top: '80%', left: '80%' },
  }
  return positions[position.value] || positions.center
}

const getFontStyleProperties = (style: string) => {
  const styles = style.split('-')
  return {
    fontWeight: styles.includes('bold') ? 'bold' : 'normal',
    fontStyle: styles.includes('italic') ? 'italic' : 'normal',
    textDecoration: styles.includes('underline') ? 'underline' : 'none',
  }
}

// Unused functions (kept for future use)
// const getFontStylePreview = () => {
//   return getFontStyleProperties(fontStyle.value)
// }

const getStylePreview = (styleValue: string) => {
  return getFontStyleProperties(styleValue)
}

// const getFontStyleLabel = () => {
//   const option = fontStyleOptions.find(opt => opt.value === fontStyle.value)
//   return option?.label || 'Normal'
// }

const handleUploadImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        toast.error('File too large', {
          description: 'Please upload an image smaller than 10MB',
        })
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Please upload a valid image file',
        })
        return
      }

      const reader = new FileReader()
      reader.onload = event => {
        watermarkImageUrl.value = event.target?.result as string
        toast.success('Image uploaded successfully')
      }
      reader.onerror = () => {
        toast.error('Failed to read image', {
          description: 'Please try again with a different image',
        })
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const handleEscKey = (event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement
  target?.blur()
}

const handleNameBlur = () => {
  // Trim whitespace and ensure name is not empty
  if (!watermarkName.value.trim()) {
    watermarkName.value = route.params.id ? `My Watermark ${route.params.id}` : 'New Watermark'
  } else {
    watermarkName.value = watermarkName.value.trim()
  }
}

const validateWatermarkText = () => {
  // Trim whitespace
  watermarkText.value = watermarkText.value.trim()
}

const isFormValid = computed(() => {
  if (!watermarkName.value.trim()) return false
  if (watermarkType.value === 'text' && !watermarkText.value.trim()) return false
  if (watermarkType.value === 'image' && !watermarkImageUrl.value) return false
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
      lineHeight.value = [watermark.lineHeight || 1.5]
      letterSpacing.value = [watermark.letterSpacing || 0]
      padding.value = [watermark.padding || 0]
      textTransform.value = watermark.textTransform || 'none'
      borderRadius.value = [watermark.borderRadius || 0]
      borderWidth.value = [watermark.borderWidth || 0]
      borderColor.value = watermark.borderColor || '#000000'
      borderStyle.value = watermark.borderStyle || 'none'
      watermarkImageUrl.value = watermark.imageUrl || null
      scale.value = [watermark.scale]
      opacity.value = [watermark.opacity]
      position.value = watermark.position
    } catch (error: any) {
      console.error('Failed to load watermark:', error)
      toast.error('Failed to load watermark', {
        description: error.message || 'Watermark not found',
      })
      router.push({ name: 'watermarkSettings' })
    } finally {
      isLoading.value = false
    }
  }
})

const handleSave = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields', {
      description:
        watermarkType.value === 'text'
          ? 'Watermark text is required'
          : 'Please upload a watermark image',
    })
    return
  }

  handleNameBlur() // Ensure name is valid before saving
  isSaving.value = true

  try {
    const watermarkData: CreateWatermarkData | UpdateWatermarkData = {
      name: watermarkName.value.trim(),
      type: watermarkType.value,
      scale: scale.value[0],
      opacity: opacity.value[0],
      position: position.value,
    }

    if (watermarkType.value === 'text') {
      watermarkData.text = watermarkText.value.trim()
      watermarkData.fontFamily = fontFamily.value
      watermarkData.fontStyle = fontStyle.value
      watermarkData.fontColor = fontColor.value
      watermarkData.backgroundColor = backgroundColor.value || undefined
      watermarkData.lineHeight = lineHeight.value[0]
      watermarkData.letterSpacing = letterSpacing.value[0]
      watermarkData.padding = padding.value[0]
      watermarkData.textTransform = textTransform.value
      watermarkData.borderRadius = borderRadius.value[0]
      watermarkData.borderWidth = borderWidth.value[0]
      watermarkData.borderColor = borderWidth.value[0] > 0 ? borderColor.value : undefined
      watermarkData.borderStyle = borderWidth.value[0] > 0 ? borderStyle.value : undefined
    } else {
      watermarkData.imageUrl = watermarkImageUrl.value || undefined
    }

    if (isEditing.value && watermarkId.value) {
      // Update existing watermark
      await watermarkStore.updateWatermark(watermarkId.value, watermarkData)
      toast.success('Watermark updated successfully', {
        description: `${watermarkName.value} has been updated`,
      })
    } else {
      // Create new watermark
      await watermarkStore.createWatermark(watermarkData as CreateWatermarkData)
      toast.success('Watermark created successfully', {
        description: `${watermarkName.value} has been created`,
      })
    }

    router.push({ name: 'watermarkSettings' })
  } catch (error: any) {
    console.error('Save error:', error)
    toast.error('Failed to save watermark', {
      description: error.message || 'Please try again',
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
