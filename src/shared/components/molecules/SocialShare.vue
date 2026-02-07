<template>
  <div class="flex items-center gap-2">
    <Button
      v-for="platform in platforms"
      :key="platform.name"
      :variant="variant"
      :size="size"
      @click="share(platform)"
      class="gap-2"
      :aria-label="`Share on ${platform.name}`"
    >
      <component :is="platform.icon" class="h-4 w-4" />
      <span v-if="showLabels">{{ platform.name }}</span>
    </Button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '@/shared/components/shadcn/button'
import { Share2, Twitter, Facebook, Linkedin, Mail } from 'lucide-vue-next'

const props = defineProps({
  url: {
    type: String,
    default: () => typeof window !== 'undefined' ? window.location.href : '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'outline',
  },
  size: {
    type: String,
    default: 'sm',
  },
  showLabels: {
    type: Boolean,
    default: false,
  },
})

const platforms = computed(() => [
  {
    name: 'Twitter',
    icon: Twitter,
    url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`,
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`,
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.url)}`,
  },
  {
    name: 'Email',
    icon: Mail,
    url: `mailto:?subject=${encodeURIComponent(props.title)}&body=${encodeURIComponent(props.description + '\n\n' + props.url)}`,
  },
])

const share = (platform) => {
  if (platform.name === 'Email') {
    window.location.href = platform.url
    return
  }

  const width = 600
  const height = 400
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2

  window.open(
    platform.url,
    'share',
    `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1`
  )
}
</script>
