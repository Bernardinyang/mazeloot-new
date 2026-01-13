<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(item, index) in items" :key="index">
        <BreadcrumbItem :class="item.class">
          <BreadcrumbLink v-if="item.to || item.href" as-child>
            <router-link v-if="item.to" :to="item.to" :class="[linkClass, item.linkClass]">
              {{ item.label }}
            </router-link>
            <a v-else-if="item.href" :href="item.href" :class="[linkClass, item.linkClass]">
              {{ item.label }}
            </a>
          </BreadcrumbLink>
          <BreadcrumbPage v-else :class="[pageClass, item.pageClass]">
            {{ item.label }}
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparatorSelector
          v-if="index < items.length - 1"
          :separator="separator"
          :separator-class="separatorClass"
          :custom-separator="customSeparator"
        />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<script setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/shared/components/shadcn/breadcrumb'
import BreadcrumbSeparatorSelector from '@/shared/components/organisms/BreadcrumbSeparatorSelector.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: items => {
      return items.every(item => item && typeof item.label === 'string')
    },
  },
  separator: {
    type: String,
    default: 'chevron-right',
    validator: value => ['chevron-right', 'chevron-left', 'slash', 'dot', 'custom'].includes(value),
  },
  separatorClass: {
    type: String,
    default: '',
  },
  customSeparator: {
    type: [String, Object],
    default: null,
  },
  linkClass: {
    type: String,
    default: '',
  },
  pageClass: {
    type: String,
    default: '',
  },
})
</script>
