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
          @click="goBack"
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
                  @click="startEditingName"
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
                    v-model="editingName"
                    @keydown.enter="saveName"
                    @keydown.esc="cancelEditingName"
                    @blur="handleNameBlur"
                    class="text-lg font-bold leading-tight bg-transparent border-none outline-none focus:ring-0 p-0 m-0 flex-1 min-w-0 transition-all duration-200"
                    :class="theme.textPrimary"
                    style="height: 1.5rem; line-height: 1.5rem"
                  />
                  <button
                    @mousedown.prevent
                    @click="saveName"
                    class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                    :disabled="isSavingName"
                    style="height: 1.5rem; width: 1.5rem"
                  >
                    <Check v-if="!isSavingName" class="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    <Loader2 v-else class="h-4 w-4 text-teal-600 dark:text-teal-400 animate-spin" />
                  </button>
                  <button
                    @mousedown.prevent
                    @click="cancelEditingName"
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
              <Select v-model="collectionStatus" :disabled="isSavingStatus">
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
                    @click="handleStatusChange('draft')"
                  >
                    DRAFT
                  </SelectItem>
                  <SelectItem
                    value="published"
                    label="PUBLISHED"
                    :class="[theme.textPrimary, theme.bgButtonHover]"
                    @click="handleStatusChange('published')"
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
                <Calendar v-model="eventDate" @update:model-value="handleDateChange" />
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
                    @click="handlePresetChange('none')"
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
                    @click="handlePresetChange(preset.id)"
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
                    @click="handleWatermarkChange('none')"
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
                    @click="handleWatermarkChange(watermark.id)"
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
          @click="handlePreview"
        >
          Preview
        </Button>

        <!-- Publish Button -->
        <Button
          v-if="collectionStatus !== 'published'"
          class="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
          @click="handlePublish"
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
        <!-- Collapse Button (Bottom Left) -->
        <button
          v-if="!isSidebarCollapsed"
          @click="isSidebarCollapsed = true"
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
                    @click="activeTab = 'photos'"
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
                    @click="activeTab = 'design'"
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
                    @click="activeTab = 'settings'"
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
                    @click="activeTab = 'activities'"
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

        <!-- Collapsed Sidebar - Icon Only Navigation (only show for photos tab) -->
        <div
          v-else-if="activeTab === 'photos'"
          class="flex flex-col items-center gap-3 pt-4 h-full"
        >
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
                  @click="activeTab = 'photos'"
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
                  @click="activeTab = 'design'"
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
                  @click="activeTab = 'settings'"
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
                  @click="activeTab = 'activities'"
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
            @click="isSidebarCollapsed = false"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 opacity-70 hover:opacity-100 shadow-sm border mb-4"
            :class="[theme.borderSecondary, theme.bgCard]"
            title="Expand sidebar"
          >
            <ChevronsRight class="h-4 w-4" :class="theme.textSecondary" />
          </button>
        </div>

        <!-- PHOTOS Section -->
        <div v-if="activeTab === 'photos' && !isSidebarCollapsed">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-sm font-bold" :class="theme.textPrimary">Media Sets</h2>
            <button
              @click="handleAddSet"
              :disabled="isSavingSets"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm border disabled:opacity-50 disabled:cursor-not-allowed"
              :class="[
                'bg-teal-500 hover:bg-teal-600 text-white border-teal-600',
                'hover:shadow-md hover:scale-105 active:scale-95',
              ]"
            >
              <Loader2 v-if="isSavingSets" class="h-3.5 w-3.5 animate-spin" />
              <Plus v-else class="h-3.5 w-3.5" />
              <span v-if="isSavingSets">Saving...</span>
              <span v-else>Add Set</span>
            </button>
          </div>

          <!-- Skeleton Loader for Sets -->
          <div
            v-if="isLoading"
            class="space-y-2.5 max-h-[calc(5*3.5rem+4*0.625rem)] overflow-y-auto pr-1"
          >
            <div
              v-for="i in 3"
              :key="`skeleton-${i}`"
              class="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800/50 border-2 border-transparent animate-pulse"
            >
              <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>

          <!-- Media Sets List -->
          <div
            v-else-if="mediaSets.length > 0"
            class="space-y-2.5 max-h-[calc(5*3.5rem+4*0.625rem)] overflow-y-auto pr-1 custom-scrollbar relative"
          >
            <!-- Loading overlay -->
            <Transition name="fade">
              <div
                v-if="isSavingSets"
                class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
              >
                <div class="flex flex-col items-center gap-2">
                  <Loader2 class="h-5 w-5 animate-spin text-teal-500" />
                  <span class="text-xs font-medium text-gray-600 dark:text-gray-400"
                    >Saving...</span
                  >
                </div>
              </div>
            </Transition>
            <TransitionGroup name="set-list" tag="div" class="space-y-2.5">
              <div
                v-for="(set, index) in sortedMediaSets"
                :key="set.id"
                :draggable="!isSavingSets"
                class="flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 ease-out cursor-move group relative overflow-hidden"
                :class="[
                  selectedSetId === set.id
                    ? 'bg-white dark:bg-gray-800/50 border-2 border-teal-200 dark:border-teal-800 shadow-sm scale-[1.01]'
                    : 'bg-white dark:bg-gray-800/50 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm hover:scale-[1.005]',
                  draggedSetId === set.id ? 'opacity-50 scale-95' : '',
                  dragOverIndex === index ? 'ring-2 ring-teal-500 ring-offset-2 scale-[1.02]' : '',
                  isSavingSets ? 'opacity-60 pointer-events-none' : '',
                ]"
                @click="selectedSetId = set.id"
                @dragstart="handleSetDragStart($event, set.id, index)"
                @dragend="handleSetDragEnd"
                @dragover.prevent="handleSetDragOver($event, index)"
                @dragleave="handleSetDragLeave"
                @drop="handleSetDrop($event, index)"
              >
                <!-- Active indicator bar -->
                <Transition name="indicator">
                  <div
                    v-if="selectedSetId === set.id"
                    class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 dark:bg-teal-400 rounded-r-full transition-all duration-300"
                  ></div>
                </Transition>

                <GripVertical
                  class="h-4 w-4 flex-shrink-0 opacity-50 transition-all duration-200 ml-1 hover:opacity-70 hover:scale-110"
                  :class="[
                    selectedSetId === set.id
                      ? 'text-teal-600 dark:text-teal-400'
                      : theme.textTertiary,
                    isSavingSets ? 'opacity-30 cursor-not-allowed' : '',
                  ]"
                />
                <span
                  v-if="!editingSetId || editingSetId !== set.id"
                  class="flex-1 text-xs font-bold tracking-wide truncate"
                  :class="[
                    selectedSetId === set.id
                      ? 'text-teal-700 dark:text-teal-300'
                      : theme.textPrimary,
                  ]"
                >
                  {{ set.name }}
                </span>
                <input
                  v-else
                  ref="setNameInputRef"
                  v-model="editingSetName"
                  @keydown.enter="saveSetName(set.id)"
                  @keydown.esc="cancelSetNameEdit"
                  @blur="saveSetName(set.id)"
                  class="flex-1 text-xs font-bold px-3 py-1.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
                  :class="[
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'focus:border-teal-500',
                  ]"
                  @click.stop
                />
                <span
                  class="text-xs px-3 py-1.5 rounded-full font-bold min-w-[2.5rem] text-center transition-all duration-300 ease-out"
                  :class="[
                    selectedSetId === set.id
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400',
                  ]"
                >
                  {{ set.count }}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button
                      :disabled="isSavingSets"
                      class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="[
                        selectedSetId === set.id
                          ? 'hover:bg-teal-100 dark:hover:bg-teal-900/30'
                          : '',
                        theme.textSecondary,
                      ]"
                      @click.stop
                    >
                      <MoreVertical class="h-4 w-4 transition-transform duration-200" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    :class="[theme.bgDropdown, theme.borderSecondary]"
                  >
                    <DropdownMenuItem
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      :disabled="isSavingSets"
                      @click.stop="handleEditSet(set.id)"
                    >
                      <Pencil class="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      :class="[
                        'text-red-600 dark:text-red-400',
                        'hover:bg-red-50 dark:hover:bg-red-900/20',
                        'cursor-pointer',
                      ]"
                      :disabled="isSavingSets"
                      @click.stop="handleDeleteSet(set.id)"
                    >
                      <Trash2 class="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TransitionGroup>
          </div>
          <div v-else class="text-center py-10">
            <div
              class="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 w-fit mx-auto mb-4 shadow-sm"
            >
              <ImageIcon class="h-8 w-8 opacity-40" :class="theme.textTertiary" />
            </div>
            <p class="text-sm font-semibold mb-1.5" :class="theme.textPrimary">No sets yet</p>
            <p class="text-xs" :class="theme.textTertiary">
              Create your first media set to get started
            </p>
          </div>
        </div>

        <!-- DESIGN Section -->
        <div v-if="activeTab === 'design' && !isSidebarCollapsed">
          <div class="space-y-4">
            <div
              class="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-900/10 border-2 border-teal-200 dark:border-teal-800"
            >
              <h3 class="text-sm font-bold mb-2" :class="theme.textPrimary">Design Settings</h3>
              <p class="text-xs mb-4" :class="theme.textSecondary">
                Customize the appearance and layout of your collection
              </p>
              <Button
                variant="outline"
                class="w-full"
                :class="[theme.borderSecondary, theme.bgButtonHover]"
                @click="router.push({ name: 'presetDesign', params: { name: 'default' } })"
              >
                <Paintbrush class="h-4 w-4 mr-2" />
                Open Design Editor
              </Button>
            </div>
            <div class="text-center py-8">
              <Paintbrush class="h-12 w-12 mx-auto mb-3 opacity-30" :class="theme.textTertiary" />
              <p class="text-sm font-medium mb-1" :class="theme.textPrimary">
                Design customization
              </p>
              <p class="text-xs" :class="theme.textTertiary">
                Configure cover styles, fonts, and layouts
              </p>
            </div>
          </div>
        </div>

        <!-- SETTINGS Section -->
        <div v-if="activeTab === 'settings' && !isSidebarCollapsed">
          <div class="space-y-5">
            <!-- Preset Selection -->
            <div class="space-y-2">
              <label class="block text-sm font-bold mb-2.5" :class="theme.textPrimary">
                Collection Preset
              </label>
              <Select v-model="selectedPresetId" @update:model-value="handlePresetChange">
                <SelectTrigger
                  :class="[
                    'w-full h-11 rounded-xl shadow-sm border-2 transition-all duration-200',
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'hover:border-teal-400 dark:hover:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
                  ]"
                >
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    value="none"
                    label="No preset"
                    :class="[theme.textPrimary, theme.bgButtonHover]"
                  >
                    No preset
                  </SelectItem>
                  <SelectItem
                    v-for="preset in presets"
                    :key="preset.id"
                    :value="preset.id"
                    :label="preset.name"
                    :class="[theme.textPrimary, theme.bgButtonHover]"
                  >
                    {{ preset.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs mt-2 leading-relaxed" :class="theme.textTertiary">
                Apply a preset to automatically configure collection settings
              </p>
            </div>

            <!-- Watermark Selection -->
            <div class="space-y-2">
              <label class="block text-sm font-bold mb-2.5" :class="theme.textPrimary">
                Watermark
              </label>
              <Select v-model="selectedWatermark" @update:model-value="handleWatermarkChange">
                <SelectTrigger
                  :class="[
                    'w-full h-11 rounded-xl shadow-sm border-2 transition-all duration-200',
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'hover:border-teal-400 dark:hover:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500',
                  ]"
                >
                  <SelectValue placeholder="Select watermark" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    value="none"
                    label="No watermark"
                    :class="[theme.textPrimary, theme.bgButtonHover]"
                  >
                    No watermark
                  </SelectItem>
                  <SelectItem
                    v-for="watermark in watermarks"
                    :key="watermark.id"
                    :value="watermark.id"
                    :label="watermark.name"
                    :class="[theme.textPrimary, theme.bgButtonHover]"
                  >
                    {{ watermark.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs mt-2 leading-relaxed" :class="theme.textTertiary">
                Add a watermark to protect your images
              </p>
            </div>
          </div>
        </div>

        <!-- ACTIVITIES Section -->
        <div v-if="activeTab === 'activities' && !isSidebarCollapsed">
          <div class="space-y-4">
            <div
              class="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border-2 border-purple-200 dark:border-purple-800"
            >
              <h3 class="text-sm font-bold mb-2" :class="theme.textPrimary">
                Collection Activities
              </h3>
              <p class="text-xs mb-4" :class="theme.textSecondary">
                View and manage activities related to this collection
              </p>
            </div>
            <div class="text-center py-8">
              <Radio class="h-12 w-12 mx-auto mb-3 opacity-30" :class="theme.textTertiary" />
              <p class="text-sm font-medium mb-1" :class="theme.textPrimary">No activities yet</p>
              <p class="text-xs" :class="theme.textTertiary">Activities will appear here</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Hidden File Input -->
      <input
        ref="fileInputRef"
        type="file"
        multiple
        accept="image/*,video/*"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- Main Content Area -->
      <main
        class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300"
        :class="isSidebarCollapsed ? 'ml-0' : ''"
      >
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 class="h-8 w-8 animate-spin mx-auto" :class="theme.textTertiary" />
            <p class="text-sm font-medium" :class="theme.textSecondary">Loading collection...</p>
          </div>
        </div>

        <div
          v-else
          class="p-8"
          :class="isSidebarCollapsed ? 'max-w-full' : 'max-w-[90rem] mx-auto'"
        >
          <!-- Content -->
          <!-- Section Header -->
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-bold tracking-tight" :class="theme.textPrimary">
              {{ selectedSet?.name || 'Highlights' }}
            </h2>
            <div class="flex items-center gap-3">
              <!-- Sort Menu -->
              <Popover v-model:open="isSortMenuOpen">
                <PopoverTrigger as-child>
                  <button
                    class="p-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    :class="[
                      theme.borderSecondary,
                      theme.bgCard,
                      isSortMenuOpen ? 'ring-2 ring-teal-500/20' : '',
                    ]"
                  >
                    <ArrowUpDown class="h-4 w-4" :class="theme.textSecondary" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  class="w-56 p-0"
                  :class="[theme.bgCard, theme.borderSecondary]"
                >
                  <div class="p-2">
                    <p class="px-2 py-1.5 text-xs font-semibold" :class="theme.textTertiary">
                      Sort by
                    </p>
                    <div class="mt-1 space-y-0.5">
                      <button
                        v-for="option in sortOptions"
                        :key="option.value"
                        @click="handleSortChange(option.value)"
                        class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors"
                        :class="[
                          sortOrder === option.value
                            ? theme.bgButtonHover + ' ' + theme.textPrimary
                            : theme.textPrimary + ' hover:' + theme.bgButtonHover,
                        ]"
                      >
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <!-- View Options Menu (only show in grid view) -->
              <Popover v-if="viewMode === 'grid'" v-model:open="isViewMenuOpen">
                <PopoverTrigger as-child>
                  <button
                    class="p-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    :class="[
                      theme.borderSecondary,
                      theme.bgCard,
                      isViewMenuOpen ? 'ring-2 ring-teal-500/20' : '',
                    ]"
                  >
                    <Grid3x3 class="h-4 w-4" :class="theme.textSecondary" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  class="w-56 p-0"
                  :class="[theme.bgCard, theme.borderSecondary]"
                >
                  <div class="p-2 space-y-4">
                    <!-- Grid Size -->
                    <div>
                      <p class="px-2 py-1.5 text-xs font-semibold" :class="theme.textTertiary">
                        Grid Size
                      </p>
                      <div class="mt-1 space-y-0.5">
                        <button
                          v-for="size in gridSizeOptions"
                          :key="size.value"
                          @click="handleGridSizeChange(size.value)"
                          class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between"
                          :class="[
                            gridSize === size.value
                              ? theme.bgButtonHover + ' ' + theme.textPrimary
                              : theme.textPrimary + ' hover:' + theme.bgButtonHover,
                          ]"
                        >
                          <span>{{ size.label }}</span>
                          <Check v-if="gridSize === size.value" class="h-4 w-4 text-teal-500" />
                        </button>
                      </div>
                    </div>

                    <!-- Divider -->
                    <div class="h-px" :class="theme.borderSecondary"></div>

                    <!-- Show Filename -->
                    <div>
                      <p class="px-2 py-1.5 text-xs font-semibold" :class="theme.textTertiary">
                        Show
                      </p>
                      <div class="mt-1 px-2 py-1.5">
                        <div class="flex items-center justify-between">
                          <label class="text-sm" :class="theme.textPrimary">Filename</label>
                          <label class="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              :checked="showFilename"
                              @change="handleFilenameToggle"
                              class="sr-only peer"
                            />
                            <div
                              class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600"
                            ></div>
                            <span
                              class="ml-3 text-sm font-medium"
                              :class="showFilename ? theme.textPrimary : theme.textSecondary"
                            >
                              {{ showFilename ? 'On' : 'Off' }}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div
                class="flex items-center gap-0.5 p-0.5 rounded-lg bg-white dark:bg-gray-900 border shadow-sm"
                :class="theme.borderSecondary"
              >
                <button
                  class="p-2 rounded-md transition-all duration-200"
                  :class="[
                    viewMode === 'list'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]"
                  @click="viewMode = 'list'"
                >
                  <List class="h-4 w-4" />
                </button>
                <button
                  class="p-2 rounded-md transition-all duration-200"
                  :class="[
                    viewMode === 'grid'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]"
                  @click="viewMode = 'grid'"
                >
                  <Grid3x3 class="h-4 w-4" />
                </button>
              </div>
              <Button
                class="bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                @click="handleAddMedia"
                :disabled="isUploading"
              >
                <Loader2 v-if="isUploading" class="h-4 w-4 mr-2 animate-spin" />
                <Plus v-else class="h-4 w-4 mr-2" />
                {{ isUploading ? 'Uploading...' : 'Add Media' }}
              </Button>
            </div>
          </div>

          <!-- Media Grid/List View -->
          <div v-if="sortedMediaItems.length > 0" class="mb-8">
            <div
              v-if="viewMode === 'grid'"
              :class="[
                'grid gap-4',
                gridSize === 'small'
                  ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
                  : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
              ]"
            >
              <div v-for="item in sortedMediaItems" :key="item.id" class="group">
                <div
                  class="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  @click="openMediaViewer(item)"
                >
                  <img
                    :src="item.thumbnail || item.url || placeholderImage"
                    :alt="item.title || 'Media'"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <!-- Context Menu Button -->
                  <div
                    class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    @click.stop
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <button
                          class="p-1.5 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
                          @click.stop
                        >
                          <MoreVertical class="h-4 w-4 text-white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        class="w-48"
                        :class="[theme.bgDropdown, theme.borderSecondary]"
                        @click.stop
                      >
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleOpenMedia(item)"
                        >
                          <ExternalLink class="h-4 w-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleQuickShare(item)"
                        >
                          <Share2 class="h-4 w-4 mr-2" />
                          Quick share link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleDownloadMedia(item)"
                        >
                          <Download class="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleMoveCopy(item)"
                        >
                          <Move class="h-4 w-4 mr-2" />
                          Move/Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleCopyFilenames(item)"
                        >
                          <Copy class="h-4 w-4 mr-2" />
                          Copy filenames
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleSetAsCover(item)"
                        >
                          <FileImage class="h-4 w-4 mr-2" />
                          Set as cover
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleRenameMedia(item)"
                        >
                          <PencilIcon class="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleReplacePhoto(item)"
                        >
                          <FileImage class="h-4 w-4 mr-2" />
                          Replace photo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleWatermarkMedia(item)"
                        >
                          <Eye class="h-4 w-4 mr-2" />
                          Watermark
                        </DropdownMenuItem>
                        <div class="h-px my-1" :class="theme.borderSecondary"></div>
                        <DropdownMenuItem
                          :class="[
                            'text-red-600 dark:text-red-400',
                            'hover:bg-red-50 dark:hover:bg-red-900/20',
                            'cursor-pointer',
                          ]"
                          @click.stop="handleDeleteMedia(item)"
                        >
                          <Trash2 class="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <!-- Filename below image -->
                <p
                  v-if="showFilename && item.title"
                  class="text-xs font-medium truncate mt-2 text-center"
                  :class="theme.textPrimary"
                >
                  {{ item.title }}
                </p>
              </div>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="item in sortedMediaItems"
                :key="item.id"
                class="group flex items-center gap-4 p-4 rounded-lg border bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-200 cursor-pointer"
                :class="theme.borderSecondary"
                @click="openMediaViewer(item)"
              >
                <img
                  :src="item.thumbnail || item.url || placeholderImage"
                  :alt="item.title || 'Media'"
                  class="w-20 h-20 object-cover rounded-lg"
                  @error="handleImageError"
                />
                <div class="flex-1 min-w-0">
                  <p
                    v-if="showFilename && item.title"
                    class="text-sm font-medium truncate"
                    :class="theme.textPrimary"
                  >
                    {{ item.title }}
                  </p>
                  <p v-else class="text-sm font-medium truncate" :class="theme.textTertiary">
                    Media Item
                  </p>
                  <p class="text-xs mt-1" :class="theme.textTertiary">
                    {{ formatMediaDate(item.createdAt) }}
                  </p>
                </div>
                <!-- Context Menu Button -->
                <div
                  class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  @click.stop
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <button
                        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        :class="theme.textSecondary"
                        @click.stop
                      >
                        <MoreVertical class="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      class="w-48"
                      :class="[theme.bgDropdown, theme.borderSecondary]"
                      @click.stop
                    >
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleOpenMedia(item)"
                      >
                        <ExternalLink class="h-4 w-4 mr-2" />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleQuickShare(item)"
                      >
                        <Share2 class="h-4 w-4 mr-2" />
                        Quick share link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleDownloadMedia(item)"
                      >
                        <Download class="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleMoveCopy(item)"
                      >
                        <Move class="h-4 w-4 mr-2" />
                        Move/Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleCopyFilenames(item)"
                      >
                        <Copy class="h-4 w-4 mr-2" />
                        Copy filenames
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleSetAsCover(item)"
                      >
                        <FileImage class="h-4 w-4 mr-2" />
                        Set as cover
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleRenameMedia(item)"
                      >
                        <PencilIcon class="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleReplacePhoto(item)"
                      >
                        <FileImage class="h-4 w-4 mr-2" />
                        Replace photo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleWatermarkMedia(item)"
                      >
                        <Eye class="h-4 w-4 mr-2" />
                        Watermark
                      </DropdownMenuItem>
                      <div class="h-px my-1" :class="theme.borderSecondary"></div>
                      <DropdownMenuItem
                        :class="[
                          'text-red-600 dark:text-red-400',
                          'hover:bg-red-50 dark:hover:bg-red-900/20',
                          'cursor-pointer',
                        ]"
                        @click.stop="handleDeleteMedia(item)"
                      >
                        <Trash2 class="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State / Upload Zone -->
          <div
            v-if="sortedMediaItems.length === 0"
            class="border-2 border-dashed rounded-2xl p-20 text-center transition-all duration-300 bg-white dark:bg-gray-900"
            :class="[
              theme.borderSecondary,
              isDragging
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 scale-[1.01] shadow-xl ring-4 ring-teal-500/20'
                : 'hover:border-teal-400 dark:hover:border-teal-600 hover:bg-gray-50 dark:hover:bg-gray-900/50',
            ]"
            @drop="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
          >
            <div class="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto">
              <div
                class="p-6 rounded-full transition-all duration-300"
                :class="[
                  isDragging
                    ? 'bg-teal-100 dark:bg-teal-900/40 scale-110 ring-4 ring-teal-500/30'
                    : 'bg-gray-100 dark:bg-gray-800',
                ]"
              >
                <ImagePlus
                  class="h-12 w-12 transition-all duration-300"
                  :class="[
                    isDragging
                      ? 'text-teal-600 dark:text-teal-400 scale-110 rotate-6'
                      : theme.textTertiary,
                  ]"
                />
              </div>
              <div class="space-y-3">
                <p class="text-xl font-bold" :class="theme.textPrimary">
                  Drag photos and videos here to upload
                </p>
                <p class="text-sm" :class="theme.textSecondary">
                  or{' '}
                  <button
                    class="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-semibold underline underline-offset-4 transition-colors"
                    @click="handleBrowseFiles"
                  >
                    browse files
                  </button>
                </p>
              </div>
              <div class="mt-10 pt-8 border-t w-full" :class="theme.borderSecondary">
                <label
                  class="block text-sm font-semibold mb-3 text-center"
                  :class="theme.textSecondary"
                >
                  Watermark
                </label>
                <Select v-model="selectedWatermark">
                  <SelectTrigger
                    :class="[
                      'w-full max-w-xs mx-auto',
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'hover:border-teal-400 dark:hover:border-teal-600 focus:ring-2 focus:ring-teal-500/20',
                    ]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                    <SelectItem
                      value="none"
                      label="No watermark"
                      :class="[theme.textPrimary, theme.bgButtonHover]"
                    >
                      No watermark
                    </SelectItem>
                    <SelectItem
                      v-for="watermark in watermarks"
                      :key="watermark.id"
                      :value="watermark.id"
                      :label="watermark.name"
                      :class="[theme.textPrimary, theme.bgButtonHover]"
                    >
                      {{ watermark.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Create/Edit Set Modal -->
    <CenterModal
      v-model="showCreateSetModal"
      :title="editingSetIdInModal ? 'EDIT PHOTO SET' : 'NEW PHOTO SET'"
      content-class="sm:max-w-[500px]"
    >
      <div class="space-y-6 py-4">
        <div class="space-y-2">
          <label class="text-sm font-semibold" :class="theme.textPrimary">
            Photo Set Name <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="newSetName"
            placeholder="e.g. Ceremony, Reception, Getting ready"
            class="w-full"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            @keydown.enter="handleCreateSet"
            @keydown.esc="handleCancelCreateSet"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold" :class="theme.textPrimary"> Description </label>
          <Textarea
            v-model="newSetDescription"
            placeholder="Optional"
            class="w-full min-h-[100px] resize-none"
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            :maxlength="500"
          />
          <div class="flex items-center justify-between">
            <p class="text-xs" :class="theme.textTertiary">
              Description is shown to clients viewing this photo set for additional storytelling.
            </p>
            <span class="text-xs" :class="theme.textTertiary">
              {{ newSetDescription.length }}/500
            </span>
          </div>
        </div>
      </div>

      <template #footer>
        <ActionButtonGroup
          :loading="isCreatingSet"
          :disabled="isCreatingSet"
          cancel-label="Cancel"
          :confirm-label="editingSetIdInModal ? 'Update' : 'Save'"
          :loading-label="editingSetIdInModal ? 'Updating...' : 'Creating...'"
          @cancel="handleCancelCreateSet"
          @confirm="handleCreateSet"
        />
      </template>
    </CenterModal>

    <!-- Delete Set Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :item-name="getItemName(itemToDelete)"
      title="Delete Photo Set"
      description="This action cannot be undone."
      warning-message="This photo set will be permanently removed from your collection."
      :is-deleting="isDeleting"
      @confirm="handleConfirmDeleteSet"
      @cancel="closeDeleteModal"
    />

    <!-- Media Viewer Modal -->
    <div
      v-if="selectedMedia"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
      @click="closeMediaViewer"
    >
      <div class="relative max-w-7xl max-h-full">
        <img
          :src="selectedMedia.url || selectedMedia.thumbnail || placeholderImage"
          :alt="selectedMedia.title || 'Media'"
          class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          @error="handleImageError"
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
import { ref, computed, onMounted, watch, nextTick, Transition, TransitionGroup } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from '@/utils/debounce'
import {
  ImageIcon,
  Paintbrush,
  Settings,
  Plus,
  GripVertical,
  MoreVertical,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronDown,
  List,
  Grid3x3,
  ImagePlus,
  Loader2,
  Check,
  X,
  Pencil,
  Trash2,
  Radio,
  ArrowUpDown,
  ArrowDown,
  ExternalLink,
  Download,
  Share2,
  Copy,
  Move,
  Eye,
  FileImage,
  Pencil as PencilIcon,
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
import CenterModal from '@/components/molecules/CenterModal.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { Input } from '@/components/shadcn/input'
import Textarea from '@/components/shadcn/Textarea.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useGalleryStore } from '@/stores/gallery'
import { useWatermarkStore } from '@/stores/watermark'
import { usePresetStore } from '@/stores/preset'
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation'
import type { Collection, MediaSet as ApiMediaSet } from '@/api/collections'
import { useMediaApi, type MediaItem } from '@/api/media'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const watermarkStore = useWatermarkStore()
const presetStore = usePresetStore()
const mediaApi = useMediaApi()

const collection = ref<Collection | null>(null)
const collectionStatus = ref('draft')
const eventDate = ref<Date | null>(null)
const activeTab = ref<'photos' | 'design' | 'settings' | 'activities'>('photos')
const isSidebarCollapsed = ref(false)

// Auto-expand sidebar when switching to non-photos tabs
watch(activeTab, (newTab: 'photos' | 'design' | 'settings' | 'activities') => {
  if (newTab !== 'photos') {
    isSidebarCollapsed.value = false
  }
})
const selectedSetId = ref<string | null>(null)
const selectedWatermark = ref('none')
const selectedPresetId = ref<string>('none')
const isDragging = ref(false)
const viewMode = ref<'list' | 'grid'>('grid')
const gridSize = ref<'small' | 'large'>('small')
const showFilename = ref(true)
const sortOrder = ref<
  | 'uploaded-new-old'
  | 'uploaded-old-new'
  | 'date-taken-new-old'
  | 'date-taken-old-new'
  | 'name-a-z'
  | 'name-z-a'
  | 'random'
>('uploaded-new-old')
const isSortMenuOpen = ref(false)
const isViewMenuOpen = ref(false)
const mediaItems = ref<MediaItem[]>([])
const isLoadingMedia = ref(false)
const selectedMedia = ref<MediaItem | null>(null)

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
const isEditingName = ref(false)
const editingName = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)
const isSavingName = ref(false)
const isBlurringName = ref(false)
const isDatePickerOpen = ref(false)
const isPresetPopoverOpen = ref(false)
const isWatermarkPopoverOpen = ref(false)
const isLoading = ref(false)
const isSavingStatus = ref(false)
const isSavingDate = ref(false)
const isSavingPreset = ref(false)
const isSavingWatermark = ref(false)
const editingSetId = ref<string | null>(null)
const editingSetName = ref('')
const setNameInputRef = ref<HTMLInputElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const showCreateSetModal = ref(false)
const newSetName = ref('')
const newSetDescription = ref('')
const isCreatingSet = ref(false)
const isSavingSets = ref(false)
const editingSetIdInModal = ref<string | null>(null)
const {
  showDeleteModal,
  itemToDelete,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  getItemName,
} = useDeleteConfirmation<MediaSet>()

interface MediaSet {
  id: string
  name: string
  description?: string
  count: number
  order?: number
}

const mediaSets = ref<MediaSet[]>([])

// Sort media sets by order
const sortedMediaSets = computed(() => {
  return [...mediaSets.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

// Drag and drop state for sets
const draggedSetId = ref<string | null>(null)
const draggedSetIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const selectedSet = computed(() => {
  return (
    sortedMediaSets.value.find((set: MediaSet) => set.id === selectedSetId.value) ||
    sortedMediaSets.value[0]
  )
})

// Sort options
const sortOptions = [
  { label: 'Uploaded: New → Old', value: 'uploaded-new-old' },
  { label: 'Uploaded: Old → New', value: 'uploaded-old-new' },
  { label: 'Date Taken: New → Old', value: 'date-taken-new-old' },
  { label: 'Date Taken: Old → New', value: 'date-taken-old-new' },
  { label: 'Name: A-Z', value: 'name-a-z' },
  { label: 'Name: Z-A', value: 'name-z-a' },
  { label: 'Random', value: 'random' },
]

const gridSizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Large', value: 'large' },
]

// Sorted media items based on sort order
const sortedMediaItems = computed(() => {
  const items = [...mediaItems.value]

  switch (sortOrder.value) {
    case 'uploaded-new-old':
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'uploaded-old-new':
      return items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'date-taken-new-old':
      // Assuming dateTaken is stored in description or we use createdAt as fallback
      return items.sort((a, b) => {
        const dateA = (a as any).dateTaken
          ? new Date((a as any).dateTaken).getTime()
          : new Date(a.createdAt).getTime()
        const dateB = (b as any).dateTaken
          ? new Date((b as any).dateTaken).getTime()
          : new Date(b.createdAt).getTime()
        return dateB - dateA
      })
    case 'date-taken-old-new':
      return items.sort((a, b) => {
        const dateA = (a as any).dateTaken
          ? new Date((a as any).dateTaken).getTime()
          : new Date(a.createdAt).getTime()
        const dateB = (b as any).dateTaken
          ? new Date((b as any).dateTaken).getTime()
          : new Date(b.createdAt).getTime()
        return dateA - dateB
      })
    case 'name-a-z':
      return items.sort((a, b) => {
        const nameA = (a.title || '').toLowerCase()
        const nameB = (b.title || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })
    case 'name-z-a':
      return items.sort((a, b) => {
        const nameA = (a.title || '').toLowerCase()
        const nameB = (b.title || '').toLowerCase()
        return nameB.localeCompare(nameA)
      })
    case 'random':
      return items.sort(() => Math.random() - 0.5)
    default:
      return items
  }
})

// Handle sort change
const handleSortChange = (value: string) => {
  sortOrder.value = value as typeof sortOrder.value
  isSortMenuOpen.value = false
}

// Handle grid size change
const handleGridSizeChange = (value: string) => {
  gridSize.value = value as 'small' | 'large'
}

// Handle filename toggle
const handleFilenameToggle = (event: Event) => {
  const target = event.target as HTMLInputElement
  showFilename.value = target.checked
}

// Open media viewer
const openMediaViewer = (item: MediaItem) => {
  selectedMedia.value = item
}

// Close media viewer
const closeMediaViewer = () => {
  selectedMedia.value = null
}

// Format date helper for media items (using existing formatDate for event dates)
const formatMediaDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Load media items for selected set
const loadMediaItems = async () => {
  if (!collection.value || !selectedSetId.value) {
    mediaItems.value = []
    return
  }

  isLoadingMedia.value = true
  try {
    const items = await mediaApi.fetchCollectionMedia(collection.value.id)
    // Filter by selected set if needed (for now, show all media for the collection)
    mediaItems.value = items
  } catch (error) {
    console.error('Failed to load media items:', error)
    toast.error('Failed to load media', {
      description: 'An error occurred while loading media items.',
    })
  } finally {
    isLoadingMedia.value = false
  }
}

// Media item context menu handlers
const handleOpenMedia = (item: MediaItem) => {
  window.open(item.url, '_blank')
}

const handleQuickShare = async (item: MediaItem) => {
  try {
    const shareUrl = `${window.location.origin}/share/${item.id}`
    await navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied', {
      description: 'The share link has been copied to your clipboard.',
    })
  } catch (error) {
    console.error('Failed to copy share link:', error)
    toast.error('Failed to copy link', {
      description: 'Could not copy the share link to clipboard.',
    })
  }
}

const handleDownloadMedia = (item: MediaItem) => {
  const link = document.createElement('a')
  link.href = item.url
  link.download = item.title || `media-${item.id}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success('Download started', {
    description: 'Your download should start shortly.',
  })
}

const handleMoveCopy = (item: MediaItem) => {
  toast.info('Move/Copy', {
    description: 'Move/Copy functionality will be implemented soon.',
  })
}

const handleCopyFilenames = async (item: MediaItem) => {
  try {
    const filename = item.title || `media-${item.id}`
    await navigator.clipboard.writeText(filename)
    toast.success('Filename copied', {
      description: 'The filename has been copied to your clipboard.',
    })
  } catch (error) {
    console.error('Failed to copy filename:', error)
    toast.error('Failed to copy filename', {
      description: 'Could not copy the filename to clipboard.',
    })
  }
}

const handleSetAsCover = async (item: MediaItem) => {
  if (!collection.value) return

  try {
    await galleryStore.updateCollection(collection.value.id, {
      thumbnail: item.thumbnail || item.url,
      image: item.url,
    } as any)
    toast.success('Cover updated', {
      description: 'The cover image has been updated.',
    })
  } catch (error) {
    console.error('Failed to set cover:', error)
    toast.error('Failed to set cover', {
      description: 'An error occurred while updating the cover image.',
    })
  }
}

const handleRenameMedia = (item: MediaItem) => {
  toast.info('Rename', {
    description: 'Rename functionality will be implemented soon.',
  })
}

const handleReplacePhoto = (item: MediaItem) => {
  toast.info('Replace photo', {
    description: 'Replace photo functionality will be implemented soon.',
  })
}

const handleWatermarkMedia = (item: MediaItem) => {
  toast.info('Watermark', {
    description: 'Watermark functionality will be implemented soon.',
  })
}

const handleDeleteMedia = async (item: MediaItem) => {
  if (!item) return

  try {
    await mediaApi.deleteMedia(item.id)
    // Remove from local array
    const index = mediaItems.value.findIndex(m => m.id === item.id)
    if (index !== -1) {
      mediaItems.value.splice(index, 1)
      // Update set count
      const set = mediaSets.value.find((s: MediaSet) => s.id === selectedSetId.value)
      if (set && set.count > 0) {
        set.count -= 1
        await saveMediaSets()
      }
    }
    toast.success('Media deleted', {
      description: 'The media item has been deleted.',
    })
  } catch (error) {
    console.error('Failed to delete media:', error)
    toast.error('Failed to delete media', {
      description: 'An error occurred while deleting the media item.',
    })
  }
}

const watermarks = computed(() => watermarkStore.watermarks)
const presets = computed(() => presetStore.presets)

const selectedPresetName = computed(() => {
  if (selectedPresetId.value === 'none') return null
  const preset = presets.value.find((p: any) => p.id === selectedPresetId.value)
  return preset?.name || null
})

const selectedWatermarkName = computed(() => {
  if (selectedWatermark.value === 'none') return null
  const watermark = watermarks.value.find((w: any) => w.id === selectedWatermark.value)
  return watermark?.name || null
})

// Load collection data
const loadCollection = async () => {
  const uuid = route.params.uuid as string
  if (!uuid) {
    toast.error('Collection ID is required')
    router.push({ name: 'manageCollections' })
    return
  }

  isLoading.value = true
  try {
    // First ensure collections are loaded
    await galleryStore.fetchCollections()

    const collectionData = await galleryStore.fetchCollection(uuid)
    if (!collectionData) {
      console.error('Collection not found:', uuid)
      toast.error('Collection not found', {
        description: `Collection with ID ${uuid} could not be found.`,
      })
      router.push({ name: 'manageCollections' })
      return
    }

    // Update local collection reference
    collection.value = collectionData
    // Map 'active' status to 'published' for display
    collectionStatus.value =
      collectionData.status === 'active' ? 'published' : collectionData.status || 'draft'

    // Set event date if available (as Date object for datepicker, but stored as string)
    // API stores as 'date' field
    const dateString = (collectionData as any).date
    if (dateString) {
      try {
        const dateValue = typeof dateString === 'string' ? new Date(dateString) : dateString
        // Check if date is valid
        if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
          eventDate.value = dateValue
        } else if (typeof dateString === 'string') {
          // Try parsing as ISO string
          const parsed = new Date(dateString)
          if (!isNaN(parsed.getTime())) {
            eventDate.value = parsed
          } else {
            console.warn('Invalid date value:', dateString)
            eventDate.value = null
          }
        } else {
          eventDate.value = null
        }
      } catch (error) {
        console.error('Error parsing date:', error, dateString)
        eventDate.value = null
      }
    } else {
      eventDate.value = null
    }

    // Set preset if available (assuming collection has presetId field)
    // For now, we'll check if there's a presetId in the collection
    // If not, default to 'none'
    selectedPresetId.value = (collectionData as any).presetId || 'none'

    // Set watermark if available (assuming collection has watermarkId field)
    selectedWatermark.value = (collectionData as any).watermarkId || 'none'

    // Load media sets from collection data
    if (collectionData.mediaSets && collectionData.mediaSets.length > 0) {
      mediaSets.value = collectionData.mediaSets.map((set: ApiMediaSet) => ({
        id: set.id,
        name: set.name,
        description: set.description,
        count: set.count || 0,
        order: set.order ?? 0,
      }))
    } else {
      // Initialize with default "Highlights" set if no sets exist
      mediaSets.value = [{ id: 'highlights', name: 'Highlights', count: 0, order: 0 }]
    }

    // Set default selected set
    if (mediaSets.value.length > 0) {
      selectedSetId.value = sortedMediaSets.value[0]?.id || mediaSets.value[0].id
    }
  } catch (error: any) {
    toast.error('Failed to load collection', {
      description: error.message || 'An error occurred',
    })
    router.push({ name: 'manageCollections' })
  } finally {
    isLoading.value = false
  }
}

// Watch store's collections array for real-time updates (preset/watermark/mediaSets changes from other components)
watch(
  () => galleryStore.collections,
  (collections: any[]) => {
    if (collection.value) {
      const updatedCollection = collections.find((c: any) => c.id === collection.value?.id)
      if (updatedCollection && updatedCollection.id === collection.value.id) {
        // Update local collection ref with latest data from store
        collection.value = { ...collection.value, ...updatedCollection }
        // Update local state to reflect changes
        selectedPresetId.value = (updatedCollection as any).presetId || 'none'
        selectedWatermark.value = (updatedCollection as any).watermarkId || 'none'
        // Update status if changed
        collectionStatus.value =
          updatedCollection.status === 'active' ? 'published' : updatedCollection.status || 'draft'

        // Update media sets if they changed
        if (updatedCollection.mediaSets) {
          mediaSets.value = updatedCollection.mediaSets.map((set: ApiMediaSet) => ({
            id: set.id,
            name: set.name,
            description: set.description,
            count: set.count || 0,
            order: set.order ?? 0,
          }))
        }
      }
    }
  },
  { deep: true }
)

// Watch for selected set changes to reload media
watch(selectedSetId, () => {
  loadMediaItems()
})

// Load watermarks and presets
onMounted(async () => {
  await loadCollection()
  await loadMediaItems()
  try {
    await watermarkStore.fetchWatermarks()
  } catch (error) {
    console.error('Failed to fetch watermarks:', error)
  }
  // Presets are already loaded from localStorage in the store
})

const goBack = () => {
  router.push({ name: 'manageCollections' })
}

const handleAddSet = () => {
  editingSetIdInModal.value = null
  newSetName.value = ''
  newSetDescription.value = ''
  showCreateSetModal.value = true
}

const handleEditSet = (setId: string) => {
  const set = mediaSets.value.find((s: MediaSet) => s.id === setId)
  if (!set) return

  editingSetIdInModal.value = setId
  newSetName.value = set.name
  newSetDescription.value = set.description || ''
  showCreateSetModal.value = true
}

const handleCreateSet = async () => {
  const trimmedName = newSetName.value.trim()
  if (!trimmedName) {
    toast.error('Name required', {
      description: 'Photo set name is required.',
    })
    return
  }

  isCreatingSet.value = true
  try {
    if (editingSetIdInModal.value) {
      // Update existing set
      const set = mediaSets.value.find((s: MediaSet) => s.id === editingSetIdInModal.value)
      if (set) {
        set.name = trimmedName
        set.description = newSetDescription.value.trim() || undefined
        await saveMediaSets()

        showCreateSetModal.value = false
        editingSetIdInModal.value = null
        newSetName.value = ''
        newSetDescription.value = ''

        toast.success('Set updated', {
          description: `"${set.name}" has been updated.`,
        })
      }
    } else {
      // Create new set
      const maxOrder = Math.max(...mediaSets.value.map((s: MediaSet) => s.order ?? 0), -1)
      const newSet: MediaSet = {
        id: `set-${Date.now()}`,
        name: trimmedName,
        description: newSetDescription.value.trim() || undefined,
        count: 0,
        order: maxOrder + 1,
      }
      mediaSets.value.push(newSet)
      selectedSetId.value = newSet.id
      await saveMediaSets()

      showCreateSetModal.value = false
      newSetName.value = ''
      newSetDescription.value = ''

      toast.success('Set created', {
        description: `"${newSet.name}" has been created.`,
      })
    }
  } catch (error: any) {
    toast.error(editingSetIdInModal.value ? 'Failed to update set' : 'Failed to create set', {
      description: error.message || 'An error occurred',
    })
  } finally {
    isCreatingSet.value = false
  }
}

const handleCancelCreateSet = () => {
  showCreateSetModal.value = false
  editingSetIdInModal.value = null
  newSetName.value = ''
  newSetDescription.value = ''
}

const startSetNameEdit = (setId: string) => {
  const set = mediaSets.value.find((s: MediaSet) => s.id === setId)
  if (!set) return
  editingSetId.value = setId
  editingSetName.value = set.name
  nextTick(() => {
    setNameInputRef.value?.focus()
    setNameInputRef.value?.select()
  })
}

// Auto-save set name with debounce
const autoSaveSetName = debounce((setId: string, newName: string) => {
  const set = mediaSets.value.find((s: MediaSet) => s.id === setId)
  if (!set || set.name === newName) return

  set.name = newName
  saveMediaSets()
}, 500) as (setId: string, newName: string) => void

const saveSetName = (setId: string) => {
  const set = mediaSets.value.find((s: MediaSet) => s.id === setId)
  if (!set) return

  const trimmedName = editingSetName.value.trim()
  if (!trimmedName) {
    editingSetName.value = set.name
    editingSetId.value = null
    return
  }

  if (trimmedName !== set.name) {
    set.name = trimmedName
    saveMediaSets()
  }
  editingSetId.value = null
}

// Watch for set name changes while editing (auto-save)
watch(editingSetName, (newName: string) => {
  if (editingSetId.value && newName.trim()) {
    autoSaveSetName(editingSetId.value, newName.trim())
  }
})

const cancelSetNameEdit = () => {
  editingSetId.value = null
  editingSetName.value = ''
}

const handleDeleteSet = (setId: string) => {
  const set = mediaSets.value.find((s: MediaSet) => s.id === setId)
  if (!set) return

  if (mediaSets.value.length === 1) {
    toast.error('Cannot delete', {
      description: 'You must have at least one media set.',
    })
    return
  }

  openDeleteModal(set)
}

const handleConfirmDeleteSet = async () => {
  if (!itemToDelete.value) return

  const set = itemToDelete.value
  const index = mediaSets.value.findIndex((s: MediaSet) => s.id === set.id)

  if (index !== -1) {
    isDeleting.value = true
    try {
      mediaSets.value.splice(index, 1)
      if (selectedSetId.value === set.id) {
        selectedSetId.value = mediaSets.value[0]?.id || null
      }
      await saveMediaSets()
      closeDeleteModal()
      toast.success('Set deleted', {
        description: `"${set.name}" has been deleted.`,
      })
    } catch (error: any) {
      toast.error('Failed to delete set', {
        description: error.message || 'An error occurred',
      })
    } finally {
      isDeleting.value = false
    }
  }
}

const handleAddMedia = () => {
  fileInputRef.value?.click()
}

const handleBrowseFiles = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  await processFiles(Array.from(files))
  // Reset input
  input.value = ''
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  await processFiles(Array.from(files))
}

const processFiles = async (files: File[]) => {
  if (!selectedSetId.value) {
    toast.error('No set selected', {
      description: 'Please select a media set first.',
    })
    return
  }

  isUploading.value = true

  try {
    // Filter valid image/video files
    const validFiles = files.filter(file => {
      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'video/mp4',
        'video/webm',
      ]
      return validTypes.includes(file.type)
    })

    if (validFiles.length === 0) {
      toast.error('Invalid files', {
        description: 'Please upload image or video files only.',
      })
      return
    }

    // Update set count
    const set = mediaSets.value.find((s: MediaSet) => s.id === selectedSetId.value)
    if (set) {
      set.count += validFiles.length
    }

    // Reload media items to show newly uploaded files
    await loadMediaItems()

    // Simulate upload (in real app, upload to server)
    await new Promise(resolve => setTimeout(resolve, 1000))

    toast.success('Files uploaded', {
      description: `${validFiles.length} file(s) uploaded successfully.`,
    })
  } catch (error: any) {
    toast.error('Upload failed', {
      description: error.message || 'An error occurred during upload.',
    })
  } finally {
    isUploading.value = false
  }
}

const handleCopyLink = () => {
  const uuid = route.params.uuid as string
  const link = `${window.location.origin}/collections/${uuid}`

  navigator.clipboard
    .writeText(link)
    .then(() => {
      toast.success('Link copied', {
        description: 'Share link copied to clipboard.',
      })
    })
    .catch(() => {
      toast.error('Failed to copy', {
        description: 'Could not copy link to clipboard.',
      })
    })
}

// Save media sets to collection via API
const saveMediaSets = async () => {
  if (!collection.value || isSavingSets.value) return

  isSavingSets.value = true
  try {
    const setsToSave: ApiMediaSet[] = mediaSets.value.map((set: MediaSet) => ({
      id: set.id,
      name: set.name,
      description: set.description,
      count: set.count,
      order: set.order ?? 0,
    }))

    await galleryStore.updateCollection(collection.value.id, {
      mediaSets: setsToSave,
    } as any)

    // Update local collection ref
    if (collection.value) {
      collection.value.mediaSets = setsToSave
    }
  } catch (error) {
    console.error('Failed to save media sets:', error)
    toast.error('Failed to save media sets', {
      description: 'An error occurred while saving.',
    })
  } finally {
    isSavingSets.value = false
  }
}

// Drag and drop handlers for sets
const handleSetDragStart = (e: DragEvent, setId: string, index: number) => {
  draggedSetId.value = setId
  draggedSetIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', setId)
  }
}

const handleSetDragEnd = () => {
  draggedSetId.value = null
  draggedSetIndex.value = null
  dragOverIndex.value = null
}

const handleSetDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
  dragOverIndex.value = index
}

const handleSetDragLeave = () => {
  dragOverIndex.value = null
}

const handleSetDrop = async (e: DragEvent, dropIndex: number) => {
  e.preventDefault()
  dragOverIndex.value = null

  if (draggedSetIndex.value === null || draggedSetId.value === null) return

  const draggedIndex = draggedSetIndex.value

  if (draggedIndex === dropIndex) return

  // Reorder the sets using sortedMediaSets order
  const sorted = [...sortedMediaSets.value]
  const [draggedSet] = sorted.splice(draggedIndex, 1)
  sorted.splice(dropIndex, 0, draggedSet)

  // Update order values
  sorted.forEach((set: MediaSet, index: number) => {
    set.order = index
  })

  // Update the original array
  mediaSets.value.forEach((set: MediaSet) => {
    const updated = sorted.find((s: MediaSet) => s.id === set.id)
    if (updated) {
      set.order = updated.order ?? 0
    }
  })

  await saveMediaSets()

  draggedSetId.value = null
  draggedSetIndex.value = null
}

const handlePreview = () => {
  // TODO: Implement preview functionality
  const uuid = route.params.uuid as string
  router.push({
    name: 'collectionPreview',
    params: { id: uuid },
  })
}

const handlePublish = async () => {
  if (!collection.value) return

  isSavingStatus.value = true
  try {
    await galleryStore.updateCollection(collection.value.id, {
      status: 'active',
    })
    collectionStatus.value = 'published'
    collection.value.status = 'active'
    toast.success('Collection published', {
      description: 'Your collection has been published successfully.',
    })
  } catch (error: any) {
    toast.error('Failed to publish collection', {
      description: error.message || 'An error occurred',
    })
  } finally {
    isSavingStatus.value = false
  }
}

const handleStatusChange = async (newStatus: string) => {
  if (!collection.value || !newStatus) return

  isSavingStatus.value = true
  try {
    // Map 'published' to 'active' for the API
    const apiStatus =
      newStatus === 'published' ? 'active' : (newStatus as 'draft' | 'active' | 'archived')
    await galleryStore.updateCollection(collection.value.id, {
      status: apiStatus,
    })
    collection.value.status = apiStatus
    collectionStatus.value = newStatus
    // Auto-save: no toast notification for status changes
  } catch (error: any) {
    toast.error('Failed to update status', {
      description: error.message || 'An error occurred',
    })
    // Revert status on error
    collectionStatus.value =
      collection.value.status === 'active' ? 'published' : collection.value.status || 'draft'
  } finally {
    isSavingStatus.value = false
  }
}

const handleDateChange = async (newDate: Date | null) => {
  if (!collection.value) return

  // Close the popover
  isDatePickerOpen.value = false

  isSavingDate.value = true
  try {
    // Convert Date to ISO string for storage, or null to clear
    const dateString = newDate instanceof Date ? newDate.toISOString() : newDate || null

    const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
      eventDate: dateString,
    })

    if (updatedCollection) {
      collection.value = updatedCollection
      // Update eventDate from the returned collection data - API stores as 'date'
      const dateFromCollection = (updatedCollection as any).date
      if (dateFromCollection) {
        const parsedDate =
          typeof dateFromCollection === 'string' ? new Date(dateFromCollection) : dateFromCollection
        if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
          eventDate.value = parsedDate
        } else {
          eventDate.value = newDate
        }
      } else {
        eventDate.value = newDate
      }
    } else {
      eventDate.value = newDate
    }

    // Auto-save: no toast notification for date changes
  } catch (error: any) {
    console.error('Date save error:', error)
    toast.error('Failed to save event date', {
      description: error.message || 'An error occurred',
    })
    // Revert to original date on error
    const originalDate = (collection.value as any).date
    if (originalDate) {
      eventDate.value = typeof originalDate === 'string' ? new Date(originalDate) : originalDate
    } else {
      eventDate.value = null
    }
  } finally {
    isSavingDate.value = false
  }
}

const handlePresetChange = async (presetId: any) => {
  if (!collection.value) return

  const presetIdStr = String(presetId)
  if (presetIdStr === selectedPresetId.value) {
    isPresetPopoverOpen.value = false
    return
  }

  isSavingPreset.value = true
  isPresetPopoverOpen.value = false
  try {
    const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
      presetId: presetIdStr === 'none' ? undefined : presetIdStr,
    } as any)

    if (updatedCollection) {
      collection.value = updatedCollection
      selectedPresetId.value = (updatedCollection as any).presetId || 'none'
    } else {
      selectedPresetId.value = presetIdStr
      ;(collection.value as any).presetId = presetIdStr === 'none' ? undefined : presetIdStr
    }

    // Auto-save: no toast notification for preset changes
  } catch (error: any) {
    toast.error('Failed to update preset', {
      description: error.message || 'An error occurred',
    })
    // Revert on error
    selectedPresetId.value = (collection.value as any)?.presetId || 'none'
  } finally {
    isSavingPreset.value = false
  }
}

const handleWatermarkChange = async (watermarkId: any) => {
  if (!collection.value) return

  const watermarkIdStr = String(watermarkId)
  if (watermarkIdStr === selectedWatermark.value) {
    isWatermarkPopoverOpen.value = false
    return
  }

  isSavingWatermark.value = true
  isWatermarkPopoverOpen.value = false
  try {
    const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
      watermarkId: watermarkIdStr === 'none' ? undefined : watermarkIdStr,
    } as any)

    if (updatedCollection) {
      collection.value = updatedCollection
      selectedWatermark.value = (updatedCollection as any).watermarkId || 'none'
    } else {
      selectedWatermark.value = watermarkIdStr
      ;(collection.value as any).watermarkId =
        watermarkIdStr === 'none' ? undefined : watermarkIdStr
    }

    // Auto-save: no toast notification for watermark changes
  } catch (error: any) {
    toast.error('Failed to update watermark', {
      description: error.message || 'An error occurred',
    })
    // Revert on error
    selectedWatermark.value = (collection.value as any)?.watermarkId || 'none'
  } finally {
    isSavingWatermark.value = false
  }
}

const formatDate = (date: Date | string | null): string => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj)
}

const startEditingName = () => {
  if (!collection.value) return
  isEditingName.value = true
  editingName.value = collection.value.name
  nextTick(() => {
    nameInputRef.value?.focus()
    nameInputRef.value?.select()
  })
}

const cancelEditingName = () => {
  isEditingName.value = false
  editingName.value = ''
}

const handleNameBlur = () => {
  if (isBlurringName.value || isSavingName.value) return
  isBlurringName.value = true
  setTimeout(() => {
    if (isBlurringName.value && !isSavingName.value) {
      // Only save if name has actually changed
      const trimmedName = editingName.value.trim()
      if (trimmedName && trimmedName !== collection.value?.name) {
        saveName()
      } else if (!trimmedName) {
        // If empty, just cancel without showing error
        cancelEditingName()
      } else {
        // If unchanged, just cancel
        cancelEditingName()
      }
      isBlurringName.value = false
    }
  }, 200)
}

const saveName = async () => {
  if (!collection.value) return

  const trimmedName = editingName.value.trim()

  if (!trimmedName) {
    toast.error('Name required', {
      description: 'Collection name cannot be empty.',
    })
    editingName.value = collection.value.name
    cancelEditingName()
    return
  }

  if (trimmedName === collection.value.name) {
    cancelEditingName()
    return
  }

  isSavingName.value = true
  isBlurringName.value = false

  try {
    const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
      name: trimmedName,
    })
    // Update local collection reference with the returned data
    if (updatedCollection) {
      collection.value = updatedCollection
    } else {
      // Fallback: update name directly if API doesn't return updated collection
      collection.value.name = trimmedName
    }
    cancelEditingName()
    // Auto-save: no toast notification for name changes
  } catch (error: any) {
    toast.error('Failed to update name', {
      description: error.message || 'An error occurred',
    })
    // Revert editing name to original
    editingName.value = collection.value.name
    cancelEditingName()
  } finally {
    isSavingName.value = false
  }
}

// Watch for route changes
watch(
  () => route.params.uuid,
  () => {
    loadCollection()
  }
)
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.4);
  border-radius: 10px;
  transition: background 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.6);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.4);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.6);
}

/* Smooth transitions for set list items */
.set-list-enter-active,
.set-list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.set-list-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.set-list-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.set-list-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Indicator bar transition */
.indicator-enter-active,
.indicator-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.indicator-enter-from {
  opacity: 0;
  transform: scaleY(0);
}

.indicator-leave-to {
  opacity: 0;
  transform: scaleY(0);
}

/* Smooth animations for card interactions */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Smooth hover transitions */
.group:hover .opacity-0 {
  transition: opacity 0.2s ease-in-out;
}

/* Fade transition for title editing */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}

/* Smooth scale utilities */
.scale-102 {
  transform: scale(1.02);
}

/* Fade transition for loading overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
