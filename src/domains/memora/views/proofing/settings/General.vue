<template>
  <ProofingLayout :is-loading="isLoading" :proofing="proofing" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-4 sm:p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading settings...</p>
          </div>
        </div>

        <div v-else class="max-w-full md:max-w-[50%] p-4 sm:p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                General Settings
              </h1>
              <button
                :class="theme.borderSecondary"
                class="w-5 h-5 rounded-full border flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 active:scale-95"
                title="More information"
              >
                <Info :class="theme.textSecondary" class="h-3 w-3" />
              </button>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              Configure general settings for your proofing including name, color, cover photo, and
              display preferences.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Proofing Name -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Proofing Name</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    The name of this proofing as it appears in your dashboard and to customers.
                  </p>
                </div>
              </div>
              <Input
                v-model="proofingName"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-md focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="My Proofing"
              />
            </div>

            <!-- Proofing Description -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Description</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Optional description shown to clients viewing this proofing.
                  </p>
                </div>
              </div>
              <Textarea
                v-model="proofingDescription"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-2xl min-h-[100px] resize-none focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="Enter a description for this proofing..."
                :maxlength="1000"
              />
              <div class="flex items-center justify-between max-w-2xl">
                <p :class="theme.textTertiary" class="text-xs">
                  Description is shown to clients viewing this proofing.
                </p>
                <span :class="theme.textTertiary" class="text-xs">
                  {{ (proofingDescription || '').length }}/1000
                </span>
              </div>
            </div>

            <!-- Proofing Color -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Proofing Color
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Choose a color to help identify this proofing in your dashboard.
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <input
                  v-model="proofingColor"
                  :class="theme.borderSecondary"
                  class="h-12 w-20 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                  type="color"
                />
                <Input
                  v-model="proofingColor"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="flex-1 focus:ring-2 focus:ring-accent/20 transition-all font-mono text-sm"
                  placeholder="#F59E0B"
                />
                <div
                  class="h-12 w-12 rounded-lg border-2 transition-all"
                  :style="{ backgroundColor: proofingColor, borderColor: proofingColor }"
                  :class="theme.borderSecondary"
                ></div>
              </div>
            </div>

            <!-- Cover Focal Point -->
            <div
              v-if="proofing?.coverPhotoUrl || proofing?.cover_photo_url"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-5 p-4 sm:p-6 rounded-2xl border-2 transition-shadow duration-300"
            >
              <div class="mb-2">
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Cover Focal Point
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                  Choose where to focus the cover image for optimal cropping
                </p>
              </div>
              <Button
                class="w-full"
                variant="default"
                @click="showFocalPointModal = true"
              >
                <Eye class="h-4 w-4 mr-2" />
                <span>Set Focal Point</span>
              </Button>
            </div>

            <!-- Allowed Emails -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Allowed Emails
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Specify which email addresses are allowed to access this proofing.
                    <span class="font-medium text-accent">Click the star icon</span> next to a valid email to set it as primary.
                  </p>
                </div>
                <div v-if="isSavingAllowedEmails" class="flex items-center gap-2 text-accent">
                  <Loader2 class="h-4 w-4 animate-spin" />
                  <span class="text-xs font-medium">Saving...</span>
                </div>
              </div>
              <div class="space-y-2 max-w-2xl">
                <div
                  v-for="(email, index) in allowedEmails || []"
                  :key="`email-${index}`"
                  :class="[
                    'group relative flex items-center gap-3 rounded-lg border transition-all duration-200 px-4 py-3',
                    isPrimaryEmail(email) && isValidEmail(email)
                      ? 'bg-accent/10 dark:bg-accent/20 border-accent/40 dark:border-accent/30 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                    theme.bgCard,
                  ]"
                >
                  <!-- Primary Indicator Bar -->
                  <div
                    v-if="isPrimaryEmail(email) && isValidEmail(email)"
                    class="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg bg-accent"
                  ></div>

                  <!-- Email Input -->
                  <div class="flex-1 relative min-w-0">
                    <div class="flex items-center gap-3">
                      <input
                        v-model="allowedEmails[index]"
                        :class="[
                          theme.textInput,
                          touchedEmailIndices.has(index) && email && !isValidEmail(email)
                            ? 'text-red-600 dark:text-red-400'
                            : '',
                          'flex-1 bg-transparent border-0 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm focus:ring-0',
                        ]"
                        placeholder="email@example.com"
                        type="email"
                        @blur="
                          () => {
                            touchedEmailIndices.add(index)
                            handleAllowedEmailsChange(false)
                          }
                        "
                        @keydown.enter="handleAllowedEmailsChange(true)"
                      />
                    </div>
                    <p
                      v-if="touchedEmailIndices.has(index) && email && !isValidEmail(email)"
                      class="absolute -bottom-5 left-0 text-xs text-red-500 dark:text-red-400 mt-1"
                    >
                      Please enter a valid email address
                    </p>
                  </div>

                  <!-- Primary Button -->
                  <div class="flex-shrink-0">
                    <button
                      v-if="email && isValidEmail(email)"
                      :class="[
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                        isPrimaryEmail(email)
                          ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-accent dark:hover:text-accent',
                      ]"
                      :title="isPrimaryEmail(email) ? 'Primary email - Click to change' : 'Click to set as primary email'"
                      @click="setPrimaryEmail(email)"
                    >
                      <Star
                        :class="[
                          'h-3.5 w-3.5 transition-all duration-200',
                          isPrimaryEmail(email) ? 'fill-white' : 'fill-gray-400 dark:fill-gray-500',
                        ]"
                      />
                      <span>{{ isPrimaryEmail(email) ? 'Primary' : 'Set Primary' }}</span>
                    </button>
                    <div
                      v-else
                      class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50"
                      title="Enter a valid email to set as primary"
                    >
                      <Star class="h-3.5 w-3.5 fill-gray-300 dark:fill-gray-700" />
                      <span class="hidden sm:inline">Set Primary</span>
                    </div>
                  </div>

                  <!-- Remove Button -->
                  <div class="flex-shrink-0">
                    <Button
                      v-if="allowedEmails.length > 1"
                      variant="ghost"
                      size="sm"
                      :class="[
                        'text-gray-400 dark:text-gray-500',
                        'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20',
                        'opacity-0 group-hover:opacity-100 transition-all duration-200',
                      ]"
                      title="Remove email"
                      @click="removeAllowedEmail(index)"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                    <div v-else class="w-9"></div>
                  </div>
                </div>
                <div class="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    @click="addAllowedEmail"
                  >
                    <Plus class="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                </div>
                <div class="pt-4 mt-4 border-t" :class="theme.borderSecondary">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 text-sm">
                      <div class="flex items-center gap-2">
                        <span :class="theme.textSecondary">Total:</span>
                        <span :class="theme.textPrimary" class="font-semibold">
                          {{ validEmailsCount }} {{ validEmailsCount === 1 ? 'email' : 'emails' }}
                        </span>
                      </div>
                      <div
                        v-if="primaryEmail"
                        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 dark:bg-accent/20 border border-accent/20 dark:border-accent/30"
                      >
                        <Star
                          class="h-3.5 w-3.5 fill-accent text-accent"
                        />
                        <span class="text-xs font-medium text-accent">
                          Primary: <span class="font-mono">{{ primaryEmail }}</span>
                        </span>
                      </div>
                    </div>
                    <div class="text-xs">
                      <p
                        v-if="
                          !allowedEmails ||
                          allowedEmails.length === 0 ||
                          allowedEmails.every(e => !e || !e.trim())
                        "
                        :class="theme.textSecondary"
                        class="italic"
                      >
                        No restrictions
                      </p>
                      <p
                        v-else-if="!hasValidEmails"
                        class="text-red-500 dark:text-red-400 font-medium"
                      >
                        Valid email required
                      </p>
                      <p
                        v-else
                        :class="theme.textSecondary"
                        class="text-accent"
                      >
                        Ready to publish
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Password Protection -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Password Protection
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Require a password for customers to access this proofing.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch
                    :model-value="hasPassword"
                    label=""
                    @update:model-value="handlePasswordToggle"
                  />
                </div>
              </div>
              <div v-if="hasPassword" class="space-y-3 max-w-md">
                <div v-if="!isChangingPassword" class="flex items-center gap-2">
                  <div class="flex-1">
                    <PasswordInput
                      :model-value="passwordDisplay"
                      :input-class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        'w-full focus:ring-2 focus:ring-violet-500/20 transition-all',
                      ]"
                      readonly
                      placeholder="Password"
                    />
                  </div>
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="handleCopyPassword"
                  >
                    <Copy class="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div v-else class="flex items-center gap-2">
                  <PasswordInput
                    v-model="newPassword"
                    :input-class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'flex-1 focus:ring-2 focus:ring-violet-500/20 transition-all',
                    ]"
                    placeholder="Enter new password"
                  />
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="handleGeneratePassword"
                  >
                    <RefreshCw class="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                <div class="flex items-center gap-2">
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="isChangingPassword = !isChangingPassword"
                  >
                    {{ isChangingPassword ? 'Cancel' : 'Change Password' }}
                  </Button>
                  <Button
                    v-if="isChangingPassword && newPassword"
                    :class="['bg-violet-500 hover:bg-violet-600 text-white']"
                    :disabled="isSavingPassword"
                    size="sm"
                    :loading="isSavingPassword"
                    loading-label="Saving..."
                    @click="handleSavePassword"
                  >
                    Save Password
                  </Button>
                </div>
              </div>
            </div>

            <!-- Max Revisions -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Max Revisions</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Set the maximum number of revision rounds allowed for this proofing.
                  </p>
                </div>
              </div>
              <div class="space-y-3 max-w-md">
                <div class="flex items-center gap-3">
                  <Input
                    v-model.number="maxRevisions"
                    :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                    class="max-w-xs focus:ring-2 focus:ring-accent/20 transition-all"
                    placeholder="5"
                    type="number"
                    min="1"
                    max="50"
                  />
                  <span :class="theme.textSecondary" class="text-sm">revision(s)</span>
                </div>
                <p :class="theme.textSecondary" class="text-xs">
                  Current limit:
                  <span class="font-medium">{{ proofing?.maxRevisions || 5 }} revision(s)</span>
                </p>
              </div>
            </div>

            <!-- Typography -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Typography</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Select fonts that match your brand and style.
                  </p>
                </div>
              </div>
              <div class="space-y-5">
                <!-- Font Family -->
                <div>
                  <label
                    :class="theme.textSecondary"
                    class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                  >
                    Font Family
                  </label>
                  <FontFamilySelect
                    v-model="fontFamily"
                    placeholder="Select font family"
                  />
                </div>
                <!-- Font Style -->
                <div>
                  <label
                    :class="theme.textSecondary"
                    class="text-xs font-semibold mb-2.5 block uppercase tracking-wide"
                  >
                    Font Style
                  </label>
                  <Select v-model="fontStyle">
                    <SelectTrigger
                      :class="[
                        theme.bgInput,
                        theme.borderInput,
                        theme.textInput,
                        'focus:ring-2 focus:ring-accent/20 focus:border-accent',
                      ]"
                      class="transition-all"
                    >
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                      <SelectItem
                        v-for="style in fontStyleOptions"
                        :key="style.value"
                        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                        :style="getStylePreview(style.value)"
                        :value="style.value"
                      >
                        {{ style.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <!-- Gallery Assist -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Gallery Assist
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Add walk-through cards to help visitors use the proofing.
                    <a class="text-violet-600 dark:text-violet-400 hover:underline font-medium" href="#">Learn more</a>
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="galleryAssist" label="" />
                </div>
              </div>
            </div>

            <!-- Display Preferences -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Display Preferences
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Configure how media items are displayed in this proofing.
                </p>
              </div>
              <div class="space-y-4">
                <!-- View Mode -->
                <div class="flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">View Mode</p>
                    <p :class="theme.textSecondary" class="text-xs">Grid or List view</p>
                  </div>
                  <div class="flex-shrink-0">
                    <select
                      v-model="viewMode"
                      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                      class="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 transition-all"
                    >
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                    </select>
                  </div>
                </div>

                <!-- Grid Size -->
                <div v-if="viewMode === 'grid'" class="flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">Grid Size</p>
                    <p :class="theme.textSecondary" class="text-xs">Size of grid items</p>
                  </div>
                  <div class="flex-shrink-0">
                    <select
                      v-model="gridSize"
                      :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                      class="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-accent/20 transition-all"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                <!-- Show Filename -->
                <div class="flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <p :class="theme.textPrimary" class="text-sm font-medium mb-1">Show Filename</p>
                    <p :class="theme.textSecondary" class="text-xs">
                      Display filenames on media items
                    </p>
                  </div>
                  <div class="flex-shrink-0 pt-1">
                    <ToggleSwitch
                      v-model="showFilename"
                      label=""
                      @update:model-value="handleShowFilenameChange"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end gap-3 pt-4">
              <Button
                variant="accent"
                :loading="isSaving"
                :disabled="!hasUnsavedChanges"
                loading-label="Saving..."
                @click="handleSaveAll"
              >
                <span v-if="hasUnsavedChanges" class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                  Save Changes
                </span>
                <span v-else>Save Changes</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Focal Point Modal -->
      <CoverFocalPointModal
        :is-open="showFocalPointModal"
        :image-url="proofingCoverImage"
        :initial-focal-point="formData?.coverFocalPoint || { x: 50, y: 50 }"
        @update:is-open="showFocalPointModal = $event"
        @confirm="handleFocalPointConfirm"
      />
    </template>
  </ProofingLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Plus, X, Loader2, Info, Copy, Star, Eye, RefreshCw } from '@/shared/utils/lucideAnimated'
import ProofingLayout from '@/domains/memora/layouts/ProofingLayout.vue'
import { Input } from '@/shared/components/shadcn/input'
import { Textarea } from '@/shared/components/shadcn/textarea'
import { Button } from '@/shared/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import FontFamilySelect from '@/shared/components/organisms/FontFamilySelect.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import CoverFocalPointModal from '@/shared/components/organisms/CoverFocalPointModal.vue'
import { useProofingStore } from '@/domains/memora/stores/proofing'
import { useProofingApi } from '@/domains/memora/api/proofing'
import { toast } from '@/shared/utils/toast'
import { fontStyleOptions as baseFontStyleOptions } from '@/shared/utils/designConstants'
import { generatePassword } from '@/shared/utils/generatePassword'

const theme = useThemeClasses()
const route = useRoute()
const router = useRouter()
const proofingStore = useProofingStore()
const proofingApi = useProofingApi()

// Proofing data
const proofing = ref(null)
const isLoading = ref(false)
const isSaving = ref(false)

// Settings state
const proofingName = ref('')
const proofingDescription = ref('')
const proofingColor = ref('#F59E0B')
const hasPassword = ref(false)
const currentPassword = ref('')
const isChangingPassword = ref(false)
const newPassword = ref('')
const isSavingPassword = ref(false)
const maxRevisions = ref(5)
const allowedEmails = ref([])
const primaryEmail = ref(null)
const isSavingAllowedEmails = ref(false)
const emailsSaved = ref(false)
const touchedEmailIndices = ref(new Set())
const nameSaved = ref(false)
const descriptionSaved = ref(false)
const colorSaved = ref(false)
const maxRevisionsSaved = ref(false)
const typographySaved = ref(false)
const galleryAssist = ref(false)

// Typography state
const fontFamily = ref('sans')
const fontStyle = ref('normal')

// Font style options
const fontStyleOptions = [
  ...baseFontStyleOptions,
  { value: 'bold italic', label: 'Bold Italic' },
]


// Helper function for style preview
const getStylePreview = styleValue => {
  if (!styleValue) {
    return {
      fontWeight: 'normal',
      fontStyle: 'normal',
    }
  }
  const styles = styleValue.split(/[\s-]+/).filter(s => s.length > 0)
  return {
    fontWeight: styles.includes('bold') ? 'bold' : 'normal',
    fontStyle: styles.includes('italic') ? 'italic' : 'normal',
  }
}

// Focal point state
const showFocalPointModal = ref(false)
const formData = reactive({
  coverFocalPoint: { x: 50, y: 50 },
})

// Track original values for change detection
const originalValues = reactive({
  name: '',
  description: '',
  color: '#F59E0B',
  maxRevisions: 5,
  fontFamily: 'sans',
  fontStyle: 'normal',
  galleryAssist: false,
  allowedEmails: [],
  primaryEmail: null,
  viewMode: 'grid',
  gridSize: 'medium',
  showFilename: false,
  coverFocalPoint: { x: 50, y: 50 },
})

// Display preferences (from store)
const { viewMode, gridSize, showFilename } = storeToRefs(proofingStore)

// Computed
const passwordDisplay = computed(() => {
  if (!hasPassword.value) return ''
  return currentPassword.value || '••••••••'
})

const isValidEmail = email => {
  if (!email || !email.trim()) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

const hasValidEmails = computed(() => {
  return allowedEmails.value.some(email => isValidEmail(email))
})

const validEmailsCount = computed(() => {
  return allowedEmails.value.filter(email => isValidEmail(email)).length
})

const proofingCoverImage = computed(() => {
  return proofing.value?.coverPhotoUrl || proofing.value?.cover_photo_url || null
})

const hasUnsavedChanges = computed(() => {
  if (!proofing.value) return false
  
  const normalizedAllowedEmails = allowedEmails.value
    .map(e => e?.toLowerCase().trim())
    .filter(Boolean)
    .sort()
  const normalizedOriginalEmails = (originalValues.allowedEmails || [])
    .map(e => e?.toLowerCase().trim())
    .filter(Boolean)
    .sort()
  
  const emailsChanged = JSON.stringify(normalizedAllowedEmails) !== JSON.stringify(normalizedOriginalEmails)
  const primaryEmailChanged = (primaryEmail.value?.toLowerCase().trim() || null) !== (originalValues.primaryEmail?.toLowerCase().trim() || null)
  
  const focalPointChanged = formData?.coverFocalPoint && (
    formData.coverFocalPoint.x !== originalValues.coverFocalPoint.x ||
    formData.coverFocalPoint.y !== originalValues.coverFocalPoint.y
  )
  
  return (
    proofingName.value !== originalValues.name ||
    (proofingDescription.value || '') !== (originalValues.description || '') ||
    proofingColor.value !== originalValues.color ||
    maxRevisions.value !== originalValues.maxRevisions ||
    fontFamily.value !== originalValues.fontFamily ||
    fontStyle.value !== originalValues.fontStyle ||
    galleryAssist.value !== originalValues.galleryAssist ||
    emailsChanged ||
    primaryEmailChanged ||
    focalPointChanged ||
    viewMode.value !== originalValues.viewMode ||
    gridSize.value !== originalValues.gridSize ||
    showFilename.value !== originalValues.showFilename
  )
})

const isPrimaryEmail = email => {
  if (!email || !primaryEmail.value) {
    return false
  }
  const normalizedEmail = (email || '').trim().toLowerCase()
  const normalizedPrimary = (primaryEmail.value || '').trim().toLowerCase()
  return normalizedEmail === normalizedPrimary && normalizedEmail !== ''
}

const setPrimaryEmail = email => {
  if (!email || !isValidEmail(email)) return

  const normalizedEmail = email.trim().toLowerCase()

  // If clicking the same primary email, don't do anything
  if (primaryEmail.value && primaryEmail.value.toLowerCase() === normalizedEmail) {
    return
  }

  // Update primary email locally (will be saved when user clicks Save Changes)
  primaryEmail.value = normalizedEmail
}

const goBack = () => {
  router.push({ name: 'proofing' })
}

// Load proofing data
onMounted(async () => {
  const proofingId = route.params.id
  if (!proofingId) return

  isLoading.value = true
  try {
    const projectId = route.query.projectId || null
    const proofingData = await proofingApi.fetchProofing(proofingId, projectId)
    proofing.value = proofingData
    proofingName.value = proofingData.name || ''
    proofingDescription.value = proofingData.description || ''
    proofingColor.value = proofingData.color || '#F59E0B'
    hasPassword.value = !!proofingData.hasPassword || !!proofingData.password
    maxRevisions.value = proofingData.maxRevisions || 5

    // Set password from backend response (only available for owner)
    if (proofingData.password) {
      currentPassword.value = proofingData.password
    }

    // Initialize allowedEmails as array
    const emails = proofingData.allowedEmails || proofingData.allowed_emails
    if (Array.isArray(emails) && emails.length > 0) {
      // Normalize emails to lowercase for consistency
      allowedEmails.value = emails.map(e => e?.toLowerCase().trim() || '').filter(e => e)
      if (allowedEmails.value.length === 0) {
        allowedEmails.value = ['']
      } else {
        allowedEmails.value.push('') // Add empty field for next email
      }
    } else {
      // Start with one empty field for user to type in
      allowedEmails.value = ['']
    }
    touchedEmailIndices.value = new Set()

    // Initialize primary email (normalize to lowercase)
    const rawPrimaryEmail = proofingData.primaryEmail || proofingData.primary_email || null
    if (rawPrimaryEmail) {
      primaryEmail.value = rawPrimaryEmail.toLowerCase().trim()
      // Ensure primary email is in the allowed emails array
      const normalizedEmails = allowedEmails.value.map(e => e?.toLowerCase().trim()).filter(Boolean)
      if (!normalizedEmails.includes(primaryEmail.value)) {
        // If primary email is not in allowed emails, add it
        allowedEmails.value = [primaryEmail.value, ...allowedEmails.value.filter(e => e)]
      }
    } else {
      primaryEmail.value = null
    }

    // Load focal point
    const focalPoint = proofingData.coverFocalPoint || proofingData.cover_focal_point
    if (focalPoint && typeof focalPoint === 'object' && focalPoint.x !== undefined && focalPoint.y !== undefined) {
      formData.coverFocalPoint = { x: focalPoint.x, y: focalPoint.y }
    } else {
      formData.coverFocalPoint = { x: 50, y: 50 }
    }

    // Load typography - backend always returns defaults
    const proofingDesign = proofingData.design || proofingData.settings?.design || {}
    const proofingTypography = proofingData.typographyDesign || proofingDesign.typography || {}
    
    fontFamily.value = proofingTypography.fontFamily || 'sans'
    fontStyle.value = proofingTypography.fontStyle || 'normal'

    // Load gallery assist
    galleryAssist.value = proofingData.galleryAssist ?? proofingData.settings?.general?.galleryAssist ?? false
    
    // Set original values for change detection
    originalValues.name = proofingName.value
    originalValues.description = proofingDescription.value || ''
    originalValues.color = proofingColor.value
    originalValues.maxRevisions = maxRevisions.value
    originalValues.fontFamily = fontFamily.value
    originalValues.fontStyle = fontStyle.value
    originalValues.galleryAssist = galleryAssist.value
    originalValues.allowedEmails = Array.isArray(emails) && emails.length > 0
      ? emails.map(e => e?.toLowerCase().trim()).filter(Boolean)
      : []
    originalValues.primaryEmail = primaryEmail.value
    originalValues.viewMode = viewMode.value
    originalValues.gridSize = gridSize.value
    originalValues.showFilename = showFilename.value
    originalValues.coverFocalPoint = { ...formData.coverFocalPoint }
  } catch (error) {
    toast.error('Failed to load proofing', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isLoading.value = false
  }
})

// Handlers
const handleNameChange = async () => {
  if (!proofing.value || proofingName.value === proofing.value.name) {
    nameSaved.value = false
    return
  }
  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || null
    await proofingApi.updateProofing(projectId, proofing.value.id, {
      name: proofingName.value,
    })
    proofing.value.name = proofingName.value
    nameSaved.value = true
    setTimeout(() => {
      nameSaved.value = false
    }, 2000)
    toast.success('Name updated', {
      description: 'Proofing name has been updated successfully.',
    })
  } catch (error) {
    nameSaved.value = false
    toast.error('Failed to update name', {
      description: error?.message || 'An unknown error occurred',
    })
    proofingName.value = proofing.value.name || ''
  }
}

const handleDescriptionChange = async () => {
  if (!proofing.value) {
    descriptionSaved.value = false
    return
  }
  const currentDescription = proofing.value.description || ''
  const newDescription = proofingDescription.value || ''
  if (currentDescription === newDescription) {
    descriptionSaved.value = false
    return
  }
  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || null
    await proofingApi.updateProofing(projectId, proofing.value.id, {
      description: newDescription || null,
    })
    proofing.value.description = newDescription
    descriptionSaved.value = true
    setTimeout(() => {
      descriptionSaved.value = false
    }, 2000)
    toast.success('Description updated', {
      description: 'Proofing description has been updated successfully.',
    })
  } catch (error) {
    descriptionSaved.value = false
    toast.error('Failed to update description', {
      description: error?.message || 'An unknown error occurred',
    })
    proofingDescription.value = proofing.value.description || ''
  }
}

const handleColorChange = async () => {
  if (!proofing.value || proofingColor.value === proofing.value.color) {
    colorSaved.value = false
    return
  }
  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || null
    await proofingApi.updateProofing(projectId, proofing.value.id, {
      color: proofingColor.value,
    })
    proofing.value.color = proofingColor.value
    colorSaved.value = true
    setTimeout(() => {
      colorSaved.value = false
    }, 2000)
    toast.success('Color updated', {
      description: 'Proofing color has been updated successfully.',
    })
  } catch (error) {
    colorSaved.value = false
    toast.error('Failed to update color', {
      description: error?.message || 'An unknown error occurred',
    })
    proofingColor.value = proofing.value.color || '#F59E0B'
  }
}

const addAllowedEmail = () => {
  if (!allowedEmails.value) {
    allowedEmails.value = ['']
  } else {
    allowedEmails.value.push('')
  }
}

const removeAllowedEmail = index => {
  if (allowedEmails.value && allowedEmails.value.length > 1) {
    const emailToRemove = allowedEmails.value[index]

    // If removing the primary email, clear primary email
    if (emailToRemove && isPrimaryEmail(emailToRemove)) {
      primaryEmail.value = null
    }

    allowedEmails.value.splice(index, 1)
    // Rebuild touched indices set (shift indices after removed item)
    const newTouched = new Set()
    touchedEmailIndices.value.forEach(i => {
      if (i < index) {
        newTouched.add(i)
      } else if (i > index) {
        newTouched.add(i - 1)
      }
    })
    touchedEmailIndices.value = newTouched
  }
}

const handleAllowedEmailsChange = async (forceSave = false) => {
  if (!proofing.value) return

  // Handle case where event object is passed instead of boolean
  if (forceSave && typeof forceSave !== 'boolean') {
    forceSave = false
  }

  if (isSavingAllowedEmails.value && !forceSave) return

  // Get valid emails (filter out empty and invalid)
  const validEmails = allowedEmails.value
    .map(email => (email || '').trim().toLowerCase())
    .filter(email => {
      if (!email) return false
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    })

  const uniqueEmails = [...new Set(validEmails)]

  // Only save if emails changed (case-insensitive, order-independent comparison)
  if (!forceSave) {
    const currentEmails = proofing.value.allowedEmails || proofing.value.allowed_emails || []
    const currentEmailsNormalized = (Array.isArray(currentEmails) ? currentEmails : [])
      .map(e => (e || '').toLowerCase().trim())
      .filter(Boolean)
    const currentEmailsSet = new Set(currentEmailsNormalized)
    const newEmailsSet = new Set(uniqueEmails)

    // Check if sets are equal
    const emailsMatch =
      currentEmailsSet.size === newEmailsSet.size &&
      [...currentEmailsSet].every(email => newEmailsSet.has(email))

    if (emailsMatch) {
      console.log('Emails unchanged, skipping save', { currentEmails, uniqueEmails })
      return
    }
  }

  console.log('Saving emails', {
    proofingId: proofing.value.id,
    projectId: proofing.value.projectId || proofing.value.project_uuid,
    uniqueEmails,
    forceSave,
    currentEmails: proofing.value.allowedEmails || proofing.value.allowed_emails,
  })

  isSavingAllowedEmails.value = true
  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || null

    // Prepare update payload
    const updatePayload = {
      allowedEmails: uniqueEmails, // Always send array, even if empty
    }

    // Include primary email if set and valid
    if (primaryEmail.value) {
      const normalizedPrimary = primaryEmail.value.trim().toLowerCase()
      // Ensure primary email is in the allowed emails list
      if (uniqueEmails.includes(normalizedPrimary)) {
        updatePayload.primaryEmail = normalizedPrimary
      } else {
        // If primary email is not in allowed emails, clear it
        primaryEmail.value = null
        updatePayload.primaryEmail = null
      }
    } else {
      // Explicitly set to null if no primary email
      updatePayload.primaryEmail = null
    }

    console.log('Sending update payload with primaryEmail', {
      updatePayload,
      primaryEmail: primaryEmail.value,
      uniqueEmails,
    })

    const result = await proofingApi.updateProofing(projectId, proofing.value.id, updatePayload)

    console.log('Update API response', { result })

    // Refresh proofing from backend to ensure we have the latest data
    const refreshedProofing = await proofingApi.fetchProofing(proofing.value.id, projectId)
    const savedEmails = refreshedProofing?.allowedEmails || refreshedProofing?.allowed_emails || []
    const savedPrimaryEmail =
      refreshedProofing?.primaryEmail || refreshedProofing?.primary_email || null

    console.log('Refreshed proofing', {
      refreshedProofing,
      savedEmails,
      savedPrimaryEmail,
      expectedEmails: uniqueEmails,
      match: JSON.stringify(savedEmails.sort()) === JSON.stringify(uniqueEmails.sort()),
    })

    if (refreshedProofing) {
      proofing.value = refreshedProofing
      proofing.value.allowedEmails = savedEmails
      proofing.value.allowed_emails = savedEmails
      proofing.value.primaryEmail = savedPrimaryEmail
      proofing.value.primary_email = savedPrimaryEmail

      // Update the emails array to match what was saved
      // Normalize emails to ensure consistency
      const normalizedSavedEmails = savedEmails.map(e => e?.toLowerCase().trim()).filter(Boolean)
      if (normalizedSavedEmails.length > 0) {
        allowedEmails.value = [...normalizedSavedEmails, ''] // Add empty field for next email
      } else {
        allowedEmails.value = ['']
      }

      // Ensure primary email matches one of the saved emails (case-insensitive)
      await nextTick()
      if (savedPrimaryEmail) {
        const normalizedPrimary = savedPrimaryEmail.toLowerCase().trim()
        // Find matching email in the array (case-insensitive)
        const matchingEmail = normalizedSavedEmails.find(e => {
          const normalized = (e || '').toLowerCase().trim()
          return normalized === normalizedPrimary
        })
        if (matchingEmail) {
          // Update primaryEmail to match the exact email from the array
          primaryEmail.value = matchingEmail.toLowerCase().trim()
        } else {
          primaryEmail.value = normalizedPrimary
        }
        console.log('Primary email updated after save', {
          savedPrimaryEmail,
          normalizedPrimary,
          matchingEmail,
          normalizedSavedEmails,
          finalPrimaryEmail: primaryEmail.value,
          allowedEmailsAfterUpdate: allowedEmails.value,
        })
      } else {
        primaryEmail.value = null
        console.log('Primary email cleared after save')
      }

      // Force reactivity update
      await nextTick()
    } else {
      // Fallback: update local state
      proofing.value.allowedEmails = uniqueEmails
      proofing.value.allowed_emails = uniqueEmails
    }

    emailsSaved.value = true
    setTimeout(() => {
      emailsSaved.value = false
    }, 3000)

    toast.success('Emails updated', {
      description: `${uniqueEmails.length} email(s) saved successfully.`,
    })
  } catch (error) {
    console.error('Failed to save emails', error)
    emailsSaved.value = false
    toast.error('Failed to update emails', {
      description: error?.message || 'An unknown error occurred',
    })
    throw error // Re-throw so handleSaveAll can catch it
  } finally {
    isSavingAllowedEmails.value = false
  }
}

const handlePasswordToggle = async value => {
  if (!proofing.value) return
  hasPassword.value = value

  if (!value) {
    // Removing password
    try {
      const projectId = proofing.value.projectId || proofing.value.project_uuid || null
      const updatedProofing = await proofingApi.updateProofing(projectId, proofing.value.id, {
        password: null,
      })
      currentPassword.value = ''
      // Update proofing object to keep state in sync
      if (updatedProofing) {
        proofing.value = updatedProofing
      } else {
        // Fallback: update local properties
        proofing.value.password = null
        proofing.value.hasPassword = false
      }
      toast.success('Password removed', {
        description: 'Password protection has been removed.',
      })
    } catch (error) {
      toast.error('Failed to remove password', {
        description: error?.message || 'An unknown error occurred',
      })
      hasPassword.value = true
    }
  }
}

const handleSavePassword = async () => {
  if (!proofing.value || !newPassword.value.trim()) {
    toast.error('Password required', {
      description: 'Please enter a password.',
    })
    return
  }

  isSavingPassword.value = true
  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || route.query?.projectId || null
    const proofingId = proofing.value.id || proofing.value.uuid
    
    const updatedProofing = await proofingApi.updateProofing(projectId, proofingId, {
      password: newPassword.value,
    })
    
    hasPassword.value = true
    
    // Update password from backend response
    if (updatedProofing?.password) {
      currentPassword.value = updatedProofing.password
    } else {
      currentPassword.value = newPassword.value // Fallback to the value we just set
    }
    
    // Update proofing object to keep state in sync
    if (updatedProofing) {
      proofing.value = updatedProofing
      proofing.value.password = currentPassword.value
      proofing.value.hasPassword = true
    } else {
      // Fallback: update local properties
      proofing.value.password = currentPassword.value
      proofing.value.hasPassword = true
    }
    
    // Reset state after successful save
    isChangingPassword.value = false
    newPassword.value = ''
    
    toast.success('Password updated', {
      description: 'Password has been updated successfully.',
    })
  } catch (error) {
    toast.error('Failed to update password', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isSavingPassword.value = false
  }
}

const handleCopyPassword = () => {
  if (currentPassword.value) {
    navigator.clipboard.writeText(currentPassword.value)
    toast.success('Password copied', {
      description: 'Password has been copied to clipboard.',
    })
  }
}

const handleGeneratePassword = () => {
  newPassword.value = generatePassword()
  toast.success('Password generated', {
    description: 'A new password has been generated.',
  })
}

const handleMaxRevisionsChange = async () => {
  if (!proofing.value || maxRevisions.value === proofing.value.maxRevisions) {
    maxRevisionsSaved.value = false
    return
  }
  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || null
    await proofingApi.updateProofing(projectId, proofing.value.id, {
      maxRevisions: maxRevisions.value,
    })
    proofing.value.maxRevisions = maxRevisions.value
    maxRevisionsSaved.value = true
    setTimeout(() => {
      maxRevisionsSaved.value = false
    }, 2000)
    toast.success('Max revisions updated', {
      description: 'Maximum revisions has been updated successfully.',
    })
  } catch (error) {
    maxRevisionsSaved.value = false
    toast.error('Failed to update max revisions', {
      description: error?.message || 'An unknown error occurred',
    })
    maxRevisions.value = proofing.value.maxRevisions || 5
  }
}

const handleViewModeChange = () => {
  proofingStore.setViewMode(viewMode.value)
}

const handleGridSizeChange = () => {
  proofingStore.setGridSize(gridSize.value)
}

const handleShowFilenameChange = () => {
  proofingStore.setShowFilename(showFilename.value)
}

const handleTypographyChange = async () => {
  if (!proofing.value) {
    typographySaved.value = false
    return
  }
  
  const proofingDesign = proofing.value.design || proofing.value.settings?.design || {}
  const proofingTypography = proofing.value.typographyDesign || proofingDesign.typography || {}
  const currentFontFamily = proofingTypography.fontFamily || 'sans'
  const currentFontStyle = proofingTypography.fontStyle || 'normal'
  
  if (fontFamily.value === currentFontFamily && fontStyle.value === currentFontStyle) {
    typographySaved.value = false
    return
  }
  
  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || null
    await proofingApi.updateProofing(projectId, proofing.value.id, {
      typographyDesign: {
        fontFamily: fontFamily.value,
        fontStyle: fontStyle.value,
      },
    })
    
    // Update local proofing object
    if (!proofing.value.design) {
      proofing.value.design = {}
    }
    if (!proofing.value.design.typography) {
      proofing.value.design.typography = {}
    }
    proofing.value.design.typography.fontFamily = fontFamily.value
    proofing.value.design.typography.fontStyle = fontStyle.value
    proofing.value.typographyDesign = {
      fontFamily: fontFamily.value,
      fontStyle: fontStyle.value,
    }
    
    typographySaved.value = true
    setTimeout(() => {
      typographySaved.value = false
    }, 2000)
    toast.success('Typography updated', {
      description: 'Typography settings have been updated successfully.',
    })
  } catch (error) {
    typographySaved.value = false
    toast.error('Failed to update typography', {
      description: error?.message || 'An unknown error occurred',
    })
    // Revert to original values
    fontFamily.value = currentFontFamily
    fontStyle.value = currentFontStyle
  }
}


const handleSaveAll = async () => {
  if (!proofing.value?.id || isSaving.value || !hasUnsavedChanges.value) return

  const projectId = proofing.value.projectId || proofing.value.project_uuid || route.query?.projectId || null
  const proofingId = proofing.value.id || proofing.value.uuid

  isSaving.value = true
  try {
    const updateData = {}

    // Name
    if (proofingName.value !== originalValues.name) {
      updateData.name = proofingName.value
    }

    // Description
    if ((proofingDescription.value || '') !== (originalValues.description || '')) {
      updateData.description = proofingDescription.value || null
    }

    // Color
    if (proofingColor.value !== originalValues.color) {
      updateData.color = proofingColor.value
    }

    // Max revisions
    if (maxRevisions.value !== originalValues.maxRevisions) {
      updateData.maxRevisions = maxRevisions.value
    }

    // Typography
    if (fontFamily.value !== originalValues.fontFamily || fontStyle.value !== originalValues.fontStyle) {
      updateData.typographyDesign = {
        fontFamily: fontFamily.value,
        fontStyle: fontStyle.value,
      }
    }

    // Gallery assist
    if (galleryAssist.value !== originalValues.galleryAssist) {
      updateData.galleryAssist = galleryAssist.value
    }

    // Allowed emails and primary email
    const normalizedAllowedEmails = allowedEmails.value
      .map(e => e?.toLowerCase().trim())
      .filter(Boolean)
    const normalizedOriginalEmails = (originalValues.allowedEmails || [])
      .map(e => e?.toLowerCase().trim())
      .filter(Boolean)
    
    if (JSON.stringify(normalizedAllowedEmails.sort()) !== JSON.stringify(normalizedOriginalEmails.sort())) {
      updateData.allowedEmails = normalizedAllowedEmails
    }

    const normalizedPrimaryEmail = primaryEmail.value?.toLowerCase().trim() || null
    const normalizedOriginalPrimary = originalValues.primaryEmail?.toLowerCase().trim() || null
    if (normalizedPrimaryEmail !== normalizedOriginalPrimary) {
      updateData.primaryEmail = normalizedPrimaryEmail
    }

    // Focal point
    if (formData?.coverFocalPoint && (
      formData.coverFocalPoint.x !== originalValues.coverFocalPoint.x ||
      formData.coverFocalPoint.y !== originalValues.coverFocalPoint.y
    )) {
      updateData.cover_focal_point = formData.coverFocalPoint
      updateData.coverFocalPoint = formData.coverFocalPoint
    }

    // View mode, grid size, show filename (store preferences)
    if (viewMode.value !== originalValues.viewMode) {
      proofingStore.setViewMode(viewMode.value)
    }
    if (gridSize.value !== originalValues.gridSize) {
      proofingStore.setGridSize(gridSize.value)
    }
    if (showFilename.value !== originalValues.showFilename) {
      proofingStore.setShowFilename(showFilename.value)
    }

    // Save all changes
    if (Object.keys(updateData).length > 0) {
      const updatedProofing = await proofingApi.updateProofing(projectId, proofingId, updateData)
      
      if (updatedProofing) {
        proofing.value = updatedProofing
        
        // Update original values from saved data
        originalValues.name = updatedProofing.name || proofingName.value
        originalValues.description = updatedProofing.description || ''
        originalValues.color = updatedProofing.color || proofingColor.value
        originalValues.maxRevisions = updatedProofing.maxRevisions || maxRevisions.value
        originalValues.fontFamily = updatedProofing.typographyDesign?.fontFamily || fontFamily.value
        originalValues.fontStyle = updatedProofing.typographyDesign?.fontStyle || fontStyle.value
        originalValues.galleryAssist = updatedProofing.galleryAssist ?? updatedProofing.settings?.general?.galleryAssist ?? galleryAssist.value
        originalValues.allowedEmails = (updatedProofing.allowedEmails || []).map(e => e?.toLowerCase().trim()).filter(Boolean)
        originalValues.primaryEmail = updatedProofing.primaryEmail?.toLowerCase().trim() || null
        originalValues.viewMode = viewMode.value
        originalValues.gridSize = gridSize.value
        originalValues.showFilename = showFilename.value
        
        if (updatedProofing.coverFocalPoint || updatedProofing.cover_focal_point) {
          const savedFocalPoint = updatedProofing.coverFocalPoint || updatedProofing.cover_focal_point
          originalValues.coverFocalPoint = { ...savedFocalPoint }
          formData.coverFocalPoint = { ...savedFocalPoint }
        }

        // Update local reactive values to match saved data
        proofingName.value = originalValues.name
        proofingDescription.value = originalValues.description
        proofingColor.value = originalValues.color
        maxRevisions.value = originalValues.maxRevisions
        fontFamily.value = originalValues.fontFamily
        fontStyle.value = originalValues.fontStyle
        galleryAssist.value = originalValues.galleryAssist
        
        // Update allowed emails array
        if (originalValues.allowedEmails.length > 0) {
          allowedEmails.value = [...originalValues.allowedEmails, '']
        } else {
          allowedEmails.value = ['']
        }
        primaryEmail.value = originalValues.primaryEmail
      }
    }
    
    toast.success('Settings saved', {
      description: 'All settings have been saved successfully.',
    })
  } catch (error) {
    console.error('Failed to save settings', error)
    toast.error('Failed to save settings', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isSaving.value = false
  }
}

const handleFocalPointConfirm = async focalPoint => {
  if (!proofing.value?.id || isSaving.value) return

  const projectId = route.query.projectId || proofing.value?.projectId || proofing.value?.project_uuid || null

  if (!formData) return
  formData.coverFocalPoint = { ...focalPoint }

  // Save immediately
  isSaving.value = true
  try {
    await proofingApi.updateProofing(projectId, proofing.value.id, {
      cover_focal_point: formData.coverFocalPoint,
      coverFocalPoint: formData.coverFocalPoint,
    })

    if (proofing.value && formData?.coverFocalPoint) {
      proofing.value.coverFocalPoint = formData.coverFocalPoint
      proofing.value.cover_focal_point = formData.coverFocalPoint
      proofing.value = { ...proofing.value }
    }

    toast.success('Focal point updated', {
      description: 'The cover focal point has been set successfully.',
    })
  } catch (error) {
    toast.error('Failed to update focal point', {
      description: error?.message || 'An error occurred while setting the focal point.',
    })
  } finally {
    isSaving.value = false
  }
}
</script>
