import QRCode from 'qrcode'
import string from '@adonisjs/core/helpers/string'
import Registration from '#models/registration'

export default class QRService {
  /**
   * Génère un code QR unique pour une inscription
   */
  static async generateQRCode(registration: Registration): Promise<string> {
    // Génère un code unique si pas déjà présent
    if (!registration.qrCode) {
      registration.qrCode = string.generateRandom(32)
      await registration.save()
    }

    // Créer les données du QR code
    const qrData = JSON.stringify({
      registrationId: registration.id,
      userId: registration.userId,
      eventId: registration.eventId,
      code: registration.qrCode,
      timestamp: Date.now(),
    })

    // Générer le QR code en base64
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2,
    })

    return qrCodeDataUrl
  }

  /**
   * Génère un QR code en tant que buffer
   */
  static async generateQRCodeBuffer(registration: Registration): Promise<Buffer> {
    if (!registration.qrCode) {
      registration.qrCode = string.generateRandom(32)
      await registration.save()
    }

    const qrData = JSON.stringify({
      registrationId: registration.id,
      userId: registration.userId,
      eventId: registration.eventId,
      code: registration.qrCode,
      timestamp: Date.now(),
    })

    return await QRCode.toBuffer(qrData, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 400,
      margin: 2,
    })
  }

  /**
   * Vérifie si un code QR est valide
   */
  static async verifyQRCode(qrCode: string): Promise<Registration | null> {
    const registration = await Registration.query()
      .where('qr_code', qrCode)
      .preload('user')
      .preload('event')
      .first()

    if (!registration) {
      return null
    }

    // Vérifier que l'inscription est active
    if (!registration.isActive) {
      return null
    }

    return registration
  }

  /**
   * Marque une inscription comme "présent" via QR code
   */
  static async markAsAttended(qrCode: string): Promise<Registration | null> {
    const registration = await QRService.verifyQRCode(qrCode)

    if (!registration) {
      return null
    }

    // Vérifier que l'événement est en cours ou terminé
    if (registration.event.isUpcoming()) {
      return null
    }

    // Marquer comme présent
    registration.status = 'attended'
    registration.attendedAt = DateTime.now()
    await registration.save()

    return registration
  }
}

import { DateTime } from 'luxon'