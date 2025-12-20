<template>
  <div :class="[theme.bgCard, theme.borderCard]" class="border rounded-lg overflow-hidden">
    <table class="w-full">
      <!-- Table Header -->
      <thead v-if="!loading && items.length > 0">
        <tr
          :class="[theme.borderSecondary, theme.textTertiary, theme.bgCardSolid]"
          class="border-b font-semibold text-xs uppercase tracking-wider"
        >
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[column.width || '', 'px-4 py-3 text-left']"
          >
            <slot :name="`header-${column.slot || column.key}`" :column="column">
              <component
                v-if="column.headerComponent"
                :is="column.headerComponent"
                :column="column"
              />
              <span v-else>{{ column.label }}</span>
            </slot>
          </th>
        </tr>
      </thead>

      <!-- Loading State -->
      <tbody v-if="loading">
        <tr
          v-for="i in loadingRows"
          :key="i"
          :class="theme.borderSecondary"
          class="border-b animate-pulse"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            :class="['px-4 py-3', column.width || '']"
          >
            <slot :name="`loading-${column.slot || column.key}`" :column="column">
              <div :class="['h-4 rounded', theme.bgSkeleton, column.loadingWidth || 'w-24']"></div>
            </slot>
          </td>
        </tr>
      </tbody>

      <!-- Empty State -->
      <tbody v-else-if="items.length === 0">
        <tr>
          <td :colspan="columns.length" class="px-4 py-16 text-center">
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
      <tbody v-else>
        <slot :items="items" name="items">
          <tr
            v-for="(item, index) in items"
            :key="getItemId(item, index)"
            :class="[
              'group border-b transition-colors duration-200',
              'hover:bg-gray-50 dark:hover:bg-gray-800/50',
              theme.borderSecondary,
              isItemSelected(item, index) ? 'bg-blue-50 dark:bg-blue-900/20' : '',
            ]"
            @click="$emit('row-click', item, index)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="['px-4 py-3', column.width || '']"
            >
              <slot
                :name="`cell-${column.slot || column.key}`"
                :item="item"
                :value="getColumnValue(item, column)"
                :column="column"
                :index="index"
              >
                <!-- Default rendering -->
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
                  class="text-xs leading-none"
                >
                  {{ formatValue(getColumnValue(item, column), column) }}
                </span>
                <span v-else :class="theme.textTertiary" class="text-xs leading-none">-</span>
              </slot>
            </td>
          </tr>
        </slot>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useThemeClasses } from '@/composables/useThemeClasses'
import EmptyState from '@/components/molecules/EmptyState.vue'
import { CheckSquare } from 'lucide-vue-next'

const theme = useThemeClasses()

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
    validator: columns => {
      return columns.every(col => col.key && (col.label || col.slot))
    },
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingRows: {
    type: Number,
    default: 8,
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
})

const emit = defineEmits(['row-click', 'empty-action'])

// Get column value using dataSelector
const getColumnValue = (item, column) => {
  if (column.dataSelector) {
    return column.dataSelector(item)
  }
  // Fallback to accessing property directly
  return item[column.key]
}

// Format value based on column format
const formatValue = (value, column) => {
  if (column.format) {
    switch (column.format) {
      case 'date':
        if (!value) return ''
        const date = new Date(value)
        return date.toLocaleDateString('en-US', {
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

// Get item ID
const getItemId = (item, index) => {
  return props.getId(item, index)
}

// Check if item is selected
const isItemSelected = (item, index) => {
  const id = getItemId(item, index)
  return props.selectedItems.includes(id)
}
</script>
