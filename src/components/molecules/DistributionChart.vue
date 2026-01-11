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
    <apexchart
      v-else
      type="donut"
      height="256"
      :options="chartOptions"
      :series="chartSeries"
      class="w-full max-w-md mx-auto"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { PieChart } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const isDarkMode = ref(false)

onMounted(() => {
  const checkDarkMode = () => {
    isDarkMode.value = document.documentElement.classList.contains('dark')
  }
  checkDarkMode()
  const observer = new MutationObserver(checkDarkMode)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

const total = computed(() => {
  if (!props.data || !Array.isArray(props.data) || props.data.length === 0) return 0
  return props.data.reduce((sum, item) => sum + (item?.value || 0), 0)
})

const chartSeries = computed(() => {
  if (!props.data || props.data.length === 0 || total.value === 0) return []
  return props.data.filter(item => item && (item.value || 0) > 0).map(item => item.value)
})

const chartLabels = computed(() => {
  if (!props.data || props.data.length === 0) return []
  return props.data.filter(item => item && (item.value || 0) > 0).map(item => item.label)
})

const chartColors = computed(() => {
  if (!props.data || props.data.length === 0) return []
  return props.data.filter(item => item && (item.value || 0) > 0).map(item => item.color)
})

const chartOptions = computed(() => {
  const totalValue = total.value
  return {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
      events: {
        dataPointSelection: function (event, chartContext, config) {
          // Interactive slice selection
        },
        dataPointMouseEnter: function (event, chartContext, config) {
          // Hover effects
        },
      },
    },
    labels: chartLabels.value,
    colors: chartColors.value,
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        fontWeight: 500,
      },
      dropShadow: {
        enabled: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '15px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: isDarkMode.value ? '#d1d5db' : '#374151',
              offsetY: -15,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'inherit',
              fontWeight: 700,
              color: isDarkMode.value ? '#f9fafb' : '#111827',
              offsetY: 8,
              formatter: function (val) {
                return val.toLocaleString()
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total',
              fontSize: '14px',
              fontFamily: 'inherit',
              fontWeight: 500,
              color: isDarkMode.value ? '#9ca3af' : '#6b7280',
              formatter: function () {
                return totalValue.toLocaleString()
              },
            },
          },
        },
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      fontFamily: 'inherit',
      labels: {
        colors: isDarkMode.value ? '#d1d5db' : '#374151',
      },
      markers: {
        width: 12,
        height: 12,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    tooltip: {
      theme: isDarkMode.value ? 'dark' : 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
      y: {
        formatter: function (val) {
          if (totalValue === 0) return val.toString()
          const percent = ((val / totalValue) * 100).toFixed(1)
          return `${val.toLocaleString()} (${percent}%)`
        },
      },
    },
  stroke: {
    show: true,
    width: 2,
    colors: isDarkMode.value ? ['#1f2937'] : ['#ffffff'],
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        legend: {
          position: 'bottom',
          fontSize: '10px',
        },
        plotOptions: {
          pie: {
            donut: {
              size: '55%',
            },
          },
        },
      },
    },
  ]
  }
})
</script>
