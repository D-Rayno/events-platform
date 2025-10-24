import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

export default class AuthController {
  /**
   * Authentification via token admin
   * Pour la simplicité, nous utilisons un token fixe défini dans .env
   */
  async login({ request, response }: HttpContext) {
    const { token } = request.only(['token'])

    if (!token || token !== env.get('ADMIN_API_TOKEN')) {
      return response.unauthorized({
        error: 'Token invalide',
        message: 'Le token fourni est incorrect.',
      })
    }

    return response.ok({
      success: true,
      message: 'Authentification réussie',
      token: token, // Dans un vrai système, générer un JWT ici
    })
  }

  /**
   * Vérifier le statut d'authentification
   */
  async check({ response }: HttpContext) {
    return response.ok({
      authenticated: true,
      message: 'Token valide',
    })
  }
}
