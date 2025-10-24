import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AdminAuthController = () => import('#controllers/api/admin/auth_controller')
const AdminEventController = () => import('#controllers/api/admin/event_controller')
const AdminRegistrationController = () => import('#controllers/api/admin/registrations_controller')
const AdminUserController = () => import('#controllers/api/admin/users_controller')

export default () => {
  /*
  |--------------------------------------------------------------------------
  | Routes API Admin (Mobile App)
  |--------------------------------------------------------------------------
  |
  | Ces routes sont utilisées par l'application mobile admin.
  | Elles implémentent un système de tokens avec refresh automatique.
  |
  */

  router
    .group(() => {
      // ========================================
      // Routes d'authentification (NON PROTÉGÉES)
      // ========================================
      
      /**
       * Connexion initiale avec le token statique
       * POST /api/admin/auth/login
       * Body: { token: "votre_token_statique_depuis_.env" }
       * Retourne: { accessToken, refreshToken, expiresAt, expiresIn }
       */
      router.post('/auth/login', [AdminAuthController, 'login'])

      /**
       * Rafraîchir un token expiré
       * POST /api/admin/auth/refresh
       * Body: { refreshToken: "votre_refresh_token" }
       * Retourne: { accessToken (nouveau), refreshToken (nouveau), expiresAt, expiresIn }
       */
      router.post('/auth/refresh', [AdminAuthController, 'refresh'])

      // ========================================
      // Routes protégées par le middleware adminApi
      // ========================================
      router
        .group(() => {
          // ---- Auth Management ----
          
          /**
           * Vérifier si le token actuel est valide
           * GET /api/admin/auth/check
           * Header: Authorization: Bearer <access_token>
           */
          router.get('/auth/check', [AdminAuthController, 'check'])

          /**
           * Déconnexion (révoque le token actuel)
           * POST /api/admin/auth/logout
           * Header: Authorization: Bearer <access_token>
           */
          router.post('/auth/logout', [AdminAuthController, 'logout'])

          /**
           * Statistiques des tokens (nombre de sessions actives, etc.)
           * GET /api/admin/auth/stats
           * Header: Authorization: Bearer <access_token>
           */
          router.get('/auth/stats', [AdminAuthController, 'stats'])

          /**
           * Liste de toutes les sessions actives
           * GET /api/admin/auth/sessions
           * Header: Authorization: Bearer <access_token>
           */
          router.get('/auth/sessions', [AdminAuthController, 'sessions'])

          /**
           * Révoquer toutes les sessions (déconnexion globale)
           * POST /api/admin/auth/revoke-all
           * Header: Authorization: Bearer <access_token>
           */
          router.post('/auth/revoke-all', [AdminAuthController, 'revokeAll'])

          // ---- Événements ----
          router.get('/events', [AdminEventController, 'index'])
          router.get('/events/stats', [AdminEventController, 'stats'])
          router.get('/events/:id', [AdminEventController, 'show'])
          router.post('/events', [AdminEventController, 'store'])
          router.put('/events/:id', [AdminEventController, 'update'])
          router.delete('/events/:id', [AdminEventController, 'destroy'])

          // ---- Inscriptions ----
          router.get('/registrations', [AdminRegistrationController, 'index'])
          router.get('/registrations/stats', [AdminRegistrationController, 'stats'])
          router.get('/registrations/:id', [AdminRegistrationController, 'show'])
          router.post('/registrations/verify', [AdminRegistrationController, 'verifyQRCode'])
          router.post('/registrations/confirm', [AdminRegistrationController, 'confirmAttendance'])
          router.delete('/registrations/:id', [AdminRegistrationController, 'cancel'])

          // ---- Utilisateurs ----
          router.get('/users', [AdminUserController, 'index'])
          router.get('/users/stats', [AdminUserController, 'stats'])
          router.get('/users/:id', [AdminUserController, 'show'])
          router.patch('/users/:id/toggle-block', [AdminUserController, 'toggleBlock'])
          router.patch('/users/:id/toggle-active', [AdminUserController, 'toggleActive'])
          router.delete('/users/:id', [AdminUserController, 'destroy'])
        })
        .middleware(middleware.adminApi())
    })
    .prefix('/api/admin')
}