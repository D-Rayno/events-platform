import { ref, onMounted, onUnmounted } from 'vue'

interface AnimationOptions {
  duration?: number
  delay?: number
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  repeat?: number
}

export function use_animation() {
  const isReduced = ref(false)

  const checkReducedMotion = () => {
    if (typeof window !== 'undefined') {
      isReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }

  onMounted(() => {
    checkReducedMotion()
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkReducedMotion)
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      mediaQuery.removeEventListener('change', checkReducedMotion)
    }
  })

  const getTransition = (options: AnimationOptions = {}) => {
    if (isReduced.value) return 'all 0s linear'

    const { duration = 300, easing = 'ease-in-out' } = options

    return `all ${duration}ms ${easing}`
  }

  const getAnimationClass = (name: string, options: AnimationOptions = {}) => {
    if (isReduced.value) return ''

    const { duration = 300, delay = 0, repeat = 0 } = options

    return `animate-${name} duration-${duration} delay-${delay} ${repeat > 0 ? `repeat-${repeat}` : ''}`
  }

  const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null

    return ((...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        func(...args)
        timeout = null
      }, wait)
    }) as T
  }

  const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
    let inThrottle: boolean
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }) as T
  }

  const staggerDelay = (index: number, baseDelay: number = 50) => {
    return index * baseDelay
  }

  return {
    isReduced,
    checkReducedMotion,
    getTransition,
    getAnimationClass,
    debounce,
    throttle,
    staggerDelay,
  }
}
