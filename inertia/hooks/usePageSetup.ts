// inertia/hooks/usePageSetup.ts
import { useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { useAuthStore } from '~/stores/auth'
import { useAppStore } from '~/stores/app'

/**
 * Page setup hook for React
 * Initializes auth and flash messages from page props
 */
export function usePageSetup() {
  const { props } = usePage()
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const setFlashMessages = useAppStore((state) => state.setFlashMessages)

  useEffect(() => {
    // Initialize auth from page props
    if (props.auth?.user) {
      initializeAuth(props.auth.user)
    }

    // Initialize flash messages from page props
    if (props.flash) {
      setFlashMessages(props.flash)
    }
  }, [props.auth?.user, props.flash, initializeAuth, setFlashMessages])

  return {
    auth: props.auth,
    flash: props.flash,
  }
}
