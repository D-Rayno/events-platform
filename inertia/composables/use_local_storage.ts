// inertia/composables/use_local_storage.ts
import { ref, watch } from 'vue'

/**
 * Local storage composable
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key)
  const value = ref<T>(storedValue ? JSON.parse(storedValue) : defaultValue)

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  const remove = () => {
    localStorage.removeItem(key)
    value.value = defaultValue
  }

  return {
    value,
    remove,
  }
}
