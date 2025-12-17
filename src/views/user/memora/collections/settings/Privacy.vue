<template>
  <CollectionLayout
    v-model:active-tab="activeTab"
    v-model:collection-status="collectionStatus"
    v-model:is-sidebar-collapsed="isSidebarCollapsed"
    :collection="collection"
    :editing-name="''"
    :event-date="eventDate"
    :is-editing-name="false"
    :is-loading="isLoading"
    :is-saving-name="false"
    :is-saving-status="false"
    :presets="presets"
    :selected-preset-id="selectedPresetId"
    :selected-preset-name="selectedPresetName"
    :selected-watermark="selectedWatermark"
    :selected-watermark-name="selectedWatermarkName"
    :watermarks="watermarks"
    @go-back="goBack"
    @handle-status-change="handleStatusChange"
    @handle-date-change="handleDateChange"
    @handle-preset-change="handlePresetChange"
    @handle-watermark-change="handleWatermarkChange"
  >
    <template #sidebar>
      <!-- SETTINGS Section - Expanded -->
      <div v-if="activeTab === 'settings' && !isSidebarCollapsed" class="space-y-5">
        <h2 :class="theme.textSecondary" class="text-xs font-bold uppercase tracking-wider mb-4">
          SETTINGS
        </h2>
        <div class="space-y-1">
          <router-link
            v-if="collection?.id"
            :class="[
              route.name === 'collectionSettingsGeneral'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
            ]"
            :to="{ name: 'collectionSettingsGeneral', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Settings :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">General</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              route.name === 'collectionSettingsPrivacy'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
            ]"
            :to="{ name: 'collectionSettingsPrivacy', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <Lock :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
            <span :class="theme.textPrimary" class="text-sm font-medium">Privacy</span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              route.name?.toString().startsWith('collectionSettingsDownload')
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
            ]"
            :to="{ name: 'collectionSettingsDownload', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between"
          >
            <div class="flex items-center gap-3">
              <Download :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
              <span :class="theme.textPrimary" class="text-sm font-medium">Download</span>
            </div>
            <span
              :class="
                downloadEnabled
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : ''
              "
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ downloadEnabled ? 'ON' : 'OFF' }}
            </span>
          </router-link>
          <router-link
            v-if="collection?.id"
            :class="[
              route.name === 'collectionSettingsFavorite'
                ? 'bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-l-4 hover:border-teal-500/40',
            ]"
            :to="{ name: 'collectionSettingsFavorite', params: { uuid: collection.id } }"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group justify-between"
          >
            <div class="flex items-center gap-3">
              <Heart :class="theme.textSecondary" class="h-4 w-4 flex-shrink-0" />
              <span :class="theme.textPrimary" class="text-sm font-medium">Favorite</span>
            </div>
            <span
              :class="
                favoriteEnabled
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : ''
              "
              class="px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              {{ favoriteEnabled ? 'ON' : 'OFF' }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- SETTINGS Section - Collapsed -->
      <div
        v-if="activeTab === 'settings' && isSidebarCollapsed"
        class="flex flex-col items-center gap-2 pt-4"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  route.name === 'collectionSettingsGeneral' ? 'bg-teal-500 text-white' : '',
                ]"
                :to="{ name: 'collectionSettingsGeneral', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200"
              >
                <Settings class="h-5 w-5" />
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>General</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  route.name === 'collectionSettingsPrivacy' ? 'bg-teal-500 text-white' : '',
                ]"
                :to="{ name: 'collectionSettingsDownload', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200"
              >
                <Lock class="h-5 w-5" />
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Privacy</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  route.name?.toString().startsWith('collectionSettingsDownload')
                    ? 'bg-teal-500 text-white'
                    : '',
                ]"
                :to="{ name: 'collectionSettingsDownload', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200 relative"
              >
                <Download class="h-5 w-5" />
                <span
                  v-if="downloadEnabled"
                  class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
                ></span>
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Download</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <router-link
                v-if="collection?.id"
                :class="[
                  route.name === 'collectionSettingsFavorite' ? 'bg-teal-500 text-white' : '',
                ]"
                :to="{ name: 'collectionSettingsFavorite', params: { uuid: collection.id } }"
                class="p-3 rounded-lg transition-all duration-200 relative"
              >
                <Heart class="h-5 w-5" />
                <span
                  v-if="favoriteEnabled"
                  class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
                ></span>
              </router-link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Favorite</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </template>

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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Copy,
  Download,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Lock,
  RefreshCw,
  Settings,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/shadcn/tooltip'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'
import { usePresetStore } from '@/stores/preset'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()
const presetStore = usePresetStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)
const collectionStatus = ref('draft')
const eventDate = ref(null)
const selectedPresetId = ref('none')
const selectedPresetName = computed(() => {
  if (selectedPresetId.value === 'none') return null
  const preset = presets.value.find(p => p.id === selectedPresetId.value)
  return preset?.name || null
})
const selectedWatermark = ref('none')
const selectedWatermarkName = computed(() => {
  if (selectedWatermark.value === 'none') return null
  const watermark = watermarks.value.find(w => w.id === selectedWatermark.value)
  return watermark?.name || null
})
const presets = computed(() => presetStore.presets)
const watermarks = computed(() => galleryStore.watermarks || [])

// UI State
const activeTab = ref('settings')
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
const downloadEnabled = ref(true)
const favoriteEnabled = ref(true)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    collectionStatus.value = collectionData.status === 'active' ? 'published' : 'draft'
    eventDate.value = collectionData.eventDate ? new Date(collectionData.eventDate) : null
    selectedPresetId.value = collectionData.presetId || 'none'
    selectedWatermark.value = collectionData.watermarkId || 'none'
    collectionPassword.value = collectionData.password || ''
    showOnHomepage.value = collectionData.showOnHomepage !== false
    clientExclusiveAccess.value = collectionData.clientExclusiveAccess || false
    clientPrivatePassword.value = collectionData.clientPrivatePassword || ''
    allowClientsMarkPrivate.value = collectionData.allowClientsMarkPrivate || false
    selectedClientSets.value = collectionData.clientOnlySets || []
    downloadEnabled.value = collectionData.downloadEnabled !== false
    favoriteEnabled.value = collectionData.favoriteEnabled !== false
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

// Handle status change
const handleStatusChange = async newStatus => {
  if (!collection.value || !newStatus) return

  try {
    const apiStatus = newStatus === 'published' ? 'active' : 'draft'
    await galleryStore.updateCollection(collection.value.id, {
      status: apiStatus,
    })

    collectionStatus.value = newStatus === 'published' ? 'published' : 'draft'
    toast.success('Collection status updated successfully')
  } catch (error) {
    toast.error('Failed to update collection status', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

// Handle date change
const handleDateChange = async newDate => {
  if (!collection.value) return

  try {
    const dateString = newDate instanceof Date ? newDate.toISOString() : null
    await galleryStore.updateCollection(collection.value.id, {
      eventDate: dateString,
    })

    eventDate.value = newDate
    toast.success('Event date updated successfully')
  } catch (error) {
    toast.error('Failed to update event date', {
      description: error instanceof Error ? error.message : 'An unknown error occurred',
    })
  }
}

// Handle preset change
const handlePresetChange = async presetId => {
  if (!collection.value) return
  selectedPresetId.value = presetId
}

// Handle watermark change
const handleWatermarkChange = async watermarkId => {
  if (!collection.value) return
  selectedWatermark.value = watermarkId
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
