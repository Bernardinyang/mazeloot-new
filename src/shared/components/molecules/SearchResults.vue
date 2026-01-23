<template>
  <div class="flex-1 overflow-y-auto max-h-[calc(85vh-280px)]">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 class="h-8 w-8 animate-spin mb-3" :class="theme.textPrimary" />
      <p :class="['text-sm', theme.textSecondary]">Loading results...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="groupedResults.length === 0 && !isLoading" class="px-5 py-8">
      <div class="border-2 border-dashed rounded-lg p-8 text-center" :class="[theme.borderSecondary]">
        <p :class="['text-sm', theme.textSecondary]">Search results will show up here</p>
      </div>
    </div>

    <!-- Results with TOP RESULT -->
    <div v-else class="py-3">
      <template v-for="(productGroup, productIndex) in groupedResults" :key="`product-${productGroup.productUuid}`">
        <!-- Content Type Groups -->
        <template v-for="(group, groupIndex) in productGroup.groups" :key="`${productGroup.productUuid}-${group.type}`">
          <!-- TOP RESULT (first item of first group) -->
          <div v-if="productIndex === 0 && groupIndex === 0 && group.items.length > 0" class="px-5 py-2">
            <div :class="['text-xs font-bold uppercase tracking-wider mb-2', theme.textSecondary]">
              TOP RESULT
            </div>
            <div
              :ref="el => setResultRef(el, productIndex, groupIndex, 0)"
              :class="[
                'flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all border',
                selectedIndex === `${productIndex}-${groupIndex}-0`
                  ? 'bg-primary/10 border-primary'
                  : [theme.borderSecondary, 'hover:bg-muted/50'],
              ]"
              @click="$emit('select', group.items[0])"
              @mouseenter="$emit('hover', `${productIndex}-${groupIndex}-0`)"
            >
              <div class="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-orange-500">
                <component :is="getIcon(group.items[0].type)" class="h-5 w-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div
                  :class="['text-sm font-semibold truncate mb-0.5', theme.textPrimary]"
                  v-html="highlightMatch(group.items[0].name, searchQuery)"
                />
                <div v-if="group.items[0].description" :class="['text-xs truncate mb-1', theme.textSecondary]">
                  {{ group.items[0].description }}
                </div>
                <div v-if="group.items[0].meta" class="flex items-center gap-1">
                  <component :is="getIcon(group.items[0].type)" class="h-3 w-3" :class="theme.textTertiary" />
                  <span :class="['text-xs', theme.textTertiary]">{{ group.items[0].meta }}</span>
                </div>
              </div>
              <div
                v-if="group.items[0].meta"
                :class="[
                  'text-xs px-2 py-1 rounded-md shrink-0 font-medium',
                  theme.bgMuted,
                  theme.textSecondary,
                ]"
              >
                {{ getTypeLabel(group.items[0].type) }}
              </div>
            </div>
          </div>

          <!-- OTHER RESULTS -->
          <div
            :class="[
              'px-5 py-2',
              productIndex === 0 && groupIndex === 0 && group.items.length > 1 ? 'mt-4' : '',
            ]"
          >
            <div :class="['text-xs font-bold uppercase tracking-wider mb-2', theme.textSecondary]">
              {{ productIndex === 0 && groupIndex === 0 ? 'OTHER RESULTS' : group.label.toUpperCase() }}
              <span v-if="productIndex === 0 && groupIndex === 0" class="ml-2 font-normal opacity-60">
                ({{ getTotalOtherResults(productGroup.groups, groupIndex) }})
              </span>
            </div>
            <div class="space-y-1">
              <div
                v-for="(item, itemIndex) in (productIndex === 0 && groupIndex === 0 ? group.items.slice(1) : group.items)"
                :key="item.id"
                :ref="el => setResultRef(el, productIndex, groupIndex, productIndex === 0 && groupIndex === 0 ? itemIndex + 1 : itemIndex)"
                :class="[
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
                  selectedIndex === `${productIndex}-${groupIndex}-${productIndex === 0 && groupIndex === 0 ? itemIndex + 1 : itemIndex}`
                    ? 'bg-primary/10'
                    : 'hover:bg-muted/50',
                ]"
                @click="$emit('select', item)"
                @mouseenter="$emit('hover', `${productIndex}-${groupIndex}-${productIndex === 0 && groupIndex === 0 ? itemIndex + 1 : itemIndex}`)"
              >
                <div
                  :class="[
                    'h-9 w-9 flex items-center justify-center shrink-0',
                    getIconBgColor(item.type),
                    getIconShape(item.type),
                  ]"
                >
                  <component :is="getIcon(item.type)" class="h-5 w-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    :class="['text-sm font-semibold truncate mb-0.5', theme.textPrimary]"
                    v-html="highlightMatch(item.name, searchQuery)"
                  />
                  <div v-if="item.description" :class="['text-xs truncate', theme.textSecondary]">
                    {{ item.description }}
                  </div>
                </div>
                <div
                  v-if="item.meta"
                  :class="[
                    'text-xs px-2 py-1 rounded-md shrink-0 font-medium',
                    theme.bgMuted,
                    theme.textSecondary,
                  ]"
                >
                  {{ getTypeLabel(item.type) }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ArrowDown,
  Building,
  CheckSquare,
  Eye,
  FileText,
  Folder,
  FolderKanban,
  Loader2,
  Palette,
  Search,
  User,
} from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { MAZELOOT_PRODUCTS } from '@/domains/memora/constants/products'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  groupedResults: {
    type: Array,
    default: () => [],
  },
  searchQuery: {
    type: String,
    default: '',
  },
  selectedIndex: {
    type: String,
    default: '0-0-0',
  },
})

defineEmits(['select', 'hover'])

const theme = useThemeClasses()
const resultRefs = ref({})

const getTotalOtherResults = (groups, firstGroupIndex) => {
  let total = 0
  groups.forEach((group, idx) => {
    if (idx === firstGroupIndex) {
      total += Math.max(0, group.items.length - 1)
    } else {
      total += group.items.length
    }
  })
  return total
}

const getTypeLabel = (type) => {
  const labels = {
    collection: 'Collections',
    project: 'Projects',
    selection: 'Selections',
    proofing: 'Proofing',
    rawFile: 'Raw Files',
    preset: 'Presets',
  }
  return labels[type] || type
}

const getIcon = (type) => {
  const icons = {
    collection: Folder,
    project: FolderKanban,
    selection: CheckSquare,
    proofing: Eye,
    rawFile: FileText,
    preset: Palette,
  }
  return icons[type] || User
}

const getIconBgColor = (type) => {
  const colors = {
    collection: 'bg-blue-500',
    project: 'bg-purple-500',
    selection: 'bg-green-500',
    proofing: 'bg-orange-500',
    rawFile: 'bg-teal-500',
    preset: 'bg-pink-500',
  }
  return colors[type] || 'bg-gray-500'
}

const getIconShape = (type) => {
  if (type === 'project' || type === 'collection') {
    return 'rounded'
  }
  return 'rounded-full'
}

const highlightMatch = (text, query) => {
  if (!query || !text) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}

const setResultRef = (el, productIdx, groupIdx, itemIdx) => {
  if (el) {
    resultRefs.value[`${productIdx}-${groupIdx}-${itemIdx}`] = el
  }
}

defineExpose({
  resultRefs,
  scrollToSelected: (productIdx, groupIdx, itemIdx) => {
    const ref = resultRefs.value[`${productIdx}-${groupIdx}-${itemIdx}`]
    if (ref) {
      ref.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  },
})
</script>
