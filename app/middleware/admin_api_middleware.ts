import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import TokenStoreService from '#services/token_store_service'

/**
 * Middleware pour authentifier les requêtes API admin avec système de refresh automatique
 * 
 * Ce middleware vérifie le token d'accès dans l'en-tête Authorization.
 * Si le token est valide, la requête continue normalement.
 * Si le token est expiré, le middleware retourne une erreur 401 avec un indicateur
 * pour que le client sache qu'il doit rafraîchir le token.
 */
export default class AdminApiMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Extraire le token de l'en-tête Authorization
    // Format attendu: "Bearer votre_access_token"
    const authHeader = ctx.request.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.response.unauthorized({
        error: 'Non autorisé',
        message: "Token d'authentification manquant. Format attendu: 'Bearer <token>'",
        code: 'MISSING_TOKEN',
      })
    }

    // Extraire le token (enlever le préfixe "Bearer ")
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      return ctx.response.unauthorized({
        error: 'Non autorisé',
        message: "Token d'authentification vide.",
        code: 'EMPTY_TOKEN',
      })
    }

    // Vérifier si le token est valide (existe et n'est pas expiré)
    const isValid = TokenStoreService.isTokenValid(token)

    if (!isValid) {
      // Vérifier si le token existe mais est expiré
      const tokenInfo = TokenStoreService.getTokenInfo(token)

      if (tokenInfo) {
        // Token existe mais est expiré - indiquer au client qu'il doit rafraîchir
        return ctx.response.unauthorized({
          error: 'Token expiré',
          message: 'Votre token d\'accès a expiré. Utilisez votre refresh token pour obtenir un nouveau token.',
          code: 'TOKEN_EXPIRED',
          // Indiquer au client qu'il doit utiliser la route /auth/refresh
          shouldRefresh: true,
        })
      } else {
        // Token n'existe pas du tout - non autorisé
        return ctx.response.unauthorized({
          error: 'Token invalide',
          message: 'Le token fourni est invalide ou a été révoqué.',
          code: 'INVALID_TOKEN',
        })
      }
    }

    // Token valide - logger l'accès pour le monitoring (optionnel)
    const tokenInfo = TokenStoreService.getTokenInfo(token)
    if (tokenInfo) {
      ctx.logger.info('Admin API Access', {
        endpoint: ctx.request.url(),
        method: ctx.request.method(),
        deviceId: tokenInfo.deviceId || 'unknown',
        expiresAt: tokenInfo.expiresAt.toISO(),
      })
    }

    // Token valide - continuer avec la requête
    return next()
  }
}