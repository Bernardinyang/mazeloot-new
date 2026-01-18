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
    <div v-else ref="chartContainer" class="w-full h-64"></div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { TrendingUp } from '@/shared/utils/lucideAnimated'
import Highcharts from 'highcharts'
import 'highcharts/esm/highcharts-3d'
import { useThemeStore } from '@/shared/stores/theme'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const themeStore = useThemeStore()
const chartContainer = ref(null)
let chartInstance = null

const chartOptions = computed(() => {
  if (!props.data || props.data.length === 0) {
    return {}
  }

  const chartData = props.data
    .filter(d => d && d.date)
    .map(d => {
      const date = d.date instanceof Date ? d.date.getTime() : new Date(d.date).getTime()
      if (isNaN(date)) return null
      return {
        x: date,
        collections: Number(d.collections) || 0,
        projects: Number(d.projects) || 0,
        selections: Number(d.selections) || 0,
        proofing: Number(d.proofing) || 0,
        rawFiles: Number(d.rawFiles) || 0,
      }
    })
    .filter(d => d !== null)

  const isDark = themeStore.effectiveTheme === 'dark'
  const labelColor = isDark ? '#e5e7eb' : '#1f2937'
  const gridColor = isDark ? '#374151' : '#e5e7eb'

  return {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
      height: 256,
      backgroundColor: 'transparent',
    },
    title: {
      text: null,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%b %d}',
        style: {
          color: labelColor,
        },
      },
      lineColor: gridColor,
      tickColor: gridColor,
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        style: {
          color: labelColor,
        },
      },
      gridLineColor: gridColor,
    },
    plotOptions: {
      column: {
        depth: 25,
        grouping: false,
        groupZPadding: 10,
      },
    },
    legend: {
      itemStyle: {
        color: labelColor,
      },
    },
    series: [
      {
        name: 'Collections',
        data: chartData.map(d => [d.x, d.collections]),
        color: '#3b82f6', // Blue
      },
      {
        name: 'Projects',
        data: chartData.map(d => [d.x, d.projects]),
        color: '#a855f7', // Purple
      },
      {
        name: 'Selections',
        data: chartData.map(d => [d.x, d.selections]),
        color: '#10b981', // Green
      },
      {
        name: 'Proofing',
        data: chartData.map(d => [d.x, d.proofing]),
        color: '#f59e0b', // Orange
      },
      {
        name: 'Raw Files',
        data: chartData.map(d => [d.x, d.rawFiles]),
        color: '#06b6d4', // Cyan
      },
    ],
    credits: {
      enabled: false,
    },
  }
})

watch([() => chartOptions.value, () => chartContainer.value, () => themeStore.effectiveTheme], () => {
  if (chartContainer.value && chartOptions.value && Object.keys(chartOptions.value).length > 0) {
    if (chartInstance) {
      chartInstance.update(chartOptions.value, true)
    } else if (chartContainer.value) {
      chartInstance = Highcharts.chart(chartContainer.value, chartOptions.value)
    }
  }
}, { immediate: true, deep: true })

onMounted(() => {
  if (chartContainer.value && chartOptions.value && Object.keys(chartOptions.value).length > 0) {
    chartInstance = Highcharts.chart(chartContainer.value, chartOptions.value)
  }
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
