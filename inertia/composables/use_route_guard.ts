// inertia/composables/use_route_guard.ts
import { onMounted } from 'vue'
import { useAuthMiddleware } from './use_auth_middleware'

/**
 * Route guard composable
 * Use in components to protect routes
 */
export function useRouteGuard(
  options: {
    requiresAuth?: boolean
    requiresVerification?: boolean
    requiresGuest?: boolean
  } = {}
) {
  const { canAccessRoute, setIntendedUrl } = useAuthMiddleware()

  onMounted(() => {
    const canAccess = canAccessRoute(
      options.requiresAuth,
      options.requiresVerification,
      options.requiresGuest
    )

    // Store intended URL if access denied due to auth
    if (!canAccess && options.requiresAuth) {
      setIntendedUrl(window.location.pathname)
    }
  })
}

