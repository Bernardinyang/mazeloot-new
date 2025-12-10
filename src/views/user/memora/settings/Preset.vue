<template>
  <DashboardLayout>
    <template #breadcrumb> Settings > Preset </template>

    <div class="space-y-6">
      <!-- Page Header -->
      <div class="w-[50%]">
        <h1 class="text-4xl font-bold tracking-tight mb-2" :class="theme.textPrimary">
          Collection Presets
        </h1>
        <p class="text-sm mb-4" :class="theme.textSecondary">
          Manage default settings for collections to streamline your workflow.
        </p>
        <Separator :class="theme.borderSecondary" />
      </div>

      <!-- Content -->
      <div class="space-y-6 w-[50%]">
        <!-- Presets List -->
        <div class="space-y-4">
          <h3 class="text-base font-semibold" :class="theme.textPrimary">Collection Presets</h3>

          <!-- Presets List -->
          <div class="space-y-0">
            <div
              v-for="preset in presets"
              :key="preset.id"
              class="flex items-center justify-between py-3 px-4 border-b transition-colors group cursor-pointer"
              :class="[
                theme.borderSecondary,
                preset.isSelected ? theme.bgHover : '',
                'hover:' + theme.bgHover,
              ]"
            >
              <span class="text-sm font-medium" :class="theme.textPrimary">
                {{ preset.name }}
              </span>

              <!-- Three-dot Menu -->
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button
                    class="h-8 w-8 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700"
                    :class="theme.textSecondary"
                  >
                    <MoreVertical class="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" :class="[theme.bgDropdown, theme.borderSecondary]">
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click="handleEditPreset(preset.id)"
                  >
                    <Pencil class="mr-2 h-4 w-4" :class="theme.textSecondary" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    :class="[theme.textPrimary, theme.bgButtonHover, 'cursor-pointer']"
                    @click="handleDuplicatePreset(preset.id)"
                  >
                    <Copy class="mr-2 h-4 w-4" :class="theme.textSecondary" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator :class="theme.bgDropdownSeparator" />
                  <DropdownMenuItem
                    :class="['text-red-500', theme.bgButtonHover, 'cursor-pointer']"
                    @click="handleDeletePreset(preset.id)"
                  >
                    <Trash2 class="mr-2 h-4 w-4 text-red-500" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <!-- Add Preset Button -->
          <button
            @click="handleAddPreset"
            class="flex items-center gap-2 text-teal-500 hover:text-teal-600 transition-colors mt-4"
          >
            <div class="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
              <Plus class="h-4 w-4 text-white" />
            </div>
            <span class="text-sm font-medium">Add Preset</span>
          </button>

          <!-- Description -->
          <p class="text-xs mt-4" :class="theme.textSecondary">
            Collection presets allow you to apply default settings when creating a new collection so
            you don't have to make changes every time.
            <a href="#" class="text-teal-500 hover:text-teal-600 underline">Learn more</a>.
          </p>
        </div>
      </div>
    </div>

    <!-- Create Preset Dialog -->
    <CreatePresetDialog v-model:open="showCreatePresetDialog" @create="handleCreatePresetSubmit" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, MoreVertical, Pencil, Copy, Trash2 } from 'lucide-vue-next'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Separator } from '@/components/shadcn/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'
import CreatePresetDialog from '@/components/organisms/CreatePresetDialog.vue'

const theme = useThemeClasses()

const showCreatePresetDialog = ref(false)

interface Preset {
  id: number
  name: string
  isSelected?: boolean
}

const presets = ref<Preset[]>([
  {
    id: 1,
    name: 'Wedding preset',
    isSelected: false,
  },
  {
    id: 2,
    name: 'Demo',
    isSelected: true,
  },
  {
    id: 3,
    name: 'test',
    isSelected: false,
  },
])

const handleEditPreset = (id: number) => {
  // TODO: Implement preset edit logic
  toast.info(`Editing preset ${id}`)
}

const handleDuplicatePreset = (id: number) => {
  // TODO: Implement preset duplicate logic
  const preset = presets.value.find((p: Preset) => p.id === id)
  if (preset) {
    const newPreset: Preset = {
      id: Date.now(),
      name: `${preset.name} (Copy)`,
      isSelected: false,
    }
    presets.value.push(newPreset)
    toast.success('Preset duplicated successfully')
  }
}

const handleDeletePreset = (id: number) => {
  // TODO: Implement preset delete logic
  const index = presets.value.findIndex((p: Preset) => p.id === id)
  if (index > -1) {
    presets.value.splice(index, 1)
    toast.success('Preset deleted successfully')
  }
}

const handleAddPreset = () => {
  showCreatePresetDialog.value = true
}

const handleCreatePresetSubmit = async (data: { name: string }) => {
  try {
    // Simulate API call delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newPreset: Preset = {
      id: Date.now(),
      name: data.name,
      isSelected: false,
    }
    presets.value.push(newPreset)
    toast.success('Preset created successfully', {
      description: `"${data.name}" has been added to your presets.`,
    })
  } catch (error: any) {
    toast.error('Failed to create preset', {
      description: error.message || 'An error occurred while creating the preset.',
    })
    throw error // Re-throw to let dialog handle it
  }
}
</script>
