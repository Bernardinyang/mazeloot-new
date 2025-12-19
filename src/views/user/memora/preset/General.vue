<template>
  <PresetLayout>
    <div class="max-w-3xl mx-auto p-8 pb-16">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-3xl font-bold" :class="theme.textPrimary">General</h1>
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-x-2"
            enter-to-class="opacity-100 scale-100 translate-x-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-x-0"
            leave-to-class="opacity-0 scale-95 -translate-x-2"
          >
            <div
              v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
              class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span>Unsaved changes</span>
            </div>
          </Transition>
        </div>
        <p class="text-sm" :class="theme.textSecondary">
          Configure general settings for your collection preset
        </p>
      </div>

      <div class="space-y-10">
        <!-- Collection Tags -->
        <div class="space-y-2">
          <label class="text-sm font-medium" :class="theme.textPrimary"> Collection Tags </label>
          <div
            class="flex flex-wrap gap-2 p-3 min-h-[2.75rem] rounded-lg border transition-all duration-200 focus-within:ring-2 focus-within:ring-teal-500/20"
            :class="[theme.bgInput, theme.borderInput]"
          >
            <span
              v-for="(tag, index) in collectionTags"
              :key="index"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/20 dark:border-teal-500/30 transition-all duration-200 hover:bg-teal-500/20 dark:hover:bg-teal-500/30"
            >
              {{ tag }}
              <button
                @click="removeCollectionTag(index)"
                class="ml-0.5 hover:bg-teal-500/20 dark:hover:bg-teal-500/30 rounded-full p-0.5 transition-colors"
                :class="theme.textSecondary"
              >
                <X class="h-3 w-3" />
              </button>
            </span>
            <input
              v-model="collectionTagInput"
              @keydown.enter.prevent="addCollectionTag"
              @blur="addCollectionTag"
              placeholder="e.g. wedding, outdoor, summer"
              class="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
              :class="theme.textInput"
            />
          </div>
          <p class="text-xs leading-relaxed" :class="theme.textSecondary">
            Add tags to categorize different collections e.g. wedding, outdoor, summer.
            <a href="#" class="text-teal-500 hover:text-teal-600 underline transition-colors">
              Learn more
            </a>
          </p>
        </div>

        <!-- Photo Sets -->
        <div class="space-y-2">
          <label class="text-sm font-medium" :class="theme.textPrimary">Photo Sets</label>
          <div
            class="flex flex-wrap gap-2 p-3 min-h-[2.75rem] rounded-lg border transition-all duration-200 focus-within:ring-2 focus-within:ring-teal-500/20"
            :class="[theme.bgInput, theme.borderInput]"
          >
            <span
              v-for="(tag, index) in photoSets"
              :key="index"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-teal-500/10 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/20 dark:border-teal-500/30 transition-all duration-200 hover:bg-teal-500/20 dark:hover:bg-teal-500/30"
            >
              {{ tag }}
              <button
                @click="removePhotoSet(index)"
                class="ml-0.5 hover:bg-teal-500/20 dark:hover:bg-teal-500/30 rounded-full p-0.5 transition-colors"
                :class="theme.textSecondary"
              >
                <X class="h-3 w-3" />
              </button>
            </span>
            <input
              v-model="photoSetInput"
              @keydown.enter.prevent="addPhotoSet"
              @blur="addPhotoSet"
              placeholder="Type and press Enter"
              class="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
              :class="theme.textInput"
            />
          </div>
          <p class="text-xs leading-relaxed" :class="theme.textSecondary">
            Separate photo sets by comma. e.g. Highlights, Reception, Getting Ready
          </p>
        </div>

        <!-- Default Watermark -->
        <div class="space-y-2">
          <label class="text-sm font-medium" :class="theme.textPrimary"> Default Watermark </label>
          <Select v-model="formData.defaultWatermark">
            <SelectTrigger
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'transition-all duration-200 focus:ring-2 focus:ring-teal-500/20',
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
          <p class="text-xs leading-relaxed" :class="theme.textSecondary">
            Set the default watermark to apply to photos. Manage watermarks in
            <a href="#" class="text-teal-500 hover:text-teal-600 underline transition-colors">
              App Settings
            </a>
            .
          </p>
        </div>

        <!-- Auto Expiry Reminder Email -->
        <div class="space-y-3">
          <div class="flex items-start gap-2">
            <div
              class="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0 mt-0.5"
            >
              <Info class="h-3 w-3 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-sm mb-1" :class="theme.textPrimary">
                Upgrade for Premium Features
              </h3>
              <p class="text-xs mb-2" :class="theme.textSecondary">
                Sending reminder emails to activity lists is only available for upgraded accounts.
                Default settings for activity lists will not apply until you have upgraded.
              </p>
              <UpgradePopover v-model:open="showUpgradePopover">
                <template #trigger>
                  <a
                    href="#"
                    @click.prevent="showUpgradePopover = true"
                    class="text-xs text-teal-500 hover:text-teal-600 underline"
                  >
                    Upgrade
                  </a>
                </template>
              </UpgradePopover>
            </div>
          </div>
          <button
            class="flex items-center gap-2 text-teal-500 hover:text-teal-600 transition-colors"
          >
            <div class="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
              <Plus class="h-4 w-4 text-white" />
            </div>
            <span class="text-sm font-medium">Add expiry reminder email</span>
          </button>
          <p class="text-xs ml-8" :class="theme.textSecondary">
            Setup reminder emails that will send when you create a collection and add an Auto Expiry
            date.
          </p>
        </div>

        <!-- Email Registration -->
        <div
          class="flex items-center justify-between p-5 rounded-lg border transition-all duration-200 hover:border-teal-500/50"
          :class="[theme.borderSecondary, theme.bgCard]"
        >
          <div class="flex-1">
            <h3 class="text-base font-semibold mb-1.5" :class="theme.textPrimary">
              Email Registration
            </h3>
            <p class="text-xs leading-relaxed" :class="theme.textSecondary">
              Track email addresses accessing this collection.
              <a href="#" class="text-teal-500 hover:text-teal-600 underline transition-colors">
                Learn more
              </a>
            </p>
          </div>
          <div class="flex items-center gap-3">
            <label class="relative inline-flex items-center group cursor-pointer">
              <input type="checkbox" v-model="formData.emailRegistration" class="sr-only peer" />
              <div
                class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:shadow-lg"
                :class="
                  formData.emailRegistration
                    ? 'bg-teal-500 shadow-teal-500/50'
                    : 'bg-gray-300 dark:bg-gray-600'
                "
              ></div>
            </label>
            <span
              class="text-sm font-medium min-w-[2rem] transition-colors"
              :class="formData.emailRegistration ? theme.textPrimary : theme.textSecondary"
            >
              {{ formData.emailRegistration ? 'On' : 'Off' }}
            </span>
          </div>
        </div>

        <!-- Gallery Assist -->
        <div
          class="flex items-center justify-between p-5 rounded-lg border transition-all duration-200 hover:border-teal-500/50"
          :class="[theme.borderSecondary, theme.bgCard]"
        >
          <div class="flex-1">
            <h3 class="text-base font-semibold mb-1.5" :class="theme.textPrimary">
              Gallery Assist
            </h3>
            <p class="text-xs leading-relaxed" :class="theme.textSecondary">
              Add walk-through cards to help visitors use the collection.
              <a href="#" class="text-teal-500 hover:text-teal-600 underline transition-colors">
                Learn more
              </a>
            </p>
          </div>
          <div class="flex items-center gap-3">
            <label class="relative inline-flex items-center group cursor-pointer">
              <input type="checkbox" v-model="formData.galleryAssist" class="sr-only peer" />
              <div
                class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:shadow-lg"
                :class="
                  formData.galleryAssist
                    ? 'bg-teal-500 shadow-teal-500/50'
                    : 'bg-gray-300 dark:bg-gray-600'
                "
              ></div>
            </label>
            <span
              class="text-sm font-medium min-w-[2rem] transition-colors"
              :class="formData.galleryAssist ? theme.textPrimary : theme.textSecondary"
            >
              {{ formData.galleryAssist ? 'On' : 'Off' }}
            </span>
          </div>
        </div>

        <!-- Slideshow -->
        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-5 rounded-lg border transition-all duration-200 hover:border-teal-500/50"
            :class="[theme.borderSecondary, theme.bgCard]"
          >
            <div class="flex-1">
              <h3 class="text-base font-semibold mb-1.5" :class="theme.textPrimary">Slideshow</h3>
              <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                Allow visitors to view the images in their collection slideshow.
                <a href="#" class="text-teal-500 hover:text-teal-600 underline transition-colors">
                  Learn more
                </a>
              </p>
            </div>
            <div class="flex items-center gap-3">
              <label class="relative inline-flex items-center group cursor-pointer">
                <input type="checkbox" v-model="formData.slideshow" class="sr-only peer" />
                <div
                  class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:shadow-lg"
                  :class="
                    formData.slideshow
                      ? 'bg-teal-500 shadow-teal-500/50'
                      : 'bg-gray-300 dark:bg-gray-600'
                  "
                ></div>
              </label>
              <span
                class="text-sm font-medium min-w-[2rem] transition-colors"
                :class="formData.slideshow ? theme.textPrimary : theme.textSecondary"
              >
                {{ formData.slideshow ? 'On' : 'Off' }}
              </span>
            </div>
          </div>

          <!-- Additional Options (Expandable) -->
          <div
            v-if="formData.slideshow"
            class="ml-4 pl-4 border-l-2 space-y-4"
            :class="theme.borderSecondary"
          >
            <button
              @click="showSlideshowOptions = !showSlideshowOptions"
              class="flex items-center gap-2 text-sm font-medium"
              :class="theme.textPrimary"
            >
              <ChevronDown
                class="h-4 w-4 transition-transform"
                :class="showSlideshowOptions ? 'rotate-180' : ''"
              />
              Additional options
            </button>
            <div v-if="showSlideshowOptions" class="space-y-4 pl-6">
              <!-- Add slideshow options here -->
              <p class="text-xs" :class="theme.textSecondary">
                Slideshow options will be available here.
              </p>
            </div>
          </div>
        </div>

        <!-- Social Sharing -->
        <div
          class="flex items-center justify-between p-5 rounded-lg border transition-all duration-200 hover:border-teal-500/50"
          :class="[theme.borderSecondary, theme.bgCard]"
        >
          <div class="flex-1">
            <h3 class="text-base font-semibold mb-1.5" :class="theme.textPrimary">
              Social Sharing
            </h3>
            <p class="text-xs leading-relaxed" :class="theme.textSecondary">
              Allow collection visitors to share your work to social media.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <label class="relative inline-flex items-center group cursor-pointer">
              <input type="checkbox" v-model="formData.socialSharing" class="sr-only peer" />
              <div
                class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:shadow-lg"
                :class="
                  formData.socialSharing
                    ? 'bg-teal-500 shadow-teal-500/50'
                    : 'bg-gray-300 dark:bg-gray-600'
                "
              ></div>
            </label>
            <span
              class="text-sm font-medium min-w-[2rem] transition-colors"
              :class="formData.socialSharing ? theme.textPrimary : theme.textSecondary"
            >
              {{ formData.socialSharing ? 'On' : 'Off' }}
            </span>
          </div>
        </div>

        <!-- Language -->
        <div class="space-y-2">
          <label class="text-sm font-medium" :class="theme.textPrimary">Language</label>
          <Select v-model="formData.language">
            <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
              <SelectItem
                value="en"
                label="English"
                :class="[theme.textPrimary, theme.bgButtonHover]"
              >
                English
              </SelectItem>
              <SelectItem
                value="es"
                label="Spanish"
                :class="[theme.textPrimary, theme.bgButtonHover]"
              >
                Spanish
              </SelectItem>
              <SelectItem
                value="fr"
                label="French"
                :class="[theme.textPrimary, theme.bgButtonHover]"
              >
                French
              </SelectItem>
              <SelectItem
                value="de"
                label="German"
                :class="[theme.textPrimary, theme.bgButtonHover]"
              >
                German
              </SelectItem>
            </SelectContent>
          </Select>
          <p class="text-xs" :class="theme.textSecondary">
            Choose the language to display these collections in.
          </p>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="max-w-3xl">
        <div
          class="flex justify-between items-center mt-8 pt-6 border-t"
          :class="theme.borderSecondary"
        >
          <div></div>
          <div class="flex items-center gap-3">
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 scale-95 translate-x-2"
              enter-to-class="opacity-100 scale-100 translate-x-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 translate-x-0"
              leave-to-class="opacity-0 scale-95 translate-x-2"
            >
              <span
                v-if="hasUnsavedChanges && !isSubmitting && !isSaving"
                class="text-xs"
                :class="theme.textTertiary"
              >
                Unsaved changes
              </span>
            </Transition>
            <Button
              @click="handleNext"
              :disabled="isSubmitting || isSaving"
              class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 px-6"
            >
              <Loader2 v-if="isSubmitting || isSaving" class="mr-2 h-4 w-4 animate-spin" />
              <span v-if="isSubmitting || isSaving">Saving...</span>
              <span v-else>Next →</span>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Unsaved Changes Modal -->
    <UnsavedChangesModal
      v-model="showUnsavedChangesModal"
      :is-saving="isSubmitting || isSaving"
      @save="handleSaveAndLeave"
      @discard="handleDiscardAndLeave"
      @cancel="handleCancelNavigation"
    />
  </PresetLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/composables/useUnsavedChangesGuard'
import { Info, Plus, ChevronDown, Loader2, Check, X } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import PresetLayout from '@/layouts/PresetLayout.vue'
import UnsavedChangesModal from '@/components/organisms/UnsavedChangesModal.vue'
import UpgradePopover from '@/components/molecules/UpgradePopover.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from '@/utils/toast'
import { usePresetStore } from '@/stores/preset'
import { useWatermarkStore } from '@/stores/watermark'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()

// Get preset from store based on route params
const currentPreset = computed(() => {
  const nameParam = route.params.name
  if (nameParam) {
    return presetStore.getPresetByName(nameParam)
  }
  return null
})

const presetId = computed(() => {
  return currentPreset.value?.id || null
})

const presetName = computed(() => {
  return currentPreset.value?.name || 'Demo Test Preset'
})

const showSlideshowOptions = ref(false)
const isSubmitting = ref(false)
const isLoadingData = ref(false)
const showUnsavedChangesModal = ref(false)
const showUpgradePopover = ref(false)

// Form field refs - declare these first
const defaultWatermark = ref('none')
const emailRegistration = ref(false)
const galleryAssist = ref(false)
const slideshow = ref(true)
const socialSharing = ref(true)
const language = ref('en')

// Collection tags with tag input
const collectionTags = ref([])
const collectionTagInput = ref('')

// Photo sets with tags
const photoSets = ref(['Highlights'])
const photoSetInput = ref('')

// Form data - now we can reference the refs above
const formData = ref({
  collectionTags: collectionTags.value,
  defaultWatermark: defaultWatermark.value,
  emailRegistration: emailRegistration.value,
  galleryAssist: galleryAssist.value,
  slideshow: slideshow.value,
  socialSharing: socialSharing.value,
  language: language.value,
})

// Store original loaded data for comparison
const originalData = ref(null)

// Check if there are actual unsaved changes by comparing with original data
const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  // Compare form data
  const formChanged =
    formData.value.defaultWatermark !== originalData.value.formData.defaultWatermark ||
    formData.value.emailRegistration !== originalData.value.formData.emailRegistration ||
    formData.value.galleryAssist !== originalData.value.formData.galleryAssist ||
    formData.value.slideshow !== originalData.value.formData.slideshow ||
    formData.value.socialSharing !== originalData.value.formData.socialSharing ||
    formData.value.language !== originalData.value.formData.language

  // Compare collection tags (deep comparison)
  const collectionTagsChanged =
    collectionTags.value.length !== originalData.value.collectionTags.length ||
    collectionTags.value.some((tag, index) => tag !== originalData.value.collectionTags[index])

  // Compare photo sets (deep comparison)
  const photoSetsChanged =
    photoSets.value.length !== originalData.value.photoSets.length ||
    photoSets.value.some((set, index) => set !== originalData.value.photoSets[index])

  return formChanged || collectionTagsChanged || photoSetsChanged
})

// Watermarks list
const watermarks = computed(() => watermarkStore.watermarks)

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value) {
    isLoadingData.value = true

    // Load collection tags - support both string (comma-separated) and array formats
    let loadedCollectionTags = []
    if (currentPreset.value.collectionTags) {
      if (typeof currentPreset.value.collectionTags === 'string') {
        // Parse comma-separated string
        loadedCollectionTags = currentPreset.value.collectionTags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      } else if (Array.isArray(currentPreset.value.collectionTags)) {
        loadedCollectionTags = [...currentPreset.value.collectionTags]
      }
    }

    const loadedPhotoSets =
      currentPreset.value.photoSets && currentPreset.value.photoSets.length > 0
        ? [...currentPreset.value.photoSets]
        : ['Highlights']

    // Update ref values
    defaultWatermark.value = currentPreset.value.defaultWatermark || 'none'
    emailRegistration.value = currentPreset.value.emailRegistration ?? false
    galleryAssist.value = currentPreset.value.galleryAssist ?? false
    slideshow.value = currentPreset.value.slideshow ?? true
    socialSharing.value = currentPreset.value.socialSharing ?? true
    language.value = currentPreset.value.language || 'en'
    collectionTags.value = loadedCollectionTags
    photoSets.value = loadedPhotoSets

    // Update formData
    formData.value = {
      collectionTags: loadedCollectionTags,
      defaultWatermark: defaultWatermark.value,
      emailRegistration: emailRegistration.value,
      galleryAssist: galleryAssist.value,
      slideshow: slideshow.value,
      socialSharing: socialSharing.value,
      language: language.value,
    }

    originalData.value = {
      formData: { ...formData.value },
      collectionTags: [...loadedCollectionTags],
      photoSets: [...loadedPhotoSets],
    }
    presetStore.setCurrentPreset(currentPreset.value.id)
    isLoadingData.value = false
  }
}

// Watch for route changes to reload preset data
watch(
  () => route.params.name,
  () => {
    loadPresetData()
  },
  { immediate: true }
)

// Keyboard shortcut handler
let keyDownHandler = null

// Initialize on mount
onMounted(async () => {
  loadPresetData()

  // Fetch watermarks
  try {
    await watermarkStore.fetchWatermarks()
  } catch (error) {
    console.error('Failed to fetch watermarks:', error)
  }

  // Add keyboard shortcut for save (Cmd+S / Ctrl+S)
  keyDownHandler = e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      if (!isSaving.value && hasUnsavedChanges.value && presetId.value) {
        handleSave()
      }
    }
  }

  window.addEventListener('keydown', keyDownHandler)
})

// Cleanup on unmount
onUnmounted(() => {
  if (keyDownHandler) {
    window.removeEventListener('keydown', keyDownHandler)
  }
})

const addCollectionTag = () => {
  if (collectionTagInput.value.trim()) {
    const tags = collectionTagInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !collectionTags.value.includes(tag))
    if (tags.length > 0) {
      collectionTags.value.push(...tags)
      collectionTagInput.value = ''
    }
  }
}

const removeCollectionTag = index => {
  collectionTags.value.splice(index, 1)
}

const addPhotoSet = () => {
  if (photoSetInput.value.trim()) {
    const tags = photoSetInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !photoSets.value.includes(tag))
    if (tags.length > 0) {
      photoSets.value.push(...tags)
      photoSetInput.value = ''
    }
  }
}

const removePhotoSet = index => {
  photoSets.value.splice(index, 1)
}

const handleSave = async () => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return
  }

  try {
    await presetStore.updatePreset(presetId.value, {
      collectionTags: collectionTags.value.join(','), // Save as comma-separated string for backward compatibility
      photoSets: photoSets.value,
      defaultWatermark: formData.value.defaultWatermark,
      emailRegistration: formData.value.emailRegistration,
      galleryAssist: formData.value.galleryAssist,
      slideshow: formData.value.slideshow,
      socialSharing: formData.value.socialSharing,
      language: formData.value.language,
    })

    // Update original data after successful save
    if (originalData.value) {
      originalData.value = {
        formData: { ...formData.value },
        collectionTags: [...collectionTags.value],
        photoSets: [...photoSets.value],
      }
    }
    toast.success('Preset saved successfully')
  } catch (error) {
    toast.error('Failed to save preset', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

const handleNext = async () => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return
  }

  isSubmitting.value = true

  try {
    // Always save all data before navigating
    await presetStore.updatePreset(presetId.value, {
      collectionTags: collectionTags.value.join(','), // Save as comma-separated string for backward compatibility
      photoSets: photoSets.value,
      defaultWatermark: formData.value.defaultWatermark,
      emailRegistration: formData.value.emailRegistration,
      galleryAssist: formData.value.galleryAssist,
      slideshow: formData.value.slideshow,
      socialSharing: formData.value.socialSharing,
      language: formData.value.language,
    })

    // Update original data after successful save
    if (originalData.value) {
      originalData.value = {
        formData: { ...formData.value },
        collectionTags: [...collectionTags.value],
        photoSets: [...photoSets.value],
      }
    }

    // Navigate to Design tab
    const presetName = currentPreset.value?.name
    if (presetName) {
      const urlFriendlyName = presetName.toLowerCase().replace(/\s+/g, '-')
      router.push({
        name: 'presetDesign',
        params: { name: urlFriendlyName },
      })
    }
  } catch (error) {
    toast.error('Failed to save preset', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isSubmitting.value = false
  }
}

const savePresetGeneral = async () => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return false
  }

  try {
    await presetStore.updatePreset(presetId.value, {
      collectionTags: collectionTags.value.join(','), // Save as comma-separated string for backward compatibility
      photoSets: photoSets.value,
      defaultWatermark: formData.value.defaultWatermark,
      emailRegistration: formData.value.emailRegistration,
      galleryAssist: formData.value.galleryAssist,
      slideshow: formData.value.slideshow,
      socialSharing: formData.value.socialSharing,
      language: formData.value.language,
    })

    // Update original data after successful save
    if (originalData.value) {
      originalData.value = {
        formData: { ...formData.value },
        collectionTags: [...collectionTags.value],
        photoSets: [...photoSets.value],
      }
    }
    return true
  } catch (error) {
    toast.error('Failed to save preset', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
    return false
  }
}

const isSaving = computed(() => presetStore.isLoading)

// Set up unsaved changes guard
// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    formData.value = { ...originalData.value.formData }
    collectionTags.value = [...originalData.value.collectionTags]
    photoSets.value = [...originalData.value.photoSets]
  }
}

const { handleSaveAndLeave, handleDiscardAndLeave, handleCancelNavigation } =
  useUnsavedChangesGuard({
    hasUnsavedChanges,
    isSubmitting,
    isSaving,
    saveFunction: savePresetGeneral,
    discardFunction: discardChanges,
    showUnsavedChangesModal,
  })
</script>
