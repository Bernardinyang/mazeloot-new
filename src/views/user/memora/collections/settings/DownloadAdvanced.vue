<template>
  <div class="space-y-6">
    <!-- Limit Photo Downloads -->
    <div
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">Limit Photo Downloads</h3>
          <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
            Set the number of photos that can be downloaded in this collection. Note that this limit
            is shared between all visitors who can download. If you restrict downloads to contacts
            only, each client will be able to download their own set of photos up to the limit.
            <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
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
          class="w-20 focus:ring-2 focus:ring-teal-500/20"
          :class="[theme.bgInput, theme.borderInput, theme.textInput]"
        />
        <span class="text-sm font-medium" :class="theme.textPrimary">photo</span>
      </div>
    </div>

    <!-- Restrict Downloads to Specific Contacts -->
    <div
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
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
    </div>

    <!-- Photo Sets Available for Download -->
    <div
      class="space-y-4 p-6 rounded-2xl border-2 transition-all duration-300 hover:border-teal-500/30"
      :class="[theme.borderSecondary, theme.bgCard]"
    >
      <div>
        <h3 class="text-lg font-bold mb-1.5" :class="theme.textPrimary">
          Photo Sets Available for Download
        </h3>
        <p class="text-xs leading-relaxed mb-3" :class="theme.textSecondary">
          Select which sets have download enabled. This applies to Gallery Download, Video Download,
          and Single Photo Download.
          <a href="#" class="text-teal-600 dark:text-teal-400 hover:underline font-medium"
            >Learn more</a
          >
        </p>
      </div>
      <div class="space-y-2.5">
        <label
          v-for="set in photoSets"
          :key="set.id"
          class="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <input
            type="checkbox"
            :checked="selectedSets.includes(set.id)"
            @change="toggleSet(set.id)"
            class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 transition-all"
          />
          <span class="text-sm font-medium" :class="theme.textPrimary">{{ set.name }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Input } from '@/components/shadcn/input'
import ToggleSwitch from '@/components/molecules/ToggleSwitch.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { useGalleryStore } from '@/stores/gallery'
import { toast } from '@/utils/toast'

const route = useRoute()
const theme = useThemeClasses()
const galleryStore = useGalleryStore()

const collection = ref(null)

const limitDownloads = ref(true)
const downloadLimit = ref(1)
const restrictToContacts = ref(false)
const photoSets = ref([
  { id: 'highlights', name: 'Highlights' },
  { id: 'all', name: 'All Photos' },
])
const selectedSets = ref(['1', '2'])

// Load collection data
onMounted(async () => {
  const collectionId = route.params.uuid
  if (!collectionId) return

  try {
    const collectionData = await galleryStore.fetchCollection(collectionId)
    collection.value = collectionData
    limitDownloads.value = collectionData.limitDownloads || false
    downloadLimit.value = collectionData.downloadLimit || 1
    restrictToContacts.value = collectionData.restrictToContacts || false
    selectedSets.value = collectionData.downloadableSets || []
  } catch (error) {
    toast.error('Failed to load collection')
  }
})

const toggleSet = setId => {
  const index = selectedSets.value.indexOf(setId)
  if (index > -1) {
    selectedSets.value.splice(index, 1)
  } else {
    selectedSets.value.push(setId)
  }
}

// Watch and save advanced download settings changes
watch(limitDownloads, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      limitDownloads,
    })
  } catch (error) {
    toast.error('Failed to update download limit')
  }
})

watch(downloadLimit, async newLimit => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      downloadLimit,
    })
  } catch (error) {
    toast.error('Failed to update download limit count')
  }
})

watch(restrictToContacts, async newValue => {
  if (!collection.value) return
  try {
    await galleryStore.updateCollection(collection.value.id, {
      restrictToContacts,
    })
  } catch (error) {
    toast.error('Failed to update restrict to contacts')
  }
})

watch(
  selectedSets,
  async newSets => {
    if (!collection.value) return
    try {
      await galleryStore.updateCollection(collection.value.id, {
        downloadableSets,
      })
    } catch (error) {
      toast.error('Failed to update downloadable sets')
    }
  },
  { deep: true }
)
</script>
