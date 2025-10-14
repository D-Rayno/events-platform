import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { loginValidator } from '#validators/login'
import { forgotPasswordValidator } from '#validators/forgot_password'
import { resetPasswordValidator } from '#validators/reset_password'
import EmailService from '#services/email_service'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

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
    const trx = await db.transaction()
    
    try {
      const data = await request.validateUsing(registerValidator)

      // Create user within transaction
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
        isAdmin: false, // Explicitly set isAdmin
      }, { client: trx })

      // Commit the transaction before sending email
      await trx.commit()

      // Log for debugging
      console.log('User created successfully:', {
        id: user.id,
        email: user.email,
        firstName: user.firstName
      })

      // Send verification email (outside transaction)
      try {
        await EmailService.sendVerificationEmail(user)
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError)
        // Don't fail registration if email fails
      }

      session.flash(
        'success',
        'Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.'
      )
      return response.redirect('/auth/login')
    } catch (error) {
      await trx.rollback()
      console.error('Erreur lors de l\'inscription:', error)
      
      // Provide more detailed error message
      if (error.code === 'ER_DUP_ENTRY' || error.message?.includes('unique')) {
        session.flash('error', 'Cet email est déjà utilisé.')
      } else {
        session.flash('error', "Une erreur est survenue lors de l'inscription.")
      }
      
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
      // Validation des données
      const { email, password } = await request.validateUsing(loginValidator)

      // Vérification des credentials
      const user = await User.verifyCredentials(email, password)

      // Vérifier si l'utilisateur peut se connecter
      if (!user.canLogin()) {
        if (!user.isEmailVerified) {
          session.flash(
            'error',
            'Veuillez vérifier votre email avant de vous connecter. Consultez votre boîte de réception.'
          )
        } else if (user.isBlocked) {
          session.flash('error', 'Votre compte a été bloqué. Contactez un administrateur.')
        } else if (!user.isActive) {
          session.flash('error', "Votre compte n'est pas actif.")
        }
        return response.redirect().back()
      }

      // Connexion réussie
      await auth.use('web').login(user)
      session.flash('success', `Bienvenue ${user.firstName} !`)
      return response.redirect('/')
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
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

    // Vérifier si l'email n'est pas déjà vérifié
    if (user.isEmailVerified) {
      session.flash('info', 'Votre email est déjà vérifié.')
      return response.redirect('/auth/login')
    }

    user.isEmailVerified = true
    user.emailVerifiedAt = DateTime.now()
    user.emailVerificationToken = null
    await user.save()

    // Envoyer l'email de bienvenue
    try {
      await EmailService.sendWelcomeEmail(user)
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de bienvenue:", error)
    }

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
    try {
      const { email } = await request.validateUsing(forgotPasswordValidator)

      const user = await User.findBy('email', email)

      if (user) {
        await EmailService.sendPasswordResetEmail(user)
      }

      // Message générique pour éviter de divulguer si l'email existe
      session.flash(
        'success',
        'Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques instants.'
      )
      return response.redirect('/auth/login')
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de réinitialisation:", error)
      session.flash('error', "Une erreur est survenue. Veuillez réessayer.")
      return response.redirect().back()
    }
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
    try {
      const { token, password } = await request.validateUsing(resetPasswordValidator)

      const user = await User.query()
        .where('password_reset_token', token)
        .where('password_reset_expires_at', '>', DateTime.now().toSQL())
        .first()

      if (!user) {
        session.flash('error', 'Token invalide ou expiré. Veuillez refaire une demande.')
        return response.redirect('/auth/forgot-password')
      }

      user.password = password
      user.passwordResetToken = null
      user.passwordResetExpiresAt = null
      await user.save()

      session.flash('success', 'Votre mot de passe a été réinitialisé avec succès.')
      return response.redirect('/auth/login')
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error)
      session.flash('error', "Une erreur est survenue. Veuillez réessayer.")
      return response.redirect().back()
    }
  }

  /**
   * Renvoie l'email de vérification
   */
  async resendVerificationEmail({ auth, response, session }: HttpContext) {
    const user = auth.user

    if (!user) {
      session.flash('error', 'Vous devez être connecté.')
      return response.redirect('/auth/login')
    }

    if (user.isEmailVerified) {
      session.flash('info', 'Votre email est déjà vérifié.')
      return response.redirect('/')
    }

    try {
      await EmailService.sendVerificationEmail(user)
      session.flash('success', 'Un nouvel email de vérification a été envoyé.')
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error)
      session.flash('error', "Erreur lors de l'envoi de l'email.")
    }

    return response.redirect().back()
  }
}