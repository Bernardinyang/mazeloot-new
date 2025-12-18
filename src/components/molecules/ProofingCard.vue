<template>
  <CollectionCard
    :style="{ '--index': index }"
    :image-src="null"
    :alt-text="proofing.name"
    :caption-text="proofing.name"
    :subtitle="subtitle || getSubtitle(proofing)"
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
    :is-starred="proofing.isStarred || proofing.starred || false"
    :badge="true"
    :icon="Eye"
    :folder-icon="Eye"
    :preview-images="[]"
    :is-locked="false"
    :is-folder="false"
    :collection-data="{ ...proofing, isProofing: true }"
    image-container-class="aspect-[4/3]"
    @click="$emit('click', proofing)"
    @star-click="$emit('star-click', proofing)"
    @edit="$emit('edit', proofing)"
    @delete="$emit('delete', proofing)"
  >
    <template #subtitle>
      <slot name="subtitle">
        {{ getSubtitle(proofing) }}
      </slot>
    </template>
    <template #menu-items>
      <!-- Default menu items -->
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
        @click.stop="$emit('view-details', proofing)"
      >
        <span>View Details</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
        @click.stop="$emit('edit', proofing)"
      >
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
        @click.stop="$emit('delete', proofing)"
      >
        <span>Delete</span>
      </DropdownMenuItem>
      <!-- Additional menu items from parent -->
      <slot name="menu-items-append" />
    </template>
  </CollectionCard>
</template>

<script setup>
import { Eye } from 'lucide-vue-next'
import CollectionCard from '@/components/molecules/CollectionCard.vue'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  proofing: {
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

const getSubtitle = proofing => {
  const parts = []
  // Only show essential info on card - rest in detail sidebar
  if (proofing.mediaCount !== undefined) {
    const count = proofing.mediaCount
    const labelText = count === 1 ? 'item' : 'items'
    parts.push(`${count} ${labelText}`)
  }
  return parts.join(' • ')
}
</script>
