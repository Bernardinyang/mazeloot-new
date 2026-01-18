<template>
  <div :class="cn('p-3', props.class)">
    <div class="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <button
              type="button"
              @click="previousMonth"
              :class="[
                'h-7 w-7 rounded-md p-0 opacity-50 hover:opacity-100',
                theme.bgButtonHover,
                theme.textPrimary,
              ]"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              type="button"
              @click="nextMonth"
              :class="[
                'h-7 w-7 rounded-md p-0 opacity-50 hover:opacity-100',
                theme.bgButtonHover,
                theme.textPrimary,
              ]"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
          <div :class="['text-sm font-medium', theme.textPrimary]">
            {{ currentMonthYear }}
          </div>
        </div>
        <div class="grid w-full grid-cols-7 gap-1">
          <div
            v-for="day in weekDays"
            :key="day"
            :class="['text-center text-xs font-medium p-2', theme.textSecondary]"
          >
            {{ day }}
          </div>
        </div>
        <div class="grid w-full grid-cols-7 gap-1">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            @click="selectDate(day)"
            :class="
              cn(
                'text-center text-sm p-2 rounded-md cursor-pointer transition-colors',
                day === null && [theme.textTertiary, 'cursor-not-allowed'],
                day &&
                  isSelected(day) && [
                    'bg-violet-500 text-white hover:bg-violet-600',
                    'focus:bg-violet-500',
                  ],
                day &&
                  !isSelected(day) && [
                    theme.textPrimary,
                    theme.bgButtonHover,
                    'hover:bg-opacity-80',
                  ],
                day && isToday(day) && !isSelected(day) && 'font-semibold ring-1 ring-violet-500/50'
              )
            "
          >
            {{ day || '' }}
          </div>
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
import { ChevronLeft, ChevronRight } from '@/shared/utils/lucideAnimated'
import { cn } from '@/shared/lib/utils'
import { useThemeClasses } from '@/shared/composables/useThemeClasses'
import type { HTMLAttributes } from 'vue'

const theme = useThemeClasses()

interface Props {
  modelValue?: Date | string | null
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
}>()

const currentDate = ref(props.modelValue ? new Date(props.modelValue) : new Date())

const currentMonthYear = computed(() => {
  return format(currentDate.value, 'MMMM yyyy')
})

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

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
</script>
