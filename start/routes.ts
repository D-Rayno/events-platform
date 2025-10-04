import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')

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

    // Profil utilisateur (à implémenter dans le prochain module)
    // router.get('/profile', [ProfileController, 'show']).as('profile.show')
    // router.put('/profile', [ProfileController, 'update']).as('profile.update')
  })
  .middleware(middleware.auth())
