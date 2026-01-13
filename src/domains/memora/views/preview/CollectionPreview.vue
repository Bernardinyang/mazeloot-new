<template>
  <div :style="{ backgroundColor: backgroundColor }">
    <!-- Full Page Loading State (only on initial load when collection is not loaded) -->
    <Transition name="fade">
      <div
        v-if="isLoading && !collection && isInitialLoad"
        class="fixed inset-0 z-50 flex items-center justify-center"
        :style="{ backgroundColor: backgroundColor }"
      >
        <div class="text-center">
          <Loader2 class="h-12 w-12 animate-spin mx-auto mb-4" :style="{ color: textColor }" />
          <p :style="{ color: textColor, opacity: 0.8 }" class="text-sm font-medium">
            Loading collection...
          </p>
        </div>
      </div>
    </Transition>

    <!-- Navbar Style (when cover is 'none') -->
    <div
      v-if="designConfig.cover === 'none'"
      :style="{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }"
      class="sticky top-0 z-50 w-full border-b backdrop-blur-md"
    >
      <div class="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div class="flex-1 min-w-0">
            <h1
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ color: textColor }"
              class="text-lg sm:text-xl md:text-2xl font-bold break-words"
            >
              {{ collectionName }}
            </h1>
            <p
              v-if="collectionDescription"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ color: textColor, opacity: 0.7 }"
              class="text-xs sm:text-sm mt-2 leading-relaxed"
            >
              {{ collectionDescription }}
            </p>
            <p
              v-if="eventDate"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ color: textColor, opacity: 0.8 }"
              class="text-[10px] xs:text-xs sm:text-xs md:text-sm mt-1 uppercase tracking-wide"
            >
              {{ formattedDate }}
            </p>
            <p
              v-if="userEmail"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ color: textColor, opacity: 0.6 }"
              class="text-[10px] xs:text-xs sm:text-xs md:text-sm mt-1.5"
            >
              {{ userEmail }}
            </p>
          </div>
          <TooltipProvider v-if="designConfig.navigationStyle === 'icon-only'">
            <div class="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto w-full sm:w-auto scrollbar-hide">
              <template
                v-for="tab in tabs"
                :key="tab"
              >
                <Tooltip>
                  <TooltipTrigger as-child>
                    <button
                      :class="[fontFamilyClass, activeTab === tab ? 'font-bold' : 'font-normal']"
                      :style="{
                        color: activeTab === tab ? accentColor : textColor,
                        borderBottom: activeTab === tab ? `3px solid ${accentColor}` : 'none',
                        paddingBottom: '6px',
                        opacity: activeTab === tab ? 1 : 0.7,
                      }"
                      class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm uppercase tracking-wide transition-all duration-200 font-medium whitespace-nowrap"
                      @click="handleTabClick(tab)"
                    >
                      <component
                        :is="getTabIcon(tab)"
                        class="h-5 w-5 sm:h-6 sm:w-6"
                      />
                      <Download
                        v-if="props.previewMode === 'public' && isPhotoDownloadEnabled && downloadableSets.length > 0 && isSetDownloadable(getSetIdForTab(tab))"
                        class="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70"
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ tab }}</p>
                  </TooltipContent>
                </Tooltip>
              </template>
            </div>
          </TooltipProvider>
          <div
            v-else
            class="flex gap-2 sm:gap-3 md:gap-4 overflow-x-auto w-full sm:w-auto scrollbar-hide"
          >
            <button
              v-for="tab in tabs"
              :key="tab"
              :class="[fontFamilyClass, activeTab === tab ? 'font-bold' : 'font-normal']"
              :style="{
                color: activeTab === tab ? accentColor : textColor,
                borderBottom: activeTab === tab ? `3px solid ${accentColor}` : 'none',
                paddingBottom: '6px',
                opacity: activeTab === tab ? 1 : 0.7,
              }"
              class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm uppercase tracking-wide transition-all duration-200 font-medium whitespace-nowrap"
              @click="handleTabClick(tab)"
            >
              <component
                :is="getTabIcon(tab)"
                v-if="designConfig.navigationStyle === 'icon-text'"
                class="h-4 w-4 sm:h-4 sm:w-4"
              />
              <span
                v-if="designConfig.navigationStyle === 'icon-text' || designConfig.navigationStyle === 'text-only' || !designConfig.navigationStyle"
              >
                {{ tab }}
                <span class="ml-1 opacity-70">
                  ({{ getMediaCountForTab(tab) }})
                </span>
              </span>
              <Download
                v-if="props.previewMode === 'public' && isPhotoDownloadEnabled && downloadableSets.length > 0 && isSetDownloadable(getSetIdForTab(tab))"
                class="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cover Section (when cover is not 'none') -->
    <div v-else :style="{ backgroundColor: backgroundColor }" class="relative w-full">
      <!-- Hero Section -->
      <div class="relative w-full h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] overflow-hidden">
        <div
          v-if="isLoading && !coverImageWithFallback"
          class="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900"
        >
          <Loader2 class="h-12 w-12 animate-spin text-white" />
        </div>
        <img
          v-else-if="coverImageWithFallback && !isVideoCover"
          :src="coverImageWithFallback"
          :alt="collectionName"
          :style="{
            objectPosition: coverFocalPoint,
          }"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <video
          v-else-if="coverImageWithFallback && isVideoCover"
          ref="coverVideoRef"
          :src="coverVideoUrl"
          :style="{
            objectPosition: coverFocalPoint,
          }"
          class="absolute inset-0 w-full h-full object-cover"
          autoplay
          loop
          muted
          playsinline
          @click.stop="toggleCoverVideoPlay"
        />
        <div
          v-else
          class="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out"
          :style="getCollectionGradientStyle()"
        ></div>
        
        <!-- Top Left Branding Logo -->
        <div
          v-if="!isLoading || coverImageWithFallback"
          class="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 lg:top-12 lg:left-12 z-10"
        >
          <img
            v-if="brandingLogoUrl"
            :src="brandingLogoUrl"
            alt="Brand Logo"
            class="h-6 sm:h-7 md:h-8 lg:h-10 xl:h-12 w-auto object-contain max-w-[120px] sm:max-w-[140px] md:max-w-none"
          />
          <MazelootLogo
            v-else
            size="sm"
            :color-class="'brightness-0 invert'"
          />
        </div>
        
        <!-- Bottom Content Container -->
        <div
          v-if="!isLoading || coverImageWithFallback"
          class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 md:bottom-12 md:left-8 md:right-8 lg:bottom-16 lg:left-12 lg:right-12 xl:bottom-20 xl:left-16 xl:right-16 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6"
        >
          <!-- Left Side Text Content -->
          <div class="flex flex-col flex-1 min-w-0">
            <!-- Collection Title -->
            <h1 
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ 
                color: 'white',
                textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
              }"
              class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-normal tracking-tight leading-tight break-words"
            >
              {{ collectionName }}
            </h1>
            <!-- Description -->
            <p
              v-if="collectionDescription"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ 
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                opacity: 0.85,
              }"
              class="text-xs sm:text-sm md:text-base mt-2 sm:mt-3 md:mt-4 lg:mt-6 leading-relaxed max-w-2xl"
            >
              {{ collectionDescription }}
            </p>
            <!-- Date -->
            <p
              v-if="eventDate"
              :class="[fontFamilyClass, fontStyleClass]"
              :style="{ 
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                opacity: 0.9,
              }"
              class="text-[10px] xs:text-xs sm:text-xs md:text-sm uppercase tracking-widest font-medium  mt-2 sm:mt-3 md:mt-4 lg:mt-6"
            >
              {{ formattedDate }}
            </p>
          </div>

          <!-- Bottom Right Button -->
          <div class="flex-shrink-0 w-full sm:w-auto">
          <button
            :style="{
              backgroundColor: accentColor,
              color: accentTextColor,
            }"
            class="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-[10px] xs:text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider rounded-lg transition-all duration-300 hover:opacity-90 active:scale-95 shadow-lg hover:shadow-xl whitespace-nowrap"
            @click="scrollToGallery"
          >
            VIEW GALLERY
          </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Content Section -->
    <div
      id="gallery"
      :style="{ backgroundColor: backgroundColor }"
      class="w-full"
    >
      <!-- Separator Bar -->
      <div
        v-if="designConfig.cover !== 'none'"
        :style="{ 
          borderColor: borderColor,
          backgroundColor: `${backgroundColor}E6`, // 90% opacity
        }"
        class="sticky top-0 z-40 border-t border-b backdrop-blur-md py-4 sm:py-5 md:py-6 mb-8 sm:mb-10 md:mb-12 px-3 sm:px-4 md:px-8 lg:px-12 transition-all duration-300"
      >
        <!-- Top Row: Title and Actions -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-5 md:mb-6">
        <!-- Left -->
        <div class="flex flex-col flex-1 min-w-0">
            <h2
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{ color: textColor }"
              class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-tight break-words"
          >
            {{ collectionName.toUpperCase() }}
            </h2>
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
              <p
                v-if="brandingText"
            :class="[fontFamilyClass, fontStyleClass]"
                :style="{ color: textColor, opacity: 0.7 }"
                class="text-[10px] xs:text-xs sm:text-xs md:text-sm font-medium"
          >
            {{ brandingText }}
              </p>
              <span
                v-if="eventDate"
                :class="[fontFamilyClass, fontStyleClass]"
                :style="{ color: textColor, opacity: 0.6 }"
                class="text-[10px] xs:text-xs sm:text-xs md:text-sm font-medium"
              >
                • {{ formattedDate }}
              </span>
              <span
                v-if="userEmail"
                :class="[fontFamilyClass, fontStyleClass]"
                :style="{ color: textColor, opacity: 0.6 }"
                class="text-[10px] xs:text-xs sm:text-xs md:text-sm font-medium"
              >
                • {{ userEmail }}
              </span>
          </div>
        </div>

          <!-- Right - Action Icons -->
          <div class="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          <button
            v-if="collection?.favoritePhotos !== false && media.length > 0"
            :disabled="isFavoritingAll"
            :style="{
                color: allItemsFavourited ? accentColor : textColor,
                backgroundColor: allItemsFavourited ? `${accentColor}15` : 'transparent',
                opacity: isFavoritingAll ? 0.6 : 1,
            }"
              class="p-2 sm:p-2.5 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 active:scale-95 border border-transparent hover:border-black/10 dark:hover:border-white/10 disabled:cursor-not-allowed"
              :title="allItemsFavourited ? 'Unfavourite all' : 'Favourite all'"
              aria-label="Favourite all media"
              @click="handleFavoriteAll"
          >
              <Heart v-if="!isFavoritingAll" :class="allItemsFavourited ? 'fill-current' : ''" class="h-4 w-4 sm:h-5 sm:w-5" />
              <Loader2 v-else class="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          </button>
          <button
              v-if="filteredMedia.length > 0 && (props.previewMode !== 'public' || (isPhotoDownloadEnabled && (!downloadableSets.length || isSetDownloadable(getSetIdForTab(activeTab)))))"
              :style="{ 
                color: textColor,
                backgroundColor: 'transparent',
              }"
              class="p-2 sm:p-2.5 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 active:scale-95 border border-transparent hover:border-black/10 dark:hover:border-white/10"
              title="Download"
              aria-label="Download collection"
              @click="handleDownloadAll"
            >
              <Download class="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
              :style="{ 
                color: textColor,
                backgroundColor: 'transparent',
              }"
              class="p-2 sm:p-2.5 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 active:scale-95 border border-transparent hover:border-black/10 dark:hover:border-white/10"
            title="Share"
              aria-label="Share collection"
          >
            <Share2 class="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
              <button
               v-if="filteredMedia.length > 0"
               :style="{ 
                 color: accentTextColor,
                 backgroundColor: accentColor,
               }"
               class="p-2 sm:p-2.5 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
               title="Play slideshow"
               aria-label="Play slideshow"
               @click="handlePlaySlideshow"
             >
               <Play class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              v-if="props.previewMode === 'public'"
              :style="{ 
                color: textColor,
                backgroundColor: 'transparent',
              }"
              class="p-2 sm:p-2.5 rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-110 active:scale-95 border border-transparent hover:border-black/10 dark:hover:border-white/10"
              title="Logout"
              aria-label="Logout"
              @click="handleLogout"
            >
              <LogOut class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
        </div>
      </div>

        <!-- Email Row (before tabs) -->
        <div
          v-if="userEmail"
          class="mb-3 sm:mb-4"
        >
          <p
            :class="[fontFamilyClass, fontStyleClass]"
            :style="{ color: textColor, opacity: 0.6 }"
            class="text-[10px] xs:text-xs sm:text-xs md:text-sm font-medium"
          >
            {{ userEmail }}
          </p>
        </div>

        <!-- Bottom Row: Tabs -->
        <TooltipProvider v-if="designConfig.navigationStyle === 'icon-only'">
          <div class="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-3 sm:-mx-4 md:-mx-8 lg:-mx-12 px-3 sm:px-4 md:px-8 lg:px-12">
            <template
              v-for="tab in tabs"
              :key="tab"
            >
              <Tooltip>
                <TooltipTrigger as-child>
                  <button
                    :class="[fontFamilyClass, activeTab === tab ? 'font-semibold' : 'font-medium']"
                    :style="{
                      color: activeTab === tab ? accentColor : textColor,
                      backgroundColor: activeTab === tab ? `${accentColor}15` : 'transparent',
                    }"
                    class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm uppercase tracking-wide transition-all duration-200 whitespace-nowrap hover:bg-black/5 dark:hover:bg-white/5"
                    @click="handleTabClick(tab)"
                  >
                    <component
                      :is="getTabIcon(tab)"
                      class="h-5 w-5 sm:h-6 sm:w-6"
                    />
                    <Download
                      v-if="props.previewMode === 'public' && isPhotoDownloadEnabled && downloadableSets.length > 0 && isSetDownloadable(getSetIdForTab(tab))"
                      class="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{{ tab }}{{ getMediaCountForTab(tab) > 0 ? ` (${getMediaCountForTab(tab)} items)` : '' }}</p>
                </TooltipContent>
              </Tooltip>
            </template>
          </div>
        </TooltipProvider>
        <div
          v-else
          class="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-3 sm:-mx-4 md:-mx-8 lg:-mx-12 px-3 sm:px-4 md:px-8 lg:px-12"
        >
          <button
            v-for="tab in tabs"
            :key="tab"
            :class="[fontFamilyClass, activeTab === tab ? 'font-semibold' : 'font-medium']"
            :style="{
              color: activeTab === tab ? accentColor : textColor,
              backgroundColor: activeTab === tab ? `${accentColor}15` : 'transparent',
            }"
            class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm uppercase tracking-wide transition-all duration-200 whitespace-nowrap hover:bg-black/5 dark:hover:bg-white/5"
            @click="handleTabClick(tab)"
          >
            <component
              :is="getTabIcon(tab)"
              v-if="designConfig.navigationStyle === 'icon-text'"
              class="h-3.5 w-3.5 sm:h-4 sm:w-4"
            />
            <span
              v-if="designConfig.navigationStyle === 'icon-text' || designConfig.navigationStyle === 'text-only' || !designConfig.navigationStyle"
            >
              {{ tab }}
              <span class="ml-1 opacity-70">
                ({{ getMediaCountForTab(tab) }})
              </span>
            </span>
            <Download
              v-if="props.previewMode === 'public' && isPhotoDownloadEnabled && downloadableSets.length > 0 && isSetDownloadable(getSetIdForTab(tab))"
              class="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70"
            />
          </button>
        </div>
      </div>

      <!-- Gallery Assist Walk-through Cards -->
      <Transition name="fade">
        <div
          v-if="props.previewMode === 'public' && showGalleryAssist && !isGalleryAssistDismissed"
          class="px-3 sm:px-4 md:px-8 lg:px-12 pb-6 sm:pb-8"
        >
          <div
            :style="{
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            }"
            class="rounded-xl border-2 p-4 sm:p-6 space-y-4 relative shadow-lg"
          >
            <button
              :style="{ color: textColor }"
              class="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label="Dismiss Gallery Assist"
              @click="dismissGalleryAssist"
            >
              <X class="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div class="flex items-start gap-3 sm:gap-4 pr-8">
              <div
                :style="{ backgroundColor: accentColor, color: accentTextColor }"
                class="p-2.5 rounded-lg shrink-0 shadow-md"
              >
                <Sparkles class="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  :class="[fontFamilyClass, fontStyleClass]"
                  :style="{ color: textColor }"
                  class="text-base sm:text-lg font-bold mb-1.5"
                >
                  Gallery Assist
                </h3>
                <p
                  :style="{ color: textColor, opacity: 0.8 }"
                  class="text-xs sm:text-sm leading-relaxed mb-5"
                >
                  Tips to help you navigate and use this collection
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
                      backgroundColor: accentColor + '15',
                      borderColor: borderColor,
                      '--card-delay': `${index * 50}ms`,
                    }"
                    class="p-3 sm:p-4 rounded-lg border transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-opacity-60 cursor-default group"
                  >
                    <div class="flex items-start gap-2 sm:gap-3">
                      <div
                        :style="{ backgroundColor: accentColor + '25', color: accentColor }"
                        class="p-2 rounded-lg shrink-0 group-hover:scale-110 transition-transform duration-200"
                      >
                        <component
                          :is="card.icon"
                          class="h-4 w-4 sm:h-5 sm:w-5"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4
                          :style="{ color: textColor }"
                          class="text-xs sm:text-sm font-semibold mb-1.5 leading-tight"
                        >
                          {{ card.title }}
                        </h4>
                        <p
                          :style="{ color: textColor, opacity: 0.75 }"
                          class="text-xs leading-relaxed"
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

      <!-- Media Grid Container -->
      <div class="px-3 sm:px-4 md:px-8 lg:px-12 pb-8 sm:pb-10 md:pb-12">
        <!-- Media Grid Skeleton (show when loading and collection is loaded) -->
      <div
        v-if="(isLoading || (props.previewMode && props.previewIsLoading)) && collection"
          :class="gridClasses"
          :style="gridStyles"
      >
        <div
            v-for="(i, index) in 12"
          :key="`skeleton-${i}`"
            :class="[
              'relative overflow-hidden rounded-lg',
              normalizedGridStyle === 'masonry' ? thumbnailSizeClasses : '',
            ]"
            :style="getGridItemStyle(index)"
          >
            <Skeleton class="w-full h-full" />
        </div>
      </div>

        <!-- Media Grid -->
      <TransitionGroup
        v-else-if="!isLoading && filteredMedia.length > 0"
        name="fade-in"
        tag="div"
        :class="gridClasses"
        :style="gridStyles"
      >
        <MediaGridItemCard
          v-for="(item, index) in paginatedMedia"
          :key="item.id"
          :item="item"
          :placeholder-image="'/placeholder-image.png'"
          :show-filename="false"
          :show-management-actions="false"
          :show-selection-checkbox="false"
          :public-mode="props.previewMode === 'public'"
          :is-downloading="props.downloadingMediaIds?.has?.(item.id || item.uuid) || false"
          :allow-download="props.disableActions ? false : isMediaItemDownloadable(item)"
          :is-client-verified="props.isClientVerified"
          :allow-mark-private="props.disableActions ? false : (collection?.allowClientsMarkPrivate && props.userMode === 'client')"
          :disable-aspect-square="normalizedGridStyle === 'masonry'"
          :hide-favorite-icon="props.previewMode === 'public' && collection?.favoritePhotos === false"
          :class="[
            normalizedGridStyle === 'masonry' ? thumbnailSizeClasses : '',
          ]"
          :style="getGridItemStyle(index)"
          @download="handleDownloadMedia"
          @share="handleShareMedia"
          @open-viewer="openMediaViewer"
          @view-details="handleViewDetails"
          @star-click="handleFavoriteMedia"
          @toggle-private="handleToggleMediaPrivate"
        />
      </TransitionGroup>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 px-4">
          <div
            :style="{ color: textColor, opacity: 0.4 }"
            class="mb-3 sm:mb-4"
          >
            <Grid3x3 class="h-12 w-12 sm:h-16 sm:w-16" />
          </div>
        <p
          :style="{
            color: textColor,
            opacity: 0.8,
          }"
            class="text-base sm:text-lg font-medium mb-2 text-center"
          >
            No media found
          </p>
          <p
            :style="{
              color: textColor,
              opacity: 0.6,
            }"
            class="text-xs sm:text-sm text-center max-w-md px-4"
          >
            This collection doesn't have any media yet. Add photos or videos to get started.
          </p>
        </div>
      </div>

      <!-- Back to Top Button -->
      <Transition name="fade">
         <button
           v-if="filteredMedia.length > 0 && showBackToTop"
           :style="{
             backgroundColor: accentColor,
             color: accentTextColor,
           }"
           class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-30 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl"
           @click="scrollToTop"
           aria-label="Back to top"
         >
           <ChevronLeft class="h-3 w-3 sm:h-4 sm:w-4 inline-block mr-1 rotate-90" />
           Top
         </button>
      </Transition>

      <!-- Loading More Indicator -->
      <div
        v-if="hasMoreItems && filteredMedia.length > 0"
        class="flex items-center justify-center py-6 sm:py-8"
      >
        <div
          v-if="isLoadingMore"
          class="flex items-center gap-2 sm:gap-3"
          :style="{ color: textColor }"
        >
          <Loader2 class="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          <span class="text-xs sm:text-sm font-medium">Loading more...</span>
        </div>
      </div>
    </div>

    <!-- Copyright Footer -->
    <footer
      :style="{
        borderColor: borderColor,
      }"
      class="border-t bg-gray-900 dark:bg-black py-4 sm:py-5 md:py-6 px-3 sm:px-4"
    >
      <div class="container mx-auto text-center">
        <p class="text-xs sm:text-sm font-medium text-gray-300 mb-1">
          © {{ new Date().getFullYear() }} {{ brandingName || 'Mazeloot' }}
        </p>
        <p v-if="showMazelootBranding" class="text-xs text-gray-400">Powered by Mazeloot</p>
      </div>
    </footer>

    <!-- Media Lightbox -->
    <MediaLightbox
      v-model="showMediaViewer"
      :items="filteredMedia"
      :initial-index="currentMediaIndex"
      :allow-comments="false"
      :collection-id="collection?.id || collectionId"
      :set-id="getSetIdForTab(activeTab)"
      :auto-start-slideshow="autoStartSlideshow"
      :slideshow-speed="collection?.slideshowSpeed || 'regular'"
      :slideshow-auto-loop="collection?.slideshowAutoLoop ?? true"
      :public-mode="props.previewMode === 'public'"
      :is-client-verified="props.isClientVerified"
      :allow-mark-private="collection?.allowClientsMarkPrivate && props.userMode === 'client'"
      :disable-actions="props.disableActions"
      :hide-favorite-icon="props.previewMode === 'public' && collection?.favoritePhotos === false"
      @close="closeMediaViewer"
      @download="handleDownloadMedia"
      @share="handleShareMedia"
      @favorite="handleFavoriteMedia"
      @toggle-private="handleToggleMediaPrivate"
      @slideshow="handleSlideshow"
    />

    <!-- Favorite Note Modal -->
    <Dialog :open="showFavoriteNoteModal" @update:open="showFavoriteNoteModal = $event">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Note to Favorite</DialogTitle>
          <DialogDescription>
            Add an optional note for this media item (optional)
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 mt-4">
          <Textarea
            v-model="favoriteNote"
            placeholder="Enter your note here..."
            class="min-h-[120px]"
            :maxlength="500"
          />
          <p class="text-xs text-gray-500 text-right">{{ favoriteNote.length }}/500</p>
        </div>
        <DialogFooter class="mt-6">
          <Button variant="ghost" @click="handleCancelFavoriteNote">Cancel</Button>
          <Button @click="handleConfirmFavoriteNote">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDownloadProtection } from '@/shared/composables/useDownloadProtection'
import { useRoute, useRouter } from 'vue-router'
import {
  ChevronLeft,
  Download,
  Play,
  Pause,
  ChevronRight,
  Grid3x3,
  Heart,
  Loader2,
  Lock,
  MoreVertical,
  Share2,
  Sparkles,
  Star,
  X,
  LogOut,
} from 'lucide-vue-next'
import { useCollectionsApi } from '@/domains/memora/api/collections'
import { useMediaApi } from '@/shared/api/media'
import { apiClient } from '@/shared/api/client'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useGalleryStore } from '@/shared/stores/gallery'
import { format } from 'date-fns'
import { getCoverStyleConfig } from '@/domains/memora/composables/useCoverStyles'
import { usePagination } from '@/shared/composables/usePagination'
import MediaLightbox from '@/shared/components/organisms/MediaLightbox.vue'
import MediaGridItemCard from '@/shared/components/organisms/MediaGridItemCard.vue'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import MazelootLogo from '@/shared/components/atoms/MazelootLogo.vue'
import { useSettingsApi } from '@/domains/memora/api/settings'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/shadcn/tooltip'
import { useSetIconMatcher } from '@/domains/memora/composables/useSetIconMatcher'
import { getColorPalettes, getTextColorFromBackground, getTextColorForAccent } from '@/shared/utils/colors'
import { toast } from '@/shared/utils/toast'
import { useUserStore } from '@/shared/stores/user'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/shadcn/dialog'
import { Textarea } from '@/shared/components/shadcn/textarea'
import { Button } from '@/shared/components/shadcn/button'

// Props for preview mode
const props = defineProps({
  previewMode: String,
  previewCollection: Object,
  previewMedia: Array,
  previewDesignConfig: Object,
  previewBranding: Object,
  previewIsLoading: {
    type: Boolean,
    default: false,
  },
  downloadingMediaIds: {
    type: [Set, Object],
    default: () => new Set(),
  },
  isClientVerified: {
    type: Boolean,
    default: false,
  },
  userMode: {
    type: String,
    default: null, // 'guest' | 'client' | null
  },
  disableActions: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['tab-change', 'download', 'toggle-private', 'logout'])

const route = useRoute()
const router = useRouter()
const collectionsApi = useCollectionsApi()
const mediaApi = useMediaApi()
const presetStore = usePresetStore()
const galleryStore = useGalleryStore()
const userStore = useUserStore()
const { getIcon: getSetIcon } = useSetIconMatcher()
const { fetchSettings } = useSettingsApi()

// Collection data
const collection = ref(null)
const media = ref([])
const isLoading = ref(true)
const brandingLogoUrl = ref(null)
const brandingName = ref(null)
const showMazelootBranding = ref(true)
const selectedMedia = ref(null)
const showMediaViewer = ref(false)
const currentMediaIndex = ref(0)
const activeTab = ref(null)
const autoStartSlideshow = ref(false)
const showBackToTop = ref(false)
const coverVideoRef = ref(null)
const isCoverVideoPlaying = ref(true)
const showFavoriteNoteModal = ref(false)
const favoriteNote = ref('')
const pendingFavoriteItem = ref(null)
const isFavoritingAll = ref(false)

// Track if we're in initial load to prevent store updates from overwriting API data
let isInitialLoad = true
let isUpdatingFromRoute = false

const collectionId = computed(() => {
  if (props.previewMode) return ''
  return route.params.id || ''
})

// Force reactivity by tracking the prop explicitly
const designConfig = computed(() => {
  // Access props.previewDesignConfig to ensure this computed tracks it
  const previewConfig = props.previewMode ? props.previewDesignConfig : null

  // If in preview mode with provided config, use it
  if (previewConfig) {
    return {
      ...previewConfig,
    }
  }

  if (route.name === 'presetPreview') {
    const presetName = route.params.name
    if (presetName) {
      const preset = presetStore.getPresetByName(presetName)
      if (preset?.design) {
        return preset.design
      }
    }
  }

  // Try to get preset from collection if it has a presetId
  // Otherwise use the current preset from store or defaults
  const collectionPresetId = collection.value?.presetId
  let preset = null

  if (collectionPresetId) {
    preset = presetStore.getPresetById(collectionPresetId)
  }

  if (!preset) {
    preset = presetStore.currentPreset
  }

  // Get collection design configs (standardized from backend)
  // Support both organized structure (settings.design) and normalized top-level properties
  const collectionDesign = collection.value?.design || collection.value?.settings?.design || {}
  const collectionCoverDesign = collection.value?.coverDesign || collectionDesign.cover || {}
  const collectionTypographyDesign = collection.value?.typographyDesign || collectionDesign.typography || {}
  const collectionColorDesign = collection.value?.colorDesign || collectionDesign.color || {}
  const rawGridDesign = collection.value?.gridDesign || collectionDesign.grid || {}
  // Normalize grid design field names
  const collectionGridDesign = {
    ...rawGridDesign,
    thumbnailSize: rawGridDesign.thumbnailOrientation || rawGridDesign.thumbnailSize,
    navigationStyle: rawGridDesign.tabStyle || rawGridDesign.navigationStyle,
  }

  // Build base design from preset or defaults
    const presetDesign = preset?.design || {}
    const baseDesign = {
    cover: presetDesign.cover || 'center',
      coverFocalPoint: presetDesign.coverFocalPoint || { x: 50, y: 50 },
      fontFamily: presetDesign.fontFamily || 'sans',
      fontStyle: presetDesign.fontStyle || 'normal',
      colorPalette: presetDesign.colorPalette || 'light',
      gridStyle: presetDesign.gridStyle || 'vertical',
      gridColumns: presetDesign.gridColumns || 3,
      thumbnailSize: presetDesign.thumbnailSize || 'medium',
      gridSpacing: presetDesign.gridSpacing || 16,
      navigationStyle: presetDesign.navigationStyle || 'icon-text',
    }

  // Merge collection configs (takes priority over preset)
    return {
      ...baseDesign,
    // Cover design
      coverLayoutUuid: collectionCoverDesign.coverLayoutUuid || null,
    coverFocalPoint: (collectionCoverDesign.coverFocalPoint && typeof collectionCoverDesign.coverFocalPoint === 'object' && 'x' in collectionCoverDesign.coverFocalPoint && 'y' in collectionCoverDesign.coverFocalPoint) 
      ? collectionCoverDesign.coverFocalPoint 
      : baseDesign.coverFocalPoint,
    // Typography design
    fontFamily: collectionTypographyDesign.fontFamily || baseDesign.fontFamily,
    fontStyle: collectionTypographyDesign.fontStyle || baseDesign.fontStyle,
    // Color design
    colorPalette: collectionColorDesign.colorPalette || baseDesign.colorPalette,
    // Grid design
    gridStyle: collectionGridDesign.gridStyle || baseDesign.gridStyle,
    gridColumns: collectionGridDesign.gridColumns || baseDesign.gridColumns,
    thumbnailSize: collectionGridDesign.thumbnailSize || baseDesign.thumbnailSize,
    gridSpacing: collectionGridDesign.gridSpacing || baseDesign.gridSpacing,
    navigationStyle: collectionGridDesign.navigationStyle || baseDesign.navigationStyle,
  }
})

// Color palette mapping
// Format: [primary, secondary, background] where background is mostly light
const colorPalettes = getColorPalettes()

const paletteColors = computed(() => {
  return colorPalettes[designConfig.value.colorPalette || 'light'] || colorPalettes.light
})

// Style computed properties
// Format: [primary, secondary, background]
const backgroundColor = computed(() => paletteColors.value[2])
const contentBackgroundColor = computed(() => paletteColors.value[2])
const accentColor = computed(() => paletteColors.value[0])
const primaryColor = computed(() => paletteColors.value[0])
const secondaryColor = computed(() => paletteColors.value[1])
const textColor = computed(() => getTextColorFromBackground(paletteColors.value[2]))

// Text color for accent backgrounds (buttons, active states)
const accentTextColor = computed(() => getTextColorForAccent(paletteColors.value[0]))

// Tab text color - ensures good contrast with background
const tabTextColor = computed(() => {
  const bg = paletteColors.value[2]
  return getTextColorFromBackground(bg)
})

const borderColor = computed(() => {
  const bg = paletteColors.value[2]
  const textColor = getTextColorFromBackground(bg)
  return textColor === '#000000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)'
})

const showGalleryAssist = computed(() => {
  const collectionToUse =
    props.previewMode && props.previewCollection ? props.previewCollection : collection.value
  return collectionToUse?.galleryAssist ?? collectionToUse?.settings?.general?.galleryAssist ?? false
})

const galleryAssistCards = computed(() => {
  if (props.previewMode !== 'public') return []
  
  const collectionToUse =
    props.previewMode && props.previewCollection ? props.previewCollection : collection.value
  
  if (!collectionToUse) return []
  
  const allCards = [
    {
      id: 'browse',
      icon: Grid3x3,
      title: 'Browse Photos',
      description: 'Click on any photo to view it full-screen in the lightbox',
      show: true,
      priority: 1,
    },
    {
      id: 'slideshow',
      icon: Play,
      title: 'Slideshow',
      description: 'Use the play button to start an automatic slideshow',
      show: true,
      priority: 2,
    },
    {
      id: 'download',
      icon: Download,
      title: 'Download Photos',
      description: 'Use the download button to save photos to your device',
      show: isPhotoDownloadEnabled.value,
      priority: 3,
    },
    {
      id: 'favorite',
      icon: Heart,
      title: 'Favorite Photos',
      description: 'Click the heart icon to favorite photos you love',
      show: collectionToUse?.favoritePhotos !== false,
      priority: 4,
    },
    {
      id: 'share',
      icon: Share2,
      title: 'Share Photos',
      description: 'Use the share button to copy a link to any photo',
      show: collectionToUse?.socialSharing !== false,
      priority: 5,
    },
    {
      id: 'make-private',
      icon: Lock,
      title: 'Make Private',
      description: 'Mark photos as private to hide them from others',
      show: collectionToUse?.allowClientsMarkPrivate && props.userMode === 'client',
      priority: 6,
    },
    {
      id: 'logout',
      icon: LogOut,
      title: 'Logout',
      description: 'Use the logout button to end your session',
      show: props.previewMode === 'public',
      priority: 7,
    },
  ]
  
  return allCards
    .filter(card => card.show)
    .sort((a, b) => a.priority - b.priority)
})

const isGalleryAssistDismissed = ref(false)

const getGalleryAssistDismissKey = () => {
  const collectionToUse =
    props.previewMode && props.previewCollection ? props.previewCollection : collection.value
  const id = collectionToUse?.id || collectionToUse?.uuid || collectionId.value
  return id ? `gallery-assist-dismissed-${id}` : null
}

const dismissGalleryAssist = () => {
  isGalleryAssistDismissed.value = true
  const key = getGalleryAssistDismissKey()
  if (key && typeof window !== 'undefined') {
    localStorage.setItem(key, 'true')
  }
}

const coverType = computed(() => designConfig.value.cover || 'center')
const coverConfig = computed(() => getCoverStyleConfig(coverType.value))

const coverImage = computed(() => {
  const collectionToUse =
    props.previewMode && props.previewCollection ? props.previewCollection : collection.value

  // Priority 1: Collection cover image (from settings.image)
  if (collectionToUse?.image) {
    return collectionToUse.image
  }

  // Priority 2: Collection thumbnail (from settings.thumbnail)
  if (collectionToUse?.thumbnail) {
    return collectionToUse.thumbnail
  }

  // Priority 3: First media item (preview mode only)
  if (props.previewMode && props.previewMedia && props.previewMedia.length > 0) {
    return props.previewMedia[0].url
  }

  // Priority 4: First media item from loaded collection
  if (media.value && media.value.length > 0) {
    return media.value[0].url
  }

  // Final fallback
  return null
})

const coverImageWithFallback = computed(() => {
  return coverImage.value || null
})

const handleCoverImageError = () => {
  // Error handling is now done at the component level
}

// Check if an item is a video
const isVideoItem = (item) => {
  if (item.type === 'video') return true
  if (item.file && item.file.type === 'video') return true
  
  const url = item.url || item.largeImageUrl || (item.file && item.file.url) || item.thumbnail || item.thumbnailUrl
  if (!url) return false
  
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

// Check if cover is a video
const isVideoCover = computed(() => {
  const imageUrl = coverImage.value
  if (!imageUrl) return false

  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv']
  const lowerUrl = imageUrl.toLowerCase()
  return videoExtensions.some(ext => lowerUrl.includes(ext))
})

const coverVideoUrl = computed(() => {
  if (!isVideoCover.value) return null
  return coverImage.value || null
})

const toggleCoverVideoPlay = () => {
  if (!coverVideoRef.value) return

  if (isCoverVideoPlaying.value) {
    coverVideoRef.value.pause()
    isCoverVideoPlaying.value = false
  } else {
    coverVideoRef.value.play()
    isCoverVideoPlaying.value = true
  }
}

const coverFocalPoint = computed(() => {
  const focalPoint = designConfig.value.coverFocalPoint
  // Support both old string format and new object format
  if (
    typeof focalPoint === 'object' &&
    focalPoint !== null &&
    'x' in focalPoint &&
    'y' in focalPoint
  ) {
    return `${focalPoint.x}% ${focalPoint.y}%`
  }
  // Fallback for old string format
  if (typeof focalPoint === 'string') {
    const focalPointMap = {
      center: 'center center',
      top: 'center top',
      bottom: 'center bottom',
      left: 'left center',
      right: 'right center',
      'top-left': 'left top',
      'top-right': 'right top',
      'bottom-left': 'left bottom',
      'bottom-right': 'right bottom',
    }
    return focalPointMap[focalPoint] || 'center center'
  }
  return 'center center'
})

const coverGradient = computed(() => {
  const cover = coverType.value
  if (cover === 'joy' || cover === 'celebration') {
    return 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'
  }
  if (cover === 'center' || cover === 'summit') {
    return `linear-gradient(135deg, ${paletteColors.value[0]} 0%, ${paletteColors.value[0]} 40%, ${paletteColors.value[1]} 100%)`
  }
  if (cover === 'left' || cover === 'horizon') {
    return `linear-gradient(135deg, ${paletteColors.value[1]} 0%, ${paletteColors.value[0]} 60%, ${paletteColors.value[0]} 100%)`
  }
  return `linear-gradient(135deg, ${paletteColors.value[0]} 0%, ${paletteColors.value[1]} 100%)`
})

const overlayColor = computed(() => {
  if (coverImageWithFallback.value) {
    const cover = coverType.value
    if (cover === 'joy' || cover === 'celebration') {
      return 'rgba(255, 255, 255, 0.15)'
    }
    // Increased contrast for better text readability
    return 'rgba(0, 0, 0, 0.5)'
  }
  return 'transparent'
})

const fontFamilyClass = computed(() => {
  const fontMap = {
    sans: 'font-sans',
    serif: 'font-serif',
    modern: 'font-mono',
    // Display & Bold
    bebas: 'font-bebas',
    oswald: 'font-oswald',
    abril: 'font-abril',
    bungee: 'font-bungee',
    righteous: 'font-righteous',
    // Modern Sans
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
    // Serif
    merriweather: 'font-merriweather',
    crimson: 'font-crimson',
    lora: 'font-lora',
    // Monospace
    spacemono: 'font-spacemono',
    jetbrains: 'font-jetbrains',
    // Rounded & Friendly
    comfortaa: 'font-comfortaa',
    quicksand: 'font-quicksand',
    rubik: 'font-rubik',
    // Script & Handwriting
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
  return fontMap[designConfig.value.fontFamily || 'sans'] || 'font-sans'
})

const fontStyleClass = computed(() => {
  const style = designConfig.value.fontStyle || 'normal'
  
  // Handle watermark-style font styles (normal, italic, bold, bold italic)
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
  
  // Legacy support for old style values
  const legacyStyleMap = {
    normal: 'font-normal',
    bold: 'font-bold',
    italic: 'italic',
    timeless: 'font-serif',
    subtle: 'font-light',
  }
  return legacyStyleMap[style] || 'font-normal'
})

const gridSpacingValue = computed(() => {
  const spacing = designConfig.value.gridSpacing
  if (typeof spacing === 'number') {
    return spacing
  }
  // Backward compatibility with string values
  if (spacing === 'large') return 24
  if (spacing === 'regular' || spacing === 'normal') return 16
  if (spacing === 'tight') return 8
  if (spacing === 'wide' || spacing === 'loose') return 32
  return 16
})

// Dynamic grid spacing styles
const gridStyles = computed(() => {
  const spacing = gridSpacingValue.value
  const gridStyle = normalizedGridStyle.value
  
  // Masonry uses CSS columns, so use column-gap for horizontal spacing
  // Vertical spacing is handled via margin-bottom on items
  if (gridStyle === 'masonry') {
    // Reduce column gap on mobile for better appearance
    const mobileSpacing = Math.max(8, Math.floor(spacing * 0.75))
    return {
      columnGap: `${mobileSpacing}px`,
    }
  }
  
  return {
    gap: `${spacing}px`,
  }
})

// Normalize grid style: only map legacy 'rows' to 'vertical', keep 'grid' as separate option
const normalizedGridStyle = computed(() => {
  const style = designConfig.value.gridStyle
  if (style === 'rows') {
    return 'vertical'
  }
  return style || 'vertical'
})

const gridClasses = computed(() => {
  const gridStyle = normalizedGridStyle.value
  const gridColumns = adjustedGridColumns.value

  // Masonry layout uses CSS columns
  if (gridStyle === 'masonry') {
    // Single column on mobile, 2 columns on sm, then responsive
    const columns =
      gridColumns === 2
        ? 'sm:columns-2 md:columns-2'
        : gridColumns === 4
          ? 'sm:columns-2 md:columns-4'
          : gridColumns === 5
            ? 'sm:columns-2 md:columns-5'
            : gridColumns === 6
              ? 'sm:columns-2 md:columns-6'
              : 'sm:columns-2 md:columns-3'
    return `columns-1 ${columns}`
  }

  // Regular grid layouts (vertical and grid both use CSS grid)
  const colsClass =
    gridColumns === 2
      ? 'md:grid-cols-2'
      : gridColumns === 4
        ? 'md:grid-cols-4'
        : gridColumns === 5
          ? 'md:grid-cols-5'
          : gridColumns === 6
            ? 'md:grid-cols-6'
            : 'md:grid-cols-3'

  return `grid grid-cols-2 ${colsClass}`
})

// Thumbnail size classes - affects the minimum size of grid items (only for masonry)
const thumbnailSizeClasses = computed(() => {
  const size = designConfig.value.thumbnailSize || 'medium'
  if (size === 'large') {
    // For large thumbnails in masonry layout, increase minimum height
    return 'min-h-[200px] sm:min-h-[250px] md:min-h-[350px]'
  }
  if (size === 'small') {
    // For small thumbnails in masonry layout, decrease minimum height
    return 'min-h-[120px] sm:min-h-[150px] md:min-h-[200px]'
  }
  // medium/regular size - default minimum height for mobile
  return 'min-h-[150px] sm:min-h-[180px] md:min-h-[220px]'
})

// Use base columns - thumbnail size only affects aspect ratio, not column count
const adjustedGridColumns = computed(() => {
  return designConfig.value.gridColumns || 3
})

// Get grid item style based on grid style and thumbnail size
const getGridItemStyle = (index = 0) => {
  const gridStyle = normalizedGridStyle.value
  const thumbnailSize = designConfig.value.thumbnailSize || 'medium'
  
  // For masonry, break inside avoid, width 100%, and margin-bottom for vertical spacing
  if (gridStyle === 'masonry') {
    const spacing = gridSpacingValue.value
    // Reduce spacing on mobile for better appearance
    const mobileSpacing = Math.max(8, Math.floor(spacing * 0.75))
    return {
      breakInside: 'avoid',
      width: '100%',
      marginBottom: `${mobileSpacing}px`,
    }
  }
  
  // For regular grid, use aspect ratio based on thumbnail size
  if (thumbnailSize === 'large') {
    return { aspectRatio: '4/3' }
  }
  if (thumbnailSize === 'small') {
    return { aspectRatio: '3/4' }
  }
  // medium/default
  return { aspectRatio: '1/1' }
}

const coverContentClasses = computed(() => {
  const config = coverConfig.value
  if (config.textPosition === 'bottom' && config.textAlignment === 'left') {
    return 'flex items-end justify-start h-full'
  }
  if (config.textPosition === 'bottom' && config.textAlignment === 'center') {
    return 'flex items-end justify-center h-full'
  }
  if (config.textPosition === 'top') {
    return 'flex items-start justify-center h-full'
  }
  return 'flex flex-col items-center justify-center h-full'
})

const collectionDescription = computed(() => {
  const collectionToUse = props.previewCollection || collection.value
  return collectionToUse?.description || ''
})

const userEmail = computed(() => {
  const loggedInEmail = userStore.isAuthenticated && userStore.user?.email ? userStore.user.email : null
  const collectionIdValue = collectionId.value || collection.value?.id
  const guestEmail = collectionIdValue 
    ? (localStorage.getItem(`collection_${collectionIdValue}_email`) || localStorage.getItem(`collection_email_${collectionIdValue}`))
    : null
  
  // Also check client verification storage
  let clientEmail = null
  if (collectionIdValue) {
    const stored = localStorage.getItem(`collection_${collectionIdValue}_client_verified`)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.email) {
          clientEmail = data.email
        }
      } catch (e) {
        // Invalid data
      }
    }
  }
  
  const emails = [loggedInEmail, guestEmail, clientEmail].filter(Boolean)
  return emails.length > 0 ? emails.join(' • ') : null
})

const collectionName = computed(() => {
  if (props.previewMode && props.previewCollection) {
    return props.previewCollection.name || 'Collection'
  }
  return collection.value?.name || 'Collection'
})

const eventDate = computed(() => {
  if (props.previewMode && props.previewCollection) {
    return props.previewCollection.date || props.previewCollection.eventDate
  }
  return collection.value?.date || collection.value?.eventDate
})
const formattedDate = computed(() => {
  if (!eventDate.value) return ''
  try {
    let date
    if (typeof eventDate.value === 'string') {
      date = new Date(eventDate.value)
    } else if (eventDate.value instanceof Date) {
      date = eventDate.value
    } else {
      return eventDate.value.toString().toUpperCase()
    }
    if (isNaN(date.getTime())) {
      return eventDate.value.toString().toUpperCase()
    }
    return format(date, 'MMMM do, yyyy').toUpperCase()
  } catch {
    return eventDate.value.toString().toUpperCase()
  }
})

const showBranding = computed(() => true) // Can be made configurable
const brandingText = computed(() => brandingName.value || null)

// Joy cover config computed properties
const joyCoverTitle = computed(() => designConfig.value.joyCoverTitle || 'JOY')
const joyCoverAvatar = computed(() => designConfig.value.joyCoverAvatar)
const joyCoverBackgroundPattern = computed(() => designConfig.value.joyCoverBackgroundPattern)
const joyCoverShowDate = computed(() => designConfig.value.joyCoverShowDate)
const joyCoverShowName = computed(() => designConfig.value.joyCoverShowName)
const joyCoverShowButton = computed(() => designConfig.value.joyCoverShowButton)
const joyCoverButtonText = computed(() => designConfig.value.joyCoverButtonText)

const tabs = computed(() => {
  // Use actual sets from collection if available
  if (collection.value?.mediaSets && collection.value.mediaSets.length > 0) {
    let sets = collection.value.mediaSets
    
    // Filter client-only sets for guests
    if (props.previewMode === 'public' && props.userMode === 'guest') {
      const clientOnlySets = collection.value?.clientOnlySets || []
      if (clientOnlySets.length > 0) {
        sets = sets.filter(set => !clientOnlySets.includes(set.id))
      }
    }
    
    return sets.map(set => set.name)
  }

  // Fallback to preset photoSets for preset preview
  let preset = presetStore.currentPreset

  if (route.name === 'presetPreview') {
    const presetName = route.params.name
    if (presetName) {
      const presetByName = presetStore.getPresetByName(presetName)
      if (presetByName) {
        preset = presetByName
      }
    }
  }

  if (preset?.photoSets && preset.photoSets.length > 0) {
    return preset.photoSets
  }
  
  return []
})

const downloadableSets = computed(() => {
  const collectionToUse = props.previewMode && props.previewCollection ? props.previewCollection : collection.value
  if (!collectionToUse) return []
  
  // Try multiple paths for downloadableSets
  let sets = null
  if (collectionToUse?.settings?.download?.downloadableSets) {
    sets = collectionToUse.settings.download.downloadableSets
  } else if (collectionToUse?.download?.downloadableSets) {
    sets = collectionToUse.download.downloadableSets
  } else if (collectionToUse?.downloadableSets) {
    sets = collectionToUse.downloadableSets
  }
  
  return Array.isArray(sets) && sets.length > 0 ? sets : []
})

const isSetDownloadable = (setId) => {
  if (!setId || !downloadableSets.value || downloadableSets.value.length === 0) return false
  return downloadableSets.value.includes(setId)
}

const isMediaItemDownloadable = (item) => {
  if (props.previewMode !== 'public') return true
  if (!isPhotoDownloadEnabled.value) return false
  if (!downloadableSets.value || downloadableSets.value.length === 0) return true
  const setId = item.setId || item.set_id || item.mediaSet?.id
  return setId && downloadableSets.value.includes(setId)
}

const isPhotoDownloadEnabled = computed(() => {
  if (props.previewMode !== 'public') return false
  const collectionToUse = props.previewCollection || collection.value
  if (!collectionToUse) return false
  
  // Check mediaDownload (photoDownload) in various possible locations (normalized structure preferred)
  if (collectionToUse.photoDownload !== undefined) {
    return collectionToUse.photoDownload !== false
  }
  if (collectionToUse.download?.photoDownload !== undefined) {
    return collectionToUse.download.photoDownload !== false
  }
  if (collectionToUse.settings?.download?.photoDownload !== undefined) {
    return collectionToUse.settings.download.photoDownload !== false
  }
  return false
})

// Generate placeholder media items for empty sets
const generatePlaceholderMedia = (count = 10) => {
  const placeholderPhotoIds = [
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
    '1511285560929-80b456fea0bc',
    '1521119989659-a83eee488004',
    '1475721027785-f74eccf877e2',
  ]

  return Array.from({ length: count }, (_, index) => {
    const photoId = placeholderPhotoIds[index % placeholderPhotoIds.length]
    return {
      id: `placeholder-${activeTab.value}-${index}`,
      collectionId: collection.value?.id || 'placeholder-collection',
      url: `https://images.unsplash.com/photo-${photoId}?w=800&h=800&fit=crop`,
      thumbnail: `https://images.unsplash.com/photo-${photoId}?w=300&h=300&fit=crop`,
      type: 'image',
      title: `Placeholder ${index + 1}`,
      order: index,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPlaceholder: true, // Mark as placeholder
    }
  })
}

const filteredMedia = computed(() => {
  const mediaToUse = props.previewMode && props.previewMedia ? props.previewMedia : media.value
  const coverImageUrl = coverImageWithFallback.value

  // Filter out the cover image to avoid repetition
  let filtered = mediaToUse.filter(item => {
    if (!coverImageUrl) return true
    return item.url !== coverImageUrl && item.thumbnail !== coverImageUrl
  })


  // No need to filter by set - we only load the active set's media
  // Return all filtered media
  return filtered
})

// Scroll-to-load pagination setup
const itemsPerLoad = 12 // Load 12 items at a time
const displayedItemsCount = ref(itemsPerLoad)
const isLoadingMore = ref(false)
let scrollTimeout = null

// Reset displayed items when filtered media changes
watch(
  () => filteredMedia.value.length,
  () => {
    displayedItemsCount.value = itemsPerLoad
  }
)

// Displayed media (scroll-to-load)
const paginatedMedia = computed(() => {
  return filteredMedia.value.slice(0, displayedItemsCount.value)
})

// Check if there are more items to load
const hasMoreItems = computed(() => {
  return displayedItemsCount.value < filteredMedia.value.length
})

// Load more items on scroll
const loadMoreItems = () => {
  if (isLoadingMore.value || !hasMoreItems.value) return
  
  isLoadingMore.value = true
  
  // Smooth animation delay
  requestAnimationFrame(() => {
    setTimeout(() => {
      displayedItemsCount.value = Math.min(
        displayedItemsCount.value + itemsPerLoad,
        filteredMedia.value.length
      )
      isLoadingMore.value = false
    }, 300)
  })
}

// Throttled scroll handler for infinite scroll
const handleScroll = () => {
  // Update back to top button visibility
  showBackToTop.value = window.scrollY > 400
  
  // Throttle scroll events for better performance
  if (scrollTimeout) return
  scrollTimeout = setTimeout(() => {
    scrollTimeout = null
  }, 100)
  
  // Check if near bottom (within 500px)
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  if (scrollTop + windowHeight >= documentHeight - 500) {
    loadMoreItems()
  }
}

// Fetch media for active set when tab changes
const fetchMediaForActiveSet = async () => {
  if (props.previewMode) return // Don't fetch in preview mode
  
  if (!activeTab.value || !collectionId.value) {
    media.value = []
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true

    // Load media for the specific set
    const collectionSets = collection.value?.mediaSets || []
    // Handle case where activeTab might be an ID instead of a name
    let matchingSet = collectionSets.find(set => set.name === activeTab.value)
    
    // If not found by name, try to find by ID (in case activeTab was incorrectly set to an ID)
    if (!matchingSet && (typeof activeTab.value === 'number' || /^\d+$/.test(String(activeTab.value)))) {
      matchingSet = collectionSets.find(set => String(set.id) === String(activeTab.value))
      // If found by ID, update activeTab to the correct name
      if (matchingSet) {
        activeTab.value = matchingSet.name
      }
    }
    
    if (!matchingSet) {
      // If still no match, reset to first available tab
      if (collectionSets.length > 0) {
        activeTab.value = collectionSets[0].name
        matchingSet = collectionSets[0]
      } else {
        media.value = []
        isLoading.value = false
        return
      }
    }

    // Use public API endpoint for public collections
    const isPublicCollection = props.previewMode === 'public' || !userStore.isAuthenticated
    let setMediaData
    
    if (isPublicCollection) {
      // Use public API endpoint
      const userEmail = localStorage.getItem(`collection_${collectionId.value}_email`) 
        || localStorage.getItem(`collection_email_${collectionId.value}`)
      const headers = {}
      
      if (userEmail) {
        headers['X-Collection-Email'] = userEmail
      }
      
      // Include client token if verified
      if (props.isClientVerified) {
        const stored = localStorage.getItem(`collection_${collectionId.value}_client_verified`)
        if (stored) {
          try {
            const data = JSON.parse(stored)
            if (data.token) {
              headers['X-Guest-Token'] = data.token
              headers['Authorization'] = `Bearer ${data.token}`
            }
            if (data.email) {
              headers['X-Collection-Email'] = data.email
            }
          } catch (e) {
            // Invalid data
          }
        }
      }
      
      const response = await apiClient.get(
        `/v1/public/collections/${collectionId.value}/sets/${matchingSet.id}/media`,
        { headers }
      )
      // Public API returns { data: { data: [...], ... }, ... }
      setMediaData = response.data?.data || response.data || { data: [] }
    } else {
      // Use authenticated endpoint
      setMediaData = await collectionsApi.fetchSetMedia(collectionId.value, matchingSet.id, {
        perPage: 100,
      })
    }
    // Handle both paginated response { data: [...], pagination: {...} } and direct array
    const mediaItems = Array.isArray(setMediaData?.data) 
      ? setMediaData.data 
      : (Array.isArray(setMediaData) ? setMediaData : [])
    
    // Set media for this set - normalize URL properties
    media.value = mediaItems.map(item => ({
      ...item,
      setId: matchingSet.id,
      setName: matchingSet.name,
      mediaSet: item.mediaSet || { id: matchingSet.id, name: matchingSet.name },
      // Normalize thumbnail and url properties for template
      thumbnail: item.thumbnailUrl || item.thumbnail || item.file?.thumbnailUrl || item.file?.url,
      url: item.largeImageUrl || item.url || item.file?.url || item.thumbnailUrl,
      // Use isStarred from backend response (synced with collection favourites)
      isStarred: item.isStarred || false,
    }))
  } catch (error) {
    media.value = []
  } finally {
    isLoading.value = false
  }
}

// Reset displayed items and load media when tab changes
watch(activeTab, async (newTab, oldTab) => {
  // Skip during initial load - onMounted handles initial fetch
  if (isInitialLoad) return
  if (!newTab || newTab === oldTab) return
  if (!collectionId.value) return // Don't fetch if collection not loaded yet
  displayedItemsCount.value = itemsPerLoad
  await fetchMediaForActiveSet()
}, { immediate: false })

// Reset activeTab to first available tab if current tab is no longer available
watch(tabs, async (newTabs) => {
  // Skip during initial load - onMounted handles initial setup
  if (isInitialLoad) return
  
  // Check if activeTab is a valid tab name
  const isValidTab = activeTab.value && newTabs.includes(activeTab.value)
  
  // Also check if activeTab is a numeric ID (shouldn't happen, but handle it)
  if (activeTab.value && !isValidTab && (typeof activeTab.value === 'number' || /^\d+$/.test(String(activeTab.value)))) {
    // Try to find matching set by ID and convert to name
    const collectionSets = collection.value?.mediaSets || []
    const matchingSet = collectionSets.find(s => String(s.id) === String(activeTab.value))
    if (matchingSet && newTabs.includes(matchingSet.name)) {
      activeTab.value = matchingSet.name
      return
    }
  }
  
  if (newTabs.length > 0 && activeTab.value && !isValidTab) {
    // Set to first set if current tab is no longer available
    activeTab.value = newTabs[0]
    if (!props.previewMode) {
      const collectionSets = collection.value?.mediaSets || []
      const matchingSet = collectionSets.find(s => s.name === newTabs[0])
      router.replace({
        query: {
          ...route.query,
          setId: matchingSet?.id || undefined,
          set: newTabs[0],
        },
      })
    }
    // Fetch media for the new active tab
    if (collectionId.value && !props.previewMode) {
      await fetchMediaForActiveSet()
    }
  }
}, { immediate: false })

// Watch route query for setId changes (browser back/forward)
watch(
  () => route.query.setId,
  async (setIdFromQuery) => {
    if (isInitialLoad || props.previewMode) return
    if (!setIdFromQuery) return
    
    const collectionSets = collection.value?.mediaSets || []
    const matchingSet = collectionSets.find(s => String(s.id) === String(setIdFromQuery))
    if (matchingSet && activeTab.value !== matchingSet.name) {
      isUpdatingFromRoute = true
      activeTab.value = matchingSet.name
      await fetchMediaForActiveSet()
      isUpdatingFromRoute = false
    } else if (!matchingSet && collectionSets.length > 0) {
      // If setId doesn't match any set, reset to first available tab
      activeTab.value = collectionSets[0].name
      await fetchMediaForActiveSet()
    }
  }
)

// Watch route query for set name changes (browser back/forward)
watch(
  () => route.query.set,
  async (setFromQuery) => {
    if (isInitialLoad || props.previewMode) return
    if (!setFromQuery) return
    
    const collectionSets = collection.value?.mediaSets || []
    if (collectionSets.some(s => s.name === setFromQuery) && activeTab.value !== setFromQuery) {
      isUpdatingFromRoute = true
      activeTab.value = setFromQuery
      await fetchMediaForActiveSet()
      isUpdatingFromRoute = false
    }
  }
)

// Methods
const handleTabClick = (tab) => {
  if (isUpdatingFromRoute) return
  activeTab.value = tab
  if (props.previewMode) {
    // In preview mode, emit tab change event
    const collectionSets = collection.value?.mediaSets || []
    const matchingSet = collectionSets.find(s => s.name === tab)
    emit('tab-change', { tab, setId: matchingSet?.id })
  } else if (collectionId.value) {
    const collectionSets = collection.value?.mediaSets || []
    const matchingSet = collectionSets.find(s => s.name === tab)
    router.replace({
      query: {
        ...route.query,
        setId: matchingSet?.id || undefined,
        set: tab,
      },
    })
  }
}

const scrollToGallery = () => {
  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const openMediaViewer = item => {
  if (!item) return
  selectedMedia.value = item
  const index = filteredMedia.value.findIndex(m => m.id === item.id)
  currentMediaIndex.value = index >= 0 ? index : 0
  autoStartSlideshow.value = false
  showMediaViewer.value = true
}

const openMediaViewerById = (mediaId) => {
  if (!mediaId) return
  
  // Convert mediaId to string for comparison
  const mediaIdStr = String(mediaId)
  
  // Helper function to find media by ID
  const findMedia = (mediaArray) => {
    return mediaArray.find(m => {
      const id = String(m.id || m.uuid || '')
      return id === mediaIdStr
    })
  }
  
  // Try to find in filteredMedia first
  let item = findMedia(filteredMedia.value)
  
  // If not found in filteredMedia, try in all media (including props.previewMedia)
  if (!item) {
    const mediaToSearch = props.previewMode && props.previewMedia ? props.previewMedia : media.value
    if (mediaToSearch && Array.isArray(mediaToSearch)) {
      item = findMedia(mediaToSearch)
    }
  }
  
  if (item) {
    // Find the index in filteredMedia for correct positioning
    const index = filteredMedia.value.findIndex(m => {
      const id = String(m.id || m.uuid || '')
      return id === mediaIdStr
    })
    if (index >= 0) {
      currentMediaIndex.value = index
    } else {
      // If not in filteredMedia, find in all media and set index to 0
      currentMediaIndex.value = 0
    }
    openMediaViewer(item)
  } else {
    // If media not found yet, wait a bit and retry (media might still be loading)
    setTimeout(() => {
      let retryItem = findMedia(filteredMedia.value)
      if (!retryItem) {
        const mediaToSearch = props.previewMode && props.previewMedia ? props.previewMedia : media.value
        if (mediaToSearch && Array.isArray(mediaToSearch)) {
          retryItem = findMedia(mediaToSearch)
        }
      }
      if (retryItem) {
        const index = filteredMedia.value.findIndex(m => {
          const id = String(m.id || m.uuid || '')
          return id === mediaIdStr
        })
        if (index >= 0) {
          currentMediaIndex.value = index
        } else {
          currentMediaIndex.value = 0
        }
        openMediaViewer(retryItem)
      }
    }, 500)
  }
}

const closeMediaViewer = () => {
  showMediaViewer.value = false
  selectedMedia.value = null
  autoStartSlideshow.value = false
  
  // If in public mode and mediaId exists in route, remove it
  if (props.previewMode === 'public' && route.query.mediaId) {
    const query = { ...route.query }
    delete query.mediaId
    router.replace({ query })
  }
}

const handlePlaySlideshow = () => {
  if (filteredMedia.value.length === 0) return
  
  // Open lightbox with first item and auto-start slideshow
  currentMediaIndex.value = 0
  autoStartSlideshow.value = true
  showMediaViewer.value = true
}

const handleDownloadMedia = async item => {
  if (props.disableActions) return
  
  // Emit download event to parent - let parent handle it (especially for public collections with guest tokens)
  emit('download', item)
  
  // Fallback: if no parent handler, use full-quality URL for download
  if (!props.previewMode) {
    const { getMediaDownloadUrl } = await import('@/domains/memora/utils/media/getMediaPreviewUrl')
    const downloadUrl = getMediaDownloadUrl(item)
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = item.title || item.filename || 'media'
      link.click()
    }
  }
}

const handleDownloadAll = () => {
  // For public collections, navigate to download page
  if (props.previewMode === 'public') {
    const collectionToUse = props.previewCollection || collection.value
    if (!collectionToUse) return
    
    const collectionId = collectionToUse.id || collectionToUse.uuid
    const projectId = collectionToUse.projectId || collectionToUse.project_uuid || route.params.projectId || 'standalone'
    
    router.push({
      name: 'clientCollectionDownload',
      params: { projectId },
      query: {
        collectionId,
        ...route.query,
      },
    })
    return
  }
  
  // For non-public collections, download all media items
  if (filteredMedia.value && filteredMedia.value.length > 0) {
    filteredMedia.value.forEach(item => {
      emit('download', item)
    })
  }
}

const handleShareMedia = async (item) => {
  if (props.disableActions) return
  if (!item || !item.id) {
    console.warn('handleShareMedia: No item or item.id', item)
    return
  }
  
  try {
    // Build share URL with media ID parameter
    const baseUrl = window.location.origin
    
    // Get collection ID - check multiple sources
    let collectionId = null
    
    // First, check collection object (works for both public and non-public)
    const collectionToUse = props.previewMode && props.previewCollection ? props.previewCollection : collection.value
    collectionId = collectionToUse?.id || collectionToUse?.uuid
    
    // If not found, check route query (for public mode)
    if (!collectionId && props.previewMode === 'public') {
      collectionId = route.query.collectionId
    }
    
    // If still not found, check route params (for non-public mode)
    if (!collectionId && !props.previewMode) {
      const computedCollectionId = collectionId.value
      collectionId = route.params.id || computedCollectionId
    }
    
    // Get project ID
    let projectId = collectionToUse?.projectId || collectionToUse?.project_uuid
    if (!projectId) {
      projectId = route.params.projectId || 'standalone'
    }
    
    if (!collectionId) {
      console.error('Collection ID not found', {
        previewMode: props.previewMode,
        previewCollection: props.previewCollection,
        collection: collection.value,
        routeQuery: route.query,
        routeParams: route.params,
      })
      toast.error('Collection ID not found')
      return
    }
    
    const shareUrl = `${baseUrl}/p/${projectId}/collection?collectionId=${collectionId}&mediaId=${item.id}`
    console.log('Sharing URL:', shareUrl)
    
    // Use browser's native share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: item?.title || collectionName.value || 'Media',
          text: `Check out this media from ${collectionName.value || 'this collection'}`,
          url: shareUrl,
        })
        // Track share link click (only in public mode)
        if (props.previewMode === 'public' && collectionId) {
          try {
            const { useCollectionsApi } = await import('@/domains/memora/api/collections')
            const { trackShareLinkClick } = useCollectionsApi()
            await trackShareLinkClick(collectionId, null, shareUrl)
          } catch (err) {
            console.warn('Failed to track share link click:', err)
          }
        }
        
        toast.success('Shared successfully', {
          description: 'The link has been shared.',
        })
        return
      } catch (shareError) {
        // User cancelled - don't show error
        if (shareError.name === 'AbortError') {
          return
        }
        // Share failed, fall through to clipboard
        console.warn('Share API failed, falling back to clipboard:', shareError)
      }
    }
    
    // Fallback to clipboard
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl)
          console.log('Clipboard API: Success')
          
          // Track share link click (only in public mode)
          if (props.previewMode === 'public' && collectionId) {
            try {
              const { useCollectionsApi } = await import('@/domains/memora/api/collections')
              const { trackShareLinkClick } = useCollectionsApi()
              await trackShareLinkClick(collectionId, null, shareUrl)
            } catch (err) {
              console.warn('Failed to track share link click:', err)
            }
          }
          
          toast.success('Link copied to clipboard', {
            description: 'The share link has been copied to your clipboard.',
            duration: 3000,
          })
          return
        } catch (clipError) {
          console.warn('Clipboard API failed, trying fallback:', clipError)
          // Fall through to execCommand fallback
        }
      }
      
      // Fallback for older browsers or when clipboard API fails
      console.log('Using execCommand fallback')
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      textArea.style.position = 'fixed'
      textArea.style.left = '0'
      textArea.style.top = '0'
      textArea.style.width = '1px'
      textArea.style.height = '1px'
      textArea.style.padding = '0'
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'
      textArea.style.opacity = '0'
      textArea.style.zIndex = '-9999'
      
      document.body.appendChild(textArea)
      textArea.focus()
      
      // Select the text
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        // iOS requires a different approach
        const range = document.createRange()
        range.selectNodeContents(textArea)
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        textArea.setSelectionRange(0, shareUrl.length)
      } else {
        textArea.select()
        textArea.setSelectionRange(0, shareUrl.length)
      }
      
      // Try to copy
      let successful = false
      try {
        successful = document.execCommand('copy')
        console.log('execCommand result:', successful)
      } catch (e) {
        console.error('execCommand error:', e)
      }
      
      document.body.removeChild(textArea)
      
      if (successful) {
        // Track share link click (only in public mode)
        if (props.previewMode === 'public' && collectionId) {
          try {
            const { useCollectionsApi } = await import('@/domains/memora/api/collections')
            const { trackShareLinkClick } = useCollectionsApi()
            await trackShareLinkClick(collectionId, null, shareUrl)
          } catch (err) {
            console.warn('Failed to track share link click:', err)
          }
        }
        
        toast.success('Link copied to clipboard', {
          description: 'The share link has been copied to your clipboard.',
          duration: 3000,
        })
      } else {
        throw new Error('execCommand copy returned false')
      }
    } catch (clipboardError) {
      console.error('Clipboard copy failed:', clipboardError)
      // If clipboard fails, show the URL in a toast
      toast.error('Failed to copy to clipboard', {
        description: `Please copy this link manually: ${shareUrl}`,
        duration: 10000,
      })
    }
  } catch (error) {
    console.error('Share error:', error)
    // Use exact backend error message
    const errorMessage = error?.message || error?.response?.data?.message || 'Failed to share'
    toast.error(errorMessage)
  }
}

const handleViewDetails = item => {
  // Open media viewer for viewing details
  openMediaViewer(item)
}

// Get collection theme color (prioritize collection color, then use palette primary)
const collectionColor = computed(() => {
  return collection.value?.color || primaryColor.value || '#3B82F6' // Default blue-500
})

// Convert hex to RGB
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 59, g: 130, b: 246 } // fallback to blue
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

// Calculate brightness to determine if dark mode
const getColorBrightness = hex => {
  const rgb = hexToRgb(hex)
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

// Get gradient background style for fallback (when no cover photo)
// Uses color palette for richer, more sophisticated gradients
const getCollectionGradientStyle = () => {
  const primary = primaryColor.value
  const secondary = secondaryColor.value
  const bgColor = backgroundColor.value
  const isDark = getColorBrightness(bgColor) < 128
  
  if (isDark) {
    // Dark mode: use primary and secondary colors for richer gradient
    const top = darkenColor(primary, 0.2)
    const mid = darkenColor(secondary, 0.4)
    const bottom = darkenColor(primary, 0.6)
    return {
      background: `linear-gradient(to bottom, ${top}, ${mid}, ${bottom})`,
    }
  } else {
    // Light mode: blend primary and secondary for softer, elegant gradient
    const top = lightenColor(primary, 0.9)
    const mid = lightenColor(secondary, 0.6)
    const bottom = lightenColor(primary, 0.3)
    return {
      background: `linear-gradient(to bottom, ${top}, ${mid}, ${bottom})`,
    }
  }
}

const handleImageError = (event) => {
  // Hide image if it fails to load
  if (event.target) {
    event.target.style.display = 'none'
  }
}

const getSetIdForTab = tabName => {
  if (!tabName) return null
  
  // If tabName is a number (ID), try to find set by ID first
  if (typeof tabName === 'number' || (typeof tabName === 'string' && /^\d+$/.test(tabName))) {
    const collectionToUse = props.previewMode && props.previewCollection ? props.previewCollection : collection.value
    const collectionSets = collectionToUse?.mediaSets || []
    const matchingSetById = collectionSets.find(set => String(set.id) === String(tabName))
    if (matchingSetById) {
      return matchingSetById.id
    }
    // If not found by ID, return null (invalid tab)
    return null
  }
  
  // Normal case: tabName is a set name (string)
  const collectionToUse = props.previewMode && props.previewCollection ? props.previewCollection : collection.value
  const collectionSets = collectionToUse?.mediaSets || []
  const matchingSet = collectionSets.find(set => set.name === tabName)
  return matchingSet?.id || null
}

const getMediaCountForTab = tabName => {
  if (!tabName) return 0
  const collectionToUse = props.previewMode && props.previewCollection ? props.previewCollection : collection.value
  const collectionSets = collectionToUse?.mediaSets || []
  const matchingSet = collectionSets.find(set => set.name === tabName)
  if (!matchingSet) return 0
  // Return count from MediaSetResource (backend returns 'count' property)
  // Default to 0 if count is undefined, null, or not a number
  const count = matchingSet.count ?? matchingSet.mediaCount ?? matchingSet.media_count
  return typeof count === 'number' ? count : 0
}


const handleFavoriteMedia = async (event) => {
  // MediaLightbox emits { item, isFavorite }, MediaCard emits just the item
  const item = event?.item || event
  if (!item?.id) return
  
  if (props.disableActions) {
    toast.info('Actions are disabled in preview mode')
    return
  }

  const collectionToUse = props.previewMode && props.previewCollection ? props.previewCollection : collection.value
  const favoritePhotosEnabled = collectionToUse?.favoritePhotos !== false
  const favoriteNotesEnabled = collectionToUse?.favoriteNotes !== false

  if (!favoritePhotosEnabled) {
    toast.info('Favorites are disabled for this collection')
    return
  }

  // Check if event is from MediaLightbox (has both item and isFavorite properties)
  const isFromLightbox = event?.item !== undefined && event?.isFavorite !== undefined

  // If from MediaLightbox, call API directly without modal
  if (isFromLightbox) {
    const currentStarred = item.isStarred || false
    const newStarredStatus = !currentStarred
    await saveFavorite(item, newStarredStatus, null)
    return
  }

  // If from MediaCard, show modal if notes enabled
  const currentStarred = item.isStarred || false
  const newStarredStatus = !currentStarred

  // If unfavoriting, proceed directly
  if (!newStarredStatus) {
    await saveFavorite(item, false, null)
    return
  }

  // If favoriting and notes are enabled, show modal
  if (favoriteNotesEnabled && newStarredStatus) {
    pendingFavoriteItem.value = item
    favoriteNote.value = ''
    showFavoriteNoteModal.value = true
    return
  }

  // If favoriting without notes, proceed directly
  await saveFavorite(item, newStarredStatus, null)
}

const handleCancelFavoriteNote = () => {
  showFavoriteNoteModal.value = false
  pendingFavoriteItem.value = null
  favoriteNote.value = ''
}

const handleConfirmFavoriteNote = async () => {
  if (!pendingFavoriteItem.value) return
  
  const note = favoriteNote.value.trim() || null
  await saveFavorite(pendingFavoriteItem.value, true, note)
  
  showFavoriteNoteModal.value = false
  pendingFavoriteItem.value = null
  favoriteNote.value = ''
}

const allItemsFavourited = computed(() => {
  if (!media.value || media.value.length === 0) return false
  return media.value.every(item => item.isStarred === true)
})

const handleFavoriteAll = async () => {
  if (!media.value || media.value.length === 0) return
  
  if (props.disableActions) {
    toast.info('Actions are disabled in preview mode')
    return
  }

  const collectionToUse = props.previewMode && props.previewCollection ? props.previewCollection : collection.value
  const favoritePhotosEnabled = collectionToUse?.favoritePhotos !== false

  if (!favoritePhotosEnabled) {
    toast.info('Favorites are disabled for this collection')
    return
  }

  // Find items that are not favourited (use a snapshot to avoid race conditions)
  const notFavouritedItems = media.value.filter(item => !item.isStarred)
  
  // If all are favourited, unfavourite all
  if (notFavouritedItems.length === 0) {
    isFavoritingAll.value = true
    try {
      const promises = media.value.map(item => saveFavorite(item, false, null, true))
      const results = await Promise.allSettled(promises)
      const failed = results.filter(r => r.status === 'rejected').length
      const succeeded = results.length - failed
      
      if (failed > 0) {
        toast.error(`Failed to update ${failed} items. ${succeeded} items updated.`)
      } else {
        toast.success(`Removed ${media.value.length} items from favorites`)
      }
    } catch (error) {
      toast.error('Failed to update favorites')
    } finally {
      isFavoritingAll.value = false
    }
    return
  }

  // Only favourite items that aren't already favourited (don't touch already favourited ones)
  isFavoritingAll.value = true
  try {
    const promises = notFavouritedItems.map(item => saveFavorite(item, true, null, true))
    const results = await Promise.allSettled(promises)
    const failed = results.filter(r => r.status === 'rejected').length
    const succeeded = results.length - failed
    
    if (failed > 0) {
      toast.error(`Failed to update ${failed} items. ${succeeded} items added to favorites.`)
    } else {
      toast.success(`Added ${notFavouritedItems.length} items to favorites`)
    }
  } catch (error) {
    toast.error('Failed to update favorites')
  } finally {
    isFavoritingAll.value = false
  }
}

const saveFavorite = async (item, isFavorite, note, suppressToast = false) => {
  if (props.disableActions) {
    if (!suppressToast) {
      toast.info('Actions are disabled in preview mode')
    }
    return
  }
  
  const currentStarred = item.isStarred || false

  // Use public API endpoint for both authenticated and unauthenticated users
  if (collection.value?.id) {
    const collectionId = collection.value.id || collection.value.uuid
    const payload = {}
    
    // Always include note (even if null) - backend will handle validation
    payload.note = note !== undefined && note !== null ? note : null
    
    // Get email and client token - check both localStorage key formats, then authenticated user email
    const headers = {}
    let userEmail = localStorage.getItem(`collection_${collectionId}_email`) 
      || localStorage.getItem(`collection_email_${collectionId}`)
    
    if (!userEmail || userEmail.trim() === '') {
      if (userStore.isAuthenticated && userStore.user?.email) {
        userEmail = userStore.user.email
      }
    }
    
    // Get client token if available (for client mode)
    const stored = localStorage.getItem(`collection_${collectionId}_client_verified`)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.token) {
          headers['X-Guest-Token'] = data.token
          headers['Authorization'] = `Bearer ${data.token}`
        }
        // Use email from client verification if available
        if (data.email && (!userEmail || userEmail.trim() === '')) {
          userEmail = data.email
        }
      } catch (e) {
        // Invalid data
      }
    }
    
    // Email is required for favoriting
    if (!userEmail || userEmail.trim() === '') {
      if (!suppressToast) {
        toast.error('Email is required to favorite media. Please provide your email.')
      }
      return
    }
    
    // Optimistic update
    const mediaItem = media.value.find(m => m.id === item.id)
    if (mediaItem) {
      mediaItem.isStarred = isFavorite
    }
    if (item) {
      item.isStarred = isFavorite
    }
    
    try {
      // Always send email in body (header may be stripped by CORS/middleware)
      payload.email = userEmail.trim()
      headers['X-Collection-Email'] = userEmail.trim()
      
      const response = await apiClient.post(
        `/v1/public/collections/${collectionId}/media/${item.id}/favourite`,
        payload,
        { headers }
      )
      
      const result = response.data?.data || response.data
      const serverFavouritedStatus = result?.favourited ?? isFavorite
      
      // Update with server response
      if (mediaItem) {
        mediaItem.isStarred = serverFavouritedStatus
      }
      if (item) {
        item.isStarred = serverFavouritedStatus
      }
      
      if (!suppressToast) {
        toast.success(serverFavouritedStatus ? 'Added to favorites' : 'Removed from favorites')
      }
    } catch (error) {
      // Revert on error
      if (mediaItem) mediaItem.isStarred = currentStarred
      if (item) item.isStarred = currentStarred
      if (!suppressToast) {
        const errorMessage = error?.message || error?.response?.data?.message || 'Failed to update favorite'
        toast.error(errorMessage)
      }
      throw error // Re-throw so Promise.all can catch it
    }
  }
}

const handleSlideshow = ({ playing }) => {
  // Handle slideshow state
}

const handleLogout = () => {
  emit('logout')
}

const handleToggleMediaPrivate = async (item) => {
  if (!item?.id || !collection.value?.id) return
  
  if (props.disableActions) {
    toast.info('Actions are disabled in preview mode')
    return
  }
  
  const collectionId = collection.value.id || collection.value.uuid
  const currentPrivateState = item.isPrivate || false
  const isPrivate = !currentPrivateState
  
  // Get email - check both localStorage key formats, then client verification, then authenticated user email
  let userEmail = localStorage.getItem(`collection_${collectionId}_email`) 
    || localStorage.getItem(`collection_email_${collectionId}`)
  
  if (!userEmail || userEmail.trim() === '') {
    if (userStore.isAuthenticated && userStore.user?.email) {
      userEmail = userStore.user.email
    }
  }
  
  // Get client token and email from client verification
  const headers = {}
  const stored = localStorage.getItem(`collection_${collectionId}_client_verified`)
  if (stored) {
    try {
      const data = JSON.parse(stored)
      if (data.token) {
        headers['X-Guest-Token'] = data.token
        headers['Authorization'] = `Bearer ${data.token}`
      }
      // Use email from client verification if available
      if (data.email && (!userEmail || userEmail.trim() === '')) {
        userEmail = data.email
      }
    } catch (e) {
      // Invalid data
    }
  }
  
  // Email is required for marking media as private
  if (!userEmail || userEmail.trim() === '') {
    toast.error('Email is required to mark media as private. Please provide your email.')
    return
  }
  
  try {
    // Optimistic update
    const mediaItem = media.value.find(m => m.id === item.id)
    if (mediaItem) {
      mediaItem.isPrivate = isPrivate
    }
    if (item) {
      item.isPrivate = isPrivate
    }
    
    // Always send email in body (header may be stripped by CORS/middleware)
    headers['X-Collection-Email'] = userEmail.trim()
    
    const response = await apiClient.post(
      `/v1/public/collections/${collectionId}/media/${item.id}/toggle-private`,
      { email: userEmail.trim() },
      { headers }
    )
    
    const updatedMedia = response.data?.data || response.data
    if (updatedMedia) {
      // Update with server response
      if (mediaItem) {
        mediaItem.isPrivate = updatedMedia.isPrivate ?? isPrivate
      }
      if (item) {
        item.isPrivate = updatedMedia.isPrivate ?? isPrivate
      }
    }
    
    toast.success(isPrivate ? 'Photo marked as private' : 'Photo unmarked as private')
  } catch (error) {
    // Revert on error
    const mediaItem = media.value.find(m => m.id === item.id)
    if (mediaItem) {
      mediaItem.isPrivate = !isPrivate
    }
    if (item) {
      item.isPrivate = !isPrivate
    }
    
    const errorMessage = error?.message || error?.response?.data?.message || 'Failed to update private status'
    toast.error(errorMessage)
  }
}

const getTabIcon = tab => {
  if (!tab) return Grid3x3

  // Get set object - check props.activeSet first (component mode), then collection
  let set = null
  if (props.previewMode && props.activeSet && props.activeSet.name === tab) {
    set = props.activeSet
  } else {
    set = collection.value?.mediaSets?.find(s => s.name === tab) || null
  }

  // Use the robust icon matcher
  return getSetIcon(tab, set)
}

// Watch for preview props changes - watch each prop separately for better reactivity
if (props.previewMode) {
  // Watch previewCollection
  watch(
    () => props.previewCollection,
    newCollection => {
      if (newCollection) {
        collection.value = newCollection
        // Check dismissed state when collection changes
        const key = getGalleryAssistDismissKey()
        if (key && typeof window !== 'undefined') {
          const dismissed = localStorage.getItem(key)
          isGalleryAssistDismissed.value = dismissed === 'true'
        }
      }
    },
    { immediate: true, deep: true }
  )

  // Watch previewMedia
  watch(
    () => props.previewMedia,
    newMedia => {
      if (newMedia) {
        media.value = newMedia
        isLoading.value = false
      }
    },
    { immediate: true, deep: true }
  )

  // Watch previewBranding
  watch(
    () => props.previewBranding,
    newBranding => {
      if (newBranding) {
        brandingLogoUrl.value = newBranding.logoUrl || null
        brandingName.value = newBranding.name || null
        showMazelootBranding.value = newBranding.showMazelootBranding ?? true
      }
    },
    { immediate: true, deep: true }
  )

  // Watch previewDesignConfig - computed properties will automatically update when props change
  // This deep watch ensures we detect nested property changes
  watch(
    () => props.previewDesignConfig,
    () => {
      // The computed properties (designConfig) will automatically update
      // This watcher ensures Vue tracks the prop deeply for reactivity
    },
    { immediate: false, deep: true }
  )
}

// Initialize download protection
const { cleanup: cleanupProtection } = useDownloadProtection({
  enabled: true,
  showWarnings: false,
})

// Load data (only if not in preview mode)
onMounted(async () => {
  // Setup scroll listener for scroll-to-load (works in both preview and normal mode)
  window.addEventListener('scroll', handleScroll)

  // Check if Gallery Assist was previously dismissed for this collection
  const key = getGalleryAssistDismissKey()
  if (key && typeof window !== 'undefined') {
    const dismissed = localStorage.getItem(key)
    if (dismissed === 'true') {
      isGalleryAssistDismissed.value = true
    }
  }

  if (props.previewMode) {
    // In preview mode, use provided props
    if (props.previewCollection) {
      collection.value = props.previewCollection
      // Set activeTab from route query or first set if available
      if (collection.value?.mediaSets && collection.value.mediaSets.length > 0 && !activeTab.value) {
        const setIdFromRoute = route.query.setId
        if (setIdFromRoute) {
          const matchingSet = collection.value.mediaSets.find(s => String(s.id) === String(setIdFromRoute))
          if (matchingSet) {
            activeTab.value = matchingSet.name
          } else {
            activeTab.value = collection.value.mediaSets[0].name
          }
        } else {
          activeTab.value = collection.value.mediaSets[0].name
        }
      }
    }
    if (props.previewMedia) {
      media.value = props.previewMedia
    }
    isLoading.value = false
    return
  }

  if (route.name === 'presetPreview') {
    const presetName = route.params.name
    const preset = presetName ? presetStore.getPresetByName(presetName) : null

    if (preset) {
      presetStore.setCurrentPreset(preset.id)
    }

    // Use mock data for preset preview with a good collection name
    collection.value = {
      id: 'mock-collection-id',
      name: 'Sample Collection',
      date: new Date().toISOString().split('T')[0],
      eventDate: new Date().toISOString().split('T')[0],
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      category: 'wedding',
    }

    // Generate mock media
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

    media.value = photoIds.map((id, index) => ({
      id: `mock-media-${id}`,
      collectionId: 'mock-collection-id',
      url: `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop`,
      thumbnail: `https://images.unsplash.com/photo-${id}?w=300&h=300&fit=crop`,
      type: 'image',
      title: `Photo ${index + 1}`,
      order: index,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    isLoading.value = false
    return
  }

  // Normal mode
  try {
    isLoading.value = true
    isInitialLoad = true

    // Fetch branding settings
    try {
      const settingsResponse = await fetchSettings()
      const settings = settingsResponse.data || settingsResponse
      brandingLogoUrl.value = settings.branding?.logoUrl || null
      brandingName.value = settings.branding?.name || null
      showMazelootBranding.value = settings.branding?.showMazelootBranding ?? true
    } catch (error) {
      // Silently fail - branding is optional
    }

    const collectionData = await collectionsApi.fetchCollection(collectionId.value)
    collection.value = collectionData

    // Check dismissed state when collection loads
    const key = getGalleryAssistDismissKey()
    if (key && typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(key)
      isGalleryAssistDismissed.value = dismissed === 'true'
    }

    const collectionSets = collectionData?.mediaSets || []

    // Set active tab from route query or default to first set
    if (collectionSets.length > 0) {
      // Check if setId is in route query and set it first (like SelectionDetail)
      if (route.query.setId) {
        const setIdFromRoute = route.query.setId
        const matchingSet = collectionSets.find(s => String(s.id) === String(setIdFromRoute))
        if (matchingSet) {
          activeTab.value = matchingSet.name
        }
      }
      
      // Fall back to set name in route query
      if (!activeTab.value) {
        const setFromQuery = route.query.set
        if (setFromQuery && collectionSets.some(s => s.name === setFromQuery)) {
          activeTab.value = setFromQuery
        }
      }
      
      // Default to first set if nothing found in route
      if (!activeTab.value) {
        activeTab.value = collectionSets[0].name
      }
      
      // Update route query if not already set (use setId if available, otherwise set name)
      if (!route.query.setId && !route.query.set && !props.previewMode) {
        const targetSet = collectionSets.find(s => s.name === activeTab.value)
        router.replace({
          query: {
            ...route.query,
            setId: targetSet?.id || undefined,
            set: activeTab.value,
          },
        })
      }
      
      // Wait for reactivity to update
      await nextTick()
      // Load media for the active set
      await fetchMediaForActiveSet()
    }

    // Allow store updates after initial load completes
    // Use a delay to ensure API data is fully processed and reactive updates settle
    setTimeout(() => {
      isInitialLoad = false
    }, 1000)
  } catch (error) {
    isInitialLoad = false
  } finally {
    isLoading.value = false
  }
})

// Cleanup scroll listener
onUnmounted(() => {
  cleanupProtection()
  window.removeEventListener('scroll', handleScroll)
})

// Watch store's collections array for real-time updates (preset/watermark/coverDesign changes)
// BUT: Skip during initial load to prevent overwriting API data
watch(
  () => galleryStore.collections,
  collections => {
    // Skip during initial load
    if (isInitialLoad) {
      return
    }

    if (!props.previewMode && collectionId.value && collection.value) {
      const updatedCollection = collections.find(c => c.id === collectionId.value)
      if (!updatedCollection || updatedCollection.id !== collection.value.id) {
        return
      }

      const existingCoverDesign = collection.value.coverDesign
      const storeCoverDesign = updatedCollection.coverDesign

      const storeHasValidCoverDesign =
        storeCoverDesign && storeCoverDesign.coverLayoutUuid

      const existingHasValidCoverDesign =
        existingCoverDesign &&
        existingCoverDesign.coverLayoutUuid

      // Only update if store has valid coverDesign (meaning it was just updated from Design view)
      // OR if neither has coverDesign (normal update for other properties)
      // BUT: Never overwrite existing valid coverDesign with empty store data
      if (storeHasValidCoverDesign) {
        // Store has valid coverDesign, use it (this is a real update from Design view)
        collection.value = { ...collection.value, ...updatedCollection }
      } else if (existingHasValidCoverDesign) {
        // Existing has valid coverDesign but store doesn't - preserve it and only update other fields
        collection.value = {
          ...collection.value,
          ...updatedCollection,
          coverDesign: existingCoverDesign, // Preserve API coverDesign
        }
      } else {
        // Neither has valid coverDesign, update normally
        collection.value = { ...collection.value, ...updatedCollection }
      }
      
      // If mediaSets were updated, refresh tabs and reload media for active set
      const storeMediaSets = updatedCollection.mediaSets
      if (storeMediaSets && Array.isArray(storeMediaSets) && storeMediaSets.length > 0) {
        // Check if active tab still exists
        const activeTabExists = storeMediaSets.some(set => set.name === activeTab.value)
        if (!activeTabExists && storeMediaSets.length > 0) {
          // Active tab no longer exists, switch to first set
          activeTab.value = storeMediaSets[0].name
        }
        // Reload media for the active set if it changed
        if (collectionId.value && !props.previewMode) {
          nextTick(() => {
            fetchMediaForActiveSet()
          })
        }
      }
    }
  },
  { deep: true }
)

// Expose method to open media by ID
defineExpose({
  openMediaViewerById,
})
</script>

<style scoped>
/* Fade-in animation for new items */
.fade-in-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-in-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-in-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

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
  transform: scale(0.95);
}

.card-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
