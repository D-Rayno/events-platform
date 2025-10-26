// app/services/email_service.ts - COMPLETE FIX WITH THEME SUPPORT
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import User from '#models/user'
import Registration from '#models/registration'
import Event from '#models/event'
import string from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'
import QRService from '#services/qr_code_service'
import EmailThemeService from '#services/email_theme_service'
import themeConfig from "../../config/theme.js"

export default class EmailService {
  /**
   * Get app URL from environment
   */
  private static getAppUrl(): string {
    return env.get('APP_URL') || 'http://localhost:3333'
  }

  /**
   * Get common email variables with theme support
   */
  private static getCommonEmailVars() {
    const theme = EmailThemeService.getTheme()
    return {
      theme,
      emailStyles: EmailThemeService.getEmailStyles(),
      appUrl: this.getAppUrl(),
      appName: themeConfig.app.name,
      appTagline: themeConfig.app.tagline,
      contactEmail: themeConfig.contact.email,
    }
  }

  /**
   * Envoie l'email de vérification
   */
  static async sendVerificationEmail(user: User): Promise<void> {
    const token = string.generateRandom(64)

    user.emailVerificationToken = token
    await user.save()

    const verificationUrl = `${this.getAppUrl()}/auth/verify-email?token=${token}`

    await mail.send((message) => {
      message
        .to(user.email)
        .subject(`Vérifiez votre adresse email - ${themeConfig.app.name}`)
        .htmlView('emails/verify_email', {
          ...this.getCommonEmailVars(),
          firstName: user.firstName,
          verificationUrl,
        })
    })
  }

  /**
   * Envoie l'email de réinitialisation de mot de passe
   */
  static async sendPasswordResetEmail(user: User): Promise<void> {
    const token = string.generateRandom(64)

    user.passwordResetToken = token
    user.passwordResetExpiresAt = DateTime.now().plus({ hours: 1 })
    await user.save()

    const resetUrl = `${this.getAppUrl()}/auth/reset-password?token=${token}`

    await mail.send((message) => {
      message
        .to(user.email)
        .subject(`Réinitialisation de votre mot de passe - ${themeConfig.app.name}`)
        .htmlView('emails/reset_password', {
          ...this.getCommonEmailVars(),
          firstName: user.firstName,
          resetUrl,
        })
    })
  }

  /**
   * Envoie l'email de confirmation d'inscription à un événement avec QR code
   * FIXED: Pass DateTime object and theme variables
   */
  static async sendEventRegistrationEmail(
    user: User,
    event: Event,
    registration: Registration
  ): Promise<void> {
    const qrCodeBuffer = await QRService.generateQRCodeBuffer(registration)

    await mail.send((message) => {
      message
        .to(user.email)
        .subject(`Confirmation d'inscription - ${event.name}`)
        .htmlView('emails/event_registration', {
          ...this.getCommonEmailVars(),
          firstName: user.firstName,
          eventName: event.name,
          eventLocation: event.location,
          eventDate: event.startDate, // Pass DateTime object
          price: registration.price,
          qrCode: registration.qrCode,
        })
        .attachData(qrCodeBuffer, {
          filename: `qrcode-${registration.qrCode}.png`,
          contentType: 'image/png',
        })
    })
  }

  /**
   * Envoie l'email de bienvenue après vérification
   */
  static async sendWelcomeEmail(user: User): Promise<void> {
    await mail.send((message) => {
      message
        .to(user.email)
        .subject(`Bienvenue sur ${themeConfig.app.name} !`)
        .htmlView('emails/welcome', {
          ...this.getCommonEmailVars(),
          firstName: user.firstName,
        })
    })
  }

  /**
   * Envoie un rappel pour un événement à venir
   */
  static async sendEventReminderEmail(user: User, event: Event): Promise<void> {
    await mail.send((message) => {
      message
        .to(user.email)
        .subject(`Rappel - ${event.name} commence bientôt !`)
        .htmlView('emails/event_reminder', {
          ...this.getCommonEmailVars(),
          firstName: user.firstName,
          eventName: event.name,
          eventLocation: event.location,
          eventDate: event.startDate, // Pass DateTime object
        })
    })
  }
}