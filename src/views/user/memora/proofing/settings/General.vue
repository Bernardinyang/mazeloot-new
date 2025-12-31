<template>
  <ProofingLayout :is-loading="isLoading" :proofing="proofing" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading settings...</p>
          </div>
        </div>

        <div v-else class="max-w-[50%] p-6 md:p-8 transition-all duration-300">
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Proofing Name</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    The name of this proofing as it appears in your dashboard and to customers.
                  </p>
                </div>
                <div v-if="nameSaved" class="flex items-center gap-2 text-teal-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <Input
                v-model="proofingName"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-md focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="My Proofing"
                @blur="handleNameChange"
                @keydown.enter="handleNameChange"
              />
            </div>

            <!-- Proofing Description -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Description</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Optional description shown to clients viewing this proofing.
                  </p>
                </div>
                <div v-if="descriptionSaved" class="flex items-center gap-2 text-teal-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <Textarea
                v-model="proofingDescription"
                :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                class="max-w-2xl min-h-[100px] resize-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="Enter a description for this proofing..."
                :maxlength="1000"
                @blur="handleDescriptionChange"
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
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
                <div v-if="colorSaved" class="flex items-center gap-2 text-teal-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <input
                  v-model="proofingColor"
                  :class="theme.borderSecondary"
                  class="h-12 w-20 rounded-lg border-2 cursor-pointer transition-all hover:scale-105"
                  type="color"
                  @change="handleColorChange"
                />
                <Input
                  v-model="proofingColor"
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  class="flex-1 focus:ring-2 focus:ring-teal-500/20 transition-all font-mono text-sm"
                  placeholder="#F59E0B"
                  @blur="handleColorChange"
                  @keydown.enter="handleColorChange"
                />
                <div
                  class="h-12 w-12 rounded-lg border-2 transition-all"
                  :style="{ backgroundColor: proofingColor, borderColor: proofingColor }"
                  :class="theme.borderSecondary"
                ></div>
              </div>
            </div>

            <!-- Allowed Emails -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Allowed Emails
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Specify which email addresses are allowed to access this proofing. Mark one as
                    primary to identify the main contact.
                  </p>
                </div>
                <div v-if="isSavingAllowedEmails" class="flex items-center gap-2 text-teal-500">
                  <Loader2 class="h-4 w-4 animate-spin" />
                  <span class="text-xs font-medium">Saving...</span>
                </div>
              </div>
              <div class="space-y-2 max-w-2xl">
                <div
                  v-for="(email, index) in allowedEmails || []"
                  :key="`email-${index}`"
                  :class="[
                    'group relative flex items-center gap-3 rounded-lg border transition-all duration-200 px-3 py-2',
                    isPrimaryEmail(email) && isValidEmail(email)
                      ? 'bg-teal-50/30 dark:bg-teal-950/10 border-teal-500/40 dark:border-teal-500/30'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700',
                    theme.bgCard,
                  ]"
                >
                  <!-- Primary Indicator Bar -->
                  <div
                    v-if="isPrimaryEmail(email) && isValidEmail(email)"
                    class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-teal-500"
                  ></div>

                  <!-- Radio Button for Primary Selection -->
                  <div class="flex-shrink-0">
                    <label
                      v-if="email && isValidEmail(email)"
                      class="relative flex items-center cursor-pointer"
                      :title="isPrimaryEmail(email) ? 'Primary email' : 'Set as primary'"
                    >
                      <input
                        type="radio"
                        :checked="isPrimaryEmail(email)"
                        :name="`primary-email-${proofing?.id || 'default'}`"
                        class="sr-only peer"
                        @change="setPrimaryEmail(email)"
                      />
                      <div
                        :class="[
                          'w-4 h-4 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                          isPrimaryEmail(email)
                            ? 'border-teal-500 bg-teal-500 shadow-sm ring-2 ring-teal-500/20'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-teal-400 dark:hover:border-teal-500',
                        ]"
                      >
                        <div
                          v-if="isPrimaryEmail(email)"
                          class="w-2 h-2 rounded-full bg-white transition-all duration-200"
                        ></div>
                      </div>
                    </label>
                    <div v-else class="w-4 h-4"></div>
                  </div>

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
                      <!-- Primary Badge -->
                      <span
                        v-if="email && isValidEmail(email) && isPrimaryEmail(email)"
                        class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 whitespace-nowrap"
                      >
                        <Star class="h-3 w-3 fill-teal-600 dark:fill-teal-400 flex-shrink-0" />
                        <span>Primary</span>
                      </span>
                    </div>
                    <p
                      v-if="touchedEmailIndices.has(index) && email && !isValidEmail(email)"
                      class="absolute -bottom-5 left-0 text-xs text-red-500 dark:text-red-400 mt-1"
                    >
                      Please enter a valid email address
                    </p>
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
                  <Button
                    :class="[
                      'bg-teal-500 hover:bg-teal-600 text-white transition-all',
                      isSavingAllowedEmails ? 'opacity-75 cursor-not-allowed' : '',
                    ]"
                    :disabled="isSavingAllowedEmails || !hasValidEmails"
                    size="sm"
                    @click="handleAllowedEmailsChange(true)"
                  >
                    <Loader2 v-if="isSavingAllowedEmails" class="h-4 w-4 mr-2 animate-spin" />
                    <Check v-else-if="emailsSaved" class="h-4 w-4 mr-2" />
                    {{
                      isSavingAllowedEmails ? 'Saving...' : emailsSaved ? 'Saved' : 'Save Emails'
                    }}
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
                        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-500/20 dark:border-teal-500/30"
                      >
                        <Star
                          class="h-3.5 w-3.5 fill-teal-600 dark:fill-teal-400 text-teal-600 dark:text-teal-400"
                        />
                        <span class="text-xs font-medium text-teal-700 dark:text-teal-300">
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
                        class="text-teal-600 dark:text-teal-400"
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
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
                        'w-full focus:ring-2 focus:ring-teal-500/20 transition-all',
                      ]"
                      readonly
                      placeholder="Password"
                    />
                  </div>
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="handleCopyPassword"
                  >
                    <Copy class="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <PasswordInput
                  v-else
                  v-model="newPassword"
                  :input-class="[
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'focus:ring-2 focus:ring-teal-500/20 transition-all',
                  ]"
                  placeholder="Enter new password"
                  @blur="handlePasswordChange"
                />
                <div class="flex items-center gap-2">
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200"
                    size="sm"
                    variant="outline"
                    @click="isChangingPassword = !isChangingPassword"
                  >
                    {{ isChangingPassword ? 'Cancel' : 'Change Password' }}
                  </Button>
                  <Button
                    v-if="isChangingPassword && newPassword"
                    :class="['bg-teal-500 hover:bg-teal-600 text-white']"
                    :disabled="isSavingPassword"
                    size="sm"
                    @click="handleSavePassword"
                  >
                    {{ isSavingPassword ? 'Saving...' : 'Save Password' }}
                  </Button>
                </div>
              </div>
            </div>

            <!-- Max Revisions -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Max Revisions</h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Set the maximum number of revision rounds allowed for this proofing.
                  </p>
                </div>
                <div v-if="maxRevisionsSaved" class="flex items-center gap-2 text-teal-500">
                  <Check class="h-4 w-4" />
                  <span class="text-xs font-medium">Saved</span>
                </div>
              </div>
              <div class="space-y-3 max-w-md">
                <div class="flex items-center gap-3">
                  <Input
                    v-model.number="maxRevisions"
                    :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                    class="max-w-xs focus:ring-2 focus:ring-teal-500/20 transition-all"
                    placeholder="5"
                    type="number"
                    min="1"
                    max="50"
                    @blur="handleMaxRevisionsChange"
                    @keydown.enter="handleMaxRevisionsChange"
                  />
                  <span :class="theme.textSecondary" class="text-sm">revision(s)</span>
                </div>
                <p :class="theme.textSecondary" class="text-xs">
                  Current limit:
                  <span class="font-medium">{{ proofing?.maxRevisions || 5 }} revision(s)</span>
                </p>
              </div>
            </div>

            <!-- Display Preferences -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
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
                      class="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-500/20 transition-all"
                      @change="handleViewModeChange"
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
                      class="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-teal-500/20 transition-all"
                      @change="handleGridSizeChange"
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
                :class="['bg-teal-500 hover:bg-teal-600 text-white']"
                :disabled="isSaving"
                @click="handleSaveAll"
              >
                <Loader2 v-if="isSaving" class="h-4 w-4 mr-2 animate-spin" />
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ProofingLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Plus, X, Loader2, Info, Copy, Star } from 'lucide-vue-next'
import ProofingLayout from '@/layouts/ProofingLayout.vue'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Button } from '@/components/shadcn/button'
import PasswordInput from '@/components/molecules/PasswordInput.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useProofingStore } from '@/stores/proofing'
import { useProofingApi } from '@/api/proofing'
import { toast } from '@/utils/toast'

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

const isPrimaryEmail = email => {
  if (!email || !primaryEmail.value) {
    return false
  }
  const normalizedEmail = (email || '').trim().toLowerCase()
  const normalizedPrimary = (primaryEmail.value || '').trim().toLowerCase()
  const isMatch = normalizedEmail === normalizedPrimary && normalizedEmail !== ''

  // Debug: log when checking primary email
  if (normalizedEmail && normalizedPrimary && normalizedEmail === normalizedPrimary) {
    console.log('✅ Primary email match found', {
      email,
      normalizedEmail,
      primaryEmail: primaryEmail.value,
      normalizedPrimary,
    })
  }

  return isMatch
}

const setPrimaryEmail = async email => {
  if (!email || !isValidEmail(email)) return

  const normalizedEmail = email.trim().toLowerCase()

  // If clicking the same primary email, don't do anything
  if (primaryEmail.value && primaryEmail.value.toLowerCase() === normalizedEmail) {
    return
  }

  const previousPrimary = primaryEmail.value
  // Update primary email locally
  primaryEmail.value = normalizedEmail

  try {
    // Save immediately
    await handleAllowedEmailsChange(true)

    // Show success toast
    if (previousPrimary) {
      toast.success('Primary email updated', {
        description: `${normalizedEmail} is now the primary email.`,
      })
    } else {
      toast.success('Primary email set', {
        description: `${normalizedEmail} has been set as the primary email.`,
      })
    }
  } catch (error) {
    // Revert on error
    primaryEmail.value = previousPrimary
    toast.error('Failed to set primary email', {
      description: error?.message || 'An unknown error occurred',
    })
  }
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
    handleAllowedEmailsChange()
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

const handlePasswordChange = async () => {
  if (!proofing.value || !newPassword.value || isSavingPassword.value) return

  isSavingPassword.value = true
  try {
    const projectId = proofing.value.projectId || proofing.value.project_uuid || null
    const updatedProofing = await proofingApi.updateProofing(projectId, proofing.value.id, {
      password: newPassword.value,
    })
    currentPassword.value = newPassword.value
    newPassword.value = ''
    isChangingPassword.value = false
    // Update proofing object to keep state in sync
    if (updatedProofing) {
      proofing.value = updatedProofing
    } else {
      // Fallback: update local properties
      proofing.value.password = newPassword.value
      proofing.value.hasPassword = true
    }
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

const handleSavePassword = async () => {
  await handlePasswordChange()
}

const handleCopyPassword = () => {
  if (currentPassword.value) {
    navigator.clipboard.writeText(currentPassword.value)
    toast.success('Password copied', {
      description: 'Password has been copied to clipboard.',
    })
  }
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

const handleSaveAll = async () => {
  isSaving.value = true
  try {
    // Save all pending changes (force save for emails to ensure they're saved)
    await Promise.all([
      handleNameChange(),
      handleColorChange(),
      handleAllowedEmailsChange(true), // Force save
      handleMaxRevisionsChange(),
    ])
    toast.success('Settings saved', {
      description: 'All settings have been saved successfully.',
    })
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error?.message || 'An unknown error occurred',
    })
  } finally {
    isSaving.value = false
  }
}
</script>
