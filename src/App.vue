<template>
    <div class="min-h-screen">
        <RouterView />
        <Toaster />
    </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toaster from './components/custom/Toaster.vue'
</script>

