// inertia/composables/use_confirmation.ts
import { ref } from 'vue'

/**
 * Confirmation dialog composable
 */
export function useConfirmation() {
  const isOpen = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmText = ref('Confirmer')
  const cancelText = ref('Annuler')
  const variant = ref<'danger' | 'warning' | 'info'>('warning')

  let resolvePromise: ((value: boolean) => void) | null = null

  /**
   * Show confirmation dialog
   * @param options - Confirmation options
   */
  const confirm = (options: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info'
  }): Promise<boolean> => {
    title.value = options.title
    message.value = options.message
    confirmText.value = options.confirmText || 'Confirmer'
    cancelText.value = options.cancelText || 'Annuler'
    variant.value = options.variant || 'warning'
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  /**
   * Handle confirm action
   */
  const handleConfirm = () => {
    isOpen.value = false
    resolvePromise?.(true)
  }

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    isOpen.value = false
    resolvePromise?.(false)
  }

  return {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    variant,
    confirm,
    handleConfirm,
    handleCancel,
  }
}
