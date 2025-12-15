<template>
  <CollectionLayout
    v-model:active-tab="activeTab"
    v-model:collection-status="collectionStatus"
    v-model:editing-name="editingName"
    v-model:is-sidebar-collapsed="isSidebarCollapsed"
    :collection="collection"
    :event-date="eventDate"
    :is-editing-name="isEditingName"
    :is-loading="isLoading"
    :is-saving-name="isSavingName"
    :is-saving-status="isSavingStatus"
    :presets="presets"
    :selected-preset-id="selectedPresetId"
    :selected-preset-name="selectedPresetName"
    :selected-watermark="selectedWatermark"
    :selected-watermark-name="selectedWatermarkName"
    :watermarks="watermarks"
    @go-back="goBack"
    @start-editing-name="startEditingName"
    @save-name="saveName"
    @cancel-editing-name="cancelEditingName"
    @handle-name-blur="handleNameBlur"
    @handle-status-change="handleStatusChange"
    @handle-date-change="handleDateChange"
    @handle-preset-change="handlePresetChange"
    @handle-watermark-change="handleWatermarkChange"
    @handle-preview="handlePreview"
    @handle-publish="handlePublish"
  >
    <template #sidebar>
      <!-- PHOTOS Section -->
      <div v-if="activeTab === 'photos' && !isSidebarCollapsed">
        <div class="flex items-center justify-between mb-4">
          <h2 :class="theme.textPrimary" class="text-sm font-bold">Media Sets</h2>
          <button
            :class="[
              'bg-teal-500 hover:bg-teal-600 text-white border-teal-600',
              'hover:shadow-md hover:scale-105 active:scale-95',
            ]"
            :disabled="isSavingSets"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm border disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleAddSet"
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
                <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Saving...</span>
              </div>
            </div>
          </Transition>
          <TransitionGroup class="space-y-2.5" name="set-list" tag="div">
            <div
              v-for="(set, index) in sortedMediaSets"
              :key="set.id"
              :class="[
                selectedSetId === set.id
                  ? 'bg-white dark:bg-gray-800/50 border-2 border-teal-200 dark:border-teal-800 shadow-sm scale-[1.01]'
                  : 'bg-white dark:bg-gray-800/50 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm hover:scale-[1.005]',
                draggedSetId === set.id ? 'opacity-50 scale-95' : '',
                dragOverIndex === index ? 'ring-2 ring-teal-500 ring-offset-2 scale-[1.02]' : '',
                isSavingSets ? 'opacity-60 pointer-events-none' : '',
              ]"
              :draggable="!isSavingSets"
              class="flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 ease-out cursor-move group relative overflow-hidden"
              @click="selectedSetId = set.id"
              @dragend="handleSetDragEnd"
              @dragleave="handleSetDragLeave"
              @dragstart="handleSetDragStart($event, set.id, index)"
              @drop="handleSetDrop($event, index)"
              @dragover.prevent="handleSetDragOver($event, index)"
            >
              <!-- Active indicator bar -->
              <Transition name="indicator">
                <div
                  v-if="selectedSetId === set.id"
                  class="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 dark:bg-teal-400 rounded-r-full transition-all duration-300"
                ></div>
              </Transition>

              <GripVertical
                :class="[
                  selectedSetId === set.id
                    ? 'text-teal-600 dark:text-teal-400'
                    : theme.textTertiary,
                  isSavingSets ? 'opacity-30 cursor-not-allowed' : '',
                ]"
                class="h-4 w-4 flex-shrink-0 opacity-50 transition-all duration-200 ml-1 hover:opacity-70 hover:scale-110"
              />
              <span
                v-if="!editingSetId || editingSetId !== set.id"
                :class="[
                  selectedSetId === set.id ? 'text-teal-700 dark:text-teal-300' : theme.textPrimary,
                ]"
                class="flex-1 text-xs font-bold tracking-wide truncate"
              >
                {{ set.name }}
              </span>
              <input
                v-else
                ref="setNameInputRef"
                v-model="editingSetName"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  'focus:border-teal-500',
                ]"
                class="flex-1 text-xs font-bold px-3 py-1.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
                @blur="saveSetName(set.id)"
                @keydown.enter="saveSetName(set.id)"
                @keydown.esc="cancelSetNameEdit"
                @click.stop
              />
              <span
                :class="[
                  selectedSetId === set.id
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400',
                ]"
                class="text-xs px-3 py-1.5 rounded-full font-bold min-w-[2.5rem] text-center transition-all duration-300 ease-out"
              >
                {{ set.count }}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button
                    :class="[
                      selectedSetId === set.id ? 'hover:bg-teal-100 dark:hover:bg-teal-900/30' : '',
                      theme.textSecondary,
                    ]"
                    :disabled="isSavingSets"
                    class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click.stop
                  >
                    <MoreVertical class="h-4 w-4 transition-transform duration-200" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent :class="[theme.bgDropdown, theme.borderSecondary]" align="end">
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    :disabled="isSavingSets"
                    @click="handleEditSet(set.id)"
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
                    @click="handleDeleteSet(set.id)"
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
          <div class="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 w-fit mx-auto mb-4 shadow-sm">
            <ImageIcon :class="theme.textTertiary" class="h-8 w-8 opacity-40" />
          </div>
          <p :class="theme.textPrimary" class="text-sm font-semibold mb-1.5">No sets yet</p>
          <p :class="theme.textTertiary" class="text-xs">
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
            <h3 :class="theme.textPrimary" class="text-sm font-bold mb-2">Design Settings</h3>
            <p :class="theme.textSecondary" class="text-xs mb-4">
              Customize the appearance and layout of your collection
            </p>
            <Button
              :class="[theme.borderSecondary, theme.bgButtonHover]"
              class="w-full"
              variant="outline"
              @click="router.push({ name: 'presetDesign', params: { name: 'default' } })"
            >
              <Paintbrush class="h-4 w-4 mr-2" />
              Open Design Editor
            </Button>
          </div>
          <div class="text-center py-8">
            <Paintbrush :class="theme.textTertiary" class="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p :class="theme.textPrimary" class="text-sm font-medium mb-1">Design customization</p>
            <p :class="theme.textTertiary" class="text-xs">
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
            <label :class="theme.textPrimary" class="block text-sm font-bold mb-2.5">
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
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  label="No preset"
                  value="none"
                >
                  No preset
                </SelectItem>
                <SelectItem
                  v-for="preset in presets"
                  :key="preset.id"
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  :label="preset.name"
                  :value="preset.id"
                >
                  {{ preset.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p :class="theme.textTertiary" class="text-xs mt-2 leading-relaxed">
              Apply a preset to automatically configure collection settings
            </p>
          </div>

          <!-- Watermark Selection -->
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="block text-sm font-bold mb-2.5">
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
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  label="No watermark"
                  value="none"
                >
                  No watermark
                </SelectItem>
                <SelectItem
                  v-for="watermark in watermarks"
                  :key="watermark.id"
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  :label="watermark.name"
                  :value="watermark.id"
                >
                  {{ watermark.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p :class="theme.textTertiary" class="text-xs mt-2 leading-relaxed">
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
            <h3 :class="theme.textPrimary" class="text-sm font-bold mb-2">Collection Activities</h3>
            <p :class="theme.textSecondary" class="text-xs mb-4">
              View and manage activities related to this collection
            </p>
          </div>
          <div class="text-center py-8">
            <Radio :class="theme.textTertiary" class="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p :class="theme.textPrimary" class="text-sm font-medium mb-1">No activities yet</p>
            <p :class="theme.textTertiary" class="text-xs">Activities will appear here</p>
          </div>
        </div>
      </div>
    </template>

    <template #content>
      <!-- Hidden File Input -->
      <input
        ref="fileInputRef"
        accept="image/*,video/*"
        class="hidden"
        multiple
        type="file"
        @change="handleFileSelect"
      />

      <!-- Main Content Area -->
      <main
        :class="isSidebarCollapsed ? 'ml-0' : ''"
        class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 transition-all duration-300"
      >
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textTertiary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm font-medium">Loading collection...</p>
          </div>
        </div>

        <div
          v-else
          :class="isSidebarCollapsed ? 'max-w-full' : 'max-w-[90rem] mx-auto'"
          class="p-8"
        >
          <!-- Content -->
          <!-- Section Header -->
          <div class="flex items-center justify-between mb-8">
            <h2 :class="theme.textPrimary" class="text-3xl font-bold tracking-tight">
              {{ selectedSet?.name || 'Highlights' }}
            </h2>
            <div class="flex items-center gap-3">
              <!-- Sort Menu -->
              <Popover v-model:open="isSortMenuOpen">
                <PopoverTrigger as-child>
                  <button
                    :class="[
                      theme.borderSecondary,
                      theme.bgCard,
                      isSortMenuOpen ? 'ring-2 ring-teal-500/20' : '',
                    ]"
                    class="p-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <ArrowUpDown :class="theme.textSecondary" class="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  :class="[theme.bgCard, theme.borderSecondary]"
                  align="end"
                  class="w-56 p-0"
                >
                  <div class="p-2">
                    <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">
                      Sort by
                    </p>
                    <div class="mt-1 space-y-0.5">
                      <button
                        v-for="option in sortOptions"
                        :key="option.value"
                        :class="[
                          sortOrder === option.value
                            ? theme.bgButtonHover + ' ' + theme.textPrimary
                            : theme.textPrimary + ' hover:' + theme.bgButtonHover,
                        ]"
                        class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors"
                        @click="handleSortChange(option.value)"
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
                    :class="[
                      theme.borderSecondary,
                      theme.bgCard,
                      isViewMenuOpen ? 'ring-2 ring-teal-500/20' : '',
                    ]"
                    class="p-2 rounded-lg border shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Grid3x3 :class="theme.textSecondary" class="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  :class="[theme.bgCard, theme.borderSecondary]"
                  align="end"
                  class="w-56 p-0"
                >
                  <div class="p-2 space-y-4">
                    <!-- Grid Size -->
                    <div>
                      <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">
                        Grid Size
                      </p>
                      <div class="mt-1 space-y-0.5">
                        <button
                          v-for="size in gridSizeOptions"
                          :key="size.value"
                          :class="[
                            gridSize === size.value
                              ? theme.bgButtonHover + ' ' + theme.textPrimary
                              : theme.textPrimary + ' hover:' + theme.bgButtonHover,
                          ]"
                          class="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between"
                          @click="handleGridSizeChange(size.value)"
                        >
                          <span>{{ size.label }}</span>
                          <Check v-if="gridSize === size.value" class="h-4 w-4 text-teal-500" />
                        </button>
                      </div>
                    </div>

                    <!-- Divider -->
                    <div :class="theme.borderSecondary" class="h-px"></div>

                    <!-- Show Filename -->
                    <div>
                      <p :class="theme.textTertiary" class="px-2 py-1.5 text-xs font-semibold">
                        Show
                      </p>
                      <div class="mt-1 px-2 py-1.5">
                        <div class="flex items-center justify-between">
                          <label :class="theme.textPrimary" class="text-sm">Filename</label>
                          <label class="relative inline-flex items-center cursor-pointer">
                            <input
                              :checked="showFilename"
                              class="sr-only peer"
                              type="checkbox"
                              @change="handleFilenameToggle"
                            />
                            <div
                              class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600"
                            ></div>
                            <span
                              :class="showFilename ? theme.textPrimary : theme.textSecondary"
                              class="ml-3 text-sm font-medium"
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
                :class="theme.borderSecondary"
                class="flex items-center gap-0.5 p-0.5 rounded-lg bg-white dark:bg-gray-900 border shadow-sm"
              >
                <button
                  :class="[
                    viewMode === 'list'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]"
                  class="p-2 rounded-md transition-all duration-200"
                  @click="viewMode = 'list'"
                >
                  <List class="h-4 w-4" />
                </button>
                <button
                  :class="[
                    viewMode === 'grid'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : theme.textSecondary + ' hover:bg-gray-100 dark:hover:bg-gray-800',
                  ]"
                  class="p-2 rounded-md transition-all duration-200"
                  @click="viewMode = 'grid'"
                >
                  <Grid3x3 class="h-4 w-4" />
                </button>
              </div>
              <!-- Select All Button - Always visible when there are items -->
              <Button
                v-if="sortedMediaItems.length > 0"
                :class="[
                  selectedMediaIds.size === sortedMediaItems.length && sortedMediaItems.length > 0
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
                    : theme.borderSecondary + ' ' + theme.bgCard + ' ' + theme.textPrimary,
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                ]"
                class="border-2 shadow-sm transition-all duration-200 font-medium"
                title="Select or deselect all items"
                @click="handleToggleSelectAll"
              >
                <CheckSquare2
                  v-if="
                    selectedMediaIds.size === sortedMediaItems.length && sortedMediaItems.length > 0
                  "
                  class="h-4 w-4 mr-2 text-teal-500"
                />
                <Square v-else :class="theme.textSecondary" class="h-4 w-4 mr-2" />
                <span class="font-semibold">{{
                  selectedMediaIds.size === sortedMediaItems.length && sortedMediaItems.length > 0
                    ? 'Deselect All'
                    : 'Select All'
                }}</span>
              </Button>
              <Button
                :disabled="isUploading"
                class="bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                @click="handleAddMedia"
              >
                <Loader2 v-if="isUploading" class="h-4 w-4 mr-2 animate-spin" />
                <ImagePlus v-else class="h-4 w-4 mr-2" />
                {{ isUploading ? 'Uploading...' : 'Add Media' }}
              </Button>
            </div>
          </div>

          <!-- Bulk Actions Bar -->
          <BulkActionsBar
            :is-all-selected="selectedMediaIds.size === sortedMediaItems.length"
            :is-favorite-loading="isBulkFavoriteLoading"
            :selected-count="selectedMediaIds.size"
            @delete="handleBulkDelete"
            @edit="handleBulkEdit"
            @favorite="handleBulkFavorite"
            @move="showMoveCopyModal = true"
            @tag="handleBulkTag"
            @view="handleBulkView"
            @watermark="handleBulkWatermark"
            @clear-selection="selectedMediaIds = new Set()"
            @select-all="handleToggleSelectAll"
          />

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
                  :class="
                    selectedMediaIds.has(item.id)
                      ? 'ring-2 ring-teal-500 ring-offset-2'
                      : 'hover:border-teal-300 dark:hover:border-teal-600'
                  "
                  class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <!-- Selection Checkbox -->
                  <div
                    :class="selectedMediaIds.has(item.id) ? 'opacity-100' : ''"
                    class="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    @click.stop="handleToggleMediaSelection(item.id)"
                  >
                    <button
                      class="p-1.5 rounded-md bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
                      @click.stop="handleToggleMediaSelection(item.id)"
                    >
                      <CheckSquare2
                        v-if="selectedMediaIds.has(item.id)"
                        class="h-5 w-5 text-teal-400"
                      />
                      <Square v-else class="h-5 w-5 text-white" />
                    </button>
                  </div>
                  <div class="w-full h-full cursor-pointer" @click="openMediaViewer(item)">
                    <img
                      :alt="item.title || 'Media'"
                      :src="item.thumbnail || item.url || placeholderImage"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      @error="handleImageError"
                    />
                  </div>
                  <!-- Context Menu Button -->
                  <div
                    class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                    @click.stop
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <button
                          class="p-1.5 rounded-md bg-black/60 hover:bg-black/80 backdrop-blur-md transition-all duration-200 shadow-lg hover:scale-110"
                          @click.stop
                        >
                          <MoreVertical class="h-4 w-4 text-white" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        :class="[theme.bgDropdown, theme.borderSecondary]"
                        align="end"
                        class="w-48"
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
                          v-if="item.originalUrl"
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleRemoveWatermark(item)"
                        >
                          <X class="h-4 w-4 mr-2" />
                          Remove Watermark
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                          @click.stop="handleWatermarkMedia(item)"
                        >
                          <Eye class="h-4 w-4 mr-2" />
                          {{ item.originalUrl ? 'Change Watermark' : 'Apply Watermark' }}
                        </DropdownMenuItem>
                        <div :class="theme.borderSecondary" class="h-px my-1"></div>
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
                  :class="theme.textPrimary"
                  class="text-xs font-medium truncate mt-2 text-center"
                >
                  {{ item.title }}
                </p>
              </div>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="item in sortedMediaItems"
                :key="item.id"
                :class="[
                  theme.borderSecondary,
                  selectedMediaIds.has(item.id)
                    ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/50 dark:bg-teal-900/20'
                    : 'hover:border-teal-300 dark:hover:border-teal-600',
                ]"
                class="group flex items-center gap-4 p-4 rounded-xl border bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-200"
              >
                <!-- Selection Checkbox -->
                <button
                  class="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  @click.stop="handleToggleMediaSelection(item.id)"
                >
                  <CheckSquare2
                    v-if="selectedMediaIds.has(item.id)"
                    class="h-5 w-5 text-teal-500"
                  />
                  <Square v-else :class="theme.textSecondary" class="h-5 w-5" />
                </button>
                <div
                  class="flex items-center gap-4 flex-1 cursor-pointer"
                  @click="openMediaViewer(item)"
                >
                  <img
                    :alt="item.title || 'Media'"
                    :src="item.thumbnail || item.url || placeholderImage"
                    class="w-20 h-20 object-cover rounded-lg shadow-sm"
                    @error="handleImageError"
                  />
                  <div class="flex-1 min-w-0">
                    <p
                      v-if="showFilename && item.title"
                      :class="theme.textPrimary"
                      class="text-sm font-medium truncate"
                    >
                      {{ item.title }}
                    </p>
                    <p v-else :class="theme.textTertiary" class="text-sm font-medium truncate">
                      Media Item
                    </p>
                    <p :class="theme.textTertiary" class="text-xs mt-1">
                      {{ formatMediaDate(item.createdAt) }}
                    </p>
                  </div>
                </div>
                <!-- Context Menu Button -->
                <div
                  class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  @click.stop
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <button
                        :class="theme.textSecondary"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                        @click.stop
                      >
                        <MoreVertical class="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      :class="[theme.bgDropdown, theme.borderSecondary]"
                      align="end"
                      class="w-48"
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
                        v-if="item.originalUrl"
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleRemoveWatermark(item)"
                      >
                        <X class="h-4 w-4 mr-2" />
                        Remove Watermark
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        @click.stop="handleWatermarkMedia(item)"
                      >
                        <Eye class="h-4 w-4 mr-2" />
                        {{ item.originalUrl ? 'Change Watermark' : 'Apply Watermark' }}
                      </DropdownMenuItem>
                      <div :class="theme.borderSecondary" class="h-px my-1"></div>
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
            :class="[
              theme.borderSecondary,
              isDragging
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 scale-[1.01] shadow-xl ring-4 ring-teal-500/20'
                : 'hover:border-teal-400 dark:hover:border-teal-600 hover:bg-gray-50 dark:hover:bg-gray-900/50',
            ]"
            class="border-2 border-dashed rounded-2xl p-20 text-center transition-all duration-300 bg-white dark:bg-gray-900"
            @dragleave="isDragging = false"
            @drop="handleDrop"
            @dragover.prevent="isDragging = true"
          >
            <div class="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto">
              <div
                :class="[
                  isDragging
                    ? 'bg-teal-100 dark:bg-teal-900/40 scale-110 ring-4 ring-teal-500/30'
                    : 'bg-gray-100 dark:bg-gray-800',
                ]"
                class="p-6 rounded-full transition-all duration-300"
              >
                <ImagePlus
                  :class="[
                    isDragging
                      ? 'text-teal-600 dark:text-teal-400 scale-110 rotate-6'
                      : theme.textTertiary,
                  ]"
                  class="h-12 w-12 transition-all duration-300"
                />
              </div>
              <div class="space-y-3">
                <p :class="theme.textPrimary" class="text-xl font-bold">
                  Drag photos and videos here to upload
                </p>
                <p :class="theme.textSecondary" class="text-sm">
                  or
                  <button
                    class="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 font-semibold underline underline-offset-4 transition-colors"
                    @click="handleBrowseFiles"
                  >
                    browse files
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Create/Edit Set Modal -->
      <CenterModal
        v-model="showCreateSetModal"
        :title="editingSetIdInModal ? 'EDIT PHOTO SET' : 'NEW PHOTO SET'"
        content-class="sm:max-w-[500px]"
      >
        <div class="space-y-6 py-4">
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold">
              Photo Set Name <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="newSetName"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              class="w-full"
              placeholder="e.g. Ceremony, Reception, Getting ready"
              @keydown.enter="handleCreateSet"
              @keydown.esc="handleCancelCreateSet"
            />
          </div>

          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Description </label>
            <Textarea
              v-model="newSetDescription"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              :maxlength="500"
              class="w-full min-h-[100px] resize-none"
              placeholder="Optional"
            />
            <div class="flex items-center justify-between">
              <p :class="theme.textTertiary" class="text-xs">
                Description is shown to clients viewing this photo set for additional storytelling.
              </p>
              <span :class="theme.textTertiary" class="text-xs">
                {{ newSetDescription.length }}/500
              </span>
            </div>
          </div>
        </div>

        <template #footer>
          <ActionButtonGroup
            :confirm-label="editingSetIdInModal ? 'Update' : 'Save'"
            :disabled="isCreatingSet"
            :loading="isCreatingSet"
            :loading-label="editingSetIdInModal ? 'Updating...' : 'Creating...'"
            cancel-label="Cancel"
            @cancel="handleCancelCreateSet"
            @confirm="handleCreateSet"
          />
        </template>
      </CenterModal>

      <!-- Delete Confirmation Modal -->
      <DeleteConfirmationModal
        v-model="showDeleteModal"
        :is-deleting="isDeleting"
        :item-name="getItemName(itemToDelete)"
        :title="getDeleteModalTitle()"
        :warning-message="getDeleteModalWarning()"
        description="This action cannot be undone."
        @cancel="closeDeleteModal"
        @confirm="handleConfirmDeleteItem"
      />

      <!-- Bulk Delete Confirmation Modal -->
      <DeleteConfirmationModal
        v-model="showBulkDeleteModal"
        :is-deleting="isBulkDeleteLoading"
        :item-name="`${selectedMediaIds.size} item${selectedMediaIds.size > 1 ? 's' : ''}`"
        :warning-message="`${selectedMediaIds.size} item${selectedMediaIds.size > 1 ? 's' : ''} will be permanently deleted.`"
        description="This action cannot be undone."
        title="Delete Media"
        @cancel="showBulkDeleteModal = false"
        @confirm="handleConfirmBulkDelete"
      />

      <!-- Edit Filename Modal -->
      <CenterModal v-model="showEditModal" content-class="sm:max-w-[500px]" title="EDIT FILENAMES">
        <div class="space-y-4 py-4">
          <p :class="theme.textSecondary" class="text-sm">
            Append text to {{ selectedMediaIds.size }} item{{
              selectedMediaIds.size > 1 ? 's' : ''
            }}
            filename{{ selectedMediaIds.size > 1 ? 's' : '' }}:
          </p>
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Text to Append </label>
            <Input
              v-model="editAppendText"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              class="w-full"
              placeholder="e.g., _edited, _final"
              @keydown.enter="handleConfirmEdit"
            />
            <p :class="theme.textTertiary" class="text-xs">
              This text will be appended to all selected filenames.
            </p>
          </div>
        </div>
        <template #footer>
          <ActionButtonGroup
            :disabled="!editAppendText.trim() || isBulkEditLoading"
            :loading="isBulkEditLoading"
            cancel-label="Cancel"
            confirm-label="Apply"
            @cancel="handleCancelEdit"
            @confirm="handleConfirmEdit"
          />
        </template>
      </CenterModal>

      <!-- Bulk Watermark Modal -->
      <CenterModal
        v-model="showBulkWatermarkModal"
        content-class="sm:max-w-[500px]"
        title="APPLY WATERMARK"
      >
        <div class="space-y-4 py-4">
          <p :class="theme.textSecondary" class="text-sm">
            Select a watermark to apply to {{ selectedMediaIds.size }} item{{
              selectedMediaIds.size > 1 ? 's' : ''
            }}:
          </p>
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Watermark </label>
            <Select v-model="selectedBulkWatermark">
              <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
                <SelectValue placeholder="Select a watermark" />
              </SelectTrigger>
              <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="none">
                  None
                </SelectItem>
                <SelectItem
                  v-for="watermark in watermarks"
                  :key="watermark.id"
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  :value="watermark.id"
                >
                  {{ watermark.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div
            v-if="selectedBulkWatermark === 'none'"
            class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <p class="text-xs text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Selecting "None" will remove any existing watermarks from the
              selected images.
            </p>
          </div>
        </div>
        <template #footer>
          <ActionButtonGroup
            :disabled="isBulkWatermarkLoading"
            :loading="isBulkWatermarkLoading"
            cancel-label="Cancel"
            confirm-label="Apply"
            loading-label="Applying watermark..."
            @cancel="handleCancelBulkWatermark"
            @confirm="handleConfirmBulkWatermark"
          />
        </template>
      </CenterModal>

      <!-- Tag Modal -->
      <CenterModal v-model="showTagModal" content-class="sm:max-w-[500px]" title="ADD TAGS">
        <div class="space-y-4 py-4">
          <p :class="theme.textSecondary" class="text-sm">
            Add tags to {{ selectedMediaIds.size }} item{{ selectedMediaIds.size > 1 ? 's' : '' }}:
          </p>
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Tags </label>
            <Input
              v-model="tagInput"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              class="w-full"
              placeholder="Enter tags separated by commas"
              @keydown.enter.prevent="handleAddTag"
            />
            <p :class="theme.textTertiary" class="text-xs">
              Separate multiple tags with commas (e.g., wedding, ceremony, outdoor)
            </p>
            <div v-if="existingTags.length > 0" class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="tag in existingTags"
                :key="tag"
                class="px-2 py-1 rounded-full text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
              >
                {{ tag }}
                <button
                  class="ml-1 hover:text-teal-900 dark:hover:text-teal-100"
                  @click="existingTags = existingTags.filter(t => t !== tag)"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>
        <template #footer>
          <ActionButtonGroup
            :disabled="(!tagInput.trim() && existingTags.length === 0) || isBulkTagLoading"
            :loading="isBulkTagLoading"
            cancel-label="Cancel"
            confirm-label="Add Tags"
            loading-label="Adding tags..."
            @cancel="handleCancelTag"
            @confirm="handleConfirmTag"
          />
        </template>
      </CenterModal>

      <!-- Duplicate Files Modal -->
      <CenterModal
        v-model="showDuplicateFilesModal"
        content-class="sm:max-w-[600px]"
        title="DUPLICATE FILES DETECTED"
      >
        <div class="space-y-4 py-4">
          <p :class="theme.textSecondary" class="text-sm">
            The following file{{ duplicateFiles.length > 1 ? 's' : '' }} already exist{{
              duplicateFiles.length === 1 ? 's' : ''
            }}
            in this set. Choose an action for each:
          </p>
          <div class="space-y-3 max-h-[400px] overflow-y-auto">
            <div
              v-for="item in duplicateFiles"
              :key="item.file.name"
              :class="[theme.bgInput, theme.borderSecondary]"
              class="flex items-center justify-between p-3 rounded-lg border"
            >
              <div class="flex-1 min-w-0">
                <p :class="theme.textPrimary" class="text-sm font-medium truncate">
                  {{ item.file.name }}
                </p>
                <p :class="theme.textTertiary" class="text-xs mt-1">
                  Existing: {{ item.existingMedia.title || item.file.name }}
                </p>
              </div>
              <div class="flex items-center gap-2 ml-4">
                <button
                  :class="
                    duplicateFileActions.get(item.file.name) === 'replace'
                      ? 'bg-teal-500 text-white border-teal-500'
                      : [
                          theme.bgInput,
                          theme.borderSecondary,
                          theme.textPrimary,
                          'hover:' + theme.bgButtonHover,
                        ]
                  "
                  class="px-3 py-1.5 text-xs rounded-lg border transition-colors"
                  @click="duplicateFileActions.set(item.file.name, 'replace')"
                >
                  Replace
                </button>
                <button
                  :class="
                    duplicateFileActions.get(item.file.name) === 'skip'
                      ? 'bg-gray-500 text-white border-gray-500'
                      : [
                          theme.bgInput,
                          theme.borderSecondary,
                          theme.textPrimary,
                          'hover:' + theme.bgButtonHover,
                        ]
                  "
                  class="px-3 py-1.5 text-xs rounded-lg border transition-colors"
                  @click="duplicateFileActions.set(item.file.name, 'skip')"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
          <div :class="theme.borderSecondary" class="flex items-center gap-2 pt-2 border-t">
            <button
              :class="[
                theme.bgInput,
                theme.borderSecondary,
                theme.textPrimary,
                'hover:' + theme.bgButtonHover,
              ]"
              class="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              @click="
                duplicateFiles.forEach(item => duplicateFileActions.set(item.file.name, 'replace'))
              "
            >
              Replace All
            </button>
            <button
              :class="[
                theme.bgInput,
                theme.borderSecondary,
                theme.textPrimary,
                'hover:' + theme.bgButtonHover,
              ]"
              class="text-xs px-3 py-1.5 rounded-lg border transition-colors"
              @click="
                duplicateFiles.forEach(item => duplicateFileActions.set(item.file.name, 'skip'))
              "
            >
              Skip All
            </button>
          </div>
        </div>
        <template #footer>
          <ActionButtonGroup
            :disabled="isUploading"
            :loading="isUploading"
            cancel-label="Cancel"
            confirm-label="Continue"
            loading-label="Uploading..."
            @cancel="handleCancelDuplicateFiles"
            @confirm="handleConfirmDuplicateFiles"
          />
        </template>
      </CenterModal>

      <!-- Rename Media Modal -->
      <CenterModal
        v-model="showRenameMediaModal"
        content-class="sm:max-w-[500px]"
        title="RENAME MEDIA"
      >
        <div class="space-y-4 py-4">
          <p :class="theme.textSecondary" class="text-sm">Enter a new name for this media item:</p>
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Name </label>
            <Input
              v-model="newMediaName"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              class="w-full"
              placeholder="Enter media name"
              @keydown.enter="handleConfirmRenameMedia"
            />
          </div>
        </div>
        <template #footer>
          <ActionButtonGroup
            :disabled="!newMediaName.trim()"
            cancel-label="Cancel"
            confirm-label="Rename"
            @cancel="handleCancelRenameMedia"
            @confirm="handleConfirmRenameMedia"
          />
        </template>
      </CenterModal>

      <!-- Replace Photo Modal -->
      <CenterModal
        v-model="showReplacePhotoModal"
        content-class="sm:max-w-[500px]"
        title="REPLACE PHOTO"
      >
        <div class="space-y-4 py-4">
          <p :class="theme.textSecondary" class="text-sm">
            Select a new image file to replace the current photo:
          </p>
          <div class="space-y-2">
            <input
              ref="replaceFileInputRef"
              accept="image/*"
              class="hidden"
              type="file"
              @change="handleReplacePhotoFileSelect"
            />
            <Button
              :disabled="isReplacingPhoto"
              class="w-full"
              variant="outline"
              @click="replaceFileInputRef?.click()"
            >
              <Loader2 v-if="isReplacingPhoto" class="h-4 w-4 mr-2 animate-spin" />
              <ImagePlus v-else class="h-4 w-4 mr-2" />
              {{ isReplacingPhoto ? 'Replacing...' : 'Choose Image File' }}
            </Button>
          </div>
        </div>
        <template #footer>
          <div class="flex items-center justify-end gap-3">
            <Button
              :disabled="isReplacingPhoto"
              variant="outline"
              @click="handleCancelReplacePhoto"
            >
              Cancel
            </Button>
          </div>
        </template>
      </CenterModal>

      <!-- Watermark Media Modal -->
      <CenterModal
        v-model="showWatermarkMediaModal"
        :title="mediaToWatermark?.originalUrl ? 'EDIT WATERMARK' : 'APPLY WATERMARK'"
        content-class="sm:max-w-[500px]"
      >
        <div class="space-y-4 py-4">
          <p :class="theme.textSecondary" class="text-sm">
            {{
              mediaToWatermark?.originalUrl
                ? 'This image has a watermark. Select a new watermark or remove it:'
                : 'Select a watermark to apply to this image:'
            }}
          </p>
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Watermark </label>
            <Select v-model="selectedWatermarkForMedia">
              <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
                <SelectValue placeholder="Select a watermark" />
              </SelectTrigger>
              <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                <SelectItem :class="[theme.textPrimary, theme.bgButtonHover]" value="none">
                  {{ mediaToWatermark?.originalUrl ? 'Remove Watermark' : 'None' }}
                </SelectItem>
                <SelectItem
                  v-for="watermark in watermarks"
                  :key="watermark.id"
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  :value="watermark.id"
                >
                  {{ watermark.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div
            v-if="mediaToWatermark?.originalUrl"
            class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <p class="text-xs text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Removing the watermark will restore the original image.
            </p>
          </div>
        </div>
        <template #footer>
          <ActionButtonGroup
            :confirm-label="
              selectedWatermarkForMedia === 'none' && mediaToWatermark?.originalUrl
                ? 'Remove'
                : 'Apply'
            "
            :disabled="isApplyingWatermark"
            :loading="isApplyingWatermark"
            cancel-label="Cancel"
            loading-label="Processing..."
            @cancel="handleCancelWatermarkMedia"
            @confirm="handleConfirmWatermarkMedia"
          />
        </template>
      </CenterModal>

      <!-- Move/Copy Modal -->
      <CenterModal
        v-model="showMoveCopyModal"
        :title="moveCopyAction === 'move' ? 'MOVE ITEMS' : 'COPY ITEMS'"
        content-class="sm:max-w-[500px]"
      >
        <div class="space-y-4 py-4">
          <!-- Action Type Selection -->
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Action </label>
            <div class="flex gap-2">
              <button
                :class="[
                  moveCopyAction === 'move'
                    ? 'bg-teal-500 text-white border-teal-500'
                    : theme.bgInput + ' ' + theme.borderSecondary + ' ' + theme.textPrimary,
                ]"
                class="flex-1 px-4 py-2 rounded-lg border-2 transition-all"
                @click="moveCopyAction = 'move'"
              >
                Move
              </button>
              <button
                :class="[
                  moveCopyAction === 'copy'
                    ? 'bg-teal-500 text-white border-teal-500'
                    : theme.bgInput + ' ' + theme.borderSecondary + ' ' + theme.textPrimary,
                ]"
                class="flex-1 px-4 py-2 rounded-lg border-2 transition-all"
                @click="moveCopyAction = 'copy'"
              >
                Copy
              </button>
            </div>
          </div>

          <p :class="theme.textSecondary" class="text-sm">
            {{ moveCopyAction === 'move' ? 'Move' : 'Copy' }} {{ selectedMediaIds.size }} item{{
              selectedMediaIds.size > 1 ? 's' : ''
            }}
            to:
          </p>

          <!-- Collection Selection -->
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold">
              Select Collection
            </label>
            <Select
              v-model="targetCollectionIdForMove"
              @update:model-value="handleTargetCollectionChange"
            >
              <SelectTrigger
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="w-full"
              >
                <SelectValue placeholder="Choose a collection" />
              </SelectTrigger>
              <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                <SelectItem
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  :label="collection?.name || 'Current Collection'"
                  :value="collection?.id || ''"
                >
                  {{ collection?.name || 'Current Collection' }}
                </SelectItem>
                <SelectItem
                  v-for="col in availableCollections"
                  :key="col.id"
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  :label="col.name"
                  :value="col.id"
                >
                  {{ col.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Set Selection (only show if collection is selected) -->
          <div v-if="targetCollectionIdForMove" class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Select Set </label>
            <Select v-model="targetSetIdInCollection" :disabled="isLoadingTargetCollectionSets">
              <SelectTrigger
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="w-full"
              >
                <SelectValue placeholder="Choose a set" />
              </SelectTrigger>
              <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                <SelectItem
                  v-if="targetCollectionSets.length === 0 && !isLoadingTargetCollectionSets"
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  disabled
                  label="No sets available"
                  value="none"
                >
                  No sets available
                </SelectItem>
                <SelectItem
                  v-for="set in targetCollectionSets"
                  :key="set.id"
                  :class="[theme.textPrimary, theme.bgButtonHover]"
                  :label="set.name"
                  :value="set.id"
                >
                  {{ set.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="isLoadingTargetCollectionSets" :class="theme.textTertiary" class="text-xs">
              Loading sets...
            </p>
          </div>
        </div>
        <template #footer>
          <ActionButtonGroup
            :confirm-label="moveCopyAction === 'move' ? 'Move' : 'Copy'"
            :disabled="isMovingMedia || !targetCollectionIdForMove"
            :loading="isMovingMedia"
            :loading-label="moveCopyAction === 'move' ? 'Moving...' : 'Copying...'"
            cancel-label="Cancel"
            @cancel="handleCancelMoveCopy"
            @confirm="handleConfirmMoveCopy"
          />
        </template>
      </CenterModal>

      <!-- Media Viewer Modal (Single) -->
      <div
        v-if="selectedMedia && !showMediaViewer"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
        @click="closeMediaViewer"
      >
        <div class="relative max-w-7xl max-h-full">
          <img
            :alt="selectedMedia.title || 'Media'"
            :src="selectedMedia.url || selectedMedia.thumbnail || placeholderImage"
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

      <!-- Media Viewer Slideshow (Multiple) -->
      <div
        v-if="showMediaViewer && selectedMediaForView.length > 0"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
        @click="closeMediaViewer"
      >
        <div class="relative max-w-7xl max-h-full w-full">
          <Transition mode="out-in" name="fade">
            <div :key="currentViewIndex" class="relative">
              <img
                :alt="selectedMediaForView[currentViewIndex].title || 'Media'"
                :src="
                  selectedMediaForView[currentViewIndex].url ||
                  selectedMediaForView[currentViewIndex].thumbnail ||
                  placeholderImage
                "
                class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl mx-auto"
                @error="handleImageError"
              />
            </div>
          </Transition>

          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
            @click.stop="closeMediaViewer"
          >
            <X class="w-6 h-6" />
          </button>

          <!-- Navigation Buttons (if more than one image) -->
          <template v-if="selectedMediaForView.length > 1">
            <button
              v-if="currentViewIndex > 0"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
              @click.stop="navigateSlideshow(-1)"
            >
              <ChevronLeft class="w-6 h-6" />
            </button>
            <button
              v-if="currentViewIndex < selectedMediaForView.length - 1"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
              @click.stop="navigateSlideshow(1)"
            >
              <ChevronsRight class="w-6 h-6" />
            </button>
          </template>

          <!-- Media Info -->
          <div
            class="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-black/70 backdrop-blur-md text-white max-w-md text-center"
          >
            <p class="font-semibold">
              {{ selectedMediaForView[currentViewIndex].title || 'Media' }}
            </p>
            <p v-if="selectedMediaForView.length > 1" class="text-sm opacity-90 mt-1">
              {{ currentViewIndex + 1 }} of {{ selectedMediaForView.length }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from '@/utils/debounce'
import {
  ArrowUpDown,
  Check,
  CheckSquare2,
  ChevronLeft,
  ChevronsRight,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileImage,
  Grid3x3,
  GripVertical,
  ImageIcon,
  ImagePlus,
  List,
  Loader2,
  MoreVertical,
  Move,
  Paintbrush,
  Pencil,
  Pencil as PencilIcon,
  Plus,
  Radio,
  Share2,
  Square,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import CollectionLayout from '@/components/organisms/CollectionLayout.vue'
import CenterModal from '@/components/molecules/CenterModal.vue'
import DeleteConfirmationModal from '@/components/organisms/DeleteConfirmationModal.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import BulkActionsBar from '@/components/molecules/BulkActionsBar.vue'
import { Input } from '@/components/shadcn/input'
import Textarea from '@/components/shadcn/Textarea.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useGalleryStore } from '@/stores/gallery'
import { useWatermarkStore } from '@/stores/watermark'
import { usePresetStore } from '@/stores/preset'
import { useDeleteConfirmation } from '@/composables/useDeleteConfirmation'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import type { Collection, MediaSet as ApiMediaSet } from '@/api/collections'
import { type MediaItem, useMediaApi } from '@/api/media'
import type { Watermark } from '@/api/watermarks'
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
// Sidebar collapse state with persistence
const { isSidebarCollapsed } = useSidebarCollapse()

// Handle navigation when switching tabs
watch(activeTab, (newTab: 'photos' | 'design' | 'settings' | 'activities') => {
  if (!collection.value) return

  // Navigate to Cover view when design tab is clicked
  if (newTab === 'design') {
    router.push({
      name: 'collectionCover',
      params: { uuid: collection.value.id },
    })
  }

  // Navigate to General Settings when settings tab is clicked
  if (newTab === 'settings') {
    router.push({
      name: 'collectionSettingsGeneral',
      params: { uuid: collection.value.id },
    })
  }

  // Navigate to Download Activity when activities tab is clicked
  if (newTab === 'activities') {
    router.push({
      name: 'collectionActivitiesDownload',
      params: { uuid: collection.value.id },
    })
  }
})
const selectedSetId = ref<string | null>(null)
const selectedWatermark = ref('none')
const selectedPresetId = ref<string>('none')
const isDragging = ref(false)
const viewMode = ref<'list' | 'grid'>('grid')
const gridSize = ref<'small' | 'large'>('small')
const showFilename = ref(true)
const selectedMediaIds = ref<Set<string>>(new Set())
const isBulkActionMenuOpen = ref(false)
const showMoveCopyModal = ref(false)
const moveCopyAction = ref<'move' | 'copy'>('move')
const targetSetIdForMove = ref<string>('')
const targetCollectionIdForMove = ref<string>('')
const targetSetIdInCollection = ref<string>('')
const isMovingMedia = ref(false)
const availableCollections = computed(() => {
  return galleryStore.collections.filter((c: Collection) => c.id !== collection.value?.id)
})
const targetCollectionSets = ref<MediaSet[]>([])
const isLoadingTargetCollectionSets = ref(false)
const isBulkFavoriteLoading = ref(false)
const isBulkTagLoading = ref(false)
const isBulkEditLoading = ref(false)
const isBulkDeleteLoading = ref(false)
const isUpdatingSetCounts = ref(false)
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
const selectedMediaForView = ref<MediaItem[]>([])
const currentViewIndex = ref(0)
const showMediaViewer = ref(false)
const showBulkDeleteModal = ref(false)
const showEditModal = ref(false)
const showTagModal = ref(false)
const showBulkWatermarkModal = ref(false)
const selectedBulkWatermark = ref<string>('none')
const isBulkWatermarkLoading = ref(false)
const editAppendText = ref('')
const tagInput = ref('')
const existingTags = ref<string[]>([])
const showDuplicateFilesModal = ref(false)
const duplicateFiles = ref<Array<{ file: File; existingMedia: MediaItem }>>([])
const filesToUpload = ref<File[]>([])
const duplicateFileActions = ref<Map<string, 'replace' | 'skip'>>(new Map())
const showRenameMediaModal = ref(false)
const mediaToRename = ref<MediaItem | null>(null)
const newMediaName = ref('')
const showReplacePhotoModal = ref(false)
const mediaToReplace = ref<MediaItem | null>(null)
const replaceFileInputRef = ref<HTMLInputElement | null>(null)
const isReplacingPhoto = ref(false)
const showWatermarkMediaModal = ref(false)
const mediaToWatermark = ref<MediaItem | null>(null)
const selectedWatermarkForMedia = ref<string>('none')
const isApplyingWatermark = ref(false)

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
} = useDeleteConfirmation<MediaSet | MediaItem>()

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
  isViewMenuOpen.value = false
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
  selectedMediaForView.value = []
  currentViewIndex.value = 0
  showMediaViewer.value = false
}

// Navigate slideshow
const navigateSlideshow = (direction: number) => {
  const newIndex = currentViewIndex.value + direction
  if (newIndex >= 0 && newIndex < selectedMediaForView.value.length) {
    currentViewIndex.value = newIndex
  }
}

// Handle keyboard navigation in slideshow
const handleSlideshowKeydown = (event: KeyboardEvent) => {
  if (!showMediaViewer.value) return

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    navigateSlideshow(-1)
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    navigateSlideshow(1)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeMediaViewer()
  }
}

// Watch for slideshow visibility to add/remove keyboard listeners
watch(showMediaViewer, (isOpen: boolean) => {
  if (isOpen) {
    document.addEventListener('keydown', handleSlideshowKeydown)
  } else {
    document.removeEventListener('keydown', handleSlideshowKeydown)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleSlideshowKeydown)
})

// Format date helper for media items (using existing formatDate for event dates)
const formatMediaDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Update set counts based on actual media items
const updateSetCounts = async (targetCollectionId?: string) => {
  const collectionId = targetCollectionId || collection.value?.id
  if (!collectionId) return

  isUpdatingSetCounts.value = true
  try {
    // Fetch all media for the collection
    const allMedia = await mediaApi.fetchCollectionMedia(collectionId)

    // If updating for current collection, update local sets
    if (collectionId === collection.value?.id) {
      mediaSets.value.forEach((set: MediaSet) => {
        const count = allMedia.filter(
          (m: MediaItem) => (m as MediaItem & { setId?: string }).setId === set.id
        ).length
        set.count = count
      })
      // Save updated counts
      await saveMediaSets()
    } else {
      // If updating for another collection, update that collection's sets in the store
      const targetCollection = galleryStore.collections.find(
        (c: Collection) => c.id === collectionId
      )
      if (targetCollection && targetCollection.mediaSets) {
        const updatedSets = targetCollection.mediaSets.map((set: ApiMediaSet) => {
          const count = allMedia.filter(
            (m: MediaItem) => (m as MediaItem & { setId?: string }).setId === set.id
          ).length
          return { ...set, count }
        })

        // Update the collection in the store
        await galleryStore.updateCollection(collectionId, {
          mediaSets: updatedSets,
        } as any)
      }
    }
  } catch (error) {
    console.error('Failed to update set counts:', error)
  } finally {
    isUpdatingSetCounts.value = false
  }
}

// Load media items for selected set
const loadMediaItems = async () => {
  if (!collection.value) {
    mediaItems.value = []
    return
  }

  isLoadingMedia.value = true
  try {
    // Fetch media for the selected set
    const items = await mediaApi.fetchCollectionMedia(
      collection.value.id,
      selectedSetId.value || undefined
    )
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
  // Show in media viewer instead of opening in new tab
  openMediaViewer(item)
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

const handleDownloadMedia = async (item: MediaItem) => {
  try {
    // Download the image as it currently is (with or without watermark)
    const downloadUrl = item.url || item.thumbnail || ''

    if (!downloadUrl) {
      toast.error('Download failed', {
        description: 'No image available to download.',
      })
      return
    }

    // Fetch the image as blob to handle data URLs and CORS
    let blob: Blob
    if (downloadUrl.startsWith('data:')) {
      // Data URL - convert to blob
      const response = await fetch(downloadUrl)
      blob = await response.blob()
    } else {
      // Regular URL - fetch with CORS handling
      try {
        const response = await fetch(downloadUrl, { mode: 'cors' })
        if (!response.ok) throw new Error('Failed to fetch')
        blob = await response.blob()
      } catch (error) {
        // Fallback: try to download directly
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = item.title || `media-${item.id}`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Download started', {
          description: 'Your download should start shortly.',
        })
        return
      }
    }

    // Create download link with proper filename
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // Get file extension from original filename or default to jpg
    const filename = item.title || `media-${item.id}`
    const extension = filename.includes('.')
      ? filename.substring(filename.lastIndexOf('.'))
      : '.jpg'
    link.download = filename.endsWith(extension) ? filename : `${filename}${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success('Download started', {
      description: 'Your download should start shortly.',
    })
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Download failed', {
      description: 'An error occurred while downloading the image.',
    })
  }
}

const handleMoveCopy = (item: MediaItem) => {
  // Select the single item and open the move/copy modal
  selectedMediaIds.value.clear()
  selectedMediaIds.value.add(item.id)
  moveCopyAction.value = 'move'
  showMoveCopyModal.value = true
  if (collection.value) {
    targetCollectionIdForMove.value = collection.value.id
    handleTargetCollectionChange(collection.value.id)
  }
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
  mediaToRename.value = item
  newMediaName.value = item.title || item.id
  showRenameMediaModal.value = true
}

const handleCancelRenameMedia = () => {
  showRenameMediaModal.value = false
  mediaToRename.value = null
  newMediaName.value = ''
}

const handleConfirmRenameMedia = async () => {
  if (!mediaToRename.value || !newMediaName.value.trim()) return

  try {
    await mediaApi.updateMedia(mediaToRename.value.id, {
      title: newMediaName.value.trim(),
    })

    // Update local item
    const index = mediaItems.value.findIndex((m: MediaItem) => m.id === mediaToRename.value?.id)
    if (index !== -1) {
      mediaItems.value[index].title = newMediaName.value.trim()
    }

    showRenameMediaModal.value = false
    mediaToRename.value = null
    newMediaName.value = ''

    toast.success('Media renamed', {
      description: 'The media item has been renamed.',
    })
  } catch (error) {
    console.error('Failed to rename media:', error)
    toast.error('Failed to rename media', {
      description: 'An error occurred while renaming the media item.',
    })
  }
}

const handleReplacePhoto = (item: MediaItem) => {
  if (item.type !== 'image') {
    toast.error('Invalid media type', {
      description: 'Only images can be replaced.',
    })
    return
  }
  mediaToReplace.value = item
  showReplacePhotoModal.value = true
}

const handleCancelReplacePhoto = () => {
  showReplacePhotoModal.value = false
  mediaToReplace.value = null
  if (replaceFileInputRef.value) {
    replaceFileInputRef.value.value = ''
  }
}

const handleReplacePhotoFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0 || !mediaToReplace.value) return

  const file = files[0]
  if (!file.type.startsWith('image/')) {
    toast.error('Invalid file type', {
      description: 'Please select an image file.',
    })
    return
  }

  isReplacingPhoto.value = true
  try {
    // Get watermark if selected
    let watermark: Watermark | null = null
    if (selectedWatermark.value && selectedWatermark.value !== 'none') {
      try {
        watermark = await watermarkStore.fetchWatermark(selectedWatermark.value)
      } catch (error) {
        console.error('Failed to fetch watermark:', error)
      }
    }

    // Create thumbnail
    const thumbnail = await createThumbnail(file, watermark || undefined)
    const initialUrl = thumbnail

    // Update media item
    await mediaApi.updateMedia(mediaToReplace.value.id, {
      url: initialUrl,
      thumbnail,
      title: file.name.replace(/\.[^/.]+$/, '') || mediaToReplace.value.title,
    })

    // Update local item
    const index = mediaItems.value.findIndex((m: MediaItem) => m.id === mediaToReplace.value?.id)
    if (index !== -1) {
      mediaItems.value[index].url = initialUrl
      mediaItems.value[index].thumbnail = thumbnail
      mediaItems.value[index].title =
        file.name.replace(/\.[^/.]+$/, '') || mediaToReplace.value.title
    }

    // Process full image with watermark in background
    ;(async () => {
      try {
        let fullUrl = await fileToDataURL(file)
        if (watermark) {
          fullUrl = await applyWatermarkToImage(fullUrl, watermark)
        }

        // Update the media item with the full image URL
        const updateIndex = mediaItems.value.findIndex(
          (m: MediaItem) => m.id === mediaToReplace.value?.id
        )
        if (updateIndex !== -1) {
          mediaItems.value[updateIndex].url = fullUrl
          await mediaApi.updateMedia(mediaToReplace.value.id, {
            url: fullUrl,
          })
        }
      } catch (error) {
        console.error('Error processing full image:', error)
      }
    })()

    showReplacePhotoModal.value = false
    mediaToReplace.value = null
    if (replaceFileInputRef.value) {
      replaceFileInputRef.value.value = ''
    }

    toast.success('Photo replaced', {
      description: 'The photo has been replaced successfully.',
    })
  } catch (error) {
    console.error('Failed to replace photo:', error)
    toast.error('Failed to replace photo', {
      description: 'An error occurred while replacing the photo.',
    })
  } finally {
    isReplacingPhoto.value = false
  }
}

const handleWatermarkMedia = (item: MediaItem) => {
  if (item.type !== 'image') {
    toast.error('Invalid media type', {
      description: 'Watermarks can only be applied to images.',
    })
    return
  }
  mediaToWatermark.value = item
  // Check if image already has a watermark (has originalUrl stored)
  // If it does, we're editing/removing, otherwise we're adding
  selectedWatermarkForMedia.value = item.originalUrl ? 'none' : 'none' // Start with 'none' to allow removal
  showWatermarkMediaModal.value = true
}

const handleCancelWatermarkMedia = () => {
  showWatermarkMediaModal.value = false
  mediaToWatermark.value = null
  selectedWatermarkForMedia.value = 'none'
}

const handleRemoveWatermark = async (item: MediaItem) => {
  if (item.type !== 'image') {
    toast.error('Invalid media type', {
      description: 'Watermarks can only be removed from images.',
    })
    return
  }

  if (!item.originalUrl) {
    toast.info('No watermark', {
      description: 'This image does not have a watermark.',
    })
    return
  }

  isApplyingWatermark.value = true
  try {
    // Restore original image
    await mediaApi.updateMedia(item.id, {
      url: item.originalUrl,
      originalUrl: undefined, // Clear originalUrl since we're removing watermark
      thumbnail: undefined, // Remove watermarked thumbnail
    })

    // Update local item
    const index = mediaItems.value.findIndex((m: MediaItem) => m.id === item.id)
    if (index !== -1) {
      mediaItems.value[index].url = item.originalUrl
      mediaItems.value[index].originalUrl = undefined
      mediaItems.value[index].thumbnail = undefined
    }

    toast.success('Watermark removed', {
      description: 'The watermark has been removed and the original image restored.',
    })
  } catch (error) {
    console.error('Failed to remove watermark:', error)
    toast.error('Failed to remove watermark', {
      description:
        error instanceof Error ? error.message : 'An error occurred while removing the watermark.',
    })
  } finally {
    isApplyingWatermark.value = false
  }
}

const handleConfirmWatermarkMedia = async () => {
  if (!mediaToWatermark.value) return

  isApplyingWatermark.value = true
  try {
    let watermark: Watermark | null = null
    if (selectedWatermarkForMedia.value && selectedWatermarkForMedia.value !== 'none') {
      try {
        watermark = await watermarkStore.fetchWatermark(selectedWatermarkForMedia.value)
        if (!watermark) {
          throw new Error('Watermark not found')
        }
      } catch (error) {
        console.error('Failed to fetch watermark:', error)
        toast.error('Failed to fetch watermark', {
          description: 'The selected watermark could not be loaded.',
        })
        return
      }
    }

    // If removing watermark and we have originalUrl, restore it
    if (!watermark && mediaToWatermark.value.originalUrl) {
      // Restore original image
      await mediaApi.updateMedia(mediaToWatermark.value.id, {
        url: mediaToWatermark.value.originalUrl,
        originalUrl: undefined, // Clear originalUrl since we're removing watermark
        thumbnail: undefined, // Remove watermarked thumbnail
      })

      // Update local item
      const index = mediaItems.value.findIndex(
        (m: MediaItem) => m.id === mediaToWatermark.value?.id
      )
      if (index !== -1) {
        mediaItems.value[index].url = mediaToWatermark.value.originalUrl
        mediaItems.value[index].originalUrl = undefined
        mediaItems.value[index].thumbnail = undefined
      }

      showWatermarkMediaModal.value = false
      mediaToWatermark.value = null
      selectedWatermarkForMedia.value = 'none'

      toast.success('Watermark removed', {
        description: 'The watermark has been removed and the original image restored.',
      })
      return
    }

    // Applying watermark - need to get the original image
    // Use originalUrl if available, otherwise current URL is the original
    let originalImageUrl = mediaToWatermark.value.originalUrl || mediaToWatermark.value.url
    let imageUrl = originalImageUrl

    // If the URL is not a data URL, we need to fetch it first
    if (!imageUrl || !imageUrl.startsWith('data:')) {
      try {
        // Try to fetch the image and convert to data URL
        const urlToFetch = imageUrl || mediaToWatermark.value.thumbnail || ''
        if (urlToFetch) {
          const response = await fetch(urlToFetch, { mode: 'cors' })
          if (response.ok) {
            const blob = await response.blob()
            imageUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(blob)
            })
          }
        }
      } catch (error) {
        console.warn('Could not fetch image for watermarking, using existing URL:', error)
        // If fetch fails, try to use the URL directly
        if (!imageUrl) {
          imageUrl = mediaToWatermark.value.thumbnail || mediaToWatermark.value.url || ''
        }
      }
    }

    if (!imageUrl) {
      throw new Error('No image URL available for watermarking')
    }

    // Apply watermark to the original image
    if (!watermark) {
      throw new Error('Watermark is required when applying')
    }

    const watermarkedUrl = await applyWatermarkToImage(imageUrl, watermark)

    // Store original URL if not already stored
    const originalUrlToStore = mediaToWatermark.value.originalUrl || originalImageUrl

    // Update media item with watermarked URL and preserve original
    await mediaApi.updateMedia(mediaToWatermark.value.id, {
      url: watermarkedUrl,
      originalUrl: originalUrlToStore, // Store original for future removal
    })

    // Update local item
    const index = mediaItems.value.findIndex((m: MediaItem) => m.id === mediaToWatermark.value?.id)
    if (index !== -1) {
      mediaItems.value[index].url = watermarkedUrl
      mediaItems.value[index].originalUrl = originalUrlToStore

      // Also update thumbnail with watermark
      if (mediaToWatermark.value.type === 'image') {
        try {
          const watermarkedThumbnail = await applyWatermarkToImage(imageUrl, watermark)
          mediaItems.value[index].thumbnail = watermarkedThumbnail
          await mediaApi.updateMedia(mediaToWatermark.value.id, {
            thumbnail: watermarkedThumbnail,
          })
        } catch (error) {
          console.warn('Could not create watermarked thumbnail:', error)
        }
      }
    }

    showWatermarkMediaModal.value = false
    mediaToWatermark.value = null
    selectedWatermarkForMedia.value = 'none'

    toast.success('Watermark applied', {
      description: 'The watermark has been applied to the image.',
    })
  } catch (error) {
    console.error('Failed to apply watermark:', error)
    toast.error('Failed to apply watermark', {
      description:
        error instanceof Error ? error.message : 'An error occurred while applying the watermark.',
    })
  } finally {
    isApplyingWatermark.value = false
  }
}

const handleDeleteMedia = (item: MediaItem) => {
  if (!item) return
  openDeleteModal({ id: item.id, name: item.title || 'Media Item' } as any)
}

const getDeleteModalTitle = () => {
  if (!itemToDelete.value) return 'Delete'
  const item = itemToDelete.value as any
  return item.collectionId ? 'Delete Media' : 'Delete Photo Set'
}

const getDeleteModalWarning = () => {
  if (!itemToDelete.value) return 'This action cannot be undone.'
  const item = itemToDelete.value as any
  return item.collectionId
    ? 'This media item will be permanently deleted.'
    : 'This photo set will be permanently removed from your collection.'
}

const handleConfirmDeleteItem = async () => {
  console.log(itemToDelete.value)
  if (!itemToDelete.value) return

  const item = itemToDelete.value as any

  console.log(item.collectionId)

  // Check if it's a MediaSet or MediaItem
  if (item.collectionId) {
    // It's a MediaItem
    try {
      await mediaApi.deleteMedia(item.id)
      // Remove from local array
      const index = mediaItems.value.findIndex((m: MediaItem) => m.id === item.id)
      if (index !== -1) {
        mediaItems.value.splice(index, 1)
        // Update set counts based on actual media
        await updateSetCounts()
      }
      // Remove from selection if selected
      selectedMediaIds.value.delete(item.id)
      closeDeleteModal()
      toast.success('Media deleted', {
        description: 'The media item has been deleted.',
      })
    } catch (error) {
      console.error('Failed to delete media:', error)
      toast.error('Failed to delete media', {
        description: 'An error occurred while deleting the media item.',
      })
    }
  } else {
    // It's a MediaSet - call the existing handler
    await handleConfirmDeleteSet()
  }
}

// Selection handlers
const handleToggleMediaSelection = (mediaId: string) => {
  // Create a new Set to ensure reactivity
  const newSet = new Set(selectedMediaIds.value)
  if (newSet.has(mediaId)) {
    newSet.delete(mediaId)
  } else {
    newSet.add(mediaId)
  }
  selectedMediaIds.value = newSet
}

const handleToggleSelectAll = () => {
  const allItemIds = sortedMediaItems.value.map((item: MediaItem) => item.id)

  if (allItemIds.length === 0) {
    toast.info('No items', {
      description: 'There are no items to select.',
    })
    return
  }

  // Check if all items are selected by comparing sizes and verifying all IDs are in the set
  const allSelected =
    selectedMediaIds.value.size === allItemIds.length &&
    allItemIds.every((id: string) => selectedMediaIds.value.has(id))

  if (allSelected) {
    // Deselect all - create new Set to trigger reactivity
    selectedMediaIds.value = new Set()
    toast.success('Deselected all', {
      description: 'All items have been deselected.',
    })
  } else {
    // Select all - create new Set with all IDs to trigger reactivity
    selectedMediaIds.value = new Set(allItemIds)
    toast.success('Selected all', {
      description: `${allItemIds.length} item${allItemIds.length > 1 ? 's' : ''} selected.`,
    })
  }
}

// Bulk action handlers
const handleBulkDelete = () => {
  if (selectedMediaIds.value.size === 0) return
  showBulkDeleteModal.value = true
}

const handleConfirmBulkDelete = async () => {
  if (selectedMediaIds.value.size === 0) return

  const count = selectedMediaIds.value.size
  const idsToDelete = Array.from(selectedMediaIds.value)

  isBulkDeleteLoading.value = true
  try {
    for (const id of idsToDelete) {
      await mediaApi.deleteMedia(id as string)
      const index = mediaItems.value.findIndex((m: MediaItem) => m.id === id)
      if (index !== -1) {
        mediaItems.value.splice(index, 1)
      }
    }
    await updateSetCounts()
    selectedMediaIds.value.clear()
    showBulkDeleteModal.value = false
    toast.success('Media deleted', {
      description: `${count} item${count > 1 ? 's' : ''} deleted successfully.`,
    })
  } catch (error) {
    console.error('Failed to delete media:', error)
    toast.error('Failed to delete media', {
      description: 'An error occurred while deleting the media items.',
    })
  } finally {
    isBulkDeleteLoading.value = false
  }
}

const handleBulkMoveToSet = async (targetSetId: string) => {
  if (selectedMediaIds.value.size === 0 || !collection.value || !targetSetId) return

  const idsToMove = Array.from(selectedMediaIds.value)
  const count = idsToMove.length

  isMovingMedia.value = true
  try {
    // Update media items' setId via API
    for (const id of idsToMove) {
      await mediaApi.updateMedia(id as string, { setId: targetSetId })
    }

    // Reload media items to reflect changes
    await loadMediaItems()

    // Update set counts
    await updateSetCounts()

    selectedMediaIds.value.clear()
    targetSetIdForMove.value = ''

    toast.success('Media moved', {
      description: `${count} item${count > 1 ? 's' : ''} moved to set successfully.`,
    })
  } catch (error) {
    console.error('Failed to move media:', error)
    toast.error('Failed to move media', {
      description: 'An error occurred while moving the media items.',
    })
  } finally {
    isMovingMedia.value = false
  }
}

// Initialize target collection to current collection when modal opens
watch(showMoveCopyModal, (isOpen: boolean) => {
  if (isOpen && collection.value) {
    targetCollectionIdForMove.value = collection.value.id
    handleTargetCollectionChange(collection.value.id)
  } else if (!isOpen) {
    // Reset on close
    targetCollectionIdForMove.value = ''
    targetSetIdInCollection.value = ''
    targetCollectionSets.value = []
    moveCopyAction.value = 'move'
  }
})

const handleTargetCollectionChange = async (collectionId: string) => {
  if (!collectionId) {
    targetCollectionSets.value = []
    targetSetIdInCollection.value = ''
    return
  }

  isLoadingTargetCollectionSets.value = true
  try {
    // If it's the current collection, use local mediaSets
    if (collectionId === collection.value?.id) {
      targetCollectionSets.value = mediaSets.value.map((set: MediaSet) => ({
        id: set.id,
        name: set.name,
        description: set.description,
        count: set.count || 0,
        order: set.order ?? 0,
      }))
    } else {
      // Fetch the target collection to get its sets
      const targetCollection = galleryStore.collections.find(
        (c: Collection) => c.id === collectionId
      )
      if (targetCollection && targetCollection.mediaSets) {
        targetCollectionSets.value = targetCollection.mediaSets.map((set: ApiMediaSet) => ({
          id: set.id,
          name: set.name,
          description: set.description,
          count: set.count || 0,
          order: set.order ?? 0,
        }))
      } else {
        targetCollectionSets.value = []
      }
    }
    // Reset set selection when collection changes
    targetSetIdInCollection.value = ''
  } catch (error) {
    console.error('Failed to load collection sets:', error)
    targetCollectionSets.value = []
  } finally {
    isLoadingTargetCollectionSets.value = false
  }
}

const handleCancelMoveCopy = () => {
  showMoveCopyModal.value = false
  targetCollectionIdForMove.value = collection.value?.id || ''
  targetSetIdInCollection.value = ''
  targetCollectionSets.value = []
  moveCopyAction.value = 'move'
}

const handleConfirmMoveCopy = () => {
  if (targetCollectionIdForMove.value) {
    if (moveCopyAction.value === 'move') {
      handleBulkMoveToCollection(
        targetCollectionIdForMove.value,
        targetSetIdInCollection.value || undefined
      )
    } else {
      handleBulkCopyToCollection(
        targetCollectionIdForMove.value,
        targetSetIdInCollection.value || undefined
      )
    }
  }
}

const handleBulkMoveToCollection = async (targetCollectionId: string, targetSetId?: string) => {
  if (selectedMediaIds.value.size === 0 || !collection.value || !targetCollectionId) return

  const idsToMove = Array.from(selectedMediaIds.value)
  const count = idsToMove.length

  isMovingMedia.value = true
  try {
    // Update media items' collectionId and setId via API
    for (const id of idsToMove) {
      await mediaApi.updateMedia(String(id), {
        collectionId: targetCollectionId,
        setId: targetSetId || undefined,
      })
    }

    // If moving within same collection, just update the set
    if (targetCollectionId === collection.value.id) {
      await loadMediaItems()
    } else {
      // Remove moved items from current view if moving to different collection
      mediaItems.value = mediaItems.value.filter((m: MediaItem) => !idsToMove.includes(m.id))
    }

    // Update set counts
    await updateSetCounts()

    selectedMediaIds.value.clear()
    handleCancelMoveCopy()

    toast.success('Media moved', {
      description: `${count} item${count > 1 ? 's' : ''} moved successfully.`,
    })
  } catch (error) {
    console.error('Failed to move media:', error)
    toast.error('Failed to move media', {
      description: 'An error occurred while moving the media items.',
    })
  } finally {
    isMovingMedia.value = false
  }
}

const handleBulkCopyToCollection = async (targetCollectionId: string, targetSetId?: string) => {
  if (selectedMediaIds.value.size === 0 || !collection.value || !targetCollectionId) return

  const idsToCopy = Array.from(selectedMediaIds.value)
  const count = idsToCopy.length

  isMovingMedia.value = true
  try {
    const copiedItems: MediaItem[] = []

    // Copy media items by creating new ones in the target collection
    for (const id of idsToCopy) {
      const originalItem = mediaItems.value.find((m: MediaItem) => m.id === id)
      if (originalItem) {
        try {
          const copiedItem = await mediaApi.addMedia(targetCollectionId, {
            url: originalItem.url,
            thumbnail: originalItem.thumbnail,
            type: originalItem.type,
            title: originalItem.title,
            description: originalItem.description,
            order: originalItem.order,
            setId: targetSetId || undefined,
          })
          copiedItems.push(copiedItem)
        } catch (itemError: any) {
          // If quota exceeded, stop copying and show error
          if (
            itemError?.message?.includes('quota exceeded') ||
            itemError?.message?.includes('QuotaExceededError')
          ) {
            throw new Error(
              'Storage quota exceeded. Please delete some old media or reduce file sizes before copying.'
            )
          }
          throw itemError
        }
      }
    }

    // Update set counts for both source and target collections
    await updateSetCounts() // Update current collection
    if (targetCollectionId !== collection.value.id) {
      await updateSetCounts(targetCollectionId) // Update target collection
    }

    // If copying within the same collection and to the same set, add to local view
    if (targetCollectionId === collection.value.id && targetSetId === selectedSetId.value) {
      // Add copied items to the current view
      copiedItems.forEach(item => {
        if (!mediaItems.value.find((m: MediaItem) => m.id === item.id)) {
          mediaItems.value.push(item)
        }
      })
    } else if (targetCollectionId === collection.value.id) {
      // If copying to different set in same collection, reload to refresh counts
      await loadMediaItems()
    }

    selectedMediaIds.value.clear()
    handleCancelMoveCopy()

    toast.success('Media copied', {
      description: `${copiedItems.length} of ${count} item${count > 1 ? 's' : ''} copied successfully.`,
    })
  } catch (error: any) {
    console.error('Failed to copy media:', error)
    const errorMessage = error?.message || 'An error occurred while copying the media items.'
    toast.error('Failed to copy media', {
      description: errorMessage,
      duration: 5000,
    })
  } finally {
    isMovingMedia.value = false
  }
}

// Bulk action handlers
const handleBulkFavorite = async () => {
  if (selectedMediaIds.value.size === 0) return

  const ids = Array.from(selectedMediaIds.value)
  const count = ids.length

  isBulkFavoriteLoading.value = true
  try {
    // Toggle favorite status for selected items
    for (const id of ids) {
      const item = mediaItems.value.find((m: MediaItem) => m.id === id)
      if (item) {
        // For now, we'll use a custom property to track favorite status
        // In a real app, this would be stored in the backend
        const isFavorite = (item as any).isFavorite || false
        await mediaApi.updateMedia(String(id), {
          ...item,
          isFavorite: !isFavorite,
        } as any)
      }
    }

    await loadMediaItems()
    toast.success('Favorite updated', {
      description: `${count} item${count > 1 ? 's' : ''} favorite status updated.`,
    })
  } catch (error) {
    console.error('Failed to update favorite:', error)
    toast.error('Failed to update favorite', {
      description: 'An error occurred while updating favorite status.',
    })
  } finally {
    isBulkFavoriteLoading.value = false
  }
}

const handleBulkView = () => {
  if (selectedMediaIds.value.size === 0) return

  const ids = Array.from(selectedMediaIds.value)
  const items = mediaItems.value.filter((m: MediaItem) => ids.includes(m.id))

  // Filter to only images for preview
  const imageItems = items.filter((item: MediaItem) => item.type === 'image')

  if (imageItems.length === 0) {
    toast.info('No images to view', {
      description: 'Selected items do not contain any images.',
    })
    return
  }

  selectedMediaForView.value = imageItems
  currentViewIndex.value = 0
  showMediaViewer.value = true
}

const handleBulkTag = () => {
  if (selectedMediaIds.value.size === 0) return
  // Collect existing tags from selected items
  const ids = Array.from(selectedMediaIds.value)
  const items = mediaItems.value.filter((m: MediaItem) => ids.includes(m.id))
  const allTags = new Set<string>()
  items.forEach((item: MediaItem) => {
    const tags = (item as any).tags || []
    if (Array.isArray(tags)) {
      tags.forEach((tag: string) => allTags.add(tag))
    }
  })
  existingTags.value = Array.from(allTags)
  tagInput.value = ''
  showTagModal.value = true
}

const handleCancelTag = () => {
  showTagModal.value = false
  tagInput.value = ''
  existingTags.value = []
}

const handleAddTag = () => {
  if (!tagInput.value.trim()) return
  const tags = tagInput.value
    .split(',')
    .map((t: string) => t.trim())
    .filter((t: string) => t)
  tags.forEach((tag: string) => {
    if (!existingTags.value.includes(tag)) {
      existingTags.value.push(tag)
    }
  })
  tagInput.value = ''
}

const handleConfirmTag = async () => {
  if (selectedMediaIds.value.size === 0) return

  const ids = Array.from(selectedMediaIds.value)
  const tagsToAdd = existingTags.value

  isBulkTagLoading.value = true
  try {
    for (const id of ids) {
      const item = mediaItems.value.find((m: MediaItem) => m.id === id)
      if (item) {
        const currentTags = (item as any).tags || []
        const updatedTags = [...new Set([...currentTags, ...tagsToAdd])]
        await mediaApi.updateMedia(String(id), {
          ...item,
          tags: updatedTags,
        } as any)
      }
    }

    await loadMediaItems()
    showTagModal.value = false
    tagInput.value = ''
    existingTags.value = []
    toast.success('Tags added', {
      description: `Tags added to ${ids.length} item${ids.length > 1 ? 's' : ''}.`,
    })
  } catch (error) {
    console.error('Failed to add tags:', error)
    toast.error('Failed to add tags', {
      description: 'An error occurred while adding tags.',
    })
  } finally {
    isBulkTagLoading.value = false
  }
}

const handleBulkEdit = () => {
  if (selectedMediaIds.value.size === 0) return
  editAppendText.value = ''
  showEditModal.value = true
}

const handleBulkWatermark = () => {
  if (selectedMediaIds.value.size === 0) return
  selectedBulkWatermark.value = 'none'
  showBulkWatermarkModal.value = true
}

const handleCancelBulkWatermark = () => {
  showBulkWatermarkModal.value = false
  selectedBulkWatermark.value = 'none'
}

const handleConfirmBulkWatermark = async () => {
  if (selectedMediaIds.value.size === 0) return

  isBulkWatermarkLoading.value = true
  try {
    const ids = Array.from(selectedMediaIds.value)
    const items = mediaItems.value.filter((m: MediaItem) => ids.includes(m.id))
    const imageItems = items.filter((item: MediaItem) => item.type === 'image')

    if (imageItems.length === 0) {
      toast.error('No images selected', {
        description: 'Watermarks can only be applied to images.',
      })
      return
    }

    let watermark: Watermark | null = null
    if (selectedBulkWatermark.value && selectedBulkWatermark.value !== 'none') {
      try {
        watermark = await watermarkStore.fetchWatermark(selectedBulkWatermark.value)
        if (!watermark) {
          throw new Error('Watermark not found')
        }
      } catch (error) {
        console.error('Failed to fetch watermark:', error)
        toast.error('Failed to fetch watermark', {
          description: 'The selected watermark could not be loaded.',
        })
        return
      }
    }

    let successCount = 0
    let errorCount = 0

    for (const item of imageItems) {
      try {
        // Get original image URL (before watermark was applied)
        let originalImageUrl = item.originalUrl || item.url
        let imageUrl = originalImageUrl

        // If the URL is not a data URL, we need to fetch it first
        if (!imageUrl || !imageUrl.startsWith('data:')) {
          try {
            const urlToFetch = imageUrl || item.thumbnail || ''
            if (urlToFetch) {
              const response = await fetch(urlToFetch, { mode: 'cors' })
              if (response.ok) {
                const blob = await response.blob()
                imageUrl = await new Promise<string>((resolve, reject) => {
                  const reader = new FileReader()
                  reader.onload = () => resolve(reader.result as string)
                  reader.onerror = reject
                  reader.readAsDataURL(blob)
                })
              }
            }
          } catch (error) {
            console.warn('Could not fetch image for watermarking:', item.id, error)
            if (!imageUrl) {
              imageUrl = item.thumbnail || item.url || ''
            }
          }
        }

        if (!imageUrl) {
          errorCount++
          continue
        }

        if (!watermark && item.originalUrl) {
          // Removing watermark - restore original
          await mediaApi.updateMedia(item.id, {
            url: item.originalUrl,
            originalUrl: undefined,
            thumbnail: undefined,
          })

          const index = mediaItems.value.findIndex((m: MediaItem) => m.id === item.id)
          if (index !== -1) {
            mediaItems.value[index].url = item.originalUrl
            mediaItems.value[index].originalUrl = undefined
            mediaItems.value[index].thumbnail = undefined
          }
          successCount++
        } else if (watermark) {
          // Applying watermark
          const watermarkedUrl = await applyWatermarkToImage(imageUrl, watermark)
          const originalUrlToStore = item.originalUrl || originalImageUrl

          await mediaApi.updateMedia(item.id, {
            url: watermarkedUrl,
            originalUrl: originalUrlToStore,
          })

          const index = mediaItems.value.findIndex((m: MediaItem) => m.id === item.id)
          if (index !== -1) {
            mediaItems.value[index].url = watermarkedUrl
            mediaItems.value[index].originalUrl = originalUrlToStore

            // Update thumbnail with watermark
            try {
              const watermarkedThumbnail = await applyWatermarkToImage(imageUrl, watermark)
              mediaItems.value[index].thumbnail = watermarkedThumbnail
              await mediaApi.updateMedia(item.id, {
                thumbnail: watermarkedThumbnail,
              })
            } catch (error) {
              console.warn('Could not create watermarked thumbnail:', item.id, error)
            }
          }
          successCount++
        } else {
          // No watermark selected and no existing watermark - skip
          successCount++
        }
      } catch (error) {
        console.error('Failed to apply watermark to item:', item.id, error)
        errorCount++
      }
    }

    showBulkWatermarkModal.value = false
    selectedBulkWatermark.value = 'none'

    if (errorCount > 0) {
      toast.warning('Watermark applied with errors', {
        description: `Applied to ${successCount} item${successCount > 1 ? 's' : ''}, ${errorCount} failed.`,
      })
    } else {
      toast.success('Watermark applied', {
        description: `Watermark applied to ${successCount} item${successCount > 1 ? 's' : ''}.`,
      })
    }
  } catch (error) {
    console.error('Failed to apply bulk watermark:', error)
    toast.error('Failed to apply watermark', {
      description:
        error instanceof Error ? error.message : 'An error occurred while applying the watermark.',
    })
  } finally {
    isBulkWatermarkLoading.value = false
  }
}

const handleCancelEdit = () => {
  showEditModal.value = false
  editAppendText.value = ''
}

const handleConfirmEdit = async () => {
  if (selectedMediaIds.value.size === 0 || !editAppendText.value.trim()) return

  const ids = Array.from(selectedMediaIds.value)
  const appendText = editAppendText.value.trim()

  isBulkEditLoading.value = true
  try {
    for (const id of ids) {
      const item = mediaItems.value.find((m: MediaItem) => m.id === id)
      if (item) {
        // Get filename without extension
        const currentTitle = item.title || `media-${item.id}`
        const parts = currentTitle.split('.')
        const extension = parts.length > 1 ? '.' + parts.pop() : ''
        const nameWithoutExt = parts.join('.')
        const newTitle = nameWithoutExt + appendText + extension

        await mediaApi.updateMedia(String(id), {
          ...item,
          title: newTitle,
        })
      }
    }

    await loadMediaItems()
    showEditModal.value = false
    editAppendText.value = ''
    toast.success('Filenames updated', {
      description: `Appended "${appendText}" to ${ids.length} item${ids.length > 1 ? 's' : ''}.`,
    })
  } catch (error) {
    console.error('Failed to update filenames:', error)
    toast.error('Failed to update filenames', {
      description: 'An error occurred while updating filenames.',
    })
  } finally {
    isBulkEditLoading.value = false
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
    await router.push({ name: 'manageCollections' })
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
      await router.push({ name: 'manageCollections' })
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
    // Handle null, undefined, or missing presetId
    const presetId = (collectionData as any).presetId
    selectedPresetId.value = presetId != null ? String(presetId) : 'none'

    // Set watermark if available (assuming collection has watermarkId field)
    // Handle null, undefined, or missing watermarkId
    const watermarkId = (collectionData as any).watermarkId
    selectedWatermark.value = watermarkId != null ? String(watermarkId) : 'none'

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

    // Update set counts based on actual media
    await updateSetCounts()
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
        // Update local state to reflect changes (only if not currently saving to avoid race conditions)
        if (!isSavingPreset.value) {
          const newPresetId = (updatedCollection as any).presetId
          selectedPresetId.value = newPresetId != null ? String(newPresetId) : 'none'
        }
        if (!isSavingWatermark.value) {
          const newWatermarkId = (updatedCollection as any).watermarkId
          selectedWatermark.value = newWatermarkId != null ? String(newWatermarkId) : 'none'
        }
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
watch(
  selectedSetId,
  (newSetId: string | null) => {
    if (newSetId && collection.value) {
      loadMediaItems()
    }
  },
  { immediate: false }
)

// Load watermarks and presets
onMounted(async () => {
  await loadCollection()
  // loadCollection sets selectedSetId, which will trigger loadMediaItems via watch
  // But we also call it explicitly here to ensure media loads even if watch doesn't fire
  if (selectedSetId.value) {
    await loadMediaItems()
  }
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

  console.log(mediaSets.value)

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

// Convert file to data URL
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Get watermark position coordinates
const getWatermarkPosition = (
  position: string,
  canvasWidth: number,
  canvasHeight: number,
  watermarkWidth: number,
  watermarkHeight: number
) => {
  const positions: Record<string, { x: number; y: number }> = {
    'top-left': { x: canvasWidth * 0.2, y: canvasHeight * 0.2 },
    top: { x: canvasWidth * 0.5, y: canvasHeight * 0.2 },
    'top-right': { x: canvasWidth * 0.8, y: canvasHeight * 0.2 },
    left: { x: canvasWidth * 0.2, y: canvasHeight * 0.5 },
    center: { x: canvasWidth * 0.5, y: canvasHeight * 0.5 },
    right: { x: canvasWidth * 0.8, y: canvasHeight * 0.5 },
    'bottom-left': { x: canvasWidth * 0.2, y: canvasHeight * 0.8 },
    bottom: { x: canvasWidth * 0.5, y: canvasHeight * 0.8 },
    'bottom-right': { x: canvasWidth * 0.8, y: canvasHeight * 0.8 },
  }
  const pos = positions[position] || positions.center
  // Center the watermark at the position
  return {
    x: pos.x - watermarkWidth / 2,
    y: pos.y - watermarkHeight / 2,
  }
}

// Apply font style to canvas context
const applyFontStyle = (
  ctx: CanvasRenderingContext2D,
  style: string,
  fontSize: number,
  fontFamily: string
) => {
  const styles = style.split('-')
  const weight = styles.includes('bold') ? 'bold' : 'normal'
  const italic = styles.includes('italic') ? 'italic' : 'normal'
  ctx.font = `${weight} ${italic} ${fontSize}px ${fontFamily}`
}

// Apply watermark to image
const applyWatermarkToImage = async (
  imageDataUrl: string,
  watermark: Watermark
): Promise<string> => {
  // Guard against null watermark
  if (!watermark) {
    throw new Error('Watermark is required')
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      // Draw the original image
      ctx.drawImage(img, 0, 0)

      // Apply watermark
      ctx.save()
      ctx.globalAlpha = (watermark.opacity || 50) / 100

      if (watermark.type === 'text' && watermark.text) {
        // Text watermark - scale based on smaller dimension to ensure it fits
        const minDimension = Math.min(img.width, img.height)
        // Scale is a percentage (0-100), so we use it to determine size relative to image
        // Max font size should be around 5-10% of the smaller dimension
        const maxFontSize = minDimension * 0.1 // 10% of smaller dimension as max
        const fontSize = Math.min(Math.max((minDimension * watermark.scale) / 100, 12), maxFontSize)
        const fontFamily = watermark.fontFamily || 'Arial'

        // Apply font style
        if (watermark.fontStyle) {
          applyFontStyle(ctx, watermark.fontStyle, fontSize, fontFamily)
        } else {
          ctx.font = `${fontSize}px ${fontFamily}`
        }

        ctx.fillStyle = watermark.fontColor || '#FFFFFF'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Apply text transform
        let text = watermark.text
        if (watermark.textTransform === 'uppercase') {
          text = text.toUpperCase()
        } else if (watermark.textTransform === 'lowercase') {
          text = text.toLowerCase()
        } else if (watermark.textTransform === 'capitalize') {
          text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
        }

        // Measure text for positioning
        let metrics = ctx.measureText(text)
        let textWidth = metrics.width
        let actualFontSize = fontSize
        const textHeight = fontSize * (watermark.lineHeight || 1.2)
        const padding = watermark.padding || 0

        // Ensure text doesn't exceed 80% of canvas width
        const maxTextWidth = canvas.width * 0.8
        if (textWidth > maxTextWidth) {
          // Scale down font size proportionally if text is too wide
          const scaleFactor = maxTextWidth / textWidth
          actualFontSize = fontSize * scaleFactor
          // Reapply font with adjusted size
          if (watermark.fontStyle) {
            applyFontStyle(ctx, watermark.fontStyle, actualFontSize, fontFamily)
          } else {
            ctx.font = `${actualFontSize}px ${fontFamily}`
          }
          // Remeasure with new font size
          metrics = ctx.measureText(text)
          textWidth = metrics.width
        }

        const totalWidth = textWidth + padding * 2
        const totalHeight = actualFontSize * (watermark.lineHeight || 1.2) + padding * 2

        // Draw background if specified
        if (watermark.backgroundColor) {
          const borderRadius = watermark.borderRadius || 0
          const pos = getWatermarkPosition(
            watermark.position,
            canvas.width,
            canvas.height,
            totalWidth,
            totalHeight
          )

          ctx.fillStyle = watermark.backgroundColor
          if (borderRadius > 0) {
            ctx.beginPath()
            // Use roundRect if available, otherwise use arc
            if (typeof (ctx as any).roundRect === 'function') {
              ;(ctx as any).roundRect(pos.x, pos.y, totalWidth, totalHeight, borderRadius)
            } else {
              // Fallback: draw rounded rectangle using arcs
              const x = pos.x
              const y = pos.y
              const w = totalWidth
              const h = totalHeight
              const r = borderRadius
              ctx.moveTo(x + r, y)
              ctx.lineTo(x + w - r, y)
              ctx.quadraticCurveTo(x + w, y, x + w, y + r)
              ctx.lineTo(x + w, y + h - r)
              ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
              ctx.lineTo(x + r, y + h)
              ctx.quadraticCurveTo(x, y + h, x, y + h - r)
              ctx.lineTo(x, y + r)
              ctx.quadraticCurveTo(x, y, x + r, y)
              ctx.closePath()
            }
            ctx.fill()
          } else {
            ctx.fillRect(pos.x, pos.y, totalWidth, totalHeight)
          }
        }

        // Draw border if specified
        if (watermark.borderWidth && watermark.borderWidth > 0) {
          const pos = getWatermarkPosition(
            watermark.position,
            canvas.width,
            canvas.height,
            totalWidth,
            totalHeight
          )
          ctx.strokeStyle = watermark.borderColor || '#000000'
          ctx.lineWidth = watermark.borderWidth
          ctx.setLineDash(
            watermark.borderStyle === 'dashed'
              ? [5, 5]
              : watermark.borderStyle === 'dotted'
                ? [2, 2]
                : []
          )
          const borderRadius = watermark.borderRadius || 0
          if (borderRadius > 0) {
            ctx.beginPath()
            // Use roundRect if available, otherwise use arc
            if (typeof (ctx as any).roundRect === 'function') {
              ;(ctx as any).roundRect(pos.x, pos.y, totalWidth, totalHeight, borderRadius)
            } else {
              // Fallback: draw rounded rectangle using arcs
              const x = pos.x
              const y = pos.y
              const w = totalWidth
              const h = totalHeight
              const r = borderRadius
              ctx.moveTo(x + r, y)
              ctx.lineTo(x + w - r, y)
              ctx.quadraticCurveTo(x + w, y, x + w, y + r)
              ctx.lineTo(x + w, y + h - r)
              ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
              ctx.lineTo(x + r, y + h)
              ctx.quadraticCurveTo(x, y + h, x, y + h - r)
              ctx.lineTo(x, y + r)
              ctx.quadraticCurveTo(x, y, x + r, y)
              ctx.closePath()
            }
            ctx.stroke()
          } else {
            ctx.strokeRect(pos.x, pos.y, totalWidth, totalHeight)
          }
        }

        // Draw text
        ctx.fillStyle = watermark.fontColor || '#FFFFFF'
        const pos = getWatermarkPosition(
          watermark.position,
          canvas.width,
          canvas.height,
          totalWidth,
          totalHeight
        )
        ctx.fillText(text, pos.x + totalWidth / 2, pos.y + totalHeight / 2)
      } else if (watermark.type === 'image' && watermark.imageUrl) {
        // Image watermark - scale based on target image size
        const watermarkImg = new Image()
        watermarkImg.crossOrigin = 'anonymous'
        watermarkImg.onload = () => {
          // Calculate scale based on target image size, not watermark's original size
          const minDimension = Math.min(img.width, img.height)
          // Scale is a percentage (0-100), use it to determine max size relative to image
          // Max watermark size should be around 20-30% of the smaller dimension
          const maxWatermarkSize = minDimension * 0.25 // 25% of smaller dimension as max
          const scale = watermark.scale / 100

          // Calculate desired size based on scale percentage
          const desiredWidth = watermarkImg.width * scale
          const desiredHeight = watermarkImg.height * scale

          // Ensure watermark doesn't exceed max size while maintaining aspect ratio
          let watermarkWidth = desiredWidth
          let watermarkHeight = desiredHeight

          if (watermarkWidth > maxWatermarkSize || watermarkHeight > maxWatermarkSize) {
            const aspectRatio = watermarkImg.width / watermarkImg.height
            if (watermarkWidth > watermarkHeight) {
              watermarkWidth = maxWatermarkSize
              watermarkHeight = maxWatermarkSize / aspectRatio
            } else {
              watermarkHeight = maxWatermarkSize
              watermarkWidth = maxWatermarkSize * aspectRatio
            }
          }

          const pos = getWatermarkPosition(
            watermark.position,
            canvas.width,
            canvas.height,
            watermarkWidth,
            watermarkHeight
          )

          ctx.drawImage(watermarkImg, pos.x, pos.y, watermarkWidth, watermarkHeight)
          ctx.restore()
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        }
        watermarkImg.onerror = reject
        watermarkImg.src = watermark.imageUrl
        return
      }

      ctx.restore()
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }
    img.onerror = reject
    img.src = imageDataUrl
  })
}

// Create thumbnail for image
const createThumbnail = (file: File, watermark?: Watermark): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve('')
      return
    }

    const reader = new FileReader()
    reader.onload = async e => {
      try {
        const img = new Image()
        img.onload = async () => {
          const canvas = document.createElement('canvas')
          const maxSize = 400
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            let thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8)

            // Apply watermark to thumbnail if provided
            if (watermark) {
              thumbnailDataUrl = await applyWatermarkToImage(thumbnailDataUrl, watermark)
            }

            resolve(thumbnailDataUrl)
          } else {
            resolve((e.target?.result as string) || '')
          }
        }
        img.onerror = reject
        img.src = e.target?.result as string
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const processFiles = async (files: File[]) => {
  if (!selectedSetId.value || !collection.value) {
    toast.error('No set selected', {
      description: 'Please select a media set first.',
    })
    return
  }

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

  // Check for duplicate file names in the current set
  const duplicates: Array<{ file: File; existingMedia: MediaItem }> = []
  const newFiles: File[] = []

  for (const file of validFiles) {
    const fileName = file.name.toLowerCase()
    const existingMedia = mediaItems.value.find((m: MediaItem) => {
      const mediaTitle = (m.title || '').toLowerCase()
      // Check if the title matches the filename (with or without extension)
      return (
        mediaTitle === fileName ||
        mediaTitle === fileName.replace(/\.[^/.]+$/, '') ||
        mediaTitle + file.name.substring(file.name.lastIndexOf('.')) === fileName
      )
    })

    if (existingMedia) {
      duplicates.push({ file, existingMedia })
    } else {
      newFiles.push(file)
    }
  }

  // If there are duplicates, show modal to ask user what to do
  if (duplicates.length > 0) {
    duplicateFiles.value = duplicates
    filesToUpload.value = newFiles
    duplicateFileActions.value = new Map()
    // Default action: skip all duplicates
    duplicates.forEach(({ file }) => {
      duplicateFileActions.value.set(file.name, 'skip')
    })
    showDuplicateFilesModal.value = true
    return
  }

  // No duplicates, proceed with upload
  await uploadFiles(validFiles)
}

const handleConfirmDuplicateFiles = async () => {
  showDuplicateFilesModal.value = false

  // Collect files to upload: new files + files to replace
  const filesToProcess: File[] = [...filesToUpload.value]

  for (const { file, existingMedia } of duplicateFiles.value) {
    const action = duplicateFileActions.value.get(file.name) || 'skip'
    if (action === 'replace') {
      filesToProcess.push(file)
      try {
        await mediaApi.deleteMedia(existingMedia.id)
        const index = mediaItems.value.findIndex((m: MediaItem) => m.id === existingMedia.id)
        if (index !== -1) {
          mediaItems.value.splice(index, 1)
        }
      } catch (error) {
        console.error('Failed to delete existing media:', error)
      }
    }
  }

  if (filesToProcess.length > 0) {
    await uploadFiles(filesToProcess)
  } else {
    toast.info('No files to upload', {
      description: 'All files were skipped.',
    })
  }
}

const handleCancelDuplicateFiles = () => {
  showDuplicateFilesModal.value = false
  duplicateFiles.value = []
  filesToUpload.value = []
  duplicateFileActions.value.clear()
}

const uploadFiles = async (files: File[]) => {
  if (!selectedSetId.value || !collection.value) {
    return
  }

  isUploading.value = true

  try {
    // Get watermark if selected
    let watermark: Watermark | null = null
    if (selectedWatermark.value && selectedWatermark.value !== 'none') {
      try {
        watermark = await watermarkStore.fetchWatermark(selectedWatermark.value)
      } catch (error) {
        console.error('Failed to fetch watermark:', error)
      }
    }

    // Process each file and save to mock data
    const uploadedItems: MediaItem[] = []

    for (const file of files) {
      try {
        // Determine media type
        const type = file.type.startsWith('image/') ? 'image' : 'video'

        // Get filename without extension for title
        const fileName = file.name.replace(/\.[^/.]+$/, '')

        if (file.type.startsWith('image/')) {
          // For images: create thumbnail first for immediate display
          const thumbnail = await createThumbnail(file, watermark || undefined)

          // Use thumbnail as initial URL for instant display
          // Process full image in background
          const initialUrl = thumbnail

          const newMedia = await mediaApi.addMedia(collection.value.id, {
            url: initialUrl,
            thumbnail,
            type,
            title: fileName || `Media ${Date.now()}`,
            order: mediaItems.value.length,
            setId: selectedSetId.value || undefined,
          })

          // Add to local array immediately for instant display
          mediaItems.value.push(newMedia)
          uploadedItems.push(newMedia)

          // Process full image with watermark in background and update
          ;(async () => {
            try {
              // Get original image first (before watermark)
              const originalImageUrl = await fileToDataURL(file)

              let fullUrl = originalImageUrl
              if (watermark) {
                // Apply watermark to original
                fullUrl = await applyWatermarkToImage(originalImageUrl, watermark)

                // Store original URL for future removal
                await mediaApi.updateMedia(newMedia.id, {
                  originalUrl: originalImageUrl,
                })
              }

              // Update the media item with the full image URL
              const index = mediaItems.value.findIndex((m: MediaItem) => m.id === newMedia.id)
              if (index !== -1) {
                mediaItems.value[index].url = fullUrl
                if (watermark) {
                  mediaItems.value[index].originalUrl = originalImageUrl
                }
              }
            } catch (error) {
              console.error('Error processing full image:', file.name, error)
            }
          })()
        } else {
          // For videos: just convert to data URL
          const url = await fileToDataURL(file)

          const newMedia = await mediaApi.addMedia(collection.value.id, {
            url,
            thumbnail: undefined,
            originalUrl: undefined, // Videos don't get watermarks
            type,
            title: fileName || `Media ${Date.now()}`,
            order: mediaItems.value.length,
            setId: selectedSetId.value || undefined,
          })

          uploadedItems.push(newMedia)
          mediaItems.value.push(newMedia)
        }
      } catch (error) {
        console.error('Error processing file:', file.name, error)
      }
    }

    if (uploadedItems.length === 0) {
      toast.error('Upload failed', {
        description: 'No files were successfully uploaded.',
      })
      isUploading.value = false
      return
    }

    // Update set counts based on actual media (more accurate than incrementing)
    await updateSetCounts()

    toast.success('Files uploaded', {
      description: `${uploadedItems.length} file(s) uploaded successfully.`,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
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
  // Normalize current value for comparison (handle undefined/null)
  const currentPresetId = selectedPresetId.value || 'none'

  // Only skip if the value is truly the same (but still allow setting to 'none' explicitly)
  if (presetIdStr === currentPresetId && presetIdStr !== 'none') {
    isPresetPopoverOpen.value = false
    return
  }

  // Set the value immediately for responsive UI
  selectedPresetId.value = presetIdStr

  isSavingPreset.value = true
  isPresetPopoverOpen.value = false
  try {
    const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
      presetId: presetIdStr === 'none' ? undefined : presetIdStr,
    } as any)

    if (updatedCollection) {
      collection.value = updatedCollection
      // Ensure the value is set correctly (handle null/undefined as 'none')
      const newPresetId = (updatedCollection as any).presetId
      selectedPresetId.value = newPresetId != null ? String(newPresetId) : 'none'
    } else {
      // Update local collection
      ;(collection.value as any).presetId = presetIdStr === 'none' ? undefined : presetIdStr
      // Value already set above
    }

    // Auto-save: no toast notification for preset changes
  } catch (error: any) {
    toast.error('Failed to update preset', {
      description: error.message || 'An error occurred',
    })
    // Revert on error
    const errorPresetId = (collection.value as any)?.presetId
    selectedPresetId.value = errorPresetId != null ? String(errorPresetId) : 'none'
  } finally {
    isSavingPreset.value = false
  }
}

const handleWatermarkChange = async (watermarkId: any) => {
  if (!collection.value) return

  const watermarkIdStr = String(watermarkId)
  // Normalize current value for comparison (handle undefined/null)
  const currentWatermarkId = selectedWatermark.value || 'none'

  // Only skip if the value is truly the same (but still allow setting to 'none' explicitly)
  if (watermarkIdStr === currentWatermarkId && watermarkIdStr !== 'none') {
    isWatermarkPopoverOpen.value = false
    return
  }

  // Set the value immediately for responsive UI
  selectedWatermark.value = watermarkIdStr

  isSavingWatermark.value = true
  isWatermarkPopoverOpen.value = false
  try {
    const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
      watermarkId: watermarkIdStr === 'none' ? undefined : watermarkIdStr,
    } as any)

    if (updatedCollection) {
      collection.value = updatedCollection
      // Ensure the value is set correctly (handle null/undefined as 'none')
      const newWatermarkId = (updatedCollection as any).watermarkId
      selectedWatermark.value = newWatermarkId != null ? String(newWatermarkId) : 'none'
    } else {
      // Update local collection
      ;(collection.value as any).watermarkId =
        watermarkIdStr === 'none' ? undefined : watermarkIdStr
      // Value already set above
    }

    // Auto-save: no toast notification for watermark changes
  } catch (error: any) {
    toast.error('Failed to update watermark', {
      description: error.message || 'An error occurred',
    })
    // Revert on error
    const errorWatermarkId = (collection.value as any)?.watermarkId
    selectedWatermark.value = errorWatermarkId != null ? String(errorWatermarkId) : 'none'
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

/* Slide up transition for bulk actions bar */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
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

/* Slide up transition for bulk actions bar */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
