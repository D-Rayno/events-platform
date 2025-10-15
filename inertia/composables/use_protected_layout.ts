import { onBeforeMount } from 'vue'
import { router } from '@inertiajs/vue3'
import { useAuthStore } from '#stores/auth'
import { useAppStore } from '#stores/app'

/**
 * Composable to protect pages based on authentication state
 */
export function useProtectedLayout(
  options: {
    requiresAuth?: boolean
    requiresVerification?: boolean
    requiresGuest?: boolean
  } = {}
) {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  const checkAccess = () => {
    // Require guest (not authenticated)
    if (options.requiresGuest && authStore.isAuthenticated) {
      router.visit('/')
      return false
    }

    // Require authentication
    if (options.requiresAuth && !authStore.isAuthenticated) {
      appStore.addFlashMessage('error', 'You must be logged in to access this page.')
      router.visit('/auth/login')
      return false
    }

    // Require email verification
    if (options.requiresVerification && authStore.needsVerification) {
      appStore.addFlashMessage('warning', 'Please verify your email to access this feature.')
      router.visit('/')
      return false
    }

    return true
  }

  onBeforeMount(() => {
    checkAccess()
  })

  return { checkAccess }
}
