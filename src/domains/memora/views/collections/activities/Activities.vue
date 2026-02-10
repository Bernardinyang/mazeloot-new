<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-4 sm:p-6 md:p-8 transition-all duration-300">
          <!-- Skeleton Header -->
          <div class="mb-10">
            <Skeleton class="h-9 w-64 rounded-lg mb-2" />
            <Skeleton class="h-4 w-96 rounded-md" />
          </div>

          <!-- Skeleton Activity Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div
              v-for="i in 3"
              :key="i"
              class="p-4 sm:p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800"
            >
              <div class="flex items-center gap-3 mb-3">
                <Skeleton class="h-11 w-11 rounded-xl" />
                <div class="flex-1">
                  <Skeleton class="h-4 w-24 rounded-md mb-1" />
                  <Skeleton class="h-3 w-32 rounded-md" />
                </div>
              </div>
              <Skeleton class="h-8 w-16 rounded-md" />
            </div>
          </div>

          <!-- Skeleton Quick Links -->
          <div class="space-y-4">
            <Skeleton class="h-6 w-32 rounded-md" />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="i in 2"
                :key="i"
                class="p-4 sm:p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-800"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Skeleton class="h-5 w-5 rounded" />
                  <Skeleton class="h-5 w-32 rounded-md" />
                </div>
                <Skeleton class="h-4 w-48 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-4 sm:p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                Collection Activities
              </h1>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              View and manage all activities related to this collection including downloads,
              favourites, email registrations, share links, and private media access.
            </p>
          </div>

          <!-- Activities Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 cursor-pointer"
              @click="
                router.push({
                  name,
                  params,
                })
              "
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="p-3 rounded-xl bg-accent/10 dark:bg-accent/20 text-accent"
                >
                  <Download class="h-5 w-5" />
                </div>
                <div>
                  <h3 :class="theme.textPrimary" class="text-sm font-semibold">Downloads</h3>
                  <p :class="theme.textSecondary" class="text-xs">View download activity</p>
                </div>
              </div>
              <p :class="theme.textPrimary" class="text-2xl font-bold">{{ downloadCount }}</p>
            </div>

            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 cursor-pointer"
              @click="
                router.push({
                  name,
                  params,
                })
              "
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="p-3 rounded-xl bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400"
                >
                  <Heart class="h-5 w-5" />
                </div>
                <div>
                  <h3 :class="theme.textPrimary" class="text-sm font-semibold">Favourites</h3>
                  <p :class="theme.textSecondary" class="text-xs">View favourite activity</p>
                </div>
              </div>
              <p :class="theme.textPrimary" class="text-2xl font-bold">{{ favouriteCount }}</p>
            </div>

            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 cursor-pointer"
              @click="
                router.push({
                  name,
                  params,
                })
              "
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                >
                  <Mail class="h-5 w-5" />
                </div>
                <div>
                  <h3 :class="theme.textPrimary" class="text-sm font-semibold">
                    Email Registrations
                  </h3>
                  <p :class="theme.textSecondary" class="text-xs">View registered emails</p>
                </div>
              </div>
              <p :class="theme.textPrimary" class="text-2xl font-bold">{{ emailCount }}</p>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h2 :class="theme.textPrimary" class="text-lg font-bold">Quick Access</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <router-link
                v-if="collection?.id"
                :class="[theme.borderSecondary, theme.bgCard]"
                :to="{ name: 'collectionActivitiesQuickShare', params: { uuid: collection.id } }"
                class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Link class="h-5 w-5 text-accent" />
                  <h3 :class="theme.textPrimary" class="text-base font-semibold">
                    Quick Share Links
                  </h3>
                </div>
                <p :class="theme.textSecondary" class="text-sm">
                  Manage and view quick share link activity
                </p>
              </router-link>

              <router-link
                v-if="collection?.id"
                :class="[theme.borderSecondary, theme.bgCard]"
                :to="{ name: 'collectionActivitiesPrivateMedia', params: { uuid: collection.id } }"
                class="p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Lock class="h-5 w-5 text-accent" />
                  <h3 :class="theme.textPrimary" class="text-base font-semibold">Private Media</h3>
                </div>
                <p :class="theme.textSecondary" class="text-sm">
                  View private media access and activity
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CollectionLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Download, Heart, Link, Lock, Mail } from '@/shared/utils/lucideAnimated'
import { Skeleton } from '@/shared/components/shadcn/skeleton'
import CollectionLayout from '@/domains/memora/layouts/CollectionLayout.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useSidebarCollapse } from '@/shared/composables/useSidebarCollapse'
import { useGalleryStore } from '@/shared/stores/gallery'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(true)

// UI State
const { isSidebarCollapsed } = useSidebarCollapse()

// Activity counts (placeholder - would come from API)
const downloadCount = ref(0)
const favouriteCount = ref(0)
const emailCount = ref(0)

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  isLoading.value = true
  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    // downloadCount.value = await fetchDownloadCount(collectionId)
    // favouriteCount.value = await fetchFavouriteCount(collectionId)
    // emailCount.value = await fetchEmailCount(collectionId)
  } catch (error) {
  } finally {
    isLoading.value = false
  }
})

// Navigation
const goBack = () => {
  router.push({ name: 'collectionPhotos', params: { uuid: collection.value?.id } })
}
</script>
