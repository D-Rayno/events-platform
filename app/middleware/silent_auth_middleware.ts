// app/middleware/silent_auth_middleware.ts - FIXED
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware - checks auth and shares user data with Inertia
 * This runs globally to make auth state available on all pages
 */
export default class SilentAuthMiddleware {
  async handle({ auth, inertia }: HttpContext, next: NextFn) {
    // Silently check if user is authenticated
    await auth.check()

    // Share auth state with all Inertia pages
    inertia.share({
      auth: {
        user: auth.user ? {
          id: auth.user.id,
          firstName: auth.user.firstName,
          lastName: auth.user.lastName,
          email: auth.user.email,
          age: auth.user.age,
          province: auth.user.province,
          commune: auth.user.commune,
          phoneNumber: auth.user.phoneNumber,
          avatarUrl: auth.user.avatarUrl,
          isEmailVerified: auth.user.isEmailVerified,
          isAdmin: auth.user.isAdmin,
        } : null,
      },
    })

    return next()
  }
}