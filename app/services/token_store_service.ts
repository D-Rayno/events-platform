import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'


/**
 * Interface pour stocker les informations du token
 */
interface TokenInfo {
  token: string
  refreshToken: string
  createdAt: DateTime
  expiresAt: DateTime
  deviceId?: string
  userAgent?: string
}

/**
 * Service pour gérer les tokens admin avec système de refresh
 *
 * IMPORTANT: En production, utilisez Redis ou une base de données
 * pour persister les tokens entre les redémarrages du serveur
 */
export default class TokenStoreService {
  /**
   * Store en mémoire pour les tokens actifs
   * Clé: token principal, Valeur: informations du token
   */
  private static activeTokens = new Map<string, TokenInfo>()

  /**
   * Index inversé pour rechercher un token par son refresh token
   * Clé: refresh token, Valeur: token principal
   */
  private static refreshTokenIndex = new Map<string, string>()

  /**
   * Durée de validité d'un token en minutes (défaut: 30 minutes)
   */
  private static readonly TOKEN_LIFETIME_MINUTES = 30

  /**
   * Génère une nouvelle paire de tokens (access token + refresh token)
   *
   * @param deviceId - Identifiant optionnel de l'appareil
   * @param userAgent - User agent optionnel du navigateur/app
   * @returns Object contenant le token, refresh token et date d'expiration
   */
  static generateTokenPair(deviceId?: string, userAgent?: string) {
    // Générer un token d'accès aléatoire (32 bytes = 64 caractères hex)
    const accessToken = randomBytes(32).toString('hex')

    // Générer un refresh token aléatoire (plus long pour plus de sécurité)
    const refreshToken = randomBytes(48).toString('hex')

    const now = DateTime.now()
    const expiresAt = now.plus({ minutes: this.TOKEN_LIFETIME_MINUTES })

    // Stocker les informations du token
    const tokenInfo: TokenInfo = {
      token: accessToken,
      refreshToken,
      createdAt: now,
      expiresAt,
      deviceId,
      userAgent,
    }

    // Sauvegarder dans les deux maps pour permettre la recherche bidirectionnelle
    this.activeTokens.set(accessToken, tokenInfo)
    this.refreshTokenIndex.set(refreshToken, accessToken)

    console.log(`[TokenStore] Nouveau token généré, expire à ${expiresAt.toISO()}`)

    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAt.toISO(),
      expiresIn: this.TOKEN_LIFETIME_MINUTES * 60, // en secondes
    }
  }

  /**
   * Vérifie si un token est valide (existe et n'est pas expiré)
   *
   * @param token - Le token d'accès à vérifier
   * @returns true si le token est valide, false sinon
   */
  static isTokenValid(token: string): boolean {
    const tokenInfo = this.activeTokens.get(token)

    // Token n'existe pas
    if (!tokenInfo) {
      return false
    }

    // Token expiré
    if (DateTime.now() > tokenInfo.expiresAt) {
      console.log(`[TokenStore] Token expiré détecté: ${token.substring(0, 8)}...`)
      return false
    }

    return true
  }

  /**
   * Obtient les informations d'un token
   *
   * @param token - Le token d'accès
   * @returns Les informations du token ou null si inexistant
   */
  static getTokenInfo(token: string): TokenInfo | null {
    return this.activeTokens.get(token) || null
  }

  /**
   * Rafraîchit un token expiré en utilisant le refresh token
   * Cette méthode révoque l'ancien token et génère une nouvelle paire
   *
   * @param refreshToken - Le refresh token reçu du client
   * @returns Une nouvelle paire de tokens ou null si le refresh token est invalide
   */
  static refreshToken(refreshToken: string) {
    // Trouver le token principal associé à ce refresh token
    const oldAccessToken = this.refreshTokenIndex.get(refreshToken)

    if (!oldAccessToken) {
      console.log(`[TokenStore] Refresh token invalide ou déjà utilisé`)
      return null
    }

    // Récupérer les infos de l'ancien token
    const oldTokenInfo = this.activeTokens.get(oldAccessToken)

    if (!oldTokenInfo) {
      console.log(`[TokenStore] Token principal introuvable`)
      return null
    }

    // Révoquer l'ancien token et son refresh token
    this.revokeToken(oldAccessToken)

    console.log(`[TokenStore] Token rafraîchi avec succès`)

    // Générer une nouvelle paire de tokens en conservant les métadonnées
    return this.generateTokenPair(oldTokenInfo.deviceId, oldTokenInfo.userAgent)
  }

  /**
   * Révoque un token (le supprime du store)
   *
   * @param token - Le token d'accès à révoquer
   */
  static revokeToken(token: string): void {
    const tokenInfo = this.activeTokens.get(token)

    if (tokenInfo) {
      // Supprimer le refresh token de l'index
      this.refreshTokenIndex.delete(tokenInfo.refreshToken)

      // Supprimer le token principal
      this.activeTokens.delete(token)

      console.log(`[TokenStore] Token révoqué: ${token.substring(0, 8)}...`)
    }
  }

  /**
   * Révoque tous les tokens (utile pour une déconnexion globale)
   */
  static revokeAllTokens(): void {
    const count = this.activeTokens.size
    this.activeTokens.clear()
    this.refreshTokenIndex.clear()
    console.log(`[TokenStore] ${count} token(s) révoqué(s)`)
  }

  /**
   * Nettoie les tokens expirés (à appeler périodiquement)
   * En production, utilisez un cron job ou un worker pour cela
   */
  static cleanupExpiredTokens(): void {
    const now = DateTime.now()
    let cleanedCount = 0

    for (const [token, info] of this.activeTokens.entries()) {
      if (now > info.expiresAt) {
        this.revokeToken(token)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      console.log(`[TokenStore] ${cleanedCount} token(s) expiré(s) nettoyé(s)`)
    }
  }

  /**
   * Obtient des statistiques sur les tokens actifs
   */
  static getStats() {
    const now = DateTime.now()
    let activeCount = 0
    let expiredCount = 0

    for (const info of this.activeTokens.values()) {
      if (now <= info.expiresAt) {
        activeCount++
      } else {
        expiredCount++
      }
    }

    return {
      total: this.activeTokens.size,
      active: activeCount,
      expired: expiredCount,
      tokenLifetimeMinutes: this.TOKEN_LIFETIME_MINUTES,
    }
  }

  /**
   * Liste tous les tokens actifs avec leurs métadonnées
   * Utile pour le debugging ou l'administration
   */
  static listActiveSessions() {
    const sessions = []
    const now = DateTime.now()

    for (const [token, info] of this.activeTokens.entries()) {
      const isExpired = now > info.expiresAt
      sessions.push({
        tokenPreview: `${token.substring(0, 8)}...`,
        deviceId: info.deviceId || 'unknown',
        userAgent: info.userAgent || 'unknown',
        createdAt: info.createdAt.toISO(),
        expiresAt: info.expiresAt.toISO(),
        isExpired,
        timeRemaining: isExpired ? 0 : info.expiresAt.diff(now, 'minutes').minutes,
      })
    }

    return sessions
  }
}

/**
 * Nettoyer les tokens expirés toutes les 10 minutes
 * En production, utilisez un système de tâches planifiées (cron)
 */
setInterval(
  () => {
    TokenStoreService.cleanupExpiredTokens()
  },
  10 * 60 * 1000
) // 10 minutes
