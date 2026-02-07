<template>
  <div :class="[theme.bgCard, theme.borderCard]" class="border rounded-lg overflow-hidden min-w-0">
    <!-- Toolbar: search (optional) + toolbar slot -->
    <div
      v-if="$slots.toolbar || showSearchInput"
      :class="[theme.borderSecondary, theme.bgCard]"
      class="flex flex-wrap items-center gap-3 px-4 py-3 border-b"
    >
      <!-- Built-in search when searchValue is bound or searchable -->
      <div v-if="showSearchInput" class="relative flex-1 min-w-[180px] max-w-sm">
        <Search
          :class="theme.textTertiary"
          class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          :value="localSearchValue"
          :aria-label="searchPlaceholder || 'Search table'"
          :placeholder="searchPlaceholder"
          :disabled="asyncSearch && loading"
          :class="[
            'h-9 w-full rounded-md border pl-9 pr-3 py-1 text-sm shadow-sm transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50',
            theme.bgInput,
            theme.borderInput,
            theme.textInput,
            theme.placeholderInput,
          ]"
          @input="onSearchInput"
        />
      </div>
      <slot v-else name="search" :search-value="localSearchValue" :loading="loading" />
      <slot name="toolbar" />
    </div>

    <div
      v-if="loading && loadingMessage"
      class="sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ loadingMessage }}
    </div>
    <div class="overflow-x-auto min-w-0 w-full">
      <table
        class="w-full min-w-max"
        :aria-label="ariaLabel || caption || undefined"
        :aria-busy="loading"
      >
        <caption v-if="caption" class="sr-only">
          {{ caption }}
        </caption>
        <!-- Table Header: sticky, show when we have columns (even during loading) -->
        <thead
          :class="[
            theme.borderSecondary,
            theme.textTertiary,
            theme.bgCardSolid,
            'sticky top-0 z-10 border-b font-semibold text-xs uppercase tracking-wider shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]',
          ]"
        >
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="getSortAria(column)"
              :class="[
                column.width || '',
                'px-4 py-3 text-sm',
                getHeaderAlignClass(column),
                column.numeric ? 'tabular-nums' : '',
              ]"
            >
              <slot :name="`header-${column.slot || column.key}`" :column="column">
                <component
                  v-if="column.headerComponent"
                  :is="column.headerComponent"
                  :column="column"
                />
                <button
                  v-else-if="column.sortable"
                  type="button"
                  :disabled="asyncSort && loading"
                  :aria-label="getSortButtonLabel(column)"
                  :class="[
                    'inline-flex items-center gap-1 w-full min-w-0 rounded',
                    getHeaderAlignClass(column),
                    getSortButtonJustifyClass(column),
                    theme.bgButtonHover,
                  ]"
                  @click="handleSortClick(column)"
                  @keydown.enter.space.prevent="handleSortClick(column)"
                >
                  <span>{{ column.label }}</span>
                  <span v-if="effectiveSortBy === column.key" class="inline-flex shrink-0" aria-hidden="true">
                    <ChevronUp
                      v-if="effectiveSortOrder === 'asc'"
                      :class="theme.textPrimary"
                      class="h-4 w-4"
                    />
                    <ChevronDown v-else :class="theme.textPrimary" class="h-4 w-4" />
                  </span>
                  <span v-else class="inline-flex shrink-0 opacity-40" aria-hidden="true">
                    <ChevronUp :class="theme.textTertiary" class="h-3.5 w-3.5" />
                  </span>
                </button>
                <span v-else>{{ column.label }}</span>
              </slot>
            </th>
          </tr>
        </thead>

        <!-- Body: transition between loading and content -->
        <Transition name="table-state" mode="out-in">
          <!-- Loading State -->
          <tbody v-if="loading" :key="'loading'" class="table-state-skeleton">
            <tr
              v-for="i in loadingRows"
              :key="i"
              :class="[theme.borderSecondary, 'border-b']"
              class="animate-pulse"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                :class="['px-4 py-3', column.width || '', getCellAlignClass(column)]"
              >
                <slot :name="`loading-${column.slot || column.key}`" :column="column">
                  <div
                    :class="[
                      'h-4 rounded transition-opacity duration-150',
                      theme.bgSkeleton,
                      column.loadingWidth || 'w-24',
                    ]"
                  />
                </slot>
              </td>
            </tr>
          </tbody>

          <!-- Empty State -->
          <tbody v-else-if="displayItems.length === 0" :key="'empty'">
            <tr>
              <td :colspan="columns.length" class="px-4 py-8 sm:py-16 text-center">
                <slot name="empty">
                  <EmptyState
                    :action-label="emptyActionLabel"
                    :icon="emptyIcon"
                    :message="emptyMessage"
                    @action="$emit('empty-action')"
                  />
                </slot>
              </td>
            </tr>
          </tbody>

          <!-- Table Rows -->
          <tbody v-else :key="'data'">
            <slot :items="displayItems" name="items">
              <tr
                v-for="(item, index) in displayItems"
                :key="getItemId(item, index)"
                tabindex="0"
                :class="[
                  'group border-b transition-colors duration-200 cursor-pointer',
                  'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  theme.borderSecondary,
                  zebra && index % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-800/30' : '',
                  isItemSelected(item, index) ? 'bg-blue-50 dark:bg-blue-900/20' : '',
                ]"
                @click="$emit('row-click', item, index)"
                @keydown.enter.prevent="$emit('row-click', item, index)"
                @keydown.space.prevent="$emit('row-click', item, index)"
              >
                <td
                  v-for="column in columns"
                  :key="column.key"
                  :class="[
                    'px-4 py-3 text-sm',
                    column.width || '',
                    getCellAlignClass(column),
                    column.numeric || column.format === 'number' ? 'tabular-nums' : '',
                  ]"
                >
                  <slot
                    :name="`cell-${column.slot || column.key}`"
                    :item="item"
                    :value="getColumnValue(item, column)"
                    :column="column"
                    :index="index"
                  >
                    <component
                      v-if="column.component"
                      :is="column.component"
                      :item="item"
                      :value="getColumnValue(item, column)"
                      :column="column"
                    />
                    <span
                      v-else-if="
                        getColumnValue(item, column) !== null &&
                        getColumnValue(item, column) !== undefined
                      "
                      :class="column.valueClass || theme.textSecondary"
                    >
                      {{ formatValue(getColumnValue(item, column), column) }}
                    </span>
                    <span v-else :class="theme.textTertiary">-</span>
                  </slot>
                </td>
              </tr>
            </slot>
          </tbody>
        </Transition>
      </table>
    </div>

    <!-- Footer: slot (async or custom) or client-side pagination -->
    <div
      v-if="$slots.footer || (!asyncPagination && clientTotalPages > 1)"
      :class="[theme.borderSecondary, theme.bgCard]"
      class="border-t px-4 py-3"
    >
      <slot
        name="footer"
        :total="totalFiltered"
        :page="clientPage"
        :per-page="clientPerPage"
        :total-pages="clientTotalPages"
        :set-page="(p) => (clientPage = p)"
      >
        <div
          v-if="!asyncPagination && clientTotalPages > 1"
          class="flex flex-wrap items-center justify-between gap-3"
        >
          <p :class="['text-sm', theme.textSecondary]">
            Showing {{ (clientPage - 1) * clientPerPage + 1 }} to
            {{ Math.min(clientPage * clientPerPage, totalFiltered) }} of {{ totalFiltered }} results
          </p>
          <div class="flex gap-2">
            <button
              type="button"
              :disabled="clientPage <= 1"
              :class="[
                'inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 border transition-colors',
                'disabled:opacity-50 disabled:pointer-events-none',
                theme.borderSecondary,
                theme.bgButtonHover,
                theme.textSecondary,
              ]"
              @click="clientPage--"
            >
              Previous
            </button>
            <button
              type="button"
              :disabled="clientPage >= clientTotalPages"
              :class="[
                'inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 border transition-colors',
                'disabled:opacity-50 disabled:pointer-events-none',
                theme.borderSecondary,
                theme.bgButtonHover,
                theme.textSecondary,
              ]"
              @click="clientPage++"
            >
              Next
            </button>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import EmptyState from '@/shared/components/molecules/EmptyState.vue'
import { CheckSquare, ChevronUp, ChevronDown, Search } from '@/shared/utils/lucideAnimated'
import { debounce } from '@/shared/utils/debounce'

const theme = useThemeClasses()

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
    validator: cols => cols.every(col => col.key && (col.label || col.slot)),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingRows: {
    type: Number,
    default: 8,
  },
  loadingMessage: {
    type: String,
    default: '',
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  getId: {
    type: Function,
    default: (item, index) => item.id || item.uuid || index,
  },
  emptyMessage: {
    type: String,
    default: 'No items found',
  },
  emptyActionLabel: {
    type: String,
    default: '',
  },
  emptyIcon: {
    type: Object,
    default: () => CheckSquare,
  },
  sortBy: {
    type: String,
    default: '',
  },
  sortOrder: {
    type: String,
    default: 'asc',
    validator: v => !v || v === 'asc' || v === 'desc',
  },
  zebra: {
    type: Boolean,
    default: false,
  },
  caption: {
    type: String,
    default: '',
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  searchValue: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search…',
  },
  searchDebounceMs: {
    type: Number,
    default: 300,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  asyncSort: {
    type: Boolean,
    default: false,
  },
  asyncSearch: {
    type: Boolean,
    default: false,
  },
  asyncPagination: {
    type: Boolean,
    default: false,
  },
  clientPerPage: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['row-click', 'empty-action', 'sort', 'search', 'page-change'])

const localSearchValue = ref(props.searchValue)
const clientSortBy = ref('')
const clientSortOrder = ref('asc')
const clientPage = ref(1)

watch(
  () => props.searchValue,
  v => {
    localSearchValue.value = v
  }
)

watch(
  () => props.items,
  () => {
    if (!props.asyncPagination) clientPage.value = 1
  },
  { deep: false }
)

const showSearchInput = computed(() => props.searchable)

const effectiveSortBy = computed(() =>
  props.asyncSort ? props.sortBy : clientSortBy.value
)
const effectiveSortOrder = computed(() =>
  props.asyncSort ? props.sortOrder : clientSortOrder.value
)

const emitSearch = (query) => emit('search', query ?? localSearchValue.value)
const debouncedEmitSearch = debounce(emitSearch, props.searchDebounceMs)

function onSearchInput(e) {
  const q = e.target.value
  localSearchValue.value = q
  if (props.asyncSearch) debouncedEmitSearch(q)
  else clientPage.value = 1
}

const getColumnValue = (item, column) => {
  if (column.dataSelector) return column.dataSelector(item)
  return item[column.key]
}

const formatValue = (value, column) => {
  if (column.format) {
    switch (column.format) {
      case 'date':
        if (!value) return ''
        return new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value
      case 'boolean':
        return value ? 'Yes' : 'No'
      default:
        return value
    }
  }
  return value
}

function itemMatchesSearch(item, query) {
  if (!query || !query.trim()) return true
  const q = query.trim().toLowerCase()
  return props.columns.some(col => {
    const v = getColumnValue(item, col)
    if (v == null) return false
    const s = typeof v === 'string' ? v : String(formatValue(v, col))
    return s.toLowerCase().includes(q)
  })
}

const sortedItems = computed(() => {
  const key = effectiveSortBy.value
  const order = effectiveSortOrder.value
  const col = props.columns.find(c => c.key === key)
  if (!key || !col) return [...props.items]
  const arr = [...props.items]
  arr.sort((a, b) => {
    const va = getColumnValue(a, col)
    const vb = getColumnValue(b, col)
    let aVal = va != null ? va : ''
    let bVal = vb != null ? vb : ''
    if (col.format === 'number' || col.numeric) {
      aVal = Number(aVal)
      bVal = Number(bVal)
      if (Number.isNaN(aVal)) aVal = 0
      if (Number.isNaN(bVal)) bVal = 0
    } else if (col.format === 'date') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    } else {
      aVal = String(aVal).toLowerCase()
      bVal = String(bVal).toLowerCase()
    }
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
  return arr
})

const filteredItems = computed(() => {
  if (props.asyncSearch) return sortedItems.value
  return sortedItems.value.filter(item => itemMatchesSearch(item, localSearchValue.value))
})

const totalFiltered = computed(() => filteredItems.value.length)

const displayItems = computed(() => {
  if (props.asyncPagination) return filteredItems.value
  const per = props.clientPerPage
  const total = totalFiltered.value
  if (total === 0) return []
  const start = (clientPage.value - 1) * per
  return filteredItems.value.slice(start, start + per)
})

const clientTotalPages = computed(() =>
  Math.max(1, Math.ceil(totalFiltered.value / props.clientPerPage))
)

function getSortAria(column) {
  if (!column.sortable || effectiveSortBy.value !== column.key) return undefined
  return effectiveSortOrder.value === 'asc' ? 'ascending' : 'descending'
}

function getHeaderAlign(column) {
  return column.align || (column.numeric || column.format === 'number' ? 'right' : 'left')
}

function getHeaderAlignClass(column) {
  const a = getHeaderAlign(column)
  return a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left'
}

function getSortButtonJustifyClass(column) {
  const a = getHeaderAlign(column)
  return a === 'right' ? 'justify-end' : a === 'center' ? 'justify-center' : 'justify-start'
}

function getCellAlignClass(column) {
  return getHeaderAlignClass(column)
}

function getSortButtonLabel(column) {
  if (effectiveSortBy.value !== column.key) return `Sort by ${column.label}`
  return `Sort by ${column.label} ${effectiveSortOrder.value === 'asc' ? 'ascending' : 'descending'}`
}

function handleSortClick(column) {
  if (!column.sortable || props.loading) return
  const nextOrder =
    effectiveSortBy.value === column.key && effectiveSortOrder.value === 'asc' ? 'desc' : 'asc'
  if (props.asyncSort) {
    emit('sort', { key: column.key, order: nextOrder })
  } else {
    clientSortBy.value = column.key
    clientSortOrder.value = nextOrder
    clientPage.value = 1
  }
}

const getItemId = (item, index) => props.getId(item, index)

const isItemSelected = (item, index) =>
  props.selectedItems.includes(getItemId(item, index))
</script>

<style scoped>
.table-state-enter-active,
.table-state-leave-active {
  transition: opacity 0.2s ease;
}
.table-state-enter-from,
.table-state-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .table-state-enter-active,
  .table-state-leave-active {
    transition-duration: 0s;
  }
}
</style>
