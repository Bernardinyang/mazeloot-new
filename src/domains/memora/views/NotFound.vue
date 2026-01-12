<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 dark:from-background dark:via-background dark:to-accent/10 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <div class="relative z-10 text-center space-y-8 px-4 max-w-2xl mx-auto">
      <!-- Large 404 with gradient -->
      <div class="space-y-4">
        <h1 class="text-9xl md:text-[12rem] font-bold leading-none bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent animate-fade-in">
          404
        </h1>
        <div class="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto"></div>
      </div>

      <!-- Main content -->
      <div class="space-y-4 animate-fade-in-up" style="animation-delay: 0.2s;">
        <h2 class="text-3xl md:text-4xl font-bold text-foreground">
          Page Not Found
        </h2>
        <p class="text-lg text-muted-foreground max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style="animation-delay: 0.4s;">
        <Button
          variant="default"
          size="lg"
          :icon="Home"
          icon-position="left"
          @click="goHome"
          class="min-w-[160px]"
        >
          Go Home
        </Button>
        <Button
          variant="outline"
          size="lg"
          :icon="ArrowLeft"
          icon-position="left"
          @click="goBack"
          class="min-w-[160px]"
        >
          Go Back
        </Button>
      </div>

      <!-- Decorative illustration -->
      <div class="pt-8 animate-fade-in-up" style="animation-delay: 0.6s;">
        <div class="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/20">
          <FileQuestion class="w-16 h-16 text-accent/40" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Button } from '@/shared/components/shadcn/button'
import { Home, ArrowLeft, FileQuestion } from 'lucide-vue-next'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'home' })
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push({ name: 'home' })
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}
</style>
