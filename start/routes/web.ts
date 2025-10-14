import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const ProfileController = () => import('#controllers/profiles_controller')
const EventsController = () => import('#controllers/events_controller')
const RegistrationsController = () => import('#controllers/registrations_controller')

export default () => {
  /*
|--------------------------------------------------------------------------
| Routes authentifiées
|--------------------------------------------------------------------------
*/
  router
    .group(() => {
      // Déconnexion
      router.post('/auth/logout', [AuthController, 'logout']).as('auth.logout')

      // Renvoyer email de vérification
      router
        .post('/auth/resend-verification', [AuthController, 'resendVerificationEmail'])
        .as('auth.resend_verification')

      // Profil utilisateur
      router.get('/profile', [ProfileController, 'show']).as('profile.show')
      router.post('/profile', [ProfileController, 'update']).as('profile.update')
      router
        .delete('/profile/avatar', [ProfileController, 'deleteAvatar'])
        .as('profile.delete_avatar')

      // Inscriptions aux événements
      router.get('/registrations', [RegistrationsController, 'index']).as('registrations.index')
      router.get('/registrations/:id', [RegistrationsController, 'show']).as('registrations.show')
      router
        .post('/events/:eventId/register', [RegistrationsController, 'store'])
        .as('registrations.store')
      router
        .delete('/registrations/:id', [RegistrationsController, 'destroy'])
        .as('registrations.destroy')
    })
    .middleware(middleware.auth())

  /*
|--------------------------------------------------------------------------
| Routes événements (accessibles à tous)
|--------------------------------------------------------------------------
*/
  router.get('/events', [EventsController, 'index']).as('events.index')
  router.get('/events/:id', [EventsController, 'show']).as('events.show')

  /*
|--------------------------------------------------------------------------
| Page d'accueil
|--------------------------------------------------------------------------
*/
  router.on('/').renderInertia('home')

  /*
|--------------------------------------------------------------------------
| Routes d'authentification (accessibles uniquement aux invités)
|--------------------------------------------------------------------------
*/
  router
    .group(() => {
      // Inscription
      router.get('/register', [AuthController, 'showRegister']).as('auth.register.show')
      router.post('/register', [AuthController, 'register']).as('auth.register')

      // Connexion
      router.get('/login', [AuthController, 'showLogin']).as('auth.login.show')
      router.post('/login', [AuthController, 'login']).as('auth.login')

      // Mot de passe oublié
      router
        .get('/forgot-password', [AuthController, 'showForgotPassword'])
        .as('auth.forgot_password.show')
      router.post('/forgot-password', [AuthController, 'forgotPassword']).as('auth.forgot_password')

      // Réinitialisation mot de passe
      router
        .get('/reset-password', [AuthController, 'showResetPassword'])
        .as('auth.reset_password.show')
      router.post('/reset-password', [AuthController, 'resetPassword']).as('auth.reset_password')
    })
    .prefix('/auth')
    .middleware(middleware.guest())

  /*
|--------------------------------------------------------------------------
| Vérification email (accessible à tous)
|--------------------------------------------------------------------------
*/
  router.get('/auth/verify-email', [AuthController, 'verifyEmail']).as('auth.verify_email')
}
