<template>
  <div v-if="isLoading" class="space-y-6">
    <!-- Skeleton Loader -->
    <div
      v-for="i in 2"
      :key="i"
      class="space-y-4 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600/70"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <Skeleton class="h-6 w-40 rounded-md mb-2" />
          <Skeleton class="h-3 w-96 rounded-md mb-3" />
        </div>
        <Skeleton class="h-6 w-12 rounded-md" />
      </div>
      <div class="space-y-3">
        <Skeleton class="h-10 w-32 rounded-md" />
        <Skeleton class="h-24 w-full rounded-md" />
      </div>
    </div>
  </div>
  <div v-else class="space-y-6">
    <!-- Limit Media Downloads -->
    <div
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Limit Media Downloads</h3>
          <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
            Set the number of photos that can be downloaded in this collection. Note that this limit
            is shared between all visitors who can download. If you restrict downloads to contacts
            only, each client will be able to download their own set of photos up to the limit.
            <a href="#" class="text-violet-600 dark:text-violet-400 hover:underline font-medium"
              >Learn more</a
            >
          </p>
        </div>
        <div class="flex-shrink-0 pt-1">
          <ToggleSwitch v-model="limitDownloads" label="" />
        </div>
      </div>
      <div v-if="limitDownloads" class="flex items-center gap-3 max-w-md mt-3">
        <Input
          type="number"
          :model-value="downloadLimit"
          @update:model-value="downloadLimit = Number($event)"
          min="1"
          class="w-20 focus:ring-2 focus:ring-accent/20"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
        />
        <span class="text-sm font-medium" :class="theme.textPrimary">photo</span>
      </div>
    </div>

    <!-- Restrict Downloads to Specific Contacts -->
    <div
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">
            Restrict Downloads to Specific Contacts
          </h3>
          <p class="text-xs leading-relaxed" :class="theme.textSecondary">
            Allow only specific contacts to download photos and videos.
          </p>
        </div>
        <div class="flex-shrink-0 pt-1">
          <ToggleSwitch v-model="restrictToContacts" label="" />
        </div>
      </div>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[700px]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 max-h-[700px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div
          v-if="restrictToContacts"
          class="pt-6 border-t space-y-5 overflow-hidden"
          :class="theme.borderSecondary"
        >
          <!-- Email List -->
          <div v-if="allowedEmails.length > 0" class="space-y-3">
            <div class="flex items-center justify-between mb-1">
              <p class="text-xs font-semibold uppercase tracking-wide" :class="theme.textTertiary">
                Allowed Emails ({{ allowedEmails.length }})
              </p>
            </div>
            <div class="flex flex-wrap gap-2.5">
              <TransitionGroup
                name="email-chip"
                tag="div"
                class="flex flex-wrap gap-2.5"
              >
                <div
                  v-for="(email, index) in allowedEmails"
                  :key="email"
                  :style="{ '--delay': `${index * 50}ms` }"
                  class="group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
                  :class="[
                    theme.bgCard,
                    theme.borderSecondary,
                    'border',
                    'text-gray-700 dark:text-gray-200',
                    'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                    'hover:border-gray-300 dark:hover:border-gray-600',
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="flex items-center justify-center w-5 h-5 rounded-md"
                      :class="theme.bgButtonHover"
                    >
                      <Mail class="h-3 w-3" :class="theme.textSecondary" />
                    </div>
                    <span class="font-medium" :class="theme.textPrimary">{{ email }}</span>
                  </div>
                  <button
                    @click="removeEmail(index)"
                    class="ml-1 -mr-1 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-md p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400"
                    title="Remove email"
                  >
                    <X class="h-3.5 w-3.5" />
                  </button>
                </div>
              </TransitionGroup>
            </div>
          </div>

          <!-- Empty State -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="allowedEmails.length === 0"
              class="relative overflow-hidden rounded-lg border border-dashed p-8 text-center"
              :class="[theme.borderSecondary, theme.bgCard]"
            >
              <div
                class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                :class="theme.bgButtonHover"
              >
                <Mail class="h-6 w-6" :class="theme.textSecondary" />
              </div>
              <p class="text-sm font-semibold mb-1" :class="theme.textPrimary">No emails added yet</p>
              <p class="text-xs" :class="theme.textTertiary">
                Add email addresses below to restrict downloads to specific contacts
              </p>
            </div>
          </Transition>

          <!-- Add Email Input -->
          <div class="space-y-3">
            <div class="flex items-start gap-2.5">
              <div class="flex-1 relative">
                <div class="relative">
                  <Mail
                    class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors pointer-events-none"
                    :class="
                      newEmail && isValidEmail(newEmail)
                        ? 'text-gray-600 dark:text-gray-300'
                        : newEmail && !isValidEmail(newEmail)
                          ? 'text-red-500 dark:text-red-400'
                          : theme.textTertiary
                    "
                  />
                  <Input
                    v-model="newEmail"
                    type="email"
                    placeholder="email@example.com"
                    class="pl-10 pr-4 py-2.5 transition-all duration-200"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      'focus:ring-2 focus:ring-gray-400/20 dark:focus:ring-gray-500/30',
                      newEmail && !isValidEmail(newEmail)
                        ? 'border-red-300 dark:border-red-700 focus:ring-red-500/30 focus:border-red-400'
                        : newEmail && isValidEmail(newEmail)
                          ? 'border-gray-300 dark:border-gray-600'
                          : '',
                    ]"
                    @keyup.enter="addEmail"
                    @blur="emailError = newEmail && !isValidEmail(newEmail)"
                  />
                </div>
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-1"
                >
                  <p
                    v-if="newEmail && !isValidEmail(newEmail)"
                    class="mt-1.5 text-xs flex items-center gap-1.5 text-red-500 dark:text-red-400"
                  >
                    <X class="h-3 w-3" />
                    Please enter a valid email address
                  </p>
                  <p
                    v-else-if="newEmail && allowedEmails.includes(newEmail.trim().toLowerCase())"
                    class="mt-1.5 text-xs flex items-center gap-1.5 text-amber-500 dark:text-amber-400"
                  >
                    <X class="h-3 w-3" />
                    This email is already in the list
                  </p>
                </Transition>
              </div>
              <Button
                :disabled="!isValidEmail(newEmail) || allowedEmails.includes(newEmail.trim().toLowerCase())"
                :class="[
                  theme.bgCard,
                  theme.borderSecondary,
                  'border',
                  'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                ]"
                class="group transition-all duration-200 px-4"
                size="default"
                variant="outline"
                @click="addEmail"
              >
                <Plus class="h-4 w-4 mr-2" :class="theme.textPrimary" />
                <span :class="theme.textPrimary">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Photo Sets Available for Download -->
    <div
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <div>
        <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">
          Photo Sets Available for Download
        </h3>
        <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
          Select which sets have download enabled. This applies to Gallery Download, Video Download,
          and Single Media Download.
          <a href="#" class="text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >Learn more</a
          >
        </p>
      </div>
      <div v-if="photoSets.length > 0" class="space-y-2.5">
        <label
          v-for="set in photoSets"
          :key="set.id"
          class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <input
            type="checkbox"
            :checked="selectedSets.includes(set.id)"
            @change="toggleSet(set.id)"
            class="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent transition-all"
          />
          <span class="text-sm font-medium" :class="theme.textPrimary">{{ set.name }}</span>
        </label>
      </div>
      <div v-else class="text-center py-8">
        <p class="text-sm" :class="theme.textSecondary">
          No photo sets available. Add sets in the Photos section.
        </p>
      </div>
    </div>

    <!-- Save Button -->
    <div :class="theme.borderSecondary" class="mt-10 pt-6 border-t">
      <div class="flex items-center justify-between gap-3">
        <div v-if="hasChanges" class="flex items-center gap-2 text-sm">
          <div class="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span :class="theme.textSecondary">You have unsaved changes</span>
        </div>
        <div v-else class="flex items-center gap-2 text-sm">
          <Check class="h-4 w-4 text-accent" />
          <span :class="theme.textSecondary">All changes saved</span>
        </div>
        <Button
          variant="accent"
          :disabled="!hasChanges"
          :loading="isSaving"
          :icon="!hasChanges ? Check : null"
          loading-label="Saving..."
          @click="handleSave"
        >
          {{ hasChanges ? 'Save Changes' : 'Saved' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Mail, Plus, X } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import { Input } from '@/shared/components/shadcn/input'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useGalleryStore } from '@/shared/stores/gallery'
import { toast } from '@/shared/utils/toast'

const route = useRoute()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

const collection = ref(null)
const isLoading = ref(true)

const limitDownloads = ref(true)
const downloadLimit = ref(1)
const restrictToContacts = ref(false)
const allowedEmails = ref([])
const newEmail = ref('')
const emailError = ref(false)
const photoSets = computed(() => {
  if (!collection.value?.mediaSets || !Array.isArray(collection.value.mediaSets)) {
    return []
  }
  return collection.value.mediaSets.map(set => ({
    id: set.id,
    name: set.name || 'Unnamed Set',
  }))
})
const selectedSets = ref(['1', '2'])
const isInitializing = ref(true)

// Save state
const isSaving = ref(false)
const originalData = ref(null)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  isLoading.value = true

  // Check if collection is already in store (from parent component)
  const existingCollection = galleryStore.collections.find(c => c.id === collectionId)
  if (existingCollection) {
    collection.value = existingCollection
    limitDownloads.value = existingCollection.limitDownloads || false
    downloadLimit.value = existingCollection.downloadLimit || 1
    restrictToContacts.value = existingCollection.restrictToContacts || false
    allowedEmails.value = Array.isArray(existingCollection.allowedDownloadEmails)
      ? [...existingCollection.allowedDownloadEmails]
      : existingCollection.allowedDownloadEmails
        ? [existingCollection.allowedDownloadEmails]
        : []
    selectedSets.value = existingCollection.downloadableSets || []
    
    // Store original data
    originalData.value = {
      limitDownloads: existingCollection.limitDownloads || false,
      downloadLimit: existingCollection.downloadLimit || 1,
      restrictToContacts: existingCollection.restrictToContacts || false,
      allowedDownloadEmails: Array.isArray(existingCollection.allowedDownloadEmails)
        ? existingCollection.allowedDownloadEmails
        : existingCollection.allowedDownloadEmails
          ? [existingCollection.allowedDownloadEmails]
          : [],
      downloadableSets: [...(existingCollection.downloadableSets || [])],
    }
    isLoading.value = false
    isInitializing.value = false
    return
  }

  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    limitDownloads.value = collectionData.limitDownloads || false
    downloadLimit.value = collectionData.downloadLimit || 1
    restrictToContacts.value = collectionData.restrictToContacts || false
    allowedEmails.value = Array.isArray(collectionData.allowedDownloadEmails)
      ? [...collectionData.allowedDownloadEmails]
      : collectionData.allowedDownloadEmails
        ? [collectionData.allowedDownloadEmails]
        : []
    selectedSets.value = collectionData.downloadableSets || []
    
    // Store original data
    originalData.value = {
      limitDownloads: collectionData.limitDownloads || false,
      downloadLimit: collectionData.downloadLimit || 1,
      restrictToContacts: collectionData.restrictToContacts || false,
      allowedDownloadEmails: Array.isArray(collectionData.allowedDownloadEmails)
        ? collectionData.allowedDownloadEmails
        : collectionData.allowedDownloadEmails
          ? [collectionData.allowedDownloadEmails]
          : [],
      downloadableSets: [...(collectionData.downloadableSets || [])],
    }
    isLoading.value = false
    isInitializing.value = false
  } catch (error) {
    toast.error('Failed to load collection')
    isLoading.value = false
    isInitializing.value = false
  }
})

// Filter selectedSets to only include valid set IDs when photoSets change
watch(photoSets, (newSets) => {
  if (newSets.length > 0 && selectedSets.value.length > 0) {
    const validSetIds = newSets.map(set => set.id)
    selectedSets.value = selectedSets.value.filter(setId => validSetIds.includes(setId))
  }
}, { immediate: true })

// Check for unsaved changes
const hasChanges = computed(() => {
  if (!originalData.value) return false
  return (
    limitDownloads.value !== originalData.value.limitDownloads ||
    downloadLimit.value !== originalData.value.downloadLimit ||
    restrictToContacts.value !== originalData.value.restrictToContacts ||
    JSON.stringify(allowedEmails.value) !== JSON.stringify(originalData.value.allowedDownloadEmails) ||
    JSON.stringify(selectedSets.value) !== JSON.stringify(originalData.value.downloadableSets)
  )
})

// Save all changes
const handleSave = async () => {
  if (!collection.value || !hasChanges.value || isSaving.value) return

  isSaving.value = true
  try {
    const updatedCollection = await galleryStore.updateCollection(collection.value.id, {
      limitDownloads: limitDownloads.value,
      downloadLimit: downloadLimit.value,
      restrictToContacts: restrictToContacts.value,
      allowedDownloadEmails: restrictToContacts.value ? allowedEmails.value : [],
      downloadableSets: selectedSets.value,
    })

    // Update collection reference with fresh data
    if (updatedCollection) {
      collection.value = updatedCollection
      allowedEmails.value = Array.isArray(updatedCollection.allowedDownloadEmails)
        ? [...updatedCollection.allowedDownloadEmails]
        : updatedCollection.allowedDownloadEmails
          ? [updatedCollection.allowedDownloadEmails]
          : []
    }

    // Update original data
    originalData.value = {
      limitDownloads: limitDownloads.value,
      downloadLimit: downloadLimit.value,
      restrictToContacts: restrictToContacts.value,
      allowedDownloadEmails: [...allowedEmails.value],
      downloadableSets: [...selectedSets.value],
    }

    toast.success('Settings saved successfully')
  } catch (error) {
    toast.error('Failed to save settings', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isSaving.value = false
  }
}


const toggleSet = setId => {
  const index = selectedSets.value.indexOf(setId)
  if (index > -1) {
    selectedSets.value.splice(index, 1)
  } else {
    selectedSets.value.push(setId)
  }
}

const isValidEmail = email => {
  if (!email || email.trim() === '') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

const addEmail = () => {
  const email = newEmail.value.trim().toLowerCase()
  if (!isValidEmail(email)) {
    emailError.value = true
    return
  }
  if (allowedEmails.value.includes(email)) {
    toast.error('Email already added', {
      description: 'This email address is already in the list.',
    })
    return
  }
  allowedEmails.value.push(email)
  newEmail.value = ''
  emailError.value = false
  toast.success('Email added', {
    description: `${email} has been added to the allowed list.`,
  })
}

const removeEmail = index => {
  const email = allowedEmails.value[index]
  allowedEmails.value.splice(index, 1)
  toast.success('Email removed', {
    description: `${email} has been removed from the allowed list.`,
  })
}

</script>

<style scoped>
.email-chip-enter-active {
  transition: all 0.3s ease-out;
  transition-delay: var(--delay, 0ms);
}

.email-chip-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.email-chip-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.email-chip-leave-active {
  transition: all 0.2s ease-in;
}

.email-chip-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.email-chip-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.email-chip-move {
  transition: transform 0.3s ease;
}
</style>
