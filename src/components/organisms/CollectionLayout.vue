<template>
  <div class="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Top Navbar -->
    <nav
      class="flex items-center justify-between px-6 py-3.5 border-b bg-white dark:bg-gray-900 shadow-sm"
      :class="theme.borderSecondary"
      style="min-height: 3.5rem"
    >
      <!-- Left Side: Back Button, Title/Status Section, Date/Preset/Watermark -->
      <div class="flex items-start gap-3 min-w-0">
        <!-- Section 1: Back Button -->
        <button
          @click="$emit('goBack')"
          class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 shadow-sm border hover:shadow-md hover:scale-105 active:scale-95"
          :class="[theme.borderSecondary, theme.bgCard]"
          title="Go back"
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
              <Transition name="fade" mode="out-in">
                <h1
                  v-if="!isEditingName"
                  key="title"
                  class="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100 cursor-text hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95"
                  @click="$emit('startEditingName')"
                  style="line-height: 1.5rem"
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
                    :model-value="editingName"
                    @input="$emit('update:editingName', ($event.target as any).value)"
                    @keydown.enter="$emit('saveName')"
                    @keydown.esc="$emit('cancelEditingName')"
                    @blur="$emit('handleNameBlur')"
                    class="text-lg font-bold leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 m-0 flex-1 min-w-0 transition-all duration-200"
                    :class="theme.textPrimary"
                    style="height: 1.5rem; line-height: 1.5rem"
                  />
                  <button
                    @mousedown.prevent
                    @click="$emit('saveName')"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                    :disabled="isSavingName"
                    style="height: 1.5rem; width: 1.5rem"
                  >
                    <Check v-if="!isSavingName" class="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <Loader2 v-else class="h-4 w-4 text-teal-600 dark:text-teal-400 animate-spin" />
                  </button>
                  <button
                    @mousedown.prevent
                    @click="$emit('cancelEditingName')"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                    :disabled="isSavingName"
                    style="height: 1.5rem; width: 1.5rem"
                  >
                    <X class="h-4 w-4" :class="theme.textSecondary" />
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Status Dropdown (next to title) -->
            <div class="flex-shrink-0">
              <Select
                :model-value="collectionStatus"
                @update:model-value="$emit('update:collectionStatus', $event)"
                :disabled="isSavingStatus"
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
                    value="draft"
                    label="DRAFT"
                    :class="[theme.textPrimary, theme.bgButtonHover]"
                    @click="$emit('handleStatusChange', 'draft')"
                  >
                    DRAFT
                  </SelectItem>
                  <SelectItem
                    value="published"
                    label="PUBLISHED"
                    :class="[theme.textPrimary, theme.bgButtonHover]"
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
                <Calendar
                  :model-value="eventDate"
                  @update:model-value="
                    isDatePickerOpen = false
                    $emit('handleDateChange', $event)
                  "
                />
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
                <div class="p-3 border-b" :class="theme.borderSecondary">
                  <h4 class="text-sm font-semibold" :class="theme.textPrimary">Select Preset</h4>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <button
                    @click="
                      isPresetPopoverOpen = false
                      $emit('handlePresetChange', 'none')
                    "
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    :class="[
                      selectedPresetId === 'none'
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : theme.textPrimary,
                    ]"
                  >
                    No preset
                  </button>
                  <button
                    v-for="preset in presets"
                    :key="preset.id"
                    @click="
                      isPresetPopoverOpen = false
                      $emit('handlePresetChange', preset.id)
                    "
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    :class="[
                      selectedPresetId === preset.id
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : theme.textPrimary,
                    ]"
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
                <div class="p-3 border-b" :class="theme.borderSecondary">
                  <h4 class="text-sm font-semibold" :class="theme.textPrimary">Select Watermark</h4>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <button
                    @click="
                      isWatermarkPopoverOpen = false
                      $emit('handleWatermarkChange', 'none')
                    "
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    :class="[
                      selectedWatermark === 'none'
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : theme.textPrimary,
                    ]"
                  >
                    No watermark
                  </button>
                  <button
                    v-for="watermark in watermarks"
                    :key="watermark.id"
                    @click="
                      isWatermarkPopoverOpen = false
                      $emit('handleWatermarkChange', watermark.id)
                    "
                    class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    :class="[
                      selectedWatermark === watermark.id
                        ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                        : theme.textPrimary,
                    ]"
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
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              :class="theme.textSecondary"
            >
              <span>More</span>
              <ChevronDown class="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary]">
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
          variant="ghost"
          class="px-4 py-2 text-sm font-medium"
          :class="[theme.textSecondary, theme.bgButtonHover]"
          @click="$emit('handlePreview')"
        >
          Preview
        </Button>

        <!-- Publish Button -->
        <Button
          v-if="collectionStatus !== 'published'"
          class="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
          @click="$emit('handlePublish')"
          :disabled="isSavingStatus"
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
          isSidebarCollapsed ? 'w-16 p-0' : 'w-80 p-6 overflow-y-auto',
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
          @click="$emit('update:isSidebarCollapsed', true)"
          class="absolute bottom-4 left-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 z-10 opacity-70 hover:opacity-100 shadow-sm border"
          :class="[theme.borderSecondary, theme.bgCard]"
          title="Collapse sidebar"
        >
          <ChevronsLeft class="h-4 w-4" :class="theme.textSecondary" />
        </button>

        <!-- Collection Cover Image (only when expanded) -->
        <div v-if="!isSidebarCollapsed" class="mb-8">
          <!-- Skeleton Loader -->
          <div
            v-if="isLoading"
            class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 animate-pulse"
            :class="theme.borderSecondary"
          >
            <div class="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <!-- Cover Image -->
          <div
            v-else-if="collection?.thumbnail || collection?.image"
            class="w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-xl border-2 group cursor-pointer relative"
            :class="theme.borderSecondary"
          >
            <img
              :src="collection?.thumbnail ?? collection?.image ?? placeholderImage"
              :alt="collection?.name ?? ''"
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
            class="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 flex items-center justify-center border-2 shadow-md border-dashed"
            :class="theme.borderSecondary"
          >
            <div class="text-center px-4">
              <div
                class="p-5 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mb-4 mx-auto w-fit shadow-sm"
              >
                <ImageIcon class="h-10 w-10 opacity-50" :class="theme.textTertiary" />
              </div>
              <p class="text-sm font-semibold mb-1" :class="theme.textPrimary">No cover image</p>
              <p class="text-xs" :class="theme.textTertiary">Upload a cover to make it stand out</p>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div v-if="!isSidebarCollapsed" class="mb-6 w-full">
          <TooltipProvider>
            <div
              class="grid grid-cols-4 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 border"
              :class="theme.borderSecondary"
            >
              <Tooltip>
                <TooltipTrigger as-child>
                  <button
                    @click="$emit('update:activeTab', 'photos')"
                    class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative transition-all duration-300 ease-out group"
                    :class="[
                      activeTab === 'photos'
                        ? 'bg-white dark:bg-gray-900 text-teal-600 dark:text-teal-400 shadow-sm scale-105'
                        : theme.textSecondary +
                          ' hover:bg-white/50 dark:hover:bg-gray-800/50 hover:scale-102',
                    ]"
                  >
                    <ImageIcon class="h-4 w-4 flex-shrink-0" />
                    <span class="text-xs font-medium leading-tight text-center">Photos</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Photos</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <button
                    @click="$emit('update:activeTab', 'design')"
                    class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative transition-all duration-300 ease-out group"
                    :class="[
                      activeTab === 'design'
                        ? 'bg-white dark:bg-gray-900 text-teal-600 dark:text-teal-400 shadow-sm scale-105'
                        : theme.textSecondary +
                          ' hover:bg-white/50 dark:hover:bg-gray-800/50 hover:scale-102',
                    ]"
                  >
                    <Paintbrush class="h-4 w-4 flex-shrink-0" />
                    <span class="text-xs font-medium leading-tight text-center">Design</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Design</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <button
                    @click="$emit('update:activeTab', 'settings')"
                    class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative transition-all duration-300 ease-out group"
                    :class="[
                      activeTab === 'settings'
                        ? 'bg-white dark:bg-gray-900 text-teal-600 dark:text-teal-400 shadow-sm scale-105'
                        : theme.textSecondary +
                          ' hover:bg-white/50 dark:hover:bg-gray-800/50 hover:scale-102',
                    ]"
                  >
                    <Settings class="h-4 w-4 flex-shrink-0" />
                    <span class="text-xs font-medium leading-tight text-center">Settings</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger as-child>
                  <button
                    @click="$emit('update:activeTab', 'activities')"
                    class="flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg relative transition-all duration-300 ease-out group"
                    :class="[
                      activeTab === 'activities'
                        ? 'bg-white dark:bg-gray-900 text-teal-600 dark:text-teal-400 shadow-sm scale-105'
                        : theme.textSecondary +
                          ' hover:bg-white/50 dark:hover:bg-gray-800/50 hover:scale-102',
                    ]"
                  >
                    <Radio class="h-4 w-4 flex-shrink-0" />
                    <span class="text-xs font-medium leading-tight text-center">Activities</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Activities</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <!-- Divider -->
        <div v-if="!isSidebarCollapsed && activeTab === 'photos'" class="mb-6">
          <div class="h-px w-full" :class="theme.borderSecondary"></div>
        </div>

        <!-- Collapsed Sidebar - Icon Only Navigation (show for all tabs) -->
        <div v-if="isSidebarCollapsed" class="flex flex-col items-center gap-3 pt-4 h-full pb-4">
          <!-- Cover Photo (Collapsed) -->
          <div
            class="w-12 h-12 rounded-lg overflow-hidden border-2 shadow-sm flex-shrink-0"
            :class="theme.borderSecondary"
          >
            <div
              v-if="isLoading"
              class="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"
            ></div>
            <img
              v-else-if="collection?.thumbnail || collection?.image"
              :src="collection?.thumbnail ?? collection?.image ?? placeholderImage"
              :alt="collection?.name ?? ''"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center"
            >
              <ImageIcon class="h-5 w-5 opacity-50" :class="theme.textTertiary" />
            </div>
          </div>

          <!-- Collection Title Popover (at top) -->
          <Popover>
            <PopoverTrigger as-child>
              <button
                class="w-12 h-12 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center border-2 border-dashed"
                :class="theme.borderSecondary"
                title="Collection name"
                :disabled="isLoading"
              >
                <Loader2
                  v-if="isLoading"
                  class="h-4 w-4 animate-spin"
                  :class="theme.textTertiary"
                />
                <span
                  v-else
                  class="text-xs font-bold truncate max-w-[2.5rem]"
                  :class="theme.textPrimary"
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
                <p class="text-sm font-semibold" :class="theme.textPrimary">
                  {{ collection?.name || 'Loading...' }}
                </p>
                <p v-if="collection?.description" class="text-xs mt-1" :class="theme.textTertiary">
                  {{ collection.description }}
                </p>
              </template>
            </PopoverContent>
          </Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click="$emit('update:activeTab', 'photos')"
                  class="p-3.5 rounded-lg transition-all duration-200 w-12 h-12 flex items-center justify-center relative group"
                  :class="[
                    activeTab === 'photos'
                      ? 'bg-teal-500 text-white shadow-md'
                      : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]"
                >
                  <ImageIcon class="h-5 w-5" />
                  <span
                    v-if="activeTab === 'photos'"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full"
                  ></span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" :class="[theme.bgCard, theme.borderCard]">
                <p class="text-sm font-semibold" :class="theme.textPrimary">Photos</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click="$emit('update:activeTab', 'design')"
                  class="p-3.5 rounded-lg transition-all duration-200 w-12 h-12 flex items-center justify-center relative group"
                  :class="[
                    activeTab === 'design'
                      ? 'bg-teal-500 text-white shadow-md'
                      : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]"
                >
                  <Paintbrush class="h-5 w-5" />
                  <span
                    v-if="activeTab === 'design'"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full"
                  ></span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" :class="[theme.bgCard, theme.borderCard]">
                <p class="text-sm font-semibold" :class="theme.textPrimary">Design</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click="$emit('update:activeTab', 'settings')"
                  class="p-3.5 rounded-lg transition-all duration-200 w-12 h-12 flex items-center justify-center relative group"
                  :class="[
                    activeTab === 'settings'
                      ? 'bg-teal-500 text-white shadow-md'
                      : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]"
                >
                  <Settings class="h-5 w-5" />
                  <span
                    v-if="activeTab === 'settings'"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full"
                  ></span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" :class="[theme.bgCard, theme.borderCard]">
                <p class="text-sm font-semibold" :class="theme.textPrimary">Settings</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  @click="$emit('update:activeTab', 'activities')"
                  class="p-3.5 rounded-lg transition-all duration-200 w-12 h-12 flex items-center justify-center relative group"
                  :class="[
                    activeTab === 'activities'
                      ? 'bg-teal-500 text-white shadow-md'
                      : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]"
                >
                  <Radio class="h-5 w-5" />
                  <span
                    v-if="activeTab === 'activities'"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full"
                  ></span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" :class="[theme.bgCard, theme.borderCard]">
                <p class="text-sm font-semibold" :class="theme.textPrimary">Activities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <!-- Spacer to push expand button to bottom -->
          <div class="flex-1"></div>

          <!-- Expand Button (at bottom) -->
          <button
            @click="$emit('update:isSidebarCollapsed', false)"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 opacity-70 hover:opacity-100 shadow-sm border mb-4"
            :class="[theme.borderSecondary, theme.bgCard]"
            title="Expand sidebar"
          >
            <ChevronsRight class="h-4 w-4" :class="theme.textSecondary" />
          </button>
        </div>

        <!-- Sidebar Content Slot (only show when expanded) -->
        <div v-if="!isSidebarCollapsed">
          <slot name="sidebar" />
        </div>
      </aside>

      <!-- Main Content Slot -->
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ChevronLeft,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Check,
  X,
  Pencil,
  Trash2,
  Settings,
  Copy,
  ImageIcon,
  Paintbrush,
  Radio,
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
  TooltipTrigger,
  TooltipProvider,
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

defineEmits<{
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
const nameInputRef = ref<HTMLInputElement | null>(null)
const isDatePickerOpen = ref(false)
const isPresetPopoverOpen = ref(false)
const isWatermarkPopoverOpen = ref(false)

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
</script>
