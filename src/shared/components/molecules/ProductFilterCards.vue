<template>
  <div v-if="products.length > 0" class="px-5 py-3 border-b" :class="theme.borderPrimary">
    <div class="mb-3">
      <span :class="['text-xs font-medium', theme.textSecondary]">I am looking for...</span>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      <button
        v-for="product in products"
        :key="product.uuid"
        :disabled="product.slug !== 'memora'"
        :class="[
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border-2',
          product.slug === 'memora'
            ? 'cursor-pointer'
            : 'cursor-not-allowed opacity-60',
          selectedProducts.includes(product.uuid)
            ? 'bg-transparent border-green-500 text-foreground'
            : product.slug === 'memora'
              ? 'bg-transparent border-gray-300 text-foreground hover:border-gray-400'
              : 'bg-transparent border-gray-300 text-foreground',
        ]"
        @click="product.slug === 'memora' && $emit('toggle', product.uuid)"
      >
        <AppIcon :custom-type="getProductCustomType(product.slug)" class="h-4 w-4 shrink-0" />
        <Check
          v-if="selectedProducts.includes(product.uuid)"
          class="h-3.5 w-3.5 shrink-0 text-green-500"
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
