<template>
  <div v-if="props.activeTab === 'photos' && !props.isSidebarCollapsed">
    <div class="flex items-center justify-between mb-4">
      <h2 :class="theme.textPrimary" class="text-sm font-bold">Media Sets</h2>
      <Button
        variant="accent"
        size="sm"
        :disabled="props.isSavingSets || props.disableAddSet"
        :loading="props.isSavingSets"
        loading-label="Saving..."
        :icon="!props.isSavingSets ? Plus : null"
        class="hover:scale-105 active:scale-95"
        @click="emit('add-set')"
      >
        Add Set
      </Button>
    </div>

    <!-- Skeleton Loader for Sets -->
    <div
      v-if="props.isLoading"
      class="space-y-2.5 max-h-[calc(5*3.5rem+4*0.625rem)] overflow-y-auto pr-1"
    >
      <div
        v-for="i in 3"
        :key="`skeleton-${i}`"
        class="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800/50 border-2 border-transparent animate-pulse"
      >
        <div class="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>

    <!-- Media Sets List -->
    <div
      v-else-if="displayMediaSets.length > 0"
      class="space-y-2.5 max-h-[calc(5*3.5rem+4*0.625rem)] overflow-y-auto pr-1 custom-scrollbar relative"
    >
      <!-- Loading overlay -->
      <Transition name="fade">
        <div
          v-if="props.isSavingSets"
          class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg"
        >
          <div class="flex flex-col items-center gap-2">
            <Loader2 class="h-5 w-5 animate-spin text-accent" />
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Saving...</span>
          </div>
        </div>
      </Transition>
      <TransitionGroup class="space-y-2.5" name="set-list" tag="div">
        <div
          v-for="(set, index) in displaySortedMediaSets"
          :key="set.id"
          :class="[
            'flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 ease-out group relative overflow-hidden',
            props.selectedSetId === set.id
              ? 'bg-white dark:bg-gray-800/50 border-2 border-accent/30 dark:border-accent/30 shadow-sm scale-[1.01]'
              : '',
            props.draggedSetId === set.id ? 'opacity-50 scale-95' : '',
            props.dragOverIndex === index ? 'ring-2 ring-accent ring-offset-2 scale-[1.02]' : '',
            props.isSavingSets ? 'opacity-60 pointer-events-none' : '',
            props.selectionStatus === 'completed' || props.selectionStatus === 'active' ? 'cursor-default' : 'cursor-move'
          ]"
          :draggable="!props.isSavingSets && props.selectionStatus !== 'completed' && props.selectionStatus !== 'active'"
          @click="emit('select-set', set.id)"
          @dragend="emit('set-drag-end')"
          @dragleave="emit('set-drag-leave')"
          @dragstart="emit('set-drag-start', $event, set.id, index)"
          @drop="emit('set-drop', $event, index)"
          @dragover.prevent="emit('set-drag-over', $event, index)"
        >
          <!-- Active indicator bar -->
          <Transition name="indicator">
            <div
              v-if="props.selectedSetId === set.id"
              class="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full transition-all duration-300"
            ></div>
          </Transition>

          <GripVertical
            :class="[
              props.selectedSetId === set.id ? 'text-accent' : '',
              props.isSavingSets ? 'opacity-30 cursor-not-allowed' : '',
            ]"
            class="h-4 w-4 flex-shrink-0 opacity-50 transition-all duration-200 ml-1 hover:opacity-70 hover:scale-110"
          />
          <span
            v-if="!props.editingSetId || props.editingSetId !== set.id"
            :class="[props.selectedSetId === set.id ? 'text-accent' : '']"
            class="flex-1 text-xs font-bold tracking-wide truncate"
          >
            {{ set.name }}
          </span>
          <input
            v-else
            :value="props.editingSetName"
            :class="[theme.bgInput, theme.borderInput, theme.textInput, 'focus:border-accent']"
            class="flex-1 text-xs font-bold px-3 py-1.5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200"
            @input="emit('update:editingSetName', $event.target.value)"
            @blur="emit('save-set-name', set.id)"
            @keydown.enter="emit('save-set-name', set.id)"
            @keydown.esc="emit('cancel-set-name-edit')"
            @click.stop
          />
          <div class="flex items-center gap-2">
            <span
              :class="[props.selectedSetId === set.id ? 'bg-accent text-accent-foreground shadow-sm' : '']"
              class="text-xs px-3 py-1.5 rounded-full font-bold min-w-[2.5rem] text-center transition-all duration-300 ease-out"
            >
              <template v-if="props.setProgress && props.setProgress[set.id] && props.setProgress[set.id].total > 0">
                {{ props.setProgress[set.id].selected }}/{{ props.setProgress[set.id].total }}
              </template>
              <template v-else>
                {{ set.count }}
              </template>
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                :class="[
                  props.selectedSetId === set.id
                    ? 'hover:bg-accent/20 dark:hover:bg-accent/30'
                    : '',
                  theme.textSecondary,
                ]"
                :disabled="props.isSavingSets"
                class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                @click.stop
              >
                <MoreVertical class="h-4 w-4 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent :class="[theme.bgDropdown, theme.borderSecondary]" align="end">
              <DropdownMenuItem
                v-if="props.selectionStatus !== 'completed' && props.selectionStatus !== 'active'"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                :disabled="props.isSavingSets"
                @click="emit('edit-set', set.id)"
              >
                <Pencil class="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="props.selectionStatus === 'completed'"
                :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                :disabled="props.isSavingSets || props.isCopyingFilenames"
                @click="emit('copy-filenames', set.id)"
              >
                <Copy v-if="!props.isCopyingFilenames" class="h-4 w-4 mr-2" />
                <Loader2 v-else class="h-4 w-4 mr-2 animate-spin" />
                {{ props.isCopyingFilenames ? 'Copying...' : 'Copy All Selected Filenames' }}
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="props.selectionStatus !== 'completed' && props.selectionStatus !== 'active'"
                :class="[
                  'text-red-600 dark:text-red-400',
                  'hover:bg-red-50 dark:hover:bg-red-900/20',
                  'cursor-pointer',
                ]"
                :disabled="props.isSavingSets"
                @click="emit('delete-set', set.id)"
              >
                <Trash2 class="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TransitionGroup>
    </div>
    <div v-else class="text-center py-10">
      <div class="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 w-fit mx-auto mb-4 shadow-sm">
        <ImageIcon :class="theme.textTertiary" class="h-8 w-8 opacity-40" />
      </div>
      <p :class="theme.textPrimary" class="text-sm font-semibold mb-1.5">No sets yet</p>
      <p :class="theme.textTertiary" class="text-xs">Create your first media set to get started</p>
    </div>
  </div>
</template>

<script setup>
import {
  Copy,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  Settings,
  Trash2,
  GripVertical,
  ImageIcon,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/shadcn/dropdown-menu'
import { Button } from '@/shared/components/shadcn/button'
import { computed } from 'vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const theme = useThemeClasses()

// Use props directly - PhaseSidebarPanels already provides the correct store data
const displayMediaSets = computed(() => props.mediaSets)
const displaySortedMediaSets = computed(() => props.sortedMediaSets)

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
    validator: value => ['photos', 'design', 'settings', 'activities'].includes(value),
  },
  isSidebarCollapsed: {
    type: Boolean,
    required: true,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
  isSavingSets: {
    type: Boolean,
    required: true,
  },
  mediaSets: {
    type: Array,
    required: true,
  },
  sortedMediaSets: {
    type: Array,
    required: true,
  },
  selectedSetId: {
    type: [String, null],
    required: true,
  },
  draggedSetId: {
    type: [String, null],
    required: true,
  },
  dragOverIndex: {
    type: [Number, null],
    required: true,
  },
  editingSetId: {
    type: [String, null],
    required: true,
  },
  editingSetName: {
    type: String,
    required: true,
  },
  selectionStatus: {
    type: String,
    default: null,
  },
  disableAddSet: {
    type: Boolean,
    default: false,
  },
  isCopyingFilenames: {
    type: Boolean,
    default: false,
  },
  setProgress: {
    type: Object,
    default: () => ({}),
  },
  onCopySelectedFilenamesInSet: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits([
  'add-set',
  'select-set',
  'edit-set',
  'delete-set',
  'copy-filenames',
  'copy-selected-filenames',
  'save-set-name',
  'cancel-set-name-edit',
  'update:editingSetName',
  'set-drag-start',
  'set-drag-over',
  'set-drag-leave',
  'set-drop',
  'set-drag-end',
])
</script>
