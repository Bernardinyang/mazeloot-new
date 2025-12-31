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
            Please enter your email address to access this proofing.
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
              Your email will be used to generate an access token for this proofing.
            </p>
          </div>
        </div>

        <DialogFooter class="mt-6">
          <Button
            :disabled="isGeneratingToken || !emailInput || !isValidEmail"
            :style="{
              backgroundColor: proofingColor,
            }"
            class="text-white"
            @click="handleSubmitEmail"
            @mouseenter="e => (e.target.style.backgroundColor = getProofingHoverColor())"
            @mouseleave="e => (e.target.style.backgroundColor = proofingColor)"
          >
            <Loader2 v-if="isGeneratingToken" class="h-4 w-4 mr-2 animate-spin" />
            {{ isGeneratingToken ? 'Generating Access...' : 'Continue' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Password Protection Modal -->
    <Dialog
      v-else-if="
        proofing &&
        proofing.hasPassword &&
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
            This proofing is password protected. Please enter the password to continue.
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
                'w-full transition-all',
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
              backgroundColor: proofingColor,
            }"
            class="text-white"
            @click="handleVerifyPassword"
            @mouseenter="e => (e.target.style.backgroundColor = getProofingHoverColor())"
            @mouseleave="e => (e.target.style.backgroundColor = proofingColor)"
          >
            <Loader2 v-if="isVerifyingPassword" class="h-4 w-4 mr-2 animate-spin" />
            {{ isVerifyingPassword ? 'Verifying...' : 'Continue' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Main Content -->
    <div v-else-if="proofing" class="min-h-screen">
      <!-- Hero Section with Cover Photo - Full Height -->
      <div class="relative w-full h-screen">
        <!-- Logo (Top Left) -->
        <div class="absolute top-4 left-4 md:top-6 md:left-6 z-20">
          <MazelootLogo
            :color-class="
              proofing.coverPhotoUrl || proofing.cover_photo_url || shouldUseLightText
                ? 'text-white'
                : undefined
            "
            :show-text="true"
            size="md"
          />
        </div>

        <!-- Theme Toggle (Top Right) -->
        <div class="absolute top-4 right-4 md:top-6 md:right-6 z-20">
          <ThemeToggle
            :contrast="!!(proofing.coverPhotoUrl || proofing.cover_photo_url || shouldUseLightText)"
          />
        </div>

        <!-- Cover Photo Background -->
        <div
          v-if="proofing.coverPhotoUrl || proofing.cover_photo_url"
          class="absolute inset-0 w-full h-full"
        >
          <!-- Cover Image -->
          <img
            v-if="!isVideoCover"
            :alt="proofing.name || 'Proofing Cover'"
            :src="proofing.coverPhotoUrl || proofing.cover_photo_url"
            :style="getProofingCoverStyle()"
            class="w-full h-full object-cover transition-all duration-500 dark:brightness-90 dark:contrast-105"
            @error="handleCoverImageError"
          />
          <!-- Cover Video -->
          <video
            v-else
            :src="proofing.coverPhotoUrl || proofing.cover_photo_url"
            :style="getProofingCoverStyle()"
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
          :style="getProofingGradientStyle()"
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
                  proofing.coverPhotoUrl || proofing.cover_photo_url || shouldUseLightText
                    ? 'text-white'
                    : 'text-gray-900 dark:text-gray-100',
                ]"
                class="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2 drop-shadow-lg"
              >
                {{ proofing.name || 'Proofing' }}
              </h1>
              <p
                v-if="proofing.description"
                :class="[
                  proofing.coverPhotoUrl || proofing.cover_photo_url || shouldUseLightText
                    ? 'text-white/90'
                    : 'text-gray-700 dark:text-gray-300',
                ]"
                class="text-base md:text-lg font-light tracking-normal drop-shadow-md max-w-2xl"
              >
                {{ proofing.description }}
              </p>
            </div>

            <!-- Action Button (Bottom Right) -->
            <div class="flex-shrink-0">
              <Button
                v-if="!isAuthenticatedOwner && !isPreviewMode"
                :class="[
                  proofing.coverPhotoUrl || proofing.cover_photo_url || shouldUseLightText
                    ? 'bg-white/90 hover:bg-white text-gray-900 border-white/20 shadow-lg hover:shadow-xl'
                    : 'bg-gray-900 hover:bg-gray-800 text-white border-gray-700 shadow-lg hover:shadow-xl',
                ]"
                class="px-6 py-3 text-sm md:text-base font-medium tracking-wider uppercase border backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
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
                  You are viewing this proofing in preview mode. All actions are disabled.
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- Instructions / Status -->
        <template v-else-if="proofing.status !== 'completed'">
          <div
            class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
          >
            <p class="text-sm text-blue-800 dark:text-blue-200">
              Click on media items to view and provide feedback. You can add comments and reply to
              existing feedback.
            </p>
          </div>
        </template>

        <!-- Completed Message -->
        <template v-else>
          <div
            class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <svg
                  class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"
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
                <div>
                  <p class="text-sm font-semibold text-green-800 dark:text-green-200">
                    Proofing has been completed. Thank you!
                  </p>
                  <p
                    v-if="getTotalMediaCount() > 0"
                    class="text-xs text-green-700 dark:text-green-300 mt-1"
                  >
                    {{ getTotalApprovedCount() }} of {{ getTotalMediaCount() }} media items approved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Sets as Tabs -->
        <div v-if="mediaSets.length > 0" class="mb-6">
          <div
            class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-700"
          >
            <button
              v-for="set in sortedMediaSets"
              :key="set.id"
              :class="[
                'px-4 py-2 rounded-t-lg font-medium text-sm transition-all relative',
                selectedSetId === set.id
                  ? 'bg-white dark:bg-gray-800 border-b-2'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
              ]"
              :style="
                selectedSetId === set.id
                  ? {
                      color: proofingColor,
                      borderColor: proofingColor,
                    }
                  : {}
              "
              @click="handleSelectSet(set.id)"
            >
              <div class="flex items-center gap-2">
                <span>{{ set.name }}</span>
                <!-- Combined stats badge -->
                <span
                  v-if="getSetApprovedCount(set.id) > 0 || getSetCommentCount(set.id) > 0"
                  :class="[
                    'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
                    selectedSetId === set.id
                      ? 'bg-opacity-20'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                  ]"
                  :style="
                    selectedSetId === set.id
                      ? {
                          backgroundColor: `${proofingColor}20`,
                          color: proofingColor,
                        }
                      : {}
                  "
                >
                  <!-- Approved count -->
                  <span
                    v-if="getSetApprovedCount(set.id) > 0"
                    class="inline-flex items-center gap-1"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{{ getSetApprovedCount(set.id) }} of {{ getSetMediaCount(set.id) }}</span>
                  </span>
                  <!-- Separator -->
                  <span
                    v-if="getSetApprovedCount(set.id) > 0 && getSetCommentCount(set.id) > 0"
                    class="opacity-50"
                  >
                    •
                  </span>
                  <!-- Comment count -->
                  <span
                    v-if="getSetCommentCount(set.id) > 0"
                    class="inline-flex items-center gap-1"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{{ getSetCommentCount(set.id) }}</span>
                  </span>
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Current Set Media -->
        <div v-if="currentMediaItems.length > 0" class="space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex items-center gap-4 flex-wrap">
                <p class="text-gray-700 dark:text-gray-300 font-medium">
                  {{ currentMediaItems.length }} media item{{
                    currentMediaItems.length !== 1 ? 's' : ''
                  }}
                </p>
                <!-- Combined stats -->
                <div
                  v-if="getTotalApprovedCount() > 0 || getTotalCommentCount() > 0"
                  class="flex items-center gap-3 text-sm"
                >
                  <!-- Approved count -->
                  <span
                    v-if="getTotalApprovedCount() > 0"
                    class="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{{ getTotalApprovedCount() }} of {{ getTotalMediaCount() }} approved</span>
                  </span>
                  <!-- Comment count -->
                  <span
                    v-if="getTotalCommentCount() > 0"
                    class="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{{ getTotalCommentCount() }} comment{{ getTotalCommentCount() !== 1 ? 's' : '' }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Complete Proofing Button -->
          <div
            v-if="
              allMediaApproved &&
              proofing?.status !== 'completed' &&
              !isAuthenticatedOwner &&
              !isPreviewMode &&
              guestToken
            "
            class="mb-6"
          >
            <div
              class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
            >
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="flex-shrink-0">
                    <svg
                      class="w-6 h-6 text-green-600 dark:text-green-400"
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
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-green-800 dark:text-green-200">
                      All media items approved!
                    </p>
                    <p class="text-xs text-green-700 dark:text-green-300 mt-0.5">
                      You can now complete this proofing.
                    </p>
                  </div>
                </div>
                <Button
                  :disabled="isCompletingProofing"
                  class="bg-green-600 hover:bg-green-700 text-white border-green-700"
                  @click="handleCompleteProofing"
                >
                  <span v-if="!isCompletingProofing">Complete Proofing</span>
                  <span v-else class="flex items-center gap-2">
                    <svg
                      class="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Completing...
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <!-- Media Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div
              v-for="item in currentMediaItems"
              :key="item.id"
              :class="[
                'relative rounded-lg overflow-hidden transition-all group',
                isAuthenticatedOwner || isPreviewMode
                  ? 'opacity-75 cursor-not-allowed'
                  : 'opacity-90 hover:opacity-100 hover:shadow-lg cursor-pointer',
                hasPendingClosureRequest(item)
                  ? 'ring-1 ring-amber-500 border-amber-500 bg-amber-50/20 dark:bg-amber-900/10 animate-pulse'
                  : '',
                hasPendingApprovalRequest(item)
                  ? 'ring-1 ring-blue-500 border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 animate-pulse'
                  : '',
                isRejected(item)
                  ? 'ring-2 ring-red-600 border border-red-600 bg-red-50/20 dark:bg-red-900/10'
                  : '',
                isReadyForRevision(item)
                  ? 'border-2 border-gray-600 dark:border-gray-700 scale-95'
                  : '',
                isRejected(item)
                  ? 'border border-red-600'
                  : isReadyForRevision(item)
                    ? ''
                    : 'border border-gray-200 dark:border-gray-700',
              ]"
              :title="
                hasPendingClosureRequest(item)
                  ? 'Closure request pending - Click clock icon to view'
                  : hasPendingApprovalRequest(item)
                    ? 'Approval request pending'
                    : ''
              "
            >
              <!-- Context Menu Button for Clients -->
              <div
                v-if="!isAuthenticatedOwner && !isPreviewMode"
                :class="[
                  'absolute top-2 right-2 transition-opacity duration-200 z-10',
                  getDropdownOpenState(item.id)
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100',
                ]"
                @click.stop
              >
                <DropdownMenu
                  :open="getDropdownOpenState(item.id)"
                  @update:open="val => setDropdownOpenState(item.id, val)"
                >
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
                      @click.stop="handleViewMedia(item, false)"
                    >
                      <Eye class="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      @click.stop="handleViewMedia(item, true)"
                    >
                      <MessageSquare class="h-4 w-4 mr-2" />
                      Comment
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-if="hasRevisions(item)"
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      @click.stop="handleViewRevisionHistory(item)"
                    >
                      <History class="h-4 w-4 mr-2" />
                      View Revisions
                    </DropdownMenuItem>
                    <div
                      v-if="!item?.isCompleted && !item?.is_completed"
                      :class="theme.borderSecondary"
                      class="h-px my-1"
                    ></div>
                    <DropdownMenuItem
                      v-if="!item?.isCompleted && !item?.is_completed && !isRejected(item)"
                      :class="[
                        'text-green-600 dark:text-green-400',
                        'hover:bg-green-50 dark:hover:bg-green-900/20',
                        'cursor-pointer',
                      ]"
                      @click.stop="handleApproveMedia(item)"
                    >
                      <CheckCircle2 class="h-4 w-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-if="isRejected(item)"
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      @click.stop="handleViewApprovalRequest(item)"
                    >
                      <History class="h-4 w-4 mr-2" />
                      View Approval Request
                    </DropdownMenuItem>
                    <div
                      v-if="
                        !item?.isCompleted &&
                        !item?.is_completed &&
                        getClosureRequestsForMedia(item) &&
                        getClosureRequestsForMedia(item).length > 0
                      "
                      :class="theme.borderSecondary"
                      class="h-px my-1"
                    ></div>
                    <DropdownMenuItem
                      v-if="
                        !item?.isCompleted &&
                        !item?.is_completed &&
                        getClosureRequestsForMedia(item) &&
                        getClosureRequestsForMedia(item).length > 0
                      "
                      :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                      @click.stop="handleViewClosureHistory(item)"
                    >
                      <History class="h-4 w-4 mr-2" />
                      View Closure History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <!-- Media container with overflow-hidden to prevent scale overflow -->
              <div
                :class="[
                  'w-full aspect-square overflow-hidden rounded-lg',
                  !isAuthenticatedOwner && !isPreviewMode
                    ? 'transition-transform duration-300 group-hover:scale-105'
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
                    !isAuthenticatedOwner && !isPreviewMode ? 'cursor-pointer' : 'cursor-default',
                    isReadyForRevision(item) ? 'opacity-50' : '',
                    isRejected(item) ? 'grayscale' : '',
                  ]"
                  @click="!isAuthenticatedOwner && !isPreviewMode && handleViewMedia(item, false)"
                />
                <video
                  v-else
                  :poster="item.thumbnailUrl || item.thumbnail"
                  :src="(item.file && item.file.url) || item.url"
                  :class="[
                    'w-full h-full object-cover',
                    !isAuthenticatedOwner && !isPreviewMode ? 'cursor-pointer' : 'cursor-default',
                  ]"
                  @click="!isAuthenticatedOwner && !isPreviewMode && handleViewMedia(item, false)"
                />
              </div>

              <!-- Badges Container (bottom-left) -->
              <div
                class="absolute bottom-2 left-2 flex flex-wrap items-center gap-2 max-w-[calc(100%-4rem)] z-30"
              >
                <!-- Approved Badge -->
                <div
                  v-if="item?.isCompleted || item?.is_completed"
                  class="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg flex items-center gap-1"
                >
                  <CheckCircle2 class="w-3 h-3 fill-white" />
                  Approved
                </div>
                <!-- Rejected Badge -->
                <div
                  v-if="isRejected(item)"
                  class="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg flex items-center gap-1 border border-red-600"
                >
                  <X class="w-3 h-3 fill-white" />
                  Rejected
                </div>
                <!-- Revision Number Badge -->
                <div
                  v-if="item?.revisionNumber || item?.revision_number"
                  class="px-2 py-1 rounded-full bg-purple-500/90 dark:bg-purple-600/90 backdrop-blur-sm shadow-lg border border-purple-400/50 flex items-center gap-1"
                  :title="`Revision ${item?.revisionNumber || item?.revision_number}`"
                >
                  <span class="text-xs font-semibold text-white"
                    >Rev {{ item?.revisionNumber || item?.revision_number }}</span
                  >
                </div>
                <!-- Ready for Revision Indicator -->
                <div
                  v-if="isReadyForRevision(item)"
                  class="p-1.5 rounded-md bg-gray-500/90 dark:bg-gray-600/90 backdrop-blur-sm shadow-lg border border-gray-400/50"
                  title="Ready for revision"
                >
                  <Upload class="h-3.5 w-3.5 text-white" />
                </div>
                <!-- Revision Indicator -->
                <div
                  v-if="hasRevisions(item)"
                  class="p-1.5 rounded-md bg-purple-500/90 dark:bg-purple-600/90 backdrop-blur-sm shadow-lg border border-purple-400/50"
                  title="Has revisions - Click menu to view revision history"
                >
                  <History class="h-3.5 w-3.5 text-white" />
                </div>
                <!-- Comment Count Badge -->
                <div
                  v-if="getItemCommentCount(item) > 0"
                  class="px-2 py-1 rounded-full bg-teal-500 text-white text-xs font-bold shadow-lg flex items-center gap-1"
                >
                  <MessageSquare class="w-3 h-3" />
                  {{ getItemCommentCount(item) }}
                </div>
                <!-- Pending Closure Request Indicator -->
                <button
                  v-if="hasPendingClosureRequest(item)"
                  class="p-1.5 rounded-md bg-amber-500/90 hover:bg-amber-600/90 backdrop-blur-sm transition-all duration-200 shadow-lg hover:scale-110 animate-pulse"
                  title="Closure request pending - Click to view"
                  @click.stop="handlePendingClosureClick(item)"
                >
                  <Clock class="h-3.5 w-3.5 text-white" />
                </button>
                <!-- Pending Approval Request Indicator -->
                <button
                  v-if="hasPendingApprovalRequest(item)"
                  class="p-1.5 rounded-md bg-blue-500/90 hover:bg-blue-600/90 backdrop-blur-sm transition-all duration-200 shadow-lg hover:scale-110 animate-pulse"
                  title="Approval request pending - Click to view"
                  @click.stop="handlePendingApprovalClick(item)"
                >
                  <Upload class="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No media available in this set</p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!proofing && !isLoading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-gray-500 dark:text-gray-400">Proofing not found</p>
      </div>
    </div>

    <!-- Approve Media Confirmation Dialog -->
    <Dialog :open="showApproveConfirm" @update:open="val => (showApproveConfirm = val)">
      <DialogContent class="sm:max-w-[425px] !z-[200] overlay-z-[200]">
        <DialogHeader>
          <DialogTitle>Approve Media</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this media? This marks it as good to go.
          </DialogDescription>
        </DialogHeader>
        <div class="py-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Once approved, this media will be marked as completed. Comments and feedback will no
            longer be allowed after approval.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            @click="showApproveConfirm = false"
            :disabled="isApprovingMedia"
          >
            Cancel
          </Button>
          <Button
            class="bg-green-500 hover:bg-green-600 text-white"
            @click="confirmApproveMedia"
            :disabled="isApprovingMedia"
          >
            <Loader2 v-if="isApprovingMedia" class="w-4 h-4 mr-2 animate-spin" />
            <CheckCircle2 v-else class="w-4 h-4 mr-2" />
            <span>{{ isApprovingMedia ? 'Approving...' : 'Approve Media' }}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- MediaCommentLightbox for commenting -->
    <MediaCommentLightbox
      v-if="useCommentLightbox"
      v-model="showMediaLightbox"
      :initial-index="previewMediaIndex"
      :items="currentMediaItems"
      :proofing-id="proofing?.id || proofing?.uuid"
      :set-id="selectedSetId"
      :project-id="route.params.projectId || null"
      :guest-token="guestToken"
      :guest-email="userEmail"
      :allowed-emails="proofing?.allowedEmails || proofing?.allowed_emails || []"
      :open-with-comments="openWithComments"
      :closure-requests-map="closureRequestsMap"
      :approval-requests-map="approvalRequestsMap"
      @close="showMediaLightbox = false"
      @comment-added="handleCommentAdded"
      @comment-updated="handleCommentUpdated"
      @comment-deleted="handleCommentDeleted"
      @media-approved="handleMediaApproved"
    />

    <!-- MediaLightbox for viewing only -->
    <MediaLightbox
      v-else
      v-model="showMediaLightbox"
      :initial-index="previewMediaIndex"
      :items="currentMediaItems"
      :proofing-id="proofing?.id || proofing?.uuid"
      :set-id="selectedSetId"
      :project-id="route.params.projectId || null"
      :guest-token="guestToken"
      :allow-comments="false"
      @close="showMediaLightbox = false"
      @open-comments="handleOpenCommentsFromLightbox"
    />

    <!-- Closure History Modal -->
    <ClosureHistoryModal
      v-model="showClosureHistoryModal"
      :closure-requests="closureHistoryData"
      :media-item="closureHistoryMediaItem"
    />

    <!-- Revision History Sidebar -->
    <RevisionHistorySidebar
      v-model="showRevisionHistorySidebar"
      :media-item="revisionHistoryMediaItem"
      :guest-token="guestToken"
      :max-revisions="proofing?.maxRevisions || proofing?.max_revisions || null"
      @revision-click="handleRevisionClick"
    />

    <!-- Revision Details Modal -->
    <RevisionDetailsModal
      v-model="showRevisionDetailsModal"
      :revision="selectedRevision"
      :media-item="revisionHistoryMediaItem"
      :guest-token="guestToken"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useRoute } from 'vue-router'
import {
  MessageSquare,
  Eye,
  Loader2,
  X,
  CheckCircle2,
  MoreVertical,
  History,
  Clock,
  Upload,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import MediaCommentLightbox from '@/components/organisms/MediaCommentLightbox.vue'
import MediaLightbox from '@/components/organisms/MediaLightbox.vue'
import ClosureHistoryModal from '@/components/organisms/ClosureHistoryModal.vue'
import RevisionHistorySidebar from '@/components/organisms/RevisionHistorySidebar.vue'
import RevisionDetailsModal from '@/components/organisms/RevisionDetailsModal.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import PasswordInput from '@/components/molecules/PasswordInput.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSelectionLimits } from '@/composables/useSelectionLimits'
import ThemeToggle from '@/components/organisms/ThemeToggle.vue'
import MazelootLogo from '@/components/atoms/MazelootLogo.vue'
import { useProofingStore } from '@/stores/proofing'
import { useProofingApi } from '@/api/proofing'
import { useMediaApi } from '@/api/media'
import { useUserStore } from '@/stores/user'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const themeStore = useThemeStore()
const route = useRoute()

const proofingStore = useProofingStore()
const proofingApi = useProofingApi()
const mediaApi = useMediaApi()
const userStore = useUserStore()

// State
const proofing = ref(null)
const mediaSets = ref([])
const mediaItems = ref([])
const selectedSetId = ref(null)
const isLoading = ref(true)
const isPasswordVerified = ref(false)
const passwordInput = ref('')
const isVerifyingPassword = ref(false)
const passwordError = ref('')
const guestToken = ref(null)
const isCompletingProofing = ref(false)
const showMediaLightbox = ref(false)
const previewMediaIndex = ref(0)
const openWithComments = ref(false)
const useCommentLightbox = ref(false) // true = MediaCommentLightbox, false = MediaLightbox

// Approval state
const showApproveConfirm = ref(false)
const isApprovingMedia = ref(false)
const mediaToApprove = ref(null)

// Dropdown states for each media item
const dropdownOpenStates = ref({})

// Closure request history state
const showClosureHistoryModal = ref(false)
const closureHistoryMediaItem = ref(null)
const closureHistoryData = ref([])
const closureRequestsMap = ref({})
const approvalRequestsMap = ref({})

// Revision history state
const showRevisionHistorySidebar = ref(false)
const revisionHistoryMediaItem = ref(null)
const showRevisionDetailsModal = ref(false)
const selectedRevision = ref(null)

const getDropdownOpenState = itemId => {
  return dropdownOpenStates.value[itemId] || false
}

const setDropdownOpenState = (itemId, value) => {
  dropdownOpenStates.value[itemId] = value
}

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

const filteredMediaItems = computed(() => {
  // For authenticated owners/preview mode, show all media
  if (isAuthenticatedOwner.value || isPreviewMode.value) {
    return mediaItems.value
  }

  // For public users, show only the latest revision for each original media
  const mediaMap = new Map()

  mediaItems.value.forEach(item => {
    // Determine the original media UUID (grouping key)
    // If item has originalMediaId, it's a revision - group by originalMediaId
    // If item doesn't have originalMediaId, it's the original - group by its own UUID
    const originalUuid = item.originalMediaId || item.original_media_uuid || item.id || item.uuid
    const revisionNumber = item.revisionNumber || item.revision_number || 0

    if (!mediaMap.has(originalUuid)) {
      mediaMap.set(originalUuid, item)
    } else {
      const existing = mediaMap.get(originalUuid)
      const existingRevision = existing.revisionNumber || existing.revision_number || 0

      // Keep the one with higher revision number
      if (revisionNumber > existingRevision) {
        mediaMap.set(originalUuid, item)
      }
    }
  })

  return Array.from(mediaMap.values())
})

const currentMediaItems = computed(() => {
  if (!selectedSetId.value) return []
  return filteredMediaItems.value.filter(
    item => (item.setId || item.media_set_uuid) === selectedSetId.value
  )
})

const getItemCommentCount = item => {
  if (!item.feedback || !Array.isArray(item.feedback)) return 0

  const countedIds = new Set()

  const countComments = commentList => {
    let count = 0
    for (const comment of commentList) {
      if (countedIds.has(comment.id)) {
        continue
      }

      count++
      countedIds.add(comment.id)

      if (comment.replies && comment.replies.length > 0) {
        count += countComments(comment.replies)
      }
    }
    return count
  }

  return countComments(item.feedback)
}

const getSetCommentCount = setId => {
  const setItems = mediaItems.value.filter(
    item => (item.setId || item.media_set_uuid) === setId
  )
  return setItems.reduce((total, item) => total + getItemCommentCount(item), 0)
}

// Get approved count for a set
const getSetApprovedCount = setId => {
  const setItems = filteredMediaItems.value.filter(
    item => (item.setId || item.media_set_uuid) === setId
  )
  return setItems.filter(item => {
    const isCompleted = item.isCompleted || item.is_completed
    return isCompleted === true || isCompleted === 1 || isCompleted === '1'
  }).length
}

// Get total media count for a set
const getSetMediaCount = setId => {
  const setItems = filteredMediaItems.value.filter(
    item => (item.setId || item.media_set_uuid) === setId
  )
  return setItems.length
}

const getTotalCommentCount = () => {
  return mediaItems.value.reduce((total, item) => total + getItemCommentCount(item), 0)
}

// Get total approved count from media items
const getTotalApprovedCount = () => {
  return filteredMediaItems.value.filter(item => {
    const isCompleted = item.isCompleted || item.is_completed
    return isCompleted === true || isCompleted === 1 || isCompleted === '1'
  }).length
}

// Get total media count
const getTotalMediaCount = () => {
  return filteredMediaItems.value.length
}

// Check if all media items are approved
const allMediaApproved = computed(() => {
  // Use filteredMediaItems to only count visible media (latest revisions)
  const items = filteredMediaItems.value
  if (!items || items.length === 0) return false
  return items.every(item => {
    const isCompleted = item.isCompleted || item.is_completed
    return isCompleted === true || isCompleted === 1 || isCompleted === '1'
  })
})
const handleCommentAdded = ({ mediaId, comment, allComments }) => {
  updateMediaItemFeedback(mediaId, allComments)
}

// Handle comment updated event
const handleCommentUpdated = ({ mediaId, commentId, comment, allComments }) => {
  updateMediaItemFeedback(mediaId, allComments)
}

// Handle comment deleted event
const handleCommentDeleted = ({ mediaId, commentId, allComments }) => {
  updateMediaItemFeedback(mediaId, allComments)
}

// Handle media approved event
const handleMediaApproved = updatedMedia => {
  if (!updatedMedia || !updatedMedia.id) return

  const mediaId = updatedMedia.id || updatedMedia.uuid
  const mediaItem = mediaItems.value.find(m => (m.id || m.uuid) === mediaId)
  if (!mediaItem) return

  const setId = mediaItem.setId || mediaItem.media_set_uuid

  // Update in mediaItems
  const mediaIndex = mediaItems.value.findIndex(m => (m.id || m.uuid) === mediaId)
  if (mediaIndex !== -1) {
    const wasCompleted = mediaItems.value[mediaIndex].isCompleted || mediaItems.value[mediaIndex].is_completed
    mediaItems.value[mediaIndex] = {
      ...mediaItems.value[mediaIndex],
      isCompleted: true,
      is_completed: true,
    }

    // Only update counts if media wasn't already completed
    if (!wasCompleted) {
      // Update set's approvedCount
      if (setId) {
        const setIndex = mediaSets.value.findIndex(s => s.id === setId)
        if (setIndex !== -1) {
          const currentApprovedCount = mediaSets.value[setIndex].approvedCount || 0
          mediaSets.value[setIndex] = {
            ...mediaSets.value[setIndex],
            approvedCount: currentApprovedCount + 1,
          }
        }
      }

      // Update proofing's completedCount
      if (proofing.value) {
        const currentCompletedCount = proofing.value.completedCount || 0
        proofing.value = {
          ...proofing.value,
          completedCount: currentCompletedCount + 1,
        }
      }
    }
  }

  // Update in sets if media is in a set (for nested structure)
  if (proofing.value?.sets) {
    for (const set of proofing.value.sets) {
      if (set.media && Array.isArray(set.media)) {
        const setMediaIndex = set.media.findIndex(m => (m.id || m.uuid) === mediaId)
        if (setMediaIndex !== -1) {
          const wasCompleted = set.media[setMediaIndex].isCompleted || set.media[setMediaIndex].is_completed
          set.media[setMediaIndex] = {
            ...set.media[setMediaIndex],
            isCompleted: true,
            is_completed: true,
          }
        }
      }
    }
  }
}

// Handle complete proofing
const handleCompleteProofing = async () => {
  if (!proofing.value || !guestToken.value || isCompletingProofing.value) return

  const proofingId = proofing.value.id || proofing.value.uuid
  if (!proofingId) {
    toast.error('Missing proofing information', {
      description: 'Unable to complete proofing. Please try again.',
    })
    return
  }

  isCompletingProofing.value = true

  try {
    const completedProofing = await proofingApi.completePublicProofing(proofingId, guestToken.value)

    if (completedProofing) {
      proofing.value = {
        ...proofing.value,
        ...completedProofing,
        status: 'completed',
      }

      toast.success('Proofing completed', {
        description: 'Thank you for completing the proofing!',
      })
    }
  } catch (error) {
    console.error('Failed to complete proofing', error)
    toast.error('Failed to complete proofing', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isCompletingProofing.value = false
  }
}

// Helper to update media item's feedback array
const updateMediaItemFeedback = (mediaId, feedback) => {
  // Update in mediaItems
  const mediaIndex = mediaItems.value.findIndex(m => (m.id || m.uuid) === mediaId)
  if (mediaIndex !== -1) {
    mediaItems.value[mediaIndex] = {
      ...mediaItems.value[mediaIndex],
      feedback: feedback || [],
    }
  }

  // Update in sets if media is in a set
  if (proofing.value?.sets) {
    proofing.value.sets.forEach(set => {
      if (set.media) {
        const setMediaIndex = set.media.findIndex(m => (m.id || m.uuid) === mediaId)
        if (setMediaIndex !== -1) {
          set.media[setMediaIndex] = {
            ...set.media[setMediaIndex],
            feedback: feedback || [],
          }
        }
      }
    })
  }
}

// Check if current user is the owner of the proofing
const isAuthenticatedOwner = computed(() => {
  if (!userStore.isAuthenticated || !proofing.value) {
    return false
  }
  // Check if the authenticated user is the owner
  const userUuid = proofing.value.userUuid || proofing.value.user_uuid
  const currentUserId = userStore.user?.id || userStore.user?.uuid
  return userUuid && currentUserId && userUuid === currentUserId
})

// Check if in preview mode (preview=true query param AND authenticated owner)
const isPreviewMode = computed(() => {
  return route.query.preview === 'true' && isAuthenticatedOwner.value
})

// Get proofing theme color (with fallback to amber-500)
const proofingColor = computed(() => {
  return proofing.value?.color || '#F59E0B' // Default amber-500
})

// Get proofing color styles for dynamic theming
const getProofingColorStyles = (type = 'bg') => {
  const color = proofingColor.value
  return {
    [type]: color,
  }
}

// Get hover color (slightly darker)
const getProofingHoverColor = () => {
  const color = proofingColor.value
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
    : { r: 245, g: 158, b: 11 } // fallback to amber
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
const getProofingGradientStyle = () => {
  const color = proofingColor.value
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
  if (proofing.value?.coverPhotoUrl || proofing.value?.cover_photo_url) {
    return true // Always use light text with cover photo
  }
  return getColorBrightness(proofingColor.value) < 128
})

// Email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailInput.value && emailRegex.test(emailInput.value)
})

// Get guest token from URL or localStorage
const getStoredGuestToken = proofingId => {
  // Check if guest token is in URL query
  const tokenFromUrl = route.query.guest_token || route.query.token
  if (tokenFromUrl) {
    guestToken.value = tokenFromUrl
    localStorage.setItem(`guest_token_proofing_${proofingId}`, tokenFromUrl)
    return tokenFromUrl
  }

  // Check if stored in localStorage
  const storedToken = localStorage.getItem(`guest_token_proofing_${proofingId}`)
  if (storedToken) {
    guestToken.value = storedToken
    return storedToken
  }

  return null
}

// Generate guest token with email
const generateGuestTokenWithEmail = async (proofingId, email) => {
  try {
    const tokenData = await proofingApi.generateProofingToken(proofingId, email)
    if (tokenData && tokenData.token) {
      guestToken.value = tokenData.token
      localStorage.setItem(`guest_token_proofing_${proofingId}`, tokenData.token)
      // Also store the email for reference
      localStorage.setItem(`guest_email_proofing_${proofingId}`, email)
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
    const proofingId = route.query.proofingId
    if (!proofingId) {
      throw new Error('Proofing ID not found')
    }

    // Try to generate token - this will validate against allowed emails on backend
    await generateGuestTokenWithEmail(proofingId, emailInput.value)
    showEmailModal.value = false
    emailInput.value = ''

    // Now load the proofing
    await loadProofing()
  } catch (error) {
    // Check if error is about email not being allowed
    const errorMessage = error?.message || ''
    if (
      errorMessage.toLowerCase().includes('not authorized') ||
      errorMessage.toLowerCase().includes('not in the allowed')
    ) {
      emailError.value =
        'This email is not authorized to access this proofing. Please contact the proofing owner.'
    } else {
      emailError.value = errorMessage || 'Failed to generate access token. Please try again.'
    }
  } finally {
    isGeneratingToken.value = false
  }
}

// Load proofing and media sets
const loadProofing = async () => {
  isLoading.value = true
  try {
    // Get proofing ID from query parameter (route is /p/:projectId/proofing?proofingId=...)
    const proofingId = route.query.proofingId

    if (!proofingId) {
      throw new Error('Proofing ID is required in the URL')
    }

    // STEP 1: IMMEDIATELY CHECK PROOFING STATUS
    // Use dedicated status endpoint to check if proofing is accessible
    let statusCheck = null
    const isPreview = route.query.preview === 'true'

    // If in preview mode, try to fetch proofing directly first (bypass status check)
    if (isPreview) {
      try {
        // Try to fetch proofing directly - if user is owner and authenticated, this will work
        const proofingData = await proofingApi.fetchProofing(proofingId)
        proofing.value = proofingData

        // Verify user is owner
        const userUuid = proofingData.userUuid || proofingData.user_uuid
        const currentUserId = userStore.user?.id || userStore.user?.uuid
        const isOwner =
          userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId

        if (isOwner) {
          // Owner in preview mode - skip password check
          if (proofingData.hasPassword) {
            isPasswordVerified.value = true
          }
          // Skip email modal for preview mode
          showEmailModal.value = false
          // Load media sets and items
          if (proofingData.mediaSets && proofingData.mediaSets.length > 0) {
            mediaSets.value = proofingData.mediaSets
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
        // Fall through to normal status check flow
      }
    }

    try {
      statusCheck = await proofingApi.checkProofingStatus(proofingId)

      // Validate response structure
      if (!statusCheck || typeof statusCheck !== 'object') {
        throw new Error('Invalid response from server')
      }

      // If preview mode and owner, allow access regardless of status
      if (isPreview && statusCheck.isOwner === true) {
        // Owner in preview mode - fetch full proofing data
        const proofingData = await proofingApi.fetchProofing(proofingId)
        proofing.value = proofingData
        // Skip password check for owner in preview
        if (proofingData.hasPassword) {
          isPasswordVerified.value = true
        }
        // Skip email modal for preview mode
        showEmailModal.value = false
        // Load media sets and items
        if (proofingData.mediaSets && proofingData.mediaSets.length > 0) {
          mediaSets.value = proofingData.mediaSets
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
          'This proofing is not yet published. Please contact the creator to publish it before accessing.'
        )
      }

      // If draft and owner, allow preview (no token needed)
      if (statusCheck.status === 'draft' && statusCheck.isOwner === true) {
        // Owner previewing draft - fetch full proofing data
        const proofingData = await proofingApi.fetchProofing(proofingId)
        proofing.value = proofingData
        // Skip password check for owner
        if (proofingData.hasPassword) {
          isPasswordVerified.value = true
        }
        // Load media sets and items
        if (proofingData.mediaSets && proofingData.mediaSets.length > 0) {
          mediaSets.value = proofingData.mediaSets
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
          const proofingData = await proofingApi.fetchProofing(proofingId)
          proofing.value = proofingData

          // Verify user is owner
          const userUuid = proofingData.userUuid || proofingData.user_uuid
          const currentUserId = userStore.user?.id || userStore.user?.uuid
          const isOwner =
            userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId

          if (isOwner) {
            // Owner in preview mode - skip password check
            if (proofingData.hasPassword) {
              isPasswordVerified.value = true
            }
            // Skip email modal for preview mode
            showEmailModal.value = false
            // Load media sets and items
            if (proofingData.mediaSets && proofingData.mediaSets.length > 0) {
              mediaSets.value = proofingData.mediaSets
              if (!selectedSetId.value) {
                selectedSetId.value = mediaSets.value[0].id
              }
            }
            await loadMediaItems()
            isLoading.value = false
            return
          }
        } catch (fallbackError) {
          // Continue with error handling
        }
      }

      // Check if error is about proofing not being published
      const errorMessage = statusError?.message || ''
      const errorCode = statusError?.code || ''

      if (
        errorMessage.toLowerCase().includes('not yet published') ||
        errorMessage.toLowerCase().includes('not active') ||
        errorMessage.toLowerCase().includes('proofing is not active') ||
        errorMessage.toLowerCase().includes('not accessible') ||
        errorMessage.toLowerCase().includes('not found') ||
        errorCode === 'PROOFING_NOT_ACTIVE' ||
        errorCode === 'PROOFING_NOT_ACCESSIBLE' ||
        errorCode === 'NOT_FOUND'
      ) {
        throw statusError // Re-throw to show error immediately
      }

      // Other error - try to continue (might be network issue)
    }

    let token = null

    // STEP 2: GET OR GENERATE TOKEN FOR ACTIVE PROOFING
    // Skip token requirement if in preview mode
    if (!isPreview || !statusCheck?.isOwner) {
      // Only proceed if proofing is active (we've verified above)
      token = getStoredGuestToken(proofingId)

      if (!token) {
        // No token found - email is required, always show email modal
        showEmailModal.value = true
        isLoading.value = false
        return
      }
    }

    // STEP 3: FETCH PROOFING DATA WITH TOKEN
    let proofingData
    try {
      if (token) {
        guestToken.value = token // Ensure token is set for media loading
        proofingData = await proofingApi.fetchPublicProofing(proofingId, token)
      } else {
        proofingData = await proofingApi.fetchProofing(proofingId)
      }
    } catch (error) {
      // Silently handle error

      const errorMessage = error?.message || ''
      const errorCode = error?.code || ''

      if (
        errorMessage.toLowerCase().includes('not active') ||
        errorMessage.toLowerCase().includes('proofing is not active') ||
        errorMessage.toLowerCase().includes('not accessible') ||
        errorCode === 'PROOFING_NOT_ACTIVE' ||
        errorCode === 'PROOFING_NOT_ACCESSIBLE' ||
        error?.status === 403
      ) {
        throw new Error(
          'This proofing is not yet published. Please contact the creator to publish it before accessing.'
        )
      }

      throw new Error(
        error?.message || 'Proofing not found or not accessible. Please check the link.'
      )
    }

    // Ensure proofingData is valid
    if (!proofingData || !proofingData.id) {
      throw new Error('Invalid proofing data received')
    }

    proofing.value = proofingData

    // Validate guest email against allowed emails list (skip for authenticated owners and preview mode)
    if (
      !isAuthenticatedOwner.value &&
      !isPreviewMode.value &&
      userEmail.value &&
      proofingData.allowedEmails &&
      Array.isArray(proofingData.allowedEmails) &&
      proofingData.allowedEmails.length > 0
    ) {
      const emailLower = userEmail.value.toLowerCase()
      const isEmailAllowed = proofingData.allowedEmails.some(
        allowedEmail => allowedEmail && allowedEmail.toLowerCase() === emailLower
      )

      if (!isEmailAllowed) {
        // Guest email is no longer in allowed emails list - remove from storage
        localStorage.removeItem(`guest_email_proofing_${proofingId}`)
        localStorage.removeItem(`guest_token_proofing_${proofingId}`)
        userEmail.value = ''
        guestToken.value = null
        // Show email modal to re-authenticate
        showEmailModal.value = true
        isLoading.value = false
        return
      }
    }

    // Check password - skip for authenticated owners and preview mode
    if (proofingData.hasPassword && !isPasswordVerified.value) {
      // If authenticated owner or in preview mode, auto-verify password
      const userUuid = proofingData.userUuid || proofingData.user_uuid
      const currentUserId = userStore.user?.id || userStore.user?.uuid
      const isOwnerCheck =
        userStore.isAuthenticated && userUuid && currentUserId && userUuid === currentUserId
      const isPreview = route.query.preview === 'true'

      if (isOwnerCheck || (isPreview && isOwnerCheck)) {
        isPasswordVerified.value = true
      } else {
        // Password will be checked via modal - don't load media yet
        return
      }
    }

    // Load media sets
    if (proofingData.mediaSets && proofingData.mediaSets.length > 0) {
      mediaSets.value = proofingData.mediaSets
      // Select first set by default
      if (!selectedSetId.value) {
        selectedSetId.value = mediaSets.value[0].id
      }
    } else {
      // If no media sets in response, try to fetch them
      try {
        let sets
        if (isPreview && statusCheck?.isOwner === true) {
          // Preview mode - use authenticated endpoint (if available)
          // For now, use guest endpoint
          sets = await proofingApi.fetchProofingSets(proofingId, token)
        } else if (token) {
          sets = await proofingApi.fetchProofingSets(proofingId, token)
        } else {
          // Try to get sets from proofing data or use guest endpoint
          sets = proofingData.mediaSets || []
        }
        if (sets && sets.length > 0) {
          mediaSets.value = sets
          if (!selectedSetId.value) {
            selectedSetId.value = mediaSets.value[0].id
          }
        }
      } catch (error) {
        // Silently handle error
      }
    }

    // Load media items if password is not required, or verified, or in preview mode, or authenticated owner
    const shouldLoadMedia =
      !proofingData.hasPassword ||
      isPasswordVerified.value ||
      isPreviewMode.value ||
      isAuthenticatedOwner.value

    if (shouldLoadMedia) {
      await loadMediaItems()
    }
  } catch (error) {
    console.error('Error loading proofing:', error)

    // Check if error is about proofing not being published
    const errorMessage = error?.message || ''
    if (
      errorMessage.toLowerCase().includes('not yet published') ||
      errorMessage.toLowerCase().includes('not active') ||
      errorMessage.toLowerCase().includes('proofing is not active')
    ) {
      // Show error immediately - don't show toast, show in UI
      toast.error('Proofing not published', {
        description:
          'This proofing is not yet published. Please contact the creator to publish it before accessing.',
        duration: 8000,
      })
    } else {
      toast.error('Failed to load proofing', {
        description: error?.message || 'An unknown error occurred',
      })
    }
  } finally {
    isLoading.value = false
  }
}

// Load media items for all sets
const loadMediaItems = async () => {
  if (!proofing.value?.id) return
  if (!isPasswordVerified.value && proofing.value?.hasPassword && !isPreviewMode.value) return
  if (mediaSets.value.length === 0) return

  try {
    // For draft proofing, authenticated users can use regular endpoint
    // For active/completed, use guest token if available
    const isDraft = proofing.value?.status === 'draft'

    // Ensure we have a guest token for active/completed proofing
    if (!isDraft && !guestToken.value && proofing.value?.id) {
      const token = getStoredGuestToken(proofing.value.id)
      if (token) {
        guestToken.value = token
      } else {
        return
      }
    }

    // Load media for all sets
    const allMedia = []
    const isPreview = route.query.preview === 'true'

    for (const set of mediaSets.value) {
      try {
        let setMedia

        // Preview mode - use authenticated endpoint (if available)
        if (isPreview && isPreviewMode.value) {
          // For proofing, we'll use guest endpoint even in preview
          if (guestToken.value) {
            setMedia = await proofingApi.fetchProofingSetMedia(
              proofing.value.id,
              set.id,
              guestToken.value
            )
          } else {
            // Try to get token first
            const token = getStoredGuestToken(proofing.value.id)
            if (token) {
              guestToken.value = token
              setMedia = await proofingApi.fetchProofingSetMedia(proofing.value.id, set.id, token)
            } else {
              throw new Error('No token available')
            }
          }
        } else if (isDraft && !guestToken.value) {
          // For draft proofing, try authenticated endpoint first (for owner preview)
          try {
            // For proofing, we may need to use guest endpoint
            const token = getStoredGuestToken(proofing.value.id)
            if (token) {
              guestToken.value = token
              setMedia = await proofingApi.fetchProofingSetMedia(proofing.value.id, set.id, token)
            } else {
              throw new Error('No token available')
            }
          } catch (error) {
            const token = getStoredGuestToken(proofing.value.id)
            if (token) {
              guestToken.value = token
              setMedia = await proofingApi.fetchProofingSetMedia(proofing.value.id, set.id, token)
            } else {
              throw error
            }
          }
        } else if (guestToken.value) {
          // Use guest endpoint for active/completed proofing or when token is available
          setMedia = await proofingApi.fetchProofingSetMedia(
            proofing.value.id,
            set.id,
            guestToken.value
          )
        } else {
          // Fallback: try to get token
          const token = getStoredGuestToken(proofing.value.id)
          if (token) {
            guestToken.value = token
            setMedia = await proofingApi.fetchProofingSetMedia(proofing.value.id, set.id, token)
          } else {
            throw new Error('No token available')
          }
        }

        // The API client already unwraps response.data, so setMedia should be the array directly
        // But handle both cases just in case
        let mediaArray = setMedia
        if (setMedia && typeof setMedia === 'object' && !Array.isArray(setMedia)) {
          // If wrapped, try to extract array
          if (setMedia.data && Array.isArray(setMedia.data)) {
            mediaArray = setMedia.data
          } else {
            continue
          }
        }

        if (!Array.isArray(mediaArray)) {
          continue
        }

        // Add setId to each media item (if not already present)
        const mediaWithSetId = mediaArray.map(item => ({
          ...item,
          setId: item.setId || set.id, // Use existing setId if present
          // Ensure type is available from file if not directly on item
          type: item.type || (item.file && item.file.type) || 'image',
          // Ensure url is available
          url: item.url || (item.file && item.file.url) || item.thumbnailUrl || item.largeImageUrl,
        }))
        allMedia.push(...mediaWithSetId)
      } catch (error) {
        // Check if proofing is not active
        const errorMessage = error?.message || ''
        const errorCode = error?.code || ''

        if (
          errorMessage.toLowerCase().includes('not active') ||
          errorMessage.toLowerCase().includes('proofing is not active') ||
          errorCode === 'PROOFING_NOT_ACTIVE' ||
          error?.status === 403
        ) {
          // Re-throw with better message to be caught by outer catch
          throw new Error(
            'This proofing is not yet published. Please contact the creator to publish it before accessing.'
          )
        }

        // Continue loading other sets even if one fails (for other errors)
      }
    }
    mediaItems.value = allMedia

    // Load closure requests and approval requests for all media items
    await loadClosureRequestsForMedia()
    await loadApprovalRequestsForMedia()
  } catch (error) {
    // Check if proofing is not active
    const errorMessage = error?.message || ''
    const errorCode = error?.code || ''

    if (
      errorMessage.toLowerCase().includes('not active') ||
      errorMessage.toLowerCase().includes('proofing is not active') ||
      errorMessage.toLowerCase().includes('not yet published') ||
      errorCode === 'PROOFING_NOT_ACTIVE' ||
      error?.status === 403
    ) {
      toast.error('Proofing not published', {
        description:
          'This proofing is not yet published. Please contact the creator to publish it before accessing.',
      })
    } else {
      toast.error('Failed to load media', {
        description: error?.message || 'An unknown error occurred',
      })
    }
  }
}

const verifiedPassword = ref(null)

const handleVerifyPassword = async () => {
  if (!passwordInput.value || !proofing.value) return

  isVerifyingPassword.value = true
  passwordError.value = ''

  try {
    // Verify password with backend
    const proofingId = route.query.proofingId
    await proofingApi.verifyProofingPassword(proofingId, passwordInput.value)

    // Password verified successfully
    verifiedPassword.value = passwordInput.value
    isPasswordVerified.value = true
    passwordInput.value = ''
    await loadProofing()
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
const handleSelectSet = setId => {
  selectedSetId.value = setId
}

// View media in lightbox
const handleViewMedia = (item, withComments = false) => {
  if (isAuthenticatedOwner.value || isPreviewMode.value) return
  if (proofing.value?.status === 'completed') return // Don't allow viewing in lightbox when completed

  const index = currentMediaItems.value.findIndex(m => m.id === item.id)
  if (index !== -1) {
    previewMediaIndex.value = index
    useCommentLightbox.value = withComments
    openWithComments.value = withComments
    showMediaLightbox.value = true
  }
}

// Switch from MediaLightbox to MediaCommentLightbox when comments are requested
const handleOpenCommentsFromLightbox = ({ item, index }) => {
  // Switch to comment lightbox while keeping it open
  const wasOpen = showMediaLightbox.value

  // Update the index to match the current item in MediaLightbox
  if (item && index !== undefined) {
    // Find the item in currentMediaItems to get the correct index
    const itemIndex = currentMediaItems.value.findIndex(m => {
      const mediaId = m.id || m.uuid
      const itemId = item.id || item.uuid
      return mediaId === itemId
    })

    if (itemIndex >= 0) {
      previewMediaIndex.value = itemIndex
    } else {
      // If not found, use the index from MediaLightbox
      previewMediaIndex.value = index
    }

    // Ensure the item is in currentMediaItems with full structure preserved
    if (itemIndex < 0 && item) {
      // Item not found in currentMediaItems, add it temporarily
      const itemWithSetId = {
        ...item,
        setId: item.setId || selectedSetId.value,
      }
      currentMediaItems.value.splice(index >= 0 ? index : 0, 0, itemWithSetId)
      previewMediaIndex.value = index >= 0 ? index : 0
    } else if (itemIndex >= 0 && item) {
      // Replace the item in currentMediaItems with the one from MediaLightbox to preserve structure
      currentMediaItems.value[itemIndex] = {
        ...item,
        setId: item.setId || selectedSetId.value,
      }
    }
  }

  useCommentLightbox.value = true
  openWithComments.value = true
  // Ensure lightbox stays open
  if (!wasOpen) {
    showMediaLightbox.value = true
  }

  // Force update by toggling showMediaLightbox to trigger watch
  if (wasOpen) {
    showMediaLightbox.value = false
    nextTick(() => {
      showMediaLightbox.value = true
    })
  }
}

// Handle approve media from card
const handleApproveMedia = item => {
  if (!item || !guestToken.value) return
  mediaToApprove.value = item
  showApproveConfirm.value = true
}

const handleViewClosureHistory = async item => {
  closureHistoryMediaItem.value = item
  const mediaId = item.id || item.uuid
  try {
    const result = await proofingApi.getMediaClosureRequests(mediaId, guestToken.value)
    closureHistoryData.value = result.closure_requests || []
    showClosureHistoryModal.value = true
  } catch (error) {
    console.error('Failed to load closure history:', error)
    toast.error('Failed to load closure history', {
      description: error?.message || 'An error occurred while loading closure history.',
    })
  }
}

const getClosureRequestsForMedia = item => {
  const mediaId = item?.id || item?.uuid
  return closureRequestsMap.value[mediaId] || []
}

const getApprovalRequestsForMedia = item => {
  const mediaId = item?.id || item?.uuid
  return approvalRequestsMap.value[mediaId] || []
}

const hasPendingClosureRequest = item => {
  const requests = getClosureRequestsForMedia(item)
  return requests.some(req => req.status === 'pending')
}

const hasPendingApprovalRequest = item => {
  const requests = getApprovalRequestsForMedia(item)
  return requests.some(req => req.status === 'pending')
}

const isRejected = item => {
  return !!(item?.isRejected || item?.is_rejected)
}

const getPendingClosureRequest = item => {
  const requests = getClosureRequestsForMedia(item)
  return requests.find(req => req.status === 'pending')
}

const getPendingApprovalRequest = item => {
  const requests = getApprovalRequestsForMedia(item)
  return requests.find(req => req.status === 'pending')
}

const handlePendingClosureClick = item => {
  const pendingRequest = getPendingClosureRequest(item)
  if (pendingRequest?.public_url) {
    window.open(pendingRequest.public_url, '_blank')
  } else {
    handleViewClosureHistory(item)
  }
}

const handlePendingApprovalClick = item => {
  const pendingRequest = getPendingApprovalRequest(item)
  if (pendingRequest?.public_url) {
    window.open(pendingRequest.public_url, '_blank')
  }
}

const handleViewApprovalRequest = item => {
  const requests = getApprovalRequestsForMedia(item)
  if (requests && requests.length > 0) {
    // Get the latest approval request (should be the rejected one)
    const sorted = [...requests].sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0)
      const dateB = new Date(b.created_at || b.createdAt || 0)
      return dateB - dateA
    })
    const latestRequest = sorted[0]
    if (latestRequest?.public_url) {
      window.open(latestRequest.public_url, '_blank')
    } else if (latestRequest?.token) {
      window.open(`/p/approval-request/${latestRequest.token}`, '_blank')
    }
  }
}

const handleViewRevisionHistory = item => {
  if (!item) return

  revisionHistoryMediaItem.value = item

  // Check if on second-to-last revision
  const maxRevisions = proofing.value?.maxRevisions || proofing.value?.max_revisions || 5
  const originalUuid = item.originalMediaId || item.original_media_uuid || item.id || item.uuid

  // Find all revisions for this media
  const allRevisions = mediaItems.value.filter(m => {
    const mOriginalUuid = m.originalMediaId || m.original_media_uuid || m.id || m.uuid
    return mOriginalUuid === originalUuid
  })

  const currentRevisionNumber = item.revisionNumber || item.revision_number || 0

  if (currentRevisionNumber === maxRevisions - 1) {
    toast.warning('Second-to-last revision', {
      description: `This is revision ${currentRevisionNumber} of ${maxRevisions}. Only one more revision is allowed.`,
      duration: 5000,
    })
  }

  showRevisionHistorySidebar.value = true
}

const handleRevisionClick = revision => {
  selectedRevision.value = revision
  showRevisionDetailsModal.value = true
}

const hasRevisions = item => {
  if (!item) return false
  const originalUuid = item.originalMediaId || item.original_media_uuid || item.id || item.uuid
  // Check if there are other media items with the same originalMediaId (revisions)
  return mediaItems.value.some(m => {
    const mOriginalUuid = m.originalMediaId || m.original_media_uuid || m.id || m.uuid
    const mId = m.id || m.uuid
    const itemId = item.id || item.uuid
    return mOriginalUuid === originalUuid && mId !== itemId
  })
}

const isReadyForRevision = item => {
  return item?.isReadyForRevision || item?.is_ready_for_revision || false
}

const loadClosureRequestsForMedia = async () => {
  if (!currentMediaItems.value || currentMediaItems.value.length === 0 || !guestToken.value) return

  try {
    const requests = {}
    for (const item of currentMediaItems.value) {
      const mediaId = item.id || item.uuid
      try {
        const result = await proofingApi.getMediaClosureRequests(mediaId, guestToken.value)
        requests[mediaId] = result.closure_requests || []
      } catch (error) {
        // Silently fail for individual items
        requests[mediaId] = []
      }
    }
    closureRequestsMap.value = requests
  } catch (error) {
    console.error('Failed to load closure requests:', error)
  }
}

const loadApprovalRequestsForMedia = async () => {
  if (!currentMediaItems.value || currentMediaItems.value.length === 0 || !guestToken.value) return

  try {
    const requests = {}
    for (const item of currentMediaItems.value) {
      const mediaId = item.id || item.uuid
      try {
        const result = await proofingApi.getMediaApprovalRequests(mediaId, guestToken.value)
        requests[mediaId] = result.approval_requests || []
      } catch (error) {
        // Silently fail for individual items
        requests[mediaId] = []
      }
    }
    approvalRequestsMap.value = requests
  } catch (error) {
    console.error('Failed to load approval requests:', error)
  }
}

// Confirm approve media
const confirmApproveMedia = async () => {
  if (!mediaToApprove.value || !guestToken.value || isApprovingMedia.value) {
    return
  }

  const item = mediaToApprove.value
  const proofingId = proofing.value?.id || proofing.value?.uuid
  const mediaId = item.id || item.uuid

  if (!proofingId || !mediaId) {
    toast.error('Missing required information', {
      description: 'Unable to approve media. Please try again.',
    })
    showApproveConfirm.value = false
    mediaToApprove.value = null
    return
  }

  isApprovingMedia.value = true

  try {
    const updatedMedia = await proofingApi.approveProofingMedia(
      proofingId,
      mediaId,
      guestToken.value
    )

    // Update the media item in the list
    handleMediaApproved(updatedMedia)

    showApproveConfirm.value = false
    mediaToApprove.value = null
    toast.success('Media approved', {
      description: 'This media has been marked as approved.',
    })
  } catch (error) {
    console.error('Failed to approve media', error)
    toast.error('Failed to approve media', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isApprovingMedia.value = false
  }
}

// Check if proofing cover photo is a video
const isVideoCover = computed(() => {
  if (!proofing.value?.coverPhotoUrl && !proofing.value?.cover_photo_url) return false

  const coverUrl = proofing.value.coverPhotoUrl || proofing.value.cover_photo_url
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv']
  return videoExtensions.some(ext => coverUrl.toLowerCase().includes(ext))
})

// Get proofing cover photo style with focal point
const getProofingCoverStyle = () => {
  const style = {}

  if (!proofing.value) return style

  // Get focal point from proofing
  const focalPoint = proofing.value.coverFocalPoint || proofing.value.cover_focal_point

  if (focalPoint && typeof focalPoint === 'object' && focalPoint !== null) {
    if ('x' in focalPoint && 'y' in focalPoint) {
      // Apply focal point using object-position
      style.objectPosition = `${focalPoint.x}% ${focalPoint.y}%`
    }
  }

  return style
}

const handleCoverImageError = () => {
  // Silently handle error
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

onMounted(() => {
  // Load proofing (will show email modal if needed)
  loadProofing()

  // Check if we have a stored email for this proofing
  const proofingId = route.query.proofingId
  if (proofingId) {
    const storedEmail = localStorage.getItem(`guest_email_proofing_${proofingId}`)
    if (storedEmail) {
      userEmail.value = storedEmail
    }
  }
})
</script>
