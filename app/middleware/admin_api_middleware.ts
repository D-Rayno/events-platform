import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'

/**
 * Middleware pour authentifier les requêtes API admin
 * Utilise un token fixe défini dans .env
 */
export default class AdminApiMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const token = ctx.request.header('Authorization')?.replace('Bearer ', '')

    if (!token || token !== env.get('ADMIN_API_TOKEN')) {
      return ctx.response.unauthorized({
        error: 'Non autorisé',
        message: 'Token d\'authentification invalide ou manquant.',
      })
    }

    return next()
  }
}