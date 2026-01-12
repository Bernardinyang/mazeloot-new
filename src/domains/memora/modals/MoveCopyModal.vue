<template>
  <SidebarModal
    :model-value="props.modelValue"
    :title="props.action === 'move' ? 'MOVE ITEMS' : 'COPY ITEMS'"
    content-class="sm:max-w-md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="space-y-4">
      <!-- Action Type Selection -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold"> Action </label>
        <div class="flex gap-2">
          <button
            :class="[props.action === 'move' ? 'bg-accent text-accent-foreground border-accent' : '']"
            class="flex-1 px-4 py-2 rounded-lg border-2 transition-all"
            @click="emit('update:action', 'move')"
          >
            Move
          </button>
          <button
            :class="[props.action === 'copy' ? 'bg-accent text-accent-foreground border-accent' : '']"
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

      <!-- Collection/Selection Selection -->
      <div class="space-y-2">
        <label :class="theme.textPrimary" class="text-sm font-semibold">
          Select {{ getContextLabel() }}
        </label>
        <Select
          :model-value="props.targetCollectionId"
          @update:model-value="handleContextChange($event)"
        >
          <SelectTrigger
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            class="w-full"
          >
            <SelectValue
              :placeholder="`Choose a ${getContextLabel().toLowerCase()}`"
            />
          </SelectTrigger>
          <SelectContent :class="[theme.bgDropdown, theme.borderSecondary]">
            <SelectItem
              v-if="props.currentCollectionId"
              :class="[theme.textPrimary, theme.bgButtonHover]"
              :label="
                props.currentCollectionName ||
                `Current ${getContextLabel()}`
              "
              :value="props.currentCollectionId"
            >
              {{
                props.currentCollectionName ||
                `Current ${getContextLabel()}`
              }}
            </SelectItem>
            <SelectItem
              v-for="col in filteredAvailableCollections"
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
          :disabled="props.isLoadingSets || !props.targetCollectionId"
          @update:model-value="emit('update:targetSetId', $event)"
        >
          <SelectTrigger
            :class="[theme.bgInput, theme.borderInput, theme.textInput]"
            class="w-full"
          >
            <SelectValue :placeholder="props.isLoadingSets ? 'Loading sets...' : 'Choose a set'" />
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
        <p
          v-else-if="props.targetCollectionSets.length > 0"
          :class="theme.textTertiary"
          class="text-xs"
        >
          {{ props.targetCollectionSets.length }} set{{
            props.targetCollectionSets.length > 1 ? 's' : ''
          }}
          available
        </p>
      </div>
    </div>

    <template #footer>
      <ActionButtonGroup
        :confirm-label="props.action === 'move' ? 'Move' : 'Copy'"
        :disabled="
          props.isMoving || !props.targetCollectionId || !props.targetSetId || props.isLoadingSets
        "
        :loading="props.isMoving"
        :loading-label="props.action === 'move' ? 'Moving...' : 'Copying...'"
        cancel-label="Cancel"
        @cancel="emit('cancel')"
        @confirm="emit('confirm')"
      />
    </template>
  </SidebarModal>
</template>

<script setup>
import { computed } from 'vue'
import SidebarModal from '@/shared/modals/SidebarModal.vue'
import ActionButtonGroup from '@/shared/components/molecules/ActionButtonGroup.vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/shadcn/select'

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
  context: { type: String, default: 'collection' }, // 'collection' | 'selection' | 'raw_files'
})

const emit = defineEmits([
  'update:modelValue',
  'update:action',
  'collection-change',
  'selection-change',
  'raw-files-change',
  'update:targetSetId',
  'cancel',
  'confirm',
])

// Filter out the current collection/selection/raw_files from available collections to avoid duplicates
const filteredAvailableCollections = computed(() => {
  if (!props.currentCollectionId) {
    return props.availableCollections
  }
  return props.availableCollections.filter(col => col.id !== props.currentCollectionId)
})

const getContextLabel = () => {
  switch (props.context) {
    case 'selection':
      return 'Selection'
    case 'raw_files':
      return 'Raw Files'
    case 'collection':
    default:
      return 'Collection'
  }
}

const handleContextChange = (value) => {
  switch (props.context) {
    case 'selection':
      emit('selection-change', value)
      break
    case 'raw_files':
      emit('raw-files-change', value)
      break
    case 'collection':
    default:
      emit('collection-change', value)
      break
  }
}
</script>
