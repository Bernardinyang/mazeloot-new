<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <slot name="trigger">
        <Button size="sm" class="bg-teal-500/10 hover:bg-teal-500/20 text-teal-500 border-0">
          <Rocket class="h-4 w-4 mr-1.5" />
          UPGRADE
        </Button>
      </slot>
    </PopoverTrigger>
    <PopoverContent
      class="w-[280px] max-w-[90vw] p-0 overflow-hidden"
      :class="[theme.bgCardSolid, theme.borderCard]"
      side="left"
      align="end"
      :side-offset="8"
    >
      <div class="space-y-4">
        <!-- Image -->
        <div class="w-full h-32 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
            alt="Premium feature preview"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Content -->
        <div class="p-4 space-y-3">
          <!-- Header -->
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-md bg-teal-500/10">
              <Rocket class="h-4 w-4 text-teal-500" />
            </div>
            <h3 class="text-base font-semibold" :class="theme.textPrimary">Premium Feature</h3>
          </div>

          <!-- Description -->
          <p class="text-sm leading-relaxed" :class="theme.textSecondary">
            Upgrade to unlock custom domains, logos, favicons, and advanced branding controls.
          </p>

          <!-- CTA Button -->
          <Button
            class="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2.5"
            @click="handleUpgrade"
          >
            <Rocket class="h-3.5 w-3.5 mr-1.5" />
            Upgrade Now
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup>
import { computed } from 'vue'
import { Rocket } from 'lucide-vue-next'
import { Button } from '@/components/shadcn/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { useThemeClasses } from '@/composables/useThemeClasses'
import { toast } from 'vue-sonner'

const theme = useThemeClasses()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const handleUpgrade = () => {
  // TODO: Implement upgrade logic
  toast.success('Redirecting to upgrade page...')
  isOpen.value = false
}
</script>
