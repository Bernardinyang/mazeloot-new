<template>
  <Dialog :open="isOpen" @update:open="(v) => emit('update:open', v)">
    <DialogContent
      :hide-close="true"
      :class="[theme.bgDropdown, theme.borderSecondary, 'p-0 w-[min(calc(100vw-2rem),calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-2rem))] max-w-2xl max-h-[min(85dvh,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem))] sm:max-h-[80vh] overflow-hidden rounded-lg border shadow-lg m-[max(0.5rem,env(safe-area-inset-top))] mr-[max(0.5rem,env(safe-area-inset-right))] mb-[max(0.5rem,env(safe-area-inset-bottom))] ml-[max(0.5rem,env(safe-area-inset-left))]']"
    >
      <div class="flex flex-col max-h-[80vh]">
        <!-- Search -->
        <div class="flex items-center gap-2 px-4 py-3 border-b" :class="theme.borderPrimary">
          <Search class="h-4 w-4 shrink-0" :class="theme.textTertiary" />
          <input
            ref="inputEl"
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            :class="['flex-1 min-w-0 bg-transparent py-2 text-sm outline-none', theme.textPrimary, theme.placeholderInput]"
            @keydown.down.prevent="navigate(1)"
            @keydown.up.prevent="navigate(-1)"
            @keydown.enter.prevent="selectCurrent"
            @keydown.escape="close"
            @input="scheduleSearch"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="p-1.5 rounded hover:bg-muted"
            :class="theme.textTertiary"
            aria-label="Clear"
            @click="clearSearch"
          >
            <X class="h-4 w-4" />
          </button>
          <kbd class="hidden sm:inline-flex h-6 items-center rounded border px-1.5 font-mono text-[10px]" :class="[theme.borderSecondary, theme.bgMuted, theme.textSecondary]">⌘K</kbd>
        </div>

        <!-- Product filter -->
        <div v-if="availableProducts.length > 0" class="flex flex-wrap items-center gap-2 px-4 py-2 border-b" :class="theme.borderPrimary">
          <span :class="['text-xs', theme.textSecondary]">Product</span>
          <button
            v-for="product in availableProducts"
            :key="product.uuid"
            :disabled="product.slug !== 'memora'"
            :class="[
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs',
              selectedProducts.includes(product.uuid) ? 'bg-accent text-accent-foreground' : theme.bgMuted,
              theme.textPrimary,
              product.slug !== 'memora' && 'opacity-50 cursor-not-allowed',
            ]"
            @click="product.slug === 'memora' && toggleProduct(product.uuid)"
          >
            <AppIcon :custom-type="getProductCustomType(product.slug)" class="h-3.5 w-3.5" />
            {{ product.name }}
          </button>
        </div>

        <!-- Results -->
        <div class="flex-1 overflow-y-auto min-h-[180px]">
          <div v-if="isLoading" class="p-4 space-y-2">
            <div v-for="i in 4" :key="i" class="flex items-center gap-3 rounded-lg p-2.5 animate-pulse" :class="theme.bgMuted">
              <div class="h-8 w-8 shrink-0 rounded-lg bg-black/10 dark:bg-white/10" />
              <div class="flex-1 space-y-1">
                <div class="h-3.5 w-24 rounded bg-black/10 dark:bg-white/10" />
                <div class="h-3 w-32 rounded bg-black/10 dark:bg-white/10" />
              </div>
            </div>
          </div>

          <div v-else-if="flatItems.length === 0" class="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Search class="h-10 w-10 mb-3 opacity-40" :class="theme.textTertiary" />
            <p :class="['text-sm font-medium', theme.textPrimary]">{{ hasQuery ? 'No results' : 'Type to search' }}</p>
            <p :class="['mt-1 text-xs', theme.textSecondary]">{{ hasQuery ? 'Try different keywords' : 'Collections, projects, selections…' }}</p>
          </div>

          <div v-else class="py-2">
            <div v-for="(productGroup, productIdx) in groupedResults" :key="productGroup.productUuid" class="contents">
              <div v-for="(group, groupIdx) in productGroup.groups" :key="`${productGroup.productUuid}-${group.type}`">
                <p class="px-4 py-1.5 text-xs font-medium" :class="theme.textSecondary">{{ group.label }}</p>
                <ul class="space-y-0.5 px-2 pb-3">
                  <li
                    v-for="(item, itemIdx) in group.items"
                    :key="item.id"
                    :ref="(el) => setRef(flatKey(productIdx, groupIdx, itemIdx), el)"
                    :class="[
                      'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm',
                      isSelected(productIdx, groupIdx, itemIdx) ? 'bg-accent/10' : 'hover:bg-muted/50',
                      theme.textPrimary,
                    ]"
                    @click="handleSelect(item)"
                    @mouseenter="selectedFlatIndex = flatIndexByKey(productIdx, groupIdx, itemIdx)"
                  >
                    <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white', typeGradient(item.type)]">
                      <component :is="typeIcon(item.type)" class="h-4 w-4" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate font-medium" v-html="highlight(item.name)" />
                      <p v-if="item.description" :class="['truncate text-xs', theme.textSecondary]">{{ item.description }}</p>
                    </div>
                    <span :class="['shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium', theme.bgMuted, theme.textSecondary]">{{ getTypeLabel(item.type) }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between border-t px-4 py-2 text-[11px]" :class="[theme.borderPrimary, theme.textTertiary]">
          <div class="flex gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>esc Close</span>
          </div>
          <span v-if="flatItems.length > 0">{{ flatItems.length }} result{{ flatItems.length === 1 ? '' : 's' }}</span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  CheckSquare,
  Eye,
  FileText,
  Folder,
  FolderKanban,
  Loader2,
  Palette,
  Search,
  User,
  X,
} from '@/shared/utils/lucideAnimated'
import { Dialog, DialogContent } from '@/shared/components/shadcn/dialog'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { apiClient } from '@/shared/api/client'
import { useUserStore } from '@/shared/stores/user'
import { useMemoraFeatures } from '@/domains/memora/composables/useMemoraFeatures'
import AppIcon from '@/shared/components/atoms/AppIcon.vue'
import { MAZELOOT_PRODUCTS } from '@/domains/memora/constants/products'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['update:open', 'select'])

const theme = useThemeClasses()
const userStore = useUserStore()
const { hasFeature } = useMemoraFeatures()
const inputEl = ref(null)
const isOpen = computed({
  get: () => props.open,
  set: (v) => emit('update:open', v),
})

const searchQuery = ref('')
const isLoading = ref(false)
const results = ref([])
const selectedProducts = ref([])
const selectedFlatIndex = ref(0)
const itemRefs = ref({})

const filters = ref({ type: null, status: 'all', starred: false })

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

const availableProducts = computed(() => userStore.selectedProducts || [])

const canShowType = (type) => {
  if (type === 'proofing') return hasFeature('proofing')
  if (type === 'rawFile') return hasFeature('raw_files')
  if (type === 'collection') return hasFeature('collection')
  if (type === 'selection') return hasFeature('selection')
  if (type === 'project') return hasFeature('selection') || hasFeature('collection')
  return true
}

const getTypeLabel = (type) => {
  const map = {
    collection: 'Collections',
    project: 'Projects',
    selection: 'Selections',
    proofing: 'Proofing',
    rawFile: 'Raw Files',
    preset: 'Presets',
  }
  return map[type] || type
}

const typeIcon = (type) => {
  const map = {
    collection: Folder,
    project: FolderKanban,
    selection: CheckSquare,
    proofing: Eye,
    rawFile: FileText,
    preset: Palette,
  }
  return map[type] || User
}

const typeGradient = (type) => {
  const map = {
    collection: 'bg-gradient-to-br from-blue-500 to-blue-600',
    project: 'bg-gradient-to-br from-violet-500 to-violet-600',
    selection: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    proofing: 'bg-gradient-to-br from-amber-500 to-amber-600',
    rawFile: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    preset: 'bg-gradient-to-br from-rose-500 to-rose-600',
  }
  return map[type] || 'bg-gradient-to-br from-gray-500 to-gray-600'
}

const getRouteForType = (type, id) => {
  const map = {
    collection: { name: 'collectionDetail', params: { id } },
    project: { name: 'projectDashboard', params: { id } },
    selection: { name: 'selectionDetail', params: { id } },
    proofing: { name: 'proofingDetail', params: { id } },
    rawFile: { name: 'rawFileDetail', params: { id } },
    preset: { name: 'presetDetail', params: { id } },
  }
  return map[type] || { name: 'overview' }
}

const groupedResults = computed(() => {
  const byProduct = {}
  const filtered = results.value.filter((r) => canShowType(r.type))

  filtered.forEach((item) => {
    const productUuid = item.productUuid || 'memora'
    const product = availableProducts.value.find((p) => p.uuid === productUuid) || availableProducts.value[0]
    if (!product) return
    if (!byProduct[productUuid]) {
      byProduct[productUuid] = {
        productUuid,
        productSlug: product.slug,
        productName: product.name,
        groups: {},
      }
    }
    if (!byProduct[productUuid].groups[item.type]) {
      byProduct[productUuid].groups[item.type] = { type: item.type, label: getTypeLabel(item.type), items: [] }
    }
    byProduct[productUuid].groups[item.type].items.push(item)
  })

  return Object.values(byProduct).map((p) => ({
    ...p,
    groups: Object.values(p.groups),
  }))
})

const flatItems = computed(() => {
  const out = []
  groupedResults.value.forEach((productGroup, productIdx) => {
    productGroup.groups.forEach((group, groupIdx) => {
      group.items.forEach((item, itemIdx) => {
        out.push({ productIdx, groupIdx, itemIdx, item })
      })
    })
  })
  return out
})

function flatKey(productIdx, groupIdx, itemIdx) {
  return `${productIdx}-${groupIdx}-${itemIdx}`
}

function flatIndexByKey(productIdx, groupIdx, itemIdx) {
  return flatItems.value.findIndex(
    (f) => f.productIdx === productIdx && f.groupIdx === groupIdx && f.itemIdx === itemIdx,
  )
}

const hasQuery = computed(() => searchQuery.value.trim().length > 0)

const isSelected = (productIdx, groupIdx, itemIdx) => {
  const idx = flatIndexByKey(productIdx, groupIdx, itemIdx)
  return idx >= 0 && idx === selectedFlatIndex.value
}

function setRef(key, el) {
  if (el) itemRefs.value[key] = el
}

function highlight(text) {
  const q = searchQuery.value.trim()
  if (!q || !text) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark class="bg-accent/30 rounded px-0.5">$1</mark>')
}

let searchDebounce = null
function scheduleSearch() {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(performSearch, 280)
}

async function performSearch() {
  const query = searchQuery.value.trim()
  const hasFilters =
    (selectedProducts.value.length > 0 && selectedProducts.value.length < availableProducts.value.length) ||
    filters.value.type ||
    filters.value.status !== 'all' ||
    filters.value.starred

  if (!query && !hasFilters) {
    results.value = []
    return
  }

  isLoading.value = true
  try {
    const params = {
      search: query || '',
      ...(selectedProducts.value.length > 0 &&
        selectedProducts.value.length < availableProducts.value.length && {
          products: Array.isArray(selectedProducts.value) ? selectedProducts.value : [selectedProducts.value],
        }),
      ...(filters.value.type && { type: filters.value.type }),
      ...(filters.value.status !== 'all' && { status: filters.value.status }),
      ...(filters.value.starred && { starred: true }),
      limit: 50,
    }
    const res = await apiClient.get('/v1/memora/search', { params })
    const data = res?.data
    const list = Array.isArray(data) ? data : []
    results.value = list.map((item) => ({
      id: item.id || item.uuid,
      name: item.name || '',
      description: item.description || null,
      type: item.type || '',
      productUuid: item.productUuid || 'memora',
      route: getRouteForType(item.type, item.id || item.uuid),
      meta: item.status || null,
    }))
    selectedFlatIndex.value = 0
  } catch (e) {
    console.error('Search failed:', e)
    results.value = []
  } finally {
    isLoading.value = false
  }
}

function clearSearch() {
  searchQuery.value = ''
  results.value = []
  selectedFlatIndex.value = 0
  nextTick(() => inputEl.value?.focus())
}

function toggleProduct(uuid) {
  const i = selectedProducts.value.indexOf(uuid)
  if (i > -1) selectedProducts.value.splice(i, 1)
  else selectedProducts.value.push(uuid)
  if (searchQuery.value.trim() || selectedProducts.value.length > 0) performSearch()
}

function navigate(delta) {
  if (flatItems.value.length === 0) return
  const next = Math.max(0, Math.min(flatItems.value.length - 1, selectedFlatIndex.value + delta))
  selectedFlatIndex.value = next
  const refKey = flatKey(
    flatItems.value[next].productIdx,
    flatItems.value[next].groupIdx,
    flatItems.value[next].itemIdx,
  )
  nextTick(() => {
    const el = itemRefs.value[refKey]
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })
}

function selectCurrent() {
  const cur = flatItems.value[selectedFlatIndex.value]
  if (cur) handleSelect(cur.item)
}

function handleSelect(item) {
  emit('select', item)
  isOpen.value = false
}

function close() {
  isOpen.value = false
}

function getProductCustomType(slug) {
  const p = MAZELOOT_PRODUCTS.find((x) => x.id === slug)
  return p?.customType || 'memora'
}

function reset() {
  searchQuery.value = ''
  results.value = []
  selectedProducts.value = []
  selectedFlatIndex.value = 0
  filters.value = { type: null, status: 'all', starred: false }
}

watch(isOpen, (open) => {
  if (open) {
    selectedProducts.value = []
    nextTick(() => inputEl.value?.focus())
  } else {
    reset()
  }
})

watch(
  () => flatItems.value.length,
  (len) => {
    if (len > 0 && selectedFlatIndex.value >= len) selectedFlatIndex.value = Math.max(0, len - 1)
  },
)

function onKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
  }
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  reset()
})
</script>
