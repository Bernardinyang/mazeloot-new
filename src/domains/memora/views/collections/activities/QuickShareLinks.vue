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
                variant="primary"
                :icon="Plus"
                @click="showCreateModal = true"
              >
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
          <div :class="[theme.borderSecondary, theme.bgCard]" class="rounded-2xl border-2 overflow-hidden">
            <DataTable
              :items="shareLinks"
              :columns="tableColumns"
              :loading="isLoading"
              :empty-message="'No quick share links yet'"
              :empty-icon="Link"
            >
              <template #cell-url="{ item }">
                <div class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <Link :class="theme.textSecondary" class="h-4 w-4" />
                    <a
                      :href="item.url"
                      class="text-sm text-accent hover:underline font-mono"
                      target="_blank"
                    >
                      {{ item.url }}
                    </a>
                    <button
                      class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Copy link"
                      @click.stop="copyToClipboard(item.url, item.id)"
                    >
                      <Copy :class="theme.textSecondary" class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </template>
              <template #cell-createdAt="{ item }">
                <div class="px-6 py-4">
                  <div :class="theme.textPrimary" class="text-sm">
                    {{ formatDate(item.createdAt) }}
                  </div>
                </div>
              </template>
              <template #cell-clickCount="{ item }">
                <div class="px-6 py-4">
                  <div :class="theme.textPrimary" class="text-sm">
                    {{ item.clickCount || 0 }}
                  </div>
                </div>
              </template>
              <template #cell-lastUsedAt="{ item }">
                <div class="px-6 py-4">
                  <div :class="theme.textPrimary" class="text-sm">
                    {{ item.lastUsedAt ? formatDate(item.lastUsedAt) : 'Never' }}
                  </div>
                </div>
              </template>
              <template #empty>
                <div class="px-6 py-12 text-center">
                  <Link :class="theme.textTertiary" class="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p :class="theme.textPrimary" class="text-sm font-medium mb-2">
                    No quick share links yet
                  </p>
                  <p :class="theme.textSecondary" class="text-xs mb-4">
                    Create your first quick share link to get started
                  </p>
                  <Button
                    variant="primary"
                    :icon="Plus"
                    @click="showCreateModal = true"
                  >
                    Create Link
                  </Button>
                </div>
              </template>
            </DataTable>
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
  Plus,
} from 'lucide-vue-next'
import { Button } from '@/shared/components/shadcn/button'
import CollectionLayout from '@/shared/layouts/CollectionLayout.vue'
import DataTable from '@/shared/components/organisms/DataTable.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { useGalleryStore } from '@/shared/stores/gallery'
import { toast } from '@/shared/utils/toast'

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

// Table columns
const tableColumns = [
  { key: 'url', label: 'Link', slot: 'url' },
  { key: 'createdAt', label: 'Created', slot: 'createdAt' },
  { key: 'clickCount', label: 'Clicks', slot: 'clickCount' },
  { key: 'lastUsedAt', label: 'Last Used', slot: 'lastUsedAt' },
]

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
    
    const { useCollectionsApi } = await import('@/domains/memora/api/collections')
    const { getShareLinkActivities } = useCollectionsApi()
    shareLinks.value = await getShareLinkActivities(collectionId)
  } catch (error) {
    console.error('Failed to load share link activities:', error)
    shareLinks.value = []
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
const copyToClipboard = async (text, linkId) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard')
    
    // Track share link copy with email
    if (collection.value?.id || collection.value?.uuid) {
      const collectionId = collection.value?.id || collection.value?.uuid
      try {
        // Get stored email from localStorage (same as public collection view)
        const storedEmail = localStorage.getItem(`collection_email_${collectionId}`)
        const { useCollectionsApi } = await import('@/domains/memora/api/collections')
        const { trackShareLinkClick } = useCollectionsApi()
        await trackShareLinkClick(collectionId, linkId, text, storedEmail)
      } catch (err) {
        // Don't fail if tracking fails
        console.warn('Failed to track share link copy:', err)
      }
    }
  } catch (error) {
    toast.error('Failed to copy link')
  }
}

</script>
