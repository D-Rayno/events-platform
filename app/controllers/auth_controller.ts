import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login_'
import EmailService from '#services/email_service'
import { DateTime } from 'luxon'

export default class AuthController {
  /**
   * Affiche le formulaire d'inscription
   */
  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Traite l'inscription
   */
  async register({ request, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)

      const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        age: data.age,
        province: data.province,
        commune: data.commune,
        phoneNumber: data.phoneNumber || null,
        isEmailVerified: false,
        isActive: true,
        isBlocked: false,
      })

      // Envoyer l'email de vérification
      await EmailService.sendVerificationEmail(user)

      session.flash(
        'success',
        'Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.'
      )
      return response.redirect('/auth/login')
    } catch (error) {
      session.flash('error', "Une erreur est survenue lors de l'inscription.")
      return response.redirect().back()
    }
  }

  /**
   * Affiche le formulaire de connexion
   */
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  /**
   * Traite la connexion
   */
  async login({ request, response, auth, session }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await User.verifyCredentials(email, password)

      // Vérifier si l'utilisateur peut se connecter
      if (!user.canLogin()) {
        if (!user.isEmailVerified) {
          session.flash('error', 'Veuillez vérifier votre email avant de vous connecter.')
        } else if (user.isBlocked) {
          session.flash('error', 'Votre compte a été bloqué.')
        } else if (!user.isActive) {
          session.flash('error', "Votre compte n'est pas actif.")
        }
        return response.redirect().back()
      }

      await auth.use('web').login(user)
      session.flash('success', `Bienvenue ${user.firstName} !`)
      return response.redirect('/')
    } catch (error) {
      session.flash('error', 'Email ou mot de passe incorrect.')
      return response.redirect().back()
    }
  }

  /**
   * Déconnexion
   */
  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Vous avez été déconnecté avec succès.')
    return response.redirect('/auth/login')
  }

  /**
   * Vérifie l'email de l'utilisateur
   */
  async verifyEmail({ request, response, session }: HttpContext) {
    const token = request.input('token')

    if (!token) {
      session.flash('error', 'Token de vérification invalide.')
      return response.redirect('/auth/login')
    }

    const user = await User.query().where('email_verification_token', token).first()

    if (!user) {
      session.flash('error', 'Token de vérification invalide ou expiré.')
      return response.redirect('/auth/login')
    }

    user.isEmailVerified = true
    user.emailVerifiedAt = DateTime.now()
    user.emailVerificationToken = null
    await user.save()

    // Envoyer l'email de bienvenue
    await EmailService.sendWelcomeEmail(user)

    session.flash(
      'success',
      'Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.'
    )
    return response.redirect('/auth/login')
  }

  /**
   * Affiche le formulaire de mot de passe oublié
   */
  async showForgotPassword({ inertia }: HttpContext) {
    return inertia.render('auth/forgot_password')
  }

  /**
   * Envoie l'email de réinitialisation
   */
  async forgotPassword({ request, response, session }: HttpContext) {
    const email = request.input('email')

    const user = await User.findBy('email', email)

    if (user) {
      await EmailService.sendPasswordResetEmail(user)
    }

    // Message générique pour éviter de divulguer si l'email existe
    session.flash(
      'success',
      'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.'
    )
    return response.redirect('/auth/login')
  }

  /**
   * Affiche le formulaire de réinitialisation
   */
  async showResetPassword({ request, inertia, response, session }: HttpContext) {
    const token = request.input('token')

    if (!token) {
      session.flash('error', 'Token invalide.')
      return response.redirect('/auth/login')
    }

    return inertia.render('auth/reset_password', { token })
  }

  /**
   * Traite la réinitialisation du mot de passe
   */
  async resetPassword({ request, response, session }: HttpContext) {
    const token = request.input('token')
    const password = request.input('password')

    const user = await User.query()
      .where('password_reset_token', token)
      .where('password_reset_expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!user) {
      session.flash('error', 'Token invalide ou expiré.')
      return response.redirect('/auth/forgot-password')
    }

    user.password = password
    user.passwordResetToken = null
    user.passwordResetExpiresAt = null
    await user.save()

    session.flash('success', 'Votre mot de passe a été réinitialisé avec succès.')
    return response.redirect('/auth/login')
  }
}
