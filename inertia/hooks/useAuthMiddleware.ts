// inertia/hooks/useAuthMiddleware.ts
import { router } from '@inertiajs/react'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'

/**
 * Auth middleware composable
 * Provides authentication guards and redirects
 *
 * Note: this composable uses zustand's getState() to read/write store
 * outside of React components, avoiding hook-rule violations.
 */
export function useAuthMiddleware() {
  // use getState() so this composable can be used anywhere (not only inside React components)
  const authGet = () => useAuthStore.getState()
  const appGet = () => useAppStore.getState()

  /**
   * Require authentication
   * Redirects to login if not authenticated
   */
  const requireAuth = (): boolean => {
    const authState = authGet()
    if (!authState.isAuthenticated()) {
      const app = appGet()
      app.addFlashMessage('error', 'Vous devez être connecté pour accéder à cette page.')
      // store intended url so user can be redirected back after login
      try {
        sessionStorage.setItem('intended_url', window.location.pathname + window.location.search)
      } catch (e) {
        // ignore sessionStorage errors (e.g., SSR)
      }
      router.visit('/auth/login')
      return false
    }
    return true
  }

  /**
   * Require guest (not authenticated)
   * Redirects to home if authenticated
   */
  const requireGuest = (): boolean => {
    const authState = authGet()
    if (authState.isAuthenticated()) {
      router.visit('/')
      return false
    }
    return true
  }

  /**
   * Require email verification
   * Redirects to home with message if email not verified
   */
  const requireEmailVerification = (): boolean => {
    const authState = authGet()

    if (!authState.isAuthenticated) {
      return requireAuth()
    }

    if (!authState.isEmailVerified) {
      const app = appGet()
      app.addFlashMessage(
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
    requiresAuth = false,
    requiresVerification = false,
    requiresGuest = false
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
  const handlePostLoginRedirect = (): void => {
    try {
      const intendedUrl = sessionStorage.getItem('intended_url')
      if (intendedUrl) {
        sessionStorage.removeItem('intended_url')
        router.visit(intendedUrl)
      } else {
        router.visit('/')
      }
    } catch (e) {
      // If sessionStorage is unavailable, just go home
      router.visit('/')
    }
  }

  /**
   * Store intended URL for post-login redirect
   * @param url - URL to redirect to after login
   */
  const setIntendedUrl = (url: string): void => {
    try {
      sessionStorage.setItem('intended_url', url)
    } catch (e) {
      // ignore storage errors
    }
  }

  /**
   * Clear intended URL
   */
  const clearIntendedUrl = (): void => {
    try {
      sessionStorage.removeItem('intended_url')
    } catch (e) {
      // ignore
    }
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
