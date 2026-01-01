<template>
  <DashboardLayout>
    <template #breadcrumb> Admin > Social Media Platforms </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="w-[50%]">
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Social Media Platforms
        </h1>
        <p class="text-sm mb-4" :class="theme.textSecondary">
          Manage available social media platforms for users to choose from.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Content -->
      <div class="space-y-6 w-[50%]">
        <!-- Add New Platform -->
        <div class="rounded-lg border p-6" :class="[theme.bgCard, theme.borderCard]">
          <h3 class="text-lg font-semibold mb-4" :class="theme.textPrimary">Add Platform</h3>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium mb-2 block" :class="theme.textPrimary">Name</label>
              <Input
                v-model="newPlatform.name"
                type="text"
                placeholder="Instagram"
                :disabled="isCreating"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isCreating ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block" :class="theme.textPrimary">Slug</label>
              <Input
                v-model="newPlatform.slug"
                type="text"
                placeholder="instagram"
                :disabled="isCreating"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isCreating ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block" :class="theme.textPrimary">Icon</label>
              <Input
                v-model="newPlatform.icon"
                type="text"
                placeholder="instagram"
                :disabled="isCreating"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isCreating ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block" :class="theme.textPrimary">Base URL</label>
              <Input
                v-model="newPlatform.baseUrl"
                type="url"
                placeholder="https://instagram.com/"
                :disabled="isCreating"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isCreating ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block" :class="theme.textPrimary">Order</label>
              <Input
                v-model.number="newPlatform.order"
                type="number"
                placeholder="1"
                :disabled="isCreating"
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  theme.placeholderInput,
                  isCreating ? 'cursor-not-allowed opacity-50' : '',
                ]"
              />
            </div>
            <Button
              :disabled="!newPlatform.name || !newPlatform.slug || isCreating"
              class="bg-teal-500 hover:bg-teal-600 text-white"
              @click="handleCreatePlatform"
            >
              <Loader2 v-if="isCreating" class="h-4 w-4 mr-2 animate-spin" />
              Add Platform
            </Button>
          </div>
        </div>

        <!-- Existing Platforms -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <Loader2 class="h-8 w-8 animate-spin" :class="theme.textTertiary" />
        </div>

        <div v-else-if="platforms.length === 0" class="text-center py-12">
          <p class="text-sm" :class="theme.textSecondary">No platforms configured.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="platform in platforms"
            :key="platform.id"
            class="rounded-lg border p-6"
            :class="[theme.bgCard, theme.borderCard]"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-base font-semibold" :class="theme.textPrimary">
                    {{ platform.name }}
                  </h3>
                  <span class="text-xs px-2 py-1 rounded-full" :class="platform.isActive ? 'bg-teal-500/10 text-teal-500' : 'bg-gray-500/10 text-gray-500'">
                    {{ platform.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div v-if="editingPlatformId === platform.id" class="space-y-2">
                  <Input
                    v-model="editingPlatform.name"
                    type="text"
                    :disabled="isUpdating"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      isUpdating ? 'cursor-not-allowed opacity-50' : '',
                    ]"
                  />
                  <Input
                    v-model="editingPlatform.slug"
                    type="text"
                    :disabled="isUpdating"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      isUpdating ? 'cursor-not-allowed opacity-50' : '',
                    ]"
                  />
                  <Input
                    v-model="editingPlatform.icon"
                    type="text"
                    :disabled="isUpdating"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      isUpdating ? 'cursor-not-allowed opacity-50' : '',
                    ]"
                  />
                  <Input
                    v-model="editingPlatform.baseUrl"
                    type="url"
                    :disabled="isUpdating"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      isUpdating ? 'cursor-not-allowed opacity-50' : '',
                    ]"
                  />
                  <Input
                    v-model.number="editingPlatform.order"
                    type="number"
                    :disabled="isUpdating"
                    :class="[
                      theme.bgInput,
                      theme.borderInput,
                      theme.textInput,
                      isUpdating ? 'cursor-not-allowed opacity-50' : '',
                    ]"
                  />
                </div>
                <div v-else class="text-sm space-y-1" :class="theme.textSecondary">
                  <p><strong>Slug:</strong> {{ platform.slug }}</p>
                  <p><strong>Icon:</strong> {{ platform.icon || 'N/A' }}</p>
                  <p><strong>Base URL:</strong> {{ platform.baseUrl || 'N/A' }}</p>
                  <p><strong>Order:</strong> {{ platform.order || 'N/A' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 ml-4">
                <Button
                  v-if="editingPlatformId === platform.id"
                  variant="ghost"
                  size="sm"
                  :disabled="isUpdating"
                  @click="handleUpdatePlatform(platform.id)"
                >
                  <Loader2 v-if="isUpdating" class="h-4 w-4 animate-spin" />
                  <span v-else>Save</span>
                </Button>
                <Button
                  v-else
                  variant="ghost"
                  size="sm"
                  :disabled="isToggling === platform.id"
                  @click="startEdit(platform)"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="isToggling === platform.id"
                  @click="handleToggleActive(platform.id)"
                >
                  <Loader2 v-if="isToggling === platform.id" class="h-4 w-4 animate-spin" />
                  <span v-else>{{ platform.isActive ? 'Deactivate' : 'Activate' }}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="isDeleting === platform.id"
                  :class="theme.textSecondary"
                  @click="handleDeletePlatform(platform.id)"
                >
                  <Loader2 v-if="isDeleting === platform.id" class="h-4 w-4 animate-spin" />
                  <span v-else>Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Separator } from '@/components/shadcn/separator'
import Input from '@/components/shadcn/input/Input.vue'
import { Button } from '@/components/shadcn/button'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSocialMediaPlatformsApi } from '@/api/socialMediaPlatforms'
import { toast } from '@/utils/toast'

const theme = useThemeClasses()
const { fetchPlatforms, createPlatform, updatePlatform, deletePlatform, togglePlatformActive } =
  useSocialMediaPlatformsApi()

const platforms = ref([])
const isLoading = ref(false)
const isCreating = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(null)
const isToggling = ref(null)

const newPlatform = ref({
  name: '',
  slug: '',
  icon: '',
  baseUrl: '',
  order: null,
})

const editingPlatformId = ref(null)
const editingPlatform = ref({
  name: '',
  slug: '',
  icon: '',
  baseUrl: '',
  order: null,
})

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await fetchPlatforms()
    platforms.value = response.data || response || []
  } catch (error) {
    toast.error('Failed to load platforms', {
      description: error.message || 'Please try again',
    })
  } finally {
    isLoading.value = false
  }
})

const handleCreatePlatform = async () => {
  if (!newPlatform.value.name || !newPlatform.value.slug) return

  isCreating.value = true
  try {
    const response = await createPlatform(newPlatform.value)
    const createdPlatform = response.data || response

    platforms.value.push(createdPlatform)
    platforms.value.sort((a, b) => (a.order || 0) - (b.order || 0))
    newPlatform.value = { name: '', slug: '', icon: '', baseUrl: '', order: null }

    toast.success('Platform added')
  } catch (error) {
    toast.error('Failed to add platform', {
      description: error.message || 'Please try again',
    })
  } finally {
    isCreating.value = false
  }
}

const startEdit = platform => {
  editingPlatformId.value = platform.id
  editingPlatform.value = {
    name: platform.name,
    slug: platform.slug,
    icon: platform.icon || '',
    baseUrl: platform.baseUrl || '',
    order: platform.order || null,
  }
}

const cancelEdit = () => {
  editingPlatformId.value = null
  editingPlatform.value = { name: '', slug: '', icon: '', baseUrl: '', order: null }
}

const handleUpdatePlatform = async id => {
  if (!editingPlatform.value.name || !editingPlatform.value.slug) return

  isUpdating.value = true
  try {
    const response = await updatePlatform(id, editingPlatform.value)
    const updatedPlatform = response.data || response

    const index = platforms.value.findIndex(p => p.id === id)
    if (index !== -1) {
      platforms.value[index] = updatedPlatform
    }
    platforms.value.sort((a, b) => (a.order || 0) - (b.order || 0))

    cancelEdit()
    toast.success('Platform updated')
  } catch (error) {
    toast.error('Failed to update platform', {
      description: error.message || 'Please try again',
    })
  } finally {
    isUpdating.value = false
  }
}

const handleToggleActive = async id => {
  isToggling.value = id
  try {
    const response = await togglePlatformActive(id)
    const updatedPlatform = response.data || response

    const index = platforms.value.findIndex(p => p.id === id)
    if (index !== -1) {
      platforms.value[index] = updatedPlatform
    }

    toast.success(`Platform ${updatedPlatform.isActive ? 'activated' : 'deactivated'}`)
  } catch (error) {
    toast.error('Failed to toggle platform', {
      description: error.message || 'Please try again',
    })
  } finally {
    isToggling.value = null
  }
}

const handleDeletePlatform = async id => {
  if (!confirm('Are you sure you want to delete this platform? This action cannot be undone.'))
    return

  isDeleting.value = id
  try {
    await deletePlatform(id)
    platforms.value = platforms.value.filter(p => p.id !== id)
    toast.success('Platform deleted')
  } catch (error) {
    toast.error('Failed to delete platform', {
      description: error.message || 'Please try again',
    })
  } finally {
    isDeleting.value = null
  }
}
</script>

