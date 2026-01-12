import { ref, watch } from 'vue'
import { debounce } from '@/shared/utils/debounce'

export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)

  const updateDebouncedValue = debounce((newValue) => {
    debouncedValue.value = newValue
  }, delay)

  watch(value, (newValue) => {
    updateDebouncedValue(newValue)
  })

  return debouncedValue
}
