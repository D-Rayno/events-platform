// app/middleware/auth_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware enforces authentication
 * Redirects unauthenticated users to login
 */
export default class AuthMiddleware {
  redirectTo = '/auth/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    // Store the intended URL for post-login redirect
    if (!ctx.auth.user) {
      const intendedUrl = ctx.request.url(true)
      // Don't store auth URLs
      if (!intendedUrl.startsWith('/auth/')) {
        ctx.session.put('intended_url', intendedUrl)
      }
    }

    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    
    return next()
  }
}
