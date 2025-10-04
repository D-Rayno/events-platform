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
<<<<<<< HEAD
        message: "Token d'authentification invalide ou manquant.",
=======
        message: 'Token d\'authentification invalide ou manquant.',
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
      })
    }

    return next()
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 47214e9 (feat: admin api's & user profile management, events and registration for both web and api)
