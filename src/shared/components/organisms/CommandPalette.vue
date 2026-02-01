<template>
  <div>
    <Dialog v-model:open="isOpen">
      <DialogContent :hide-close="true" :class="[theme.bgDropdown, theme.borderSecondary, 'p-0 max-w-3xl']">
        <div class="flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-3 border-b" :class="theme.borderPrimary">
            <span :class="['text-sm font-medium', theme.textSecondary]">
              {{ isLoading ? 'Search - Loading results' : groupedResults.length > 0 ? 'Search - Results' + (hasActiveFilters ? ' (Multiple Filter Applied)' : '') : 'Search' }}
            </span>
            <button
              :class="['p-1 rounded hover:bg-muted transition-colors', theme.textTertiary]"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Search Input -->
          <div class="flex items-center gap-2 px-5 py-3 border-b" :class="theme.borderPrimary">
            <Search class="h-4 w-4 shrink-0" :class="theme.textTertiary" />
            <Input
              ref="searchInput"
              v-model="searchQuery"
              :class="[
                'border-0 focus-visible:ring-0 bg-transparent flex-1 h-auto py-0 text-base',
                theme.textPrimary,
                theme.placeholderInput,
              ]"
              placeholder="Search collections, projects, selections, proofing..."
              @keydown.down.prevent="navigateResults(1)"
              @keydown.up.prevent="navigateResults(-1)"
              @keydown.enter.prevent="handleSearch"
              @keydown.escape="close"
            />
            <button
              v-if="searchQuery"
              :class="['p-1 rounded hover:bg-muted transition-colors shrink-0', theme.textTertiary]"
              @click="handleClear"
            >
              <X class="h-4 w-4" />
            </button>
            <kbd
              class="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 shrink-0"
              :class="[theme.borderSecondary, theme.bgMuted, theme.textSecondary]"
            >
              <span class="text-xs">⌘</span>K
            </kbd>
          </div>

          <!-- Product Filter Cards -->
          <ProductFilterCards
            :products="availableProducts"
            :selected-products="selectedProducts"
            @toggle="toggleProductFilter"
          />

          <!-- Results -->
          <SearchResults
            ref="searchResultsRef"
            :is-loading="isLoading"
            :grouped-results="groupedResults"
            :search-query="searchQuery"
            :selected-index="selectedIndex"
            @select="handleSelect"
            @hover="selectedIndex = $event"
          />

          <!-- Keyboard Shortcuts Footer -->
          <div class="flex items-center gap-4 px-5 py-2.5 border-t text-xs" :class="[theme.borderPrimary, theme.textTertiary]">
            <div class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded border text-[10px]" :class="[theme.borderSecondary, theme.bgMuted]">↑</kbd>
              <kbd class="px-1.5 py-0.5 rounded border text-[10px]" :class="[theme.borderSecondary, theme.bgMuted]">↓</kbd>
              <span class="ml-1">Navigate</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded border text-[10px]" :class="[theme.borderSecondary, theme.bgMuted]">↵</kbd>
              <span class="ml-1">Open</span>
            </div>
            <div class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded border text-[10px]" :class="[theme.borderSecondary, theme.bgMuted]">esc</kbd>
              <span class="ml-1">Quit</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Advanced Filters Modal -->
    <Dialog v-model:open="showAdvancedFilters">
      <DialogContent :class="[theme.bgDropdown, theme.borderSecondary, 'max-w-lg']">
        <DialogHeader class="pb-4">
          <DialogTitle :class="[theme.textPrimary, 'text-lg font-bold']">Advanced Filters</DialogTitle>
          <DialogDescription :class="[theme.textSecondary, 'text-sm']">
            Refine your search with specific filters
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-6 py-2">
          <!-- Content Type Filter -->
          <div>
            <Label :class="[theme.textPrimary, 'text-sm font-semibold mb-3 block']">Content Type</Label>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="type in contentTypes"
                :key="type.value"
                :class="[
                  'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all',
                  filters.type === type.value
                    ? [theme.bgPrimary, 'text-white shadow-md scale-105']
                    : [theme.bgMuted, theme.textPrimary, theme.borderSecondary, 'border hover:scale-105'],
                ]"
                @click="toggleFilter('type', type.value)"
              >
                {{ type.label }}
              </span>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <Label :class="[theme.textPrimary, 'text-sm font-semibold mb-2 block']">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger :class="[theme.bgInput, theme.borderInput, theme.textInput, 'h-10']">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Starred Filter -->
          <div class="flex items-center gap-3 p-3 rounded-lg" :class="theme.bgMuted">
            <input
              id="starred"
              v-model="filters.starred"
              type="checkbox"
              :class="[
                'h-4 w-4 rounded border cursor-pointer',
                theme.borderInput,
                filters.starred ? theme.bgPrimary : '',
              ]"
            />
            <Label for="starred" :class="[theme.textPrimary, 'text-sm font-medium cursor-pointer']">
              Show only starred items
            </Label>
          </div>
        </div>
        <DialogFooter class="gap-2 pt-4">
          <Button variant="outline" :class="[theme.bgButtonHover]" @click="clearFilters">
            Clear All
          </Button>
          <Button :class="[theme.bgPrimary, 'text-white']" @click="applyFilters">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  Loader2,
  Search,
  X,
} from '@/shared/utils/lucideAnimated'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/shadcn/dialog'
import { Input } from '@/shared/components/shadcn/input'
import { Button } from '@/shared/components/shadcn/button'
import Label from '@/shared/components/shadcn/Label.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { apiClient } from '@/shared/api/client'
import { useUserStore } from '@/shared/stores/user'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import ProductFilterCards from '@/shared/components/molecules/ProductFilterCards.vue'
import SearchResults from '@/shared/components/molecules/SearchResults.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:open', 'select'])

const theme = useThemeClasses()
const userStore = useUserStore()
const { hasFeature } = useMemoraFeatures()
const searchInput = ref(null)
const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

const searchQuery = ref('')
const isLoading = ref(false)
const results = ref([])
const selectedIndex = ref('0-0-0')
const showAdvancedFilters = ref(false)
const selectedProducts = ref([])

const filters = ref({
  type: null,
  status: 'all',
  starred: false,
})

const contentTypesList = [
  { label: 'Collections', value: 'collection', feature: 'collection' },
  { label: 'Projects', value: 'project', feature: 'selection_or_collection' },
  { label: 'Selections', value: 'selection', feature: 'selection' },
  { label: 'Proofing', value: 'proofing', feature: 'proofing' },
  { label: 'Raw Files', value: 'rawFile', feature: 'raw_files' },
  { label: 'Presets', value: 'preset', feature: null },
]
const contentTypes = computed(() =>
  contentTypesList.filter((t) => {
    if (!t.feature) return true
    if (t.feature === 'selection_or_collection') return hasFeature('selection') || hasFeature('collection')
    return hasFeature(t.feature)
  }),
)

const availableProducts = computed(() => {
  return userStore.selectedProducts || []
})

const hasActiveFilters = computed(() => {
  return (selectedProducts.value.length > 0 && selectedProducts.value.length < availableProducts.value.length) ||
    filters.value.type ||
    filters.value.status !== 'all' ||
    filters.value.starred
})

const canShowResultType = (type) => {
  if (type === 'proofing') return hasFeature('proofing')
  if (type === 'rawFile') return hasFeature('raw_files')
  if (type === 'collection') return hasFeature('collection')
  if (type === 'selection') return hasFeature('selection')
  if (type === 'project') return hasFeature('selection') || hasFeature('collection')
  return true
}

const groupedResults = computed(() => {
  const productGroups = {}
  const filtered = results.value.filter((item) => canShowResultType(item.type))

  filtered.forEach(item => {
    const productUuid = item.productUuid || 'memora'
    const product = availableProducts.value.find(p => p.uuid === productUuid) || availableProducts.value[0]
    
    if (!product) return
    
    if (!productGroups[productUuid]) {
      productGroups[productUuid] = {
        productUuid,
        productSlug: product.slug,
        productName: product.name,
        groups: {},
      }
    }
    
    if (!productGroups[productUuid].groups[item.type]) {
      productGroups[productUuid].groups[item.type] = {
        type: item.type,
        label: getTypeLabel(item.type),
        items: [],
      }
    }
    
    productGroups[productUuid].groups[item.type].items.push(item)
  })
  
  return Object.values(productGroups).map(productGroup => ({
    ...productGroup,
    groups: Object.values(productGroup.groups),
  }))
})

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

const getRouteForType = (type, id) => {
  const routes = {
    collection: { name: 'collectionDetail', params: { id } },
    project: { name: 'projectDashboard', params: { id } },
    selection: { name: 'selectionDetail', params: { id } },
    proofing: { name: 'proofingDetail', params: { id } },
    rawFile: { name: 'rawFileDetail', params: { id } },
    preset: { name: 'presetDetail', params: { id } },
  }
  return routes[type] || { name: 'overview' }
}

const performSearch = async () => {
  if (!searchQuery.value.trim() && !hasActiveFilters.value) {
    results.value = []
    return
  }

  isLoading.value = true
  try {
    const params = {
      search: searchQuery.value.trim() || '',
      ...(selectedProducts.value.length > 0 && selectedProducts.value.length < availableProducts.value.length && { 
        products: Array.isArray(selectedProducts.value) ? selectedProducts.value : [selectedProducts.value]
      }),
      ...(filters.value.type && { type: filters.value.type }),
      ...(filters.value.status !== 'all' && { status: filters.value.status }),
      ...(filters.value.starred && { starred: true }),
      limit: 50,
    }

    const response = await apiClient.get('/v1/memora/search', { params })
    
    if (response && response.data) {
      results.value = (Array.isArray(response.data) ? response.data : []).map(item => ({
        id: item.id || item.uuid,
        name: item.name || '',
        description: item.description || null,
        type: item.type || '',
        productUuid: item.productUuid || 'memora',
        route: getRouteForType(item.type, item.id || item.uuid),
        meta: item.status || null,
      }))
      selectedIndex.value = '0-0-0'
    } else {
      results.value = []
    }
  } catch (error) {
    console.error('Search failed:', error)
    results.value = []
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  performSearch()
}

const handleClear = () => {
  searchQuery.value = ''
  results.value = []
  selectedIndex.value = '0-0-0'
  if (searchInput.value) {
    const component = searchInput.value
    const el = component.$el || component
    const inputEl = el?.tagName === 'INPUT' ? el : el?.querySelector?.('input')
    if (inputEl && typeof inputEl.focus === 'function') {
      inputEl.focus()
    }
  }
}

const toggleProductFilter = (productUuid) => {
  const index = selectedProducts.value.indexOf(productUuid)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productUuid)
  }
  if (searchQuery.value.trim() || hasActiveFilters.value) {
    performSearch()
  }
}

const resetAll = () => {
  searchQuery.value = ''
  results.value = []
  selectedProducts.value = []
  selectedIndex.value = '0-0-0'
  isLoading.value = false
  filters.value = {
    type: null,
    status: 'all',
    starred: false,
  }
}

watch(isOpen, (open) => {
  if (open) {
    selectedProducts.value = []
    nextTick(() => {
      if (searchInput.value) {
        const component = searchInput.value
        const el = component.$el || component
        const inputEl = el?.tagName === 'INPUT' ? el : el?.querySelector?.('input')
        if (inputEl && typeof inputEl.focus === 'function') {
          inputEl.focus()
        }
      }
    })
  } else {
    resetAll()
  }
})

const navigateResults = (direction) => {
  const flatResults = []
  groupedResults.value.forEach((productGroup, productIdx) => {
    productGroup.groups.forEach((group, groupIdx) => {
      group.items.forEach((item, itemIdx) => {
        flatResults.push({ productIdx, groupIdx, itemIdx, item })
      })
    })
  })
  
  if (flatResults.length === 0) return

  const currentIdx = flatResults.findIndex(r => 
    selectedIndex.value === `${r.productIdx}-${r.groupIdx}-${r.itemIdx}`
  )
  const newIdx = Math.max(0, Math.min(flatResults.length - 1, currentIdx + direction))
  
  if (newIdx >= 0 && newIdx < flatResults.length) {
    const target = flatResults[newIdx]
    selectedIndex.value = `${target.productIdx}-${target.groupIdx}-${target.itemIdx}`
    scrollToSelected()
  }
}

const searchResultsRef = ref(null)

const scrollToSelected = () => {
  nextTick(() => {
    const [productIdx, groupIdx, itemIdx] = selectedIndex.value.split('-').map(Number)
    if (searchResultsRef.value) {
      searchResultsRef.value.scrollToSelected(productIdx, groupIdx, itemIdx)
    }
  })
}

const selectResult = () => {
  const [productIdx, groupIdx, itemIdx] = selectedIndex.value.split('-').map(Number)
  const productGroup = groupedResults.value[productIdx]
  if (productGroup?.groups[groupIdx]?.items[itemIdx]) {
    handleSelect(productGroup.groups[groupIdx].items[itemIdx])
  }
}

const handleSelect = (item) => {
  emit('select', item)
  close()
}

const toggleFilter = (key, value) => {
  filters.value[key] = filters.value[key] === value ? null : value
}

const clearFilters = () => {
  filters.value = {
    type: null,
    status: 'all',
    starred: false,
  }
  selectedProducts.value = []
}

const applyFilters = () => {
  showAdvancedFilters.value = false
  if (searchQuery.value.trim() || hasActiveFilters.value) {
    performSearch()
  }
}

const close = () => {
  isOpen.value = false
}

const handleKeyDown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
  }
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  resetAll()
})
</script>
