<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Social Links </template>

    <div class="space-y-8 w-1/2">
      <!-- Page Header -->
      <div>
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Social Links
        </h1>
        <p class="text-sm mb-6" :class="theme.textSecondary">
          Add and manage your social media links that will appear on your homepage.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <Loader2 class="h-8 w-8 animate-spin" :class="theme.textTertiary" />
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Add New Link Card -->
        <div class="rounded-xl border p-6" :class="[theme.bgCard, theme.borderCard]">
          <div class="mb-5">
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Add Social Link</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Connect your social media profiles to display on your homepage
            </p>
          </div>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">
                Platform
              </label>
              <Select
                v-model="newLink.platformUuid"
                :disabled="isLoading || isCreating"
              >
                <SelectTrigger :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  (isLoading || isCreating) ? 'cursor-not-allowed opacity-50' : '',
                ]">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                  <SelectItem
                    v-for="platform in availablePlatforms"
                    :key="platform.id"
                    :value="platform.id"
                    :label="platform.name"
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                  >
                    {{ platform.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium" :class="theme.textPrimary">URL</label>
              <Input
                v-model="newLink.url"
                type="url"
                placeholder="https://..."
                :disabled="isLoading || isCreating"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  'font-mono text-sm',
                  (isLoading || isCreating) ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>
            <Button
              variant="primary"
              :disabled="!newLink.platformUuid || !newLink.url || isLoading"
              :loading="isCreating"
              loading-label="Adding..."
              class="w-full sm:w-auto"
              @click="handleCreateLink"
            >
              Add Link
            </Button>
          </div>
        </div>

        <!-- Existing Links -->
        <div v-if="socialLinks.length === 0" class="rounded-xl border p-12 text-center" :class="[theme.bgCard, theme.borderCard]">
          <p class="text-sm" :class="theme.textSecondary">No social links added yet. Add your first link above.</p>
        </div>

        <div v-else class="space-y-3">
          <div class="mb-4">
            <h2 class="text-lg font-semibold mb-1" :class="theme.textPrimary">Your Social Links</h2>
            <p class="text-sm" :class="theme.textSecondary">
              Manage your connected social media profiles
            </p>
          </div>
          <div
            v-for="link in socialLinks"
            :key="link.id"
            class="rounded-xl border p-5 transition-all hover:shadow-md"
            :class="[theme.bgCard, theme.borderCard]"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-3">
                  <h3 class="text-base font-semibold" :class="theme.textPrimary">
                    {{ link.platform?.name || 'Unknown Platform' }}
                  </h3>
                  <label
                    class="relative inline-flex items-center group"
                    :class="isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'"
                  >
                    <input
                      type="checkbox"
                      :checked="link.isActive"
                      :disabled="isSaving"
                      @change="handleToggleActive(link.id, $event.target.checked)"
                      class="sr-only peer"
                    />
                    <div
                      class="w-11 h-6 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:bg-accent bg-gray-300 dark:bg-gray-600"
                    ></div>
                  </label>
                </div>
                <Input
                  v-if="editingLinkId === link.id"
                  v-model="editingLink.url"
                  type="url"
                  :disabled="isUpdating"
                  :class="[
                    theme.bgInput,
                    theme.borderInput,
                    theme.textInput,
                    theme.placeholderInput,
                    'font-mono text-sm',
                    isUpdating ? 'cursor-not-allowed opacity-50' : '',
                  ]"
                  @keydown.enter="handleUpdateLink(link.id)"
                  @keydown.esc="cancelEdit"
                />
                <a
                  v-else
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-accent hover:text-accent/80 underline break-all block"
                >
                  {{ link.url }}
                </a>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <Button
                  v-if="editingLinkId === link.id"
                  variant="ghost"
                  size="sm"
                  :loading="isUpdating"
                  @click="handleUpdateLink(link.id)"
                >
                  Save
                </Button>
                <Button
                  v-else
                  variant="ghost"
                  size="sm"
                  :disabled="isSaving"
                  @click="startEdit(link)"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  :loading="isDeleting === link.id"
                  class="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  @click="handleDeleteLink(link.id)"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div :class="theme.borderSecondary" class="mt-8 pt-6 border-t">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 text-sm">
              <Check class="h-4 w-4 text-accent" />
              <span :class="theme.textSecondary">All changes saved automatically</span>
            </div>
            <Button
              variant="success"
              disabled
              :icon="Check"
            >
              Saved
            </Button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2, Check } from 'lucide-vue-next'
import DashboardLayout from '@/shared/layouts/DashboardLayout.vue'
import { Separator } from '@/shared/components/shadcn/separator'
import Input from '@/shared/components/shadcn/input/Input.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import { Button } from '@/shared/components/shadcn/button'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSocialLinksApi } from '@/domains/memora/api/socialLinks'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const {
  fetchSocialLinks,
  fetchAvailablePlatforms,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
} = useSocialLinksApi()

const socialLinks = ref([])
const availablePlatforms = ref([])
const isLoading = ref(false)
const isCreating = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(null)
const isSaving = ref(false)

const newLink = ref({
  platformUuid: '',
  url: '',
})

const editingLinkId = ref(null)
const editingLink = ref({ url: '' })

onMounted(async () => {
  isLoading.value = true
  try {
    const [linksResponse, platformsResponse] = await Promise.all([
      fetchSocialLinks(),
      fetchAvailablePlatforms(),
    ])

    socialLinks.value = linksResponse.data || linksResponse || []
    availablePlatforms.value = platformsResponse.data || platformsResponse || []
  } catch (error) {
    toast.error('Failed to load social links', {
      description: error.message || 'Please try again',
    })
  } finally {
    isLoading.value = false
  }
})

const handleCreateLink = async () => {
  if (!newLink.value.platformUuid || !newLink.value.url) return

  isCreating.value = true
  try {
    const response = await createSocialLink(newLink.value)
    const createdLink = response.data || response

    socialLinks.value.push(createdLink)
    newLink.value = { platformUuid: '', url: '' }

    toast.success('Social link added')
  } catch (error) {
    toast.error('Failed to add social link', {
      description: error.message || 'Please try again',
    })
  } finally {
    isCreating.value = false
  }
}

const startEdit = link => {
  editingLinkId.value = link.id
  editingLink.value = { url: link.url }
}

const cancelEdit = () => {
  editingLinkId.value = null
  editingLink.value = { url: '' }
}

const handleUpdateLink = async id => {
  if (!editingLink.value.url) return

  isUpdating.value = true
  try {
    const response = await updateSocialLink(id, { url: editingLink.value.url })
    const updatedLink = response.data || response

    const index = socialLinks.value.findIndex(l => l.id === id)
    if (index !== -1) {
      socialLinks.value[index] = updatedLink
    }

    cancelEdit()
    toast.success('Social link updated')
  } catch (error) {
    toast.error('Failed to update social link', {
      description: error.message || 'Please try again',
    })
  } finally {
    isUpdating.value = false
  }
}

const handleToggleActive = async (id, isActive) => {
  isSaving.value = true
  try {
    const response = await updateSocialLink(id, { isActive })
    const updatedLink = response.data || response

    const index = socialLinks.value.findIndex(l => l.id === id)
    if (index !== -1) {
      socialLinks.value[index] = updatedLink
    }
  } catch (error) {
    toast.error('Failed to update social link', {
      description: error.message || 'Please try again',
    })
    // Revert toggle
    const link = socialLinks.value.find(l => l.id === id)
    if (link) {
      link.isActive = !isActive
    }
  } finally {
    isSaving.value = false
  }
}

const handleDeleteLink = async id => {
  if (!confirm('Are you sure you want to delete this social link?')) return

  isDeleting.value = id
  try {
    await deleteSocialLink(id)
    socialLinks.value = socialLinks.value.filter(l => l.id !== id)
    toast.success('Social link deleted')
  } catch (error) {
    toast.error('Failed to delete social link', {
      description: error.message || 'Please try again',
    })
  } finally {
    isDeleting.value = null
  }
}
</script>

