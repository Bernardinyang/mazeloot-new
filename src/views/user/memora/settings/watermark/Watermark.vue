<template>
  <DashboardLayout>
    <template #breadcrumb>
      Settings > Watermark
    </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="w-[50%]">
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">Watermark</h1>
        <p class="text-sm mb-4" :class="theme.textSecondary">
          Protect your photos with custom watermarks and control how they're applied to downloads.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Content -->
      <div class="space-y-6 w-[50%]">
        <!-- Watermark Management Section -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Watermark</h3>
          
          <!-- Watermark Previews -->
          <div class="flex items-start gap-4">
            <!-- Existing Watermarks -->
            <div
              v-for="watermark in watermarks"
              :key="watermark.id"
              class="flex flex-col items-center gap-2 cursor-pointer group relative"
              @click="handleEditWatermark(watermark.id)"
            >
              <div
                class="w-32 h-32 rounded border-2 flex items-center justify-center transition-colors hover:border-teal-500 overflow-hidden relative"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                ]"
              >
                <span v-if="watermark.type === 'text'" class="text-lg font-light text-gray-400" :style="{ fontFamily: watermark.font }">
                  {{ watermark.text }}
                </span>
                <img
                  v-else-if="watermark.type === 'image' && watermark.imageUrl"
                  :src="watermark.imageUrl"
                  :alt="watermark.name"
                  class="w-full h-full object-contain p-2"
                />
                <!-- Delete Button on Hover -->
                <button
                  @click.stop="handleDeleteWatermark(watermark.id)"
                  class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  :class="theme.bgCard"
                >
                  <X class="h-3.5 w-3.5" />
                </button>
              </div>
              <span class="text-xs font-medium uppercase" :class="theme.textSecondary">
                {{ watermark.name }}
              </span>
            </div>

            <!-- Add New Watermark -->
            <div
              class="flex flex-col items-center gap-2 cursor-pointer"
              @click="handleAddWatermark()"
            >
              <div
                class="w-32 h-32 rounded border-2 border-dashed flex items-center justify-center transition-colors hover:border-teal-500"
                :class="[
                  theme.borderSecondary,
                  theme.bgCard,
                ]"
              >
                <Plus class="h-8 w-8" :class="theme.textTertiary" />
              </div>
            </div>
          </div>

          <!-- Description -->
          <p class="text-xs" :class="theme.textSecondary">
            Protect your photos with custom watermarks. Watermarks will not appear on prints ordered through Store. 
            <a href="#" class="text-teal-500 hover:text-teal-600 underline">Learn more</a>.
          </p>
        </div>

        <!-- Apply Watermark to Web Size Downloads Section -->
        <div class="flex items-center justify-between py-4">
          <div class="flex-1">
            <h3 class="text-base font-semibold mb-1" :class="theme.textPrimary">Apply watermark to web size downloads</h3>
            <p class="text-xs" :class="theme.textSecondary">
              Enable to apply watermark to web size downloads from your collections and web size downloads sold through Store.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              v-model="applyToWebDownloads"
              class="sr-only peer"
            />
            <div class="w-14 h-7 rounded-full transition-all duration-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-teal-500 bg-gray-300 dark:bg-gray-600 group-hover:shadow-lg"></div>
            <span class="ml-3 text-sm font-medium" :class="applyToWebDownloads ? theme.textPrimary : theme.textSecondary">
              {{ applyToWebDownloads ? 'On' : 'Off' }}
            </span>
          </label>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Separator } from '@/components/shadcn/separator'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

const router = useRouter()

const theme = useThemeClasses()

// Form state
const applyToWebDownloads = ref(true)

interface Watermark {
  id: number
  name: string
  type: 'text' | 'image'
  text?: string
  font?: string
  imageUrl?: string
}

const watermarks = ref<Watermark[]>([
  {
    id: 1,
    name: 'MY WATERMARK 1',
    type: 'text',
    text: 'Bernode',
    font: 'cursive',
  },
  {
    id: 3,
    name: 'MY WATERMARK 3',
    type: 'text',
    text: 'Mazeloot',
    font: 'cursive',
  },
  {
    id: 2,
    name: 'MY WATERMARK 2',
    type: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200&h=200&fit=crop',
  },
])

const handleEditWatermark = (id: number) => {
  router.push({ name: 'editWatermark', params: { id: id.toString() } })
}

const handleAddWatermark = () => {
  router.push({ name: 'addWatermark' })
}

const handleDeleteWatermark = (id: number) => {
  // TODO: Implement delete watermark logic
  const index = watermarks.value.findIndex((w: Watermark) => w.id === id)
  if (index > -1) {
    watermarks.value.splice(index, 1)
    toast.success('Watermark deleted successfully')
  }
}
</script>
