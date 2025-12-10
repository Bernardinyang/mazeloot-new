import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

export function useTilt(elementRef: Ref<HTMLElement | null>, options = { intensity: 15 }) {
  const rotateX = ref(0)
  const rotateY = ref(0)
  const isHovering = ref(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (!elementRef.value) return

    const rect = elementRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateXValue = ((y - centerY) / centerY) * -options.intensity
    const rotateYValue = ((x - centerX) / centerX) * options.intensity

    rotateX.value = rotateXValue
    rotateY.value = rotateYValue
  }

  const handleMouseEnter = () => {
    isHovering.value = true
  }

  const handleMouseLeave = () => {
    isHovering.value = false
    rotateX.value = 0
    rotateY.value = 0
  }

  onMounted(() => {
    if (!elementRef.value) return
    const element = elementRef.value

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
  })

  onUnmounted(() => {
    if (!elementRef.value) return
    const element = elementRef.value

    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseenter', handleMouseEnter)
    element.removeEventListener('mouseleave', handleMouseLeave)
  })

  const style = computed(() => ({
    transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    transition: isHovering.value ? 'none' : 'transform 0.5s ease-out',
  }))

  return {
    rotateX,
    rotateY,
    isHovering,
    style,
  }
}

