<template>
  <div v-if="products.length > 0" class="px-6 py-4 border-b bg-gradient-to-b from-muted/10 to-transparent" :class="theme.borderPrimary">
    <div class="mb-3">
      <span :class="['text-xs font-semibold uppercase tracking-wider', theme.textSecondary]">Filter by Product</span>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      <button
        v-for="product in products"
        :key="product.uuid"
        :disabled="product.slug !== 'memora'"
        :class="[
          'inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 shadow-sm',
          product.slug === 'memora'
            ? 'cursor-pointer hover:shadow-md hover:scale-105'
            : 'cursor-not-allowed opacity-60',
          selectedProducts.includes(product.uuid)
            ? 'bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500 text-foreground shadow-md'
            : product.slug === 'memora'
              ? [theme.borderSecondary, theme.bgMuted, theme.textPrimary, 'hover:border-accent/50']
              : [theme.borderSecondary, theme.bgMuted, theme.textPrimary],
        ]"
        @click="product.slug === 'memora' && $emit('toggle', product.uuid)"
      >
        <AppIcon :custom-type="getProductCustomType(product.slug)" class="h-4 w-4 shrink-0" />
        <Check
          v-if="selectedProducts.includes(product.uuid)"
          class="h-4 w-4 shrink-0 text-green-500"
        />
        <span>{{ product.name }}</span>
        <span v-if="product.slug !== 'memora'" class="text-xs text-muted-foreground ml-1">(Coming Soon)</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Check } from '@/shared/utils/lucideAnimated'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import AppIcon from '@/shared/components/atoms/AppIcon.vue'
import { MAZELOOT_PRODUCTS } from '@/domains/memora/constants/products'

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  selectedProducts: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['toggle'])

const theme = useThemeClasses()

const getProductCustomType = (slug) => {
  const product = MAZELOOT_PRODUCTS.find(p => p.id === slug)
  return product?.customType || 'memora'
}
</script>
