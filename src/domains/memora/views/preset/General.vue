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

      <!-- Loading State -->
      <div v-if="presetStore.isLoading || isLoadingData || !currentPreset" class="space-y-8">
        <!-- Skeleton Loader -->
        <div v-for="i in 5" :key="i" :class="[theme.borderSecondary, theme.bgCard]" class="space-y-4 p-6 rounded-2xl border-2">
          <div class="space-y-2">
            <Skeleton class="h-5 w-32" />
            <Skeleton class="h-4 w-64" />
          </div>
          <Skeleton class="h-12 w-full" />
        </div>
      </div>

      <div v-else class="space-y-8">
        <!-- Collection Tags -->
        <div
          :class="[theme.borderSecondary, theme.bgCard]"
          class="space-y-3 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
        >
          <div>
            <label class="text-sm font-semibold block mb-2" :class="theme.textPrimary">
              Collection Tags
            </label>
            <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
              Add tags to categorize different collections e.g. wedding, outdoor, summer.
              <a
                href="#"
                class="text-accent hover:text-accent hover:underline font-medium transition-colors"
              >
                Learn more
              </a>
            </p>
          </div>
          <div
            class="flex flex-wrap gap-2 p-3 min-h-[2.75rem] rounded-lg border-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent/50"
            :class="[theme.bgInput, theme.borderInput]"
          >
            <span
              v-for="(tag, index) in collectionTags"
              :key="index"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-accent/10 dark:bg-accent/20 text-accent border border-accent/20 dark:border-accent/30 transition-all duration-200 hover:bg-accent/20 dark:hover:bg-accent/30"
            >
              {{ tag }}
              <button
                @click="removeCollectionTag(index)"
                class="ml-0.5 hover:bg-accent/20 dark:hover:bg-accent/30 rounded-full p-0.5 transition-colors"
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
        </div>

        <!-- Photo Sets -->
        <div
          :class="[theme.borderSecondary, theme.bgCard]"
          class="space-y-3 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
        >
          <div>
            <label class="text-sm font-semibold block mb-2" :class="theme.textPrimary">
              Photo Sets
            </label>
            <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
              Separate photo sets by comma. e.g. Highlights, Reception, Getting Ready
            </p>
          </div>
          <div
            class="flex flex-wrap gap-2 p-3 min-h-[2.75rem] rounded-lg border-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent/50"
            :class="[theme.bgInput, theme.borderInput]"
          >
            <span
              v-for="(tag, index) in photoSets"
              :key="index"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-accent/10 dark:bg-accent/20 text-accent border border-accent/20 dark:border-accent/30 transition-all duration-200 hover:bg-accent/20 dark:hover:bg-accent/30"
            >
              {{ tag }}
              <button
                @click="removePhotoSet(index)"
                class="ml-0.5 hover:bg-accent/20 dark:hover:bg-accent/30 rounded-full p-0.5 transition-colors"
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
        </div>

        <!-- Default Watermark -->
        <div
          :class="[theme.borderSecondary, theme.bgCard]"
          class="space-y-3 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
        >
          <div>
            <label class="text-sm font-semibold block mb-2" :class="theme.textPrimary">
              Default Watermark
            </label>
            <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
              Set the default watermark to apply to photos. Manage watermarks in
              <a
                href="#"
                class="text-accent hover:text-accent hover:underline font-medium transition-colors"
              >
                App Settings
              </a>
              .
            </p>
          </div>
          <Select v-model="formData.defaultWatermark">
            <SelectTrigger
              :class="[
                theme.bgInput,
                theme.borderInput,
                theme.textInput,
                'border-2 transition-all duration-200 focus:ring-2 focus:ring-accent/20 focus:border-accent/50',
              ]"
            >
              <SelectValue placeholder="Select watermark" />
            </SelectTrigger>
            <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
              <SelectItem
                value="none"
                label="No watermark"
                :class="[theme.textPrimary, theme.bgButtonHover, 'hover:bg-accent/10 dark:hover:bg-accent/20']"
              >
                No watermark
              </SelectItem>
              <SelectItem
                v-for="watermark in watermarks"
                :key="watermark.id"
                :value="watermark.id"
                :label="watermark.name"
                :class="[theme.textPrimary, theme.bgButtonHover, 'hover:bg-accent/10 dark:hover:bg-accent/20']"
              >
                {{ watermark.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Email Registration -->
        <div
          :class="[theme.borderSecondary, theme.bgCard]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                Email Registration
              </h3>
              <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                Track email addresses accessing this collection.
                <a
                  href="#"
                  class="text-accent hover:text-accent hover:underline font-medium transition-colors"
                >
                  Learn more
                </a>
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-medium min-w-[2.5rem] text-right transition-colors"
                  :class="formData.emailRegistration ? theme.textPrimary : theme.textSecondary"
                >
                  {{ formData.emailRegistration ? 'On' : 'Off' }}
                </span>
                <label class="relative inline-flex items-center group cursor-pointer">
                  <input type="checkbox" v-model="formData.emailRegistration" class="sr-only peer" />
                  <div
                    class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:shadow-lg peer-checked:bg-accent peer-checked:shadow-accent/50"
                    :class="
                      formData.emailRegistration
                        ? 'bg-accent shadow-accent/50'
                        : 'bg-gray-300 dark:bg-gray-600'
                    "
                  ></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Gallery Assist -->
        <div
          :class="[theme.borderSecondary, theme.bgCard]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Gallery Assist</h3>
              <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                Add walk-through cards to help visitors use the collection.
                <a
                  href="#"
                  class="text-accent hover:text-accent hover:underline font-medium transition-colors"
                >
                  Learn more
                </a>
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-medium min-w-[2.5rem] text-right transition-colors"
                  :class="formData.galleryAssist ? theme.textPrimary : theme.textSecondary"
                >
                  {{ formData.galleryAssist ? 'On' : 'Off' }}
                </span>
                <label class="relative inline-flex items-center group cursor-pointer">
                  <input type="checkbox" v-model="formData.galleryAssist" class="sr-only peer" />
                  <div
                    class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:shadow-lg peer-checked:bg-accent peer-checked:shadow-accent/50"
                    :class="
                      formData.galleryAssist
                        ? 'bg-accent shadow-accent/50'
                        : 'bg-gray-300 dark:bg-gray-600'
                    "
                  ></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Slideshow -->
        <div
          :class="[theme.borderSecondary, theme.bgCard]"
          class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">Slideshow</h3>
              <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                Allow visitors to view the images in their collection as a slideshow.
                <a
                  href="#"
                  class="text-accent hover:text-accent hover:underline font-medium transition-colors"
                  >Learn more</a
                >
              </p>
            </div>
            <div class="flex-shrink-0 pt-1">
              <div class="flex items-center gap-3">
                <span
                  class="text-sm font-medium min-w-[2.5rem] text-right transition-colors"
                  :class="formData.slideshow ? theme.textPrimary : theme.textSecondary"
                >
                  {{ formData.slideshow ? 'On' : 'Off' }}
                </span>
                <label class="relative inline-flex items-center group cursor-pointer">
                  <input type="checkbox" v-model="formData.slideshow" class="sr-only peer" />
                  <div
                    class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:shadow-lg peer-checked:bg-accent peer-checked:shadow-accent/50"
                    :class="
                      formData.slideshow
                        ? 'bg-accent shadow-accent/50'
                        : 'bg-gray-300 dark:bg-gray-600'
                    "
                  ></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Additional Options (Expandable) -->
          <div
            v-if="formData.slideshow"
            class="pt-4 border-t space-y-5"
            :class="theme.borderSecondary"
          >
            <button
              @click="showSlideshowOptions = !showSlideshowOptions"
              class="flex items-center gap-2 text-sm font-semibold transition-colors group"
              :class="[
                showSlideshowOptions
                  ? 'text-accent'
                  : theme.textPrimary,
                'hover:text-accent',
              ]"
            >
              <ChevronDown
                class="h-4 w-4 transition-transform duration-200"
                :class="showSlideshowOptions ? 'rotate-180' : ''"
              />
              Additional options
            </button>

            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[500px]"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-[500px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="showSlideshowOptions" class="space-y-5 pl-6 overflow-hidden">
                <!-- Slideshow Speed -->
                <div class="space-y-3">
                  <label class="text-sm font-semibold block" :class="theme.textPrimary">
                    Slideshow Speed
                  </label>
                  <div class="flex items-center gap-6">
                    <label
                      class="flex items-center gap-2.5 cursor-pointer group"
                      :class="formData.slideshowSpeed === 'slow' ? '' : 'opacity-60 hover:opacity-100'"
                    >
                      <input
                        type="radio"
                        v-model="formData.slideshowSpeed"
                        value="slow"
                        class="w-4 h-4 text-accent focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all cursor-pointer"
                        :checked="formData.slideshowSpeed === 'slow'"
                      />
                      <span
                        class="text-sm font-medium transition-colors"
                        :class="
                          formData.slideshowSpeed === 'slow'
                            ? theme.textPrimary
                            : theme.textSecondary
                        "
                      >
                        Slow
                      </span>
                    </label>
                    <label
                      class="flex items-center gap-2.5 cursor-pointer group"
                      :class="
                        formData.slideshowSpeed === 'regular' ? '' : 'opacity-60 hover:opacity-100'
                      "
                    >
                      <input
                        type="radio"
                        v-model="formData.slideshowSpeed"
                        value="regular"
                        class="w-4 h-4 text-accent focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all cursor-pointer"
                        :checked="formData.slideshowSpeed === 'regular'"
                      />
                      <span
                        class="text-sm font-medium transition-colors"
                        :class="
                          formData.slideshowSpeed === 'regular'
                            ? theme.textPrimary
                            : theme.textSecondary
                        "
                      >
                        Regular
                      </span>
                    </label>
                    <label
                      class="flex items-center gap-2.5 cursor-pointer group"
                      :class="formData.slideshowSpeed === 'fast' ? '' : 'opacity-60 hover:opacity-100'"
                    >
                      <input
                        type="radio"
                        v-model="formData.slideshowSpeed"
                        value="fast"
                        class="w-4 h-4 text-accent focus:ring-2 focus:ring-accent/20 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-all cursor-pointer"
                        :checked="formData.slideshowSpeed === 'fast'"
                      />
                      <span
                        class="text-sm font-medium transition-colors"
                        :class="
                          formData.slideshowSpeed === 'fast'
                            ? theme.textPrimary
                            : theme.textSecondary
                        "
                      >
                        Fast
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Auto Loop -->
                <div
                  class="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-accent/50 hover:shadow-sm"
                  :class="[theme.borderSecondary, theme.bgCard]"
                >
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold mb-1" :class="theme.textPrimary">Auto Loop</h4>
                    <p class="text-xs leading-relaxed" :class="theme.textSecondary">
                      Automatically loop the slideshow when it reaches the end.
                    </p>
                  </div>
                  <div class="flex items-center gap-3 flex-shrink-0">
                    <span
                      class="text-sm font-medium min-w-[2.5rem] text-right transition-colors"
                      :class="
                        formData.slideshowAutoLoop ? theme.textPrimary : theme.textSecondary
                      "
                    >
                      {{ formData.slideshowAutoLoop ? 'On' : 'Off' }}
                    </span>
                    <label class="relative inline-flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="formData.slideshowAutoLoop"
                        class="sr-only peer"
                      />
                      <div
                        class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:shadow-lg peer-checked:bg-accent peer-checked:shadow-accent/50"
                        :class="
                          formData.slideshowAutoLoop
                            ? 'bg-accent shadow-accent/50'
                            : 'bg-gray-300 dark:bg-gray-600'
                        "
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Social Sharing -->
        <div
          class="flex items-center justify-between p-5 rounded-lg border transition-all duration-200 hover:border-accent/50"
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
                    ? 'bg-accent shadow-accent/50'
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
              variant="accent"
              :disabled="false"
              :loading="isSubmitting || isSaving"
              loading-label="Saving..."
              class="shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              @click="handleNext"
            >
              Next →
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
import { ref, reactive, computed, watch, onMounted, onUnmounted, Transition } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUnsavedChangesGuard } from '@/shared/composables/useUnsavedChangesGuard'
import { ChevronDown, Loader2, Check, X } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import PresetLayout from '@/shared/layouts/PresetLayout.vue'
import UnsavedChangesModal from '@/shared/components/organisms/UnsavedChangesModal.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { toast } from '@/shared/utils/toast'
import { getErrorMessage } from '@/shared/utils/errors'
import { usePresetStore } from '@/domains/memora/stores/preset'
import { useWatermarkStore } from '@/domains/memora/stores/watermark'
import { Skeleton } from '@/shared/components/shadcn/skeleton'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const presetStore = usePresetStore()
const watermarkStore = useWatermarkStore()

const currentPreset = computed(() => {
  const idParam = route.params.id
  if (idParam) {
    return presetStore.getPresetById(idParam)
  }
  return null
})

const presetId = computed(() => {
  return currentPreset.value?.id || null
})

const presetName = computed(() => {
  return currentPreset.value?.name || 'Demo Test Preset'
})

const showSlideshowOptions = ref(true)
const isSubmitting = ref(false)
const isLoadingData = ref(false)
const showUnsavedChangesModal = ref(false)

// Form field refs - declare these first
const defaultWatermark = ref('none')
const emailRegistration = ref(false)
const galleryAssist = ref(false)
const slideshow = ref(true)
const slideshowSpeed = ref('regular')
const slideshowAutoLoop = ref(true)
const socialSharing = ref(true)
const language = ref('en')

// Collection tags with tag input
const collectionTags = ref([])
const collectionTagInput = ref('')

// Photo sets with tags
const photoSets = ref(['Highlights'])
const photoSetInput = ref('')

// Form data - now we can reference the refs above
const formData = reactive({
  collectionTags: collectionTags.value,
  defaultWatermark: defaultWatermark.value,
  emailRegistration: emailRegistration.value,
  galleryAssist: galleryAssist.value,
  slideshow: slideshow.value,
  slideshowSpeed: slideshowSpeed.value,
  slideshowAutoLoop: slideshowAutoLoop.value,
  socialSharing: socialSharing.value,
  language: language.value,
})

// Store original loaded data for comparison
const originalData = ref(null)

const hasUnsavedChanges = computed(() => {
  if (!originalData.value || isLoadingData.value) {
    return false
  }
  // Compare form data
  const formChanged =
    formData.defaultWatermark !== originalData.value.formData.defaultWatermark ||
    formData.emailRegistration !== originalData.value.formData.emailRegistration ||
    formData.galleryAssist !== originalData.value.formData.galleryAssist ||
    formData.slideshow !== originalData.value.formData.slideshow ||
    formData.slideshowSpeed !== originalData.value.formData.slideshowSpeed ||
    formData.slideshowAutoLoop !== originalData.value.formData.slideshowAutoLoop ||
    formData.socialSharing !== originalData.value.formData.socialSharing ||
    formData.language !== originalData.value.formData.language

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
  if (currentPreset.value && !isLoadingData.value) {
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

    // Load photo sets - ensure we always get the array from the preset
    let loadedPhotoSets = ['Highlights']
    if (currentPreset.value.photoSets) {
      if (Array.isArray(currentPreset.value.photoSets) && currentPreset.value.photoSets.length > 0) {
        loadedPhotoSets = [...currentPreset.value.photoSets]
      }
    }

    defaultWatermark.value = currentPreset.value.defaultWatermarkId || 'none'
    emailRegistration.value = currentPreset.value.emailRegistration ?? false
    galleryAssist.value = currentPreset.value.galleryAssist ?? false
    slideshow.value = currentPreset.value.slideshow ?? true
    slideshowSpeed.value = currentPreset.value.slideshowSpeed || 'regular'
    slideshowAutoLoop.value = currentPreset.value.slideshowAutoLoop ?? true
    socialSharing.value = currentPreset.value.socialSharing ?? true
    language.value = currentPreset.value.language || 'en'
    collectionTags.value = loadedCollectionTags
    photoSets.value = loadedPhotoSets

    Object.assign(formData, {
      collectionTags: loadedCollectionTags,
      defaultWatermark: defaultWatermark.value,
      emailRegistration: emailRegistration.value,
      galleryAssist: galleryAssist.value,
      slideshow: slideshow.value,
      slideshowSpeed: slideshowSpeed.value,
      slideshowAutoLoop: slideshowAutoLoop.value,
      socialSharing: socialSharing.value,
      language: language.value,
    })

    originalData.value = {
      formData: { ...formData },
      collectionTags: [...loadedCollectionTags],
      photoSets: [...loadedPhotoSets],
    }
    presetStore.setCurrentPreset(currentPreset.value.id)
    isLoadingData.value = false
  }
}

// Watch for route changes to load preset and reload data
watch(
  () => route.params.id,
  async (idParam) => {
    if (idParam) {
      // Check if preset exists in store
      let preset = presetStore.getPresetById(idParam)
      
      // If not found, fetch only this single preset
      if (!preset) {
        try {
          preset = await presetStore.loadPreset(idParam)
        } catch (error) {
          // Silently fail
          console.error('Failed to load preset:', error)
        }
      }
      
      // Load preset data once we have it
      if (preset) {
        loadPresetData()
      }
    }
  },
  { immediate: true }
)

// Keyboard shortcut handler
let keyDownHandler = null

// Initialize on mount
onMounted(() => {
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
      defaultWatermarkId: formData.defaultWatermark === 'none' ? null : formData.defaultWatermark,
      emailRegistration: formData.emailRegistration,
      galleryAssist: formData.galleryAssist,
      slideshow: formData.slideshow,
      slideshowSpeed: formData.slideshowSpeed,
      slideshowAutoLoop: formData.slideshowAutoLoop,
      socialSharing: formData.socialSharing,
      language: formData.language,
    })

    if (originalData.value) {
      originalData.value = {
        formData: { ...formData },
        collectionTags: [...collectionTags.value],
        photoSets: [...photoSets.value],
      }
    }
    toast.success('Preset saved successfully')
  } catch (error) {
    toast.error('Failed to save preset', {
      description: getErrorMessage(error, 'An unknown error occurred'),
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
      defaultWatermarkId: formData.defaultWatermark === 'none' ? null : formData.defaultWatermark,
      emailRegistration: formData.emailRegistration,
      galleryAssist: formData.galleryAssist,
      slideshow: formData.slideshow,
      slideshowSpeed: formData.slideshowSpeed,
      slideshowAutoLoop: formData.slideshowAutoLoop,
      socialSharing: formData.socialSharing,
      language: formData.language,
    })

    if (originalData.value) {
      originalData.value = {
        formData: { ...formData },
        collectionTags: [...collectionTags.value],
        photoSets: [...photoSets.value],
      }
    }

    // Navigate to Design tab
    if (presetId.value) {
      router.push({
        name: 'presetDesign',
        params: { id: presetId.value },
      })
    }
  } catch (error) {
    toast.error('Failed to save preset', {
      description: getErrorMessage(error, 'An unknown error occurred'),
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
      defaultWatermarkId: formData.defaultWatermark === 'none' ? null : formData.defaultWatermark,
      emailRegistration: formData.emailRegistration,
      galleryAssist: formData.galleryAssist,
      slideshow: formData.slideshow,
      slideshowSpeed: formData.slideshowSpeed,
      slideshowAutoLoop: formData.slideshowAutoLoop,
      socialSharing: formData.socialSharing,
      language: formData.language,
    })

    if (originalData.value) {
      originalData.value = {
        formData: { ...formData },
        collectionTags: [...collectionTags.value],
        photoSets: [...photoSets.value],
      }
    }
    return true
  } catch (error) {
    toast.error('Failed to save preset', {
      description: getErrorMessage(error, 'An unknown error occurred'),
    })
    return false
  }
}

const isSaving = computed(() => presetStore.isLoading)

// Discard function to reset form data to original state
const discardChanges = () => {
  if (originalData.value) {
    Object.assign(formData, originalData.value.formData)
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
