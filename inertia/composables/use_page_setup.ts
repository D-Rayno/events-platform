// inertia/composables/use_page_setup.ts
import { onMounted, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'
import type { SharedProps } from '~/types/common'

/**
 * Page setup composable
 * Initializes stores and handles shared data
 */
export function usePageSetup() {
  const page = usePage<SharedProps>()
  const authStore = useAuthStore()
  const appStore = useAppStore()

  /**
   * Initialize auth from page props
   */
  const initializeAuth = () => {
    if (page.props.auth?.user && !authStore.isInitialized) {
      authStore.initializeAuth(page.props.auth.user)
    }
  }

  /**
   * Handle flash messages
   */
  const handleFlashMessages = () => {
    if (page.props.flash) {
      appStore.setFlashMessages(page.props.flash)
    }
  }

  /**
   * Initialize page
   */
  const initializePage = () => {
    initializeAuth()
    handleFlashMessages()
  }

  // Watch for page prop changes
  watch(
    () => page.props.auth?.user,
    (newUser) => {
      if (newUser) {
        authStore.setUser(newUser)
      } else {
        authStore.clearUser()
      }
    },
    { deep: true }
  )

  watch(
    () => page.props.flash,
    (newFlash) => {
      if (newFlash) {
        appStore.setFlashMessages(newFlash)
      }
    },
    { deep: true }
  )

  onMounted(() => {
    initializePage()
  })

  return {
    initializePage,
    initializeAuth,
    handleFlashMessages,
  }
}
