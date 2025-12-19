<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Collection Password
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Require visitors to enter this password in order to see the collection.
                </p>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <Input
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  :model-value="collectionPassword"
                  :type="collectionPassword ? 'password' : 'text'"
                  class="flex-1 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  placeholder="Add a password"
                  @update:model-value="collectionPassword = $event"
                />
                <Button
                  :class="[theme.borderSecondary, theme.textPrimary]"
                  class="group hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-105 active:scale-95"
                  size="sm"
                  variant="outline"
                  @click="generatePassword"
                >
                  <RefreshCw
                    class="h-4 w-4 mr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                  />
                  Generate
                </Button>
              </div>
            </div>

            <!-- Show on Homepage -->
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Show on Homepage
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Show this collection on your Homepage. Manage Homepage in
                    <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
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
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Client Exclusive Access
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Give clients exclusive access to sets and the ability to mark photos private.
                    <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="clientExclusiveAccess" label="" />
                </div>
              </div>
            </div>

            <!-- Client Private Password -->
            <div
              v-if="clientExclusiveAccess"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Client Private Password
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  This unique client password will be required to see all photos and mark photos
                  private.
                </p>
              </div>
              <div class="flex items-center gap-3 max-w-md">
                <Input
                  :class="[theme.bgInput, theme.borderInput, theme.textInput]"
                  :model-value="clientPrivatePassword"
                  :type="showClientPassword ? 'text' : 'password'"
                  class="flex-1 font-mono focus:ring-2 focus:ring-teal-500/20 transition-all"
                  @update:model-value="clientPrivatePassword = $event"
                />
                <Button
                  :class="theme.textSecondary"
                  class="hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-110 active:scale-95"
                  size="sm"
                  variant="ghost"
                  @click="showClientPassword = !showClientPassword"
                >
                  <Eye v-if="!showClientPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </Button>
                <Button
                  :class="theme.textSecondary"
                  class="hover:bg-teal-50 dark:hover:bg-teal-950/20 hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:scale-110 active:scale-95"
                  size="sm"
                  variant="ghost"
                  @click="copyClientPassword"
                >
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
            </div>

            <!-- Client-Only Photo Sets -->
            <div
              v-if="clientExclusiveAccess"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div>
                <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                  Client-Only Photo Sets
                </h3>
                <p :class="theme.textSecondary" class="text-xs leading-relaxed mb-3">
                  Restrict specific photo sets to client-only so that visitors cannot see them.
                </p>
              </div>
              <div class="space-y-2.5">
                <label
                  v-for="set in photoSets"
                  :key="set.id"
                  class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <input
                    :checked="selectedClientSets.includes(set.id)"
                    class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all"
                    type="checkbox"
                    @change="toggleClientSet(set.id)"
                  />
                  <span :class="theme.textPrimary" class="text-sm font-medium">{{ set.name }}</span>
                </label>
              </div>
            </div>

            <!-- Allow Clients to Mark Photos Private -->
            <div
              v-if="clientExclusiveAccess"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <h3 :class="theme.textPrimary" class="text-lg font-bold mb-1.5">
                    Allow Clients to Mark Photos Private
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs leading-relaxed">
                    Give clients the ability to mark photos private. Private photos are not visible
                    to public guests and only clients can see them.
                    <a class="text-teal-600 dark:text-teal-400 hover:underline font-medium" href="#"
                      >Learn more</a
                    >
                  </p>
                </div>
                <div class="flex-shrink-0 pt-1">
                  <ToggleSwitch v-model="allowClientsMarkPrivate" label="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Copy, Eye, EyeOff, Loader2, RefreshCw } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { toast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)

// UI State
const { isSidebarCollapsed } = useSidebarCollapse()

// Privacy settings state
const collectionPassword = ref('')
const showOnHomepage = ref(true)
const clientExclusiveAccess = ref(true)
const clientPrivatePassword = ref('2434')
const showClientPassword = ref(false)
const allowClientsMarkPrivate = ref(false)
const photoSets = ref([
  { id: 'highlights', name: 'Highlights' },
  { id: 'all', name: 'All' },
])
const selectedClientSets = ref([])

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    collectionPassword.value = collectionData.password || ''
    showOnHomepage.value = collectionData.showOnHomepage !== false
    clientExclusiveAccess.value = collectionData.clientExclusiveAccess || false
    clientPrivatePassword.value = collectionData.clientPrivatePassword || ''
    allowClientsMarkPrivate.value = collectionData.allowClientsMarkPrivate || false
    selectedClientSets.value = collectionData.clientOnlySets || []
  } catch (error) {
    toast.error('Failed to load collection', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
}

// Generate password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  collectionPassword.value = password
  toast.success('Password generated')
}

// Copy client password
const copyClientPassword = async () => {
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

// Watch and save privacy settings changes
watch(collectionPassword, async newPassword => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      password,
    })
  } catch (error) {
    toast.error('Failed to update password')
  }
})

watch(showOnHomepage, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      showOnHomepage,
    })
  } catch (error) {
    toast.error('Failed to update homepage visibility')
  }
})

watch(clientExclusiveAccess, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      clientExclusiveAccess,
    })
  } catch (error) {
    toast.error('Failed to update client exclusive access')
  }
})

watch(clientPrivatePassword, async newPassword => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      clientPrivatePassword,
    })
  } catch (error) {
    toast.error('Failed to update client password')
  }
})

watch(allowClientsMarkPrivate, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      allowClientsMarkPrivate,
    })
  } catch (error) {
    toast.error('Failed to update allow clients mark private')
  }
})

watch(
  selectedClientSets,
  async newSets => {
    if (!collection.value) return
    try {
      await galleryStore.updateCollection(collection.value.id, {
        clientOnlySets,
      })
    } catch (error) {
      toast.error('Failed to update client-only sets')
    }
  },
  { deep: true }
)
</script>
