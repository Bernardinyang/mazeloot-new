<template>
  <CollectionCard
    :style="{ '--index': index }"
    :image-src="null"
    :alt-text="selection.name"
    :caption-text="selection.name"
    :subtitle="subtitle || getSubtitle(selection)"
    container-height="auto"
    container-width="100%"
    image-height="240px"
    image-width="100%"
    :rotate-amplitude="12"
    :scale-on-hover="1.05"
    :display-overlay-content="false"
    :show-content="true"
    :show-menu="true"
    :show-star="true"
    :is-starred="selection.isStarred || selection.starred || false"
    :badge="true"
    :icon="CheckSquare"
    :folder-icon="CheckSquare"
    :preview-images="[]"
    :is-locked="false"
    :is-folder="false"
    :collection-data="{ ...selection, isSelection: true }"
    image-container-class="aspect-[4/3]"
    @click="$emit('click', selection)"
    @star-click="$emit('star-click', selection)"
    @edit="$emit('edit', selection)"
    @delete="$emit('delete', selection)"
  >
    <template #subtitle>
      <slot name="subtitle">
        {{ getSubtitle(selection) }}
      </slot>
    </template>
    <template #menu-items>
      <!-- Default menu items -->
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
        @click.stop="$emit('view-details', selection)"
      >
        <span>View Details</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
        @click.stop="$emit('edit', selection)"
      >
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
        @click.stop="$emit('delete', selection)"
      >
        <span>Delete</span>
      </DropdownMenuItem>
      <!-- Additional menu items from parent -->
      <slot name="menu-items-append" />
    </template>
  </CollectionCard>
</template>

<script setup>
import { CheckSquare } from 'lucide-vue-next'
import CollectionCard from '@/components/molecules/CollectionCard.vue'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  selection: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
  subtitle: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['click', 'star-click', 'edit', 'delete', 'view-details'])

const theme = useThemeClasses()

const getSubtitle = selection => {
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (selection.mediaCount !== undefined) {
    const count = selection.mediaCount
    const labelText = count === 1 ? 'item' : 'items'
    parts.push(`${count} ${labelText}`)
  }
  return parts.join(' • ')
}
</script>
