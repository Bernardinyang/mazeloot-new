<template>
  <CenterModal
    :model-value="props.modelValue"
    :title="props.action === 'move' ? 'MOVE ITEMS' : 'COPY ITEMS'"
    content-class="sm:max-w-[500px]"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4 py-4">
      <!-- Action Type Selection -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Action </label>
        <div class="flex gap-2">
          <button
            :class="[props.action === 'move' ? 'bg-teal-500 text-white border-teal-500' : '']"
            class="flex-1 px-4 py-2 rounded-lg border-2 transition-all"
            @click="emit('update:action', 'move')"
          >
            Move
          </button>
          <button
            :class="[props.action === 'copy' ? 'bg-teal-500 text-white border-teal-500' : '']"
            class="flex-1 px-4 py-2 rounded-lg border-2 transition-all"
            @click="emit('update:action', 'copy')"
          >
            Copy
          </button>
        </div>
      </div>

      <p :class="theme.textSecondary" class="text-sm">
        {{ props.action === 'move' ? 'Move' : 'Copy' }}{{ props.selectedCount > 1 ? 's' : '' }} to:
      </p>

      <!-- Collection Selection -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Select Collection </label>
        <Select
          :model-value="props.targetCollectionId"
          @update:model-value="emit('collection-change', $event)"
        >
          <SelectTrigger
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            class="w-full"
          >
            <SelectValue placeholder="Choose a collection" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem
              :class="[theme.textPrimary, theme.bgButtonHover]"
              :label="props.currentCollectionName || 'Current Collection'"
              :value="props.currentCollectionId || ''"
            >
              {{ props.currentCollectionName || 'Current Collection' }}
            </SelectItem>
            <SelectItem
              v-for="col in props.availableCollections"
              :key="col.id"
              :class="[theme.textPrimary, theme.bgButtonHover]"
              :label="col.name"
              :value="col.id"
            >
              {{ col.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Set Selection (only show if collection is selected) -->
      <div v-if="props.targetCollectionId" class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Select Set </label>
        <Select
          :model-value="props.targetSetId"
          :disabled="props.isLoadingSets"
          @update:model-value="emit('update:targetSetId', $event)"
        >
          <SelectTrigger
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            class="w-full"
          >
            <SelectValue placeholder="Choose a set" />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem
              v-if="props.targetCollectionSets.length === 0 && !props.isLoadingSets"
              :class="[theme.textPrimary, theme.bgButtonHover]"
              disabled
              label="No sets available"
              value="none"
            >
              No sets available
            </SelectItem>
            <SelectItem
              v-for="set in props.targetCollectionSets"
              :key="set.id"
              :class="[theme.textPrimary, theme.bgButtonHover]"
              :label="set.name"
              :value="set.id"
            >
              {{ set.name }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p v-if="props.isLoadingSets" :class="theme.textTertiary" class="text-xs">
          Loading sets...
        </p>
      </div>
    </div>

    <template #footer>
      <ActionButtonGroup
        :confirm-label="props.action === 'move' ? 'Move' : 'Copy'"
        :disabled="props.isMoving || !props.targetCollectionId"
        :loading="props.isMoving"
        :loading-label="props.action === 'move' ? 'Moving...' : 'Copying...'"
        cancel-label="Cancel"
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </CenterModal>
</template>

<script setup>
import CenterModal from '@/components/molecules/CenterModal.vue'
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  action: { type: String, required: true }, // 'move' | 'copy'
  selectedCount: { type: Number, required: true },
  currentCollectionId: { type: String, default: '' },
  currentCollectionName: { type: String, default: '' },
  availableCollections: { type: Array, required: true },
  targetCollectionId: { type: String, required: true },
  targetCollectionSets: { type: Array, required: true },
  isLoadingSets: { type: Boolean, required: true },
  targetSetId: { type: String, required: true },
  isMoving: { type: Boolean, required: true },
})

const emit = defineEmits([
  'update:modelValue',
  'update:action',
  'collection-change',
  'update:targetSetId',
  'cancel',
  'confirm',
])
</script>
