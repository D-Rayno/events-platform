import type { HttpContext } from '@adonisjs/core/http'
import Registration from '#models/registration'
import QRService from '#services/qr_code_service'
import { DateTime } from 'luxon'

export default class RegistrationController {
  /**
   * Liste toutes les inscriptions avec filtres
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const status = request.input('status')
    const eventId = request.input('event_id')
    const search = request.input('search')

    let query = Registration.query().preload('user').preload('event').orderBy('created_at', 'desc')

    // Filtrer par statut
    if (status) {
      query = query.where('status', status)
    }

    // Filtrer par événement
    if (eventId) {
      query = query.where('event_id', eventId)
    }

    // Recherche par nom d'utilisateur ou email
    if (search) {
      query = query.whereHas('user', (userQuery) => {
        userQuery
          .whereLike('first_name', `%${search}%`)
          .orWhereLike('last_name', `%${search}%`)
          .orWhereLike('email', `%${search}%`)
      })
    }

    const registrations = await query.paginate(page, limit)

    return response.ok({
      success: true,
      data: registrations.all().map((reg) => ({
        id: reg.id,
        status: reg.status,
        qrCode: reg.qrCode,
        attendedAt: reg.attendedAt?.toISO(),
        createdAt: reg.createdAt.toISO(),
        user: {
          id: reg.user.id,
          firstName: reg.user.firstName,
          lastName: reg.user.lastName,
          email: reg.user.email,
          phoneNumber: reg.user.phoneNumber,
        },
        event: {
          id: reg.event.id,
          name: reg.event.name,
          location: reg.event.location,
          startDate: reg.event.startDate.toISO(),
          endDate: reg.event.endDate.toISO(),
        },
      })),
      meta: registrations.getMeta(),
    })
  }

  /**
   * Affiche les détails d'une inscription
   */
  async show({ params, response }: HttpContext) {
    const registration = await Registration.query()
      .where('id', params.id)
      .preload('user')
      .preload('event')
      .first()

    if (!registration) {
      return response.notFound({
        error: 'Inscription non trouvée',
        message: "Cette inscription n'existe pas.",
      })
    }

    return response.ok({
      success: true,
      data: {
        id: registration.id,
        status: registration.status,
        qrCode: registration.qrCode,
        attendedAt: registration.attendedAt?.toISO(),
        createdAt: registration.createdAt.toISO(),
        user: {
          id: registration.user.id,
          firstName: registration.user.firstName,
          lastName: registration.user.lastName,
          email: registration.user.email,
          phoneNumber: registration.user.phoneNumber,
          province: registration.user.province,
          commune: registration.user.commune,
        },
        event: {
          id: registration.event.id,
          name: registration.event.name,
          description: registration.event.description,
          location: registration.event.location,
          startDate: registration.event.startDate.toISO(),
          endDate: registration.event.endDate.toISO(),
          capacity: registration.event.capacity,
          availableSeats: registration.event.availableSeats,
        },
      },
    })
  }

  /**
   * Vérifie un QR code et retourne les informations
   */
  async verifyQRCode({ request, response }: HttpContext) {
    const { qrCode } = request.only(['qrCode'])

    if (!qrCode) {
      return response.badRequest({
        error: 'QR code manquant',
        message: 'Le code QR est requis.',
      })
    }

    const registration = await QRService.verifyQRCode(qrCode)

    if (!registration) {
      return response.notFound({
        error: 'QR code invalide',
        message: 'Ce code QR est invalide ou expiré.',
        valid: false,
      })
    }

    return response.ok({
      success: true,
      valid: true,
      data: {
        registration: {
          id: registration.id,
          status: registration.status,
          attendedAt: registration.attendedAt?.toISO(),
        },
        user: {
          id: registration.user.id,
          firstName: registration.user.firstName,
          lastName: registration.user.lastName,
          email: registration.user.email,
        },
        event: {
          id: registration.event.id,
          name: registration.event.name,
          location: registration.event.location,
          startDate: registration.event.startDate.toISO(),
          endDate: registration.event.endDate.toISO(),
        },
      },
    })
  }

  /**
   * Confirme la présence via QR code (scan)
   */
  async confirmAttendance({ request, response }: HttpContext) {
    const { qrCode } = request.only(['qrCode'])

    if (!qrCode) {
      return response.badRequest({
        error: 'QR code manquant',
        message: 'Le code QR est requis.',
      })
    }

    const registration = await QRService.markAsAttended(qrCode)

    if (!registration) {
      return response.badRequest({
        error: 'Confirmation impossible',
        message:
          "Ce QR code est invalide, l'événement n'a pas encore commencé, ou l'inscription a été annulée.",
      })
    }

    return response.ok({
      success: true,
      message: 'Présence confirmée avec succès',
      data: {
        registration: {
          id: registration.id,
          status: registration.status,
          attendedAt: registration.attendedAt?.toISO(),
        },
        user: {
          id: registration.user.id,
          firstName: registration.user.firstName,
          lastName: registration.user.lastName,
        },
        event: {
          id: registration.event.id,
          name: registration.event.name,
        },
      },
    })
  }

  /**
   * Annule une inscription (admin)
   */
  async cancel({ params, response }: HttpContext) {
    const registration = await Registration.query().where('id', params.id).preload('event').first()

    if (!registration) {
      return response.notFound({
        error: 'Inscription non trouvée',
        message: "Cette inscription n'existe pas.",
      })
    }

    if (registration.status === 'canceled') {
      return response.badRequest({
        error: 'Déjà annulée',
        message: 'Cette inscription est déjà annulée.',
      })
    }

    if (registration.status === 'attended') {
      return response.badRequest({
        error: 'Annulation impossible',
        message: "Impossible d'annuler une inscription après participation.",
      })
    }

    try {
      registration.status = 'canceled'
      await registration.save()

      // Remettre une place disponible
      registration.event.registeredCount = Math.max(0, registration.event.registeredCount - 1)
      await registration.event.save()

      return response.ok({
        success: true,
        message: 'Inscription annulée avec succès',
      })
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: "Une erreur est survenue lors de l'annulation.",
      })
    }
  }

  /**
   * Statistiques des inscriptions
   */
  async stats({ response }: HttpContext) {
    const totalResult = await Registration.query().count('* as total').first()
    const confirmedResult = await Registration.query()
      .where('status', 'confirmed')
      .count('* as total')
      .first()
    const attendedResult = await Registration.query()
      .where('status', 'attended')
      .count('* as total')
      .first()
    const canceledResult = await Registration.query()
      .where('status', 'canceled')
      .count('* as total')
      .first()

    // Inscriptions récentes (7 derniers jours)
    const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toSQL()
    const recentResult = await Registration.query()
      .where('created_at', '>', sevenDaysAgo)
      .count('* as total')
      .first()

    return response.ok({
      success: true,
      data: {
        total: Number(totalResult?.$extras.total ?? 0),
        confirmed: Number(confirmedResult?.$extras.total ?? 0),
        attended: Number(attendedResult?.$extras.total ?? 0),
        canceled: Number(canceledResult?.$extras.total ?? 0),
        recent: Number(recentResult?.$extras.total ?? 0),
      },
    })
  }
}
