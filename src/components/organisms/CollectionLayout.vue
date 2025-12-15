<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Top Navbar -->
    <nav
      :class="theme.borderSecondary"
      class="flex items-center justify-between px-6 py-3.5 border-b bg-white dark:bg-gray-900 shadow-sm"
      style="min-height: 3.5rem"
    >
      <!-- Left Side: Back Button, Title/Status Section, Date/Preset/Watermark -->
      <div class="flex items-start gap-3 min-w-0">
        <!-- Section 1: Back Button -->
        <button
          :class="[theme.borderSecondary, theme.bgCard]"
          class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 shadow-sm border hover:shadow-md hover:scale-105 active:scale-95"
          title="Go back"
          @click="$emit('goBack')"
        >
          <ChevronLeft class="h-5 w-5 text-gray-700 dark:text-gray-300 font-semibold" />
        </button>

        <!-- Section 2: Title and Status, then Date/Preset/Watermark -->
        <div class="flex flex-col min-w-0">
          <!-- Title and Status Row -->
          <div
            v-if="!isLoading"
            class="flex items-center gap-3 mb-1 group"
            style="min-height: 1.5rem"
          >
            <div class="flex items-center gap-2 min-w-0">
              <Transition mode="out-in" name="fade">
                <h1
                  v-if="!isEditingName"
                  key="title"
                  class="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95"
                  style="line-height: 1.5rem"
                  @click="$emit('startEditingName')"
                >
                  {{ collection?.name || 'Loading...' }}
                </h1>
                <div
                  v-else
                  key="input"
                  class="flex items-center gap-2 min-w-0 animate-[fadeIn_0.2s_ease-in-out]"
                  style="min-height: 1.5rem; animation: fadeIn 0.2s ease-in-out"
                >
                  <input
                    ref="nameInputRef"
                    :class="theme.textPrimary"
                    :model-value="editingName"
                    class="text-lg font-bold leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 m-0 flex-1 min-w-0 transition-all duration-200"
                    style="height: 1.5rem; line-height: 1.5rem"
                    @blur="$emit('handleNameBlur')"
                    @input="$emit('update:editingName', ($event.target as any).value)"
                    @keydown.enter="$emit('saveName')"
                    @keydown.esc="$emit('cancelEditingName')"
                  />
                  <button
                    :disabled="isSavingName"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                    style="height: 1.5rem; width: 1.5rem"
                    @click="$emit('saveName')"
                    @mousedown.prevent
                  >
                    <Check v-if="!isSavingName" class="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <Loader2 v-else class="h-4 w-4 text-teal-600 dark:text-teal-400 animate-spin" />
                  </button>
                  <button
                    :disabled="isSavingName"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                    style="height: 1.5rem; width: 1.5rem"
                    @click="$emit('cancelEditingName')"
                    @mousedown.prevent
                  >
                    <X :class="theme.textSecondary" class="h-4 w-4" />
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Status Dropdown (next to title) -->
            <div class="flex-shrink-0">
              <Select
                :disabled="isSavingStatus"
                :model-value="collectionStatus"
                @update:model-value="$emit('update:collectionStatus', $event)"
              >
                <SelectTrigger
                  :class="[
                    'h-6 px-2.5 text-xs font-semibold rounded-full border-0',
                    'bg-gray-100 dark:bg-gray-800',
                    'text-gray-700 dark:text-gray-300 uppercase tracking-wide',
                    'hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
                    'w-auto min-w-[70px]',
                    isSavingStatus ? 'opacity-50 cursor-wait' : '',
                  ]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    :class="[theme.textPrimary, theme.bgButtonHover]"
                    label="DRAFT"
                    value="draft"
                    @click="$emit('handleStatusChange', 'draft')"
                  >
                    DRAFT
                  </SelectItem>
                  <SelectItem
                    :class="[theme.textPrimary, theme.bgButtonHover]"
                    label="PUBLISHED"
                    value="published"
                    @click="$emit('handleStatusChange', 'published')"
                  >
                    PUBLISHED
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div
            v-else
            class="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1"
          ></div>

          <!-- Date, Preset, and Watermark Row (under title/status) -->
          <div
            v-if="!isLoading"
            class="flex items-center gap-2.5 flex-wrap"
            style="min-height: 1.25rem"
          >
            <!-- Inline Date Picker -->
            <Popover v-model:open="isDatePickerOpen">
              <PopoverTrigger as-child>
                <button
                  class="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 ease-out flex items-center gap-1.5 group px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-95"
                  style="line-height: 1.25rem"
                >
                  <span class="opacity-70 transition-opacity duration-200">Date:</span>
                  <span class="font-medium transition-colors duration-200">{{
                    eventDate ? formatDate(eventDate) : 'Add event date'
                  }}</span>
                  <ChevronDown
                    class="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent :class="[theme.bgCard, theme.borderCard, 'w-auto p-0']" align="start">
                <Calendar :model-value="eventDate" @update:model-value="handleDatePickerChange" />
              </PopoverContent>
            </Popover>

            <!-- Separator -->
            <div
              class="h-3 w-px bg-gray-300 dark:bg-gray-600 transition-opacity duration-200"
            ></div>

            <!-- Preset Dropdown -->
            <Popover v-model:open="isPresetPopoverOpen">
              <PopoverTrigger as-child>
                <button
                  class="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 ease-out flex items-center gap-1.5 group px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-95"
                  style="line-height: 1.25rem"
                >
                  <span class="opacity-70 transition-opacity duration-200">Preset:</span>
                  <span class="font-medium transition-colors duration-200">{{
                    selectedPresetName || 'No preset'
                  }}</span>
                  <ChevronDown
                    class="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent :class="[theme.bgCard, theme.borderCard, 'w-64 p-0']" align="start">
                <div :class="theme.borderSecondary" class="p-3 border-b">
                  <h4 :class="theme.textPrimary" class="text-sm font-semibold">Select Preset</h4>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <button
                    :class="[
                      selectedPresetId === 'none'
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : theme.textPrimary,
                    ]"
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    @click="handlePresetSelect('none')"
                  >
                    No preset
                  </button>
                  <button
                    v-for="preset in presets"
                    :key="preset.id"
                    :class="[
                      selectedPresetId === preset.id
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : theme.textPrimary,
                    ]"
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    @click="handlePresetSelect(preset.id)"
                  >
                    {{ preset.name }}
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <!-- Separator -->
            <div
              class="h-3 w-px bg-gray-300 dark:bg-gray-600 transition-opacity duration-200"
            ></div>

            <!-- Watermark Dropdown -->
            <Popover v-model:open="isWatermarkPopoverOpen">
              <PopoverTrigger as-child>
                <button
                  class="text-xs text-left text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 ease-out flex items-center gap-1.5 group px-2 py-0.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] active:scale-95"
                  style="line-height: 1.25rem"
                >
                  <span class="opacity-70 transition-opacity duration-200">Watermark:</span>
                  <span class="font-medium transition-colors duration-200">{{
                    selectedWatermarkName || 'No watermark'
                  }}</span>
                  <ChevronDown
                    class="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent :class="[theme.bgCard, theme.borderCard, 'w-64 p-0']" align="start">
                <div :class="theme.borderSecondary" class="p-3 border-b">
                  <h4 :class="theme.textPrimary" class="text-sm font-semibold">Select Watermark</h4>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <button
                    :class="[
                      selectedWatermark === 'none'
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : theme.textPrimary,
                    ]"
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    @click="handleWatermarkSelect('none')"
                  >
                    No watermark
                  </button>
                  <button
                    v-for="watermark in watermarks"
                    :key="watermark.id"
                    :class="[
                      selectedWatermark === watermark.id
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : theme.textPrimary,
                    ]"
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    @click="handleWatermarkSelect(watermark.id)"
                  >
                    {{ watermark.name }}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div
            v-else
            class="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
            style="min-height: 1.25rem"
          ></div>
        </div>
      </div>

      <!-- Right Side: Theme, More, Preview, Publish -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- More Dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button
              :class="theme.textSecondary"
              class="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <span>More</span>
              <ChevronDown class="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :class="[theme.bgDropdown, theme.borderSecondary]" align="end">
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Pencil class="h-4 w-4 mr-2" />
              Edit Collection
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Copy class="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']">
              <Settings class="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="[
                'text-red-600 dark:text-red-400',
                'hover:bg-red-50 dark:hover:bg-red-900/20',
                'cursor-pointer',
              ]"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Preview Button -->
        <Button
          :class="[theme.textSecondary, theme.bgButtonHover]"
          class="px-4 py-2 text-sm font-medium"
          variant="ghost"
          @click="$emit('handlePreview')"
        >
          Preview
        </Button>

        <!-- Publish Button -->
        <Button
          v-if="collectionStatus !== 'published'"
          :disabled="isSavingStatus"
          class="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
          @click="$emit('handlePublish')"
        >
          <Loader2 v-if="isSavingStatus" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="isSavingStatus">Publishing...</span>
          <span v-else>Publish</span>
        </Button>
        <div
          v-else
          class="px-4 py-2 text-sm font-medium rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
        >
          Published
        </div>
      </div>
    </nav>

    <!-- Main Content Area (Sidebar + Content) -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <aside
        :class="[
          'relative border-r transition-all duration-300 overflow-hidden',
          'bg-white dark:bg-gray-900',
          theme.borderSecondary,
          isSidebarCollapsed ? 'w-16 p-0' : 'w-80 p-3 overflow-y-auto',
        ]"
        :style="
          isSidebarCollapsed
            ? 'scrollbar-width: none;'
            : 'scrollbar-width: thin; scrollbar-color: rgba(156, 163, 175, 0.5) transparent;'
        "
      >
        <!-- Collapse Button (Bottom Left) - When Expanded -->
        <button
          v-if="!isSidebarCollapsed"
          :class="[theme.borderSecondary, theme.bgCard]"
          class="absolute bottom-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 z-10 opacity-70 hover:opacity-100 shadow-sm border"
          title="Collapse sidebar"
          @click="$emit('update:isSidebarCollapsed', true)"
        >
          <ChevronsLeft :class="theme.textSecondary" class="h-4 w-4" />
        </button>

        <!-- Collection Cover Image (only when expanded) -->
        <div v-if="!isSidebarCollapsed" class="mb-8">
          <!-- Skeleton Loader -->
          <div
            v-if="isLoading"
            :class="theme.borderSecondary"
            class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 animate-pulse"
          >
            <div class="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <!-- Cover Image -->
          <div
            v-else-if="collection?.thumbnail || collection?.image"
            :class="theme.borderSecondary"
            class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 group cursor-pointer relative"
          >
            <img
              :alt="collection?.name ?? ''"
              :src="collection?.thumbnail ?? collection?.image ?? placeholderImage"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              @error="handleImageError"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div
              class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <p class="text-white text-xs font-medium">Click to change cover</p>
            </div>
          </div>
          <!-- No Cover Image Placeholder -->
          <div
            v-else
            :class="theme.borderSecondary"
            class="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 flex items-center justify-center border-2 shadow-md border-dashed"
          >
            <div class="text-center px-4">
              <div
                class="p-5 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mb-4 mx-auto w-fit shadow-sm"
              >
                <ImageIcon :class="theme.textTertiary" class="h-10 w-10 opacity-50" />
              </div>
              <p :class="theme.textPrimary" class="text-sm font-semibold mb-1">No cover image</p>
              <p :class="theme.textTertiary" class="text-xs">Upload a cover to make it stand out</p>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div v-if="!isSidebarCollapsed" class="mb-6 w-full">
          <div
            v-if="isLoading"
            class="grid grid-cols-4 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 border"
          >
            <div
              v-for="i in 4"
              :key="`skeleton-${i}`"
              class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative"
            >
              <div class="h-5 w-5 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-3 w-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <TooltipProvider v-else>
            <div
              :class="theme.borderSecondary"
              class="grid grid-cols-4 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 border"
            >
              <template v-for="tab in tabs">
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button
                      :class="[
                        activeTab === tab?.name
                          ? 'bg-white dark:bg-gray-900 text-teal-600 dark:text-teal-400 shadow-sm scale-105'
                          : theme.textSecondary +
                            ' hover:bg-white/50 dark:hover:bg-gray-800/50 hover:scale-102',
                      ]"
                      class="flex flex-col items-center gap-1 p-3 rounded-lg relative transition-all duration-300 ease-out group"
                      @click="handleTabClick(tab)"
                    >
                      <ImageIcon class="h-5 w-5" />
                      <span class="text-xs font-medium leading-tight text-center">{{
                        tab?.title
                      }}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ tab?.title }}</p>
                  </TooltipContent>
                </Tooltip>
              </template>
            </div>
          </TooltipProvider>
        </div>

        <!-- Divider -->
        <div v-if="!isSidebarCollapsed && activeTab === 'photos'" class="mb-6">
          <div :class="theme.borderSecondary" class="h-px w-full"></div>
        </div>

        <!-- Collapsed Sidebar - Icon Only Navigation (show for all tabs) -->
        <div v-if="isSidebarCollapsed" class="flex flex-col items-center gap-3 pt-4 h-full pb-4">
          <!-- Cover Photo (Collapsed) -->
          <div
            :class="theme.borderSecondary"
            class="w-12 h-12 rounded-lg overflow-hidden border-2 shadow-sm flex-shrink-0"
          >
            <div
              v-if="isLoading"
              class="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"
            ></div>
            <img
              v-else-if="collection?.thumbnail || collection?.image"
              :alt="collection?.name ?? ''"
              :src="collection?.thumbnail ?? collection?.image ?? placeholderImage"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center"
            >
              <ImageIcon :class="theme.textTertiary" class="h-5 w-5 opacity-50" />
            </div>
          </div>

          <!-- Collection Title Popover (at top) -->
          <Popover>
            <PopoverTrigger as-child>
              <button
                :class="theme.borderSecondary"
                :disabled="isLoading"
                class="w-12 h-12 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center border-2 border-dashed"
                title="Collection name"
              >
                <Loader2
                  v-if="isLoading"
                  :class="theme.textTertiary"
                  class="h-4 w-4 animate-spin"
                />
                <span
                  v-else
                  :class="theme.textPrimary"
                  class="text-xs font-bold truncate max-w-[2.5rem]"
                >
                  {{ collection?.name?.charAt(0)?.toUpperCase() || 'C' }}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              :class="[theme.bgCard, theme.borderCard, 'p-3 max-w-xs']"
              align="start"
              side="right"
            >
              <div v-if="isLoading" class="space-y-2">
                <div class="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div class="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
              <template v-else>
                <p :class="theme.textPrimary" class="text-sm font-semibold">
                  {{ collection?.name || 'Loading...' }}
                </p>
                <p v-if="collection?.description" :class="theme.textTertiary" class="text-xs mt-1">
                  {{ collection.description }}
                </p>
              </template>
            </PopoverContent>
          </Popover>
          <div v-if="isLoading" class="rounded-lg bg-gray-100 dark:bg-gray-800/50 border">
            <div
              v-for="i in 4"
              :key="`skeleton-${i}`"
              class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative"
            >
              <div class="h-5 w-5 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-3 w-9 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <TooltipProvider v-else>
            <template v-for="tab in tabs">
              <Tooltip>
                <TooltipTrigger as-child>
                  <button
                    :class="[
                      activeTab === tab?.name
                        ? 'bg-teal-500 text-white shadow-md'
                        : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                    ]"
                    class="p-3.5 rounded-lg transition-all duration-200 w-12 h-12 flex items-center justify-center relative group"
                    @click="handleTabClick(tab)"
                  >
                    <component :is="tab?.icon" class="h-5 w-5" />
                    <span
                      v-if="activeTab === tab?.name"
                      class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full"
                    ></span>
                  </button>
                </TooltipTrigger>
                <TooltipContent :class="[theme.bgCard, theme.borderCard]" side="right">
                  <p :class="theme.textPrimary" class="text-sm font-semibold">{{ tab?.title }}</p>
                </TooltipContent>
              </Tooltip>
            </template>
          </TooltipProvider>

          <!-- Spacer to push expand button to bottom -->
          <div class="flex-1"></div>

          <!-- Expand Button (at bottom) -->
          <button
            :class="[theme.borderSecondary, theme.bgCard]"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 opacity-70 hover:opacity-100 shadow-sm border mb-4"
            title="Expand sidebar"
            @click="$emit('update:isSidebarCollapsed', false)"
          >
            <ChevronsRight :class="theme.textSecondary" class="h-4 w-4" />
          </button>
        </div>

        <!-- Sidebar Content Slot (only show when expanded) -->
        <div v-if="!isSidebarCollapsed">
          <slot name="sidebar" />
        </div>
      </aside>

      <!-- Main Content Slot -->
      <main class="flex-1 min-w-0 overflow-hidden">
        <slot name="content" />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  ImageIcon,
  Loader2,
  Paintbrush,
  Pencil,
  Radio,
  Settings,
  Trash2,
  X,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { Calendar } from '@/components/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import type { Collection } from '@/api/collections'

const props = defineProps<{
  collection: Collection | null
  isLoading: boolean
  isEditingName: boolean
  editingName: string
  isSavingName: boolean
  collectionStatus: string
  isSavingStatus: boolean
  eventDate: Date | null
  selectedPresetId: string
  selectedPresetName: string | null
  selectedWatermark: string
  selectedWatermarkName: string | null
  presets: Array<{ id: string; name: string }>
  watermarks: Array<{ id: string; name: string }>
  activeTab: 'photos' | 'design' | 'settings' | 'activities'
  isSidebarCollapsed: boolean
}>()

const emit = defineEmits<{
  goBack: []
  startEditingName: []
  'update:editingName': [value: string]
  saveName: []
  cancelEditingName: []
  handleNameBlur: []
  'update:collectionStatus': [value: string]
  handleStatusChange: [value: 'draft' | 'published']
  handleDateChange: [date: Date | null]
  handlePresetChange: [presetId: string]
  handleWatermarkChange: [watermarkId: string]
  handlePreview: []
  handlePublish: []
  'update:activeTab': [tab: 'photos' | 'design' | 'settings' | 'activities']
  'update:isSidebarCollapsed': [value: boolean]
}>()

const theme = useThemeClasses()
const router = useRouter()
const nameInputRef = ref<HTMLInputElement | null>(null)
const isDatePickerOpen = ref(false)
const isPresetPopoverOpen = ref(false)
const isWatermarkPopoverOpen = ref(false)

const handleTabClick = (tab: object) => {
  if (props.collection?.id) {
    router.push(tab?.route)
  }
  emit('update:activeTab', tab?.name)
}

const handleDesignTabClick = () => {
  if (props.collection?.id) {
    router.push({
      name: 'collectionCover',
      params: { uuid: props.collection.id },
    })
  }
  emit('update:activeTab', 'design')
}

const handlePhotoTabClick = () => {
  if (props.collection?.id) {
    router.push({
      name: 'collectionPhotos',
      params: { uuid: props.collection.id },
    })
  }
  emit('update:activeTab', 'photos')
}

const handleSettingTabClick = () => {
  if (props.collection?.id) {
    router.push({
      name: 'collectionSettingsGeneral',
      params: { uuid: props.collection.id },
    })
  }
  emit('update:activeTab', 'settings')
}

const handleDatePickerChange = (date: Date | null) => {
  isDatePickerOpen.value = false
  emit('handleDateChange', date)
}

const handlePresetSelect = (presetId: string) => {
  isPresetPopoverOpen.value = false
  emit('handlePresetChange', presetId)
}

const tabs = ref<Array<any>>([])

const handleWatermarkSelect = (watermarkId: string) => {
  isWatermarkPopoverOpen.value = false
  emit('handleWatermarkChange', watermarkId)
}

// Fallback placeholder image (SVG data URL)
const placeholderImage =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='

// Handle image load errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.src !== placeholderImage) {
    img.src = placeholderImage
  }
}

// Format date helper
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

watch(
  () => props.collection,
  col => {
    if (!col) return

    tabs.value = [
      {
        title: 'Photos',
        name: 'photos',
        icon: ImageIcon,
        route: {
          name: 'collectionPhotos',
          params: { uuid: col.id },
        },
      },
      {
        title: 'Design',
        name: 'design',
        icon: Paintbrush,
        route: {
          name: 'collectionCover',
          params: { uuid: col.id },
        },
      },
      {
        title: 'Settings',
        name: 'settings',
        icon: Settings,
        route: {
          name: 'collectionSettingsGeneral',
          params: { uuid: col.id },
        },
      },
      {
        title: 'Activities',
        name: 'activities',
        icon: Radio,
        route: {
          name: 'collectionActivitiesDownload',
          params: { uuid: col.id },
        },
      },
    ]
  },
  { immediate: true }
)
</script>
