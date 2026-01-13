<template>
  <div
    :class="[
      'flex items-center',
      containerClass,
      size === 'sm' ? 'h-10' : size === 'md' ? 'h-14' : 'h-16',
    ]"
  >
    <img
      :src="currentLogo"
      alt="Mazeloot"
      :class="[
        'object-contain transition-all duration-200',
        'h-full w-auto max-w-full',
        colorClass,
      ]"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/shared/stores/theme'
import mazelootLightLogo from '@/shared/assets/images/logos/mazelootLightLogo.svg'
import mazelootPrimaryLogo from '@/shared/assets/images/logos/mazelootPrimaryLogo.svg'
import mazeloofFaviconDarkLogo from '@/shared/assets/images/logos/mazeloofFaviconDarkLogo.svg'
import mazeloofFaviconLightLogo from '@/shared/assets/images/logos/mazeloofFaviconLightLogo.svg'
import mazeloofFaviconPrimaryLogo from '@/shared/assets/images/logos/mazeloofFaviconPrimaryLogo.svg'

const themeStore = useThemeStore()

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value),
  },
  showText: {
    type: Boolean,
    default: true,
  },
  colorClass: {
    type: String,
    default: undefined,
  },
  containerClass: {
    type: String,
    default: '',
  },
  logoSrc: {
    type: String,
    default: undefined,
  },
  useFavicon: {
    type: Boolean,
    default: false,
  },
})

const currentLogo = computed(() => {
  if (props.logoSrc) {
    return props.logoSrc
  }
  if (props.useFavicon) {
    return themeStore.effectiveTheme === 'dark'
      ? mazeloofFaviconDarkLogo
      : mazeloofFaviconPrimaryLogo
  }
  return themeStore.effectiveTheme === 'dark'
    ? mazelootLightLogo
    : mazelootPrimaryLogo
})
</script>
