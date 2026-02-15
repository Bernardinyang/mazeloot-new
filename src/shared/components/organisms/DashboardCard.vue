<template>
  <Card :class="cardClasses">
    <!-- Loading State -->
    <div v-if="loading" class="p-6">
      <slot name="loading">
        <div class="animate-pulse space-y-3">
          <div v-for="i in 3" :key="i" class="flex items-center gap-3">
            <div :class="['h-10 w-10 rounded-lg', theme.bgSkeleton]"></div>
            <div class="flex-1 space-y-2">
              <div :class="['h-4 w-32 rounded', theme.bgSkeleton]"></div>
              <div :class="['h-3 w-24 rounded', theme.bgSkeleton]"></div>
            </div>
          </div>
        </div>
      </slot>
    </div>

    <!-- Content -->
    <template v-else>
      <div :class="{ 'flex flex-col h-full': hasFooter }">
        <div :class="{ 'flex-1 flex flex-col min-h-0': hasFooter }">
          <CardHeader v-if="title || description || productLabel">
            <div v-if="title || description || productLabel" class="flex items-center justify-between gap-3">
              <div class="min-w-0 flex-1">
                <span
                  v-if="productLabel"
                  :class="[
                    'inline-block text-[10px] font-semibold uppercase tracking-wider rounded-md px-2 py-0.5 mb-1.5',
                    theme.bgMuted,
                    theme.textSecondary,
                  ]"
                >
                  {{ productLabel }}
                </span>
                <CardTitle v-if="title" :class="titleClasses">{{ title }}</CardTitle>
                <CardDescription v-if="description" :class="descriptionClasses">{{
                  description
                }}</CardDescription>
              </div>
              <slot name="header-actions"></slot>
            </div>
          </CardHeader>
          <Separator v-if="title || description || productLabel" :class="separatorClasses" />
          <CardContent :class="contentClasses">
            <slot></slot>
          </CardContent>
        </div>
        <CardFooter v-if="hasFooter" :class="footerClasses">
          <slot name="footer"></slot>
        </CardFooter>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import Card from '@/shared/components/shadcn/Card.vue'
import CardContent from '@/shared/components/shadcn/CardContent.vue'
import CardHeader from '@/shared/components/shadcn/CardHeader.vue'
import CardTitle from '@/shared/components/shadcn/CardTitle.vue'
import CardDescription from '@/shared/components/shadcn/CardDescription.vue'
import CardFooter from '@/shared/components/shadcn/CardFooter.vue'
import { Separator } from '@/shared/components/shadcn/separator/index'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'

const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  description: {
    type: String,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  colSpan: {
    type: String,
    default: '',
  },
  animationClass: {
    type: String,
    default: '',
  },
  productLabel: {
    type: String,
    default: undefined,
  },
})

const slots = useSlots()
const hasFooter = computed(() => !!slots.footer)
const theme = useThemeClasses()

// Common classes using theme composable
const baseCardClasses = computed(
  () =>
    `${theme.bgCard} backdrop-blur-md ${theme.borderCard} ${theme.transition} hover:scale-[1.01] ${theme.shadowCard}`
)
const baseTitleClasses = computed(
  () => `${theme.textPrimary} text-sm font-semibold uppercase tracking-wide`
)
const baseDescriptionClasses = computed(() => theme.textSecondary)
const baseSeparatorClasses = computed(() => theme.borderPrimary)
const baseContentClasses = 'pt-6'
const baseFooterClasses = 'mt-auto'

const cardClasses = computed(() => {
  return [
    baseCardClasses.value,
    props.colSpan,
    props.animationClass,
    { 'flex flex-col h-full': hasFooter.value },
  ]
    .filter(Boolean)
    .join(' ')
})

const titleClasses = computed(() => baseTitleClasses.value)
const descriptionClasses = computed(() => baseDescriptionClasses.value)
const separatorClasses = computed(() => baseSeparatorClasses.value)
const contentClasses = computed(() => baseContentClasses)
const footerClasses = computed(() => baseFooterClasses)
</script>
