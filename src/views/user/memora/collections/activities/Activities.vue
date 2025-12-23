<template>
  <CollectionLayout :collection="collection" :is-loading="isLoading" @go-back="goBack">
    <template #content>
      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div v-if="isLoading" class="p-8 flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-4">
            <Loader2 :class="theme.textSecondary" class="h-8 w-8 animate-spin mx-auto" />
            <p :class="theme.textSecondary" class="text-sm">Loading activities...</p>
          </div>
        </div>

        <div v-else class="p-6 md:p-8 transition-all duration-300">
          <!-- Page Header -->
          <div class="mb-10">
            <div class="flex items-center gap-3 mb-2">
              <h1 :class="theme.textPrimary" class="text-2xl md:text-3xl font-bold">
                Collection Activities
              </h1>
            </div>
            <p :class="theme.textSecondary" class="text-sm leading-relaxed max-w-2xl">
              View and manage all activities related to this collection including downloads,
              favourites, email registrations, share links, and private photo access.
            </p>
          </div>

          <!-- Activities Overview Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div
              :class="[theme.borderSecondary, theme.bgCard]"
              class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 cursor-pointer"
              @click="
                router.push({
                  name,
                  params,
                })
              "
            >
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
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
              class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 cursor-pointer"
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
              class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 cursor-pointer"
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
                class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Link class="h-5 w-5 text-teal-600 dark:text-teal-400" />
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
                :to="{ name: 'collectionActivitiesPrivatePhotos', params: { uuid: collection.id } }"
                class="p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30 hover:shadow-lg"
              >
                <div class="flex items-center gap-3 mb-2">
                  <Lock class="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  <h3 :class="theme.textPrimary" class="text-base font-semibold">Private Photos</h3>
                </div>
                <p :class="theme.textSecondary" class="text-sm">
                  View private photo access and activity
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
import { Download, Heart, Link, Loader2, Lock, Mail } from 'lucide-vue-next'
import CollectionLayout from '@/layouts/CollectionLayout.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useSidebarCollapse } from '@/composables/useSidebarCollapse'
import { useGalleryStore } from '@/stores/gallery'

const route = useRoute()
const router = useRouter()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

// Collection data
const collection = ref(null)
const isLoading = ref(false)

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
