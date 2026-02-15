<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <slot name="trigger">
        <Button variant="secondary" size="sm" :icon="Rocket" class="text-accent border-0">
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
            width="400"
            height="300"
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Content -->
        <div class="p-4 space-y-3">
          <!-- Header -->
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-md bg-accent/10">
              <Rocket class="h-4 w-4 text-accent" />
            </div>
            <h3 class="text-base font-semibold" :class="theme.textPrimary">Premium Feature</h3>
          </div>

          <!-- Description -->
          <p class="text-sm leading-relaxed" :class="theme.textSecondary">
            Upgrade to unlock custom domains, logos, favicons, and advanced branding controls.
          </p>

          <!-- CTA Button -->
          <Button
            variant="accent"
            :icon="Rocket"
            class="w-full font-medium py-2.5"
            @click="handleUpgrade"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup>
import { computed } from 'vue'
import { Rocket } from '@/shared/utils/lucideAnimated'
import { Button } from '@/shared/components/shadcn/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/shadcn/popover'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import { useNavigation } from '@/shared/composables/useNavigation'
import { toast } from '@/shared/utils/toast'

const theme = useThemeClasses()
const { navigateTo } = useNavigation()

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
  isOpen.value = false
  navigateTo({ name: 'memora-pricing' })
  toast.success('Redirecting to upgrade page...')
}
</script>
