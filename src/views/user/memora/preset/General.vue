<template>
  <PresetLayout>
    <div class="max-w-3xl mx-auto p-8 pb-16">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2" :class="theme.textPrimary">General</h1>
        <p class="text-sm" :class="theme.textSecondary">
          Configure general settings for your collection preset
        </p>
      </div>

      <div class="space-y-10">
        <!-- Collection Tags -->
        <div class="space-y-2">
          <label class="text-sm font-medium" :class="theme.textPrimary"> Collection Tags </label>
          <Input
            v-model="formData.collectionTags"
            placeholder="e.g. wedding, outdoor, summer"
            :class="[
              theme.bgInput,
              theme.borderInput,
              theme.textInput,
              'transition-all duration-200 focus:ring-2 focus:ring-teal-500/20',
            ]"
          />
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
              <SelectItem value="none" :class="[theme.textPrimary, theme.bgButtonHover]">
                No watermark
              </SelectItem>
              <SelectItem
                v-for="watermark in watermarks"
                :key="watermark.id"
                :value="watermark.id"
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
              <a href="#" class="text-xs text-teal-500 hover:text-teal-600 underline"> Upgrade </a>
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
                Allow visitors to view the images in their collection as a slideshow.
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
              <SelectItem value="en" :class="[theme.textPrimary, theme.bgButtonHover]">
                English
              </SelectItem>
              <SelectItem value="es" :class="[theme.textPrimary, theme.bgButtonHover]">
                Spanish
              </SelectItem>
              <SelectItem value="fr" :class="[theme.textPrimary, theme.bgButtonHover]">
                French
              </SelectItem>
              <SelectItem value="de" :class="[theme.textPrimary, theme.bgButtonHover]">
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
      <div class="flex justify-end mt-8 pt-6 border-t" :class="theme.borderSecondary">
        <Button
          @click="handleNext"
          :disabled="isSubmitting || isSaving"
          class="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="isSubmitting || isSaving" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="isSubmitting || isSaving">Saving...</span>
          <span v-else>Next →</span>
        </Button>
      </div>
    </div>
  </PresetLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Info, Plus, ChevronDown, Loader2, Check } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import PresetLayout from '@/layouts/PresetLayout.vue'
import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'
import { usePresetStore } from '@/stores/preset'
import { useWatermarkStore } from '@/stores/watermark'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()

// Get preset from store based on route params
const currentPreset = computed(() => {
  const nameParam = route.params.name as string
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
const hasUnsavedChanges = ref(false)
const isSubmitting = ref(false)
const isLoadingData = ref(false)

// Form data
const formData = ref({
  collectionTags: '',
  defaultWatermark: 'none',
  emailRegistration: false,
  galleryAssist: false,
  slideshow: true,
  socialSharing: true,
  language: 'en',
})

// Photo sets with tags
const photoSets = ref<string[]>(['Highlights'])
const photoSetInput = ref('')

// Watermarks list
const watermarks = computed(() => watermarkStore.watermarks)

// Load preset data
const loadPresetData = () => {
  if (currentPreset.value) {
    isLoadingData.value = true
    formData.value = {
      collectionTags: currentPreset.value.collectionTags || '',
      defaultWatermark: currentPreset.value.defaultWatermark || 'none',
      emailRegistration: currentPreset.value.emailRegistration ?? false,
      galleryAssist: currentPreset.value.galleryAssist ?? false,
      slideshow: currentPreset.value.slideshow ?? true,
      socialSharing: currentPreset.value.socialSharing ?? true,
      language: currentPreset.value.language || 'en',
    }
    photoSets.value =
      currentPreset.value.photoSets && currentPreset.value.photoSets.length > 0
        ? currentPreset.value.photoSets
        : ['Highlights']
    presetStore.setCurrentPreset(currentPreset.value.id)
    // Reset unsaved changes flag after loading
    hasUnsavedChanges.value = false
    isLoadingData.value = false
  }
}

// Watch for route changes to reload preset data
watch(
  () => route.params.name,
  () => {
    loadPresetData()
  },
  { immediate: false }
)

// Watch for form changes
watch(
  [formData, photoSets],
  () => {
    // Don't mark as changed when loading data
    if (!isLoadingData.value) {
      hasUnsavedChanges.value = true
    }
  },
  { deep: true }
)

// Keyboard shortcut handler
let keyDownHandler: ((e: KeyboardEvent) => void) | null = null

// Initialize on mount
onMounted(async () => {
  loadPresetData()

  // Fetch watermarks
  try {
    await watermarkStore.fetchWatermarks()
  } catch (error: any) {
    console.error('Failed to fetch watermarks:', error)
  }

  // Add keyboard shortcut for save (Cmd+S / Ctrl+S)
  keyDownHandler = (e: KeyboardEvent) => {
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

const removePhotoSet = (index: number) => {
  photoSets.value.splice(index, 1)
}

const handleSave = async () => {
  if (!presetId.value) {
    toast.error('Preset not found')
    return
  }

  try {
    await presetStore.updatePreset(presetId.value, {
      collectionTags: formData.value.collectionTags,
      photoSets: photoSets.value,
      defaultWatermark: formData.value.defaultWatermark,
      emailRegistration: formData.value.emailRegistration,
      galleryAssist: formData.value.galleryAssist,
      slideshow: formData.value.slideshow,
      socialSharing: formData.value.socialSharing,
      language: formData.value.language,
    })

    hasUnsavedChanges.value = false
    toast.success('Preset saved successfully', {
      description: `"${presetName.value}" has been updated.`,
      icon: Check,
    })
  } catch (error: any) {
    toast.error('Failed to save preset', {
      description: error.message || 'An error occurred while saving.',
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
      collectionTags: formData.value.collectionTags,
      photoSets: photoSets.value,
      defaultWatermark: formData.value.defaultWatermark,
      emailRegistration: formData.value.emailRegistration,
      galleryAssist: formData.value.galleryAssist,
      slideshow: formData.value.slideshow,
      socialSharing: formData.value.socialSharing,
      language: formData.value.language,
    })

    hasUnsavedChanges.value = false

    // Navigate to Design tab
    router.push({
      name: 'presetDesign',
      params: { name: route.params.name },
    })
  } catch (error: any) {
    toast.error('Failed to save preset', {
      description: error.message || 'An error occurred while saving.',
    })
  } finally {
    isSubmitting.value = false
  }
}

const isSaving = computed(() => presetStore.isLoading)
</script>
