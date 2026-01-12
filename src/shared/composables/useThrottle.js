import { ref, watch } from 'vue'
import { throttle } from '@/shared/utils/throttle'

export function useThrottle(value, limit = 300) {
  const throttledValue = ref(value.value)

  const updateThrottledValue = throttle((newValue) => {
    throttledValue.value = newValue
  }, limit)

  watch(value, (newValue) => {
    updateThrottledValue(newValue)
  })

  return throttledValue
}
