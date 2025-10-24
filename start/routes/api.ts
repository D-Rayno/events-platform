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
*/

  router
    .group(() => {
      // Authentification
      router.post('/auth/login', [AdminAuthController, 'login'])

      // Routes protégées par le middleware admin
      router
        .group(() => {
          // Vérification du token
          router.get('/auth/check', [AdminAuthController, 'check'])

          // Événements
          router.get('/events', [AdminEventController, 'index'])
          router.get('/events/stats', [AdminEventController, 'stats'])
          router.get('/events/:id', [AdminEventController, 'show'])
          router.post('/events', [AdminEventController, 'store'])
          router.put('/events/:id', [AdminEventController, 'update'])
          router.delete('/events/:id', [AdminEventController, 'destroy'])

          // Inscriptions
          router.get('/registrations', [AdminRegistrationController, 'index'])
          router.get('/registrations/stats', [AdminRegistrationController, 'stats'])
          router.get('/registrations/:id', [AdminRegistrationController, 'show'])
          router.post('/registrations/verify', [AdminRegistrationController, 'verifyQRCode'])
          router.post('/registrations/confirm', [AdminRegistrationController, 'confirmAttendance'])
          router.delete('/registrations/:id', [AdminRegistrationController, 'cancel'])

          // Utilisateurs
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
