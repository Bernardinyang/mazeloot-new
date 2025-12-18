<template>
  <CollectionCard
    :style="{ '--index': index }"
    :image-src="null"
    :alt-text="project.name"
    :caption-text="project.name"
    :subtitle="subtitle || getSubtitle(project)"
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
    :is-starred="project.isStarred || project.starred || false"
    :badge="true"
    :icon="Folder"
    :folder-icon="Folder"
    :preview-images="[]"
    :is-locked="false"
    :is-folder="false"
    :collection-data="{ ...project, isProject: true }"
    image-container-class="aspect-[4/3]"
    @click="$emit('click', project)"
    @star-click="$emit('star-click', project)"
    @edit="$emit('edit', project)"
    @delete="$emit('delete', project)"
  >
    <template #subtitle>
      <slot name="subtitle">
        {{ getSubtitle(project) }}
      </slot>
    </template>
    <template #menu-items>
      <!-- Default menu items -->
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
        @click.stop="$emit('view-details', project)"
      >
        <span>View Details</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
      <DropdownMenuItem
        :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
        @click.stop="$emit('edit', project)"
      >
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="['text-red-500 hover:bg-red-500/10 cursor-pointer']"
        @click.stop="$emit('delete', project)"
      >
        <span>Delete</span>
      </DropdownMenuItem>
      <!-- Additional menu items from parent -->
      <slot name="menu-items-append" />
    </template>
  </CollectionCard>
</template>

<script setup>
import { Folder } from 'lucide-vue-next'
import CollectionCard from '@/components/molecules/CollectionCard.vue'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'

const props = defineProps({
  project: {
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

const getSubtitle = project => {
  const parts = []
  if (project.hasSelections || project.hasProofing || project.hasCollections) {
    const phases = []
    if (project.hasSelections) phases.push('Selections')
    if (project.hasProofing) phases.push('Proofing')
    if (project.hasCollections) phases.push('Collections')
    parts.push(phases.join(', '))
  }
  const date = project.date || project.createdAt
  if (date) {
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    parts.push(formattedDate)
  }
  return parts.join(' • ')
}
</script>
