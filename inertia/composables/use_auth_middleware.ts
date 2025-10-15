// inertia/composables/use_auth_middleware.ts
import { router } from '@inertiajs/vue3'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'

/**
 * Auth middleware composable
 * Provides authentication guards and redirects
 */
export function useAuthMiddleware() {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  /**
   * Require authentication
   * Redirects to login if not authenticated
   */
  const requireAuth = () => {
    if (!authStore.isAuthenticated) {
      appStore.addFlashMessage('error', 'Vous devez être connecté pour accéder à cette page.')
      router.visit('/auth/login')
      return false
    }
    return true
  }

  /**
   * Require guest (not authenticated)
   * Redirects to home if authenticated
   */
  const requireGuest = () => {
    if (authStore.isAuthenticated) {
      router.visit('/')
      return false
    }
    return true
  }

  /**
   * Require email verification
   * Redirects to home with message if email not verified
   */
  const requireEmailVerification = () => {
    if (!authStore.isAuthenticated) {
      return requireAuth()
    }

    if (!authStore.isEmailVerified) {
      appStore.addFlashMessage(
        'warning',
        'Veuillez vérifier votre email pour accéder à cette fonctionnalité.'
      )
      router.visit('/')
      return false
    }

    return true
  }

  /**
   * Check if user can access route
   * @param requiresAuth - Route requires authentication
   * @param requiresVerification - Route requires email verification
   * @param requiresGuest - Route requires guest
   */
  const canAccessRoute = (
    requiresAuth: boolean = false,
    requiresVerification: boolean = false,
    requiresGuest: boolean = false
  ): boolean => {
    if (requiresGuest) {
      return requireGuest()
    }

    if (requiresAuth) {
      if (!requireAuth()) return false

      if (requiresVerification) {
        return requireEmailVerification()
      }
    }

    return true
  }

  /**
   * Handle authentication redirect after login
   */
  const handlePostLoginRedirect = () => {
    const intendedUrl = sessionStorage.getItem('intended_url')

    if (intendedUrl) {
      sessionStorage.removeItem('intended_url')
      router.visit(intendedUrl)
    } else {
      router.visit('/')
    }
  }

  /**
   * Store intended URL for post-login redirect
   * @param url - URL to redirect to after login
   */
  const setIntendedUrl = (url: string) => {
    sessionStorage.setItem('intended_url', url)
  }

  /**
   * Clear intended URL
   */
  const clearIntendedUrl = () => {
    sessionStorage.removeItem('intended_url')
  }

  return {
    requireAuth,
    requireGuest,
    requireEmailVerification,
    canAccessRoute,
    handlePostLoginRedirect,
    setIntendedUrl,
    clearIntendedUrl,
  }
}

