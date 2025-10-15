// inertia/composables/use_toast.ts
import { ref } from 'vue'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

/**
 * Toast notification composable
 */
export function useToast() {
  const toasts = ref<Toast[]>([])

  /**
   * Show toast notification
   * @param type - Toast type
   * @param message - Toast message
   * @param duration - Duration in ms (default 3000)
   */
  const showToast = (type: Toast['type'], message: string, duration: number = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const toast: Toast = { id, type, message, duration }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  /**
   * Remove toast by id
   * @param id - Toast id
   */
  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  /**
   * Show success toast
   * @param message - Success message
   * @param duration - Duration in ms
   */
  const success = (message: string, duration?: number) => {
    showToast('success', message, duration)
  }

  /**
   * Show error toast
   * @param message - Error message
   * @param duration - Duration in ms
   */
  const error = (message: string, duration?: number) => {
    showToast('error', message, duration)
  }

  /**
   * Show warning toast
   * @param message - Warning message
   * @param duration - Duration in ms
   */
  const warning = (message: string, duration?: number) => {
    showToast('warning', message, duration)
  }

  /**
   * Show info toast
   * @param message - Info message
   * @param duration - Duration in ms
   */
  const info = (message: string, duration?: number) => {
    showToast('info', message, duration)
  }

  /**
   * Clear all toasts
   */
  const clearAll = () => {
    toasts.value = []
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  }
}
