<template>
  <div class="min-h-screen">
    <RouterView />
    <Toaster />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Toaster from './components/organisms/Toaster.vue'
</script>
