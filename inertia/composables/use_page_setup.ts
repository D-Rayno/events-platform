// inertia/composables/use_page_setup.ts
import { onMounted, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'

/**
 * Page setup composable
 * Initializes stores and handles shared data
 */
export function usePageSetup() {
  const page = usePage()
  const authStore = useAuthStore()
  const appStore = useAppStore()

  const initializeAuth = () => {
    const props = page.props as any
    if (props.auth?.user && !authStore.isInitialized) {
      authStore.initializeAuth(props.auth.user)
    }
  }

  const handleFlashMessages = () => {
    const props = page.props as any
    if (props.flash) {
      appStore.setFlashMessages(props.flash)
    }
  }

  const initializePage = () => {
    initializeAuth()
    handleFlashMessages()
  }

  watch(
    () => (page.props as any).auth?.user,
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
    () => (page.props as any).flash,
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
