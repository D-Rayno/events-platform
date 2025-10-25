// start/routes/web.ts - MERGED FIXED VERSION
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const ProfileController = () => import('#controllers/profiles_controller')
const EventsController = () => import('#controllers/events_controller')
const RegistrationsController = () => import('#controllers/registrations_controller')

export default () => {
  /*
  |--------------------------------------------------------------------------
  | Public Routes
  |--------------------------------------------------------------------------
  */

  // Home page - only for non-authenticated users
  router
    .get('/', async ({ inertia, auth, response }) => {
      if (auth.user) {
        // Redirect authenticated users to events
        return response.redirect('/events')
      }
      return inertia.render('home')
    })
    .as('home')

  // Events (publicly accessible)
  router.get('/events', [EventsController, 'index']).as('events.index')
  router.get('/events/:id', [EventsController, 'show']).as('events.show')

  /*
  |--------------------------------------------------------------------------
  | Auth Routes (Guest Only)
  |--------------------------------------------------------------------------
  | Accessible to non-authenticated users only.
  | Once logged in, users will be redirected away from these.
  */
  router
    .group(() => {
      // Registration
      router.get('/register', [AuthController, 'showRegister']).as('register.show')
      router.post('/register', [AuthController, 'register']).as('register')

      // Login
      router.get('/login', [AuthController, 'showLogin']).as('login.show')
      router.post('/login', [AuthController, 'login']).as('login')

      // Forgot Password
      router
        .get('/forgot-password', [AuthController, 'showForgotPassword'])
        .as('forgot_password.show')
      router.post('/forgot-password', [AuthController, 'forgotPassword']).as('forgot_password')

      // Reset Password
      router.get('/reset-password', [AuthController, 'showResetPassword']).as('reset_password.show')
      router.post('/reset-password', [AuthController, 'resetPassword']).as('reset_password')
    })
    .prefix('/auth')
    .middleware(middleware.guest())

  /*
  |--------------------------------------------------------------------------
  | Email Verification (Public)
  |--------------------------------------------------------------------------
  | Email verification link can be opened even by unauthenticated users.
  */
  router.get('/auth/verify-email', [AuthController, 'verifyEmail']).as('verify_email')

  /*
  |--------------------------------------------------------------------------
  | Authenticated Routes
  |--------------------------------------------------------------------------
  | Only accessible for logged-in users.
  */
  router
    .group(() => {
      // Logout
      router.post('/auth/logout', [AuthController, 'logout']).as('logout')

      // Resend verification email
      router
        .post('/auth/resend-verification', [AuthController, 'resendVerificationEmail'])
        .as('resend_verification')

      // Profile
      router.get('/profile', [ProfileController, 'show']).as('profile.show')
      router.post('/profile', [ProfileController, 'update']).as('profile.update')
      router
        .delete('/profile/avatar', [ProfileController, 'deleteAvatar'])
        .as('profile.delete_avatar')

      // Registrations
      router.get('/registrations', [RegistrationsController, 'index']).as('registrations.index')
      router.get('/registrations/:id', [RegistrationsController, 'show']).as('registrations.show')
      router
        .post('/registrations/:id/resend-qr', [RegistrationsController, 'resendQRCode'])
        .as('registrations.resend_qr')
      router
        .delete('/registrations/:id', [RegistrationsController, 'destroy'])
        .as('registrations.destroy')

      // Event registration
      router
        .post('/events/:eventId/register', [RegistrationsController, 'store'])
        .as('events.register')
    })
    .middleware(middleware.auth())

  /*
  |--------------------------------------------------------------------------
  | Error Routes
  |--------------------------------------------------------------------------
  */
  router
    .get('/404', async ({ inertia }) => {
      return inertia.render('errors/not_found')
    })
    .as('errors.not_found')

  router
    .get('/500', async ({ inertia }) => {
      return inertia.render('errors/server_error')
    })
    .as('errors.server_error')

  /*
  |--------------------------------------------------------------------------
  | Catch-All 404
  |--------------------------------------------------------------------------
  */
  router.any('*', async ({ response }) => {
    return response.redirect('/404')
  })
}
