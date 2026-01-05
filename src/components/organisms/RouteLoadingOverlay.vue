<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] bg-black/60 dark:bg-black/80 backdrop-blur-sm pointer-events-none"
    >
      <!-- Progress Bar at Top -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-accent/20 pointer-events-auto">
        <div
          class="h-full bg-accent transition-all duration-300 ease-out shadow-lg"
          :style="{ width: `${progress}%` }"
        >
          <div class="absolute inset-0 bg-white/30 animate-shimmer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 100,
  },
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>

