import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import TokenStoreService from '#services/token_store_service'

export default class AuthController {
  /**
   * Authentification initiale via le token admin statique
   * 
   * Cette route vérifie le token statique défini dans .env et génère
   * une paire de tokens dynamiques (access + refresh) pour la session
   * 
   * POST /api/admin/auth/login
   * Body: { token: "votre_token_admin_statique" }
   */
  async login({ request, response }: HttpContext) {
    const { token } = request.only(['token'])

    // Vérifier que le token statique fourni correspond à celui dans .env
    if (!token || token !== env.get('ADMIN_API_TOKEN')) {
      return response.unauthorized({
        error: 'Token invalide',
        message: 'Le token fourni est incorrect.',
      })
    }

    // Récupérer les métadonnées de l'appareil pour le tracking
    const deviceId = request.header('X-Device-Id')
    const userAgent = request.header('User-Agent')

    // Générer une nouvelle paire de tokens (access + refresh)
    const tokenPair = TokenStoreService.generateTokenPair(deviceId, userAgent)

    return response.ok({
      success: true,
      message: 'Authentification réussie',
      data: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        expiresAt: tokenPair.expiresAt,
        expiresIn: tokenPair.expiresIn,
        tokenType: 'Bearer',
      },
    })
  }

  /**
   * Rafraîchir un token expiré
   * 
   * Cette route permet de renouveler un token d'accès expiré en utilisant
   * le refresh token. L'ancien token est révoqué et une nouvelle paire est générée.
   * 
   * POST /api/admin/auth/refresh
   * Body: { refreshToken: "votre_refresh_token" }
   */
  async refresh({ request, response }: HttpContext) {
    const { refreshToken } = request.only(['refreshToken'])

    if (!refreshToken) {
      return response.badRequest({
        error: 'Refresh token manquant',
        message: 'Le refresh token est requis pour renouveler l\'accès.',
      })
    }

    // Tenter de rafraîchir le token
    const newTokenPair = TokenStoreService.refreshToken(refreshToken)

    if (!newTokenPair) {
      return response.unauthorized({
        error: 'Refresh token invalide',
        message: 'Le refresh token est invalide ou a déjà été utilisé. Veuillez vous reconnecter.',
      })
    }

    return response.ok({
      success: true,
      message: 'Token rafraîchi avec succès',
      data: {
        accessToken: newTokenPair.accessToken,
        refreshToken: newTokenPair.refreshToken,
        expiresAt: newTokenPair.expiresAt,
        expiresIn: newTokenPair.expiresIn,
        tokenType: 'Bearer',
      },
    })
  }

  /**
   * Vérifier le statut d'authentification du token actuel
   * 
   * Cette route vérifie si le token fourni est encore valide.
   * Elle est protégée par le middleware adminApi.
   * 
   * GET /api/admin/auth/check
   * Header: Authorization: Bearer votre_access_token
   */
  async check({ request, response }: HttpContext) {
    // Le token a déjà été vérifié par le middleware
    const token = request.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return response.unauthorized({
        authenticated: false,
        message: 'Token manquant',
      })
    }

    // Récupérer les informations du token
    const tokenInfo = TokenStoreService.getTokenInfo(token)

    if (!tokenInfo) {
      return response.unauthorized({
        authenticated: false,
        message: 'Token invalide',
      })
    }

    return response.ok({
      authenticated: true,
      message: 'Token valide',
      data: {
        expiresAt: tokenInfo.expiresAt.toISO(),
        deviceId: tokenInfo.deviceId,
        createdAt: tokenInfo.createdAt.toISO(),
      },
    })
  }

  /**
   * Déconnexion (révocation du token)
   * 
   * Cette route révoque le token d'accès actuel, forçant l'utilisateur
   * à se reconnecter avec le token statique.
   * 
   * POST /api/admin/auth/logout
   * Header: Authorization: Bearer votre_access_token
   */
  async logout({ request, response }: HttpContext) {
    const token = request.header('Authorization')?.replace('Bearer ', '')

    if (token) {
      TokenStoreService.revokeToken(token)
    }

    return response.ok({
      success: true,
      message: 'Déconnexion réussie',
    })
  }

  /**
   * Obtenir des statistiques sur les tokens actifs
   * 
   * Cette route retourne des informations sur le nombre de sessions actives,
   * expirées, etc. Utile pour le monitoring.
   * 
   * GET /api/admin/auth/stats
   * Header: Authorization: Bearer votre_access_token
   */
  async stats({ response }: HttpContext) {
    const stats = TokenStoreService.getStats()

    return response.ok({
      success: true,
      data: stats,
    })
  }

  /**
   * Lister toutes les sessions actives
   * 
   * Cette route retourne la liste de toutes les sessions avec leurs métadonnées.
   * Utile pour voir quels appareils sont connectés.
   * 
   * GET /api/admin/auth/sessions
   * Header: Authorization: Bearer votre_access_token
   */
  async sessions({ response }: HttpContext) {
    const sessions = TokenStoreService.listActiveSessions()

    return response.ok({
      success: true,
      data: {
        count: sessions.length,
        sessions,
      },
    })
  }

  /**
   * Révoquer toutes les sessions (déconnexion globale)
   * 
   * Cette route révoque tous les tokens actifs. Utile en cas de compromission
   * ou pour forcer une reconnexion globale.
   * 
   * POST /api/admin/auth/revoke-all
   * Header: Authorization: Bearer votre_access_token
   */
  async revokeAll({ response }: HttpContext) {
    TokenStoreService.revokeAllTokens()

    return response.ok({
      success: true,
      message: 'Toutes les sessions ont été révoquées',
    })
  }
}