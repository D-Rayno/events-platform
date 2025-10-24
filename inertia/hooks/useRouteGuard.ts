// inertia/hooks/useRouteGuard.ts - FIXED VERSION
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
 * Shared checkAccess implementation
 */
function checkAccessImpl(
  options: RouteGuardOptions,
  isAuthenticated: boolean,
  isEmailVerified: boolean,
  needsVerification: boolean,
  addFlashMessage: (type: keyof FlashMessages, message: string) => void,
  currentPath: string
): boolean {
  // Require guest (not authenticated)
  if (options.requiresGuest && isAuthenticated) {
    console.log('[RouteGuard] Guest only - redirecting authenticated user to events')
    router.visit('/events')
    return false
  }

  // Require authentication
  if (options.requiresAuth && !isAuthenticated) {
    console.log('[RouteGuard] Auth required - redirecting to login')
    addFlashMessage('error', 'Vous devez être connecté pour accéder à cette page.')
    
    // Store intended url for post-login redirect
    try {
      sessionStorage.setItem('intended_url', currentPath)
    } catch (e) {
      console.error('[RouteGuard] Failed to store intended URL:', e)
    }
    
    router.visit('/auth/login')
    return false
  }

  // Require email verification
  if (options.requiresVerification && isAuthenticated) {
    const requiresRedirect = !isEmailVerified || needsVerification
    if (requiresRedirect) {
      console.log('[RouteGuard] Email verification required - redirecting to home')
      addFlashMessage(
        'warning',
        'Veuillez vérifier votre email pour accéder à cette fonctionnalité.'
      )
      router.visit('/')
      return false
    }
  }

  console.log('[RouteGuard] Access granted')
  return true
}

/**
 * useRouteGuard
 * Runs the check on mount automatically
 */
export function useRouteGuard(options: RouteGuardOptions = {}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isEmailVerified = useAuthStore((s) => s.isEmailVerified)
  const needsVerification = useAuthStore((s) => s.needsVerification)
  const addFlashMessage = useAppStore((s) => s.addFlashMessage)

  useEffect(() => {
    const currentPath = window.location.pathname + window.location.search
    
    console.log('[RouteGuard] Checking access for:', currentPath, {
      requiresAuth: options.requiresAuth,
      requiresGuest: options.requiresGuest,
      requiresVerification: options.requiresVerification,
      isAuthenticated,
      isEmailVerified
    })
    
    checkAccessImpl(
      options,
      isAuthenticated,
      isEmailVerified,
      needsVerification,
      addFlashMessage,
      currentPath
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAccess = useCallback(() => {
    const currentPath = window.location.pathname + window.location.search
    return checkAccessImpl(
      options,
      isAuthenticated,
      isEmailVerified,
      needsVerification,
      addFlashMessage,
      currentPath
    )
  }, [options, isAuthenticated, isEmailVerified, needsVerification, addFlashMessage])

  return { checkAccess }
}

/**
 * useProtectedLayout
 * Similar to useRouteGuard but for layout components
 */
export function useProtectedLayout(options: RouteGuardOptions = {}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isEmailVerified = useAuthStore((s) => s.isEmailVerified)
  const needsVerification = useAuthStore((s) => s.needsVerification)
  const addFlashMessage = useAppStore((s) => s.addFlashMessage)

  useEffect(() => {
    const currentPath = window.location.pathname + window.location.search
    checkAccessImpl(
      options,
      isAuthenticated,
      isEmailVerified,
      needsVerification,
      addFlashMessage,
      currentPath
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAccess = useCallback(() => {
    const currentPath = window.location.pathname + window.location.search
    return checkAccessImpl(
      options,
      isAuthenticated,
      isEmailVerified,
      needsVerification,
      addFlashMessage,
      currentPath
    )
  }, [options, isAuthenticated, isEmailVerified, needsVerification, addFlashMessage])

  return { checkAccess }
}