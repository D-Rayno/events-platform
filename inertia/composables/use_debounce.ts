// inertia/composables/use_debounce.ts
import { ref, watch } from 'vue'

/**
 * Debounce composable
 */
export function useDebounce<T>(value: T, delay: number = 300) {
  const debouncedValue = ref<T>(value)
  let timeout: ReturnType<typeof setTimeout>

  watch(
    () => value,
    (newValue) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        debouncedValue.value = newValue as any
      }, delay)
    }
  )

  return debouncedValue
}
