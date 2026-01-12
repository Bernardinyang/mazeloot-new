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
      type="area"
      height="256"
      :options="chartOptions"
      :series="chartSeries"
      class="w-full"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { TrendingUp } from 'lucide-vue-next'

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

const chartSeries = computed(() => {
  if (!props.data || props.data.length === 0) return []

  return [
    {
      name: 'Collections',
      data: props.data.map(d => d.collections || 0),
    },
    {
      name: 'Projects',
      data: props.data.map(d => d.projects || 0),
    },
    {
      name: 'Selections',
      data: props.data.map(d => d.selections || 0),
    },
    {
      name: 'Proofing',
      data: props.data.map(d => d.proofing || 0),
    },
  ]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 256,
    fontFamily: 'inherit',
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
    },
    zoom: {
      enabled: true,
      type: 'x',
      autoScaleYaxis: true,
    },
    selection: {
      enabled: true,
      type: 'x',
      fill: {
        color: '#24292e',
        opacity: 0.1,
      },
      stroke: {
        width: 1,
        dashArray: 3,
        color: '#24292e',
        opacity: 0.4,
      },
    },
    brush: {
      enabled: true,
      target: 'chart',
      autoScaleYaxis: true,
    },
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
    events: {
      dataPointSelection: function (event, chartContext, config) {
        // Interactive point selection
      },
      markerClick: function (event, chartContext, config) {
        // Marker click handling
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    strokeWidth: 2,
    hover: {
      size: 6,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
    lineCap: 'round',
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 50, 100],
    },
  },
  colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
  xaxis: {
    categories: props.data.map(d => d.date),
    labels: {
      style: {
        colors: isDarkMode.value ? '#9ca3af' : '#6b7280',
        fontSize: '12px',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: isDarkMode.value ? '#9ca3af' : '#6b7280',
        fontSize: '12px',
      },
    },
  },
  grid: {
    borderColor: isDarkMode.value ? '#374151' : '#e5e7eb',
    strokeDashArray: 4,
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
    shared: true,
    intersect: false,
    followCursor: true,
    fixed: {
      enabled: false,
    },
    style: {
      fontSize: '12px',
      fontFamily: 'inherit',
    },
    marker: {
      show: true,
    },
    x: {
      format: 'dd MMM',
    },
    y: {
      formatter: function (val, { seriesIndex }) {
        const labels = ['Collections', 'Projects', 'Selections', 'Proofing']
        return labels[seriesIndex] + ': ' + val + ' items'
      },
      title: {
        formatter: function () {
          return ''
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        legend: {
          position: 'bottom',
          fontSize: '10px',
        },
        chart: {
          toolbar: {
            show: false,
          },
        },
      },
    },
  ],
}))
</script>
