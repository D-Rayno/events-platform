// app/services/email_service.ts - FIXED
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import User from '#models/user'
import Registration from '#models/registration'
import Event from '#models/event'
import string from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'
import QRService from '#services/qr_code_service'

export default class EmailService {
  /**
   * Get app URL from environment
   */
  private static getAppUrl(): string {
    return env.get('APP_URL') || 'http://localhost:3333'
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
        .subject('Vérifiez votre adresse email')
        .htmlView('emails/verify_email', {
          firstName: user.firstName,
          verificationUrl,
          appUrl: this.getAppUrl(),
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
        .subject('Réinitialisation de votre mot de passe')
        .htmlView('emails/reset_password', {
          firstName: user.firstName,
          resetUrl,
          appUrl: this.getAppUrl(),
        })
    })
  }

  /**
   * Envoie l'email de confirmation d'inscription à un événement avec QR code
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
          firstName: user.firstName,
          eventName: event.name,
          eventLocation: event.location,
          eventDate: event.startDate.setLocale('fr').toFormat('dd MMMM yyyy à HH:mm'),
          price: registration.price,
          qrCode: registration.qrCode,
          appUrl: this.getAppUrl(),
        })
        .attachData(qrCodeBuffer, {
          filename: 'qr-code.png',
          contentType: 'image/png',
        })
    })
  }

  /**
   * Envoie l'email de bienvenue après vérification
   * FIXED: Pass all required variables
   */
  static async sendWelcomeEmail(user: User): Promise<void> {
    await mail.send((message) => {
      message.to(user.email).subject('Bienvenue sur G-Agency Events !').htmlView('emails/welcome', {
        firstName: user.firstName,
        appUrl: this.getAppUrl(),
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
          firstName: user.firstName,
          eventName: event.name,
          eventLocation: event.location,
          eventDate: event.startDate.setLocale('fr').toFormat('dd MMMM yyyy à HH:mm'),
          appUrl: this.getAppUrl(),
        })
    })
  }
}
