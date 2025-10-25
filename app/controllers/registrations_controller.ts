// app/controllers/api/admin/registrations_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import Registration from '#models/registration'
import db from '@adonisjs/lucid/services/db'
import QRService from '#services/qr_code_service'
import EmailService from '#services/email_service'
import { DateTime } from 'luxon'
import typesenseClient, { isTypesenseReady, Collections } from '#services/typesense_service'
import type { RegistrationDocument } from '#services/typesense_service'

export default class RegistrationController {
  /**
   * Liste toutes les inscriptions avec filtres et recherche
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const status = request.input('status', '').trim()
    const eventId = request.input('event_id')
    const search = request.input('search', '').trim()

    // Check if Typesense is available
    const typesenseReady = await isTypesenseReady(Collections.REGISTRATIONS)

    if (!typesenseReady) {
      // Fallback to database query
      return this.fallbackDatabaseQuery(page, limit, status, eventId, search, response)
    }

    try {
      // Build Typesense filter
      const filters: string[] = []

      if (status) {
        filters.push(`status:=${status}`)
      }
      if (eventId) {
        filters.push(`event_id:=${eventId}`)
      }

      const searchParams: any = {
        q: search || '*',
        query_by: 'user_name,user_email,event_name,qr_code',
        sort_by: 'created_at:desc',
        page,
        per_page: limit,
      }

      if (filters.length > 0) {
        searchParams.filter_by = filters.join(' && ')
      }

      // Execute Typesense search
      const searchResults = await typesenseClient
        .collections<RegistrationDocument>(Collections.REGISTRATIONS)
        .documents()
        .search(searchParams)

      const hits = searchResults.hits || []
      const found = searchResults.found || 0
      const lastPage = Math.ceil(found / limit)

      // Extract registration IDs & retrieve from DB with relations
      const registrationIds = hits.map((hit) => Number(hit.document.id))
      const dbRegistrations = registrationIds.length
        ? await Registration.query().whereIn('id', registrationIds).preload('user').preload('event')
        : []

      // Preserve order as in Typesense
      const registrationMap = new Map(dbRegistrations.map((r) => [r.id, r]))
      const orderedRegistrations = hits
        .map((hit) => registrationMap.get(Number(hit.document.id))!)
        .filter(Boolean)

      return response.ok({
        success: true,
        data: orderedRegistrations.map((reg) => ({
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
        meta: {
          current_page: page,
          last_page: lastPage,
          total: found,
          per_page: limit,
        },
      })
    } catch (error) {
      console.error('[Typesense] Registration search error:', error.message)
      // Fallback to database on error
      return this.fallbackDatabaseQuery(page, limit, status, eventId, search, response)
    }
  }

  /**
   * Fallback database query
   */
  private async fallbackDatabaseQuery(
    page: number,
    limit: number,
    status: string,
    eventId: any,
    search: string,
    response: any
  ) {
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
  async show({ auth, params, inertia, response, session }: HttpContext) {
    const user = auth.user!

    const registration = await Registration.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('event')
      .first()

    if (!registration) {
      session.flash('error', "Cette inscription n'existe pas.")
      return response.redirect('/registrations')
    }

    // Générer le QR code en base64 pour l'affichage
    const qrCodeDataUrl = await QRService.generateQRCode(registration)

    return inertia.render('registrations/show', {
      registration: {
        id: registration.id,
        status: registration.status,
        qrCode: registration.qrCode,
        qrCodeImage: qrCodeDataUrl,
        attendedAt: registration.attendedAt?.toISO(),
        createdAt: registration.createdAt.toISO(),
        event: {
          id: registration.event.id,
          name: registration.event.name,
          description: registration.event.description,
          location: registration.event.location,
          province: registration.event.province,
          commune: registration.event.commune,
          startDate: registration.event.startDate.toISO(),
          endDate: registration.event.endDate.toISO(),
          imageUrl: registration.event.imageUrl,
          category: registration.event.category,
          status: registration.event.status,
        },
      },
    })
  }

  /**
   * Inscription à un événement
   */
  async store({ auth, params, response, session }: HttpContext) {
    const user = auth.user!
    const eventId = params.eventId

    const trx = await db.transaction()

    try {
      // Récupérer l'événement avec un verrou
      const event = await Event.query({ client: trx }).where('id', eventId).forUpdate().first()

      if (!event) {
        await trx.rollback()
        session.flash('error', "Cet événement n'existe pas.")
        return response.redirect('/events')
      }

      // Vérifier l'éligibilité de l'âge
      if (!event.isAgeEligible(user.age)) {
        await trx.rollback()
        if (event.maxAge && user.age > event.maxAge) {
          session.flash(
            'error',
            `Cet événement est réservé aux personnes de ${event.minAge} à ${event.maxAge} ans.`
          )
        } else {
          session.flash(
            'error',
            `Cet événement est réservé aux personnes de ${event.minAge} ans et plus.`
          )
        }
        return response.redirect(`/events/${eventId}`)
      }

      // Vérifier si l'événement accepte les inscriptions
      if (!event.canRegister()) {
        await trx.rollback()

        if (event.status !== 'published') {
          session.flash('error', "Cet événement n'est pas publié.")
        } else if (event.isFull) {
          session.flash('error', "Désolé, il n'y a plus de places disponibles.")
        } else if (event.isFinished()) {
          session.flash('error', 'Cet événement est terminé.')
        } else if (event.registrationStartDate && DateTime.now() < event.registrationStartDate) {
          session.flash('error', "Les inscriptions n'ont pas encore commencé.")
        } else if (event.registrationEndDate && DateTime.now() > event.registrationEndDate) {
          session.flash('error', "La période d'inscription est terminée.")
        } else {
          session.flash('error', 'Les inscriptions ne sont pas ouvertes.')
        }

        return response.redirect(`/events/${eventId}`)
      }

      // Vérifier si l'utilisateur est déjà inscrit
      const existingRegistration = await Registration.query({ client: trx })
        .where('user_id', user.id)
        .where('event_id', eventId)
        .whereIn('status', ['pending', 'confirmed', 'attended'])
        .first()

      if (existingRegistration) {
        await trx.rollback()
        session.flash('info', 'Vous êtes déjà inscrit à cet événement.')
        return response.redirect(`/events/${eventId}`)
      }

      // Calculer le prix selon l'âge
      const price = event.getPriceForAge(user.age)

      // Créer l'inscription
      const registration = await Registration.create(
        {
          userId: user.id,
          eventId: event.id,
          status: event.requiresApproval ? 'pending' : 'confirmed',
          qrCode: '', // Sera généré par QRService
          price: price,
        },
        { client: trx }
      )

      // Incrémenter le compteur d'inscrits
      event.registeredCount += 1
      await event.save()

      await trx.commit()

      // Envoyer l'email de confirmation avec le QR code
      try {
        await registration.load('event')
        await EmailService.sendEventRegistrationEmail(user, registration.event, registration)
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error)
      }

      if (event.requiresApproval) {
        session.flash(
          'info',
          `Votre demande d'inscription a été envoyée. Elle sera validée prochainement.`
        )
      } else {
        session.flash('success', `Inscription confirmée ! Vous avez reçu votre QR code par email.`)
      }

      return response.redirect(`/registrations/${registration.id}`)
    } catch (error) {
      await trx.rollback()
      console.error("Erreur lors de l'inscription:", error)
      session.flash('error', "Une erreur est survenue lors de l'inscription.")
      return response.redirect(`/events/${eventId}`)
    }
  }

  /**
   * Annule une inscription
   */
  async destroy({ auth, params, response, session }: HttpContext) {
    const user = auth.user!

    const registration = await Registration.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('event')
      .first()

    if (!registration) {
      session.flash('error', "Cette inscription n'existe pas.")
      return response.redirect('/registrations')
    }

    if (registration.status === 'canceled') {
      session.flash('info', 'Cette inscription est déjà annulée.')
      return response.redirect('/registrations')
    }

    if (registration.status === 'attended') {
      session.flash('error', "Vous ne pouvez pas annuler après avoir assisté à l'événement.")
      return response.redirect('/registrations')
    }

    if (registration.event.isOngoing() || registration.event.isFinished()) {
      session.flash(
        'error',
        "Vous ne pouvez pas annuler car l'événement a déjà commencé ou est terminé."
      )
      return response.redirect('/registrations')
    }

    const trx = await db.transaction()

    try {
      registration.status = 'canceled'
      await registration.useTransaction(trx).save()

      // Décrémenter le compteur
      const event = await Event.findOrFail(registration.eventId, { client: trx })
      event.registeredCount = Math.max(0, event.registeredCount - 1)
      await event.save()

      await trx.commit()

      session.flash('success', 'Votre inscription a été annulée avec succès.')
      return response.redirect('/registrations')
    } catch (error) {
      await trx.rollback()
      console.error("Erreur lors de l'annulation:", error)
      session.flash('error', 'Une erreur est survenue.')
      return response.redirect('/registrations')
    }
  }

  /**
   * Renvoie l'email avec le QR code
   */
  async resendQRCode({ auth, params, response, session }: HttpContext) {
    const user = auth.user!

    const registration = await Registration.query()
      .where('id', params.id)
      .where('user_id', user.id)
      .preload('event')
      .first()

    if (!registration) {
      session.flash('error', "Cette inscription n'existe pas.")
      return response.redirect('/registrations')
    }

    if (!registration.isActive) {
      session.flash('error', 'Vous ne pouvez pas renvoyer le QR code pour cette inscription.')
      return response.redirect('/registrations')
    }

    try {
      await EmailService.sendEventRegistrationEmail(user, registration.event, registration)

      session.flash('success', 'Le QR code a été renvoyé par email.')
      return response.redirect().back()
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      session.flash('error', 'Une erreur est survenue.')
      return response.redirect().back()
    }
  }
}
