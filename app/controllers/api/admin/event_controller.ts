import type { HttpContext } from '@adonisjs/core/http'
import Event from '#models/event'
import db from '@adonisjs/lucid/services/db'
import { createEventValidator } from '#validators/create_event'
import { DateTime } from 'luxon'

export default class EventController {
  /**
   * Liste tous les événements avec statistiques
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const search = request.input('search')
    const category = request.input('category')
    const status = request.input('status') // 'upcoming', 'ongoing', 'finished', 'all'

    let query = Event.query()

    // Recherche
    if (search) {
      query = query.where((q) => {
        q.whereLike('name', `%${search}%`).orWhereLike('description', `%${search}%`)
      })
    }

    // Filtrer par catégorie
    if (category) {
      query = query.where('category', category)
    }

    // Filtrer par statut
    if (status && status !== 'all') {
      const now = DateTime.now()
      if (status === 'upcoming') {
        query = query.where('start_date', '>', now.toSQL())
      } else if (status === 'ongoing') {
        query = query.where('start_date', '<=', now.toSQL()).where('end_date', '>=', now.toSQL())
      } else if (status === 'finished') {
        query = query.where('end_date', '<', now.toSQL())
      }
    }

    const events = await query
      .withCount('registrations', (q) => {
        q.whereIn('status', ['confirmed', 'attended'])
      })
      .orderBy('start_date', 'desc')
      .paginate(page, limit)

    return response.ok({
      success: true,
      data: events.all().map((event) => ({
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location,
        startDate: event.startDate.toISO(),
        endDate: event.endDate.toISO(),
        capacity: event.capacity,
        availableSeats: event.availableSeats,
        registrationsCount: event.$extras.registrations_count || 0,
        imageUrl: event.imageUrl,
        category: event.category,
        isActive: event.isActive,
        isFeatured: event.isFeatured,
        isUpcoming: event.isUpcoming(),
        isOngoing: event.isOngoing(),
        isFinished: event.isFinished(),
        createdAt: event.createdAt.toISO(),
      })),
      meta: events.getMeta(),
    })
  }

  /**
   * Affiche les détails d'un événement avec toutes les inscriptions
   */
  async show({ params, response }: HttpContext) {
    const event = await Event.query()
      .where('id', params.id)
      .preload('registrations', (q) => {
        q.preload('user').orderBy('created_at', 'desc')
      })
      .first()

    if (!event) {
      return response.notFound({
        error: 'Événement non trouvé',
        message: "Cet événement n'existe pas.",
      })
    }

    // Statistiques des inscriptions
    const stats = {
      total: event.registrations.length,
      confirmed: event.registrations.filter((r) => r.status === 'confirmed').length,
      attended: event.registrations.filter((r) => r.status === 'attended').length,
      canceled: event.registrations.filter((r) => r.status === 'canceled').length,
    }

    return response.ok({
      success: true,
      data: {
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location,
        startDate: event.startDate.toISO(),
        endDate: event.endDate.toISO(),
        capacity: event.capacity,
        availableSeats: event.availableSeats,
        imageUrl: event.imageUrl,
        category: event.category,
        isActive: event.isActive,
        isFeatured: event.isFeatured,
        isUpcoming: event.isUpcoming(),
        isOngoing: event.isOngoing(),
        isFinished: event.isFinished(),
        createdAt: event.createdAt.toISO(),
        stats,
        registrations: event.registrations.map((reg) => ({
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
          },
        })),
      },
    })
  }

  /**
   * Créer un nouvel événement
   */
  async store({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(createEventValidator)

      const event = await Event.create({
        name: data.name,
        description: data.description,
        location: data.location,
        province: data.province,
        commune: data.commune,
        startDate: DateTime.fromJSDate(data.startDate),
        endDate: DateTime.fromJSDate(data.endDate),
        capacity: data.capacity,
        registeredCount: 0,
        minAge: data.minAge || 13,
        maxAge: data.maxAge,
        basePrice: data.basePrice || 0,
        youthPrice: data.youthPrice,
        seniorPrice: data.seniorPrice,
        category: data.category,
        tags: data.tags || [],
        status: 'draft',
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        requiresApproval: data.requiresApproval || false,
        registrationStartDate: data.registrationStartDate ? DateTime.fromJSDate(data.registrationStartDate) : undefined,
        registrationEndDate: data.registrationEndDate ? DateTime.fromJSDate(data.registrationEndDate) : undefined,
        imageUrl: null,
      })

      return response.created({
        success: true,
        message: 'Événement créé avec succès',
        data: {
          id: event.id,
          name: event.name,
        },
      })
    } catch (error) {
      console.error('Erreur création événement:', error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la création.',
      })
    }
  }

  /**
   * Mettre à jour un événement
   */
  async update({ params, request, response }: HttpContext) {
    const event = await Event.find(params.id)

    if (!event) {
      return response.notFound({
        error: 'Événement non trouvé',
        message: "Cet événement n'existe pas.",
      })
    }

    try {
      const data = request.only([
        'name',
        'description',
        'location',
        'startDate',
        'endDate',
        'capacity',
        'imageUrl',
        'category',
        'isActive',
        'isFeatured',
      ])

      event.merge(data)
      await event.save()

      return response.ok({
        success: true,
        message: 'Événement mis à jour avec succès',
        data: {
          id: event.id,
          name: event.name,
        },
      })
    } catch (error) {
      console.error('Erreur mise à jour événement:', error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la mise à jour.',
      })
    }
  }

  /**
   * Supprimer un événement
   */
  async destroy({ params, response }: HttpContext) {
    const event = await Event.find(params.id)

    if (!event) {
      return response.notFound({
        error: 'Événement non trouvé',
        message: "Cet événement n'existe pas.",
      })
    }

    try {
      // Vérifier s'il y a des inscriptions actives
      const activeRegistrations = await db
        .from('registrations')
        .where('event_id', event.id)
        .whereIn('status', ['confirmed', 'attended'])
        .count('* as total')

      const count = activeRegistrations[0].total

      if (count > 0) {
        return response.badRequest({
          error: 'Suppression impossible',
          message: `Cet événement a ${count} inscription(s) active(s). Veuillez les gérer avant de supprimer l'événement.`,
        })
      }

      await event.delete()

      return response.ok({
        success: true,
        message: 'Événement supprimé avec succès',
      })
    } catch (error) {
      console.error('Erreur suppression événement:', error)
      return response.internalServerError({
        error: 'Erreur serveur',
        message: 'Une erreur est survenue lors de la suppression.',
      })
    }
  }

  /**
   * Obtenir les statistiques globales des événements
   */
  async stats({ response }: HttpContext) {
    const now = DateTime.now()

    const totalEvents = await Event.query().count('* as total').first()
    const upcomingEvents = await Event.query().where('start_date', '>', now.toSQL()).count('* as total').first()
    const ongoingEvents = await Event.query().where('start_date', '<=', now.toSQL()).where('end_date', '>=', now.toSQL()).count('* as total').first()
    const finishedEvents = await Event.query().where('end_date', '<', now.toSQL()).count('* as total').first()

    return response.ok({
      success: true,
      data: {
        total: Number(totalEvents?.$extras.total ?? 0),
        upcoming: Number(upcomingEvents?.$extras.total ?? 0),
        ongoing: Number(ongoingEvents?.$extras.total ?? 0),
        finished: Number(finishedEvents?.$extras.total ?? 0),
      },
    })
  }
}