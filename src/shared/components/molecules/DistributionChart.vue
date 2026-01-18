<template>
  <div class="h-64 w-full flex items-center justify-center">
    <div
      v-if="!data || data.length === 0 || total === 0"
      class="flex flex-col items-center justify-center h-full text-muted-foreground"
    >
      <div class="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
        <PieChart class="h-8 w-8 opacity-50" />
      </div>
      <p class="text-sm font-medium">No distribution data</p>
      <p class="text-xs">Content distribution will appear here</p>
    </div>
    <div v-else ref="chartContainer" class="w-full h-64"></div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { PieChart } from '@/shared/utils/lucideAnimated'
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

const total = computed(() => {
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) return 0
  const result = props.data.reduce((sum, item) => {
    const val = Number(item?.value)
    return sum + (isNaN(val) ? 0 : val)
  }, 0)
  return isNaN(result) ? 0 : result
})

const chartOptions = computed(() => {
  if (!props.data || props.data.length === 0 || total.value === 0) {
    return {}
  }

  const seriesData = props.data
    .filter(item => item && typeof item === 'object' && (item.value || 0) > 0)
    .map(item => ({
      name: item.label || '',
      y: Number(item.value) || 0,
      color: item.color || '#3b82f6',
    }))

  const isDark = themeStore.effectiveTheme === 'dark'

  return {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      height: 256,
      backgroundColor: 'transparent',
    },
    title: {
      text: null,
    },
    colors: seriesData.map(item => item.color || '#3b82f6'),
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: isDark ? '#e5e7eb' : '#1f2937',
          },
        },
      },
    },
    series: [
      {
        name: 'Distribution',
        data: seriesData,
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
