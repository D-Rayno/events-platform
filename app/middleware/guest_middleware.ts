// app/middleware/guest_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Guest middleware prevents authenticated users from accessing auth pages
 * Redirects authenticated users to /events
 */
export default class GuestMiddleware {
  redirectTo = '/events' // Changed from '/' to '/events'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    for (let guard of options.guards || [ctx.auth.defaultGuard]) {
      if (await ctx.auth.use(guard).check()) {
        return ctx.response.redirect(this.redirectTo, true)
      }
    }

    return next()
  }
}