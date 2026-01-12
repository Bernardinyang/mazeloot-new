<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Loading State -->
    <div v-if="isLoading && !showEmailModal" class="flex items-center justify-center min-h-screen">
      <Loader2 class="h-8 w-8 animate-spin text-gray-400" />
    </div>

    <!-- Email Authentication Modal -->
    <Dialog v-if="showEmailModal && !isAuthenticatedOwner && !isPreviewMode" :open="true">
      <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
            Email Required
          </DialogTitle>
          <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
            Please enter your email address to access this raw files phase.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 mt-6">
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Email Address </label>
            <Input
              v-model="emailInput"
              :class="[theme.bgInput, theme.borderInput, theme.textInput]"
              :disabled="isGeneratingToken"
              class="w-full"
              placeholder="your.email@example.com"
              type="email"
              @keydown.enter.prevent="handleSubmitEmail"
            />
            <p v-if="emailError" class="text-xs text-red-600 dark:text-red-400">
              {{ emailError }}
            </p>
            <p :class="theme.textSecondary" class="text-xs">
              Your email will be used to generate an access token for this raw files phase.
            </p>
          </div>
        </div>

        <DialogFooter class="mt-6">
          <Button
            type="button"
            :disabled="isGeneratingToken || !emailInput || !isValidEmail"
            :style="{
              backgroundColor: rawFilesColor,
            }"
            class="text-white"
            :loading="isGeneratingToken"
            loading-label="Generating Access..."
            @click.prevent="handleSubmitEmail"
            @mouseenter="e => (e.target.style.backgroundColor = getRawFilesHoverColor())"
            @mouseleave="e => (e.target.style.backgroundColor = rawFilesColor)"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Password Protection Modal -->
    <Dialog
      v-else-if="
        rawFiles &&
        rawFiles.hasPassword &&
        !isPasswordVerified &&
        !isAuthenticatedOwner &&
        !isPreviewMode
      "
      :open="true"
    >
      <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
            Password Required
          </DialogTitle>
          <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
            This selection is password protected. Please enter the password to continue.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 mt-6">
          <div class="space-y-2">
            <label :class="theme.textPrimary" class="text-sm font-semibold"> Password </label>
            <PasswordInput
              v-model="passwordInput"
              :input-class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'w-full focus:ring-2 focus:ring-accent/20 transition-all',
              ]"
              :disabled="isVerifyingPassword"
              placeholder="Enter password"
              @keydown.enter="handleVerifyPassword"
            />
            <p v-if="passwordError" class="text-xs text-red-600 dark:text-red-400">
              {{ passwordError }}
            </p>
          </div>
        </div>

        <DialogFooter class="mt-6">
          <Button
            :disabled="isVerifyingPassword || !passwordInput"
            :style="{
              backgroundColor: rawFilesColor,
            }"
            class="text-white"
            :loading="isVerifyingPassword"
            loading-label="Verifying..."
            @click="handleVerifyPassword"
            @mouseenter="e => (e.target.style.backgroundColor = getRawFilesHoverColor())"
            @mouseleave="e => (e.target.style.backgroundColor = rawFilesColor)"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Main Content -->
    <div v-else-if="rawFiles" :class="[fontFamilyClass, fontStyleClass]" class="min-h-screen">
      <!-- Hero Section with Cover Photo - Full Height -->
      <div class="relative w-full h-screen">
        <!-- Logo (Top Left) -->
        <div class="absolute top-4 left-4 md:top-6 md:left-6 z-20">
          <div v-if="isLoadingBranding" class="h-14 w-32 flex items-center justify-center">
            <Loader2
              :class="[
                'h-5 w-5 animate-spin',
                selection.coverPhotoUrl || selection.cover_photo_url || shouldUseLightText
                  ? 'text-white/70'
                  : 'text-gray-600 dark:text-gray-400',
              ]"
            />
          </div>
          <MazelootLogo
            v-else-if="brandingLogoUrl || (showMazelootBranding && !brandingLogoUrl)"
            :logoSrc="brandingLogoUrl || mazelootPrimaryLogo"
            :color-class="
              rawFiles.coverPhotoUrl || rawFiles.cover_photo_url || shouldUseLightText
                ? 'text-white'
                : undefined
            "
            :show-text="true"
            size="md"
          />
        </div>

        <!-- Theme Toggle and Logout (Top Right) -->
        <div class="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-3">
          <button
            v-if="!isAuthenticatedOwner && !isPreviewMode"
            :class="[
              rawFiles.coverPhotoUrl || rawFiles.cover_photo_url || shouldUseLightText
                ? 'text-white/90 hover:text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100',
            ]"
            class="p-2 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10"
            title="Logout"
            @click="handleLogout"
          >
            <LogOut class="h-5 w-5" />
          </button>
          <ThemeToggle
            :contrast="
              !!(rawFiles.coverPhotoUrl || rawFiles.cover_photo_url || shouldUseLightText)
            "
          />
        </div>

        <!-- Cover Photo Background -->
        <div
          v-if="rawFiles.coverPhotoUrl || rawFiles.cover_photo_url"
          class="absolute inset-0 w-full h-full"
        >
          <!-- Cover Image -->
          <img
            v-if="!isVideoCover"
            :alt="rawFiles.name || 'Raw Files Cover'"
            :src="rawFiles.coverPhotoUrl || rawFiles.cover_photo_url"
            :style="getRawFilesCoverStyle()"
            class="w-full h-full object-cover transition-all duration-500 dark:brightness-90 dark:contrast-105"
            @error="handleCoverImageError"
          />
          <!-- Cover Video -->
          <video
            v-else
            :src="rawFiles.coverPhotoUrl || rawFiles.cover_photo_url"
            :style="getRawFilesCoverStyle()"
            autoplay
            class="w-full h-full object-cover transition-all duration-500 dark:brightness-90 dark:contrast-105"
            loop
            muted
            playsinline
          />
          <!-- Gradient Overlay for Light Mode -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:hidden transition-opacity duration-500"
          ></div>
          <!-- Enhanced Gradient Overlay for Dark Mode -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent hidden dark:block transition-opacity duration-500"
          ></div>
        </div>
        <!-- Fallback Background (color gradient) -->
        <div
          v-else
          class="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out"
          :style="getRawFilesGradientStyle()"
        ></div>

        <!-- Content Overlay - Positioned at Bottom -->
        <div
          class="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 md:px-8 pb-12 md:pb-16"
        >
          <div class="flex items-end justify-between gap-6">
            <!-- Title and Description (Bottom Left) -->
            <div class="flex-1">
              <h1
                :class="[
                  fontFamilyClass,
                  fontStyleClass,
                  fontSizeClassH1,
                  rawFiles.coverPhotoUrl || rawFiles.cover_photo_url || shouldUseLightText
                    ? 'text-white'
                    : 'text-gray-900 dark:text-gray-100',
                ]"
                class="font-light tracking-tight mb-2 drop-shadow-lg"
              >
                {{ rawFiles.name || 'Raw Files' }}
              </h1>
              <p
                v-if="rawFiles.description"
                :class="[
                  fontFamilyClass,
                  fontStyleClass,
                  fontSizeClassP,
                  rawFiles.coverPhotoUrl || rawFiles.cover_photo_url || shouldUseLightText
                    ? 'text-white/90'
                    : 'text-gray-700 dark:text-gray-300',
                ]"
                class="font-light tracking-normal drop-shadow-md max-w-2xl"
              >
                {{ rawFiles.description }}
              </p>
            </div>

            <!-- Action Button (Bottom Right) -->
            <div class="flex-shrink-0">
              <Button
                :class="[
                  rawFiles.coverPhotoUrl || rawFiles.cover_photo_url || shouldUseLightText
                    ? 'bg-white/90 hover:bg-white text-gray-900 border-white/20'
                    : 'bg-gray-900 hover:bg-gray-800 text-white border-gray-700',
                ]"
                class="px-6 py-3 text-sm md:text-base font-light tracking-wider uppercase border backdrop-blur-sm"
                @click="scrollToGallery"
              >
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div id="gallery-section" class="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <!-- Owner Preview Alert / Instructions / Status -->
        <template v-if="isAuthenticatedOwner || isPreviewMode">
          <div
            class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 mt-0.5">
                <svg
                  class="h-5 w-5 text-amber-600 dark:text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clip-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    fill-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Preview Mode
                </h3>
                <p class="text-sm text-amber-700 dark:text-amber-300">
                  You are viewing this selection in preview mode. All actions are disabled.
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- Instructions / Status -->
        <template v-else-if="rawFiles.status !== 'completed'">
          <div
            class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8 shadow-sm"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 mt-0.5">
                <CheckCircle2 class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p class="text-sm font-medium text-blue-900 dark:text-blue-100 leading-relaxed">
                Click on media items to select them. Selected items will be marked with a checkmark.
              </p>
            </div>
          </div>
        </template>

        <!-- Completed Message -->
        <template v-else>
          <div
            class="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 border-2 border-violet-200 dark:border-violet-800 rounded-xl p-5 mb-8 shadow-lg"
          >
            <div class="flex items-center gap-3">
              <svg
                class="w-6 h-6 text-violet-600 dark:text-violet-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-base font-bold text-violet-900 dark:text-violet-100">
                Selection has been completed. Thank you!
              </p>
            </div>
          </div>
        </template>

        <!-- Sets as Tabs -->
        <div v-if="mediaSets.length > 0" class="mb-8">
          <div
            class="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-gray-200 dark:border-gray-700"
          >
            <button
              v-for="set in sortedMediaSets"
              :key="set.id"
              :class="[
                'px-5 py-3 rounded-t-xl font-semibold text-sm transition-all relative',
                selectedSetId === set.id
                  ? 'bg-white dark:bg-gray-800 border-b-3 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50',
              ]"
              :style="
                selectedSetId === set.id
                  ? {
                      color: rawFilesColor,
                      borderColor: rawFilesColor,
                    }
                  : {}
              "
              @click="handleSelectSet(set.id)"
            >
              {{ set.name }}
              <!-- Selection count badge -->
              <span
                v-if="getSetSelectedCount(set.id) > 0"
                :class="[
                  'ml-2 px-2 py-0.5 rounded-full text-xs font-bold',
                  selectedSetId === set.id
                    ? ''
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                ]"
                :style="
                  selectedSetId === set.id
                    ? {
                        backgroundColor: `${rawFilesColor}20`,
                        color: rawFilesColor,
                      }
                    : {}
                "
              >
                {{ getSetSelectedCount(set.id) }}
              </span>
              <!-- Checkmark indicator -->
              <CheckCircle2
                v-if="getSetSelectedCount(set.id) > 0"
                :class="[
                  'ml-1.5 h-4 w-4 inline',
                  selectedSetId === set.id ? '' : 'text-gray-500 dark:text-gray-400',
                ]"
                :style="selectedSetId === set.id ? { color: rawFilesColor } : {}"
              />
            </button>
          </div>
        </div>

        <!-- Current Set Media -->
        <div v-if="currentMediaItems.length > 0" class="space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div class="flex items-center gap-4 flex-wrap">
              <p class="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                <span>{{ currentSelectedCount }} of {{ currentMediaItems.length }} selected</span>
                <span v-if="getEffectiveLimit !== null" class="text-gray-500 dark:text-gray-400">
                  <span class="mx-2">•</span>
                  Maximum: {{ getEffectiveLimit }} items
                </span>
                <span
                  v-if="
                    getRemainingSelections(currentMediaItems) !== null &&
                    getRemainingSelections(currentMediaItems) > 0
                  "
                  :style="{ color: rawFilesColor }"
                >
                  <span class="mx-2">•</span>
                  {{ getRemainingSelections(currentMediaItems) }} remaining
                </span>
              </p>
              <!-- Limit Warning -->
              <div
                v-if="isAtLimit(currentMediaItems)"
                class="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-200 dark:border-yellow-800 shadow-sm"
              >
                <p class="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                  Selection limit reached
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button
                v-if="rawFiles.status === 'completed' && !isAuthenticatedOwner && !isPreviewMode"
                variant="outline"
                size="sm"
                :class="[theme.borderSecondary, theme.textPrimary]"
                :disabled="getSetSelectedCount(selectedSetId) === 0"
                @click="handleCopySelectedFilenamesInSet"
              >
                <Copy class="h-4 w-4 mr-2" />
                Copy Selected ({{ getSetSelectedCount(selectedSetId) }})
              </Button>
              <Button
                v-if="rawFiles.status !== 'completed' && !isAuthenticatedOwner && !isPreviewMode"
                :disabled="isCompleting || currentSelectedCount === 0"
                :style="{
                  backgroundColor: rawFilesColor,
                }"
                class="text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 px-6 py-3 text-base font-semibold"
                :loading="isCompleting"
                loading-label="Completing..."
                :icon="!isCompleting ? CheckCircle2 : null"
                @click="handleComplete"
                @mouseenter="e => (e.target.style.backgroundColor = getRawFilesHoverColor())"
                @mouseleave="e => (e.target.style.backgroundColor = rawFilesColor)"
              >
                Complete Selection
              </Button>
            </div>
          </div>

          <!-- Media Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <div
              v-for="item in currentMediaItems"
              :key="item.id"
              :class="[
                'relative rounded-xl overflow-hidden transition-all duration-300 group',
                isPreviewMode
                  ? 'opacity-100 hover:opacity-100 cursor-pointer'
                  : isAuthenticatedOwner
                    ? 'opacity-75 cursor-not-allowed'
                    : item.isSelected
                      ? 'opacity-100'
                      : rawFiles.status === 'completed' && item.isSelected === true
                        ? 'opacity-100' // Selected on completion, full opacity
                        : rawFiles.status === 'completed'
                          ? 'opacity-50 grayscale' // Unselected in completed, dimmed & grayscale
                          : isAtLimit(currentMediaItems) && !item.isSelected
                            ? 'opacity-50 cursor-not-allowed'
                            : 'opacity-95 hover:opacity-100 hover:shadow-2xl hover:scale-[1.02] cursor-pointer',
                rawFiles.status === 'completed' && item.isSelected === true
                  ? 'ring-1 ring-violet-500/50' // Subtle green ring for items selected on completion
                  : '',
              ]"
              :style="[
                item.isSelected || (rawFiles.status === 'completed' && item.isSelected === true)
                  ? { opacity: 1 }
                  : {},
                item.isSelected
                  ? {
                      boxShadow: `0 0 0 2px ${rawFilesColor}, 0 0 0 4px ${rawFilesColor}40`,
                    }
                  : {},
              ]"
            >
              <!-- Media container with overflow-hidden to prevent scale overflow -->
              <div
                :class="[
                  'w-full aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 transition-transform duration-300',
                  (isPreviewMode ||
                    (!isAuthenticatedOwner &&
                      selection.status !== 'completed' &&
                      !item.isSelected &&
                      !isAtLimit(currentMediaItems)))
                    ? 'group-hover:scale-[1.03]'
                    : '',
                ]"
              >
                <img
                  v-if="item.type === 'image' || (item.file && item.file.type === 'image')"
                  :alt="item.filename || item.title || 'Media'"
                  :src="
                    item.thumbnailUrl ||
                    item.thumbnail ||
                    item.largeImageUrl ||
                    (item.file && item.file.url) ||
                    item.url
                  "
                  :class="[
                    'w-full h-full object-cover',
                    (!isAuthenticatedOwner && !isPreviewMode && selection.status !== 'completed') || isPreviewMode
                      ? 'cursor-pointer'
                      : 'cursor-default',
                  ]"
                  @click="
                    ((!isAuthenticatedOwner && !isPreviewMode && selection.status !== 'completed') || isPreviewMode) &&
                    handleViewMedia(item)
                  "
                />
                <video
                  v-else
                  :poster="item.thumbnailUrl || item.thumbnail"
                  :src="(item.file && item.file.url) || item.url"
                  :class="[
                    'w-full h-full object-cover',
                    (!isAuthenticatedOwner && !isPreviewMode && selection.status !== 'completed') || isPreviewMode
                      ? 'cursor-pointer'
                      : 'cursor-default',
                  ]"
                  @click="
                    ((!isAuthenticatedOwner && !isPreviewMode && selection.status !== 'completed') || isPreviewMode) &&
                    handleViewMedia(item)
                  "
                />
              </div>

              <!-- Action Buttons (centered) -->
              <div
                v-if="!isAuthenticatedOwner && rawFiles.status !== 'completed'"
                :class="[
                  'absolute inset-0 flex items-center justify-center transition-all duration-300 z-30',
                  'opacity-0 group-hover:opacity-100',
                  'bg-black/40 group-hover:bg-black/50 backdrop-blur-sm',
                ]"
                @click.stop
              >
                <div class="px-4 flex items-center justify-center flex-wrap gap-2">
                  <button
                    class="px-4 py-2 rounded-lg bg-white/95 hover:bg-white text-gray-900 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2 text-sm font-semibold"
                    @click.stop="handleViewMedia(item)"
                  >
                    <Eye class="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    v-if="!item.isSelected"
                    :disabled="
                      (isAtLimit(currentMediaItems) && !item.isSelected) ||
                      togglingMediaIds.has(item.id)
                    "
                    :style="{
                      backgroundColor: rawFilesColor,
                    }"
                    class="px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    @mouseenter="
                      e =>
                        !e.target.disabled &&
                        (e.target.style.backgroundColor = getRawFilesHoverColor())
                    "
                    @mouseleave="
                      e => !e.target.disabled && (e.target.style.backgroundColor = rawFilesColor)
                    "
                    @click.stop="handleToggleSelection(item.id)"
                  >
                    <Loader2 v-if="togglingMediaIds.has(item.id)" class="h-4 w-4 animate-spin" />
                    <CheckCircle2 v-else class="h-4 w-4" />
                    <span>Select</span>
                  </button>
                  <button
                    v-else
                    :disabled="togglingMediaIds.has(item.id)"
                    class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    @click.stop="handleToggleSelection(item.id)"
                  >
                    <Loader2 v-if="togglingMediaIds.has(item.id)" class="h-4 w-4 animate-spin" />
                    <X v-else class="h-4 w-4" />
                    <span>Deselect</span>
                  </button>
                </div>
              </div>

              <!-- Currently Selected Badge (top right) -->
              <div
                v-if="item.isSelected"
                :style="{ backgroundColor: rawFilesColor }"
                class="absolute top-2 right-2 text-white rounded-full p-1.5 z-10 shadow-xl backdrop-blur-sm border-2 border-white/30"
              >
                <CheckCircle2 class="h-5 w-5 fill-white" />
              </div>
              <!-- Recommended Badge (top right, next to selected badge) -->
              <div
                v-if="(item.isCreativeSelected || item.is_creative_selected) && !item.isSelected"
                class="absolute top-2 right-2 text-white rounded-full p-1.5 z-10 shadow-xl backdrop-blur-sm border-2 border-white/30 bg-blue-500"
                title="Recommended by photographer"
              >
                <CheckCircle2 class="h-5 w-5 fill-white" />
              </div>
              <!-- Recommended Badge (when also selected - show in top-left) -->
              <div
                v-if="(item.isCreativeSelected || item.is_creative_selected) && item.isSelected"
                class="absolute top-2 left-2 text-white rounded-full p-1.5 z-10 shadow-xl backdrop-blur-sm border-2 border-white/30 bg-blue-500"
                title="Recommended by photographer"
              >
                <CheckCircle2 class="h-5 w-5 fill-white" />
              </div>
              <!-- Loading indicator -->
              <div
                v-if="togglingMediaIds.has(item.id)"
                class="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
              >
                <Loader2 class="h-6 w-6 animate-spin text-white" />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No media available in this set</p>
        </div>
      </div>

      <!-- Footer -->
      <footer class="border-t border-gray-800 bg-gray-900 text-white py-8 mt-12">
        <div class="container mx-auto px-4 md:px-8 text-center">
          <p class="text-sm font-medium text-gray-300 mb-1">
            © {{ new Date().getFullYear() }} {{ brandingName || 'Mazeloot' }}
          </p>
          <p v-if="showMazelootBranding" class="text-xs text-gray-400">Powered by Mazeloot</p>
        </div>
      </footer>
    </div>

    <!-- Error State -->
    <div v-else-if="!rawFiles && !isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-gray-500 dark:text-gray-400">{{ errorMessage || 'Raw Files not found' }}</p>
      </div>
    </div>

    <!-- Completion Confirmation Dialog -->
    <Dialog :open="showCompletionDialog" @update:open="showCompletionDialog = $event">
      <DialogContent :class="[theme.bgCard, theme.borderSecondary]" class="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle :class="theme.textPrimary" class="text-xl font-bold">
            Complete Selection
          </DialogTitle>
          <DialogDescription :class="theme.textSecondary" class="text-sm mt-1">
            Are you sure you want to complete this selection? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 mt-6">
          <!-- Selection Summary -->
          <div class="space-y-4">
            <p :class="theme.textPrimary" class="text-sm font-semibold">Selection Summary</p>

            <!-- Summary by Set -->
            <div class="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              <div v-for="set in sortedMediaSets" :key="set.id" class="space-y-2">
                <div class="flex items-center justify-between text-sm font-medium">
                  <span :class="theme.textPrimary">{{ set.name }}</span>
                  <span :class="theme.textSecondary">
                    {{ getSetSelectedCount(set.id) }} selected
                  </span>
                </div>

                <!-- Selected Items in this Set -->
                <div v-if="getSetSelectedCount(set.id) > 0" class="grid grid-cols-4 gap-2 ml-2">
                  <div
                    v-for="item in getSelectedItemsForSet(set.id)"
                    :key="item.id"
                    class="relative rounded-lg overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800"
                  >
                    <img
                      v-if="item.type === 'image'"
                      :alt="item.title || 'Selected media'"
                      :src="item.thumbnail || item.url"
                      class="w-full h-full object-cover"
                    />
                    <video v-else :src="item.url" class="w-full h-full object-cover" />
                    <div
                      :style="{ backgroundColor: rawFilesColor }"
                      class="absolute top-1 right-1 text-white rounded-full p-0.5"
                    >
                      <CheckCircle2 class="h-3 w-3" />
                    </div>
                  </div>
                </div>

                <div v-else :class="theme.textTertiary" class="text-xs italic ml-2">
                  No items selected in this set
                </div>
              </div>
            </div>

            <!-- Total Summary -->
            <div :class="theme.borderSecondary" class="pt-3 border-t">
              <div class="flex items-center justify-between text-sm font-semibold">
                <span :class="theme.textPrimary">Total Selected:</span>
                <span :class="theme.textPrimary"
                  >{{ totalSelectedCount }} item{{ totalSelectedCount !== 1 ? 's' : '' }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="mt-6">
          <Button
            :class="[theme.textSecondary, theme.bgButtonHover]"
            :disabled="isCompleting"
            variant="ghost"
            @click="showCompletionDialog = false"
          >
            Cancel
          </Button>
          <Button
            :disabled="isCompleting"
            :style="{
              backgroundColor: rawFilesColor,
            }"
            class="text-white"
            :loading="isCompleting"
            loading-label="Completing..."
            @click="confirmComplete"
            @mouseenter="e => (e.target.style.backgroundColor = getRawFilesHoverColor())"
            @mouseleave="e => (e.target.style.backgroundColor = rawFilesColor)"
          >
            Complete Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Media Lightbox Preview with Select Button -->
    <Teleport to="body">
      <div
        v-if="
          showMediaLightbox &&
          !isAuthenticatedOwner &&
          !isPreviewMode &&
          previewCurrentItem &&
          rawFiles.status !== 'completed'
        "
        class="fixed bottom-20 left-1/2 -translate-x-1/2 z-[101] flex gap-3"
      >
        <Button
          v-if="!previewCurrentItem.isSelected"
          variant="primary"
          :disabled="isAtLimit(currentMediaItems) && !previewCurrentItem.isSelected"
          :icon="CheckCircle2"
          class="shadow-lg"
          @click="handleSelectFromPreview(previewCurrentItem.id)"
        >
          Select This Item
        </Button>
        <Button
          v-else
          class="bg-red-500 hover:bg-red-600 text-white shadow-lg"
          variant="destructive"
          @click="handleSelectFromPreview(previewCurrentItem.id)"
        >
          <X class="h-4 w-4 mr-2" />
          Deselect This Item
        </Button>
      </div>
    </Teleport>
    <MediaLightbox
      v-model="showMediaLightbox"
      :initial-index="previewMediaIndex"
      :items="currentMediaItems"
      :selection-id="rawFiles?.id || rawFiles?.uuid"
      :guest-token="guestToken"
      @close="showMediaLightbox = false"
      @update:current-index="previewMediaIndex = $event"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useOpenGraphMeta } from '@/shared/composables/useOpenGraphMeta'
import { useDownloadProtection } from '@/shared/composables/useDownloadProtection'
import { useThemeStore } from '@/shared/stores/theme'
import { useRoute } from 'vue-router'
import { CheckCircle2, Copy, Eye, Loader2, X, LogOut } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import MediaLightbox from '@/shared/components/organisms/MediaLightbox.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSelectionLimits } from '@/domains/memora/composables/useSelectionLimits'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { useMediaApi } from '@/domains/memora/api/media'
import { useUserStore } from '@/shared/stores/user'
import { useSettingsApi } from '@/domains/memora/api/settings'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { clearSelectionGuestData } from '@/shared/utils/guestLogout'
import { logger } from '@/shared/utils/logger'
import mazelootPrimaryLogo from '@/assets/images/logos/mazelootPrimaryLogo.svg'

const theme = useThemeClasses()
const themeStore = useThemeStore()
const route = useRoute()

const rawFilesApi = useRawFilesApi()
const mediaApi = useMediaApi()
const userStore = useUserStore()
const { fetchPublicSettings } = useSettingsApi()

// State
const rawFiles = ref(null)
const mediaSets = ref([])
const mediaItems = ref([])
const selectedSetId = ref(null)
const isLoading = ref(true)
const errorMessage = ref(null)
const isPasswordVerified = ref(false)
const passwordInput = ref('')
const isVerifyingPassword = ref(false)
const passwordError = ref('')
const isCompleting = ref(false)
const showCompletionDialog = ref(false)
const togglingMediaIds = ref(new Set())
const guestToken = ref(null)
const showMediaLightbox = ref(false)
const previewMediaIndex = ref(0)
const brandingLogoUrl = ref(null)
const brandingName = ref(null)
const brandingBio = ref(null)
const showMazelootBranding = ref(true)
const isLoadingBranding = ref(true)

const previewCurrentItem = computed(() => {
  if (previewMediaIndex.value >= 0 && previewMediaIndex.value < currentMediaItems.value.length) {
    return currentMediaItems.value[previewMediaIndex.value]
  }
  return null
})

// Email authentication state
const showEmailModal = ref(false)
const emailInput = ref('')
const isGeneratingToken = ref(false)
const emailError = ref('')
const userEmail = ref(null) // Store the submitted email

// Computed
const sortedMediaSets = computed(() =>
  [...mediaSets.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
)

const currentSet = computed(() => {
  if (!selectedSetId.value) return null
  return mediaSets.value.find(set => set.id === selectedSetId.value)
})

const currentMediaItems = computed(() => {
  if (!selectedSetId.value) return []
  return mediaItems.value.filter(item => item.setId === selectedSetId.value)
})

const currentSelectedCount = computed(() => {
  return currentMediaItems.value.filter(item => item.isSelected).length
})

const totalSelectedCount = computed(() => {
  return mediaItems.value.filter(item => item.isSelected).length
})

// Selection limits composable
const {
  getEffectiveLimit,
  getCurrentSelectedCount: getSetSelectedCountForLimit,
  getRemainingSelections,
  canSelectMore,
  isAtLimit,
  getTotalSelectedCount,
} = useSelectionLimits(rawFiles, currentSet)

// Helper to get selected count for a set
const getSetSelectedCount = setId => {
  return mediaItems.value.filter(item => item.setId === setId && item.isSelected).length
}

// Fetch branding
const fetchBranding = async (userId) => {
  if (!userId || (brandingLogoUrl.value && brandingName.value)) {
    isLoadingBranding.value = false
    return // Skip if already fetched
  }
  
  isLoadingBranding.value = true
  try {
    const settingsResponse = await fetchPublicSettings({ userId })
    const settings = settingsResponse.data || settingsResponse
    brandingLogoUrl.value = settings.branding?.logoUrl || null
    brandingName.value = settings.branding?.name || null
    brandingBio.value = settings.biography || settings.bio || null
    showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
  } catch (error) {
    console.warn('Failed to fetch public branding settings:', error)
  } finally {
    isLoadingBranding.value = false
  }
}

// OpenGraph meta tags
const ogTitle = computed(() => {
  return rawFiles.value?.name && brandingName.value
    ? `${rawFiles.value.name} - ${brandingName.value}`
    : brandingName.value || rawFiles.value?.name || 'Raw Files'
})

const ogDescription = computed(() => {
  return brandingBio.value || rawFiles.value?.description || 
    `View and download media in this raw files phase${brandingName.value ? ` from ${brandingName.value}` : ''}`
})

const ogImage = computed(() => {
  return rawFiles.value?.coverPhotoUrl || rawFiles.value?.cover_photo_url || ''
})

useOpenGraphMeta({
  title: ogTitle,
  description: ogDescription,
  image: ogImage,
  isLoading,
})

// Store password verification with timestamp (30 minutes)
const storePasswordVerification = (rawFilesId) => {
  const expiresAt = Date.now() + (30 * 60 * 1000) // 30 minutes
  localStorage.setItem(`password_verified_raw_files_${rawFilesId}`, JSON.stringify({
    verified: true,
    expiresAt,
    rawFilesId
  }))
}

// Check if password verification is still valid
const getStoredPasswordVerification = (rawFilesId) => {
  if (!rawFilesId) return null
  try {
    const stored = localStorage.getItem(`password_verified_raw_files_${rawFilesId}`)
    if (!stored) return null
    
    const data = JSON.parse(stored)
    const expiresAt = data.expiresAt
    
    // Check if expired
    if (Date.now() > expiresAt) {
      localStorage.removeItem(`password_verified_raw_files_${rawFilesId}`)
      return null
    }
    
    // Verify it's for the correct raw files
    if (data.rawFilesId !== rawFilesId) {
      localStorage.removeItem(`password_verified_raw_files_${rawFilesId}`)
      return null
    }
    
    return data
  } catch (error) {
    localStorage.removeItem(`password_verified_raw_files_${rawFilesId}`)
    return null
  }
}

// Helper to get selected items for a set
const getSelectedItemsForSet = setId => {
  return mediaItems.value.filter(item => item.setId === setId && item.isSelected)
}

// Check if current user is the owner of the raw files
const isAuthenticatedOwner = computed(() => {
  if (!userStore.isAuthenticated || !rawFiles.value) {
    return false
  }
  // Check if the authenticated user is the owner
  const userUuid = rawFiles.value.userUuid || rawFiles.value.user_uuid
  const currentUserId = userStore.user?.id || userStore.user?.uuid
  return userUuid && currentUserId && userUuid === currentUserId
})

// Check if in preview mode (preview=true query param AND authenticated owner)
const isPreviewMode = computed(() => {
  return route.query.preview === 'true' && isAuthenticatedOwner.value
})

// Get raw files theme color (with fallback to blue-500 for raw files)
const rawFilesColor = computed(() => {
  return rawFiles.value?.color || '#3B82F6' // Default blue-500 for raw files
})

// Typography config - backend always returns defaults
const typographyConfig = computed(() => {
  const rawFilesDesign = rawFiles.value?.design || rawFiles.value?.settings?.design || {}
  const rawFilesTypography = rawFiles.value?.typographyDesign || rawFilesDesign?.typography || {}
  
  return {
    fontFamily: rawFilesTypography.fontFamily || 'sans',
    fontStyle: rawFilesTypography.fontStyle || 'normal',
  }
})

// Font family class
const fontFamilyClass = computed(() => {
  const fontMap = {
    sans: 'font-sans',
    serif: 'font-serif',
    modern: 'font-mono',
    bebas: 'font-bebas',
    oswald: 'font-oswald',
    abril: 'font-abril',
    bungee: 'font-bungee',
    righteous: 'font-righteous',
    playfair: 'font-playfair',
    montserrat: 'font-montserrat',
    lato: 'font-lato',
    raleway: 'font-raleway',
    opensans: 'font-opensans',
    roboto: 'font-roboto',
    poppins: 'font-poppins',
    inter: 'font-inter',
    nunito: 'font-nunito',
    barlow: 'font-barlow',
    worksans: 'font-worksans',
    spacegrotesk: 'font-spacegrotesk',
    outfit: 'font-outfit',
    dmsans: 'font-dmsans',
    plusjakarta: 'font-plusjakarta',
    manrope: 'font-manrope',
    sora: 'font-sora',
    figtree: 'font-figtree',
    syne: 'font-syne',
    source: 'font-source',
    ubuntu: 'font-ubuntu',
    merriweather: 'font-merriweather',
    crimson: 'font-crimson',
    lora: 'font-lora',
    spacemono: 'font-spacemono',
    jetbrains: 'font-jetbrains',
    comfortaa: 'font-comfortaa',
    quicksand: 'font-quicksand',
    rubik: 'font-rubik',
    dancing: 'font-dancing',
    pacifico: 'font-pacifico',
    caveat: 'font-caveat',
    kalam: 'font-kalam',
    satisfy: 'font-satisfy',
    greatvibes: 'font-greatvibes',
    amatic: 'font-amatic',
    shadows: 'font-shadows',
    permanent: 'font-permanent',
    indie: 'font-indie',
  }
  return fontMap[typographyConfig.value.fontFamily] || 'font-sans'
})

// Font style class
const fontStyleClass = computed(() => {
  const style = typographyConfig.value.fontStyle || 'normal'
  if (typeof style === 'string') {
    const styles = style.split(/[\s-]+/).filter(s => s.length > 0)
    const classes = []
    if (styles.includes('bold')) {
      classes.push('font-bold')
    } else {
      classes.push('font-normal')
    }
    if (styles.includes('italic')) {
      classes.push('italic')
    }
    return classes.join(' ') || 'font-normal'
  }
  return 'font-normal'
})

// Auto-calculate font size based on content length for optimal display
const fontSizeClassH1 = computed(() => {
  const name = rawFiles.value?.name || 'Raw Files'
  const nameLength = name.length
  
  // Shorter names get larger, longer names get smaller for better readability
  if (nameLength <= 15) {
    return 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
  } else if (nameLength <= 30) {
    return 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl'
  } else if (nameLength <= 50) {
    return 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
  } else {
    return 'text-xl md:text-2xl lg:text-3xl xl:text-4xl'
  }
})

const fontSizeClassP = computed(() => {
  const description = rawFiles.value?.description || ''
  const descLength = description.length
  
  // Scale description based on length
  if (descLength <= 100) {
    return 'text-base md:text-lg lg:text-xl'
  } else if (descLength <= 200) {
    return 'text-sm md:text-base lg:text-lg'
  } else {
    return 'text-sm md:text-base'
  }
})

// Get raw files color styles for dynamic theming
const getRawFilesColorStyles = (type = 'bg') => {
  const color = rawFilesColor.value
  return {
    [type]: color,
  }
}

// Get hover color (slightly darker)
const getRawFilesHoverColor = () => {
  const color = rawFilesColor.value
  // Convert hex to RGB, darken by 10%
  const hex = color.replace('#', '')
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 20)
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 20)
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 20)
  return `rgb(${r}, ${g}, ${b})`
}

// Convert hex to RGB
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : (() => {
        const color = rawFilesColor.value
        const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
        return rgb ? { r: parseInt(rgb[1], 16), g: parseInt(rgb[2], 16), b: parseInt(rgb[3], 16) } : { r: 59, g: 130, b: 246 } // blue-500 fallback
      })()
}

// Lighten color
const lightenColor = (hex, percent) => {
  const rgb = hexToRgb(hex)
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent))
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent))
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent))
  return `rgb(${r}, ${g}, ${b})`
}

// Darken color
const darkenColor = (hex, percent) => {
  const rgb = hexToRgb(hex)
  const r = Math.max(0, Math.round(rgb.r * (1 - percent)))
  const g = Math.max(0, Math.round(rgb.g * (1 - percent)))
  const b = Math.max(0, Math.round(rgb.b * (1 - percent)))
  return `rgb(${r}, ${g}, ${b})`
}

// Calculate brightness to determine text color
const getColorBrightness = hex => {
  const rgb = hexToRgb(hex)
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

// Get gradient background style for fallback
const getRawFilesGradientStyle = () => {
  const color = rawFilesColor.value
  const isDark = themeStore.effectiveTheme === 'dark'
  if (isDark) {
    // Dark mode: darker, more saturated gradient
    const light = darkenColor(color, 0.3)
    const mid = darkenColor(color, 0.5)
    const dark = darkenColor(color, 0.7)
    return {
      background: `linear-gradient(to bottom, ${light}, ${mid}, ${dark})`,
    }
  } else {
    // Light mode: lighter, softer gradient
    const light = lightenColor(color, 0.85)
    const mid = lightenColor(color, 0.5)
    const dark = darkenColor(color, 0.2)
    return {
      background: `linear-gradient(to bottom, ${light}, ${mid}, ${dark})`,
    }
  }
}

// Check if text should be light (for dark backgrounds)
const shouldUseLightText = computed(() => {
  if (rawFiles.value?.coverPhotoUrl || rawFiles.value?.cover_photo_url) {
    return true // Always use light text with cover photo
  }
  return getColorBrightness(rawFilesColor.value) < 128
})

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailInput.value && emailRegex.test(emailInput.value)
})

// Get guest token from URL or localStorage
const getStoredGuestToken = rawFilesId => {
  // Check if guest token is in URL query
  const tokenFromUrl = route.query.guest_token || route.query.token
  if (tokenFromUrl) {
    guestToken.value = tokenFromUrl
    localStorage.setItem(`guest_token_raw_files_${rawFilesId}`, tokenFromUrl)
    return tokenFromUrl
  }

  // Check if stored in localStorage
  const storedToken = localStorage.getItem(`guest_token_raw_files_${rawFilesId}`)
  if (storedToken) {
    guestToken.value = storedToken
    return storedToken
  }

  return null
}

// Generate guest token with email
const generateGuestTokenWithEmail = async (rawFilesId, email) => {
  try {
    const domainOrUsername = route.params.domainOrUsername
    const tokenData = await rawFilesApi.generateGuestToken(domainOrUsername, rawFilesId, email)
    if (tokenData && tokenData.token) {
      guestToken.value = tokenData.token
      localStorage.setItem(`guest_token_raw_files_${rawFilesId}`, tokenData.token)
      // Also store the email for reference
      localStorage.setItem(`guest_email_raw_files_${rawFilesId}`, email)
      userEmail.value = email
      return tokenData.token
    }
    throw new Error('Failed to generate token')
  } catch (error) {
    console.error('Failed to generate guest token:', error)
    throw error
  }
}

// Handle email submission
const handleSubmitEmail = async () => {
  if (!isValidEmail.value || !emailInput.value) {
    emailError.value = 'Please enter a valid email address'
    return
  }

  isGeneratingToken.value = true
  emailError.value = ''

  try {
    const rawFilesId = route.params.id
    if (!rawFilesId) {
      throw new Error('Raw Files ID not found')
    }

    // Try to generate token - this will validate against allowed emails on backend
    await generateGuestTokenWithEmail(rawFilesId, emailInput.value)
    showEmailModal.value = false
    emailInput.value = ''

    // Now load the raw files
    await loadRawFiles()
  } catch (error) {
    // Check if error is about email not being allowed
    const errorMessage = error?.message || ''
    if (
      errorMessage.toLowerCase().includes('not authorized') ||
      errorMessage.toLowerCase().includes('not in the allowed')
    ) {
      emailError.value =
        'This email is not authorized to access this raw files phase. Please contact the owner.'
    } else {
      emailError.value = errorMessage || 'Failed to generate access token. Please try again.'
    }
  } finally {
    isGeneratingToken.value = false
  }
}

// Load raw files and media sets
const loadRawFiles = async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    // Get raw files ID from route params (route is /memora/:domainOrUsername/raw-files/:id)
    const rawFilesId = route.params.id
    const domainOrUsername = route.params.domainOrUsername

    if (!rawFilesId) {
      throw new Error('Raw Files ID is required in the URL')
    }

    // STEP 1: IMMEDIATELY CHECK RAW FILES STATUS
    // Use dedicated status endpoint to check if raw files is accessible
    let statusCheck = null
    const isPreview = route.query.preview === 'true'

    // If in preview mode, try to fetch raw files directly first (bypass status check)
    if (isPreview) {
      try {
        // Try to fetch raw files directly - if user is owner and authenticated, this will work
        const rawFilesData = await rawFilesApi.fetchRawFiles(rawFilesId)
        rawFiles.value = rawFilesData

        // Verify user is owner
        const userUuid = rawFilesData.userUuid || rawFilesData.user_uuid
        const currentUserId = userStore.user?.id || userStore.user?.uuid
        const isOwner =
          userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId

        if (isOwner) {
          // Owner in preview mode - skip password check
          if (rawFilesData.hasPassword) {
            isPasswordVerified.value = true
          }
          // Skip email modal for preview mode
          showEmailModal.value = false
          // Fetch branding
          if (userUuid) {
            await fetchBranding(userUuid)
          }
          // Load media sets and items
          if (rawFilesData.mediaSets && rawFilesData.mediaSets.length > 0) {
            mediaSets.value = rawFilesData.mediaSets
            if (!selectedSetId.value) {
              selectedSetId.value = mediaSets.value[0].id
            }
          }
          await loadMediaItems()
          isLoading.value = false
          return
        }
        // If not owner, fall through to normal flow
      } catch (previewError) {
        // If fetch fails in preview mode, it might not be owner or raw files doesn't exist
        // Fall through to normal status check flow
        console.warn('Preview mode fetch failed, trying status check:', previewError)
      }
    }

    try {
      statusCheck = await rawFilesApi.checkRawFilesStatus(domainOrUsername, rawFilesId)

      // Validate response structure
      if (!statusCheck || typeof statusCheck !== 'object') {
        throw new Error('Invalid response from server')
      }

      // If preview mode and owner, allow access regardless of status
      if (isPreview && statusCheck.isOwner === true && userStore.isAuthenticated) {
        // Owner in preview mode - fetch full raw files data
        const rawFilesData = await rawFilesApi.fetchRawFiles(rawFilesId)
        rawFiles.value = rawFilesData
        // Skip password check for owner in preview
        if (rawFilesData.hasPassword) {
          isPasswordVerified.value = true
        }
        // Skip email modal for preview mode
        showEmailModal.value = false
        // Fetch branding
        const userUuid = rawFilesData.userUuid || rawFilesData.user_uuid
        if (userUuid) {
          await fetchBranding(userUuid)
        }
        // Load media sets and items
        if (rawFilesData.mediaSets && rawFilesData.mediaSets.length > 0) {
          mediaSets.value = rawFilesData.mediaSets
          if (!selectedSetId.value) {
            selectedSetId.value = mediaSets.value[0].id
          }
        }
        await loadMediaItems()
        isLoading.value = false
        return
      }

      // If not accessible and not in preview mode, show error immediately
      if (statusCheck.isAccessible === false) {
        throw new Error(
          'This raw files phase is not yet published. Please contact the creator to publish it before accessing.'
        )
      }

      // If draft and owner, allow preview (no token needed)
      if (statusCheck.status === 'draft' && statusCheck.isOwner === true) {
        // Owner previewing draft - fetch full raw files data
        const rawFilesData = await rawFilesApi.fetchRawFiles(rawFilesId)
        rawFiles.value = rawFilesData
        // Skip password check for owner
        if (rawFilesData.hasPassword) {
          isPasswordVerified.value = true
        }
        // Load media sets and items
        if (rawFilesData.mediaSets && rawFilesData.mediaSets.length > 0) {
          mediaSets.value = rawFilesData.mediaSets
          if (!selectedSetId.value) {
            selectedSetId.value = mediaSets.value[0].id
          }
        }
        await loadMediaItems()
        return
      }

      // If active/completed, continue to token generation below
    } catch (statusError) {
      // If in preview mode and status check fails, try direct fetch as fallback
      if (isPreview && userStore.isAuthenticated) {
        try {
          const rawFilesData = await rawFilesApi.fetchRawFiles(rawFilesId)
          rawFiles.value = rawFilesData

          // Verify user is owner
          const userUuid = rawFilesData.userUuid || rawFilesData.user_uuid
          const currentUserId = userStore.user?.id || userStore.user?.uuid
          const isOwner =
            userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId

          if (isOwner) {
            // Owner in preview mode - skip password check
            if (rawFilesData.hasPassword) {
              isPasswordVerified.value = true
            }
            // Skip email modal for preview mode
            showEmailModal.value = false
            // Fetch branding
            if (userUuid) {
              await fetchBranding(userUuid)
            }
            // Load media sets and items
            if (rawFilesData.mediaSets && rawFilesData.mediaSets.length > 0) {
              mediaSets.value = rawFilesData.mediaSets
              if (!selectedSetId.value) {
                selectedSetId.value = mediaSets.value[0].id
              }
            }
            await loadMediaItems()
            isLoading.value = false
            return
          }
        } catch (fallbackError) {
          // If fallback also fails, continue with error handling
          console.warn('Preview mode fallback also failed:', fallbackError)
        }
      }

      // Check if error is about raw files not being published or not found
      const statusErrMsg = statusError?.message || statusError?.response?.data?.message || ''
      const errorCode = statusError?.code || statusError?.response?.data?.code || ''
      const statusCode = statusError?.status || statusError?.response?.status

      if (
        statusCode === 404 ||
        statusErrMsg.toLowerCase().includes('not yet published') ||
        statusErrMsg.toLowerCase().includes('not active') ||
        statusErrMsg.toLowerCase().includes('raw files') ||
        statusErrMsg.toLowerCase().includes('not accessible') ||
        statusErrMsg.toLowerCase().includes('not found') ||
        errorCode === 'RAW_FILES_NOT_ACTIVE' ||
        errorCode === 'RAW_FILES_NOT_ACCESSIBLE' ||
        errorCode === 'NOT_FOUND'
      ) {
        // Set error message and re-throw
        errorMessage.value = statusErrMsg || 'Raw files not found'
        throw statusError // Re-throw to show error immediately
      }

      // Other error - try to continue (might be network issue)
      console.warn('Status check failed, continuing with fallback:', statusError)
    }

    // STEP 2: CHECK IF EMAIL IS REQUIRED (for email validation only)
    // Note: Raw files use password in header, not guest tokens for API access
    // Guest token is only used to validate email against allowed emails list
    let token = null
    if (!isPreview || !statusCheck?.isOwner) {
      // Check if we have a stored token (for email validation)
      token = getStoredGuestToken(rawFilesId)
      
      // If no token and raw files has allowed emails, require email
      if (!token && statusCheck?.allowedEmails && Array.isArray(statusCheck.allowedEmails) && statusCheck.allowedEmails.length > 0) {
        showEmailModal.value = true
        isLoading.value = false
        return
      }
    }

    // STEP 3: FETCH RAW FILES DATA
    // Note: Raw files use public endpoint (like collections, not like selections with guest tokens)
    let rawFilesData
    try {
      if (isPreview && statusCheck?.isOwner === true && userStore.isAuthenticated) {
        // Only use authenticated endpoint for preview mode when user is authenticated owner
        rawFilesData = await rawFilesApi.fetchRawFiles(rawFilesId)
      } else {
        // For public access, use public endpoint (password will be checked after fetch)
        rawFilesData = await rawFilesApi.fetchRawFilesPublic(domainOrUsername, rawFilesId)
      }
    } catch (error) {
      console.error('Failed to fetch raw files:', error)

      const errorMessage = error?.message || ''
      const errorCode = error?.code || ''
      const errorStatus = error?.status

      // If password required, set rawFiles from statusCheck to show password modal
      if (errorStatus === 401 && (errorCode === 'PASSWORD_REQUIRED' || errorMessage.toLowerCase().includes('password required'))) {
        if (statusCheck) {
          // Set minimal rawFiles object to trigger password modal
          rawFiles.value = {
            id: rawFilesId,
            hasPassword: true,
            name: statusCheck.name || 'Raw Files',
            ...statusCheck
          }
        }
        isLoading.value = false
        return // Password modal will be shown
      }

      if (
        errorMessage.toLowerCase().includes('not active') ||
        errorMessage.toLowerCase().includes('raw files') ||
        errorMessage.toLowerCase().includes('not accessible') ||
        errorCode === 'RAW_FILES_NOT_ACTIVE' ||
        errorCode === 'RAW_FILES_NOT_ACCESSIBLE' ||
        errorStatus === 403
      ) {
        throw new Error(
          'This raw files phase is not yet published. Please contact the creator to publish it before accessing.'
        )
      }

      throw new Error(
        error?.message || 'Raw files not found or not accessible. Please check the link.'
      )
    }

    // Ensure rawFilesData is valid
    if (!rawFilesData || !rawFilesData.id) {
      throw new Error('Invalid raw files data received')
    }

    rawFiles.value = rawFilesData

    // Fetch branding
    const userUuid = rawFilesData.userUuid || rawFilesData.user_uuid
    if (userUuid) {
      await fetchBranding(userUuid)
    }

    // Validate guest email against allowed emails list (skip for authenticated owners and preview mode)
    if (
      !isAuthenticatedOwner.value &&
      !isPreviewMode.value &&
      userEmail.value &&
      rawFilesData.allowedEmails &&
      Array.isArray(rawFilesData.allowedEmails) &&
      rawFilesData.allowedEmails.length > 0
    ) {
      const emailLower = userEmail.value.toLowerCase()
      const isEmailAllowed = rawFilesData.allowedEmails.some(
        allowedEmail => allowedEmail && allowedEmail.toLowerCase() === emailLower
      )

      if (!isEmailAllowed) {
        // Guest email is no longer in allowed emails list - remove from storage
        localStorage.removeItem(`guest_email_raw_files_${rawFilesId}`)
        localStorage.removeItem(`guest_token_raw_files_${rawFilesId}`)
        userEmail.value = ''
        guestToken.value = null
        // Show email modal to re-authenticate
        showEmailModal.value = true
        isLoading.value = false
        return
      }
    }

    // Check password - skip for authenticated owners and preview mode
    // Note: Unlike selections (which use tokens), raw files needs password in memory for API headers
    if (rawFilesData.hasPassword) {
      const userUuid = rawFilesData.userUuid || rawFilesData.user_uuid
      const currentUserId = userStore.user?.id || userStore.user?.uuid
      const isOwnerCheck =
        userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId
      const isPreview = route.query.preview === 'true'

      if (isOwnerCheck || (isPreview && isOwnerCheck)) {
        isPasswordVerified.value = true
      } else if (!verifiedPassword.value) {
        // Password needed but not in memory - show modal
        return
      } else {
        isPasswordVerified.value = true
      }
    }

    // Load media sets
    if (rawFilesData.mediaSets && rawFilesData.mediaSets.length > 0) {
      mediaSets.value = rawFilesData.mediaSets
    } else {
      // If no media sets in response, try to fetch them
      try {
        let sets
        if (isPreview && statusCheck?.isOwner === true) {
          // Preview mode - use authenticated endpoint
          sets = await rawFilesApi.fetchMediaSets(rawFilesId)
        } else {
          // Use public endpoint with password if verified
          const password = verifiedPassword.value || null
          sets = await rawFilesApi.fetchMediaSetsPublic(domainOrUsername, rawFilesId, password)
        }
        if (sets && sets.length > 0) {
          mediaSets.value = sets
        }
      } catch (error) {
        console.warn('Failed to fetch media sets:', error)
      }
    }
    
    // Auto-select first set if none selected and sets exist
    if (!selectedSetId.value && mediaSets.value.length > 0) {
      selectedSetId.value = mediaSets.value[0].id
    }

    // Load media items if password is not required, or verified, or in preview mode, or authenticated owner
    const shouldLoadMedia =
      !rawFilesData.hasPassword ||
      isPasswordVerified.value ||
      isPreviewMode.value ||
      isAuthenticatedOwner.value

    if (shouldLoadMedia) {
      await loadMediaItems()
    }
  } catch (error) {
    logger.error('Error loading raw files:', error)

    // Set error message for UI display
    const errMsg = error?.message || error?.response?.data?.message || 'Raw files not found or not accessible. Please check the link.'
    errorMessage.value = errMsg

    // Check if error is about raw files not being published
    if (
      errMsg.toLowerCase().includes('not yet published') ||
      errMsg.toLowerCase().includes('not active') ||
      errMsg.toLowerCase().includes('raw files')
    ) {
      toast.error('Raw files not published', {
        description:
          'This raw files phase is not yet published. Please contact the creator to publish it before accessing.',
        duration: 8000,
      })
    } else {
      toast.error('Failed to load raw files', {
        description: errMsg,
      })
    }
  } finally {
    isLoading.value = false
  }
}

// Load media for a specific set
const loadMediaForSet = async (setId) => {
  if (!rawFiles.value?.id || !setId) return
  if (!isPasswordVerified.value && rawFiles.value?.hasPassword && !isPreviewMode.value) return

  try {
    const isDraft = rawFiles.value?.status === 'draft'
    const domainOrUsername = route.params.domainOrUsername
    let setMedia

    // Preview mode AND authenticated owner - use authenticated endpoint
    if (isPreviewMode.value) {
      setMedia = await rawFilesApi.fetchSetMedia(rawFiles.value.id, setId)
    } else {
      // Public mode - use public endpoint with password if verified
      const password = verifiedPassword.value || null
      setMedia = await rawFilesApi.fetchSetMediaPublic(domainOrUsername, rawFiles.value.id, setId, {}, password)
    }

    // Handle response format
    let mediaArray = setMedia
    if (setMedia && typeof setMedia === 'object' && !Array.isArray(setMedia)) {
      if (setMedia.data && Array.isArray(setMedia.data)) {
        mediaArray = setMedia.data
      } else {
        console.warn(`Unexpected media response format for set ${setId}:`, setMedia)
        return
      }
    }

    if (!Array.isArray(mediaArray)) {
      console.warn(`Media for set ${setId} is not an array:`, mediaArray)
      return
    }

    // Remove existing media for this set, then add new media
    mediaItems.value = mediaItems.value.filter(item => item.setId !== setId)
    
    const mediaWithSetId = mediaArray.map(item => ({
      ...item,
      setId: item.setId || setId,
      type: item.type || (item.file && item.file.type) || 'image',
      url: item.url || (item.file && item.file.url) || item.thumbnailUrl || item.largeImageUrl,
    }))
    
    mediaItems.value.push(...mediaWithSetId)
  } catch (error) {
    console.error(`Failed to load media for set ${setId}:`, error)
    const errorMessage = error?.message || error?.response?.data?.message || 'Failed to load media'
    
    if (
      errorMessage.toLowerCase().includes('not active') ||
      errorMessage.toLowerCase().includes('raw files') ||
      error?.code === 'RAW_FILES_NOT_ACTIVE' ||
      error?.status === 403
    ) {
      toast.error('Raw files not published', {
        description: 'This raw files phase is not yet published. Please contact the creator to publish it before accessing.',
      })
    } else {
      toast.error(errorMessage)
    }
  }
}

// Load media items for selected set
const loadMediaItems = async () => {
  if (!rawFiles.value?.id) return
  if (!isPasswordVerified.value && rawFiles.value?.hasPassword && !isPreviewMode.value) return
  if (mediaSets.value.length === 0) return

  // Auto-select first set if none selected (use sorted sets to respect order)
  if (!selectedSetId.value) {
    const sortedSets = [...mediaSets.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    if (sortedSets.length > 0) {
      selectedSetId.value = sortedSets[0].id
    }
  }

  // Load media for the selected set
  if (selectedSetId.value) {
    await loadMediaForSet(selectedSetId.value)
  }
}

const verifiedPassword = ref(null)

const handleVerifyPassword = async () => {
  if (!passwordInput.value || !rawFiles.value) return

  isVerifyingPassword.value = true
  passwordError.value = ''

  try {
    // Verify password with backend
    const domainOrUsername = route.params.domainOrUsername
    await rawFilesApi.verifyPassword(domainOrUsername, rawFiles.value.id, passwordInput.value)

    // Password verified successfully - store verification flag (not password)
    verifiedPassword.value = passwordInput.value
    isPasswordVerified.value = true
    storePasswordVerification(rawFiles.value.id)
    passwordInput.value = ''
    await loadRawFiles()
  } catch (error) {
    const errorMessage = error?.message || ''
    const errorCode = error?.code || ''

    if (
      errorCode === 'INVALID_PASSWORD' ||
      errorMessage.toLowerCase().includes('incorrect password') ||
      errorMessage.toLowerCase().includes('invalid password')
    ) {
      passwordError.value = 'Incorrect password. Please try again.'
    } else {
      passwordError.value = errorMessage || 'Failed to verify password. Please try again.'
    }
    verifiedPassword.value = null
  } finally {
    isVerifyingPassword.value = false
  }
}

// Select set
const handleSelectSet = async setId => {
  selectedSetId.value = setId
  await loadMediaForSet(setId)
}

// View media in lightbox
const handleViewMedia = item => {
  // Allow viewing in preview mode, but restrict for authenticated owners (non-preview)
  if (isAuthenticatedOwner.value && !isPreviewMode.value) return
  if (rawFiles.value?.status === 'completed' && !isPreviewMode.value) return // Don't allow viewing in lightbox when completed (except preview mode)

  const index = currentMediaItems.value.findIndex(m => m.id === item.id)
  if (index !== -1) {
    previewMediaIndex.value = index
    showMediaLightbox.value = true
  }
}

// Check if raw files cover photo is a video
const isVideoCover = computed(() => {
  if (!rawFiles.value?.coverPhotoUrl && !rawFiles.value?.cover_photo_url) return false

  const coverUrl = rawFiles.value.coverPhotoUrl || rawFiles.value.cover_photo_url
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
  return videoExtensions.some(ext => coverUrl.toLowerCase().includes(ext))
})

// Get raw files cover photo style with focal point
const getRawFilesCoverStyle = () => {
  const style = {}

  if (!rawFiles.value) return style

  // Get focal point from raw files
  const focalPoint = rawFiles.value.coverFocalPoint || rawFiles.value.cover_focal_point

  if (focalPoint && typeof focalPoint === 'object' && focalPoint !== null) {
    if ('x' in focalPoint && 'y' in focalPoint) {
      // Apply focal point using object-position
      style.objectPosition = `${focalPoint.x}% ${focalPoint.y}%`
    }
  }

  return style
}

// Handle cover image error
const handleCoverImageError = () => {
  // Silently handle error - fallback to no cover photo
  console.warn('Cover photo failed to load')
}

// Format date for display
const formatDate = dateString => {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)
    const months = [
      'JANUARY',
      'FEBRUARY',
      'MARCH',
      'APRIL',
      'MAY',
      'JUNE',
      'JULY',
      'AUGUST',
      'SEPTEMBER',
      'OCTOBER',
      'NOVEMBER',
      'DECEMBER',
    ]

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    // Get ordinal suffix for day
    const getOrdinalSuffix = day => {
      if (day > 3 && day < 21) return 'TH'
      switch (day % 10) {
        case 1:
          return 'ST'
        case 2:
          return 'ND'
        case 3:
          return 'RD'
        default:
          return 'TH'
      }
    }

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`
  } catch (error) {
    return ''
  }
}

// Scroll to gallery section
const scrollToGallery = () => {
  const gallerySection = document.getElementById('gallery-section')
  if (gallerySection) {
    gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleLogout = () => {
  const rawFilesId = route.params.id
  if (rawFilesId) {
    localStorage.removeItem(`guest_token_raw_files_${rawFilesId}`)
    localStorage.removeItem(`guest_email_raw_files_${rawFilesId}`)
    localStorage.removeItem(`password_verified_raw_files_${rawFilesId}`)
  }
  
  // Reset all state
  guestToken.value = null
  isPasswordVerified.value = false
  passwordInput.value = ''
  userEmail.value = ''
  emailInput.value = ''
  rawFiles.value = null
  mediaSets.value = []
  mediaItems.value = []
  
  toast.success('Logged out successfully')
  
  // Reload the page to reset everything
  window.location.reload()
}

// Select/deselect from preview
const handleSelectFromPreview = async mediaId => {
  await handleToggleSelection(mediaId)
  // Keep lightbox open so user can continue viewing
}

const handleToggleSelection = async mediaId => {
  if (isAuthenticatedOwner.value || isPreviewMode.value || rawFiles.value?.status === 'completed')
    return

  const item = currentMediaItems.value.find(m => m.id === mediaId)
  if (!item) return

  if (!item.isSelected && !canSelectMore(currentMediaItems.value)) {
    toast.warning('Selection limit reached', {
      description: 'You have reached the maximum number of selections for this set.',
    })
    return
  }

  if (togglingMediaIds.value.has(mediaId)) return

  togglingMediaIds.value.add(mediaId)
  try {
    if (!guestToken.value || !rawFiles.value?.id) {
      throw new Error('Guest token is required for public raw files')
    }

    // Note: Raw files may not have toggle selection - this might need backend implementation
    // For now, keeping the structure but may need to be adapted
    const domainOrUsername = route.params.domainOrUsername
    // await rawFilesApi.toggleSelectedGuest(domainOrUsername, rawFiles.value.id, mediaId, guestToken.value)
    const mediaItem = mediaItems.value.find(m => m.id === mediaId)
    if (mediaItem) {
      mediaItem.isSelected = !mediaItem.isSelected
    }
  } catch (error) {
    // Use exact backend error message
    const backendMessage = error?.message || error?.response?.data?.message || ''
    if (backendMessage.toLowerCase().includes('limit reached')) {
      toast.error(backendMessage || 'Selection limit reached')
    } else {
      toast.error(backendMessage || 'Failed to toggle selection')
    }
  } finally {
    togglingMediaIds.value.delete(mediaId)
  }
}

// Handle complete
const handleComplete = () => {
  // Disable for authenticated owners and preview mode
  if (isAuthenticatedOwner.value || isPreviewMode.value) {
    return
  }

  if (totalSelectedCount.value === 0) {
    toast.info('No items selected', {
      description: 'Please select at least one item before completing.',
    })
    return
  }
  showCompletionDialog.value = true
}

const confirmComplete = async () => {
  if (!rawFiles.value?.id) return

  if (!guestToken.value) {
    toast.error('Access token required', {
      description: 'Please provide your email to access this raw files phase.',
    })
    return
  }

  isCompleting.value = true
  try {
    const selectedMediaIds = mediaItems.value.filter(item => item.isSelected).map(item => item.id)
    const domainOrUsername = route.params.domainOrUsername

    // Note: Raw files may not have a complete action - this might need backend implementation
    // For now, keeping the structure but may need to be adapted
    // const completedRawFiles = await rawFilesApi.completeRawFiles(domainOrUsername, rawFiles.value.id, selectedMediaIds, guestToken.value)

    // For now, just refresh the raw files data
    try {
      const refreshedRawFiles = await rawFilesApi.fetchRawFilesGuest(
        domainOrUsername,
        rawFiles.value.id,
        guestToken.value
      )
      if (refreshedRawFiles) {
        rawFiles.value = refreshedRawFiles
        if (refreshedRawFiles.mediaSets && refreshedRawFiles.mediaSets.length > 0) {
          mediaSets.value = refreshedRawFiles.mediaSets
          if (!selectedSetId.value) {
            selectedSetId.value = mediaSets.value[0].id
          }
        }
        await loadMediaItems()
      }
    } catch (reloadError) {
      console.warn('Failed to reload raw files after completion:', reloadError)
    }

    toast.success('Raw files phase completed', {
      description: 'Thank you!',
    })

    showCompletionDialog.value = false
  } catch (error) {
    // Use exact backend error message
    const errorMessage = error?.message || error?.response?.data?.message || 'Failed to complete'
    toast.error(errorMessage)
  } finally {
    isCompleting.value = false
  }
}

// Copy selected filenames in current set
const handleCopySelectedFilenamesInSet = async () => {
  if (!selectedSetId.value || !rawFiles.value?.id) return

  if (!guestToken.value) {
    toast.error('Access token required', {
      description: 'Please ensure you have access to this raw files phase.',
    })
    return
  }

  // For raw files, use loaded media items
  const setItems = mediaItems.value.filter(item => item.setId === selectedSetId.value)
  const selectedItems = setItems.filter(item => item.isSelected === true)
  if (selectedItems.length === 0) {
    toast.info('No selected items', {
      description: 'No items selected in this set.',
    })
    return
  }

  const filenames = selectedItems.map(item => item.filename || item.title || 'Untitled')
  const filenamesText = filenames.join(', ')
  try {
    await navigator.clipboard.writeText(filenamesText)
    toast.success('Filenames copied', {
      description: `${filenames.length} selected filename(s) from this set copied to clipboard.`,
    })
  } catch (error) {
    toast.error('Failed to copy filenames', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

// Initialize download protection
const { cleanup: cleanupProtection } = useDownloadProtection({
  enabled: true,
  showWarnings: false,
})

onMounted(() => {
  // Check if we have a stored password verification for this raw files
  const rawFilesId = route.params.id
  if (rawFilesId) {
    const storedVerification = getStoredPasswordVerification(rawFilesId)
    if (storedVerification) {
      isPasswordVerified.value = true
      // Password is not stored - user needs to re-enter if page reloads
    }
    
    // Check if we have a stored email for this raw files
    const storedEmail = localStorage.getItem(`guest_email_raw_files_${rawFilesId}`)
    if (storedEmail) {
      userEmail.value = storedEmail
    }
  }

  // Load raw files (will show email modal if needed)
  loadRawFiles()
})

onUnmounted(() => {
  cleanupProtection()
})
</script>
