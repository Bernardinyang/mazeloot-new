<template>
  <nav aria-label="Breadcrumb" class="border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
        <li
          v-for="(item, i) in breadcrumbs"
          :key="i"
          class="flex items-center gap-x-2"
        >
          <template v-if="i > 0">
            <span aria-hidden="true" class="text-gray-400 dark:text-gray-500">/</span>
          </template>
          <RouterLink
            v-if="item.to"
            :to="item.to"
            class="font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {{ item.label }}
          </RouterLink>
          <span v-else class="font-medium text-gray-900 dark:text-white" aria-current="page">
            {{ item.label }}
          </span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  breadcrumbs: {
    type: Array,
    required: true,
  },
})
</script>
