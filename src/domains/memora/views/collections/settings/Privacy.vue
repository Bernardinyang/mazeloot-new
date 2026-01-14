<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="max-w-[50%] p-6 md:p-8 transition-all duration-300">
          <!-- Skeleton Header -->
          <div class="mb-10">
            <Skeleton class="h-9 w-64 rounded-lg mb-2" />
            <Skeleton class="h-4 w-96 rounded-md" />
          </div>

          <!-- Skeleton Settings Sections -->
          <div class="space-y-6">
            <div
              v-for="i in 3"
              :key="i"
              class="space-y-4 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800"
            >
              <div>
                <Skeleton class="h-6 w-40 rounded-md mb-2" />
                <Skeleton class="h-3 w-80 rounded-md mb-3" />
              </div>
              <div class="flex items-center gap-3">
                <Skeleton class="h-5 w-5 rounded" />
                <Skeleton class="h-4 w-48 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="max-w-[50%] p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-10">
            <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold mb-2">
              Privacy Settings
            </h1>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              Configure privacy and visibility settings for your collection including passwords,
              client access, and homepage visibility.
            </p>
          </div>

          <!-- Settings Sections -->
          <div class="space-y-6">
            <!-- Collection Password -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Collection Password
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                    Require visitors to enter this password in order to see the collection.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <div class="flex items-center gap-3">
                    <span
                      class="text-sm font-medium min-w-[2.5rem] text-right transition-colors"
                      :class="collectionPasswordEnabled ? theme.textPrimary : theme.textSecondary"
                    >
                      {{ collectionPasswordEnabled ? 'On' : 'Off' }}
                    </span>
                    <label class="relative inline-flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="collectionPasswordEnabled"
                        class="sr-only peer"
                      />
                      <div
                        class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent"
                        :class="
                          collectionPasswordEnabled
                            ? 'bg-accent'
                            : 'bg-gray-300 dark:bg-gray-600'
                        "
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
              <div v-if="collectionPasswordEnabled" class="flex items-center gap-3 max-w-md">
                <PasswordInput
                  :model-value="collectionPassword"
                  :input-class="cn(
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    'flex-1 focus:ring-2 focus:ring-accent/20 transition-all'
                  )"
                  placeholder="Add a password"
                  @update:model-value="collectionPassword = $event"
                />
                <Button
                  :class="[theme.borderSecondary, theme.textPrimary]"
                  class="group hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-200 hover:scale-105 active:scale-95"
                  size="sm"
                  variant="outline"
                  @click="generateCollectionPassword"
                >
                  <RefreshCw
                    class="h-4 w-4 mr-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                  />
                  Generate
                </Button>
                <Button
                  v-if="collectionPassword"
                  :class="[theme.borderSecondary, theme.textPrimary]"
                  class="group hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-200 hover:scale-105 active:scale-95"
                  size="sm"
                  variant="outline"
                  @click="copyCollectionPassword"
                >
                  <Copy class="h-4 w-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                </Button>
              </div>
            </div>

            <!-- Show on Homepage -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Show on Homepage
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Show this collection on your Homepage. Manage Homepage in
                    <a class="text-violet-600 dark:text-violet-400 hover:underline font-medium" href="#"
                      >Homepage settings</a
                    >.
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="showOnHomepage" label="" />
                </div>
              </div>
            </div>

            <!-- Client Exclusive Access -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-6 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Client Exclusive Access
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Give clients exclusive access to sets and the ability to mark photos private.
                    <a class="text-violet-600 dark:text-violet-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="clientExclusiveAccess" label="" />
                </div>
              </div>

              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-[2000px]"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 max-h-[2000px]"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="clientExclusiveAccess" class="space-y-6 pt-6 border-t overflow-hidden" :class="theme.borderSecondary">
                  <!-- Client Private Password -->
                  <div class="space-y-4">
                    <div>
                      <h4 :class="theme.textPrimary" class="text-base font-semibold mb-1.5">
                        Client Private Password
                      </h4>
                      <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                        This unique client password will be required to see all photos and mark photos
                        private.
                      </p>
                    </div>
                    <div class="flex items-center gap-3 max-w-md">
                      <PasswordInput
                        :model-value="clientPrivatePassword"
                        :input-class="cn(
                          theme.bgInput,
                          theme.borderInput,
                          theme.textInput,
                          'flex-1 font-mono focus:ring-2 focus:ring-accent/20 transition-all'
                        )"
                        placeholder="Add a password"
                        @update:model-value="clientPrivatePassword = $event"
                      />
                      <Button
                        :class="[theme.borderSecondary, theme.textPrimary]"
                        class="group hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-200 hover:scale-105 active:scale-95"
                        size="sm"
                        variant="outline"
                        @click="generateClientPassword"
                      >
                        <RefreshCw
                          class="h-4 w-4 mr-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                        />
                        Generate
                      </Button>
                      <Button
                        :disabled="!clientPrivatePassword"
                        :class="[theme.borderSecondary, theme.textPrimary]"
                        class="group hover:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        size="sm"
                        variant="outline"
                        @click="copyClientPassword"
                      >
                        <Copy class="h-4 w-4 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
                      </Button>
                    </div>
                  </div>

                  <!-- Client-Only Photo Sets -->
                  <div class="space-y-4">
                    <div>
                      <h4 :class="theme.textPrimary" class="text-base font-semibold mb-1.5">
                        Client-Only Photo Sets
                      </h4>
                      <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                        Restrict specific photo sets to client-only so that visitors cannot see them.
                      </p>
                    </div>
                    <div v-if="photoSets.length > 0" class="space-y-2.5">
                      <label
                        v-for="set in photoSets"
                        :key="set.id"
                        class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <input
                          :checked="selectedClientSets.includes(set.id)"
                          class="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-accent transition-all"
                          type="checkbox"
                          @change="toggleClientSet(set.id)"
                        />
                        <span :class="theme.textPrimary" class="text-sm font-medium">{{ set.name }}</span>
                      </label>
                    </div>
                    <div v-else class="text-center py-8">
                      <p :class="theme.textSecondary" class="text-sm">
                        No photo sets available. Add sets in the Photos section.
                      </p>
                    </div>
                  </div>

                  <!-- Allow Clients to Mark Photos Private -->
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <h4 :class="theme.textPrimary" class="text-base font-semibold mb-1.5">
                        Allow Clients to Mark Photos Private
                      </h4>
                      <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                        Give clients the ability to mark photos private. Private media are not visible
                        to public guests and only clients can see them.
                        <a class="text-violet-600 dark:text-violet-400 hover:underline font-medium" href="#"
                          >Learn more</a
                        >
                      </p>
                    </div>
                    <div class="flex-shrink-0 pt-1">
                      <ToggleSwitch v-model="allowClientsMarkPrivate" label="" />
                    </div>
                  </div>
                </div>
              </Transition>
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
                <Check class="h-4 w-4 text-violet-500" />
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
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, Copy, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import { Input } from '@/shared/components/shadcn/input'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import PasswordInput from '@/shared/components/molecules/PasswordInput.vue'
import CollectionLayout from '@/domains/memora/layouts/CollectionLayout.vue'
import ToggleSwitch from '@/shared/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { cn } from '@/shared/lib/utils'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { useGalleryStore } from '@/shared/stores/gallery'
import { toast } from '@/shared/utils/toast'
import { generatePassword } from '@/shared/utils/generatePassword'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(true)

// UI State
const { isSidebarCollapsed } = useSidebarCollapse()

// Privacy settings state
const collectionPassword = ref('')
const collectionPasswordEnabled = ref(false)
const showOnHomepage = ref(true)
const clientExclusiveAccess = ref(true)
const clientPrivatePassword = ref('2434')
const allowClientsMarkPrivate = ref(false)
const photoSets = computed(() => {
  if (!collection.value?.mediaSets || !Array.isArray(collection.value.mediaSets)) {
    return []
  }
  return collection.value.mediaSets.map(set => ({
    id: set.id,
    name: set.name || 'Unnamed Set',
  }))
})
const selectedClientSets = ref([])

// Save state
const isSaving = ref(false)
const originalData = ref(null)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  // Check if collection is already in store
  const existingCollection = galleryStore.collections.find(c => c.id === collectionId)
  if (existingCollection) {
    collection.value = existingCollection
    // Don't load the password hash - it's never returned from backend for security
    // If password exists, show empty field with placeholder indicating password is set
    collectionPassword.value = ''
    collectionPasswordEnabled.value = !!existingCollection.collectionPasswordEnabled || !!existingCollection.password
    showOnHomepage.value = existingCollection.showOnHomepage !== false
    clientExclusiveAccess.value = existingCollection.clientExclusiveAccess || false
    clientPrivatePassword.value = existingCollection.clientPrivatePassword || ''
    allowClientsMarkPrivate.value = existingCollection.allowClientsMarkPrivate || false
    selectedClientSets.value = existingCollection.clientOnlySets || []
    
    // Store original data
    originalData.value = {
      password: existingCollection.password || '',
      passwordEnabled: !!existingCollection.password,
      showOnHomepage: existingCollection.showOnHomepage !== false,
      clientExclusiveAccess: existingCollection.clientExclusiveAccess || false,
      clientPrivatePassword: existingCollection.clientPrivatePassword || '',
      allowClientsMarkPrivate: existingCollection.allowClientsMarkPrivate || false,
      clientOnlySets: [...(existingCollection.clientOnlySets || [])],
    }
    isLoading.value = false
    return
  }

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    collectionPassword.value = collectionData.password || ''
    collectionPasswordEnabled.value = !!collectionData.password
    showOnHomepage.value = collectionData.showOnHomepage !== false
    clientExclusiveAccess.value = collectionData.clientExclusiveAccess || false
    clientPrivatePassword.value = collectionData.clientPrivatePassword || ''
    allowClientsMarkPrivate.value = collectionData.allowClientsMarkPrivate || false
    selectedClientSets.value = collectionData.clientOnlySets || []
    
    // Store original data
    originalData.value = {
      password: collectionData.password || '',
      passwordEnabled: !!collectionData.password,
      showOnHomepage: collectionData.showOnHomepage !== false,
      clientExclusiveAccess: collectionData.clientExclusiveAccess || false,
      clientPrivatePassword: collectionData.clientPrivatePassword || '',
      allowClientsMarkPrivate: collectionData.allowClientsMarkPrivate || false,
      clientOnlySets: [...(collectionData.clientOnlySets || [])],
    }
  } catch (error) {
    // Use exact backend error message
    const errorMessage = error?.message || error?.response?.data?.message || 'Failed to load collection'
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
})

// Check for unsaved changes
const hasChanges = computed(() => {
  if (!originalData.value) return false
  return (
    (collectionPasswordEnabled.value ? collectionPassword.value : '') !== originalData.value.password ||
    collectionPasswordEnabled.value !== originalData.value.passwordEnabled ||
    showOnHomepage.value !== originalData.value.showOnHomepage ||
    clientExclusiveAccess.value !== originalData.value.clientExclusiveAccess ||
    clientPrivatePassword.value !== originalData.value.clientPrivatePassword ||
    allowClientsMarkPrivate.value !== originalData.value.allowClientsMarkPrivate ||
    JSON.stringify(selectedClientSets.value) !== JSON.stringify(originalData.value.clientOnlySets)
  )
})

// Save all changes
const handleSave = async () => {
  if (!collection.value || !hasChanges.value || isSaving.value) return

  isSaving.value = true
  try {
    await galleryStore.updateCollection(collection.value.id, {
      password: collectionPasswordEnabled.value ? collectionPassword.value : null,
      showOnHomepage: showOnHomepage.value,
      clientExclusiveAccess: clientExclusiveAccess.value,
      clientPrivatePassword: clientPrivatePassword.value || null,
      allowClientsMarkPrivate: allowClientsMarkPrivate.value,
      clientOnlySets: selectedClientSets.value,
    })

    // Update original data
    originalData.value = {
      password: collectionPasswordEnabled.value ? collectionPassword.value : '',
      passwordEnabled: collectionPasswordEnabled.value,
      showOnHomepage: showOnHomepage.value,
      clientExclusiveAccess: clientExclusiveAccess.value,
      clientPrivatePassword: clientPrivatePassword.value,
      allowClientsMarkPrivate: allowClientsMarkPrivate.value,
      clientOnlySets: [...selectedClientSets.value],
    }

    toast.success('Settings saved successfully')
  } catch (error) {
    // Use exact backend error message
    const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save settings'
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

// Navigation
const goBack = () => {
  router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
}

// Generate collection password
const generateCollectionPassword = () => {
  collectionPassword.value = generatePassword()
  toast.success('Password generated')
}

// Copy collection password
const copyCollectionPassword = async () => {
  if (!collectionPassword.value) return
  try {
    await navigator.clipboard.writeText(collectionPassword.value)
    toast.success('Password copied to clipboard')
  } catch (error) {
    toast.error('Failed to copy password')
  }
}

// Generate client password
const generateClientPassword = () => {
  clientPrivatePassword.value = generatePassword()
  toast.success('Password generated')
}

// Copy client password
const copyClientPassword = async () => {
  if (!clientPrivatePassword.value) return
  try {
    await navigator.clipboard.writeText(clientPrivatePassword.value)
    toast.success('Password copied to clipboard')
  } catch (error) {
    toast.error('Failed to copy password')
  }
}

// Toggle client set
const toggleClientSet = setId => {
  const index = selectedClientSets.value.indexOf(setId)
  if (index > -1) {
    selectedClientSets.value.splice(index, 1)
  } else {
    selectedClientSets.value.push(setId)
  }
}

// Auto-generate password when enabled
watch(collectionPasswordEnabled, newValue => {
  if (newValue && !collectionPassword.value) {
    generateCollectionPassword()
  }
})
</script>
