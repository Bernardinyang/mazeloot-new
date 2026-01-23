<template>
  <div class="h-64 w-full">
    <div
      v-if="!data || data.length === 0"
      class="flex flex-col items-center justify-center h-full text-muted-foreground"
    >
      <div class="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
        <TrendingUp class="h-8 w-8 opacity-50" />
      </div>
      <p class="text-sm font-medium">No activity data</p>
      <p class="text-xs">Activity will appear here</p>
    </div>
    <apexchart
      v-else
      type="line"
      height="256"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TrendingUp } from '@/shared/utils/lucideAnimated'
import { useThemeStore } from '@/shared/stores/theme'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const themeStore = useThemeStore()

const chartData = computed(() => {
  if (!props.data || props.data.length === 0) {
    return []
  }

  return props.data
    .filter(d => d && d.date)
    .map(d => ({
      date: d.date,
      collections: Number(d.collections) || 0,
      projects: Number(d.projects) || 0,
      selections: Number(d.selections) || 0,
      proofing: Number(d.proofing) || 0,
      rawFiles: Number(d.rawFiles) || 0,
    }))
})

const isDark = computed(() => themeStore.effectiveTheme === 'dark')
const textColor = computed(() => (isDark.value ? '#e5e7eb' : '#1f2937'))
const gridColor = computed(() => (isDark.value ? '#374151' : '#e5e7eb'))
const cardBg = computed(() => (isDark.value ? '#1f2937' : '#ffffff'))
const borderColor = computed(() => (isDark.value ? '#374151' : '#e5e7eb'))

const chartSeries = computed(() => [
  {
    name: 'Collections',
    data: chartData.value.map(d => d.collections),
    color: '#3b82f6',
  },
  {
    name: 'Projects',
    data: chartData.value.map(d => d.projects),
    color: '#a855f7',
  },
  {
    name: 'Selections',
    data: chartData.value.map(d => d.selections),
    color: '#10b981',
  },
  {
    name: 'Proofing',
    data: chartData.value.map(d => d.proofing),
    color: '#f59e0b',
  },
  {
    name: 'Raw Files',
    data: chartData.value.map(d => d.rawFiles),
    color: '#06b6d4',
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 256,
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
    sparkline: { enabled: false },
  },
  colors: ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#06b6d4'],
  stroke: {
    curve: 'smooth',
    width: 3,
    lineCap: 'round',
  },
  markers: {
    size: 5,
    strokeWidth: 2,
    strokeColors: ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#06b6d4'],
    hover: {
      size: 7,
      sizeOffset: 2,
    },
  },
  xaxis: {
    categories: chartData.value.map(d => d.date),
    labels: {
      style: {
        colors: textColor.value,
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
    axisBorder: {
      color: gridColor.value,
      strokeWidth: 1,
    },
    axisTicks: {
      color: gridColor.value,
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: textColor.value,
        fontSize: '12px',
        fontFamily: 'inherit',
      },
    },
  },
  grid: {
    borderColor: gridColor.value,
    strokeDashArray: 4,
    opacity: 0.2,
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  legend: {
    show: true,
    position: 'top',
    offsetY: -5,
    fontSize: '13px',
    fontFamily: 'inherit',
    fontWeight: 500,
    labels: {
      colors: textColor.value,
    },
    markers: {
      width: 12,
      height: 12,
      radius: 6,
    },
    itemMargin: {
      horizontal: 12,
      vertical: 4,
    },
  },
  tooltip: {
    enabled: true,
    theme: isDark.value ? 'dark' : 'light',
    style: {
      fontSize: '13px',
      fontFamily: 'inherit',
    },
    x: {
      show: true,
      format: 'MMM dd',
    },
    y: {
      formatter: (val) => val.toString(),
    },
    marker: {
      show: true,
    },
    fixed: {
      enabled: false,
      position: 'topRight',
      offsetX: 0,
      offsetY: 0,
    },
  },
  dataLabels: {
    enabled: false,
  },
}))
</script>
