<template>
  <div class="relative">
    <input
      :value="displayValue"
      :class="
        cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          ($attrs.class as string) || ''
        )
      "
      type="text"
      :placeholder="placeholder"
      readonly
      @click="toggleCalendar"
      v-bind="$attrs"
    />
    <button
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      @click="toggleCalendar"
    >
      <IconCalendar class="h-4 w-4" :size="16" />
    </button>

    <!-- Calendar Popover -->
    <div
      v-if="showCalendar"
      v-click-outside="closeCalendar"
      class="absolute z-50 mt-1 w-auto rounded-md border bg-popover p-4 text-popover-foreground shadow-md"
    >
      <div class="flex items-center justify-between mb-4">
        <button type="button" @click="previousMonth" class="p-1 hover:bg-accent rounded-md">
          <IconChevronLeft class="h-4 w-4" :size="16" />
        </button>
        <div class="font-semibold">{{ currentMonthYear }}</div>
        <button type="button" @click="nextMonth" class="p-1 hover:bg-accent rounded-md">
          <IconChevronRight class="h-4 w-4" :size="16" />
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-center text-xs font-medium text-muted-foreground p-2"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="selectDate(day)"
          :class="
            cn(
              'text-center text-sm p-2 rounded-md cursor-pointer hover:bg-accent',
              day === null && 'text-muted-foreground/50 cursor-not-allowed',
              day && isSelected(day) && 'bg-primary text-primary-foreground',
              day && isToday(day) && !isSelected(day) && 'bg-accent font-semibold'
            )
          "
        >
          {{ day || '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday as isTodayDate,
} from 'date-fns'
import { cn } from '@/lib/utils'
import IconCalendar from '@/icons/IconCalendar.vue'
import IconChevronLeft from '@/icons/IconChevronLeft.vue'
import IconChevronRight from '@/icons/IconChevronRight.vue'

interface Props {
  modelValue?: Date | string | null
  placeholder?: string
  format?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a date',
  format: 'MMM dd, yyyy',
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
}>()

const showCalendar = ref(false)
const currentDate = ref(props.modelValue ? new Date(props.modelValue) : new Date())

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const date = typeof props.modelValue === 'string' ? new Date(props.modelValue) : props.modelValue
  return format(date, props.format)
})

const currentMonthYear = computed(() => {
  return format(currentDate.value, 'MMMM yyyy')
})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const monthStart = startOfMonth(currentDate.value)
  const monthEnd = endOfMonth(currentDate.value)

  const start = startOfWeek(monthStart, { weekStartsOn: 0 })
  const end = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const allDays = eachDayOfInterval({ start, end })

  return allDays.map(day => {
    if (!isSameMonth(day, monthStart)) return null
    return day.getDate()
  })
})

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

const closeCalendar = () => {
  showCalendar.value = false
}

const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

const selectDate = (day: number | null) => {
  if (day === null) return

  const monthStart = startOfMonth(currentDate.value)
  const selectedDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), day)
  emit('update:modelValue', selectedDate)
  closeCalendar()
}

const isSelected = (day: number) => {
  if (!props.modelValue) return false
  const modelDate =
    typeof props.modelValue === 'string' ? new Date(props.modelValue) : props.modelValue
  const monthStart = startOfMonth(currentDate.value)
  const checkDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), day)
  return isSameDay(modelDate, checkDate)
}

const isToday = (day: number | null) => {
  if (!day) return false
  const monthStart = startOfMonth(currentDate.value)
  const checkDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), day)
  return isTodayDate(checkDate)
}

watch(
  () => props.modelValue,
  newValue => {
    if (newValue) {
      currentDate.value = typeof newValue === 'string' ? new Date(newValue) : newValue
    }
  }
)

// Click outside directive
interface HTMLElementWithClickOutside extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

const vClickOutside = {
  mounted(el: HTMLElementWithClickOutside, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElementWithClickOutside) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  },
}
</script>
