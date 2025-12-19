<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading quick share links...</p>
          </div>
        </div>

        <div v-else class="p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-3">
                <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                  Quick Share Links
                </h1>
              </div>
              <Button
                class="gap-2 bg-teal-500 hover:bg-teal-600 text-white"
                @click="showCreateModal = true"
              >
                <Plus class="h-4 w-4" />
                Create Link
              </Button>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              Create and manage quick share links for easy access to specific photos or sets in this
              collection.
            </p>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Total Links</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ totalLinks }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Active Links</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ activeLinks }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">Total Clicks</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ totalClicks }}</p>
            </div>
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300"
            >
              <p :class="theme.textSecondary" class="text-sm font-medium mb-2">This Week</p>
              <p :class="theme.textPrimary" class="text-3xl font-bold">{{ thisWeekClicks }}</p>
            </div>
          </div>

          <!-- Links List -->
          <div class="space-y-4">
            <div
              v-for="link in shareLinks"
              :key="link.id"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 :class="theme.textPrimary" class="text-lg font-semibold">
                      {{ link.name || 'Untitled Link' }}
                    </h3>
                    <span
                      :class="
                        link.active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      "
                      class="px-2 py-1 rounded-full text-xs font-semibold"
                    >
                      {{ link.active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="flex items-center gap-4 mb-3">
                    <div class="flex items-center gap-2">
                      <Link :class="theme.textSecondary" class="h-4 w-4" />
                      <a
                        :href="link.url"
                        class="text-sm text-teal-600 dark:text-teal-400 hover:underline font-mono"
                        target="_blank"
                      >
                        {{ link.url }}
                      </a>
                      <button
                        class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Copy link"
                        @click="copyToClipboard(link.url)"
                      >
                        <Copy :class="theme.textSecondary" class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p :class="theme.textSecondary" class="text-sm mb-3">
                    {{ link.description || 'No description' }}
                  </p>
                  <div :class="theme.textSecondary" class="flex items-center gap-6 text-xs">
                    <span>Created) }}</span>
                    <span>•</span>
                    <span>{{ link.clickCount }} clicks</span>
                    <span>•</span>
                    <span
                      >Last used:
                      {{ link.lastUsedAt ? formatDate(link.lastUsedAt) : 'Never' }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-2 ml-4">
                  <Button
                    :class="[theme.borderSecondary, theme.textPrimary]"
                    class="gap-2"
                    size="sm"
                    variant="outline"
                    @click="editLink(link)"
                  >
                    <Pencil class="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    :class="theme.borderSecondary"
                    class="gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    size="sm"
                    variant="outline"
                    @click="deleteLink(link.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            <div
              v-if="shareLinks.length === 0"
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-12 rounded-2xl border-2 border-dashed text-center"
            >
              <Link :class="theme.textTertiary" class="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p :class="theme.textPrimary" class="text-sm font-medium mb-2">
                No quick share links yet
              </p>
              <p :class="theme.textSecondary" class="text-xs mb-4">
                Create your first quick share link to get started
              </p>
              <Button
                class="gap-2 bg-teal-500 hover:bg-teal-600 text-white"
                @click="showCreateModal = true"
              >
                <Plus class="h-4 w-4" />
                Create Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Copy,
  Download,
  Heart,
  Link,
  Loader2,
  Lock,
  Mail,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
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

// Share links data
const shareLinks = ref([])
const showCreateModal = ref(false)

// Computed stats
const totalLinks = computed(() => shareLinks.value.length)
const activeLinks = computed(() => shareLinks.value.filter(l => l.active).length)
const totalClicks = computed(() => shareLinks.value.reduce((sum, link) => sum + link.clickCount, 0))
const thisWeekClicks = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return shareLinks.value.filter(l => l.lastUsedAt && new Date(l.lastUsedAt) >= weekAgo).length
})

// Generate demo data
const generateDemoData = () => {
  const now = new Date()
  const demoLinks = []

  const linkNames = [
    'Wedding Highlights',
    'Reception Photos',
    'Ceremony Set',
    'Family Portraits',
    'Bridal Party',
    'Candid Moments',
    'Formal Shots',
    'Getting Ready',
  ]

  const descriptions = [
    'Best moments from the wedding day',
    'All reception photos',
    'Complete ceremony collection',
    'Family and group photos',
    'Bridal party photos',
    'Candid and spontaneous moments',
    'Formal portrait session',
    'Getting ready behind the scenes',
    null, // Some links have no description
  ]

  const baseUrl = window.location.origin

  // Generate 6-8 share links
  for (let i = 0; i < 7; i++) {
    const daysAgo = Math.floor(Math.random() * 45)
    const hoursAgo = Math.floor(Math.random() * 24)

    const createdAt = new Date(now)
    createdAt.setDate(createdAt.getDate() - daysAgo)
    createdAt.setHours(createdAt.getHours() - hoursAgo)

    const clickCount = Math.floor(Math.random() * 150) + 5
    const hasBeenUsed = clickCount > 0
    const lastUsedAt = hasBeenUsed
      ? (() => {
          const usedDate = new Date(createdAt)
          const daysSinceCreated = Math.floor(Math.random() * daysAgo)
          usedDate.setDate(usedDate.getDate() + daysSinceCreated)
          return usedDate.toISOString()
        })()
      : null

    const active = Math.random() > 0.2 // 80% active

    demoLinks.push({
      id: `link-${i + 1}`,
      name: linkNames[i % linkNames.length],
      url: `${baseUrl}/share/${Math.random().toString(36).substring(7)}`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      active: active,
      createdAt: createdAt.toISOString(),
      clickCount: clickCount,
      lastUsedAt: lastUsedAt,
    })
  }

  return demoLinks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    // TODO
    // shareLinks.value = await fetchShareLinks(collectionId)
    // For now, use demo data
    shareLinks.value = generateDemoData()
  } catch (error) {
    console.error('Failed to load collection:', error)
    // Still load demo data even if collection fetch fails
    shareLinks.value = generateDemoData()
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
}

// Format helpers
const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Copy to clipboard
const copyToClipboard = async text => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard')
  } catch (error) {
    toast.error('Failed to copy link')
  }
}

// Edit link
const editLink = link => {
  // TODO
  console.log('Edit link:', link)
}

// Delete link
const deleteLink = async linkId => {
  // TODO
  console.log('Delete link:', linkId)
  toast.success('Link deleted')
}
</script>
