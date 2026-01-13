<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent :class="[theme.bgCard, theme.borderCard, 'sm:max-w-[900px] max-h-[90vh] overflow-y-auto']">
      <DialogHeader>
        <DialogTitle :class="['text-xl font-bold', theme.textPrimary]">
          Compare Presets
        </DialogTitle>
        <p class="text-sm mt-1.5" :class="theme.textSecondary">
          Compare settings between two presets to see differences.
        </p>
      </DialogHeader>

      <div class="space-y-6 mt-4">
        <!-- Preset Selection -->
        <div v-if="!preset1 || !preset2" class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-semibold" :class="theme.textPrimary">Preset 1</label>
            <Select v-model="selectedPreset1Id">
              <SelectTrigger
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  'border-2 transition-all duration-200 focus:ring-2 focus:ring-accent/20 focus:border-accent/50',
                ]"
              >
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                <SelectItem
                  v-for="p in availablePresets"
                  :key="p.id"
                  :value="p.id"
                  :class="[theme.textPrimary, theme.bgButtonHover, 'hover:bg-accent/10 dark:hover:bg-accent/20']"
                >
                  {{ p.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold" :class="theme.textPrimary">Preset 2</label>
            <Select v-model="selectedPreset2Id">
              <SelectTrigger
                :class="[
                  theme.bgInput,
                  theme.borderInput,
                  theme.textInput,
                  'border-2 transition-all duration-200 focus:ring-2 focus:ring-accent/20 focus:border-accent/50',
                ]"
              >
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
                <SelectItem
                  v-for="p in availablePresets"
                  :key="p.id"
                  :value="p.id"
                  :class="[theme.textPrimary, theme.bgButtonHover, 'hover:bg-accent/10 dark:hover:bg-accent/20']"
                >
                  {{ p.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Comparison View -->
        <div v-else class="space-y-4">
          <div
            class="grid grid-cols-2 gap-4 border-b-2 pb-4 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/50"
            :class="theme.borderSecondary"
          >
            <div>
              <h3 class="font-bold text-base" :class="theme.textPrimary">{{ preset1.name }}</h3>
              <p v-if="preset1.description" class="text-xs mt-1.5 leading-relaxed" :class="theme.textSecondary">
                {{ preset1.description }}
              </p>
            </div>
            <div>
              <h3 class="font-bold text-base" :class="theme.textPrimary">{{ preset2.name }}</h3>
              <p v-if="preset2.description" class="text-xs mt-1.5 leading-relaxed" :class="theme.textSecondary">
                {{ preset2.description }}
              </p>
            </div>
          </div>

          <!-- General Settings -->
          <div class="space-y-3">
            <h4 class="font-bold text-sm" :class="theme.textPrimary">General</h4>
            <div
              v-for="field in [
                { label: 'Email Registration', key: 'emailRegistration' },
                { label: 'Gallery Assist', key: 'galleryAssist' },
                { label: 'Slideshow', key: 'slideshow' },
                { label: 'Social Sharing', key: 'socialSharing' },
                { label: 'Language', key: 'language' },
              ]"
              :key="field.key"
              class="grid grid-cols-2 gap-4 py-3 border-b transition-all duration-200"
              :class="[
                theme.borderSecondary,
                isDifferent(preset1[field.key], preset2[field.key])
                  ? 'bg-yellow-50 dark:bg-yellow-950/10 border-yellow-200 dark:border-yellow-900/30'
                  : '',
              ]"
            >
              <div
                class="text-sm"
                :class="
                  isDifferent(preset1[field.key], preset2[field.key])
                    ? 'font-medium text-accent'
                    : theme.textPrimary
                "
              >
                {{ formatValue(preset1[field.key]) }}
              </div>
              <div
                class="text-sm"
                :class="
                  isDifferent(preset1[field.key], preset2[field.key])
                    ? 'font-medium text-accent'
                    : theme.textPrimary
                "
              >
                {{ formatValue(preset2[field.key]) }}
              </div>
            </div>
          </div>

          <!-- Design Settings -->
          <div class="space-y-3">
            <h4 class="font-bold text-sm" :class="theme.textPrimary">Design</h4>
            <div
              v-for="field in [
                { label: 'Font Family', key: 'fontFamily', path: 'design' },
                { label: 'Color Palette', key: 'colorPalette', path: 'design' },
                { label: 'Grid Style', key: 'gridStyle', path: 'design' },
                { label: 'Grid Columns', key: 'gridColumns', path: 'design' },
              ]"
              :key="field.key"
              class="grid grid-cols-2 gap-4 py-3 border-b transition-all duration-200"
              :class="[
                theme.borderSecondary,
                isDifferent(
                  preset1[field.path]?.[field.key],
                  preset2[field.path]?.[field.key]
                )
                  ? 'bg-yellow-50 dark:bg-yellow-950/10'
                  : '',
              ]"
            >
              <div
                class="text-sm"
                :class="
                  isDifferent(
                    preset1[field.path]?.[field.key],
                    preset2[field.path]?.[field.key]
                  )
                    ? 'font-medium text-accent'
                    : theme.textPrimary
                "
              >
                {{ formatValue(preset1[field.path]?.[field.key]) }}
              </div>
              <div
                class="text-sm"
                :class="
                  isDifferent(
                    preset1[field.path]?.[field.key],
                    preset2[field.path]?.[field.key]
                  )
                    ? 'font-medium text-accent'
                    : theme.textPrimary
                "
              >
                {{ formatValue(preset2[field.path]?.[field.key]) }}
              </div>
            </div>
          </div>

          <!-- Privacy Settings -->
          <div class="space-y-3">
            <h4 class="font-bold text-sm" :class="theme.textPrimary">Privacy</h4>
            <div
              v-for="field in [
                { label: 'Show on Homepage', key: 'showOnHomepage', path: 'privacy' },
                {
                  label: 'Client Exclusive Access',
                  key: 'clientExclusiveAccess',
                  path: 'privacy',
                },
              ]"
              :key="field.key"
              class="grid grid-cols-2 gap-4 py-3 border-b transition-all duration-200"
              :class="[
                theme.borderSecondary,
                isDifferent(
                  preset1[field.path]?.[field.key],
                  preset2[field.path]?.[field.key]
                )
                  ? 'bg-yellow-50 dark:bg-yellow-950/10'
                  : '',
              ]"
            >
              <div
                class="text-sm"
                :class="
                  isDifferent(
                    preset1[field.path]?.[field.key],
                    preset2[field.path]?.[field.key]
                  )
                    ? 'font-medium text-accent'
                    : theme.textPrimary
                "
              >
                {{ formatValue(preset1[field.path]?.[field.key]) }}
              </div>
              <div
                class="text-sm"
                :class="
                  isDifferent(
                    preset1[field.path]?.[field.key],
                    preset2[field.path]?.[field.key]
                  )
                    ? 'font-medium text-accent'
                    : theme.textPrimary
                "
              >
                {{ formatValue(preset2[field.path]?.[field.key]) }}
              </div>
            </div>
          </div>

          <!-- Download Settings -->
          <div class="space-y-3">
            <h4 class="font-bold text-sm" :class="theme.textPrimary">Download</h4>
            <div
              v-for="field in [
                { label: 'Media Download', key: 'photoDownload', path: 'download' },
                {
                  label: 'High Resolution',
                  key: 'enabled',
                  path: 'download.highResolution',
                },
              ]"
              :key="field.key"
              class="grid grid-cols-2 gap-4 py-3 border-b transition-all duration-200"
              :class="[
                theme.borderSecondary,
                isDifferent(
                  field.path.includes('.')
                    ? preset1.download?.highResolution?.enabled
                    : preset1[field.path]?.[field.key],
                  field.path.includes('.')
                    ? preset2.download?.highResolution?.enabled
                    : preset2[field.path]?.[field.key]
                )
                  ? 'bg-yellow-50 dark:bg-yellow-950/10 border-yellow-200 dark:border-yellow-900/30'
                  : '',
              ]"
            >
              <div
                class="text-sm"
                :class="
                  isDifferent(
                    field.path.includes('.')
                      ? preset1.download?.highResolution?.enabled
                      : preset1[field.path]?.[field.key],
                    field.path.includes('.')
                      ? preset2.download?.highResolution?.enabled
                      : preset2[field.path]?.[field.key]
                  )
                    ? 'font-medium text-accent'
                    : theme.textPrimary
                "
              >
                {{
                  formatValue(
                    field.path.includes('.')
                      ? preset1.download?.highResolution?.enabled
                      : preset1[field.path]?.[field.key]
                  )
                }}
              </div>
              <div
                class="text-sm"
                :class="
                  isDifferent(
                    field.path.includes('.')
                      ? preset1.download?.highResolution?.enabled
                      : preset1[field.path]?.[field.key],
                    field.path.includes('.')
                      ? preset2.download?.highResolution?.enabled
                      : preset2[field.path]?.[field.key]
                  )
                    ? 'font-medium text-accent'
                    : theme.textPrimary
                "
              >
                {{
                  formatValue(
                    field.path.includes('.')
                      ? preset2.download?.highResolution?.enabled
                      : preset2[field.path]?.[field.key]
                  )
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            variant="outline"
            :class="[theme.borderSecondary, theme.textPrimary]"
            @click="$emit('update:open', false)"
          >
            Close
          </Button>
        </div>
      </template>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/shadcn/dialog'
import { Button } from '@/shared/components/shadcn/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { usePresetStore } from '@/domains/memora/stores/preset'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:open'])

const theme = useThemeClasses()
const presetStore = usePresetStore()

const selectedPreset1Id = ref(null)
const selectedPreset2Id = ref(null)

const preset1 = computed(() => {
  return selectedPreset1Id.value
    ? presetStore.getPresetById(selectedPreset1Id.value)
    : null
})

const preset2 = computed(() => {
  return selectedPreset2Id.value
    ? presetStore.getPresetById(selectedPreset2Id.value)
    : null
})

const availablePresets = computed(() => presetStore.presets)

const formatValue = val => {
  if (val === null || val === undefined) return 'Not set'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  return String(val)
}

const isDifferent = (val1, val2) => {
  return val1 !== val2
}
</script>

