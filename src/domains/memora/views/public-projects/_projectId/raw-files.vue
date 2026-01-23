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
            Please enter your email address to access this rawFile.
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
              @keydown.enter="handleSubmitEmail"
            />
            <p v-if="emailError" class="text-xs text-red-600 dark:text-red-400">
              {{ emailError }}
            </p>
            <p :class="theme.textSecondary" class="text-xs">
              Your email will be used to generate an access token for this rawFile.
            </p>
          </div>
        </div>

        <DialogFooter class="mt-6">
          <Button
            :disabled="isGeneratingToken || !emailInput || !isValidEmail"
            :style="{
              backgroundColor: rawFileColor,
            }"
            class="text-white"
            :loading="isGeneratingToken"
            loading-label="Generating Access..."
            @click="handleSubmitEmail"
            @mouseenter="e => (e.target.style.backgroundColor = getRawFileHoverColor())"
            @mouseleave="e => (e.target.style.backgroundColor = rawFileColor)"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Password Protection Modal -->
    <Dialog
      v-else-if="
        rawFile &&
        rawFile.hasPassword &&
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
            This rawFile is password protected. Please enter the password to continue.
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
              backgroundColor: rawFileColor,
            }"
            class="text-white"
            :loading="isVerifyingPassword"
            loading-label="Verifying..."
            @click="handleVerifyPassword"
            @mouseenter="e => (e.target.style.backgroundColor = getRawFileHoverColor())"
            @mouseleave="e => (e.target.style.backgroundColor = rawFileColor)"
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Main Content -->
    <div v-else-if="rawFile" :class="[fontFamilyClass, fontStyleClass]" class="min-h-screen">
      <!-- Hero Section with Cover Photo - Half Viewport Height -->
      <div class="relative w-full h-[50vh]">
        <!-- Logo (Top Left) -->
        <div class="absolute top-4 left-4 md:top-6 md:left-6 z-20">
          <div
            v-if="isLoadingBranding"
            class="h-14 w-32 flex items-center justify-center rounded-lg"
            :class="[
              rawFile.coverPhotoUrl || rawFile.cover_photo_url || shouldUseLightText
                ? 'bg-white/10 backdrop-blur-sm'
                : 'bg-gray-100/50 dark:bg-gray-800/50',
            ]"
          >
            <Loader2
              :class="[
                'h-5 w-5 animate-spin',
                rawFile.coverPhotoUrl || rawFile.cover_photo_url || shouldUseLightText
                  ? 'text-white/90'
                  : 'text-gray-600 dark:text-gray-400',
              ]"
            />
          </div>
          <MazelootLogo
            v-else-if="brandingLogoUrl || (showMazelootBranding && !brandingLogoUrl)"
            :logoSrc="brandingLogoUrl || mazelootPrimaryLogo"
            :color-class="
              rawFile.coverPhotoUrl || rawFile.cover_photo_url || shouldUseLightText
                ? 'text-white'
                : undefined
            "
            :show-text="true"
            size="md"
          />
        </div>

        <!-- Theme Toggle and Logout (Top Right) -->
        <div
          class="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2"
        >
          <button
            v-if="!isAuthenticatedOwner && !isPreviewMode"
            :class="[
              rawFile.coverPhotoUrl || rawFile.cover_photo_url || shouldUseLightText
                ? 'text-white/90 hover:text-white bg-white/10 hover:bg-white/20'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200/50 dark:hover:bg-gray-700/50',
            ]"
            class="p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
            title="Logout"
            @click="handleLogout"
          >
            <LogOut class="h-5 w-5" />
          </button>
          <div
            :class="[
              rawFile.coverPhotoUrl || rawFile.cover_photo_url || shouldUseLightText
                ? 'bg-white/10 backdrop-blur-sm'
                : 'bg-gray-100/50 dark:bg-gray-800/50',
            ]"
            class="rounded-lg"
          >
            <ThemeToggle
              :contrast="
                !!(rawFile.coverPhotoUrl || rawFile.cover_photo_url || shouldUseLightText)
              "
            />
          </div>
        </div>

        <!-- Cover Photo Background - Always use free image from online source -->
        <div
          class="absolute inset-0 w-full h-full overflow-hidden"
        >
          <!-- Default Cover Image from Unsplash -->
          <img
            :src="defaultCoverImage"
            :alt="rawFile.name || 'RawFile Cover'"
            class="w-full h-full object-cover transition-all duration-500 dark:brightness-90 dark:contrast-105"
            @error="handleCoverImageError"
          />
          <!-- Dark Overlay -->
          <div
            class="absolute inset-0 bg-black/60 dark:bg-black/70 transition-opacity duration-500"
          ></div>
          <!-- Gradient Overlay for Light Mode -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:hidden transition-opacity duration-500"
          ></div>
          <!-- Enhanced Gradient Overlay for Dark Mode -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent hidden dark:block transition-opacity duration-500"
          ></div>
        </div>

        <!-- Content Overlay - Positioned at Bottom -->
        <div
          class="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 sm:px-6 md:px-8 pb-8 sm:pb-12 md:pb-16"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6">
            <!-- Title and Description (Bottom Left) -->
            <div class="flex-1 min-w-0">
              <h1
                v-if="!isLoading"
                :class="[
                  fontFamilyClass,
                  fontStyleClass,
                  fontSizeClassH1,
                  rawFile.coverPhotoUrl || rawFile.cover_photo_url || shouldUseLightText
                    ? 'text-white'
                    : 'text-gray-900 dark:text-gray-100',
                ]"
                class="font-light tracking-tight mb-2 drop-shadow-lg break-words"
              >
                {{ rawFile.name || 'RawFile' }}
              </h1>
              <Skeleton
                v-else
                :class="[
                  'h-6 sm:h-8 md:h-10 lg:h-12 mb-2',
                  shouldUseLightText ? 'bg-white/20' : 'bg-gray-300 dark:bg-gray-700',
                ]"
                class="w-48 sm:w-64 md:w-80"
              />
              <p
                v-if="rawFile.description && !isLoading"
                :class="[
                  fontFamilyClass,
                  fontStyleClass,
                  fontSizeClassP,
                  rawFile.coverPhotoUrl || rawFile.cover_photo_url || shouldUseLightText
                    ? 'text-white/90'
                    : 'text-gray-700 dark:text-gray-300',
                ]"
                class="font-light tracking-normal drop-shadow-md max-w-2xl break-words"
              >
                {{ rawFile.description }}
              </p>
              <Skeleton
                v-else-if="isLoading"
                :class="[
                  'h-3 sm:h-4 md:h-5',
                  shouldUseLightText ? 'bg-white/20' : 'bg-gray-300 dark:bg-gray-700',
                ]"
                class="w-40 sm:w-48 md:w-64"
              />
            </div>

            <!-- Action Button (Bottom Right) -->
            <div class="flex-shrink-0 w-full sm:w-auto">
              <Button
                :style="{
                  backgroundColor: rawFileColor,
                  color: 'white',
                }"
                class="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base md:text-lg font-light tracking-wider uppercase border backdrop-blur-sm hover:opacity-90 transition-all duration-200"
                @click="scrollToGallery"
                @mouseenter="e => (e.target.style.backgroundColor = getRawFileHoverColor())"
                @mouseleave="e => (e.target.style.backgroundColor = rawFileColor)"
              >
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div id="gallery-section" class="container mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        <!-- Gallery Assist Walk-through Cards -->
        <Transition name="fade">
          <div
            v-if="showGalleryAssist && !isGalleryAssistDismissed && !isAuthenticatedOwner"
            class="mb-6 sm:mb-8"
          >
            <div
              :style="{
                backgroundColor: rawFileColor + '10',
                borderColor: rawFileColor + '40',
              }"
              class="rounded-xl border-2 p-4 sm:p-6 space-y-4 relative shadow-lg"
            >
              <button
                :style="{ color: rawFileColor }"
                class="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
                aria-label="Dismiss Gallery Assist"
                @click="dismissGalleryAssist"
              >
                <X class="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <div class="flex items-start gap-3 sm:gap-4 pr-8">
                <div
                  :style="{ backgroundColor: rawFileColor, color: 'white' }"
                  class="p-2.5 rounded-lg shrink-0 shadow-md"
                >
                  <Sparkles class="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3
                    class="text-base sm:text-lg font-bold mb-1.5"
                    :style="{ color: rawFileColor }"
                  >
                    Gallery Assist
                  </h3>
                  <p
                    class="text-xs sm:text-sm leading-relaxed mb-5 text-gray-700 dark:text-gray-300"
                  >
                    Tips to help you navigate and make your rawFiles
                  </p>
                  <TransitionGroup
                    name="card"
                    tag="div"
                    class="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <div
                      v-for="(card, index) in galleryAssistCards"
                      :key="card.id"
                      :style="{
                        backgroundColor: rawFileColor + '15',
                        borderColor: rawFileColor + '40',
                        '--card-delay': `${index * 50}ms`,
                      }"
                      class="p-3 sm:p-4 rounded-lg border transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-opacity-60 cursor-default group"
                    >
                      <div class="flex items-start gap-2 sm:gap-3">
                        <div
                          :style="{ backgroundColor: rawFileColor + '25', color: rawFileColor }"
                          class="p-2 rounded-lg shrink-0 group-hover:scale-110 transition-transform duration-200"
                        >
                          <component
                            :is="card.icon"
                            class="h-4 w-4 sm:h-5 sm:w-5"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4
                            class="text-xs sm:text-sm font-semibold leading-tight text-gray-900 dark:text-gray-100"
                          >
                            {{ card.title }}
                          </h4>
                          <p
                            class="text-xs leading-relaxed text-gray-700 dark:text-gray-300"
                          >
                            {{ card.description }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TransitionGroup>
                </div>
              </div>
            </div>
          </div>
        </Transition>


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
                  You are viewing this rawFile in preview mode. All actions are disabled.
                </p>
              </div>
            </div>
          </div>
        </template>


        <!-- Sets as Tabs -->
        <div v-if="isLoadingMediaSets" class="mb-8">
          <div
            class="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-gray-200 dark:border-gray-700"
          >
            <Skeleton v-for="i in 3" :key="i" class="h-10 w-24 rounded-t-xl" />
          </div>
        </div>
        <div v-else-if="mediaSets.length > 0" class="mb-8">
          <div
            class="flex items-center gap-2 overflow-x-auto pb-2 border-b-2 border-gray-200 dark:border-gray-700"
          >
            <button
              v-for="set in sortedMediaSets"
              :key="set.id"
              :class="[
                'px-5 py-3 rounded-t-xl font-semibold text-sm transition-all relative flex items-center gap-2',
                selectedSetId === set.id
                  ? 'bg-white dark:bg-gray-800 border-b-3 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900/50',
              ]"
              :style="
                selectedSetId === set.id
                  ? {
                      color: rawFileColor,
                      borderColor: rawFileColor,
                    }
                  : {}
              "
              @click="handleSelectSet(set.id)"
            >
              <span>{{ set.name }}</span>
              <span
                :class="[
                  'text-xs px-2 py-0.5 rounded-full',
                  selectedSetId === set.id
                    ? 'bg-opacity-20'
                    : 'bg-gray-200 dark:bg-gray-700',
                ]"
                :style="
                  selectedSetId === set.id
                    ? { backgroundColor: getRawFileColorVariant(0.2) }
                    : {}
                "
              >
                {{ set.count || 0 }}
              </span>
            </button>
          </div>
        </div>

        <!-- Current Set Media -->
        <div v-if="isLoadingMedia" class="space-y-6">
          <div class="flex items-center justify-end gap-3 mb-6">
            <Skeleton class="h-9 w-32" />
            <Skeleton class="h-9 w-36" />
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Skeleton v-for="i in 8" :key="i" class="aspect-square rounded-lg" />
          </div>
        </div>
        <div v-else-if="currentMediaItems.length > 0" class="space-y-6">
          <div class="flex items-center justify-end gap-3 mb-6 flex-wrap">
            <!-- Download Set Button -->
            <Button
              v-if="isDownloadEnabled && !isAuthenticatedOwner && !isPreviewMode"
              variant="default"
              size="sm"
              :style="{ backgroundColor: rawFileColor }"
              class="text-white"
              :disabled="currentMediaItems.length === 0 || isDownloadingSet"
              :loading="isDownloadingSet"
              loading-label="Downloading..."
              @click="handleDownloadSet"
              @mouseenter="e => (e.target.style.backgroundColor = getRawFileHoverColor())"
              @mouseleave="e => (e.target.style.backgroundColor = rawFileColor)"
            >
              <Download class="h-4 w-4 mr-2" />
              Download Set ({{ currentMediaItems.length }})
            </Button>
            <!-- Download All Raw File Button -->
              <Button
              v-if="isDownloadEnabled && !isAuthenticatedOwner && !isPreviewMode && mediaItems.length > 0"
                variant="outline"
                size="sm"
                :class="[theme.borderSecondary, theme.textPrimary]"
              :disabled="mediaItems.length === 0 || isDownloadingSet"
              @click="navigateToDownloadPage"
            >
              <Download class="h-4 w-4 mr-2" />
              Download All Raw File ({{ mediaItems.length }})
              </Button>
          </div>

          <!-- Media Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <MediaGridItemCard
              v-for="item in currentMediaItems"
              :key="item.id"
              :item="item"
              :placeholder-image="'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='"
              :rawFile-status="rawFile.status"
              :show-filename="false"
              :show-management-actions="false"
              :show-selection-checkbox="false"
              :hide-favorite-icon="true"
              :public-mode="!isAuthenticatedOwner && !isPreviewMode"
              :is-downloading="downloadingMediaIds.has(item.id)"
              :allow-download="isDownloadEnabled"
              :phase="'rawFile'"
              @open-viewer="handleViewMedia"
              @download="handleDownloadMedia"
            />
          </div>
        </div>

        <div v-else-if="!isLoadingMedia && mediaSets.length > 0" class="text-center py-12">
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
    <div v-else-if="!rawFile && !isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-gray-500 dark:text-gray-400">RawFile not found</p>
      </div>
    </div>

    <!-- Download PIN Modal -->
    <Dialog v-if="showDownloadPinModal && requiresDownloadPin && !isDownloadPinVerified && !isAuthenticatedOwner" :open="showDownloadPinModal" @update:open="(val) => { if (!val) { showDownloadPinModal = false; downloadPinInput = ''; downloadPinError = '' } }">
      <DialogContent class="sm:max-w-[440px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
        <DialogHeader class="text-center pb-2">
          <DialogTitle class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Download PIN Required
          </DialogTitle>
          <DialogDescription class="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Please enter the 4-digit download PIN to download media from this raw file.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-5 mt-6">
          <div class="space-y-3">
            <PinInput
              v-model="downloadPinInput"
              :input-class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                downloadPinError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:ring-accent/20',
              ]"
              :disabled="isVerifyingDownloadPin"
              :length="4"
              @complete="handleVerifyDownloadPin"
            />
            <p v-if="downloadPinError" class="text-xs text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-1">
              <AlertCircle class="h-3 w-3" />
              {{ downloadPinError }}
            </p>
          </div>
        </div>

        <DialogFooter class="mt-8">
          <Button
            :disabled="isVerifyingDownloadPin || !downloadPinInput || downloadPinInput.length !== 4"
            class="bg-accent hover:bg-accent/90 text-accent-foreground w-full h-11 shadow-md hover:shadow-lg transition-all"
            :loading="isVerifyingDownloadPin"
            loading-label="Verifying..."
            @click="handleVerifyDownloadPin"
          >
            Verify PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <MediaLightbox
      v-model="showMediaLightbox"
      :initial-index="previewMediaIndex"
      :items="currentMediaItems"
      :rawFile-id="rawFile?.id || rawFile?.uuid"
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
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle2, Eye, Loader2, X, LogOut, Sparkles, Grid3x3, Play, Download, Heart, Share2, Lock, AlertCircle } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import MediaLightbox from '@/shared/components/organisms/MediaLightbox.vue'
import MediaGridItemCard from '@/shared/components/organisms/MediaGridItemCard.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import PinInput from '@/shared/components/molecules/PinInput.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { useRawFileStore } from '@/domains/memora/stores/rawFile'
import { useRawFilesApi } from '@/domains/memora/api/rawFiles'
import { useMediaApi } from '@/shared/api/media'
import { useUserStore } from '@/shared/stores/user'
import { useSettingsApi } from '@/domains/memora/api/settings'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { clearRawFileGuestData } from '@/shared/utils/guestLogout'
import { getStoredDownloadPin, storeDownloadPin, removeStoredDownloadPin } from '@/shared/utils/localStorage'
import { API_CONFIG } from '@/shared/api/config'
import { apiClient } from '@/shared/api/client'
import mazelootPrimaryLogo from '@/shared/assets/images/logos/mazelootPrimaryLogo.svg'
import rawFileBg1 from '@/domains/memora/assets/images/rawFileBgs/rawFileBg.jpg'
import rawFileBg2 from '@/domains/memora/assets/images/rawFileBgs/rawFileBg2.jpg'
import rawFileBg3 from '@/domains/memora/assets/images/rawFileBgs/rawFileBg3.jpg'

const theme = useThemeClasses()
const themeStore = useThemeStore()
const route = useRoute()
const router = useRouter()

const rawFileStore = useRawFileStore()
const rawFilesApi = useRawFilesApi()
const mediaApi = useMediaApi()
const userStore = useUserStore()
const { fetchPublicSettings } = useSettingsApi()

// State
const rawFile = ref(null)
const mediaSets = ref([])
const mediaItems = ref([])
const selectedSetId = ref(null)
const isLoading = ref(true)
const isLoadingMediaSets = ref(false)
const isLoadingMedia = ref(false)
const isPasswordVerified = ref(false)
const passwordInput = ref('')
const isVerifyingPassword = ref(false)
const passwordError = ref('')
const guestToken = ref(null)
const showMediaLightbox = ref(false)
const previewMediaIndex = ref(0)
const brandingLogoUrl = ref(null)
const brandingName = ref(null)
const brandingBio = ref(null)
const showMazelootBranding = ref(true)
const isLoadingBranding = ref(true)
const isGalleryAssistDismissed = ref(false)

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
  return rawFile.value?.name && brandingName.value
    ? `${rawFile.value.name} - ${brandingName.value}`
    : brandingName.value || rawFile.value?.name || 'RawFile'
})

const ogDescription = computed(() => {
  return brandingBio.value || rawFile.value?.description || 
    `View media in this rawFile${brandingName.value ? ` from ${brandingName.value}` : ''}`
})

const ogImage = computed(() => {
  return rawFile.value?.coverPhotoUrl || rawFile.value?.cover_photo_url || ''
})

useOpenGraphMeta({
  title: ogTitle,
  description: ogDescription,
  image: ogImage,
  isLoading,
})

// Store password verification with timestamp (30 minutes)
const storePasswordVerification = (rawFileId) => {
  const expiresAt = Date.now() + (30 * 60 * 1000) // 30 minutes
  localStorage.setItem(`password_verified_rawFile_${rawFileId}`, JSON.stringify({
    verified: true,
    expiresAt,
    rawFileId
  }))
}

// Check if password verification is still valid
const getStoredPasswordVerification = (rawFileId) => {
  if (!rawFileId) return null
  try {
    const stored = localStorage.getItem(`password_verified_rawFile_${rawFileId}`)
    if (!stored) return null
    
    const data = JSON.parse(stored)
    const expiresAt = data.expiresAt
    
    // Check if expired
    if (Date.now() > expiresAt) {
      localStorage.removeItem(`password_verified_rawFile_${rawFileId}`)
      return null
    }
    
    // Verify it's for the correct rawFile
    if (data.rawFileId !== rawFileId) {
      localStorage.removeItem(`password_verified_rawFile_${rawFileId}`)
      return null
    }
    
    return data
  } catch (error) {
    localStorage.removeItem(`password_verified_rawFile_${rawFileId}`)
    return null
  }
}

// Check if current user is the owner of the rawFile
const isAuthenticatedOwner = computed(() => {
  if (!userStore.isAuthenticated || !rawFile.value) {
    return false
  }
  // Check if the authenticated user is the owner
  const userUuid = rawFile.value.userUuid || rawFile.value.user_uuid
  const currentUserId = userStore.user?.id || userStore.user?.uuid
  return userUuid && currentUserId && userUuid === currentUserId
})

// Check if in preview mode (preview=true query param AND authenticated owner)
const isPreviewMode = computed(() => {
  return route.query.preview === 'true' && isAuthenticatedOwner.value
})

// Get rawFile theme color (with fallback to blue-500 for rawFiles)
const rawFileColor = computed(() => {
  return rawFile.value?.color || '#3B82F6' // Default blue-500 for rawFiles
})

// Helper to convert hex to rgba with opacity
const hexToRgba = (hex, opacity = 1) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Helper to get lighter/darker variants
const getRawFileColorVariant = (opacity) => {
  return hexToRgba(rawFileColor.value, opacity)
}

const showGalleryAssist = computed(() => {
  if (!rawFile.value) return false
  // Check both direct property and nested settings
  const galleryAssist = rawFile.value.galleryAssist ?? rawFile.value.settings?.general?.galleryAssist ?? false
  return galleryAssist === true
})

const galleryAssistCards = computed(() => {
  if (!rawFile.value) return []
  
  const cards = [
    {
      id: 'view',
      icon: Eye,
      title: 'View Full Screen',
      description: 'Click on any media item to view it full-screen in the lightbox',
      show: true,
      priority: 2,
    },
  ]
  
  return cards
    .filter(card => card.show)
    .sort((a, b) => a.priority - b.priority)
})

const getGalleryAssistDismissKey = () => {
  const id = rawFile.value?.id || rawFile.value?.uuid
  return id ? `gallery-assist-dismissed-rawFile-${id}` : null
}

const dismissGalleryAssist = () => {
  isGalleryAssistDismissed.value = true
  const key = getGalleryAssistDismissKey()
  if (key && typeof window !== 'undefined') {
    localStorage.setItem(key, 'true')
  }
}

// Typography config - backend always returns defaults
const typographyConfig = computed(() => {
  const rawFileDesign = rawFile.value?.design || rawFile.value?.settings?.design || {}
  const rawFileTypography = rawFile.value?.typographyDesign || rawFileDesign?.typography || {}
  
  return {
    fontFamily: rawFileTypography.fontFamily || 'sans',
    fontStyle: rawFileTypography.fontStyle || 'normal',
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
  const name = rawFile.value?.name || 'RawFile'
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
  const description = rawFile.value?.description || ''
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

// Get rawFile color styles for dynamic theming
const getRawFileColorStyles = (type = 'bg') => {
  const color = rawFileColor.value
  return {
    [type]: color,
  }
}

// Get hover color (slightly darker)
const getRawFileHoverColor = () => {
  const color = rawFileColor.value
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
        const color = rawFileColor.value
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
const getRawFileGradientStyle = () => {
  const color = rawFileColor.value
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

// Abstract mesh pattern
const abstractMeshPattern = computed(() => {
  const color = rawFileColor.value
  const rgb = hexToRgb(color)
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="meshGrad1" cx="30%" cy="30%"><stop offset="0%" style="stop-color:rgba(${rgb.r},${rgb.g},${rgb.b},0.4)"/><stop offset="100%" style="stop-color:rgba(${rgb.r},${rgb.g},${rgb.b},0)"/></radialGradient><radialGradient id="meshGrad2" cx="70%" cy="70%"><stop offset="0%" style="stop-color:rgba(${rgb.r},${rgb.g},${rgb.b},0.3)"/><stop offset="100%" style="stop-color:rgba(${rgb.r},${rgb.g},${rgb.b},0)"/></radialGradient></defs><rect width="100%" height="100%" fill="rgba(0,0,0,0.02)"/><circle cx="120" cy="120" r="80" fill="url(#meshGrad1)"/><circle cx="280" cy="280" r="100" fill="url(#meshGrad2)"/><path d="M0,200 Q200,100 400,200 T800,200" stroke="rgba(${rgb.r},${rgb.g},${rgb.b},0.1)" stroke-width="2" fill="none"/><path d="M0,300 Q200,200 400,300 T800,300" stroke="rgba(${rgb.r},${rgb.g},${rgb.b},0.08)" stroke-width="2" fill="none"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})

// Default cover images array
const rawFileBgImages = [rawFileBg1, rawFileBg2, rawFileBg3]
const currentBgIndex = ref(0)

// Get random background index that changes every 5 minutes
const getRandomBgIndex = () => {
  // Use a timestamp-based seed that changes every 5 minutes (300000ms)
  const fiveMinuteInterval = Math.floor(Date.now() / 300000)
  // Use the interval as seed for consistent selection within the 5-minute window
  return fiveMinuteInterval % rawFileBgImages.length
}

// Set initial background on mount and update every 5 minutes
let bgIntervalId = null
onMounted(() => {
  currentBgIndex.value = getRandomBgIndex()
  
  // Update every 5 minutes
  bgIntervalId = setInterval(() => {
    currentBgIndex.value = getRandomBgIndex()
  }, 300000) // 5 minutes = 300000ms
})

// Cleanup interval on unmount
onUnmounted(() => {
  if (bgIntervalId) {
    clearInterval(bgIntervalId)
  }
})

// Default cover image from local assets (randomly selected, changes every 5 mins)
const defaultCoverImage = computed(() => {
  return rawFileBgImages[currentBgIndex.value]
})


// Check if text should be light (for dark backgrounds)
const shouldUseLightText = computed(() => {
  // Always use light text since we always show a cover (real or default)
  return true
})

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailInput.value && emailRegex.test(emailInput.value)
})

// Get guest token from URL or localStorage
const getStoredGuestToken = rawFileId => {
  // Check if guest token is in URL query
  const tokenFromUrl = route.query.guest_token || route.query.token
  if (tokenFromUrl) {
    guestToken.value = tokenFromUrl
    localStorage.setItem(`guest_token_${rawFileId}`, tokenFromUrl)
    return tokenFromUrl
  }

  // Check if stored in localStorage
  const storedToken = localStorage.getItem(`guest_token_${rawFileId}`)
  if (storedToken) {
    guestToken.value = storedToken
    return storedToken
  }

  return null
}

// Generate guest token with email
const generateGuestTokenWithEmail = async (rawFileId, email) => {
  try {
    const tokenData = await rawFilesApi.generateGuestToken(rawFileId, email)
    if (tokenData && tokenData.token) {
      guestToken.value = tokenData.token
      localStorage.setItem(`guest_token_${rawFileId}`, tokenData.token)
      // Also store the email for reference
      localStorage.setItem(`guest_email_${rawFileId}`, email)
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
    const rawFileId = route.params.rawFileId || route.query.rawFileId
    if (!rawFileId) {
      throw new Error('RawFile ID not found')
    }

    // Try to generate token - this will validate against allowed emails on backend
    await generateGuestTokenWithEmail(rawFileId, emailInput.value)
    showEmailModal.value = false
    emailInput.value = ''

    // Only reload if rawFile is not already loaded or ID changed
    const currentRawFileId = rawFile.value?.id
    if (!currentRawFileId || currentRawFileId !== rawFileId) {
      await loadRawFile()
    } else {
      // Just ensure media is loaded
      await loadMediaItems()
    }
  } catch (error) {
    // Check if error is about email not being allowed
    const errorMessage = error?.message || ''
    if (
      errorMessage.toLowerCase().includes('not authorized') ||
      errorMessage.toLowerCase().includes('not in the allowed')
    ) {
      emailError.value =
        'This email is not authorized to access this rawFile. Please contact the rawFile owner.'
    } else {
      emailError.value = errorMessage || 'Failed to generate access token. Please try again.'
    }
  } finally {
    isGeneratingToken.value = false
  }
}

// Loading guard to prevent duplicate requests
const isLoadingRawFile = ref(false)

// Load rawFile and media sets
const loadRawFile = async () => {
  const rawFileId = route.params.rawFileId || route.query.rawFileId
  
  if (!rawFileId) {
    throw new Error('RawFile ID is required in the URL')
  }

  // Prevent duplicate concurrent requests
  if (isLoadingRawFile.value) {
    return
  }

  // If rawFile is already loaded with the same ID and we're not forcing a refresh, skip
  if (rawFile.value?.id === rawFileId && !isLoading.value) {
    // Just ensure media is loaded if not already
    if (mediaSets.value.length === 0) {
      await loadMediaItems()
    }
    return
  }

  isLoadingRawFile.value = true
  isLoading.value = true
  try {

    // STEP 1: IMMEDIATELY CHECK SELECTION STATUS
    // Use dedicated status endpoint to check if rawFile is accessible
    let statusCheck = null
    const isPreview = route.query.preview === 'true'

    // If in preview mode, try to fetch rawFile directly first (bypass status check)
    if (isPreview) {
      try {
        // Try to fetch rawFile directly - if user is owner and authenticated, this will work
        const rawFileData = await rawFilesApi.fetchRawFile(rawFileId)
        rawFile.value = rawFileData

        // Verify user is owner
        const userUuid = rawFileData.userUuid || rawFileData.user_uuid
        const currentUserId = userStore.user?.id || userStore.user?.uuid
        const isOwner =
          userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId

        if (isOwner) {
          // Owner in preview mode - skip password check
          if (rawFileData.hasPassword) {
            isPasswordVerified.value = true
          }
          // Skip email modal for preview mode
          showEmailModal.value = false
          // Fetch branding
          if (userUuid) {
            await fetchBranding(userUuid)
          }
          // Load media sets and items
          if (rawFileData.mediaSets && rawFileData.mediaSets.length > 0) {
            mediaSets.value = rawFileData.mediaSets
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
        // If fetch fails in preview mode, it might not be owner or rawFile doesn't exist
        // Fall through to normal status check flow
        console.warn('Preview mode fetch failed, trying status check:', previewError)
      }
    }

    try {
      statusCheck = await rawFilesApi.checkRawFileStatus(rawFileId)

      // Validate response structure
      if (!statusCheck || typeof statusCheck !== 'object') {
        throw new Error('Invalid response from server')
      }

      // If preview mode and owner, allow access regardless of status
      if (isPreview && statusCheck.isOwner === true) {
        // Owner in preview mode - fetch full rawFile data
        const rawFileData = await rawFilesApi.fetchRawFile(rawFileId)
        rawFile.value = rawFileData
        // Skip password check for owner in preview
        if (rawFileData.hasPassword) {
          isPasswordVerified.value = true
        }
        // Skip email modal for preview mode
        showEmailModal.value = false
        // Fetch branding
        const userUuid = rawFileData.userUuid || rawFileData.user_uuid
        if (userUuid) {
          await fetchBranding(userUuid)
        }
        // Load media sets and items
        if (rawFileData.mediaSets && rawFileData.mediaSets.length > 0) {
          mediaSets.value = rawFileData.mediaSets
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
          'This rawFile is not yet published. Please contact the creator to publish it before accessing.'
        )
      }

      // If draft and owner, allow preview (no token needed)
      if (statusCheck.status === 'draft' && statusCheck.isOwner === true) {
        // Owner previewing draft - fetch full rawFile data
        const rawFileData = await rawFilesApi.fetchRawFile(rawFileId)
        rawFile.value = rawFileData
        // Skip password check for owner
        if (rawFileData.hasPassword) {
          isPasswordVerified.value = true
        }
        // Load media sets and items
        if (rawFileData.mediaSets && rawFileData.mediaSets.length > 0) {
          mediaSets.value = rawFileData.mediaSets
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
      if (isPreview) {
        try {
          const rawFileData = await rawFilesApi.fetchRawFile(rawFileId)
          rawFile.value = rawFileData

          // Verify user is owner
          const userUuid = rawFileData.userUuid || rawFileData.user_uuid
          const currentUserId = userStore.user?.id || userStore.user?.uuid
          const isOwner =
            userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId

          if (isOwner) {
            // Owner in preview mode - skip password check
            if (rawFileData.hasPassword) {
              isPasswordVerified.value = true
            }
            // Skip email modal for preview mode
            showEmailModal.value = false
            // Fetch branding
            if (userUuid) {
              await fetchBranding(userUuid)
            }
            // Load media sets and items
            if (rawFileData.mediaSets && rawFileData.mediaSets.length > 0) {
              mediaSets.value = rawFileData.mediaSets
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

      // Check if error is about rawFile not being published
      const errorMessage = statusError?.message || ''
      const errorCode = statusError?.code || ''

      if (
        errorMessage.toLowerCase().includes('not yet published') ||
        errorMessage.toLowerCase().includes('not active') ||
        errorMessage.toLowerCase().includes('rawFile is not active') ||
        errorMessage.toLowerCase().includes('not accessible') ||
        errorMessage.toLowerCase().includes('not found') ||
        errorCode === 'SELECTION_NOT_ACTIVE' ||
        errorCode === 'SELECTION_NOT_ACCESSIBLE' ||
        errorCode === 'NOT_FOUND'
      ) {
        throw statusError // Re-throw to show error immediately
      }

      // Other error - try to continue (might be network issue)
      console.warn('Status check failed, continuing with fallback:', statusError)
    }

    let token = null

    // STEP 2: GET OR GENERATE TOKEN FOR ACTIVE SELECTIONS
    // Skip token requirement if in preview mode
    if (!isPreview || !statusCheck?.isOwner) {
      // Only proceed if rawFile is active (we've verified above)
      token = getStoredGuestToken(rawFileId)

      if (!token) {
        // No token found - email is required, always show email modal
        showEmailModal.value = true
        isLoading.value = false
        return
      }
    }

    // STEP 3: FETCH SELECTION DATA WITH TOKEN
    let rawFileData
    try {
      // Check if authenticated owner - use authenticated routes
      const userUuid = statusCheck?.userUuid || statusCheck?.user_uuid
      const currentUserId = userStore.user?.id || userStore.user?.uuid
      const isOwner = userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId
      
      if (isOwner && userStore.isAuthenticated) {
        // Authenticated owner - use authenticated API routes
        rawFileData = await rawFilesApi.fetchRawFile(rawFileId)
      } else if (token) {
        // Guest user with token - use public/guest API routes
        guestToken.value = token // Ensure token is set for media loading
        rawFileData = await rawFilesApi.fetchRawFileGuest(rawFileId, token)
      } else if (userStore.isAuthenticated) {
        // Authenticated but not owner - try authenticated route
        try {
          rawFileData = await rawFilesApi.fetchRawFile(rawFileId)
        } catch (authError) {
          // If authenticated route fails, show email modal
          showEmailModal.value = true
          isLoading.value = false
          return
        }
      } else {
        // No token and not authenticated - show email modal
        showEmailModal.value = true
        isLoading.value = false
        return
      }
    } catch (error) {
      console.error('Failed to fetch rawFile:', error)

      const errorMessage = error?.message || ''
      const errorCode = error?.code || ''

      // Handle invalid/expired guest token
      if (
        errorCode === 'GUEST_TOKEN_INVALID' ||
        errorCode === 'GUEST_TOKEN_EXPIRED' ||
        errorMessage.toLowerCase().includes('invalid guest token') ||
        errorMessage.toLowerCase().includes('guest token') ||
        error?.status === 401
      ) {
        // Clear invalid token from storage
        localStorage.removeItem(`guest_token_${rawFileId}`)
        localStorage.removeItem(`guest_email_${rawFileId}`)
        guestToken.value = null
        userEmail.value = ''
        
        // Show email modal to get new token
        showEmailModal.value = true
        isLoading.value = false
        return
      }

      if (
        errorMessage.toLowerCase().includes('not active') ||
        errorMessage.toLowerCase().includes('rawFile is not active') ||
        errorMessage.toLowerCase().includes('not accessible') ||
        errorCode === 'SELECTION_NOT_ACTIVE' ||
        errorCode === 'SELECTION_NOT_ACCESSIBLE' ||
        error?.status === 403
      ) {
        throw new Error(
          'This rawFile is not yet published. Please contact the creator to publish it before accessing.'
        )
      }

      throw new Error(
        error?.message || 'RawFile not found or not accessible. Please check the link.'
      )
    }

    // Ensure rawFileData is valid
    if (!rawFileData || !rawFileData.id) {
      throw new Error('Invalid rawFile data received')
    }

    rawFile.value = rawFileData

    // Fetch branding
    const userUuid = rawFileData.userUuid || rawFileData.user_uuid
    if (userUuid) {
      await fetchBranding(userUuid)
    }

    // Validate guest email against allowed emails list (skip for authenticated owners and preview mode)
    if (
      !isAuthenticatedOwner.value &&
      !isPreviewMode.value &&
      userEmail.value &&
      rawFileData.allowedEmails &&
      Array.isArray(rawFileData.allowedEmails) &&
      rawFileData.allowedEmails.length > 0
    ) {
      const emailLower = userEmail.value.toLowerCase()
      const isEmailAllowed = rawFileData.allowedEmails.some(
        allowedEmail => allowedEmail && allowedEmail.toLowerCase() === emailLower
      )

      if (!isEmailAllowed) {
        // Guest email is no longer in allowed emails list - remove from storage
        localStorage.removeItem(`guest_email_${rawFileId}`)
        localStorage.removeItem(`guest_token_${rawFileId}`)
        userEmail.value = ''
        guestToken.value = null
        // Show email modal to re-authenticate
        showEmailModal.value = true
        isLoading.value = false
        return
      }
    }

    // Check password - skip for authenticated owners and preview mode
    if (rawFileData.hasPassword && !isPasswordVerified.value) {
      // If authenticated owner or in preview mode, auto-verify password
      const userUuid = rawFileData.userUuid || rawFileData.user_uuid
      const currentUserId = userStore.user?.id || userStore.user?.uuid
      const isOwnerCheck =
        userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId
      const isPreview = route.query.preview === 'true'

      if (isOwnerCheck || (isPreview && isOwnerCheck)) {
        isPasswordVerified.value = true
      } else {
        // Check if password was verified within last 30 minutes
        const storedVerification = getStoredPasswordVerification(rawFileId)
        if (storedVerification) {
          isPasswordVerified.value = true
        } else {
          // Password will be checked via modal - don't load media yet
          return
        }
      }
    }

    // Load media sets - only fetch if not already in response and not already loaded
    if (rawFileData.mediaSets && rawFileData.mediaSets.length > 0) {
      // Use media sets from response if available
      if (mediaSets.value.length === 0 || mediaSets.value[0]?.rawFileId !== rawFileId) {
        mediaSets.value = rawFileData.mediaSets
      }
    } else if (mediaSets.value.length === 0 || mediaSets.value[0]?.rawFileId !== rawFileId) {
      // Only fetch if not already loaded for this rawFile
      isLoadingMediaSets.value = true
      try {
        let sets
        // Check if authenticated owner
        const userUuid = rawFileData.userUuid || rawFileData.user_uuid
        const currentUserId = userStore.user?.id || userStore.user?.uuid
        const isOwner = userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId
        
        if (isOwner && userStore.isAuthenticated) {
          // Authenticated owner - use authenticated endpoint
          sets = await rawFilesApi.fetchMediaSets(rawFileId)
        } else if (token || guestToken.value) {
          // Guest user with token - use public/guest endpoint
          sets = await rawFilesApi.fetchMediaSetsGuest(rawFileId, token || guestToken.value)
        } else {
          // Fallback: try authenticated endpoint
          sets = await rawFilesApi.fetchMediaSets(rawFileId)
        }
        if (sets && sets.length > 0) {
          mediaSets.value = sets
        }
      } catch (error) {
        console.warn('Failed to fetch media sets:', error)
      } finally {
        isLoadingMediaSets.value = false
      }
    }
    
    // Auto-select first set if none selected and sets exist
    if (!selectedSetId.value && mediaSets.value.length > 0) {
      selectedSetId.value = mediaSets.value[0].id
    }

    // Load media items if password is not required, or verified, or in preview mode, or authenticated owner
    const shouldLoadMedia =
      !rawFileData.hasPassword ||
      isPasswordVerified.value ||
      isPreviewMode.value ||
      isAuthenticatedOwner.value

    if (shouldLoadMedia) {
      await loadMediaItems()
    }
  } catch (error) {
    console.error('Error loading rawFile:', error)

    // Check if error is about rawFile not being published
    const errorMessage = error?.message || ''
    if (
      errorMessage.toLowerCase().includes('not yet published') ||
      errorMessage.toLowerCase().includes('not active') ||
      errorMessage.toLowerCase().includes('rawFile is not active')
    ) {
      // Show error immediately - don't show toast, show in UI
      toast.error('RawFile not published', {
        description:
          'This rawFile is not yet published. Please contact the creator to publish it before accessing.',
        duration: 8000,
      })
    } else {
      // Use exact backend error message
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to load rawFile'
      toast.error('Failed to load rawFile', {
        description: errorMessage,
      })
    }
  } finally {
    isLoading.value = false
    isLoadingRawFile.value = false
  }
}

// Load media for a specific set
const loadMediaForSet = async (setId) => {
  if (!rawFile.value?.id || !setId) return
  if (!isPasswordVerified.value && rawFile.value?.hasPassword && !isPreviewMode.value) return

  isLoadingMedia.value = true
  try {
    const isDraft = rawFile.value?.status === 'draft'
    let setMedia

    // Check if authenticated owner - use authenticated endpoint
    const userUuid = rawFile.value.userUuid || rawFile.value.user_uuid
    const currentUserId = userStore.user?.id || userStore.user?.uuid
    const isOwner = userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId
    
    if (isOwner && userStore.isAuthenticated) {
      // Authenticated owner - use authenticated endpoint
      setMedia = await rawFilesApi.fetchSetMedia(rawFile.value.id, setId)
    } else if (isPreviewMode.value) {
      // Preview mode - use authenticated endpoint
      setMedia = await rawFilesApi.fetchSetMedia(rawFile.value.id, setId)
    } else {
      // Public mode - use public/guest endpoints
      // Ensure we have a guest token for active/completed rawFiles
      if (!isDraft && !guestToken.value && rawFile.value?.id) {
        const token = getStoredGuestToken(rawFile.value.id)
        if (token) {
          guestToken.value = token
        } else {
          console.warn('No guest token available for loading media')
          return
        }
      }

      if (isDraft && !guestToken.value) {
        // For draft rawFiles, try authenticated endpoint first (for owner preview)
        try {
          setMedia = await rawFilesApi.fetchSetMedia(rawFile.value.id, setId)
        } catch (error) {
          const token = getStoredGuestToken(rawFile.value.id)
          if (token) {
            guestToken.value = token
            setMedia = await rawFilesApi.fetchSetMediaGuest(rawFile.value.id, setId, token)
          } else {
            throw error
          }
        }
      } else if (guestToken.value) {
        // Use guest endpoint for active/completed rawFiles
        setMedia = await rawFilesApi.fetchSetMediaGuest(
          rawFile.value.id,
          setId,
          guestToken.value
        )
      } else {
        // Fallback: try regular endpoint (requires authentication)
        setMedia = await rawFilesApi.fetchSetMedia(rawFile.value.id, setId)
      }
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
      errorMessage.toLowerCase().includes('rawFile is not active') ||
      error?.code === 'SELECTION_NOT_ACTIVE' ||
      error?.status === 403
    ) {
      toast.error('RawFile not published', {
        description: 'This rawFile is not yet published. Please contact the creator to publish it before accessing.',
      })
    } else {
      toast.error(errorMessage)
    }
  } finally {
    isLoadingMedia.value = false
  }
}

// Load media items for selected set
const loadMediaItems = async () => {
  if (!rawFile.value?.id) return
  if (!isPasswordVerified.value && rawFile.value?.hasPassword && !isPreviewMode.value) return
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

// Download PIN state
const isDownloadPinVerified = ref(false)
const downloadPinInput = ref('')
const verifiedDownloadPin = ref('')
const isVerifyingDownloadPin = ref(false)
const downloadPinError = ref('')
const showDownloadPinModal = ref(false)
const pendingDownloadItem = ref(null)
const pendingDownloadSet = ref(false)
const pendingDownloadAll = ref(false)
const downloadingMediaIds = ref(new Set())
const isDownloadingSet = ref(false)

const handleVerifyPassword = async () => {
  if (!passwordInput.value || !rawFile.value) return

  isVerifyingPassword.value = true
  passwordError.value = ''

  try {
    // Verify password with backend
    await rawFilesApi.verifyPassword(rawFile.value.id, passwordInput.value)

    // Password verified successfully - store for 30 minutes
    verifiedPassword.value = passwordInput.value
    isPasswordVerified.value = true
    storePasswordVerification(rawFile.value.id)
    passwordInput.value = ''
    
    // Only reload if rawFile is not already loaded
    if (!rawFile.value?.id) {
      await loadRawFile()
    } else {
      // Load media sets if not already loaded
      if (mediaSets.value.length === 0) {
        try {
          const rawFileId = rawFile.value.id
          const token = getStoredGuestToken(rawFileId)
          let sets
          
          // Check if authenticated owner
          const userUuid = rawFile.value.userUuid || rawFile.value.user_uuid
          const currentUserId = userStore.user?.id || userStore.user?.uuid
          const isOwner = userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId
          
          if (isOwner && userStore.isAuthenticated) {
            sets = await rawFilesApi.fetchMediaSets(rawFileId)
          } else if (token || guestToken.value) {
            sets = await rawFilesApi.fetchMediaSetsGuest(rawFileId, token || guestToken.value)
          } else {
            sets = await rawFilesApi.fetchMediaSets(rawFileId)
          }
          
          if (sets && sets.length > 0) {
            const setsData = sets?.data || sets || []
            mediaSets.value = Array.isArray(setsData) ? setsData : []
            
            // Auto-select first set if none selected
            if (!selectedSetId.value && mediaSets.value.length > 0) {
              const sortedSets = [...mediaSets.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              selectedSetId.value = sortedSets[0].id || sortedSets[0].uuid
            }
          }
        } catch (error) {
          console.warn('Failed to fetch media sets after password verification:', error)
        }
      }
      
      // Load media items now that password is verified
      await loadMediaItems()
    }
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

  const index = currentMediaItems.value.findIndex(m => m.id === item.id)
  if (index !== -1) {
    previewMediaIndex.value = index
    showMediaLightbox.value = true
  }
}

// Check if rawFile cover photo is a video
const isVideoCover = computed(() => {
  if (!rawFile.value?.coverPhotoUrl && !rawFile.value?.cover_photo_url) return false

  const coverUrl = rawFile.value.coverPhotoUrl || rawFile.value.cover_photo_url
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
  return videoExtensions.some(ext => coverUrl.toLowerCase().includes(ext))
})

// Get rawFile cover photo style with focal point
const getRawFileCoverStyle = () => {
  const style = {}

  if (!rawFile.value) return style

  // Get focal point from rawFile
  const focalPoint = rawFile.value.coverFocalPoint || rawFile.value.cover_focal_point

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
  const rawFileId = route.params.projectId
  if (rawFileId) {
    clearRawFileGuestData(rawFileId)
  }
  
  // Reset all state
  guestToken.value = null
  isPasswordVerified.value = false
  passwordInput.value = ''
  userEmail.value = ''
  emailInput.value = ''
  rawFile.value = null
  mediaSets.value = []
  mediaItems.value = []
  
  toast.success('Logged out successfully')
  
  // Reload the page to reset everything
  window.location.reload()
}


// Download handlers
const isDownloadEnabled = computed(() => {
  if (!rawFile.value) return true
  // Default to true if not specified (backward compatibility)
  return rawFile.value.downloadEnabled !== false && (rawFile.value.download?.downloadEnabled !== false)
})

const requiresDownloadPin = computed(() => {
  return rawFile.value?.download?.downloadPinEnabled && !isAuthenticatedOwner.value
})

const handleVerifyDownloadPin = async () => {
  if (!downloadPinInput.value || downloadPinInput.value.length !== 4) return

  isVerifyingDownloadPin.value = true
  downloadPinError.value = ''

  try {
    const rawFileId = rawFile.value?.id
    if (!rawFileId) {
      throw new Error('Raw file ID is missing.')
    }

    const response = await rawFilesApi.verifyDownloadPin(rawFileId, downloadPinInput.value)

    if (response.verified) {
      storeDownloadPin(rawFileId, downloadPinInput.value)
      verifiedDownloadPin.value = downloadPinInput.value
      isDownloadPinVerified.value = true
      showDownloadPinModal.value = false
      downloadPinInput.value = ''
      toast.success('Download PIN verified')

      // Auto-trigger download if pending
      if (pendingDownloadItem.value) {
        const item = pendingDownloadItem.value
        pendingDownloadItem.value = null
        await handleDownloadMedia(item)
      } else if (pendingDownloadSet.value) {
        pendingDownloadSet.value = false
        await handleDownloadSet()
      } else if (pendingDownloadAll.value) {
        pendingDownloadAll.value = false
        // Generate access token before navigating
        if (rawFile.value?.id) {
          const rawFileId = rawFile.value.id || rawFile.value.uuid
          const accessToken = generateDownloadPageAccessToken(rawFileId)
          router.push({
            name: 'clientRawFileDownload',
            query: { rawFileId, accessToken }
          })
        } else {
          navigateToDownloadPage()
        }
      }
    } else {
      const errorMessage = response.message || 'Incorrect PIN. Please try again.'
      downloadPinError.value = errorMessage
      downloadPinInput.value = ''
    }
  } catch (err) {
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to verify PIN. Please try again.'
    downloadPinError.value = errorMessage
    downloadPinInput.value = ''
  } finally {
    isVerifyingDownloadPin.value = false
  }
}

const handleDownloadMedia = async (item) => {
  if (!item || !rawFile.value) return

  // Disable downloads in preview mode
  if (isPreviewMode.value) {
    toast.info('Downloads are disabled in preview mode')
    return
  }

  // Check download PIN
  if (requiresDownloadPin.value && !isAuthenticatedOwner.value) {
    const rawFileId = rawFile.value.id
    const storedPin = getStoredDownloadPin(rawFileId)

    if (storedPin) {
      verifiedDownloadPin.value = storedPin
      isDownloadPinVerified.value = true
    } else if (!isDownloadPinVerified.value) {
      pendingDownloadItem.value = item
      showDownloadPinModal.value = true
      return
    }
  }

  // Proceed with download
  const mediaId = item.id || item.uuid
  downloadingMediaIds.value = new Set(downloadingMediaIds.value).add(mediaId)
  try {
    const rawFileId = rawFile.value.id
    const endpoint = `/v1/public/raw-files/${rawFileId}/media/${mediaId}/download`
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`
    const headers = {}
    
    // Add download PIN if verified
    if (isDownloadPinVerified.value && verifiedDownloadPin.value) {
      headers['X-Download-PIN'] = verifiedDownloadPin.value
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      let errorData = {}
      try {
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          errorData = await response.json()
        } else {
          const text = await response.text()
          errorData = { message: text || `Download failed with status ${response.status}` }
        }
      } catch {
        errorData = { message: `Download failed with status ${response.status}` }
      }
      throw {
        message: errorData.message || errorData.error || `Download failed with status ${response.status}`,
        code: errorData.code,
        status: response.status,
      }
    }

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = item.title || item.filename || 'media'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
        try {
          filename = decodeURIComponent(filename)
        } catch {
          // Keep original if decode fails
        }
      }
    }

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', filename)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    }, 100)

    toast.success('Download started')
  } catch (err) {
    const errorMessage = err?.message || err?.response?.data?.message || 'Failed to download media'
    const errorCode = err?.code || err?.response?.data?.code
    
    if (errorCode === 'DOWNLOAD_PIN_REQUIRED') {
      const rawFileId = rawFile.value.id
      removeStoredDownloadPin(rawFileId)
      isDownloadPinVerified.value = false
      verifiedDownloadPin.value = ''
      showDownloadPinModal.value = true
      toast.error(errorMessage)
    } else {
      toast.error(errorMessage)
    }
  } finally {
    const newSet = new Set(downloadingMediaIds.value)
    newSet.delete(mediaId)
    downloadingMediaIds.value = newSet
  }
}

// Download all items in current set
const handleDownloadSet = async () => {
  if (!rawFile.value) return

  // Disable downloads in preview mode
  if (isPreviewMode.value) {
    toast.info('Downloads are disabled in preview mode')
    return
  }

  // Get items to download - all items in current set
  const itemsToDownload = currentMediaItems.value

  if (itemsToDownload.length === 0) {
    toast.info('No items to download', {
      description: 'No items available for download in this set.'
    })
    return
  }

  // Check download PIN
  if (requiresDownloadPin.value && !isAuthenticatedOwner.value) {
    const rawFileId = rawFile.value.id
    const storedPin = getStoredDownloadPin(rawFileId)

    if (storedPin) {
      verifiedDownloadPin.value = storedPin
      isDownloadPinVerified.value = true
    } else if (!isDownloadPinVerified.value) {
      pendingDownloadSet.value = true
      showDownloadPinModal.value = true
      return
    }
  }

  isDownloadingSet.value = true
  const totalItems = itemsToDownload.length
  let successCount = 0
  let failCount = 0

  try {
    for (let i = 0; i < itemsToDownload.length; i++) {
      const item = itemsToDownload[i]
      const mediaId = item.id || item.uuid

      try {
        downloadingMediaIds.value = new Set(downloadingMediaIds.value).add(mediaId)

        const rawFileId = rawFile.value.id
        const endpoint = `/v1/public/raw-files/${rawFileId}/media/${mediaId}/download`
        const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.API_BASE_URL}${endpoint}`
        const headers = {}

        // Add download PIN if verified
        if (isDownloadPinVerified.value && verifiedDownloadPin.value) {
          headers['X-Download-PIN'] = verifiedDownloadPin.value
        }

        const response = await fetch(url, {
          method: 'GET',
          headers,
        })

        if (!response.ok) {
          let errorData = {}
          try {
            const contentType = response.headers.get('content-type')
            if (contentType?.includes('application/json')) {
              errorData = await response.json()
            } else {
              const text = await response.text()
              errorData = { message: text || `Download failed with status ${response.status}` }
            }
          } catch {
            errorData = { message: `Download failed with status ${response.status}` }
          }

          throw {
            message: errorData.message || errorData.error || `Download failed with status ${response.status}`,
            code: errorData.code,
            status: response.status,
          }
        }

        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition')
        let filename = item.title || item.filename || 'media'
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '')
            try {
              filename = decodeURIComponent(filename)
            } catch {
              // Keep original if decode fails
            }
          }
        }

        const blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.setAttribute('download', filename)
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
          document.body.removeChild(link)
          window.URL.revokeObjectURL(blobUrl)
        }, 100)

        successCount++

        // Small delay between downloads to avoid overwhelming the browser
        if (i < itemsToDownload.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      } catch (err) {
        failCount++
        const errorCode = err?.code || err?.response?.data?.code

        if (errorCode === 'DOWNLOAD_PIN_REQUIRED') {
          const rawFileId = rawFile.value.id
          removeStoredDownloadPin(rawFileId)
          isDownloadPinVerified.value = false
          verifiedDownloadPin.value = ''
          showDownloadPinModal.value = true
          toast.error(err?.message || 'Download PIN required')
          break
        }
      } finally {
        const newSet = new Set(downloadingMediaIds.value)
        newSet.delete(mediaId)
        downloadingMediaIds.value = newSet
      }
    }

    if (successCount > 0) {
      toast.success(`Downloaded ${successCount} of ${totalItems} item(s)`, {
        description: failCount > 0 ? `${failCount} item(s) failed to download.` : undefined
      })
    } else if (failCount > 0) {
      toast.error('All downloads failed', {
        description: 'Please try again or download items individually.'
      })
    }
  } catch (err) {
    toast.error(err?.message || 'Failed to download items')
  } finally {
    isDownloadingSet.value = false
  }
}

// Generate access token for download page
const generateDownloadPageAccessToken = (rawFileId) => {
  const token = `access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
  localStorage.setItem(`download_page_access_${rawFileId}`, JSON.stringify({ token, expiresAt }))
  return token
}

// Navigate to download page
const navigateToDownloadPage = () => {
  if (!rawFile.value) return

  // Disable in preview mode
  if (isPreviewMode.value) {
    toast.info('Downloads are disabled in preview mode')
    return
  }

  if (mediaItems.value.length === 0) {
    toast.info('No items to download', {
      description: 'No items available for download in this raw file.'
    })
    return
  }

  // Check download PIN before navigating
  if (requiresDownloadPin.value && !isAuthenticatedOwner.value) {
    const rawFileId = rawFile.value.id
    const storedPin = getStoredDownloadPin(rawFileId)

    if (storedPin) {
      verifiedDownloadPin.value = storedPin
      isDownloadPinVerified.value = true
      // PIN is verified, proceed with navigation
    } else if (!isDownloadPinVerified.value) {
      // PIN required but not verified, show modal
      pendingDownloadAll.value = true
      showDownloadPinModal.value = true
      return
    }
  }

  const rawFileId = rawFile.value.id || rawFile.value.uuid
  const accessToken = generateDownloadPageAccessToken(rawFileId)
  
  router.push({
    name: 'clientRawFileDownload',
    query: { rawFileId, accessToken }
  })
}

// Initialize download protection
const { cleanup: cleanupProtection } = useDownloadProtection({
  enabled: true,
  showWarnings: false,
})

onMounted(() => {
  // Check if we have a stored password verification for this rawFile
  const rawFileId = route.params.rawFileId || route.query.rawFileId
  if (rawFileId) {
    const storedVerification = getStoredPasswordVerification(rawFileId)
    if (storedVerification) {
      isPasswordVerified.value = true
    }
    
    // Check if we have a stored email for this rawFile
    const storedEmail = localStorage.getItem(`guest_email_${rawFileId}`)
    if (storedEmail) {
      userEmail.value = storedEmail
    }
  }

  // Check if Gallery Assist was previously dismissed
  const key = getGalleryAssistDismissKey()
  if (key && typeof window !== 'undefined') {
    const dismissed = localStorage.getItem(key)
    if (dismissed === 'true') {
      isGalleryAssistDismissed.value = true
    }
  }

  // Load rawFile (will show email modal if needed)
  loadRawFile()
})

onUnmounted(() => {
  cleanupProtection()
})
</script>

<style scoped>
/* Fade transition for Gallery Assist container */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Card transition for Gallery Assist cards */
.card-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: var(--card-delay, 0ms);
}

.card-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}

.card-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.card-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slow pulse animation for abstract orbs */
@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1) translate(0, 0);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.1) translate(10px, -10px);
    opacity: 0.15;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}
</style>
