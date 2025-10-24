// inertia/hooks/useRouteGuard.ts
import { useEffect, useCallback } from 'react'
import { router } from '@inertiajs/react'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'
import { FlashMessages } from '~/types'

export interface RouteGuardOptions {
  requiresAuth?: boolean
  requiresVerification?: boolean
  requiresGuest?: boolean
}

/**
 * Shared checkAccess implementation used by both hooks.
 * Returns true when access is allowed, false otherwise.
 */
function checkAccessImpl(
  options: RouteGuardOptions,
  isAuthenticated: boolean,
  isEmailVerified: boolean,
  needsVerification: boolean,
  addFlashMessage: (type: keyof FlashMessages, message: string) => void
): boolean {
  // Require guest (not authenticated)
  if (options.requiresGuest && isAuthenticated) {
    router.visit('/')
    return false
  }

  // Require authentication
  if (options.requiresAuth && !isAuthenticated) {
    addFlashMessage('error', 'Vous devez être connecté pour accéder à cette page.')
    // store intended url so user can be redirected back after login
    try {
      sessionStorage.setItem('intended_url', window.location.pathname + window.location.search)
    } catch (e) {
      /* ignore storage errors (SSR, private mode) */
    }
    router.visit('/auth/login')
    return false
  }

  // Require email verification
  if (options.requiresVerification) {
    // if we don't have explicit verification state, fall back to combination
    const requiresRedirect = !isEmailVerified || needsVerification
    if (requiresRedirect) {
      addFlashMessage(
        'warning',
        'Veuillez vérifier votre email pour accéder à cette fonctionnalité.'
      )
      router.visit('/')
      return false
    }
  }

  return true
}

/**
 * useRouteGuard
 * - Runs the check on mount automatically.
 * - If access is denied due to auth, it will store the intended url for post-login redirect.
 */
export function useRouteGuard(options: RouteGuardOptions = {}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isEmailVerified = useAuthStore((s) => s.isEmailVerified)
  const needsVerification = useAuthStore((s) => s.needsVerification)
  const addFlashMessage = useAppStore((s) => s.addFlashMessage)

  useEffect(() => {
    checkAccessImpl(options, isAuthenticated, isEmailVerified, needsVerification, addFlashMessage)
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // also return a check function for manual checks if needed
  const checkAccess = useCallback(() => {
    return checkAccessImpl(
      options,
      isAuthenticated,
      isEmailVerified,
      needsVerification,
      addFlashMessage
    )
  }, [options, isAuthenticated, isEmailVerified, needsVerification, addFlashMessage])

  return { checkAccess }
}

/**
 * useProtectedLayout
 * - Similar to useRouteGuard but designed to be used inside layout components.
 * - It runs the same check on mount and returns the check function for the layout to call on demand.
 */
export function useProtectedLayout(options: RouteGuardOptions = {}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isEmailVerified = useAuthStore((s) => s.isEmailVerified)
  const needsVerification = useAuthStore((s) => s.needsVerification)
  const addFlashMessage = useAppStore((s) => s.addFlashMessage)

  useEffect(() => {
    checkAccessImpl(options, isAuthenticated, isEmailVerified, needsVerification, addFlashMessage)
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAccess = useCallback(() => {
    return checkAccessImpl(
      options,
      isAuthenticated,
      isEmailVerified,
      needsVerification,
      addFlashMessage
    )
  }, [options, isAuthenticated, isEmailVerified, needsVerification, addFlashMessage])

  return { checkAccess }
}
