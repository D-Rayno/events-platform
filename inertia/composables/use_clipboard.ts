// inertia/composables/use_clipboard.ts
import { ref } from 'vue'

/**
 * Clipboard composable
 */
export function useClipboard() {
  const copied = ref(false)
  const error = ref<string | null>(null)

  /**
   * Copy text to clipboard
   * @param text - Text to copy
   */
  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      error.value = null

      // Reset after 2 seconds
      setTimeout(() => {
        copied.value = false
      }, 2000)

      return true
    } catch (err) {
      error.value = 'Erreur lors de la copie'
      copied.value = false
      return false
    }
  }

  return {
    copied,
    error,
    copy,
  }
}
