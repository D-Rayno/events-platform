// inertia/composables/use_infinite_scroll.ts
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Infinite scroll composable
 */
export function useInfiniteScroll(callback: () => void, threshold = 200) {
  const isLoading = ref(false)
  const hasMore = ref(true)

  /**
   * Handle scroll event
   */
  const handleScroll = () => {
    if (isLoading.value || !hasMore.value) return

    const scrollPosition = window.innerHeight + window.scrollY
    const pageHeight = document.documentElement.scrollHeight

    if (pageHeight - scrollPosition < threshold) {
      isLoading.value = true
      callback()
    }
  }

  /**
   * Reset loading state
   */
  const resetLoading = () => {
    isLoading.value = false
  }

  /**
   * Set has more flag
   * @param value - Has more items
   */
  const setHasMore = (value: boolean) => {
    hasMore.value = value
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    isLoading,
    hasMore,
    resetLoading,
    setHasMore,
  }
}
