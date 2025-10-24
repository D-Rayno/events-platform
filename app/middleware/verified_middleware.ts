import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware pour vérifier que l'utilisateur a vérifié son email
 */
export default class VerifiedMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user

    if (!user) {
      ctx.session.flash('error', 'Vous devez être connecté pour accéder à cette page.')
      return ctx.response.redirect('/auth/login')
    }

    if (!user.isEmailVerified) {
      ctx.session.flash(
        'error',
        'Veuillez vérifier votre email avant de continuer. Consultez votre boîte de réception.'
      )
      return ctx.response.redirect('/')
    }

    if (user.isBlocked) {
      ctx.session.flash('error', 'Votre compte a été bloqué.')
      await ctx.auth.use('web').logout()
      return ctx.response.redirect('/auth/login')
    }

    if (!user.isActive) {
      ctx.session.flash('error', "Votre compte n'est pas actif.")
      await ctx.auth.use('web').logout()
      return ctx.response.redirect('/auth/login')
    }

    return next()
  }
}
