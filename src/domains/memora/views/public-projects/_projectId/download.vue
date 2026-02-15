<template>
  <div :class="[theme.bgPage, 'min-h-screen relative overflow-hidden']" :style="coverPhotoStyle">
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50 dark:from-black/70 dark:via-black/60 dark:to-black/70 light:from-white/60 light:via-white/40 light:to-white/60 backdrop-blur-md z-0"></div>
    
    <!-- Content -->
    <div class="relative z-10">
    <!-- Header with Branding -->
    <header :class="[theme.borderSecondary, 'sticky top-0 z-40  backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/80 border-b']">
      <div class="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <div class="flex items-center gap-3">
          <button
            v-if="!zipFile"
            @click="handleBack"
            :disabled="isNavigatingBack"
            :class="[theme.bgButtonHover, 'p-2 rounded-lg transition-all duration-200 flex-shrink-0 group disabled:opacity-50 disabled:cursor-not-allowed']"
            title="Go back"
          >
            <Loader2 v-if="isNavigatingBack" :class="[theme.textSecondary, 'h-5 w-5 animate-spin']" />
            <ChevronLeft v-else :class="[theme.textSecondary, 'h-5 w-5 group-hover:text-white dark:group-hover:text-gray-50 light:group-hover:text-gray-900 transition-colors']" />
          </button>
          <img
            v-if="brandingLogoUrl"
            :src="brandingLogoUrl"
            :alt="brandName || 'Brand'"
            class="h-8 w-auto object-contain"
            loading="lazy"
            decoding="async"
          />
          <MazelootLogo
            v-else-if="showMazelootBranding"
            size="sm"
            :color-class="theme.textPrimary"
          />
        </div>
        <div class="flex items-center gap-4">
          <div :class="[theme.textSecondary, 'text-sm']">
            {{ brandName || 'Mazeloot' }}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Initial Loading State -->
    <div v-if="isInitialLoading && !isLoadingState" class="min-h-[calc(100vh-200px)] flex items-center justify-center py-20 animate-fade-in">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <!-- Left Section: Skeleton -->
          <div class="flex flex-col justify-center space-y-6 animate-slide-up">
            <div class="space-y-4">
              <div :class="[theme.bgSkeleton, 'h-16 rounded-lg animate-pulse']"></div>
              <div :class="[theme.bgSkeleton, 'h-6 w-48 rounded-lg animate-pulse']"></div>
            </div>
          </div>
          <!-- Right Section: Skeleton -->
          <div class="space-y-6 animate-slide-up animation-delay-100">
            <div :class="['backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4']">
              <div :class="[theme.bgSkeleton, 'h-6 w-32 rounded animate-pulse']"></div>
              <div class="space-y-3">
                <div v-for="i in 3" :key="i" :class="[theme.bgSkeleton, 'h-16 rounded-xl animate-pulse']"></div>
              </div>
            </div>
            <div :class="['backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4']">
              <div :class="[theme.bgSkeleton, 'h-6 w-32 rounded animate-pulse']"></div>
              <div class="space-y-3">
                <div v-for="i in 2" :key="i" :class="[theme.bgSkeleton, 'h-16 rounded-xl animate-pulse']"></div>
              </div>
            </div>
            <div :class="[theme.bgSkeleton, 'h-14 rounded-xl animate-pulse']"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Processing Loading State -->
    <div v-else-if="isLoadingState" class="min-h-[calc(100vh-200px)] flex items-center justify-center py-20 animate-fade-in">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <!-- Left Section: Collection Info -->
          <div class="flex flex-col justify-center space-y-6 animate-slide-up">
            <div>
              <h1 :class="[theme.textPrimary, 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 leading-tight tracking-tight drop-shadow-lg']">
                {{ collectionName }}
              </h1>
              <p :class="[theme.textSecondary, 'text-base sm:text-lg md:text-xl font-medium drop-shadow-md']">{{ brandName }}</p>
            </div>
          </div>

          <!-- Right Section: Loading -->
          <div class="backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 flex flex-col items-center justify-center space-y-6 sm:space-y-8 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 animate-slide-up animation-delay-100">
            <div class="relative w-20 h-20">
              <div :class="[theme.borderSecondary, 'absolute inset-0 border-4 rounded-full opacity-30']"></div>
              <div class="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div class="text-center space-y-3">
              <h2 :class="[theme.textPrimary, 'text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight']">
                <template v-if="selectedDestination !== 'device'">
                  WE'RE SENDING YOUR MEDIA TO<br>
                  <span class="text-accent">{{ getDestinationLabel(selectedDestination).toUpperCase() }}</span>
                </template>
                <template v-else>
                  WE ARE PREPARING YOUR MEDIA
                </template>
              </h2>
              <p :class="[theme.textSecondary, 'text-base']">
                You will be notified by email once your download has completed.
              </p>
              <p :class="[theme.textTertiary, 'text-sm']">
                <template v-if="selectedDestination !== 'device'">
                  You can also stay on this page or go to {{ getDestinationLabel(selectedDestination) }} to view progress.
                </template>
                <template v-else>
                  You can also stay on this page if you prefer.
                </template>
              </p>
            </div>

            <!-- Download Summary -->
            <div :class="[theme.borderSecondary, 'w-full border-t pt-6 mt-4']">
              <h3 :class="[theme.textPrimary, 'text-lg font-semibold mb-4 text-center']">Download Summary</h3>
              <div class="space-y-3">
                <!-- Selected Sets -->
                <div :class="[theme.bgInput, 'rounded-lg p-4']">
                  <div :class="[theme.textPrimary, 'text-sm font-medium mb-2']">Selected Sets:</div>
                  <div class="space-y-1">
                    <div
                      v-for="setId in selectedSets"
                      :key="setId"
                      class="flex items-center justify-between text-sm"
                    >
                      <span :class="[theme.textSecondary]">
                        {{ photoSets.find(s => s.id === setId)?.name || 'Unknown Set' }}
                      </span>
                      <span :class="[theme.textTertiary]">
                        {{ photoSets.find(s => s.id === setId)?.count || 0 }} {{ photoSets.find(s => s.id === setId)?.count === 1 ? 'media' : 'medias' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Download Size -->
                <div v-if="selectedSize" :class="[theme.bgInput, 'rounded-lg p-4']">
                  <div :class="[theme.textPrimary, 'text-sm font-medium mb-1']">Download Size:</div>
                  <div :class="[theme.textSecondary, 'text-sm']">
                    {{ downloadSizes.find(s => s.value === selectedSize)?.label || selectedSize }}
                    <span :class="[theme.textTertiary]">({{ downloadSizes.find(s => s.value === selectedSize)?.size || '' }})</span>
                  </div>
                </div>

                <!-- Destination -->
                <div :class="[theme.bgInput, 'rounded-lg p-4']">
                  <div :class="[theme.textPrimary, 'text-sm font-medium mb-1']">Download To:</div>
                  <div class="flex items-center gap-2 text-sm" :class="[theme.textSecondary]">
                    <component 
                      :is="downloadDestinations.find(d => d.value === selectedDestination)?.icon" 
                      :class="['w-4 h-4', downloadDestinations.find(d => d.value === selectedDestination)?.color || theme.textSecondary]"
                    />
                    <span>{{ getDestinationLabel(selectedDestination) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success State with ZIP Download -->
    <div v-else-if="zipFile" class="min-h-[calc(100vh-200px)] flex items-center justify-center py-20">
      <div class="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <!-- Left Section: Collection Info -->
          <div class="flex flex-col justify-center space-y-6">
            <div>
              <h1 :class="[theme.textPrimary, 'text-6xl lg:text-7xl font-bold mb-3 leading-tight tracking-tight']">
                {{ collectionName }}
              </h1>
              <p :class="[theme.textSecondary, 'text-xl font-medium']">{{ brandName }}</p>
            </div>
          </div>

          <!-- Right Section: Download Ready -->
          <div class="relative">
            <!-- Success Badge -->
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div class="relative">
                <div class="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div class="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110 border-4" :class="theme.bgCard">
                  <Check class="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <div class="backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 flex flex-col items-center justify-center space-y-6 rounded-3xl shadow-2xl p-10 pt-16 animate-slide-up animation-delay-200">
              <!-- Success Message -->
              <div class="text-center space-y-3 mt-4">
                <template v-if="selectedDestination !== 'device' && zipFile.cloudUploadUrl">
                  <!-- Service Icon -->
                  <div class="flex justify-center mb-4">
                    <component
                      :is="downloadDestinations.find(d => d.value === selectedDestination)?.icon"
                      class="w-16 h-16"
                      :class="downloadDestinations.find(d => d.value === selectedDestination)?.color || theme.textPrimary"
                    />
                  </div>
                  <h2 :class="[theme.textPrimary, 'text-3xl lg:text-4xl font-bold tracking-tight']">
                    YOUR MEDIA ARE READY ON<br>
                    <span class="text-accent">{{ getDestinationLabel(selectedDestination).toUpperCase() }}</span>
                  </h2>
                  <p :class="[theme.textSecondary, 'text-base']">
                    Go to your {{ getDestinationLabel(selectedDestination) }} account to see your media.
                  </p>
                </template>
                <template v-else>
                  <h2 :class="[theme.textPrimary, 'text-3xl lg:text-4xl font-bold tracking-tight']">YOUR MEDIA ARE READY!</h2>
                  <p :class="[theme.textSecondary, 'text-lg']">Download your media in a single ZIP file</p>
                </template>
              </div>

              <!-- Cloud Upload Error Message -->
              <div v-if="selectedDestination !== 'device' && zipFile.cloudUploadError && !zipFile.cloudUploadUrl" class="w-full mb-4">
                <div class="p-4 sm:p-6 backdrop-blur-xl bg-red-500/10 dark:bg-red-500/20 light:bg-red-50/70 border-2 border-red-400/30 dark:border-red-400/40 light:border-red-200 rounded-2xl shadow-xl">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-red-500 rounded-lg shadow-lg">
                      <X class="w-5 h-5 text-white" />
                    </div>
                    <span class="text-red-900 dark:text-red-100 font-bold text-lg drop-shadow-sm">Cloud Upload Failed</span>
                  </div>
                  <p class="text-red-800 dark:text-red-200 text-sm mb-4 drop-shadow-sm">
                    {{ zipFile.cloudUploadError }}
                  </p>
                  <p class="text-red-700 dark:text-red-300 text-xs">
                    Your media are available for download below as a backup.
                  </p>
                </div>
              </div>

              <!-- Cloud Upload CTA Button -->
              <div v-if="selectedDestination !== 'device' && zipFile.cloudUploadUrl" class="w-full">
                <a
                  :href="zipFile.cloudUploadUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center justify-center gap-3 w-full px-8 py-4 bg-gray-800 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 text-white font-bold text-lg uppercase tracking-wide rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  GO TO {{ getDestinationLabel(selectedDestination).toUpperCase() }}
                </a>
              </div>

              <!-- Download Card -->
              <div v-if="selectedDestination === 'device' || !zipFile.cloudUploadUrl" class="w-full space-y-4">
                <button
                  @click="handleZipDownload"
                  :disabled="isDownloadingZip"
                  class="group relative w-full p-4 sm:p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col gap-4 cursor-pointer overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <!-- Animated Background Effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div class="relative flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                        <Loader2 v-if="isDownloadingZip" class="w-6 h-6 text-white animate-spin" />
                        <Download v-else class="w-6 h-6 text-white" />
                      </div>
                      <div class="flex flex-col">
                        <span class="text-white font-bold text-lg">{{ zipFile.filename }}</span>
                        <span :class="[theme.textSecondary, 'text-sm font-medium opacity-90']">{{ zipFile.size }}</span>
                      </div>
                    </div>
                    <div class="px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <Loader2 v-if="isDownloadingZip" class="w-5 h-5 text-white animate-spin" />
                      <Download v-else class="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div class="relative pt-2 border-t border-white/20">
                    <span class="text-white/90 text-sm font-medium">
                      {{ isDownloadingZip ? 'Downloading...' : 'Click to download your media' }}
                    </span>
                  </div>
                </button>
              </div>

              <!-- Fallback Download Option (for cloud uploads) -->
              <div v-if="selectedDestination !== 'device' && zipFile.cloudUploadUrl" class="w-full pt-4 border-t" :class="theme.borderSecondary">
                <p :class="[theme.textSecondary, 'text-sm text-center mb-4']">
                  Need a backup? Download to your device as well.
                </p>
                <button
                  @click="handleZipDownload"
                  :disabled="isDownloadingZip"
                  class="flex items-center justify-center gap-2 w-full px-4 py-2.5 backdrop-blur-sm bg-white/10 dark:bg-black/20 light:bg-white/60 border-2 border-white/20 dark:border-white/10 light:border-gray-200/50 rounded-lg hover:border-accent/50 hover:bg-white/20 dark:hover:bg-black/30 light:hover:bg-white/80 transition-all duration-300 font-medium text-sm transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  :class="[theme.textPrimary]"
                >
                  <Loader2 v-if="isDownloadingZip" class="w-4 h-4 animate-spin" />
                  <Download v-else class="w-4 h-4" />
                  <span>{{ isDownloadingZip ? 'Downloading...' : 'Download to Device' }}</span>
                </button>
              </div>

              <!-- Action Buttons -->
              <div :class="[theme.borderSecondary, 'w-full pt-4 border-t']">
                <button
                  @click="handleBackToCollection"
                  :disabled="isNavigating"
                  :class="[theme.textPrimary, theme.bgButtonHover, 'w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed']"
                >
                  <Loader2 v-if="isNavigating" class="w-4 h-4 animate-spin" />
                  <ArrowLeft v-else class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>{{ isNavigating ? 'Loading...' : 'Back to Collection' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selection State -->
    <div v-else-if="!isInitialLoading && !isLoadingState && !zipFile" class="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-20 max-w-6xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <!-- Left Section: Collection Info -->
        <div class="flex flex-col justify-center space-y-6 sticky top-24 animate-slide-up">
          <div>
            <h1 :class="[theme.textPrimary, 'text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight tracking-tight drop-shadow-lg']">
              {{ collectionName }}
            </h1>
            <p :class="[theme.textSecondary, 'text-xl font-medium drop-shadow-md']">{{ brandName }}</p>
          </div>
        </div>

        <!-- Right Section: Download Options -->
        <div class="space-y-6 animate-slide-up animation-delay-100">
          <!-- Choose Media -->
          <div class="backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
            <h2 :class="[theme.textPrimary, 'text-xl font-bold mb-5']">Choose Media</h2>
            <div class="space-y-3">
              <div
                v-for="(set, index) in photoSets"
                :key="set.id"
                class="flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm"
                :style="{ animationDelay: `${index * 50}ms` }"
                :class="selectedSets.includes(set.id)
                  ? 'border-accent bg-accent/20 dark:bg-accent/10 shadow-md ring-2 ring-accent/30'
                  : 'border-white/20 dark:border-white/10 light:border-gray-200/50 bg-white/5 dark:bg-black/10 light:bg-white/40 hover:bg-white/10 dark:hover:bg-black/20 light:hover:bg-white/60 hover:shadow-lg'"
              >
                <div class="flex items-center gap-4 flex-1">
                  <span :class="[theme.textPrimary, 'font-semibold text-base']">{{ set.name }}</span>
                  <span :class="[theme.bgInput, theme.textSecondary, 'text-sm font-medium px-3 py-1 rounded-lg']">
                    {{ set.count }} {{ set.count === 1 ? 'media' : 'medias' }}
                  </span>
                </div>
                <ToggleSwitch
                  :model-value="selectedSets.includes(set.id)"
                  :label="''"
                  @update:model-value="(val) => toggleSet(set.id, val)"
                />
              </div>
            </div>
          </div>

          <!-- Choose Download Size -->
          <div v-if="downloadSizes.length > 0" class="backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
            <h2 :class="[theme.textPrimary, 'text-xl font-bold mb-5']">Choose Download Size:</h2>
            <div class="space-y-3">
              <button
                v-for="size in downloadSizes"
                :key="size.value"
                @click="selectedSize = size.value"
                class="w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all duration-300 text-left hover:scale-[1.02] backdrop-blur-sm"
                :class="selectedSize === size.value
                  ? 'border-accent bg-accent/20 dark:bg-accent/10 shadow-md ring-2 ring-accent/30'
                  : 'border-white/20 dark:border-white/10 light:border-gray-200/50 bg-white/5 dark:bg-black/10 light:bg-white/40 hover:bg-white/10 dark:hover:bg-black/20 light:hover:bg-white/60 hover:shadow-lg'"
              >
                <div
                  class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  :class="selectedSize === size.value
                    ? 'border-accent bg-accent'
                    : [theme.borderSecondary, theme.bgCard]"
                >
                  <div
                    v-if="selectedSize === size.value"
                    class="w-3 h-3 rounded-full"
                    :class="theme.bgCard"
                  ></div>
                </div>
                <div class="flex-1">
                  <span :class="[theme.textPrimary, 'font-semibold text-base block']">{{ size.label }}</span>
                  <span :class="[theme.textTertiary, 'text-sm']">{{ size.size }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Download To -->
          <div class="backdrop-blur-xl bg-white/10 dark:bg-black/20 light:bg-white/70 border border-white/20 dark:border-white/10 light:border-gray-200/50 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
            <h2 :class="[theme.textPrimary, 'text-xl font-bold mb-5']">Download To:</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="destination in downloadDestinations"
                :key="destination.value"
                @click="selectedDestination = destination.value"
                class="flex flex-col items-center justify-center gap-3 p-4 border-2 rounded-xl transition-all duration-300 hover:scale-[1.05] backdrop-blur-sm"
                :class="
                  selectedDestination === destination.value
                    ? 'border-accent bg-accent/20 dark:bg-accent/10 shadow-md ring-2 ring-accent/30 transform scale-[1.05]'
                    : 'border-white/20 dark:border-white/10 light:border-gray-200/50 bg-white/5 dark:bg-black/10 light:bg-white/40 hover:bg-white/10 dark:hover:bg-black/20 light:hover:bg-white/60 hover:shadow-lg'
                "
              >
                <div class="relative">
                  <component 
                    :is="destination.icon" 
                    :class="['w-8 h-8', destination.color || theme.textSecondary]"
                  />
                  <div
                    v-if="selectedDestination === destination.value"
                    class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center shadow-md"
                  >
                    <Check class="w-3 h-3 text-white" />
                  </div>
                </div>
                <span 
                  :class="[
                    theme.textPrimary,
                    'font-semibold text-sm text-center leading-tight',
                    selectedDestination === destination.value ? 'text-accent' : ''
                  ]"
                >
                  {{ destination.label.replace('Save to ', '') }}
                </span>
              </button>
            </div>
          </div>

          <!-- Start Download Button -->
          <button
            @click="handleStartDownload"
            :disabled="isDownloading || selectedSets.length === 0 || !selectedSize || downloadSizes.length === 0"
            class="w-full py-5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 text-white font-bold text-lg rounded-xl hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 uppercase tracking-wider shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10"
          >
            <Download v-if="!isDownloading" class="w-5 h-5" />
            <Loader2 v-else class="w-5 h-5 animate-spin" />
            <span v-if="isDownloading">Preparing Download...</span>
            <span v-else>START DOWNLOAD</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer v-if="showMazelootBranding" :class="[theme.borderSecondary, 'border-t backdrop-blur-md bg-white/10 dark:bg-black/20 light:bg-white/50 mt-20']">
      <div class="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <p :class="[theme.textTertiary, 'text-xs text-center']">
          © {{ new Date().getFullYear() }} {{ brandName || 'Mazeloot' }}. All rights reserved.
        </p>
      </div>
    </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Laptop, Check, Download, Loader2, Cloud, HardDrive, Folder, Upload, Image as ImageIcon, Box as BoxIcon, ChevronLeft, ArrowLeft, ArrowRight, X } from '@/shared/utils/lucideAnimated'
import { apiClient } from '@/shared/api/client'
import { API_CONFIG } from '@/shared/api/config'
import { toast } from '@/shared/utils/toast'
import { publicCollectionUrl } from '@/shared/utils/memoraPublicUrls'
import { addDefaultSettings } from '@/domains/memora/api/collections'
import { useSettingsApi } from '@/domains/memora/api/settings'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import mazelootLogo from '@/shared/assets/images/logos/mazelootPrimaryLogo.svg'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useThemeStore } from '@/shared/stores/theme'
import ThemeToggle from '@/shared/components/organisms/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const { fetchPublicSettings } = useSettingsApi()
const theme = useThemeClasses()
const themeStore = useThemeStore()

const collection = ref(null)
const photoSets = ref([])
const selectedSets = ref([])
const selectedSize = ref(null)
const selectedDestination = ref('device')
const isDownloading = ref(false)
const isDownloadingZip = ref(false)
const isLoadingState = ref(false)
const isInitialLoading = ref(true)
const isNavigating = ref(false)
const isNavigatingBack = ref(false)
const oauthProcessed = ref(false)
const zipFile = ref(null)
const downloadToken = ref(null)
const collectionName = ref('')
const brandName = ref('')
const brandingLogoUrl = ref(null)
const showMazelootBranding = ref(true)
const pollInterval = ref(null)
const coverPhotoUrl = ref(null)

const coverPhotoStyle = computed(() => {
  if (!coverPhotoUrl.value) return {}
  return {
    backgroundImage: `url(${coverPhotoUrl.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  }
})

const highResolutionEnabled = ref(true)
const highResolutionSize = ref('3600px')
const webSizeEnabled = ref(true)
const webSize = ref('1024px')

const downloadSizes = computed(() => {
  const sizes = []
  
  if (highResolutionEnabled.value) {
    sizes.push({
      label: 'High Resolution',
      value: 'high',
      size: highResolutionSize.value,
    })
  }
  
  if (webSizeEnabled.value) {
    sizes.push({
      label: 'Web Size',
      value: 'web',
      size: webSize.value,
    })
  }
  
  return sizes
})

const downloadDestinations = computed(() => [
  { label: 'Save to My Device', value: 'device', icon: Laptop, color: theme.textSecondary },
  { label: 'Save to Google Photos', value: 'google', icon: ImageIcon, color: 'text-blue-500' },
  { label: 'Save to Dropbox', value: 'dropbox', icon: Folder, color: 'text-blue-600' },
  { label: 'Save to OneDrive', value: 'onedrive', icon: Cloud, color: 'text-blue-700' },
  { label: 'Save to Box', value: 'box', icon: BoxIcon, color: 'text-blue-500' },
  { label: 'Save to Adobe Creative Cloud', value: 'adobe', icon: Cloud, color: 'text-red-600' },
  { label: 'Save to Google Drive', value: 'googledrive', icon: HardDrive, color: 'text-green-500' },
])

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Validate access token for download page
const validateDownloadPageAccess = (collectionId, accessToken) => {
  if (!accessToken || !collectionId) return false
  
  try {
    const stored = localStorage.getItem(`download_page_access_${collectionId}`)
    if (!stored) return false
    
    const data = JSON.parse(stored)
    const { token, expiresAt } = data
    
    // Check if expired
    if (Date.now() > expiresAt) {
      localStorage.removeItem(`download_page_access_${collectionId}`)
      return false
    }
    
    // Check if token matches
    if (token === accessToken) {
      // Remove token after validation (one-time use)
      localStorage.removeItem(`download_page_access_${collectionId}`)
      return true
    }
    
    return false
  } catch (error) {
    localStorage.removeItem(`download_page_access_${collectionId}`)
    return false
  }
}

onMounted(async () => {
  // #region agent log
  console.log('Download page onMounted - DEBUG', {
    routeQuery: route.query,
    urlSearch: window.location.search,
    routeParams: route.params
  });
  fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'download.vue:onMounted',message:'onMounted started',data:{routeQuery:route.query,urlSearch:window.location.search,routeParams:route.params},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  
  // Check if this is an OAuth callback
  // Check both route.query (Vue Router) and URLSearchParams (direct URL)
  const urlParams = new URLSearchParams(window.location.search)
  const routeQuery = route.query
  
  const oauthSuccess = routeQuery.success || urlParams.get('success')
  const oauthService = routeQuery.service || urlParams.get('service')
  const oauthDownloadToken = routeQuery.download_token || urlParams.get('download_token')
  const oauthCollectionId = routeQuery.collection_id || routeQuery.collectionId || urlParams.get('collection_id') || urlParams.get('collectionId')
  const oauthDestination = routeQuery.destination || urlParams.get('destination')
  const oauthError = routeQuery.error || urlParams.get('error')
  
  // #region agent log
  console.log('OAuth params extracted - DEBUG', {
    oauthSuccess,
    oauthService,
    oauthCollectionId,
    oauthDestination,
    oauthError,
    oauthProcessed: oauthProcessed.value
  });
  fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'download.vue:onMounted',message:'OAuth params extracted',data:{oauthSuccess,oauthService,oauthCollectionId,oauthDestination,oauthError,oauthProcessed:oauthProcessed.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  if (oauthSuccess !== null && !oauthProcessed.value) {
    // Handle OAuth callback
    // Check for both 'true' and '1' as success indicators (backend may return '1')
    const isOAuthSuccess = oauthSuccess === 'true' || oauthSuccess === '1' || oauthSuccess === true || oauthSuccess === 1
    if (isOAuthSuccess && oauthService && oauthCollectionId) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'download.vue:onMounted',message:'OAuth callback detected',data:{oauthSuccess,oauthService,oauthCollectionId,oauthDestination,oauthError},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      // Mark as processed to prevent re-processing
      oauthProcessed.value = true
      
      // OAuth successful, now initiate download with cloud storage
      try {
        isInitialLoading.value = false
        isLoadingState.value = true
        isDownloading.value = true

        const headers = {}
        const storedGuestToken = localStorage.getItem(`collection_guest_token_${oauthCollectionId}`)
        if (storedGuestToken) {
          headers['Authorization'] = `Bearer ${storedGuestToken}`
        }
        
        const storedEmail = localStorage.getItem(`collection_${oauthCollectionId}_email`) || 
                           localStorage.getItem(`collection_email_${oauthCollectionId}`)
        if (storedEmail) {
          headers['X-Collection-Email'] = storedEmail
        }

        // Get download PIN if verified
        const storedPin = localStorage.getItem(`collection_download_pin_${oauthCollectionId}`)
        if (storedPin) {
          try {
            const pinData = JSON.parse(storedPin)
            if (pinData.expiresAt && Date.now() < pinData.expiresAt) {
              headers['X-Download-PIN'] = pinData.pin
            }
          } catch (e) {
            // Invalid pin data
          }
        }

        // Get collection password if stored
        const storedPassword = localStorage.getItem(`collection_password_${oauthCollectionId}`)
        if (storedPassword) {
          headers['X-Collection-Password'] = storedPassword
        }

        // First, load collection data to get download settings and media sets
        try {
          const collectionResponse = await apiClient.get(`/v1/public/collections/${oauthCollectionId}`, { headers })
          const collectionData = collectionResponse.data?.data || collectionResponse.data
          collection.value = addDefaultSettings(collectionData)
          collectionName.value = collection.value.name || 'Collection'
          
          // Get cover photo
          coverPhotoUrl.value = collection.value?.coverPhotoUrl || 
                                collection.value?.cover_photo_url || 
                                collection.value?.image || 
                                collection.value?.thumbnail ||
                                (collection.value?.media && collection.value.media.length > 0 ? collection.value.media[0]?.url : null)
          
          // Get download size settings
          const downloadSettings = collection.value.settings?.download ?? collection.value.download ?? {}
          highResolutionEnabled.value = downloadSettings.highResolution?.enabled ?? 
                                       collection.value.highResolutionEnabled ?? 
                                       true
          highResolutionSize.value = downloadSettings.highResolution?.size ?? 
                                    collection.value.highResolutionSize ?? 
                                    '3600px'
          webSizeEnabled.value = downloadSettings.webSize?.enabled ?? 
                                collection.value.webSizeEnabled ?? 
                                true
          webSize.value = downloadSettings.webSize?.size ?? 
                         collection.value.webSize ?? 
                         '1024px'
          
          // Fetch media sets with counts
          try {
            const setsResponse = await apiClient.get(`/v1/public/collections/${oauthCollectionId}/media-sets`, { headers })
            const setsData = setsResponse.data?.data || setsResponse.data || []
            photoSets.value = Array.isArray(setsData) ? setsData.map(set => ({
              id: set.id || set.uuid,
              name: set.name || 'Untitled Set',
              count: set.media_count || set.count || 0,
            })) : []
          } catch (e) {
            console.warn('Failed to fetch media sets:', e)
            photoSets.value = []
          }
        } catch (e) {
          console.warn('Failed to fetch collection:', e)
        }

        // Fetch branding
        if (!brandingLogoUrl.value) {
          try {
            const settingsResponse = await fetchPublicSettings({ collectionId: oauthCollectionId })
            const settings = settingsResponse.data || settingsResponse
            brandName.value = settings.branding?.name || ''
            brandingLogoUrl.value = settings.branding?.logoUrl || null
            showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
          } catch (e) {
            console.warn('Failed to fetch branding:', e)
          }
        }

        // Get selected sets from localStorage
        const storedSelectedSets = localStorage.getItem(`download_selected_sets_${oauthCollectionId}`)
        let setIds = storedSelectedSets ? JSON.parse(storedSelectedSets) : selectedSets.value || []

        // If no sets stored and photoSets loaded, use all sets
        if ((!setIds || setIds.length === 0) && photoSets.value && photoSets.value.length > 0) {
          setIds = photoSets.value.map(set => set.id)
        }

        // Update selectedSets.value so the summary shows correctly
        selectedSets.value = setIds

        // If still no sets, throw error
        if (!setIds || setIds.length === 0) {
          throw new Error('No media sets selected. Please go back and select at least one set.')
        }

        // Get selected size from localStorage
        const storedSelectedSize = localStorage.getItem(`download_selected_size_${oauthCollectionId}`)
        const size = storedSelectedSize || selectedSize.value || (downloadSizes.value.length > 0 ? downloadSizes.value[0].value : 'high')
        
        // Update selectedSize.value so the summary shows correctly
        selectedSize.value = size

        // Get size resolution from computed property or fallback
        const sizeOption = downloadSizes.value.find(s => s.value === size)
        const resolution = sizeOption?.size || (size === 'high' ? highResolutionSize.value : webSize.value)

        // Get destination from localStorage or query params (use stored one if available)
        const storedDestination = localStorage.getItem(`download_destination_${oauthCollectionId}`)
        const finalDestination = storedDestination || oauthDestination || oauthService || 'device'
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'download.vue:onMounted',message:'Initiating download after OAuth',data:{oauthCollectionId,setIds:setIds.length,size,resolution,finalDestination,oauthDestination,oauthService,storedDestination},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
        // #endregion
        
        // Initiate ZIP generation with cloud storage destination
        const response = await apiClient.post(
          `/v1/public/collections/${oauthCollectionId}/download/zip`,
          {
            setIds,
            size: resolution,
            destination: finalDestination,
          },
          { headers }
        )
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'download.vue:onMounted',message:'Download initiation response received',data:{hasResponse:!!response,hasData:!!response?.data,hasToken:!!(response?.data?.data?.token || response?.data?.token)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion

        const { token } = response.data?.data || response.data || {}
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'download.vue:onMounted',message:'Processing download token',data:{hasToken:!!token,token:token?.substring(0,8)+'...',finalDestination},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        
        if (token) {
          downloadToken.value = token
          isLoadingState.value = true
          selectedDestination.value = finalDestination
          
          // Ensure selectedSets and selectedSize are set for summary display
          selectedSets.value = setIds
          selectedSize.value = size
          
          // Store download token and destination in localStorage to persist across navigation
          localStorage.setItem(`download_token_${oauthCollectionId}`, token)
          localStorage.setItem(`download_destination_${oauthCollectionId}`, selectedDestination.value)
          
          // Clear stored selection data (keep destination for reference)
          localStorage.removeItem(`download_selected_sets_${oauthCollectionId}`)
          localStorage.removeItem(`download_selected_size_${oauthCollectionId}`)
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/0c1f4b73-4437-4f70-a7a0-856984785a37',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'download.vue:onMounted',message:'OAuth download initiated successfully',data:{token:token.substring(0,8)+'...',destination:selectedDestination.value,collectionId:oauthCollectionId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          
          console.log('OAuth download initiated successfully', {
            token,
            destination: selectedDestination.value,
            collectionId: oauthCollectionId
          })
          
          // Start polling immediately (don't wait for router.replace)
          startPolling(token, headers)
          
          // Clean URL but keep collectionId for reference
          router.replace({ 
            query: { 
              collectionId: oauthCollectionId
            } 
          })
        } else {
          throw new Error('Failed to initiate download - no token returned')
        }
      } catch (error) {
        console.error('OAuth callback download initiation error:', error)
        oauthProcessed.value = false
        isLoadingState.value = false
        isDownloading.value = false
        isInitialLoading.value = false
        
        toast.error('Failed to start download', {
          description: error.message || 'Please try again',
          duration: 5000,
        })
        
        // Clean up localStorage on error
        if (oauthCollectionId) {
          localStorage.removeItem(`download_selected_sets_${oauthCollectionId}`)
          localStorage.removeItem(`download_selected_size_${oauthCollectionId}`)
          localStorage.removeItem(`download_destination_${oauthCollectionId}`)
          localStorage.removeItem(`download_token_${oauthCollectionId}`)
        }
      }
      return
    } else if (oauthError) {
      oauthProcessed.value = true
      const errorCode = urlParams.get('error_code')
      let errorMessage = oauthError
      
      // Show user-friendly error message
      if (errorCode === 'access_denied') {
        errorMessage = 'Access was denied. This usually means:\n\n' +
          '1. The app is in testing mode and your email needs to be added as a test user\n' +
          '2. The OAuth consent screen needs to be configured\n\n' +
          'Please contact the administrator or try selecting "My Device" to download directly.'
      }
      
      toast.error('OAuth Authentication Failed', {
        description: errorMessage,
        duration: 8000,
      })
      // Clean URL
      router.replace({ query: { ...route.query, success: undefined, service: undefined, error: undefined, error_code: undefined } })
    }
  }

  const collectionId = route.query.collectionId
  const token = route.query.token
  const accessToken = route.query.accessToken
  
  // Check for stored download token from OAuth flow (persisted across navigation)
  if (collectionId && !downloadToken.value && !oauthProcessed.value) {
    const storedToken = localStorage.getItem(`download_token_${collectionId}`)
    const storedDestination = localStorage.getItem(`download_destination_${collectionId}`)
    
    if (storedToken && !zipFile.value) {
      downloadToken.value = storedToken
      selectedDestination.value = storedDestination || 'device'
      isLoadingState.value = true
      isInitialLoading.value = false
      
      const headers = {}
      const storedGuestToken = localStorage.getItem(`collection_guest_token_${collectionId}`)
      if (storedGuestToken) {
        headers['Authorization'] = `Bearer ${storedGuestToken}`
      }
      
      const storedEmail = localStorage.getItem(`collection_${collectionId}_email`) || 
                         localStorage.getItem(`collection_email_${collectionId}`)
      if (storedEmail) {
        headers['X-Collection-Email'] = storedEmail
      }

      // Get download PIN if verified
      const storedPin = localStorage.getItem(`collection_download_pin_${collectionId}`)
      if (storedPin) {
        try {
          const pinData = JSON.parse(storedPin)
          if (pinData.expiresAt && Date.now() < pinData.expiresAt) {
            headers['X-Download-PIN'] = pinData.pin
          }
        } catch (e) {
          // Invalid pin data
        }
      }

      // Get collection password if stored
      const storedPassword = localStorage.getItem(`collection_password_${collectionId}`)
      if (storedPassword) {
        headers['X-Collection-Password'] = storedPassword
      }
      
      startPolling(storedToken, headers)
      return
    }
  }
  
  // Skip normal initialization if OAuth is being processed or download is in progress
  if (oauthProcessed.value || isLoadingState.value || downloadToken.value) {
    // If we have a token but no zipFile yet, we're still processing - check status
    if (downloadToken.value && !zipFile.value && !isInitialLoading.value) {
      const headers = {}
      const collectionIdLocal = collectionId || route.query.collectionId
      
      const storedGuestToken = localStorage.getItem(`collection_guest_token_${collectionIdLocal}`)
      if (storedGuestToken) {
        headers['Authorization'] = `Bearer ${storedGuestToken}`
      }
      
      const storedEmail = localStorage.getItem(`collection_${collectionIdLocal}_email`) || 
                         localStorage.getItem(`collection_email_${collectionIdLocal}`)
      if (storedEmail) {
        headers['X-Collection-Email'] = storedEmail
      }

      // Get download PIN if verified
      const storedPin = localStorage.getItem(`collection_download_pin_${collectionIdLocal}`)
      if (storedPin) {
        try {
          const pinData = JSON.parse(storedPin)
          if (pinData.expiresAt && Date.now() < pinData.expiresAt) {
            headers['X-Download-PIN'] = pinData.pin
          }
        } catch (e) {
          // Invalid pin data
        }
      }

      // Get collection password if stored
      const storedPassword = localStorage.getItem(`collection_password_${collectionIdLocal}`)
      if (storedPassword) {
        headers['X-Collection-Password'] = storedPassword
      }
      
      isLoadingState.value = true
      isInitialLoading.value = false
      startPolling(downloadToken.value, headers)
    }
    return
  }
  
  // If token is provided, check status directly (from email link)
  if (token) {
    isLoadingState.value = true
    try {
      const headers = {}
      const collectionIdLocal = collectionId
      
      const storedGuestToken = localStorage.getItem(`collection_guest_token_${collectionIdLocal}`)
      if (storedGuestToken) {
        headers['Authorization'] = `Bearer ${storedGuestToken}`
      }
      
      const storedEmail = localStorage.getItem(`collection_${collectionIdLocal}_email`) || 
                         localStorage.getItem(`collection_email_${collectionIdLocal}`)
      if (storedEmail) {
        headers['X-Collection-Email'] = storedEmail
      }

      // Get download PIN if verified
      const storedPin = localStorage.getItem(`collection_download_pin_${collectionIdLocal}`)
      if (storedPin) {
        try {
          const pinData = JSON.parse(storedPin)
          if (pinData.expiresAt && Date.now() < pinData.expiresAt) {
            headers['X-Download-PIN'] = pinData.pin
          }
        } catch (e) {
          // Invalid pin data
        }
      }

      // Get collection password if stored
      const storedPassword = localStorage.getItem(`collection_password_${collectionIdLocal}`)
      if (storedPassword) {
        headers['X-Collection-Password'] = storedPassword
      }

      const response = await apiClient.get(
        `/v1/public/collections/${collectionId}/download/zip/${token}/status`,
        { headers }
      )

      const data = response.data?.data || response.data || {}
      
      // Fetch branding if not already fetched
      if (!brandingLogoUrl.value) {
        try {
          const settingsResponse = await fetchPublicSettings({ collectionId })
          const settings = settingsResponse.data || settingsResponse
          brandName.value = settings.branding?.name || ''
          brandingLogoUrl.value = settings.branding?.logoUrl || null
          showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
        } catch (e) {
          console.warn('Failed to fetch branding:', e)
        }
      }

      // Fetch collection name if not set
      if (!collectionName.value) {
        try {
          const collectionResponse = await apiClient.get(`/v1/public/collections/${collectionId}`, { headers })
          const collectionData = collectionResponse.data?.data || collectionResponse.data
          collection.value = addDefaultSettings(collectionData)
          collectionName.value = collection.value.name || 'Collection'
          
          // Get cover photo
          coverPhotoUrl.value = collection.value?.coverPhotoUrl || 
                                collection.value?.cover_photo_url || 
                                collection.value?.image || 
                                collection.value?.thumbnail ||
                                (collection.value?.media && collection.value.media.length > 0 ? collection.value.media[0]?.url : null)
        } catch (e) {
          console.warn('Failed to fetch collection:', e)
        }
      }
      
      isInitialLoading.value = false
      
      if (data.status === 'completed') {
        isLoadingState.value = false
        zipFile.value = {
          filename: data.zipFile?.filename || 'download.zip',
          size: formatFileSize(data.zipFile?.size || 0),
          downloadUrl: data.zipFile ? `${API_CONFIG.API_BASE_URL}/v1/public/collections/${collectionId}/download/zip/${token}` : null,
          cloudUploadUrl: data.zipFile?.cloud_upload_url || null,
          cloudUploadError: data.zipFile?.cloud_upload_error || null,
          token: token,
        }
      } else if (data.status === 'processing') {
        // Start polling if still processing
        downloadToken.value = token
        startPolling(token, headers)
      } else if (data.status === 'failed') {
        isLoadingState.value = false
        toast.error('Download failed', {
          description: data.error || 'Please try again',
        })
      } else {
        isLoadingState.value = false
        toast.error('Download not found or failed')
      }
      return
    } catch (error) {
      isInitialLoading.value = false
      isLoadingState.value = false
      toast.error('Failed to load download status')
    }
  }

  // Validate access token for download page (unless coming from email link with token or OAuth)
  if (!token && !oauthProcessed.value && collectionId) {
    // Allow stored download tokens to bypass access check
    const storedToken = localStorage.getItem(`download_token_${collectionId}`)
    const hasValidAccess = validateDownloadPageAccess(collectionId, accessToken)
    
    if (!hasValidAccess && !storedToken) {
      // No valid access, redirect back to collection view
      toast.error('Access denied', {
        description: 'Please access the download page from the collection view.'
      })
      const domainSegment = route.params.domain || route.params.projectId || 'default'
      router.push(publicCollectionUrl(domainSegment, collectionId))
      return
    }
  }

  if (!collectionId) {
    toast.error('Collection ID is required')
    router.back()
    return
  }

  try {
    // Get headers for authentication
    const headers = {}
    const collectionIdLocal = collectionId
    
    // Get guest token if available
    const storedGuestToken = localStorage.getItem(`collection_guest_token_${collectionIdLocal}`)
    if (storedGuestToken) {
      headers['Authorization'] = `Bearer ${storedGuestToken}`
    }
    
    // Get user email if available
    const storedEmail = localStorage.getItem(`collection_${collectionIdLocal}_email`) || 
                       localStorage.getItem(`collection_email_${collectionIdLocal}`)
    if (storedEmail) {
      headers['X-Collection-Email'] = storedEmail
    }

    // Fetch collection
    const response = await apiClient.get(`/v1/public/collections/${collectionId}`, { headers })
    const collectionData = response.data?.data || response.data
    collection.value = addDefaultSettings(collectionData)
    collectionName.value = collection.value.name || 'Collection'
    
    // Get cover photo
    coverPhotoUrl.value = collection.value?.coverPhotoUrl || 
                          collection.value?.cover_photo_url || 
                          collection.value?.image || 
                          collection.value?.thumbnail ||
                          (collection.value?.media && collection.value.media.length > 0 ? collection.value.media[0]?.url : null)
    
    // Check if media download is enabled
    const photoDownload = collection.value.photoDownload ?? 
                         collection.value.download?.photoDownload ?? 
                         collection.value.settings?.download?.photoDownload ?? 
                         true
    if (!photoDownload) {
      toast.error('Downloads are disabled for this collection')
      router.back()
      return
    }
    
    // Get download size settings from collection
    const downloadSettings = collection.value.settings?.download ?? collection.value.download ?? {}
    highResolutionEnabled.value = downloadSettings.highResolution?.enabled ?? 
                                 collection.value.highResolutionEnabled ?? 
                                 true
    highResolutionSize.value = downloadSettings.highResolution?.size ?? 
                              collection.value.highResolutionSize ?? 
                              '3600px'
    webSizeEnabled.value = downloadSettings.webSize?.enabled ?? 
                          collection.value.webSizeEnabled ?? 
                          true
    webSize.value = downloadSettings.webSize?.size ?? 
                   collection.value.webSize ?? 
                   '1024px'
    
    // Set default selected size based on available options
    if (downloadSizes.value.length > 0) {
      selectedSize.value = downloadSizes.value[0].value
    }
    
    // Fetch branding
    try {
      const settingsResponse = await fetchPublicSettings({ collectionId })
      const settings = settingsResponse.data || settingsResponse
      brandName.value = settings.branding?.name || ''
      brandingLogoUrl.value = settings.branding?.logoUrl || null
      showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
    } catch (e) {
      console.warn('Failed to fetch branding:', e)
    }

    // Load photo sets with media counts
    if (collection.value.mediaSets && collection.value.mediaSets.length > 0) {
      const setsWithCounts = await Promise.all(
        collection.value.mediaSets.map(async (set) => {
          try {
            const mediaResponse = await apiClient.get(`/v1/public/collections/${collectionId}/sets/${set.id}/media`, { headers })
            const media = mediaResponse.data?.data || mediaResponse.data || []
            const mediaArray = Array.isArray(media?.data) ? media.data : (Array.isArray(media) ? media : [])
            return {
              id: set.id,
              name: set.name,
              count: mediaArray.length,
            }
          } catch (e) {
            return {
              id: set.id,
              name: set.name,
              count: 0,
            }
          }
        })
      )
      photoSets.value = setsWithCounts.filter(set => set.count > 0)
      selectedSets.value = photoSets.value.map(set => set.id)
    }
    
    isInitialLoading.value = false
  } catch (error) {
    isInitialLoading.value = false
    toast.error('Failed to load collection', {
      description: error.message || 'Please try again',
    })
    router.back()
  }
})

const initiateOAuthFlow = async (service, collectionId, downloadToken) => {
  try {
    isDownloading.value = true
    const projectId = route.params.projectId
    const response = await apiClient.post('/v1/cloud-storage/oauth/initiate', {
      service,
      collection_id: collectionId,
      project_id: projectId,
      destination: service,
      download_token: downloadToken,
    })

    const { auth_url } = response.data?.data || response.data || {}
    
    if (auth_url) {
      // Redirect to OAuth provider
      window.location.href = auth_url
      return false
    } else {
      throw new Error('Failed to get OAuth URL')
    }
  } catch (error) {
    isDownloading.value = false
    toast.error('Failed to initiate OAuth flow', {
      description: error.message || 'Please try again',
    })
    throw error
  }
}

const handleStartDownload = async () => {
  if (selectedSets.value.length === 0 || !selectedSize.value) {
    toast.error('Please select at least one media set and a download size')
    return
  }

  const selectedSizeOption = downloadSizes.value.find(s => s.value === selectedSize.value)
  if (!selectedSizeOption) {
    toast.error('Please select a download size')
    return
  }

  const collectionId = route.query.collectionId

  // If cloud storage is selected, initiate OAuth flow first
  if (selectedDestination.value !== 'device') {
    try {
      // Store selected sets and size for OAuth callback BEFORE redirecting
      localStorage.setItem(`download_selected_sets_${collectionId}`, JSON.stringify(selectedSets.value))
      localStorage.setItem(`download_selected_size_${collectionId}`, selectedSize.value)
      localStorage.setItem(`download_destination_${collectionId}`, selectedDestination.value)
      
      const shouldContinue = await initiateOAuthFlow(selectedDestination.value, collectionId, null)
      // If OAuth not required (like WeTransfer), continue with download
      if (shouldContinue) {
        // Continue to download flow below
      } else {
        // OAuth will redirect, so we don't continue with download
        // The OAuth callback will handle initiating the download
        return
      }
    } catch (error) {
      // OAuth failed or not supported, don't continue
      console.error('OAuth initiation failed:', error)
      toast.error('Failed to initiate OAuth', {
        description: error.message || 'Please try again or select "My Device"',
      })
      isDownloading.value = false
      return
    }
  }

  isDownloading.value = true
  isLoadingState.value = true

  try {
    const resolution = selectedSizeOption?.size || '3600px'

    // Get headers for authentication
    const headers = {}
    const collectionIdLocal = collectionId
    
    // Get guest token if available
    const storedGuestToken = localStorage.getItem(`collection_guest_token_${collectionIdLocal}`)
    if (storedGuestToken) {
      headers['Authorization'] = `Bearer ${storedGuestToken}`
    }
    
    // Get user email if available
    const storedEmail = localStorage.getItem(`collection_${collectionIdLocal}_email`) || 
                       localStorage.getItem(`collection_email_${collectionIdLocal}`)
    if (storedEmail) {
      headers['X-Collection-Email'] = storedEmail
    }

    // Get download PIN if verified
    const storedPin = localStorage.getItem(`collection_download_pin_${collectionIdLocal}`)
    if (storedPin) {
      try {
        const pinData = JSON.parse(storedPin)
        if (pinData.expiresAt && Date.now() < pinData.expiresAt) {
          headers['X-Download-PIN'] = pinData.pin
        }
      } catch (e) {
        // Invalid pin data
      }
    }

    // For device downloads, store selected sets and size (OAuth already stored them above)
    if (selectedDestination.value === 'device') {
      localStorage.setItem(`download_selected_sets_${collectionId}`, JSON.stringify(selectedSets.value))
      localStorage.setItem(`download_selected_size_${collectionId}`, selectedSize.value)
    }

    // Initiate ZIP generation
    const response = await apiClient.post(
      `/v1/public/collections/${collectionId}/download/zip`,
      {
        setIds: selectedSets.value,
        size: resolution,
        destination: selectedDestination.value,
      },
      { headers }
    )

    const { token } = response.data?.data || response.data || {}
    if (!token) {
      throw new Error('Failed to initiate download')
    }

    downloadToken.value = token
    startPolling(token, headers)
  } catch (error) {
    toast.error('Download failed', {
      description: error.message || 'Please try again',
    })
    isLoadingState.value = false
    isDownloading.value = false
  }
}

const startPolling = (token, headers) => {
  // Ensure loading state is set
  isLoadingState.value = true
  isInitialLoading.value = false
  
  // Clear any existing polling
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  
  // Poll every 2 seconds for ZIP status
  pollInterval.value = setInterval(async () => {
    try {
      const collectionIdForPoll = route.query.collectionId
      if (!collectionIdForPoll) {
        console.error('No collectionId for polling')
        return
      }

      // Ensure headers include all necessary authentication data
      const pollHeaders = { ...headers }
      
      // Add guest token if not already in headers
      if (!pollHeaders['Authorization']) {
        const storedGuestToken = localStorage.getItem(`collection_guest_token_${collectionIdForPoll}`)
        if (storedGuestToken) {
          pollHeaders['Authorization'] = `Bearer ${storedGuestToken}`
        }
      }

      // Add email if not already in headers
      if (!pollHeaders['X-Collection-Email']) {
        const storedEmail = localStorage.getItem(`collection_${collectionIdForPoll}_email`) || 
                           localStorage.getItem(`collection_email_${collectionIdForPoll}`)
        if (storedEmail) {
          pollHeaders['X-Collection-Email'] = storedEmail
        }
      }

      // Add download PIN if not already in headers
      if (!pollHeaders['X-Download-PIN']) {
        const storedPin = localStorage.getItem(`collection_download_pin_${collectionIdForPoll}`)
        if (storedPin) {
          try {
            const pinData = JSON.parse(storedPin)
            if (pinData.expiresAt && Date.now() < pinData.expiresAt) {
              pollHeaders['X-Download-PIN'] = pinData.pin
            }
          } catch (e) {
            // Invalid pin data
          }
        }
      }

      // Add collection password if not already in headers
      if (!pollHeaders['X-Collection-Password']) {
        const storedPassword = localStorage.getItem(`collection_password_${collectionIdForPoll}`)
        if (storedPassword) {
          pollHeaders['X-Collection-Password'] = storedPassword
        }
      }
      
      const response = await apiClient.get(
        `/v1/public/collections/${collectionIdForPoll}/download/zip/${token}/status`,
        { headers: pollHeaders }
      )

      const data = response.data?.data || response.data || {}
      
      // Stop polling if status is 'completed' or 'failed'
      if (data.status === 'completed') {
        clearInterval(pollInterval.value)
        pollInterval.value = null
        isLoadingState.value = false
        
        // Clear stored token on completion
        const collectionId = route.query.collectionId
        if (collectionId) {
          localStorage.removeItem(`download_token_${collectionId}`)
          localStorage.removeItem(`download_destination_${collectionId}`)
        }
        
        // Set zipFile even if zipFile data is missing (might be cloud-only)
        zipFile.value = {
          filename: data.zipFile?.filename || 'download.zip',
          size: formatFileSize(data.zipFile?.size || 0),
          downloadUrl: data.zipFile ? `${API_CONFIG.API_BASE_URL}/v1/public/collections/${collectionIdForPoll}/download/zip/${token}` : null,
          cloudUploadUrl: data.zipFile?.cloud_upload_url || null,
          cloudUploadError: data.zipFile?.cloud_upload_error || null,
          token: token,
        }
        
        // Show error toast if cloud upload failed
        if (zipFile.value.cloudUploadError && selectedDestination.value !== 'device') {
          toast.error('Cloud Upload Failed', {
            description: zipFile.value.cloudUploadError,
            duration: 8000,
          })
        }
        
        return // Exit early to prevent further polling
      } else if (data.status === 'failed') {
        clearInterval(pollInterval.value)
        pollInterval.value = null
        isLoadingState.value = false
        
        // Clear stored token on failure
        const collectionId = route.query.collectionId
        if (collectionId) {
          localStorage.removeItem(`download_token_${collectionId}`)
          localStorage.removeItem(`download_destination_${collectionId}`)
        }
        
        toast.error('Download failed', {
          description: data.error || 'Please try again',
        })
        
        return // Exit early to prevent further polling
      }
    } catch (error) {
      console.error('Polling error:', error)
      // Continue polling on error
    }
  }, 2000)
}

const handleZipDownload = async () => {
  if (!zipFile.value?.token || isDownloadingZip.value) return
  
  isDownloadingZip.value = true
  
  try {
    const collectionId = route.query.collectionId
    const headers = {}
    
    const storedGuestToken = localStorage.getItem(`collection_guest_token_${collectionId}`)
    if (storedGuestToken) {
      headers['Authorization'] = `Bearer ${storedGuestToken}`
    }
    
    const storedEmail = localStorage.getItem(`collection_${collectionId}_email`) || 
                       localStorage.getItem(`collection_email_${collectionId}`)
    if (storedEmail) {
      headers['X-Collection-Email'] = storedEmail
    }

    // Get download PIN if verified
    const storedPin = localStorage.getItem(`collection_download_pin_${collectionId}`)
    if (storedPin) {
      try {
        const pinData = JSON.parse(storedPin)
        if (pinData.expiresAt && Date.now() < pinData.expiresAt) {
          headers['X-Download-PIN'] = pinData.pin
        }
      } catch (e) {
        // Invalid pin data
      }
    }

    // Get collection password if stored
    const storedPassword = localStorage.getItem(`collection_password_${collectionId}`)
    if (storedPassword) {
      headers['X-Collection-Password'] = storedPassword
    }

    // Use the internal API endpoint without exposing the URL
    const downloadUrl = `${API_CONFIG.API_BASE_URL}/v1/public/collections/${collectionId}/download/zip/${zipFile.value.token}`
    
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: headers,
      headers,
    })

    if (!response.ok) {
      throw new Error('Download failed')
    }

    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', zipFile.value.filename)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    }, 100)
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Failed to download file', {
      description: error.message || 'Please try again',
    })
  } finally {
    isDownloadingZip.value = false
  }
}

const toggleSet = (setId, isSelected) => {
  if (isSelected) {
    if (!selectedSets.value.includes(setId)) {
      selectedSets.value.push(setId)
    }
  } else {
    selectedSets.value = selectedSets.value.filter(id => id !== setId)
  }
}

const getDestinationLabel = (destination) => {
  const dest = downloadDestinations.value.find(d => d.value === destination)
  return dest ? dest.label.replace('Save to ', '') : destination
}

const handleBack = () => {
  if (isNavigatingBack.value) return
  isNavigatingBack.value = true
  router.back()
  // Reset after a short delay in case navigation doesn't happen
  setTimeout(() => {
    isNavigatingBack.value = false
  }, 1000)
}

const handleBackToCollection = () => {
  if (isNavigating.value) return
  isNavigating.value = true
  const collectionId = route.query.collectionId
  const domainSegment = route.params.domain || route.params.projectId || 'default'
  router.push(publicCollectionUrl(domainSegment, collectionId))
    .catch(() => {
      isNavigating.value = false
    })
}

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})
</script>
